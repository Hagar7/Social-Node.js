import { nanoid } from "nanoid";
import userModel from "../../../DB/models/user.model.js";
import { sendEmail } from "../../services/sendEmail.js";
import { decodeToken, generateToken } from "../../utils/tokenFun.js";
import bcript from "bcryptjs";
import cloudinary from "../../utils/cloudinary.js";

export const signup = async (req, res, next) => {
  const { firstName, email, password } = req.body;

  const userExist = await userModel.findOne({ email });
  if (userExist) {
    next(new Error("Email already exists", { cause: 409 }));
  } else {
    const hashedpassword = bcript.hashSync(password, +process.env.SALT_ROUNDS);
    const newUser = new userModel({
      firstName,
      email,
      password: hashedpassword,
    });
    const token = generateToken({
      payload: {
        newUser,
      },
    });
    if (!token) {
      return next(new Error("Token Generation Fail", { cause: 400 }));
    }
    const confirmationLink = `${req.protocol}://${req.headers.host}/user/confirmationEmail/${token}`;
    const sentEmail = await sendEmail({
      to: newUser.email,
      subject: "confirmation email",
      message: `<a href=${confirmationLink}>Confirm</a>`,
    });
    if (sentEmail) {
      res.status(201).json({ message: "Done, please Confirm email" });
    } else {
      next(Error("user saved failed", { cause: 500 }));
    }
  }
};

export const confirmEmail = async (req, res, next) => {
  const { token } = req.params;
  const decode = decodeToken({ payload: token });
  if (!decode?.newUser) {
    return next(Error("please confirm your account"));
  } else {
    decode.newUser.isConfirmed = true;
    const confirmUser = new userModel({ ...decode.newUser });
    await confirmUser.save();
    res.status(200).json({ message: "Done" });
  }
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  const findUser = await userModel.findOne({ email, isConfirmed: true });
  if (findUser) {
    if (!findUser.isLoggedIn) {
      const passMatch = bcript.compareSync(password, findUser.password);
      if (passMatch) {
        const token = generateToken({
          payload: {
            _id: findUser._id,
            email: findUser.email,
            name: findUser.name,
            isLoggedIn: true,
          },
        });
        const logUser = await userModel.findOneAndUpdate(
          { _id: findUser._id },
          { isLoggedIn: true }
        );
        if (logUser) {
          res.json({ message: "login success", token });
        } else {
          next(Error("log in again", { cause: 500 }));
        }
      } else {
        next(Error("Invalid password", { cause: 406 }));
      }
    } else {
      next(Error("you already logged in", { cause: 401 }));
    }
  } else {
    next(newError("user email not found please sign up", { cause: 400 }));
  }
};

export const forgetPass = async (req, res, next) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });
  if (user) {
    const generatecode = nanoid(6);
    const userCode = await userModel.updateOne(
      { email },
      { code: generatecode }
    );
    const emailSend = await sendEmail({
      to: user.email,
      subject: "change password",
      message: `<p>${generatecode}</p>`,
    });
    res.json({ message: "email send success" });
  } else {
    next(Error("no email found"));
  }
};

export const changepassCode = async (req, res, next) => {
  const { code, email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (user) {
    if (user?.code == code) {
      const hashedpassword = bcript.hashSync(
        password,
        +process.env.SALT_ROUNDS
      );
      const changepass = await userModel.updateOne(
        { email },
        { password: hashedpassword }
      );
      res.json({ message: "password change successfuly", changepass });
    } else {
      next(Error("code is not valid"), { cause: 500 });
    }
  } else {
    next(Error("email is not valid"), { cause: 500 });
  }
};

export const addProfilePic = async (req, res, next) => {
  const { _id, firstName } = req.user;
  if (!req.file) {
    next(Error("please upload a profile pic"), { cause: 400 });
  }
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `profile/${firstName}`,
    }
  );
  const user = await userModel.findByIdAndUpdate(_id, {
    profilePic: secure_url,
    publicId: public_id,
  });
  if (!user) {
    next(Error("please login"), { cause: 400 });
  }
  const oldpic = await cloudinary.uploader.destroy(user.publicId);
  res.status(200).json({ message: "profile picture updated successfully" });
};

export const chnageUserPass = async (req, res, next) => {
  const { _id } = req.user;
  const { password, newpass } = req.body;
  const user = await userModel.findOne({ _id });
  const passMatch = bcript.compareSync(password, user.password);
  if (passMatch) {
    const hashedpassword = bcript.hashSync(newpass, +process.env.SALT_ROUNDS);
    const updatepass = await userModel.updateOne(
      { _id },
      { password: hashedpassword }
    );
    res.json({ message: "password change successful" });
  } else {
    next(Error("old password wrong"));
  }
};

export const logOut = async (req, res, next) => {
  const { isLoggedIn, email } = req.user;
  if (isLoggedIn) {
    const logUser = await userModel.updateOne({ email }, { isLoggedIn: false });
    res.json({ message: "user logout succfully" });
  } else {
    next(Error("please login first"), { cause: 400 });
  }
};

export const coverPic = async (req, res, next) => {
  const { _id, firstName } = req.user;
  if (!req.files.length) {
    return next(Error("please upload your picture", { cause: 400 }));
  }
  let images = [];
  let publicId = [];
  for (const file of req.files) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      {
        folder: `covers/${firstName}`,
      }
    );
    images.push(secure_url), publicId.push(public_id);
  }

  const user = await userModel.findByIdAndUpdate(_id, {
    covers: images,
    coversId: publicId,
  });
  if (!user) {
    return next(Error("please login first", { cause: 400 }));
  }
  const date = await cloudinary.api.delete_resources(user.coversId);

  res.json({ message: "Done" });
};

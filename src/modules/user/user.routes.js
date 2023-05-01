import { Router } from "express";
import { asyncHandler } from "../../utils/errorHandling.js";
import * as userController from "./user.controlller.js";
import { validation } from "../../middlewares/validation.js";
import * as validationSchema from "./user.validation.js";
import { auth } from "../../middlewares/Auth.js";
import { myMulter } from "../../services/mymulter.js";

const router = Router();

router.post(
  "/signup",
  validation(validationSchema.signUpSchema),
  asyncHandler(userController.signup)
);
router.get(
  "/confirmationEmail/:token",
  validation(validationSchema.confirmEmailSchema),
  asyncHandler(userController.confirmEmail)
);
router.post(
  "/login",
  validation(validationSchema.loginSchema),
  asyncHandler(userController.signIn)
);
router.post(
  "/forgetpasss",
  validation(validationSchema.forgetSchema),
  asyncHandler(userController.forgetPass)
);
router.put(
  "/changepass",
  validation(validationSchema.chnagepassSchema),
  asyncHandler(userController.changepassCode)
);
router.get("/logout", auth(), asyncHandler(userController.logOut));
router.patch(
  "/profilePic",
  auth(),
  // validation(validationSchema.profileChema),
  myMulter({}).single("image"),
  asyncHandler(userController.addProfilePic)
);
router.put(
  "/changeUserPass",
  auth(),
  validation(validationSchema.changeUserPassSchema),
  asyncHandler(userController.chnageUserPass)
);
router.patch(
  "/cover",
  auth(),
  myMulter({}).array("pic"),
  asyncHandler(userController.coverPic)
);

export default router;

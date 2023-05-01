import commentModel from "../../../DB/models/comment.model.js";
import postModel from "../../../DB/models/post.model.js";

export const addPost = async (req, res, next) => {
  const { _id } = req.user;
  const { title, desc } = req.body;

  const post = new postModel({
    title,
    desc,
    createdBy: _id,
  });
  const savedPost = await post.save();
  if (savedPost) {
    res.status(201).json({ message: "post saved successfully", savedPost });
  } else {
    next(Error("Post saved failed"), { cause: 400 });
  }
};

export const getAllPostsWithComments = async (req, res, next) => {
  const posts = await postModel.find({}).populate([
    {
      path: "comments",
      populate: [
        {
          path: "commentedBy",
          select: "firstName -_id",
        },
      ],
    },
  ]);
  res.status(201).json({ message: "Done", posts });
};

export const getUserPost = async (req, res, next) => {
  const { _id } = req.user;
  const userPost = await postModel.find({ createdBy: _id }).populate([
    {
      path: "comments",
      select: "comment",
      populate: [
        {
          path: "commentedBy",
          select: "firstName -_id",
        },
      ],
    },
  ]);
  if (userPost.length) {
    res.status(201).json({ message: "Done", userPost });
  } else {
    res.status(201).json({ message: "there is no post for this user" });
  }
};

export const deletePost = async (req, res, next) => {
  const { _id } = req.user;
  const { postId } = req.params;
  const findPost = await postModel.findById(postId);
  if (findPost) {
    const deletepost = await postModel.deleteOne({
      _id: postId,
      createdBy: _id,
    });
    if (deletepost.deletedCount) {
      res.status(201).json({ message: "Done", deletepost });
    } else {
      next(Error("Not authorized"), { cause: 400 });
    }
  } else {
    next(Error("No Post found"), { cause: 400 });
  }
};

export const updatePost = async (req, res, next) => {
  const { _id } = req.user;
  const { title, desc } = req.body;
  const { postId } = req.params;
  const findPost = await postModel.findById(postId);
  if (findPost) {
    const updatePost = await postModel.updateOne(
      { _id: postId, createdBy: _id },
      { title, desc }
    );
    if (updatePost.modifiedCount) {
      res.status(201).json({ message: "Done", updatePost });
    } else {
      next(Error("Not authorized"), { cause: 400 });
    }
  } else {
    next(Error("No Post found"), { cause: 400 });
  }
};

export const likePost = async (req, res, next) => {
  const { postId } = req.params;
  const { _id } = req.user;
  const post = await postModel.findOneAndUpdate(
    { _id: postId },
    {
      $addToSet: {
        likes: _id,
      },
    }
  );
  if (post) {
    res.status(201).json({ message: "Done" });
  } else {
    next(Error("like not added"), { cause: 400 });
  }
};

export const unlikePost = async (req, res, next) => {
  const { postId } = req.params;
  const { _id } = req.user;
  const post = await postModel.findOneAndUpdate(
    { _id: postId, createdBy: _id },
    {
      $pull: {
        likes: _id,
      },
    }
  );
  if (post) {
    res.status(201).json({ message: "Done" });
  } else {
    next(Error("Not authorized"), { cause: 400 });
  }
};

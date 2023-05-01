import commentModel from "../../../DB/models/comment.model.js";
import postModel from "../../../DB/models/post.model.js";

export const addComment = async (req, res, next) => {
  const { postId, comment } = req.body;
  const { _id } = req.user;

  const findPost = await postModel.findOne({ _id: postId });
  if (findPost) {
    const newComment = new commentModel({
      comment,
      commentedBy: _id,
      postId,
    });
    const savedComment = await newComment.save();
    if (savedComment) {
      const check = await postModel.updateOne(
        { _id: postId },
        {
          $push: {
            comments: newComment._id,
          },
        }
      );
      if (!check.modifiedCount) {
        next(Error("comment not saved in array"), { cause: 400 });
      } else {
        res
          .status(201)
          .json({ message: "comment saved successfully", savedComment });
      }
    } else {
      next(Error("comment saved failled"), { cause: 400 });
    }
  } else {
    next(Error("no post found"), { cause: 400 });
  }
};

export const deleteComment = async (req, res, next) => {
  const { _id } = req.user;
  const { commentId } = req.params;
  const deletedComment = await commentModel.findOneAndDelete({
    _id: commentId,
    commentedBy: _id,
  });
  if (deletedComment) {
    const check = await postModel.updateOne(
      { _id: deletedComment.postId },
      {
        $pull: {
          comments: deletedComment._id,
        },
      }
    );
    if (!check.modifiedCount) {
      next(Error("comment not deleted in array"), { cause: 400 });
    } else {
      res
        .status(201)
        .json({ message: "comment delted successfully", deletedComment });
    }
  } else {
    next(Error("delete failed"), { cause: 400 });
  }
};

export const updateComment = async (req, res, next) => {
  const { _id } = req.user;
  const { commentId } = req.params;
  const { postId, comment } = req.body;

  const findComment = await commentModel.findById(commentId);
  if (findComment) {
    const updatePost = await commentModel.updateOne(
      { _id: commentId, commentedBy: _id },
      { postId, comment }
    );
    if (updatePost.modifiedCount) {
      res.status(201).json({ message: "Done", updatePost });
    } else {
      next(Error("Not authorized"), { cause: 400 });
    }
  } else {
    next(Error("No comment found"), { cause: 400 });
  }
};

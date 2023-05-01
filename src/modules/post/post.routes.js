import { Router } from "express";
import { auth } from "../../middlewares/Auth.js";
import * as postController from "./post.controlller.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { validation } from "../../middlewares/validation.js";
import * as validationSchema from "./post.validation.js";

const router = Router();

router.post(
  "/addPost",
  auth(),
  validation(validationSchema.addSchema),
  asyncHandler(postController.addPost)
);
router.get("/", asyncHandler(postController.getAllPostsWithComments));
router.get("/userPost", auth(), asyncHandler(postController.getUserPost));
router.delete(
  "/:postId",
  auth(),
  validation(validationSchema.deleteSchema),
  asyncHandler(postController.deletePost)
);
router.put(
  "/:postId",
  auth(),
  validation(validationSchema.updateSchema),
  asyncHandler(postController.updatePost)
);
router.put(
  "/addLike/:postId",
  auth(),
  validation(validationSchema.likeSchema),
  asyncHandler(postController.likePost)
);
router.put(
  "/removeLike/:postId",
  auth(),
  validation(validationSchema.unlikeSchema),
  asyncHandler(postController.unlikePost)
);

export default router;

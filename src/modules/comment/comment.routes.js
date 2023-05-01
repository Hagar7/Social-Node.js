import { Router } from "express";
import { auth } from "../../middlewares/Auth.js";
import * as commentController from "./comment.controlller.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import * as validationSchema from "./comment.validation.js";
import { validation } from "../../middlewares/validation.js";

const router = Router();

router.post(
  "/add",
  auth(),
  validation(validationSchema.addSchema),
  asyncHandler(commentController.addComment)
);
router.delete(
  "/:commentId",
  auth(),
  validation(validationSchema.deleteSchema),
  asyncHandler(commentController.deleteComment)
);

router.put(
  "/:commentId",
  auth(),
  validation(validationSchema.updateSchema),
  asyncHandler(commentController.updateComment)
);

export default router;

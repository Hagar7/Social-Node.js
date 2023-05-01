import Joi from "joi";

export const addSchema = {
  body: Joi.object().required().keys({
    title: Joi.string().required(),
    desc: Joi.string().required(),
  }),
};

export const deleteSchema = {
  params: Joi.object()
    .required()
    .keys({
      postId: Joi.string().required().min(24).max(24),
    }),
};

export const updateSchema = {
  body: Joi.object().required().keys({
    title: Joi.string().required(),
    desc: Joi.string().required(),
  }),
  params: Joi.object()
    .required()
    .keys({
      postId: Joi.string().required().min(24).max(24),
    }),
};

export const likeSchema = {
  params: Joi.object()
    .required()
    .keys({
      postId: Joi.string().required().min(24).max(24),
    }),
};

export const unlikeSchema = {
  params: Joi.object()
    .required()
    .keys({
      postId: Joi.string().required().min(24).max(24),
    }),
};

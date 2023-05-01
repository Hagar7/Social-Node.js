import Joi from "joi";





export const addSchema ={
    body: Joi.object().required().keys({
        postId:Joi.string().required(),
        comment:Joi.string().required()
    })
}


export const deleteSchema ={
    params: Joi.object().required().keys({
        commentId:Joi.string().required().min(24).max(24),
    })
}

export const updateSchema ={
    body: Joi.object().required().keys({
        comment:Joi.string().required(),
        postId:Joi.string().required().min(24).max(24),
    }),
    params: Joi.object().required().keys({
        commentId:Joi.string().required().min(24).max(24),
    })
}
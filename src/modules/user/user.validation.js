import Joi from "joi";



export const signUpSchema ={
    body: Joi.object().required().keys({
        firstName: Joi.string().required().min(4).max(8),
        email: Joi.string().email().required(),
        password: Joi.string().required()
    })
}


export const confirmEmailSchema ={
    params: Joi.object().required().keys({
        token: Joi.string().required()

    })
}


export const loginSchema ={
    body: Joi.object().required().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    })
}

export const forgetSchema ={
    body: Joi.object().required().keys({
        email: Joi.string().email().required(),
    })
}

export const chnagepassSchema ={
    body: Joi.object().required().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        code: Joi.string().required()
    })
}



export const changeUserPassSchema = {
    body: Joi.object().required().keys({
      password: Joi.string().required()
      .messages({
        "string.pattern.base": "password must contains number and symbols",
      }),
      newpass: Joi.string().required()
      .messages({
        "string.pattern.base": "password must contains number and symbols",
      }),
  })
  }


export const profileChema = {
    file: Joi.object().required().keys({
        profilePic: Joi.string()
  })
  }
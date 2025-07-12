import Joi from "joi";

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
  }),
};

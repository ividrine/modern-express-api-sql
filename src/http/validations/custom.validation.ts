import Joi from "joi";

const password: Joi.CustomValidator = (value, helpers) => {
  if (value.length < 8) {
    return helpers.error("password must be at least 8 characters");
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.error(
      "password must contain at least 1 letter and 1 number"
    );
  }
  return value;
};

export { password };

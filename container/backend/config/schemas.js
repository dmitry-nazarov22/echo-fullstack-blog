const Joi = require("joi");

const idSchema = Joi.number().integer().min(0).required();

const userSchema = Joi.object({
  username: Joi.string()
    .pattern(/^[a-zA-Z0-9.-]+$/)
    .min(4)
    .max(20)
    .required(),
  password: Joi.string()
    .min(8)
    .max(30)
    .pattern(/[a-z]/)
    .pattern(/[A-Z]/)
    .pattern(/[0-9]/)
    .required(),
});

const commentSchema = Joi.object({
  post_id: Joi.number().integer().min(0).required(),
  body: Joi.string().min(1).max(500).required(),
});

const bodySchema = Joi.string().min(1).required();

const validateId = (id) => {
  return idSchema.validate(id);
};

const validateUser = (user) => {
  return userSchema.validate(user);
};

const validateComment = (comment) => {
  return commentSchema.validate(comment);
};

const validateBody = (body) => {
  return bodySchema.validate(body);
};

module.exports = {
  idSchema,
  userSchema,
  commentSchema,
  bodySchema,
  validateId,
  validateUser,
  validateComment,
  validateBody,
};

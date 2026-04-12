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

/**
 * Validation function, to check for user input.
 *
 * @param {int} id id for validation.
 * @returns Object which contains error and value.
 */
const validateId = (id) => {
  return idSchema.validate(id);
};
/**
 * Validation function, to check for user input.
 *
 * @param {Object} user Object containing user data.
 * @returns Object which contains error and value.
 */
const validateUser = (user) => {
  return userSchema.validate(user);
};
/**
 * Validation function to check for user input.
 *
 * @param {Object} comment Object containing comment data.
 * @returns Object which contains error and value.
 */
const validateComment = (comment) => {
  return commentSchema.validate(comment);
};
/**
 * Validation function to check user input.
 *
 * @param {String} body Text to be displayed in the post or comment.
 * @returns Objedct which contains error and value.
 */
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

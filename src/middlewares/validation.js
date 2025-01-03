import { Types } from "mongoose"
import joi from 'joi'
const validationIdSchema = (value, helper) => {
  return Types.ObjectId.isValid(value) ? true : helper.message('invalid id')
}
export const generalFields = {
  _id: joi.string().custom(validationIdSchema),
}
const reqMethods = ['body', 'query', 'params', 'headers', 'file', 'files']
export const validationCoreFunction = (schema) => {
  return (req, res, next) => {
    let validationMessage = ''
    for (const key of reqMethods) {
      if (schema[key]) {
        const validationResult = schema[key].validate(req[key], {
        })
        if (validationResult.error) {
          validationMessage = validationResult.error.details[0].message;
        }
      }
    }
    if (validationMessage) {
      req.validationMessage = validationMessage;
      return next(new Error('', { cause: 400 }))
    }
    next()
  }
}
const reqMethods = ['body', 'query', 'params', 'headers', 'file', 'files']
export const validationCoreFunction = (schema) => {
  return (req, res, next) => {
    const lang = req.params.lang || 'en'; // Default to English if no lang is provided

    let validationMessage = '';
    const preferences = { lang };

    for (const key of reqMethods) {
      if (schema[key]) {
        const validationResult = schema[key].validate(req[key], {
          state: { preferences },
          // abortEarly: false, 
        })
        // if (validationResult.error) {
        //   validationErrorArr.push(validationResult.error.details[0].message)
        // }
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
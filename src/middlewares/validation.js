export const validation = (schema) => {
    return (req, res, next) => {
      const requestKeys = ["body", "params", "query", "headers", "files", "file"];
      let errorList = [];
      for (const key of requestKeys) {
        if (schema[key]) {
          const validationResult = schema[key].validate(req[key], {
            abortEarly: false,
          });
          if (validationResult?.error?.details) {
            errorList.push(validationResult);
          }
        }
      }
      if (errorList.length) {
        return res.json({ message: "validation error", error: errorList });
      }
      return next();
    };
  };
  
const jwt = require("jsonwebtoken");

const SECRET = "foo";

function AuthMiddleware(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    res.status(400);
    return res.send({
      status: 'error',
      payload: {
        message: 'token not set'
      }
    })
  }

  const token = header.replace("Bearer ", "");

  if (token === "") {
    res.status(400);
    return res.send({
      status: 'error',
      payload: {
        message: 'empty token'
      }
    })
  }

  try {
    const obj = jwt.verify(token, SECRET);
    req.user = obj;
    return next();
  } catch (err) {
    res.status(401);
    return res.send({
      status: 'error',
      payload: {
        message: 'Can`t authorize'
      }
    });
  }
}

module.exports = {
  AuthMiddleware
}
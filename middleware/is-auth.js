const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  let authHeader = req.get("Authorization");

  // if (true && !authHeader) {
  //   // tessting
  //   authHeader =
  //     "xxxx " +
  //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZDJkNDJlOGJhOGYxZDFlZWNiNGY2NGYiLCJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwiaWF0IjoxNTYzNDQxNjg4LCJleHAiOjE1NjM0NDUyODh9.2XQhuA5dlmV0qD7rzVf-xMFn8LBLN3_-hPq_mV9twL8";
  // }

  let decodedToken;
  try {
    if (!authHeader) {
      throw new Error("");
    }
    const token = authHeader.split(" ")[1];
    if (!token || token === "") {
      throw new Error("");
    }

    decodedToken = jwt.verify(token, process.env.SECRECT_KEY);
    console.log(decodedToken);
    if (!decodedToken) {
      throw new Error("");
    }
  } catch (error) {
    req.isAuth = false;
    return next();
  }

  req.isAuth = true;
  req.userId = decodedToken.userId;
  next();
};

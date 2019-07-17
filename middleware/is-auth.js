const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
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

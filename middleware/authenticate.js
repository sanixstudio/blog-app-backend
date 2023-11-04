const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET; // Your secret key

const authenticate = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res
      .status(401)
      .send({ message: "No authentication token, access denied." });
  }

  const token = authHeader.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded.user;
    next();
  } catch (e) {
    res.status(401).send({ message: "Please authenticate." });
  }
};

module.exports = authenticate;

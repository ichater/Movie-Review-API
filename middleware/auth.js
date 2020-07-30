const jwt = require("jsonwebtoken");

const secretToken = "placeholderSecretToken";

module.exports = function (req, response, next) {
  //get token from header
  const token = req.header("x-auth-token");

  // Check if not token
  if (!token) {
    return response.status(401).json({ msg: "no token" });
  }
  try {
    const decoded = jwt.verify(token, confit.get("jwtSecret"));
  } catch (err) {}
};

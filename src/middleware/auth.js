/* Middleware for admin user */
const adminAuth = (req, res, next) => {
  const adminToken = "neel";
  if (adminToken === "neel") {
    next();
  } else {
    res.status(401).send("Unauthorized Admin");
  }
};

/* Middleware for normal user */
const userAuth = (req, res, next) => {
  const adminToken = "neel";
  if (adminToken === "neel") {
    next();
  } else {
    res.status(401).send("Unauthorized User");
  }
};

module.exports = { adminAuth, userAuth };

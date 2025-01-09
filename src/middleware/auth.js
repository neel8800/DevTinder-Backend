const adminAuth = (req, res, next) => {
  const adminToken = "neel";
  if (adminToken === "neel") {
    next();
  } else {
    res.status(401).send("Unauthorized Admin");
  }
};

const userAuth = (req, res, next) => {
  const adminToken = "neel";
  if (adminToken === "neel") {
    next();
  } else {
    res.status(401).send("Unauthorized User");
  }
};
module.exports = { adminAuth, userAuth };

const jwt = require("jsonwebtoken");
const { secret } = require("../config.js");

module.exports = function (roles) {
  return function (req, res, next) {
    if (req.method === "OPTIONS") {
      next();
    }

    try {
      const token = req.cookies.token;
      if (!token) {
        return res.redirect(roles.includes("ADMIN") ? "/logins" : "/login");
      }

      const { roles: userRoles } = jwt.verify(token, secret);
      let hasRole = false;
      userRoles.forEach((role) => {
        if (roles.includes(role)) {
          hasRole = true;
        }
      });

      if (!hasRole) {
        return res.redirect(roles.includes("ADMIN") ? "/logins" : "/login");
      }
      next();
    } catch {
      return res.redirect(roles.includes("ADMIN") ? "/logins" : "/login");
    }
  };
};

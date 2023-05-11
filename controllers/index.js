const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;

module.exports = {
  login: (req, res) => {
    let data = {
      title: "login | LKP",
    };
    res.render("login", data);
  },
  profile: (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    let data = {
      title: "Profile | LKP",
      page: "Profile",
      token: decoded,
    };
    res.render("profile", data);
  },
  dashboard: (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    let data = {
      title: "Dasboard | LKP",
      page: "Dashboard",
      token: decoded,
    };
    res.render("dashboard", data);
  },
  daily: (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    console.log(decoded);
    let data = {
      title: "Dasboard | LKP",
      page: "Daily Progress",

      token: decoded,
    };
    res.render("daily", data);
  },
  monthly: (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    let data = {
      title: "Dasboard | LKP",
      page: "Monthly Progress",
      token: decoded,
    };
    res.render("monthly", data);
  },
  report: (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    let data = {
      title: "Dasboard | LKP",
      page: "Monthly Progress",
      token: decoded,
    };
    res.render("report", data);
  },
  logout: (req, res) => {
    res.clearCookie("token");
    res.redirect("/");
  },
};

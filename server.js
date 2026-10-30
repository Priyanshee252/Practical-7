const path = require("path");
const express = require("express");
const session = require("express-session");
const users = require("./users");
const pages = require("./layout");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: "central-city-library-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 30 * 60 * 1000
    }
  })
);

function requireLogin(req, res, next) {
  if (req.session.user) {
    next();
    return;
  }
  req.session.message = "Please log in to access that page.";
  res.redirect("/login");
}

app.get("/style.css", function (req, res) {
  res.sendFile(path.join(__dirname, "style.css"));
});

app.get("/", function (req, res) {
  res.send(pages.homePage(req.session.user));
});

app.get("/about", function (req, res) {
  res.send(pages.aboutPage(req.session.user));
});

app.get("/login", function (req, res) {
  if (req.session.user) {
    res.redirect("/dashboard");
    return;
  }

  let message = req.session.message || "";
  if (req.query.loggedout) {
    message = "You have been logged out successfully.";
  }
  delete req.session.message;

  res.send(pages.loginPage(message, "", ""));
});

app.post("/login", function (req, res) {
  const username = String(req.body.username || "").trim();
  const password = String(req.body.password || "");

  const match = users.find(function (account) {
    return account.username === username && account.password === password;
  });

  if (!match) {
    res.status(401).send(pages.loginPage("", "Invalid username or password.", username));
    return;
  }

  req.session.regenerate(function (error) {
    if (error) {
      res.status(500).send("Could not start a session. Please try again.");
      return;
    }
    req.session.user = {
      username: match.username,
      name: match.name,
      role: match.role,
      books: match.books
    };
    req.session.loginTime = new Date().toLocaleString("en-IN");
    req.session.visits = 0;
    res.redirect("/dashboard");
  });
});

app.get("/dashboard", requireLogin, function (req, res) {
  req.session.visits += 1;
  const user = req.session.user;
  res.send(pages.dashboardPage(user, user.books, req.session.visits, req.session.loginTime));
});

app.get("/logout", function (req, res) {
  req.session.destroy(function () {
    res.clearCookie("connect.sid");
    res.redirect("/login?loggedout=1");
  });
});

app.use(function (req, res) {
  res.status(404).send(pages.notFoundPage(req.session.user));
});

app.listen(PORT, function () {
  console.log("Library portal running at http://localhost:" + PORT);
});
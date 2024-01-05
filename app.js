// Import dependencies
var express = require("express"),
  routes = require("./routes"),
  user = require("./routes/user"),
  http = require("http"),
  path = require("path");
var session = require("express-session");
var app = express();
require("dotenv").config();
var mysql = require("mysql");
var data_exporter = require("json2csv").Parser;
var bodyParser = require("body-parser");
var s3Controller = require("./controllers/AWS-image");
const PORT = process.env.PORT || 3000;
const route = require("express").Router();
module.exports = route;
// Database connection
var connection = mysql.createPool({
  connectionLimit: "100",
  host: "awseb-e-6vmdmdkzew-stack-awsebrdsdatabase-7w3dz1fytgxp.c3pajvlkcua0.us-east-1.rds.amazonaws.com",
  user: "tamawombs",
  password: "teewomba123",
  database: "sambamanja",
});

console.log("Database connected successfully");
global.db = connection;

// Define environments
app.set("port", process.env.PORT || 3000);
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 * 1000000 },
  })
);

// Routes
app.get("/", routes.index);
app.get("/signup", user.signup);
app.post("/signup", user.signup);
app.get("/login", routes.index);
app.post("/login", user.login);
app.get("/home/dashboard", user.dashboard);
app.get("/home/logout", user.logout);
app.get("/home/profile", user.profile);
app.get("/recents", user.recents);
app.get("/profile", user.profile);

app.get("/all-files", s3Controller.s3Get);
app.get("/get-object-url/:key", s3Controller.getSignedUrl);
app.get("/all-files", s3Controller.s3Get);
app.get("/get-object-url/:key", s3Controller.getSignedUrl);
app.get("/export", function (req, res, next) {
  res.render("export");
});
app.get("/export/csv", function (req, res, next) {
  db.query(
    "SELECT sanitiser, temp, time FROM userdata;",
    function (err, users, fields) {
      if (err) throw err;
      console.log("users:");
      const jsonUsers = JSON.parse(JSON.stringify(users));
      console.log(jsonUsers);

      const csvFields = ["User", "Sanitiser", "Body Temperature", "Timestamp"];
      const json2csvParser = new data_exporter({ csvFields });
      const csv = json2csvParser.parse(jsonUsers);

      console.log(csv);

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=users.csv");

      res.status(200).end(csv);
    }
  );
});
app.get("/export/csv/sanitiser-month", function (req, res, next) {
  db.query(
    "SELECT sanitiser as 'Sanitiser', time as 'Date', monthname(`time`) AS 'MONTH', AVG(temp) as 'Average Temperature', COUNT(*) as 'Users' FROM `userdata` GROUP BY sanitiser;",
    function (err, users, fields) {
      if (err) throw err;
      console.log("users:");
      const jsonUsers = JSON.parse(JSON.stringify(users));
      console.log(jsonUsers);

      const csvFields = ["Month", "Sanitiser"];
      const json2csvParser = new data_exporter({ csvFields });
      const csv = json2csvParser.parse(jsonUsers);

      console.log(csv);

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=Sanitiser(Monthly).csv"
      );

      res.status(200).end(csv);
    }
  );
});
app.get("/export/csv/sanitiser-week", function (req, res, next) {
  db.query(
    "SELECT sanitiser as 'Sanitiser', time as 'Date', weekname(`time`) AS 'Week', AVG(temp) as 'Average Temperature', COUNT(*) as 'Users' FROM `userdata` GROUP BY sanitiser;",
    function (err, users, fields) {
      if (err) throw err;
      console.log("users:");
      const jsonUsers = JSON.parse(JSON.stringify(users));
      console.log(jsonUsers);

      const csvFields = ["Month", "Sanitiser"];
      const json2csvParser = new data_exporter({ csvFields });
      const csv = json2csvParser.parse(jsonUsers);

      console.log(csv);

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=Sanitiser(Weekly).csv"
      );

      res.status(200).end(csv);
    }
  );
});
app.get("/export/csv/sanitiser-day", function (req, res, next) {
  db.query(
    "SELECT sanitiser as 'Sanitiser', time as 'Date', dayname(`time`) AS 'Day', AVG(temp) as 'Average Temperature', COUNT(*) as 'Users' FROM `userdata` GROUP BY sanitiser;",
    function (err, users, fields) {
      if (err) throw err;
      console.log("users:");
      const jsonUsers = JSON.parse(JSON.stringify(users));
      console.log(jsonUsers);

      const csvFields = ["Month", "Sanitiser"];
      const json2csvParser = new data_exporter({ csvFields });
      const csv = json2csvParser.parse(jsonUsers);

      console.log(csv);

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=Sanitiser(Day).csv"
      );

      res.status(200).end(csv);
    }
  );
});
app.get("/export/csv/user-month", function (req, res, next) {
  db.query(
    "SELECT DAY(`time`) AS 'day', COUNT(*) AS 'Number of Users' FROM `userdata` GROUP BY DAY(`time`) ORDER BY DAY DESC;",
    function (err, users, fields) {
      if (err) throw err;
      console.log("users:");
      const jsonUsers = JSON.parse(JSON.stringify(users));
      console.log(jsonUsers);

      const csvFields = ["Month", "Sanitiser"];
      const json2csvParser = new data_exporter({ csvFields });
      const csv = json2csvParser.parse(jsonUsers);

      console.log(csv);

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=Users(Day).csv"
      );

      res.status(200).end(csv);
    }
  );
});
app.get("/export/csv/user-week", function (req, res, next) {
  db.query(
    "SELECT MONTH(`time`) AS 'day', COUNT(*) AS 'Number of Users' FROM `userdata` GROUP BY MONTH(`time`) ORDER BY time DESC;",
    function (err, users, fields) {
      if (err) throw err;
      console.log("users:");
      const jsonUsers = JSON.parse(JSON.stringify(users));
      console.log(jsonUsers);

      const csvFields = ["Month", "Sanitiser"];
      const json2csvParser = new data_exporter({ csvFields });
      const csv = json2csvParser.parse(jsonUsers);

      console.log(csv);

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=Users(Month).csv"
      );

      res.status(200).end(csv);
    }
  );
});
app.get("/export/csv/user-day", function (req, res, next) {
  db.query(
    "SELECT WEEK(`time`) AS 'week', COUNT(*) AS 'Number of Users' FROM `userdata` GROUP BY WEEK(`time`) ORDER BY WEEK DESC;",
    function (err, users, fields) {
      if (err) throw err;
      console.log("users:");
      const jsonUsers = JSON.parse(JSON.stringify(users));
      console.log(jsonUsers);

      const csvFields = ["Month", "Sanitiser"];
      const json2csvParser = new data_exporter({ csvFields });
      const csv = json2csvParser.parse(jsonUsers);

      console.log(csv);

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=Users(Week).csv"
      );

      res.status(200).end(csv);
    }
  );
});

//Middleware
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

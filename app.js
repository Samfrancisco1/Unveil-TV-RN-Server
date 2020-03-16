const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const Bcrypt = require("bcryptjs");

const app = express();

const con = require("./database/db");
const hostname = '127.0.0.1';

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
process.env.SECRET_KEY = "secret";

app.get("/login", (req, res) => {
  let sql = `select * FROM users WHERE email = "${req.body.email}" && password = "${req.body.password}"`;
  con.query(sql, function(err, result) {
    if (err) throw err;

    if (Bcrypt.compareSync(req.body.password, result[0].password)) {
      let token = jwt.sign(result[0], process.env.SECRET_KEY, {
        expiresIn: 1440
      });
      res.send(token);
    } else {
      res.status(400).json({ error: "Admin does not exist" });
    }
  });
});

app.get("/user", (req, res) => {
  let sql = `select * FROM users`;
  con.query(sql, function(err, result) {
    if (err) throw err;


      res.send(result[0]);
 
  });
});

app.get("/register", (req, res, next) => {
  let genre = "";
  let date = "";
  let image = "images/avatar.png";
  let status = "step2";
  let subscription = "False";
  let password = Bcrypt.hashSync(req.body.password, 10);

  let sql = `INSERT INTO users SET name="${req.body.name}", email = "${req.body.email}", number = "${req.body.number}", password = "${password}", genre = "${genre}", plan="${req.body.plan}" , date_reg = "${date}", image = "${image}", status = "${status}", subscription="${subscription}" `;
  let query = `SELECT * FROM users WHERE email="${req.body.email}" OR number="${req.body.number}"`;

  con.query(query, function(err, result) {
    if (err) throw err;

    if (result.length === 0) {
      con.query(sql, function(err, result) {
        if (err) {
          throw err;
        } else {
          res.send("Successful");
        }
      });
    }
  });
});

app.listen(3000, hostname, () => {
  console.log("server started at port 3000");
});

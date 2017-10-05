const firebase = require("firebase-admin");
const functions = require('firebase-functions');
const express = require("express");
const engines = require("consolidate");
const path = require("path");

var serviceAccount = require("./ElBondiCerveceria-bbb129fc191c.json");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  authDomain: "el-bondi-server.firebaseapp.com",
  databaseURL: "https://el-bondi-server.firebaseio.com"
});

// const firebaseApp = firebase.initializeApp(
//     functions.config().firebase
// );

function getFacts() {
    const ref = firebase.database().ref("lugares");
    return ref.once("value").then(snap => snap.val());
}

const app = express();

app.engine("hbs", engines.handlebars);
app.set("views", "./views");
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, 'statics')));

app.get("/", (req, res) => {
    getFacts().then(lugares => {
        res.render("index", { lugares });
    });
});

app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname,"statics","adminLogin.html"));
});

app.post("/admin", (req, res) => {
    var user = req.body;
    //TODO: verify user with database
    res.render("admin");

});

exports.app = functions.https.onRequest(app);

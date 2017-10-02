const firebase = require("firebase-admin");
const functions = require('firebase-functions');
const express = require("express");
const engines = require("consolidate");

const firebaseApp = firebase.initializeApp(
    functions.config().firebase
);

function getFacts() {
    const ref = firebase.database().ref("lugares");
    return ref.once("value").then(snap => snap.val());
}

const app = express();

app.engine("hbs", engines.handlebars);
app.set("views", "./views");
app.set("view engine", "hbs");

app.get("/", (req, res) => {
    getFacts().then(lugares => {
        res.render("index", { lugares });
    });
});

exports.app = functions.https.onRequest(app);

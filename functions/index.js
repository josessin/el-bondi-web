const firebase = require("firebase-admin");
const functions = require('firebase-functions');
const express = require("express");
const path = require("path");
const hbs = require("hbs");
const dummy = require("./server-others/dummy-data.js");
const Queries = require("./server-others/queries.js");
const helpers = require("./server-others/helpers.js");
// var serviceAccount = require("./ElBondiCerveceria-bbb129fc191c.json");

// firebase.initializeApp({
//     credential: firebase.credential.cert(serviceAccount),
//     authDomain: "el-bondi-server.firebaseapp.com",
//     databaseURL: "https://el-bondi-server.firebaseio.com"
// });

const firebaseApp = firebase.initializeApp(
    functions.config().firebase
);

var q = new Queries(firebase);

function getFacts() {
    const ref = firebase.database().ref("lugares");
    return ref.once("value").then(snap => snap.val());
}

const app = express();

hbs.registerPartials(path.join(__dirname, 'views/partials'))
app.set("views", "./views");
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, 'statics')));

app.get("/", (req, res) => {
    getFacts().then(lugares => {
        res.render("index", { lugares });
    });
});

app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "statics", "adminLogin.html"));
});

app.post("/admin", (req, res) => {
    var user = req.body;
    //mucho mas seguro de lo necesario.. pero no importa, me gusta
    //Evaluar que el uid del usuario exista en la base de datos
    firebase.database().ref("admins").child(req.body.uid).once("value").then((snap) => {
        if (!snap.val()) {
            res.send("Invalid User :(");

        }
        q.getLast(12).then((obj) => {
            var entradas = helpers.locationArray(obj);
            res.render("admin", { entradas });
        }).catch((e) => console.log(e));
    }).catch((e) => {
        res.send("Invalid Something... :(");
    });


});

app.get("/__dummy", (req, res) => {
    res.send("adding...");
    dummy(firebase);

})

exports.app = functions.https.onRequest(app);

const firebase = require("firebase-admin");
const functions = require('firebase-functions');
const express = require("express");
const path = require("path");
const hbs = require("hbs");
const dummy = require("./server-others/dummy-data.js");
const Queries = require("./server-others/queries.js");
var serviceAccount = require("./ElBondiCerveceria-bbb129fc191c.json");

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    authDomain: "el-bondi-server.firebaseapp.com",
    databaseURL: "https://el-bondi-server.firebaseio.com"
});

// const firebaseApp = firebase.initializeApp(
//     functions.config().firebase
// );

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
    //TODO: verify user with database
    q.getLast(12).then((obj) => {

        var entradas = [];

        for (var i in obj.val()) {
            if (obj.val().hasOwnProperty(i)) {

                var val ={
                    uid: i,
                    fecha: obj.val()[i].fecha,
                    direccion: obj.val()[i].direccion
                }
                entradas.push(val);
            }
        }

        //res.send(result);
        res.render("admin", {entradas});
    }).catch((e) => console.log(e));

});

app.get("/__dummy", (req, res) => {
    res.send("adding...");
    //dummy(firebase);

})

exports.app = functions.https.onRequest(app);

const firebase = require("firebase-admin");
const functions = require('firebase-functions');
const express = require("express");
const path = require("path");
const hbs = require("hbs");
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

hbs.registerPartials(path.join(__dirname,'views/partials'))
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
    res.render("admin",{
        entradas:[
            {
                fecha: "2017-12-7",
                direccion:"Huarpes 51",
                uid:"32n32m2f222212"
            },
            {
                fecha: "2017-12-7",
                direccion:"Huarpes 51",
                uid:"32n32m2f222212"
            },
            {
                fecha: "2017-12-7",
                direccion:"Huarpes 51",
                uid:"32n32m2f222212"
            }
        ]
    });

});

exports.app = functions.https.onRequest(app);

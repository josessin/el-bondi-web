const firebase = require("firebase-admin");
const functions = require('firebase-functions');
const express = require("express");
const path = require("path");
const hbs = require("hbs");
const dummy = require("./server-others/dummy-data.js");
const Queries = require("./server-others/queries.js");
const bodyParser = require("body-parser");
var serviceAccount = require("./ElBondiCerveceria-bbb129fc191c.json");

//Setup de firebase
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

//setup de Express con hbs 
const app = express();
hbs.registerPartials(path.join(__dirname, 'views/partials'))
app.set("views", "./views");
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, 'statics')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get("/", (req, res) => {
    getFacts().then(lugares => {
        res.render("index", { lugares });
    });
});

app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "statics", "adminLogin.html"));
});

//Ruta android: locaciones (query: cantidad)
app.get("/app/loc", (req, res) => {

    var cantidad = req.query.cantidad || "15";
    //Feo, pero viene como string, el 15 lo hago string para que sea mas ovbio..
    var cant = new Number(cantidad);

    q.getUltimas(cant).then((values) => {
        var entradas = values.obj;
        res.send({ entradas });

    }).catch((e) => res.send("getSiguiente: " + e.message));

});

//Ruta del administrador (leectura y edicion)
app.post("/admin", (req, res) => {
    var idToken = req.body.token;
    var topKey = req.body.topKey || null;
    var bottomKey = req.body.bottomKey || null;
    var siguiente = req.body.siguiente || null;

    //Verificar usuario admin registrado
    firebase.auth().verifyIdToken(idToken).then((tk) => {
        //Enviar pagina de resultados "siguiente"    
        //No se parsea como boolean por alguna razon... por es el === "true"
        if (siguiente === "true") {
            q.getSiguiente(bottomKey).then((values) => {
                var entradas = values.obj;
                var newTopKey = values.newTopKey;
                var newBottomKey = values.newBottomKey;
                //renderizar y enviar
                res.render("admin", { entradas, newTopKey, newBottomKey });

            }).catch((e) => res.send("getSiguiente: " + e.message));
        } else {
            //enviar pagina de resultados "anterior"
            q.getAnterior(topKey).then((values) => {
                var entradas = values.obj;
                var newTopKey = values.newTopKey;
                var newBottomKey = values.newBottomKey;
                //renderizar y enviar
                res.render("admin", { entradas, newTopKey, newBottomKey });

            }).catch((e) => res.send("getAnterior: " + e.message));
        }
    }).catch(e => res.send("Token: " + e.message));
});


app.get("/__dummy", (req, res) => {
    res.send("adding...");
    dummy(firebase);
})

exports.app = functions.https.onRequest(app);

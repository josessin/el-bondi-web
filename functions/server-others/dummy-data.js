module.exports = function (firebase) {

    var data = [{
        fecha: "2017-10-5",
        direccion: "huarpes 51 mendoza"
    },
    {
        fecha: "2017-10-7",
        direccion: "paso de los andes 210 godoy cruz"
    },
    {
        fecha: "2017-10-8",
        direccion: "rodriguez 51 mendoza"
    },
    {
        fecha: "2017-10-10",
        direccion: "la madrid 520 mendoza"
    },
    {
        fecha: "2017-10-20",
        direccion: "rotonda de la virgen ",
        nota: " Acceso este"
    },
    {
        fecha: "2017-10-30",
        direccion: "huarpes 120 mendoza",
        nota: "Cerca de la aristides"
    }];

    var db = firebase.database();

    for (var i = 0; i < data.length; i++) {
        var addDoc = db.ref('locaciones').push(data[i]);
    }

}
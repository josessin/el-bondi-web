/*
Objecto para realizar las queries a la base de datos de firebase,
Se le pasa el objecto firebase como constructor
*/
var maxEntradas = 12;

function Q(firebase) {
    this.f = firebase;
}

Q.prototype.getAnterior = function (key) {
    if (!key) {
        var list = this.f.database().ref('locaciones').limitToLast(maxEntradas+1);
        return list.once('value').then((snap) => {
            var array = locationArray(snap);
            return Promise.resolve({
                newTopKey: Object.keys(snap.val())[0],
                newBottomKey: Object.keys(snap.val())[Object.keys(snap.val()).length-1],
                obj: array
            });
        });
    } else {
        var list = this.f.database().ref('locaciones').orderByKey().endAt(key).limitToLast(maxEntradas+1);
        return list.once('value').then((snap) => {
            var array = locationArray(snap);
            return Promise.resolve({
                newTopKey: Object.keys(snap.val())[0],
                newBottomKey: Object.keys(snap.val())[Object.keys(snap.val()).length-1],
                obj: array
            });
        });
    }
}

Q.prototype.getSiguiente = function(key){
    var list = this.f.database().ref('locaciones').orderByKey().startAt(key).limitToFirst(maxEntradas+1);
    return list.once('value').then((snap) => {
        var array = locationArray(snap);
        return Promise.resolve({
            newTopKey: Object.keys(snap.val())[0],
            newBottomKey: Object.keys(snap.val())[Object.keys(snap.val()).length-1],
            obj: array
        });
    });
}

Q.prototype.getUltimas = function(cantidad){
    var list = this.f.database().ref('locaciones').limitToLast(cantidad+1);
    return list.once('value').then((snap) => {
        var array = locationArray(snap);
        return Promise.resolve({
            newTopKey: Object.keys(snap.val())[0],
            newBottomKey: Object.keys(snap.val())[Object.keys(snap.val()).length-1],
            obj: array
        });
    });
}

Q.prototype.getDesde = function(fecha, cant, iter){
    fecha = fecha || new Date();
    if(iter > 15)
        return;
    
    var list = this.f.database().ref('locaciones').orderByChild("sortFecha").startAt(Date.parse(toISO(fecha))).limitToFirst(cant);
    return list.once('value').then((snap) => {
        var array = sortedLocArray(snap);
        return Promise.resolve({
            newTopKey: Object.keys(snap.val())[0],
            newBottomKey: Object.keys(snap.val())[Object.keys(snap.val()).length-1],
            obj: array
        });
    });
}

Q.prototype.validateUser = function (user) {
    return this.f.database().ref("admins").child(user.uid).once("value", (snap) => {
        if (snap.val()) {
            return Promise.resolve(true);
        }
        return Promise.resolve(false);
    }).catch(e => res.send("validate: " + e.message));
}

Q.prototype.getProductos = function(){
    return this.f.database().ref('productos').once("value").then((snap)=>{
        var array = productosArray(snap);
        return Promise.resolve(array);
    });
}

function productosArray(obj){
    var products = [];

    for (var i in obj.val()) {
      
        if (obj.val().hasOwnProperty(i)) {

            var val = {
                uid: i,
                nombre: obj.val()[i].nombre,
                precio: obj.val()[i].precio,
                descripcion: obj.val()[i].descripcion,
                imgUrl: obj.val()[i].imgUrl
            }
            products.push(val);
        }
    }
    return products;
}

function locationArray(obj) {
    var entradas = [];
    var first = true;

    for (var i in obj.val()) {
        //We whatn to skip the first element so that we 
        //only bring 12 elements and the 13 is the key
        if (first && Object.keys(obj.val()).length > maxEntradas ) {
            first = false;
            continue;
        }
        if (obj.val().hasOwnProperty(i)) {

            var val = {
                uid: i,
                fecha: obj.val()[i].fecha,
                direccion: obj.val()[i].direccion,
                nota: obj.val()[i].nota,
            }
            entradas.push(val);
        }
    }
    return entradas;
}

function sortedLocArray(obj){
    var entradas = [];
    var first = true;

    for (var i in obj.val()) {

        if (obj.val().hasOwnProperty(i)) {

            var val = {
                uid: i,
                fecha: obj.val()[i].fecha,
                direccion: obj.val()[i].direccion,
                nota: obj.val()[i].nota,
                sortFecha: obj.val()[i].sortFecha
            }
            entradas.push(val);
        }
    }
    entradas.sort((a,b)=>{
        return a.sortFecha - b.sortFecha;
    });
    return entradas;
}

function toISO(fechaObj){
    var fechaISO = fechaObj.getFullYear() + "-" + (fechaObj.getMonth()+1) + "-" + fechaObj.getDate();
    return fechaISO;
}

module.exports = Q;
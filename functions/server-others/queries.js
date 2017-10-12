
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

Q.prototype.validateUser = function (user) {
    return this.f.database().ref("admins").child(user.uid).once("value", (snap) => {
        if (snap.val()) {
            return Promise.resolve(true);
        }
        return Promise.resolve(false);
    }).catch(e => res.send("validate: " + e.message));
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
                nota: obj.val()[i].nota
            }
            entradas.push(val);
        }


    }

    return entradas;

}

module.exports = Q;
function locationArray(obj) {
    var entradas = [];

    for (var i in obj.val()) {
        if (obj.val().hasOwnProperty(i)) {

            var val = {
                uid: i,
                fecha: obj.val()[i].fecha,
                direccion: obj.val()[i].direccion
            }
            entradas.push(val);
        }
    }

    return entradas;

}



module.exports ={
    locationArray
}
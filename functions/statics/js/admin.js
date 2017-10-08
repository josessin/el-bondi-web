
function guardar(entrada) {
    var db = firebase.database();
    
    var ule = entrada.find(".ulentrada");

    console.log(ule[0].id);
    
    db.ref("/locaciones/" + ule[0].id).set({
        fecha: entrada.find(".inFecha")[0].value,
        direccion: entrada.find(".inDireccion")[0].value
    });  
}

function agregarEntrada(){
    var nuevaEntrada = $("#entradas").append(entradaElemnt);
    var key = firebase.database().ref("locaciones").push().key;
    console.log(key);
    nuevaEntrada.find(".ulentrada").attr("id",key);
}

var entradaElemnt = '<div id="entrada">\
<ul class="ulentrada">\
    <li class="ent">\
        <p>Fecha: </p>\
    </li>\
    <li class="ent">\
        <input class="inFecha" type="date" >\
    </li>\
    <li class="ent">\
        <p>Direccion:</p>\
    </li>\
    <li class="ent">\
        <input class="inDireccion" type="text" size="100">\
    </li>\
    <li class="ent">\
        <button class="btnGuaradar" type="button" onclick="guardar($(this).parent().closest(\'div\'))">Guardar</button>\
    </li>\
</ul>\
</div>'

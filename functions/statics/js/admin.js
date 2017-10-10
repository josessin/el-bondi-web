
var __entradas;

(function () {

    window.onload = function () {

        __entradas = $(".entrada");
        for (var i = 0; i < __entradas.length; i++) {
            registrarCambios(__entradas[i]);
            desabilitarInput(__entradas[i])
        }
    };

}());


function guardar(jEntrada) {

    if (!validarFecha(jEntrada)) {
        alert("La fecha no ha sido ingresada correctamente o es anterior a la fecha de hoy!\n\
        Los cambios no se guardaron.");
        return;
    }

    jEntrada.find(".btnGuaradar").text("Conectando").prop("disabled", true);
    var db = firebase.database();
    var ule = jEntrada.find(".ulentrada");

    console.log("Id: " + ule[0].id);
    console.log("Fecha: " + jEntrada.find(".inFecha")[0].value);

    db.ref("/locaciones/" + ule[0].id).set({

        fecha: jEntrada.find(".inFecha")[0].value,
        direccion: jEntrada.find(".inDireccion")[0].value,
        nota: jEntrada.find(".inNota")[0].value

    }).then(function () {
        jEntrada.find(".btnGuaradar").prop("disabled", false).addClass("hide").text("Guardar");
    }).catch(function () {
        window.location.replace(window.location.href);
    });
}

function agregarEntrada() {
    var key = firebase.database().ref("locaciones").push().key;
    var nuEl = $(entradaElemnt);
    $("#entradas").append(nuEl);
    nuEl.find(".ulentrada").attr("id", key);
    __entradas.push(nuEl[0]);
    registrarCambios(nuEl[0]);
}

function borrarEntrada(entrada) {
    var db = firebase.database();
    var key = $(entrada).find(".ulentrada").prop("id");
    db.ref("/locaciones/" + key).remove().then(function () {
        $(entrada).remove();
    }).catch(function (e) {
        alert("No se puede conectar con la base de datos,\
        puede que no estes conectado a internet o tu sesión se haya cerrado.\n\
        Intenta refrescar la pagina");
    });
}

function registrarCambios(entrada) {

    $(entrada).find(".inFecha").on("change paste keyup", function () {
        $(entrada).find(".btnGuaradar").removeClass("hide");
    });

    $(entrada).find(".inDireccion").on("change paste keyup", function () {
        $(entrada).find(".btnGuaradar").removeClass("hide");
    });

    $(entrada).find(".inNota").on("change paste keyup", function () {
        $(entrada).find(".btnGuaradar").removeClass("hide");
    });
    
    $(entrada).find(".btnBorrar").removeClass("hide");
    $(entrada).find("input").prop("disabled", false);
}

function desabilitarInput(entrada){

    if(!validarFecha($(entrada))){
        $(entrada).find(".btnBorrar").addClass("hide");
        $(entrada).find("input").prop("disabled", true);
    }
}

function logout() {
    firebase.auth().signOut().then(function () {
        window.location.replace(window.location.href);
    });
}

function validarFecha(jEntrada) {
    var selectedText = jEntrada.find(".inFecha").prop("value");
    if(!selectedText){
        return false;
    }
    var selectedDate = new Date(selectedText);
    var now = new Date();
    now.setDate(now.getDate()-1);
    if (selectedDate < now){
        return false;
    }
    return true;

}

var entradaElemnt = '\
<div class="entrada">\
    <ul class="ulentrada">\
        <li class="ent">\
            <button class="btnBorrar hide" type="button" onclick="borrarEntrada($(this).parent().closest(\'div\'))">X</button>\
        </li>\
        <li class="ent">\
            <p>Fecha</p>\
        </li>\
        <li class="ent">\
            <input class="inFecha" type="date" disabled >\
        </li>\
        <li class="ent">\
            <p>Dir</p>\
        </li>\
        <li class="ent">\
            <input class="inDireccion" type="text" disabled>\
        </li>\
        <li class="ent">\
            <p>Info</p>\
        </li>\
        <li class="ent">\
            <input class="inNota" type="text" disabled>\
        </li>\
        <li class="ent">\
            <button class="btnGuaradar hide" type="button" onclick="guardar($(this).parent().closest(\'div\'))">Guardar</button>\
        </li>\
    </ul>\
</div>'

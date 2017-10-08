
var __entradas;

(function () {

    window.onload = function () {

        __entradas = $(".entrada");
        for (var i = 0; i < __entradas.length; i++) {
            registrarCambios(__entradas[i]);
        }
    };

}());


function guardar(entrada) {

    entrada.find(".btnGuaradar").text("Conectando").prop("disabled", true);


    var db = firebase.database();
    var ule = entrada.find(".ulentrada");


    console.log(ule[0].id);

    db.ref("/locaciones/" + ule[0].id).set({
        fecha: entrada.find(".inFecha")[0].value,
        direccion: entrada.find(".inDireccion")[0].value
    }).then(function () {
        entrada.find(".btnGuaradar").prop("disabled", false).addClass("hide").text("Guardar");
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

function registrarCambios(entrada) {


    $(entrada).find(".inFecha").on("change paste keyup", function () {
        $(entrada).find(".btnGuaradar").removeClass("hide");
    });

    $(entrada).find(".inDireccion").on("change paste keyup", function () {
        $(entrada).find(".btnGuaradar").removeClass("hide");
    });
}

var entradaElemnt = '\
<div class="entrada">\
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
            <button class="btnGuaradar hide" type="button" onclick="guardar($(this).parent().closest(\'div\'))">Guardar</button>\
        </li>\
    </ul>\
</div>'

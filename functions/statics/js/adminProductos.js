
var __productos;

(function () {

    $(function () {

        //Pedir productos a la api
        $.get(orignialHref + "/prod", function (data) {

            __productos = data.productos;

            for (var i = 0; i < __productos.length; i++) {
                cargarProducto(__productos[i]);
            }
        });

    });

}());


function cargarProducto(prod) {
    var nuEl = $(productElemnt);
    $("#productos").append(nuEl);
    nuEl.find(".ulproducto").attr("id", prod.uid);
    nuEl.find(".inNombre")[0].value = prod.nombre;
    nuEl.find(".inPrecio")[0].value = prod.precio;
    nuEl.find(".inDescripcion")[0].value = prod.descripcion;
    nuEl.find(".inProductImage").prop("src", prod.imgUrl);
    registrarModificaciones(nuEl);
}

function agregarProducto() {
    var key = firebase.database().ref("productos").push().key;
    var nuEl = $(productElemnt);
    $("#productos").append(nuEl);
    nuEl.find(".ulproducto").attr("id", key);
    registrarModificaciones(nuEl);
}


function registrarModificaciones(producto) {

    $(producto).find(".inNombre").on("change paste keyup", function () {
        $(producto).find(".btnGuaradar").removeClass("hide");
    });

    $(producto).find(".inPrecio").on("change paste keyup", function () {
        $(producto).find(".btnGuaradar").removeClass("hide");
    });

    $(producto).find(".inDescripcion").on("change paste keyup", function () {
        $(producto).find(".btnGuaradar").removeClass("hide");
    });

    $(producto).find(".btnBorrar").removeClass("hide");
}


function guardarProducto(jProducto) {

    jProducto.find(".btnGuaradar").text("Conectando").prop("disabled", true);
    var db = firebase.database();
    var ule = jProducto.find(".ulproducto");

    console.log("Id: " + ule[0].id);
    console.log("Nombre: " + jProducto.find(".inNombre")[0].value);

    db.ref("/productos/" + ule[0].id).set({

        nombre: jProducto.find(".inNombre")[0].value,
        precio: jProducto.find(".inPrecio")[0].value,
        descripcion: jProducto.find(".inDescripcion")[0].value,
        imgUrl: jProducto.find(".inProductImage").prop("src")

    }).then(function () {
        jProducto.find(".btnGuaradar").prop("disabled", false).addClass("hide").text("Guardar");
    }).catch(function (e) {
        console.log(e);
        window.location.replace(window.location.href);
    });
}

function previewFile() {
    var preview = document.querySelector('.inProductImage');
    var file    = document.querySelector('input[type=file]').files[0];
    var reader  = new FileReader();
  
    reader.addEventListener("load", function () {
      preview.src = reader.result;
    }, false);
  
    if (file) {
      reader.readAsDataURL(file);
    }
  }

var productElemnt = '\
<div class="producto">\
    <ul id="{{datos.uid}}" class="ulproducto">\
        <li class="prod">\
            <button class="btnBorrar" type="button" onclick="borrarProducto($(this).parent().closest(\'div\'))">X</button>\
        </li class="prod">\
        <li class="prod">\
            <input type="text" class="inNombre" placeholder="Nombre">\
        </li>\
        <li class="prod">\
            <input type="number" class="inPrecio" placeholder="Precio">\
        </li>\
        <li class="prod">\
            <textarea class= "inDescripcion" placeholder="Descripcion" rows="5" cols="40"></textarea>\
        </li>\
        <li class="prod">\
            <div class="prodImgContainer">\
                <label for="fileInput" class="imgLabel">\
                    <img class="inProductImage" src="/img/foodicon.png" alt="imagen">\
                </label>\
                <input id="fileInput" type="file" onchange="previewFile()" style="display:none">\
            </div>\
        </li>\
        <li class="prod">\
            <button class="btnGuaradar hide" type="button" onclick="guardarProducto($(this).parent().closest(\'div\'))">Guardar</button>\
        </li>\
    </ul>\
</div>'

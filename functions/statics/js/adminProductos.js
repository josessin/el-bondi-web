
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

// var image = document.getElementById('productImage');
// var options = {
//     viewMode: 0,
// }
// Cropper.setDefaults(options);
// var cropper = new Cropper(image, {
//     crop: function (e) {
//         console.log(e.detail.x);
//         console.log(e.detail.y);
//         console.log(e.detail.width);
//         console.log(e.detail.height);
//         console.log(e.detail.rotate);
//         console.log(e.detail.scaleX);
//         console.log(e.detail.scaleY);
//     }
// });

function cargarProducto(prod) {
    var nuEl = $(productElemnt);
    $("#productos").append(nuEl);
    nuEl.find(".ulproducto").attr("id", prod.uid);
    nuEl.find(".inNombre")[0].value = prod.nombre;
    nuEl.find(".inPrecio")[0].value = prod.precio;
    nuEl.find(".inDescripcion")[0].value = prod.descripcion;

    //Le agragamos al id el uid para que sea unico, asi el for="" de label no se confunde
    nuEl.find("input[type=file]").attr("id", "fileInput" + prod.uid);
    nuEl.find(".imgLabel").prop("htmlFor", nuEl.find("input[type=file]").prop("id"));
    //guardar el nombre del archivo en el atributo alt de img, para despues poder recuperarlo
    nuEl.find("#productImage").prop("alt", prod.imgUrl);
    //Ref a la imagen
    var pathReference = firebase.storage().ref('img-productos/' + prod.imgUrl);
    pathReference.getDownloadURL().then(function (url) {
        // `url` is the download URL for 'images/stars.jpg'
        var img = nuEl.find("#productImage").prop("src", url);

    }).catch(function (error) {
        // Handle any errors
    });
    registrarModificaciones(nuEl);

}

function agregarProducto() {
    var key = firebase.database().ref("productos").push().key;
    var nuEl = $(productElemnt);
    $("#productos").append(nuEl);
    nuEl.find(".ulproducto").attr("id", key);
    //Le agragamos al id el uid para que sea unico, asi el for="" de label no se confunde
    nuEl.find("input[type=file]").attr("id", "fileInput" + key);
    nuEl.find(".imgLabel").prop("htmlFor", nuEl.find("input[type=file]").prop("id"));
    //guardar el nombre del archivo en el atributo alt de img, para despues poder recuperarlo
    nuEl.find("#productImage").prop("alt", "defaultImg.png");
    //Agregamos la imagen por defecto
    var pathReference = firebase.storage().ref("img-productos/defaultImg.png");
    pathReference.getDownloadURL().then(function (url) {
        // `url` is the download URL for 'images/stars.jpg'
        nuEl.find("#productImage").prop("src", url);

    }).catch(function (error) {
        console.log(error.message);
    });

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
    console.log(jProducto);
    jProducto.find(".btnGuaradar").text("Conectando").prop("disabled", true);
    var db = firebase.database();
    var ule = jProducto.find(".ulproducto");

    console.log("Id: " + ule[0].id);
    console.log("Nombre: " + jProducto.find(".inNombre")[0].value);
    //image url parseada
    db.ref("/productos/" + ule[0].id).set({

        nombre: jProducto.find(".inNombre")[0].value,
        precio: jProducto.find(".inPrecio")[0].value,
        descripcion: jProducto.find(".inDescripcion")[0].value,
        imgUrl: jProducto.find(".inProductImage").prop("alt")

    }).then(function () {
        jProducto.find(".btnGuaradar").prop("disabled", false).addClass("hide").text("Guardar");
    }).catch(function (e) {
        console.log(e);
        window.location.replace(window.location.href);
    });
}

function borrarProducto(jProd) {
    alert("No implementado aun");
}

function subirFoto(jProd) {
    var preview = jProd.find('.inProductImage')[0];
    var file = jProd.find('input[type=file]').prop("files")[0];
    var reader = new FileReader();

    reader.addEventListener("load", function () {
        var ext = file.name.match(/\.([^\.]+)$/)[1];
        if (ext == "jpg" || ext == "png" || ext == "bmp" || ext == "tif") {
            preview.src = reader.result;
            var storageRef = firebase.storage().ref("img-productos/" + file.name);
            jProd.find(".loader").removeClass("none hide");
            jProd.find("#uploadIcon").addClass("none");
            var task = storageRef.put(file);
            task.on("state_changed",

                function progress(snapshot) {

                },
                function error(err) {

                },
                function complete() {
                    jProd.find("#productImage").prop("alt", file.name);
                    jProd.find(".loader").addClass("none");
                    jProd.find("#uploadIcon").removeClass("none hide");
                    jProd.find(".btnGuaradar").removeClass("hide");
                }
            );
        } else {
            reader.abort();
            alert("Tipo de archivo no valido.");
        }

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
                <label class="imgLabel">\
                    <img id="productImage" class="inProductImage" src="/img/foodIcon.png" alt="imagen">\
                </label>\
            </div>\
            <input id="fileInput" type="file" accept=".png,.jpg,.bmp,.tif" onchange="subirFoto($(this).parent().closest(\'div\'))" style="display:none">\
        </li>\
        <li class="prod">\
            <img id="uploadIcon" class="hide" src="/img/okIcon.png">\
            <div class="loader none"></div>\
        </li>\
        <li class="prod">\
            <button class="btnGuaradar hide" type="button" onclick="guardarProducto($(this).parent().closest(\'div\'))">Guardar</button>\
        </li>\
    </ul>\
</div>'

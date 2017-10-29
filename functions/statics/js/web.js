
function init() {

    var url = window.location.href.split("/")[0];

    $.getJSON(url + "app/loc?cantidad=1", function (data) {
        
        var dir = data.entradas[0].direccion;
        var nota = data.entradas[0].nota;
        $("#dirActual h4").html(mayus(dir));
        $("#nota").html(nota);
        var geocoder = new google.maps.Geocoder();

        var mendoza = { lat: -32.8895, lng: 68.8458 };
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 15,
            center: mendoza
        });

        var geocoder = new google.maps.Geocoder();

        geocoder.geocode({"address": dir},function(results,status){
            if(status === "OK"){
                map.setCenter(results[0].geometry.location);
                var marker = new google.maps.Marker({
                    position: results[0].geometry.location,
                    map: map
                });
            }else{
                alert("Geocode no fue exitoso por la siguiente razon: " + status);
            }
        });
       
    })

}

function mayus(s){
    return s[0].toUpperCase() + s.slice(1);
}
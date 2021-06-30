//var url = '../../Controlador/Buscador_Controlador.php';
var url = 'https://la-sueca.com/Controlador/Buscador_Controlador.php';
var subCategoria = 0;
var map;
var marker;
var lat = -17.782786;
var lon = -63.181530;
var tocoMapa = false;
var fechaEntrega = "";
var costoDelivery = 0;
var sucursal_id = 0;

$(document).ready(function () {
    
    navigator.geolocation.getCurrentPosition((pos) => {
        var crd = pos.coords;
        lat = crd.latitude;
        lon = crd.longitude;
    });
    $(window).resize(function () {
        cambioTamanoPantalla();
    });
    cambioTamanoPantalla();
    if (pedidoView != "0") {
        verOrdenCompras();
    }
});
function buscador(e, tipo) {
    if (!(e === "" || e.keyCode === 13)) {
        return;
    }
    var buscar1 = ($("input[name=buscador" + tipo + "]").val() + "").trim();
    var buscar2 = ($("input[name=buscador2]").val() + "").trim();
    var textoBuscador = buscar1;
    if (buscar1.length === 0) {
        textoBuscador = buscar2;
    }
    $(location).attr('href', "buscador.php?b=" + textoBuscador);
}

function seleccionarSubcategoria(ele, id) {
    subCategoria = id;
    $(".boxSubcategoria").removeClass("selectedSubcategoria");
    $(ele).addClass("selectedSubcategoria");
}




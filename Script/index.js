var url = 'Controlador/Buscador_Controlador.php';
var subCategoria = 0;
var map;
var marker;
var lat = -17.782786;
var lon = -63.181530;
var tocoMapa=false;
var fechaEntrega="";
var costoDelivery=0;
var sucursal_id=0;
$(document).ready(function () {
    navigator.geolocation.getCurrentPosition((pos)=>{
        var crd = pos.coords;
        lat=crd.latitude;
        lon=crd.longitude;
    });
    cambioTamanoPantalla();
    if(pedidoView!="0"){
        verOrdenCompras();
    }
});
function buscador(e){
    if (!(e === "" || e.keyCode === 13)) {
        return;
    }
    var buscar = ($("input[name=buscador]").val() + "").trim();
    $(location).attr('href', "buscador.php?b="+buscar);
}
function seleccionarSubcategoria(ele, id) {
    subCategoria = id;
    $(".boxSubcategoria").removeClass("selectedSubcategoria");
    $(ele).addClass("selectedSubcategoria");
}




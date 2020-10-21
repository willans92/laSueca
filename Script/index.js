var url = 'Controlador/Login_Controlador.php';

$(document).ready(function () {
    cambioTamanoPantalla();


});
function cambioTamanoPantalla() {
    var buscador = $(".buscadorMenu");
    for (var i = 0; i < buscador.length; i++) {
        var contenedorBuscadorW = $(buscador[i]).width();
        var categoriaBuscadorW = $(buscador[i]).find(".categoria").width();
        var lupaBuscadorW = $(buscador[i]).find("img").width();
        var inputBuscador = contenedorBuscadorW - categoriaBuscadorW - lupaBuscadorW - 53;
        $(buscador[i]).find("input").css("width", inputBuscador + "px");
    }
    $(window).resize(function () {
        var buscador = $(".buscadorMenu");
        for (var i = 0; i < buscador.length; i++) {
            var contenedorBuscadorW = $(buscador[i]).width();
            var categoriaBuscadorW = $(buscador[i]).find(".categoria").width();
            var lupaBuscadorW = $(buscador[i]).find("img").width();
            var inputBuscador = contenedorBuscadorW - categoriaBuscadorW - lupaBuscadorW - 53;
            $(buscador[i]).find("input").css("width", inputBuscador + "px");
        }

    });
    
}
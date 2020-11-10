var url = 'Controlador/Portal_Controlador.php';
var estadoMenu = false;
$(document).ready(function () {
    var tamanopantalla = $(window).height() - 60;
    $("#cuerpoProyeto").css("height", tamanopantalla);
    $(window).resize(function () {
        var tamanopantalla = $(window).height() - 60;
        $("#cuerpoProyeto").css("height", tamanopantalla);
    });
    var usuarioLocal = localStorage.getItem("tienda");
    if (usuarioLocal === null) {
        cerrarSession(1);
    }
});
function menuApp() {
    if (estadoMenu) {
        return;
    }
    estadoMenu = true;
    if ($("#submenu").css("display") === "none") {
        tamanopantalla = $(window).height() - 60;
        $("#submenu").css("cssText", "width: 0px; display:block !important;  position: fixed; max-width: none; z-index: 1; height:" + tamanopantalla + "px;");
        $("#submenu").animate({
            "width": "400px"
        }, 500, function () {
            estadoMenu = false;
        });
    } else {
        $("#submenu").animate({
            "width": "0"
        }, 500, function () {
            estadoMenu = false;
            $("#submenu").css("cssText", "display:none !important;");

        });
    }
}
function menu(tipo, categoria) {
    $("#submenu .item").addClass("ocultarMenu");
    $("#submenu .tituloMenu").html(tipo);
    $(".p" + categoria).removeClass("ocultarMenu");

}
function redireccionarUrl(url, ele) {
    menuApp();
    $("#submenu .item").removeClass("submenuSeleccionado");
    $(ele).addClass("submenuSeleccionado");
    $("#cuerpoProyeto").attr("src", url);
}
function cerrarSession(tipo) {
    localStorage.removeItem("tienda");
    if (tipo === 1) {
        window.location = "index.php";
    } else {
        window.location = "../index.php";
    }
}
$(window).bind("beforeunload", function () {
    /*$.post("PORTAL_CONTROLER", {}, function (response) {
     });*/
});

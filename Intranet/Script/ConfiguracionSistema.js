var url = '../Controlador/ConfiguracionSistema_Controlador.php';
var tamanopantalla = $(window).height() - 120;
$(document).ready(function () {
    var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal === null) {
        window.parent.cerrarSession();
        return;
    }
    $("#contenedorBox").css("height", tamanopantalla);
     $(window).resize(function () {
        var tamanopantalla = $(window).height() - 120;
        $("#contenedorBox").css("height", tamanopantalla);
    });
    cargarDatos();
});
function cargarDatos() {
    cargando(true);
    $.get(url, {proceso: 'configuracion'}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error, "error");
        } else {
            var empresa = json.result.empresa;
            $("input[name=telefono]").val(empresa.telefono);
            $("input[name=comisionHijo]").val(empresa.comisionHijo);
            $("input[name=comisionNieto]").val(empresa.comisionNieto);
        }
    });
}
function registrar(){
    var json = variables("#contenedorBox");
    json.proceso = 'registrar';
    cargando(true);
    $.post(url, json, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error, "error");
        } else {
            alertaRapida("Se registro correctamente.")
        }
    })
}
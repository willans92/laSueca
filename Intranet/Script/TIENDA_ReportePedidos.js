var url = '../Controlador/TIENDA_ReportePedidos_Controlador.php';
var contador = 0;
var posicion = 0;
var tamanopantalla = $(window).height() - 235;
var listaUsuario;
var listaLinea;
var listaLineaCatalogo=[];
var categoria_id = "0";
var listaCategoria=[];
$(document).ready(function () {
    var tiendaLocal = localStorage.getItem("tienda");
    if (tiendaLocal === null) {
        window.parent.cerrarSession();
        return;
    }
    $(".fecha").val(fechaActual());
    $(".fecha").datepicker();
    tiendaLocal = $.parseJSON(tiendaLocal);
    $("#contenedorUsuarop").css("height", tamanopantalla);
    $(window).resize(function () {
        var tamanopantalla = $(window).height() - 265;
        $("#contenedorUsuarop").css("height", tamanopantalla);
    });
    buscar();
});
function buscar(){
    var estado=$("#estado option:selected").val();
    var de =$("input[name=de]").val();
    var hasta =$("input[name=hasta]").val();
    var buscador = ($("input[name=buscar]").val() + "").toUpperCase();
    cargando(true);
    $.get(url, {proceso: "buscador" ,estado:estado, de:de, hasta:hasta, buscador:buscador}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error, "error");
        } else {
            var lista = json.result;
           var html="";
            for (var i = 0; i < lista.length; i++) {
                html+="<tr>";
                html+="<td><div class='normal'>"+lista[i]["solicitada"]+"</div></td>";
                html+="<td><div class='normal'>"+lista[i]["fechaProgramada"]+"</div></td>";
                html+="<td><div class='normal'>"+lista[i]["horaProgramada"]+"</div></td>";
                html+="<td><div class='normal'>"+lista[i]["cliente"]+"</div></td>";
                html+="<td><div class='normal'>"+format(lista[i]["totalPedido"])+"</div></td>";
                html+="<td><div class='normal'>"+format(lista[i]["comision"])+"</div></td>";
                html+="<td><div class='normal'>"+lista[i]["estado"]+"</div></td>";
                html+="</tr>";
                
            }
            $("#contenedorUsuarop tbody").html(html);
            $("#contenedorUsuarop").igualartabla();
        }
    });
}

var url = '../Controlador/ReporteAjusteInventario_Controlador.php';
var tamanopantalla = $(window).height() - 250;
var listaAlmacen = {};
$(document).ready(function () {
    $(".fecha").datepicker();
    $(".fecha").val(fechaActual());
    var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal === null) {
        window.parent.cerrarSession();
        return;
    }
    usuarioLocal = $.parseJSON(usuarioLocal);
    iniciar();
});
function iniciar() {
    cargando(true);
    $.get(url, {proceso: "inicializar"}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error, "error");
        } else {
            var usuarioLocal = localStorage.getItem("usuario");
            if (usuarioLocal === null) {
                window.parent.cerrarSession();
                return;
            }
            var lista = json.result.almacen;
            for (var i = 0; i < lista.length; i++) {
                listaAlmacen[lista[i].id_almacen] = lista[i];
            }
            reporteDetallado();
        }
    });
}
function reporteDetallado() {
    var de = $("input[name=de]").val();
    var hasta = $("input[name=hasta]").val();
    cargando(true);
    $.get(url, {proceso: 'traspasoDetallado', de: de, hasta: hasta}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error, "error");
        } else {
            var html = "";
            var lista = json.result;
            var html = "<table class='table'>";
            html += "<thead  class='thead-light'>";
            html += "<th><div style='width:80px'>Fecha</div></th>";
            html += "<th><div style='width:70px'>Nro.Doc</div></th>";
            html += "<th><div class='medio'>Detalle</div></th>";
            html += "<th><div class='normal'>Codigo</div></th>";
            html += "<th><div  class='normal'>Producto</div></th>";
            html += "<th><div  style='width:70px'>Cantidad</div></th>";
            html += "<th><div  class='normal'>Almacen</div></th>";
            html += "</thead><tbody style='height:300px;'>";
            var listaProducto = window.parent.listaProducto;
            for (var i = 0; i < lista.length; i++) {
                var obj = lista[i];
                var almacen = listaAlmacen[obj.almacen_id];
                var producto = listaProducto["p" + obj.producto_id];
                html += "<tr >";
                html += "<td><div style='width:80px'>" + obj.fecha + "</div></td>";
                html += "<td><div style='width:70px' class='subrayar'  onclick=\"redireccionar('AjusteInventario'," + obj.id_ajusteInventario + ")\">" + obj.nroDocumento + "</div></td>";
                html += "<td><div class='medio'>" + obj.detalle + "</div></td>";
                html += "<td><div class='normal'>" + producto.codigo + "</div></td>";
                html += "<td><div class='normal'>" + producto.nombre + "</div></td>";
                html += "<td><div  style='width:70px'>" + obj.cantidad + "</div></td>";
                html += "<td><div  class='normal'>" + almacen.nombre + "</div></td>";
                html += "</tr>";
            }
            html += "</tbody>";

            html += "<tfoot>";
            html += "<tr >";
            html += "</tfoot></table>";
            $("#tblventas").html(html);
            $("#tblventas").igualartabla();
            tamanopantalla = $(window).height() - 250;
            $("#tblventas tbody").css("height", tamanopantalla);
        }
    });
}
function imprimir() {
    var contenido = $("#tblventas").html();
    var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal === null) {
        window.parent.cerrarSession();
        return;
    }
    usuarioLocal = $.parseJSON(usuarioLocal);
    var titulo = "Reporte Traspaso de Producto";
    var filtro = "<div class='row' id='filtroReporte'>";
    filtro += "<div class='col-12'><span class='negrilla'>FILTROS</div>";
    var de = $("input[name=de]").val();
    var hasta = $("input[name=hasta]").val();
    filtro += "<div class='col-4'><span class='negrilla'>Fecha: </span>" + de + " - " + hasta + "</div>";
    filtro += "</div>";
    imprimirReporte({contenido: contenido, sucursal_id: usuarioLocal.sucursal_id, titulo: titulo, datosHead: filtro, encabezadoThead: true});
}
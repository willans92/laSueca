var url = '../Controlador/ReportePedidoApp_Controlador.php';
var meses = ["", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
var estadoReporte = "Mensual";
var tamanopantalla = $(window).height() - 195;
var columnaTabla = [];
var id_empresa=0;
$(document).ready(function () {
    $(".fecha").datepicker();
    $(".fecha").val(fechaActual());
    var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal === null) {
        window.parent.cerrarSession();
        return;
    }
    cargando(true);
    $.get(url, {proceso: 'iniciar'}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error, "error");
        } else {
            var listaTienda = json.result;
            comboBox({identificador: "input[name=tienda]", datos: listaTienda
                , codigo: "id_tienda", texto: "nombre"
                , todos: true,callback: ()=>generar()});
            generar();
        }
    });
});
function generar() {
    if (estadoReporte === "Mensual") {
        reporteMensual();
    }
    if (estadoReporte === "Diario") {
        reporteDiario();
    }
    if (estadoReporte === "Detalle") {
        reporteDetallado();
    }
}

function reporteDetallado() {
    var de = $("input[name=de]").val();
    var hasta = $("input[name=hasta]").val();
    var tienda = $("input[name=tienda]").data("cod");
    var estado = $("#estado option:selected").val();
    $("h1").text("Reporte de Pedido Detallado");
    $("#fechabox").visible();
    $("#filtrosMenu > div").css("width", 800);
    estadoReporte = "Detalle";
    cargando(true);
    $.get(url, {proceso: 'pedidosDetallados', tienda: tienda, buscador:""
        , de: de, hasta: hasta, estado: estado}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error, "error");
        } else {
            var html = "";
            $("#tblPedido").html("");
            var lista = json.result;
            var html = "<table class='table'>";
            html += "<thead  class='thead-light'>";
            html += "<th><div class='normal'>Solicitado</div></th>";
            html += "<th><div class='normal'>Programado</div></th>";
            html += "<th><div class='normal'>Cliente</div></th>";
            html += "<th><div class='normal'>Total Pedido</div></th>";
            html += "<th><div class='normal'>Comision</div></th>";
            html += "<th><div class='normal'>Estado</div></th>";
            html += "</thead><tbody style='height:300px'>";
            var totalVenta=0;
            var totalComission=0;
            for (var i = 0; i < lista.length; i++) {
                var venta=parseFloat(lista[i]["totalPedido"]);
                var comision=parseFloat(lista[i]["comision"]);
                totalVenta+=venta;
                totalComission+=comision;
                html+="<tr>";
                html+="<td><div class='normal'>"+lista[i]["solicitada"]+"</div></td>";
                html+="<td><div class='normal'>"+lista[i]["fechaProgramada"] + " "+lista[i]["horaProgramada"] +"</div></td>";
                html+="<td><div class='normal'>"+lista[i]["cliente"]+"</div></td>";
                html+="<td><div class='normal derecha'>"+format(venta)+"</div></td>";
                html+="<td><div class='normal derecha'>"+format(comision)+"</div></td>";
                html+="<td><div class='normal'>"+lista[i]["estado"]+"</div></td>";
                html+="</tr>";
            }
            html += "</tbody><tfoot>";
            html+="<td><div class='normal'></div></td>";
            html+="<td><div class='normal'></div></td>";
            html+="<td><div class='normal'>TOTAL</div></td>";
            html+="<td><div class='normal derecha'>"+format(totalVenta)+"</div></td>";
            html+="<td><div class='normal derecha'>"+format(totalComission)+"</div></td>";
            html+="<td><div class='normal'></div></td>";
            html += "<tr>";
            html += "</tr>";
            $("#tblPedido").html(html);
            var tamanofiltro = $("#filtrosMenu").outerHeight();
            tamanopantalla = $(window).height() - 195;
            var tamanoHead = tamanopantalla - $("#tblPedido thead").outerHeight() - tamanofiltro;
            $("#tblPedido tbody").css("height", tamanoHead);
        }
    });
}
function reporteDiario() {
    var de = $("input[name=de]").val();
    var hasta = $("input[name=hasta]").val();
    var tienda = $("input[name=tienda]").data("cod");
    var estado = $("#estado option:selected").val();
    $("h1").text("Reporte de Pedido Diario");
    $("#fechabox").visible();
    $("#filtrosMenu > div").css("width", 800);
    estadoReporte = "Diario";
    cargando(true);
    $.get(url, {proceso: 'reportePedidoDiario', tienda: tienda
        , de: de, hasta: hasta, estado: estado}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error, "error");
        } else {
            var html = "";
            $("#tblPedido").html("");
            var lista = json.result;
            var html = "<table class='table'>";
            html += "<thead  class='thead-light'>";
            html += "<th><div class='normal'>Fecha</div></th>";
            html += "<th><div class='normal'>Estado</div></th>";
            html += "<th><div class='normal'>Vendido</div></th>";
            html += "<th><div class='normal'>Comision</div></th>";
            html += "</thead><tbody style='height:300px'>";
            var totalVenta=0;
            var totalComission=0;
            for (var i = 0; i < lista.length; i++) {
                var venta=parseFloat(lista[i]["totalPedido"]);
                var comision=parseFloat(lista[i]["comision"]);
                totalVenta+=venta;
                totalComission+=comision;
                html+="<tr>";
                html+="<td><div class='normal'>"+lista[i]["fechaProgramada"]+"</div></td>";
                html+="<td><div class='normal'>"+lista[i]["estado"]+"</div></td>";
                html+="<td><div class='normal derecha'>"+format(venta)+"</div></td>";
                html+="<td><div class='normal derecha'>"+format(comision)+"</div></td>";
                html+="</tr>";
            }
            html += "</tbody><tfoot>";
            html+="<td><div class='normal'></div></td>";
            html+="<td><div class='normal'>TOTAL</div></td>";
            html+="<td><div class='normal derecha'>"+format(totalVenta)+"</div></td>";
            html+="<td><div class='normal derecha'>"+format(totalComission)+"</div></td>";
            html += "<tr>";
            html += "</tr>";
            $("#tblPedido").html(html);
            var tamanofiltro = $("#filtrosMenu").outerHeight();
            tamanopantalla = $(window).height() - 195;
            var tamanoHead = tamanopantalla - $("#tblPedido thead").outerHeight() - tamanofiltro;
            $("#tblPedido tbody").css("height", tamanoHead);
        }
    });
}
function reporteMensual() {
    var tienda = $("input[name=tienda]").data("cod");
    var estado = $("#estado option:selected").val();
    $("h1").text("Reporte de Pedido Mensual");
    $("#fechabox").ocultar();
    $("#filtrosMenu > div").css("width", 800);
    estadoReporte = "Mensual";
    cargando(true);
    $.get(url, {proceso: 'reportePedidoMensual', tienda: tienda, estado: estado}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error, "error");
        } else {
            var html = "";
            $("#tblPedido").html("");
            var lista = json.result;
            var html = "<table class='table'>";
            html += "<thead  class='thead-light'>";
            html += "<th><div class='normal'>Periodo</div></th>";
            html += "<th><div class='normal'>Estado</div></th>";
            html += "<th><div class='normal'>Vendido</div></th>";
            html += "<th><div class='normal'>Comision</div></th>";
            html += "</thead><tbody style='height:300px'>";
            var totalVenta=0;
            var totalComission=0;
            for (var i = 0; i < lista.length; i++) {
                var venta=parseFloat(lista[i]["totalPedido"]);
                var comision=parseFloat(lista[i]["comision"]);
                totalVenta+=venta;
                totalComission+=comision;
                var pediodo=meses[lista[i]["mes"]]+" , "+lista[i]["ano"]
                html+="<tr>";
                html+="<td><div class='normal'>"+pediodo+"</div></td>";
                html+="<td><div class='normal'>"+lista[i]["estado"]+"</div></td>";
                html+="<td><div class='normal derecha'>"+format(venta)+"</div></td>";
                html+="<td><div class='normal derecha'>"+format(comision)+"</div></td>";
                html+="</tr>";
            }
            html += "</tbody><tfoot>";
            html+="<td><div class='normal'></div></td>";
            html+="<td><div class='normal'>TOTAL</div></td>";
            html+="<td><div class='normal derecha'>"+format(totalVenta)+"</div></td>";
            html+="<td><div class='normal derecha'>"+format(totalComission)+"</div></td>";
            html += "<tr>";
            html += "</tr>";
            $("#tblPedido").html(html);
            var tamanofiltro = $("#filtrosMenu").outerHeight();
            tamanopantalla = $(window).height() - 195;
            var tamanoHead = tamanopantalla - $("#tblPedido thead").outerHeight() - tamanofiltro;
            $("#tblPedido tbody").css("height", tamanoHead);
        }
    });
}
function imprimir() {
    var contenido = $("#tblPedido").html();
    var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal === null) {
        window.parent.cerrarSession();
        return;
    }
    usuarioLocal = $.parseJSON(usuarioLocal);
    var filtro = "<div class='row' id='filtroReporte'>";
    var de = $("input[name=de]").val();
    var hasta = $("input[name=hasta]").val();
    var tienda = $("input[name=tienda]").val();
    var estado = $("#estado option:selected").text();
    var titulo = "";
    filtro += "<div class='col-12'><span class='negrilla'>FILTROS</div>";
    if (estadoReporte === "Diario") {
        titulo = "REPORTE DE PEDIDO DIARIA";
        filtro += "<div class='col-4'><span class='negrilla'>Fecha: </span>" + de + " - " + hasta + "</div>";
    }
    if (estadoReporte === "Detalle") {
        titulo = "REPORTE DE PEDIDO DETALLADO";
        filtro += "<div class='col-4'><span class='negrilla'>Fecha: </span>" + de + " - " + hasta + "</div>";
    }
    if (estadoReporte === "Mensual") {
        titulo = "REPORTE DE PEDIDO MENSUAL";
    }
    if(tienda!==""){
        filtro += "<div class='col-2'><span class='negrilla'>Tienda: </span>" + tienda + "</div>";
    }
    if(estado!=="-- Estado --"){
        filtro += "<div class='col-2'><span class='negrilla'>Estado: </span>" + estado + "</div>";
    }
    filtro += "</div>";
    imprimirReporte({contenido: contenido, sucursal_id: usuarioLocal.sucursal_id, titulo: titulo, datosHead: filtro, encabezadoThead: true});
}

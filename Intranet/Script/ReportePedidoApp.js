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
            var listaempresas = json.result.empresa;
            
            if(listaempresas){
                var buscadorEmp = json.result.buscadorEmp;
                $("#boxEmp").html(buscadorEmp);
                comboBox({identificador: "input[name=empresa]", datos: listaempresas
                    , codigo: "id_empresa", texto: "nombreEmpresa", todos: true,callback: ()=>generar()});
            }else{
                id_empresa=json.result.idempresa;
            }
            var listaciudad = json.result.ciudad;
            comboBox({identificador: "input[name=ciudad]", datos: listaciudad
                , codigo: "id_ciudad", texto: "nombre", todos: true,callback: ()=>generar()});
            generar();
        }
    });



});
function generar() {
    if (estadoReporte === "Diario" || estadoReporte === "Mensual") {
        reporteMensual(estadoReporte);
    }
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
    var empresa = $("input[name=empresa]").val();
    var ciudad = $("input[name=ciudad]").val();
    var estado = $("#estado option:selected").text();
    var titulo = "";
    filtro += "<div class='col-12'><span class='negrilla'>FILTROS</div>";
    if (estadoReporte === "Diario") {
        titulo = "REPORTE DE PEDIDO DIARIA";
        filtro += "<div class='col-4'><span class='negrilla'>Fecha: </span>" + de + " - " + hasta + "</div>";
    }
    if (estadoReporte === "Mensual") {
        titulo = "REPORTE DE PEDIDO MENSUAL";
    }
    if(empresa!==""){
        filtro += "<div class='col-3'><span class='negrilla'>Empresa: </span>" + empresa + "</div>";
    }
    if(ciudad!==""){
        filtro += "<div class='col-2'><span class='negrilla'>Ciudad: </span>" + ciudad + "</div>";
    }
    if(estado!=="-- Estado --"){
        filtro += "<div class='col-2'><span class='negrilla'>Estado: </span>" + estado + "</div>";
    }
    filtro += "</div>";
    imprimirReporte({contenido: contenido, sucursal_id: usuarioLocal.sucursal_id, titulo: titulo, datosHead: filtro, encabezadoThead: true});
}
function reporteMensual(tipo) {
    var de = $("input[name=de]").val();
    var hasta = $("input[name=hasta]").val();
    var empresa = id_empresa;
    if ($("input[name=empresa]").length > 0) {
        empresa = $("input[name=empresa]").data("cod");
    }
    var ciudad = $("input[name=ciudad]").data("cod");
    var estado = $("#estado option:selected").val();
    $("h1").text("Reporte de Pedido " + tipo);
    if (tipo === "Diario") {
        $("#fechabox").visible();
        $("#filtrosMenu > div").css("width", 800);
    } else {
        $("#fechabox").ocultar();
        $("#filtrosMenu > div").css("width", 620);
    }
    estadoReporte = tipo;
    cargando(true);
    $.get(url, {proceso: 'reportePedido', ciudad: ciudad, empresa: empresa, tipo: tipo
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
            if (estadoReporte === "Mensual") {
                html += "<th><div style='width:115px;'>Periodo</div></th>";
            } else {
                html += "<th><div style='width:115px;'>Fecha</div></th>";
            }
            if ($("input[name=empresa]").length > 0) {
                html += "<th><div class='medio'>Empresa</div></th>";
            }
            html += "<th><div class='normal'>Estado</div></th>";
            html += "<th><div class='normal'>Monto Bs</div></th>";
            html += "<th><div class='normal'>Comision %</div></th>";
            html += "<th><div class='normal'>Comision Bs</div></th>";
            html += "</thead><tbody style='height:300px'>";
            var totalVenta=0;
            var totalComission=0;
            for (var i = 0; i < lista.length; i++) {
                var fecha = lista[i].fecha;
                if (estadoReporte === "Mensual") {
                    fecha = meses[lista[i].mes] + ", " + lista[i].ano;
                }
                totalVenta+=parseFloat(lista[i].vendido);
                totalComission+=parseFloat(lista[i].comisionBs);
                html += "<tr>";
                html += "<td><div style='width:115px;'>" + fecha + "</div></td>";
                if ($("input[name=empresa]").length > 0) {
                    html += "<td><div class='medio'>" + lista[i].nombreEmpresa + "</div></td>";
                }
                html += "<td><div class='normal'>" + lista[i].estado + "</div></td>";
                html += "<td><div class='normal derecha'>" + format(lista[i].vendido) + "</div></td>";
                html += "<td><div class='normal derecha'>" + format(lista[i].comision) + "</div></td>";
                html += "<td><div class='normal derecha'>" + format(lista[i].comisionBs) + "</div></td>";
                html += "</tr>";
            }
            html += "</tbody><tfoot>";
            html += "<tr>";
            html += "<td><div style='width:115px;'></div></td>";
            if ($("input[name=empresa]").length > 0) {
                html += "<td><div class='medio'></div></td>";
            }
            html += "<td><div class='normal'>Total Bs.</div></td>";
            html += "<td><div class='normal derecha'>" + format(totalVenta) + "</div></td>";
            html += "<td><div class='normal derecha'></div></td>";
            html += "<td><div class='normal derecha'>" + format(totalComission) + "</div></td>";
            html += "</tr>";
            $("#tblPedido").html(html);
            var tamanofiltro = $("#filtrosMenu").outerHeight();
            tamanopantalla = $(window).height() - 195;
            var tamanoHead = tamanopantalla - $("#tblPedido thead").outerHeight() - tamanofiltro;
            $("#tblPedido tbody").css("height", tamanoHead);
        }
    });
}


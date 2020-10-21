var url = '../Controlador/IngresosDelivery_Controlador.php';
var contador = 0;
var listaDelivery = {};
var id_delivery = 0;
var posicion = 0;
var tipoDelivery = "pedido";
var tamanopantalla = $(window).height() - 312;
$(document).ready(function () {
    $(".fecha").val(fechaActual());
    $(".fecha").datepicker();
    $("#tbldelivery tbody").css("height", tamanopantalla);
    $(window).resize(function () {
        var tamanopantalla = $(window).height() - 312;
        $("#tbldelivery tbody").css("height", tamanopantalla);
    });
    var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal === null) {
        window.parent.cerrarSession();
        return;
    }
    usuarioLocal = $.parseJSON(usuarioLocal);
    cargando(true);
    $.get(url, {proceso: "ciudades"}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error, "error");
        } else {
            var tipo = json.result.tipo;
            $("#boxTipo").html(tipo);
            var ciudad = json.result.ciudad;
            var ciudapoption = "<option value='' >-- Ciudad --</option>";
            for (var i = 0 in ciudad) {
                if ((usuarioLocal.ADM_ciudad_id + "") === (ciudad[i].id_ciudad + "")) {
                    ciudapoption += "<option value='" + ciudad[i].id_ciudad + "' selected>" + ciudad[i].nombre + "</option>";
                } else {
                    ciudapoption += "<option value='" + ciudad[i].id_ciudad + "' >" + ciudad[i].nombre + "</option>";
                }
            }
            $("#ciudadb").html(ciudapoption);
            $("#ciudad").html(ciudapoption);
            buscar("", 1);
        }
    });

});
function buscar(e, tipo) {
    if (!(e === "" || e.keyCode === 13)) {
        return;
    }
    if ($("#tipo").length > 0) {
        tipoDelivery = $("#tipo option:selected").val();
    }
    if (tipoDelivery === "pedido") {
        $("h1").text("Ingresos Delivery Por Pedidos");
    } else {
        $("h1").text("Ingresos Delivery Por Express");
    }
    buscarPedidos(tipo);
}
function buscarPedidos(tipo) {
    var comision = $("input[name=comision]").val().trim();
    comision = comision === "" ? 0 : parseFloat(comision);
    if (comision < 0) {
        alertaRapida("La comisión no puede ser negativa", "error");
        return;
    }
    if (tipo === 1) {
        contador = 0;
        $("#tbldelivery tbody").html("");
        $("#btncargarMas").visible();
        var html = "<th><div class='grande3'>Nombre del Delivery</div></th>";
        html += "<th><div class='normal'>Pedidos</div></th>";
        html += "<th><div class='normal'>Ingresos</div></th>";
        html += "<th><div class='normal'>Comision "+comision+"%</div></th>";
        $("#tbldelivery thead").html(html);
    }
    comision=comision/100;

    var buscador = $("input[name=buscar]").val();
    var de = $("input[name=de]").val();
    var hasta = $("input[name=hasta]").val();
    var ciudad = $("#ciudadb option:selected").val();
    cargando(true);
    $.get(url, {proceso: "pedidosDelivery", ciudad_id: ciudad, de: de, hasta: hasta
        , buscador: buscador, contador: contador, tipoDelivery: tipoDelivery}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error, "error");
        } else {
            var lista = json.result.data;
            var limite = parseInt(json.result.limite);

            var html = "";
            for (var i = 0; i < lista.length; i++) {
                listaDelivery[lista[i].id_delivery] = lista[i];
                contador++;
                var ingresos = parseFloat(lista[i].ingresos);
                var comisionC = ingresos * comision;
                html += "<tr>";
                html += "<td><div class='grande3 '>" + lista[i].nombre + "</div></td>";
                html += "<td><div class='normal derecha'>" + lista[i].cantidad + "</div></td>";
                html += "<td><div class='normal derecha'>" + format(ingresos) + "</div></td>";
                html += "<td><div class='normal derecha'>" + format(comisionC) + "</div></td>";
                html += "</tr>";
            }
            $("#tbldelivery tbody").append(html);

            $("#tbldelivery").igualartabla();
            $("#maxcant").text(limite);
            $("#actualcant").text(contador);
            if (contador >= limite) {
                $("#btncargarMas").ocultar();
            } else {
                $("#btncargarMas").visible(1);
            }
            calcularTotal();
        }
    });
}
function calcularTotal() {
    var listaTr = $("#tbldelivery tbody tr");
    var totalComision = 0;
    var totalIngreso = 0;
    var totalPedido = 0;
    for (var i = 0; i < listaTr.length; i++) {
        var pedidos = parseFloat($(listaTr[i]).find("div:eq(1)").html());
        var ingresos = parseFloat($(listaTr[i]).find("div:eq(2)").html());
        var comision = parseFloat($(listaTr[i]).find("div:eq(3)").html());
        totalComision += comision;
        totalIngreso += ingresos;
        totalPedido += pedidos;
    }
    var html = "<tr>";
    html += "<td><div class='grande3 derecha'>TOTAL</div></td>";
    html += "<td><div class='normal derecha'>" + format(totalPedido) + "</div></td>";
    html += "<td><div class='normal derecha'>" + format(totalIngreso) + "</div></td>";
    html += "<td><div class='normal derecha'>" + format(totalComision) + "</div></td>";
    html += "</tr>";
    $("#tbldelivery tfoot").html(html);
}
function imprimir() {
    var contenido = $("#contenedorIngresosDelivery").html();
    var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal === null) {
        window.parent.cerrarSession();
        return;
    }
    usuarioLocal = $.parseJSON(usuarioLocal);
    var filtro = "<div class='row' id='filtroReporte'>";
    filtro += "<div class='col-12'><span class='negrilla'>FILTROS</div>";
    var buscador = $("input[name=buscar]").val();
    var de = $("input[name=de]").val();
    var hasta = $("input[name=hasta]").val();
    var ciudad = $("#ciudadb option:selected").text();

    filtro += "<div class='col-6'><span class='negrilla'>Fecha: </span>" + de + " - " + hasta + "</div>";
    if (buscar !== "") {
        filtro += "<div class='col-4'><span class='negrilla'>Buscador: </span>" + buscador + "</div>";
    }
    if (ciudad !== "-- Ciudad --") {
        filtro += "<div class='col-4'><span class='negrilla'>Ciudad: </span>" + ciudad + "</div>";
    }
    var titulo="Reporte Ingresos Delivery";
    if ($("#tipo").length > 0) {
        if (tipoDelivery === "pedido") {
            titulo="Ingresos Delivery Por Pedidos";
            filtro += "<div class='col-4'><span class='negrilla'>Tipo: </span>Pedidos App</div>";
        }else{
            filtro += "<div class='col-4'><span class='negrilla'>Tipo: </span>Pedidos Express</div>";
            titulo="Ingresos Delivery Por Express";
        }
    }
    filtro += "</div>";
    imprimirReporte({contenido: contenido, sucursal_id: usuarioLocal.sucursal_id, titulo: titulo, datosHead: filtro, encabezadoThead: true});
}
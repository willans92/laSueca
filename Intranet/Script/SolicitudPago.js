var url = '../Controlador/SolicitudPago_Controlador.php';
var meses = ["", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
var estadoReporte = "Mensual";
var tamanopantalla = $(window).height() - 195;
var columnaTabla = [];
var listaSolicitudes = [];
var id_solicitud = 0;
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
                , todos: true, callback: () => generar()});
            generar();
        }
    });
});
function cambioEstado() {
    var estado = $("#estado option:selected").val();
    if (estado === "pendiente") {
        $("#fechabox").ocultar();
    } else {
        $("#fechabox").visible();
    }
    generar();
}
function generar() {
    var de = $("input[name=de]").val();
    var hasta = $("input[name=hasta]").val();
    var tienda = $("input[name=tienda]").data("cod");
    var estado = $("#estado option:selected").val();
    $("h1").text("Solicitud de Pago - " + estado);
    cargando(true);
    $.get(url, {proceso: 'solicitudPago', tienda: tienda, de: de, hasta: hasta, estado: estado}, function (response) {
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
            listaSolicitudes = lista;
            var html = "<table class='table'>";
            html += "<thead  class='thead-light'>";
            html += "<th><div class='normal'>Solicitado</div></th>";
            html += "<th><div class='medio'>Tienda</div></th>";
            html += "<th><div class='normal'>Monto Solicitado</div></th>";
            html += "<th><div class='normal'>Tipo</div></th>";
            if (estado === "pagado") {
                html += "<th><div class='normal'>Fecha Pago</div></th>";
                html += "<th><div class='normal'>Nro Trans.</div></th>";
            }
            html += "</thead><tbody style='height:300px'>";
            var totalComission = 0;
            for (var i = 0; i < lista.length; i++) {
                var comision = parseFloat(lista[i]["montoPago"]);
                totalComission += comision;
                html += "<tr data-id='" + lista[i]["id_SolicitudComision"] + "' onClick='modificar(1)' data-pos='" + i + "'>";
                html += "<td><div class='normal'>" + lista[i]["solicitado"] + "</div></td>";
                html += "<td><div class='medio'>" + lista[i]["tienda"] + "</div></td>";
                html += "<td><div class='normal derecha'>" + format(comision) + "</div></td>";
                html += "<td><div class='normal'>" + lista[i]["tipoPago"] + "</div></td>";
                if (estado === "pagado") {
                    html += "<td><div class='normal derecha'>" + lista[i]["fechaPagado"] + "</div></td>";
                    html += "<td><div class='normal derecha'>" + lista[i]["nroDocumento"] + "</div></td>";
                }
                html += "</tr>";
            }
            html += "</tbody><tfoot>";
            html += "<td><div class='normal'></div></td>";
            html += "<td><div class='medio'>TOTAL</div></td>";
            html += "<td><div class='normal derecha'>" + format(totalComission) + "</div></td>";
            html += "<td><div class='normal derecha'></div></td>";
            html += "<tr>";
            html += "</tr>";
            $("#tblPedido").html(html);
            var tamanofiltro = $("#filtrosMenu").outerHeight();
            tamanopantalla = $(window).height() - 195;
            var tamanoHead = tamanopantalla - $("#tblPedido thead").outerHeight() - tamanofiltro;
            $("#tblPedido tbody").css("height", tamanoHead);
            $("#tblPedido").igualartabla();
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
    if (tienda !== "") {
        filtro += "<div class='col-2'><span class='negrilla'>Tienda: </span>" + tienda + "</div>";
    }
    if (estado !== "-- Estado --") {
        filtro += "<div class='col-2'><span class='negrilla'>Estado: </span>" + estado + "</div>";
    }
    filtro += "</div>";
    imprimirReporte({contenido: contenido, sucursal_id: usuarioLocal.sucursal_id, titulo: titulo, datosHead: filtro, encabezadoThead: true});
}
function modificar(tipo) {
    if (tipo === 1) {
        $("#btnmodificar").visible();
    } else {
        var tupla = $("tr.Tuplaseleccionada");
        if (tupla.length === 0) {
            alertaRapida("No ha seleccionado el producto que quiere modificar.");
            return;
        }
        id_solicitud = $(tupla[0]).data("id");
        var item = listaSolicitudes[$(tupla[0]).data("pos")];
        $("input[name=fecha]").val(fechaActual());
        $("input[name=nroDoc]").val("");
        $("#nroCuenta").text(item.cuentaBancaria);
        $("#propietario").text(item.nombreCuenta);
        $("#banco").text(item.banco);
        $("#moneda").text(item.moneda);
        cargando(true);
        $('#popPago').modal('show');
        $.get(url, {proceso: 'detalleSolicitud', id_solicitud: id_solicitud}, function (response) {
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
                var totalComission = 0;
                var totalVenta = 0;
                for (var i = 0; i < lista.length; i++) {
                    var comision = parseFloat(lista[i]["comision"]);
                    var monto = parseFloat(lista[i]["totalPedido"]);
                    totalComission += comision;
                    totalVenta += monto;
                    html += "<tr>";
                    html += "<td><div class='normal'>" + lista[i]["fechaProgramada"] + "</div></td>";
                    html += "<td><div class='medio'>" + lista[i]["cliente"] + "</div></td>";
                    html += "<td><div class='normal'>" + format(monto) + "</div></td>";
                    html += "<td><div class='normal'>" + format(comision) + "</div></td>";
                    html += "</tr>";
                }

                $("#detalletbl tbody").html(html);
                $("#detalletbl").igualartabla();


                html = "<td><div class='normal'></div></td>";
                html += "<td><div class='medio'>TOTAL</div></td>";
                html += "<td><div class='normal'>" + format(totalVenta) + "</div></td>";
                html += "<td><div class='normal'>" + format(totalComission) + "</div></td>";
                $("#detalletbl tfoot").html(html);

            }
        });

    }
}
function registrar(tipo) {
    var json = variables("#popPago");
    json.proceso = 'registrarPago';
    json.id_solicitud = id_solicitud;
    if (json.nroDoc === "") {
        $("#errorPop").html("El Nro. Transacion se encuentra vacio.");
        $("input[name=nroDoc]").addClass("rojoClarito");
        return;
    } else {
        $("input[name=nroDoc]").removeClass("rojoClarito");
    }
    if (!validar("entero", json.nroDoc)) {
        $("#errorPop").html("El Nro. Transacion solo recibe caracteres numericos.");
        $("input[name=nroDoc]").addClass("rojoClarito");
        return;
    } else {
        $("input[name=nroDoc]").removeClass("rojoClarito");
    }


    if (tipo == 1) {
        $("body").msmPregunta("¿Esta seguro de realizar el pago?", "registrar(2)");
        return;
    }

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
            $('#popPago').modal('hide');
            $("#btnmodificar").ocultar();
            alertaRapida("El pago se registro correctamente.");
            generar();
        }
    });
}
function cancelar(tipo) {
    var json = {};
    json.proceso = 'cancelarSolicitud';
    json.id_solicitud = id_solicitud;
    if (tipo == 1) {
        $("body").msmPregunta("¿Esta seguro de cancelar la solicitud?", "cancelar(2)");
        return;
    }

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
            $('#popPago').modal('hide');
            $("#btnmodificar").ocultar();
            alertaRapida("La solicitud fue cancelada correctamente.");
            generar();
        }
    });
}

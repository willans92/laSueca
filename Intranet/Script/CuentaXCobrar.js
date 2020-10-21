var url = '../Controlador/CuentaXCobrar_Controlador.php';
var meses = ["", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
var id_Venta = 0;
var tamanopantalla = $(window).height() - 300;
var listaCuentas = [];
var cantidad = 50;
var contador = 0;
var filtro = "";
$(document).ready(function () {
    $(".fecha").datepicker();
    $(".fecha").val(fechaActual());
    $("#tblcobranza tbody").css("height", tamanopantalla);
    $(window).resize(function () {
        var tamanopantalla = $(window).height() - 300;
        $("#tblcobranza tbody").css("height", tamanopantalla);
    });
    var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal === null) {
        window.parent.cerrarSession();
        return;
    }
    usuarioLocal = JSON.parse(usuarioLocal);
    var listaUsuario = window.parent.listaUsuario;
    comboBox({identificador: "#cobrador", valueDefault: usuarioLocal.id_usuario, datos: listaUsuario, codigo: "id_usuario", texto: "nombre", todos: false});
    buscar("", 1);
});
function buscar(e, tipo) {
    if (!(e === "" || e.keyCode === 13)) {
        return;
    }
    if (tipo === 1) {
        contador = 0;
        $("#btncargarMas").visible();
        $("#btnmodificar").ocultar();
    }
    var buscador = $("input[name=buscador]").val().trim();
    filtro = buscador;
    cargando(true);
    $.post(url, {proceso: 'cuentaXcobrar', buscador: buscador, cantidad: cantidad, contador: contador}, function (response) {
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
            var totalDeuda = 0;
            var totalPagado = 0;
            var totalSaldo = 0;
            for (var i = 0; i < lista.length; i++) {
                contador++;
                var deuda = parseFloat(lista[i].deuda);
                var pagado = parseFloat(lista[i].pagado);
                var saldo = deuda - pagado;
                totalDeuda += deuda;
                totalPagado += pagado;
                totalSaldo += saldo;
                html += "<tr onclick='modificar(1)' data-id='" + lista[i].id_venta + "'>";
                html += "<td><div style=' width:95px;'>" + lista[i].fecha.substring(0, 10) + "</div></td>";
                html += "<td><div class='pequeno'>" + lista[i].ci + "</div></td>";
                html += "<td><div class='medio'>" + lista[i].nombre + "</div></td>";
                html += "<td><div class='pequeno subrayar' onclick=\"redireccionar('Venta'," + lista[i].id_venta + ")\">" + lista[i].nroDocumento + "</div></td>";
                html += "<td><div class='normal'>" + lista[i].descripcion + "</div></td>";
                html += "<td><div class='normal derecha'>" + format(deuda) + "</div></td>";
                html += "<td><div class='normal derecha'>" + format(pagado) + "</div></td>";
                html += "<td><div class='normal derecha'>" + format(saldo) + "</div></td>";
                html += "</tr>";
            }
            if (tipo === 1) {
                $("#tblcobranza tbody").html(html);
            } else {
                if (html.length > 0) {
                    $("#tblcobranza  tbody").append(html);
                }
            }

            html = "<tfoot>";
            html += "<tr>";
            html += "<td><div style=' width:95px;'></div></td>";
            html += "<td><div class='pequeno'></div></td>";
            html += "<td><div class='medio'></div></td>";
            html += "<td><div class='pequeno'></div></td>";
            html += "<td><div class='normal'>TOTAL</div></td>";
            html += "<td><div class='normal derecha'>" + format(totalDeuda) + "</div></td>";
            html += "<td><div class='normal derecha'>" + format(totalPagado) + "</div></td>";
            html += "<td><div class='normal derecha'>" + format(totalSaldo) + "</div></td>";
            $("#tblcobranza tfoot").html(html);
            $("#tblcobranza").igualartabla();
            $("#actualcant").text(contador);
            $("#maxcant").text(limite);
            if (limite > contador) {
                $("#btncargarMas").visible(1);
            } else {
                $("#btncargarMas").ocultar();
            }
        }
    });
}
function modificar(tipo) {
    if (tipo === 1) {
        $("#btnmodificar").visible();
    } else {
        var tr = $("#tblcobranza tr.Tuplaseleccionada");
        id_Venta = $(tr[0]).data("id");
        cargando(true);
        $.get(url, {proceso: 'detalleCobranza', idventa: id_Venta}, function (response) {
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
                for (var i = 0; i < lista.length; i++) {
                    html += "<tr>";
                    html += "    <td><div class='pequeno'>" + lista[i].fecha + "</div></td>";
                    html += "    <td><div class='pequeno subrayar'  onclick=\"redireccionar('Cobranza'," + lista[i].id_cobranza + ")\">" + lista[i].nroDocumento + "</div></td>";
                    html += "    <td><div class='medio'>" + lista[i].detalle + "</div></td>";
                    html += "    <td><div class='pequeno'>" + format(lista[i].pagado) + "</div></td>";
                    html += "    <td><div class='medio'>" + lista[i].cobrador + "</div></td>";
                    html += "</tr>";
                }
                if (lista.length === 0) {
                    html += "<tr>";
                    html += "    <td><div style='width:524px'>No hay ningun registro</div></td>";
                    html += "</tr>";
                }
                var tupla = $("#tblcobranza tr.Tuplaseleccionada");
                var tr = $(tupla[0]);
                var deuda = tr.find("div:eq(7)").html().replace(/\./g, '').replace(/\,/g, '.');
                $("input[name=montoApagar]").val(deuda);
                $("#fechaCobranza").html(tr.find("div:eq(0)").html());
                $("#nroDocumentoCobranza").html(tr.find("div:eq(3)").html());
                $("#clienteCobranza").html(tr.find("div:eq(2)").html());
                $("#montoEndeudadoCobranza").html(tr.find("div:eq(5)").html());
                $("#montoCobrado").html(tr.find("div:eq(6)").html());
                $("#saldoDeudaCobranza").html(tr.find("div:eq(7)").html());
                $("#cuentaXCobrarpop").centrar();
                $("#saldo").html(0.00);
                $("#tblDetalleCobro tbody").html(html);
                $('#popCuentas').modal('show');
                //$("#tblDetalleCobro").igualartabla();
            }
        });
    }
}

function calcularSaldo() {
    var monto = $("input[name=montoApagar]").val();
    monto = monto === "" ? 0.00 : parseFloat(monto.replace(/\./g, '').replace(/\,/g, '.'));
    var saldo = $("#saldoDeudaCobranza").html();
    saldo = saldo === "" ? 0.00 : parseFloat(saldo.replace(/\./g, '').replace(/\,/g, '.'));

    var nuevoSaldo = saldo - monto;
    $("#saldo").html(format(nuevoSaldo));

}
function registrarCobro() {
    var saldo = parseFloat($("#saldo").html().replace(/\./g, '').replace(/\,/g, '.'));
    var monto = $("input[name=montoApagar]").val();
    monto = monto === "" ? 0.00 : parseFloat(monto.replace(/\./g, '').replace(/\,/g, '.'));
    if (saldo < 0) {
        $("#errorPop").html("El monto cobrado no puede ser mayor a la deuda.");
        return;
    }
    if (monto <= 0) {
        $("#errorPop").html("El monto cobrado no puede ser menor o igual 0.");
        return;
    }
    var comentario = $("input[name=comentario]").val();
    var metodoPago = $("#tipoPago option:selected").val();
    var cobrador = $("#cobrador").data("cod");
    var fecha = $("input[name=fechaCobro]").val();
    cargando(true);
    $.post(url, {proceso: 'registrarCobranza', fecha: fecha, idventa: id_Venta, monto: monto
        , comentario: comentario, metodopago: metodoPago, cobrador: cobrador}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error, "error");
        } else {
            $('#popCuentas').modal('hide');
            alertaRapida("La cobranza se realizo correctamente.");
            var detalle = json.result.detalle;
            var cobranza = json.result.cobranza;
            imprimirDocumentoCobranza(cobranza, detalle, () => buscar("", 1));
        }
    });
}
function imprimir() {
    var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal === null) {
        window.parent.cerrarSession();
        return;
    }
    usuarioLocal = $.parseJSON(usuarioLocal);
    var datosHead = "";
    if (filtro.length > 0) {
        datosHead = "<div><span class='negrilla'>Filtrado Por: </span>" + filtro + "</div>";
    }
    if ($("#btncargarMas").css("display") !== "none") {
        datosHead += "<div><span class='negrilla'>Cantidad Registro: </span>" + contador + " de " + $("#maxcant").text() + "</div>";
    } else {
        datosHead += "<div><span class='negrilla'>Cantidad Registro: </span>" + contador + " de " + contador + "</div>";
    }
    imprimirReporte({contenido: $("#contenedorTabla").html(), sucursal_id: usuarioLocal.sucursal_id, titulo: "CUENTA POR COBRAR", datosHead: datosHead});
}

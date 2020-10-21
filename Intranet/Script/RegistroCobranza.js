var url = '../Controlador/RegistroCobranza_Controlador.php';
var id_Cobranza = 0;
var tipoCambio = 6.96;
var clienteSeleccionado;
var listaCuentasXCliente = {};
var tamanopantalla = $(window).height() - 282;
var estadoModificacion = false;
var imprimirRegistro=false;
var cobranzaObj;
var detalleCobranzaObj;
$(document).ready(function () {
    var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal === null) {
        window.parent.cerrarSession();
        return;
    }
    $("#contenedorRegistro").css("height", tamanopantalla);
    $(window).resize(function () {
        var tamanopantalla = $(window).height() - 282;
         $("#contenedorRegistro").css("height", tamanopantalla);
    });
    usuarioLocal = $.parseJSON(usuarioLocal);
    var listaUsuario = window.parent.listaUsuario;
    comboBox({identificador: "input[name=cobrador]", datos: listaUsuario, codigo: "id_usuario", texto: "nombre", todos: false});
    var listaCliente = window.parent.listaCliente;
    comboBox({identificador: "input[name=buscadorCliente]", datos: listaCliente, codigo: "id_cliente", texto: "ci", texto2: "nombre", todos: false, callback: (item) => seleccionarCliente(item)});
    $(".fecha").datepicker();
    $(".fecha").val(fechaActual());
    var cobranzaLocal = localStorage.getItem("idcobranza");
    if (cobranzaLocal !== null) {
        id_Cobranza = parseInt(cobranzaLocal);
        localStorage.removeItem("idcobranza");
    }
    nuevo(0);
    
});
function seleccionarCliente(cliente) {
    $("#txtci").html(cliente.ci);
    $("#txtnombre").html(cliente.nombre);
    clienteSeleccionado = cliente;
    cargando(true);
    $.get(url, {proceso: 'cuentaxcobrarCliente', idcliente: cliente.id_cliente}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error,"error");
        } else {
            $("input[name=montoApagar]").removeClass("rojoClarito");
            var cuentaxpagar = json.result;
            var html = "";
            var totalDeuda = 0;
            var totalSaldo = 0;
            var totalPagado = 0;
            for (var i = 0; i < cuentaxpagar.length; i++) {
                var cuenta = cuentaxpagar[i];
                var tipoDocumento = cuenta.tipoDocumento;
                var nroDocumento = cuenta.nroDocumento;
                var nro = "NV-" + nroDocumento;
                if (tipoDocumento === "Factura") {
                    nro = "VF-" + nroDocumento;
                }
                var deuda = parseFloat(cuenta.deuda);
                var pagado = parseFloat(cuenta.pagado);
                var saldo = deuda - pagado;
                totalDeuda += deuda;
                totalSaldo += saldo;
                totalPagado += pagado;
                html += "<tr>";
                html += "<td><div class='chico2'><input type='checkbox' value='" + saldo + "' data-idventa='" + cuenta.id_venta + "' onchange='calcularPagoCuenta()'></div></td>";
                html += "<td><div class='pequeno fechaCXC'>" + cuenta.fecha + "</div></td>";
                html += "<td><div class='normal nroCXC subrayar' onclick=\"redireccionar('Venta'," + cuenta.id_venta + ")\">" + nro + "</div></td>";
                html += "<td><div class='normal descCXC'>" + cuenta.descripcion + "</div></td>";
                html += "<td><div class='pequeno'>" + format(deuda) + "</div></td>";
                html += "<td><div class='pequeno'>" + format(pagado) + "</div></td>";
                html += "<td><div class='pequeno saldoCXC'>" + format(saldo) + "</div></td>";
                html += "</tr>";
            }
            $("#tblCuentaXCobrar tbody").html(html);
            html = "<tr>";
            html += "<td><div class='chico2'></div></td>";
            html += "<td><div class='pequeno'></div></td>";
            html += "<td><div class='normal'></div></td>";
            html += "<td><div class='normal'>TOTAL</div></td>";
            html += "<td><div class='pequeno'>" + format(totalDeuda) + "</div></td>";
            html += "<td><div class='pequeno'>" + format(totalPagado) + "</div></td>";
            html += "<td><div class='pequeno'>" + format(totalSaldo) + "</div></td>";
            html += "</tr>";
            $("#tblCuentaXCobrar tfoot").html(html);

        }
    });
}
function calcularPagoCuenta() {
    $("input[name=montoApagar]").removeClass("rojoClarito");
    $("#errorPop").html("");
    var lista = $("#tblCuentaXCobrar tbody input:checked");
    var totalDeuda = 0;
    for (var i = 0; i < lista.length; i++) {
        var saldoDeuda = $(lista[i]).val();
        totalDeuda += parseFloat(saldoDeuda);
    }
    if (lista.length > 0) {
        $("#contenedorPago").css("display", "flex");
        $("#btnagregarcobro").visible();
    } else {
        $("#contenedorPago").ocultar();
        $("#btnagregarcobro").ocultar();
    }
    $("#montoCuentaXcobrar").html(format(totalDeuda));
    $("#saldoCuentaXcobrar").html(0.00);
    $("input[name=montoApagar]").val(totalDeuda);
}
function calcularSaldoDeuda() {
    var monto = $("#montoCuentaXcobrar").html().trim();
    monto = monto === "" ? 0 : parseFloat(monto.replace(/\./g, '').replace(/\,/g, '.'));
    var pago = $("input[name=montoApagar]").val().trim();
    pago = pago === "" ? 0 : parseFloat(pago);
    var saldo = monto - pago;
    if (saldo < 0) {
        $("#errorPop").html("Se esta pagando por demas");
        $("input[name=montoApagar]").addClass("rojoClarito");

    } else {
        $("#errorPop").html("");
        $("input[name=montoApagar]").removeClass("rojoClarito");
    }
    $("#saldoCuentaXcobrar").html(format(saldo));
}
function nuevo(tipo) {
    $("#formVenta input").val("");
    var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal === null) {
        window.parent.cerrarSession();
        return;
    }
    usuarioLocal = $.parseJSON(usuarioLocal);
    $("input[name=cobrador]").val(usuarioLocal.nombre);
    $("input[name=cobrador]").data("cod", usuarioLocal.id_usuario);
    $(".fecha").val(fechaActual());
    $("#btnmodificar").ocultar();
    $("#btnagregar").ocultar();
    $("#btnImprimir").ocultar();
    $("#contenedorRegistro").html("");
    $("#txtInformacion").html("");
    $("#vlueInformacion").html("");
    $("#txtInformacion").removeClass("txtRojo");
    listaCuentasXCliente={};
    if (tipo === 1) {
        id_Cobranza = 0;
        $("h1").text("Nuevo Registro de Cobranza");
        $("#formCobranza input").attr("disabled", false);
        $("#formCobranza select").attr("disabled", false);
        $("#btncancelar").visible();
        $("#btnregistrar").visible();
        $("#btnagregar").visible();
        $("#btnnuevo").ocultar();
        $("#navegadorRegistro").ocultar();
        $("#btnimprimir").ocultar();
        $("#btneliminar").ocultar();
        $(".removeX").visible();
        $("#btneliminar").ocultar();
        $("input[name=detalle]").val("Registro de Cobranza");
        $("input[name=nroDocumento]").val("");
        estadoModificacion = true;
    } else {
        $("h1").text("Registro de Cobranza");
        $("#formCobranza input").attr("disabled", true);
        $("#formCobranza select").attr("disabled", true);
        $("#btncancelar").ocultar();
        $("#btnregistrar").ocultar();
        $("#btnnuevo").visible();
        $("#navegadorRegistro").visible();
        $("#btneliminar").ocultar();
        $("#btnimprimir").ocultar();
        $(".removeX").ocultar();
        $("#btneliminar").ocultar();
        estadoModificacion = false;
        if (id_Cobranza !== 0) {
            cargarCobranza("actual");
        }
    }
}
function modificar() {
    $("h1").text("Modificando Registro de Cobranza");
    $("#formCobranza input").attr("disabled", false);
    $("#formCobranza select").attr("disabled", false);
    $("#btncancelar").visible();
    $("#btnregistrar").visible();
    $("#btnnuevo").ocultar();
    $("#btnimprimir").ocultar();
    $("#btnmodificar").ocultar();
    $("#btnImprimir").ocultar();
    $("#btneliminar").ocultar();
    $("#navegadorRegistro").ocultar();
    $("#btnagregar").visible();
    $(".removeX").visible();
    estadoModificacion = true;
}
function popAgregar(tipo) {
    if (tipo === 1) {
        $("#contenedorPago").ocultar();
        $("#btnagregarcobro").ocultar();
        $("input[name=montoApagar]").removeClass("rojoClarito");
        $("#popCobranza tbody").html("");
        $("#popCobranza input").val("");
        $("#txtci").html("");
        $("#txtnombre").html("");
        $('#popCobranza').modal('show');
        $("input[name=buscadorCliente]").data("cod", 0);
        $("input[name=buscadorCliente]").data("pos", -1);
    } else {
        $('#popCobranza').modal('hide');
    }
}
function agregarCobranza() {
    var monto = $("#montoCuentaXcobrar").html().trim();
    monto = monto === "" ? 0 : parseFloat(monto.replace(/\./g, '').replace(/\,/g, '.'));
    var pago = $("input[name=montoApagar]").val().trim();
    pago = pago === "" ? 0 : parseFloat(pago);
    var saldo = monto - pago;
    if (saldo < 0) {
        $("#errorPop").html("Se esta pagando por demas");
        $("input[name=montoApagar]").addClass("rojoClarito");
    } else {
        $("#errorPop").html("");
        $("input[name=montoApagar]").removeClass("rojoClarito");
    }
    if (pago === 0) {
        $("#errorPop").html("No se puede agregar un pago de 0.00 bs");
        $("input[name=montoApagar]").addClass("rojoClarito");
    } else {
        $("#errorPop").html("");
        $("input[name=montoApagar]").removeClass("rojoClarito");
    }
    listaCuentasXCliente[clienteSeleccionado.id_cliente] = [];
    var lista = $("#tblCuentaXCobrar tbody input:checked");
    var totalAgregado=0;
    for (var i = 0; i < lista.length; i++) {
        var item = $(lista).parent().parent().parent();
        var idventa = $(lista).data("idventa");
        var fecha = item.find("div.fechaCXC").html();
        var nro = item.find("div.nroCXC").html();
        var desc = item.find("div.descCXC").html();
        var saldo = parseFloat(item.find("div.saldoCXC").html().replace(/\./g, '').replace(/\,/g, '.'));
        if (pago <= saldo) {
            saldo = pago;
            pago = 0;
        } else {
            pago -= saldo;
        }
        var cuenta = {id_venta: idventa, fecha: fecha, nro: nro, desc: desc, pago: saldo};
        totalAgregado+=saldo;
        listaCuentasXCliente[clienteSeleccionado.id_cliente].push(cuenta);
    }
    alertaRapida("Se agrego el cobro de "+totalAgregado+" Bs del cliente "+clienteSeleccionado.nombre);
    popAgregar(0);
    estructurarCobranzaXcliente();
}
function estructurarCobranzaXcliente() {
    var listaCliente = window.parent.listaCliente;
    var html = "";
    var totalGeneral = 0;
    for (var i in listaCuentasXCliente) {
        var item = listaCuentasXCliente[i];
        var cliente = listaCliente["c" + i];
        var ocultar = "display:none";
        if (estadoModificacion) {
            ocultar = "";
        }
        html += "<div class='itemCobranza'>";
        html += "<div style='padding-bottom:15px;'><span class='negrilla' style='margin-right: 6px;'>Código: </span><span class='subrayar' onclick=\"redireccionar('Cliente'," + i + ")\">" + cliente.codigo + " </span><span class='negrilla' style='margin-right: 6px; margin-left: 6px;'>CI: </span><span>" + cliente.ci + "</span><span class='negrilla' style='margin-right: 6px; margin-left: 24px;'>Cliente: </span>" + cliente.nombre + " <span aria-hidden='true' style='float: right; font-size: 23px; margin-top: -16px; " + ocultar + "' onclick='quitarRegistro(" + i + ")' class='removeX'>&times;</span></div>";
        html += "<table class='table'>";
        html += "    <thead class='thead-light'>";
        html += "    <th><div class='pequeno'>Facturado</div></th>";
        html += "    <th><div class='normal'>Doc. de Venta</div></th>";
        html += "    <th><div class='grande2'>Detalle</div></th>";
        html += "    <th><div class='normal'>Monto Cobrado</div></th>";
        html += "    </thead>";
        html += "<tbody>";
        var total = 0;
        for (var j = 0; j < item.length; j++) {
            var valor = item[j];
            var monto = parseFloat(valor.pago);
            total += monto;
            html += "<tr>";
            html += "    <td><div class='pequeno'>" + valor.fecha + "</div></td>";
            html += "    <td><div class='normal subrayar' onclick=\"redireccionar('Venta'," + valor.id_venta + ")\">" + valor.nro + "</div></td>";
            html += "    <td><div class='grande2'>" + valor.desc + "</div></td>";
            html += "    <td><div class='normal derecha'>" + format(monto) + "</div></td>";
            html += "</tr>";
        }
        totalGeneral += total;
        html += "</tbody>";
        html += "<tfoot>";
        html += "    <td><div class='pequeno'></div></td>";
        html += "    <td><div class='normal'></div></td>";
        html += "    <td><div class='grande2 derecha'>TOTAL</div></td>";
        html += "    <td><div class='normal derecha'>" + format(total) + "</div></td>";
        html += "<tfoot>";
        html += "</table> ";
        html += "</div>";
    }
    html += "<div style='margin-top: 17px;'>";
    html += "<table  class='table'>";
    html += "<tfoot>";
    html += "    <td style='border: none;'><div class='pequeno'></div></td>";
    html += "    <td style='border: none;'><div class='normal'></div></td>";
    html += "    <td style='border: none;'><div class='grande2 derecha'>TOTAL COBRADO</div></td>";
    html += "    <td style='border: none;'><div class='normal derecha'>" + format(totalGeneral) + "</div></td>";
    html += "<tfoot>";
    html += "</table> ";
    html += "</div> ";
    $("#contenedorRegistro").html(html);
}
function quitarRegistro(idcliente) {
    $("body").msmPregunta("¿Esta seguro que desea eliminar el registro?", "removerRegistro(" + idcliente + ")");
}
function removerRegistro(idcliente) {
    var totalAgregado=0;
    for (var i = 0; i < listaCuentasXCliente[idcliente].length; i++) {
        totalAgregado+=listaCuentasXCliente[idcliente][i].pago;
    }
    var listaCliente = window.parent.listaCliente;
    var cliente=listaCliente["c"+idcliente];
    alertaRapida("Se elimino el registro de "+totalAgregado+" Bs del cliente "+cliente.nombre,"error");
    delete listaCuentasXCliente[idcliente];
    estructurarCobranzaXcliente();
}
function registrar() {
    var fecha = $("input[name=fecha]").val();
    var desc = $("input[name=detalle]").val();
    var tp = $("input[name=tipoCambio]").val();
    var cobrador = $("input[name=cobrador]").data("cod");
    var metodoPago = $("#metodoPago option:selected").val();
    var detalle = [];
    for (var i in listaCuentasXCliente) {
        var item = listaCuentasXCliente[i];
        for (var j = 0; j < item.length; j++) {
            var valor = item[j];
            detalle.push({idventa: valor.id_venta, monto: valor.pago, desc: valor.desc})
        }
    }
    if(detalle.length===0){
        alertaRapida("No se puede registrar la cobranza porque no ha ingresado ningun cobro.","error");
        return;
    }
    cargando(true);
    $.post(url, {id_Cobranza: id_Cobranza, proceso: "registrarCobranza", fecha: fecha, detalle: desc, tp: tp, cobrador: cobrador, metodopago: metodoPago, detallePago: detalle}, function (response) {
        cargando(false);
        $('#popVenta').modal('hide');
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error,"error");
        } else {
            nuevo(0);
            imprimirRegistro=true;
            id_Cobranza = json.result;
            cargarCobranza("actual");
        }
    });
}
function cargarCobranza(tipo) {
    cargando(true);
    $.get(url, {proceso: 'buscarCobranza', tipo: tipo, idcobranza: id_Cobranza}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error,"error");
        } else {
            var cob = json.result.cobranza;
            var listaUsuario = window.parent.listaUsuario;
            if (cob.estado === "activo") {
                $("#txtInformacion").html("Ult. Actualización");
                $("#txtInformacion").removeClass("txtRojo");
                $("#btneliminar").visible();
                $("#btnmodificar").visible();
            } else {
                $("#txtInformacion").html("Registro Eliminado");
                $("#txtInformacion").addClass("txtRojo");
                $("#btneliminar").ocultar();
                $("#btnmodificar").ocultar();
            }
            var modificadopor=listaUsuario["u"+cob.modificadoPor] ;
            $("#vlueInformacion").html(cob.fechaModificacion+" , "+modificadopor.nombre);



            id_Cobranza = cob.id_cobranza;
            $("input[name=fecha]").val(cob.fecha.substring(0,10));
            $("input[name=nroDocumento]").val(cob.nroDocumento);
            $("input[name=detalle]").val(cob.detalle);
            $("input[name=tipoCambio]").val(6.96);
            $("input[name=cobrador]").data("cod", cob.cobradoPor);
            $("input[name=cobrador]").val(listaUsuario["u" + cob.cobradoPor].nombre);
            $("#metodoPago option[value='" + cob.metodoPago + "']").prop("selected", true);
            var detalle = json.result.detalle;
            listaCuentasXCliente = {};
            for (var i = 0; i < detalle.length; i++) {
                if (!listaCuentasXCliente[detalle[i].cliente_id]) {
                    listaCuentasXCliente[detalle[i].cliente_id] = [];
                }
                listaCuentasXCliente[detalle[i].cliente_id].push({id_venta: detalle[i].venta_id
                    , pago: parseFloat(detalle[i].monto), desc: detalle[i].detalle
                    , fecha: detalle[i].fechaFacturacion, nro: detalle[i].nroDocVenta});
            }
            if(detalle.length>0){
                $("#btnImprimir").visible();
            }
            cobranzaObj=cob;
            detalleCobranzaObj=detalle;
            estructurarCobranzaXcliente();
            if(imprimirRegistro){
                imprimirRegistro=false;
                imprimir();
            }
        }
    });
}
function eliminarCobranza(tipo) {
    if (tipo === 1) {
        $("body").msmPregunta("¿Esta seguro de eliminar este registro de cobranza?", "eliminarCobranza(2)");
    } else {
        $.post(url, {proceso: "eliminarCobranza", id_Cobranza: id_Cobranza}, function (response) {
            cargando(false);
            var json = $.parseJSON(response);
            if (json.error.length > 0) {
                if ("Error Session" === json.error) {
                    window.parent.cerrarSession();
                }
                alertaRapida(json.error,"error");
            } else {
                nuevo(0);
                alertaRapida("El registro se elimino correctamente.");
            }
        });
    }
}
function imprimir() {
    imprimirDocumentoCobranza(cobranzaObj, detalleCobranzaObj);
}

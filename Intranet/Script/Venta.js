var url = '../Controlador/Venta_Controlador.php';
var contador = 0;
var listaCliente = {};
var listaProducto = [];
var listalote = {};
var id_Venta = 0;
var id_Cliente = 0;
var htmlColumna = '';
var tipoCambio = 6.96;
var tipoVenta = "Contado"
var tamanopantalla = $(window).height() - 430;
var tipoDocumento2 = "";
var datosVentaSeleccionada = {};
var nroPendientes = 0;
$(document).ready(function () {
    $('#impresion').contents().find("head").append($("<link href='../Estilo/bootstrap.min.css' rel='stylesheet' type='text/css'/><link href='../Estilo/Estilo.css' rel='stylesheet' type='text/css'/><link href='../Estilo/ImpresionReporte.css' rel='stylesheet'  type='text/css'/>"));
    $("#tblprd tbody").css("height", tamanopantalla);
    $(window).resize(function () {
        var tamanopantalla = $(window).height() - 430;
        $("#tblprd tbody").css("height", tamanopantalla);
    });
    $(".fecha").datepicker();
    $(".fecha").val(fechaActual());
    var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal === null) {
        window.parent.cerrarSession();
        return;
    }
    usuarioLocal = $.parseJSON(usuarioLocal);
    var listaSucursal = window.parent.sucursalOption;
    var empresa = window.parent.empresaD;

    $("#sucursal").html(listaSucursal);
    $("#sucursal option[value=" + usuarioLocal.sucursal_id + "]").prop("selected", true);
    $("#sucursal option[value=0]").remove();

    var listaSucursalRapida = window.parent.listaSucursalRapida;
    var sucursal = listaSucursalRapida["s" + usuarioLocal.sucursal_id];

    var listaUsuario = window.parent.listaUsuario;
    var option = "";
    for (var i in listaUsuario) {
        option += "<option value='" + listaUsuario[i].id_usuario + "'>" + listaUsuario[i].nombre + "</option>";
    }

    $("#cobrador").html(option);
    $("#vendedor").html(option);
    $("#vendedor option[value=" + usuarioLocal.usuario_id + "]").prop("selected", true);
    $("#cobrador option[value=" + usuarioLocal.usuario_id + "]").prop("selected", true);
    var listaPermisosUsuarioRapido = window.parent.listaPermisosUsuarioRapido;
    var cssPermiso = ""
    if (!listaPermisosUsuarioRapido[60]) {
        cssPermiso = "inabilitar";
    }
    htmlColumna += "<tr ondblclick='eliminarColumna(this)' data-stock='0'>";
    htmlColumna += "<td><div class='grande3'><input autocomplete='off' name='productoTabla' data-cod='0' data-pos='-1' type='text' class='izquierda'  onkeyup='cambiarLado(event,this);'></div></td>";
    htmlColumna += "<td><div class='pequeno'><input type='number' name='cantidad' data-historico='0' step=0 min=0 class='derecha' onkeyup='calcular(); cambiarLado(event,this);'  onblur='calcular()'></div></td>";
    htmlColumna += "<td><div class='pequeno precioUnidad'></div></td>";
    htmlColumna += "<td><div class='pequeno'></div></td>";
    htmlColumna += "<td><div class='pequeno derecha descuentoDiv'>0.00</div></td>";
    htmlColumna += "<td><div class='pequeno derecha'>0.00</div></td>";
    htmlColumna += "<td class='" + cssPermiso + "'><div class='normal derecha'><input type='text' data-cod='0' onkeyup='cambiarLado(event,this);' name='loteCbx' autocomplete='off'></div></td>";
    htmlColumna += "<td class='" + cssPermiso + "'><div class='pequeno derecha vencimientoLote'></div></td>";
    htmlColumna += "</tr>";
    var ventaLocal = localStorage.getItem("idventa");
    if (ventaLocal !== null) {
        id_Venta = parseInt(ventaLocal);
        localStorage.removeItem("idventa");
    }
    nuevo(0);
    window.parent.Version();
});

function nuevo(tipo) {
    $("#formVenta input").val("");
    $("input[name=nombre]").data("cod", "0");
    $("input[name=nombre]").data("pos", "-1");
    $(".fecha").val(fechaActual());
    $("#btnmodificar").ocultar();
    $("#tblprd tbody").html(htmlColumna);
    $("#tblprd tbody").append(htmlColumna);
    $("#tblprd tbody").append(htmlColumna);
    $("#tblprd tbody").append(htmlColumna);
    $("#tblprd").igualartabla();
    tipoVenta = "Contado"
    id_Cliente = 0;
    $("#popVenta").limpiarFormulario();
    $("#errorPop").html("");
    tipoDocumento2 = "";
    if (tipo === 1) {
        $("#txtInformacion").html("");
        $("#vlueInformacion").html("");
        id_Venta = 0;
        $("h1").text("Nueva Venta");
        $("#formVenta input").attr("disabled", false);
        $("#formVenta select").attr("disabled", false);
        $("#tblprd input").attr("disabled", false);
        $("#btncancelar").visible();
        $("#btnregistrar").visible();
        $("#btnnuevo").ocultar();
        $("#navegadorRegistro").ocultar();
        $("#btnimprimir").ocultar();
        $("#btnanular").ocultar();
        $("input[name=detalle]").val("Venta Al Contado");
        var usuarioLocal = localStorage.getItem("usuario");
        $("#sucursal option[data-estado='inactivo']").css("display", "none");
        usuarioLocal = $.parseJSON(usuarioLocal);
        $("#sucursal option[value=" + usuarioLocal.sucursal_id + "]").prop("selected", true);
        cargarStock();
    } else {
        $("input[name=descuento]").removeClass("rojoClarito");
        $("h1").text("Venta");
        $("#formVenta input").attr("disabled", true);
        $("#formVenta select").attr("disabled", true);
        $("#btncancelar").ocultar();
        $("#btnregistrar").ocultar();
        $("#btnnuevo").visible();
        $("#tblprd input").attr("disabled", true);
        $("#navegadorRegistro").visible();
        $("#btnanular").ocultar();
        $("#btnimprimir").ocultar();
        if (id_Venta !== 0) {
            cargarVenta("actual");
        }
    }
}
function actualizar() {
    var datos = window.parent.listaCliente;
    var listaCliente = Object.keys(datos).map((key) => datos[key]);
    comboBox({identificador: "input[name=nombre]", datos: listaCliente, codigo: "id_cliente", texto: "ci", callback: (item, posicion) => seleccionarCliente(item, posicion), todos: false, texto2: "nombre", vistaSeleccionado: "nombre", OnBlur: (item, posicion) => onblurCliente(item, posicion)});
    comboBox({identificador: "input[name=nit]", datos: listaCliente, codigo: "id_cliente", texto: "ci", callback: (item, posicion) => seleccionarCliente(item, posicion), todos: false, texto2: "nombre", vistaSeleccionado: "nombre", OnBlur: (item, posicion) => onblurCliente(item, posicion)});
}
function cargarStock() {
    var sucursal = $("#sucursal option:selected").val();
    $.get(url, {proceso: "buscarProducto", idsucursal: sucursal}, function (response) {
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
            usuarioLocal = $.parseJSON(usuarioLocal);
            listaProducto = json.result.producto;
            listalote = json.result.lote;


            $("#tblprd tbody").html("");
            $("#tblprd tbody").append(htmlColumna);
            $("#tblprd tbody").append(htmlColumna);
            $("#tblprd tbody").append(htmlColumna);
            $("#tblprd").igualartabla();
            comboBox({identificador: "input[name=productoTabla]", datos: listaProducto, codigo: "id_producto", texto: "codigo", callback: (item) => seleccionarProducto(item), todos: false, extraBusqueda: "codigoBarra", texto2: "nombre"});
            calcular();
        }
    });
}
function seleccionarProducto(item) {
    var tuplaSeleccionada = $("#tblprd tr.Tuplaseleccionada");
    var precioVenta = item.precioVenta;
    tuplaSeleccionada.find("div.precioUnidad").html(format(precioVenta));
    tuplaSeleccionada.find("input[name=cantidad]").val(1);
    tuplaSeleccionada.data("stock", item.stock);
    var codigo = item.id_producto;
    var lotes = listalote["p" + codigo];
    lotes = lotes ? lotes : [];
    if (lotes.length > 0) {
        tuplaSeleccionada.find("input[name=loteCbx]").val(lotes[0].lote);
        tuplaSeleccionada.find("input[name=loteCbx]").data("cod", lotes[0].id_detalleCompra);
        tuplaSeleccionada.find("div.vencimientoLote").html(lotes[0].vencimiento);
        var loteId = tuplaSeleccionada.find("input[name=loteCbx]");
        tuplaSeleccionada.find("input[name=loteCbx]").prop("readonly", false);
        tuplaSeleccionada.find("input[name=loteCbx]").removeClass("readonly");
        comboBox({identificador: loteId, datos: lotes, codigo: "id_detalleCompra", texto: "lote", callback: (item) => seleccionarLote(item), todos: false, texto2: "vencimiento"});
    } else {
        tuplaSeleccionada.find("input[name=loteCbx]").prop("readonly", true);
        tuplaSeleccionada.find("input[name=loteCbx]").addClass("readonly");
        tuplaSeleccionada.find("input[name=loteCbx]").val("");
        tuplaSeleccionada.find("input[name=loteCbx]").data("cod", "0");
        tuplaSeleccionada.find("div.vencimientoLote").html("");
    }
    calcular();
}
function seleccionarLote() {
    var tuplaSeleccionada = $("#tblprd tr.Tuplaseleccionada");
    var codigo = tuplaSeleccionada.find("input[name=loteCbx]").data("extra");
    var lotes = listalote["p" + codigo];
    lotes = lotes ? lotes : [];
    if (lotes.length > 0) {
        tuplaSeleccionada.find("input[name=loteCbx]").html(lotes[0].lote);
        tuplaSeleccionada.find(".vencimientoLote").html(lotes[0].vencimiento);
    }
}
function seleccionarCliente(item, posicion) {
    id_Cliente = item.id_cliente;
    $("input[name=nit]").data("cod", id_Cliente);
    $("input[name=nombre]").data("cod", id_Cliente);
    $("input[name=nit]").data("pos", posicion);
    $("input[name=nombre]").data("pos", posicion);
    $("input[name=descuento]").val(item.descuento);
    $("input[name=nit]").val(item.ci);
    $("input[name=nombre]").val(item.nombre);
    $("input[name=nombre]").removeClass("rojoClarito");
    $("input[name=nit]").removeClass("rojoClarito");
    calcular();
}
function onblurCliente(item) {
    if (item) {
        id_Cliente = item.id_cliente;
        $("input[name=nombre]").val(item.nombre);
        $("input[name=nit]").val(item.ci);
    } else {
        $("input[name=nombre]").val("");
        $("input[name=nit]").val("");
    }

}
function cambiarLado(e, elemento) {
    var contenedorSearch = $("#contenedorComboBox");
    var cantColuman = $("#tblprd tbody tr").length;
    var td = $(elemento).parent().parent();
    var tr = td.parent();
    var indexTD = td.index();
    var indexTr = tr.index();
    $("#ui-datepicker-div").ocultar();
    if (cantColuman - indexTr <= 3) {
        $("#tblprd tbody").append(htmlColumna);
        comboBox({identificador: "#tblprd tbody tr:last-child input[name=productoTabla]", datos: listaProducto, codigo: "id_producto", texto: "codigo", callback: (item) => seleccionarProducto(item), todos: false, extraBusqueda: "codigoBarra", texto2: "nombre"});
        $("#tblprd").igualartabla();
    }
    if (e.keyCode === 9) {//TAB
        tr.click();
    }
    if ((e.keyCode === 38 && contenedorSearch.length > 0)
            || (e.keyCode === 40 && contenedorSearch.length > 0)) {//arriba
        return;
    }
    if (e.keyCode === 13 || e.keyCode === 39) {//derecha
        if (indexTD === 1) {
            tr.find("input:eq(2)").click();
            tr.find("input:eq(2)").focus();
        } else {
            if (indexTD > 1) {
                tr.next().click();
                tr.next().find('input[name=productoTabla]').focus();
            } else {
                td.next().find('input').focus();
                td.next().find('input').select();
            }
        }
        $(".cuerposearch").ocultar();
    }
    if (e.keyCode === 40) {// abajo
        tr.next().find('td:eq(' + indexTD + ') input').focus();
        tr.next().find('td:eq(' + indexTD + ') input').select();
        tr.next().click();

    }
    if (e.keyCode === 37) {//izquierda
        if (indexTD === 0 && indexTr > 0) {
            tr.prev().click();
            tr.prev().find('input:eq(2)').focus();
            tr.prev().find('input:eq(2)').select();
        } else {
            if (indexTD === 1) {
                td.prev().find('input').focus();
                td.prev().find('input').select();
            }
            if (indexTD === 6) {
                tr.find('input[name=cantidad]').focus();
                tr.find('input[name=cantidad]').select();
            }
        }
        $(".cuerposearch ").ocultar();
    }
    if (e.keyCode === 38) {//arriba
        if (indexTr > 0) {
            tr.prev().find('td:eq(' + indexTD + ') input').focus();
            tr.prev().find('td:eq(' + indexTD + ') input').select();
            tr.prev().click();
        }
    }

}
function eliminarColumna(ele) {
    $(ele).remove();
    var cantColuman = $("#tblprd tbody tr").length;
    if (cantColuman <= 3) {
        $("#tblprd tbody").append(htmlColumna);
        comboBox({identificador: "#tblprd tbody tr:last-child input[name=productoTabla]", datos: listaProducto, codigo: "id_producto", texto: "codigo", callback: (item) => seleccionarProducto(item), todos: false, extraBusqueda: "codigoBarra", texto2: "nombre"});
        $("#tblprd").igualartabla();
    }
    calcular();
}
function calcular() { // revisar tema de stock pone rojo el imput
    var tr = $("#tblprd tbody tr");
    var descuento = $("input[name=descuento]").val();
    descuento = descuento === "" ? 0 : parseFloat(descuento);
    if (descuento < 0) {
        $("input[name=descuento]").val(0);
        descuento = 0;
    }
    var cantidadTotal = 0;
    var precioTotalA = 0;
    var precioTotalB = 0;
    var precioTotal2A = 0;
    var precioTotal2B = 0;
    var totalDescuento = 0;
    var conf = window.parent.conf;
    for (var i = 0; i < tr.length; i++) {
        var cant = $(tr[i]).find('input[name=cantidad]').val();
        cant = cant === '' ? 0 : parseFloat(cant);
        var a = $(tr[i]).find('div.precioUnidad').html().replace(/\./g, '').replace(/\,/g, '.');
        a = a === '' ? 0 : parseFloat(a);
        var b = a / tipoCambio;
        var totalA = a * cant;
        var desc = 0;
        if (descuento > 0) {
            desc = totalA * (descuento / 100);
            totalDescuento += desc;
        }


        $(tr[i]).find('td:eq(3) div').html(format(totalA));
        $(tr[i]).find('td:eq(4) div').html(format(desc));
        $(tr[i]).find('td:eq(5) div').html(format(totalA - desc));

        cantidadTotal += cant;
        precioTotalB += b;
        precioTotalA += a;
        precioTotal2A += totalA;
        precioTotal2B += desc;
        var cod = $(tr[i]).find('input[name=productoTabla]').data("cod");
        var historico = $(tr[i]).find('input[name=cantidad]').data("historico");
        historico = parseInt(historico);

        var stock = parseFloat($(tr[i]).data("stock")) + historico;
        if (stock - cant < 0) {
            if (conf[4]) {
                $(tr[i]).find('input[name=cantidad]').removeClass("rojoClarito");
            } else {
                $(tr[i]).find('input[name=cantidad]').addClass("rojoClarito");
            }
        } else {
            $(tr[i]).find('input[name=cantidad]').removeClass("rojoClarito");
        }
    }

    var totalReal = precioTotal2A - precioTotal2B;
    $('#totalVenta').html(format(totalReal));
    $('#totalSD').html(format(precioTotal2A));
    $('#totalGeneral').html(format(totalReal));
    if (window.parent.conf[7]) {
        $('input[name=montoCobrado]').val(totalReal.toFixed(2));
        $('#saldo').html(0.00);
    } else {
        $('input[name=montoCobrado]').val(0);
        $('#saldo').html(totalReal.toFixed(2));
    }

    $('#descuentoTxt').html(format(totalDescuento));
    $('#saldo').removeClass("rojoClarito");
    $('#totalGeneralD').html(format(precioTotal2B));
    $('#tblprd tfoot td:eq(1) div').html(cantidadTotal);
    $('#tblprd tfoot td:eq(2) div').html(format(precioTotalA));
    $('#tblprd tfoot td:eq(3) div').html(format(precioTotal2A));
    $('#tblprd tfoot td:eq(4) div').html(format(precioTotal2B));
    $('#tblprd tfoot td:eq(5) div').html(format(precioTotal2A - precioTotal2B));

    if (id_Cliente !== 0) {
        var listaCliente = window.parent.listaCliente;
        var cliente = listaCliente["c" + id_Cliente];
        var maxDescuento = parseFloat(cliente.descuentoMax);
        if (maxDescuento > 0 && descuento > maxDescuento) {
            $("input[name=descuento]").addClass("rojoClarito");
        } else {
            $("input[name=descuento]").removeClass("rojoClarito");
        }
    }

}
function calcularSaldo() {
    var total = parseFloat($('#totalGeneral').html().replace(/\./g, '').replace(/\,/g, '.'));
    var montoCobrado = $('input[name=montoCobrado]').val();
    montoCobrado = montoCobrado === "" ? 0 : parseFloat(montoCobrado);
    var saldo = total - montoCobrado;
    if (saldo < 0) {
        $('#saldo').addClass("rojoClarito");
    } else {
        $('#saldo').removeClass("rojoClarito");
    }
    $('#saldo').html(format(saldo));
}
function cargarVenta(tipo) {// data-pos, data-stock en tr
    var sucursal = $("#sucursal option:selected").val();
    cargando(true);
    $.get(url, {proceso: 'buscarVenta', tipo: tipo, idventa: id_Venta, idsucursal: sucursal}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error, "error");
        } else {
            datosVentaSeleccionada = json.result;
            var ventaObj = json.result.venta;
            if (ventaObj) {
                $("#sucursal option").css("display", "block");
                $("#btnmodificar").visible();
                $("#btnanular").visible();
                $("#btnimprimir").visible();
                var detalleVentaObj = json.result.detalle;
                listaProducto = json.result.producto;
                listalote = json.result.lote;
                id_Venta = ventaObj.id_venta;
                id_Cliente = parseInt(ventaObj.cliente_id);
                var fechaSplit = ventaObj.fecha.split(" ");
                $("input[name=fecha]").val(fechaSplit[0]);
                var listaCliente = window.parent.listaCliente;
                if (json.result.clienteV != "-1") {// validacion clientes sin version
                    window.parent.listaCliente["c" + json.result.clienteV.id_cliente] = json.result.clienteV;
                    listaCliente = window.parent.listaCliente;
                }
                var cliente = listaCliente["c" + id_Cliente];
                $("input[name=nit]").val(cliente.ci);
                $("input[name=nombre]").val(cliente.nombre);
                $("input[name=nit2]").val(ventaObj.nit);
                $("input[name=rz2]").val(ventaObj.razonsocial);
                tipoDocumento2 = "Nota de Venta";
                tipoVenta = ventaObj.tipoVenta;
                $("input[name=detalle]").val(ventaObj.descripcion);
                $("#vendedor option[value='" + ventaObj.usuario_id + "']").prop("selected", true);

                $("#entrega option[value='" + ventaObj.estadoEntrega + "']").prop("selected", true);
                $("input[name=fechaEntrega]").val(ventaObj.fechaEntrega);
                $("input[name=direccion]").val(ventaObj.direccionEntrega);
                $("input[name=Comentario]").val(ventaObj.comentario);
                if (ventaObj.estadoEntrega === "Entregado") {
                    $(".entregaFecha").ocultar();
                }
                if (ventaObj.estadoEntrega === "Pendiente") {
                    $(".entregaFecha").ocultar();
                }
                if (ventaObj.estadoEntrega === "Programado") {
                    $(".entregaFecha").visible(1);
                }

                $("#tipoPago option[value='" + ventaObj.tipoPago + "']").prop("selected", true);
                $("#sucursal option[value='" + ventaObj.sucursal_id + "']").prop("selected", true);
                $("input[name=nroDocumento]").val(ventaObj.nroNota);
                $("#nroDocumentoTxt").text("Nro Documento");


                var listaUsuario = window.parent.listaUsuario;
                var modificadopor = listaUsuario["u" + ventaObj.usuarioActualizo_id];
                if (ventaObj.estado === "inactivo") {
                    $("#btnmodificar").ocultar();
                    $("#btneliminar").ocultar();
                    $("#txtInformacion").html("Venta Anulada");
                    $("#txtInformacion").addClass("txtRojo");
                } else {
                    $("#txtInformacion").html("Ult. Actualización");
                    $("#txtInformacion").removeClass("txtRojo");
                }
                $("#vlueInformacion").html(ventaObj.fechaModificacion + " , " + modificadopor.nombre);





                $("#tblprd tbody").html("");
                var listaP = window.parent.listaProducto;
                var html = "";
                var descuentoTotal = 0;
                var total = 0;
                var listaPermisosUsuarioRapido = window.parent.listaPermisosUsuarioRapido;
                var cssPermiso = ""
                if (!listaPermisosUsuarioRapido[60]) {
                    cssPermiso = "ocultarPermiso";
                }
                for (var i = 0; i < detalleVentaObj.length; i++) {
                    var item = detalleVentaObj[i];
                    var producto = listaP["p" + item.producto_id];
                    var cantidad = parseInt(item.cantidad);
                    var descuento = parseFloat(item.descuento);

                    var precio = parseFloat(item.precio);
                    var subtotal = (precio * cantidad);
                    total += subtotal;
                    descuentoTotal += descuento;
                    descuento = descuento / cantidad;
                    var vista = producto.codigo.replace(/"/g, '\"').replace(/"/g, "\'") + " - " + producto.nombre.replace(/"/g, '\"').replace(/"/g, "\'");
                    html += "<tr ondblclick='eliminarColumna(this)'>";
                    html += "<td><div class='grande3'><input autocomplete='off' name='productoTabla' data-cod='" + item.producto_id + "' data-pos='-1' value=\"" + vista + "\" type='text' class='izquierda'  onkeyup='cambiarLado(event,this)' ></div></td>";
                    html += "<td><div class='pequeno'><input type='number' name='cantidad' data-historico='" + item.cantidad + "'  value='" + item.cantidad + "' step=0 min=0 class='derecha' onkeyup='calcular(); cambiarLado(event,this);'  onblur='calcular()' ></div></td>";
                    html += "<td><div class='pequeno precioUnidad'>" + format(precio) + "</div></td>";
                    html += "<td><div class='pequeno'></div></td>";
                    html += "<td><div class='pequeno derecha descuentoDiv'>0.00</div></td>";
                    html += "<td><div class='pequeno derecha'>0.00</div></td>";
                    html += "<td class='" + cssPermiso + "'><div class='normal derecha'><input type='text' value='" + item.lote + "' name='loteCbx' data-cod='" + item.detallecompra_id + "'   onkeyup='cambiarLado(event,this)' autocomplete='off' class='readonly'></div></td>";
                    html += "<td class='" + cssPermiso + "'><div class='pequeno derecha vencimientoLote'>" + item.fechaVencimiento + "</div></td>";
                    html += "</tr>";

                }
                var descuento = (descuentoTotal / total) * 100;
                $("input[name=descuento]").val(descuento.toFixed(2));
                html += htmlColumna;
                html += htmlColumna;
                html += htmlColumna;
                $("#tblprd tbody").html(html);
                comboBox({identificador: "input[name=productoTabla]", datos: listaProducto, codigo: "id_producto", texto: "codigo", callback: (item) => seleccionarProducto(item), todos: false, extraBusqueda: "codigoBarra", texto2: "nombre"});
                $("#tblprd").igualartabla();
                $("#tblprd input").attr("disabled", true);
                calcular();
                var imprimirYa = localStorage.getItem("imprimir");
                if (imprimirYa === "si") {
                    localStorage.removeItem("imprimir");
                    imprimir(false);
                }
            }

        }
    });
}
function modificar() {
    $("h1").text("Modificando Venta");
    $("#formVenta input").attr("disabled", false);
    $("#formVenta select").attr("disabled", false);
    $("#tblprd input").attr("disabled", false);
    $("#btncancelar").visible();
    $("#btnregistrar").visible();
    $("#btnnuevo").ocultar();
    $("#sucursal option[data-estado='inactivo']").css("display", "block");
    $("#btnimprimir").ocultar();
    $("#btnmodificar").ocultar();
    $("#btnanular").ocultar();
    $("#estadoTitulo").text("Modificando Venta");
    $("#navegadorRegistro").ocultar();
   
}
function registrarPop() {
    if (id_Venta !== 0) {
        $(".ContenedorPago").ocultar();
        $(".ContenedorPago2").ocultar();
    } else {
        $(".entregaFecha").ocultar();
        $("#entrega option:eq(0)").prop("selected", true);
        if (id_Cliente === 0) {
            alertaRapida("No ha seleccionado al cliente.", "error");
            $("input[name=nombre]").addClass("rojoClarito");
            $("input[name=nit]").addClass("rojoClarito");
            return;
        }
        var listaCliente = window.parent.listaCliente;
        var cliente = listaCliente["c" + id_Cliente];
        $("input[name=nit2]").val(cliente.nit);
        $("input[name=rz2]").val(cliente.razonSocial);
        $('input[name=direccion]').val(cliente.direccion);
        $(".ContenedorPago").css("display", "flex");
        $(".ContenedorPago2").css("display", "block");
    }
    if ($("#tblprd input").hasClass("rojoClarito")) {
        alertaRapida("No se puede realizar la venta. Esta vendiendo productos sin stock", "error");
        return;
    }

    if (id_Cliente !== 0) {
        var descuento = $("input[name=descuento]").val();
        descuento = descuento === "" ? 0 : parseFloat(descuento);
        var listaCliente = window.parent.listaCliente;
        var cliente = listaCliente["c" + id_Cliente];
        var maxDescuento = parseFloat(cliente.descuentoMax);
        if (maxDescuento > 0 && descuento > maxDescuento) {
            alertaRapida("El cliente sobrepasa limite de descuento.");
            $("input[name=descuento]").addClass("rojoClarito");
            return;
        } else {
            $("input[name=descuento]").removeClass("rojoClarito");
        }
    }
    var lista = $("#tblprd tbody tr");
    var listaVenta = [];
    for (var i = 0; i < lista.length; i++) {
        var cantidad = $(lista[i]).find("input[name=cantidad]").val();
        var producto = $(lista[i]).find("input[name=productoTabla]").data("cod");
        cantidad = cantidad === "" ? 0 : parseInt(cantidad);
        producto = producto === "" ? 0 : parseFloat(producto);
        if (producto === 0 || cantidad <= 0) {
            continue;
        }
        listaVenta.push(1);
    }
    if (id_Cliente === 0) {
        alertaRapida("No ha seleccionado al cliente.");
        return;
    }
    if (listaVenta.length === 0) {
        alertaRapida("No ha ingresado ningun producto a la Venta.");
        return;
    }
    if (!window.parent.conf[8]) {
        $("#boxEntrega").ocultar();
        $("#entrega option:eq(0)").prop("selected", true);
        $("input[name=fechaEntrega]").val($("input[name=fecha]").val());
        $("input[name=direccion]").val("");

    }
    $('#popVenta').modal('show');
}
function registrar() {
    var json = variables("#formVenta");
    json.proceso = 'registrarVenta';
    json.id_Venta = id_Venta;
    json.id_Cliente = id_Cliente;
    var nit = $("input[name=nit2]").val().trim();
    var rz2 = $("input[name=rz2]").val().trim();
    if (nit.length === 0) {
        $("#errorPop").html("El nit no puede estar vacío.");
        $("input[name=nit2]").addClass("rojoClarito");
        return;
    } else {
        $("input[name=nit2]").removeClass("rojoClarito");
    }
    if (!validar("entero", nit)) {
        $("#errorPop").html("El nit solo puede tener valores numéricos.");
        $("input[name=nit2]").addClass("rojoClarito");
        return;
    } else {
        $("input[name=nit2]").removeClass("rojoClarito");
    }
    if (rz2.length === 0) {
        $("#errorPop").html("La razon social no puede estar vacío.");
        $("input[name=rz2]").addClass("rojoClarito");
        return;
    } else {
        $("input[name=rz2]").removeClass("rojoClarito");
    }
    if (id_Cliente !== 0) {
        var descuento = $("input[name=descuento]").val();
        descuento = descuento === "" ? 0 : parseFloat(descuento);
        var listaCliente = window.parent.listaCliente;
        var cliente = listaCliente["c" + id_Cliente];
        var maxDescuento = parseFloat(cliente.descuentoMax);
        if (maxDescuento > 0 && descuento > maxDescuento) {
            $("#errorPop").html("El cliente sobrepasa limite de descuento.");
            $("input[name=descuento]").addClass("rojoClarito");
            return;
        } else {
            $("input[name=descuento]").removeClass("rojoClarito");
        }
    }
    json.nit = nit;
    json.nombre = rz2;
    json.tipoPago = $("#tipoPago option:selected").val();
    json.vendedor = $("#vendedor option:selected").val();
    json.cobrador = $("#cobrador option:selected").val();
    json.tipoDocumento = "Nota de Venta";
    var saldo = $("#saldo").html().replace(/\./g, '').replace(/\,/g, '.');
    saldo = parseFloat(saldo);
    json.tipoVenta = tipoVenta;
    if (id_Venta === 0) {
        if (saldo > 0) {
            json.tipoVenta = "Credito";
        }
    }


    json.estadoentrega = $("#entrega option:selected").val();
    json.fechaEntrega = $('input[name=fechaEntrega]').val();
    json.entregaDireccion = $('input[name=direccion]').val();
    json.Comentario = $('input[name=Comentario]').val();

    var montoCobrado = $('input[name=montoCobrado]').val();
    montoCobrado = montoCobrado === "" ? 0 : parseFloat(montoCobrado);
    json.montoCobrado = montoCobrado;
    json.detalle = json.detalle.replace(/\'/g, '').replace(/\"/g, '');
    if ($("#tblprd input").hasClass("rojoClarito")) {
        alertaRapida("No se puede realizar la venta. Esta vendiendo productos sin stock");
        return;
    }
    var lista = $("#tblprd tbody tr");
    var listaVenta = [];
    var totalFacturado = $("#totalGeneral").html().replace(/\./g, '').replace(/\,/g, '.');
    for (var i = 0; i < lista.length; i++) {
        var cantidad = $(lista[i]).find("input[name=cantidad]").val();
        var precio = $(lista[i]).find("div.precioUnidad").html().replace(/\./g, '').replace(/\,/g, '.');
        var descuento = $(lista[i]).find("div.descuentoDiv").html().replace(/\./g, '').replace(/\,/g, '.');
        var producto = $(lista[i]).find("input[name=productoTabla]").data("cod");
        var historico = $(lista[i]).find("input[name=cantidad]").data("historico");
        var idDetalle = $(lista[i]).find("input[name=loteCbx]").data("cod");
        cantidad = cantidad === "" ? 0 : parseInt(cantidad);
        precio = precio === "" ? 0 : parseFloat(precio);
        descuento = descuento === "" ? 0 : parseFloat(descuento);
        producto = producto === "" ? 0 : parseFloat(producto);
        if (producto === 0 || cantidad <= 0) {
            continue;
        }
        listaVenta.push({
            id: producto, cant: cantidad, precio: precio, descuento: descuento, idDetalle: idDetalle, historico: historico
        });

    }
    if (id_Cliente === 0) {
        alertaRapida("No ha seleccionado al cliente.", "error");
        return;
    }
    if (listaVenta.length === 0) {
        alertaRapida("No ha ingresado ningun producto a la Venta.", "error");
        return;
    }
    $("#errorPop").html("");
    json.listaVenta = listaVenta;
    json.totalFacturado = totalFacturado;
    json.tipoDocumento2 = "Nota de Venta";
    cargando(true);
    $.post(url, json, function (response) {
        cargando(false);
        $('#popVenta').modal('hide');
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error, "error");
        } else {
            nuevo(0);
            if (id_Venta === 0) {
                id_Venta = json.result;
                imprimir(true);
            }
            id_Venta = json.result;
            window.parent.Version();
        }
    });
}
function anular() {
    $("body").msmPregunta("¿Esta seguro que desea anular la factura?", "realizarAnulacion()");
}
function realizarAnulacion() {
    ok();
    $.post(url, {proceso: "anularFactura", id_venta: id_Venta}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error, "error");
        } else {
            cargarVenta("actual");
            nuevo(0);
            alertaRapida("La anulacion se realizo correctamente")
        }
    });
}
function imprimir(nuevaVenta) {
    cargando(true);
    $.get(url, {idven: id_Venta, proceso: "imprimirVenta"}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error, "error");
        } else {
            var sucursal = json.result.sucursal;
            var detalle = json.result.detalle;
            var venta = json.result.venta;
            if (sucursal.estructuraDocumentoVenta === "Hoja 7cm" && venta.tipoDocumento === "Factura") {
                imprimirFactura7cm(sucursal, venta, detalle);
                setTimeout(() => {
                    window.parent.iframeImpresion.get(0).contentWindow.print();
                    if (window.parent.conf[5]) {
                        imprimirNotaVenta7cm(sucursal, venta, detalle);
                        setTimeout(() => {
                            window.parent.iframeImpresion.get(0).contentWindow.print();
                            if (nuevaVenta && window.parent.conf[6]) {
                                imprimirCobranza();
                            }
                        }, 700);

                    } else {
                        if (nuevaVenta && window.parent.conf[6]) {
                            imprimirCobranza();
                        }
                    }

                }, 700);
            }
            if (sucursal.estructuraDocumentoVenta === "Hoja 7cm" && venta.tipoDocumento === "Nota de Venta") {
                imprimirNotaVenta7cm(sucursal, venta, detalle);
                window.parent.iframeImpresion.get(0).contentWindow.print();
                if (nuevaVenta && window.parent.conf[6]) {
                    imprimirCobranza();
                }
            }
            if (sucursal.estructuraDocumentoVenta === "Hoja Carta" && venta.tipoDocumento === "Factura") {
                imprimirFacturaCarta(venta, detalle, sucursal);
                setTimeout(() => {
                    window.parent.iframeImpresion.get(0).contentWindow.print();
                    if (window.parent.conf[5]) {
                        imprimirNotaVenta(venta, detalle);
                        setTimeout(() => {
                            window.parent.iframeImpresion.get(0).contentWindow.print();
                            if (nuevaVenta && window.parent.conf[6]) {
                                imprimirCobranza();
                            }
                        }, 500);
                    } else {
                        if (nuevaVenta && window.parent.conf[6]) {
                            imprimirCobranza();
                        }
                    }
                }, 700);

            }
            if (sucursal.estructuraDocumentoVenta === "Hoja Carta" && venta.tipoDocumento === "Nota de Venta") {
                imprimirNotaVenta(venta, detalle);
                setTimeout(() => {
                    window.parent.iframeImpresion.get(0).contentWindow.print();
                    if (nuevaVenta && window.parent.conf[6]) {
                        imprimirCobranza();
                    }
                }, 700);
            }
            cargarVenta("actual");
        }
    });
}
function imprimirCobranza() {
    cargando(true);
    $.get(url, {proceso: "buscarCobranza", idventa: id_Venta}, function (response) {
        cargando(false);
        $('#popVenta').modal('hide');
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error, "error");
        } else {
            var cobranza = json.result.cobranza;
            var detalle = json.result.detalle;
            imprimirDocumentoCobranza(cobranza, detalle);
        }
    });
}
function cambioEstadoEntrega() {
    var estado = $("#entrega option:selected").val();
    if (estado === "Entregado") {
        $(".entregaFecha").ocultar();
    }
    if (estado === "Pendiente") {
        if (id_Venta === 0) {
            $("input[name=fechaEntrega]").val($("input[name=fecha]").val());
        }
        $(".entregaFecha").ocultar();
    }
    if (estado === "Programado") {
        $(".entregaFecha").visible(1);
        if (id_Venta === 0) {
            $("input[name=fechaEntrega]").val($("input[name=fecha]").val());
        }
    }
}
function vistaPrevia(tipo) {
    if (tipo === 1) {
        $("#popVistaPrevia").modal("show");
    }

    var listaSucursalRapida = window.parent.listaSucursalRapida;
    var listaProducto2 = window.parent.listaProducto;
    var venta = datosVentaSeleccionada.venta;
    if (id_Venta === 0) {
        venta = {};
    }
    var json = variables("#formVenta");
    var sucursal = listaSucursalRapida["s" + json.sucursal];
    var nit = $("input[name=nit2]").val().trim();
    var rz2 = $("input[name=rz2]").val().trim();
    venta.nit = nit;
    venta.razonsocial = rz2;
    venta.vendedor = $("#vendedor option:selected").val();
    venta.tipoDocumento = "Nota de Venta";
    venta.estadoEntrega = $("#entrega option:selected").val();
    venta.fechaEntrega = $('input[name=fechaEntrega]').val();
    venta.direccionEntrega = $('input[name=direccion]').val();
    venta.descripcion = $('input[name=detalle]').val();
    venta.comentario = $('input[name=Comentario]').val();
    venta.comentario = $('input[name=Comentario]').val();
    venta.fecha = $('input[name=fecha]').val();
    venta.usuario_id = $("#vendedor option:selected").val();
    venta.cliente_id = id_Cliente;

    if (id_Venta > 0) {
        if (tipoDocumento2 !== json.tipoDocumento) {
            venta.tipoVenta = "Nota de Venta";
        }
    } else {
        venta.sucursal_id = sucursal.id_sucursal
        sucursal.fechaLimiteEmision = "DD/MM/AAAA";
        sucursal.actividadEconomica = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
        venta.Autorizacion = "XXXXXXXXXXXX";
        venta.codigoControl = "XX-XX-XX-XX";
        venta.fechaLimiteEmision = "XX-XX-XXXX";
        venta.nroNota = "XXX";
        venta.nroDocumento = "XXX";
        venta.actividadEconomica = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
        venta.mensajeImpuesto = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
        venta.codigoControl = "XX-XX-XX-XX";
        if (saldo > 0) {
            venta.tipoVenta = "Credito";
        } else {
            venta.tipoVenta = "Contado";
        }
    }


    var lista = $("#tblprd tbody tr");
    var listaVenta = [];
    for (var i = 0; i < lista.length; i++) {
        var cantidad = $(lista[i]).find("input[name=cantidad]").val();
        var precio = $(lista[i]).find("div.precioUnidad").html().replace(/\./g, '').replace(/\,/g, '.');
        var descuento = $(lista[i]).find("div.descuentoDiv").html().replace(/\./g, '').replace(/\,/g, '.');
        var producto = $(lista[i]).find("input[name=productoTabla]").data("cod");

        cantidad = cantidad === "" ? 0 : parseInt(cantidad);
        precio = precio === "" ? 0 : parseFloat(precio);
        descuento = descuento === "" ? 0 : parseFloat(descuento);
        producto = producto === "" ? 0 : parseFloat(producto);
        if (producto === 0 || cantidad <= 0) {
            continue;
        }
        var prod = listaProducto2["p" + producto];
        listaVenta.push({
            lote: "|=|", producto_id: producto, nombre: prod.nombre, codigo: prod.nombre, cantidad: cantidad, precio: precio, descuento: descuento, precioTotal: (cantidad * precio)
        });

    }
    var detalle = listaVenta;


    var vistaPrevia = "Nota de Venta";
    if (sucursal.estructuraDocumentoVenta === "Hoja 7cm" && vistaPrevia === "Factura") {
        imprimirFactura7cm(sucursal, venta, detalle);
    }
    if (sucursal.estructuraDocumentoVenta === "Hoja 7cm" && vistaPrevia === "Nota de Venta") {
        imprimirNotaVenta7cm(sucursal, venta, detalle);
    }
    if (sucursal.estructuraDocumentoVenta === "Hoja Carta" && vistaPrevia === "Factura") {
        imprimirFacturaCarta(venta, detalle, sucursal);
    }
    if (sucursal.estructuraDocumentoVenta === "Hoja Carta" && vistaPrevia === "Nota de Venta") {
        imprimirNotaVenta(venta, detalle);
    }

    var hoja = window.parent.iframeImpresion.contents().find("body").html();
    $("#impresion").contents().find("body").html(hoja);
    if (sucursal.estructuraDocumentoVenta === "Hoja Carta") {
        $("#impresion").contents().find("body .hojaCarta").addClass("vistaPreviaHoja");
    }
}
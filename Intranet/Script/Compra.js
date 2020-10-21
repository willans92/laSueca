var url = '../Controlador/Compra_Controlador.php';
var contador = 0;
var listaAlmacen = {};
var listaProvedor = {};
var listaProducto = {};
var id_Compra = 0;
var htmlColumna = '';
var tamanopantalla = $(window).height() - 480;
var estadoDolar = false;
$(document).ready(function () {
    $('#impresion').contents().find("head").append($("<link href='../Estilo/bootstrap.min.css' rel='stylesheet' type='text/css'/><link href='../Estilo/Estilo.css' rel='stylesheet' type='text/css'/><link href='../Estilo/Impresion.css' rel='stylesheet'  type='text/css'/>"));
    $(".fecha").datepicker();
    $(".fecha").val(fechaActual());
    var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal === null) {
        window.parent.cerrarSession();
        return;
    }
    usuarioLocal = $.parseJSON(usuarioLocal);
    $("#tblprd tbody").css("height", tamanopantalla);
     $(window).resize(function () {
        var tamanopantalla = $(window).height() - 480;
        $("#tblprd tbody").css("height", tamanopantalla);
    });
    var ocultar = "";
    if (!window.parent.conf[1]) {
        $(".loteper").addClass("ocultar");
        ocultar = "ocultar";
    }
    htmlColumna += "<tr ondblclick='eliminarColumna(this)' data-iddetalle='0'>";
    htmlColumna += "<td><div class='grande3'><input autocomplete='off' data-cod='0' data-pos='-1' type='text' class='izquierda'  onkeyup='cambiarLado(event,this)' name='productoTabla' ></div></td>";
    htmlColumna += "<td><div class='pequeno'><input type='number' value='1'  step=0 min=0 class='derecha' onkeyup='cambiarLado(event,this)'  onblur='calcular()' name='cantidad'></div></td>";
    htmlColumna += "<td><div class='pequeno'><input type='number'  step=0.5 min=0 class='derecha' onkeyup='cambiarLado(event,this)' onblur='calcular()' name='precioCompra'></div></td>";
    htmlColumna += "<td><div class='pequeno derecha'>0.00</div></td>";
    htmlColumna += "<td><div class='pequeno derecha'>0.00</div></td>";
    htmlColumna += "<td><div class='pequeno derecha'>0.00</div></td>";
    htmlColumna += "<td><div class='normal derecha " + ocultar + "'><input type='text' name='lote'  onkeyup='cambiarLado(event,this)' ></div></td>";
    htmlColumna += "<td><div class='normal derecha " + ocultar + "'><input type='text' name='vencimiento' readonly  onkeyup='cambiarLado(event,this)' value='" + fechaActual() + "' class='fecha' ></div></td>";
    htmlColumna += "</tr>";
    var datos = window.parent.listaUsuario;
    var listaUsuario = Object.keys(datos).map((key) => datos[key]);
    var listaPermisosUsuarioRapido = window.parent.listaPermisosUsuarioRapido;
    var todosEncargados = listaPermisosUsuarioRapido[178];
    if (!todosEncargados) {
        listaUsuario = listaUsuario.filter((item) => (item.sucursal_id + "") === ("" + usuarioLocal.sucursal_id));
    }
    $("input[name=tpcambio]").val(window.parent.empresaD.tipoCambio);
    comboBox({identificador: "input[name=encargado]", valueDefault: usuarioLocal.id_usuario, datos: listaUsuario, codigo: "id_usuario", texto: "nombre", todos: false});
    nuevo(0);
    cargarData("", false);
});
function nuevo(tipo) {
    $("#btnimprimir").ocultar();
    if (tipo === 1) {
        $("#formCompra input").attr("disabled", false);
        $("#formCompra select").attr("disabled", false);
        $("#btncancelar").visible();
        $("#btnregistrar").visible();
        $("#btnnuevo").ocultar();
        $("#btnmodificar").ocultar();
        $("#btneliminar").ocultar();
        $("h1").text("Nueva Compra");
        vaciarFromulario();
        $("#tblprd input").attr("disabled", false);
        $("input[name=tpcambio]").val(window.parent.empresaD.tipoCambio);
        $(".fecha").datepicker();
        cargarData("activo");
    } else {
        if (id_Compra === 0) {
            vaciarFromulario();
        } else {
            cargarCompra("actual");
        }
        $("#vlueInformacion").html("");
        $("#txtInformacion").html("");
        $("h1").text("Compra");
        $("#formCompra input").attr("disabled", true);
        $("#formCompra select").attr("disabled", true);
        $("#tblprd input").attr("disabled", true);
        $("#btncancelar").ocultar();
        $("#btnregistrar").ocultar();
        $("#btnnuevo").visible();
        $("#btnmodificar").ocultar();
        $("#btneliminar").ocultar();
        $("#btnPrimera").visible();
        $("#btnAnterior").visible();
        $("#btnSiguiente").visible();
        $("#btnUltimo").visible();
        var usuarioLocal = localStorage.getItem("usuario");
        if (usuarioLocal === null) {
            window.parent.cerrarSession();
            return;
        }
        usuarioLocal = $.parseJSON(usuarioLocal);
        $("input[name=encargado]").val(usuarioLocal.nombre);
        $("input[name=encargado]").data("cod", usuarioLocal.id_usuario);
    }
}
function cargarData(estado, nuevo = true) {
    cargando(true);
    $.get(url, {proceso: "cargarData", estado: estado}, function (response) {
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
            usuarioLocal = $.parseJSON(usuarioLocal);
            listaAlmacen = json.result.almacenes;
            comboBox({identificador: "input[name=almacen]",ordenarPor:"posicion", datos: listaAlmacen, codigo: "id_almacen", texto: "nombre", todos: true});
            if (listaAlmacen.length > 0) {
                $("input[name=almacen]").data("cod", listaAlmacen[0].id_almacen);
                $("input[name=almacen]").val(listaAlmacen[0].nombre);
            }
            listaProvedor = json.result.provedores;
            comboBox({identificador: "input[name=Provedor]", datos: listaProvedor, codigo: "id_provedor", texto: "nit", callback: (item) => seleccionarProvedor(item), todos: false, texto2: "nombre", vistaSeleccionado: "nombre"});
            listaProducto = json.result.productos;
            var compraLocal = localStorage.getItem("idcompra");
            if (compraLocal !== null) {
                id_Compra = compraLocal;
                localStorage.removeItem("idcompra");
                cargarCompra("actual");
            } else {
                if (nuevo) {
                    $("#tblprd tbody").html(htmlColumna);
                    $("#tblprd tbody").append(htmlColumna);
                    $("#tblprd tbody").append(htmlColumna);
                    $("#tblprd tbody").append(htmlColumna);
                    $(".fecha").datepicker();
                    $("#tblprd").igualartabla();
                    comboBox({identificador: "input[name=productoTabla]", datos: listaProducto, codigo: "id_producto", texto: "codigo", callback: (item) => seleccionarProducto(item), todos: false, extraBusqueda: "codigoBarra", texto2: "nombre"});
                }

            }
        }
    });
}
function seleccionarProvedor(item) {
    $("input[name=nroAutorizacion]").val(item.autorizacion);
    $("#tpdoc option[value='" + item.tipoDocumento + "']").prop("selected", true);
    $("#tppago option[value='" + item.formaPago + "']").prop("selected", true);
    cambioTpDoc("#tpdoc");
}
function vaciarFromulario() {
    $("input[name=Provedor]").data("value", "0");
    $("input[name=Provedor]").data("pos", "-1");
    $("#formCompra input[name=Provedor]").val("");
    $("#formCompra input[name=detalle]").val("");
    $("input[name=codigoControl]").val("");
    $("#formCompra input[name=nroFactura]").val("");
    $("#formCompra input[name=nroAutorizacion]").val("");
    $("#formCompra input[name=Provedor]").data("cod", "0");
    id_Almacen = 0;
    id_Compra = 0;
    $("#tblprd tbody").html(htmlColumna);
    $("#tblprd tbody").append(htmlColumna);
    $("#tblprd tbody").append(htmlColumna);
    $("#tblprd tbody").append(htmlColumna);
    $(".fecha").datepicker();
    $("#tblprd").igualartabla();
    $("#tpdoc").change();
    $("#btnPrimera").ocultar();
    $("#btnAnterior").ocultar();
    $("#btnSiguiente").ocultar();
    $("#btnUltimo").ocultar();
    calcular();
}
function modificar() {
    if (id_Compra === 0) {
        alertaRapida("No ha seleccionado ninguna compra para modificar.");
        return;
    }
    $("#btnimprimir").ocultar();
    $("#formCompra input").attr("disabled", false);
    $("#formCompra select").attr("disabled", false);
    $("#tblprd input").attr("disabled", false);
    $("#btncancelar").visible();
    $("#btnregistrar").visible();
    $("#btnnuevo").ocultar();
    $("#btnmodificar").ocultar();
    $("#btneliminar").ocultar();
    $("h1").text("Modificando Compra");
    $("#btnPrimera").ocultar();
    $("#btnAnterior").ocultar();
    $("#btnSiguiente").ocultar();
    $("#btnUltimo").ocultar();
    var lista = $("#tblprd tbody tr");
    for (var i = 0; i < lista.length; i++) {
        var idDetalle = $(lista[i]).data("iddetalle");
        if (idDetalle !== 0) {
            $("#tblprd tr:eq(" + i + ") input[name=lote]").attr("disabled", true);
            $("#tblprd tr:eq(" + i + ") input[name=vencimiento]").attr("disabled", true);
        }
    }
    cargarData("", false);
}
function cargarCompra(tipo) {
    cargando(true);
    $.get(url, {proceso: 'buscarCompra', tipo: tipo, idcompra: id_Compra}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error, "error");
        } else {
            var compraObj = json.result.compra;
            var detalleCompraObj = json.result.detalle;
            if (compraObj === "null" || compraObj === null) {
                return;
            }
            $("#formCompra input").attr("disabled", true);
            $("#formCompra select").attr("disabled", true);
            $("#tblprd input").attr("disabled", true);
            id_Compra = compraObj.id_compra;
            var fechaSplit = compraObj.fecha.split(" ");
            $("#btnimprimir").visible();
            $("#btnmodificar").visible();
            $("#btneliminar").visible();
            $("input[name=fecha]").val(fechaSplit[0]);
            $("input[name=nroAutorizacion]").val(compraObj.Autorizacion);
            $("input[name=Provedor]").val(compraObj.nombreProvedor);
            var posicionProvedor = listaProvedor.findIndex((item) => item.id_provedor === compraObj.provedor_id);
            $("input[name=Provedor]").data("cod", compraObj.provedor_id);
            $("input[name=Provedor]").data("pos", posicionProvedor);
            $("#tpdoc option[value='" + compraObj.tipo + "']").prop("selected", true);

            var almacen = listaAlmacen.filter((item) => ("" + item.id_almacen === ("" + compraObj.almacen_id)));
            $("input[name=almacen]").data("cod", compraObj.almacen_id);
            $("input[name=almacen]").val(almacen[0].nombre);

            $("#tppago option[value='" + compraObj.tipoPago + "']").prop("selected", true);
            $("#tpmoneda option:eq(0)").prop("selected", true);
            $("input[name=nroFactura]").val(compraObj.NroDocumento);
            $("input[name=tpcambio]").val(compraObj.tipoCambio);
            cambioTpDoc("#tpdoc");
            $("input[name=detalle]").val(compraObj.Detalle);
            $("input[name=codigoControl]").val(compraObj.codigoControl);
            cambiarIngresoMercaderia("#tpmoneda");
            $("#tblprd tbody").html("");
            $("#mensajeEliminado").html("");
            var listaUsuario = window.parent.listaUsuario;
            var modificadopor = listaUsuario["u" + compraObj.usuarioActualizo_id];
            if (compraObj.estado === "inactivo") {
                $("#btnmodificar").ocultar();
                $("#btneliminar").ocultar();
                $("#txtInformacion").html("Registro Eliminado");
                $("#txtInformacion").addClass("txtRojo");
            } else {
                $("#txtInformacion").html("Ult. Actualización");
                $("#txtInformacion").removeClass("txtRojo");
            }
            $("#vlueInformacion").html(compraObj.FechaActualizacion + " , " + modificadopor.nombre);
            var encargadopor = listaUsuario["u" + compraObj.usuarioEncargado_id];
            $("input[name=encargado]").val(encargadopor.nombre);
            $("input[name=encargado]").data("cod", compraObj.usuarioEncargado_id);
            var ocultar = "";
            if (!window.parent.conf[1]) {
                ocultar = "ocultar";
            }
            var listaProd = window.parent.listaProducto;
            var html = "";
            for (var i = 0; i < detalleCompraObj.length; i++) {
                var item = detalleCompraObj[i];
                var lote = item["lote"]
                var vencimiento = item["fechaVencimiento"] === "" ? fechaActual() : item["fechaVencimiento"];
                var producto = listaProd["p" + item.producto_id];
                var vista = producto.codigo.replace(/"/g, '\"').replace(/"/g, "\'") + " - " + producto.nombre.replace(/"/g, '\"').replace(/"/g, "\'");
                html += "<tr ondblclick='eliminarColumna(this)'  data-iddetalle='" + item.id_detalleCompra + "'>";
                html += "<td><div class='grande3'><input name='productoTabla'  autocomplete='off' data-pos='-1' data-cod='" + item.producto_id + "' value=\"" + vista + "\" type='text'  class='izquierda'  onkeyup='cambiarLado(event,this)'  ></div></td>";
                html += "<td><div class='pequeno'><input name='cantidad' type='number'  value='" + item.cantidad + "'  step=0 min=0 class='derecha' onkeyup='cambiarLado(event,this)'  onblur='calcular()'></div></td>";
                html += "<td><div class='pequeno'><input type='number'  step=0.5 min=0 class='derecha' onkeyup='cambiarLado(event,this)' onblur='calcular()' value='" + item.precio + "' name='precioCompra'></div></td>";
                html += "<td><div class='pequeno derecha'>0.00</div></td>";
                html += "<td><div class='pequeno derecha'>0.00</div></td>";
                html += "<td><div class='pequeno derecha'>0.00</div></td>";
                html += "<td><div class='normal derecha " + ocultar + "'><input type='text' name='lote'  onkeyup='cambiarLado(event,this)' readonly value='" + lote + "' style='background:#ebebe4;'></div></td>";
                html += "<td><div class='normal derecha " + ocultar + "'><input type='text' name='vencimiento'  onkeyup='cambiarLado(event,this)' readonly value='" + vencimiento + "'  style='background:#ebebe4;'></div></td>";
                html += "</tr>";

            }
            html += htmlColumna;
            html += htmlColumna;
            html += htmlColumna;
            $("#tblprd tbody").html(html);

            comboBox({identificador: "input[name=productoTabla]", datos: listaProducto, codigo: "id_producto", texto: "codigo", callback: (item) => seleccionarProducto(item), todos: false, extraBusqueda: "codigoBarra", texto2: "nombre"});
            $(".fecha").datepicker();
            $("#tblprd").igualartabla();
            $("#tblprd input").attr("disabled", true);
            calcular();
        }
    });
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
        $(".fecha").datepicker();
        var tr = $("input[name=productoTabla]");
        comboBox({identificador: tr[tr.length - 1], datos: listaProducto, codigo: "id_producto", texto: "codigo", callback: (item) => seleccionarProducto(item), todos: false, extraBusqueda: "codigoBarra", texto2: "nombre"});
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
        if (indexTD === 7) {
            tr.next().click();
            tr.next().find('input:eq(0)').focus();

        } else {
            if (indexTD < 2 || indexTD === 6) {
                td.next().find('input').focus();
                td.next().find('input').select();
            }
            if (indexTD === 2) {
                td.next().next().next().next().find('input').focus();
                td.next().next().next().next().find('input').select();
            }
        }
        $(".cuerposearch ").ocultar();
    }
    if (e.keyCode === 40) {// abajo
        tr.next().find('td:eq(' + indexTD + ') input').focus();
        tr.next().find('td:eq(' + indexTD + ') input').select();
        tr.next().click();
    }
    if (e.keyCode === 37) {//izquierda
        if (indexTD === 0 && indexTr > 0) {
            tr.prev().click();
            tr.prev().find('input:eq(4)').focus();
            tr.prev().find('input:eq(4)').select();
        } else {
            if (indexTD > 0 && indexTD !== 6) {
                td.prev().find('input').focus();
                td.prev().find('input').select();
            } else {
                td.prev().prev().prev().prev().find('input').focus();
                td.prev().prev().prev().prev().find('input').select();
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
function cambiarIngresoMercaderia(ele) {
    var valor = $(ele).find("option:selected").val();
    if (valor === 'Bs') {
        estadoDolar = false;
        $('#tblprd thead div:eq(2)').html('Precio Bs');
        $('#tblprd thead div:eq(4)').html('Total Bs');
        $('#tblprd thead div:eq(3)').html('Precio $us');
        $('#tblprd thead div:eq(5)').html('Total $us');
    } else {
        estadoDolar = true;
        $('#tblprd thead div:eq(2)').html('Precio $us');
        $('#tblprd thead div:eq(4)').html('Total $us');
        $('#tblprd thead div:eq(3)').html('Precio Bs');
        $('#tblprd thead div:eq(5)').html('Total Bs');
    }
    $("#tblprd tbody").html(htmlColumna);
    $("#tblprd tbody").append(htmlColumna);
    $("#tblprd tbody").append(htmlColumna);
    $("#tblprd tbody").append(htmlColumna);
    comboBox({identificador: "input[name=productoTabla]", datos: listaProducto, codigo: "id_producto", texto: "codigo", callback: (item) => seleccionarProducto(item), todos: false, extraBusqueda: "codigoBarra", texto2: "nombre"});
    $(".fecha").datepicker();
    $("#tblprd").igualartabla();
    calcular();
}
function seleccionarProducto(item) {
    var tuplaSeleccionada = $("#tblprd tr.Tuplaseleccionada");
    var precioCompra = parseFloat(item.precioCompra);
    tuplaSeleccionada.find("input[name=cantidad]").val(1);
    if (estadoDolar) {
        var tpcambio = $('input[name=tpcambio]').val();
        tpcambio = tpcambio === '' ? 0 : parseFloat(tpcambio);
        precioCompra = precioCompra / tpcambio;
    }
    tuplaSeleccionada.find("input[name=precioCompra]").val(precioCompra);
    tuplaSeleccionada.find("input[name=cantidad]").html(1);
    calcular();
}
function eliminarColumna(ele) {
    if ($("input[name=fecha]").attr("disabled") === "disabled") {
        return;
    }
    $(ele).remove();
    var cantColuman = $("#tblprd tbody tr").length;
    if (cantColuman <= 3) {
        $("#tblprd tbody").append(htmlColumna);
        var tr = $("input[name=productoTabla]");
        comboBox({identificador: tr[tr.length - 1], datos: listaProducto, codigo: "id_producto", texto: "codigo", callback: (item) => seleccionarProducto(item), todos: false, extraBusqueda: "codigoBarra", texto2: "nombre"});
        $(".fecha").datepicker();
        $("#tblprd").igualartabla();
    }
    calcular();
}
function calcular() {
    var tpcambio = $('input[name=tpcambio]').val();
    tpcambio = tpcambio === '' ? 0 : parseFloat(tpcambio);
    var tr = $("#tblprd tbody tr");
    var cantidadTotal = 0;
    var precioTotalA = 0;
    var precioTotalB = 0;
    var precioTotal2A = 0;
    var precioTotal2B = 0;
    for (var i = 0; i < tr.length; i++) {
        var cant = $(tr[i]).find('input[name=cantidad]').val();
        cant = cant === '' ? 0 : parseFloat(cant);
        var a = $(tr[i]).find('input[name=precioCompra]').val();
        a = a === '' ? 0 : parseFloat(a);
        var b = 0;
        if (estadoDolar) {
            b = a * tpcambio;
        } else {
            b = a / tpcambio;
        }
        var totalB = b * cant;
        var totalA = a * cant;
        $(tr[i]).find('td:eq(3) div').html(format(b));
        $(tr[i]).find('td:eq(5) div').html(format(totalB));
        $(tr[i]).find('td:eq(4) div').html(format(totalA));
        cantidadTotal += cant;
        precioTotalB += b;
        precioTotalA += a;
        precioTotal2A += totalA;
        precioTotal2B += totalB;
    }
    if (estadoDolar) {
        $('#totalGeneral').html(format(precioTotal2B));
        $('#totalGeneralD').html(format(precioTotal2A));
    } else {
        $('#totalGeneral').html(format(precioTotal2A));
        $('#totalGeneralD').html(format(precioTotal2B));
    }
    $('#tblprd tfoot td:eq(1) div').html(cantidadTotal);
    $('#tblprd tfoot td:eq(2) div').html(format(precioTotalA));
    $('#tblprd tfoot td:eq(3) div').html(format(precioTotalB));
    $('#tblprd tfoot td:eq(4) div').html(format(precioTotal2A));
    $('#tblprd tfoot td:eq(5) div').html(format(precioTotal2B));
}
function cambioTpDoc(ele) {
    var estado = $(ele).find("option:selected").val();
    if (estado === "Compra Facturada") {
        $("input[name=nroAutorizacion").visible(1);
        $("#txtaut").visible(1);
        $("input[name=codigoControl").visible(1);
        $("#txtcodigoControl").visible(1);
        $("#txtfac").text("Nro Factura");
        $("input[name=detalle]").val("Compra Facturada ");
    } else {
        $("input[name=detalle]").val("Compra Documento ");
        $("input[name=nroAutorizacion").ocultar();
        $("#txtaut").ocultar();
        $("input[name=nroAutorizacion").val("");
        $("input[name=txtcodigoControl").val("");
        $("#txtfac").text("Nro Documento");
        $("input[name=codigoControl").ocultar(1);
        $("#txtcodigoControl").ocultar(1);
    }
}
function registrar() {
    var json = variables("#formCompra");
    json.tpmoneda = $("#tpmoneda option:selected").val();
    json.tppago = $("#tppago option:selected").val();
    json.tpcambio = $("input[name=tpcambio]").val();
    json.proceso = 'registrarCompra';
    json.id_compra = id_Compra;
    json.provedor = $("input[name=Provedor]").data("cod");
    json.encargado = $("input[name=encargado]").data("cod");
    json.almacen = $("input[name=almacen]").data("cod");

    if (json.provedor === "0") {
        alertaRapida("No ha seleccionado ningun provedor.", "error");
        return;
    }
    if (json.almacen === "0") {
        alertaRapida("No ha seleccionado ningun almacén.", "error");
        return;
    }
    if (json.detalle.length === 0) {
        alertaRapida("No se ha ingresado el detalle del almacen.", "error");
        return;
    }
    if (!validar("texto y entero", json.detalle)) {
        alertaRapida("El detalle solo puede tener Letra y numeros, no otro tipo de caracteres.", "error");
        return;
    }

    if (json.almacen === "0") {
        alertaRapida("No se ha seleccionado al almacen.", "error");
        return;
    }
    var lista = $("#tblprd tbody tr");
    var listaCompra = [];
    for (var i = 0; i < lista.length; i++) {
        var cantidad = $(lista[i]).find("input[name=cantidad]").val();
        var precio = $(lista[i]).find("input[name=precioCompra]").val();
        var nroLote = $(lista[i]).find("input[name=lote]").val();
        var vencimiento = $(lista[i]).find("input[name=vencimiento]").val();
        var idDetalle = $(lista[i]).data("iddetalle");
        var producto = $(lista[i]).find("input[name=productoTabla]").data("cod");
        cantidad = cantidad === "" ? 0 : parseInt(cantidad);
        precio = precio === "" ? 0 : parseFloat(precio);
        if (json.tpmoneda === "$us") {
            precio = precio * parseFloat(json.tpcambio);
        }
        producto = producto === "" ? 0 : parseFloat(producto);
        if (producto === 0 || cantidad <= 0) {
            continue;
        }
        listaCompra.push({
            id: producto, cant: cantidad, precio: precio, idDetalle: idDetalle, nroLote: nroLote, vencimiento: vencimiento
        });
    }
    if (listaCompra.length === 0) {
        alertaRapida("No ha ingresado ningun producto a la lista de compra.", "error");
        return;
    }
    json.listaCompra = listaCompra;
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
            if (id_Compra === 0) {
                alertaRapida("La compra se registro correctamente.");
            } else {
                alertaRapida("La compra se actualizo correctamente.");
            }
            id_Compra = json.result;
            if (window.parent.conf[9]) {
                imprimir(true);
            } else {
                nuevo(0);
            }


        }
    });
}
function imprimir(buscarCompra) {
    cargando(true);
    $.get(url, {id_Compra: id_Compra, proceso: "imprimirCompra"}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error, "error");
        } else {
            var detalle = json.result.detalle;
            var compra = json.result.compra;
            var almacen = json.result.almacen;
            imprimirNotaCompra(compra, detalle, almacen);
            if (buscarCompra) {
                nuevo(0);
            }
        }
    });
}
function imprimirNotaCompra(compra, detallecompra, almacen) {
    var contenido = "";
    var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal === null) {
        window.parent.cerrarSession();
        return;
    }
    var provedor = {};
    for (var i = 0; i < listaProvedor.length; i++) {
        if ((listaProvedor[i].id_provedor + "") === (compra.provedor_id + "")) {
            provedor = listaProvedor[i];
            break;
        }
    }
    var nroCompra = compra.NroDocumento;
    var nroAutorizacion = compra.Autorizacion;
    var fecha = compra.fecha;
    var codigoControl = (compra.codigoControl + "").toUpperCase();
    var listaUsuario = window.parent.listaUsuario;
    var recepcionista = listaUsuario["u" + compra.usuarioEncargado_id];
    usuarioLocal = $.parseJSON(usuarioLocal);
    var ocultar = "";
    if (!window.parent.conf[1]) {
        ocultar = "ocultar";
    }
    var htmlHead = "     <div class='row mt-2'>";
    htmlHead += "            <div class='col-2'> ";
    htmlHead += "                <div class='inlineblock mr-2 negrilla'>NIT:</div>";
    htmlHead += "                <div class='inlineblock'>" + provedor.nit + "</div>";
    htmlHead += "            </div>";
    htmlHead += "            <div class='col-5'>";
    htmlHead += "                <div class='inlineblock mr-2 negrilla'>Proveedor:</div>";
    htmlHead += "                <div class='inlineblock'>" + provedor.nombre + "</div>";
    htmlHead += "            </div>";
    htmlHead += "            <div class='col-5'> ";
    htmlHead += "                <div class='inlineblock mr-2 negrilla'>Encargado:</div>";
    htmlHead += "                <div class='inlineblock'>" + recepcionista.nombre + "</div>";
    htmlHead += "            </div>";
    htmlHead += "        </div>";


    contenido += "<table>";
    contenido += "    <thead>";
    contenido += "        <th><div style='width:100px;'>CANT.</div></th>";
    if (ocultar === "") {
        contenido += "        <th><div style='width:150px;'>NRO.LOTE</div></th>";
        contenido += "        <th><div style='width:100px;'>F.VENC.</div></th>";
        contenido += "        <th><div style='width:410px;'>CONCEPTO</div></th>";
    } else {
        contenido += "        <th><div style='width:660px;'>CONCEPTO</div></th>";
    }
    contenido += "        <th><div style='width:100px;'>PRECIO U.</div></th>";
    contenido += "        <th><div style='width:100px;'>SUBTOTAL</div></th>";
    contenido += "    </thead>";
    contenido += "    <tbody class='detalleprd'>";
    listaProducto2 = window.parent.listaProducto;
    var total = 0;
    for (var i = 0; i < detallecompra.length; i++) {
        var item = detallecompra[i];
        var lote = item["lote"]
        var vencimiento = item["fechaVencimiento"] === "" ? "" : item["fechaVencimiento"];
        var producto = listaProducto2["p" + item.producto_id]
        var precio = parseFloat(item["precio"])
        var cantidad = parseFloat(item["cantidad"])
        var subtotal = cantidad * precio;
        total += subtotal;
        contenido += "<tr>";
        contenido += "  <td><div style='width:100px;' class='derecha'>" + format(cantidad) + "</div></td>";
        if (ocultar === "") {
            contenido += "  <td><div style='width:150px;'>" + lote + "</div></td>";
            contenido += "  <td><div style='width:100px;'>" + vencimiento + "</div></td>";
            contenido += "  <td><div style='width:410px;' class='izquierda'>" + producto.nombre + "</div></td>";
        } else {
            contenido += "  <td><div style='width:660px;'  class='izquierda'>" + producto.nombre + "</div></td>";
        }

        contenido += "  <td><div style='width:100px;' class='derecha'>" + format(precio) + "</div></td>";
        contenido += "  <td><div style='width:100px;' class='derecha'>" + format(subtotal) + "</div></td>";
        contenido += "</tr>";

    }
    contenido += "  </tbody>";
    contenido += "  <tfoot>";
    contenido += "      <tr >";
    contenido += "<td><div style='width:100px;'></div></td>";
    if (ocultar === "") {
        contenido += "<td><div style='width:150px;'></div></td>";
        contenido += "<td><div style='width:100px;'></div></td>";
        contenido += "<td><div style='width:410px;'></div></td>";
    } else {
        contenido += "<td><div style='width:660px;'></div></td>";
    }

    contenido += "<td><div style='width:100px;' class='derecha'>TOTAL Bs</div></td>";
    contenido += "<td><div style='width:100px;' class='derecha'>" + format(total) + "</div></td>";
    contenido += "      </tr>";
    contenido += "  </tfoot>";
    contenido += "</table>";


    contenido += "        <div class='rowmt-3'>";
    contenido += "            <div class='col-12'> <span class='negrilla'>Glosa:</span>" + compra.Detalle + "</td></div>";
    contenido += "        </div>";

    contenido += "        <div class='row centrar mt-3'>";
    if (compra.estado === "inactivo") {
        var listaUsuario = window.parent.listaUsuario;
        var modificadopor = listaUsuario["u" + compra.usuarioActualizo_id];
        contenido += "<div class='col-12 negrilla centrar' style='font-size:16px; color:red;'><div class='p-3'>ESTE DOCUMENTO SE ELIMINO " + compra.FechaActualizacion + ", POR " + modificadopor.nombre.toUpperCase() + "</div></div>";
    }
    var empresa = window.parent.empresaD;
    if (empresa.firmaNotaCompra1 !== "") {
        contenido += "<div class='col-3'><div style='border-top: solid 1px black; margin: 5px 23px;margin-top: 120px;'>" + empresa.firmaNotaCompra1 + "</div></div>";
    }
    if (empresa.firmaNotaCompra2 !== "") {
        contenido += "<div class='col-3'><div style='border-top: solid 1px black; margin: 5px 23px;margin-top: 120px;'>" + empresa.firmaNotaCompra2 + "</div></div>";
    }
    if (empresa.firmaNotaCompra3 !== "") {
        contenido += "<div class='col-3'><div style='border-top: solid 1px black; margin: 5px 23px;margin-top: 120px;'>" + empresa.firmaNotaCompra3 + "</div></div>";
    }
    if (empresa.firmaNotaCompra4 !== "") {
        contenido += "<div class='col-3'><div style='border-top: solid 1px black; margin: 5px 23px;margin-top: 120px;'>" + empresa.firmaNotaCompra4 + "</div></div>";
    }
    contenido += "        </div>";

    var htmlDerecha = "";
    if (compra.tipo === "Nota de Compra") {
        htmlDerecha += " <div> ";
        htmlDerecha += "    <div class='inlineblock mr-2 negrilla'>Fecha: </div>";
        htmlDerecha += "    <div class='inlineblock'>" + fecha + "</div>";
        htmlDerecha += "</div>";
        htmlDerecha += " <div> ";
        htmlDerecha += "    <div class='inlineblock mr-2 negrilla'>Tipo Doc.: </div>";
        htmlDerecha += "    <div class='inlineblock'>" + compra.tipo + "</div>";
        htmlDerecha += "</div>";
        htmlDerecha += " <div> ";
        htmlDerecha += "    <div class='inlineblock mr-2 negrilla'>Nro. Nota: </div>";
        htmlDerecha += "    <div class='inlineblock'>" + nroCompra + "</div>";
        htmlDerecha += "</div>";
        htmlDerecha += " <div> ";
        htmlDerecha += "    <div class='inlineblock mr-2 negrilla'>Almacén: </div>";
        htmlDerecha += "    <div class='inlineblock'>" + almacen.nombre + "</div>";
        htmlDerecha += "</div>";
    } else {
        htmlDerecha += " <div> ";
        htmlDerecha += "    <div class='inlineblock mr-2 negrilla'>Fecha: </div>";
        htmlDerecha += "    <div class='inlineblock'>" + fecha + "</div>";
        htmlDerecha += "</div>";
        htmlDerecha += " <div> ";
        htmlDerecha += "    <div class='inlineblock mr-2 negrilla'>Tipo Doc.: </div>";
        htmlDerecha += "    <div class='inlineblock'>" + compra.tipo + "</div>";
        htmlDerecha += "</div>";
        htmlDerecha += " <div> ";
        htmlDerecha += "    <div class='inlineblock mr-2 negrilla'>Nro. Factura: </div>";
        htmlDerecha += "    <div class='inlineblock'>" + nroCompra + "</div>";
        htmlDerecha += "</div>";
        htmlDerecha += " <div> ";
        htmlDerecha += "    <div class='inlineblock mr-2 negrilla'>Nro . Autorización: </div>";
        htmlDerecha += "    <div class='inlineblock'>" + nroAutorizacion + "</div>";
        htmlDerecha += "</div>";
        htmlDerecha += " <div> ";
        htmlDerecha += "    <div class='inlineblock mr-2 negrilla'>Código Control: </div>";
        htmlDerecha += "    <div class='inlineblock'>" + codigoControl + "</div>";
        htmlDerecha += "</div>";
        htmlDerecha += " <div> ";
        htmlDerecha += "    <div class='inlineblock mr-2 negrilla'>Almacén: </div>";
        htmlDerecha += "    <div class='inlineblock'>" + almacen.nombre + "</div>";
        htmlDerecha += "</div>";
    }

    imprimirReporte({contenido: contenido, sucursal_id: almacen.sucursal_id, titulo: "Nota De Recepción de Compra", datosHead: htmlHead, encabezadoThead: true, htmlDerecha: htmlDerecha});
}
function eliminarCompra(tipo) {
    if (tipo === 1) {
        $("body").msmPregunta("¿Esta seguro de eliminar este registro de compra?", "eliminarCompra(2)");
    } else {
        $.post(url, {proceso: "eliminarCompra", id_Compra: id_Compra}, function (response) {
            cargando(false);
            var json = $.parseJSON(response);
            if (json.error.length > 0) {
                if ("Error Session" === json.error) {
                    window.parent.cerrarSession();
                }
                alertaRapida(json.error, "error");
            } else {
                nuevo(0);
                alertaRapida("El registro se elimino correctamente.");
                cargarCompra("actual");
            }
        });
    }
}

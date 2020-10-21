var url = '../Controlador/TraspasoProducto_Controlador.php';
var contador = 0;
var listaAlmacen = {};
var listaProducto = {};
var id_Traspaso = 0;
var htmlColumna = '';
var tamanopantalla = $(window).height() - 425;
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
        var tamanopantalla = $(window).height() - 425;
            $("#tblprd tbody").css("height", tamanopantalla);
    });
    htmlColumna += "<tr ondblclick='eliminarColumna(this)' data-iddetalle='0'>";
    htmlColumna += "<td><div class='grande4'><input autocomplete='off' data-cod='0' data-pos='-1' type='text' class='izquierda'  onkeyup='cambiarLado(event,this)' name='productoTabla' ></div></td>";
    htmlColumna += "<td><div class='normal'><input type='number' value='0'  step=0 min=0 class='derecha' onkeyup='cambiarLado(event,this)'  onblur='calcular()' name='cantidad'></div></td>";
    htmlColumna += "</tr>";
    var datos = window.parent.listaUsuario;
    var listaUsuario = Object.keys(datos).map((key) => datos[key]);
    var listaPermisosUsuarioRapido = window.parent.listaPermisosUsuarioRapido;
    var todosEncargados = listaPermisosUsuarioRapido[208];
    if (!todosEncargados) {
        listaUsuario = listaUsuario.filter((item) => (item.sucursal_id + "") === ("" + usuarioLocal.sucursal_id));
    }
    comboBox({identificador: "input[name=encargado]", valueDefault: usuarioLocal.id_usuario, datos: listaUsuario, codigo: "id_usuario", texto: "nombre", todos: false});
    nuevo(0);
    cargarData("", false);
});
function nuevo(tipo) {
    $("#btnimprimir").ocultar();
    if (tipo === 1) {
        $("#formCompra input").attr("disabled", false);
        $("#btncancelar").visible();
        $("#btnregistrar").visible();
        $("#btnnuevo").ocultar();
        $("#btnmodificar").ocultar();
        $("#btneliminar").ocultar();
        $("h1").text("Nuevo Traspaso");
        vaciarFromulario();
        $("#tblprd input").attr("disabled", false);
        $("input[name=detalle]").val("Traspaso de producto");
        cargarData("activo");
    } else {
        if (id_Traspaso === 0) {
            vaciarFromulario();
        } else {
            cargarTraspaso("actual");
        }
        $("#vlueInformacion").html("");
        $("#txtInformacion").html("");
        $("h1").text("Traspaso de Producto");
        $("#formCompra input").attr("disabled", true);
        $("#tblprd input").attr("disabled", true);
        $("input[name=detalle]").val("Traspaso de producto");
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
            comboBox({identificador: "input[name=almacenOrigen]",ordenarPor:"posicion", datos: listaAlmacen, codigo: "id_almacen", texto: "nombre", todos: false});
            comboBox({identificador: "input[name=almacenFin]",ordenarPor:"posicion", datos: listaAlmacen, codigo: "id_almacen", texto: "nombre", todos: false});
            if (listaAlmacen.length > 0) {
                $("input[name=almacenOrigen]").data("cod", listaAlmacen[0].id_almacen);
                $("input[name=almacenOrigen]").val(listaAlmacen[0].nombre);
                $("input[name=almacenFin]").data("cod", listaAlmacen[0].id_almacen);
                $("input[name=almacenFin]").val(listaAlmacen[0].nombre);
            }
            listaProducto = json.result.productos;
            var compraLocal = localStorage.getItem("idtraspaso");
            if (compraLocal !== null) {
                id_Traspaso = compraLocal;
                localStorage.removeItem("idtraspaso");
                cargarTraspaso("actual");
            } else {
                if (nuevo) {
                    $("#tblprd tbody").html(htmlColumna);
                    $("#tblprd tbody").append(htmlColumna);
                    $("#tblprd tbody").append(htmlColumna);
                    $("#tblprd tbody").append(htmlColumna);
                    $("#tblprd").igualartabla();
                    comboBox({identificador: "input[name=productoTabla]", datos: listaProducto, codigo: "id_producto", texto: "codigo", callback: (item) => calcular(), todos: false, extraBusqueda: "codigoBarra", texto2: "nombre"});
                }

            }
        }
    });
}
function vaciarFromulario() {
    $("#formCompra input[name=detalle]").val("");
    $("#formCompra input[name=nroTraspaso]").val("");
    id_Traspaso = 0;
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
    if (id_Traspaso === 0) {
        alertaRapida("No ha seleccionado ninguna compra para modificar.");
        return;
    }
    $("#btnimprimir").ocultar();
    $("#formCompra input").attr("disabled", false);
    $("#tblprd input").attr("disabled", false);
    $("#btncancelar").visible();
    $("#btnregistrar").visible();
    $("#btnnuevo").ocultar();
    $("#btnmodificar").ocultar();
    $("#btneliminar").ocultar();
    $("h1").text("Modificando Traspaso de Producto");
    $("#btnPrimera").ocultar();
    $("#btnAnterior").ocultar();
    $("#btnSiguiente").ocultar();
    $("#btnUltimo").ocultar();
    cargarData("", false);
}
function cargarTraspaso(tipo) {
    cargando(true);
    $.get(url, {proceso: 'buscarTraspaso', tipo: tipo, idtraspaso: id_Traspaso}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error, "error");
        } else {
            var traspasoObj = json.result.traspaso;
            var detalleTraspasoObj = json.result.detalle;
            if (traspasoObj === "null" || traspasoObj === null) {
                return;
            }
            $("#formCompra input").attr("disabled", true);
            $("#tblprd input").attr("disabled", true);
            id_Traspaso = traspasoObj.id_traspasoProducto;
            var fechaSplit = traspasoObj.fecha.split(" ");
            $("#btnimprimir").visible();
            $("#btnmodificar").visible();
            $("#btneliminar").visible();
            $("input[name=fecha]").val(fechaSplit[0]);

            var almacenOrigen = listaAlmacen.filter((item) => ("" + item.id_almacen === ("" + traspasoObj.almacenOrigen)));
            $("input[name=almacen]").data("cod", traspasoObj.almacenOrigen);
            $("input[name=almacen]").val(almacenOrigen[0].nombre);

            var almacenFin = listaAlmacen.filter((item) => ("" + item.id_almacen === ("" + traspasoObj.almacenDestino)));
            $("input[name=almacen]").data("cod", traspasoObj.almacenDestino);
            $("input[name=almacen]").val(almacenFin[0].nombre);

            $("input[name=nroTraspaso]").val(traspasoObj.nroDocumento);
            $("input[name=detalle]").val(traspasoObj.detalle);

            $("#tblprd tbody").html("");
            $("#mensajeEliminado").html("");
            var listaUsuario = window.parent.listaUsuario;
            var modificadopor = listaUsuario["u" + traspasoObj.usuarioActualizo];
            if (traspasoObj.estado === "inactivo") {
                $("#btnmodificar").ocultar();
                $("#btneliminar").ocultar();
                $("#txtInformacion").html("Registro Eliminado");
                $("#txtInformacion").addClass("txtRojo");
            } else {
                $("#txtInformacion").html("Ult. Actualización");
                $("#txtInformacion").removeClass("txtRojo");
            }
            $("#vlueInformacion").html(traspasoObj.fechaActualizado + " , " + modificadopor.nombre);
            var encargadopor = listaUsuario["u" + traspasoObj.usuarioEncargado];
            $("input[name=encargado]").val(encargadopor.nombre);
            $("input[name=encargado]").data("cod", traspasoObj.usuarioEncargado);
            var listaProd = window.parent.listaProducto;
            var html = "";
            for (var i = 0; i < detalleTraspasoObj.length; i++) {
                var item = detalleTraspasoObj[i];
                var producto = listaProd["p" + item.producto_id];
                var vista = producto.codigo.replace(/"/g, '\"').replace(/"/g, "\'") + " - " + producto.nombre.replace(/"/g, '\"').replace(/"/g, "\'");
                html += "<tr ondblclick='eliminarColumna(this)'  data-iddetalle='" + item.id_detalleCompra + "'>";
                html += "<td><div class='grande4'><input name='productoTabla'  autocomplete='off' data-pos='-1' data-cod='" + item.producto_id + "' value=\"" + vista + "\" type='text'  class='izquierda'  onkeyup='cambiarLado(event,this)'  ></div></td>";
                html += "<td><div class='normal'><input name='cantidad' type='number'  value='" + item.cantidad + "'  step=0 min=0 class='derecha' onkeyup='cambiarLado(event,this)'  onblur='calcular()'></div></td>";
                html += "</tr>";

            }
            html += htmlColumna;
            html += htmlColumna;
            html += htmlColumna;
            $("#tblprd tbody").html(html);

            comboBox({identificador: "input[name=productoTabla]", datos: listaProducto, codigo: "id_producto", texto: "codigo", callback: (item) => calcular(), todos: false, extraBusqueda: "codigoBarra", texto2: "nombre"});
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
        var tr = $("input[name=productoTabla]");
        comboBox({identificador: tr[tr.length - 1], datos: listaProducto, codigo: "id_producto", texto: "codigo", callback: (item) => calcular(), todos: false, extraBusqueda: "codigoBarra", texto2: "nombre"});
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
            tr.next().click();
            tr.next().find('input:eq(0)').focus();

        } else {
            td.next().find('input').focus();
            td.next().find('input').select();
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
            tr.prev().find('input:eq(1)').focus();
            tr.prev().find('input:eq(1)').select();
        } else {
            td.prev().find('input').focus();
            td.prev().find('input').select();
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
    if ($("input[name=fecha]").attr("disabled") === "disabled") {
        return;
    }
    $(ele).remove();
    var cantColuman = $("#tblprd tbody tr").length;
    if (cantColuman <= 3) {
        $("#tblprd tbody").append(htmlColumna);
        var tr = $("input[name=productoTabla]");
        comboBox({identificador: tr[tr.length - 1], datos: listaProducto, codigo: "id_producto", texto: "codigo", callback: (item) => calcular(), todos: false, extraBusqueda: "codigoBarra", texto2: "nombre"});
        $(".fecha").datepicker();
        $("#tblprd").igualartabla();
    }
    calcular();
}
function calcular() {
    var tr = $("#tblprd tbody tr");
    var cantidadTotal = 0;
    for (var i = 0; i < tr.length; i++) {
        var cant = $(tr[i]).find('input[name=cantidad]').val();
        cant = cant === '' ? 0 : parseFloat(cant);
        cantidadTotal += cant;
    }
    $('#tblprd tfoot td:eq(1) div').html(cantidadTotal);
}
function registrar() {
    var json = variables("#formCompra");
    json.proceso = 'registrarTraspaso';
    json.id_traspasoProducto = id_Traspaso;
    json.encargado = $("input[name=encargado]").data("cod");
    json.almacenOrigen = $("input[name=almacenOrigen]").data("cod");
    json.almacenFin = $("input[name=almacenFin]").data("cod");

    if (json.almacenOrigen === "0") {
        alertaRapida("No ha seleccionado ningun almacén Origen.", "error");
        return;
    }
    if (json.almacenFin === "0") {
        alertaRapida("No ha seleccionado ningun almacén Destino.", "error");
        return;
    }
    if (json.detalle.length === 0) {
        alertaRapida("No se ha ingresado el detalle del traspaso.", "error");
        return;
    }

    var lista = $("#tblprd tbody tr");
    var listaTraspaso = [];
    for (var i = 0; i < lista.length; i++) {
        var cantidad = $(lista[i]).find("input[name=cantidad]").val();
        var idDetalle = $(lista[i]).data("iddetalle");
        var producto = $(lista[i]).find("input[name=productoTabla]").data("cod");
        cantidad = cantidad === "" ? 0 : parseInt(cantidad);
        producto = producto === "" ? 0 : parseFloat(producto);
        if (producto === 0 || cantidad <= 0) {
            continue;
        }
        listaTraspaso.push({
            id: producto, cant: cantidad, idDetalle: idDetalle
        });
    }
    if (listaTraspaso.length === 0) {
        alertaRapida("No ha ingresado ningun producto a la lista de traspaso.", "error");
        return;
    }
    json.listaTraspaso = listaTraspaso;
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
            if (id_Traspaso === 0) {
                alertaRapida("La compra se registro correctamente.");
            } else {
                alertaRapida("La compra se actualizo correctamente.");
            }
            id_Traspaso = json.result;
            if (window.parent.conf[9]) {
                imprimir(true);
            } else {
                nuevo(0);
            }


        }
    });
}
function imprimir(resetear) {
    cargando(true);
    $.get(url, {id_Traspaso: id_Traspaso, proceso: "imprimirTraspaso"}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error, "error");
        } else {
            var detalle = json.result.detalle;
            var traspaso = json.result.traspaso;
            var almacenOrigen = json.result.almacenOrigen;
            var almacenFin = json.result.almacenFin;
            imprimirNotaTraspaso(traspaso, detalle, almacenOrigen, almacenFin);
            if (resetear) {
                nuevo(0);
            }
        }
    });
}
function imprimirNotaTraspaso(traspaso, detalleTraspaso, almacenOrigen, almacenFin) {
    var contenido = "";
    var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal === null) {
        window.parent.cerrarSession();
        return;
    }
    var nroTraspaso = traspaso.nroDocumento;
    var fecha = traspaso.fecha;
    var listaUsuario = window.parent.listaUsuario;
    var recepcionista = listaUsuario["u" + traspaso.usuarioEncargado];
    usuarioLocal = $.parseJSON(usuarioLocal);

    var htmlHead = "<div class='row mt-2'>";
    htmlHead += "       <div class='col-3'> ";
    htmlHead += "           <div class='inlineblock mr-2 negrilla'>Fecha:</div>";
    htmlHead += "           <div class='inlineblock'>" + fecha + "</div>";
    htmlHead += "       </div>";
    htmlHead += "       <div class='col-4'>";
    htmlHead += "           <div class='inlineblock mr-2 negrilla'>Almacén Origen:</div>";
    htmlHead += "           <div class='inlineblock'>" + almacenOrigen.nombre + "</div>";
    htmlHead += "       </div>";
    htmlHead += "       <div class='col-4'> ";
    htmlHead += "           <div class='inlineblock mr-2 negrilla'>Almacén Destino:</div>";
    htmlHead += "           <div class='inlineblock'>" + almacenFin.nombre + "</div>";
    htmlHead += "       </div>";
    htmlHead += "       <div class='col-7'> ";
    htmlHead += "           <div class='inlineblock mr-2 negrilla'>Detalle:</div>";
    htmlHead += "           <div class='inlineblock'>" + traspaso.detalle + "</div>";
    htmlHead += "       </div>";
    htmlHead += "       <div class='col-5'> ";
    htmlHead += "           <div class='inlineblock mr-2 negrilla'>Encargado:</div>";
    htmlHead += "           <div class='inlineblock'>" + recepcionista.nombre + "</div>";
    htmlHead += "       </div>";
    htmlHead += "   </div>";
    

    contenido += "<table>";
    contenido += "    <thead>";
    contenido += "        <th><div style='width:100px;'>Código</div></th>";
    contenido += "        <th><div style='width:410px;'>Producto</div></th>";
    contenido += "        <th><div style='width:100px;'>Cantidad</div></th>";
    contenido += "    </thead>";
    contenido += "    <tbody class='detalleprd'>";
    listaProducto2 = window.parent.listaProducto;
    var total = 0;
    for (var i = 0; i < detalleTraspaso.length; i++) {
        var item = detalleTraspaso[i];
        var producto = listaProducto2["p" + item.producto_id]
        var cantidad = parseInt(item["cantidad"]);
        total += cantidad;
        contenido += "<tr>";
        contenido += "  <td><div style='width:100px;' class='derecha'>" + producto.codigo + "</div></td>";
        contenido += "  <td><div style='width:410px;' class='izquierda'>" + producto.nombre + "</div></td>";
        contenido += "  <td><div style='width:100px;' class='derecha'>" + cantidad + "</div></td>";
        contenido += "</tr>";

    }
    contenido += "  </tbody>";
    contenido += "  <tfoot>";
    contenido += "      <tr >";
    contenido += "<td><div style='width:100px;'></div></td>";
    contenido += "<td><div style='width:410px;' class='derecha'></div></td>";
    contenido += "<td><div style='width:100px;' class='derecha'>" + total + "</div></td>";
    contenido += "      </tr>";
    contenido += "  </tfoot>";
    contenido += "</table>";


   

    contenido += "        <div class='row centrar mt-3'>";
    if (traspaso.estado === "inactivo") {
        var listaUsuario = window.parent.listaUsuario;
        var modificadopor = listaUsuario["u" + traspaso.usuarioActualizo];
        contenido += "<div class='col-12 negrilla centrar' style='font-size:16px; color:red;'><div class='p-3'>ESTE DOCUMENTO SE ELIMINO " + compra.fechaActualizado + ", POR " + modificadopor.nombre.toUpperCase() + "</div></div>";
    }
    /*var empresa = window.parent.empresaD;
    if (empresa.firmaNotaCompra1 !== "") {
     contenido += "<div class='col-3'><div style='border-top: solid 1px black; margin: 5px 23px;margin-top: 120px;'>" + empresa.firmaNotaCompra1 + "</div></div>";
     }
     if (empresa.firmaNotaCompra2 !== "") {
     contenido += "<div class='col-3'><div style='border-top: solid 1px black; margin: 5px 23px;margin-top: 120px;'>" + empresa.firmaNotaCompra2 + "</div></div>";
     }*/
    contenido += "        </div>";

    var htmlDerecha = "";
    htmlDerecha += " <div> ";
    htmlDerecha += "    <div class='inlineblock mr-2 negrilla'>Fecha: </div>";
    htmlDerecha += "    <div class='inlineblock'>" + fecha + "</div>";
    htmlDerecha += "</div>";
    htmlDerecha += " <div> ";
    htmlDerecha += "    <div class='inlineblock mr-2 negrilla'>Tipo Doc.: </div>";
    htmlDerecha += "    <div class='inlineblock'>Nota de Traspaso</div>";
    htmlDerecha += "</div>";
    htmlDerecha += " <div> ";
    htmlDerecha += "    <div class='inlineblock mr-2 negrilla'>Nro. Doc.: </div>";
    htmlDerecha += "    <div class='inlineblock'>" + nroTraspaso + "</div>";
    htmlDerecha += "</div>";
    imprimirReporte({contenido: contenido, sucursal_id: almacenOrigen.sucursal_id, titulo: "Nota De Traspaso", datosHead: htmlHead, encabezadoThead: true, htmlDerecha: htmlDerecha});
}
function eliminarTraspaso(tipo) {
    if (tipo === 1) {
        $("body").msmPregunta("¿Esta seguro de eliminar este registro de compra?", "eliminarTraspaso(2)");
    } else {
        $.post(url, {proceso: "eliminarTraspaso", id_Traspaso: id_Traspaso}, function (response) {
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
                cargarTraspaso("actual");
            }
        });
    }
}

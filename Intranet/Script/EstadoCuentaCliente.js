var url = '../Controlador/EstadoCuentaCliente_Controlador.php';
var tamanopantalla = $(window).height() - 282;
var clienteSeleccionado;
var tipo = "Xhistorico";
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
    var listaCliente = window.parent.listaCliente;
    comboBox({identificador: "input[name=buscadorCliente]", datos: listaCliente, codigo: "id_cliente", texto: "ci", texto2: "nombre", todos: false, callback: (item) => seleccionarCliente(item)});
});
function cambiarFormulario(formulario) {
    if(formulario === "Xhistorico"){
        alertaRapida("Se cambio la vista de reporte por histórico de registro.");
    }else{
        alertaRapida("Se cambio la vista de reporte agrupandolo por ventas.");
    }
    tipo = formulario;
    seleccionarCliente(clienteSeleccionado);
}
function seleccionarCliente(cliente) {
    if (cliente) {
        clienteSeleccionado = cliente;
    } else {
        cliente = clienteSeleccionado;
    }
    if (!cliente) {
        return;
    }
    var codigo = cliente.codigo;
    codigo = codigo === "" ? "-" : codigo;
    var nombre = cliente.nombre;
    nombre = nombre === "" ? "-" : nombre;
    var ci = cliente.ci;
    ci = ci === "" ? "-" : ci;
    $("input[name=ci]").val(ci);
    $("input[name=cliente]").val(nombre);
    $("input[name=codigo]").val(codigo);
    $("#clienteSeleccionado").visible();

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
            var lista = json.result;
            var html = "";
            if (tipo === "Xhistorico") {
                html += "<table class='table'>";
                html += "<thead class='thead-light'>";
                html += "<th><div class='chico'>Fecha</div></th>";
                html += "<th><div class='chico'>Nro. Doc.</div></th>";
                html += "<th><div class='medio'>Detalle</div></th>";
                html += "<th><div class='normal derecha'>Vendido</div></th>";
                html += "<th><div class='normal derecha'>Pagado</div></th>";
                html += "<th><div class='normal derecha'>Saldo</div></th>";
                html += "<th><div class='pequeno'>Estado</div></th>";
                html += "</thead><tbody style='height:" + tamanopantalla + "px;'>";
                var saldo = 0;
                var totalPagado = 0;
                var totalVendido = 0
                for (var i = 0; i < lista.length; i++) {
                    var item = lista[i];
                    var monto = parseFloat(item.monto);
                    var vendido = 0;
                    var pagado = 0;
                    var txtAnulado = "Activa";
                    var cssAnulada = "";
                    if (item.tipoDocumento === "cobranza") {
                        if (item.estado !== "activo") {
                            monto = 0;
                            txtAnulado = "Anulada";
                            cssAnulada = "txtRojo";
                        }
                        pagado = monto;
                        vendido = 0;
                        saldo -= monto;
                    } else {
                        if (item.estado !== "activo") {
                            monto = 0;
                            txtAnulado = "Anulada";
                            cssAnulada = "txtRojo";
                        }

                        pagado = 0;
                        vendido = monto;
                        saldo += monto;
                    }
                    totalPagado += pagado;
                    totalVendido += vendido;
                    var redirect=" onclick=\"redireccionar('Venta'," + item.id + ")\"";
                    if(item.tipoDocumento==="cobranza"){
                        redirect=" onclick=\"redireccionar('Cobranza'," + item.id + ")\"";
                    }
                    html += "<tr>";
                    html += "<td><div class='chico'>" + item.fecha + "</div></td>";
                    html += "<td><div class='chico subrayar' "+redirect+">" + item.nroDocumento + "</div></td>";
                    html += "<td><div class='medio'>" + item.detalle + "</div></td>";
                    html += "<td><div class='normal derecha " + cssAnulada + "'>" + format(vendido) + "</div></td>";
                    html += "<td><div class='normal derecha " + cssAnulada + "'>" + format(pagado) + "</div></td>";
                    html += "<td><div class='normal derecha negrilla " + cssAnulada + "'>" + format(saldo) + "</div></td>";
                    html += "<td><div class='pequeno " + cssAnulada + "' >" + txtAnulado + "</div></td>";
                    html += "</tr>";
                }
                html += "</tbody>";
                html += "<tfoot>";
                html += "<td><div class='chico'></div></td>";
                html += "<td><div class='chico'></div></td>";
                html += "<td><div class='medio'>TOTAL</div></td>";
                html += "<td><div class='normal derecha'>" + format(totalVendido) + "</div></td>";
                html += "<td><div class='normal derecha'>" + format(totalPagado) + "</div></td>";
                html += "<td><div class='normal derecha'>" + format(saldo) + "</div></td>";
                html += "<td><div class='pequeno >-</div></td>";
                html += "</tfoot>";
                html += "</table>";

            } else {
                var agrupacion = {};
                for (var i = 0; i < lista.length; i++) {
                    var item = lista[i];
                    if (!agrupacion[item.id_venta]) {
                        agrupacion[item.id_venta] = [];
                    }
                    agrupacion[item.id_venta].push(item);
                }
                debugger
                for (var j in agrupacion) {
                    lista = agrupacion[j];
                    html += "<table class='table mt-3'>";
                    html += "<thead class='thead-light'>";
                    html += "<th><div class='chico'>Fecha</div></th>";
                    html += "<th><div class='chico'>Documento</div></th>";
                    html += "<th><div class='medio'>Detalle</div></th>";
                    html += "<th><div class='normal derecha'>Vendido</div></th>";
                    html += "<th><div class='normal derecha'>Pagado</div></th>";
                    html += "<th><div class='normal derecha'>Saldo</div></th>";
                    html += "<th><div class='chico'>Estado</div></th>";
                    html += "</thead><tbody>";
                    var saldo = 0;
                    var totalPagado = 0;
                    var totalVendido = 0
                    for (var i = 0; i < lista.length; i++) {
                        var item = lista[i];
                        var monto = parseFloat(item.monto);
                        var vendido = 0;
                        var pagado = 0;
                        var txtAnulado = "Activa";
                        var cssAnulada = "";
                        if (item.tipoDocumento === "cobranza") {
                            if (item.estado !== "activo") {
                                monto = 0;
                                txtAnulado = "Anulada";
                                cssAnulada = "txtRojo";
                            }
                            pagado = monto;
                            vendido = 0;
                            saldo -= monto;
                        } else {
                            if (item.estado !== "activo") {
                                monto = 0;
                                txtAnulado = "Anulada";
                                cssAnulada = "txtRojo";
                            }

                            pagado = 0;
                            vendido = monto;
                            saldo += monto;
                        }
                        totalPagado += pagado;
                        totalVendido += vendido;
                        var redirect=" onclick=\"redireccionar('Venta'," + item.id + ")\"";
                        if(item.tipoDocumento==="cobranza"){
                            redirect=" onclick=\"redireccionar('Cobranza'," + item.id + ")\"";
                        }
                        html += "<tr>";
                        html += "<td><div class='chico'>" + item.fecha + "</div></td>";
                        html += "<td><div class='chico subrayar' "+redirect+">" + item.nroDocumento + "</div></td>";
                        html += "<td><div class='medio'>" + item.detalle.replace(/"/g, '\"').replace(/"/g, "\'") + "</div></td>";
                        html += "<td><div class='normal derecha'>" + format(vendido) + "</div></td>";
                        html += "<td><div class='normal derecha'>" + format(pagado) + "</div></td>";
                        html += "<td><div class='normal derecha'>" + format(saldo) + "</div></td>";
                        html += "<td><div class='chico " + cssAnulada + "' >" + txtAnulado + "</div></td>";
                        html += "</tr>";
                    }
                    html += "</tbody>";
                    html += "<tfoot><tr>";
                    html += "<td><div class='chico'></div></td>";
                    html += "<td><div class='chico'></div></td>";
                    html += "<td><div class='medio'>TOTAL</div></td>";
                    html += "<td><div class='normal derecha'>" + format(totalVendido) + "</div></td>";
                    html += "<td><div class='normal derecha'>" + format(totalPagado) + "</div></td>";
                    html += "<td><div class='normal derecha'>" + format(saldo) + "</div></td>";
                    html += "<td><div class='chico'>-</div></td>";
                    html += "</tr></tfoot>";
                    html += "</table>";
                }
            }
            $("#contenedorRegistro").html(html);
            $("#btnDocumento").visible();
            $("#contenedorRegistro").igualartabla();

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
     var codigo = clienteSeleccionado.codigo;
    codigo = codigo === "" ? "-" : codigo;
    var nombre = clienteSeleccionado.nombre;
    nombre = nombre === "" ? "-" : nombre;
    var ci = clienteSeleccionado.ci;
    ci = ci === "" ? "-" : ci;
    var datosHead="<div class='inlineblock normal'><span class='negrilla'>Código: </span>"+codigo+"</div>";
    datosHead+="<div class='inlineblock normal'><span class='negrilla'>CI : </span>"+ci+"</div>";
    datosHead+="<div class='inlineblock '><span class='negrilla'>Cliente : </span>"+nombre+"</div>";
    if (tipo === "Xhistorico") {
        imprimirReporte({contenido: $("#contenedorRegistro").html(), sucursal_id: usuarioLocal.sucursal_id, titulo: "ESTADO DE CUENTA - CLIENTE",datosHead:datosHead, encabezadoThead: true});
    } else {
        imprimirReporte({contenido: $("#contenedorRegistro").html(), sucursal_id: usuarioLocal.sucursal_id, titulo: "ESTADO DE CUENTA - CLIENTE",datosHead:datosHead});
    }
}



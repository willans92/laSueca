var url = '../Controlador/ListaCliente_Controlador.php';

var contador = 0;
var tamanopantalla = $(window).height() - 275;
var listaCliente;
var cliente_id = 0;
var posicion = 0;
var listaDeuda = [];
var id_venta = 0;
$(document).ready(function () {
    $(".fecha").datepicker();
    $(".fecha").val(fechaActual());
    var listaUsuario = window.parent.listaUsuario;
    comboBox({identificador: "#contenedorRegistroCobranza input[name=cobrador]", datos: listaUsuario, codigo: "id_usuario", texto: "nombre", todos: false, callback: () => buscar("", 1)});


    localStorage.setItem("idcliente", 0);
    var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal === null) {
        window.parent.cerrarSession();
        return;
    }
    usuarioLocal = $.parseJSON(usuarioLocal);
    $("#contenedorRegistroCobranza input[name=cobrador]").val(usuarioLocal.nombre);
    $("#contenedorRegistroCobranza input[name=cobrador]").data("cod", usuarioLocal.id_usuario);
    $("#tblcliente tbody").css("height", tamanopantalla);
    $(window).resize(function () {
        var tamanopantalla = $(window).height() - 275;
        $("#tblcliente tbody").css("height", tamanopantalla);
    });
    var clienteLocal = localStorage.getItem("idcliente");
    if (clienteLocal !== null) {
        cliente_id = parseInt(clienteLocal);
        localStorage.removeItem("idcliente");
    }
    buscarDeudaClientes();
});
function buscarDeudaClientes() {
    cargando(true);
    $.get(url, {proceso: "deudaClientes"}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error, "error");
        } else {
            listaDeuda = json.result;
            window.parent.Version();
        }
    });
}
function buscarDeuda(cliente) {
    for (var i = 0; i < listaDeuda.length; i++) {
        if ((listaDeuda[i].cliente_id + "") === cliente) {
            var pagado = parseFloat(listaDeuda[i].pagado);
            var deuda = parseFloat(listaDeuda[i].deuda);
            return deuda - pagado;
        }
    }
    return 0;
}
function actualizar() {
    var datos = window.parent.listaCliente;
    listaCliente = Object.keys(datos).map((key) => datos[key]);
    listaCliente.sort(function (a, b) {
        var idA = parseInt(a.id_cliente);
        var idB = parseInt(b.id_cliente);
        if (idA < idB) {
            return 1;
        }
        return -1;
    });
    buscar('', 1);
}
function rellenarRazonSocial() {
    var ci = $("input[name=ci]").val();
    var nombre = $("input[name=nombre]").val();
    var nit = $("input[name=nit]").val().trim();
    var rz = $("input[name=rz]").val().trim();
    if (nit === "") {
        $("input[name=nit]").val(ci);
    }
    if (rz === "") {
        $("input[name=rz]").val(nombre);
    }
}
function buscar(e, tipo) {
    if (!(e === "" || e.keyCode === 13)) {
        return;
    }
    var inicia = 50;
    if (tipo === 1) {
        contador = 0;
        posicion = 0;
        $("#btncargarMas").visible();
    }
    $("#btnmodificar").ocultar();
    $("#btncobranza").ocultar();
    var buscador = ($("input[name=buscar]").val() + "").toUpperCase();
    var codigo = ($("input[name=codigoB]").val() + "").toUpperCase();
    var html = "";
    for (var i = contador; i < listaCliente.length; i++) {
        if (inicia === 0) {
            break;
        }
        contador++;
        var cliente = listaCliente[i];
        var ci = (cliente.ci + "").toUpperCase();
        var codigoCli = (cliente.codigo + "").toUpperCase();
        var nombre = (cliente.nombre + "").toUpperCase();
        if ((nombre.indexOf(buscador) >= 0 || ci.indexOf(buscador) >= 0)
                && (codigo === "" || codigoCli === codigo)) {
            posicion++
            var deuda = buscarDeuda(cliente.id_cliente);
            html += "<tr onclick='modificar(1)' data-id='" + cliente.id_cliente + "'>";
            html += "<td><div class='pequeno'>" + cliente.codigo + "</div></td>";
            html += "<td><div class='chico'>" + cliente.ci + "</div></td>";
            html += "<td><div class='medio'>" + cliente.nombre + "</div></td>";
            html += "<td><div class='pequeno'>" + cliente.telefono + "</div></td>";
            html += "<td><div class='normal'>" + format(cliente.limiteCredito) + "</div></td>";
            html += "<td><div class='pequeno'>" + format(cliente.descuento) + "</div></td>";
            html += "<td><div class='normal'>" + format(deuda) + "</div></td>";
            html += "<td><div class='medio'>" + cliente.direccion + "</div></td>";

            html += "</tr>";
            inicia--;

        }

    }

    if (tipo === 1) {
        $("#tblcliente tbody").html(html);
    } else {
        if (html.length > 0) {
            $("#tblcliente  tbody").append(html);
        }
    }
    $("#tblcliente").igualartabla();
    $("#actualcant").text(posicion);
    var lista = listaCliente.filter(value => {
        var cliente = value;
        var ci = (cliente.ci + "").toUpperCase();
        var codigoCli = (cliente.codigo + "").toUpperCase();
        var nombre = (cliente.nombre + "").toUpperCase();
        if ((nombre.indexOf(buscador) >= 0 || ci.indexOf(buscador) >= 0)
                && (codigo === "" || codigoCli === codigo)) {
            return true;
        } else {
            return false;
        }
    });
    $("#maxcant").text(lista.length);
    if (lista.length > posicion) {
        $("#btncargarMas").visible(1);
    } else {
        $("#btncargarMas").ocultar();
    }
}
function nuevo() {
    $("#popCliente .modal-title").text("Nuevo Cliente");
    $("#popCliente").limpiarFormulario();
    $("#popCliente input").removeClass("rojoClarito");
    $('table tr').removeClass("Tuplaseleccionada");
    $("#errorPop").html("");
    $('#popCliente').modal('show');
    $('#btnmodificar').ocultar();
    $('#btncobranza').ocultar();
}
function registrar() {
    var json = variables($("#popCliente"));
    json.proceso = "registrar";
    var descuento = json.descuento === "" ? 0 : parseFloat(json.descuento);
    var descmax = json.descmax === "" ? 0 : parseFloat(json.descmax);
    var limitecredito = json.limitecredito === "" ? 0 : parseFloat(json.limitecredito);
    if (json.nombre.length === 0) {
        $("#errorPop").html("No se ha ingresado el nombre del cliente.");
        $("input[name=nombre]").addClass("rojoClarito");
        return;
    } else {
        $("#errorPop").html("");
        $("input[name=nombre]").removeClass("rojoClarito");
    }
    if (descuento < 0) {
        $("input[name=descuento]").addClass("rojoClarito");
        $("#errorPop").html("El descuento no puede ser negativo.");
        return;
    } else {
        $("#errorPop").html("");
        $("input[name=descuento]").removeClass("rojoClarito");
    }

    if (descuento > 100) {
        $("input[name=descuento]").addClass("rojoClarito");
        $("#errorPop").html("El descuento no puede ser mayor a 100.");
        return;
    } else {
        $("#errorPop").html("");
        $("input[name=descuento]").removeClass("rojoClarito");
    }
    if (descmax < 0) {
        $("input[name=descmax]").addClass("rojoClarito");
        $("#errorPop").html("El descuento máximo no puede ser negativo.");
        return;
    } else {
        $("#errorPop").html("");
        $("input[name=descmax]").removeClass("rojoClarito");
    }
    if (descmax < descuento) {
        $("input[name=descmax]").addClass("rojoClarito");
        $("#errorPop").html("El descuento máximo no puede ser menor a descuento.");
        return;
    } else {
        $("#errorPop").html("");
        $("input[name=descmax]").removeClass("rojoClarito");
    }

    if (descmax > 100) {
        $("input[name=descmax]").addClass("rojoClarito");
        $("#errorPop").html("El descuento máximo no puede ser mayor a 100.");
        return;
    } else {
        $("#errorPop").html("");
        $("input[name=descmax]").removeClass("rojoClarito");
    }
    if (limitecredito < 0) {
        $("input[name=limitecredito]").addClass("rojoClarito");
        $("#errorPop").html("El límite del crédito puede ser negativo.");
        return;
    } else {
        $("#errorPop").html("");
        $("input[name=descuento]").removeClass("rojoClarito");
    }
    var expresion = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (json.correo.trim() !== "" && (!expresion.test(json.correo.trim()))) {
        $("#errorPop").html("El correo es invalido.");
        $("input[name=correo]").addClass("rojoClarito");
        return;
    } else {
        $("#errorPop").html("");
        $("input[name=correo]").removeClass("rojoClarito");
    }

    json.cliente_id = cliente_id;
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
            if (cliente_id !== 0) {
                alertaRapida("El cliente se actualizo correctamente.");
            } else {
                alertaRapida("El cliente se registro correctamente.");
            }
            $("#btnmodificar").ocultar();
            $("#popCliente .cerrar").click();
            $("#popCliente").limpiarFormulario();
            window.parent.Version();
        }
    });
}
function modificar(tipo) {
    if (tipo === 1) {
        $("#btnmodificar").visible();
        $("#btncobranza").visible();
    } else {
        $("#popCliente input").removeClass("rojoClarito");
        $("#errorPop").html("");
        $("#popCliente .modal-title").text("Modificando Cliente");
        var tupla = $("tr.Tuplaseleccionada");
        cliente_id = $(tupla[0]).data("id");
        var datos = window.parent.listaCliente;
        var cliente = datos["c" + cliente_id];
        $("input[name=codigo]").val(cliente.codigo);
        $("input[name=ci]").val(cliente.ci);
        $("input[name=nombre]").val(cliente.nombre);
        $("input[name=telefono]").val(cliente.telefono);
        $("input[name=direccion]").val(cliente.direccion);
        $("input[name=descuento]").val(cliente.descuento);
        $("input[name=nit]").val(cliente.nit);
        $("input[name=rz]").val(cliente.razonSocial);
        $("input[name=descmax]").val(cliente.descuentoMax);
        $("input[name=telefonocontacto]").val(cliente.telefonoContacto);
        $("input[name=personacontacto]").val(cliente.personaContacto);
        $("input[name=limitecredito]").val(cliente.limiteCredito);
        $("input[name=fechanacimiento]").val(cliente.fechaNacimiento);
        $("input[name=comentario]").val(cliente.comentario);
        $("input[name=correo]").val(cliente.email);
        $('#popCliente').modal('show');
    }
}
function cobranzaPop() {
    $("#popCobranza input").removeClass("rojoClarito");
    $("#errorPop2").html("");
    var tupla = $("tr.Tuplaseleccionada");
    cliente_id = $(tupla[0]).data("id");
    var datos = window.parent.listaCliente;
    var cliente = datos["c" + cliente_id];
    $("#txtCI").html(cliente.direccion);
    $("#txtNombre").html(cliente.nombre);
    $("#txtTelefono").html(cliente.telefono);
    $("#txtDireccion").html(cliente.direccion);
    $("#txtCorreo").html(cliente.email);
    $("#txtComentario").html(cliente.comentario);
    $("input[name=chkverfactura]").prop("checked", false);
    $("#contenedorCobranza").ocultar();
    $("#contenedorRegistroCobranza").ocultar();
    var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal === null) {
        window.parent.cerrarSession();
        return;
    }
    usuarioLocal = $.parseJSON(usuarioLocal);
    $("#contenedorRegistroCobranza input[name=cobrador]").val(usuarioLocal.nombre);
    $("#contenedorRegistroCobranza input[name=cobrador]").data("cod", usuarioLocal.id_usuario);
    id_venta = 0;
    $('#popCobranza').modal('show');
    var tipo=$("#tipoDoc option:selected").val();
    cargando(true);
    setTimeout(() => {
        $.get(url, {proceso: "historicoVenta", idcliente: cliente_id,tipo:tipo}, function (response) {
            cargando(false);
            var json = $.parseJSON(response);
            if (json.error.length > 0) {
                if ("Error Session" === json.error) {
                    window.parent.cerrarSession();
                }
                alertaRapida(json.error, "error");
            } else {
                var listaVenta = json.result;
                var html = "";
                for (var i = 0; i < listaVenta.length; i++) {
                    var registro = listaVenta[i];
                    var cobrado = parseFloat(registro.cobrado);
                    var facturado = parseFloat(registro.facturado);
                    var saldo = facturado - cobrado;
                    var nroDoc = registro.nroDocumento;
                    var estadoDeuda = "conDeuda";
                    var estado = "Activa";
                    if (saldo === 0) {
                        estadoDeuda = "sinDeuda";
                    }
                    var cssEstado = "";
                    if (registro.estado !== "activo") {
                        cssEstado = "txtRojo";
                        facturado = 0;
                        cobrado = 0;
                        saldo = 0;
                        estado = "Anulada";
                        estadoDeuda = "sinDeuda";
                    }
                    html += "<tr class='" + estadoDeuda + "' onclick='historicoCobranza(" + registro.id_venta + "," + saldo + ")'>";
                    html += "<td><div class='pequeno'>" + registro.fecha + "</div></td>";
                    html += "<td><div class='pequeno subrayar' onclick=\"redireccionar('Venta'," + registro.id_venta + ")\">" + nroDoc + "</div></td>";
                    html += "<td><div class='pequeno " + cssEstado + "'>" + format(facturado) + "</div></td>";
                    html += "<td><div class='pequeno " + cssEstado + "'>" + format(cobrado) + "</div></td>";
                    html += "<td><div class='pequeno " + cssEstado + "'>" + format(saldo) + "</div></td>";
                    html += "<td><div class='normal'>" + registro.vendedor + "</div></td>";
                    html += "<td><div class='pequeno " + cssEstado + "'>" + estado + "</div></td>";
                    html += "</tr>";
                }
                $("#tblFact tbody").html(html);
                $("#tblFact").igualartabla();
            }
        });
    }, 500);

}
function historicoCobranza(idventa, deuda) {
    $("#txtDeuda").html(format(deuda));
    $("#txtsaldo").html(0.00);
    $("input[name=comentario]").val("Pago Parcial");
    $("input[name=fechaCobro]").val(fechaActual());
    $("input[name=montoApagar]").val(deuda);
    $("#contenedorRegistroCobranza").css("display", "flex");
    $("#errorCobranza").html("");
    $("#contenedorRegistroCobranza input").removeClass("rojoClarito");
    id_venta = idventa;
}
function verFacturaDeuda(ele) {
    var check = $(ele).is(":checked");
    if (check) {
        $("#tblFact tr.sinDeuda").css("display", "none");
    } else {
        $("#tblFact tr.sinDeuda").css("display", "table-row");
    }
}
function calcularSaldo() {
    var monto = $("input[name=montoApagar]").val();
    monto = monto === "" ? 0.00 : parseFloat(monto.replace(/\./g, '').replace(/\,/g, '.'));
    var saldoDeuda = $("#txtDeuda").html();
    saldoDeuda = saldoDeuda === "" ? 0.00 : parseFloat(saldoDeuda.replace(/\./g, '').replace(/\,/g, '.'));

    var nuevoSaldo = saldoDeuda - monto;
    $("#saldo").html(format(nuevoSaldo));

}
function registrarCobro() {
    var saldo = parseFloat($("#txtsaldo").html().replace(/\./g, '').replace(/\,/g, '.'));
    var monto = $("input[name=montoApagar]").val();
    monto = monto === "" ? 0.00 : parseFloat(monto.replace(/\./g, '').replace(/\,/g, '.'));
    if (saldo < 0) {
        $("#errorCobranza").html("El monto cobrado no puede ser mayor a la deuda.");
        $("input[name=montoApagar]").addClass("rojoClarito");
        return;
    } else {
        $("input[name=montoApagar]").removeClass("rojoClarito");
    }
    if (monto <= 0) {
        $("#errorCobranza").html("El monto cobrado no puede ser menor o igual 0.");
        $("input[name=montoApagar]").addClass("rojoClarito");
        return;
    } else {
        $("input[name=montoApagar]").removeClass("rojoClarito");
    }
    var comentario = $("input[name=comentario]").val();
    var metodoPago = $("#tipoPago option:selected").val();
    var cobrador = $("#contenedorRegistroCobranza input[name=cobrador]").data("cod");
    var fecha = $("input[name=fechaCobro]").val();
    cargando(true);
    $.post(url, {proceso: 'registrarCobranza', fecha: fecha, idventa: id_venta, monto: monto
        , comentario: comentario, metodopago: metodoPago, cobrador: cobrador}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error, "error");
        } else {
            alertaRapida("Se registro corectamente la cobranza.");
            $('#popCobranza').modal('hide');
            id_venta = 0;
            buscarDeudaClientes();
        }
    });
}
function imprimir() {
    buscar("", 1);
    var contenido = $("#contenedorCliente").html();
    var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal === null) {
        window.parent.cerrarSession();
        return;
    }
    usuarioLocal = $.parseJSON(usuarioLocal);
    var filtro = "<div class='row' id='filtroReporte'>";
    filtro += "<div class='col-12'><span class='negrilla'>FILTROS</div>";
    var buscador = ($("input[name=buscar]").val() + "");
    var codigo = ($("input[name=codigoB]").val() + "");
    if (codigo !== "") {
        filtro += "<div class='col-4'><span class='negrilla'>Código: </span>" + codigo + "</div>";
    }
    if (buscador !== "") {
        filtro += "<div class='col-4'><span class='negrilla'>Buscador: </span>" + buscador + "</div>";
    }

    filtro += "</div>";
    imprimirReporte({contenido: contenido, sucursal_id: usuarioLocal.sucursal_id, titulo: "Listado de cliente", datosHead: filtro, encabezadoThead: true});
}
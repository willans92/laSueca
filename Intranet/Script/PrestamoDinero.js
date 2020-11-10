var url = '../Controlador/PrestamoDinero_Controlador.php';
var contador = 0;
var listaCliente = {};
var listaProducto = [];
var listalote = {};
var id_Prestamo = 0;
var id_Cliente = 0;
var htmlColumna = '';
var tipoCambio = 6.96;
var tipoVenta = "Contado"
var tamanopantalla = $(window).height() - 407;
var tipoDocumento2 = "";
var datosVentaSeleccionada = {};
var nroPendientes = 0;
$(document).ready(function () {
    $('#impresion').contents().find("head").append($("<link href='../Estilo/bootstrap.min.css' rel='stylesheet' type='text/css'/><link href='../Estilo/Estilo.css' rel='stylesheet' type='text/css'/><link href='../Estilo/ImpresionReporte.css' rel='stylesheet'  type='text/css'/>"));
    $("#tblPrestamo tbody").css("max-height", tamanopantalla);
     $("#boxDataPrestamo").css("height", tamanopantalla+100);

    $(window).resize(function () {
        var tamanopantalla = $(window).height() - 377;
        $("#tblPrestamo tbody").css("max-height", tamanopantalla);
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
    $("#sucursal").html(listaSucursal);
    $("#sucursal option[value=" + usuarioLocal.sucursal_id + "]").prop("selected", true);
    $("#sucursal option[value=0]").remove();

    var listaUsuario = window.parent.listaUsuario;
    var option = "";
    for (var i in listaUsuario) {
        option += "<option value='" + listaUsuario[i].id_usuario + "'>" + listaUsuario[i].nombre + "</option>";
    }
    comboBox({identificador: "input[name=encargado]", valueDefault: usuarioLocal.id_usuario, datos: listaUsuario, codigo: "id_usuario", texto: "nombre", todos: false});

    var prestamoLocal = localStorage.getItem("idprestamo");
    if (prestamoLocal !== null) {
        id_Prestamo = parseInt(prestamoLocal);
        localStorage.removeItem("idprestamo");
    }
    nuevo(0);
    window.parent.Version();
});
function nuevo(tipo) {
    $("input").val("");
    var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal === null) {
        window.parent.cerrarSession();
        return;
    }
    usuarioLocal = $.parseJSON(usuarioLocal);
    $("input[name=cliente]").data("cod", "0");
    $("input[name=cliente]").data("pos", "-1");
    $("input[name=encargado]").data("cod", usuarioLocal.id_usuario);
    $("input[name=encargado]").val(usuarioLocal.nombre);
    $("input[name=encargado]").data("pos", "-1");
    $(".fecha").val(fechaActual());
    $("#btnmodificar").ocultar();
    if (tipo === 1) {
        $("#txtInformacion").html("");
        $("#vlueInformacion").html("");
        id_Prestamo = 0;
        $("h1").text("Nuevo Prestamo");
        $("input").attr("disabled", false);
        $("select").attr("disabled", false);
        $("#btncancelar").visible();
        $("#btnregistrar").visible();
        $("#btnPlanpago").visible();
        $("#btnnuevo").ocultar();
        $("#navegadorRegistro").ocultar();
        $("#btnimprimir").ocultar();
        $("#btnanular").ocultar();
        $("input[name=detalle]").val("Prestamo de dinero");
        var usuarioLocal = localStorage.getItem("usuario");
        $("#sucursal option[data-estado='inactivo']").css("display", "none");
        usuarioLocal = $.parseJSON(usuarioLocal);
        $("#sucursal option[value=" + usuarioLocal.sucursal_id + "]").prop("selected", true);
    } else {
        $("h1").text("Prestamos de Dinero");
        $("input").attr("disabled", true);
        $("select").attr("disabled", true);
        $("#btncancelar").ocultar();
        $("#btnregistrar").ocultar();
        $("#btnPlanpago").ocultar();
        $("#btnnuevo").visible();
        $("#navegadorRegistro").visible();
        $("#btnanular").ocultar();
        $("#btnimprimir").ocultar();
        if (id_Prestamo !== 0) {
            cargarPrestamo("actual");
        }
    }
}
function actualizar() {
    var datos = window.parent.listaCliente;
    var listaCliente = Object.keys(datos).map((key) => datos[key]);
    comboBox({identificador: "input[name=cliente]", datos: listaCliente, codigo: "id_cliente", texto: "ci", todos: false, texto2: "nombre", vistaSeleccionado: "nombre"});
}
function cargarPrestamo(tipo) {// data-pos, data-stock en tr
    var sucursal = $("#sucursal option:selected").val();
    cargando(true);
    $.get(url, {proceso: 'buscarPrestamo', tipo: tipo, id_Prestamo: id_Prestamo, idsucursal: sucursal}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error, "error");
        } else {
            var prestamoObj = json.result.prestamo;
            if (prestamoObj) {
                $("#btnmodificar").visible();
                $("#btnanular").visible();
                $("#btnimprimir").visible();
                var detallePrestamoObj = json.result.detalle;
                id_Prestamo = prestamoObj.id_prestamo;
                var fechaSplit = prestamoObj.fecha.split(" ");
                $("input[name=fecha]").val(fechaSplit[0]);
                var listaCliente = window.parent.listaCliente;
                if (json.result.clienteV != "-1") {// validacion clientes sin version
                    window.parent.listaCliente["c" + json.result.clienteV.id_cliente] = json.result.clienteV;
                    listaCliente = window.parent.listaCliente;
                }
                var cliente = listaCliente["c" + prestamoObj.cliente_id];
                $("input[name=cliente]").val(cliente.nombre);
                $("input[name=cliente]").data("cod", prestamoObj.cliente_id);
                $("input[name=cliente]").data("pos", -1);

                $("input[name=detalle]").val(prestamoObj.motivo);
                $("input[name=nroDocumento]").val(prestamoObj.nroDocumento);
                $("input[name=capital]").val(prestamoObj.capital);
                $("input[name=nroCuotas]").val(prestamoObj.nroCuotas);
                $("input[name=tasaAnual]").val(prestamoObj.tasaAnual);
                $("input[name=gastoAdministrativos]").val(prestamoObj.gastoAdministrativo);
                $("input[name=primerCuota]").val(prestamoObj.primerCuota);
                $("input[name=nroDesenbolso]").val(prestamoObj.documentoPago);
                $("#desenbolso option[value='" + prestamoObj.metodoPago + "']").prop("selected", true);
                $("#sucursal option[value='" + prestamoObj.sucursal_id + "']").prop("selected", true);


                var listaUsuario = window.parent.listaUsuario;
                var encargado = listaUsuario["u" + prestamoObj.usuario_id];
                $("input[name=encargado]").val(encargado.nombre);
                $("input[name=encargado]").data("cod", prestamoObj.usuario_id);
                $("input[name=encargado]").data("pos", -1);



                var modificadopor = listaUsuario["u" + prestamoObj.modificadoPor];
                if (prestamoObj.estado === "inactivo") {
                    $("#btnmodificar").ocultar();
                    $("#btneliminar").ocultar();
                    $("#txtInformacion").html("Venta Anulada");
                    $("#txtInformacion").addClass("txtRojo");
                } else {
                    $("#txtInformacion").html("Ult. Actualización");
                    $("#txtInformacion").removeClass("txtRojo");
                }
                $("#vlueInformacion").html(prestamoObj.fechaModificado + " , " + modificadopor.nombre);

                $("#tblprestamo tbody").html("");
                var html = "";
                var totalInteres = 0;
                var totalGastoAdm = 0;
                var totalCuota = 0;
                var totalAmortizado = 0;
                for (var i = 0; i < detallePrestamoObj.length; i++) {
                    html += "<tr data-id='0'>";
                    var fecha = detallePrestamoObj[i]["vencimiento"];
                    var amortizacion = parseFloat(detallePrestamoObj[i]["capital"]);
                    var capital = parseFloat(detallePrestamoObj[i]["capitalVivo"]);
                    var interes = parseFloat(detallePrestamoObj[i]["interes"]);
                    var gastoAdministrativo = parseFloat(detallePrestamoObj[i]["gastoAdministrativo"]);
                    var cuota = parseFloat(detallePrestamoObj[i]["cuotaActual"]);
                    totalGastoAdm += gastoAdministrativo;
                    totalInteres += interes;
                    totalCuota += cuota;
                    totalAmortizado += amortizacion;
                    html += "<td><div style='width: 90px;'>" + fecha + "</div></td>";
                    html += "<td><div style='width: 90px;'>"+detallePrestamoObj[i]["detalle"]+"</div></td>";
                    html += "<td><div class='pequeno'>" + format(amortizacion) + "</div></td>";
                    html += "<td><div class='pequeno'>" + format(interes) + "</div></td>";
                    html += "<td><div class='pequeno'>" + format(gastoAdministrativo) + "</div></td>";
                    html += "<td><div class='pequeno'>" + format(cuota) + "</div></td>";
                    html += "<td><div class='pequeno'>" + format(capital) + "</div></td>";
                    html += "</tr>";
                }
                $("#tblPrestamo tbody").html(html);
                html = "<td><div style='width: 90px;'></div></td>";
                html += "<td><div style='width: 90px;' class='derecha'>TOTAL</div></td>";
                html += "<td><div class='pequeno'>" + format(totalAmortizado) + "</div></td>";
                html += "<td><div class='pequeno'>" + format(totalInteres) + "</div></td>";
                html += "<td><div class='pequeno'>" + format(totalGastoAdm) + "</div></td>";
                html += "<td><div class='pequeno'>" + format(totalCuota) + "</div></td>";
                html += "<td><div class='pequeno'>0,00</div></td>";
                $("#tblPrestamo tfoot").html(html);
                $("#tblPrestamo").igualartabla();
            }

        }
    });
}
function modificar() {
    $("h1").text("Modificando Prestamo");
    $("input").attr("disabled", false);
    $("select").attr("disabled", false);
    
    $("#btncancelar").visible();
    $("#btnregistrar").visible();
    
    $("#btnnuevo").ocultar();
    $("#sucursal option[data-estado='inactivo']").css("display", "block");
    $("#btnimprimir").ocultar();
    $("#btnmodificar").ocultar();
    $("#btnanular").ocultar();
    $("#navegadorRegistro").ocultar();
    $("#boxDataPrestamo input").attr("disabled", true);
    $("#boxDataPrestamo select").attr("disabled", true);
    $("#btnPlanpago").ocultar();
}
function registrar() {
    var json = variables(".container-fluid");
    json.proceso = 'registrarPrestamo';
    json.id_Prestamo = id_Prestamo;
    json.id_Cliente = $("input[name=cliente]").data("cod");
    json.encargado = $("input[name=encargado]").data("cod");
    if (json.id_Cliente == 0) {
        alertaRapida("No ha seleccionado al cliente.", "error");
        $("input[name=cliente]").addClass("rojoClarito");
        return;
    } else {
        $("input[name=cliente]").removeClass("rojoClarito");
    }
    if (json.encargado == 0) {
        alertaRapida("No ha seleccionado al encargado.", "error");
        $("input[name=encargado]").addClass("rojoClarito");
        return;
    } else {
        $("input[name=encargado]").removeClass("rojoClarito");
    }
    var capital = json.capital;
    capital = json.capital === "" ? 0 : parseFloat(json.capital);
    var nroCuotas = json.nroCuotas;
    nroCuotas = json.nroCuotas === "" ? 0 : parseFloat(json.nroCuotas);
    var tasaAnual = json.tasaAnual;
    tasaAnual = json.tasaAnual === "" ? 0 : parseFloat(json.tasaAnual);
    var gastoAdministrativos = json.gastoAdministrativos;
    gastoAdministrativos = json.gastoAdministrativos === "" ? 0 : parseFloat(json.gastoAdministrativos);
    if (capital <= 0) {
        alertaRapida("no se puede generar el prestamo con capital menor igual a 0.", "error");
        $("input[name=capital]").addClass("rojoClarito");
        return;
    } else {
        $("input[name=capital]").removeClass("rojoClarito");
    }
    if (nroCuotas <= 0) {
        alertaRapida("No se puede generar el prestamo con cuotas menor igual a 0.", "error");
        $("input[name=nroCuotas]").addClass("rojoClarito");
        return;
    } else {
        $("input[name=nroCuotas]").removeClass("rojoClarito");
    }
    if (tasaAnual <= 0) {
        alertaRapida("La tasa anual no puede ser menor igual a 0%.", "error");
        $("input[name=tasaAnual]").addClass("rojoClarito");
        return;
    } else {
        $("input[name=tasaAnual]").removeClass("rojoClarito");
    }
    if (gastoAdministrativos < 0) {
        alertaRapida("los cargos administrativos no puede ser negativo.", "error");
        $("input[name=gastoAdministrativos]").addClass("rojoClarito");
        return;
    } else {
        $("input[name=gastoAdministrativos]").removeClass("rojoClarito");
    }
    var tr = $("#tblPrestamo tbody tr");
    var lista = [];
    for (var i = 0; i < tr.length; i++) {
        var item = $(tr[i]);
        var id = item.data("id");
        var vencimiento = item.find("div:eq(0)").html();
        var detalle = item.find("div:eq(1)").html();
        var capital = item.find("div:eq(2)").html().replace(/\./g, '').replace(/\,/g, '.');
        var interes = item.find("div:eq(3)").html().replace(/\./g, '').replace(/\,/g, '.');
        var gastoAdm = item.find("div:eq(4)").html().replace(/\./g, '').replace(/\,/g, '.');
        var cuota = item.find("div:eq(5)").html().replace(/\./g, '').replace(/\,/g, '.');
        var capitalVivo = item.find("div:eq(6)").html().replace(/\./g, '').replace(/\,/g, '.');
        lista.push({
            vencimiento: vencimiento, detalle: detalle, capital: capital, interes: interes,
            gastoAdm: gastoAdm, cuota: cuota, capitalVivo: capitalVivo, id: id
        });
    }
    if (lista.length === 0) {
        alertaRapida("El plan de pago no tiene generada ninguna cuota.", "error");
        return;
    }
    json.listaCuota = lista;
    $("#errorPop").html("");
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
            if (id_Prestamo === 0) {
                id_Prestamo = json.result;
                //imprimir(true);
            }
            id_Prestamo = json.result;
            window.parent.Version();
        }
    });
}
function anular() {
    $("body").msmPregunta("¿Esta seguro que desea anular el prestamo?", "realizarAnulacion()");
}
function realizarAnulacion() {
    ok();
    $.post(url, {proceso: "anularPrestamo", id_Prestamo: id_Prestamo}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error, "error");
        } else {
            cargarPrestamo("actual");
            nuevo(0);
            alertaRapida("La anulacion se realizo correctamente")
        }
    });
}
function imprimir(nuevaVenta) {
    cargando(true);
    $.get(url, {idven: id_Prestamo, proceso: "imprimirVenta"}, function (response) {
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
            cargarPrestamo("actual");
        }
    });
}
function imprimirCobranza() {
    cargando(true);
    $.get(url, {proceso: "buscarCobranza", idventa: id_Prestamo}, function (response) {
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
function generarTablaPrestamo() {
    var capital = $("input[name=capital]").val();
    var interesAnual = $("input[name=tasaAnual]").val();
    var gastosAdmInicial = $("input[name=gastoAdministrativos]").val();
    var cantCuotas = $("input[name=nroCuotas]").val();
    var primerCuota = $("input[name=primerCuota]").val().split("/");


    capital = capital === "" ? 0 : parseFloat(capital);
    interesAnual = interesAnual === "" ? 0 : parseFloat(interesAnual) / 100;
    gastosAdmInicial = gastosAdmInicial === "" ? 0 : parseFloat(gastosAdmInicial) / 100;
    cantCuotas = cantCuotas === "" ? 0 : parseInt(cantCuotas);
    if (capital <= 0) {
        $("input[name=capital]").addClass("rojoClarito");
        alertaRapida("Necesita ingresar el capital para generar la tabla", "error");
        return;
    } else {
        $("input[name=capital]").removeClass("rojoClarito");
    }
    if (cantCuotas <= 0) {
        $("input[name=nroCuotas]").addClass("rojoClarito");
        alertaRapida("Necesita ingresar número de cuotas para generar la tabla", "error");
        return;
    } else {
        $("input[name=nroCuotas]").removeClass("rojoClarito");
    }
    if (interesAnual <= 0) {
        $("input[name=tasaAnual]").addClass("rojoClarito");
        alertaRapida("Necesita ingresar tasa anual para generar la tabla", "error");
        return;
    } else {
        $("input[name=tasaAnual]").removeClass("rojoClarito");
    }
    var interesMensual = Math.pow((1 + interesAnual), (1 / 12)) - 1;
    var mensualidad = (interesMensual * Math.pow((1 + interesMensual), cantCuotas)) * capital / ((Math.pow((1 + interesMensual), cantCuotas)) - 1)
    var gastoAdministrativo = capital * gastosAdmInicial;

    var f = new Date();
    var dia = parseInt(primerCuota[0]);
    var mes = parseInt(primerCuota[1]);
    var ano = parseInt(primerCuota[2]);



    var diaPago = dia < 10 ? "0" + dia : dia;
    var html = "";
    var totalInteres = 0;
    var totalGastoAdm = 0;
    var totalCuota = 0;
    var totalAmortizado = 0;
    for (var i = 0; i < cantCuotas; i++) {
        html += "<tr data-id='0'>";
        var mesString = mes < 10 ? "0" + mes : mes;
        var ultimoDia = new Date(ano, mes, 0).getDate();
        var interes = capital * interesMensual;
        if (dia > ultimoDia) {
            diaPago = ultimoDia;
        } else {
            diaPago = dia < 10 ? "0" + dia : dia;
        }
        var fecha = diaPago + "/" + mesString + "/" + ano;
        var amortizacion = mensualidad - interes;
        var capital = capital - amortizacion;
        var cuota = mensualidad + gastoAdministrativo;
        totalGastoAdm += gastoAdministrativo;
        totalInteres += interes;
        totalCuota += cuota;
        totalAmortizado += amortizacion;
        html += "<td><div style='width: 90px;'>" + fecha + "</div></td>";
        html += "<td><div style='width: 90px;'>Cuota Nro.: " + (i + 1) + "</div></td>";
        html += "<td><div class='pequeno'>" + format(amortizacion) + "</div></td>";
        html += "<td><div class='pequeno'>" + format(interes) + "</div></td>";
        html += "<td><div class='pequeno'>" + format(gastoAdministrativo) + "</div></td>";
        html += "<td><div class='pequeno'>" + format(cuota) + "</div></td>";
        html += "<td><div class='pequeno'>" + format(capital) + "</div></td>";//amortizacion

        html += "</tr>";
        mes++;
        if (mes > 12) {
            ano++;
            mes = 1;
        }
    }
    $("#tblPrestamo tbody").html(html);
    html = "<td><div style='width: 90px;'></div></td>";
    html += "<td><div style='width: 90px;' class='derecha'>TOTAL</div></td>";
    html += "<td><div class='pequeno'>" + format(totalAmortizado) + "</div></td>";
    html += "<td><div class='pequeno'>" + format(totalInteres) + "</div></td>";
    html += "<td><div class='pequeno'>" + format(totalGastoAdm) + "</div></td>";
    html += "<td><div class='pequeno'>" + format(totalCuota) + "</div></td>";
    html += "<td><div class='pequeno'>0,00</div></td>";
    $("#tblPrestamo tfoot").html(html);
    $("#tblPrestamo").igualartabla();
}
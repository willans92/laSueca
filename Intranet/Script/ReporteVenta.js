var url = '../Controlador/ReporteVenta_Controlador.php';
var meses = ["", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
var estado = "Mensuales";
var tamanopantalla = $(window).height() - 210;
var listaMarca = {};
var listaLinea = {};
var columnaTabla = [];
var sucursalesJson = {};
$(document).ready(function () {
    $(".fecha").datepicker();
    $(".fecha").val(fechaActual());
    var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal === null) {
        window.parent.cerrarSession();
        return;
    }

    $(window).resize(function () {
        var tamanofiltro = $("#filtrosMenu").outerHeight();
        tamanopantalla = $(window).height() - 210;
        var tamanoHead = tamanopantalla - $("#tblventas thead").outerHeight() - tamanofiltro;
        $("#tblventas tbody").css("height", tamanoHead);
    });
    usuarioLocal = $.parseJSON(usuarioLocal);
    var listaSucursal = window.parent.listaSucursal;
    comboBox({identificador: "#sucursal", datos: listaSucursal, valueDefault: usuarioLocal.sucursal_id, codigo: "id_sucursal", texto: "nombre", todos: true, callback: () => generar()});
    var listaUsuario = window.parent.listaUsuario;
    comboBox({identificador: "#empleado", datos: listaUsuario, codigo: "id_usuario", texto: "nombre", todos: true, callback: () => generar()});
    cargar();
});
function limpiarFiltroProducto() {
    $("#lineab").data("cod", "0");
    $("#lineab").data("txt", "");
    $("#lineab").val("");
    $("#marcab").data("cod", "0");
    $("#marcab").data("txt", "");
    $("#marcab").val("");
}
function cargar() {
    cargando(true);
    $.get(url, {proceso: "inicializar"}, function (response) {
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
            $("#empleado").ocultar();
            $("#txtEmpleado").ocultar();
            $("#txtEmpleado").ocultar();
            $("#fechabox").ocultar();
            var marca = json.result.marca;
            var linea = json.result.linea;
            for (var i = 0; i < marca.length; i++) {
                listaMarca[marca[i].id_marca] = marca[i];
            }
            for (var i = 0; i < linea.length; i++) {
                listaLinea[linea[i].id_linea_producto] = linea[i];
            }
            comboBox({identificador: "#marcab", datos: marca, codigo: "id_marca", texto: "descripcion", todos: true, callback: () => filtro("")});
            comboBox({identificador: "#lineab", datos: linea, codigo: "id_linea_producto", texto: "descripcion", todos: true, callback: () => filtro("")});
            reporteMensual("Mensuales");
        }
    });
}
function generar() {
    if (estado === "Detalle") {
        reporteDetallado();
    } else if (estado === "Diarias" || estado === "Mensuales") {
        reporteMensual(estado);
    } else if (estado === "Vendedor") {
        reporteVendedor();
    } else if (estado === "Producto") {
        reporteProducto();
    } else if (estado === "LineaProducto") {
        reporteLineaProducto();
    } else if (estado === "Cliente") {
        reporteCliente();
    } else if (estado === "MarcaProducto") {
        reporteMarcaProducto();
    }
}
function reporteMensual(tipo) {
    var de = $("input[name=de]").val();
    var hasta = $("input[name=hasta]").val();
    $("h1").text("Ventas " + tipo);
    if (tipo === "Diarias") {
        $("#empleado").ocultar();
        $("#txtEmpleado").ocultar();
        $("#fechabox").visible();
        $("#detalladoFiltro").ocultar();
        $("#filtrosMenu > div").css("width", 560);
    } else {
        $("#fechabox").ocultar();
        $("#filtrosMenu > div").css("width", 561);
    }
    limpiarFiltroProducto();
    $("#filtroProducto").ocultar();
    $("#empleado").ocultar();
    $("#txtEmpleado").ocultar();
    $("#detalladoFiltro").ocultar();
    $("#filtrocheck").visible();
    $("#sucursalbox").visible();
    var sucursal = $("#sucursal").data("cod") + "";

    estado = tipo;
    cargando(true);
    $.get(url, {proceso: 'reporteVenta', tipo: tipo, de: de, hasta: hasta, sucursal: sucursal}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error, "error");
        } else {
            var html = "";
            sucursalesJson = {};// quito esto cuando quiera multples empresa
            var listaSucursal = window.parent.listaSucursal.filter((su) => (su.id_sucursal + "") === (sucursal + ""));
            for (var i = 0; i < listaSucursal.length; i++) {
                sucursalesJson[listaSucursal[i].id_sucursal] = {
                    NotaVenta: 0, Facturado: 0, Descuento: 0, Compra: 0, MargenBruto: 0, Iva: 0, IT: 0, Margen_Neto: 0, Vendido: 0
                };
            }
            $("#tblventas").html("");
            var lista = json.result;
            columnaTabla = [];
            columnaTabla.push({nombre: "Fecha", estado: true});
            var html = "<table class='table'>";
            html += "<thead  class='thead-light'>";
            html += "<th><div style=' width:115px;'>Fecha</div></th>";
            for (var j = 0 in listaSucursal) {
                html += "<th><div  style='width:90px'>" + listaSucursal[j].nombre + "<br /> Nota Venta Bs <span class='formulaTXT'> A</span></span></div></th>";
                html += "<th><div  style='width:90px'>" + listaSucursal[j].nombre + "<br /> Factura Bs <span class='formulaTXT'> B</span></div></th>";
                html += "<th><div  style='width:90px'>" + listaSucursal[j].nombre + "<br /> Total Venta Bs <span class='formulaTXT'> C = A + B</span></div></th>";
                html += "<th><div  style='width:90px'>" + listaSucursal[j].nombre + "<br /> Descuento de Ventas Bs</div></th>";
                html += "<th><div  style='width:90px'>" + listaSucursal[j].nombre + "<br /> Compra Bs  <span class='formulaTXT'> E </span></div></th>";
                html += "<th><div  style='width:90px'>" + listaSucursal[j].nombre + "<br /> Margen Bruto Bs  <span class='formulaTXT'> F = C - E  </span></div></th>";
                html += "<th><div  style='width:90px'>" + listaSucursal[j].nombre + "<br /> Iva Bs  <span class='formulaTXT'> G = F * 0.13 </span></div></th>";
                html += "<th><div  style='width:90px'>" + listaSucursal[j].nombre + "<br /> IT Bs  <span class='formulaTXT'> H = B * 0.3</span></div></th>";
                html += "<th><div  style='width:90px'>" + listaSucursal[j].nombre + "<br /> Margen Neto Bs  <span class='formulaTXT'> I = F - G - H</span></div></th>";
                columnaTabla.push({nombre: listaSucursal[j].nombre + " Nota Venta Bs", estado: true});
                columnaTabla.push({nombre: listaSucursal[j].nombre + " Factura Bs", estado: true});
                columnaTabla.push({nombre: listaSucursal[j].nombre + " Total Venta Bs", estado: true});
                columnaTabla.push({nombre: listaSucursal[j].nombre + " Descuento Bs", estado: true});
                columnaTabla.push({nombre: listaSucursal[j].nombre + " Compra Bs", estado: true});
                columnaTabla.push({nombre: listaSucursal[j].nombre + " Margen Bruto Bs", estado: true});
                columnaTabla.push({nombre: listaSucursal[j].nombre + " Iva Bs", estado: true});
                columnaTabla.push({nombre: listaSucursal[j].nombre + " IT Bs", estado: true});
                columnaTabla.push({nombre: listaSucursal[j].nombre + " Margen Neto Bs", estado: true});
            }
            html += "</thead><tbody style='height: 300px;'>";
            var fechas = {};
            for (var i = 0; i < lista.length; i++) {
                var sucursal_id = lista[i].sucursal_id;
                var aux = meses[lista[i].mes] + ", " + lista[i].ano;
                var nro = lista[i].mes + "_" + lista[i].ano;
                if (tipo === "Diarias") {
                    aux = lista[i].fecha;
                    nro = lista[i].fecha.replace("/", "_").replace("/", "_");
                }
                if (!fechas["f" + nro]) {
                    var stringJson = JSON.stringify(sucursalesJson);
                    fechas["f" + nro] = $.parseJSON(stringJson);
                    fechas["f" + nro].fecha = aux;
                }
                var contado = parseFloat(lista[i].contado);
                var facturado = 0;
                var notaVenta = 0;
                var iva = 0;
                var it = 0;
                var compra = parseFloat(lista[i].compra);
                var margenBruto = (contado - compra);

                if (lista[i].tipoDocumento === "Nota de Venta") {
                    notaVenta = contado;
                } else {
                    facturado = contado;
                    iva = margenBruto * 0.13;
                    it = facturado * 0.03;
                }
                var descuento = parseFloat(lista[i].descuento);
                if (contado === 0) {
                    iva = 0;
                    it = 0;
                    descuento = 0;
                    compra = 0;
                    margenBruto = 0;
                }
                var margenNeto = margenBruto - iva - it;


                fechas["f" + nro][sucursal_id].NotaVenta += notaVenta;
                fechas["f" + nro][sucursal_id].Facturado += facturado;
                fechas["f" + nro][sucursal_id].Vendido += contado;
                fechas["f" + nro][sucursal_id].Descuento += descuento;
                fechas["f" + nro][sucursal_id].Compra += compra;
                fechas["f" + nro][sucursal_id].MargenBruto += margenBruto;
                fechas["f" + nro][sucursal_id].Iva += iva;
                fechas["f" + nro][sucursal_id].IT += it;
                fechas["f" + nro][sucursal_id].Margen_Neto += margenNeto;
            }
            var stringJson = JSON.stringify(sucursalesJson);
            var totales = $.parseJSON(stringJson);
            for (var item in fechas) {
                html += "<tr>";
                html += "<td><div style=' width:115px;'>" + fechas[item].fecha + "</div></td>";
                for (var j in listaSucursal) {
                    var sucursal_id = listaSucursal[j].id_sucursal;
                    var NotaVenta = fechas[item][sucursal_id].NotaVenta;
                    var Facturado = fechas[item][sucursal_id].Facturado;
                    var Vendido = fechas[item][sucursal_id].Vendido;
                    var Descuento = fechas[item][sucursal_id].Descuento;
                    var Compra = fechas[item][sucursal_id].Compra;
                    var MargenBruto = fechas[item][sucursal_id].MargenBruto;
                    var Iva = fechas[item][sucursal_id].Iva;
                    var IT = fechas[item][sucursal_id].IT;
                    var Margen_Neto = fechas[item][sucursal_id].Margen_Neto;

                    totales[sucursal_id].NotaVenta += NotaVenta;
                    totales[sucursal_id].Facturado += Facturado;
                    totales[sucursal_id].Vendido += Vendido;
                    totales[sucursal_id].Descuento += Descuento;
                    totales[sucursal_id].Compra += Compra;
                    totales[sucursal_id].MargenBruto += MargenBruto;
                    totales[sucursal_id].Iva += Iva;
                    totales[sucursal_id].IT += IT;
                    totales[sucursal_id].Margen_Neto += Margen_Neto;
                    html += "<td><div  style='width:90px' class='derecha'>" + format(NotaVenta) + " </div></td>";
                    html += "<td><div  style='width:90px' class='derecha'>" + format(Facturado) + " </div></td>";
                    html += "<td><div  style='width:90px' class='derecha'>" + format(Vendido) + " </div></td>";
                    html += "<td><div  style='width:90px' class='derecha'>" + format(Descuento) + " </div></td>";
                    html += "<td><div  style='width:90px' class='derecha'>" + format(Compra) + " </div></td>";
                    html += "<td><div  style='width:90px' class='derecha'>" + format(MargenBruto) + " </div></td>";
                    html += "<td><div  style='width:90px' class='derecha'>" + format(Iva) + " </div></td>";
                    html += "<td><div  style='width:90px' class='derecha'>" + format(IT) + " </div></td>";
                    html += "<td><div  style='width:90px' class='derecha'>" + format(Margen_Neto) + " </div></td>";
                }
                html += "</tr>";
            }
            html += "</tbody>";
            html += "<tfoot>";
            html += "<td><div style=' width:115px;' class='derecha'>TOTAL</div></td>";
            for (var j in listaSucursal) {
                var sucursal_id = listaSucursal[j].id_sucursal;
                html += "<td><div  style='width:90px' class='derecha'>" + format(totales[sucursal_id].NotaVenta) + " </div></td>";
                html += "<td><div  style='width:90px' class='derecha'>" + format(totales[sucursal_id].Facturado) + " </div></td>";
                html += "<td><div  style='width:90px' class='derecha'>" + format(totales[sucursal_id].Vendido) + " </div></td>";
                html += "<td><div  style='width:90px' class='derecha'>" + format(totales[sucursal_id].Descuento) + " </div></td>";
                html += "<td><div  style='width:90px' class='derecha'>" + format(totales[sucursal_id].Compra) + " </div></td>";
                html += "<td><div  style='width:90px' class='derecha'>" + format(totales[sucursal_id].MargenBruto) + " </div></td>";
                html += "<td><div  style='width:90px' class='derecha'>" + format(totales[sucursal_id].Iva) + " </div></td>";
                html += "<td><div  style='width:90px' class='derecha'>" + format(totales[sucursal_id].IT) + " </div></td>";
                html += "<td><div  style='width:90px'  class='derecha'>" + format(totales[sucursal_id].Margen_Neto) + " </div></td>";
            }
            html += "</tfoot></table>";
            $("#tblventas").html(html);
            $("#tblventas").igualartabla();
            var tamanofiltro = $("#filtrosMenu").outerHeight();
            tamanopantalla = $(window).height() - 210;
            var tamanoHead = tamanopantalla - $("#tblventas thead").outerHeight() - tamanofiltro;
            $("#tblventas tbody").css("height", tamanoHead);
        }
    });
}
function reporteVendedor() {
    var de = $("input[name=de]").val();
    var hasta = $("input[name=hasta]").val();
    var sucursal = $("#sucursal").data("cod") + "";
    $("h1").text("CI / Vendedor");
    $("#fechabox").visible();
    $("#filtrosMenu > div").css("width", 707);
    $("#filtrocheck").visible();
    $("#detalladoFiltro").visible();
    $("#empleado").ocultar();
    $("#txtEmpleado").ocultar();
    $("#txtbuscador").html("Nombre Vendedor");
    estado = "Vendedor";
    $("#filtroProducto").ocultar();
    limpiarFiltroProducto();
    cargando(true);
    $.get(url, {proceso: 'reporteVendedor', de: de, hasta: hasta, sucursal: sucursal}, function (response) {
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
            var html = "<table class='table'>";
            html += "<thead  class='thead-light'>";
            html += "<th><div style='width:80px'>CI</div></th>";
            html += "<th><div class='medio'>Vendedor</div></th>";
            html += "<th><div style='width:80px'>Doc. Venta</div></th>";
            html += "<th><div  style='width:80px'>Vendido Bs <span class='formulaTXT'> A</span></div></th>";
            html += "<th><div  style='width:80px'>Descuento de Venta Bs</div></th>";
            html += "<th><div  style='width:80px'>Compra Bs <span class='formulaTXT'> B </span></div></th>";
            html += "<th><div  style='width:80px'>Margen Bruto Bs <span class='formulaTXT'> C = A - B </span></div></th>";
            html += "<th><div  style='width:80px'>Iva Bs <span class='formulaTXT'> D = C * 0.13</span></div></th>";
            html += "<th><div  style='width:80px'> IT Bs <span class='formulaTXT'> E = A * 0.03</span></div></th>";
            html += "<th><div  style='width:80px'>Margen Neto Bs <span class='formulaTXT'>F = C - D - E</span></div></th>";
            html += "</thead><tbody style='height:300px;'>";
            var totalVendido = 0;
            var totalDescuento = 0;
            var totalCompra = 0;
            var totalBruto = 0;
            var totalIVA = 0;
            var totalIT = 0;
            var totalNeto = 0;
            for (var i = 0; i < lista.length; i++) {
                var vendido = parseFloat(lista[i].venta);
                var descuento = parseFloat(lista[i].descuento);
                var compra = parseFloat(lista[i].compra);
                var margenBruto = vendido - compra;
                var IVA = margenBruto * 0.13;
                var IT = vendido * 0.13;
                if (vendido === 0) {
                    IVA = 0;
                    IT = 0;
                }
                if (lista[i].tipoDocumento === "Nota de Venta") {
                    IVA = 0;
                    IT = 0;
                }

                var margenNeto = margenBruto - IVA - IT;
                totalVendido += vendido;
                totalDescuento += descuento;
                totalBruto += margenBruto;
                totalIVA += IVA;
                totalIT += IT;
                totalNeto += margenNeto;
                html += "<tr>";
                html += "<td><div  class=' ci' style='width:80px'>" + lista[i].ci + "</div></td>";
                html += "<td><div  class='medio rz'>" + lista[i].vendedor + "</div></td>";
                html += "<td><div style='width:80px'>" + lista[i].tipoDocumento + "</div></td>";
                html += "<td><div class=' derecha vendido' style='width:80px'>" + format(vendido) + "</div></td>";
                html += "<td><div class=' derecha descuento' style='width:80px'>" + format(descuento) + "</div></td>";
                html += "<td><div class=' derecha compra' style='width:80px' >" + format(compra) + "</div></td>";
                html += "<td><div class=' derecha margenbruto'  style='width:80px'>" + format(margenBruto) + "</div></td>";
                html += "<td><div class=' derecha iva'  style='width:80px'>" + format(IVA) + "</div></td>";
                html += "<td><div class=' derecha it'  style='width:80px'>" + format(IT) + "</div></td>";
                html += "<td><div class='derecha neto' style='width:80px'>" + format(margenNeto) + "</div></td></tr>";

            }
            html += "</tbody>";

            html += "<tfoot>";
            html += "<tr >";
            html += "<td><div  style='width:80px'></div></td>";
            html += "<td><div  class='medio'></div></td>";
            html += "<td><div class=' ' style='width:80px'></div></td>";
            html += "<td><div class=' derecha vendido' style='width:80px'>" + format(totalVendido) + "</div></td>";
            html += "<td><div class=' derecha descuento' style='width:80px'>" + format(totalDescuento) + "</div></td>";
            html += "<td><div class=' derecha compra' style='width:80px'>" + format(totalCompra) + "</div></td>";
            html += "<td><div class=' derecha margenbruto' style='width:80px'>" + format(totalBruto) + "</div></td>";
            html += "<td><div class=' derecha iva' style='width:80px'>" + format(totalIVA) + "</div></td>";
            html += "<td><div class=' derecha it' style='width:80px'>" + format(totalIT) + "</div></td>";
            html += "<td><div class='derecha neto' style='width:80px'>" + format(totalNeto) + "</div></td></tr>";
            html += "</tfoot></table>";
            $("#tblventas").html(html);
            $("#tblventas").igualartabla();
            var tamanofiltro = $("#filtrosMenu").outerHeight();
            tamanopantalla = $(window).height() - 210;
            var tamanoHead = tamanopantalla - $("#tblventas thead").outerHeight() - tamanofiltro;
            $("#tblventas tbody").css("height", tamanoHead);
            filtro("");
        }
    });
}
function reporteCliente() {
    var de = $("input[name=de]").val();
    var hasta = $("input[name=hasta]").val();
    var sucursal = $("#sucursal").data("cod") + "";
    $("h1").text("Ventas Por Cliente");
    $("#fechabox").visible();
    $("#filtrosMenu > div").css("width", 707);
    $("#filtrocheck").visible();
    $("#detalladoFiltro").visible();
    $("#empleado").ocultar();
    $("#txtEmpleado").ocultar();
    $("#txtbuscador").html("CI / Cliente");
    estado = "Cliente";
    $("#filtroProducto").ocultar();
    limpiarFiltroProducto();
    cargando(true);
    $.get(url, {proceso: 'reporteCliente', de: de, hasta: hasta, sucursal: sucursal}, function (response) {
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
            var html = "<table class='table'>";
            html += "<thead  class='thead-light'>";
            html += "<th><div style='width:80px'>CI</div></th>";
            html += "<th><div class='medio'>Cliente</div></th>";
            html += "<th><div style='width:80px'>Doc. Venta</div></th>";
            html += "<th><div  style='width:80px'>Vendido Bs <span class='formulaTXT'> A</span></div></th>";
            html += "<th><div  style='width:80px'>Descuento de Venta Bs</div></th>";
            html += "<th><div  style='width:80px'>Compra Bs <span class='formulaTXT'> B </span></div></th>";
            html += "<th><div  style='width:80px'>Margen Bruto Bs <span class='formulaTXT'> C = A - B </span></div></th>";
            html += "<th><div  style='width:80px'>Iva Bs <span class='formulaTXT'> D = C * 0.13</span></div></th>";
            html += "<th><div  style='width:80px'> IT Bs <span class='formulaTXT'> E = A * 0.03</span></div></th>";
            html += "<th><div  style='width:80px'>Margen Neto Bs <span class='formulaTXT'>F = C - D - E</span></div></th>";
            html += "</thead><tbody style='height:300px;'>";
            var totalVendido = 0;
            var totalDescuento = 0;
            var totalCompra = 0;
            var totalBruto = 0;
            var totalIVA = 0;
            var totalIT = 0;
            var totalNeto = 0;
            for (var i = 0; i < lista.length; i++) {
                var vendido = parseFloat(lista[i].venta);
                var descuento = parseFloat(lista[i].descuento);
                var compra = parseFloat(lista[i].compra);
                var margenBruto = vendido - compra;
                var IVA = margenBruto * 0.13;
                var IT = vendido * 0.13;
                if (vendido === 0) {
                    IVA = 0;
                    IT = 0;
                }
                if (lista[i].tipoDocumento === "Nota de Venta") {
                    IVA = 0;
                    IT = 0;
                }

                var margenNeto = margenBruto - IVA - IT;
                totalVendido += vendido;
                totalDescuento += descuento;
                totalBruto += margenBruto;
                totalIVA += IVA;
                totalIT += IT;
                totalNeto += margenNeto;
                html += "<tr>";
                html += "<td><div  class=' ci' style='width:80px'>" + lista[i].ci + "</div></td>";
                html += "<td><div  class='medio rz'>" + lista[i].vendedor + "</div></td>";
                html += "<td><div style='width:80px'>" + lista[i].tipoDocumento + "</div></td>";
                html += "<td><div class=' derecha vendido' style='width:80px'>" + format(vendido) + "</div></td>";
                html += "<td><div class=' derecha descuento' style='width:80px'>" + format(descuento) + "</div></td>";
                html += "<td><div class=' derecha compra' style='width:80px' >" + format(compra) + "</div></td>";
                html += "<td><div class=' derecha margenbruto'  style='width:80px'>" + format(margenBruto) + "</div></td>";
                html += "<td><div class=' derecha iva'  style='width:80px'>" + format(IVA) + "</div></td>";
                html += "<td><div class=' derecha it'  style='width:80px'>" + format(IT) + "</div></td>";
                html += "<td><div class='derecha neto' style='width:80px'>" + format(margenNeto) + "</div></td></tr>";

            }
            html += "</tbody>";

            html += "<tfoot>";
            html += "<tr >";
            html += "<td><div  style='width:80px'></div></td>";
            html += "<td><div  class='medio'></div></td>";
            html += "<td><div class=' ' style='width:80px'></div></td>";
            html += "<td><div class=' derecha vendido' style='width:80px'>" + format(totalVendido) + "</div></td>";
            html += "<td><div class=' derecha descuento' style='width:80px'>" + format(totalDescuento) + "</div></td>";
            html += "<td><div class=' derecha compra' style='width:80px'>" + format(totalCompra) + "</div></td>";
            html += "<td><div class=' derecha margenbruto' style='width:80px'>" + format(totalBruto) + "</div></td>";
            html += "<td><div class=' derecha iva' style='width:80px'>" + format(totalIVA) + "</div></td>";
            html += "<td><div class=' derecha it' style='width:80px'>" + format(totalIT) + "</div></td>";
            html += "<td><div class='derecha neto' style='width:80px'>" + format(totalNeto) + "</div></td></tr>";
            html += "</tfoot></table>";
            $("#tblventas").html(html);
            $("#tblventas").igualartabla();
            var tamanofiltro = $("#filtrosMenu").outerHeight();
            tamanopantalla = $(window).height() - 210;
            var tamanoHead = tamanopantalla - $("#tblventas thead").outerHeight() - tamanofiltro;
            $("#tblventas tbody").css("height", tamanoHead);
            filtro("");
        }
    });
}
function reporteProducto() {
    var de = $("input[name=de]").val();
    var hasta = $("input[name=hasta]").val();
    var sucursal = $("#sucursal").data("cod") + "";
    $("h1").text("Ventas Por Producto");
    $("#fechabox").visible();
    $("#filtrosMenu > div").css("width", 914);
    $("#filtrocheck").visible();
    $("#detalladoFiltro").visible();
    $("#filtroProducto").visible();
    $("#empleado").ocultar();
    $("#txtEmpleado").ocultar();
    $("#txtbuscador").html("Código / Producto");
    estado = "Producto";
    cargando(true);
    $.get(url, {proceso: 'reporteProducto', de: de, hasta: hasta, sucursal: sucursal}, function (response) {
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
            var html = "<table class='table'>";
            html += "<thead  class='thead-light'>";
            html += "<th><div style='width:80px'>Código</div></th>";
            html += "<th><div class='medio'>Producto</div></th>";
            html += "<th><div class='chico'>Línea</div></th>";
            html += "<th><div class='chico'>Marca</div></th>";
            html += "<th><div  style='width:80px'>Doc. Venta</div></th>";
            html += "<th><div  style='width:80px'>Cantidad</div></th>";
            html += "<th><div  style='width:80px'>Vendido Bs <span class='formulaTXT'> A </span></div></th>";
            html += "<th><div  style='width:80px'>Descuento de Venta Bs </div></th>";
            html += "<th><div  style='width:80px'>Compra Bs  <span class='formulaTXT'> B </span></div></th>";
            html += "<th><div  style='width:80px'>Margen Bruto Bs  <span class='formulaTXT'> C = A - B</span></div></th>";
            html += "<th><div  style='width:80px'>Iva Bs  <span class='formulaTXT'> D = C *0.13</span></div></th>";
            html += "<th><div  style='width:80px'> IT Bs  <span class='formulaTXT'> E = A * 0.03</span></div></th>";
            html += "<th><div  style='width:80px'>Margen Neto Bs  <span class='formulaTXT'> F = C - D - E</span></div></th>";
            html += "</thead><tbody style='height:300px;'>";
            var listaProducto = window.parent.listaProducto;
            var totalVendido = 0;
            var totalDescuento = 0;
            var totalCompra = 0;
            var totalBruto = 0;
            var totalIVA = 0;
            var totalIT = 0;
            var totalNeto = 0;
            var totalCantidad = 0;
            for (var i = 0; i < lista.length; i++) {
                var producto = listaProducto["p" + lista[i].producto_id];
                var vendido = parseFloat(lista[i].venta);
                var descuento = parseFloat(lista[i].descuento);
                var compra = parseFloat(lista[i].compra);
                var cantidad = parseFloat(lista[i].cantidad);
                var margenBruto = vendido - compra;
                var IVA = margenBruto * 0.13;
                var IT = vendido * 0.13;
                if (vendido === 0) {
                    IVA = 0;
                    IT = 0;
                }
                if (lista[i].tipoDocumento === "Nota de Venta") {
                    IVA = 0;
                    IT = 0;
                }
                var margenNeto = margenBruto - IVA - IT;
                totalVendido += vendido;
                totalCompra += compra;
                totalDescuento += descuento;
                totalBruto += margenBruto;
                totalCantidad += cantidad;
                totalIVA += IVA;
                totalIT += IT;
                totalNeto += margenNeto;
                html += "<tr data-linea='" + producto.linea_producto_id + "' data-marca='" + producto.marca_id + "'  >";
                html += "<td><div style='width:80px'  class=' ci'>" + producto.codigo + "</div></td>";
                html += "<td><div  class='medio rz'>" + producto.nombre + "</div></td>";
                html += "<td><div  class='chico'>" + producto.linea + "</div></td>";
                html += "<td><div  class='chico'>" + producto.marca + "</div></td>";
                html += "<td><div  style='width:80px'>" + lista[i].tipoDocumento + "</div></td>";
                html += "<td><div class=' derecha cantidad' style='width:80px'>" + format(cantidad) + "</div></td>";
                html += "<td><div class=' derecha vendido' style='width:80px'>" + format(vendido) + "</div></td>";
                html += "<td><div class=' derecha descuento' style='width:80px'>" + format(descuento) + "</div></td>";
                html += "<td><div class=' derecha compra' style='width:80px'>" + format(compra) + "</div></td>";
                html += "<td ><div class=' derecha margenbruto' style='width:80px'>" + format(margenBruto) + "</div></td>";
                html += "<td><div class=' derecha iva' style='width:80px'>" + format(IVA) + "</div></td>";
                html += "<td><div class=' derecha it' style='width:80px'>" + format(IT) + "</div></td>";
                html += "<td><div class='derecha neto' style='width:80px'>" + format(margenNeto) + "</div></td></tr>";

            }
            html += "</tbody>";

            html += "<tfoot>";
            html += "<tr >";
            html += "<td><div  style='width:80px'></div></td>";
            html += "<td><div  class='medio'></div></td>";
            html += "<td><div class='chico'></div></td>";
            html += "<td><div class='chico'></div></td>";
            html += "<td><div class=' ' style='width:80px'></div></td>";
            html += "<td><div class=' derecha cantidad' style='width:80px'>" + format(totalCantidad) + "</div></td>";
            html += "<td><div class=' derecha vendido' style='width:80px'>" + format(totalVendido) + "</div></td>";
            html += "<td  ><div class=' derecha descuento' style='width:80px'>" + format(totalDescuento) + "</div></td>";
            html += "<td ><div class=' derecha compra' style='width:80px'>" + format(totalCompra) + "</div></td>";
            html += "<td><div class=' derecha margenbruto' style='width:80px'>" + format(totalBruto) + "</div></td>";
            html += "<td><div class=' derecha iva' style='width:80px'>" + format(totalIVA) + "</div></td>";
            html += "<td><div class=' derecha it' style='width:80px'>" + format(totalIT) + "</div></td>";
            html += "<td><div class='derecha neto' style='width:80px'>" + format(totalNeto) + "</div></td></tr>";
            html += "</tfoot></table>";
            $("#tblventas").html(html);
            $("#tblventas").igualartabla();
            var tamanofiltro = $("#filtrosMenu").outerHeight();
            tamanopantalla = $(window).height() - 210;
            var tamanoHead = tamanopantalla - $("#tblventas thead").outerHeight() - tamanofiltro;
            $("#tblventas tbody").css("height", tamanoHead);
            filtro("");
        }
    });
}
function reporteLineaProducto() {
    var de = $("input[name=de]").val();
    var hasta = $("input[name=hasta]").val();
    var sucursal = $("#sucursal").data("cod");
    $("h1").text("Ventas Por Línea Producto");
    $("#fechabox").visible();
    $("#filtrosMenu > div").css("width", 559);
    $("#filtrocheck").visible();
    $("#detalladoFiltro").ocultar();
    $("#filtroProducto").ocultar();
    $("#txtEmpleado").ocultar();
    $("#empleado").ocultar();
    $("#txtbuscador").html("Código / Producto");
    estado = "LineaProducto";
    cargando(true);
    $.get(url, {proceso: 'reporteLineaProducto', de: de, hasta: hasta, sucursal: sucursal}, function (response) {
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
            var html = "<table class='table'>";
            html += "<thead  class='thead-light'>";
            html += "<th><div class='medio'>Línea</div></th>";
            html += "<th><div style='width:80px'>Doc. Venta</div></th>";
            html += "<th><div  style='width:80px'>Cantidad</div></th>";
            html += "<th><div  style='width:80px'>Vendido Bs  <span class='formulaTXT'> A </span></div></th>";
            html += "<th><div  style='width:80px'>Descuento de Venta Bs</div></th>";
            html += "<th><div  style='width:80px'>Compra Bs  <span class='formulaTXT'> B</span></div></th>";
            html += "<th><div  style='width:80px'>Margen Bruto Bs  <span class='formulaTXT'> C = A - B</span></div></th>";
            html += "<th><div  style='width:80px'>Iva Bs  <span class='formulaTXT'> D = C *0.13</span></div></th>";
            html += "<th><div  style='width:80px'> IT Bs  <span class='formulaTXT'> E = A *0.03</span></div></th>";
            html += "<th><div  style='width:80px'>Margen Neto Bs  <span class='formulaTXT'> F = C - D - E</span></div></th>";
            html += "</thead><tbody style='height:300px;'>";
            var totalVendido = 0;
            var totalDescuento = 0;
            var totalCompra = 0;
            var totalBruto = 0;
            var totalIVA = 0;
            var totalIT = 0;
            var totalNeto = 0;
            var totalCantidad = 0;
            for (var i = 0; i < lista.length; i++) {
                var linea = listaLinea[lista[i].linea_producto_id];
                var vendido = parseFloat(lista[i].venta);
                var cantidad = parseInt(lista[i].cantidad);
                var descuento = parseFloat(lista[i].descuento);
                var compra = parseFloat(lista[i].compra);
                var cantidad = parseFloat(lista[i].cantidad);
                var margenBruto = vendido - compra;
                var IVA = margenBruto * 0.13;
                var IT = vendido * 0.13;

                if (vendido === 0) {
                    IVA = 0;
                    IT = 0;
                }
                if (lista[i].tipoDocumento === "Nota de Venta") {
                    IVA = 0;
                    IT = 0;
                }
                var margenNeto = margenBruto - IVA - IT;
                totalCompra += compra;
                totalVendido += vendido;
                totalDescuento += descuento;
                totalBruto += margenBruto;
                totalCantidad += cantidad;
                totalIVA += IVA;
                totalIT += IT;
                totalNeto += margenNeto;
                html += "<tr >";
                html += "<td><div  class='medio'>" + linea.descripcion + "</div></td>";
                html += "<td><div style='width:80px'>" + lista[i].tipoDocumento + "</div></td>";
                html += "<td><div class=' derecha cantidad' style='width:80px'>" + cantidad + "</div></td>";
                html += "<td><div class=' derecha vendido' style='width:80px'>" + format(vendido) + "</div></td>";
                html += "<td><div class=' derecha descuento' style='width:80px'>" + format(descuento) + "</div></td>";
                html += "<td><div class=' derecha compra'  style='width:80px'>" + format(compra) + "</div></td>";
                html += "<td><div class=' derecha margenbruto' style='width:80px'>" + format(margenBruto) + "</div></td>";
                html += "<td><div class=' derecha iva' style='width:80px'>" + format(IVA) + "</div></td>";
                html += "<td><div class=' derecha it' style='width:80px'>" + format(IT) + "</div></td>";
                html += "<td><div class='derecha neto' style='width:80px'>" + format(margenNeto) + "</div></td></tr>";

            }
            html += "</tbody>";

            html += "<tfoot>";
            html += "<tr >";
            html += "<td><div  class='medio'></div></td>";
            html += "<td><div style='width:80px'></div></td>";
            html += "<td><div class=' derecha cantidad' style='width:80px'>" + format(totalCantidad) + "</div></td>";
            html += "<td><div class=' derecha vendido' style='width:80px'>" + format(totalVendido) + "</div></td>";
            html += "<td><div class=' derecha descuento' style='width:80px'>" + format(totalDescuento) + "</div></td>";
            html += "<td><div class=' derecha compra' style='width:80px'>" + format(totalCompra) + "</div></td>";
            html += "<td><div class=' derecha margenbruto' style='width:80px'>" + format(totalBruto) + "</div></td>";
            html += "<td><div class=' derecha iva' style='width:80px'>" + format(totalIVA) + "</div></td>";
            html += "<td><div class=' derecha it' style='width:80px' >" + format(totalIT) + "</div></td>";
            html += "<td><div class='derecha neto' style='width:80px'>" + format(totalNeto) + "</div></td></tr>";
            html += "</tfoot></table>";
            $("#tblventas").html(html);
            $("#tblventas").igualartabla();
            var tamanofiltro = $("#filtrosMenu").outerHeight();
            tamanopantalla = $(window).height() - 210;
            var tamanoHead = tamanopantalla - $("#tblventas thead").outerHeight() - tamanofiltro;
            $("#tblventas tbody").css("height", tamanoHead);
        }
    });
}
function reporteMarcaProducto() {
    var de = $("input[name=de]").val();
    var hasta = $("input[name=hasta]").val();
    var sucursal = $("#sucursal").data("cod");
    $("h1").text("Ventas Por Marca Producto");
    $("#fechabox").visible();
    $("#filtrosMenu > div").css("width", 559);
    $("#filtrocheck").visible();
    $("#detalladoFiltro").ocultar();
    $("#filtroProducto").ocultar();
    $("#txtEmpleado").ocultar();
    $("#empleado").ocultar();
    $("#txtbuscador").html("Código / Producto");
    estado = "MarcaProducto";
    cargando(true);
    $.get(url, {proceso: 'reporteMarcaProducto', de: de, hasta: hasta, sucursal: sucursal}, function (response) {
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
            var html = "<table class='table'>";
            html += "<thead  class='thead-light'>";
            html += "<th><div class='medio'>Marca</div></th>";
            html += "<th><div style='width:80px'>Doc. Venta</div></th>";
            html += "<th><div  style='width:80px'>Cantidad</div></th>";
            html += "<th><div  style='width:80px'>Vendido Bs  <span class='formulaTXT'> A </span></div></th>";
            html += "<th><div  style='width:80px'>Descuento de Venta Bs</div></th>";
            html += "<th><div  style='width:80px'>Compra Bs  <span class='formulaTXT'> B</span></div></th>";
            html += "<th><div  style='width:80px'>Margen Bruto Bs  <span class='formulaTXT'> C = A - B</span></div></th>";
            html += "<th><div  style='width:80px'>Iva Bs  <span class='formulaTXT'> D = C *0.13</span></div></th>";
            html += "<th><div  style='width:80px'> IT Bs  <span class='formulaTXT'> E = A *0.03</span></div></th>";
            html += "<th><div  style='width:80px'>Margen Neto Bs  <span class='formulaTXT'> F = C - D - E</span></div></th>";
            html += "</thead><tbody style='height:300px;'>";
            var totalVendido = 0;
            var totalDescuento = 0;
            var totalCompra = 0;
            var totalBruto = 0;
            var totalIVA = 0;
            var totalIT = 0;
            var totalNeto = 0;
            var totalCantidad = 0;
            for (var i = 0; i < lista.length; i++) {
                var marca = listaMarca[lista[i].marca_id];
                var vendido = parseFloat(lista[i].venta);
                var cantidad = parseInt(lista[i].cantidad);
                var descuento = parseFloat(lista[i].descuento);
                var compra = parseFloat(lista[i].compra);
                var cantidad = parseFloat(lista[i].cantidad);
                var margenBruto = vendido - compra;
                var IVA = margenBruto * 0.13;
                var IT = vendido * 0.13;

                if (vendido === 0) {
                    IVA = 0;
                    IT = 0;
                }
                if (lista[i].tipoDocumento === "Nota de Venta") {
                    IVA = 0;
                    IT = 0;
                }
                var margenNeto = margenBruto - IVA - IT;
                totalCompra += compra;
                totalVendido += vendido;
                totalDescuento += descuento;
                totalBruto += margenBruto;
                totalCantidad += cantidad;
                totalIVA += IVA;
                totalIT += IT;
                totalNeto += margenNeto;
                html += "<tr >";
                html += "<td><div  class='medio'>" + marca.descripcion + "</div></td>";
                html += "<td><div style='width:80px'>" + lista[i].tipoDocumento + "</div></td>";
                html += "<td><div class=' derecha cantidad' style='width:80px'>" + cantidad + "</div></td>";
                html += "<td><div class=' derecha vendido' style='width:80px'>" + format(vendido) + "</div></td>";
                html += "<td><div class=' derecha descuento' style='width:80px'>" + format(descuento) + "</div></td>";
                html += "<td><div class=' derecha compra'  style='width:80px'>" + format(compra) + "</div></td>";
                html += "<td><div class=' derecha margenbruto' style='width:80px'>" + format(margenBruto) + "</div></td>";
                html += "<td><div class=' derecha iva' style='width:80px'>" + format(IVA) + "</div></td>";
                html += "<td><div class=' derecha it' style='width:80px'>" + format(IT) + "</div></td>";
                html += "<td><div class='derecha neto' style='width:80px'>" + format(margenNeto) + "</div></td></tr>";

            }
            html += "</tbody>";

            html += "<tfoot>";
            html += "<tr >";
            html += "<td><div  class='medio'></div></td>";
            html += "<td><div style='width:80px'></div></td>";
            html += "<td><div class=' derecha cantidad' style='width:80px'>" + format(totalCantidad) + "</div></td>";
            html += "<td><div class=' derecha vendido' style='width:80px'>" + format(totalVendido) + "</div></td>";
            html += "<td><div class=' derecha descuento' style='width:80px'>" + format(totalDescuento) + "</div></td>";
            html += "<td><div class=' derecha compra' style='width:80px'>" + format(totalCompra) + "</div></td>";
            html += "<td><div class=' derecha margenbruto' style='width:80px'>" + format(totalBruto) + "</div></td>";
            html += "<td><div class=' derecha iva' style='width:80px'>" + format(totalIVA) + "</div></td>";
            html += "<td><div class=' derecha it' style='width:80px' >" + format(totalIT) + "</div></td>";
            html += "<td><div class='derecha neto' style='width:80px'>" + format(totalNeto) + "</div></td></tr>";
            html += "</tfoot></table>";
            $("#tblventas").html(html);
            $("#tblventas").igualartabla();
            var tamanofiltro = $("#filtrosMenu").outerHeight();
            tamanopantalla = $(window).height() - 210;
            var tamanoHead = tamanopantalla - $("#tblventas thead").outerHeight() - tamanofiltro;
            $("#tblventas tbody").css("height", tamanoHead);
        }
    });
}
function reporteDetallado() {
    var de = $("input[name=de]").val();
    var hasta = $("input[name=hasta]").val();
    estado = "Detalle";
    $("#empleado").visible();
    $("#txtEmpleado").visible(1);
    $("#fechabox").visible();
    $("#detalladoFiltro").visible();
    $("#filtrocheck").ocultar();
    $("#filtroProducto").ocultar();
    $("#filtrosMenu > div").css("width", 856);
    $("#txtbuscador").html("NIT / Cliente");
    $("h1").text("Ventas Detallada");
    limpiarFiltroProducto();
    cargando(true);
    $.get(url, {proceso: 'reporteDetallado', de: de, hasta: hasta}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            alertaRapida(json.error, "error");
        } else {
            tamanopantalla = $(window).height() - 210;
            var lista = json.result;
            var html = "<table class='table'>";
            html += "<thead class='thead-light'>";
            html += "<th><div style='width:80px'>Fecha</div></th>";
            html += "<th><div  style='width:80px'>Nro. Doc.</div></th>";
            html += "<th><div  style='width:80px'>NIT / CI</div></th>";
            html += "<th><div class='medio'>Razon Social</div></th>";
            html += "<th><div class='medio'>Vendedor</div></th>";
            html += "<th><div  style='width:80px'>Monto Venta Bs <span class='formulaTXT'> A </span></div></th>";
            html += "<th><div  style='width:80px'>Descuento de Ventas Bs</div></th>";
            html += "<th><div  style='width:80px'>Compra Bs <span class='formulaTXT'> B </span></div></th>";
            html += "<th><div  style='width:80px'>Margen Bruto Bs <span class='formulaTXT'> C = A - B </span></div></th>";
            html += "<th><div  style='width:80px'>IVA Bs <span class='formulaTXT'> D = C * 0.13 </span></div></th>";
            html += "<th><div  style='width:80px'>IT Bs <span class='formulaTXT'> E = A * 0.3 </span></div></th>";
            html += "<th><div  style='width:80px'>Margen Neto Bs <span class='formulaTXT'> F = C - D - E </span></div></th>";
            html += "</thead><tbody style='height:" + (tamanopantalla - 25) + "px;'>";
            var lista = json.result;
            var totalVenta = 0;
            var totalDesc = 0;
            var totalCompra = 0;
            var totalMargenBruto = 0;
            var totalIVA = 0;
            var totalIT = 0;
            var totalNeto = 0;
            for (var i = 0; i < lista.length; i++) {
                var vendido = parseFloat(lista[i].venta);
                var descuento = parseFloat(lista[i].descuento);
                var compra = parseFloat(lista[i].compra);
                var margenBruto = vendido - compra;

                var iva = margenBruto * 0.13;
                var it = vendido * 0.03;

                if (vendido === 0) {
                    iva = 0;
                    it = 0;
                }
                if (lista[i].nroDocumento.indexOf("NV") >= 0) {
                    iva = 0;
                    it = 0;
                }
                var neto = (margenBruto - it - iva);
                var estadoCss="";
                if(lista[i].estado != "activo"){
                    estadoCss="background: #ff0e0e2e;"
                    vendido=0;
                    descuento=0;
                    compra=0;
                    margenBruto=0;
                    iva=0;
                    it=0;
                    neto=0;
                }

                html += "<tr data-sucursal='" + lista[i].sucursal_id + "' data-usuario='" + lista[i].usuario_id + "' style='"+estadoCss+"' >";
                html += "<td><div  style='width:80px'>" + lista[i].fecha + "</div></td>";
                html += "<td><div class=' subrayar'  style='width:80px' onclick=\"redireccionar('Venta'," + lista[i].id_venta + ")\">" + lista[i].nroDocumento + "</div></td>";
                html += "<td><div class=' ci' style='width:80px'>" + lista[i].nit + "</div></td>";
                html += "<td><div class='medio rz'>" + lista[i].razonsocial + "</div></td>";
                html += "<td><div class='medio'>" + lista[i].vendedor + "</div></td>";
                html += "<td><div class=' derecha vendido' style='width:80px'>" + format(vendido) + "</div></td>";
                html += "<td><div class=' derecha descuento' style='width:80px'>" + format(descuento) + "</div></td>";
                html += "<td><div class=' derecha compra' style='width:80px'>" + format(compra) + "</div></td>";
                html += "<td><div class=' derecha margenbruto' style='width:80px'>" + format(margenBruto) + "</div></td>";
                html += "<td><div class=' derecha iva' style='width:80px'>" + format(iva) + "</div></td>";
                html += "<td><div class=' derecha it' style='width:80px'>" + format(it) + "</div></td>";
                html += "<td><div class=' derecha neto' style='width:80px'>" + format(neto) + "</div></td>";
                html += "</tr>";
                totalVenta += vendido;
                totalDesc += descuento;
                totalCompra += compra;
                totalMargenBruto += margenBruto;
                totalIVA += iva;
                totalIT += it;
                totalNeto += neto;
            }
            html += "<tfoot><tr>";
            html += "<td><div style='width:80px'></div></td>";
            html += "<td><div  style='width:80px'></div></td>";
            html += "<td><div  style='width:80px'></div></td>";
            html += "<td><div class='medio'></div></td>";
            html += "<td><div class='medio'></div></td>";
            html += "<td><div class=' derecha vendido' style='width:80px'>" + format(totalVenta) + "</div></td>";
            html += "<td><div class=' derecha descuento' style='width:80px'>" + format(totalDesc) + "</div></td>";
            html += "<td><div class=' derecha compra' style='width:80px'>" + format(totalCompra) + "</div></td>";
            html += "<td><div class=' derecha margenbruto' style='width:80px'>" + format(totalMargenBruto) + "</div></td>";
            html += "<td><div class=' derecha iva' style='width:80px'>" + format(totalIVA) + "</div></td>";
            html += "<td><div class=' derecha it' style='width:80px'>" + format(totalIT) + "</div></td>";
            html += "<td><div class=' derechaneto' style='width:80px'>" + format(totalNeto) + "</div></td>";
            html += "</tr></tfoot>";
            html += "</table>";
            $("#tblventas").html(html);
            $("#tblventas").igualartabla();
            var tamanofiltro = $("#filtrosMenu").outerHeight();
            tamanopantalla = $(window).height() - 210;
            var tamanoHead = tamanopantalla - $("#tblventas thead").outerHeight() - tamanofiltro;
            $("#tblventas tbody").css("height", tamanoHead);
            filtro('');
        }
    });
}
function filtro(e) {
    if (e === "" || e.keyCode === 13) {
        var marcaAUX = $("#marcab").data("cod") + "";
        var lineaAUX = $("#lineab").data("cod") + "";
        var empleado = $("#empleado").data("cod") + "";
        var buscador = ($("input[name=buscador]").val() + "").toUpperCase();
        $("#tblventas tbody tr").addClass("ocultar");
        var tr = $("#tblventas tbody tr");
        for (var i = 0; i < tr.length; i++) {//default detallado
            var item = $(tr[i]);
            var usu = item.data("usuario") + "";
            var ci = (item.find("div.ci").html() + "").toUpperCase();
            var nombre = (item.find("div.rz").html() + "").toUpperCase();
            var linea = item.data("linea") + "";
            var marca = item.data("marca") + "";

            if (estado === "Detalle") {
                marcaAUX = "0";
                lineaAUX = "0";
            }
            if (estado === "Vendedor") {
                empleado = "0";
                marcaAUX = "0";
                lineaAUX = "0";
            }
            if (estado === "Producto") {
                empleado = "0";
            }


            if ((ci.indexOf(buscador) >= 0 || nombre.indexOf(buscador) >= 0)
                    && (empleado === "0" || empleado === usu)
                    && (lineaAUX === "0" || lineaAUX === linea)
                    && (marcaAUX === "0" || marcaAUX === marca)
                    ) {
                item.removeClass("ocultar");
            }
        }
        calcularTotalFoot();
    }
}
function calcularTotalFoot() {
    var trLista = $("#tblventas tbody tr").not(".ocultar");
    var totalVenta = 0;
    var totalDescuento = 0;
    var totalCompra = 0;
    var totalMargenBruto = 0;
    var totalIVA = 0;
    var totalIT = 0;
    var totalMArgenNeto = 0;
    var totalCantidad = 0;
    for (var i = 0; i < trLista.length; i++) {
        var tr = $(trLista[i]);
        var venta = tr.find("div.vendido").html();
        venta = parseFloat(venta.replace(/\./g, '').replace(/\,/g, '.'));
        var descuento = tr.find("div.descuento").html();
        descuento = parseFloat(descuento.replace(/\./g, '').replace(/\,/g, '.'));
        var compra = tr.find("div.compra").html();
        compra = parseFloat(compra.replace(/\./g, '').replace(/\,/g, '.'));
        var margenbruto = tr.find("div.margenbruto").html();
        margenbruto = parseFloat(margenbruto.replace(/\./g, '').replace(/\,/g, '.'));
        var iva = tr.find("div.iva").html();
        iva = parseFloat(iva.replace(/\./g, '').replace(/\,/g, '.'));
        var IT = tr.find("div.it").html();
        IT = parseFloat(IT.replace(/\./g, '').replace(/\,/g, '.'));
        var margenNeto = tr.find("div.neto").html();
        margenNeto = parseFloat(margenNeto.replace(/\./g, '').replace(/\,/g, '.'));
        if (estado === "Producto") {
            var cantidad = tr.find("div.cantidad").html();
            cantidad = parseFloat(cantidad.replace(/\./g, '').replace(/\,/g, '.'));
            totalCantidad += cantidad;
        }
        totalVenta += venta;
        totalDescuento += descuento;
        totalCompra += compra;
        totalMargenBruto += margenbruto;
        totalIVA += iva;
        totalIT += IT;
        totalMArgenNeto += margenNeto;
    }
    var tr = $("#tblventas tfoot tr");
    $(tr[0]).find("div.vendido").html(format(totalVenta));
    $(tr[0]).find("div.descuento").html(format(totalDescuento));
    $(tr[0]).find("div.compra").html(format(totalCompra));
    $(tr[0]).find("div.margenbruto").html(format(totalMargenBruto));
    $(tr[0]).find("div.iva").html(format(totalIVA));
    $(tr[0]).find("div.it").html(format(totalIT));
    $(tr[0]).find("div.neto").html(format(totalMArgenNeto));
    $(tr[0]).find("div.cantidad").html(format(totalCantidad));
}
function imprimir() {
    var contenido = $("#tblventas").html();
    var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal === null) {
        window.parent.cerrarSession();
        return;
    }
    usuarioLocal = $.parseJSON(usuarioLocal);
    var titulo = "";
    var filtro = "<div class='row' id='filtroReporte'>";
    filtro += "<div class='col-12'><span class='negrilla'>FILTROS</div>";
    var de = $("input[name=de]").val();
    var buscador = $("input[name=buscador]").val();
    var hasta = $("input[name=hasta]").val();
    var marcaAUX = $("#marcab").val() + "";
    var lineaAUX = $("#lineab").val() + "";
    var empleado = $("#empleado").val() + "";
    var sucursal = $("#sucursal").val() + "";
    if (sucursal !== "") {
        filtro += "<div class='col-4'><span class='negrilla'>Sucursal: </span>" + sucursal + "</div>";
    }
    if (estado === "Producto" || estado === "Vendedor" || estado === "Detalle" || estado === "Cliente") {
        if (buscador !== "") {
            filtro += "<div class='col-4'><span class='negrilla'>Buscador: </span>" + buscador + "</div>";
        }
    }
    if (estado !== "Mensuales") {
        filtro += "<div class='col-4'><span class='negrilla'>Fecha: </span>" + de + " - " + hasta + "</div>";
    }
    if (estado !== "Detalle") {
        if (empleado !== "") {
            filtro += "<div class='col-4'><span class='negrilla'>Vendedor: </span>" + empleado + "</div>";
        }
    }
    if (estado === "Producto") {
        if (marcaAUX !== "") {
            filtro += "<div class='col-4'><span class='negrilla'>Marca: </span>" + marcaAUX + "</div>";
        }
        if (lineaAUX !== "") {
            filtro += "<div class='col-4'><span class='negrilla'>Línea: </span>" + lineaAUX + "</div>";
        }
    }

    if (estado === "Detalle") {
        titulo = "Reporte de Ventas Detallada";
    } else if (estado === "Diarias") {
        titulo = "Reporte de Ventas Diarias";
    } else if (estado === "Mensuales") {
        titulo = "Reporte de Ventas Mensuales";
    } else if (estado === "Vendedor") {
        titulo = "Reporte de Ventas Por Vendedor";
    } else if (estado === "Producto") {
        titulo = "Reporte de Ventas Por Producto";
    } else if (estado === "LineaProducto") {
        titulo = "Reporte de Ventas Por Línea Producto";
    } else if (estado === "Cliente") {
        titulo = "Reporte de Ventas Por Cliente";
    } else if (estado === "MarcaProducto") {
        titulo = "Reporte de Ventas Por Marca Producto";
    }

    filtro += "</div>";
    imprimirReporte({contenido: contenido, sucursal_id: usuarioLocal.sucursal_id, titulo: titulo, datosHead: filtro, encabezadoThead: true});
}
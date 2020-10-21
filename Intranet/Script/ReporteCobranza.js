var url = '../Controlador/ReporteCobranza_Controlador.php';
var meses = ["", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
var estado = "Mensual";
var sucursalesJson = {};
var tamanopantalla = $(window).height() - 195;
var columnaTabla = [];
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
        tamanopantalla = $(window).height() - 195;
        var tamanoHead = tamanopantalla - $("#tblventas thead").outerHeight() - tamanofiltro;
        $("#tblventas tbody").css("height", tamanoHead);
    });
    var listaSucursal = window.parent.listaSucursal;
    for (var i = 0; i < listaSucursal.length; i++) {
        sucursalesJson[listaSucursal[i].id_sucursal] = 0;
    }
    comboBox({identificador: "input[name=sucursal]", datos: listaSucursal, codigo: "id_sucursal", texto: "nombre", todos: true, callback: () => {
            filtroDetallado("")
        }});
    var listaUsuario = window.parent.listaUsuario;
    comboBox({identificador: "input[name=empleado]", datos: listaUsuario, codigo: "id_usuario", texto: "nombre", todos: true, callback: () => {
            filtroDetallado("")
        }});
    var listaCliente = window.parent.listaCliente;
    comboBox({identificador: "input[name=cliente]", datos: listaCliente, codigo: "id_cliente", texto: "nombre", todos: true, callback: () => {
            reporteCliente()
        }});

    var listaPermisosUsuarioRapido = window.parent.listaPermisosUsuarioRapido;
    var tipo = ""
    if (listaPermisosUsuarioRapido[156]) {
        reporteMensual("Mensual");
    } else if (listaPermisosUsuarioRapido[157]) {
        reporteMensual("Diario");
    } else if (listaPermisosUsuarioRapido[158]) {
        reporteDetallado()
    } else if (listaPermisosUsuarioRapido[159]) {
        reporteCobrador()
    } else {
        estado = "";
    }

});
function generar() {
    if (estado === "Detalle") {
        reporteDetallado();
    } else if (estado === "Diario" || estado === "Mensual") {
        reporteMensual(estado);
    } else if (estado === "Cobrador") {
        reporteCobrador();
    }
}
function imprimir() {
    if (estado === "Detalle") {
        filtroDetallado("");
    }
    var contenido = $("#tblventas").html();
    var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal === null) {
        window.parent.cerrarSession();
        return;
    }
    usuarioLocal = $.parseJSON(usuarioLocal);
    var filtro = "<div class='row' id='filtroReporte'>";
    var de = $("input[name=de]").val();
    var hasta = $("input[name=hasta]").val();
    var empleado = $("input[name=empleado]").val();
    var cliente = $("input[name=cliente]").val();
    var buscador = $("input[name=buscador]").val();
    var sucursal = $("input[name=sucursal]").val();
    var titulo = "";
    if (estado === "Detalle") {
        titulo = "REPORTE DE COBRANZA DETALLADA";
        filtro += "<div class='col-12'><span class='negrilla'>FILTROS</div>";
        filtro += "<div class='col-6'><span class='negrilla'>Fecha: </span>" + de + " - " + hasta + "</div>";
        if (empleado !== "") {
            filtro += "<div class='col-6'><span class='negrilla'>Cobrador: </span>" + empleado + "</div>";
        }
        if (buscador !== "") {
            filtro += "<div class='col-6'><span class='negrilla'>Busqueda: </span>" + buscador + "</div>";
        }
        if (sucursal !== "") {
            filtro += "<div class='col-6'><span class='negrilla'>Busqueda: </span>" + sucursal + "</div>";
        }
    } else if (estado === "Diario") {
        filtro += "<div class='col-12'><span class='negrilla'>FILTROS</div>";
        titulo = "REPORTE DE COBRANZA DIARIA";
        filtro += "<div class='col-6'><span class='negrilla'>Fecha: </span>" + de + " - " + hasta + "</div>";

    } else if (estado === "Cobrador") {
        filtro += "<div class='col-12'><span class='negrilla'>FILTROS</div>";
        filtro += "<div class='col-6'><span class='negrilla'>Fecha: </span>" + de + " - " + hasta + "</div>";
        if (empleado !== "") {
            filtro += "<div class='col-6'><span class='negrilla'>Cobrador: </span>" + empleado + "</div>";
        }
        titulo = "REPORTE DE COBRANZA POR COBRADOR";
    } else if (estado === "Cliente") {
        filtro += "<div class='col-12'><span class='negrilla'>FILTROS</div>";
        filtro += "<div class='col-6'><span class='negrilla'>Fecha: </span>" + de + " - " + hasta + "</div>";
        if (cliente !== "") {
            filtro += "<div class='col-6'><span class='negrilla'>Cliente: </span>" + cliente + "</div>";
        }
        titulo = "REPORTE DE COBRANZA POR COBRADOR";
    } else if (estado === "Mensual") {
        titulo = "COBRANZA MENSUAL";
    }
    filtro += "</div>";
    imprimirReporte({contenido: contenido, sucursal_id: usuarioLocal.sucursal_id, titulo: titulo, datosHead: filtro, encabezadoThead: true});
}
function reporteMensual(tipo) {
    var de = $("input[name=de]").val();
    var hasta = $("input[name=hasta]").val();
    $("h1").text("Reporte de Cobranza " + tipo);
    if (tipo === "Diario") {
        $("#fechabox").visible();
        $("#detalladoFiltro").ocultar();
        $("#filtrosMenu > div").css("width", 550);
    } else {
        $("#fechabox").ocultar();
        $("#filtrosMenu > div").css("width", 561);
    }
    $("#clienteDIV").ocultar();
    $("#empleadoDIV").ocultar();
    $("#detalladoFiltro").ocultar();
    $("#filtrocheck").visible();
    estado = tipo;
    cargando(true);
    $.get(url, {proceso: 'reporteCobranza', tipo: tipo, de: de, hasta: hasta}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error, "error");
        } else {
            var html = "";
            var listaSucursal = window.parent.listaSucursal;
            $("#tblventas").html("");
            columnaTabla = [];
            columnaTabla.push({nombre: "Fecha", estado: true});
            var lista = json.result;
            var html = "<table class='table'>";
            html += "<thead  class='thead-light'>";
            html += "<th><div style=' width:115px;'>Fecha</div></th>";
            for (var j = 0 in listaSucursal) {
                columnaTabla.push({nombre: listaSucursal[j].nombre + "  Cobrado Bs", estado: true});
                html += "<th><div class='normal'>" + listaSucursal[j].nombre + " <br> Cobrado Bs</div></th>";
            }
            columnaTabla.push({nombre: "Total Cobrado Bs", estado: true});
            html += "<th><div class='normal'>Total Cobrado Bs</div></th>";
            html += "</thead><tbody style='height:300px'>";


            var fechas = {};
            for (var i = 0; i < lista.length; i++) {
                var sucursal_id = lista[i].sucursal_id;
                var aux = meses[lista[i].mes] + ", " + lista[i].ano;
                var nro = lista[i].mes + "_" + lista[i].ano;
                if (tipo === "Diario") {
                    aux = lista[i].fecha;
                    nro = lista[i].fecha.replace("/", "_").replace("/", "_");
                }
                if (!fechas["f" + nro]) {
                    fechas["f" + nro] = {...sucursalesJson};
                    fechas["f" + nro].fecha = aux;
                }
                fechas["f" + nro][sucursal_id] += parseFloat(lista[i].monto);
            }
            var totales = {...sucursalesJson};
            totales.total = 0;
            for (var item in fechas) {
                var totalFila = 0;
                html += "<tr>";
                html += "<td><div style=' width:115px;'>" + fechas[item].fecha + "</div></td>";
                for (var j in listaSucursal) {
                    var id_sucursal = listaSucursal[j].id_sucursal;
                    var monto = fechas[item][id_sucursal];
                    totales[id_sucursal] += monto;
                    totalFila += monto;
                    html += "<td><div class='normal derecha'>" + format(monto) + "</div></td>";
                }
                totales.total += totalFila;
                html += "<td><div class='normal derecha'>" + format(totalFila) + "</div></td>";
                html += "</tr>";
            }
            html += "</tbody>";

            html += "<tfoot>";
            html += "<td><div style=' width:115px;' class='derecha'>TOTAL</div></td>";
            for (var j in listaSucursal) {
                var id_sucursal = listaSucursal[j].id_sucursal;
                var monto = totales[id_sucursal];
                html += "<td><div class='normal derecha' >" + format(monto) + "</div></td>";
            }
            html += "<td><div class='normal derecha'>" + format(totales.total) + "</div></td>";
            html += "</tfoot></table>";
            $("#tblventas").html(html);
            var tamanofiltro = $("#filtrosMenu").outerHeight();
            tamanopantalla = $(window).height() - 195;
            var tamanoHead = tamanopantalla - $("#tblventas thead").outerHeight() - tamanofiltro;
            $("#tblventas tbody").css("height", tamanoHead);
        }
    });
}
function reporteCobrador() {
    var de = $("input[name=de]").val();
    var hasta = $("input[name=hasta]").val();
    var empleado = $("input[name=empleado]").data("cod");
    $("h1").text("Reporte de Cobranza Por Cobrador");
    $("#fechabox").visible();
    $("#filtrosMenu > div").css("width", 762);
    $("#empleadoDIV").visible();
    $("#clienteDIV").ocultar();
    $("#detalladoFiltro").ocultar();
    estado = "Cobrador";
    cargando(true);
    $.get(url, {proceso: 'reporteCobrador', de: de, hasta: hasta, empleado: empleado}, function (response) {
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
            html += "<th><div class='normal'>Fecha</div></th>";
            html += "<th><div class='grande2'>Cobrador</div></th>";
            html += "<th><div class='medio'>Cobrado Bs</div></th>";
            html += "</thead><tbody >";
            var listaUsuario = window.parent.listaUsuario;
            var total = 0;
            for (var i = 0; i < lista.length; i++) {
                var monto = parseFloat(lista[i].monto);
                var id = lista[i].cobradoPor;
                total += monto;
                html += "<tr >";
                html += "<td><div class='normal'>" + lista[i].fecha + "</div></td>";
                html += "<td><div class='grande2'>" + listaUsuario["u" + id].nombre + "</div></td>";
                html += "<td><div class='medio derecha'>" + format(monto) + "</div></td>";
                html += "</tr>";

            }
            html += "</tbody>";

            html += "<tfoot>";
            html += "<tr >";
            html += "<td><div class='normal'></div></td>";
            html += "<td><div class='grande2 derecha'>TOTAL</div></td>";
            html += "<td><div class='medio derecha'>" + format(total) + "</div></td>";
            html += "</tr>";
            html += "</tfoot></table>";
            $("#tblventas").html(html);
            $("#tblventas").igualartabla();
            var tamanofiltro = $("#filtrosMenu").outerHeight();
            var tamanoHead = tamanopantalla - $("#tblventas thead").outerHeight() - tamanofiltro;
            $("#tblventas tbody").css("height", tamanoHead);
        }
    });
}
function reporteCliente() {
    var de = $("input[name=de]").val();
    var hasta = $("input[name=hasta]").val();
    var cliente = $("input[name=cliente]").data("cod");
    $("h1").text("Reporte de Cobranza Por Cliente");
    $("#fechabox").visible();
    $("#filtrosMenu > div").css("width", 762);
    $("#empleadoDIV").ocultar();
    $("#clienteDIV").visible();
    $("#detalladoFiltro").ocultar();
    estado = "Cliente";
    cargando(true);
    $.get(url, {proceso: 'reporteCliente', de: de, hasta: hasta, cliente: cliente}, function (response) {
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
            html += "<th><div class='normal'>Fecha</div></th>";
            html += "<th><div class='grande2'>Cliente</div></th>";
            html += "<th><div class='medio'>Cobrado Bs</div></th>";
            html += "</thead><tbody >";
            var listaCliente = window.parent.listaCliente;
            var total = 0;
            for (var i = 0; i < lista.length; i++) {
                var monto = parseFloat(lista[i].monto);
                var id = lista[i].cliente_id;
                total += monto;
                html += "<tr >";
                html += "<td><div class='normal'>" + lista[i].fecha + "</div></td>";
                html += "<td><div class='grande2'>" + listaCliente["c" + id].nombre + "</div></td>";
                html += "<td><div class='medio derecha'>" + format(monto) + "</div></td>";
                html += "</tr>";

            }
            html += "</tbody>";

            html += "<tfoot>";
            html += "<tr >";
            html += "<td><div class='normal'></div></td>";
            html += "<td><div class='grande2 derecha'>TOTAL</div></td>";
            html += "<td><div class='medio derecha'>" + format(total) + "</div></td>";
            html += "</tr>";
            html += "</tfoot></table>";
            $("#tblventas").html(html);
            $("#tblventas").igualartabla();
            var tamanofiltro = $("#filtrosMenu").outerHeight();
            var tamanoHead = tamanopantalla - $("#tblventas thead").outerHeight() - tamanofiltro;
            $("#tblventas tbody").css("height", tamanoHead);
        }
    });
}
function reporteDetallado() {
    var de = $("input[name=de]").val();
    var hasta = $("input[name=hasta]").val();
    estado = "Detalle";
    $("#empleadoDIV").visible();
    $("#clienteDIV").ocultar();
    $("#fechabox").visible();
    $("#detalladoFiltro").visible();
    $("#filtrosMenu > div").css("width", 960);
    $("h1").text("Reporte de Cobranza Detallada");
    cargando(true);
    $.get(url, {proceso: 'reporteDetallado', de: de, hasta: hasta}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error, "error");
        } else {
            var lista = json.result;
            var html = "<table class='table'>";
            html += "<thead class='thead-light'>";
            html += "<th><div style='width:90px'>Fecha</div></th>";
            html += "<th><div class='normal'>Sucursal</div></th>";
            html += "<th><div style='width:90px'>Doc. de Pago</div></th>";
            html += "<th><div style='width:90px'>Doc. de Venta</div></th>";
            html += "<th><div class='grande'>Cliente</div></th>";
            html += "<th><div class='medio'>Cobrador</div></th>";
            html += "<th><div class='normal'>Cobrado Bs</div></th>";
            html += "</thead><tbody style='height:300px'>";
            var lista = json.result;
            var listaUsuario = window.parent.listaUsuario;
            var listaCliente = window.parent.listaCliente;
            for (var i = 0; i < lista.length; i++) {
                var cobrador = listaUsuario["u" + lista[i].cobradoPor];
                var cliente = listaCliente["c" + lista[i].cliente_id];
                html += "<tr data-sucursal='" + lista[i].sucursal_id + "' data-usuario='" + lista[i].cobradoPor + "' >";
                html += "<td><div  style='width:90px'>" + lista[i].fecha.substring(0, 10) + "</div></td>";
                html += "<td><div class='normal'>" + lista[i].sucursal + "</div></td>";
                html += "<td><div class='subrayar' style='width:90px' onclick=\"redireccionar('Cobranza'," + lista[i].id_cobranza + ")\">" + lista[i].nroDocumento + "</div></td>";
                html += "<td><div class='subrayar' style='width:90px' onclick=\"redireccionar('Venta'," + lista[i].id_venta + ")\">" + lista[i].nroFactura + "</div></td>";
                html += "<td><div class='grande'>" + cliente.nombre + "</div></td>";
                html += "<td><div class='medio'>" + cobrador.nombre + "</div></td>";
                html += "<td><div class='normal derecha'>" + format(lista[i].monto) + "</div></td>";
                html += "</tr>";
            }
            html += "<tfoot><tr>";
            html += "<td><div  style='width:90px'></div></td>";
            html += "<td><div class='normal'></div></td>";
            html += "<td><div style='width:90px'></div></td>";
            html += "<td><div style='width:90px'></div></td>";
            html += "<td><div class='grande'></div></td>";
            html += "<td><div class='medio'>TOTAL</div></td>";
            html += "<td><div class='normal derecha'></div></td>";

            html += "</tr></tfoot>";
            html += "</table>";
            $("#tblventas").html(html);
            $("#tblventas").igualartabla();
            var tamanofiltro = $("#filtrosMenu").outerHeight();
            var tamanoHead = tamanopantalla - $("#tblventas thead").outerHeight() - tamanofiltro;
            $("#tblventas tbody").css("height", tamanoHead);
            filtroDetallado('');
        }
    });
}
function filtroDetallado(e) {
    if (e === "" || e.keyCode === 13) {
        if (estado !== "Detalle") {
            return;
        }
        var empleado = $("input[name=empleado]").data("cod") + "";
        var sucursal = $("input[name=sucursal]").data("cod") + "";
        var buscador = ($("input[name=buscador]").val() + "").toUpperCase();
        $("#tblventas tbody tr").addClass("ocultar");
        var tr = $("#tblventas tbody tr");
        for (var i = 0; i < tr.length; i++) {
            var item = $(tr[i]);
            var sucu = item.data("sucursal") + "";
            var usu = item.data("usuario") + "";
            var ci = (item.find("div:eq(3)").html() + "").toUpperCase();
            var nombre = (item.find("div:eq(4)").html() + "").toUpperCase();
            if ((ci.indexOf(buscador) >= 0 || nombre.indexOf(buscador) >= 0)
                    && (sucursal === "0" || sucursal === sucu)
                    && (empleado === "0" || empleado === usu)
                    ) {
                item.removeClass("ocultar");
            }
        }
        calcularTotalDetallado();

    }
}
function calcularTotalDetallado() {
    var tr = $("#tblventas tbody tr:not(.ocultar)");
    var totalCobranza = 0;
    for (var i = 0; i < tr.length; i++) {
        var cobranza = parseFloat($(tr[i]).find("div:eq(6)").html().replace(/\./g, '').replace(/\,/g, '.'));
        totalCobranza += cobranza;
    }
    var tr = $("#tblventas tfoot tr");
    $(tr[0]).find("div:eq(6)").html(format(totalCobranza));
}


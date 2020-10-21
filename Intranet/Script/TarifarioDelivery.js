var url = '../Controlador/TarifarioDelivery_Controlador.php';
var contador = 0;
var listaTarifa = {};
var id_tarifa = 0;
var posicion = 0;
var tamanopantalla = $(window).height() - 298;
var tipoTarifa = "pedido";
$(document).ready(function () {
    $("#popDelivery .modal-body").css("max-height", tamanopantalla);
    $("#tbldelivery tbody").css("height", tamanopantalla);
    $(window).resize(function () {
        var tamanopantalla = $(window).height() - 312;
        $("#popDelivery .modal-body").css("max-height", tamanopantalla);
        $("#tbldelivery tbody").css("height", tamanopantalla);
    });
    var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal === null) {
        window.parent.cerrarSession();
        return;
    }
    usuarioLocal = $.parseJSON(usuarioLocal);
    cargando(true);
    $.get(url, {proceso: "ciudades"}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error, "error");
        } else {
            var ciudad = json.result.ciudad;
            var tipo1 = json.result.tipo1;
            var tipo2 = json.result.tipo2;
            $("#boxtipo").html(tipo1);
            $("#boxtipo2").html(tipo2);
            var ciudapoption = "<option value='' >-- Ciudad --</option>";
            for (var i = 0 in ciudad) {
                if ((usuarioLocal.ADM_ciudad_id + "") === (ciudad[i].id_ciudad + "")) {
                    ciudapoption += "<option value='" + ciudad[i].id_ciudad + "' selected>" + ciudad[i].nombre + "</option>";
                } else {
                    ciudapoption += "<option value='" + ciudad[i].id_ciudad + "' >" + ciudad[i].nombre + "</option>";
                }
            }
            $("#ciudadb").html(ciudapoption);
            $("#ciudad").html(ciudapoption);
            buscar("", 1);
        }
    });

});
function buscar(e, tipo) {
    if (!(e === "" || e.keyCode === 13)) {
        return;
    }
    if (tipo === 1) {
        contador = 0;
        $("#tbldelivery tbody").html("");
        $("#btncargarMas").visible();
    }
    var estado = $("#estado option:selected").val();
    var ciudad = $("#ciudadb option:selected").val();
    var tipo = tipoTarifa;
    if ($("#tipo1").length > 0) {
        tipo = $("#tipo1 option:selected").val();
    }
    cargando(true);
    $.get(url, {proceso: "buscarDelivery", ciudad_id: ciudad, estado: estado, tipoTarifa: tipo
        , contador: contador}, function (response) {
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
            for (var i = 0; i < lista.length; i++) {
                listaTarifa[lista[i].id_tarifarioAPP] = lista[i];
                contador++;
                html += "<tr data-id='" + lista[i].id_tarifarioAPP + "' onclick='modificar(1)'>";
                html += "<td><div class='grande'>" + lista[i].nombre + "</div></td>";
                html += "<td><div class='pequeno'>" + lista[i].de + "</div></td>";
                html += "<td><div class='pequeno'>" + lista[i].hasta + "</div></td>";
                html += "<td><div class='pequeno'>" + format(lista[i].precio) + "</div></td>";
                html += "<td><div class='normal'>" + lista[i].estado + "</div></td>";
                html += "</tr>";
            }
            $("#tbldelivery tbody").append(html);
            $("#tbldelivery").igualartabla();
            $("#maxcant").text(limite);
            $("#actualcant").text(contador);
            if (contador >= limite) {
                $("#btncargarMas").ocultar();
            } else {
                $("#btncargarMas").visible(1);
            }
        }
    });
}
function nuevo() {
    $("#formDelivery input").val("");
    $("#btnmodificar").ocultar();
    id_tarifa = 0;
    $("#popDelivery h5").text("Nueva Tarifa");
    $("#errorPop").html("");
    $("#popDelivery input").removeClass("rojoClarito");
    $('#tbldelivery tr').removeClass("Tuplaseleccionada");
    $('#popDelivery').modal('show');
}
function modificar(tipo) {
    if (tipo === 1) {
        $("#btnmodificar").visible();
    } else {
        var tupla = $("tr.Tuplaseleccionada");
        if (tupla.length === 0) {
            alertaRapida("No ha seleccionado el proveedor que quiere modificar.");
            return;
        }
        $("#errorPop").html("");
        $("#popDelivery input").removeClass("rojoClarito");
        $("#formDelivery input").val("");
        $('#popDelivery').modal('show');
        id_tarifa = $(tupla[0]).data("id");
        var item = listaTarifa[id_tarifa];

        $("input[name=nombre]").val(item.nombre);
        $("input[name=de]").val(item.de);
        $("input[name=hasta]").val(item.hasta);
        $("input[name=precio]").val(item.precio);
        if ($("#tipo2").length > 0) {
            $("#tipo2 option[value='" + item.tipo + "']").prop("selected", true);
        }
        $("#tpestado option[value='" + item.estado + "']").prop("selected", true);
        $("#ciudad option[value='" + item.ciudad_id + "']").prop("selected", true);
        $("#tipo option[value='" + item.tipo + "']").prop("selected", true);
        $("#popDelivery h5").text("Modificando Tarifa");
        $("#errorPop").html("");
    }
}
function registrar() {
    var json = variables("#formDelivery");
    json.proceso = 'registrarTarifa';
    json.id_tarifa = id_tarifa;
    var tipo = tipoTarifa;
    if ($("#tipo2").length > 0) {
        tipo = $("#tipo2 option:selected").val();
    }
    json.tipoTarifa = tipo;

    if (json.ciudad === "") {
        $("#errorPop").html("No ha seleccionado la ciudad.");
        $("#ciudad").addClass("rojoClarito");
        return;
    } else {
        $("#ciudad").removeClass("rojoClarito");
        $("#errorPop").html("");
    }
    if (json.nombre.length === 0) {
        $("#errorPop").html("No se ha ingresado la descripcion.");
        $("input[name=nombre]").addClass("rojoClarito");
        return;
    } else {
        $("input[name=nombre]").removeClass("rojoClarito");
        $("#errorPop").html("");
    }

    if (json.de.length === 0) {
        $("#errorPop").html("No se ha ingresado 'De Km'.");
        $("input[name=de]").addClass("rojoClarito");
        return;
    } else {
        $("input[name=de]").removeClass("rojoClarito");
        $("#errorPop").html("");
    }
    if (json.hasta.length === 0) {
        $("#errorPop").html("No se ha ingresado 'Hasta Km'.");
        $("input[name=hasta]").addClass("rojoClarito");
        return;
    } else {
        $("input[name=hasta]").removeClass("rojoClarito");
        $("#errorPop").html("");
    }
    if (json.precio.length === 0) {
        $("#errorPop").html("No se ha ingresado precio.");
        $("input[name=precio]").addClass("rojoClarito");
        return;
    } else {
        $("input[name=precio]").removeClass("rojoClarito");
        $("#errorPop").html("");
    }
    var de = parseFloat(json.de);
    var hasta = parseFloat(json.hasta);
    var precio = parseFloat(json.precio);
    if (de < 0) {
        $("#errorPop").html("De Km no puede ser negativo.");
        $("input[name=de]").addClass("rojoClarito");
        return;
    } else {
        $("input[name=de]").removeClass("rojoClarito");
        $("#errorPop").html("");
    }
    if (hasta < 0) {
        $("#errorPop").html("Hasta Km no puede ser negativo.");
        $("input[name=hasta]").addClass("rojoClarito");
        return;
    } else {
        $("input[name=hasta]").removeClass("rojoClarito");
        $("#errorPop").html("");
    }
    if (precio < 0) {
        $("#errorPop").html("Precio no puede ser negativo.");
        $("input[name=precio]").addClass("rojoClarito");
        return;
    } else {
        $("input[name=precio]").removeClass("rojoClarito");
        $("#errorPop").html("");
    }
    if (de > hasta) {
        $("#errorPop").html("De Km no puede ser mayor a A Km");
        $("input[name=de]").addClass("rojoClarito");
        $("input[name=hasta]").addClass("rojoClarito");
        return;
    } else {
        $("input[name=de]").removeClass("rojoClarito");
        $("input[name=hasta]").removeClass("rojoClarito");
        $("#errorPop").html("");
    }
    for (var item in listaTarifa) {
        var obj = listaTarifa[item];
        if (id_tarifa != obj.id_tarifarioAPP) {
            var de2 = parseFloat(obj.de);
            var hasta2 = parseFloat(obj.hasta);
            if ((de >= de2 && de <= hasta2) || (hasta >= de2 && hasta <= hasta2) ||
                    (de2 >= de && de2 <= hasta) || (hasta2 >= de && hasta2 <= hasta)) {
                $("#errorPop").html("Estos nuevos rango (De y Hasta) se interceptan con otro tarifario");
                return;
            }
        }
    }

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
            if (id_tarifa === 0) {
                alertaRapida("El Delivery se registro correctamente.");
            } else {
                alertaRapida("El Delivery se actualizo correctamente.");
            }
            $("#btnmodificar").ocultar();
            id_tarifa = 0;
            buscar("", 1);
            $('#popDelivery').modal('hide');
        }
    });
}
function imprimir() {
    buscar("", 1);
    var contenido = $("#contenedorProveedor").html();
    var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal === null) {
        window.parent.cerrarSession();
        return;
    }
    usuarioLocal = $.parseJSON(usuarioLocal);
    var filtro = "<div class='row' id='filtroReporte'>";
    filtro += "<div class='col-12'><span class='negrilla'>FILTROS</div>";
    var buscador = $("input[name=buscar]").val();
    var estado = $("#tpestadoB option:selected").text() + "";
    filtro += "<div class='col-4'><span class='negrilla'>Estado: </span>" + estado + "</div>";
    if (buscar !== "") {
        filtro += "<div class='col-4'><span class='negrilla'>Buscador: </span>" + buscador + "</div>";
    }
    filtro += "</div>";
    imprimirReporte({contenido: contenido, sucursal_id: usuarioLocal.sucursal_id, titulo: "Lista de Proveedores", datosHead: filtro, encabezadoThead: true});
}
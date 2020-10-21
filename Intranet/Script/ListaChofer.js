var url = '../Controlador/ListaChofer_Controlador.php';
var contador = 0;
var listaDelivery = {};
var id_delivery = 0;
var posicion = 0;
var tamanopantalla = $(window).height() - 298;
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
            debugger
            var ciudad = json.result.ciudad;
            var xpress = json.result.xpress;
            if (xpress) {
                $("#boxCuenta").append(xpress);
            }
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
    var buscador = $("input[name=buscar]").val();
    var ciudad = $("#ciudadb option:selected").val();
    cargando(true);
    $.get(url, {proceso: "buscarDelivery", ciudad_id: ciudad, estado: estado
        , buscador: buscador, contador: contador}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error, "error");
        } else {
            var listaUsuario = window.parent.listaUsuario;
            var lista = json.result.data;
            var limite = parseInt(json.result.limite);
            var html = "";
            for (var i = 0; i < lista.length; i++) {
                listaDelivery[lista[i].id_delivery] = lista[i];
                contador++;
                var usuario = listaUsuario["u" + lista[i].registradoPor];
                html += "<tr data-id='" + lista[i].id_delivery + "' onclick='modificar(1)'>";
                html += "<td><div class='pequeno'>" + lista[i].ci + "</div></td>";
                html += "<td><div class='medio'>" + lista[i].nombre + "</div></td>";
                html += "<td><div class='pequeno'>" + lista[i].telefono + "</div></td>";
                html += "<td><div class='medio'>" + lista[i].direccion + "</div></td>";
                html += "<td><div class='pequeno'>" + lista[i].limitePedidos + "</div></td>";
                html += "<td><div class='pequeno'>" + lista[i].estado + "</div></td>";
                html += "<td><div class='pequeno'>" + lista[i].registrado + "</div></td>";
                html += "<td><div class='medio'>" + usuario.nombre + "</div></td>";
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
    id_delivery = 0;
    $("#popDelivery h5").text("Nueva Chofer");
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
        id_delivery = $(tupla[0]).data("id");
        var item = listaDelivery[id_delivery];

        $("input[name=ci]").val(item.ci);
        $("input[name=nombre]").val(item.nombre);
        $("input[name=cuenta]").val(item.cuenta);
        $("input[name=contra]").val(item.contrasena);
        $("input[name=direccion]").val(item.direccion);
        $("input[name=telefono]").val(item.telefono);
        $("input[name=limite]").val(item.limitePedidos);
        if ($("input[name=express]").length > 0) {
            $("input[name=express]").val(item.limiteCurrier);
        }
        $("input[name=contra]").val("");
        $("#tpestado option[value='" + item.estado + "']").prop("selected", true);
        $("#ciudad option[value='" + item.ciudad_id + "']").prop("selected", true);
        $("#tipo option[value='" + item.tipo + "']").prop("selected", true);
        $("#popDelivery h5").text("Modificando Datos del Chofer");
        $("#errorPop").html("");
    }
}
function registrar() {
    var json = variables("#formDelivery");
    json.proceso = 'registrarProvedor';
    json.id_delivery = id_delivery;
    if (json.ciudad === "") {
        $("#errorPop").html("No ha seleccionado la ciudad.");
        $("#ciudad").addClass("rojoClarito");
        return;
    } else {
        $("#ciudad").removeClass("rojoClarito");
        $("#errorPop").html("");
    }
    if (json.nombre.length === 0) {
        $("#errorPop").html("No se ha ingresado el nombre del delivery.");
        $("input[name=nombre]").addClass("rojoClarito");
        return;
    } else {
        $("input[name=nombre]").removeClass("rojoClarito");
        $("#errorPop").html("");
    }
    if (json.telefono.length === 0) {
        $("#errorPop").html("No se ha ingresado el teléfono del delivery.");
        $("input[name=telefono]").addClass("rojoClarito");
        return;
    } else {
        $("input[name=telefono]").removeClass("rojoClarito");
        $("#errorPop").html("");
    }
    if (!(json.cuenta.length >= 5 && json.cuenta.length <= 10)) {
        $("#errorPop").html("La cuenta no puede ser menor a 5 ni mayor a 10 caracteres.");
        $("input[name=cuenta]").addClass("rojoClarito");
        return;
    } else {
        if (!validar("texto y entero", json.cuenta)) {
            $("#errorPop").html("la cuenta solo puede tener Letra y numeros, no otro tipo de caracteres.");
            $("input[name=cuenta]").addClass("rojoClarito");
            return;
        } else {
            $("input[name=cuenta]").removeClass("rojoClarito");
            $("#errorPop").html("");
            var validarContra = !(json.contra.length >= 5 && json.contra.length <= 10);
            if (id_delivery !== 0) {
                validarContra = !(json.contra.length === 0 || (json.contra.length >= 5 && json.contra.length <= 10));
            }
            if (validarContra) {
                $("#errorPop").html("La contraseña no puede ser menor a 5 ni mayor a 10 caracteres.");
                $("input[name=contra]").addClass("rojoClarito");
                return;
            } else {
                if (!validar("texto y entero", json.contra)) {
                    $("#errorPop").html("la contraseña solo puede tener Letra y numeros, no otro tipo de caracteres.");
                    $("input[name=contra]").addClass("rojoClarito");
                    return;
                } else {
                    $("input[name=contra]").removeClass("rojoClarito");
                    $("#errorPop").html("");
                }
            }

        }
    }
    if (json.limite.length === 0) {
        $("#errorPop").html("No se ha ingresado el limite de pedido en curso del delivery.");
        $("input[name=limite]").addClass("rojoClarito");
        return;
    } else {
        $("input[name=limite]").removeClass("rojoClarito");
        $("#errorPop").html("");
    }
    if ($("input[name=express]").length > 0) {
        if (json.express.length === 0) {
            $("#errorPop").html("No se ha ingresado el limite de pedido express del delivery.");
            $("input[name=express]").addClass("rojoClarito");
            return;
        } else {
            $("input[name=express]").removeClass("rojoClarito");
            $("#errorPop").html("");
        }
    }else{
        json.express=json.limite;
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
            if (id_delivery === 0) {
                alertaRapida("El Delivery se registro correctamente.");
            } else {
                alertaRapida("El Delivery se actualizo correctamente.");
            }
            $("#btnmodificar").ocultar();
            id_delivery = 0;
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
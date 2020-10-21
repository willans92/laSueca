var url = '../Controlador/ListaUsuario_Controlador.php';
var contador = 0;
var posicion = 0;
var tamanopantalla = $(window).height() - 265;
var listaUsuario;
var usuario_id = "0";

$(document).ready(function () {
    $(".cuenta").ocultar();
    $(".fecha").datepicker();
    $(".fecha").val(fechaActual());
    var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal === null) {
        window.parent.cerrarSession();
        return;
    }
    usuarioLocal = $.parseJSON(usuarioLocal);
    $("#tblusuario tbody").css("height", tamanopantalla);
    $("#popUsuario .modal-body").css("max-height", tamanopantalla + 45);
    $(window).resize(function () {
        var tamanopantalla = $(window).height() - 265;
        $("#tblusuario tbody").css("height", tamanopantalla);
    $("#popUsuario .modal-body").css("max-height", tamanopantalla + 45);
    });

    var listaSucursal = window.parent.listaSucursalRapida;
    comboBox({identificador: "#sucursal", valueDefault: usuarioLocal.sucursal_id, datos: listaSucursal, codigo: "id_sucursal", texto: "nombre"});
    comboBox({identificador: "#slsucursal", valueDefault: usuarioLocal.sucursal_id, datos: listaSucursal, codigo: "id_sucursal", texto: "nombre", todos: true, callback: () => {
            buscar('', 1)
        }});

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
            var ciudad = json.result;
            var listasucursal = window.parent.listaSucursalRapida;
            var sucursal = listasucursal["s" + usuarioLocal.sucursal_id];
            var ciudapoption = "";
            for (var i = 0 in ciudad) {
                if ((sucursal.ciudad_id + "") === (ciudad[i].id_ciudad + "")) {
                    ciudapoption += "<option value='" + ciudad[i].id_ciudad + "' selected>" + ciudad[i].nombre + "</option>";
                } else {
                    ciudapoption += "<option value='" + ciudad[i].id_ciudad + "' >" + ciudad[i].nombre + "</option>";
                }
            }
            $("#ciudad").html(ciudapoption);
            if (usuarioLocal.empresaADM === "ADM") {
                $("#ciudadaBox").css("display", "flex");
            }
            window.parent.Version();
        }
    });


});
function actualizar() {
    var datos = window.parent.listaUsuario;
    listaUsuario = Object.keys(datos).map((key) => datos[key]);
    buscar('', 1);
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


    var buscador = ($("input[name=buscar]").val() + "").toUpperCase();
    var sucursal = $("#slsucursal").data("cod") + "";
    var estado = $("#slestado option:selected").val();
    var listaSucursal = window.parent.listaSucursalRapida;
    var html = "";
    for (var i = contador; i < listaUsuario.length; i++) {
        if (inicia === 0) {
            break;
        }
        contador++;
        var usuario = listaUsuario[i];
        var sucursalObj = listaSucursal["s" + usuario.sucursal_id];
        var ci = (usuario.ci + "").toUpperCase();
        var nombre = (usuario.nombre + "").toUpperCase();
        var id_usuario = usuario.id_usuario;
        var validarEstado = usuario.estado.toUpperCase() === estado.toUpperCase();
        var validarSucursal = usuario.sucursal_id === sucursal || sucursal === "0";
        var validarTexto = (nombre + "").toUpperCase().indexOf(buscador) >= 0 || ci.indexOf(buscador) >= 0;
        if (validarEstado && validarTexto && validarSucursal) {
            posicion++
            html += "<tr  onclick=modificar(1) data-id='" + id_usuario + "'>";
            html += "<td><div class='pequeno'>" + usuario.ci + "</div></td>";
            html += "<td><div class='medio'>" + usuario.nombre + "</div></td>";
            html += "<td><div class='normal'>" + usuario.telefono + "</div></td>";
            html += "<td><div class='medio'>" + sucursalObj.nombre + "</div></td>";
            html += "<td><div class='pequeno'>" + usuario.fecha_contratado + "</div></td>";
            html += "<td><div class='medio'>" + usuario.direccion + "</div></td>";
            html += "</tr>";
            inicia--;

        }

    }
    if (tipo === 1) {
        $("#tblusuario tbody").html(html);
    } else {
        if (html.length > 0) {
            $("#tblusuario  tbody").append(html);
        }
    }
    $("#tblusuario").igualartabla();
    $("#actualcant").text(posicion);
    var lista = listaUsuario.filter(usuario => {
        var ci = (usuario.ci + "").toUpperCase();
        var nombre = (usuario.nombre + "").toUpperCase();
        var validarEstado = usuario.estado === estado;
        var validarSucursal = usuario.sucursal_id === sucursal || sucursal === "0";
        var validarTexto = (nombre + "").toUpperCase().indexOf(buscador) >= 0 || ci.indexOf(buscador) >= 0;
        if (validarEstado && validarTexto && validarSucursal) {
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
    $("#tblusuario").igualartabla();
}
function usuarioPop(tipo) {
    if (tipo === 1) {
        $("#popUsuario .modal-title").text("Nuevo Usuario");
        $('table tr').removeClass("Tuplaseleccionada");
        $('#btnmodificar').ocultar();
        $("#errorPop").html("");
        $("#popUsuario input").removeClass("rojoClarito");
        $("#popUsuario").limpiarFormulario();
        var usuarioLocal = localStorage.getItem("usuario");
        if (usuarioLocal === null) {
            window.parent.cerrarSession();
            return;
        }
        usuarioLocal = $.parseJSON(usuarioLocal);
        var listaSucursal = window.parent.listaSucursalRapida;
        var sucursal = listaSucursal["s" + usuarioLocal.sucursal_id];
        $("#sucursal").data("cod", usuarioLocal.sucursal_id);
        $("#sucursal").val(sucursal.nombre);
        usuario_id="0";
    }
}
function registrar() {
    var json = variables($("#popUsuario"));
    json.proceso = "registrar";
    json.sucursal = $("#sucursal").data("cod");
    if (json.nombre.length === 0) {
        $("#errorPop").html("No se ha ingresado el nombre del usuario.");
        $("input[name=nombre]").addClass("rojoClarito");
        return;
    } else {
        $("input[name=nombre]").removeClass("rojoClarito");
    }
    if (!validar("texto y entero", json.nombre)) {
        $("#errorPop").html("El nombre solo puede tener Letra y numeros, no otro tipo de caracteres.");
        $("input[name=nombre]").addClass("rojoClarito");
        return;
    } else {
        $("input[name=nombre]").removeClass("rojoClarito");
    }
    if (json.sucursal === "0") {
        $("#errorPop").html("Debe seleccionar una sucursal.");
        $("#sucursal").addClass("rojoClarito");
        return;
    } else {
        $("#sucursal").removeClass("rojoClarito");
    }
    $("#errorPop").html("");

    if (json.tieneCuenta === "si") {
        if (!(json.cuenta.length >= 5 && json.cuenta.length <= 16)) {
            $("#errorPop").html("La cuenta no puede ser menor a 5 ni mayor a 16 caracteres.");
            return;
        } else {
            if (!validar("texto y entero", json.cuenta)) {
                $("#errorPop").html("la cuenta solo puede tener Letra y numeros, no otro tipo de caracteres.");
                return;
            } else {
                $("#errorPop").html("");
                var datos = window.parent.listaUsuario;
                var usuario = datos["u" + usuario_id];
                if (usuario_id !== "0") {
                    if (json.contrasena.length === 0 && usuario.cuenta !== json.cuenta) {
                        $("#errorPop").html("La contraseña no puede estar vacio.");
                        return;
                    } else {
                        if (json.contrasena.length > 0) {
                            if (!(json.contrasena.length >= 5 && json.contrasena.length <= 16)) {
                                $("#errorPop").html("La contraseña no puede ser menor a 5 ni mayor a 16 caracteres.");
                            } else {
                                if (!validar("texto y entero", json.contrasena)) {
                                    $("#errorPop").html("la contraseña solo puede tener Letra y numeros, no otro tipo de caracteres.");
                                    return;
                                } else {
                                    $("#errorPop").html("");
                                }
                            }
                        } else {

                        }
                    }
                } else {
                    if (!(json.contrasena.length >= 5 && json.contrasena.length <= 16)) {
                        $("#errorPop").html("La contraseña no puede ser menor a 5 ni mayor a 16 caracteres.");
                    } else {
                        if (!validar("texto y entero", json.contrasena)) {
                            $("#errorPop").html("la contraseña solo puede tener Letra y numeros, no otro tipo de caracteres.");
                            return;
                        } else {
                            $("#errorPop").html("");
                        }
                    }
                }

            }
        }
    } else {
        json.cuenta = "";
        json.contrasena = "";
    }

    json.usuario_id = usuario_id;
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
            window.parent.Version();
            $("#btnmodificar").ocultar();
            $("#popUsuario .cerrar").click();
            $("#popUsuario").limpiarFormulario();
        }
    });
}
function modificar(tipo) {
    if (tipo === 1) {
        $("#btnmodificar").visible();
    } else {
        var usuarioLocal = localStorage.getItem("usuario");
        if (usuarioLocal === null) {
            window.parent.cerrarSession();
            return;
        }
        usuarioLocal = $.parseJSON(usuarioLocal);
        
        var tupla = $("tr.Tuplaseleccionada");
        $("#errorPop").html("");
        $("#popUsuario input").removeClass("rojoClarito");
        usuario_id = $(tupla[0]).data("id");
        var datos = window.parent.listaUsuario;
        var usuario = datos["u" + usuario_id];
        $("#popUsuario .modal-title").text("Modificando Usuario");
        $("input[name=ci]").val(usuario.ci);
        $("input[name=nombre]").val(usuario.nombre);
        $("input[name=telefono]").val(usuario.telefono);
        $("input[name=direccion]").val(usuario.direccion);
        if (usuario.cuenta !== "") {
            $("input[name=cuenta]").val(usuario.cuenta);
            $("input[name=contrasena]").val("");
            $("#tieneCuenta option[value='si']").prop("selected", true);
            $(".cuenta").visible();
        } else {
            $("#tieneCuenta option[value='no']").prop("selected", true);
            $("input[name=cuenta]").val("");
            $("input[name=contrasena]").val("");
            $(".cuenta").ocultar();
        }
        $("input[name=fecha_contratado]").val(usuario.fecha_contratado);
        $("#estado option[value='" + usuario.estado + "']").prop("selected", true);


        var listasucursal = window.parent.listaSucursalRapida;
        var sucursal = listasucursal["s" + usuario.sucursal_id];
        $("#sucursal").data("cod", sucursal.sucursal_id);
        $("#sucursal").val(sucursal.nombre);
        
        if (usuarioLocal.empresaADM === "ADM") {
            $("#ciudad option[value='" + usuario.ciudad_id + "']").prop("selected", true);
        }
    }
}
function tieneCuenta() {
    var estado = $("#tieneCuenta option:selected").val();
    if (estado === "si") {
        $(".cuenta").visible();
    } else {
        $(".cuenta").ocultar();
    }
}
function imprimir() {
    buscar("", 1);
    var contenido = $("#contenedorUsuarop").html();
    var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal === null) {
        window.parent.cerrarSession();
        return;
    }
    usuarioLocal = $.parseJSON(usuarioLocal);
    var filtro = "<div class='row' id='filtroReporte'>";
    filtro += "<div class='col-12'><span class='negrilla'>FILTROS</div>";
    var buscador = ($("input[name=buscar]").val() + "").toUpperCase();
    var sucursal = $("#slsucursal").val() + "";
    var estado = $("#slestado option:selected").text() + "";
    if (buscador !== "") {
        filtro += "<div class='col-4'><span class='negrilla'>Buscador: </span>" + buscador + "</div>";
    }
    if (sucursal !== "") {
        filtro += "<div class='col-4'><span class='negrilla'>Sucursal: </span>" + sucursal + "</div>";
    }
    if (estado !== "") {
        filtro += "<div class='col-4'><span class='negrilla'>Estado: </span>" + estado + "</div>";
    }

    filtro += "</div>";
    imprimirReporte({contenido: contenido, sucursal_id: usuarioLocal.sucursal_id, titulo: "Estado de Cuenta Producto", datosHead: filtro, encabezadoThead: true});
}
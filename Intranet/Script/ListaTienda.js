var url = '../Controlador/ListaTienda_Controlador.php';
var contador = 0;
var posicion = 0;
var tamanopantalla = $(window).height() - 265;
var listaTienda;
var tienda_id = "0";
var cliente_id = "0";
$(document).ready(function () {
    $("input[name=fecha]").val(fechaActual());
    var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal === null) {
        window.parent.cerrarSession();
        return;
    }
    usuarioLocal = $.parseJSON(usuarioLocal);
    $("#tbltienda tbody").css("height", tamanopantalla);
    $("#popTienda .modal-body").css("max-height", tamanopantalla + 45);
    $(window).resize(function () {
        var tamanopantalla = $(window).height() - 265;
        $("#tbltienda tbody").css("height", tamanopantalla);
        $("#popTienda .modal-body").css("max-height", tamanopantalla + 45);
    });
    window.parent.Version();
});
function cargar() {
    cargando(true);
    $.get(url, {proceso: "buscarTienda"}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error, "error");
        } else {
            listaTienda = json.result;
            buscador("", 1);
        }
    });
}
function actualizar() {
    cargar();
}
function buscador(e, tipo) {
    if (!(e === "" || e.keyCode === 13)) {
        return;
    }
    var buscar = ($("input[name=buscar]").val() + "").trim().toUpperCase();
    var buscarCliente = ($("input[name=buscarCliente]").val() + "").trim().toUpperCase();
    var estado = $("#slestado option:selected").val();
    var inicia = 50;
    if (tipo === 1) {
        contador = 0;
        posicion = 0;
        $("#btncargarMas").visible();
    }
    var html = "";
    var listaCliente = window.parent.listaCliente;
    for (var i = contador; i < listaTienda.length; i++) {
        if (inicia === 0) {
            break;
        }
        contador++;
        var tienda = listaTienda[i];
        var cliente = listaCliente["c" + tienda.cliente_id];
        var validacionTxt = (tienda.nombre+"").toUpperCase().indexOf(buscar) >= 0;
        var validacionCliente = (cliente.nombre+"").toUpperCase().indexOf(buscarCliente) >= 0;
        var validacionEstado = tienda.estado === estado;
        if (validacionEstado && validacionCliente && validacionTxt) {
            posicion++;
            html += "<tr data-pos='" + i + "' onclick='modificar(1)'>";
            html += "<td><div class='medio'>" + tienda.registrado + "</div></td>";
            html += "<td><div class='grande'>" + tienda.nombre + "</div></td>";
            html += "<td><div class='grande'>" + cliente.nombre + "</div></td>";
            html += "<td><div class='normal'>" + tienda.estado + "</div></td>";
            html += "</tr>";
            inicia--;
        }
    }
    if (tipo === 1) {
        $("#tbltienda tbody").html(html);
    } else {
        if (html.length > 0) {
            $("#tbltienda  tbody").append(html);
        }
    }
    $("table").igualartabla();
    $("#actualcant").text(posicion);
    var lista = listaTienda.filter(tienda => {
        var cliente = listaCliente["c" + tienda.cliente_id];
       var validacionTxt = (tienda.nombre+"").toUpperCase().indexOf(buscar) >= 0;
        var validacionCliente = (cliente.nombre+"").toUpperCase().indexOf(buscarCliente) >= 0;
        var validacionEstado = tienda.estado === estado;
        if (validacionEstado && validacionCliente && validacionTxt) {
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
function tiendaPop(tipo) {
    if (tipo === 1) {
        $("input[name=codigoPadre]").prop("readonly",false);
        $("#popTienda .modal-title").text("Nueva Tienda");
        $('table tr').removeClass("Tuplaseleccionada");
        $('#btnmodificar').ocultar();
        $("#errorPop").html("");
        $("#popTienda input").removeClass("rojoClarito");
        $("#popTienda").limpiarFormulario();
        var usuarioLocal = localStorage.getItem("usuario");
        if (usuarioLocal === null) {
            window.parent.cerrarSession();
            return;
        }
        usuarioLocal = $.parseJSON(usuarioLocal);
        cliente_id = "0";
        tienda_id = "0";
        $("input[name=fecha]").val(fechaActual());
    }
}
function registrar() {
    var json = variables($("#popTienda"));
    json.proceso = "registrar";
    var foto = $("#foto").prop("src");
    json.logo = foto;
    json.codigoPadre = json.codigoPadre.trim()==""?0:json.codigoPadre.replace("00LS","");
    if(!validar("entero",json.codigoPadre)){//00LS4
        $("#errorPop").html("El codigo de tienda es incorrecto.");
        $("input[name=codigoPadre]").addClass("rojoClarito");
        return;
    } else {
        $("input[name=codigoPadre]").removeClass("rojoClarito");
    }
    
    if (json.nombre.length === 0) {
        $("#errorPop").html("No se ha ingresado el nombre de la tiendas.");
        $("input[name=nombre]").addClass("rojoClarito");
        return;
    } else {
        $("input[name=nombre]").removeClass("rojoClarito");
    }
    if (!(json.cuenta.length >= 5 && json.cuenta.length <= 16)) {
        $("input[name=cuenta]").addClass("rojoClarito");
        $("#errorPop").html("La cuenta no puede ser menor a 5 ni mayor a 16 caracteres.");
        return;
    } else {
        $("#errorPop").html("");
        $("input[name=cuenta]").removeClass("rojoClarito");
        if (!validar("texto y entero", json.cuenta)) {
            $("input[name=cuenta]").addClass("rojoClarito");
            $("#errorPop").html("la cuenta solo puede tener Letra y numeros, no otro tipo de caracteres.");
            return;
        } else {
            $("input[name=cuenta]").removeClass("rojoClarito");
            if (tienda_id !== "0") {
                if (json.contrasena.length > 0) {
                    if (!(json.contrasena.length >= 5 && json.contrasena.length <= 16)) {
                        $("input[name=contrasena]").addClass("rojoClarito");
                        $("#errorPop").html("La contraseña no puede ser menor a 5 ni mayor a 16 caracteres.");
                        return;
                    } else {
                        if (!validar("texto y entero", json.contrasena)) {
                            $("#errorPop").html("la contraseña solo puede tener Letra y numeros, no otro tipo de caracteres.");
                            $("input[name=contrasena]").addClass("rojoClarito");
                            return;
                        } else {
                            $("input[name=contrasena]").removeClass("rojoClarito");
                            $("#errorPop").html("");
                        }
                    }
                }
            } else {
                if (!(json.contrasena.length >= 5 && json.contrasena.length <= 16)) {
                    $("#errorPop").html("La contraseña no puede ser menor a 5 ni mayor a 16 caracteres.");
                    $("input[name=contrasena]").addClass("rojoClarito");
                    return;
                } else {
                    if (!validar("texto y entero", json.contrasena)) {
                        $("input[name=contrasena]").addClass("rojoClarito");
                        $("#errorPop").html("la contraseña solo puede tener Letra y numeros, no otro tipo de caracteres.");
                        return;
                    } else {
                        $("#errorPop").html("");
                        $("input[name=contrasena]").removeClass("rojoClarito");
                    }
                }
            }

        }
    }
    if (json.cliente.length === 0) {
        $("#errorPop").html("No se ha ingresado el nombre del cliente.");
        $("input[name=cliente]").addClass("rojoClarito");
        return;
    } else {
        $("input[name=cliente]").removeClass("rojoClarito");
    }
    json.tienda_id = tienda_id;
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
            window.parent.Version();
            $("#btnmodificar").ocultar();
            $("#popTienda .cerrar").click();
            $("#popTienda").limpiarFormulario();
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
        var listaCliente = window.parent.listaCliente;
        $("#errorPop").html("");
        $("#popTienda input").removeClass("rojoClarito");
        var posicion = $(tupla[0]).data("pos");
        var tienda = listaTienda[posicion];
        tienda_id = tienda.id_tienda;
        cliente_id = tienda.cliente_id;
        var cliente = listaCliente["c" + cliente_id];
        $("#popTienda .modal-title").text("Modificando Tienda");
        $("input[name=fecha]").val(tienda.registrado);
        $("input[name=codigoPadre]").val("00LS"+tienda.padre);
        $("input[name=codigoPadre]").prop("readonly",true);
        $("input[name=nombre]").val(tienda.nombre);
        $("#estado option[value='" + tienda.estado + "']").prop("selected", true);
        $("input[name=cuenta]").val(tienda.cuenta);
        $("input[name=contrasena]").val("");
        $("input[name=ci]").val(cliente.ci);
        $("input[name=cliente]").val(cliente.nombre);
        $("input[name=telefono]").val(cliente.telefono);
        $("input[name=direccion]").val(cliente.direccion);
        $("input[name=correo]").val(cliente.email);
    }
}
function imprimir() {
    buscador("", 1);
    var contenido = $("#contenedorUsuarop").html();
    var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal === null) {
        window.parent.cerrarSession();
        return;
    }
    usuarioLocal = $.parseJSON(usuarioLocal);
    var filtro = "<div class='row' id='filtroReporte'>";
    filtro += "<div class='col-12'><span class='negrilla'>FILTROS</div>";
    var busca = ($("input[name=buscar]").val() + "").toUpperCase();
    var buscarCliente = ($("input[name=buscarCliente]").val() + "").toUpperCase();
    var estado = $("#slestado option:selected").text() + "";
    if (busca !== "") {
        filtro += "<div class='col-4'><span class='negrilla'>Tienda: </span>" + busca + "</div>";
    }
    if (buscarCliente !== "") {
        filtro += "<div class='col-4'><span class='negrilla'>Cliente: </span>" + buscarCliente + "</div>";
    }
    if (estado !== "") {
        filtro += "<div class='col-4'><span class='negrilla'>Estado: </span>" + estado + "</div>";
    }

    filtro += "</div>";
    imprimirReporte({contenido: contenido, sucursal_id: usuarioLocal.sucursal_id, titulo: "Estado de Cuenta Producto", datosHead: filtro, encabezadoThead: true});
}
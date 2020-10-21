var url = '../Controlador/Sucursal_Controlador.php';
var contador = 0;
var listaSucursales = {};
var id_sucursal = 0;
var posicion = 0;
var listaCiudad = {};
var tamanopantalla = $(window).height() - 280;
var map;
var marker;
var lat = -17.782786;
var lon = -63.181530;
$(document).ready(function () {
    $("#tblprd tbody").css("height", tamanopantalla);
    $(window).resize(function () {
        var tamanopantalla = $(window).height() - 280;
        $("#tblprd tbody").css("height", tamanopantalla);
    });
    var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal === null) {
        window.parent.cerrarSession();
        return;
    }
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
            var ciudapoption = "";
            for (var i = 0 in ciudad) {
                listaCiudad[ciudad[i].id_ciudad] = ciudad[i];
                ciudapoption += "<option value='" + ciudad[i].id_ciudad + "' >" + ciudad[i].nombre + "</option>";
            }
            $("#ciudad").html(ciudapoption);
            cargar();
        }
    });
});
function cargar() {
    var estado = $("#tpestadoB option:selected").val();
    cargando(true);
    $.get(url, {proceso: "buscarSucursal", estado: estado}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error, "error");
        } else {
            listaSucursales = json.result;
            window.parent.listaSucursal = listaSucursales;
            var listaSucursalRapida = [];
            window.parent.sucursalOption = "";
            for (var i = 0 in listaSucursales) {
                if (listaSucursales[i]["estado"] === estado) {
                    listaSucursalRapida["s" + listaSucursales[i]["id_sucursal"]] = listaSucursales[i];
                }
                window.parent.sucursalOption += "<option value='" + listaSucursales[i]["id_sucursal"] + "' data-estado='" + listaSucursales[i].estado + "'>" + listaSucursales[i]["nombre"] + "</option>";
            }
            buscar("", 1);
            window.parent.buscarSucursal();
        }
    });
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
    var html = "";
    for (var i = contador; i < listaSucursales.length; i++) {
        if (inicia === 0) {
            break;
        }
        contador++;
        var sucursal = listaSucursales[i];
        var nit = sucursal.nit + "";
        var nombre = (sucursal.nombre + "").toUpperCase();
        if (nit.indexOf(buscador) >= 0 || nombre.indexOf(buscador) >= 0) {
            posicion++;
            html += "<tr data-id='" + sucursal.id_sucursal + "' data-estado='" + sucursal.estado + "' data-pos='" + i + "' onclick='modificar(1)'>";
            html += "<td><div class='chico'>" + sucursal.nit + "</div></td>";
            html += "<td><div class='medio'>" + sucursal.nombre + "</div></td>";
            html += "<td><div class='medio'>" + sucursal.direccion + "</div></td>";
            html += "<td><div class='normal'>" + sucursal.telefono + "</div></td>";
            html += "<td><div class='normal'>" + sucursal.correo + "</div></td>";
            html += "<td><div class='chico'>" + sucursal.documentoVenta + "</div></td>";
            html += "<td><div class='chico'>" + sucursal.estructuraDocumentoVenta + "</div></td>";
            html += "<td><div class='chico'>" + sucursal.app + "</div></td>";
            html += "<td><div class='chico'>" + sucursal.tipoAtencion + "</div></td>";
            html += "</tr>";

            inicia--;
        }

    }
    if (tipo === 1) {
        $("#tblprd tbody").html(html);
    } else {
        if (html.length > 0) {
            $("#tblprd  tbody").append(html);
        }
    }
    $("table").igualartabla();
    $("#actualcant").text(posicion);
    var lista = listaSucursales.filter(value => {
        var nit = value.nit + "";
        var nombre = (value.nombre + "").toUpperCase();
        if (nit.indexOf(buscador) >= 0 || nombre.indexOf(buscador) >= 0) {
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
    $("#formSucursal input").val("");
    $("#tipoHorario option:eq(0)").prop("selected", true);
    $("#btnmodificar").ocultar();
    $("#popSucursal h5").text("Nueva Sucursal");
    $('table tr').removeClass("Tuplaseleccionada");
    $("#logo").attr("src", "../Imagen/Iconos/earth190.svg");
    $("#logo").data("peque", "../Imagen/Iconos/earth190.svg");
    id_sucursal = 0;
    $('#popSucursal').modal('show');
    $("#popSucursal input").removeClass("rojoClarito");
    $("#errorPop").html("");
    $(".hora").val("00");
    lat = -17.782786;
    lon = -63.181530;
    cambioEstado();
}

function modificar(tipo) {
    if (tipo === 1) {
        $("#btnmodificar").visible();
    } else {
        var tupla = $("tr.Tuplaseleccionada");
        if (tupla.length === 0) {
            alertaRapida("No ha seleccionado la sucursal que quiere modificar.");
            return;
        }
        nuevo();
        id_sucursal = $(tupla[0]).data("id");
        var posicion = $(tupla[0]).data("pos");
        var item = listaSucursales[posicion];
        $("input[name=nit]").val(item.nit);
        $("input[name=nombre]").val(item.nombre);
        $("input[name=direccion]").val(item.direccion);
        $("input[name=telefono]").val(item.telefono);
        $("input[name=correo]").val(item.correo);
        $("#formDV option[value='" + item.documentoVenta + "']").prop("selected", true);
        $("#pais option[value='" + item.pais + "']").prop("selected", true);
        $("#ciudad option[value='" + item.ciudad_id + "']").prop("selected", true);
        $("#formImpresion option[value='" + item.estructuraDocumentoVenta + "']").prop("selected", true);
        $("#tpestado option[value='" + item.estado + "']").prop("selected", true);
        $("#logo").attr("src", item.logo);
        $("#logo").data("peque", item.logo);
        $("#popSucursal h5").text("Modificando Sucursal");
        var horarioDe1 = item.horarioDe1.split(":");
        $("input[name=horaDe]").val(horarioDe1[0]);
        $("input[name=minDe]").val(horarioDe1[1]);
        var horarioHasta1 = item.horarioHasta1.split(":");
        $("input[name=horaA]").val(horarioHasta1[0]);
        $("input[name=minA]").val(horarioHasta1[1]);
        var horarioDe2 = item.horarioDe2.split(":");
        $("input[name=horaDe2]").val(horarioDe2[0]);
        $("input[name=minDe2]").val(horarioDe2[1]);
        var horarioHasta2 = item.horarioHasta2.split(":");
        $("input[name=horaA2]").val(horarioHasta2[0]);
        $("input[name=minA2]").val(horarioHasta2[1]);
        $("#popSucursal input").removeClass("rojoClarito");
        $("#errorPop").html("");
        cambioEstado();
        lat = item.lat;
        lon = item.lon;
        abrirMap();
    }

}
function registrar() {
    var json = variables("#formSucursal");
    json.proceso = 'registrarSucursal';
    json.id_sucursal = id_sucursal;
    json.logo = $("#logo").data("peque");
    json.lat = lat;
    json.lon = lon;
    var tipo = $("#tipoHorario option:selected").val();
    json.tipoHorario = tipo;
    var horaDe = $("input[name=horaDe]").val();
    var minDe = $("input[name=minDe]").val();
    var horaA = $("input[name=horaA]").val();
    var minA = $("input[name=minA]").val();
    var horaDe2 = $("input[name=horaDe2]").val();
    var minDe2 = $("input[name=minDe2]").val();
    var horaA2 = $("input[name=horaA2]").val();
    var minA2 = $("input[name=minA2]").val();

    if (json.app === "activo") {
        if (!(parseInt(horaA) >= 0 && parseInt(horaA) < 24) || !(parseInt(horaDe) >= 0 && parseInt(horaDe) < 24)
                || !(parseInt(horaDe2) >= 0 && parseInt(horaDe2) < 24) || !(parseInt(horaA2) >= 0 && parseInt(horaA2) < 24)) {
            alertaRapida("La hora no puede ser mayor a 23 ni menor a 0", "error");
            return;
        }
        if (!(parseInt(minDe) >= 0 && parseInt(minDe) < 60) || !(parseInt(minA) >= 0 && parseInt(minA) < 60)
                || !(parseInt(minDe2) >= 0 && parseInt(minDe2) < 60) || !(parseInt(minA2) >= 0 && parseInt(minA2) < 60)) {
            alertaRapida("El minuto no puede ser mayor a 59 ni menor a 0", "error");
            return;
        }
    }
    json.horarioDe1 = horaDe + ":" + minDe + ":00";
    json.horarioHasta1 = horaA + ":" + minA + ":00";
    json.horarioDe2 = horaDe2 + ":" + minDe2 + ":00";
    json.horarioHasta2 = horaA2 + ":" + minA2 + ":00";



    if (json.nit.length === 0) {
        $("input[name=nit]").addClass("rojoClarito");
        $("#errorPop").html("No se ha ingresado el nit de la sucursal.");
        return;
    } else {
        $("input[name=nit]").removeClass("rojoClarito");
    }
    if (!validar("entero", json.nit)) {
        $("input[name=nit]").addClass("rojoClarito");
        $("#errorPop").html("El nit solo puede tener de valor numero, no otro tipo de caracteres.");
        return;
    } else {
        $("input[name=nit]").removeClass("rojoClarito");
    }
    if (json.nombre.length === 0) {
        $("input[name=nombre]").addClass("rojoClarito");
        $("#errorPop").html("No se ha ingresado el nombre de la sucursal.");
        return;
    } else {
        $("input[name=nombre]").removeClass("rojoClarito");
    }
    var expresion = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (json.correo.trim() !== "" && (!expresion.test(json.correo.trim()))) {
        $("input[name=correo]").addClass("rojoClarito");
        $("#errorPop").html("El correo es invalido.");
        return;
    } else {
        $("input[name=correo]").removeClass("rojoClarito");
    }
    json.app = "inactivo";
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
            if (id_sucursal === 0) {
                alertaRapida("La sucursal se registro correctamente.");
            } else {
                alertaRapida("La sucursal se registro correctamente.");
            }
            cargar();
            $('#popSucursal').modal('hide');
        }
    });
}
function imprimir() {
    buscar("", 1);
    var contenido = $("#contenidoSucursal").html();
    var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal === null) {
        window.parent.cerrarSession();
        return;
    }
    usuarioLocal = $.parseJSON(usuarioLocal);
    var filtro = "<div class='row' id='filtroReporte'>";
    filtro += "<div class='col-12'><span class='negrilla'>FILTROS</div>";
    var buscador = ($("input[name=buscar]").val() + "")
    var estado = $("#tpestadoB option:selected").text() + "";
    filtro += "<div class='col-4'><span class='negrilla'>Estado: </span>" + estado + "</div>";
    if (buscador !== "") {
        filtro += "<div class='col-4'><span class='negrilla'>Buscador: </span>" + buscador + "</div>";
    }

    filtro += "</div>";
    imprimirReporte({contenido: contenido, sucursal_id: usuarioLocal.sucursal_id, titulo: "Lista de Sucursal", datosHead: filtro, encabezadoThead: true});
}
function cambioEstado() {
    var ciudad_id = $("#ciudad option:selected").val();
    var ciudad = listaCiudad[ciudad_id];
    lat = ciudad.lat;
    lon = ciudad.lon;
    abrirMap();
}
function abrirMap() {
    cargando(true);
    try {
        var mapProp = {
            center: new google.maps.LatLng(lat, lon),
            zoom: 13
        };
        map = new google.maps.Map(document.getElementById("mapa"), mapProp);

        marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, lon),
            draggable: true,
            title: 'Arrastrame',
            animation: google.maps.Animation.BOUNCE
        });
        marker.setMap(map);
        google.maps.event.addListener(map, 'click', function (event) {
            lat = event.latLng.lat();
            lon = event.latLng.lng();
            marker.setPosition(event.latLng);
        });

    } catch (e) {
        cargando(false);
    }
    cargando(false);

}
function changeHorario(e, tipo) {
    var input = $(e.currentTarget);
    var valor = input.val();
    if (!validar("entero", valor)) {
        input.val(valor.substring(0, valor.length - 1));
        return false;
    }
}
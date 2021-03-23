var url = '../Controlador/ControlPedido_Controlador.php';
var contador = 0;
var tamanopantalla = $(window).height() - 379;
var posicion = 0;
var id_pedido = 0;
var listaPedido = {};
var map;
var marker;
var marker2;
var lat = -17.782786;
var lon = -63.181530;
var lat2 = -17.782786;
var lon2 = -63.181530;
var listaTarifa = [];
var estadoMsn="";
$(document).ready(function () {
    $(".fecha").val(fechaActual());
    $(".fecha").datepicker();
    var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal === null) {
        window.parent.cerrarSession();
        return;
    }
    usuarioLocal = $.parseJSON(usuarioLocal);
    $("#tblpedido tbody").css("height", tamanopantalla);
    $(window).resize(function () {
        var tamanopantalla = $(window).height() - 379;
        $("#tblpedido tbody").css("height", tamanopantalla);
    });
    cargando(true);
    $.get(url, {proceso: "tarifario"}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error, "error");
        } else {
            listaTarifa = JSON.parse(json.result.tarifario).result;
            buscarPedido('', 1);
        }
    });
});
function buscarPedido(e, tipo) {
    if (!(e === "" || e.keyCode === 13)) {
        return;
    }
    if (tipo === 1) {
        contador = 0;
        $("#tblpedido tbody").html("");
        $("#btncargarMas").visible();
    }
    var de = $("input[name=de]").val();
    var hasta = $("input[name=hasta]").val();
    var cliente = $("input[name=buscar]").val();
    var tienda = $("input[name=tienda]").val();
    var estado = $("#estado option:selected").val();
    cargando(true);
    $.get(url, {proceso: "buscarPedido", de: de, hasta: hasta, estado: estado
        , cliente: cliente, tienda: tienda, contador: contador}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error, "error");
        } else {
            $("#pendientetxt").html("0,00");
            $("#pendientebs").html("0,00");
            $("#entregadobs").html("0,00");
            $("#canceladotxt").html("0,00");
            $("#canceladobs").html("0,00");
            var lista = json.result.data;
            var limite = parseInt(json.result.limite);
            var resumen = json.result.resumen;
            var html = "";
            var f = new Date();
            var hora = f.getHours();
            for (var i = 0; i < lista.length; i++) {
                contador++;
                listaPedido[lista[i].id_pedidoapp] = lista[i];
                var css = "";
                var colorEsado = "";
                if (lista[i].estado === "pendiente") {
                    colorEsado = "estadoPlomo";
                }
                if (lista[i].estado === "entregado") {
                    colorEsado = "estadoVerde";
                }
                if (lista[i].estado === "cancelado") {
                    colorEsado = "estadoRojo";
                }

                html += "<tr data-id='" + lista[i].id_pedidoapp + "'  onclick='modificar(1)' class='" + css + "'>";
                html += "<td><div class='pequeno2'>" + contador + "</div></td>";
                html += "<td><div class='pequeno'>" + lista[i].fechaProgramada + " " + lista[i].horaProgramada + "</div></td>";
                html += "<td><div class='medio'>" + lista[i].cliente + "</div></td>";
                var tiempo = "Dias";
                if (hora > 11 && hora < 19) {
                    tiempo = "Tardes";
                }
                if (hora > 18 && hora < 24) {
                    tiempo = "Noches";
                }
                var telefono1 = "<a target='_blank' href='https://wa.me/591" + lista[i].teflCliente + "/?text=Estimado%20Buenas%20" + tiempo + "'>" + lista[i].teflCliente + "</a>"
                html += "<td><div class='chico'> " + telefono1 + "</div></td>";
                html += "<td><div class='normal'>" + lista[i].tienda + "</div></td>";

                var telefonoe1 = "<a target='_blank' href='https://wa.me/591" + lista[i].telftienda + "/?text=Estimado%20Buenas%20" + tiempo + "'>" + lista[i].telftienda + "</a>"
                html += "<td><div class='chico'>" + telefonoe1 + "</div></td>";


                html += "<td class='" + colorEsado + "'><div class='pequeno'>" + lista[i].estado + "</div></td>";
                html += "<td><div class='pequeno derecha'>" + format(lista[i].totalPedido) + "</div></td>";
                html += "<td><div class='pequeno derecha'>" + format(lista[i].costoDelivery) + "</div></td>";
                html += "</tr>";
            }
            $("#tblpedido tbody").append(html);
            $("#tblpedido").igualartabla();
            $("#maxcant").text(limite);
            $("#actualcant").text(contador);
            if (contador >= limite) {
                $("#btncargarMas").ocultar();
            } else {
                $("#btncargarMas").visible(1);
            }
            var total = 0;
            var totalPedido = 0;
            $(".dato").html("0");
            var pendienteCant = 0;
            var pendienteRep = 0;
            var pendientetot = 0;
            var entregadoCant = 0;
            var entregadoRep = 0;
            var entregadotot = 0;
            for (var i = 0; i < resumen.length; i++) {
                total += parseFloat(resumen[i].cant);
                totalPedido += parseFloat(resumen[i].totalPedido);

                if (resumen[i].estado === "pendiente") {
                    pendienteCant += parseFloat(resumen[i].cant);
                    pendienteRep += parseFloat(resumen[i].repartidor);
                    pendientetot += parseFloat(resumen[i].totalPedido);
                    $("#pendientetxt").html("<span style='float: left;'>#</span>" + format(pendienteCant));
                    $("#pendientebs").html("<span style='float: left;'>Bs.</span>" + format(pendientetot));
                }
               
                if (resumen[i].estado === "entregado" || resumen[i].estado === "finalizado") {
                    entregadoCant += parseFloat(resumen[i].cant);
                    entregadoRep += parseFloat(resumen[i].repartidor);
                    entregadotot += parseFloat(resumen[i].totalPedido);
                    $("#entregadotxt").html("<span style='float: left;'>#</span>" + format(entregadoCant));
                    $("#entregadobs").html("<span style='float: left;'>Bs.</span>" + format(entregadotot));
                }
                if (resumen[i].estado === "cancelado") {
                    $("#canceladotxt").html("<span style='float: left;'>#</span>" + format(resumen[i].cant));
                    $("#canceladobs").html("<span style='float: left;'>Bs.</span>" + format(resumen[i].totalPedido));
                }


            }
            $("#totaltxt").html("<span style='float: left;'>#</span>" + format(total));
            $("#totalbs").html("<span style='float: left;'>Bs.</span>" + format(totalPedido));
        }
    });
}
function imprimir() {
    var contenido = $("#contenedorCliente").html();
    var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal === null) {
        window.parent.cerrarSession();
        return;
    }
    usuarioLocal = $.parseJSON(usuarioLocal);
    var filtro = "<div class='row' id='filtroReporte'>";
    filtro += "<div class='col-12'><span class='negrilla'>FILTROS</div>";
    var de = $("input[name=de]").val();
    var hasta = $("input[name=hasta]").val();
    var cliente = $("input[name=buscar]").val();
    var tienda = $("input[name=tienda]").val();
    var estado = $("#estado option:selected").val();
    var ciudad = $("#ciudad option:selected").text();

    filtro += "<div class='col-4'><span class='negrilla'>Fecha: </span>" + de + " - " + hasta + "</div>";
    if (cliente !== "") {
        filtro += "<div class='col-4'><span class='negrilla'>Cliente: </span>" + cliente + "</div>";
    }
    if (tienda !== "") {
        filtro += "<div class='col-4'><span class='negrilla'>Tienda: </span>" + tienda + "</div>";
    }
    if (estado !== "") {
        filtro += "<div class='col-4'><span class='negrilla'>Estado: </span>" + estado + "</div>";
    }
    if (ciudad !== "-- Ciudad --") {
        filtro += "<div class='col-4'><span class='negrilla'>Ciudad: </span>" + ciudad + "</div>";
    }

    filtro += "</div>";
    imprimirReporte({contenido: contenido, sucursal_id: usuarioLocal.sucursal_id, titulo: "Listado de Pedidos", datosHead: filtro, encabezadoThead: true});
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
        $('#popPedido').modal('show');
        id_pedido = $(tupla[0]).data("id");
        var item = listaPedido[id_pedido];
        $("#mapaSelect option:eq(0)").prop("selected", true);
        $("#entregaProgramada").html(item.fechaProgramada + " " + item.horaProgramada);

        var nit = item.nit === "" ? "---" : item.nit;
        var rz = item.rz === "" ? "---" : item.rz;

        var direccion = item.direccion;
        direccion = direccion === "" ? "---" : direccion;

        var f = new Date();
        var hora = f.getHours();
        var tiempo = "Dias";
        if (hora > 11 && hora < 19) {
            tiempo = "Tardes";
        }
        if (hora > 18 && hora < 24) {
            tiempo = "Noches";
        }
        $("#clienttext").html(item.cliente);
        $("#nit").html(nit);
        $("#rz").html(rz);
        var teflCliente = "<a target='_blank' href='https://wa.me/591" + item.teflCliente + "/?text=Estimado%20Buenas%20" + tiempo + "'>" + item.teflCliente + "</a>"
        var teflTienda = "<a target='_blank' href='https://wa.me/591" + item.telftienda + "/?text=Estimado%20Buenas%20" + tiempo + "'>" + item.telftienda + "</a>"
        $("#telclient").html(teflCliente);
        $("#telemp").html(teflTienda);
        $("#tiendatext").html(item.tienda);
        $("#boxFact").css("display", "flex");
        $("#direccionapp").html(direccion);
        $("#boxDireccion").visible(1);
        $("#txtProd").visible(1);
        
        
        
        $("#tpestado").html(item.estado);
        if(item.estado==="pendiente"){
            $("#tpestado").removeClass("estadoRojo").removeClass("estadoVerde").removeClass("estadoPlomo").addClass("estadoPlomo");
            $("#btnCancelarPedido").visible(1);
            $("#btnEntregarPedido").visible(1);
            $("#btnActivarPedido").ocultar();
        }
        if(item.estado==="entregado"){
            $("#tpestado").removeClass("estadoRojo").removeClass("estadoVerde").removeClass("estadoPlomo").addClass("estadoVerde");
            $("#btnCancelarPedido").visible(1);
            $("#btnEntregarPedido").ocultar();
            $("#btnActivarPedido").ocultar();
        }
        if(item.estado==="cancelado"){
            $("#tpestado").removeClass("estadoRojo").removeClass("estadoVerde").removeClass("estadoPlomo").addClass("estadoRojo");
            $("#btnCancelarPedido").ocultar();
            $("#btnEntregarPedido").ocultar();
            $("#btnActivarPedido").visible(1);
        }


        lon2 = item.lon;
        lat2 = item.lat;
        lon = item.lone;
        lat = item.late;
        var costo = parseFloat(item.costoDelivery);
        $("#costtxt").html(format(costo));

        $("#btnFin").text("Fijar");

        cargando(true);
        $.get(url, {proceso: "deliveryXciudad", id_pedido: id_pedido}, function (response) {
            cargando(false);
            var json = $.parseJSON(response);
            if (json.error.length > 0) {
                if ("Error Session" === json.error) {
                    window.parent.cerrarSession();
                }
                alertaRapida(json.error, "error");
            } else {
                abrirMap();
                var detalle = json.result.detalle;
                var html = "";
                for (var i = 0; i < detalle.length; i++) {
                    html += "<div class='col-8'>" + detalle[i].cantidad + "x " + detalle[i].nombre;
                    html += "<div style='font-style: italic;'>" + detalle[i].nota + "</div></div>";
                    html += "<div class='col-2'>" + detalle[i].precioU + "</div><br>";
                }
                $("#divProd").html(html);
            }
        });
    }
}
function abrirMap() {
    cargando(true);
    try {
        var moverMapa = false;

        var mapProp = {
            center: new google.maps.LatLng(lat, lon),
            zoom: 13,
            mapTypeControl: false,
            streetViewControl: false,
            disableDefaultUI: false,
            scaleControl: false,
            zoomControl: false,
            rotateControl: false,
            fullscreenControl: true
        };
        map = new google.maps.Map(document.getElementById("mapa"), mapProp);

        marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, lon),
            draggable: moverMapa,
            icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
            animation: google.maps.Animation.BOUNCE
        });
        if (moverMapa) {
            google.maps.event.addListener(marker, 'drag', function (event) {
                lat = event.latLng.lat();
                lon = event.latLng.lng();
                var distancia = calcularDistancia(lat, lon, lat2, lon2);
                valorTarifa(distancia);
            });
        }

        marker.setMap(map);

        marker2 = new google.maps.Marker({
            position: new google.maps.LatLng(lat2, lon2),
            draggable: true,
            icon: "http://maps.google.com/mapfiles/ms/icons/orange-dot.png",
            animation: google.maps.Animation.BOUNCE
        });
        google.maps.event.addListener(marker2, 'drag', function (event) {
            lat2 = event.latLng.lat();
            lon2 = event.latLng.lng();
            var distancia = calcularDistancia(lat, lon, lat2, lon2);
            valorTarifa(distancia);
        });


        marker2.setMap(map);
    } catch (e) {
        cargando(false);
    }
    cargando(false);

}
function valorTarifa(distancia) {
    distancia = distancia / 1000;
    precioEconomico = 100;
    for (var j = 0; j < listaTarifa.length; j++) {
        var tarifa = listaTarifa[j];
        if (tarifa.tipo === "pedido") {
            continue;
        }
        var de = parseFloat(tarifa.de);
        var hasta = parseFloat(tarifa.hasta);
        if (distancia >= de && distancia <= hasta) {
            var precioTarifa = parseFloat(tarifa.precio);
            if (precioEconomico > precioTarifa) {
                precioEconomico = precioTarifa;
            }
        }
    }
    $("#costtxt").html(precioEconomico===100?"Fuera Rango":format(precioEconomico));
}
function calcularDistancia(lat1, long1, lat2, long2) {
    var degtorad = 0.01745329;
    var radtodeg = 57.29577951;

    lat1 = parseFloat(lat1);
    long1 = parseFloat(long1);
    lat2 = parseFloat(lat2);
    long2 = parseFloat(long2);

    var dlong = long1 - long2;

    var c = Math.sin(lat1 * degtorad);
    var d = Math.sin(lat2 * degtorad);

    var a = (Math.sin(lat1 * degtorad) * Math.sin(lat2 * degtorad));

    var b = (Math.cos(lat1 * degtorad) * Math.cos(lat2 * degtorad) * Math.cos(dlong * degtorad))

    var dvalue = (Math.sin(lat1 * degtorad) * Math.sin(lat2 * degtorad)) + (Math.cos(lat1 * degtorad) * Math.cos(lat2 * degtorad) * Math.cos(dlong * degtorad));

    var dd = Math.acos(dvalue) * radtodeg;

    var distancia = (dd * 111.302) * 1000;
    return distancia;
}
function cambioUbicacion() {
    var costo = $("#costtxt").html().replace(/\./g, '').replace(/\,/g, '.');
    costo = parseFloat(costo);
    cargando(true);
    $.get(url, {proceso: "cambioUbicacion", costo: costo, lat: lat, lon: lon, lat2: lat2, lon2: lon2, id_pedido: id_pedido}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error, "error");
        } else {
            alertaRapida("Se cambio la ubicacion correctamente.")
            buscarPedido("", 1);
        }
    });
}
function cambioDatosPedido(tipo,estado) {
    if(tipo==1){
        estadoMsn=estado;
        if(estado=="cancelado"){
            $("#popPedido").ocultar();
            $("#boxcancelacion").visible(1);
        }else{
            $("#boxcancelacion").ocultar();
        }
        $("#msmOK2 .mensaje").html("¿Esta seguro de cambiar el estado del pedido a "+estado+"?");
        $("#msmOK2 input[name=motivoCancelacion]").val("");
        $("#msmOK2").visible(1);
        return;
    }
    var motivo="";
    if(estadoMsn=="cancelado"){
        motivo=$("#msmOK2 input[name=motivoCancelacion]").val().trim();
        if(motivo==""){
            $("#msmOK2 input[name=motivoCancelacion]").addClass("rojoClarito");
            return;
        }else{
            $("#msmOK2 input[name=motivoCancelacion]").removeClass("rojoClarito");
        }
    }
    $("#popPedido").visible(1);
    $("#msmOK2").ocultar();
    var item = listaPedido[id_pedido];
    cargando(true);
    $.post(url, {proceso: "cambioDatosPedido", 
                id_pedido: id_pedido,
                venta_id:item.venta_id,
                sucursal_id: item.sucursal_id, 
                estado: estadoMsn, 
                id_cliente: item.id_cliente,
                motivo:motivo
    }, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error, "error");
        } else {
            alertaRapida("se registro correctamente.");
            $('#popPedido').modal('hide');
            buscarPedido('', 1);
        }
    });
}
function cerrarPop(){
    $("#popPedido").visible(1);
    $("#msmOK2").ocultar();
}
function fijarUbicacion(tipo) {
    if (tipo === 1) {
        lat = $("input[name=lat1]").val();
        lon = $("input[name=lon1]").val();
    } else {
        lat2 = $("input[name=lat1]").val();
        lon2 = $("input[name=lon1]").val();
    }
    var distancia = calcularDistancia(lat, lon, lat2, lon2);
    valorTarifa(distancia);
    abrirMap();
}
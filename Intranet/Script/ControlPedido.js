var url = '../Controlador/ControlPedido_Controlador.php';
var contador = 0;
var tamanopantalla = $(window).height() - 379;
var posicion = 0;
var id_pedido = 0;
var tipoCarrera2 = 0;
var listaPedido = {};
var map;
var marker;
var marker2;
var lat = -17.782786;
var lon = -63.181530;
var lat2 = -17.782786;
var lon2 = -63.181530;
var listaTarifa = [];
var tipoCarreraCurrier = "IDA";
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
        var tamanopantalla =$(window).height() - 379;
        $("#tblpedido tbody").css("height", tamanopantalla);
    });
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
            listaTarifa = json.result.tarifario;
            var ciudapoption = "<option value='' >-- Ciudad --</option>";
            for (var i = 0 in ciudad) {
                if ((usuarioLocal.ADM_ciudad_id + "") === (ciudad[i].id_ciudad + "")) {
                    ciudapoption += "<option value='" + ciudad[i].id_ciudad + "' selected>" + ciudad[i].nombre + "</option>";
                } else {
                    ciudapoption += "<option value='" + ciudad[i].id_ciudad + "' >" + ciudad[i].nombre + "</option>";
                }
            }
            $("#ciudad").html(ciudapoption);
            buscarPedido("", 1);
        }
    });
});
function cambiarDescuento() {
    var precioEconomico = parseFloat($("#costtxt").html().replace(/\./g, '').replace(/\,/g, '.'));
    var desc = $("input[name=desc]").val();
    desc = desc === "" ? 0 : parseFloat(desc);
    var total = precioEconomico - desc;

    $("#tcos").html(format(total));
}
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
    var empresa = $("input[name=empresa]").val();
    var estado = $("#estado option:selected").val();
    var express = $("#estadoExpress option:selected").val();
    var ciudad = $("#ciudad option:selected").val();
    var ver = $("#verPedido option:selected").val();
    cargando(true);
    $.get(url, {proceso: "buscarPedido",ver:ver,express:express, de: de, hasta: hasta, estado: estado, ciudad_id: ciudad
        , cliente: cliente, empresa: empresa, contador: contador}, function (response) {
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
            $("#pendienter").html("0,00");
            $("#recepcionadotxt").html("0,00");
            $("#recepcionadobs").html("0,00");
            $("#recepcionadorr").html("0,00");
            $("#recepcionadoPedidotxt").html("0,00");
            $("#recepcionadoPedidobs").html("0,00");
            $("#recepcionadoPedidor").html("0,00");
            $("#encaminotxt").html("0,00");
            $("#encaminobs").html("0,00");
            $("#encaminor").html("0,00");
            $("#entregadotxt").html("0,00");
            $("#entregadobs").html("0,00");
            $("#entregador").html("0,00");
            $("#canceladotxt").html("0,00");
            $("#canceladobs").html("0,00");
            $("#cancelador").html("0,00");
            var lista = json.result.data;
            var limite = parseInt(json.result.limite);
            var resumen = json.result.resumen;
            var html = "";
            var f = new Date();
            var hora = f.getHours();
            for (var i = 0; i < lista.length; i++) {
                contador++;
                listaPedido[lista[i].id_pedidoapp] = lista[i];
                var tipo = lista[i].tipo;
                var css = "";
                var colorEsado="";
                if (tipo === "2" || tipo === 2) {
                    css = "backgroundcurrier";
                    if(lista[i].estado === "pendiente"){
                     colorEsado="estadoPlomo";   
                    }
                    if(lista[i].estado === "aceptado"){
                     colorEsado="estadoCeleste";   
                    }
                    if(lista[i].estado === "recogido"){
                     colorEsado="estadoAmarillo";   
                    }
                    if(lista[i].estado === "entregado" || lista[i].estado === "finalizado"){
                     colorEsado="estadoVerde";   
                    }
                    if(lista[i].estado === "cancelado"){
                     colorEsado="estadoRojo";   
                    }
                }else{
                    if(lista[i].estado === "pendiente"){
                     colorEsado="estadoPlomo";   
                    }
                    if(lista[i].estado === "recepcionado"){
                     colorEsado="estadoCeleste";   
                    }
                    if(lista[i].estado === "recogiendo pedido"){
                     colorEsado="estadoNaranja";   
                    }
                    if(lista[i].estado === "en camino"){
                     colorEsado="estadoAmarillo";   
                    }
                    if(lista[i].estado === "entregado"){
                     colorEsado="estadoVerde";   
                    }
                    if(lista[i].estado === "cancelado"){
                     colorEsado="estadoRojo";   
                    }
                }
                html += "<tr data-id='" + lista[i].id_pedidoapp + "'  onclick='modificar(1)' class='" + css + "'>";
                html += "<td><div class='pequeno2'>" + contador + "</div></td>";
                html += "<td><div class='pequeno'>" + lista[i].solicitada + "</div></td>";
                html += "<td><div style='width: 80px'>" + lista[i].recepcionado + "</div></td>";
                html += "<td><div style='width: 80px'>" + lista[i].llamarMoto + "</div></td>";
                html += "<td><div class='pequeno'>" + lista[i].enCamino + "</div></td>";
                html += "<td><div class='medio'>" + lista[i].cliente + "</div></td>";
                var tiempo = "Dias";
                if (hora > 11 && hora < 19) {
                    tiempo = "Tardes";
                }
                if (hora > 18 && hora < 24) {
                    tiempo = "Noches";
                }
                if (tipo === "1" || tipo === 1) {
                    var telefono1 = "<a target='_blank' href='https://wa.me/591" + lista[i].teflCliente + "/?text=Estimado%20Buenas%20" + tiempo + ",%20le%20hablamos%20de%20la%20Aplicación%20“Emprendedor%20Delivery”%20'>" + lista[i].teflCliente + "</a>"
                    var telefono2 = "<a target='_blank' href='https://wa.me/591" + lista[i].telfDir + "/?text=Estimado%20Buenas%20" + tiempo + ",%20le%20hablamos%20de%20la%20Aplicación%20“Emprendedor%20Delivery”%20'>" + lista[i].telfDir + "</a>"
                    html += "<td><div class='chico'> C-" + telefono1 + " <br> D-" + telefono2 + "</div></td>";
                    html += "<td><div class='normal'>" + lista[i].nombreEmpresa + "</div></td>";
                } else {
                    var telefono1 = "<a target='_blank' href='https://wa.me/591" + lista[i].teflCliente + "/?text=Estimado%20Buenas%20" + tiempo + ",%20le%20hablamos%20de%20la%20Aplicación%20“Emprendedor%20Delivery”%20'>" + lista[i].teflCliente + "</a>"
                    html += "<td><div class='chico'> " + telefono1 + "</div></td>";
                    html += "<td><div class='normal'>" + lista[i].tipoCarrera + "</div></td>";
                }
                if (tipo === "1" || tipo === 1) {
                    var telefonoe1 = "<a target='_blank' href='https://wa.me/591" + lista[i].telfEmpresa + "/?text=Estimado%20Buenas%20" + tiempo + ",%20le%20hablamos%20de%20la%20Aplicación%20“Emprendedor%20Delivery”%20comentarle%20tiene%20un%20pedido%20pendiente.'>" + lista[i].telfEmpresa + "</a>"
                    var telefonoe2 = "<a target='_blank' href='https://wa.me/591" + lista[i].telfSuc + "/?text=Estimado%20Buenas%20" + tiempo + ",%20le%20hablamos%20de%20la%20Aplicación%20“Emprendedor%20Delivery”%20comentarle%20tiene%20un%20pedido%20pendiente.'>" + lista[i].telfSuc + "</a>"
                    html += "<td><div class='chico'> E-" + telefonoe1 + " <br> S-" + telefonoe2 + "</div></td>";
                } else {
                    var telefono1 = "<a target='_blank' href='https://wa.me/591" + lista[i].telfEmpresa + "/?text=Estimado%20Buenas%20" + tiempo + ",%20le%20hablamos%20de%20la%20Aplicación%20“Emprendedor%20Delivery”%20'>" + lista[i].telfEmpresa + "</a>"
                    html += "<td><div class='chico'> " + telefono1 + "</div></td>";
                }

                html += "<td class='"+colorEsado+"'><div class='pequeno'>" + lista[i].estado + "</div></td>";
                html += "<td><div class='normal'>" + lista[i].delivery + "</div></td>";
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
            var totalrepartidor = 0;
            $(".dato").html("0");
            var pendienteCant = 0;
            var pendienteRep = 0;
            var pendientetot = 0;
            var recepcionadoCant = 0;
            var recepcionadoRep = 0;
            var recepcionadotot = 0;
            var llamaCant = 0;
            var llamaRep = 0;
            var llamatot = 0;
            var entregadoCant = 0;
            var entregadoRep = 0;
            var entregadotot = 0;
            for (var i = 0; i < resumen.length; i++) {
                total += parseFloat(resumen[i].cant);
                totalPedido += parseFloat(resumen[i].totalPedido);
                totalrepartidor += parseFloat(resumen[i].repartidor);

                if (resumen[i].estado === "pendiente") {
                    pendienteCant += parseFloat(resumen[i].cant);
                    pendienteRep += parseFloat(resumen[i].repartidor);
                    pendientetot += parseFloat(resumen[i].totalPedido);
                    $("#pendientetxt").html("<span style='float: left;'>#</span>" + format(pendienteCant));
                    $("#pendientebs").html("<span style='float: left;'>Bs.</span>" + format(pendientetot));
                    $("#pendienter").html("<span style='float: left;'>&#9992;</span>" + format(pendienteRep));
                }
                if (resumen[i].estado === "recepcionado" || resumen[i].estado === "aceptado") {
                    recepcionadoCant += parseFloat(resumen[i].cant);
                    recepcionadoRep += parseFloat(resumen[i].repartidor);
                    recepcionadotot += parseFloat(resumen[i].totalPedido);
                    $("#recepcionadotxt").html("<span style='float: left;'>#</span>" + format(recepcionadoCant));
                    $("#recepcionadobs").html("<span style='float: left;'>Bs.</span>" + format(recepcionadotot));
                    $("#recepcionadorr").html("<span style='float: left;'>&#9992;</span>" + format(recepcionadoRep));
                }
                if (resumen[i].estado === "recogiendo pedido" || resumen[i].estado === "recogido") {
                    llamaCant += parseFloat(resumen[i].cant);
                    llamaRep += parseFloat(resumen[i].repartidor);
                    llamatot += parseFloat(resumen[i].totalPedido);
                    $("#recepcionadoPedidotxt").html("<span style='float: left;'>#</span>" + format(llamaCant));
                    $("#recepcionadoPedidobs").html("<span style='float: left;'>Bs.</span>" + format(llamatot));
                    $("#recepcionadoPedidor").html("<span style='float: left;'>&#9992;</span>" + format(llamaRep));
                }
                if (resumen[i].estado === "en camino") {
                    $("#encaminotxt").html("<span style='float: left;'>#</span>" + format(resumen[i].cant));
                    $("#encaminobs").html("<span style='float: left;'>Bs.</span>" + format(resumen[i].totalPedido));
                    $("#encaminor").html("<span style='float: left;'>&#9992;</span>" + format(resumen[i].repartidor));
                }
                if (resumen[i].estado === "entregado" || resumen[i].estado === "finalizado") {
                    entregadoCant += parseFloat(resumen[i].cant);
                    entregadoRep += parseFloat(resumen[i].repartidor);
                    entregadotot += parseFloat(resumen[i].totalPedido);
                    $("#entregadotxt").html("<span style='float: left;'>#</span>" + format(entregadoCant));
                    $("#entregadobs").html("<span style='float: left;'>Bs.</span>" + format(entregadotot));
                    $("#entregador").html("<span style='float: left;'>&#9992;</span>" + format(entregadoRep));
                }
                if (resumen[i].estado === "cancelado") {
                    $("#canceladotxt").html("<span style='float: left;'>#</span>" + format(resumen[i].cant));
                    $("#canceladobs").html("<span style='float: left;'>Bs.</span>" + format(resumen[i].totalPedido));
                    $("#cancelador").html("<span style='float: left;'>&#9992;</span>" + format(resumen[i].repartidor));
                }


            }
            $("#totaltxt").html("<span style='float: left;'>#</span>" + format(total));
            $("#totalbs").html("<span style='float: left;'>Bs.</span>" + format(totalPedido));
            $("#totalr").html("<span style='float: left;'>&#9992;</span>" + format(totalrepartidor));
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
    var empresa = $("input[name=empresa]").val();
    var estado = $("#estado option:selected").val();
    var ciudad = $("#ciudad option:selected").text();

    filtro += "<div class='col-4'><span class='negrilla'>Fecha: </span>" + de + " - " + hasta + "</div>";
    if (cliente !== "") {
        filtro += "<div class='col-4'><span class='negrilla'>Cliente: </span>" + cliente + "</div>";
    }
    if (empresa !== "") {
        filtro += "<div class='col-4'><span class='negrilla'>Empresa: </span>" + empresa + "</div>";
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
        $("#solicitada").html(item.solicitada);


        $("#entregadoTxt").html(item.entregada);
        $("#costoDelivery").html(format(item.costoDelivery));

        var nit = item.nit === "" ? "---" : item.nit;
        var rz = item.rz === "" ? "---" : item.rz;

        var direccion = item.direccion;
        direccion = direccion === "" ? "---" : direccion;

        $("#billete").html(format(item.montoBillete));
        tipoCarrera2 = item.tipo;
        var f = new Date();
        var hora = f.getHours();
        var tiempo = "Dias";
        if (hora > 11 && hora < 19) {
            tiempo = "Tardes";
        }
        if (hora > 18 && hora < 24) {
            tiempo = "Noches";
        }
        if (item.tipo === "1" || item.tipo === 1) {
            $("#clienttext").html(item.cliente);

            $("#nit").html(nit);
            $("#rz").html(rz);
            $("#txtTelfCli").text("Telf. Cliente");
            $("#txtTelfEmp").text("Telf. Emp");
            var teflCliente = "<a target='_blank' href='https://wa.me/591" + item.teflCliente + "/?text=Estimado%20Buenas%20" + tiempo + ",%20le%20hablamos%20de%20la%20Aplicación%20“Emprendedor%20Delivery”%20'>" + item.teflCliente + "</a>"
            var teflDireccion = "<a target='_blank' href='https://wa.me/591" + item.telfDir + "/?text=Estimado%20Buenas%20" + tiempo + ",%20le%20hablamos%20de%20la%20Aplicación%20“Emprendedor%20Delivery”%20'>" + item.telfDir + "</a>"
            var teflEmpresa = "<a target='_blank' href='https://wa.me/591" + item.telfEmpresa + "/?text=Estimado%20Buenas%20" + tiempo + ",%20le%20hablamos%20de%20la%20Aplicación%20“Emprendedor%20Delivery”%20'>" + item.telfEmpresa + "</a>"
            var teflSuc = "<a target='_blank' href='https://wa.me/591" + item.telfSuc + "/?text=Estimado%20Buenas%20" + tiempo + ",%20le%20hablamos%20de%20la%20Aplicación%20“Emprendedor%20Delivery”%20'>" + item.telfSuc + "</a>"
            $("#telclient").html("C-" + teflCliente + ", D-" + teflDireccion);
            $("#telemp").html("E-" + teflEmpresa + ", S-" + teflSuc);
            $("#txtEmpr").text("Empresa");
            $("#empresatext").html(item.nombreEmpresa);
            $("#boxFact").css("display", "flex");
            $("#direccionapp").html(direccion);
            $("#boxDireccion").visible(1);
            $("#txtProd").visible(1);
            $("#tpestado").html("<option value=''>-- Estado --</option><option value='pendiente' class='estadoPlomo'>Pendiente</option><option value='recepcionado' class='estadoCeleste'>Recepcionado</option><option value='recogiendo pedido' class='estadoNaranja'>Recogiendo Pedido</option><option value='en camino' class='estadoAmarillo'>En Camino</option><option value='entregado' class='estadoVerde'>Entregado</option><option value='cancelado' class='estadoRojo'>Cancelado</option>");
            lon2 = item.lon;
            lat2 = item.lat;
            lon = item.lone;
            lat = item.late;
            var costo = parseFloat(item.costoDelivery);
            var desc = parseFloat(item.descuento);
            var totalC = costo + desc;
            $("#costtxt").html(format(totalC));
            $("input[name=desc]").val(desc);
            $("#tcos").html(format(costo));
            
            $("#btnOrigen").ocultar();
            $("#btnFin").text("Fijar");
        } else {
            lon = item.lon;
            lat = item.lat;
            lon2 = item.lone;
            lat2 = item.late;
            $("#boxFact").ocultar();
            $("#txtProd").ocultar();
            $("#boxDireccion").ocultar();
            $("#txtTelfCli").text("Telf. Origen");
            $("#txtTelfEmp").text("Telf. Destino");
            $("#txtEmpr").text("Detalle");
            var telefono1 = "<a target='_blank' href='https://wa.me/591" + item.telfDir + "/?text=Estimado%20Buenas%20" + tiempo + ",%20le%20hablamos%20de%20la%20Aplicación%20“Emprendedor%20Delivery”%20'>" + item.telfDir + "</a>"
            $("#clienttext").html(item.cliente + " , Tefl:" + telefono1);
            var telefonoOrigen = "<a target='_blank' href='https://wa.me/591" + item.teflCliente + "/?text=Estimado%20Buenas%20" + tiempo + ",%20le%20hablamos%20de%20la%20Aplicación%20“Emprendedor%20Delivery”%20'>" + item.teflCliente + "</a>"
            $("#telclient").html(telefonoOrigen);
            var telefonoDestino = "<a target='_blank' href='https://wa.me/591" + item.telfEmpresa + "/?text=Estimado%20Buenas%20" + tiempo + ",%20le%20hablamos%20de%20la%20Aplicación%20“Emprendedor%20Delivery”%20'>" + item.telfEmpresa + "</a>"
            $("#telemp").html(telefonoDestino);
            $("#empresatext").html(item.detalle);
            $("#tpestado").html("<option value='pendiente' class='estadoPlomo'>Pendiente</option><option value='aceptado' class='estadoCeleste'>Aceptado</option><option value='recogido' class='estadoAmarillo'>Recogido</option><option value='entregado' class='estadoVerde'>Entregado</option><option value='finalizado'  class='estadoVerde'>Finalizado</option><option value='cancelado'  class='estadoRojo'>Cancelado</option>");
            tipoCarreraCurrier = item.tipoCarrera;
            var costo = parseFloat(item.costoDelivery);
            var desc = parseFloat(item.descuento);
            var totalC = costo + desc;
            $("#costtxt").html(format(totalC));
            $("input[name=desc]").val(desc);
            $("#tcos").html(format(costo));

            var html = "";
            html += "<div class='col-12 ml-3 mt-2 p-2' style='background-color: #d8efd8;'>";
            html += "<label>Referencia Origen</label><div >" + item.referenciaOrigen + "</div>";
            html += "<label>Contacto Origen</label><div >" + item.contactoOrigen + "</div>";
            html += "<label>Teléfono Origen</label><div >" + item.telefonoOrigen + "</div>";
            html += "</div>";
            html += "<div  class='col-12 ml-3 mt-2  p-2'  style='background-color: #fbe0a9;'>";
            html += "<label>Referencia Destino</label><div >" + item.referenciaDestino + "</div>";
            html += "<label>Contacto Destino</label><div >" + item.contactoDestino + "</div>";
            html += "<label>Teléfono Destino</label><div >" + item.telefonoDestino + "</div>";
            html += "</div>";
            $("#divProd").html(html);
            $("#btnOrigen").visible();
            $("#btnFin").text("Fin");
        }
        $("#tpestado option[value='" + item.estado + "']").prop("selected", true);

        var ciudad = $("#ciudad option:selected").val();
        cargando(true);
        $.get(url, {proceso: "deliveryXciudad", ciudad_id: ciudad, id_pedido: id_pedido, tipo: item.tipo}, function (response) {
            cargando(false);
            var json = $.parseJSON(response);
            if (json.error.length > 0) {
                if ("Error Session" === json.error) {
                    window.parent.cerrarSession();
                }
                alertaRapida(json.error, "error");
            } else {
                var deliveryList = json.result.delivery;
                var delivery = item.delivery_id;
                delivery = delivery === 0 || delivery === "0" || delivery === "" ? null : delivery;
                comboBox({identificador: "input[name=delivery]", todos: true, valueDefault: delivery, datos: deliveryList, codigo: "id_delivery", texto: "nombre"});
                if (delivery === null) {
                    $("input[name=delivery]").val("");
                    $("input[name=delivery]").data("cod", "0");
                }
                abrirMap();
                if (item.tipo === "1" || item.tipo === 1) {
                    var detalle = json.result.detalle;
                    var html = "";
                    for (var i = 0; i < detalle.length; i++) {
                        html += "<div class='col-8'>" + detalle[i].cantidad + "x " + detalle[i].nombre;
                        html += "<div style='font-style: italic;'>" + detalle[i].nota + "</div></div>";
                        html += "<div class='col-2'>" + detalle[i].precioU + "</div><br>";
                    }
                    $("#divProd").html(html);
                }

            }
        });
    }
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
function valorTarifa(distancia) {
    distancia = distancia / 1000;
    precioEconomico = 100;
    for (var j = 0; j < listaTarifa.length; j++) {
        var tarifa = listaTarifa[j];
        if((tipoCarrera2===1 || tipoCarrera2==="1") && tarifa.tipo==="currier"){
            continue;
        }
        if((tipoCarrera2===2 || tipoCarrera2==="2") && tarifa.tipo==="pedido"){
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
    if (tipoCarreraCurrier !== "IDA") {
        precioEconomico = precioEconomico * 1.9;
    }
    $("#costtxt").html(format(precioEconomico));
    var desc = $("input[name=desc]").val();
    desc = desc === "" ? 0 : parseFloat(desc);
    var total = precioEconomico - desc;

    $("#tcos").html(format(total));
}
function cambioUbicacion() {
    var costo = $("#costtxt").html().replace(/\./g, '').replace(/\,/g, '.');
    var desc = $("input[name=desc]").val();
    desc = desc === "" ? 0 : parseFloat(desc);
    costo=parseFloat(costo)-desc;
    cargando(true);
    $.get(url, {proceso: "cambioUbicacion",tipoCarrera:tipoCarrera2, costo: costo, descuento: desc, lat: lat, lon: lon, lat2: lat2, lon2: lon2, id_pedido: id_pedido}, function (response) {
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
function abrirMap() {
    cargando(true);
    try {
        var moverMapa = tipoCarrera2 === "1" || tipoCarrera2 === 1 ? false : true;

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
function cambioDatosPedido() {
    var estado = $("#tpestado option:selected").val();
    var delivery = $("input[name=delivery]").data("cod");
    var item = listaPedido[id_pedido];
    var notificar = 0;
    if (item.estado != estado) {
        notificar = 1;
    }
    cargando(true);
    $.post(url, {proceso: "cambioDatosPedido", notificar: notificar, id_pedido: id_pedido, sucursal_id: item.sucursal_id
        , estado: estado, tipo: tipoCarrera2, delivery_id: delivery, id_cliente: item.id_cliente, nombreEmpresa: item.nombreEmpresa}, function (response) {
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
        }
    });
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
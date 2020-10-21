var url = 'Controlador/Portal_Controlador.php';
var listaUsuario = [];
var versionUsuario = 0;
var listaCliente = [];
var versionCliente = 0;
var listaProducto = [];
var versionProducto = 0;
var PermisosCuenta = [];
var listaSucursalRapida = [];
var listaSucursal = [];
var listaPermisos = [];
var listaPermisosUsuario = [];
var listaPermisosUsuarioRapido = [];
var empresaD;
var conf = {};
var iframeImpresion;
var sucursalOption;
estadoMenu = false;
var nronotificacion = 0;
var id_Venta = 0;
var estadoImpresion = false;
function reproducirAudioPedido() {
    var idmusica = "audio" + nronotificacion;
    $("#" + idmusica).remove();
    nronotificacion++;
    idmusica = "audio" + (nronotificacion);

    $("body").append("<audio style='display:none' id='" + idmusica + "' controls autoplay loop><source src='Libreria/notificacion.mp3' type='audio/mpeg' /></audio>");
    setTimeout(() => {
        $("#" + idmusica).remove();
    }, 9000);
}
$(document).ready(function () {
    iframeImpresion = $('#impresionIframe');
    iframeImpresion.contents().find("head").append($("<link href='Estilo/bootstrap.min.css' rel='stylesheet' type='text/css'/><link href='Estilo/Estilo.css' rel='stylesheet' type='text/css'/><link href='Estilo/ImpresionReporte.css' rel='stylesheet'  type='text/css'/>"));
    var tamanopantalla = $(window).height() - 60;
    $("#cuerpoProyeto").css("height", tamanopantalla);
    $(window).resize(function () {
        var tamanopantalla = $(window).height() - 60;
        $("#cuerpoProyeto").css("height", tamanopantalla);
    });
             
    var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal === null) {
        cerrarSession(1);
    }
    inicializarBaseDatos();
});
function notificacionesPush() {
    const firebaseConfig = {
        apiKey: "AIzaSyAkuffCDC_AEDXwPL9iyfr1uzq5A8HE4fw",
        authDomain: "emprendedor-277412.firebaseapp.com",
        databaseURL: "https://emprendedor-277412.firebaseio.com",
        projectId: "emprendedor-277412",
        storageBucket: "emprendedor-277412.appspot.com",
        messagingSenderId: "1070016603176",
        appId: "1:1070016603176:web:bfac0e3367a315e981c11d",
        measurementId: "G-YSL2VMNLQS"
    };
    try {
        firebase.initializeApp(firebaseConfig);
        const messaging = firebase.messaging();
        messaging.usePublicVapidKey("BKHw7yW05UjGgKYe5fXbGybieEDcUzZD2vY6_pPcq1xgkzJmAn9qKcoUW8cC6boFrRmlf5y1NyEcEgWlA78qAlA");

        Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
                messaging.getToken().then((currentToken) => {
                    var tokenNavegador = localStorage.getItem("firebase");
                    if (tokenNavegador !== currentToken) {
                        cargando2(true);
                        $.post(url, {proceso: 'actualizarToken', token: currentToken}, function (response) {
                            cargando2(false);
                            var json = $.parseJSON(response);
                            if (json.error.length > 0) {
                                if ("Error Session" === json.error) {
                                    cerrarSession(1);
                                }
                                alertaRapida(json.error, "error", 60);

                            } else {
                                localStorage.setItem("firebase", currentToken);
                            }
                        });
                    }
                }).catch((err) => {
                    console.log(err)
                    alertaRapida("El sistema se encuentra con las notificaciones de pedidos inactivas(token). Contáctese con el administrador del sistema.", "error", 60);
                });
            } else {
                alertaRapida("Si no concede permiso de notificación del navegador no recibirá los pedidos", "error", 60);
            }
        });
        messaging.onTokenRefresh(() => {
            messaging.getToken().then((currentToken) => {
                var tokenNavegador = localStorage.getItem("firebase");
                if (tokenNavegador !== currentToken) {
                    cargando2(true);
                    $.post(url, {proceso: 'actualizarToken', token: currentToken}, function (response) {
                        cargando2(false);
                        var json = $.parseJSON(response);
                        if (json.error.length > 0) {
                            if ("Error Session" === json.error) {
                                cerrarSession(1);
                            }
                            alertaRapida(json.error, "error", 60);

                        } else {
                            localStorage.setItem("firebase", currentToken);
                        }
                    });
                }
            }).catch((err) => {
                console.log(err)
                alertaRapida("El sistema se encuentra con las notificaciones de pedidos inactivas(token). Contáctese con el administrador del sistema.", "error", 60);
            });
        });
        messaging.onMessage((payload) => {
            $("#btnreproduccion").click();
            var usuarioLocal = localStorage.getItem("usuario");
            if (usuarioLocal === null) {
                cerrarSession(1);
            }
            usuarioLocal = $.parseJSON(usuarioLocal);
            if (payload.data.sucursal === usuarioLocal.sucursal_id) {
                if (payload.data.tipo === "delivery") {
                    alertaRapida(payload.notification.body, "confirmacion", 60);
                }
                $.post(url, {proceso: 'nroPendientes'}, function (response) {
                    var json = $.parseJSON(response);
                    if (json.error.length > 0) {
                        if ("Error Session" === json.error) {
                            cerrarSession(1);
                        }
                        alertaRapida(json.error, "error", 60);
                    } else {
                        var cantidad = parseInt(json.result);
                        var nroPendientes = parseInt($("#nroNotificacionVenta").html());
                        if (nroPendientes !== cantidad) {
                            if (cantidad > nroPendientes) {
                                reproducirAudioPedido();
                            }
                            nroPendientes = cantidad;
                            $("#btnOnline").removeClass("latido").addClass("latido");
                            setTimeout(() => {
                                $("#nroNotificacionVenta").html(cantidad);
                            }, 1000);
                        }
                    }
                });
            }
        });
    } catch (e) {
        console.log(e)
        alertaRapida("Las Notificaciones de pedidos se encuentra desactivadas en su navegador.", "error", 60);
    }



}
function menuApp() {
    if (estadoMenu) {
        return;
    }
    estadoMenu = true;
    if ($("#submenu").css("display") === "none") {
        tamanopantalla = $(window).height() - 60;
        $("#submenu").css("cssText", "width: 0px; display:block !important;  position: fixed; max-width: none; z-index: 1; height:" + tamanopantalla + "px;");
        $("#submenu").animate({
            "width": "400px"
        }, 500, function () {
            estadoMenu = false;
        });
    } else {
        $("#submenu").animate({
            "width": "0"
        }, 500, function () {
            estadoMenu = false;
            $("#submenu").css("cssText", "display:none !important;");

        });
    }
}
function validarPermisos() {
    $("#submenu .item").addClass("ocultarPermisos");
    listaPermisosUsuarioRapido = {};
    for (var i = 0; i < listaPermisosUsuario.length; i++) {
        listaPermisosUsuarioRapido[listaPermisosUsuario[i].permiso_id] = listaPermisosUsuario[i];
        $("#m" + listaPermisosUsuario[i].CategoriaPermiso_id).removeClass("removeMenu");
        $("#sm" + listaPermisosUsuario[i].CategoriaPermiso_id).removeClass("removeMenu");
        if (listaPermisosUsuario[i].tipo === "REDIRECCION") {
            if (listaPermisosUsuario[i].permiso_id === 46) {
                if (!conf[1]) {
                    continue;
                }
            }
            $("#sm"+listaPermisosUsuario[i].CategoriaPermiso_id).removeClass("ocultar");
            $("#sm" + listaPermisosUsuario[i].CategoriaPermiso_id).after("<div class='point item ocultarMenu p" + listaPermisosUsuario[i].CategoriaPermiso_id + "' onclick=\"redireccionarUrl('" + listaPermisosUsuario[i].url + "',this)\">" + listaPermisosUsuario[i].titulomenu + "</div>");
        }
    }
    $(".removeMenu").remove();
    $("#submenu .ocultarPermisos").remove();
    $("#menu .item:eq(0)").click();
}
function buscarSucursal() {
    cargando2(true);
    $.get(url, {proceso: 'buscarSucursal'}, function (response) {
        cargando2(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                cerrarSession(1);
            }
            alertaRapida(json.error, "error", 60);
        } else {
            sucursalOption = "<option value='0'>-- Sucursal --</option>";
            listaSucursal = json.result.sucursal;
            for (var i = 0 in listaSucursal) {
                listaSucursalRapida["s" + listaSucursal[i]["id_sucursal"]] = listaSucursal[i];
                sucursalOption += "<option value='" + listaSucursal[i]["id_sucursal"] + "' data-estado='" + listaSucursal[i].estado + "'>" + listaSucursal[i]["nombre"] + "</option>";
            }
        }
    });
}
function popPedidos() {
    $("#popupPedido").modal('show');
    cargando2(true);
    $.get(url, {proceso: 'listaPedidosPendientes'}, function (response) {
        cargando2(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                cerrarSession(1);
            }
            alertaRapida(json.error, "error", 60);
        } else {

            var listaPedido = json.result.pedido;
            var listaDetalle = json.result.detalle;
            var html = "";
            for (var i = 0; i < listaPedido.length; i++) {
                html += "<div class='itemPedido' onclick='abrirDetallepedido(this)'>";
                html += "    <div class='cabecera row mb-3'>";
                html += "        <div class='col-4 col-lg-2 medio'>";
                if (listaPedido[i].estado === "pendiente") {
                    html += "            <div class='negrilla'>Solicitado</div>";
                    html += "            <div>" + listaPedido[i].solicitada + "</div>";
                }
                if (listaPedido[i].estado === "recepcionado") {
                    html += "            <div class='negrilla'>Recepcionado</div>";
                    html += "            <div>" + listaPedido[i].recepcionado + "</div>";
                }
                if (listaPedido[i].estado === "recogiendo pedido") {
                    html += "            <div class='negrilla'>Llam. Repartidor</div>";
                    html += "            <div>" + listaPedido[i].llamarMoto + "</div>";
                }

                html += "        </div>";
                html += "        <div class='col-8 col-lg-5  grande'>";
                html += "            <div class='negrilla'>Cliente</div>";
                html += "            <div>" + listaPedido[i].cliente + "</div>";
                html += "        </div>";
                html += "        <div class='col-4 col-lg-3 medio'>";
                html += "            <div class='negrilla'>Total Pedido</div>";
                html += "            <div>" + format(listaPedido[i].totalPedido) + " Bs</div>";
                html += "        </div>";
                html += "        <div class='col-8 col-lg-2 medio'>";
                html += "            <div class='negrilla'>Estado</div>";
                html += "            <div>" + listaPedido[i].estado.toUpperCase() + "</div>";
                html += "        </div>";
                html += "    </div>";
                html += "    <div class='centrar detalle' style='display:none;'>";

                html += "<div class='row mb-3'>";
                html += "  <div class='col-4 medio'>";
                html += "      <div class='negrilla'>Solicitado</div>";
                html += "      <div>" + listaPedido[i].solicitada + "</div>";
                html += "  </div>";
                html += "  <div class='col-4 grande'>";
                html += "      <div class='negrilla'>Recepcionado</div>";
                html += "      <div>" + listaPedido[i].recepcionado + "</div>";
                html += "  </div>";
                html += "  <div class='col-4 medio'>";
                html += "      <div class='negrilla'>Llamada Repartidor</div>";
                html += "      <div>" + listaPedido[i].llamarMoto + "</div>";
                html += "  </div>";
                html += "</div>";



                html += "        <table class='table'>";
                html += "            <thead class='thead-light'>";
                html += "                <th><div style='width: 75px;'>Cod. Producto</div></th>";
                html += "                <th><div class='grande'>Producto</div></th>";
                html += "                <th><div style='width: 47px;'>Cant.</div></th>";
                html += "                <th><div class='normal'>Nota</div></th>";
                html += "            </thead><tbody id='p" + listaPedido[i].id_pedidoApp + "'></tbody>";
                html += "        </table>";
                html += "        <div>";
                html += "<span class='mr-3'>Telefono del Pedido: </span>" + listaPedido[i].telefono + "<br>";
                html += "<span class='mr-3'>Telefono del Cliente: </span>" + listaPedido[i].telefono2 + "<br>";
                html += "        </div>";
                html += "    <div class='centrar mt-4'>";
                if (listaPedido[i].estado.toUpperCase() === "PENDIENTE" || listaPedido[i].estado.toUpperCase() === "RECEPCIONADO") {
                    html += "        <button class='btn-danger' onclick='cancelarPerdido(" + listaPedido[i].id_pedidoApp + "," + listaPedido[i].cliente_id + ")'>Cancelar</button>";
                }
                if (listaPedido[i].estado.toUpperCase() === "PENDIENTE") {
                    html += "<button class='ml-2' onclick='recepcionarPerdido(" + listaPedido[i].id_pedidoApp + "," + listaPedido[i].cliente_id + ")'>Recepcionar</button>";
                } else {
                    if (listaPedido[i].estado.toUpperCase() === "RECEPCIONADO") {
                        html += "<button class='ml-2' onclick='llamarRepartidor(" + listaPedido[i].id_pedidoApp + ")'>Llamar Repartidor</button>";
                    } else {
                        if (listaPedido[i].venta_id === 0 || listaPedido[i].venta_id === "0" || listaPedido[i].venta_id === "") {
                            html += "<button class='ml-2' onclick='realizarVenta(" + listaPedido[i].id_pedidoApp + ")'>Realizar Venta</button>";
                        } else {
                            html += "<button class='ml-2' onclick=\"redireccionar('Venta'," + listaPedido[i].venta_id + ")\")'>Ver Registro Venta</button>";
                        }
                    }
                }
                html += "    </div>";
                html += "  </div>";

                html += "</div>";
            }
            $("#formProducto").html(html);
            var html = "";
            for (var i = 0; i < listaDetalle.length; i++) {
                html = "<tr><td><div style='width: 75px;'>" + listaDetalle[i].codigo + "</div></td>";
                html += "<td><div class='grande'>" + listaDetalle[i].nombre + "</div></td>";
                html += "<td><div style='width: 47px;'>" + listaDetalle[i].cantidad + "</div></td>";
                html += "<td><div class='normal'>" + listaDetalle[i].nota + "</div></td></tr>";
                $("#p" + listaDetalle[i].pedidoApp_id).append(html);
            }
            //$("#formProducto").igualartabla();
        }
    });
}
function cancelarPerdido(pedido, cliente) {
    cargando2(true);
    $.post(url, {proceso: 'cancelarPedido', idpedido: pedido, idcliente: cliente}, function (response) {
        cargando2(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                cerrarSession(1);
            }
            alertaRapida(json.error, "error", 60);
        } else {
            $("#popupPedido").modal('hide');
            alertaRapida("El pedido fue cancelado", "confirmacion", 60);
            $("#nroNotificacionVenta").html(json.result);
        }
    });
}
function recepcionarPerdido(pedido, cliente) {
    cargando2(true);
    $.get(url, {proceso: 'recepcionarPedido', idpedido: pedido, idcliente: cliente}, function (response) {
        cargando2(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                cerrarSession(1);
            }
            alertaRapida(json.error, "error", 60);
        } else {
            alertaRapida("El pedido fue recepcionado", "confirmacion", 60);
            popPedidos();

        }
    });
}
function llamarRepartidor(pedido) {
    cargando2(true);
    $.get(url, {proceso: 'llamarRepartidor', idpedido: pedido}, function (response) {
        cargando2(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                cerrarSession(1);
            }
            alertaRapida(json.error, "error", 60);
        } else {
            alertaRapida("Se envio una notificacion al repartido", "confirmacion", 60);
            popPedidos();

        }
    });
}
function realizarVenta(pedido) {
    cargando2(true);
    $.post(url, {proceso: 'registrarVenta', idpedido: pedido}, function (response) {
        cargando2(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                cerrarSession(1);
            }
            alertaRapida(json.error, "error", 60);
        } else {
            $("#popupPedido").modal('hide');
            alertaRapida("El pedido fue recepcionado", "confirmacion", 60);
            id_Venta = json.result;
            estadoImpresion = true;
            Version();
        }
    });
}
function abrirDetallepedido(ele) {
    $(".itemPedido .detalle").ocultar();
    $(ele).find(".detalle").visible(1);
}
function iniciarPortal() {
    cargando2(true);
    $.get(url, {proceso: 'iniciar'}, function (response) {
        cargando2(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                cerrarSession(1);
            }
            alertaRapida(json.error, "error", 60);
        } else {
            sucursalOption = "<option value='0'>-- Sucursal --</option>";
            listaSucursal = json.result.sucursal;
            empresaD = json.result.empresa;

            conf = {};
            var configuracion = json.result.configuracionEmpresa;
            for (var i = 0; i < configuracion.length; i++) {
                conf[configuracion[i].configuracion_id] = true;
            }
            listaPermisos = json.result.permisos;
            listaPermisosUsuario = json.result.permisosUsuario;
            for (var i = 0 in listaSucursal) {
                listaSucursalRapida["s" + listaSucursal[i]["id_sucursal"]] = listaSucursal[i];
                sucursalOption += "<option value='" + listaSucursal[i]["id_sucursal"] + "' data-estado='" + listaSucursal[i].estado + "'>" + listaSucursal[i]["nombre"] + "</option>";
            }
            var categoria = json.result.categoria;
            var html = "<div class='p-1 d-inline-block ' >";
            html += "<img src='Imagen/Iconos/menuIcon.png' class='menuicon' onclick='menuApp()'/>";
            html += "</div>";

            
            var html2 = "";
            for (var i = 0; i < categoria.length; i++) {
                html2 += "<div class='pl-2 itemmenu  removeMenu ocultar' onclick=\"menu('" + categoria[i].nombre.toUpperCase() + "'," + categoria[i].id_CategoriaPermiso + ")\" id='sm" + categoria[i].id_CategoriaPermiso + "'>" + categoria[i].nombre + "</div>";
            }
            html += "<div class='pr-2 p-1 d-inline-block float-right' >";
            html += "<img src='Imagen/Iconos/salir.png' class='menuicon' onclick='cerrarSession(1)'/>";
            html += "</div>";
           /* if (empresaD.app === "activo") {
                html += "<div class='pr-2 p-1 d-inline-block float-right ' id='btnOnline' >";
                html += "<img src='Imagen/Iconos/online.png' class='menuicon' onclick='popPedidos()'/>";
                html += "<div id='nroNotificacionVenta'>" + json.result.nroPedidoPendiente + "</div>";
                html += "</div>";
                notificacionesPush();
            }*/


            $("#menu").html(html);
            if (empresaD.app === "activo") {
                if (json.result.nroPedidoPendiente !== "0") {
                    $("#btnOnline").addClass("latido");
                }
            }
            $("#submenu").html(html2);
            validarPermisos();
            if (estadoImpresion) {
                estadoImpresion = false;
                redireccionar('Venta', id_Venta);
                //localStorage.setItem("imprimir", "si"); problema chrome aveces bloque aveces no la impresion
                //imprimir();
            }
        }
    });
}
function menu(tipo, categoria) {
    $("#submenu .item").addClass("ocultarMenu");
    $("#submenu .tituloMenu").html(tipo);
    $(".p" + categoria).removeClass("ocultarMenu");

}
function redireccionarUrl(url, ele) {
    localStorage.removeItem("idventa");
    localStorage.removeItem("idcompra");
    localStorage.removeItem("idcliente");
    localStorage.removeItem("idproducto");
    localStorage.removeItem("idcobranza");
    menuApp();
    $("#submenu .item").removeClass("submenuSeleccionado");
    $(ele).addClass("submenuSeleccionado");
    $("#cuerpoProyeto").attr("src", url);
}
function cerrarSession(tipo) {
    localStorage.removeItem("usuario");
    if (tipo === 1) {
        window.location = "index.php";
    } else {
        window.location = "../index.php";
    }
}
$(window).bind("beforeunload", function () {
    /*$.post("PORTAL_CONTROLER", {}, function (response) {
     });*/
});
function redireccionar(tipo, id) {
    if (tipo === "Venta") {
        $("#popupPedido").modal('hide');
        localStorage.setItem("idventa", id);
        $("#cuerpoProyeto").attr("src", "./Formularios/Venta.html");
    }
}
function imprimir(nuevaVenta = true) {
    debugger
    cargando2(true);
    $.get(url, {idven: id_Venta, proceso: "imprimirVenta"}, function (response) {
        cargando2(false);
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
                    iframeImpresion.get(0).contentWindow.print();
                    if (window.parent.conf[5]) {
                        imprimirNotaVenta7cm(sucursal, venta, detalle);
                        setTimeout(() => {
                            iframeImpresion.get(0).contentWindow.print();
                            if (nuevaVenta && window.parent.conf[6]) {
                                imprimirCobranza();
                            }
                        }, 500);

                    } else {
                        if (nuevaVenta && window.parent.conf[6]) {
                            imprimirCobranza();
                        }
                    }

                }, 500);
            }
            if (sucursal.estructuraDocumentoVenta === "Hoja 7cm" && venta.tipoDocumento === "Nota de Venta") {
                imprimirNotaVenta7cm(sucursal, venta, detalle);
                iframeImpresion.get(0).contentWindow.print();
                if (nuevaVenta && window.parent.conf[6]) {
                    imprimirCobranza();
                }
            }
            if (sucursal.estructuraDocumentoVenta === "Hoja Carta" && venta.tipoDocumento === "Factura") {
                imprimirFacturaCarta(venta, detalle, sucursal);
                setTimeout(() => {
                    iframeImpresion.get(0).contentWindow.print();
                    if (window.parent.conf[5]) {
                        imprimirNotaVenta(venta, detalle);
                        setTimeout(() => {
                            iframeImpresion.get(0).contentWindow.print();
                            if (nuevaVenta && window.parent.conf[6]) {
                                imprimirCobranza();
                            }
                        }, 500);
                    } else {
                        if (nuevaVenta && window.parent.conf[6]) {
                            imprimirCobranza();
                        }
                    }
                }, 500);

            }
            if (sucursal.estructuraDocumentoVenta === "Hoja Carta" && venta.tipoDocumento === "Nota de Venta") {
                imprimirNotaVenta(venta, detalle);
                setTimeout(() => {
                    iframeImpresion.get(0).contentWindow.print();
                    if (nuevaVenta && window.parent.conf[6]) {
                        imprimirCobranza();
                    }
                }, 500);
            }
        }
    });
}
function imprimirCobranza() {
    cargando2(true);
    $.get(url, {proceso: "buscarCobranza", idventa: id_Venta}, function (response) {
        cargando2(false);
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

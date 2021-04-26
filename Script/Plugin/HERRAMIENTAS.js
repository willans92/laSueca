var imagenCargando = "../Imagen/Cargando.gif";
(function (a) {
    $.fn.extend({
        visible: function (tipo) {
            if (tipo === 1) {
                $(this).css("display", "block");
                $(this).focus();
            } else {
                $(this).css("display", "inline-block");
            }
        },
        igualartabla: function () {
            var tabla = $(this);
            tabla.find("tbody tr").click(function () {
                tabla.find("tbody tr").removeClass("Tuplaseleccionada");
                $(this).addClass("Tuplaseleccionada");
            });
            $(this).find("tbody").css("width", $(this).find("thead").width() + 20);
        },
        ocultar: function () {
            $(this).css("display", "none");
        },
        dragable: function (drag, drog, evento) {
            $(drag).draggable({
                revert: "invalid",
                refreshPositions: true,
                containment: 'parent',
                drag: function (event, ui) {
                    $(this).css({
                        cursor: "move",
                        opacity: "0.3",
                        transform: "scale(0.8,0.8)",
                    });
                },
                stop: function (event, ui) {
                    $(this).css({
                        cursor: "pointer",
                        opacity: "1",
                        transform: "scale(1,1)"
                    });
                }
            });
            $(drog).droppable({
                drop: evento
            });
        },
        limpiarFormulario: function () {
            $(this).find("input").val("");
            $(this).find(".error").text("");
            $(this).find(".correcto").text("");
            $(this).find("input").css("background", "white");
            $(this).find("input[type=number]").val(0);
            $(this).find("select option:eq(0)").attr("selected", true);
            $(this).find(".fecha").val(fechaActual());
        },
        centrar: function () {
            $(this).css({
                position: 'fixed',
                left: ($(window).width() - $(this).outerWidth()) / 2,
                top: 70
            });
            $(window).resize(function () {
                $(this).css({
                    position: 'fixed',
                    left: ($(window).width() - $(this).outerWidth()) / 2,
                    top: 70
                });
            });
        },
        msmPregunta: function (pregunta, funcion) {
            var result = "<div id='msmOK'>" +
                    "<div class='boxmensaje'>" +
                    "<div class='titulo'>ALERTA</div>" +
                    "<div class='mensaje'>" + pregunta + "</div>" +
                    "<div class='centrar'>" +
                    "<button onclick=\"ok(); " + funcion + "\" class='normal' >SI</button>" +
                    "<button onclick='ok()' class='normal no' >NO</button>" +
                    "</div>" +
                    "</div>" +
                    "</div>"
            $(this).append(result);
            $("#msmOK button").focus();
        }
        ,
        by: function (options) {
            var result = "<div class='background' id='backgroundAux'></div>" +
                    "<div id='by'>" +
                    "<div class='centrar negrilla'>SISTEMA DE LABORATORIOS UNIDOS \"LABUN\"</div>" +
                    "<div  style='margin-right: 19px; width: 100px; padding-top: 13px; float: left;'>" +
                    "<img src='IMAGENES/logo.png' alt=''/>" +
                    "</div>" +
                    "<div style='width: 250px; float: left;'>" +
                    "<span class='negrillaenter'>Hecho Por:</span>" +
                    "Ing. Williams Armando Montenegro Mansilla" +
                    "<span class='negrillaenter'>Telefono: </span>" +
                    "3251551 - 75685675" +
                    "<span class='negrillaenter'>Correo: </span>" +
                    "WdigitalSolution02@gmail.com" +
                    "</div>" +
                    "<span class='negrilla point' style='position: absolute; top: 4px; right: 6px;' onclick='cerrarBy()'>(x)</span>"
            "</div>";
            $(this).append(result);
            $("#by").visible(1);
            $("#by").centrar();
            $(".background").visible(1);
        }
        ,
        validar: function () {
            this.each(function () {
                var $this = $(this);
                var typ = $this.attr("type");
                switch (typ) {
                    case "text":
                        $this.focus(function () {
                            $this.keyup(function () {
                                var min = parseInt($this.data("min"));
                                var max = parseInt($this.data("max"));
                                var valor = $this.val().length;
                                if (valor >= min && valor <= max) {
                                    $this.css({"background-color": "#00ff00"});
                                    $this.next().text("");
                                } else {
                                    $this.next().text($this.next().data("acro") + " debe tener como minimo " + min + " caracteres y maximo " + max);
                                    $this.css({"background-color": "#e44e2d"});
                                }
                            });
                        });
                        break;
                    case "number":
                        $this.focus(function () {
                            $this.keyup(function () {
                                var min = parseInt($this.data("min"));
                                var max = parseInt($this.data("max"));
                                var valor = $this.val().length;
                                if (valor >= min && valor <= max) {
                                    $this.css({"background-color": "#00ff00"});
                                    $this.next().text("");
                                } else {
                                    $this.next().text($this.next().data("acro") + " debe tener como minimo " + min + " caracteres y maximo " + max);
                                    $this.css({"background-color": "#e44e2d"});
                                }

                            });
                        });
                        break;
                    case "email":
                        $this.focus(function () {
                            $this.keyup(function () {
                                var expresion = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
                                var valor = $this.val();
                                if (!expresion.test(valor)) {
                                    $this.css({"background-color": "#e44e2d"});
                                    $this.next().text($this.next().data("acro") + " electronico invalido");
                                } else {
                                    $this.css({"background-color": "#00ff00"});
                                    $this.next().text("");
                                }
                            });
                        });
                        break;
                    case "password":
                        $this.focus(function () {
                            $this.keyup(function () {
                                var min = parseInt($this.data("min"));
                                var max = parseInt($this.data("max"));
                                var valor = $this.val().length;
                                if (valor >= min && valor <= max) {
                                    $this.css({"background-color": "#00ff00"});
                                    $this.next().text("");
                                } else {
                                    $this.next().text($this.next().data("acro") + " debe tener como minimo " + min + " caracteres y maximo " + max);
                                    $this.css({"background-color": "#e44e2d"});
                                }
                            });
                        });
                        break;
                }
            });
        },
        validarActualizar: function () {
            this.each(function () {
                var $this = $(this);
                var typ = $this.attr("type");

                switch (typ) {
                    case "text":
                        var min = parseInt($this.data("min"));
                        var max = parseInt($this.data("max"));
                        var valor = $this.val().length;
                        if (valor >= min && valor <= max) {
                            $this.css({"background-color": "#00ff00"});
                            $this.next().text("");
                        } else {
                            $this.next().text($this.next().data("acro") + " debe tener como minimo " + min + " caracteres y maximo " + max);
                            $this.css({"background-color": "#e44e2d"});
                        }
                        break;
                    case "number":
                        var min = parseInt($this.data("min"));
                        var max = parseInt($this.data("max"));
                        var valor = $this.val().length;
                        if (isNaN($this.val())) {
                            $this.next().text($this.next().data("acro") + " debe ser de tipo numerico");
                            $this.css({"background-color": "#e44e2d"});
                            return;
                        }
                        if (valor >= min && valor <= max) {
                            $this.css({"background-color": "#00ff00"});
                            $this.next().text("");
                        } else {
                            $this.next().text($this.next().data("acro") + " debe tener como minimo " + min + " caracteres y maximo " + max);
                            $this.css({"background-color": "#e44e2d"});
                        }
                        break;
                    case "email":
                        var expresion = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
                        var valor = $this.val();
                        if (!expresion.test(valor)) {
                            $this.css({"background-color": "#e44e2d"});
                            $this.next().text($this.next().data("acro") + " electronico es invalido");
                        } else {
                            $this.css({"background-color": "#00ff00"});
                            $this.next().text("");
                        }
                        break;
                    case "password":
                        var min = parseInt($this.data("min"));
                        var max = parseInt($this.data("max"));
                        var valor = $this.val().length;
                        if (valor >= min && valor <= max) {
                            $this.css({"background-color": "#00ff00"});
                            $this.next().text("");
                        } else {
                            $this.next().text($this.next().data("acro") + " debe tener como minimo " + min + " caracteres y maximo " + max);
                            $this.css({"background-color": "#e44e2d"});
                        }
                        break;
                }
            });
        }
    });
})(jQuery);
$(document).ready(function () {
    $("input").click(function () {
        $(this).select();
    });
    $.datepicker.regional['es'] = {
        closeText: 'Cerrar',
        currentText: 'Hoy',
        monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
            'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié;', 'Juv', 'Vie', 'Sáb'],
        dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
        dateFormat: 'dd/mm/yy',
        firstDay: 1,
    };
    $.datepicker.setDefaults($.datepicker.regional["es"]);
    fechaEntrega = fechaActual();
    $(window).resize(function () {
        $(".cuerposearch").ocultar();
    });
});
function ok() {
    $("#backgroundAux").remove();
    $(".background").ocultar();
    $("#msmOK").remove();
}
function alertaRapida(mensaje, tipo = "confirmacion", marginTop = 0) {// error, confirmacion
    var alertaR = "";
    if (tipo === "confirmacion") {
        alertaR = "<div id='alertaRapida' class='alertaConfirmacion'>" + mensaje + "</div>";
    } else {
        alertaR = "<div id='alertaRapida'>" + mensaje + "</div>";

    }
    $("body").append(alertaR);
    var alerta = $("#alertaRapida");
    var alto = alerta.outerHeight() + 50;
    alerta.css("marginTop", "-" + alto + "px");
    alerta.animate({marginTop: marginTop}, 1000, () => {
        setTimeout(() => {
            alerta.animate({opacity: 0.25}, 1000, () => {
                alerta.remove();
            });
        }, 2000);
    });
}
function horaActual() {
    var f = new Date();
    var hora = f.getHours();
    var min = f.getMinutes();
    var seg = f.getSeconds();
    hora = hora < 10 ? "0" + hora : hora;
    min = min < 10 ? "0" + min : min;
    seg = seg < 10 ? "0" + seg : seg;
    return hora + ":" + min + ":" + seg;
}
function fechaActual() {
    var f = new Date();
    var dia = f.getDate();
    var mes = f.getMonth() + 1;
    var ano = f.getFullYear();
    dia = dia < 10 ? "0" + dia : dia;
    mes = mes < 10 ? "0" + mes : mes;
    return dia + "/" + mes + "/" + ano;
}
function fechaActualReporte() {
    var f = new Date();
    var dia = f.getDate();
    var mes = f.getMonth() + 1;
    var ano = f.getFullYear();
    dia = dia < 10 ? "0" + dia : dia;
    mes = mes < 10 ? "0" + mes : mes;
    return dia + "-" + mes + "-" + ano;
}
function cargando(estado) {
    if (estado) {
        var elemento = "<div  id='cargando' >"
                + "<div>"
                + "<img src='" + imagenCargando + "' title='CARGANDO'/>"
                + "<span class='negrillaenter centrar'>CARGANDO</span>"
                + "</div>";
        +"</div>";
        $("body").append(elemento);
    } else {
        $("#cargando").remove();
    }
}
function cargando2(estado) {
    if (estado) {
        var elemento = "<div  id='cargando' >"
                + "<div>"
                + "<img src='Imagen/Cargando.gif' title='CARGANDO'/>"
                + "<span class='negrillaenter centrar'>CARGANDO</span>"
                + "</div>";
        +"</div>";
        $("body").append(elemento);
    } else {
        $("#cargando").remove();
    }
}
var decodeHTMLList = (lista) => {
    for (let i in lista) {
        var valueString = JSON.stringify(lista[i]);
        var decodeString = valueString.replace(/&quot;/g, '\\"').replace(/&apos;/g, "'")
                .replace(/&lt;/g, '<').replace(/&amp;/g, '&').replace(/&gt;/g, '>')
                .replace(/&apos;/g, "'").replace(/&#039;/g, "'");
        lista[i] = JSON.parse(decodeString);
    }
    return lista;
};
var decodeHTML = function (html) {
    var result = html.replace(/&#(\d+);/g, function (match, dec) {
        if (match === "&#34;") {
            return "\"";
        }
        return String.fromCharCode(dec);
    });
    return result.replace(/&quot;/g, '\\"').replace(/&apos;/g, "'").replace(/&lt;/g, '<').replace(/&amp;/g, '&').replace(/&gt;/g, '>');
};
function format(input) {
    input = input === "" ? "0" : input;
    var decimal = parseFloat(input).toFixed(2).split(".");
    var num = decimal[0].replace(/\./g, '');
    num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g, '$1.');
    num = num.split('').reverse().join('').replace(/^[\.]/, '');
    var resultado = num + "," + decimal[1]
    return resultado.replace("-.", "-");
}
function decimalAdjust(type, value, exp) {//type=round ,floor, ceil   exp=en negativo cantidad desimales q see requiere
    var num = theform.original.value, rounded = theform.rounded
    var with2Decimals = num.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]
    rounded.value = with2Decimals
}
function selectText(ele) {
    $(ele).select();
}




// ACCIONES CARRITO

function cambiarItemCarrito(idProducto, cambio) {
    var carrito = localStorage.getItem("carrito");
    carrito = carrito ? $.parseJSON(carrito) : {};
    var listaCarrito = carrito.data ? carrito.data : {};
    var producto = listaCarrito[idProducto];
    producto.cantidad += cambio;
    if (producto.cantidad < 0) {
        producto.cantidad = 0;
    }
    listaCarrito[idProducto] = producto;
    var cantidadCarrito = 0;
    var total = 0;
    for (var item in listaCarrito) {
        if (listaCarrito[item].cantidad > 0) {
            var subtotal = listaCarrito[item].precio * listaCarrito[item].cantidad;
            total += subtotal;
            cantidadCarrito++;
            $("#car" + listaCarrito[item].id + " .precio").html("Bs. " + subtotal.toFixed(2));
        }
    }
    if (total === 0) {
        $("#btncontinuar1").ocultar();
    } else {
        $("#btncontinuar1").visible();
    }
    $(".foot .total").text("Bs. " + total.toFixed(2));
    $("#car" + producto.id + " input").val(producto.cantidad);
    $(".addCarrito span").text(cantidadCarrito);
    localStorage.setItem("carrito", JSON.stringify({data: listaCarrito, cantidadItem: cantidadCarrito}));
}
function abrirCarrito() {
    $("#popup").css("display", "block");
    $("#popCarrito").centrar();
    $("#popCarrito").css("display", "block");
    $("#popConfirmarSms").css("display", "none");
    $("#popCodigoPedido").css("display", "none");
    $("#popFinalizarPedido").css("display", "none");
    $("#popVerDetallePedido").css("display", "none");
    $("#popDatosEnvio").css("display", "none");
    $("#popDelivery").css("display", "none");
    $("#popDetalle").css("display", "none");
    var carrito = localStorage.getItem("carrito");
    carrito = carrito ? $.parseJSON(carrito) : {};
    var listaCarrito = carrito.data ? carrito.data : {};
    var html = "";
    var totalFinal = 0;
    for (var item in listaCarrito) {
        var producto = listaCarrito[item];
        var cantidad = parseFloat(producto.cantidad);
        var precio = parseFloat(producto.precio);
        var total = cantidad * precio;
        totalFinal += total;
        html += "<div class='boxItemCarrito' id='car" + producto.id + "'>";
        html += "<img src='" + producto.foto + "' >";
        html += "<div class='contenido'>";
        html += "        <div class='desripcion'>";
        html += "            <div class='nombre'>" + producto.nombre + "</div>";
        html += "            <div class='precioUni'>Bs. " + producto.precio + "</div>";
        html += "        </div>";
        
        
        html += "        <div class='contenidoModificable'>";
        
        html += "        <div class='cantidad'>";
        html += "                <div class='btn float-left' onclick='cambiarItemCarrito(" + producto.id + ",-1)'><img src='Imagen/Iconos/minus.png'  alt=''/></div>";
        html += "                <div class='btn float-right' onclick='cambiarItemCarrito(" + producto.id + ",1)'><img src='Imagen/Iconos/add.png'   alt=''/></div>";
        html += "                <input type='text' value='" + producto.cantidad + "' readonly>";
        html += "        </div>";
        html += "        <div class='precio'>";
        html += "            Bs. " + total.toFixed(2);
        html += "        </div>";
        
        html += "        </div>";
        
        
        html += "    </div>";
        html += "</div>";
    }
    if (totalFinal === 0) {
        $("#btncontinuar1").ocultar();
    } else {
        $("#btncontinuar1").visible();
    }
    $(".foot .total").text("Bs. " + totalFinal.toFixed(2));
    $("#popCarrito .cuerpo").html(html);
}
function ocultarPopup() {
    $("#popup").css("display", "none");
    $("#popCarrito").css("display", "none");
    $("#popConfirmarSms").css("display", "none");
            $("#popCodigoPedido").css("display", "none");
    $("#popDelivery").css("display", "none");
    $("#popDetalle").css("display", "none");
    $("#popFinalizarPedido").css("display", "none");
    $("#popBuscadorPedido").css("display", "none");
    $("#popVerDetallePedido").css("display", "none");
    $("#popDatosEnvio").css("display", "popDatosEnvio");
    var carrito = localStorage.getItem("carrito");
    carrito = carrito ? $.parseJSON(carrito) : {};
    var listaCarrito = carrito.data ? carrito.data : {};
    var cantidadCarrito = 0;
    var newList = {};
    for (var item in listaCarrito) {
        if (listaCarrito[item].cantidad > 0) {
            cantidadCarrito++;
            newList[listaCarrito[item].id] = listaCarrito[item];
        }
    }
    $(".addCarrito span").text(cantidadCarrito);
    localStorage.setItem("carrito", JSON.stringify({data: newList, cantidadItem: cantidadCarrito}));
    $(".itemProducto .btnaddNro").removeClass("btnaddNro");
    $(".btnadd span").text("+");
    sincronizarCarrito();
}
function realizarCompra() {
    var carrito = localStorage.getItem("carrito");
    carrito = carrito ? $.parseJSON(carrito) : {};
    var listaCarrito = carrito.data ? carrito.data : {};
    var cantidadCarrito = 0;
    for (var item in listaCarrito) {
        if (listaCarrito[item].cantidad > 0) {
            cantidadCarrito++;
        }
    }
    if (cantidadCarrito === 0) {
        alertaRapida("El carrito se encuentra vacío", "error");
        return;
    }
    $("#popCarrito").css("display", "none");
    $("#popConfirmarSms").css("display", "none");
            $("#popCodigoPedido").css("display", "none");
    $("#popFinalizarPedido").css("display", "none");
    $("#popDatosEnvio").css("display", "block");
    $("#popDelivery").css("display", "none");
    $("#popDetalle").css("display", "none");
    $("#popDatosEnvio").centrar();
    tocoMapa = false;
    abrirMap();
    cambiarDireccionEnvio();
}
function abrirMap() {
    cargando(true);
    try {
        var mapProp = {
            center: new google.maps.LatLng(lat, lon),
            zoom: 13,
            mapTypeControl: false,
            streetViewControl: false,
            disableDefaultUI: false,
            scaleControl: false,
            zoomControl: true,
            rotateControl: false,
            fullscreenControl: true,
            gestureHandling: 'greedy'
        };
        map = new google.maps.Map(document.getElementById("mapa"), mapProp);

        marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, lon),
            draggable: true,
            title: 'Arrastrame',
            animation: google.maps.Animation.BOUNCE,

        });
        marker.setMap(map);
        google.maps.event.addListener(map, 'click', function (event) {
            lat = event.latLng.lat();
            lon = event.latLng.lng();
            cambiarDireccionEnvio();
            marker.setPosition(event.latLng);
        });

    } catch (e) {
        cargando(false);
    }
    cargando(false);

}
function continuarDelivery() {
    var nombre = $("input[name=nombre]").val().trim();
    var telefono = $("input[name=telefono]").val().trim();
    var direccion = $("input[name=direccion]").val().trim();
    if (nombre.length === 0) {
        alertaRapida("El nombre es obligatorio", "error");
        $("input[name=nombre]").addClass("rojoClarito");
        return;
    } else {
        $("input[name=nombre]").removeClass("rojoClarito");
    }
    if (telefono.length < 7) {
        alertaRapida("El número de teléfono es invalido", "error");
        $("input[name=telefono]").addClass("rojoClarito");
        return;
    } else {
        $("input[name=telefono]").removeClass("rojoClarito");
    }
    if (isNaN(telefono)) {
        alertaRapida("El número de teléfono es invalido", "error");
        $("input[name=telefono]").addClass("rojoClarito");
        return;
    } else {
        $("input[name=telefono]").removeClass("rojoClarito");
    }
    if (direccion.length === 0) {
        alertaRapida("la dirección es obligatorio", "error");
        $("input[name=direccion]").addClass("rojoClarito");
        return;
    } else {
        $("input[name=direccion]").removeClass("rojoClarito");
    }
    if (tocoMapa) {
        alertaRapida("No ha seleccionado su dirección en el mapa de google", "error");
        return;
    }
    $("#popCarrito").css("display", "none");
    $("#popConfirmarSms").css("display", "none");
            $("#popCodigoPedido").css("display", "none");
    $("#popFinalizarPedido").css("display", "none");
    $("#popVerDetallePedido").css("display", "none");
    $("#popDelivery").css("display", "block");
    $("#popDetalle").css("display", "none");
    $("#popDatosEnvio").css("display", "none");
    $("#popDelivery").centrar();
    $("#fechaEntrega").html("<span class='negrilla'>Fecha Entrega:</span> " + fechaEntrega);
    $("#calendario").datepicker({
        changeMonth: true,
        changeYear: true,
        beforeShowDay: function (fecha) {
            var fechaActual = new Date();
            fechaActual.setDate(fechaActual.getDate() - 1);
            var validar = fecha >= fechaActual;
            return [validar];
        },
        onSelect: function (dateText) {
            fechaEntrega = dateText;
            $("#fechaEntrega").html("<span class='negrilla'>Fecha Entrega:</span> " + dateText);
            obtenerHorarioDisponible();
        }
    });
    obtenerHorarioDisponible();
}
function obtenerHorarioDisponible() {
    cargando(true);
    $.post(url, {proceso: "horarioDisponible", fecha: fechaEntrega}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error, "error");
        } else {
            var lista = json.result;
            var html = "";
            for (var i = 0; i < lista.length; i++) {
                html += "<li><input name='hora' type='radio' checked value='" + lista[i].detalle + "' > <span>" + lista[i].detalle + "</span></li>";
            }
            if (html == "") {
                html = "No hay horarios disponible de entrega en esta fecha. Seleccione otra fecha."
            }
            $("#hora").html(html);


        }
    });
}
function continuarEntrega() {
    if (fechaEntrega === "") {
        alertaRapida("Tiene que seleccionar una fecha de entrega", "error")
        return;
    }
    var hora = $("input[name=hora]:checked");
    if(hora.length==0){
        alertaRapida("No hay horario de entrega disponible", "error")
        return;
    }
    
    $("#popCarrito").css("display", "none");
    $("#popConfirmarSms").css("display", "none");
    $("#popCodigoPedido").css("display", "none");
    $("#popFinalizarPedido").css("display", "block");
    $("#popFinalizarPedido").centrar();
    $("#popDelivery").css("display", "none");
    $("#popVerDetallePedido").css("display", "none");
    $("#popDetalle").css("display", "none");
    $("#popDatosEnvio").css("display", "none");
    var carrito = localStorage.getItem("carrito");
    carrito = carrito ? $.parseJSON(carrito) : {};
    var listaCarrito = carrito.data ? carrito.data : {};
    var html = "";
    var totalFinal = 0;
    for (var item in listaCarrito) {
        var producto = listaCarrito[item];
        var cantidad = parseFloat(producto.cantidad);
        var precio = parseFloat(producto.precio);
        var total = cantidad * precio;
        totalFinal += total;
        html += "<div class='boxItemCarrito' >";
        html += "<div class='contenido'>";
        html += "<div class='desripcion'>";
        html += "<div class='nombre' style='height: auto;'>" + producto.nombre + "</div>";
        html += "<div class='precioUni'>Bs. " + precio + "</div>";
        html += "<div class='cantidad'>Cantidad: " + cantidad + "</div>";
        html += "</div>";
        html += "<div class='precio' style='padding-top: 0;'>";
        html += "Bs. " + total;
        html += "</div>";
        html += "</div>";
        html += "</div>";
    }
    $("#popFinalizarPedido .cuerpobox").html(html);
    $("#popFinalizarPedido .foot .total").text("Bs. " + totalFinal.toFixed(2));
}
function finalizarVenta(tipo=1) {//tipo 1 envia sms
    if(tipo==2){
        var telefono=$("input[name=smsTelefono]").val();
        if (telefono.length < 7) {
            alertaRapida("El número de teléfono es invalido", "error");
            return;
        }
        $("input[name=telefono]").val(telefono);
    }
    $("#boxReadSms").css("display", "block");
    var telefono=$("input[name=telefono]").val();
    $("#telefonoSms").text(telefono);
    $("#boxEditSms input").val(telefono);
    $("#boxEditSms").css("display", "none");
    $("#popConfirmarSms").css("display", "block");
    $("#popConfirmarSms").centrar();
    $("#popCarrito").css("display", "none");
    $("#popFinalizarPedido").css("display", "none");
    $("#popVerDetallePedido").css("display", "none");
    $("#popDelivery").css("display", "none");
    $("#popDetalle").css("display", "none");
    $("#popDatosEnvio").css("display", "none");
}
function editarTelefonoSms(tipo){
    if(tipo===1){
        $("#boxReadSms").css("display", "none");
        $("#boxEditSms").css("display", "block");
        var telefono=$("input[name=telefono]").val();
        $("#boxEditSms input").val(telefono);
    }else{
        $("#boxReadSms").css("display", "block");
        $("#boxEditSms").css("display", "none");
    }
     
}
function confirmarSmsVenta() {
    var carrito = localStorage.getItem("carrito");
    carrito = carrito ? $.parseJSON(carrito) : {};
    var listaCarrito = carrito.data ? carrito.data : {};
    var totalFinal = 0;
    var lista = [];
    for (var item in listaCarrito) {
        if (listaCarrito[item].cantidad > 0) {
            totalFinal += listaCarrito[item].precio * listaCarrito[item].cantidad;
            lista.push(listaCarrito[item]);
        }
    }
    var costoDelivery = 10;
    var sucursal = 63;
    var metodoPago = $("#metodopago option:selected").val();
    var hora = $("input[name=hora]:checked").val();
    var nombre = $("input[name=nombre]").val();
    var telefono = $("input[name=telefono]").val();
    var direccion = $("input[name=direccion]").val();
    var intrucciones = $("input[name=intrucciones]").val();
    cargando(true);
    $.post(url, {proceso: "registrarPedido", hora: hora, id_tienda: id_tienda, nombre: nombre, intrucciones: intrucciones
        , telefono: telefono, direccion: direccion, lat: lat, lon: lon, fechaEntrega: fechaEntrega,
        metodoPago: metodoPago, sucursal: sucursal, lista: lista, costoDelivery: costoDelivery, totalFinal: totalFinal}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error, "error");
        } else {
            pedidoView=json.result;
            $("#codePedido").html("LS"+pedidoView);
            localStorage.setItem("carrito", JSON.stringify({data: "", cantidadItem: 0}));
            $("#popCarrito").css("display", "none");
            $("#popConfirmarSms").css("display", "none");
            $("#popVerDetallePedido").css("display", "none");
            $("#popVerDetallePedido").css("display", "none");
            $("#popDelivery").css("display", "none");
            $("#popDetalle").css("display", "none");
            $("#popDatosEnvio").css("display", "none");
            $("#popCodigoPedido").css("display", "block");
            $("#popCodigoPedido").centrar();
            $("#popup").limpiarFormulario();
            sincronizarCarrito();
        }
    });
}
function cambiarDireccionEnvio() {
    var precioEconomico = 999999;
    var sucursalEconomica = 0;
    for (var i in listaSucursales) {
        var sucursal = listaSucursales[i];
        var distancia = calcularDistancia(sucursal.lat, sucursal.lon, lat, lon);
        distancia = distancia / 1000;
        for (var j = 0; j < tarifario.length; j++) {
            var tarifa = tarifario[j];
            var de = parseFloat(tarifa.de);
            var hasta = parseFloat(tarifa.hasta);
            if (distancia >= de && distancia <= hasta) {
                var precioTarifa = parseFloat(tarifa.precio);
                if (precioEconomico > precioTarifa) {
                    precioEconomico = precioTarifa;
                    sucursalEconomica = sucursal.id_sucursal;
                }
                break;
            }
        }
    }
    costoDelivery = precioEconomico;
    sucursal_id = sucursalEconomica;
    $("#txtCostoEnvio").text("Costo Envio Bs." + format(costoDelivery))
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
var itemDetalle = {};
function detalleProducto(tipo, id, nombre, detalle, img, precio,comision) {
    if (tipo === 1) {
        itemDetalle = {id: id, nombre: nombre, detalle: detalle, img: img, precio: precio,comision:comision};
        $("#detallePrecio").html("<span>Precio Bs.</span>" + format(precio));
        $("#detalleDesc").html(detalle);
        $("#detalleNombre").html(nombre);
        $("#popDetalle img").attr("src", img)
        $("#popup").css("display", "block");
        $("#popDetalle").centrar();
        $("#popDetalle").css("display", "block");
        $("#popFinalizarPedido").css("display", "none");
        $("#popDatosEnvio").css("display", "none");
        $("#popDelivery").css("display", "none");
        $("#popCarrito").css("display", "none");
        $("#popConfirmarSms").css("display", "none");
            $("#popCodigoPedido").css("display", "none");
    } else {
        $("#popup").ocultar();
        $("#popDetalle").ocultar();
    }
}
function agregarCarritoDetalleProducto() {
    modificarCarrito('', itemDetalle.id, itemDetalle.nombre, itemDetalle.foto, itemDetalle.precio,itemDetalle.comision);
    ocultarPopup();
}
function controladorItem(ele,accion = "agregar", idproducto, nombre, foto, precio,comision){
    var elemento=$(ele).parent();
    var carrito = localStorage.getItem("carrito");
    carrito = carrito ? $.parseJSON(carrito) : {};
    var listaCarrito = carrito.data ? carrito.data : {};
    if (!listaCarrito[idproducto]) {
       modificarCarrito(accion = "agregar", idproducto, nombre, foto, precio,comision); 
    }
    elemento.find("span").addClass("activo");
    elemento.find(".less").css("display","inline-block");
    elemento.find(".add").css("display","inline-block");
    var fecha = new Date();
    fecha.setSeconds(fecha.getSeconds() + 3);
    elemento.data("cronometro",fecha.getTime());
    var intervalo=setInterval(function(){
        var elemento=$(ele).parent();
        var fecha = new Date().getTime();    
        var cronometro=parseInt(elemento.data("cronometro"));
        if(fecha>cronometro){
            elemento.find("span").removeClass("activo");
            elemento.find(".less").css("display","none");
            elemento.find(".add").css("display","none");
            clearInterval(intervalo);
        }
       
    },1000);
    
}
function btnControl(ele,valorAccion){
    var elemento=$(ele).parent();
    var nombre=elemento.data("nombre");
    var comision=elemento.data("comision");
    var precio=elemento.data("precio");
    var foto=elemento.data("foto");
    var idproducto=elemento.data("id");
    var carrito = localStorage.getItem("carrito");
    carrito = carrito ? $.parseJSON(carrito) : {};
    var cantidadItem = carrito.cantidadItem;
    cantidadItem = cantidadItem ? cantidadItem : 0;
    var listaCarrito = carrito.data ? carrito.data : {};
    if (listaCarrito[idproducto]) {
        listaCarrito[idproducto].cantidad += valorAccion;
        if(listaCarrito[idproducto].cantidad<=0){
            elemento.find("span").removeClass("btnaddNro");
            elemento.find(".less").css("display","none");
            elemento.find(".add").css("display","none");
            elemento.find("span").text("+");
            delete listaCarrito[idproducto];
        }
    } else {
        cantidadItem += 1;
        listaCarrito[idproducto] = {id: idproducto, cantidad: 1, nombre: nombre, foto: foto, precio: precio,comision:comision};
    }
    carrito.cantidadItem = cantidadItem;
    carrito.data = listaCarrito;
    localStorage.setItem("carrito", JSON.stringify(carrito));
    sincronizarCarrito();
}
function modificarCarrito(accion = "agregar", idproducto, nombre, foto, precio,comision) {
    var carrito = localStorage.getItem("carrito");
    carrito = carrito ? $.parseJSON(carrito) : {};
    var cantidadItem = carrito.cantidadItem;
    cantidadItem = cantidadItem ? cantidadItem : 0;

    var valorAccion = 1;
    if (accion === "quitar") {
        valorAccion = -1;
    }

    var listaCarrito = carrito.data ? carrito.data : {};
    if (listaCarrito[idproducto]) {
        listaCarrito[idproducto].cantidad += valorAccion;
        $(".i" + idproducto + " span").text(listaCarrito[idproducto].cantidad);
        if (listaCarrito[idproducto].cantidad < 0) {
            delete listaCarrito[idproducto];
            cantidadItem -= 0;
            $(".i" + idproducto).removeClass("btnaddNro");
            $(".i" + idproducto + " span").text("+");
        } else {
            $(".i" + idproducto).addClass("btnaddNro");
        }
    } else {
        $(".i" + idproducto).addClass("btnaddNro");
        $(".i" + idproducto + " span").text(1);
        cantidadItem += 1;
        listaCarrito[idproducto] = {id: idproducto, cantidad: 1, nombre: nombre, foto: foto, precio: precio,comision:comision};
    }
    carrito.cantidadItem = cantidadItem;
    carrito.data = listaCarrito;
    $(".addCarrito span").text(cantidadItem);
    if (cantidadItem > 0) {
        $(".addCarrito").css("display", "block");
    } else {
        $(".addCarrito").css("display", "none");
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));
}
function sincronizarCarrito() {
    var carrito = localStorage.getItem("carrito");
    carrito = carrito ? $.parseJSON(carrito) : {};
    var cantidadItem = carrito.cantidadItem;
    cantidadItem = cantidadItem ? cantidadItem : 0;
    $(".btnaddNro span").text("+");
    $(".btnaddNro").removeClass("btnaddNro");
    var listaCarrito = carrito.data ? carrito.data : {};
    for (var item in listaCarrito) {
        var producto = listaCarrito[item];
        $(".i" + producto.id).addClass("btnaddNro");
        $(".i" + producto.id + " span").text(producto.cantidad);
    }
    $(".addCarrito span").text(cantidadItem);
    if (cantidadItem > 0) {
        $(".addCarrito").css("display", "block");
    } else {
        $(".addCarrito").css("display", "none");
    }
}
function cambioTamanoPantalla() {
    var buscador = $(".buscadorMenu");
    for (var i = 0; i < buscador.length; i++) {
        var contenedorBuscadorW = $(buscador[i]).width();
        var categoriaBuscadorW = $(buscador[i]).find(".categoria").width();
        var lupaBuscadorW = $(buscador[i]).find("img").width();
        var inputBuscador = contenedorBuscadorW - categoriaBuscadorW - lupaBuscadorW - 43;
        $(buscador[i]).find("input").css("width", inputBuscador + "px");
    }
    $(window).resize(function () {
        var buscador = $(".buscadorMenu");
        for (var i = 0; i < buscador.length; i++) {
            var contenedorBuscadorW = $(buscador[i]).width();
            var categoriaBuscadorW = $(buscador[i]).find(".categoria").width();
            var lupaBuscadorW = $(buscador[i]).find("img").width();
            var inputBuscador = contenedorBuscadorW - categoriaBuscadorW - lupaBuscadorW - 43;
            $(buscador[i]).find("input").css("width", inputBuscador + "px");
        }
    });
    var height=$(window).height();
    var calculando=(height-300)*0.80;
    $(".pop .cuerpo").css("max-height",calculando)
    sincronizarCarrito();
}
function buscadorPedidoPop(tipo){
    if(tipo==1){
        $("#popup").css("display", "block");
        $("#popBuscadorPedido").css("display", "block");
        $("#popBuscadorPedido").centrar();
        $("#popCarrito").css("display", "none");
        $("#popConfirmarSms").css("display", "none");
        $("#popCodigoPedido").css("display", "none");
        $("#popDatosEnvio").css("display", "none");
        $("#popFinalizarPedido").css("display", "none");
        $("#popVerDetallePedido").css("display", "none");
        $("#popDelivery").css("display", "none");
        $("#popDetalle").css("display", "none");
        $("input[name=buscadorPedido]").removeClass(".rojoClarito");
    }else{
        var codigo=$("input[name=buscadorPedido]").val().trim().toUpperCase();
        if(codigo===""){
            alertaRapida("Ingrese un código valido en el buscador","error");
            $("input[name=buscadorPedido]").addClass("rojoClarito");
            return;
        }
        $("input[name=buscadorPedido]").removeClass("rojoClarito");
        cargando(true);
        $.post(url, {proceso: "verificarCodigo", codigo: codigo}, function (response) {
            cargando(false);
            var json = $.parseJSON(response);
            if (json.error.length > 0) {
                if ("Error Session" === json.error) {
                    window.parent.cerrarSession();
                }
                alertaRapida(json.error, "error");
            } else {
                pedidoView=json.result;
                if(pedidoView!="0"){
                    verOrdenCompras();
                }else{
                    alertaRapida("Ingrese un código valido en el buscador","error");
                }
            }
        });
        
    }
    
}
function compartirWp(){
    var host=window.location.origin+"/laSueca/index.php?pv="+pedidoView;
    var whatsapp="https://wa.me/?text="+host;
    window.open(whatsapp, '_blank');
}
function verOrdenCompras() {
    cargando(true);
    $.get(url, {proceso: "verPedido", id_pedido: pedidoView}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error, "error");
        } else {
            $("#popup").css("display", "block");
            $("#popVerDetallePedido").css("display", "block");
            $("#popVerDetallePedido").centrar();
            $("#popCarrito").css("display", "none");
            $("#popConfirmarSms").css("display", "none");
            $("#popCodigoPedido").css("display", "none");
            $("#popBuscadorPedido").css("display", "none");
            $("#popDatosEnvio").css("display", "none");
            $("#popDelivery").css("display", "none");
            $("#popDetalle").css("display", "none");
            var pedido=json.result.pedido;
            
            var programado=pedido.fechaProgramada+" "+pedido.horaProgramada;
            var total=parseFloat(pedido.costoDelivery)+parseFloat(pedido.totalPedido);
            $("#txtSolicitado").text(pedido.solicitada);
            $("#txtEntregado").text(programado);
            $("#txtEstado").text(pedido.estado);
            $("#txtDireccion").text(pedido.direccion);
            $("#txtTelefono").text(pedido.teflCliente);
            $("#txtCliente").text(pedido.cliente);
            $("#txtIntruccion").text(pedido.intrucciones);
            $("#txtMonto").text(format(pedido.totalPedido)+" Bs");
            $("#txtDelivery").text(format(pedido.costoDelivery)+" Bs");
            $("#txtTotal").text(format(total)+" Bs");
            
            var detalle=json.result.detalle;
            var html="";
            for (var i = 0; i < detalle.length; i++) {
                var item=detalle[i];
                var total=parseFloat(item.precioU)*parseFloat(item.cantidad);
                html+="<tr><td><div class='medio'>"+item.nombre+"</div></td>";
                html+="<td><div class='pequeno derecha'>"+item.cantidad+"</div></td>";
                html+="<td><div class='pequeno derecha'>"+format(item.precioU)+"</div></td>";
                html+="<td><div class='normal derecha'>"+format(total)+"</div></td></tr>";
            }
            $("#prodDetalle tbody").html(html);
            $("#prodDetalle").igualartabla();
        }
    });
}
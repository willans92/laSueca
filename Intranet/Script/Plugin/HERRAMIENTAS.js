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
                top: 35
            });
            $(window).resize(function () {
                $(this).css({
                    position: 'fixed',
                    left: ($(window).width() - $(this).outerWidth()) / 2,
                    top: 35
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
    $(window).resize(function () {
        $(".cuerposearch").ocultar();
    });
    var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal !== null) {
        validarPermisos();
    }
    
});
function validar(tipo, texto) {
    texto = (texto + "").trim();
    switch (tipo) {
        case "texto":
            var expresion = /^[a-zA-Z\.\,\s-_º()=?¿/%$@!:;{}óíáéúñÍÁÉÚÓ]+$/;
            if (expresion.exec(texto + " ")) {
                return true;
            }
            break;
        case "correo":
            var expresion = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            if (expresion.test(texto))
                return true;
            break;
        case "cuenta":
            if (texto.length >= 4 && texto.length <= 8) {
                var expresion = /^[0-9a-zA-Z\.\,\s-_º()=?¿/%$@!:;{}óíáéúñÍÁÉÚÓ]+$/;
                if (expresion.exec(texto + " ")) {
                    return true;
                }
            }
            break;
        case "entero":
            var expresion = /^[0-9\s]+$/;
            if (expresion.exec(texto)) {
                return true;
            }
            break;
        case "decimal":
            var expresion = /^\d+(\.\d{1,2})?/;
            if (expresion.exec(texto)) {
                return true;
            }
            break;
        case "texto y entero":
            var expresion = /^[0-9a-zA-Z\.\,\s-_º()=?¿/%$@!:;{}óíáéúñÍÁÉÚÓ]+$/;
            if (expresion.exec(texto + " ")) {
                return true;
            }
            break;
    }
    return false;
}
function ok() {
    $("#backgroundAux").remove();
    $(".background").ocultar();
    $("#msmOK").remove();
}
function alertaRapida(mensaje, tipo = "confirmacion",marginTop=0) {// error, confirmacion
    var alertaR = "";
    if (tipo === "confirmacion") {
        alertaR = "<div id='alertaRapida' class='alertaConfirmacion'>" + mensaje + "</div>";
    } else {
        alertaR = "<div id='alertaRapida'>" + mensaje + "</div>";

    }
    $("body").append(alertaR);
    var alerta = $("#alertaRapida");
    var alto = alerta.outerHeight() + 20;
    alerta.css("marginTop", "-" + alto + "px");
    alerta.animate({marginTop: marginTop}, 1000, () => {
        setTimeout(() => {
            alerta.animate({opacity: 0.25}, 1000, () => {
                alerta.remove();
            });
        }, 2500);
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
var imagenAModificar;
function cargarImagen(input, tipo) {
    if (tipo === 1 || tipo === "1") {
        imagenAModificar = $(input);
        $("#fotocargar").remove();
        $("#canvas").remove();
        $("body").append("<input type='file' onchange='cargarImagen(this,2)' id='fotocargar' style='display: none;'/><canvas id='canvas' style='display: none;'></canvas>");
        $('#fotocargar').click();
        return;
    }
    if (input.files && input.files[0]) {
        cargando(true);
        var reader = new FileReader();
        reader.onload = function (e) {
            var canvas = document.getElementById("canvas");
            var ctx = canvas.getContext('2d');
            var img = new Image();
            img.onload = function () {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0, img.width, img.height);
                var imgCompleta = canvas.toDataURL(input.files[0].type);
                imagenAModificar.attr("src", imgCompleta);
                canvas.width = 300;
                canvas.height = 300;
                ctx.drawImage(img, 0, 0, 300, 300);
                imagenAModificar.data("peque", canvas.toDataURL(input.files[0].type));
                cargando(false);
                imagenAModificar = null;
                $("#fotocargar").remove();
                $("#canvas").remove();
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(input.files[0]);
    }
}
function tuplaSeleccionada(tabla) {
    var seleccionado = "";
    var lista = $("#" + tabla + " tbody tr");
    for (var i = 0; i < lista.length; i++) {
        if ($(lista[i]).css("background-color") === "rgb(23, 181, 102)") {
            $("#" + tabla + " tbody tr").css("background", "none");
            seleccionado = $(lista[i]);
            break;
        }
    }
    return seleccionado;
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
var openRequest;
function inicializarBaseDatos() {
    window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB;
    window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: "readwrite"};
    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
    if (!window.indexedDB) {
        window.alert("Su Navegador no soporta el sistema. Actualicelo.");
        return;
    }
    openRequest = indexedDB.open("lasueca", 1);
    openRequest.onupgradeneeded = function (e) {
        var thisDB = e.target.result;
        if (!thisDB.objectStoreNames.contains("")) {
            var version = thisDB.createObjectStore("version", {keyPath: "version"});
            var versionIndex = version.createIndex("version", "version", {unique: true});
            version.put({version: "versionusuario", nro: 0, datos: {}});
            version.put({version: "versioncliente", nro: 0, datos: {}});
            version.put({version: "versionproducto", nro: 0, datos: {}});
            version.put({version: "empresa", id: 0});
        }
    };
    cargando2(true);
    openRequest.onsuccess = function () {
        var db = openRequest.result;
        var tx = db.transaction('version', "readonly");
        var store = tx.objectStore('version');
        var index = store.index('version');
        var requestCliente = index.get('versioncliente');
        var requestUsuario = index.get('versionusuario');
        var requestProducto = index.get('versionproducto');
        requestCliente.onsuccess = function () {
            var dataSet = requestCliente.result;
            versionCliente = dataSet.nro;
            listaCliente = dataSet.datos;
            requestUsuario.onsuccess = function () {
                var dataSet = requestUsuario.result;
                versionUsuario = dataSet.nro;
                listaUsuario = dataSet.datos;
                requestProducto.onsuccess = function () {
                    var dataSet = requestProducto.result;
                    versionProducto = dataSet.nro;
                    listaProducto = dataSet.datos;
                    cargando2(false);
                    Version();
                };

            };
        };
    };
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
function Version() {
    setTimeout(() => {
        cargando2(true);
        $.get(url, {proceso: "version", versionCliente: versionCliente, versionUsuario: versionUsuario, versionProducto: versionProducto}, function (response) {
            cargando2(false);
            if ("-1" === response || response==="") {
                var db = openRequest.result;
                var tx = db.transaction("version", "readwrite");
                var store = tx.objectStore("version");
                var guardar = {version: "versioncliente", nro: 0, datos: {}};
                store.put(guardar);
                var guardar = {version: "versionusuario", nro: 0, datos: {}};
                store.put(guardar);
                var guardar = {version: "versionproducto", nro: 0, datos: {}};
                store.put(guardar);
                var guardar = {version: "empresa", id: 0};
                store.put(guardar);
                alertaRapida("Se Cerro la session. Vuelva a logearse Por favor.");
                window.location.href = "index.php";
                return;
            }
            var json = $.parseJSON(response);

            var cliente = json.cliente;
            if (cliente !== null) {
                for (var i = 0; i < cliente.length; i++) {
                    listaCliente["c" + cliente[i].id_cliente] = cliente[i];
                    if (parseInt(cliente[i].version) > versionCliente) {
                        versionCliente = parseInt(cliente[i].version);
                    }
                }
            }
            var producto = json.producto;
            if (producto !== null) {
                for (var i = 0; i < producto.length; i++) {
                    listaProducto["p" + producto[i].id_producto] = producto[i];
                    if (parseInt(producto[i].version) > versionProducto) {
                        versionProducto = parseInt(producto[i].version);
                    }
                }
            }
            var usuario = json.usuario;
            if (usuario !== null) {
                for (var i = 0; i < usuario.length; i++) {
                    listaUsuario["u" + usuario[i].id_usuario] = usuario[i];
                    if (parseInt(usuario[i].version) > versionUsuario) {
                        versionUsuario = parseInt(usuario[i].version);
                    }
                }
            }

            cargando2(true);
            var db = openRequest.result;
            var tx = db.transaction("version", "readwrite");
            var store = tx.objectStore("version");

            var guardar = {version: "empresa", id: json.empresa};
            var update = store.put(guardar);
            update.onsuccess = function () {
                var guardar = {version: "versioncliente", nro: versionCliente, datos: listaCliente};
                var update = store.put(guardar);
                update.onsuccess = function () {
                    var guardar = {version: "versionusuario", nro: versionUsuario, datos: listaUsuario};
                    var update = store.put(guardar);
                    update.onsuccess = function () {
                        var guardar = {version: "versionproducto", nro: versionProducto, datos: listaProducto};
                        var update = store.put(guardar);
                        update.onsuccess = function () {
                            cargando2(false);
                            decodeHTMLList(listaProducto);
                            decodeHTMLList(listaCliente);
                            decodeHTMLList(listaUsuario);
                            if ($("iframe").attr("src") !== "") {
                                $("iframe").contents().find("#actualizar").click();
                                return;
                            }
                            iniciarPortal();
                        };
                    };
                };
            };
        });
    }, 200);
}
function vaciarDBindex(onSusses) {
    window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB;
    window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: "readwrite"};
    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
    if (!window.indexedDB) {
        window.alert("Su Navegador no soporta el sistema. Actualicelo.");
        return;
    }
    openRequest = indexedDB.open("lasueca", 1);
    openRequest.onsuccess = function () {
        var db = openRequest.result;
        var tx = db.transaction("version", "readwrite");
        var store = tx.objectStore("version");
        var guardar = {version: "empresa", id: 0};
        var update = store.put(guardar);
        update.onsuccess = function () {
            var guardar = {version: "versioncliente", nro: 0, datos: []};
            var update = store.put(guardar);
            update.onsuccess = function () {
                var guardar = {version: "versionusuario", nro: 0, datos: []};
                var update = store.put(guardar);
                update.onsuccess = function () {
                    var guardar = {version: "versionproducto", nro: 0, datos: []};
                    var update = store.put(guardar);
                    update.onsuccess = function () {
                        onSusses();
                    };
                };
            };
        };
    };

}
function variables(formulario) {
    var result = {};
    var input = $(formulario).find("input");
    for (var i = 0; i < input.length; i++) {
        var nombre = $(input[i]).attr("name");
        var valor = $(input[i]).val().trim();

        result[nombre] = valor;
    }
    var select = $(formulario).find("select");
    for (var i = 0; i < select.length; i++) {
        var nombre = $(select[i]).attr("id");
        var valor = $(select[i]).find(" option:selected").val();
        result[nombre] = valor;
    }
    var textarea = $(formulario).find("textarea");
    for (var i = 0; i < textarea.length; i++) {
        var nombre = $(textarea[i]).attr("id");
        var valor = $(textarea[i]).val();
        result[nombre] = valor.replace(/\"/g, '').replace(/\'/g, '').trim();
    }
    return result;
}
function queryString(name) {
    var url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
    if (!results)
        return null;
    if (!results[2])
        return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
var isMobile = {
    Android: function () {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
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
//comboBox({identificador:, datos:, codigo:, texto:, callback:, todos: , extraBusqueda: , extraBusqueda2: , texto2: , OnBlur: ,vistaSeleccionado:})
function comboBox(opciones) {
    var identificador = opciones.identificador; // input que sera combobox
    var datos = opciones.datos;   //  listado de datos
    var codigo = opciones.codigo; // cual es el id del dato
    var texto = opciones.texto;   // texto que se vera al buscar
    var callback = opciones.callback; // cuando se precione enter o seleccione have una accion extra
    var extraBusqueda = opciones.extraBusqueda; // variable buscador extra
    var extraBusqueda2 = opciones.extraBusqueda2;// variable buscador extra
    var texto2 = opciones.texto2; // otro texto que se vera en el buscador
    var OnBlur = opciones.OnBlur; // metodo que va llamar cuando haga el onblur
    var todos = opciones.todos; // metodo que va llamar cuando haga el onblur
    var vistaSeleccionado = opciones.vistaSeleccionado; // opcional cuando selecciona datao que muestra input
    var valueDefault = opciones.valueDefault; // opcional cuando selecciona datao que muestra input
    var ordenarPor = opciones.ordenarPor; // opcional cuando selecciona datao que muestra input
    
    ordenarPor=ordenarPor?ordenarPor:texto;
    datos = Object.keys(datos).map((key) => datos[key]);

    var listaCombo = $(identificador);
    for (var i = 0; i < listaCombo.length; i++) {
        var cod = $(listaCombo).data("cod");
        var pos = $(listaCombo).data("pos");
        if (!cod) {
            $(listaCombo).data("cod", 0);
        }
        if (!pos) {
            $(listaCombo).data("pos", -1);
        }
    }
    if (valueDefault) {
        var posicion = datos.findIndex((item) => {
            return (item[codigo] + "") === (valueDefault + "")
        });
        $(identificador).data("cod", valueDefault);
        $(listaCombo).data("pos", posicion);
        var item = datos[posicion];
        var txt2 = "";
        if (texto2) {
            txt2 = " - " + item[texto2];
        }
        var view = item[texto] + txt2;
        if (vistaSeleccionado) {
            view = item[vistaSeleccionado];
        }
        $(listaCombo).val(view);
    }
    $(identificador).prop("autocomplete", "off");
    if (datos.length > 1) {
        datos = datos.sort(function (a, b) {
            var idA = a[ordenarPor];
            var idB = b[ordenarPor];
            if (idA < idB) {
                return -1;
            }
            return 1;
        });
    }

    $(identificador).off('blur');
    $(identificador).blur((e) => {
        setTimeout(() => {
            var target = $(e.target);
            var posicion = target.data("pos");
            var cod = parseInt(target.data("cod"));
            if (!posicion || posicion === -1) {
                posicion = datos.findIndex((item) => {
                    return (item[codigo] + "") === (cod + "")
                });
                if (!posicion || posicion === -1) {
                    $("#contenedorComboBox").remove();
                    target.val("");
                } else {
                    target.data("pos", posicion);
                }
            }
            var item = datos[posicion];
            if (!OnBlur) {
                if (cod > 0) {
                    var txt2 = "";
                    if (texto2) {
                        txt2 = " - " + item[texto2];
                    }
                    var view = item[texto] + txt2;
                    if (vistaSeleccionado) {
                        view = item[vistaSeleccionado];
                    }
                    target.val(view);
                } else {
                    target.val("");
                }
                $("#contenedorComboBox").remove();
            } else {
                OnBlur(item, posicion);
            }
        }, 300);
    });
    $(identificador).off('click');
    $(identificador).click((e) => {
        var target = $(e.target);
        target.select();
        $("#contenedorComboBox").remove();
    });
    $(identificador).off('keyup');
    $(identificador).keyup((e) => {
        if (e.keyCode === 9 || e.keyCode === 27) {
            $("#contenedorComboBox").remove();
            return;
        }
        var target = $(e.target);
        var contenedor = $("#contenedorComboBox");
        if (contenedor.length === 0) {
            if (e.keyCode === 38 || e.keyCode === 40) {
                return;
            }
            $("body").append(" <div class='cuerposearch' style='width:" + target.outerWidth() + "px' id='contenedorComboBox'></div>");
            contenedor = $("#contenedorComboBox");

            contenedor.scroll(() => {
                var contador = 0;
                var indice = parseInt(target.data("indice"));
                if (contenedor[0].offsetHeight + contenedor[0].scrollTop === contenedor[0].scrollHeight) {
                    var html = "";
                    var buscarTxt = (target.val() + "").toUpperCase();
                    for (var i = 0; i < datos.length && contador < 20; i++) {
                        indice++;
                        var nombre = (datos[i][texto] + "");
                        var txt2 = "";
                        if (texto2) {
                            txt2 = " - " + datos[i][texto2];
                        }
                        if (nombre.toUpperCase().indexOf(buscarTxt) >= 0 || txt2.toUpperCase().indexOf(buscarTxt) >= 0
                                || (extraBusqueda && (datos[i][extraBusqueda] + "").toUpperCase().indexOf(buscarTxt) >= 0)
                                || (extraBusqueda2 && (datos[i][extraBusqueda2] + "").toUpperCase().indexOf(buscarTxt) >= 0)) {
                            html += " <div class='itemsearch' data-pos='" + i + "' >" + nombre + txt2 + "</div>";
                            contador++;
                        }
                    }
                    contenedor.append(html);
                    $(".itemsearch").off('click');
                    $(".itemsearch").click((event) => {
                        var aux = $(event.target);
                        var posicion = aux.data("pos") + "";
                        if (posicion === "-1") {
                            target.val("");
                            target.data("cod", "0");
                            target.data("pos", "-1");
                        } else {
                            var item = datos[posicion];
                            var txt2 = "";
                            if (texto2) {
                                txt2 = " - " + item[texto2];
                            }
                            var view = item[texto] + txt2;
                            if (vistaSeleccionado) {
                                view = item[vistaSeleccionado];
                            }
                            target.val(view);
                            target.data("pos", posicion);
                            target.data("cod", item[codigo]);
                        }
                        if (callback) {
                            callback(item, posicion);
                        }
                        contenedor.remove();
                    });
                    target.data("indice", indice);
                }
            });
        }

        if (e.keyCode === 38) {//arriba
            var item = contenedor.find("div.amarilloClarito");
            var index = item.index();
            if (index > 0) {
                item.removeClass("amarilloClarito");
                var newItem = item.prev();
                newItem.addClass("amarilloClarito");
                contenedor.animate({
                    scrollTop: newItem.position().top + (contenedor.scrollTop())
                }, 100);
            }
            return;
        }
        if (e !== "" && e.keyCode === 40) {//abajo
            var item = contenedor.find("div.amarilloClarito");
            var index = item.index();
            if (index < contenedor.find("div").length - 1) {
                item.removeClass("amarilloClarito");
                var newItem = item.next();
                newItem.addClass("amarilloClarito");
                contenedor.animate({
                    scrollTop: newItem.position().top + (contenedor.scrollTop())
                }, 100);
            }
            return;
        }
        if (e.keyCode === 13) {
            var lista = contenedor.find("div.amarilloClarito");
            if (lista.length === 0) {
                return;
            }
            var aux = $(lista[0]);
            var posicion = aux.data("pos") + "";
            if (posicion === "-1") {
                target.val("");
                target.data("cod", "0");
                target.data("pos", "-1");
            } else {
                var item = datos[posicion];
                var txt2 = "";
                if (texto2) {
                    txt2 = " - " + item[texto2];
                }
                var view = item[texto] + txt2;
                if (vistaSeleccionado) {
                    view = item[vistaSeleccionado];
                }
                target.val(view);
                target.data("cod", item[codigo]);
                target.data("pos", posicion);
            }
            if (callback) {
                callback(item, posicion);
            }
            contenedor.remove();
            return;
        }
        var buscarTxt = (target.val() + "").toUpperCase();
        var contador = 0;
        var indice = 0;
        var html = "";
        if (todos) {
            html = "<div class='itemsearch' data-pos='-1' >-- Todos --</div>";
        }
        for (var i = 0; i < datos.length && contador < 20; i++) {
            indice++;
            var nombre = (datos[i][texto] + "");
            var txt2 = "";
            if (texto2) {
                txt2 = " - " + datos[i][texto2];
            }
            if (nombre.toUpperCase().indexOf(buscarTxt) >= 0 || txt2.toUpperCase().indexOf(buscarTxt) >= 0
                    || (extraBusqueda && (datos[i][extraBusqueda] + "").toUpperCase().indexOf(buscarTxt) >= 0)
                    || (extraBusqueda2 && (datos[i][extraBusqueda2] + "").toUpperCase().indexOf(buscarTxt) >= 0)) {
                html += " <div class='itemsearch' data-pos='" + i + "' >" + nombre + txt2 + "</div>";
                contador++;
            }
        }
        contenedor.html(html);
        contenedor.find("div:eq(0)").addClass("amarilloClarito");
        $(".itemsearch").off('click');
        $(".itemsearch").click((event) => {
            var aux = $(event.target);
            var posicion = aux.data("pos") + "";
            if (posicion === "-1") {
                target.val("");
                target.data("cod", "0");
                target.data("pos", "-1");
            } else {
                var item = datos[posicion];
                var txt2 = "";
                if (texto2) {
                    txt2 = " - " + item[texto2];
                }
                var view = item[texto] + txt2;
                if (vistaSeleccionado) {
                    view = item[vistaSeleccionado];
                }
                target.val(view);
                target.data("pos", posicion);
                target.data("cod", item[codigo]);
            }
            if (callback) {
                callback(item, posicion);
            }
            contenedor.remove();
        });
        contenedor.animate({
            scrollTop: 0
        }, 100);
        target.data("indice", indice);
        if (contador > 0) {
            var alto = target.outerHeight();
            var posicion = target.offset();
            var left = posicion.left;
            var top = posicion.top;
            contenedor.css({
                top: (top + alto),
                left: left
            });
            contenedor.visible(1);
        } else {
            contenedor.remove();

        }
    });
}
function prepararWebServices(metodo, jsonData) {
    var soapMessage =
            '<?xml version="1.0" encoding="utf-8"?>' +
            '    <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" ' +
            '    x0mlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/" ' +
            '    xmlns:tns="urn:miservicio1" xmlns:types="urn:miservicio1/encodedTypes" ' +
            '    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
            '    xmlns:xsd="http://www.w3.org/2001/XMLSchema">' +
            '    <soap:Body soap:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">' +
            '        <tns:' + metodo + '>';
    for (var item in jsonData) {
        soapMessage += '<' + item + ' xsi:type="xsd:string">' + jsonData[item] + '</' + item + '>';
    }
    soapMessage += '</tns:' + metodo + '> </soap:Body></soap:Envelope>';
    return soapMessage;
}
function exportarExcel(tabla, titulo, tipo = "xlsx") {
    cargando(true);
    setTimeout(function () {
        var lista = $("#" + tabla).find("tr");
        var elemento = "<table id='tablaExcel'><thead>";
        for (var i = 0; i < lista.length; i++) {
            var tr = $(lista[i]).find("div");
            if ($(lista[i]).css("display") === "none")
                continue;
            elemento += "<tr>";
            for (var j = 0; j < tr.length; j++) {
                var ele = $(tr[j]).children();
                if ($(tr[j]).parent().css("display") === "none")
                    continue;
                var texto = "";
                if (ele.is('input')) {
                    texto = ele.val();

                }
                if (ele.is('select')) {
                    texto = ele.find("option:selected").text();
                }
                if (texto === "") {
                    texto = $(tr[j]).text();
                }
                if (parseFloat(texto)) {
                    texto = texto.replace(/\./g, '').replace(/\,/g, '.');
                }
                if (i === 0) {
                    elemento += "<th> " + texto.trim() + " </th>";
                } else {

                    elemento += "<td> " + texto.trim() + " </td>";
                }
            }
            elemento += "</tr>";
            if (i === 0) {
                elemento += "</thead><tbody>";
            }
        }
        elemento += "</tbody></table>";
        $("body").append(elemento);
        $.fn.tableExport.csvSeparator = '|';
        $.fn.tableExport.csvEnclosure = '';
        $.fn.tableExport.csvUseBOM = false;
        $.fn.tableExport.preventInjection = false;
        $('#tablaExcel').tableExport({type: tipo, fileName: titulo + ' ' + fechaActualReporte()});
        $("#tablaExcel").remove();
        cargando(false);

    }, 100);

}

var hijosEliminadosRecursivos = [];
var reporteEncabezadoHead = "";
function imprimirReporte(json) {
    var contenido = json.contenido;
    var titulo = json.titulo;
    var subtitulo = json.subtitulo;
    var sucursal_id = json.sucursal_id;
    var encabezadoThead = json.encabezadoThead;
    var datosHead = json.datosHead;
    var htmlFoot = json.htmlFoot;
    var htmlDerecha = json.htmlDerecha;
    var altoFoot = json.altoFoot;
    var noImprimir = json.noImprimir;
    htmlFoot = !htmlFoot ? "" : htmlFoot;
    altoFoot = !altoFoot ? 0 : altoFoot;
    htmlDerecha = !htmlDerecha ? "" : htmlDerecha;
    datosHead = !datosHead ? "" : datosHead;
    subtitulo = !subtitulo ? "" : subtitulo;
    if (!contenido) {
        alert("No ha ingresado el contenido para generar el reporte.");
        return;
    }
    if (!titulo) {
        alert("No ha ingresado el titulo para generar el reporte.");
        return;
    }
    if (!sucursal_id) {
        alert("No ha ingresado la sucursal para generar el reporte.");
        return;
    }
    $("body").append("");

    reporteEncabezadoHead = "";
    hijosEliminadosRecursivos = [];
    window.parent.iframeImpresion.contents().find("body").html("");
    var pagina = 1;
    modeloImpresionReporte(contenido, sucursal_id, titulo, subtitulo, datosHead, htmlFoot, htmlDerecha, pagina);
    var ultimaHojaCarta = window.parent.iframeImpresion.contents().find("body div.hojaCarta:last-child");
    ultimaHojaCarta.find(".paginaActual").text(pagina);

    if (encabezadoThead) {
        var thead = ultimaHojaCarta.find(".contenidoImresionDatos thead").html();
        reporteEncabezadoHead = "<table class='table tableSinheadBorde'><thead class='thead-light'>" + thead + "</thead></table>";
        window.parent.iframeImpresion.contents().find("thead").remove();
    }
    var tamanoHeigth = $(ultimaHojaCarta[0]).outerHeight();
    var tamanoHoja = 1420;
    while (tamanoHeigth > tamanoHoja) {
        var tamanoHeader = ultimaHojaCarta.find("div.cabezaRow").outerHeight();
        var tamanoDisponible = tamanoHoja - tamanoHeader;
        var contenido = ultimaHojaCarta.find("div.contenidoImresionDatos");
        pagina++;
        var nuevaHoja = calcularAltoConteneido(tamanoDisponible, contenido);

        modeloImpresionReporte(nuevaHoja, sucursal_id, titulo, subtitulo, datosHead, htmlFoot, htmlDerecha, pagina);


        ultimaHojaCarta = window.parent.iframeImpresion.contents().find("body div.hojaCarta:last-child");
        ultimaHojaCarta.find(".paginaActual").text(pagina);
        tamanoHeigth = $(ultimaHojaCarta[0]).outerHeight();
    }
    window.parent.iframeImpresion.contents().find("body .cantPagina").text(pagina);
    window.parent.iframeImpresion.contents().find(".encabezadoThead").html(reporteEncabezadoHead);
    if (!noImprimir) {
        setTimeout(() => {
            window.parent.iframeImpresion.get(0).contentWindow.print();
        }, 1000);
    }
}
function modeloImpresionReporte(contenido, sucursal_id, titulo, subtitulo, datosHead, htmlFoot, htmlDerecha, pagina) {
    var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal === null) {
        window.parent.cerrarSession();
        return;
    }
    usuarioLocal = $.parseJSON(usuarioLocal);
    var listaSucursal = window.parent.listaSucursal;
    var sucursal = listaSucursal.filter(value => (value.id_sucursal + "") === (sucursal_id + ""))[0];
    var nombreSucursal = (sucursal.nombre + "");
    var direccionSucursal = (sucursal.direccion + "");
    var correo = (sucursal.correo + "");
    var telefono = sucursal.telefono;
    telefono = telefono != "" ? ", Telf: " + telefono : "";
    correo = correo != "" ? ", Correo: " + correo : "";
    var empresaD = window.parent.empresaD;
    var nombreEmpresa = empresaD.nombreEmpresa;

    var html = "<div class='hojaCarta' style='height:auto;'>";
    html += "        <div class='row cabezaRow mb-3'>";
    html += "            <div class='col-2 centrar'>";
    html += "                <div><img src='" + sucursal.logo + "' class='logo'/></div>";
    html += "            </div>";
    html += "            <div class='col-3 centrar' >";
    html += "                <div class='negrilla'>" + nombreEmpresa + "</div>";
    html += "                <div class='negrilla' style='font-size: 15px;'>" + nombreSucursal + "</div>";
    html += "                <div style='font-size: 15px;'>" + direccionSucursal + " " + telefono + " " + correo + "</div>";
    html += "                <div style='font-size: 15px;'>" + sucursal.ciudad + " - " + sucursal.pais + "</div>";
    html += "            </div>";
    html += "            <div class='col-3 centrar'>";
    html += "                <h4>" + titulo.toUpperCase() + "</h4>";
    html += "                <h6>" + subtitulo + "</h6>";
    html += "            </div>";
    html += "<div class='col-4'>";
    html += "<div class='centrar' style='font-size: 15px;margin-bottom: 8px; text-align: right'>Página <span class='paginaActual'></span> de <span class='cantPagina'></span></div>";
    if (htmlDerecha === "") {
        html += "    <div> ";
        html += "       <div class='inlineblock mr-2 negrilla'>Fecha: </div>";
        html += "       <div class='inlineblock'>" + fechaActual() + "</div>";
        html += "   </div>";
        html += "    <div> ";
        html += "       <div class='inlineblock mr-2 negrilla'>Hora: </div>";
        html += "       <div class='inlineblock'>" + horaActual() + "</div>";
        html += "   </div>";
        html += "    <div> ";
        html += "       <div class='inlineblock mr-2 negrilla'>Generado Por: </div>";
        html += "       <div class='inlineblock'>" + usuarioLocal.nombre + "</div>";
        html += "   </div>";
    } else {
        html += htmlDerecha;

    }
    html += "</div>";
    html += "        </div>";

    html += "        <div class='row mb-2'>";
    html += "            <div class='col-12 '>" + datosHead + "</div>";
    html += "        </div>";

    html += "        <div class='row'>";
    html += "            <div class='col-12 encabezadoThead'>" + reporteEncabezadoHead + "</div>";
    html += "        </div>";


    html += "        <div class='row'>";
    html += "            <div class='col-12 contenidoImresionDatos'>";
    html += contenido;
    html += "            </div>";
    html += "        <div class='row'>";
    html += htmlFoot;
    html += "        </div>";
    html += "        </div>";
    window.parent.iframeImpresion.contents().find("body").append(html);
}
function calcularAltoConteneido(tamanoDisponible, elemento) {
    var copiaTamano = tamanoDisponible;
    var hijos = $(elemento).children();
    var paddT = $(elemento).innerWidth() - $(elemento).width();
    var paddB = $(elemento).innerHeight() - $(elemento).height();
    var paddingPadre = paddT + paddB;
    var noEliminarPadre = false;
    var nuevaHoja = "";
    for (var i = 0; i < hijos.length; i++) {
        var hijoSelect = $(hijos[i]);
        var tamanoHijo = hijoSelect.outerHeight() + paddingPadre;
        if (copiaTamano - tamanoHijo < 0) {
            var nietos = hijoSelect.children();
            if (nietos.length === 0 || copiaTamano < 0) {
                copiaTamano -= tamanoHijo;
                hijosEliminadosRecursivos.push(hijoSelect);
                nuevaHoja += $('<div>').append($(hijoSelect).clone()).html();
            } else {
                var datosHojaNueva = calcularAltoConteneido(copiaTamano, hijoSelect);
                nuevaHoja += datosHojaNueva;
                tamanoHijo = hijoSelect.outerHeight() + paddingPadre;
                if (hijoSelect.outerHeight() === 0 || datosHojaNueva.length > 0) {
                    copiaTamano = -1;
                    noEliminarPadre = true;
                } else {
                    copiaTamano -= tamanoHijo;
                }
            }
        } else {
            copiaTamano -= tamanoHijo;
        }
    }
    if (!$(elemento).hasClass("contenidoImresionDatos")) {
        var padreclonado = $(elemento).clone().html(nuevaHoja);
        var padreCopy = $('<div>').append(padreclonado);
        nuevaHoja = padreCopy.html();
    }

    for (var i = 0; i < hijosEliminadosRecursivos.length; i++) {
        hijosEliminadosRecursivos[i].remove();
    }
    hijosEliminadosRecursivos = [];

    if (copiaTamano < 0 && !noEliminarPadre) {
        hijosEliminadosRecursivos.push(elemento);
    }
    return nuevaHoja;
}
function imprimirDocumentoCobranza(cobranza, detalle, callback) {
    listaCuentasXCliente = {};
    for (var i = 0; i < detalle.length; i++) {
        if (!listaCuentasXCliente[detalle[i].cliente_id]) {
            listaCuentasXCliente[detalle[i].cliente_id] = [];
        }
        listaCuentasXCliente[detalle[i].cliente_id].push({id_venta: detalle[i].venta_id
            , pago: parseFloat(detalle[i].monto), desc: detalle[i].detalle
            , fecha: detalle[i].fechaFacturacion, nro: detalle[i].nroDocVenta});
    }
    var listaCliente = window.parent.listaCliente;
    var html = "";
    var totalGeneral = 0;
    for (var i in listaCuentasXCliente) {
        var item = listaCuentasXCliente[i];
        var cliente = listaCliente["c" + i];
        html += "<div class='itemCobranza'>";
        html += "<div style='padding-bottom:15px;'><span class='negrilla' style='margin-right: 6px;'>Código: </span><span class='subrayar' onclick=\"redireccionar('Cliente'," + i + ")\">" + cliente.codigo + " </span><span class='negrilla' style='margin-right: 6px; margin-left: 6px;'>CI: </span><span>" + cliente.ci + "</span><span class='negrilla' style='margin-right: 6px; margin-left: 24px;'>Cliente: </span>" + cliente.nombre + "</div>";
        html += "<table class='table'>";
        html += "    <thead class='thead-light'>";
        html += "    <th><div class='pequeno'>Facturado</div></th>";
        html += "    <th><div class='normal'>Doc. de Venta</div></th>";
        html += "    <th><div class='grande2'>Detalle</div></th>";
        html += "    <th><div class='normal'>Monto Cobrado</div></th>";
        html += "    </thead>";
        html += "<tbody>";
        var total = 0;
        for (var j = 0; j < item.length; j++) {
            var valor = item[j];
            var monto = parseFloat(valor.pago);
            total += monto;
            html += "<tr>";
            html += "    <td><div class='pequeno'>" + valor.fecha + "</div></td>";
            html += "    <td><div class='normal subrayar' onclick=\"redireccionar('Venta'," + valor.id_venta + ")\">" + valor.nro + "</div></td>";
            html += "    <td><div class='grande2'>" + valor.desc + "</div></td>";
            html += "    <td><div class='normal derecha'>" + format(monto) + "</div></td>";
            html += "</tr>";
        }
        totalGeneral += total;
        html += "</tbody>";
        html += "<tfoot>";
        html += "    <td><div class='pequeno'></div></td>";
        html += "    <td><div class='normal'></div></td>";
        html += "    <td><div class='grande2 derecha'>TOTAL</div></td>";
        html += "    <td><div class='normal derecha'>" + format(total) + "</div></td>";
        html += "<tfoot>";
        html += "</table> ";
        html += "</div>";
    }
    html += "<div style='margin-top: 17px;'>";
    html += "<table  class='table'>";
    html += "<tfoot>";
    html += "    <td style='border: none;'><div class='pequeno'></div></td>";
    html += "    <td style='border: none;'><div class='normal'></div></td>";
    html += "    <td style='border: none;'><div class='grande2 derecha'>TOTAL COBRADO</div></td>";
    html += "    <td style='border: none;'><div class='normal derecha'>" + format(totalGeneral) + "</div></td>";
    html += "<tfoot>";
    html += "</table> ";
    html += "</div> ";

    var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal === null) {
        window.parent.cerrarSession();
        return;
    }
    usuarioLocal = $.parseJSON(usuarioLocal);
    var nroDocumento = cobranza.nroDocumento;
    var fecha = cobranza.fecha;
    var listaUsuario = window.parent.listaUsuario;
    var cobrador = listaUsuario["u" + cobranza.cobradoPor];
    var detalle = cobranza.detalle;
    var tipoCambio = 6.96;// esta fijo cambiar
    var metodoPago = cobranza.metodoPago;
    var datosHead = "<div class=''><span class='negrilla'>Nro. Documento: </span>" + nroDocumento + "</div>";
    datosHead += "<div class='inlineblock' style='width:230px;'><span class='negrilla'>Fecha : </span>" + fecha + "</div>";
    datosHead += "<div class='inlineblock grande3'><span class='negrilla'>Detalle : </span>" + detalle + "</div>";
    datosHead += "<div class='inlineblock' style='width:230px;'><span class='negrilla'>Metodo Pago: </span>" + metodoPago + "</div>";
    datosHead += "<div class='inlineblock' style='width: 730px;'><span class='negrilla'>Cobrodor: </span>" + cobrador.nombre + "</div>";
    datosHead += "<div class='inlineblock medio'><span class='negrilla'>Tipo Cambio: </span>" + tipoCambio + "</div><br>";


    var htmlFoot = "";
    if (cobranza.estado !== "activo") {
        htmlFoot += "<div class='col-12 negrilla centrar' style='font-size:16px; color:red;'><div class='p-3'>ESTE DOCUMENTO SE ENCUENTRA ELIMINADO Y NO PUEDE SER UTILIZADO COMO DESCARGO DE CUENTA</div></div>";
    } else {
        var empresa = window.parent.empresaD;
        if (empresa.firmaCobranza1 !== "" && empresa.firmaCobranza2 !== "") {
            htmlFoot += "<div class='col-3'></div>";
        }
        if (empresa.firmaCobranza1 !== "") {
            htmlFoot += "<div class='col-3 centrar negrilla'><div style='border-top: solid 1px black; margin: 5px 23px;margin-top: 120px;'>" + empresa.firmaCobranza1 + "</div></div>";
        }
        if (empresa.firmaCobranza2 !== "") {
            htmlFoot += "<div class='col-3 centrar negrilla'><div style='border-top: solid 1px black; margin: 5px 23px;margin-top: 120px;'>" + empresa.firmaCobranza2 + "</div></div>";
        }

        if (empresa.firmaCobranza1 !== "" && empresa.firmaCobranza2 !== "") {
            htmlFoot += "<div class='col-3'></div>";
        }
    }


    imprimirReporte({contenido: html, sucursal_id: cobranza.sucursal_id, titulo: "DOCUMENTO DE COBRANZA", datosHead: datosHead, htmlFoot: htmlFoot, altoFoot: 150});
    if (callback) {
        callback();
    }
}
function redireccionar(tipo, id) {
    if (tipo === "Venta") {
        localStorage.setItem("idventa", id);
        $(location).attr('href', "Venta.html");
    }
    if (tipo === "Cobranza") {
        localStorage.setItem("idcobranza", id);
        $(location).attr('href', "RegistroCobranza.html")
    }
    if (tipo === "Compra") {
        localStorage.setItem("idcompra", id);
        $(location).attr('href', "Compra.html");
    }
    if (tipo === "Cliente") {
        localStorage.setItem("idcliente", id);
        $(location).attr('href', "ListaCliente.html");
    }
    if (tipo === "Producto") {
        localStorage.setItem("idproducto", id);
        $(location).attr('href', "Producto.html");
    }
    if (tipo === "AjusteInventario") {
        localStorage.setItem("idajuste", id);
        $(location).attr('href', "AjusteInventario.html");
    }
    if (tipo === "Traspaso") {
        localStorage.setItem("idtraspaso", id);
        $(location).attr('href', "TraspasoProducto.html");
    }
}
function imprimirFacturaCarta(venta, detalle, sucursal) {
    var titulo = "FACTURA";
    var nroFactura = venta.nroDocumento;
    var fecha = venta.fecha;
    var listaUsuario = window.parent.listaUsuario;
    var vendedor = listaUsuario["u" + venta.usuario_id];
    var nitSucursal = sucursal.nit;
    var nroAutorizacion = venta.Autorizacion;
    var rz = (venta.razonsocial + "").replace(/"/g, '\"').replace(/"/g, "\'").toUpperCase();
    var nit = venta.nit;
    var codigoControl = (venta.codigoControl + "").toUpperCase();
    var fechalimite = venta.fechaLimiteEmision;
    var actividadEconomica = venta.actividadEconomica.replace(/"/g, '\"').replace(/"/g, "\'");
    var mensajeImpuesto = venta.mensajeImpuesto.replace(/"/g, '\"').replace(/"/g, "\'");

    var contenido = "";
    var htmlderecha = "";

    htmlderecha += "<div class='datosEmpresa'>";
    htmlderecha += "    <div>NIT: " + nitSucursal + "</div>";
    htmlderecha += "    <div>FACTURA Nº " + nroFactura + "</div>";
    htmlderecha += "    <div>AUTORIZACIÓN Nº " + nroAutorizacion + "</div>";
    htmlderecha += "</div>";
    htmlderecha += "<div class='negrilla centrar mt-1'>ORIGINAL</div>";
    htmlderecha += "<div>Actividad Económica: " + actividadEconomica + "</div>";

    var htmlhead = "<div class='row'> ";
    htmlhead += "<div class='col-3'> ";
    htmlhead += "       <div class='inlineblock mr-2 negrilla'>Fecha:</div>";
    htmlhead += "       <div class='inlineblock'>" + fecha + "</div>";
    htmlhead += "   </div>";
    htmlhead += "   <div class='col-3'>";
    htmlhead += "       <div class='inlineblock mr-2 negrilla'>NIT/CI:</div>";
    htmlhead += "       <div class='inlineblock'>" + nit + "</div>";
    htmlhead += "   </div>";
    htmlhead += "   <div class='col-6'>";
    htmlhead += "       <div class='inlineblock mr-2 negrilla'>Señor(es):</div>";
    htmlhead += "       <div class='inlineblock'>" + rz + "</div>";
    htmlhead += "   </div>";
    htmlhead += "</div>";

    var conf = window.parent.conf;
    var wLote = 100;
    var wvencimiento = 100;
    var wproducto = 400;
    var wfoot = 881;
    var contenido = "<table>";
    contenido += "<thead>";
    contenido += "  <th><div style='width:90px;'>CANT.</div></th>";
    if (conf[3]) {
        contenido += "  <th><div style='width:" + wLote + "px;'>NRO.LOTE</div></th>";
    } else {
        wproducto += wLote;
        wLote = 0;
    }
    if (conf[2]) {
        contenido += "  <th><div style='width:" + wvencimiento + "px;'>F.VENC.</div></th>";
    } else {
        wproducto += wvencimiento;
        wvencimiento = 0;
    }

    contenido += "  <th><div style='width:" + wproducto + "px;'>CONCEPTO</div></th>";
    contenido += "  <th><div style='width:100px;'>PRECIO U.</div></th>";
    contenido += "  <th><div style='width:95px;'>DESC.</div></th>";
    contenido += "  <th><div style='width:100px;'>SUBTOTAL</div></th>";
    contenido += "</thead>";
    contenido += "<tbody class='detalleprd'>";
    var total = 0;
    var Totaldescuento = 0;
    for (var i = 0; i < detalle.length; i++) {
        total += parseFloat(detalle[i]["precioTotal"]);

        var cant = parseFloat(detalle[i]["cantidad"]);
        var descuento = parseFloat(detalle[i]["descuento"]);
        var precio = parseFloat(detalle[i]["precio"]);

        Totaldescuento += parseFloat(descuento);

        var lote = detalle[i]["lote"];
        var nroLote = "";
        var fechaLote = "";
        if (lote !== "") {
            lote = lote.split("|=|");
            nroLote = lote[1].replace(/"/g, '\"').replace(/"/g, "\'");
            fechaLote = lote[0];
        }

        var nombreProducto = detalle[i]["nombre"].replace(/"/g, '\"').replace(/"/g, "\'");
        contenido += "<tr>";
        contenido += "    <td><div style='width:90px;' >" + cant + "</div></td>";
        if (conf[3]) {
            contenido += "    <td><div style='width:" + wLote + "px;'>" + nroLote + "</div></td>";
        }
        if (conf[2]) {
            contenido += "    <td><div style='width:" + wvencimiento + "px;'>" + fechaLote + "</div></td>";
        }
        contenido += "    <td><div style='width:" + wproducto + "px;' class='izquierda'>" + nombreProducto + "</div></td>";
        contenido += "    <td ><div style='width:100px;' class='derecha'>" + format(precio) + "</div></td>";
        contenido += "    <td><div style='width:100px;'  class='derecha'>" + format(descuento) + "</div></td>";
        contenido += "    <td><div style='width:100px;' class='derecha'>" + format(detalle[i]["precioTotal"]) + "</div></td>";
        contenido += "</tr>";
    }
    contenido += "</tbody>";
    contenido += "<tfoot>";
    contenido += "   <tr class='txtTotal' style='margin-top: 6px;'>";
    contenido += "       <td style='width: " + wfoot + "px; text-align: left;' class='txtTotal'>SON: " + NumeroALetras(total) + "</td>";
    contenido += "       <td style='width:100px;' class='derecha'>SUBTOTAL Bs</td>";
    contenido += "       <td style='width:100px;' class='derecha'>" + format(total + Totaldescuento) + "</td>";
    contenido += "   </tr>";
    contenido += "   <tr  class='txtTotal'>";
    contenido += "       <td style='width: " + wfoot + "px; text-align: left;' class='txtTotal'></td>";
    contenido += "       <td style='width:100px;' class='derecha'>DESC. Bs</td>";
    contenido += "       <td style='width:100px;' class='derecha'>" + format(Totaldescuento) + "</td>";
    contenido += "   </tr>";
    contenido += "   <tr  class='txtTotal'>";
    contenido += "       <td style='width: " + wfoot + "px; text-align: left; font-weight: normal;'>";
    contenido += "          <span class='negrilla'>Vendedor:</span>" + (vendedor.nombre+"").replace(/"/g, '\"').replace(/"/g, "\'") + "</td>";
    contenido += "       <td style='width:100px;' class='derecha'>TOTAL Bs</td>";
    contenido += "       <td style='width:100px;' class='derecha'>" + format(total) + "</td>";
    contenido += "   </tr>";
    contenido += "</tfoot>";
    contenido += "</table>";

    contenido += "<div class='row mt-4'>";
    contenido += "   <div class='col-2 centrar'>";
    contenido += "       <div class='qrcodigo' style=' width: 150px; height: 150px;'>";
    contenido += "   </div>";
    contenido += "</div>";
    contenido += "<div class='col-9'>";
    contenido += "    <div class='mt-3'>CODIGO DE CONTROL: " + codigoControl + "</div>";
    contenido += "    <div class='mt-1'>FECHA LIMITE DE EMISION: " + fechalimite + "</div>";
    contenido += "    <div class='mt-1'>'ESTA FACTURA CONTRIBUYE AL DESARROLLO DEL PAIS. EL USO ILICITO DE ESTA SERA SANCIONADO DE ACUERDO A LEY</div>";
    contenido += "    <div class='mt-1'>" + mensajeImpuesto + "</div>";
    contenido += "</div>";


    imprimirReporte({contenido: contenido, sucursal_id: venta.sucursal_id, titulo: titulo, datosHead: htmlhead, encabezadoThead: true, htmlDerecha: htmlderecha, noImprimir: true});

    var mensaje = nit + "|" + nroFactura + "|" + nroAutorizacion + "|" + fecha + "|" + (total.toFixed(2)) + "|" + (total.toFixed(2)) + "|" + codigoControl + "|" + nit + "|0.00|0.00|0.00|0.00";

    var codigoqr = window.parent.iframeImpresion.contents().find("body .qrcodigo");
    $(codigoqr[0]).qrcode({
        render: 'image',
        size: 150,
        color: '#000000',
        text: mensaje
    });

}
function imprimirFactura7cm(sucursal, venta, detalle) {
    var nombreSucursal = (sucursal.nombre + "").replace(/"/g, '\"').replace(/"/g, "\'").toUpperCase();
    var direccionSucursal = (sucursal.direccion + "").replace(/"/g, '\"').replace(/"/g, "\'").toUpperCase();
    var correo = (sucursal.correo + "").replace(/"/g, '\"').replace(/"/g, "\'").toUpperCase();
    var telefono = sucursal.telefono;
    var nitSucursal = sucursal.nit;
    var empresa = window.parent.empresaD;
    var nombreEmpresa = empresa.nombreEmpresa.replace(/"/g, '\"').replace(/"/g, "\'");

    var nroFactura = venta.nroDocumento;
    var nroAutorizacion = venta.Autorizacion;
    var fecha = venta.fecha;
    var documento = (venta.tipoDocumento + "").toUpperCase();
    var rz = (venta.razonsocial + "").replace(/"/g, '\"').replace(/"/g, "\'").toUpperCase();
    var nit = venta.nit;
    var codigoControl = (venta.codigoControl + "").toUpperCase();
    var fechalimite = venta.fechaLimiteEmision;
    var actividadEconomica = venta.actividadEconomica.replace(/"/g, '\"').replace(/"/g, "\'");
    var mensajeImpuesto = venta.mensajeImpuesto.replace(/"/g, '\"').replace(/"/g, "\'");
    correo = correo !== "" ? ", CORREO:" + correo : "";
    telefono = telefono !== "" ? ", TELF.:" + telefono : "";
    var html = " <div class='impresion7cm' >";
    html += " 	<div class='bloque'>";
    html += " 		<div>" + nombreEmpresa + "</div>";
    html += " 		<div>" + nombreSucursal + "</div>";
    html += " 		<div>" + direccionSucursal + " " + telefono + " " + correo + "</div>";
    html += " 		<div>" + sucursal.ciudad + " - " + sucursal.pais + "</div>";
    html += " 		<br>";
    html += " 		<div>FACTURA</div>";
    html += " 	</div>";
    if (documento === "FACTURA") {
        html += " 	<div class='bloque'>";
        html += " 		<div>NIT: " + nitSucursal + "</div>";
        html += " 		<div>FACTURA NRO.: " + nroFactura + "</div>";
        html += " 		<div>AUTORIZACION NRO.:" + nroAutorizacion + "</div>";
        html += " 	</div>";
    } else {
        html += " 	<div class='bloque'>";
        html += " 		<div>DOCUMENTO NRO.: " + nroFactura + "</div>";
        html += " 	</div>";
    }
    html += " 	<div class='bloque'>";
    html += " 		<div>ACTIVIDAD: " + actividadEconomica + "</div>";
    html += " 		<BR>";
    html += " 		<div class='izquierda'>";
    html += " 			<div>Fecha : " + fecha + "</div>";
    html += " 			<div>Nombre : " + rz + "</div>";
    html += " 			<div>NIT/CI : " + nit + "</div>";
    html += " 		</div>";
    html += " 	</div>";
    html += " 	<div class='bloque'>";
    html += " 		<table>";
    html += " 			<thead>";
    html += " 			<th><div style='width: 180px'>DETALLE</div></th>";
    html += " 			<th><div style='width: 50px'>CANT.</div></th>";
    html += " 			<th><div style='width: 70px'>P.U</div></th>";
    html += " 			<th><div style='width: 80px'>TOTAL</div></th>";
    html += " 			</thead>";
    html += " 			<tbody>";
    var total = 0;
    var totalDescuento = 0;
    for (var i = 0; i < detalle.length; i++) {
        var desc = parseFloat(detalle[i]["descuento"]);
        totalDescuento += desc;
        var subtotal = parseFloat(detalle[i]["precioTotal"]);
        total += subtotal;
        var nombreProducto = detalle[i]["nombre"].replace(/"/g, '\"').replace(/"/g, "\'");
        html += " <tr>";
        html += " 	<td><div style='width: 180px;'>" + nombreProducto + "</div></td>";
        html += " 	<td><div style='width: 50px; text-align: right;'>" + detalle[i]["cantidad"] + "</div></td>";
        html += " 	<td><div style='width: 70px; text-align: right;'>" + format(detalle[i]["precio"]) + "</div></td>";
        html += " 	<td><div style='width: 80px; text-align: right;'>" + format(subtotal + desc) + "</div></td>";
        html += " </tr>";
    }

    html += " 			</tbody>";
    html += "<tfoot>";
    html += " <tr>";
    html += "<td><div style='width: 180px;'></div></td>";
    html += "<td><div style='width: 50px;'></div></td>";
    html += "<td><div style='width: 70px; text-align: right;'>SUBTOTAL</div></td>";
    html += "<td><div style='width: 80px; text-align: right;'>" + format(total + totalDescuento) + "</div></td>";
    html += " </tr>";
    html += " <tr>";
    html += "<td><div style='width: 180px;'></div></td>";
    html += "<td><div style='width: 50px;'></div></td>";
    html += "<td><div style='width: 70px; text-align: right;'>DESC.</div></td>";
    html += "<td><div style='width: 80px; text-align: right;'>" + format(totalDescuento) + "</div></td>";
    html += " </tr>";
    html += " <tr>";
    html += "<td><div style='width: 180px;'></div></td>";
    html += "<td><div style='width: 50px;'></div></td>";
    html += "<td><div style='width: 70px; text-align: right;'>TOTAL</div></td>";
    html += "<td><div style='width: 80px; text-align: right;'>" + format(total) + "</div></td>";
    html += " </tr>";
    html += "</tfoot>";
    html += " 		</table>";

    html += "<div class='left'>SON: " + NumeroALetras(total) + "</div>";
    html += " 	</div>";
    html += " 	<div class='bloque'>";
    if (documento === "FACTURA") {
        html += " 		<div>CODIGO DE CONTROL: " + codigoControl + "</div>";
        html += " 		<div>FECHA LIMITE DE EMISION : " + fechalimite + "</div>";
        html += " 		<div class='qrcodigo'>";
        html += " 		</div>";
        html += " 		<div class='izquierda'>'ESTA FACTURA CONTRIBUYE AL DESARROLLO DEL PAIS. EL USO ILICITO ";
        html += " 			DE ESTA SERA SANCIONADO DE ACUERDO A LA LEY'</div>";
        html += " 		<div class='izquierda'>" + mensajeImpuesto + "</div><BR><BR>";
    }

    html += " 		<div>GRACIAS POR SU COMPRA</div>";
    html += " 	</div>";
    html += " </div>";

    window.parent.iframeImpresion.contents().find("body").html(html);

    var mensaje = nit + "|" + nroFactura + "|" + nroAutorizacion + "|" + fecha + "|" + (total.toFixed(2)) + "|" + (total.toFixed(2)) + "|" + codigoControl + "|" + nit + "|0.00|0.00|0.00|0.00";

    var codigoqr = window.parent.iframeImpresion.contents().find("body .qrcodigo");
    $(codigoqr[0]).qrcode({
        render: 'image',
        size: 150,
        color: '#000000',
        text: mensaje
    });

}
function imprimirNotaVenta7cm(sucursal, venta, detalle) {
    var nombreSucursal = (sucursal.nombre + "").replace(/"/g, '\"').replace(/"/g, "\'").toUpperCase();
    var direccionSucursal = (sucursal.direccion + "").replace(/"/g, '\"').replace(/"/g, "\'").toUpperCase();
    var correo = (sucursal.correo + "").replace(/"/g, '\"').replace(/"/g, "\'").toUpperCase();
    var telefono = sucursal.telefono;
    var empresa = window.parent.empresaD;
    var nombreEmpresa = (empresa.nombreEmpresa+"").replace(/"/g, '\"').replace(/"/g, "\'");

    var nroFactura = venta.nroDocumento;
    var fecha = venta.fecha;
    correo = correo !== "" ? ", CORREO:" + correo : "";
    telefono = telefono !== "" ? ", TELF.:" + telefono : "";
    var listaClientes = window.parent.listaCliente;
    var cliente = listaClientes["c" + venta.cliente_id];
    var listaUsuario = window.parent.listaUsuario;
    var vendedor = listaUsuario["u" + venta.usuario_id];
    var html = " <div class='impresion7cm' >";
    html += " 	<div class='bloque'>";
    html += " 		<div>" + nombreEmpresa + "</div>";
    html += " 		<div>" + nombreSucursal + "</div>";
    html += " 		<div>" + direccionSucursal + " " + telefono + " " + correo + "</div>";
    html += " 		<div>" + sucursal.ciudad + " - " + sucursal.pais + "</div>";
    html += " 	</div>";

    html += " 	<div class='bloque'>";
    html += " 		<div>NOTA DE VENTA</div>";
    html += " 		<div>Nro.: " + nroFactura + "</div>";
    html += " 	</div>";

    html += " 	<div class='bloque'>";
    html += " 		<div class='izquierda'>";
    html += " 			<div>Fecha Venta : " + fecha.substring(0, 10) + "</div>";
    html += " 			<div>Estado Entrega : " + venta.estadoEntrega + "</div>";
    html += " 			<div>Entrega Programada : " + venta.fechaEntrega + "</div>";
    html += " 			<div>Fecha Entregada : " + venta.fechaEntrega + "</div>";
    html += " 			<div>Nro. Factura : " + nroFactura + "</div>";
    html += " 		</div>";
    html += " 	</div>";


    html += " 	<div class='bloque'>";
    html += " 		<div class='izquierda'>";
    html += " 			<div>Código Cliente : " + (cliente.codigo+"").replace(/"/g, '\"').replace(/"/g, "\'") + "</div>";
    html += " 			<div>Cliente : " + (cliente.nombre+"").replace(/"/g, '\"').replace(/"/g, "\'") + "</div>";
    html += " 			<div>Dirección : " + (venta.direccionEntrega+"").replace(/"/g, '\"').replace(/"/g, "\'") + "</div>";
    html += " 			<div>Vendedor : " + (vendedor.nombre+"").replace(/"/g, '\"').replace(/"/g, "\'") + "</div>";
    html += " 		</div>";
    html += " 	</div>";



    html += " 	<div class='bloque'>";
    html += " 		<table>";
    html += " 			<thead>";
    html += " 			<th><div style='width: 180px'>DETALLE</div></th>";
    html += " 			<th><div style='width: 50px'>CANT.</div></th>";
    html += " 			<th><div style='width: 70px'>P.U</div></th>";
    html += " 			<th><div style='width: 80px'>TOTAL</div></th>";
    html += " 			</thead>";
    html += " 			<tbody>";
    var total = 0;
    var totalDescuento = 0;
    for (var i = 0; i < detalle.length; i++) {
        var desc = parseFloat(detalle[i]["descuento"]);
        totalDescuento += desc;
        var subtotal = parseFloat(detalle[i]["precioTotal"]);
        total += subtotal;
        var nombreProducto = detalle[i]["nombre"].replace(/"/g, '\"').replace(/"/g, "\'");
        html += " <tr>";
        html += " 	<td><div style='width: 180px;'>" + nombreProducto + "</div></td>";
        html += " 	<td><div style='width: 50px; text-align: right;'>" + detalle[i]["cantidad"] + "</div></td>";
        html += " 	<td><div style='width: 70px; text-align: right;'>" + format(detalle[i]["precio"]) + "</div></td>";
        html += " 	<td><div style='width: 80px; text-align: right;'>" + format(subtotal + desc) + "</div></td>";
        html += " </tr>";
    }

    html += " 			</tbody>";
    html += "<tfoot>";
    html += " <tr>";
    html += "<td><div style='width: 180px;'></div></td>";
    html += "<td><div style='width: 50px;'></div></td>";
    html += "<td><div style='width: 70px; text-align: right;'>SUBTOTAL</div></td>";
    html += "<td><div style='width: 80px; text-align: right;'>" + format(total + totalDescuento) + "</div></td>";
    html += " </tr>";
    html += " <tr>";
    html += "<td><div style='width: 180px;'></div></td>";
    html += "<td><div style='width: 50px;'></div></td>";
    html += "<td><div style='width: 70px; text-align: right;'>DESC.</div></td>";
    html += "<td><div style='width: 80px; text-align: right;'>" + format(totalDescuento) + "</div></td>";
    html += " </tr>";
    html += " <tr>";
    html += "<td><div style='width: 180px;'></div></td>";
    html += "<td><div style='width: 50px;'></div></td>";
    html += "<td><div style='width: 70px; text-align: right;'>TOTAL</div></td>";
    html += "<td><div style='width: 80px; text-align: right;'>" + format(total) + "</div></td>";
    html += " </tr>";
    html += "</tfoot>";
    html += "</table>";
    html += "<div class='left'>SON: " + NumeroALetras(total) + "</div>";
    html += "</div>";

    html += "<div class='bloque izquierda'>";
    html += "   <div class='izquierda'>GLOSA: " + (venta.comentario+"").replace(/"/g, '\"').replace(/"/g, "\'") + "</div>";
    html += "</div>";

    html += "<div class='bloque'>";
    html += "   <div class='row' style='margin-left: 22px;'>";
    var empresa = window.parent.empresaD;
    if (empresa.firmaNotaVenta1 !== "") {
        html += "<div class='col-5 boxfirma'><div style='border-top: solid 1px black; margin: 5px 0px;margin-top: 120px; font-size: 13px;'>" + empresa.firmaNotaVenta1 + "</div></div>";
    }
    if (empresa.firmaNotaVenta2 !== "") {
        html += "<div class='col-5 boxfirma'><div style='border-top: solid 1px black; margin: 5px 0px;margin-top: 120px; font-size: 13px;'>" + empresa.firmaNotaVenta2 + "</div></div>";
    }
    if (empresa.firmaNotaVenta3 !== "") {
        html += "<div class='col-5 boxfirma'><div style='border-top: solid 1px black; margin: 5px 0px;margin-top: 120px; font-size: 13px;'>" + empresa.firmaNotaVenta3 + "</div></div>";
    }
    if (empresa.firmaNotaVenta4 !== "") {
        html += "<div class='col-5 boxfirma'><div style='border-top: solid 1px black; margin: 5px 0px;margin-top: 120px; font-size: 13px;'>" + empresa.firmaNotaVenta4 + "</div></div>";
    }
    html += "   </div>";
    html += "</div>";


    html += "<div class='bloque'>";
    html += "   <div>GRACIAS POR SU COMPRA</div>";
    html += "</div>";

    window.parent.iframeImpresion.contents().find("body").html(html);

}
function imprimirNotaVenta(venta, detalle) {
    var titulo = "NOTA DE VENTA";
    var subtitulo = "Nro. " + venta.nroNota;
    var listaClientes = window.parent.listaCliente;
    var nroFactura = venta.nroDocumento;
    var fecha = venta.fecha;
    var tipoVenta2 = venta.tipoVenta;
    var cliente = listaClientes["c" + venta.cliente_id];
    var listaUsuario = window.parent.listaUsuario;
    var vendedor = listaUsuario["u" + venta.usuario_id];

    var contenido = "";
    var htmlderecha = "";
    htmlderecha = "<div> ";
    htmlderecha += "     <div class='inlineblock mr-2 negrilla'>Fecha de Venta: </div>";
    htmlderecha += "     <div class='inlineblock'>" + fecha.substring(0, 10) + "</div>";
    htmlderecha += " </div>";
    htmlderecha += "  <div> ";
    htmlderecha += "     <div class='inlineblock mr-2 negrilla'>Estado Entrega: </div>";
    htmlderecha += "     <div class='inlineblock'>" + venta.estadoEntrega + "</div>";
    htmlderecha += " </div>";
    if (venta.estadoEntrega === "Programado") {
        htmlderecha += "<div> ";
        htmlderecha += "    <div class='inlineblock mr-2 negrilla'>Entrega Programada: </div>";
        htmlderecha += "    <div class='inlineblock'>" + venta.fechaEntrega + "</div>";
        htmlderecha += "</div>";
    }
    if (venta.estadoEntrega === "Entregado") {
        htmlderecha += "<div> ";
        htmlderecha += "    <div class='inlineblock mr-2 negrilla'>Fecha Entregada: </div>";
        htmlderecha += "    <div class='inlineblock'>" + venta.fechaEntrega + "</div>";
        htmlderecha += "</div>";
    }
    if(nroFactura!="0"){
        htmlderecha += " <div> ";
        htmlderecha += "    <div class='inlineblock mr-2 negrilla'>Nro. Factura: </div>";
        htmlderecha += "    <div class='inlineblock'>" + nroFactura + "</div>";
        htmlderecha += "</div>";
    }
    

    var htmlhead = "        <div class='row mt-2'>";
    htmlhead += "            <div class='col-2'> ";
    htmlhead += "                <div class='inlineblock mr-2 negrilla'>Cod. Cliente:</div>";
    htmlhead += "                <div class='inlineblock'>" + (cliente.codigo+"").replace(/"/g, '\"').replace(/"/g, "\'") + "</div>";
    htmlhead += "            </div>";
    htmlhead += "            <div class='col-6'>";
    htmlhead += "                <div class='inlineblock mr-2 negrilla'>Cliente:</div>";
    htmlhead += "                <div class='inlineblock'>" + (cliente.nombre+"").replace(/"/g, '\"').replace(/"/g, "\'") + "</div>";
    htmlhead += "            </div>";
    htmlhead += "            <div class='col-4'>";
    htmlhead += "                <div class='inlineblock mr-2 negrilla'>Tipo Venta:</div>";
    htmlhead += "                <div class='inlineblock'>" + tipoVenta2 + "</div>";
    htmlhead += "            </div>";
    htmlhead += "        </div>";




    htmlhead += "        <div class='row'>";
    htmlhead += "            <div class='col-8'> ";
    htmlhead += "                <div class='inlineblock mr-2 negrilla'>Dirección:</div>";
    htmlhead += "                <div class='inlineblock'>" + (venta.direccionEntrega+"").replace(/"/g, '\"').replace(/"/g, "\'") + "</div>";
    htmlhead += "            </div>";
    htmlhead += "            <div class='col-4'> ";
    htmlhead += "                <div class='inlineblock mr-2 negrilla'>Vendedor:</div>";
    htmlhead += "                <div class='inlineblock'>" + (vendedor.nombre+"").replace(/"/g, '\"').replace(/"/g, "\'") + "</div>";
    htmlhead += "            </div>";
    htmlhead += "        </div>";


    contenido += "<table>";
    contenido += "    <thead>";
    contenido += "        <th><div style='width:100px;'>CODIGO</div></th>";
    contenido += "        <th><div style='width:535px;'>CONCEPTO</div></th>";
    contenido += "        <th><div style='width:90px;'>CANT.</div></th>";
    contenido += "        <th><div style='width:90px;'>PRECIO</div></th>";
    contenido += "        <th><div style='width:90px;'>DESC.</div></th>";
    contenido += "        <th><div style='width:90px;'>SUBTOTAL</div></th>";
    contenido += "    </thead>";
    contenido += "    <tbody class='detalleprd'>";

    var total = 0;
    var descuento = 0;
    for (var i = 0; i < detalle.length; i++) {
        total += parseFloat(detalle[i]["precioTotal"]);
        descuento += parseFloat(detalle[i]["descuento"]);
        contenido += "<tr>";
        contenido += "    <td><div style='width:100px;'>" + detalle[i]["codigo"] + "</div></td>";
        contenido += "    <td><div style='width:535px;'>" + detalle[i]["nombre"].replace(/"/g, '\"').replace(/"/g, "\'") + "</div></td>";
        contenido += "    <td><div  class='derecha' style='width:90px;'>" + detalle[i]["cantidad"] + "</div></td>";
        contenido += "    <td ><div class='derecha' style='width:90px;'> " + format(detalle[i]["precio"]) + "</div></td>";
        contenido += "    <td ><div class='derecha' style='width:90px;'> " + format(detalle[i]["descuento"]) + "</div></td>";
        contenido += "    <td><div class='derecha' style='width:90px;'>" + format(detalle[i]["precioTotal"]) + "</div></td>";
        contenido += "</tr>";
    }
    contenido += "      </tbody>";
    contenido += "      <tfoot>";
    contenido += "          <tr class='txtTotal' style='margin-top: 6px;'>";
    contenido += "              <td style='width: 794px; text-align: left; ' colspan='3' >SON: " + NumeroALetras(total) + "</td>";
    contenido += "              <td class='normal txtTotal'>SUBTOTAL Bs</td>";
    contenido += "              <td class='normal txtTotal'>" + format(total + descuento) + "</td>";
    contenido += "          </tr>";
    contenido += "          <tr class='txtTotal'>";
    contenido += "               <td style='width: 794px; text-align: left; ' colspan='3'></td>";
    contenido += "               <td class='normal txtTotal'>DESCUENTO Bs</td>";
    contenido += "               <td class='normal txtTotal'>" + format(descuento) + "</td>";
    contenido += "          </tr>";
    contenido += "          <tr class='txtTotal'>";
    contenido += "               <td style='width: 794px; text-align: left; '></td>";
    contenido += "               <td class='normal txtTotal'>TOTAL Bs</td>";
    contenido += "               <td class='normal txtTotal'>" + format(total) + "</td>";
    contenido += "          </tr>";
    contenido += "          <tr class='txtTotal'>";
    contenido += "              <td style='text-align: left; font-weight: normal;'>";
    contenido += "              <span class='negrilla'>Glosa:</span>" + (venta.comentario+"").replace(/"/g, '\"').replace(/"/g, "\'") + "</td>";
    contenido += "          </tr>";
    contenido += "       </tfoot>";
    contenido += "</table>";

    contenido += "<div class='row centrar'>";
    var empresa = window.parent.empresaD;
    if (empresa.firmaNotaVenta1 !== "") {
        contenido += "<div class='col-3'><div style='border-top: solid 1px black; margin: 5px 23px;margin-top: 120px;'>" + empresa.firmaNotaVenta1 + "</div></div>";
    }
    if (empresa.firmaNotaVenta2 !== "") {
        contenido += "<div class='col-3'><div style='border-top: solid 1px black; margin: 5px 23px;margin-top: 120px;'>" + empresa.firmaNotaVenta2 + "</div></div>";
    }
    if (empresa.firmaNotaVenta3 !== "") {
        contenido += "<div class='col-3'><div style='border-top: solid 1px black; margin: 5px 23px;margin-top: 120px;'>" + empresa.firmaNotaVenta3 + "</div></div>";
    }
    if (empresa.firmaNotaVenta4 !== "") {
        contenido += "<div class='col-3'><div style='border-top: solid 1px black; margin: 5px 23px;margin-top: 120px;'>" + empresa.firmaNotaVenta4 + "</div></div>";
    }
    contenido += "</div>";

    imprimirReporte({contenido: contenido, sucursal_id: venta.sucursal_id, titulo: titulo, datosHead: htmlhead, encabezadoThead: true, htmlDerecha: htmlderecha, subtitulo: subtitulo, noImprimir: true});
}
function validarPermisos() {
    var listaPermisos = window.parent.listaPermisos;
    var listaPermisosUsuarioRapido = window.parent.listaPermisosUsuarioRapido;
    for (var i = 0; i < listaPermisos.length; i++) {
        if (!listaPermisosUsuarioRapido[listaPermisos[i].id_permiso]) {
            if (listaPermisos[i].tipo === "BLOQUEAR") {
                $(".per" + listaPermisos[i].id_permiso).addClass("inabilitar");
            }
            if (listaPermisos[i].tipo === "OCULTAR") {
                $(".per" + listaPermisos[i].id_permiso).addClass("ocultarPermiso");
            }
            if (listaPermisos[i].tipo === "ELIMINAR") {
                $(".per" + listaPermisos[i].id_permiso).remove();
            }
        }

    }
}
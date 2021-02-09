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
    $(window).resize(function () {
        $(".cuerposearch").ocultar();
    });
});
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
var url = '../Controlador/Producto_Controlador.php';
var idperfil = 0;
var contador = 0;
var listaProducto = {};
var listaLinea = {};
var listaMarca = {};
var id_producto = 0;
var idlinea = 0;
var idmarca = 0;
var posicion = 0;
var tamanopantalla = $(window).height() - 250;
$(document).ready(function () {
    var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal === null) {
        window.parent.cerrarSession();

        return;
    }
    $("#tblprd tbody").css("height", tamanopantalla);
    $(window).resize(function () {
        var tamanopantalla = $(window).height() - 250;
        $("#tblprd tbody").css("height", tamanopantalla);
    });
    var productoLocal = localStorage.getItem("idproducto");
    if (productoLocal !== null) {
        id_producto = parseInt(productoLocal);
        localStorage.removeItem("idproducto");
    }
    window.parent.Version();
});
function cargar() {
    cargando(true);
    $.get(url, {proceso: "iniciar"}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error, "error");
        } else {
            var marca = json.result.marca;
            var linea = json.result.linea;
            comboBox({identificador: "#marcab", datos: marca, codigo: "id_marca", texto: "descripcion", todos: true, callback: () => buscar("", 1)});
            comboBox({identificador: "#lineab", datos: linea, codigo: "id_linea_producto", texto: "descripcion", todos: true, callback: () => buscar("", 1)});
            comboBox({identificador: "#marca", datos: marca, codigo: "id_marca", texto: "descripcion", todos: true});
            comboBox({identificador: "#linea", datos: linea, codigo: "id_linea_producto", texto: "descripcion", todos: true});
            var trmarca = "";
            for (var i = 0; i < marca.length; i++) {
                listaMarca[marca[i].id_marca] = marca[i].descripcion;
                trmarca += "<tr onclick=\"seleccionarMarca(" + marca[i].id_marca + ",this)\"><td><div  style='width: 430px;'>" + marca[i].descripcion + "</div></td></tr>";
            }
            $("#marcapop tbody").html(trmarca);
            var trlinea = "";
            for (var i = 0; i < linea.length; i++) {
                listaLinea[linea[i].id_linea_producto] = linea[i];
                trlinea += "<tr onclick=\"seleccionarLinea(" + linea[i].id_linea_producto + ",this)\"><td><div  style='width: 430px;'>" + linea[i].descripcion + "</div></td></tr>";
            }
            $("#lineapop tbody").html(trlinea);

            listaProducto = Object.keys(window.parent.listaProducto).map(function (k) {
                return window.parent.listaProducto[k]
            });
            var ordenar=$("#ordenarPor option:selected").val();
            listaProducto.sort(function (a, b) {
                if (ordenar=="registro") {
                    var idA = parseInt(a.id_producto);
                    var idB = parseInt(b.id_producto);
                    if (idA < idB) {
                        return 1;
                    }
                    return -1;
                }else{
                    var idA = parseInt(a.posicion);
                    var idB = parseInt(b.posicion);
                    if (idA > idB) {
                        return 1;
                    }
                    return -1;
                }

            });
            if (id_producto !== 0) {
                var listaP = window.parent.listaProducto;
                var producto = listaP["p" + id_producto];
                $("input[name=codigo]").val(producto.codigo);
                $("input[name=nombre]").val(producto.nombre);
                $("input[name=codigoBarra]").val(producto.codigoBarra);
                $("input[name=detalle]").val(producto.descripcion);
                $("#estado option[value=" + producto.estado + "]").prop("selected", true);
                $("#linea").data("cod", producto.linea_producto_id);
                $("#marca").data("cod", producto.marca_id);
                $("#linea").val(listaLinea[producto.linea_producto_id].descripcion);
                $("#marca").val(listaMarca[producto.marca_id]);
                $("#popProducto h5").text("Modificando Producto");
                $('#popProducto').modal('show');
            }
            buscar("", 1);
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
    var marcaAUX = $("#marcab").data("cod") + "";
    var lineaAUX = $("#lineab").data("cod") + "";
    var buscador = ($("input[name=buscar]").val() + "").toUpperCase();
    var estado = $("#tpestadoB option:selected").val();
    $("#btnmodificar").ocultar();
    var html = "";
    for (var i = contador; i < listaProducto.length; i++) {
        if (inicia === 0) {
            break;
        }
        contador++;
        var producto = listaProducto[i];
        var codigoBarra = (producto.codigoBarra + "").toUpperCase();
        var codigo = (producto.codigo + "").toUpperCase();
        var nombre = (producto.nombre + "").toUpperCase();
        var estadomarca = (marcaAUX === '0' || (marcaAUX == producto.marca_id + ""));
        var estadolinea = (lineaAUX === '0' || (lineaAUX == producto.linea_producto_id + ""));
        var validacionEstado = estado === producto.estado;
        var estadoCodigo = codigo.indexOf(buscador) >= 0;
        var estadoNombre = nombre.indexOf(buscador) >= 0;
        var estadoCodBa = codigoBarra.indexOf(buscador) >= 0;
        if (validacionEstado && estadomarca && estadolinea && (estadoCodigo
                || estadoNombre || estadoCodBa)) {
            var colorApp = "style='background: #0080008f;'"
            if (producto.app === "inactivo") {
                colorApp = "style='background: #f59292;'"
            }
            posicion++
            html += "<tr data-id='" + producto.id_producto + "' onclick=modificar(1)>";
            html += "<td><div class='normal'>" + producto.posicion + "</div></td>";
            html += "<td><div class='normal'>" + producto.codigo + "</div></td>";
            html += "<td><div class='normal'>" + producto.codigoBarra + "</div></td>";
            html += "<td><div class='medio'>" + producto.nombre + "</div></td>";
            html += "<td><div class='normal'>" + listaLinea[producto.linea_producto_id].descripcion + "</div></td>";
            html += "<td><div class='normal'>" + listaMarca[producto.marca_id] + "</div></td>";
            html += "<td " + colorApp + "><div class='normal'>" + producto.app + "</div></td>";
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
    $("#tblprd").igualartabla();
    $("#actualcant").text(posicion);
    var lista = listaProducto.filter(value => {
        var producto = value;
        var codigoBarra = (producto.codigoBarra + "").toUpperCase();
        var codigo = (producto.codigo + "").toUpperCase();
        var nombre = (producto.nombre + "").toUpperCase();
        var estadomarca = (marcaAUX === '0' || marcaAUX === (producto.marca_id + ""));
        var estadolinea = (lineaAUX === '0' || lineaAUX === (producto.linea_producto_id + ""));
        var estadoCodigo = codigo.indexOf(buscador) >= 0;
        var validacionEstado = estado === producto.estado;
        var estadoNombre = nombre.indexOf(buscador) >= 0;
        var estadoCodBa = codigoBarra.indexOf(buscador) >= 0;
        if (validacionEstado && estadomarca && estadolinea && (estadoCodigo
                || estadoNombre || estadoCodBa)) {
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
    $("#btnmodificar").ocultar();
    $("#popProducto h5").text("Nueva Producto");
    $('#popProducto').limpiarFormulario();
    $("#imgfoto").attr("src", "../Imagen/Iconos/earth190.svg");
    $("#imgfoto").data("peque", "../Imagen/Iconos/earth190.svg");
    $('#popProducto').modal('show');
    $("#errorPop").html("");
    $(".rojoClarito").removeClass("rojoClarito");
    $("#tblprd tr").removeClass("Tuplaseleccionada");
    $("#linea").data("cod", 0);
    $("#marca").data("cod", 0);
    $("#linea").val("");
    $("#marca").val("");
    $("#foto").attr("src", "../Imagen/Iconos/earth190.svg");
    $("#foto").data("peque", "../Imagen/Iconos/earth190.svg");
    cambioEstado();
    id_producto = 0;
    $("#boxPrecioVenta").css("display", "flex");
    if (window.parent.conf[10]) {
        $("#codigBox").ocultar();
    }
}
function modificar(tipo) {
    if (tipo === 1) {
        $("#btnmodificar").visible();
    } else {
        var tupla = $("tr.Tuplaseleccionada");
        var lista = window.parent.listaProducto;
        id_producto = $(tupla[0]).data("id");
        var producto = lista["p" + id_producto];
        $("input[name=codigo]").val(producto.codigo);
        $("input[name=nombre]").val(producto.nombre);
        $("input[name=codigoBarra]").val(producto.codigoBarra);
        $("input[name=detalle]").val(producto.descripcion);
        $("input[name=posicionProducto]").val(producto.posicion);

        $("#linea").data("cod", producto.linea_producto_id);
        $("#marca").data("cod", producto.marca_id);
        $("#linea").val(listaLinea[producto.linea_producto_id].descripcion);
        $("#marca").val(listaMarca[producto.marca_id]);
        $("#app option[value=" + producto.app + "]").prop("selected", true);
        $("#foto").attr("src", producto.foto);
        $("#foto").data("peque", producto.foto);
        cambioEstado();

        $("#estado option[value=" + producto.estado + "]").prop("selected", true);
        $("#popProducto h5").text("Modificando Producto");
        $('#popProducto').modal('show');
        $("#boxPrecioVenta").ocultar();
        if (window.parent.conf[10]) {
            $("#codigBox").css("display", "block");
            $("input[name=codigo]").prop("readonly", true);
        }

    }
}
function registrar() {
    var json = variables("#formProducto");
    var foto = $("#foto").data("peque");
    json.foto = foto;
    json.linea = $("#linea").data("cod") + "";
    json.marca = $("#marca").data("cod") + "";
    json.proceso = 'registrarProducto';
    json.idproducto = id_producto;
    json.generarCodigo = 0;
    json.posicionProducto = json.posicionProducto === "" ? 0 : json.posicionProducto;
    json.precioVenta = json.precioVenta === "" ? 0 : parseFloat(json.precioVenta);
    json.comision = json.comision === "" ? 0 : parseFloat(json.comision);

    if (window.parent.conf[10]) {
        json.generarCodigo = 1;
    }
    if (json.nombre.length === 0) {
        $("#errorPop").html("No ha ingresado el nombre del producto.");
        $("input[name=nombre]").addClass("rojoClarito");
        return;
    } else {
        $("input[name=nombre]").removeClass("rojoClarito");
    }
    if (json.linea === "0") {
        $("#errorPop").html("No ha seleccionado la línea");
        $("#linea").addClass("rojoClarito");
        return;
    } else {
        $("#linea").removeClass("rojoClarito");
    }
    if (json.marca === "0") {
        $("#errorPop").html("No ha seleccionado la marca");
        $("#marca").addClass("rojoClarito");
        return;
    } else {
        $("#marca").removeClass("rojoClarito");
    }
    if (json.comision < 0) {
        $("#errorPop").html("La comision no puede ser menor a 0.");
        $("input[name=comision]").addClass("rojoClarito");
        return;
    } else {
        $("input[name=comision]").removeClass("rojoClarito")
    }

    $("#errorPop").html("");
    var listaFoto = [];
    json.listaFoto = listaFoto;
    json.tipoHorario = "diario";
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
            $("#tblprd tbody").scrollTop(0);
            $('#popProducto').modal('hide');
            if (id_producto !== 0) {
                alertaRapida("El producto se actualizo correctamente.");
            } else {
                alertaRapida("El producto se registro correctamente.");
            }
            id_producto = 0;
            window.parent.Version();
        }
    });
}
function poplinea(tipo) {
    if (tipo === 1) {
        $(".background").visible();
        $("#lineapop").visible();
        $("#lineapop").centrar();
    } else {
        $(".background").ocultar();
        $("#lineapop").ocultar();
        $("input[name=lineaN]").val("");
        $("input[name=lineaNPosicion]").val("0");
        idlinea = 0;
    }
}
function seleccionarLinea(id, ele) {
    idlinea = id;
    $("input[name=lineaN]").val(listaLinea[id].descripcion);
    $("input[name=lineaNPosicion]").val(listaLinea[id].posicion);
    $("#lineapop tr").removeClass("Tuplaseleccionada");
    $(ele).addClass("Tuplaseleccionada");
}
function registrarLinea() {
    var linea = $("input[name=lineaN]").val().trim();
    var posicion = $("input[name=lineaNPosicion]").val();
    posicion = posicion === "" ? 0 : posicion;
    if (linea.length === 0) {
        alertaRapida("La línea se encuentra en blanco.", "error");
        return;
    }
    cargando(true);
    $.post(url, {proceso: "linea", idlinea: idlinea, posicion: posicion, nombre: linea}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error, "error");
        } else {
            if (idlinea !== 0) {
                alertaRapida("La Línea se actualizo correctamente.");
            } else {
                alertaRapida("La Línea se registro correctamente.");
            }
            poplinea(0);
            window.parent.Version();
        }
    });
}
function popmarca(tipo) {
    if (tipo === 1) {
        $(".background").visible();
        $("#marcapop").visible();
        $("#marcapop").centrar();
    } else {
        $(".background").ocultar();
        $("#marcapop").ocultar();
        $("input[name=marcaN]").val("");
        idmarca = 0;
    }
}
function seleccionarMarca(id, ele) {
    idmarca = id;
    $("input[name=marcaN]").val(listaMarca[id]);
    $("#marcapop tr").removeClass("Tuplaseleccionada");
    $(ele).addClass("Tuplaseleccionada");
}
function registrarMarca() {
    var marca = $("input[name=marcaN]").val().trim();
    if (marca.length === 0) {
        alertaRapida("La marca se encuentra en blanco.", "error");
        return;
    }
    cargando(true);
    $.post(url, {proceso: "marca", idmarca: idmarca, nombre: marca}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error, "error");
        } else {
            if (idmarca !== 0) {
                alertaRapida("La marca se actualizo correctamente.");
            } else {
                alertaRapida("La marca se registro correctamente.");
            }
            popmarca(0);
            window.parent.Version();
        }
    });
}
function imprimir() {
    buscar("", 1);
    var contenido = $("#contenedorProducto").html();
    var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal === null) {
        window.parent.cerrarSession();
        return;
    }
    usuarioLocal = $.parseJSON(usuarioLocal);
    var filtro = "<div class='row' id='filtroReporte'>";
    filtro += "<div class='col-12'><span class='negrilla'>FILTROS</div>";
    var marcaAUX = $("#marcab").val();
    var lineaAUX = $("#lineab").val();
    var buscador = $("input[name=buscar]").val();
    var estado = $("#tpestadoB option:selected").val();
    if (buscador !== "") {
        filtro += "<div class='col-3'><span class='negrilla'>Busqueda: </span>" + buscador + "</div>";
    }
    filtro += "<div class='col-3'><span class='negrilla'>Estado: </span>" + estado + "</div>";
    if (marcaAUX !== "") {
        filtro += "<div class='col-3'><span class='negrilla'>Marca: </span>" + marcaAUX + "</div>";
    }
    if (lineaAUX !== "") {
        filtro += "<div class='col-3'><span class='negrilla'>Línea: </span>" + lineaAUX + "</div>";
    }
    filtro += "</div>";
    imprimirReporte({contenido: contenido, sucursal_id: usuarioLocal.sucursal_id, titulo: "Lista de Producto", datosHead: filtro, encabezadoThead: true});
}
function cambioEstado() {
    var appEsado = $("#app option:selected").val();
    if (appEsado === "activo") {
        $("#boxmensaje").visible();
        $("#onlinebox").css("display", "flex");
    } else {
        $("#boxmensaje").ocultar();
        $("#onlinebox").ocultar();
    }
}

function changeHorario(e, tipo) {
    var input = $(e.currentTarget);
    var valor = input.val();
    if (!validar("entero", valor)) {
        input.val(valor.substring(0, valor.length - 1));
        return false;
    }
}
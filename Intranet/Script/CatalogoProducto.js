var url = '../Controlador/CatalogoProducto_Controlador.php';
var contador = 0;
var listaStock = {};
var id_Producto = 0;
var posicion = 0;
var tamanopantalla = $(window).height() - 265;
$(document).ready(function () {
    var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal === null) {
        window.parent.cerrarSession();
        return;
    }
    $("#tblprd tbody").css("height", tamanopantalla);
     $(window).resize(function () {
        var tamanopantalla = $(window).height() - 265;
        $("#tblprd tbody").css("height", tamanopantalla);
    });
    usuarioLocal = $.parseJSON(usuarioLocal);
    
    var listaSucursal = window.parent.listaSucursal;
    var listaSinInactivos=listaSucursal.filter((suc)=>suc.estado==='activo');
    comboBox({identificador: "#slsucursal", datos: listaSinInactivos,valueDefault:usuarioLocal.sucursal_id, codigo: "id_sucursal", texto: "nombre", todos: true,callback:()=>cargar()});
    cargar();
});
function cargar() {
    var sucursal = $("#slsucursal").data("cod");
    cargando(true);
    $.get(url, {proceso: "stockActual", sucursal: sucursal}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error,"error");
        } else {
            var marca = json.result.marca;
            var linea = json.result.linea;
            comboBox({identificador:"#marcab", datos: marca, codigo:"id_marca", texto:"descripcion" , todos:true, callback:()=>buscar("", 1)})
            comboBox({identificador:"#lineab", datos: linea, codigo:"id_linea_producto", texto:"descripcion" , todos:true, callback:()=>buscar("", 1)})
            listaStock = json.result.stock;
            listaStock.sort(function (a, b) {
                var idA = parseInt(a.id_producto);
                var idB = parseInt(b.id_producto);
                if (idA < idB) {
                    return 1;
                }
                return -1;
            });
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
    var stockAUX = $("#slstock option:selected").val();
    var marcaAUX = $("#marcab").data("cod") + "";
    var lineaAUX = $("#lineab").data("cod") + "";
    var buscador = ($("input[name=buscar]").val() + "").toUpperCase();
    var listaProducto = window.parent.listaProducto;
    var html = "";
    for (var i = contador; i < listaStock.length; i++) {
        if (inicia === 0) {
            break;
        }
        contador++;
        var producto = listaProducto['p' + listaStock[i].id_producto];
        if (!producto) {
            continue;
        }
        var codigoBarra = (producto.codigoBarra + "").toUpperCase();
        var codigo = (producto.codigo + "").toUpperCase();
        var nombre = (producto.nombre + "").toUpperCase();
        var stockProducto = parseInt(listaStock[i].stock);
        var precioVenta = parseFloat(listaStock[i].precioVenta);
        var estadomarca = (marcaAUX === '0' || marcaAUX === producto.marca_id);
        var estadolinea = (lineaAUX === '0' || lineaAUX === producto.linea_producto_id);
        var estadoCodigo = codigo.indexOf(buscador) >= 0;
        var estadoNombre = nombre.indexOf(buscador) >= 0;
        var estadoCodBa = codigoBarra.indexOf(buscador) >= 0;
        var estadoStock = false;
        if ((stockAUX === 'con' && stockProducto > 0) || (stockAUX === 'sin' && stockProducto <= 0) || stockAUX === '-') {
            estadoStock = true;
        }
        if (estadomarca && estadolinea && (estadoCodigo
                || estadoNombre || estadoCodBa) && estadoStock) {
            posicion++
            html += "<tr id='p" + producto.id_producto + "'>";
            html += "<td><div class='normal'>" + codigo.replace(/"/g, '\"').replace(/"/g, "\'") + "</div></td>";
            html += "<td><div class='grande2'>" + nombre.replace(/"/g, '\"').replace(/"/g, "\'") + "</div></td>";
            html += "<td><div class='normal'>" + producto.linea.replace(/"/g, '\"').replace(/"/g, "\'") + "</div></td>";
            html += "<td><div class='normal'>" + producto.marca.replace(/"/g, '\"').replace(/"/g, "\'") + "</div></td>";
            html += "<td><div class='normal'>" + stockProducto + "</div></td>";
            html += "<td><div class='normal'>" + format(precioVenta) + "</div></td>";
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
    $("#actualcant").text(posicion);
    var lista = listaStock.filter(value => {
        var producto = listaProducto['p' + value.id_producto];
        if (!producto) {
            return false;
        }
        var codigoBarra = (producto.codigoBarra + "").toUpperCase();
        var codigo = (producto.codigo + "").toUpperCase();
        var nombre = (producto.nombre + "").toUpperCase();
        var stockProducto = parseInt(value.stock);
        var estadomarca = (marcaAUX === '0' || marcaAUX === producto.marca_id);
        var estadolinea = (lineaAUX === '0' || lineaAUX === producto.linea_producto_id);
        var estadoCodigo = codigo.indexOf(buscador) >= 0;
        var estadoNombre = nombre.indexOf(buscador) >= 0;
        var estadoCodBa = codigoBarra.indexOf(buscador) >= 0;
        var estadoStock = false;
        if ((stockAUX === 'con' && stockProducto > 0) || (stockAUX === 'sin' && stockProducto <= 0) || stockAUX === '-') {
            estadoStock = true;
        }
        if (estadomarca && estadolinea && (estadoCodigo
                || estadoNombre || estadoCodBa) && estadoStock) {
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
    $("table").igualartabla();
}
function imprimir() {
    buscar("", 1);
    var contenido = $("#contenedorCatalogo").html();
    var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal === null) {
        window.parent.cerrarSession();
        return;
    }
    usuarioLocal = $.parseJSON(usuarioLocal);
    var filtro = "<div class='row' id='filtroReporte'>";
    filtro += "<div class='col-12'><span class='negrilla'>FILTROS</div>";
    var stockAUX = $("#slstock option:selected").val();
    var marcaAUX = $("#marcab").val();
    var lineaAUX = $("#lineab").val();
    var buscador = ($("input[name=buscar]").val() + "");
    var sucursal = $("#slsucursal").val();
    if(buscador!==""){
        filtro += "<div class='col-4'><span class='negrilla'>Buscador: </span>" + buscador + "</div>";
    }
    
    if(lineaAUX!==""){
        filtro += "<div class='col-4'><span class='negrilla'>Línea: </span>" + lineaAUX + "</div>";
    }
    if(marcaAUX!==""){
        filtro += "<div class='col-4'><span class='negrilla'>Marca: </span>" + marcaAUX + "</div>";
    }
    if(stockAUX!=="-"){
        filtro += "<div class='col-4'><span class='negrilla'>Stock: </span>" + stockAUX + "</div>";
    }
    if(sucursal!==""){
        filtro += "<div class='col-4'><span class='negrilla'>Sucursal: </span>" + sucursal + "</div>";
    }
    
    filtro += "</div>";
    imprimirReporte({contenido: contenido, sucursal_id: usuarioLocal.sucursal_id, titulo: "Catálogo de producto", datosHead: filtro, encabezadoThead: true});
}

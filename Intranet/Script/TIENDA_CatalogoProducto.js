var url = '../Controlador/TIENDA_CatalogoProducto_Controlador.php';
var contador = 0;
var listaStock = {};
var id_Producto = 0;
var posicion = 0;
var tamanopantalla = $(window).height() - 265;
$(document).ready(function () {
    var usuarioLocal = localStorage.getItem("tienda");
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
    cargar();
});
function cargar() {
    cargando(true);
    $.get(url, {proceso: "iniciar" }, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error, "error");
        } else {
            var categoria = json.result.categoria;
            var linea = json.result.linea;
            comboBox({identificador: "#categoriab", datos: categoria, codigo: "id_categoriaProducto", texto: "nombre", todos: true, callback: () => buscar("", 1)})
            comboBox({identificador: "#lineab", datos: linea, codigo: "id_linea_producto", texto: "descripcion", todos: true, callback: () => buscar("", 1)})
            buscar("", 1);
        }
    });
}
function buscar(e, tipo) {
    if (!(e === "" || e.keyCode === 13)) {
        return;
    }
    if (tipo === 1) {
        contador = 0;
        $("#tblprd tbody").html("");
        $("#btncargarMas").visible();
    }
    var categoriabAUX = $("#categoriab").data("cod") + "";
    var lineaAUX = $("#lineab").data("cod") + "";
    var buscador = ($("input[name=buscar]").val() + "").toUpperCase();
    cargando(true);
    $.get(url, {proceso: "buscarProducto" , buscador: buscador
        , contador: contador,categoria:categoriabAUX,linea:lineaAUX,text:buscador}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error, "error");
        } else {
            var lista = json.result.data;
            var limite = parseInt(json.result.limite);
            var html = "";
            for (var i = 0; i < lista.length; i++) {
                contador++;
                var producto = lista[i];
                html += "<tr>";
                html += "<td><div class='normal'> " + (producto.codigo+"").replace(/"/g, '\"').replace(/"/g, "\'") + "</div></td>";
                html += "<td><div class='grande2'>" + (producto.nombre+"").replace(/"/g, '\"').replace(/"/g, "\'") + "</div></td>";
                html += "<td><div class='normal'>" + producto.categoria.replace(/"/g, '\"').replace(/"/g, "\'") + "</div></td>";
                html += "<td><div class='normal'>" + producto.linea.replace(/"/g, '\"').replace(/"/g, "\'") + "</div></td>";
                html += "<td><div class='normal'>" + format(producto.precio) + "</div></td>";
                html += "<td><div class='normal'>" + format(producto.comision) + "</div></td>";
                html += "</tr>";
            }
            $("#tblprd tbody").append(html);
            $("#tblprd").igualartabla();
            $("#maxcant").text(limite);
            $("#actualcant").text(contador);
            if (contador >= limite) {
                $("#btncargarMas").ocultar();
            } else {
                $("#btncargarMas").visible(1);
            }
        }
    });
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
    if (buscador !== "") {
        filtro += "<div class='col-4'><span class='negrilla'>Buscador: </span>" + buscador + "</div>";
    }

    if (lineaAUX !== "") {
        filtro += "<div class='col-4'><span class='negrilla'>Línea: </span>" + lineaAUX + "</div>";
    }
    if (marcaAUX !== "") {
        filtro += "<div class='col-4'><span class='negrilla'>Marca: </span>" + marcaAUX + "</div>";
    }
    if (stockAUX !== "-") {
        filtro += "<div class='col-4'><span class='negrilla'>Stock: </span>" + stockAUX + "</div>";
    }
    if (sucursal !== "") {
        filtro += "<div class='col-4'><span class='negrilla'>Sucursal: </span>" + sucursal + "</div>";
    }

    filtro += "</div>";
    imprimirReporte({contenido: contenido, sucursal_id: usuarioLocal.sucursal_id, titulo: "Catálogo de producto", datosHead: filtro, encabezadoThead: true});
}

var url = '../Controlador/ReporteMovimientoProducto_Controlador.php';
var idProducto = 0;
var tamanopantalla = $(window).height() - 340;
$(document).ready(function () {
    $("#tblprd tbody").css("height",tamanopantalla+55);
    $(window).resize(function () {
        var tamanopantalla = $(window).height() - 340;
        $("#tblprd tbody").css("height",tamanopantalla+55);
    });
    var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal === null) {
        window.parent.cerrarSession();
        return;
    }
    $(".fecha").val(fechaActual());
    $(".fecha").datepicker();
    cargar();
});
function cargar() {
    var listaPermisosUsuarioRapido = window.parent.listaPermisosUsuarioRapido;
    var todosAlmacenes=0;
    if(listaPermisosUsuarioRapido[134]){
        todosAlmacenes=1;
    }
    cargando(true);
    $.get(url, {proceso: "inicializar", todo:todosAlmacenes}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error,"error");
        } else {
            var almacen = json.result.almacen;
            comboBox({identificador: "input[name=almacen]",ordenarPor:"posicion", datos: almacen, codigo: "id_almacen", texto: "nombre", callback: () => filtrar(),todos:true});
            var datosProductos = window.parent.listaProducto;
            comboBox({identificador: "input[name=buscar]", datos: datosProductos, codigo: "id_producto", texto: "codigo", callback: (item) => HistoricoProducto(item), extraBusqueda: "codigoBarra", texto2: "nombre"});
        }
    });
}
function HistoricoProducto(item) {
    if(!item && idProducto===0){
        alertaRapida("No ha seleccionado ningún producto. Seleccione un producto para ver el historico de movimiento");
        return;
    }
    if(item){
        idProducto=item.id_producto;
    }
    if (idProducto === 0) {
        return;
    }
    var datosProductos = window.parent.listaProducto;
    var producto=datosProductos["p"+idProducto];
    $("input[name=codigoSeleccionado]").val(producto.codigo);
    $("input[name=productoSeleccionado]").val(producto.nombre);
    $("input[name=codigoBSeleccionado]").val(producto.codigoBarra);
    $("#prdSeleccionado").visible(1);
     tamanopantalla = $(window).height() - 340;
    $("#tblprd tbody").css("height",tamanopantalla+3);
    var de = $("input[name=de]").val();
    var hasta = $("input[name=hasta]").val();
    cargando(true);
    $.get(url, {proceso: 'historicoProducto', de: de, hasta: hasta, idproducto: idProducto}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error,"error");
        } else {
            var lista = json.result;
            var html = "";
            for (var i = 0; i < lista.length; i++) {
                html += "<tr class='ocultar' data-almacen='" + lista[i].almacen_id + "' data-tipo='" + lista[i].documento + "'>";
                html += "<td><div class='chico'>" + lista[i].fecha + "</div></td>";
                if (lista[i].documento === "Compra Facturada" || lista[i].documento === "Nota de Compra") {
                    html += "<td><div class='chico subrayar' onclick=\"redireccionar('Compra'," + lista[i].id + ")\">" + lista[i].documento + "</div></td>";
                }
                if (lista[i].documento === "Nota de Venta" || lista[i].documento === "Factura") {
                    html += "<td><div class='chico subrayar' onclick=\"redireccionar('Venta'," + lista[i].id + ")\" >" + lista[i].documento + "</div></td>";
                }
                if (lista[i].documento === "Nota de Traspaso Ingreso" || lista[i].documento === "Nota de Traspaso Salida") {
                    html += "<td><div class='chico subrayar' onclick=\"redireccionar('Traspaso'," + lista[i].id + ")\" >" + lista[i].documento + "</div></td>";
                }
                
                if (lista[i].documento === "Nota de Ajuste de Inventario" ) {
                    html += "<td><div class='chico subrayar' onclick=\"redireccionar('AjusteInventario'," + lista[i].id + ")\" >" + lista[i].documento + "</div></td>";
                }
                html += "<td><div class='normal'>" + lista[i].nro + "</div></td>";
                html += "<td><div class='medio'>" + lista[i].descripcion + "</div></td>";
                var cantidad=parseInt(lista[i].cantidad);
                var cssAnulada = "";
                if(lista[i].estado!=="activo"){
                    cssAnulada = "txtRojo";
                    cantidad=0;
                }
                if (lista[i].documento === "Compra Facturada" || lista[i].documento === "Nota de Compra" 
                        || lista[i].documento === "Nota de Traspaso Ingreso") {
                    html += "<td><div class='chico derecha "+cssAnulada+"'>" + cantidad + "</div></td>";
                    html += "<td><div class='chico derecha "+cssAnulada+"'>0</div></td>";
                } 
                if (lista[i].documento === "Nota de Venta" || lista[i].documento === "Factura"
                        || lista[i].documento === "Nota de Traspaso Salida") {
                    html += "<td><div class='chico derecha "+cssAnulada+"'>0</div></td>";
                    html += "<td><div class='chico derecha "+cssAnulada+"'>" + cantidad + "</div></td>";
                }
                if (lista[i].documento === "Nota de Ajuste de Inventario" && cantidad>0 ) {
                    html += "<td><div class='chico derecha "+cssAnulada+"'>" + cantidad + "</div></td>";
                    html += "<td><div class='chico derecha "+cssAnulada+"'>0</div></td>";
                }
                if (lista[i].documento === "Nota de Ajuste de Inventario" && cantidad<=0 ) {
                    html += "<td><div class='chico derecha "+cssAnulada+"'>0</div></td>";
                    html += "<td><div class='chico derecha "+cssAnulada+"'>" + (cantidad*-1) + "</div></td>";
                }
                html += "<td><div class='chico derecha "+cssAnulada+"'>0</div></td>";
                html += "<td><div class='medio '>" + lista[i].nombre + "</div></td>";
                html += "</tr>";
            }
            $("#tblprd tbody").html(html);
            $("#tblprd ").igualartabla();
            filtrar();

        }
    });
}
function filtrar() {
    if(idProducto===0){
        return;
    }
    var almacen = $("input[name=almacen]").data("cod")+"";
    var tipoDocumento = $("#tipoDocumento option:selected").val();
    $("#tblprd tbody tr").addClass("ocultar");
    var lista = $("#tblprd tbody tr");
    for (var i = 0; i < lista.length; i++) {
        var alm = $(lista[i]).data("almacen")+"";
        var tipo = $(lista[i]).data("tipo");
        if ((almacen === "0" || almacen === alm) && tipoDocumento === "0") {
            $(lista[i]).removeClass("ocultar");
        } else {
            if (tipoDocumento === "Ventas y Compras" && (tipo === "Nota de Compra"
                    || tipo === "Compra Facturada" || tipo === "Nota de Venta" || tipo === "Factura")) {
                $(lista[i]).removeClass("ocultar");
            }
            if (tipoDocumento === "Ventas" && (tipo === "Nota de Venta" || tipo === "Factura")) {
                $(lista[i]).removeClass("ocultar");
            }
            if (tipoDocumento === "Compras" && (tipo === "Nota de Compra"
                    || tipo === "Compra Facturada")) {
                $(lista[i]).removeClass("ocultar");
            }
           if (tipoDocumento === "Traspasos" 
                   &&  (tipo === "Nota de Traspaso Ingreso" || tipo === "Nota de Traspaso Salida")) {
                $(lista[i]).removeClass("ocultar");
            }
           if (tipoDocumento === "Ajuste de Inventario" 
                   &&  (tipo === "Nota de Ajuste de Inventario")) {
                $(lista[i]).removeClass("ocultar");
            }
           
        }
    }
    calcular();
}
function calcular() {
    var lista = $("#tblprd tbody tr:not(.ocultar)");
    var totalIngreso = 0;
    var totalSalida = 0;
    var saldoActual = 0;
    for (var i = 0; i < lista.length; i++) {
        var ingreso = parseInt($(lista[i]).find("div:eq(4)").html());
        var salida = parseInt($(lista[i]).find("div:eq(5)").html());
        if (ingreso > 0) {
            saldoActual += ingreso;
            totalIngreso += ingreso;
        } else {
            saldoActual -= salida;
            totalSalida += salida;
        }
        $(lista[i]).find("div:eq(6)").html(saldoActual);
    }

    $("#tblprd tfoot div:eq(4)").html(totalIngreso)
    $("#tblprd tfoot div:eq(5)").html(totalSalida)
    $("#tblprd tfoot div:eq(6)").html(saldoActual)
}
function imprimir() {
    filtrar();
    var contenido = $("#contenedorProducto").html();
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
    var almacen = $("input[name=almacen]").val();
    var tipoDocumento = $("#tipoDocumento option:selected").text()+"";
    filtro += "<div class='col-4'><span class='negrilla'>Fecha: </span>" + de + " - " + hasta + "</div>";
    if(almacen!==""){
        filtro += "<div class='col-4'><span class='negrilla'>Almacen: </span>" + almacen + "</div>";
    }
    if(tipoDocumento!=="-- Tipo Doc. --"){
        filtro += "<div class='col-4'><span class='negrilla'>Tipo Documento: </span>" + tipoDocumento + "</div>";
    }
    
    filtro += "</div>";
    var datosProductos = window.parent.listaProducto;
    var producto=datosProductos["p"+idProducto];
    filtro+="<div class='inlineblock' style='margin-right: 10px;'><span class='negrilla'>Código: </span>"+producto.codigo+"</div>";
    filtro+="<div class='inlineblock ' style='margin-right: 10px;'><span class='negrilla'>Producto : </span>"+producto.nombre+"</div>";
    imprimirReporte({contenido: contenido, sucursal_id: usuarioLocal.sucursal_id, titulo: "Estado de Cuenta Producto", datosHead: filtro, encabezadoThead: true});
}

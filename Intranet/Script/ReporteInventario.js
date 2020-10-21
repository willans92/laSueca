var url = '../Controlador/ReporteInventario_Controlador.php';
var tamanopantalla = $(window).height() - 210;
var estado = "Línea";
var listaMarca = [];
var listaLinea = [];
var listaAlmacen = [];// me falta aumentar boton almacen y filtrar para buscar producto con stock sin stock
var listaData = [];
$(document).ready(function () {
    $("#tblventas").css("height", tamanopantalla);
    $(window).resize(function () {
        var tamanopantalla = $(window).height() - 210;
          $("#tblventas").css("height", tamanopantalla);
    });
    $(".fecha").datepicker();
    $(".fecha").val(fechaActual());
    var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal === null) {
        window.parent.cerrarSession();
        return;
    }
    cargar();
});
function cargar() {
    var listaPermisosUsuarioRapido = window.parent.listaPermisosUsuarioRapido;
    var todosAlmacenes=0;
    if(listaPermisosUsuarioRapido[137]){
        todosAlmacenes=1;
    }
    cargando(true);
    $.get(url, {proceso: "inicializar",todo:todosAlmacenes}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error,"error");
        } else {
            var usuarioLocal = localStorage.getItem("usuario");
            if (usuarioLocal === null) {
                window.parent.cerrarSession();
                return;
            }
            usuarioLocal = $.parseJSON(usuarioLocal);
            listaMarca = json.result.marca;
            listaLinea = json.result.linea;
            listaAlmacen = json.result.almacen;
            
            var almacen = json.result.almacen;
            comboBox({identificador: "input[name=almacen]",ordenarPor:"posicion", datos: almacen, codigo: "id_almacen", texto: "nombre",todos: true});
            getData();
        }
    });
}
function getData() {
    var de = $("input[name=de]").val();
    var hasta = $("input[name=hasta]").val();
    var almacen = $("input[name=almacen]").data("cod");
    cargando(true);
    $.get(url, {proceso: 'reporteInventario', de: de, hasta: hasta, almacen_id: almacen}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error,"error");
        } else {
            listaData = json.result;
            reporte(estado);
        }
    });
}
function reporte(tipo) {
    estado=tipo;
    var titulo="Reporte de Inventario Por "+estado;
    alertaRapida("Se cambio la vista a "+titulo);
    $("h1").text("Reporte de Inventario Por "+estado);
    var listaProducto = window.parent.listaProducto;
    var lista=[];
    if(estado==="Línea"){
        lista=listaLinea;
    }else{
        lista=listaMarca;
    }
    var html = "";
    for (var i = 0; i < lista.length; i++) {
        var value=lista[i];
        html += "<table class='table' style='margin-bottom: 20px;'>";
        html +="<thead>";
        html += "<tr class='cabeceraInventario'>";
        html += "<th><div  class='normal'>CODIGO</div></th>";
        html += "<th><div  class='medio'>PRODUCTO</div></th>";
        html += "<th><div class='normal derecha'>ENTRADA</div></th>";
        html += "<th><div class='normal derecha'>SALIDA</div></th>";
        html += "<th><div class='normal derecha' >SALDO</div></th>";
        html += "</tr >";

        html += "<tr class='cabeceraInventario2'><th colspan=2><div style='text-align:left; width: 298px; padding-left:15px'>"+estado.toUpperCase()+": "+value.descripcion+"</div></th>";
        html += "<th><div class='normal derecha'>0,00</div></th>";
        html += "<th><div class='normal derecha'>0,00</div></th>";
        html += "<th><div class='normal derecha' >0,00</div></th></tr>";
        html += "</thead>";
        html += "<tbody class='quitarLineaTabla'>";
        for (var p in listaProducto) {
            var producto=listaProducto[p];
            var validacionLinea=estado==="Línea"?producto.linea_producto_id===(value.id_linea_producto+""):true;
            var validacionMarca=estado==="Marca"?producto.marca_id===(value.id_marca+""):true;
            if(validacionLinea && validacionMarca){
                html += "<tr id='p"+producto.id_producto+"'>";
                html += "<td><div  class='normal izquierda subrayar' onclick=\"redireccionar('Producto'," + producto.id_producto + ")\">" + producto.codigo + "</div></td>";
                html += "<td><div  class='medio'>" + producto.nombre + "</div></td>";
                html += "<td><div class='normal derecha'>0,00</div></td>";
                html += "<td><div class='normal derecha'>0,00</div></td>";
                html += "<td><div class='normal derecha' >0,00</div></td>";
                html += "</tr >";
            }
        }
        html += "</tbody>";
        html += "<tfoot>";
        html += "<tr>";
        html += "<td><div  class='normal'></div></td>";
        html += "<td><div  class='medio derecha'>TOTAL</div></td>";
        html += "<td><div class='normal derecha'>0,00</div></td>";
        html += "<td><div class='normal derecha'>0,00</div></td>";
        html += "<td><div class='normal derecha' >0,00</div></td>";
        html += "</tr >";
        html += "</tfoot>";
    }
    $("#tblventas").html(html);
    $("#tblventas").igualartabla();
    for (var d in listaData) {
        var data=listaData[d];
        var idProd=data.producto_id;
        var salida=parseFloat(data.salida);
        var entrada=parseFloat(data.entrada);
        if(salida>0){
            $("#p"+idProd+" td:eq(3) div").html(format(salida));
        }
        if(entrada>0){
            $("#p"+idProd+"  td:eq(2) div").html(format(entrada));
        }
    }
    calcularTotalDetallado();
}
function calcularTotalDetallado() {
    var table = $("#tblventas table");
    for (var i = 0; i < table.length; i++) {
        var tablaAux=$(table[i]);
        var tr=tablaAux.find("tbody tr:not(.ocultar)");
        var TotalEntrada=0;
        var TotalSalida=0;
        var TotalSaldo=0;
        for (var j = 0; j < tr.length; j++) {
            var entrada = parseFloat($(tr[j]).find("div:eq(2)").html().replace(/\./g, '').replace(/\,/g, '.'));
            var salida = parseFloat($(tr[j]).find("div:eq(3)").html().replace(/\./g, '').replace(/\,/g, '.'));
            var saldo=entrada-salida;
            TotalEntrada+=entrada;
            TotalSalida+=salida;
            TotalSaldo+=saldo;
            $(tr[j]).find("div:eq(4)").html(format(saldo))
        }
        tablaAux.find("tfoot div:eq(2)").html(format(TotalEntrada));
        tablaAux.find("tfoot div:eq(3)").html(format(TotalSalida));
        tablaAux.find("tfoot div:eq(4)").html(format(TotalSaldo));
        
        tablaAux.find("thead tr:eq(1) div:eq(1)").html(format(TotalEntrada));
        tablaAux.find("thead tr:eq(1) div:eq(2)").html(format(TotalSalida));
        tablaAux.find("thead tr:eq(1) div:eq(3)").html(format(TotalSaldo));
        
    }
}
function imprimir() {
    getData();
    var contenido = $("#tblventas").html();
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
    filtro += "<div class='col-4'><span class='negrilla'>Fecha: </span>" + de + " - " + hasta + "</div>";
    if(almacen!==""){
        filtro += "<div class='col-4'><span class='negrilla'>Almacen: </span>" + almacen + "</div>";
    }
    filtro += "</div>";
    var titulo=$("h1").text();
    imprimirReporte({contenido: contenido, sucursal_id: usuarioLocal.sucursal_id, titulo: titulo, datosHead: filtro, encabezadoThead: false});
}

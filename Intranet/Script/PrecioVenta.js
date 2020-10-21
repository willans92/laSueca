var url = '../Controlador/PrecioVenta_Controlador.php';
var contador = 0;
var listaStock = {};
var id_Producto = 0;
var posicion = 0;
var tamanopantalla = $(window).height() - 300;
$(document).ready(function () {
    $("#popPrecio .modal-body").css("max-height", tamanopantalla);
    $("#creditopop .modal-body").css("max-height", tamanopantalla + 45);
    $("#tblprd tbody").css("height", tamanopantalla);
    $(window).resize(function () {
        var tamanopantalla = $(window).height() - 300;
        $("#popPrecio .modal-body").css("max-height", tamanopantalla);
        $("#creditopop .modal-body").css("max-height", tamanopantalla + 45);
        $("#tblprd tbody").css("height", tamanopantalla);
    });
    var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal === null) {
        window.parent.cerrarSession();
        return;
    }
    cargar();
});
function cargar() {
    cargando(true);
    $.get(url, {proceso: "stockActual"}, function (response) {
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
            
            $("#formulario").click(function () {
                seleccionarFiltro(1, 2);
            });
            listaStock = json.result.stock;
            listaStock.sort(function(a, b){
                var idA=parseInt(a.id_producto);
                var idB=parseInt(b.id_producto);
                if(idA < idB){
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
    var precioAUX = $("#slPrecio option:selected").val();
    var stockAUX = $("#slstock option:selected").val();
    var marcaAUX = $("#marcab").data("cod")+"";
    var lineaAUX = $("#lineab").data("cod")+"";
    var buscador = ($("input[name=buscar]").val()+ "").toUpperCase();
    var listaProducto = window.parent.listaProducto;
    var html = "";
    for (var i = contador; i < listaStock.length; i++) {
        if (inicia === 0) {
            break;
        }
        contador++;
        var producto = listaProducto['p' + listaStock[i].id_producto];
        if(!producto){
            continue;
        }
        var codigoBarra = (producto.codigoBarra+ "").toUpperCase();
        var codigo = (producto.codigo+ "").toUpperCase();
        var nombre = (producto.nombre+ "").toUpperCase();
        var stockProducto = parseInt(listaStock[i].stock);
        var precioVenta = parseFloat(listaStock[i].precioVenta);
        var estadomarca = (marcaAUX === '0' || marcaAUX === (producto.marca_id+ ""));
        var estadolinea = (lineaAUX === '0' || lineaAUX === (producto.linea_producto_id+ ""));
        var estadoCodigo = codigo.indexOf(buscador) >= 0;
        var estadoNombre = nombre.indexOf(buscador) >= 0;
        var estadoCodBa = codigoBarra.indexOf(buscador) >= 0;
        var estadoStock = false;
        if ((stockAUX === 'con' && stockProducto > 0) || (stockAUX === 'sin' && stockProducto <= 0) || stockAUX === '-') {
            estadoStock = true;
        }
        var estadoPrecio = false;
        if ((precioAUX === 'con' && precioVenta > 0) || (precioAUX === 'sin' && precioVenta <= 0) || precioAUX === '-') {
            estadoPrecio = true;
        }
        if (estadomarca && estadolinea && (estadoCodigo
                || estadoNombre || estadoCodBa) && estadoStock && estadoPrecio) {

            var fechaVenta = '';
            if (listaStock[i].fechaVenta !== '-') {
                var fechaSplit = listaStock[i].fechaVenta.split("/");
                var fecha = new Date(fechaSplit[2], fechaSplit[1] - 1, fechaSplit[0]).getTime();
                var fechaActual = new Date().getTime();
                fechaVenta = parseInt((fechaActual - fecha) / (1000 * 60 * 60 * 24))
            }
            var precioCompra = parseFloat(listaStock[i].precioCompra);

            var ganancia = precioVenta - precioCompra;
            var margen = (precioCompra / precioVenta) * 100;
            if (isNaN(margen)) {
                margen = 0;
            }
            if (margen === Number.POSITIVE_INFINITY) {
                margen = -100;
            }
            var fechaCompra = '';
            if (listaStock[i].fechaCompra !== '-') {
                var fechaSplit = listaStock[i].fechaCompra.split("/");
                var fecha = new Date(fechaSplit[2], fechaSplit[1] - 1, fechaSplit[0]).getTime();
                var fechaActual = new Date().getTime();
                fechaCompra = parseInt((fechaActual - fecha) / (1000 * 60 * 60 * 24))
            }
            posicion++;
            html += "<tr onclick='modificar(1)' id='p" + producto.id_producto + "' data-id='" + producto.id_producto + "' data-preciocompra='" + precioCompra + "' data-precioventa='" + precioVenta + "'>";
            html += "<td><div class='normal'>" + codigo + "</div></td>";
            html += "<td><div class='medio'>" + nombre + "</div></td>";
            html += "<td><div class='chico'>" + stockProducto + "</div></td>";
            html += "<td><div class='chico'>" + fechaCompra + "</div></td>";
            html += "<td><div class='chico'>" + fechaVenta + "</div></td>";
            html += "<td><div class='chico'>" + format(precioCompra) + "</div></td>";
            html += "<td><div class='chico'>" + format(precioVenta) + "</div></td>";
            html += "<td><div class='chico'>" + format(ganancia) + "</div></td>";
            html += "<td><div class='chico'>" + format(margen) + "</div></td>";
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
    $("table").igualartabla();
    $("#actualcant").text(posicion);
    var lista=listaStock.filter(value=>{
        var producto = listaProducto['p' + value.id_producto];
        if(!producto){
            return false;
        }
        var codigoBarra = (producto.codigoBarra+ "").toUpperCase();
        var codigo = (producto.codigo+ "").toUpperCase();
        var nombre = (producto.nombre+ "").toUpperCase();
        var stockProducto = parseInt(value.cant);
        var precioVenta = parseFloat(value.precioVenta);
        var estadomarca = (marcaAUX === '0' || marcaAUX === (producto.marca_id+ ""));
        var estadolinea = (lineaAUX === '0' || lineaAUX === (producto.linea_producto_id+ ""));
        var estadoCodigo = codigo.indexOf(buscador) >= 0;
        var estadoNombre = nombre.indexOf(buscador) >= 0;
        var estadoCodBa = codigoBarra.indexOf(buscador) >= 0;
        var estadoStock = false;
        if ((stockAUX === 'con' && stockProducto > 0) || (stockAUX === 'sin' && stockProducto <= 0) || stockAUX === '-') {
            estadoStock = true;
        }
        var estadoPrecio = false;
        if ((precioAUX === 'con' && precioVenta > 0) || (precioAUX === 'sin' && precioVenta <= 0) || precioAUX === '-') {
            estadoPrecio = true;
        }
        if (estadomarca && estadolinea && (estadoCodigo
                || estadoNombre || estadoCodBa) && estadoStock && estadoPrecio) {
            return true;
        }else{
            return false;
        }
    })
    $("#maxcant").text(lista.length);
    if (lista.length > posicion) {
       $("#btncargarMas").visible(1);
    }else{
        $("#btncargarMas").ocultar();
    }
}

function calcularPrecio(tipo){
    var venta=parseFloat($('input[name=precioVenta]').val());
    var margen=parseFloat($('input[name=margen]').val());
    var ganancia=parseFloat($('input[name=ganancia]').val());
    var compra=parseFloat($('#txtultprecio').html());
    if(tipo===1){
        margen=((venta/compra)-1)*100;
        
    }
    if(tipo===2){
        venta = compra * ((margen/100) + 1);
        if(compra===0){
            venta=0;
        }
    }
    if(tipo===3){
        venta = compra +ganancia;
        margen=((venta/compra)-1)*100;
        if(compra===0){
            venta=ganancia;
        }
    }
    if(compra===0){
        margen=0;
    }
    var ganancia=venta-compra;
    $('input[name=ganancia]').val(ganancia.toFixed(2));
    $('input[name=margen]').val(margen.toFixed(2));
    $('input[name=precioVenta]').val(venta.toFixed(2))
}
function registrar(){
    var venta=parseFloat($('input[name=precioVenta]').val());
    if(venta<=0){
        alertaRapida('El precio de venta no puede ser meno o igual a 0');
        return;
    }
     cargando(true);
    $.post(url, {proceso: "registrarPrecio",idproducto:id_Producto,venta:venta}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error,"error");
        } else {
            var margen=parseFloat($('input[name=margen]').val());
            var ganancia=parseFloat($('input[name=ganancia]').val());
            var tr=$('#p'+id_Producto);
            tr.find('div:eq(6)').html(venta.toFixed(2));
            tr.find('div:eq(7)').html(ganancia.toFixed(2));
            tr.find('div:eq(8)').html(margen.toFixed(2));
            for (var i = 0; i < listaStock.length; i++) {
                if(listaStock[i].id_producto==id_Producto){
                    listaStock[i].precioVenta=venta;
                    break;
                }
            }
            $("#btnmodificar").ocultar();
            $("#creditopop .cerrar").click();
            alertaRapida("El nuevo precio se registro correctamente.");
            buscar('', 1);
        }
    });
}
function modificar(tipo){
    if(tipo===1){
        $("#btnmodificar").visible();
    }else{
        var tupla = $("tr.Tuplaseleccionada");
        var seleccionado=$(tupla[0]);
        id_Producto = seleccionado.data("id");
        var precioCompra = seleccionado.data("preciocompra");
        var precioVenta = seleccionado.data("precioventa");
        precioVenta = parseFloat(precioVenta);
        precioCompra = parseFloat(precioCompra);
        var listaProducto = window.parent.listaProducto;
        var producto = listaProducto['p' + id_Producto];
        $('#txtcod').html(producto.codigo);
        $('#txtprod').html(producto.nombre);
        if (precioVenta === 0) {
            var margenGlobal = $('input[name=margenGlobal]').val();
            margenGlobal = margenGlobal === '' ? 0 : parseFloat(margenGlobal) / 100;
            precioVenta = precioCompra * (margenGlobal + 1);
            $('input[name=precioVenta]').addClass('verdeClarito');
        } else {
            $('input[name=precioVenta]').removeClass('verdeClarito');
        }
        var margen=((precioVenta/precioCompra)-1)*100;
        if(!margen){
            margen=0;
        }
        var ganancia=precioVenta-precioCompra;
        $('#txtultprecio').html(precioCompra.toFixed(2));
        $('input[name=precioVenta]').val(precioVenta.toFixed(2));
        $('input[name=margen]').val(margen.toFixed(2));
        $('input[name=ganancia]').val(ganancia.toFixed(2));
        $('#creditopop').modal('show');
    }
}
function imprimir() {
    buscar("", 1);
    var contenido = $("#preciocontenedor").html();
    var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal === null) {
        window.parent.cerrarSession();
        return;
    }
    usuarioLocal = $.parseJSON(usuarioLocal);
    var filtro = "<div class='row' id='filtroReporte'>";
    filtro += "<div class='col-12'><span class='negrilla'>FILTROS</div>";
    var precioAUX = $("#slPrecio option:selected").text();
    var stockAUX = $("#slstock option:selected").text();
    var marcaAUX = $("#marcab").val();
    var lineaAUX = $("#lineab").val();
    var buscador = ($("input[name=buscar]").val()+ "").toUpperCase();
    if(buscador!==""){
        filtro += "<div class='col-4'><span class='negrilla'>Buscador: </span>" + buscador + "</div>";
    }
    if(lineaAUX!==""){
        filtro += "<div class='col-4'><span class='negrilla'>Línea: </span>" + lineaAUX + "</div>";
    }
    if(marcaAUX!==""){
        filtro += "<div class='col-4'><span class='negrilla'>Marca: </span>" + marcaAUX + "</div>";
    }
    if(stockAUX!=="--Stock--"){
        filtro += "<div class='col-4'><span class='negrilla'>Stock: </span>" + stockAUX + "</div>";
    }
    if(precioAUX!=="--Precio--"){
        filtro += "<div class='col-4'><span class='negrilla'>Precio: </span>" + precioAUX + "</div>";
    }
    
    
    filtro += "</div>";
    imprimirReporte({contenido: contenido, sucursal_id: usuarioLocal.sucursal_id, titulo: "Listado de Precios", datosHead: filtro, encabezadoThead: true});
}
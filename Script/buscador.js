var url = 'Controlador/Buscador_Controlador.php';
var subCategoria = 0;
var map;
var marker;
var lat = -17.782786;
var lon = -63.181530;
var tocoMapa=false;
var fechaEntrega="";
var costoDelivery=0;
var sucursal_id=0;
$(document).ready(function () {
    cambioTamanoPantalla();
});
function cambioTamanoPantalla() {
    var buscador = $(".buscadorMenu");
    for (var i = 0; i < buscador.length; i++) {
        var contenedorBuscadorW = $(buscador[i]).width();
        var categoriaBuscadorW = $(buscador[i]).find(".categoria").width();
        var lupaBuscadorW = $(buscador[i]).find("img").width();
        var inputBuscador = contenedorBuscadorW - categoriaBuscadorW - lupaBuscadorW - 53;
        $(buscador[i]).find("input").css("width", inputBuscador + "px");
    }
    $(window).resize(function () {
        var buscador = $(".buscadorMenu");
        for (var i = 0; i < buscador.length; i++) {
            var contenedorBuscadorW = $(buscador[i]).width();
            var categoriaBuscadorW = $(buscador[i]).find(".categoria").width();
            var lupaBuscadorW = $(buscador[i]).find("img").width();
            var inputBuscador = contenedorBuscadorW - categoriaBuscadorW - lupaBuscadorW - 53;
            $(buscador[i]).find("input").css("width", inputBuscador + "px");
        }
    });
    sincronizarCarrito();
}
function modificarCarrito(accion = "agregar", idproducto,nombre,foto,precio) {
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
        listaCarrito[idproducto] = {id: idproducto, cantidad: 1,nombre:nombre,foto:foto,precio:precio};
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
function cargarMas() {
    var buscar = ($("input[name=buscador]").val() + "").trim();
    cargando(true);
    $.get(url, {proceso: "buscarMas", txtbusqueda: buscar, id_tienda: id_tienda, categoria: categoria
        , subcategoria: subcategoria, pibote: pibote}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error, "error");
        } else {
            var lista = json.result.data;
            var html = "";
            for (var i = 0; i < lista.length; i++) {
                var prod = lista[i];
                var foto = prod["foto"];
                var precio = prod["precio"];
                var nombre = prod["nombre"];
                var id_producto = prod["id_producto"];
                html += "<div class='itemProducto' >";
                html += "<div class='btnadd i" + id_producto + "' onclick=\"modificarCarrito(''," + id_producto + ",'"+nombre+"','"+foto+"','"+precio+"')\"><span>+</span></div>";
                html += "<img src='" + foto + "' >";
                html += "<div class='precio'>Bs." + precio + "</div>";
                html += "<div class='nombre'>" + nombre + "</div>";
                html += "</div>";
            }
            $("#menuProducto .cuerpo").append(html);
            sincronizarCarrito();
            var limite = parseInt(json.result.limite);
            var actualCant = $("#menuProducto .cuerpo .itemProducto");
            if (actualCant.length >= limite) {
                $("#buscarMas").css("display", "none");
            }
        }
    });
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
function buscador(e) {
    if (!(e === "" || e.keyCode === 13)) {
        return;
    }
    var buscar = ($("input[name=buscador]").val() + "").trim();
    $(location).attr('href', "buscador.php?b=" + buscar + "&t=" + tipo + "&s=" + subcategoria + "&c=" + categoria);
}
function seleccionarSubcategoria(ele, id) {
    subCategoria = id;
    $(".boxSubcategoria").removeClass("selectedSubcategoria");
    $(ele).addClass("selectedSubcategoria");
}



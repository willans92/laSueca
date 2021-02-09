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
function cambiarItemCarrito(idProducto,cambio){
    var carrito = localStorage.getItem("carrito");
    carrito = carrito ? $.parseJSON(carrito) : {};
    var listaCarrito = carrito.data ? carrito.data : {};
    var producto=listaCarrito[idProducto];
    producto.cantidad+=cambio;
    if(producto.cantidad<0){
        producto.cantidad=0;
    }
    listaCarrito[idProducto]=producto;
    var cantidadCarrito=0;
    var total=0;
    for (var item in listaCarrito) {
        if(listaCarrito[item].cantidad>0){
            var subtotal=listaCarrito[item].precio*listaCarrito[item].cantidad;
            total+=subtotal;
            cantidadCarrito++;
            $("#car"+listaCarrito[item].id+" .precio").html("Bs. "+subtotal.toFixed(2));
        }
    }
    $(".foot .total").text("Bs. "+total.toFixed(2));
    $("#car"+producto.id+" input").val(producto.cantidad);
    $(".addCarrito span").text(cantidadCarrito);
    localStorage.setItem("carrito", JSON.stringify({data:listaCarrito,cantidadItem:cantidadCarrito}));
}
function abrirCarrito() {
    $("#popup").css("display", "block");
    $("#popCarrito").centrar();
    $("#popCarrito").css("display", "block");
    $("#popFinalizarPedido").css("display", "none");
    $("#popDatosEnvio").css("display", "none");
    $("#popDelivery").css("display", "none");
    var carrito = localStorage.getItem("carrito");
    carrito = carrito ? $.parseJSON(carrito) : {};
    var listaCarrito = carrito.data ? carrito.data : {};
    var html="";
    var totalFinal=0;
    for (var item in listaCarrito) {
        var producto = listaCarrito[item];
        var cantidad=parseFloat(producto.cantidad);
        var precio=parseFloat(producto.precio);
        var total=cantidad*precio;
        totalFinal+=total;
        html+="<div class='boxItemCarrito' id='car"+producto.id+"'>";
        html+="<img src='"+producto.foto+"' >";
        html+="<div class='contenido'>";
        html+="        <div class='desripcion'>";
        html+="            <div class='nombre'>"+producto.nombre+"</div>";
        html+="            <div class='precioUni'>Bs. "+producto.precio+"</div>";
        html+="        </div>";
        html+="        <div class='cantidad'>";
        html+="                <div class='btn float-left' onclick='cambiarItemCarrito("+producto.id+",-1)'><img src='Imagen/Iconos/minus.png'  alt=''/></div>";
        html+="                <div class='btn float-right' onclick='cambiarItemCarrito("+producto.id+",1)'><img src='Imagen/Iconos/add.png'   alt=''/></div>";
        html+="                <input type='text' value='"+producto.cantidad+"' readonly>";
        html+="        </div>";
        html+="        <div class='precio'>";
        html+="            Bs. "+total.toFixed(2);
        html+="        </div>";
        html+="    </div>";
        html+="</div>";
    }
    $(".foot .total").text("Bs. "+totalFinal.toFixed(2));
    $("#popCarrito .cuerpo").html(html);
}
function ocultarPopup() {
    $("#popup").css("display", "none");
    $("#popCarrito").css("display", "none");
    $("#popDelivery").css("display", "none");
    $("#popFinalizarPedido").css("display", "none");
    $("#popDatosEnvio").css("display", "popDatosEnvio");
     var carrito = localStorage.getItem("carrito");
    carrito = carrito ? $.parseJSON(carrito) : {};
    var listaCarrito = carrito.data ? carrito.data : {};
    var cantidadCarrito=0;
    var newList={};
    for (var item in listaCarrito) {
        if(listaCarrito[item].cantidad>0){
            cantidadCarrito++;
            newList[listaCarrito[item].id]=listaCarrito[item];
        }
    }
    $(".addCarrito span").text(cantidadCarrito);
    localStorage.setItem("carrito", JSON.stringify({data:newList,cantidadItem:cantidadCarrito}));
    $(".itemProducto .btnaddNro").removeClass("btnaddNro");
    $(".btnadd span").text("+");
    sincronizarCarrito();
}
function realizarCompra(){
     var carrito = localStorage.getItem("carrito");
    carrito = carrito ? $.parseJSON(carrito) : {};
    var listaCarrito = carrito.data ? carrito.data : {};
    var cantidadCarrito=0;
    for (var item in listaCarrito) {
        if(listaCarrito[item].cantidad>0){
            cantidadCarrito++;
        }
    }
    if(cantidadCarrito===0){
        alertaRapida("El carrito se encuentra vacío","error");
        return;
    }
    $("#popCarrito").css("display", "none");
    $("#popFinalizarPedido").css("display", "none");
    $("#popDatosEnvio").css("display", "block");
    $("#popDelivery").css("display", "none");
    $("#popDatosEnvio").centrar();
    tocoMapa=false;
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
function continuarDelivery(){
    var nombre=$("input[name=nombre]").val().trim();
    var telefono=$("input[name=telefono]").val().trim();
    var direccion=$("input[name=direccion]").val().trim();
    if(nombre.length===0){
        alertaRapida("El nombre es obligatorio","error");
        $("input[name=nombre]").addClass("rojoClarito");
        return;
    }else{
        $("input[name=nombre]").removeClass("rojoClarito");
    }
    if(telefono.length<7){
        alertaRapida("El número de teléfono es invalido","error");
        $("input[name=telefono]").addClass("rojoClarito");
        return;
    }else{
        $("input[name=telefono]").removeClass("rojoClarito");
    }
    if(isNaN(telefono)){
        alertaRapida("El número de teléfono es invalido","error");
        $("input[name=telefono]").addClass("rojoClarito");
        return;
    }else{
        $("input[name=telefono]").removeClass("rojoClarito");
    }
    if(direccion.length===0){
        alertaRapida("la dirección es obligatorio","error");
        $("input[name=direccion]").addClass("rojoClarito");
        return;
    }else{
        $("input[name=direccion]").removeClass("rojoClarito");
    }
    if(tocoMapa){
        alertaRapida("No ha seleccionado su dirección en el mapa de google","error");
        return;
    }
    $("#popCarrito").css("display", "none");
    $("#popFinalizarPedido").css("display", "none");
    $("#popDelivery").css("display", "block");
    $("#popDatosEnvio").css("display", "none");
    $("#popDelivery").centrar();
    fechaEntrega=fechaActual();
    $("#fechaEntrega").html("<span class='negrilla'>Fecha Entrega:</span> "+fechaEntrega);
    $( "#calendario" ).datepicker({
        changeMonth: true,
        changeYear: true,
        beforeShowDay: function(fecha){
            var fechaActual=new Date();
            fechaActual.setDate(fechaActual.getDate() - 1);
            var validar=fecha>=fechaActual;
            return [validar];
        },
        onSelect: function(dateText) {
            fechaEntrega=dateText;
            $("#fechaEntrega").html("<span class='negrilla'>Fecha Entrega:</span> "+dateText);
           
        }
    });
}
function continuarEntrega(){
    if(fechaEntrega===""){
        alertaRapida("Tiene que seleccionar una fecha de entrega","error")
        return;
    }
    $("#popCarrito").css("display", "none");
    $("#popFinalizarPedido").css("display", "block");
    $("#popFinalizarPedido").centrar();
    $("#popDelivery").css("display", "none");
    $("#popDatosEnvio").css("display", "none");
     var carrito = localStorage.getItem("carrito");
    carrito = carrito ? $.parseJSON(carrito) : {};
    var listaCarrito = carrito.data ? carrito.data : {};
    var html="";
    html+="<div class='boxItemCarrito' >";
    html+="<div class='contenido'>";
    html+="<div class='desripcion'>";
    html+="</div>";
    html+="<div class='cantidad negrilla' style='padding-top: 0; text-align: center;'>";
    html+="Cantidad";
    html+="</div>";
    html+="<div class='precio negrilla' style='padding-top: 0;'>";
    html+="SubTotal";
    html+="</div>";
    html+="</div>";
    html+="</div>";
    var totalFinal=0;
    for (var item in listaCarrito) {
        var producto = listaCarrito[item];
        var cantidad=parseFloat(producto.cantidad);
        var precio=parseFloat(producto.precio);
        var total=cantidad*precio;
        totalFinal+=total;
        html+="<div class='boxItemCarrito' >";
        html+="<div class='contenido'>";
        html+="<div class='desripcion'>";
        html+="<div class='nombre' style='height: auto;'>"+producto.nombre+"</div>";
        html+="<div class='precioUni'>Bs. "+precio+"</div>";
        html+="</div>";
        html+="<div class='cantidad' style='padding-top: 0; text-align: center;'>";
        html+=cantidad;
        html+="</div>";
        html+="<div class='precio' style='padding-top: 0;'>";
        html+="Bs. "+total;
        html+="</div>";
        html+="</div>";
        html+="</div>";
    }
    $("#popFinalizarPedido .cuerpobox").html(html);
    $("#popFinalizarPedido .foot .total").text("Bs. "+totalFinal.toFixed(2));
}
function finalizarVenta(){
    var carrito = localStorage.getItem("carrito");
    carrito = carrito ? $.parseJSON(carrito) : {};
    var listaCarrito = carrito.data ? carrito.data : {};
    var totalFinal=0;
    var lista=[];
    for (var item in listaCarrito) {
      if(listaCarrito[item].cantidad>0){
          totalFinal+=listaCarrito[item].precio*listaCarrito[item].cantidad;
          lista.push(listaCarrito[item]);
      }
    }
    var costoDelivery=10;
    var sucursal=63;
    var metodoPago=$("#metodopago option:selected").val();
    var hora=$("input[name=hora]:checked").val();
    var nombre=$("input[name=nombre]").val();
    var telefono=$("input[name=telefono]").val();
    var direccion=$("input[name=direccion]").val();
    cargando(true);
    $.post(url, {proceso: "registrarPedido", hora: hora, id_tienda: id_tienda, nombre: nombre
        , telefono: telefono, direccion: direccion, lat:lat,lon:lon,fechaEntrega:fechaEntrega,
        metodoPago:metodoPago,sucursal:sucursal,lista:lista,costoDelivery:costoDelivery,totalFinal:totalFinal}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error, "error");
        } else {
            localStorage.setItem("carrito", JSON.stringify({data:"",cantidadItem:0}));
            $("#popCarrito").css("display", "none");
            $("#popFinalizarPedido").css("display", "none");
            $("#popDelivery").css("display", "none");
            $("#popDatosEnvio").css("display", "none");
            $("#popup").css("display", "none");
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
        for (var j = 0; j < tarifario.result.length; j++) {
            var tarifa = tarifario.result[j];
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
    costoDelivery=precioEconomico;
    sucursal_id=sucursalEconomica;
    $("#txtCostoEnvio").text("Costo Envio Bs."+format(costoDelivery))
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

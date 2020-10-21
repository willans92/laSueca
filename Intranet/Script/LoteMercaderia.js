var url = '../Controlador/LoteMercaderia_Controlador.php';
var listaLote=[];
var contador = 0;
var lote_id=0;
var posicion = 0;
var tamanopantalla = $(window).height() - 310;
var estadoLote="Vigentes";
$(document).ready(function () {
    $("#popLote .modal-body").css("max-height", tamanopantalla + 45);
    $("#tbllote tbody").css("height", tamanopantalla);
    $(".fecha").datepicker();
    $(".fecha").val(fechaActual());
    var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal === null) {
        window.parent.cerrarSession();
        return;
    }
    BuscarLote("Vigentes");
});
function BuscarLote(estado) {
    estadoLote=estado;
    $("h1").text("Lote - "+estado)
    cargando(true);
    $.get(url, {proceso: 'buscarLote', estado: estado}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error,"error");
        } else {
            listaLote = json.result;
            if(estado==="Anulados"){
                $("#contenedorRegistro").ocultar();
                $("#btnRegister").ocultar();
            }else{
                $("#contenedorRegistro").css("display","flex");
                $("#btnRegister").visible();
            }
            buscar("",1);
        }
    });
}
function lotePop(){
    var tupla = $("tr.Tuplaseleccionada");
    if (tupla.length === 0) {
        alertaRapida("No ha seleccionado ningún  lote para ver detalle.");
        return;
    }
    var lote=listaLote[tupla.data("index")];
    lote_id=lote.id_loteMercaderia;
    cargando(true);
    $.get(url, {proceso: 'BuscarRegistroHistoricoLote', id_detalleCompra: lote.id_detalleCompra}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error,"error");
        } else {
            var result=json.result;
            var html="";
            var listaUsuario=window.parent.listaUsuario;
            for (var i = 0; i < result.length; i++) {
                var usuarioID=result[i].registradoPor;
                var usuario=listaUsuario["u"+usuarioID];
                html+="<tr>";
                html+="<td><div class='pequeno'>"+result[i].registradoPor+"</div></td>";
                html+="<td><div class='pequeno'>"+result[i].fechaVencimiento+"</div></td>";
                html+="<td><div class='pequeno'>"+result[i].codigo+"</div></td>";
                html+="<td><div class='grande'>"+usuario.nombre+"</div></td>";
                html+="</tr>";
            }
            var listaProducto=window.parent.listaProducto;
            var producto=listaProducto["p"+lote.producto_id];
            $("#nroDocumentoTxt").html(lote.nroDocumento);
            $("#tipoDocumentoTxt").html(lote.tipo);
            $("#fechaCompraTxt").html(lote.fechaCompra);
            $("#productoTxt").html(producto.nombre);
            $("#stockCompraTxt").html(lote.cantidad);
            $("#loteActualTxt").html(lote.lote);
            $("#fechaVencimientoTxt").html(lote.fechaVencimiento);
            $("#stockActualTxt").html(lote.stock);
            $('#popLote').modal('show');//hide
            $("input[name=nuevoLote]").val("")
            $("input[name=nuevoVencimiento]").val(fechaActual());
            $("#tblHistorico tbody").html(html);
        }
    });
    
}
function tuplaSeleccionada(tipo){
    $("#btnDetalle").visible();
}
function buscar(e,tipo){
    if (!(e === "" || e.keyCode === 13)) {
        return;
    }
    var inicia = 50;
    if (tipo === 1) {
        contador = 0;
        posicion = 0;
        $("#btncargarMas").visible();
    }
    $("#btnDetalle").ocultar();
    var nroDocumento=($("input[name=nroDocumento]").val()+ "").toUpperCase();
    var nroLote=($("input[name=nroLote]").val()+ "").toUpperCase();
    var buscador=($("input[name=buscador]").val()+ "").toUpperCase();
    var stock=$("#stock option:selected").val();
    var html = ""
    var listaProducto=window.parent.listaProducto;
    
     for (var i = contador; i < listaLote.length; i++) {
        if (inicia === 0) {
            break;
        }
        contador++;
        var producto=listaProducto["p"+listaLote[i].producto_id];
        var cantidad=parseFloat(listaLote[i].cantidad);
        var vendido=parseFloat(listaLote[i].vendido);
        var stockActual=cantidad-vendido;
        var validarStock=false;
        if(stock==="Con Stock"){
            validarStock=stockActual>0;
        }else{
            validarStock=stockActual<0;
        }
        var validarNroDocumento=(listaLote[i].nroDocumento+"").toUpperCase().indexOf(nroDocumento) >= 0;
        var validarNroLote=(listaLote[i].lote+"").toUpperCase().indexOf(nroLote) >= 0;
        var validarProducto=(producto.nombre+"").toUpperCase().indexOf(buscador) >= 0;
        if (validarNroDocumento && validarNroLote && validarProducto && validarStock) {
            posicion++;
            var nombre = producto.nombre.replace(/"/g, '\"').replace(/"/g, "\'");
            html += "<tr onclick='tuplaSeleccionada()' data-index='"+i+"' >";
            html += "<td><div class='normal subrayar' onclick=\"redireccionar('Compra'," + listaLote[i].id_compra + ")\">"+listaLote[i].nroDocumento+"</div></td>";
            html += "<td><div class='normal'>"+listaLote[i].fechaVencimiento+"</div></td>";
            html += "<td><div class='normal'>"+listaLote[i].lote+"</div></td>";
            html += "<td><div class='grande'>"+nombre+"</div></td>";
            html += "<td><div class='pequeno'>"+listaLote[i].cantidad+"</div></td>";
            html += "<td><div class='pequeno'>"+stockActual+"</div></td>";
            html += "<td><div class='normal'>"+listaLote[i].fechaRegistrado+"</div></td>";
            html += "</tr >";
            inicia--;
        }
        
    }
    
    if (tipo === 1) {
        $("#tbllote tbody").html(html);
    } else {
        if (html.length > 0) {
            $("#tbllote  tbody").append(html);
        }
    }
    $("#tbllote").igualartabla();
    $("#actualcant").text(posicion);
    var lista = listaLote.filter(value => {
        var producto=listaProducto["p"+value.producto_id];
        var stockActual=parseFloat(value.stock);
        var validarStock=false;
        if(stock==="Con Stock"){
            validarStock=stockActual>0;
        }else{
            validarStock=stockActual<0;
        }
        var validarNroDocumento=(value.nroDocumento+"").toUpperCase().indexOf(nroDocumento) >= 0;
        var validarNroLote=(value.lote+"").toUpperCase().indexOf(nroLote) >= 0;
        var validarProducto=(producto.nombre+"").toUpperCase().indexOf(buscador) >= 0;
        if (validarNroDocumento && validarNroLote && validarProducto && validarStock) {
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
function registrarLote(){
    var nuevoLote=$("input[name=nuevoLote]").val().trim();
    var nuevoVencimiento=$("input[name=nuevoVencimiento]").val();
    if(nuevoLote===""){
        $("#errorPop").html("No a ingresado el nuevo codigo de lote es obligatorio.")
        return;
    }
    cargando(true);
    $.post(url, {proceso: 'cambiarLote', codigoLote: nuevoLote,vencimiento:nuevoVencimiento,idLote:lote_id}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error,"error");
        } else {
            $('#popLote').modal('hide');
            alertaRapida("Se registro el cambio de lote correctamente.")
            BuscarLote("Vigentes");
        }
    });
}
function imprimir() {
    buscar("",1);
    var contenido = $("#tbllote").html();
    var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal === null) {
        window.parent.cerrarSession();
        return;
    }
    usuarioLocal = $.parseJSON(usuarioLocal);
    var filtro = "<div class='row' id='filtroReporte'>";
    filtro += "<div class='col-12'><span class='negrilla'>FILTROS</div>";
    var nroDocumento = $("input[name=nroDocumento]").val();
    var nroLote = $("input[name=nroLote]").val();
    var buscador = $("input[name=buscador]").val();
    var stock = $("#stock option:selected").text()+"";
    filtro += "<div class='col-4'><span class='negrilla'>Stock: </span>" + stock + "</div>";
    if(nroDocumento!==""){
        filtro += "<div class='col-4'><span class='negrilla'>Nro. Doc. Compra: </span>" + nroDocumento + "</div>";
    }
    if(nroLote!==""){
        filtro += "<div class='col-4'><span class='negrilla'>Nro. Lote: </span>" + nroLote + "</div>";
    }
    if(buscador!==""){
        filtro += "<div class='col-4'><span class='negrilla'>Producto: </span>" + buscador + "</div>";
    }
   
    
    filtro += "</div>";
    imprimirReporte({contenido: contenido, sucursal_id: usuarioLocal.sucursal_id, titulo: "Listado de lote de mercadería - "+estadoLote, datosHead: filtro, encabezadoThead: true});
}
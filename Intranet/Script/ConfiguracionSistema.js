var url = '../Controlador/ConfiguracionSistema_Controlador.php';
var tamanopantalla = $(window).height() - 120;
$(document).ready(function () {
    var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal === null) {
        window.parent.cerrarSession();
        return;
    }
    $("#contenedorBox").css("height", tamanopantalla);
     $(window).resize(function () {
        var tamanopantalla = $(window).height() - 120;
        $("#contenedorBox").css("height", tamanopantalla);
    });
    cargarDatos();
});
function cargarDatos() {
    cargando(true);
    $.get(url, {proceso: 'configuracion'}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error, "error");
        } else {
            var empresa = json.result.empresa;
            var configuracion = json.result.configuracion;
            var configuracionEmpresa = json.result.configuracionEmpresa;
            var categoriaApp = json.result.categoriaApp;
            var empresacategoriaApp = json.result.empresacategoriaApp;
            if(empresa.aprobado!=="activo"){
                $("#contenedorApp").ocultar();
            }
            var html="";
            for (var i = 0; i < categoriaApp.length; i++) {
                html+="<li><input type='checkbox' class='chico2 mr-2' value='"+categoriaApp[i].id_categoriaApp+"'><span>"+categoriaApp[i].nombre+"</span></li>"
            }
            $("#categoriaEmpresa").html(html);
            for (var i = 0; i < empresacategoriaApp.length; i++) {
                $("#categoriaEmpresa input[value='"+empresacategoriaApp[i].categoriaApp_id+"']").prop("checked",true);
            }
            $("input[name=nombre]").val(empresa.nombreEmpresa);
            $("input[name=tipoCambio]").val(empresa.tipoCambio);
            $("input[name=fventa1]").val(empresa.firmaNotaVenta1);
            $("input[name=fventa2]").val(empresa.firmaNotaVenta2);
            $("input[name=fventa3]").val(empresa.firmaNotaVenta3);
            $("input[name=fventa4]").val(empresa.firmaNotaVenta4);
            $("#ventabox1").html(empresa.firmaNotaVenta1);
            $("#ventabox2").html(empresa.firmaNotaVenta2);
            $("#ventabox3").html(empresa.firmaNotaVenta3);
            $("#ventabox4").html(empresa.firmaNotaVenta4);
            $("input[name=fcompra1]").val(empresa.firmaNotaCompra1);
            $("input[name=fcompra2]").val(empresa.firmaNotaCompra2);
            $("input[name=fcompra3]").val(empresa.firmaNotaCompra3);
            $("input[name=fcompra4]").val(empresa.firmaNotaCompra4);
            $("#comprabox1").html(empresa.firmaNotaCompra1);
            $("#comprabox2").html(empresa.firmaNotaCompra2);
            $("#comprabox3").html(empresa.firmaNotaCompra3);
            $("#comprabox4").html(empresa.firmaNotaCompra4);
            $("input[name=fcobranza1]").val(empresa.firmaCobranza1);
            $("input[name=fcobranza2]").val(empresa.firmaCobranza2);
            $("#cobranzabox1").html(empresa.firmaCobranza1);
            $("#cobranzabox2").html(empresa.firmaCobranza2);
            firma("input[name=fventa1]");
            firma("input[name=fventa2]");
            firma("input[name=fventa3]");
            firma("input[name=fventa4]");
            firma("input[name=fcobranza1]");
            firma("input[name=fcobranza2]");
            firma("input[name=fcompra1]");
            firma("input[name=fcompra2]");
            firma("input[name=fcompra3]");
            firma("input[name=fcompra4]");
            $("input[name=online][value='"+empresa.app+"']").prop("checked",true);
            $("input[name=onlinefactura][value='"+empresa.appFactura+"']").prop("checked",true);
            $("input[name=delivery][value='"+empresa.delivery+"']").prop("checked",true);
            $("input[name=tarifa][value='"+empresa.tarifaDelivery+"']").prop("checked",true);
            $("#logo").prop("src",empresa.appLogo);
            $("#logo").data("peque",empresa.appLogo);
            if(empresa.app==='activo'){
               $("#boxonline").visible(1);
               $("#facbox").css("display","flex");
               $("#deliverybox").css("display","flex");
            }else{
                $("input[name=radio][value='inactivo']").prop("checked",true);
                $("#boxonline").ocultar();
                $("#facbox").ocultar();
                $("#deliverybox").ocultar();
            }
            cambioDelivery();
            var html="";
            for (var i = 0; i < configuracion.length; i++) {
                var ocultar="";
                var id="";
                var paddding="";
                if(configuracion[i].configuracion_id!==""){
                    ocultar="ocultar";
                    id="f"+configuracion[i].configuracion_id+"";
                    paddding="style='padding-left: 26px;'"
                }
                html+="<tr class='"+ocultar+" "+id+"'>";
                html+="<td><div class='grande4 izquierda' "+paddding+">"+configuracion[i].detalle+"</div></td>";
                html+="<td><div class='chico2'><input type='radio' value='"+configuracion[i].id_configuracion+"' name='tr"+i+"' onchange=\"cambioEstado('si',"+configuracion[i].id_configuracion+")\"></div></td>";
                html+="<td><div class='chico2'><input type='radio' value='0' name='tr"+i+"' checked onchange=\"cambioEstado('no',"+configuracion[i].id_configuracion+")\"></div></td>";
                html+="</tr>";
            }
            $("#tblFuncionalidad tbody").html(html);
            $("#tblFuncionalidad").igualartabla();
            for (var i = 0; i < configuracionEmpresa.length; i++) {
                $("#tblFuncionalidad input[value='"+configuracionEmpresa[i].configuracion_id+"']").prop("checked",true);
                $(".f"+configuracionEmpresa[i].configuracion_id).removeClass("ocultar");
            }
        }
    });
}
function cambioVentasOnline(){
    var estado=$("input[name=online]:checked").val();
    if(estado==="activo"){
        $("#boxonline").visible(1);
        $("#facbox").css("display","flex");
        $("#deliverybox").css("display","flex");
        cambioDelivery();
    }else{
        $("#boxonline").ocultar();
        $("#facbox").ocultar();
        $("#deliverybox").ocultar();
        $("#deliveryTarifa").ocultar();
    }
}
function cambioDelivery(){
    var estado=$("input[name=delivery]:checked").val();
    if(estado==="propia"){
        $("#deliveryTarifa").css("display","flex");
    }else{
        $("#deliveryTarifa").ocultar();
    }
}
function cambioEstado(estado,id){
    if(estado==="si"){
        $(".f"+id).removeClass("ocultar");
        $(".f"+id).find("input:eq(1)").prop("checked",true);
    }else{
        $(".f"+id).addClass("ocultar");
        $(".f"+id).find("input:eq(1)").prop("checked",true);
    }
}
function firma(ele) {
    var input = $(ele).val();
    var view = $(ele).data("view");
    if (input.length > 0) {
        $("#" + view).html(input);
        $("#" + view).css({
            visibility: "visible"
        });
    } else {
        $("#" + view).html("*");
        $("#" + view).css({
            visibility: "hidden"
        });
        
    }
}
function registrar(){
    var nombre=$("input[name=nombre]").val();
    var tpcambio=$("input[name=tipoCambio]").val();
    var fv1=$("input[name=fventa1]").val();
    var fv2=$("input[name=fventa2]").val();
    var fv3=$("input[name=fventa3]").val();
    var fv4=$("input[name=fventa4]").val();
    var fc1=$("input[name=fcompra1]").val();
    var fc2=$("input[name=fcompra2]").val();
    var fc3=$("input[name=fcompra3]").val();
    var fc4=$("input[name=fcompra4]").val();
    var fco1=$("input[name=fcobranza1]").val();
    var fco2=$("input[name=fcobranza2]").val();
    var listaTr=$("#tblFuncionalidad input:checked");
    var logo=$("#logo").data("peque");
    var listaCatgoria=$("#categoriaEmpresa input:checked");
    var categoria=[];
    for (var i = 0; i < listaCatgoria.length; i++) {
        categoria.push($(listaCatgoria[i]).val())
    }
    if(online==="activo" && categoria.length===0){
        alertaRapida("Tiene que seleccionar por  lo menos una categoría.","error");
        return;
    }
    var online=$("input[name=online]:checked").val();
    var onlineFactura=$("input[name=onlinefactura]:checked").val();
    var delivery=$("input[name=delivery]:checked").val();
    var tarifa=$("input[name=tarifa]:checked").val();
    if(online==="activo" && logo.indexOf("Imagen/Iconos/earth190.svg")>0){
        alertaRapida("No ha subido el logo de su empresa.","error");
        return;
    }
    var lista=[];
    for (var i = 0; i < listaTr.length; i++) {
        var id=$(listaTr[i]).val();
        if(id!=="0"){
            lista.push(id);
        }
    }
    cargando(true);
    $.post(url, {proceso: 'registrar',nombre:nombre,tpcambio:tpcambio,fv1:fv1,delivery:delivery
        ,fv2:fv2,fv3:fv3,fv4:fv4,fc1:fc1,fc2:fc2,fc3:fc3,fc4:fc4,online:online,tarifa:tarifa
        ,fco1:fco1,fco2:fco2,lista:lista,logo:logo,categoria:categoria,onlineFactura:onlineFactura}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error, "error");
        } else {
            window.parent.empresaD = json.result.empresa;
            alertaRapida("Se registro correctamente los cambios. Tiene que logearse nuevamente para actualizar los cambios en el sistema");
        }
    });
}
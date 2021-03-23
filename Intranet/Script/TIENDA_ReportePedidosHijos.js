var url = '../Controlador/TIENDA_ReportePedidosHijos_Controlador.php';
var contador = 0;
var posicion = 0;
var tamanopantalla = $(window).height() - 235;
var listaUsuario;
var listaLinea;
var listaLineaCatalogo = [];
var categoria_id = "0";
var listaCategoria = [];
$(document).ready(function () {
    var tiendaLocal = localStorage.getItem("tienda");
    if (tiendaLocal === null) {
        window.parent.cerrarSession();
        return;
    }
    $(".fecha").val(fechaActual());
    $(".fecha").datepicker();
    tiendaLocal = $.parseJSON(tiendaLocal);
    $("#contenedorUsuarop").css("height", tamanopantalla);
    $(window).resize(function () {
        var tamanopantalla = $(window).height() - 265;
        $("#contenedorUsuarop").css("height", tamanopantalla);
    });
    buscar();
});
function buscar() {
    var de = $("input[name=de]").val();
    var hasta = $("input[name=hasta]").val();
    var buscador = ($("input[name=buscar]").val() + "").toUpperCase();
    cargando(true);
    $.get(url, {proceso: "buscador", de: de, hasta: hasta, buscador: buscador}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error, "error");
        } else {
            var lista = json.result;
            var html = "<table class='table'>";
            html += "<thead  class='thead-light'>";
            html += "<th><div class='pequeno2'></div></th>";    
            html += "<th><div class='normal'>Solicitado</div></th>";
            html += "<th><div class='normal'>Programado</div></th>";
            html += "<th><div class='normal'>Cliente</div></th>";
            html += "<th><div class='normal'>Total Pedido</div></th>";
            html += "<th><div class='normal'>Comision</div></th>";
            html += "<th><div class='normal'>Estado</div></th>";
            html += "<th><div class='normal'>Estado Pago Comision</div></th>";
            html += "</thead><tbody style='height:300px'>";
            var totalVenta = 0;
            var totalComission = 0;
            for (var i = 0; i < lista.length; i++) {
                var venta = parseFloat(lista[i]["totalPedido"]);
                var comision = parseFloat(lista[i]["comision"]);
                totalVenta += venta;
                totalComission += comision;
                var pagado=lista[i]["pagado"];
                var cssPago="";
                if(pagado==="pagado"){
                    cssPago="estadoVerde";
                }
                if(pagado==="pendiente"){
                    cssPago="estadoPlomo";
                }
                html += "<tr>";
                if(pagado==="Sin Cobrar"){
                    html += "<th><div class='pequeno2'><input data-comision='"+comision+"' type='checkbox' checked name='pago' value='"+lista[i]["id_pedidoApp"]+"'></div></th>";    
                }else{
                    html += "<th><div class='pequeno2'></div></th>";    
                }
                html += "<td><div class='normal'>" + lista[i]["solicitada"] + "</div></td>";
                html += "<td><div class='normal'>" + lista[i]["fechaProgramada"] + " " + lista[i]["horaProgramada"] + "</div></td>";
                html += "<td><div class='normal'>" + lista[i]["cliente"] + "</div></td>";
                html += "<td><div class='normal derecha'>" + format(venta) + "</div></td>";
                html += "<td><div class='normal derecha'>" + format(comision) + "</div></td>";
                html += "<td><div class='normal'>" + lista[i]["estado"] + "</div></td>";
                html += "<td><div class='normal "+cssPago+"'>" + pagado + "</div></td>";
                html += "</tr>";
            }
            html += "</tbody><tfoot>";
            html += "<th><div class='pequeno2'></div></th>"; 
            html += "<td><div class='normal'></div></td>";
            html += "<td><div class='normal'></div></td>";
            html += "<td><div class='normal'>TOTAL</div></td>";
            html += "<td><div class='normal derecha'>" + format(totalVenta) + "</div></td>";
            html += "<td><div class='normal derecha'>" + format(totalComission) + "</div></td>";
            html += "<td><div class='normal'></div></td>";
            html += "<tr>";
            html += "</tr>";
            $("#contenedorUsuarop").html(html);
            $("#contenedorUsuarop").igualartabla();
        }
    });
}
function solicitarPago(){
    var lista=$("#contenedorUsuarop input:checked");
    var monto=0;
    for (var i = 0; i < lista.length; i++) {
        var valor=parseFloat($(lista[i]).data("comision"));
        monto+=valor;
    }
    if(monto<=0){
        alertaRapida("No puede solicitar el pago de un monto igual a 0","error");
    }else{
        $("body").msmPregunta("¿Esta seguro de realizar la solicitud de pago comision de Bs."+monto+"?","confirmarPago()");
    }
}
function confirmarPago(){
    var lista=$("#contenedorUsuarop input:checked");
    var monto=0;
    var listaPago=[];
    var idlist="";
    for (var i = 0; i < lista.length; i++) {
        var valor=parseFloat($(lista[i]).data("comision"));
        monto+=valor;
        var id=$(lista[i]).val();
        listaPago.push({id:id,monto:valor});
        idlist+=id+",";
    }
    idlist=idlist!=""?idlist.substr(0,idlist.length-1):"";
    cargando(true);
    $.post(url, {proceso: "solicitarPago",idlist:idlist, listaPago: listaPago, monto: monto}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error, "error");
        } else {
            alertaRapida("La solicitud fue enviada correctamente.")
            buscar();
        }
    })
}
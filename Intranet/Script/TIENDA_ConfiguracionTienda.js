var url = '../Controlador/TIENDA_ConfiguracionTienda_Controlador.php';
var contador = 0;
var posicion = 0;
var tamanopantalla = $(window).height() - 265;
var listaUsuario;
var listaLinea;
var listaLineaCatalogo=[];
var categoria_id = "0";
var listaCategoria=[];
$(document).ready(function () {
    var tiendaLocal = localStorage.getItem("tienda");
    debugger
    if (tiendaLocal === null) {
        window.parent.cerrarSession();
        return;
    }
    tiendaLocal = $.parseJSON(tiendaLocal);
    $("#contenedorUsuarop").css("height", tamanopantalla);
    $(window).resize(function () {
        var tamanopantalla = $(window).height() - 265;
        $("#contenedorUsuarop").css("height", tamanopantalla);
    });
    iniciar();
});
function cambiarCheck(ele){
    var elemento=$(ele);
    var id=elemento.val();
    var check=elemento.prop("checked");
    $("input[value='"+id+"']").prop("checked",check);
}
function iniciar(){
    cargando(true);
    $.get(url, {proceso: "iniciar"}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error, "error");
        } else {
            var categoria = json.result.categoria;
            var subcategoria = json.result.subcategoria;
            var tienda = json.result.tienda;
            var html="";
            for (var i = 0; i < categoria.length; i++) {
                html+="<div class='categoriaTienda' id='c"+categoria[i].id_categoriaProducto+"'>";
                html+="<div class='titulo' >"+categoria[i].nombre+"</div>";
                html+="<ul></ul>";
                html+="</div>";
            }
            $("#contenedorUsuarop").html(html);
            for (var i = 0; i < subcategoria.length; i++) {
                html="<li><input type='checkbox' onchange='cambiarCheck(this)' value='"+subcategoria[i].id_linea_producto+"' /><label>"+subcategoria[i].descripcion+"</label></li>";
                $("#c"+subcategoria[i].categoriaProducto_id+" ul").append(html);
            }
            for (var i = 0; i < tienda.length; i++) {
                $("input[value='"+tienda[i].linea_producto_id+"']").prop("checked",true);
            }
        }
    });
}
function buscar(e) {
    if (!(e === "" || e.keyCode === 13)) {
        return;
    }
    var buscador = ($("input[name=buscar]").val() + "").toUpperCase();
    var listalinea=$("li");
    listalinea.addClass("ocultar");
    for (var i = 0; i < listalinea.length; i++) {
        var texto=$(listalinea[i]).find("label").text().toUpperCase();
        if(texto.indexOf(buscador)>=0){
            $(listalinea[i]).removeClass("ocultar");
        }
    }
}
function registrar() {
    var json = {};
    var check=$("input:checked");
    json.proceso = "registrar";
     var linea={};
    for (var i = 0; i < check.length; i++) {
        var value=$(check[i]).val();
        linea[value]=value;
    }
    
    json.Listalinea = Object.keys(linea).map((key) => linea[key]);;
    cargando(true);
    $.post(url, json, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error, "error");
        } else {
            alertaRapida("Los cambios se realizaron correctamente.");
            $("input[name=buscar]").val("");
            buscar("");
        }
    });
}
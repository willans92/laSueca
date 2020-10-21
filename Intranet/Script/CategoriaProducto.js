var url = '../Controlador/CategoriaProducto_Controlador.php';
var contador = 0;
var posicion = 0;
var tamanopantalla = $(window).height() - 265;
var listaUsuario;
var listaLinea;
var listaLineaCatalogo=[];
var categoria_id = "0";
var listaCategoria=[];
$(document).ready(function () {
    var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal === null) {
        window.parent.cerrarSession();
        return;
    }
    usuarioLocal = $.parseJSON(usuarioLocal);
    $("#contenedorUsuarop").css("height", tamanopantalla);
    $(window).resize(function () {
        var tamanopantalla = $(window).height() - 265;
        $("#contenedorUsuarop").css("height", tamanopantalla);
    });
    buscarLinea();
});
function buscarLinea(){
    cargando(true);
    $.get(url, {proceso: "linea"}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error, "error");
        } else {
            listaLinea = json.result;
            filtrarCategoria();
            buscar("");
        }
    });
}
function filtrarCategoria(){
    var html="";
    var buscador=$("input[name=buscadorLinea]").val().trim().toUpperCase();
    for (var i = 0; i < listaLinea.length; i++) {
        var txt=listaLinea[i].descripcion.toUpperCase();
        if(txt.indexOf(buscador)>=0){
            var check=listaLinea[i].check?"checked":"";
            html+="<tr>";
            html+="<td><div class='grande'>"+listaLinea[i].descripcion+"</div></td>";
            html+="<td><div class='normal'><input type='checkbox' onchange='cambioCheckLinea(this,"+listaLinea[i].id_linea_producto+")' name='l"+listaLinea[i].id_linea_producto+"' "+check+" /></div></td>";
            html+="</tr>";
        }
            
    }
    $("#tbllinea tbody").html(html);
}
function buscar(e) {
    if (!(e === "" || e.keyCode === 13)) {
        return;
    }
    $("#btnmodificar").ocultar();
    var buscador = ($("input[name=buscar]").val() + "").toUpperCase();
    var estado = $("#slestado option:selected").val();
    cargando(true);
    $.get(url, {proceso: "buscarXtext",text:buscador,estado:estado}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error, "error");
        } else {
            listaCategoria = json.result.categoria;
            var html="";
            for (var i = 0; i < listaCategoria.length; i++) {
                html+="<div onclick='modificar(1,this)' class='boxCategoriaProducto' id='c"+listaCategoria[i].id_categoriaProducto+"' data-index='"+i+"'>"+listaCategoria[i].nombre+"<div class='lineabox'> </div></div>"
            }
            $("#contenedorUsuarop").html(html);
            listaLineaCatalogo = json.result.linea;
            for (var i = 0; i < listaLineaCatalogo.length; i++) {
                var lineaObj;
                for (var j = 0; j < listaLinea.length; j++) {
                    if(listaLinea[j].id_linea_producto===listaLineaCatalogo[i].linea_producto_id){
                        lineaObj=listaLinea[j];
                        break;
                    }
                }
                $("#c"+listaLineaCatalogo[i].categoriaProducto_id).find(".lineabox").append("<div>"+lineaObj.descripcion+"</div>");
            }
        }
    });
    
    
}
function categoriaPop(tipo) {
    if (tipo === 1) {
        $("#popUsuario .modal-title").text("Nueva Categoria");
        $('#btnmodificar').ocultar();
        $("#errorPop").html("");
        $("#tbllinea input:checked").prop("checked",false);
        $("#popUsuario input").removeClass("rojoClarito");
        $("#popUsuario").limpiarFormulario();
        var usuarioLocal = localStorage.getItem("usuario");
        if (usuarioLocal === null) {
            window.parent.cerrarSession();
            return;
        }
        usuarioLocal = $.parseJSON(usuarioLocal);
        categoria_id=0;
        $("#foto").attr("src", "../Imagen/Iconos/earth190.svg");
        $("#foto").data("peque", "../Imagen/Iconos/earth190.svg");
    }
}
function cambioCheckLinea(ele,id){
    var check=$(ele).prop("checked");
    for (var i = 0; i < listaLinea.length; i++) {
        if(listaLinea[i].id_linea_producto==id){
            listaLinea[i].check=check;
        }
    }
}
function registrar() {
    var json = variables($("#popUsuario"));
    json.proceso = "registrar";
    if (json.nombre.length === 0) {
        $("#errorPop").html("No se ha ingresado el nombre de la categoria.");
        $("input[name=nombre]").addClass("rojoClarito");
        return;
    } else {
        $("input[name=nombre]").removeClass("rojoClarito");
    }
    
    $("#errorPop").html("");
    var foto = $("#foto").data("peque");
    json.foto = foto;
    var linea=[];
    for (var i = 0; i < listaLinea.length; i++) {
        if(listaLinea[i].check){
            linea.push(listaLinea[i].id_linea_producto);
        }
    }
    json.categoria_id = categoria_id;
    json.Listalinea = linea;
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
            $("#btnmodificar").ocultar();
            $("#popUsuario .cerrar").click();
            $("#imgfoto").attr("src", "../Imagen/Iconos/earth190.svg");
            $("#imgfoto").data("peque", "../Imagen/Iconos/earth190.svg");
            $("#popUsuario").limpiarFormulario();
            buscarLinea();
        }
    });
}
function modificar(tipo,ele) {
    if (tipo === 1) {
        $(".boxCategoriaProducto").removeClass("Tuplaseleccionada");
        $(ele).addClass("Tuplaseleccionada");
        $("#btnmodificar").visible();
    } else {
        var usuarioLocal = localStorage.getItem("usuario");
        if (usuarioLocal === null) {
            window.parent.cerrarSession();
            return;
        }
        usuarioLocal = $.parseJSON(usuarioLocal);
        var tupla = $(".Tuplaseleccionada");
        $("#errorPop").html("");
        $("#tbllinea input:checked").prop("checked",false);
        $("#popUsuario input").removeClass("rojoClarito");
        var index=$(tupla[0]).data("index");
        var categoria = listaCategoria[index];
        categoria_id = categoria.id_categoriaProducto;
        $("#popUsuario .modal-title").text("Modificando Categoria");
        $("input[name=nombre]").val(categoria.nombre);
        $("#estado option[value='" + categoria.estado + "']").prop("selected", true);
        $("#foto").attr("src", categoria.foto);
        $("#foto").data("peque", categoria.foto);
        for (var i = 0; i < listaLineaCatalogo.length; i++) {
            if(listaLineaCatalogo[i].categoriaProducto_id===categoria_id){
                $("#tbllinea input[name='l"+listaLineaCatalogo[i].linea_producto_id+"']").prop("checked",true);
            }
        }
    }
}
function imprimir() {
    buscar("", 1);
    var contenido = $("#contenedorUsuarop").html();
    var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal === null) {
        window.parent.cerrarSession();
        return;
    }
    usuarioLocal = $.parseJSON(usuarioLocal);
    var filtro = "<div class='row' id='filtroReporte'>";
    filtro += "<div class='col-12'><span class='negrilla'>FILTROS</div>";
    var buscador = ($("input[name=buscar]").val() + "").toUpperCase();
    var estado = $("#slestado option:selected").text() + "";
    if (buscador !== "") {
        filtro += "<div class='col-4'><span class='negrilla'>Buscador: </span>" + buscador + "</div>";
    }
    if (estado !== "") {
        filtro += "<div class='col-4'><span class='negrilla'>Estado: </span>" + estado + "</div>";
    }
    filtro += "</div>";
    imprimirReporte({contenido: contenido, sucursal_id: usuarioLocal.sucursal_id, titulo: "Categoria de Producto", datosHead: filtro, encabezadoThead: true});
}
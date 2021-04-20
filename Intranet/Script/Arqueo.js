var url = '../Controlador/Arqueo_Controlador.php';
var tamanopantalla = $(window).height() - 195;
$(document).ready(function () {
    $(".fecha").datepicker();
    $(".fecha").val(fechaActual());
    var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal === null) {
        window.parent.cerrarSession();
        return;
    }
    usuarioLocal=JSON.stringify(usuarioLocal);
    $(window).resize(function () {
        var tamanofiltro = $("#filtrosMenu").outerHeight();
        tamanopantalla = $(window).height() - 195;
        var tamanoHead = tamanopantalla - $("#tblarqueo thead").outerHeight() - tamanofiltro;
        $("#tblarqueo tbody").css("height", tamanoHead);
    });
    var listaSucursal = window.parent.listaSucursal;
    for (var i = 0; i < listaSucursal.length; i++) {
        sucursalesJson[listaSucursal[i].id_sucursal] = 0;
    }
    comboBox({identificador: "input[name=sucursal]",valueDefault:usuarioLocal.sucursal_id, datos: listaSucursal, codigo: "id_sucursal", texto: "nombre", todos: true, callback: () => {
            cambioSucursal();
    }});
   cambioSucursal();
});
function cambioSucursal(){
    var sucursalSeleccionada=$("input[name=sucursal]").data("cod");
    var listaUsuario = window.parent.listaUsuario;
    var newUsuario=[];
    if(sucursalSeleccionada!=0){
        for (var i = 0; i < listaUsuario.length; i++) {
            if(listaUsuario[i].sucursal_id==sucursalSeleccionada){
                newUsuario.push(listaUsuario[i]);
            }
        }    
    }else{
        newUsuario=listaUsuario;
    }
    comboBox({identificador: "input[name=empleado]", datos: newUsuario, codigo: "id_usuario", texto: "nombre", todos: true, callback: () => {}});
}
function imprimir() {
    if (estado === "Detalle") {
        filtroDetallado("");
    }
    var contenido = $("#tblarqueo").html();
    var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal === null) {
        window.parent.cerrarSession();
        return;
    }
    usuarioLocal = $.parseJSON(usuarioLocal);
    var filtro = "<div class='row' id='filtroReporte'>";
    var de = $("input[name=de]").val();
    var hasta = $("input[name=hasta]").val();
    var empleado = $("input[name=empleado]").val();
    var cliente = $("input[name=cliente]").val();
    var buscador = $("input[name=buscador]").val();
    var sucursal = $("input[name=sucursal]").val();
    var titulo = "";
    if (estado === "Detalle") {
        titulo = "REPORTE DE COBRANZA DETALLADA";
        filtro += "<div class='col-12'><span class='negrilla'>FILTROS</div>";
        filtro += "<div class='col-6'><span class='negrilla'>Fecha: </span>" + de + " - " + hasta + "</div>";
        if (empleado !== "") {
            filtro += "<div class='col-6'><span class='negrilla'>Cobrador: </span>" + empleado + "</div>";
        }
        if (buscador !== "") {
            filtro += "<div class='col-6'><span class='negrilla'>Busqueda: </span>" + buscador + "</div>";
        }
        if (sucursal !== "") {
            filtro += "<div class='col-6'><span class='negrilla'>Busqueda: </span>" + sucursal + "</div>";
        }
    } else if (estado === "Diario") {
        filtro += "<div class='col-12'><span class='negrilla'>FILTROS</div>";
        titulo = "REPORTE DE COBRANZA DIARIA";
        filtro += "<div class='col-6'><span class='negrilla'>Fecha: </span>" + de + " - " + hasta + "</div>";

    } else if (estado === "Cobrador") {
        filtro += "<div class='col-12'><span class='negrilla'>FILTROS</div>";
        filtro += "<div class='col-6'><span class='negrilla'>Fecha: </span>" + de + " - " + hasta + "</div>";
        if (empleado !== "") {
            filtro += "<div class='col-6'><span class='negrilla'>Cobrador: </span>" + empleado + "</div>";
        }
        titulo = "REPORTE DE COBRANZA POR COBRADOR";
    } else if (estado === "Cliente") {
        filtro += "<div class='col-12'><span class='negrilla'>FILTROS</div>";
        filtro += "<div class='col-6'><span class='negrilla'>Fecha: </span>" + de + " - " + hasta + "</div>";
        if (cliente !== "") {
            filtro += "<div class='col-6'><span class='negrilla'>Cliente: </span>" + cliente + "</div>";
        }
        titulo = "REPORTE DE COBRANZA POR COBRADOR";
    } else if (estado === "Mensual") {
        titulo = "COBRANZA MENSUAL";
    }
    filtro += "</div>";
    imprimirReporte({contenido: contenido, sucursal_id: usuarioLocal.sucursal_id, titulo: titulo, datosHead: filtro, encabezadoThead: true});
}
function reporteArqueo() {
    var de = $("input[name=de]").val();
    var hasta = $("input[name=hasta]").val();
    var empleado = $("input[name=empleado]").data("cod");
    var sucursal = $("input[name=sucursal]").data("cod");
    var estado = $("#estado option:selected").val();
    cargando(true);
    $.get(url, {proceso: 'reporteArqueo', de: de, hasta: hasta,empleado:empleado,sucursal:sucursal, estado:estado}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error, "error");
        } else {
            var html = "";
            var lista = json.result;

                            
        }
    });
}

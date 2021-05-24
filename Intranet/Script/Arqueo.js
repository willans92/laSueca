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
    usuarioLocal = JSON.stringify(usuarioLocal);
    $(window).resize(function () {
        var tamanofiltro = $("#filtrosMenu").outerHeight();
        tamanopantalla = $(window).height() - 195;
        var tamanoHead = tamanopantalla - $("#tblarqueo thead").outerHeight() - tamanofiltro;
        $("#tblarqueo tbody").css("height", tamanoHead);
    });
    var listaSucursal = window.parent.listaSucursal;
    comboBox({identificador: "input[name=sucursal]", valueDefault: usuarioLocal.sucursal_id, datos: listaSucursal, codigo: "id_sucursal", texto: "nombre", todos: true, callback: () => {
            cambioSucursal();
    }});
    comboBox({identificador: "input[name=sucursalP]", valueDefault: usuarioLocal.sucursal_id, datos: listaSucursal, codigo: "id_sucursal", texto: "nombre", todos: true, callback: () => {
            cambioSucursal();
    }});
    cambioSucursal();
});
function cambioSucursal() {
    var sucursalSeleccionada = $("input[name=sucursal]").data("cod");
    var listaUsuario = window.parent.listaUsuario;
    var newUsuario = [];
    if (sucursalSeleccionada != 0) {
        for (var i = 0; i < listaUsuario.length; i++) {
            if (listaUsuario[i].sucursal_id == sucursalSeleccionada) {
                newUsuario.push(listaUsuario[i]);
            }
        }
    } else {
        newUsuario = listaUsuario;
    }
    comboBox({identificador: "input[name=empleado]", datos: newUsuario, codigo: "id_usuario", texto: "nombre", todos: true, callback: () => {}});
    comboBox({identificador: "input[name=cobradorP]", datos: newUsuario, codigo: "id_usuario", texto: "nombre", todos: true, callback: () => {}});
}
function reporteArqueo() {
    var de = $("input[name=de]").val();
    var hasta = $("input[name=hasta]").val();
    var empleado = $("input[name=empleado]").data("cod");
    var sucursal = $("input[name=sucursal]").data("cod");
    var estado = $("#estado option:selected").val();
    cargando(true);
    $.get(url, {proceso: 'reporteArqueo', de: de, hasta: hasta, empleado: empleado, sucursal: sucursal, estado: estado}, function (response) {
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
function buscarCobrado() {
    var de = $("input[name=deP]").val();
    var hasta = $("input[name=hastaP]").val();
    var empleado = $("input[name=cobradorP]").data("cod");
    if(empleado=="0"){
        alertaRapida("No a seleccionado al cobrador","error")
        return;
    }
    cargando(true);
    $.get(url, {proceso: 'reporteCobrado', de: de, hasta: hasta, cobrador: empleado}, function (response) {
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
            for (var i = 0; i < lista.length; i++) {
                html+="<tr>";
                html+="<td><div class='chico2'><input type='checkbox' value='"+lista[i].id_cobranza+"'></div></td>";
                html+="<td><div class='normal'>"+lista[i].fecha+"</div></td>";
                html+="<td><div class='normal'>"+lista[i].detalle+"</div></td>";
                html+="<td><div class='normal'>"+format(lista[i].monto)+"</div></td>";
                html+="</tr>";
            }
            $("#tblCobranza tbody").html(html);
            $("#tblCobranza").igualartabla();
        }
    });
}
function popArqueoEvent(tipo){
    if(tipo===1){
        $("#popArqueo").modal('show');
    }else{
        $("#popArqueo").modal('hide');
    }
}
function imprimir() {
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
    var empleado = $("input[name=empleado]").data("cod");
    var sucursal = $("input[name=sucursal]").data("cod");
    var estado = $("#estado option:selected").val();
    var titulo = "";
    titulo = "REPORTE DE ARQUEO";
    filtro += "<div class='col-12'><span class='negrilla'>FILTROS</div>";
    filtro += "<div class='col-6'><span class='negrilla'>Fecha: </span>" + de + " - " + hasta + "</div>";
    if (empleado !== "0") {
        filtro += "<div class='col-6'><span class='negrilla'>Cobrador: </span>" + empleado + "</div>";
    }
    if (sucursal !== "0") {
        filtro += "<div class='col-6'><span class='negrilla'>Sucursal: </span>" + sucursal + "</div>";
    }
    filtro += "<div class='col-6'><span class='negrilla'>Estado: </span>" + estado + "</div>";
    filtro += "</div>";
    imprimirReporte({contenido: contenido, sucursal_id: usuarioLocal.sucursal_id, titulo: titulo, datosHead: filtro, encabezadoThead: true});
}
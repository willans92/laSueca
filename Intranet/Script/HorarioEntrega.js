var url = '../Controlador/HorarioEntrega_Controlador.php';
var contador = 0;
var listaHorario = {};
var id_Horario = 0;
var posicion = 0;
var tamanopantalla = $(window).height() - 260;
$(document).ready(function () {
    var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal === null) {
        window.parent.cerrarSession();
        return;
    }
    usuarioLocal=$.parseJSON(usuarioLocal);
    $("#tblprd tbody").css("height", tamanopantalla);
     $(window).resize(function () {
        var tamanopantalla = $(window).height() - 260;
        $("#tblprd tbody").css("height", tamanopantalla);
    });
    cargar();
});
function cargar() {
    var estado = $("#tpestadoB option:selected").val();
    cargando(true);
    $.get(url, {proceso: "buscarHorario", estado: estado}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error,"error");
        } else {
            var usuarioLocal = localStorage.getItem("usuario");
            if (usuarioLocal === null) {
                window.parent.cerrarSession();
                return;
            }
            listaHorario = json.result.horario;
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
    var buscador = ($("input[name=buscar]").val()+ "").toUpperCase();
    var html = "";
    for (var i = contador; i < listaHorario.length; i++) {
        if (inicia === 0) {
            break;
        }
        contador++;
        var horario = listaHorario[i];
        var detalle = (horario.detalle + "").toUpperCase();
        if (detalle.indexOf(buscador) >= 0) {
            posicion++;
            
            html += "<tr onclick='modificar(1)'  data-pos='" + i + "' data-id='" + horario.id_horarioEntrega + "' data-estado='" + horario.estado + "' >";
            html += "<td><div class='medio'>" + horario.detalle + "</div></td>";
            html += "<td><div class='normal'>" + horario.horarioDe + "</div></td>";
            html += "<td><div class='normal'>" + horario.horarioHasta + "</div></td>";
            html += "<td><div class='normal'>" + horario.estado + "</div></td>";
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
    $("#tblprd").igualartabla();
    
    $("#actualcant").text(posicion);
    var lista = listaHorario.filter(value => {
        var horario = value;
        var detalle = (horario.detalle + "").toUpperCase();
        if (detalle.indexOf(buscador) >= 0) {
            return true;
        } else {
            return false;
        }
    })
    $("#maxcant").text(lista.length);
    if (lista.length > posicion) {
        $("#btncargarMas").visible(1);
    } else {
        $("#btncargarMas").ocultar();
    }
}
function nuevo() {
    $("#formHorario input").val("");
    $("#btnmodificar").ocultar();
    id_Horario = 0;
    $("#popHorario h5").text("Nuevo Horario");
    $("#errorPop").html("");
    $("input").removeClass("rojoClarito");
    $("#tblprd tr").removeClass("Tuplaseleccionada");
    var usuarioLocal = localStorage.getItem("usuario");
    
    $("input[name=horaDe]").val("00");
    $("input[name=minDe]").val("00");
    $("input[name=segDe]").val("00");
    
    $("input[name=horaHasta]").val("00");
    $("input[name=minHasta]").val("00");
    $("input[name=segHasta]").val("00");
    
    if (usuarioLocal === null) {
        window.parent.cerrarSession();
        return;
    }
    $('#popHorario').modal('show');
}
function modificar(tipo) {
    if (tipo === 1) {
        $("#btnmodificar").visible();
    } else {
        var tupla = $("tr.Tuplaseleccionada");
        if (tupla.length === 0) {
            alertaRapida("No ha seleccionado el producto que quiere modificar.");
            return;
        }
        id_Horario = $(tupla[0]).data("id");
        var posicion = $(tupla[0]).data("pos");
        var item=listaHorario[posicion];
        $("#tpestado option[value=" + item.estado + "]").prop("selected", true);
        $("#popHorario h5").text("Modificando Horario");
        $("input[name=detalle]").val(item.detalle);
        var horarioDe=item.horarioDe.split(":");
        var horarioHasta=item.horarioHasta.split(":");
        
        $("input[name=horaDe]").val(horarioDe[0]);
        $("input[name=minDe]").val(horarioDe[1]);
        $("input[name=segDe]").val(horarioDe[2]);
        $("input[name=horaHasta]").val(horarioHasta[0]);
        $("input[name=minHasta]").val(horarioHasta[1]);
        $("input[name=segHasta]").val(horarioHasta[2]);
        $('#popHorario').modal('show');
    }

}
function registrar() {
    var json = variables("#formHorario");
    json.proceso = 'registrarHorario';
    json.id_horarioEntrega = id_Horario;
    
    if(json.horaDe.trim().length<2){
        json.horaDe="0"+json.horaDe;
    }
    if(json.minDe.trim().length<2){
        json.minDe="0"+json.minDe;
    }
    if(json.segDe.trim().length<2){
        json.segDe="0"+json.segDe;
    }
    if (!validar("entero", json.horaDe)) {
        $("#errorPop").html("No ingreses letras en hora de.");
        $("input[name=horaDe]").addClass("rojoClarito");
        return;
    }else{
        $("input[name=horaDe]").removeClass("rojoClarito");
    }
    if (!validar("entero", json.minDe)) {
        $("#errorPop").html("No ingreses letras en hora de.");
        $("input[name=minDe]").addClass("rojoClarito");
        return;
    }else{
        $("input[name=minDe]").removeClass("rojoClarito");
    }
    if (!validar("entero", json.segDe)) {
        $("#errorPop").html("No ingreses letras en hora de.");
        $("input[name=segDe]").addClass("rojoClarito");
        return;
    }else{
        $("input[name=segDe]").removeClass("rojoClarito");
    }
    if(json.horaHasta.trim().length<2){
        json.horaHasta="0"+json.horaHasta;
    }
    if(json.minHasta.trim().length<2){
        json.minHasta="0"+json.minHasta;
    }
    if(json.segHasta.trim().length<2){
        json.segHasta="0"+json.segHasta;
    }
    if (!validar("entero", json.horaHasta)) {
        $("#errorPop").html("No ingreses letras en hora Hasta.");
        $("input[name=horaHasta]").addClass("rojoClarito");
        return;
    }else{
        $("input[name=horaDe]").removeClass("rojoClarito");
    }
    if (!validar("entero", json.minHasta)) {
        $("#errorPop").html("No ingreses letras en hora Hasta.");
        $("input[name=minHasta]").addClass("rojoClarito");
        return;
    }else{
        $("input[name=minHasta]").removeClass("rojoClarito");
    }
    if (!validar("entero", json.segHasta)) {
        $("#errorPop").html("No ingreses letras en hora Hasta.");
        $("input[name=segHasta]").addClass("rojoClarito");
        return;
    }else{
        $("input[name=segHasta]").removeClass("rojoClarito");
    }
    
    cargando(true);
    $.post(url, json, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error,"error");
        } else {
            $('#popHorario').modal('hide');
            $("#btnmodificar").ocultar();
            if(id_Horario!==0){
                alertaRapida("El Horario se actualizo correctamente.");
            }else{
                alertaRapida("El Horario se registro correctamente.");
            }
            cargar();
        }
    });
}
function imprimir() {
    buscar("", 1);
    var contenido = $("#contenedorHorario").html();
    var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal === null) {
        window.parent.cerrarSession();
        return;
    }
    usuarioLocal = $.parseJSON(usuarioLocal);
    var filtro = "<div class='row'  id='filtroReporte'>";
    filtro += "<div class='col-12'><span class='negrilla'>FILTROS</div>";
    var sucursal = $("input[name=tpsucursalB]").val();
    var buscador = ($("input[name=buscar]").val()+ "").toUpperCase();
    var estado = $("#tpestadoB option:selected").val();
    if (buscador !== "") {
        filtro += "<div class='col-3'><span class='negrilla'>Busqueda: </span>" + buscador + "</div>";
    }
    filtro += "<div class='col-3'><span class='negrilla'>Estado: </span>" + estado + "</div>";
    if (sucursal !== "") {
        filtro += "<div class='col-3'><span class='negrilla'>Sucursal: </span>" + sucursal + "</div>";
    }
   
    filtro += "</div>";
    imprimirReporte({contenido: contenido, sucursal_id: usuarioLocal.sucursal_id, titulo: "Lista de Horario", datosHead: filtro, encabezadoThead: true});
}

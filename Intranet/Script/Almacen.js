var url = '../Controlador/Almacen_Controlador.php';
var contador = 0;
var listaAlmacen = {};
var id_Almacen = 0;
var posicion = 0;
var tamanopantalla = $(window).height() - 250;
$(document).ready(function () {
    var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal === null) {
        window.parent.cerrarSession();
        return;
    }
    usuarioLocal=$.parseJSON(usuarioLocal);
    $("#tblprd tbody").css("height", tamanopantalla);
     $(window).resize(function () {
        var tamanopantalla = $(window).height() - 250;
        $("#tblprd tbody").css("height", tamanopantalla);
    });
    var listaSucursal = window.parent.listaSucursalRapida;
    var sucursal=listaSucursal["s"+usuarioLocal.sucursal_id];
    comboBox({identificador: "input[name=tpsucursal]",valueDefault:usuarioLocal.sucursal_id, datos: listaSucursal, codigo: "id_sucursal", texto: "nombre" });
    comboBox({identificador: "input[name=tpsucursalB]",valueDefault:usuarioLocal.sucursal_id, datos: listaSucursal, codigo: "id_sucursal", texto: "nombre", todos: true, callback:()=>{buscar("", 1)}});
    cargar();
});
function cargar() {
    var estado = $("#tpestadoB option:selected").val();
    cargando(true);
    $.get(url, {proceso: "buscarAlmacen", estado: estado}, function (response) {
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
            listaAlmacen = json.result.almacen;
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
    var sucursal = $("input[name=tpsucursalB]").data("cod")+"";
    var buscador = ($("input[name=buscar]").val()+ "").toUpperCase();
    var listaSucursal = window.parent.listaSucursalRapida;
    var html = "";
    for (var i = contador; i < listaAlmacen.length; i++) {
        if (inicia === 0) {
            break;
        }
        contador++;
        var almacen = listaAlmacen[i];
        var codigo = almacen.codigo + "";
        var nombre = (almacen.nombre + "").toUpperCase();
        var suc = almacen.sucursal_id;
        var estadoSucursal = true;
        if (sucursal !== "0") {
            estadoSucursal = sucursal === (suc + "");
        }
        if ((codigo.indexOf(buscador) >= 0 || nombre.indexOf(buscador) >= 0) && estadoSucursal) {
            posicion++
            
            var sucursalObj=listaSucursal["s"+almacen.sucursal_id];
        
            html += "<tr onclick='modificar(1)'  data-pos='" + i + "' data-id='" + almacen.id_almacen + "' data-sucursal=" + suc + " data-estado='" + almacen.estado + "' >";
            html += "<td><div class='chico'>" + almacen.codigo + "</div></td>";
            html += "<td><div class='medio'>" + almacen.nombre + "</div></td>";
            html += "<td><div class='medio'>" + sucursalObj.nombre + "</div></td>";
            html += "<td><div class='medio'>" + almacen.direccion + "</div></td>";
            html += "<td><div class='normal'>" + almacen.telefono + "</div></td>";
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
    var lista = listaAlmacen.filter(value => {
        var almacen = value;
        var codigo = almacen.codigo + "";
        var nombre = (almacen.nombre + "").toUpperCase();
        var suc = almacen.sucursal_id;
        var estadoSucursal = true;
        if (sucursal !== "0") {
            estadoSucursal = sucursal === (suc + "");
        }
        if ((codigo.indexOf(buscador) >= 0 || nombre.indexOf(buscador) >= 0) && estadoSucursal) {
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
    $("#formAlmacen input").val("");
    $("#btnmodificar").ocultar();
    id_Almacen = 0;
    $("#popAlmacen h5").text("Nuevo Almacén");
    $("#errorPop").html("");
    $("input").removeClass("rojoClarito");
    $("#tblprd tr").removeClass("Tuplaseleccionada");
     var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal === null) {
        window.parent.cerrarSession();
        return;
    }
    usuarioLocal=$.parseJSON(usuarioLocal);
    var listaSucursal = window.parent.listaSucursalRapida;
    var sucursal=listaSucursal["s"+usuarioLocal.sucursal_id];
    $("input[name=tpsucursal]").data("cod",usuarioLocal.sucursal_id);
    $("input[name=tpsucursal]").val(sucursal.nombre);
    id_producto = 0;
    if(window.parent.conf[13]){
        $("#codigBox").ocultar();
    }
    $('#popAlmacen').modal('show');
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
        id_Almacen = $(tupla[0]).data("id");
        var posicion = $(tupla[0]).data("pos");
        var item=listaAlmacen[posicion];
        $("input[name=codigo]").val(item.codigo);
        $("input[name=nombre]").val(item.nombre);
        $("input[name=direccion]").val(item.direccion);
        $("input[name=telefono]").val(item.telefono);
        $("input[name=posicion]").val(item.posicion);

        var listaSucursal = window.parent.listaSucursalRapida;
        var sucursal=listaSucursal["s"+item.sucursal_id];
        $("input[name=tpsucursal]").data("cod",item.sucursal_id);
        $("input[name=tpsucursal]").val(sucursal.nombre);
    
        $("#tpestado option[value=" + item.estado + "]").prop("selected", true);
        $("#popAlmacen h5").text("Modificando Almacén");
        if(window.parent.conf[10]){
            $("#codigBox").css("display","block");
            $("input[name=codigo]").prop("readonly",true);
        }
        $('#popAlmacen').modal('show');
        
    }

}
function registrar() {
    var json = variables("#formAlmacen");
    json.proceso = 'registrarAlmacen';
    json.tpsucursal = $("input[name=tpsucursal]").data("cod");
    json.id_almacen = id_Almacen;

    if (!validar("texto y entero", json.codigo)) {
        $("#errorPop").html("El código solo puede tener Letra y números, no otro tipo de caracteres.");
        $("input[name=codigo]").addClass("rojoClarito");
        return;
    }else{
        $("input[name=codigo]").removeClass("rojoClarito");
    }
    if (json.nombre.length === 0) {
        $("#errorPop").html("No se ha ingresado el nombre del almacén.");
        $("input[name=nombre]").addClass("rojoClarito");
        return;
    }else{
        $("input[name=nombre]").removeClass("rojoClarito");
    }

    if (json.tpsucursal === "0") {
        $("#errorPop").html("Debe seleccionar una sucursal.");
        $("#tpsucursal").addClass("rojoClarito");
        return;
    }else{
        $("#tpsucursal").removeClass("rojoClarito");
    }
    if ((json.posicion+"").length > 3) {
        $("#errorPop").html("La Posición no puede ser mayor a 100.");
        $("input[name=posicion]").addClass("rojoClarito");
        return;
    }else{
        $("input[name=posicion]").removeClass("rojoClarito");
    }
    json.generarCodigo = 0;
    if(window.parent.conf[13]){
        json.generarCodigo = 1;
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
            $('#popAlmacen').modal('hide');
            $("#btnmodificar").ocultar();
            if(id_Almacen!==0){
                alertaRapida("El almacén se actualizo correctamente.");
            }else{
                alertaRapida("El almacén se registro correctamente.");
            }
            cargar();
        }
    });
}
function imprimir() {
    buscar("", 1);
    var contenido = $("#contenedorAlmacen").html();
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
    imprimirReporte({contenido: contenido, sucursal_id: usuarioLocal.sucursal_id, titulo: "Lista de Almacén", datosHead: filtro, encabezadoThead: true});
}

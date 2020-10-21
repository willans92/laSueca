var url = '../Controlador/Provedor_Controlador.php';
var contador = 0;
var listaProvedor = {};
var id_provedor = 0;
var posicion = 0;
var tamanopantalla = $(window).height() - 290;
$(document).ready(function () {
    $("#popProvedor .modal-body").css("max-height", tamanopantalla);
    $("#tblprd tbody").css("height", tamanopantalla);
    $(window).resize(function () {
        var tamanopantalla = $(window).height() - 290;
        $("#popProvedor .modal-body").css("max-height", tamanopantalla);
        $("#tblprd tbody").css("height", tamanopantalla);
    });
    var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal === null) {
        window.parent.cerrarSession();
        return;
    }
    cargar();
});
function cargar() {
    var estado = $("#tpestadoB option:selected").val();
    cargando(true);
    $.get(url, {proceso: "buscarProvedor", estado: estado}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error,"error");
        } else {
            listaProvedor = json.result;
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
    for (var i = contador; i < listaProvedor.length; i++) {
        if (inicia === 0) {
            break;
        }
        contador++;
        var provedor = listaProvedor[i];
        var nit = (provedor.nit + "").toUpperCase();
        var nombre = (provedor.nombre + "").toUpperCase();
        var razonSocial = (provedor.razonsocial+"").toUpperCase();
        if (nit.indexOf(buscador) >= 0 || razonSocial.indexOf(buscador) >= 0 || nombre.indexOf(buscador) >= 0) {
            posicion++
            html += "<tr onclick='modificar(1)' data-id='" + provedor.id_provedor + "' data-estado='" + provedor.estado + "' data-pos='" + i + "'>";
            html += "<td><div class='pequeno'>" + provedor.nit + "</div></td>";
            html += "<td><div class='medio'>" + provedor.nombre + "</div></td>";
            html += "<td><div class='medio'>" + provedor.razonsocial + "</div></td>";
            html += "<td><div class='normal'>" + provedor.direccion + "</div></td>";
            html += "<td><div class='normal'>" + provedor.email + "</div></td>";
            html += "<td><div class='chico'>" + provedor.telefono + "</div></td>";
            html += "<td><div class='chico'>" + provedor.formaPago + "</div></td>";
            html += "<td><div class='chico'>" + provedor.tipoDocumento + "</div></td>";
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
    $("table").igualartabla();
    $("#actualcant").text(posicion);
    var lista = listaProvedor.filter(value => {
        var provedor = value;
        var nit = (provedor.nit + "").toUpperCase();
        var nombre = (provedor.nombre + "").toUpperCase();
        var razonSocial = (provedor.razonsocial+"").toUpperCase();
        if (nit.indexOf(buscador) >= 0 || razonSocial.indexOf(buscador) >= 0 || nombre.indexOf(buscador) >= 0) {
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
function nuevo() {
    $("#formProvedor input").val("");
    $("#btnmodificar").ocultar();
    id_provedor = 0;
    $("#popProvedor h5").text("Nueva Proveedor");
    $("#errorPop").html("");
    $("#popProvedor input").removeClass("rojoClarito");
    $('#tblprd tr').removeClass("Tuplaseleccionada");
    $('#popProvedor').modal('show');
}
function modificar(tipo) {
    if (tipo === 1) {
        $("#btnmodificar").visible();
    } else {
        var tupla = $("tr.Tuplaseleccionada");
        if (tupla.length === 0) {
            alertaRapida("No ha seleccionado el proveedor que quiere modificar.");
            return;
        }
        $("#errorPop").html("");
        $("#popProvedor input").removeClass("rojoClarito");
        $("#formProvedor input").val("");
        $('#popProvedor').modal('show');
        id_provedor = $(tupla[0]).data("id");
        var posicion = $(tupla[0]).data("pos");
        var item=listaProvedor[posicion];
        
        $("input[name=nit]").val(item.nit);
        $("input[name=nombre]").val(item.nombre);
        $("input[name=rz]").val(item.razonsocial);
        $("input[name=direccion]").val(item.direccion);
        $("input[name=correo]").val(item.email);
        $("input[name=telefono]").val(item.telefono);
        $("input[name=psContacto]").val(item.personaContacto);
        $("input[name=TelfpsContacto]").val(item.numeroPersonaContacto);
        $("#tppago option[value='" + item.formaPago + "']").prop("selected", true);
        $("#tpDoc option[value='" + item.tipoDocumento + "']").prop("selected", true);
        $("#tpestado option[value='" + $(tupla[0]).data("estado") + "']").prop("selected", true);
        $("#popProvedor h5").text("Modificando Provedor");
        $("#errorPop").html("");
    }
}
function registrar() {
    var json = variables("#formProvedor");
    json.proceso = 'registrarProvedor';
    json.id_provedor = id_provedor;


    if (!validar("entero", json.nit)) {
        $("#errorPop").html("El NIT puede tener caracteres numéricos.");
        $("input[name=nit]").addClass("rojoClarito");
        return;
    }else{
        $("input[name=nit]").removeClass("rojoClarito");
    }
    if ((json.nombre+"").length === 0) {
        $("#errorPop").html("No se ha ingresado el nombre de la empresa.");
        $("input[name=nombre]").addClass("rojoClarito");
        return;
    }else{
        $("input[name=nombre]").removeClass("rojoClarito");
    }
    
    if ((json.rz+"").length === 0) {
        $("#errorPop").html("No se ha ingresado la razon social de la empresa.");
        $("input[name=rz]").addClass("rojoClarito");
        return;
    }else{
        $("input[name=rz]").removeClass("rojoClarito");
    }
   

    var expresion = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (json.correo.trim()!=="" && (!expresion.test(json.correo.trim()) )){
        $("input[name=correo]").addClass("rojoClarito");
        $("#errorPop").html("El correo es invalido.");
        return;
    }else{
        $("input[name=correo]").removeClass("rojoClarito");
    }
     
  
    if (json.nombre !== "" && json.rz === "") {
        json.rz = json.nombre
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
            if(id_provedor===0){
                alertaRapida("El proveedor se registro correctamente.");
            }else{
                alertaRapida("El proveedor se actualizo correctamente.");
            }
            $("#btnmodificar").ocultar();
            id_provedor=0;
            cargar();
            $('#popProvedor').modal('hide');
        }
    });
}
function cambioNombreEmpresa(){
    var rz=$("input[name=rz]").val().trim();
    if(rz===""){
        var nombre=$("input[name=nombre]").val().trim();
        $("input[name=rz]").val(nombre);
    }
}
function imprimir() {
     buscar("", 1);
    var contenido = $("#contenedorProveedor").html();
    var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal === null) {
        window.parent.cerrarSession();
        return;
    }
    usuarioLocal = $.parseJSON(usuarioLocal);
    var filtro = "<div class='row' id='filtroReporte'>";
    filtro += "<div class='col-12'><span class='negrilla'>FILTROS</div>";
    var buscador = $("input[name=buscar]").val();
    var estado = $("#tpestadoB option:selected").text()+"";
    filtro += "<div class='col-4'><span class='negrilla'>Estado: </span>" +estado+ "</div>";
    if(buscar!==""){
        filtro += "<div class='col-4'><span class='negrilla'>Buscador: </span>" + buscador + "</div>";
    }
    filtro += "</div>";
    imprimirReporte({contenido: contenido, sucursal_id: usuarioLocal.sucursal_id, titulo: "Lista de Proveedores", datosHead: filtro, encabezadoThead: true});
}
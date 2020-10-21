var url = '../Controlador/ConfiguracionCuenta_Controlador.php';
var trabajadorSeleccionado;
var permisosTrabajador = {};
var permisosFromularios=[];
var permisosAccion={};
var tamanopantalla = $(window).height() - 211;
$(document).ready(function () {
    $("#contenedorPermisos").css("height", tamanopantalla);
     $(window).resize(function () {
        var tamanopantalla = $(window).height() - 211;
        $("#contenedorPermisos").css("height", tamanopantalla);
    });
    var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal === null) {
        window.parent.cerrarSession();
        return;
    }
    var datos = window.parent.listaUsuario;
    listaUsuario = Object.keys(datos).map((key) => datos[key]);
    
    comboBox({identificador: "input[name=buscador]", datos: listaUsuario.filter((item)=>item.estado==="activo" && item.cuenta!==""), codigo: "id_usuario", texto: "ci", texto2: "nombre", todos: false, callback: (item) => seleccionarTeabajador(item)});
    cargarPermisos();
});
function seleccionarTeabajador(trabajador) {
    if (trabajador) {
        trabajadorSeleccionado = trabajador;
    }
    if (!trabajador) {
        return;
    }
    var nombre = trabajador.nombre;
    nombre = nombre === "" ? "-" : nombre;
    var ci = trabajador.ci;
    ci = ci === "" ? "-" : ci;
    $("input[name=ci]").val(ci);
    $("input[name=trabajador]").val(nombre);
    $("#btnregistrar").visible();
    cargando(true);
    $.get(url, {proceso: 'permisosAsignadoCuenta', idusu: trabajador.id_usuario}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error,"error");
        } else {
            permisosTrabajador={};
            var lista = json.result;
            for (var i = 0; i < lista.length; i++) {
                permisosTrabajador[lista[i].permiso_id]=lista[i].permiso_id;
            }
            seleccionarPermisosTrabajador();
        }
    });
}
function cargarPermisos() {
    cargando(true);
    $.get(url, {proceso: 'CategoriaPermisos'}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error,"error");
        } else {
            var categoria = json.result.categoria;
            var html = "";
            for (var i = 0; i < categoria.length; i++) {
                html += "<div class='categoriaPermiso' >" + categoria[i].nombre.toUpperCase() + "</div>";
                html += "<div id='n" + categoria[i].id_CategoriaPermiso + "'></div>";
            }
            $("#permisosFormulario").html(html);
            var listaPermisos = json.result.permisos;
            permisosFromularios=[];
            permisosAccion={};
            for (var i = 0; i < listaPermisos.length; i++) {
                if(listaPermisos[i].permisoPadre==="" || listaPermisos[i].permisoPadre==="0"){
                    if(listaPermisos[i].id_permiso===46){
                        if(!window.parent.conf[1]){
                            continue;
                        }
                    }
                    html = "<div class='itemPermiso' >";
                    html += "<input type='checkbox'  onchange='changeCheck("+listaPermisos[i].id_permiso+",this)'  name='permisos' value='" + listaPermisos[i].id_permiso + "' class='c" + listaPermisos[i].CategoriaPermiso_id + "'/> <span class='nombre ' onclick='seleccionarPermisoFormlario(this," + listaPermisos[i].id_permiso + ")'>" + listaPermisos[i].nombre + "</span>";
                    html += "</div>";
                    $("#n" + listaPermisos[i].CategoriaPermiso_id).append(html);
                }else{
                    if(!permisosAccion[listaPermisos[i].permisoPadre]){
                        permisosAccion[listaPermisos[i].permisoPadre]=[];
                    }
                    permisosAccion[listaPermisos[i].permisoPadre].push(listaPermisos[i]);
                }
                
            }
            //var perfiles = json.result.perfil;
        }
    });
}
function seleccionarPermisoFormlario(ele,id){
    $("#permisosFormulario .itemPermiso").removeClass("verdeClarito")
    $(ele).parent().addClass("verdeClarito");
    var permisoHijo=permisosAccion[id];
    var html="";
    if(permisoHijo){
        for (var i = 0; i < permisoHijo.length; i++) {
            if(permisoHijo[i].id_permiso===60){
                if(!window.parent.conf[1]){
                    continue;
                }
            }
            html += "<div class='itemPermiso'>";
            html += "<input type='checkbox' onchange='changeCheck("+permisoHijo[i].id_permiso+",this)'  name='permisos' value='" + permisoHijo[i].id_permiso + "' class='c" + permisoHijo[i].CategoriaPermiso_id + "'/> <span class='nombre '>" + permisoHijo[i].nombre + "</span>";
            html += "</div>";
        }
    }
    $("#permisosAccion").html(html);
    seleccionarPermisosTrabajador();
}
function seleccionarPermisosTrabajador(){
    $(".itemPermiso input").prop("checked",false);
    for (var i in permisosTrabajador) {
        $("input[value='"+permisosTrabajador[i]+"']").prop("checked",true);
    }
}
function changeCheck(idpermiso,ele){
    if($(ele).prop("checked")){
        permisosTrabajador[idpermiso]=idpermiso;
    }else{
        delete permisosTrabajador[idpermiso];
    }
    seleccionarPermisosTrabajador();
}
function registrar(){
    //var perfil = $("#perfil option:selected").val();
    var lista = [];
    for (var i in permisosTrabajador) {
        lista.push(permisosTrabajador[i]);
    }
    cargando(true);
    $.post(url, {proceso: 'registarPermiso', lista: lista, idusuario: trabajadorSeleccionado.id_usuario}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            alertaRapida(json.error,"error");
        } else {
            alertaRapida("Los cambios de los permisos se registraron correctamente.")
            
        }
    });
}
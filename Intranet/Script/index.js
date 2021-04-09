var url = 'Controlador/Login_Controlador.php';
var tipo="Administrativo";
function cambiarTipo(ele,tipoAdm){
    tipo=tipoAdm;
    $("#tipoLogin div").removeClass("tipoLoginSelected");
    $(ele).addClass("tipoLoginSelected");
}
function entrar(e) {
    localStorage.removeItem("firebase");
    if (e !== "" && e.keyCode !== 13) {
        return;
    }
    var cuenta = $("input[name=cuentaLogeo]").val().trim();
    var contra = $("input[name=contrasenaLogeo]").val().trim();
    var errar = "";
    if (cuenta.length === 0) {
        errar += "<p>-La cuenta se encuentra vacía</p>";
    }
    if (contra.length === 0) {
        errar += "<p>-La contraseña se encuentra vacía</p>";
    }
    if (errar.length > 0) {
        alertaRapida(errar);
        return;
    }
    cargando2(true);
    $.get(url, {cuenta: cuenta, contra: contra, proceso: 'logear',tipo:tipo}, function (response) {
        cargando2(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            alertaRapida(json.error,"error");
        } else {
            openRequest = indexedDB.open("lasueca", 1);
            openRequest.onupgradeneeded = function (e) {
                var thisDB = e.target.result;
                if (!thisDB.objectStoreNames.contains("")) {
                    var version = thisDB.createObjectStore("version", {keyPath: "version"});
                    var versionIndex = version.createIndex("version", "version", {unique: true});
                    version.put({version: "versionusuario", nro: 0, datos: {}});
                    version.put({version: "versioncliente", nro: 0, datos: {}});
                    version.put({version: "versionproducto", nro: 0, datos: {}});
                    version.put({version: "empresa", id: 0});
                }
            };
            openRequest.onsuccess = function () {
                var db = openRequest.result;
                var tx = db.transaction('version', "readonly");
                var store = tx.objectStore('version');
                var index = store.index('version');
                var request = index.get('empresa');
                request.onsuccess = function () {
                    var dataSet = request.result;
                    if ((dataSet.id + "") === json.result.empresa_id) {
                        localStorage.setItem("usuario", JSON.stringify(json.result));
                        $(location).attr('href', "Portal.php");
                    } else {
                        vaciarDBindex(() => {
                            if(tipo==="Administrativo"){
                                localStorage.removeItem("tienda");
                                localStorage.setItem("usuario", JSON.stringify(json.result));
                               $(location).attr('href', "Portal.php"); 
                            }else{
                                localStorage.removeItem("usuario");
                                localStorage.setItem("tienda", JSON.stringify(json.result));
                               $(location).attr('href', "PortalTienda.php");
                            }
                            
                        });
                    }
                }
            }
        }
    });
}
function cargando2(estado) {
    if (estado) {
        var elemento = "<div  id='cargando' >"
                + "<div>"
                + "<img src='Imagen/Cargando.gif' title='CARGANDO'/>"
                + "<span class='negrillaenter centrar'>CARGANDO</span>"
                + "</div>";
        +"</div>";
        $("body").append(elemento);
    } else {
        $("#cargando").remove();
    }
}
function vaciarDBindex(onSusses) {
    window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB;
    window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: "readwrite"};
    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
    if (!window.indexedDB) {
        window.alert("Su Navegador no soporta el sistema. Actualicelo.");
        return;
    }
    openRequest = indexedDB.open("lasueca", 1);
    openRequest.onsuccess = function () {
        var db = openRequest.result;
        var tx = db.transaction("version", "readwrite");
        var store = tx.objectStore("version");
        var guardar = {version: "empresa", id: 0};
        var update = store.put(guardar);
        update.onsuccess = function () {
            var guardar = {version: "versioncliente", nro: 0, datos: []};
            var update = store.put(guardar);
            update.onsuccess = function () {
                var guardar = {version: "versionusuario", nro: 0, datos: []};
                var update = store.put(guardar);
                update.onsuccess = function () {
                    var guardar = {version: "versionproducto", nro: 0, datos: []};
                    var update = store.put(guardar);
                    update.onsuccess = function () {
                        onSusses();
                    };
                };
            };
        };
    };

}
function alertaRapida(mensaje, tipo = "confirmacion",marginTop=0) {// error, confirmacion
    var alertaR = "";
    if (tipo === "confirmacion") {
        alertaR = "<div id='alertaRapida' class='alertaConfirmacion'>" + mensaje + "</div>";
    } else {
        alertaR = "<div id='alertaRapida'>" + mensaje + "</div>";

    }
    $("body").append(alertaR);
    var alerta = $("#alertaRapida");
    var alto = alerta.outerHeight() + 20;
    alerta.css("marginTop", "-" + alto + "px");
    alerta.animate({marginTop: marginTop}, 1000, () => {
        setTimeout(() => {
            alerta.animate({opacity: 0.25}, 1000, () => {
                alerta.remove();
            });
        }, 2500);
    });
}
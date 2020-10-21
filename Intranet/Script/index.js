var url = 'Controlador/Login_Controlador.php';

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
    $.get(url, {cuenta: cuenta, contra: contra, proceso: 'logear'}, function (response) {
        cargando2(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            alertaRapida(json.error,"error");
        } else {
            openRequest = indexedDB.open("solded", 1);
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
                            localStorage.setItem("usuario", JSON.stringify(json.result));
                            $(location).attr('href', "Portal.php");
                        });
                    }
                }
            }
        }
    });
}
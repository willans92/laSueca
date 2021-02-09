<!DOCTYPE html>
<html manifest="manifest.appcache">
    <head>
        <meta http-equiv="Expires" content="0" />
        <meta http-equiv="Last-Modified" content="0" />
        <meta http-equiv="Cache-Control" content="no-cache, mustrevalidate" />
        <meta http-equiv="Pragma" content="no-cache" >
        <link rel="shortcut icon" href="Imagen/logo3.png" />
        <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <title>Portal</title>
        <link href="Estilo/bootstrap.min.css" rel="stylesheet" type="text/css"/>
        <link href="Estilo/Estilo.css?3" rel="stylesheet" type="text/css"/>
        <script src="Script/Plugin/jquery-3.3.1.min.js" type="text/javascript"></script>
        <script src="Script/Plugin/jquery-ui.min.js" type="text/javascript"></script>
        <script src="Script/Plugin/popper.min.js" type="text/javascript"></script>
        <script src="Script/Plugin/bootstrap.min.js" type="text/javascript"></script>
        <script src="Script/Plugin/HERRAMIENTAS.js?2" type="text/javascript"></script>
        <script src="Script/Plugin/NumeroLetra.js" type="text/javascript"></script>
        <script src="Script/Plugin/jquery.qrcode-0.12.0.min.js" type="text/javascript"></script>
        <script src="Script/PortalTienda.js" type="text/javascript"></script>
    </head>
    <body onunload="cerrarNavegador()" style="overflow: hidden" >
        <div class="container-fluid p-0">
            <div class=" p-2" id="menu">
                <div class='p-1 d-inline-block ' >
                    <img src='Imagen/Iconos/menuIcon.png' class='menuicon' onclick='menuApp()'/>
                </div>
                <div class='pr-2 p-1 d-inline-block float-right' >
                    <img src='Imagen/Iconos/salir.png' class='menuicon' onclick='cerrarSession(1)'/>
                </div>
            </div>
            <div class="row m-0">
                <div class="col-2 d-none d-lg-inline-block pt-2 celeste" id="submenu">
                    <div class="centrar">
                        <select class="grande negrilla" id="sucursal" style="display: none"></select>
                    </div>
                    <div class='point item' onclick="redireccionarUrl('./Formularios/TIENDA_CatalogoProducto.html',this)">Catalogo de Producto</div>
                    <div class='point item' onclick="redireccionarUrl('./Formularios/TIENDA_ConfiguracionTienda.html',this)">Configuracion de la tienda</div>
                    <div class='point item' onclick="redireccionarUrl('./Formularios/TIENDA_ReportePedidos.html',this)">Reporte de Pedidos</div>
                </div>

                <iframe src="" class="col-12" id="cuerpoProyeto" style="padding: 0px 30px;"></iframe>
            </div>
        </div>
        <iframe id='impresionIframe' style='padding: 0; width: 0%;  height: 0%;' height="0" width="0" ></iframe>

    </body>
</html>

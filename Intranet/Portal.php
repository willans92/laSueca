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
        
        <script defer src="https://www.gstatic.com/firebasejs/7.15.0/firebase-app.js"></script>
        <script defer src="https://www.gstatic.com/firebasejs/7.15.0/firebase-messaging.js"></script>
        

        <script src="Script/Portal.js?6" type="text/javascript"></script>
    </head>
    <body onunload="cerrarNavegador()" style="overflow: hidden" >
        <div class="container-fluid p-0">
            <div class=" p-2" id="menu">

            </div>
            <div class="row m-0">
                <div class="col-2 d-none d-lg-inline-block pt-2 celeste" id="submenu">
                    <div class="centrar">
                        <select class="grande negrilla" id="sucursal" style="display: none"></select>
                    </div>

                </div>

                <iframe src="" class="col-12" id="cuerpoProyeto" style="padding: 0px 30px;"></iframe>
            </div>
        </div>
        <iframe id='impresionIframe' style='padding: 0; width: 0%;  height: 0%;' height="0" width="0" ></iframe>
        <div class="modal fade" id="popupPedido" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" >Lista Pedidos Pendientes</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body" id="formProducto">
                        
                    </div>
                    <div class="modal-footer">
                        <div id="errorPop"></div>
                        <button type="button" class="btn btn-secondary cerrar" data-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>

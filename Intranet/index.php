<!DOCTYPE html>
<html manifest="manifest.appcache">
    <head>
        <meta http-equiv="Expires" content="0" />
        <meta http-equiv="Last-Modified" content="0" />
        <meta http-equiv="Cache-Control" content="no-cache, mustrevalidate" />
        <meta http-equiv="Pragma" content="no-cache" >
        <?php
            $base_dir = __DIR__;
            $protocol = empty($_SERVER['HTTPS']) ? 'http' : 'https';
            $domain = $_SERVER['SERVER_NAME'];
            $port = $_SERVER['SERVER_PORT'];
            $disp_port = ($protocol == 'http' && $port == 80 || $protocol == 'https' && $port == 443) ? '' : ":$port";
            $url = "$protocol://${domain}${disp_port}";
        ?>
        <!-- REDES SOCIALES-->
        <meta name="description" content="Software Administrativo para empresas, ahorra tiempo y dinero utilizando lo último en tecnología de manera Gratuita.">
        <meta property="og:title" content="Emprendedor">
        <meta property="og:type" content="website"
        <meta property="og:description" content="Software Administrativo para empresas, ahorra tiempo y dinero utilizando lo último en tecnología de manera Gratuita.">
        <meta property="og:url" content="https://www.emprendedor-wd.com/">
        <meta property="og:image" content="<?php echo $url . '/' . 'Imagen/logo3.png' ?>">
        <meta property="product:brand" content="Emprendedor">
        <meta property="product:condition" content="new">
        <link rel="shortcut icon" href="Imagen/logo3.png" />
        <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <title>LOGIN</title>
        <link href="Estilo/bootstrap.min.css" rel="stylesheet" type="text/css"/>
        <link href="Estilo/Estilo.css?1.0.1" rel="stylesheet" type="text/css"/>
        <script src="Script/Plugin/jquery-3.3.1.min.js" type="text/javascript"></script>
        <script src="Script/Plugin/jquery-ui.min.js" type="text/javascript"></script>
        <script src="Script/Plugin/popper.min.js" type="text/javascript"></script>
        <script src="Script/Plugin/bootstrap.min.js" type="text/javascript"></script>
        <script src="Script/index.js" type="text/javascript"></script>
    </head>
    <body style="background: #024379">
        <div class='container-fluid p-0'>
            <div class='boxmedio' id="formRegistro" >
                <img src="Imagen/banderaSueca.jpg" alt="" style="width: 150px; height: 150px;  border-radius: 100px;"/>
                <div class="sueca">LA SUECA</div>
                <div id="tipoLogin">
                    <div  onclick="cambiarTipo(this,'Administrativo')">
                        Administrativo
                    </div>
                    <div  class="tipoLoginSelected" onclick="cambiarTipo(this,'Tienda')">
                        Tienda
                    </div>
                </div>
                <div class="negrilla">Cuenta</div>
                <input type='text' name='cuentaLogeo' autocomplete="off" onkeyup="entrar(event)"/>
                <div class="negrilla">Contraseña</div>
                <input type='password' name='contrasenaLogeo' autocomplete="off" onkeyup="entrar(event)"/>
                <div class="mt-3 text-center">
                    <button onclick="entrar('')" style='width: 80%;'>
                        Ingresar
                    </button>
                </div>
            </div>
        </div>
    </body>
</html>
    
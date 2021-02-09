<!DOCTYPE html>
<html manifest="manifest.appcache">
    <head>
        <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="Estilo/bootstrap.min.css" rel="stylesheet" type="text/css"/>
        <link href="Estilo/EstiloFecha.css" rel="stylesheet" type="text/css"/>
        <link href="Estilo/Estilo.css" rel="stylesheet" type="text/css"/>
        <script src="Script/Plugin/jquery-3.3.1.min.js" type="text/javascript"></script>
        <script src="Script/Plugin/jquery-ui.min.js" type="text/javascript"></script>
        <script src="Script/Plugin/popper.min.js" type="text/javascript"></script>
        <script src="Script/Plugin/bootstrap.min.js" type="text/javascript"></script>
        <script src="Script/Plugin/HERRAMIENTAS.js" type="text/javascript"></script>
        <script src="https://maps.googleapis.com/maps/api/js?v=3&key=AIzaSyDAkbFNdLPZweqdm0_51T52uCMVknLqBMk&libraries=places"></script>
        <script src="Script/index.js" type="text/javascript"></script>
    </head>
    <body>
        <?php
        include_once "Intranet/Clases/catalogoProducto.php";
        include_once "Intranet/Clases/producto.php";
        include_once "Libreria/CONN.php";
        include_once "Intranet/Clases/Sucursal.php";
        
        
        
        
        $tienda_id = 4;
        $con = new CONN(0);
        $categoria = new catalogoProducto($con);
        $listaCategoria = $categoria->catalogoAsignadoTienda($tienda_id);
        $htmlCategoria = "";
        for ($i = 0; $i < count($listaCategoria); $i++) {
            $cat = $listaCategoria[$i];
            $id_categoria = $cat["id_categoriaProducto"];
            $htmlCategoria .= "<div class='col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3 p-0'>";
            $htmlCategoria .= "    <div class='item'>";
            $htmlCategoria .= "        <div class='titulo'>" . $cat["nombre"] . "</div>";
            $htmlCategoria .= "        <a href='buscador.php?c=$id_categoria'><img src='" . $cat["foto"] . "'></a>";
            $htmlCategoria .= "        <a class='link' href='buscador.php?c=$id_categoria'>Comprar Ahora</a>";
            $htmlCategoria .= "    </div>";
            $htmlCategoria .= "</div>";
        }


        $producto = new producto($con);
        $listaProducto = $producto->productoMasVendidoHome($tienda_id);
        $htmlProductoMasVendido = "";
        for ($i = 0; $i < count($listaProducto); $i++) {
            $prod = $listaProducto[$i];
            $foto = $prod["foto"];
            $htmlProductoMasVendido .= "<img src='$foto' />";
        }



        $listaProducto = $producto->nuestrosProductosHome($tienda_id, "", "0", "0", 0, 30)["data"];
        $htmlProducto = "";
        for ($i = 0; $i < count($listaProducto); $i++) {
            $prod = $listaProducto[$i];
            $foto = $prod["foto"];
            $precio = $prod["precio"];
            $nombre = $prod["nombre"];
            $id_producto = $prod["id_producto"];
            $htmlProducto .= "<div class='itemProducto' >";
            $htmlProducto .= "<div class='btnadd i" . $id_producto . "' onclick=\"modificarCarrito('',$id_producto,'$nombre','$foto','$precio')\"><span>+</span></div>";
            $htmlProducto .= "<img src='$foto' >";
            $htmlProducto .= "<div class='precio'>Bs. $precio</div>";
            $htmlProducto .= "<div class='nombre'>$nombre</div>";
            $htmlProducto .= "</div>";
        }
        $tarifario = file_get_contents('http://localhost/Emprendedor/Controlador/Login_Controlador.php?proceso=tarifario');
        
        $sucursal=new Sucursal($con);
        $sucursalesDisponibles=$sucursal->TodassucursalLocalizacion();
        ?>
        <script>
            var id_tienda = '<?php echo $tienda_id ?>';
            var tarifario=<?php echo $tarifario?>;
            var listaSucursales=<?php echo json_encode($sucursalesDisponibles) ?>;
        </script>
        <div class="row" id="menu">
            <div  class="col-6 col-sm-2 col-md-2 col-lg-2 col-xl-2 pr-0">
                <a href="index.php">
                    <img class="iconMenu" src="Imagen/Iconos/menu.svg"  style="display: none"/>
                    <img class="iconMenu" src="Imagen/banderaSueca.jpg" style="padding: 0;" />
                    <span class="iconLabel">La Sueca</span>
                </a>
            </div>

            <div  class="col-6 col-sm-8 d-none d-sm-inline-block">
                <div class="buscadorMenu">
                    <div class="categoria" >
                        Buscador
                    </div>
                    <input type="text" onkeyup="buscador(event)" name="buscador">
                    <img src="Imagen/Iconos/lupa.svg" title="buscador" onclick="buscador('')">
                </div>
            </div>
            <div  class="col-6 col-sm-2 col-md-2 col-lg-2 col-xl-2 text-right">
                <img class="iconMenu" src="Imagen/Iconos/cart.svg" style="padding: 5px;"  onclick="abrirCarrito()" />
                <div class='addCarrito'><span>1</span></div>
            </div>
            <div  class="col-12 d-inline-block d-sm-none mt-2" >
                <div class="buscadorMenu">
                    <div class="categoria" >
                        Buscador
                    </div>
                    <input type="text">
                    <img src="Imagen/Iconos/lupa.svg" title="buscador">
                </div>
            </div>
        </div>
        <div style="margin-top: 45px" class="d-inline-block d-sm-none"></div>
        <div class="container-fluid" style="max-width: 1600px; margin: 0 auto;" id="bodyPage">
            <ul id="banner">

                <li class="item">
                    <img src="https://images-na.ssl-images-amazon.com/images/G/01/AmazonExports/Fuji/2020/May/Hero/Fuji_TallHero_45M_es_US_1x._CB432534552_.jpg" />
                </li>
                <li class="item">
                    <img src="https://images-na.ssl-images-amazon.com/images/G/01/AmazonExports/Fuji/2020/May/Hero/Fuji_TallHero_Sports_es_US_1x._CB431860453_.jpg" />" />
                </li>
                <li class="item">
                    <img src="https://images-na.ssl-images-amazon.com/images/G/01/AmazonExports/Fuji/2020/May/Hero/Fuji_TallHero_Home_es_US_1x._CB428980075_.jpg" />
                </li>
            </ul>
            <div id="arrowBanner" style="visibility: hidden">
                <div class="arrow"> &lt;</div>
                <div class="arrow"> &gt;</div>
            </div>
            <div id="contenedorCategoria" class="row ">

                <?php echo $htmlCategoria; ?>


            </div>
            <div id="ProductoHome">
                <div class="titulo">Nuestros Productos<a class='vermas' href='buscador.php'>Ver más Productos</a></div>
                <div class="content">

                    <?php echo $htmlProducto; ?>


                </div>
            </div>
            <div id="ProductoMasVendido">
                <div class="titulo">Producto Mas Vendidos <a class='vermas' href='buscador.php?t=2'>Ver más Productos</a></div>
                <div class="content">

                    <?php echo $htmlProductoMasVendido; ?>
                </div>
            </div>
        </div>
        
        
        
        
        
        <div id="popup" >
            <div class="background" onclick="ocultarPopup()"></div>
            <div id="popCarrito" class="pop">
                <div class="titulo">Carrito de Compras<span class="cerrar" onclick="ocultarPopup()">x</span> </div>
                <div class="cuerpo"></div>
                <div class="foot">
                    <span onclick="ocultarPopup()">Seguir Comprando</span>
                    <button onclick="realizarCompra()">Realizar Compra <span class="total"></span></button>
                </div>
            </div>
            <div id="popDatosEnvio" class="pop">
                <div class="titulo">Datos de Envío<span class="cerrar" onclick="ocultarPopup()">x</span> </div>
                <div class="cuerpo p-3">
                    <label>Nombre Cliente</label>
                    <input type="text" class="grande2" name="nombre" autocomplete="off">
                    <label>Teléfono</label>
                    <input type="text" class="medio" name="telefono" autocomplete="off">
                    <label>Dirección</label>
                    <input type="text" class="grande2" name="direccion" autocomplete="off">
                    <label>Dirección Gps</label>
                    <div id="mapa"></div>
                </div>
                <div class="foot">
                    <span id="txtCostoEnvio" style="float: left; margin: 0; color: #01467d;">Costo Envio</span>
                    <span onclick="abrirCarrito()">Ir al Carrito</span>
                    <button onclick="continuarDelivery()">Continuar</button>
                </div>
            </div>
            <div id="popDelivery" class="pop">
                <div class="titulo">Datos de Entrega<span class="cerrar" onclick="ocultarPopup()">x</span> </div>
                <div class="cuerpo p-3">
                    <label>Fecha de Entrega</label>
                    <div id="calendario"></div>
                    <div id="fechaEntrega" style="font-size: 19px; margin: 10px;"></div>
                    <div style="margin: 10px">
                        <label>Horario de entrega</label>
                        <ul id="hora">
                            <li><input name='hora' type='radio' checked value='9:00:00' > <span>entre 9:00 al 11:00  </span></li>
                            <li><input name='hora' type='radio' value='14:00:00' > <span>entre 14:00 al 16:00  </span></li>
                            <li><input name='hora' type='radio' value='16:00:00' > <span>entre 16:00 al 18:00  </span></li>
                            <li><input name='hora' type='radio' value='18:00:00' > <span>entre 18:00 al 20:00  </span></li>
                        </ul>
                    </div>

                </div>
                <div class="foot">
                    <span onclick="realizarCompra()">Atras</span>
                    <button onclick="continuarEntrega()">Continuar</button>
                </div>
            </div>
            <div id="popFinalizarPedido" class="pop">
                <div class="titulo">Detalle del Pedido<span class="cerrar" onclick="ocultarPopup()">x</span> </div>
                <div class="cuerpo p-3">
                    <label>Método de Pago</label>
                    <select id="metodopago" class="medio">
                        <option value="efectivo">Efectivo</option>
                        <option value="codigo qr">Codigo QR</option>
                    </select>
                    <label>Detalle del Pedido</label>
                    <div class="cuerpobox">
                        
                    </div>

                </div>
                <div class="foot">
                    <span onclick="continuarDelivery()">Atras</span>
                    <button onclick="finalizarVenta()">Realizar Pedido <span class="total"></span></button>
                </div>
            </div>
        </div>
    </body>
</html>

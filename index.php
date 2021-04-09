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
            $comision = $prod["comision"];
            $nombre = $prod["nombre"];
            $detalle= $prod["descripcion"];
            $id_producto = $prod["id_producto"];
            $htmlProducto .= "<div class='itemProducto'  >";
            $htmlProducto .= "<div class='btnadd i" . $id_producto . "' onclick=\"modificarCarrito('',$id_producto,'$nombre','$foto','$precio','$comision')\"><span>+</span></div>";
            $htmlProducto .= "<img src='$foto' onClick=\"detalleProducto(1,$id_producto,'$nombre','$detalle','$foto','$precio','$comision')\">";
            $htmlProducto .= "<div class='precio' onClick=\"detalleProducto(1,$id_producto,'$nombre','$detalle','$foto','$precio','$comision')\">Bs. $precio</div>";
            $htmlProducto .= "<div class='nombre' onClick=\"detalleProducto(1,$id_producto,'$nombre','$detalle','$foto','$precio','$comision')\">$nombre</div>";
            $htmlProducto .= "</div>";
        }
        $tarifario = file_get_contents('http://localhost/Emprendedor/Controlador/Login_Controlador.php?proceso=tarifario');
        
        $sucursal=new Sucursal($con);
        $sucursalesDisponibles=$sucursal->TodassucursalLocalizacion();
        
        $pedido_id=isset($_GET["pv"]) ? $_GET["pv"] : "0";
        ?>
        <script>
            var id_tienda = '<?php echo $tienda_id ?>';
            var tarifario=<?php echo $tarifario?>;
            var listaSucursales=<?php echo json_encode($sucursalesDisponibles) ?>;
            var pedidoView=<?php echo json_encode($pedido_id) ?>;
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
                <img class="iconMenu" src="Imagen/Iconos/shopping.png" style="padding: 5px;"  onclick="buscadorPedidoPop(1)" />
                <img class="iconMenu" src="Imagen/Iconos/cart.svg" style="padding: 5px;"  onclick="abrirCarrito()" />
                <div class='addCarrito'><span></span></div>
            </div>
            <div  class="col-12 d-inline-block d-sm-none mt-2" >
                <div class="buscadorMenu">
                    <div class="categoria" >
                        Buscador
                    </div>
                    <input type="text" autocomplete="off" onkeyup="buscador(event)">
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
        <div id='btnFlotante'>
            <img src="Imagen/Iconos/whatsapp.png" alt=""/>
        </div>
        
        
        
        
        <div id="popup" >
            <div class="background" onclick="ocultarPopup()"></div>
            <div id="popCarrito" class="pop">
                <div class="titulo">Carrito de Compras<span class="cerrar" onclick="ocultarPopup()">x</span> </div>
                <div class="cuerpo"></div>
                <div class="foot">
                    <span onclick="ocultarPopup()">Seguir Comprando</span>
                    <button id='btncontinuar1' onclick="realizarCompra()">Realizar Compra <span class="total"></span></button>
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
                    <label style="font-weight: normal; font-style: italic; font-size: 13px;">Marca en el mapa la dirección de entrega con un clic</label>
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
                    <br>
                    <label>Intrucciones de Entrega</label>
                    <input type='text' name='intrucciones' autocomplete="off" style="width:100%">
                </div>
                <div class="foot">
                    <span onclick="continuarDelivery()">Atras</span>
                    <button onclick="finalizarVenta()">Realizar Pedido <span class="total"></span></button>
                </div>
            </div>
            
            
            
            
            <div id="popConfirmarSms" class="pop">
                <div class="titulo">Confirmación SMS<span class="cerrar" onclick="ocultarPopup()">x</span> </div>
                <div class="p-3">
                    <label>Enviamos un mensaje a tu telefono celular</label>
                    <div>Ingresa el código que recibiste pare terminar de realizar el pedido</div>
                    <input type='text' name='codigoSms' autocomplete="off" style="width:100%">
                </div>
                <div class="foot">
                    <span onclick="continuarDelivery()">Atras</span>
                    <button onclick="confirmarSmsVenta()">Confirmar</button>
                </div>
            </div>
            <div id="popCodigoPedido" class="pop">
                <div class="titulo">El pedido se realizo correctamente<span class="cerrar" onclick="ocultarPopup()">x</span> </div>
                <div class="p-3">
                    <label>Tu Código de pedido es:</label>
                    <div style="font-size: 25px;   font-weight: bold;" id="codePedido"></div>
                </div>
                <div class="foot">
                    <span onclick="ocultarPopup()">Salir</span>
                    <button id='btncontinuar1' onclick="verOrdenCompras()">Ver Detalle</button>
                </div>
            </div>
            
            
            
            <div id="popDetalle" class="pop">
                <img src="" alt=""/>
                <div id="detallePrecio"></div>
                <div id="detalleNombre"></div>
                <div id="detalleDesc"></div>
                <div style="margin-top: 15px;">
                    <button onclick="ocultarPopup()" class="btn-danger">Salir</button>
                    <button onclick="agregarCarritoDetalleProducto()"> Agregar Carrito</button>
                </div>
            </div>
            
            
            <div id="popBuscadorPedido" class="pop">
                <div class="titulo">¿Ingrese el código del pedido?<span class="cerrar" onclick="ocultarPopup()">x</span> </div>
                <div class="p-2">
                    <input type="text" placeholder="" name='buscadorPedido'>
                    <button onclick="buscadorPedidoPop(2)" >Buscar</button>
                </div>
                <div class="foot">
                    <button id='btncontinuar1' onclick="ocultarPopup()">Cerrar</button>
                </div>
              
            </div>
            <div id="popVerDetallePedido" class="pop">
                <div class="titulo">Detalle de Pedido<span class="cerrar" onclick="ocultarPopup()">x</span> </div>
                <div class="cuerpo" style="padding: 10px 20px;">
                    <div>
                        <span class="negrilla">Fecha de Solicitud:</span>
                        <span id="txtSolicitado"></span>
                    </div>
                    <div>
                        <span class="negrilla">Fecha de Entrega:</span>
                        <span id="txtEntregado"></span>
                    </div>
                    <div>
                        <span class="negrilla">Estado:</span>
                        <span  id="txtEstado"></span>
                    </div>
                    <div>
                        <span class="negrilla">Cliente:</span>
                        <span  id="txtCliente"></span>
                    </div>
                    <div>
                        <span class="negrilla">Teléfono:</span>
                        <span  id="txtTelefono"></span>
                    </div>
                    <div>
                        <span class="negrilla">Dirección de Entrega:</span>
                        <span  id="txtDireccion"></span>
                    </div>
                    
                    <div>
                        <span class="negrilla">Intrucción de Entrega:</span>
                        <span  id="txtIntruccion"></span>
                    </div>
                    <div>
                        <span class="negrilla">Monto Pedido:</span>
                        <span  id="txtMonto"></span>
                    </div>
                    <div>
                        <span class="negrilla">Costo del Delivery:</span>
                        <span id="txtDelivery"></span>
                    </div>
                    <div>
                        <span class="negrilla">Total:</span>
                        <span  id="txtTotal"></span>
                    </div>
                    <div>
                        <br>
                        <span class="negrilla">DETALLE DEL PEDIDO</span><br><br>
                        <table class="table" id="prodDetalle">
                            <thead>
                                <th><div class="medio">Producto</div></th>
                                <th><div class="pequeno">Cantidad</div></th>
                                <th><div class="pequeno">Precio Uni.</div></th>
                                <th><div class="normal">SubTotal</div></th>
                            </thead>
                            <tbody>
                                
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="foot">
                    <button id='btncontinuar1' onclick="ocultarPopup()">Cerrar</button>
                </div>
            </div>
        </div>
      
    </body>
</html>

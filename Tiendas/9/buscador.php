<!DOCTYPE html>
<html manifest="manifest.appcache">
    <head>
        <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="http://www.la-sueca.com/Estilo/bootstrap.min.css" rel="stylesheet" type="text/css"/>
        <link href="http://www.la-sueca.com/Estilo/Estilo.css" rel="stylesheet" type="text/css"/>
        <link href="http://www.la-sueca.com/Estilo/EstiloFecha.css" rel="stylesheet" type="text/css"/>
        <script src="http://www.la-sueca.com/Script/Plugin/jquery-3.3.1.min.js" type="text/javascript"></script>
        <script src="http://www.la-sueca.com/Script/Plugin/jquery-ui.min.js" type="text/javascript"></script>
        <script src="http://www.la-sueca.com/Script/Plugin/popper.min.js" type="text/javascript"></script>
        <script src="http://www.la-sueca.com/Script/Plugin/bootstrap.min.js" type="text/javascript"></script>
        <script src="http://www.la-sueca.com/Script/Plugin/HERRAMIENTAS.js" type="text/javascript"></script>
        <script src="https://maps.googleapis.com/maps/api/js?v=3&key=AIzaSyDAkbFNdLPZweqdm0_51T52uCMVknLqBMk&libraries=places"></script>
        <script src="http://www.la-sueca.com/Script/buscador.js" type="text/javascript"></script>
    </head>
    <body>
        <?php
        include_once "http://www.la-sueca.com/Intranet/Clases/catalogoProducto.php";
        include_once "http://www.la-sueca.com/Intranet/Clases/producto.php";
        include_once "http://www.la-sueca.com/Intranet/Clases/Sucursal.php";
        include_once "http://www.la-sueca.com/Intranet/Clases/linea_producto_tienda.php";
        include_once "http://www.la-sueca.com/Libreria/CONN.php";
        include_once "http://www.la-sueca.com/Libreria/funciones.php";
        include_once "http://www.la-sueca.com/Intranet/Clases/empresa.php";
        include_once "http://www.la-sueca.com/Intranet/Clases/tienda.php";
         
        $tienda_id = 9;
        $con = new CONN(0);
        $categoriabusqueda = isset($_GET["c"]) ? $_GET["c"] : "0";
        $subcategoriabusqueda = isset($_GET["s"]) ? $_GET["s"] : "0";
        $txtbusqueda = isset($_GET["b"]) ? $_GET["b"] : "";
        $tipobusqueda = isset($_GET["t"]) ? $_GET["t"] : "0";
        $pedido_id=isset($_GET["pv"]) ? $_GET["pv"] : "0";
        $funciones = new funciones($con,$tienda_id);
        $empresa=new empresa($con);
        
        
        $tienda=new tienda($con);
        $tienda=$tienda->buscarXid($tienda_id);
        
        
        $empresa=$empresa->buscarXid(87);
        $link="https://wa.me/591".$empresa["telefono"];
        
        
        $htmlSubCategoria = "";

        if ($tipobusqueda === "0") {
            $sub = new linea_producto_tienda($con);
            $listaSubCategoria = $sub->lineaXidCategoria($categoriabusqueda, $tienda_id);
            
            $categoria = new catalogoProducto($con);
            $listaCategoria = $categoria->catalogoAsignadoTienda($tienda_id);
        }
        $producto = new producto($con);
        
        $data = $producto->nuestrosProductosHome($tienda_id, $txtbusqueda, $categoriabusqueda, $subcategoriabusqueda, 0, 30);
        $listaProducto = $data["data"];
        $limite = $data["limite"];
        $htmlProducto = "";
        for ($i = 0; $i < count($listaProducto); $i++) {
            $prod = $listaProducto[$i];
            $foto = $prod["foto"];
            $precio = $prod["precio"];
            $nombre = $prod["nombre"];
            $comision = $prod["comision"];
            $detalle = $prod["descripcion"];
            $id_producto = $prod["id_producto"];
            $htmlProducto .= "<div class='itemProducto' >";
            
            $htmlProducto .= "<div class='btnadd i" . $id_producto . "' data-id='$id_producto' data-nombre='$nombre' data-foto='$foto' data-precio='$precio' data-comision='$comision'>";
            $htmlProducto .= "<label class='less' onclick=\"btnControl(this,-1)\">-</label>";
            $htmlProducto .= "<span onclick=\"controladorItem(this,'',$id_producto,'$nombre','$foto','$precio','$comision')\">+</span>";
            $htmlProducto .= "<label class='add' onclick=\"btnControl(this,1)\">+</label>";
            $htmlProducto .= "</div>";
            
            $htmlProducto .= "<img src='$foto' onClick=\"detalleProducto(1,$id_producto,'$nombre','$detalle','$foto','$precio','$comision')\">";
            $htmlProducto .= "<div class='precio' onClick=\"detalleProducto(1,$id_producto,'$nombre','$detalle','$foto','$precio','$comision')\">Bs. $precio</div>";
            $htmlProducto .= "<div class='nombre' onClick=\"detalleProducto(1,$id_producto,'$nombre','$detalle','$foto','$precio','$comision')\">$nombre</div>";
            $htmlProducto .= "</div>";
        }
        $msn = "Productos Encontrados : $limite";
        if ($limite == "0") {
            $msn = "No se encontro productos";
        }
        $ocultarMas = "";
        if (count($listaProducto) === $limite) {
            $ocultarMas = "style='display:none'";
        }
        $tarifario = file_get_contents('http://localhost/Emprendedor/Controlador/Login_Controlador.php?proceso=tarifario');
        
        $sucursal=new Sucursal($con);
        $sucursalesDisponibles=$sucursal->TodassucursalLocalizacion();
        ?>

        <script>
            var tipo = '<?php echo $tipobusqueda ?>';
            var categoria = '<?php echo $categoriabusqueda ?>';
            var subcategoria = '<?php echo $subcategoriabusqueda ?>';
            var limite = '<?php echo $msn ?>';
            var id_tienda = '<?php echo $tienda_id ?>';
            var pibote = '<?php echo count($listaProducto) ?>';
            var tarifario=<?php echo $tarifario?>;
            var listaSucursales=<?php echo json_encode($sucursalesDisponibles) ?>;
            var pedidoView=<?php echo json_encode($pedido_id) ?>;
        </script>
        <div class="row" id="menu">
            <div  class="col-6 col-sm-2 col-md-2 col-lg-2 col-xl-2 pr-0 iconIzquierda">
                <a href="index.php">
                    <img class="iconMenu" src="http://www.la-sueca.com/Imagen/Iconos/menu.svg"  style="display: none"/>
                     <img class="iconMenu" src="<?php echo $tienda["logo"]?>" style="padding: 0;" />
                    <span class="iconLabel"><?php echo $tienda["nombre"]?></span>
                </a>
            </div>
            <div  class="col-6 col-sm-8 d-none d-sm-inline-block">
                <div class="buscadorMenu">
                    <div class="categoria" >
                        Buscador
                    </div>
                    <input type="text" onkeyup="buscador(event,'')" autocomplete="off" name="buscador">
                    <img src="http://www.la-sueca.com/Imagen/Iconos/lupa.svg" title="buscador" onclick="buscador('','')">
                </div>
            </div>
            <div  class="col-6 col-sm-2 col-md-2 col-lg-2 col-xl-2 text-right iconDerecha">
                <img class="iconMenu" src="Imagen/Iconos/shopping.png" style="padding: 5px;"  onclick="buscadorPedidoPop(1)" />
                <img class="iconMenu" src="Imagen/Iconos/cart.svg" style="padding: 5px;"  onclick="abrirCarrito()" />
                <div class='addCarrito' onclick="abrirCarrito()"><span></span></div>
            </div>
            <div  class="col-12 d-inline-block d-sm-none mt-2" >
                <div class="buscadorMenu">
                    <div class="categoria" >
                        Buscador
                    </div>
                    <input type="text" autocomplete="off" onkeyup="buscador(event,2)" name="buscador2">
                    <img src="http://www.la-sueca.com/Imagen/Iconos/lupa.svg" title="buscador" onclick="buscador('','2')">
                </div>
            </div>
        </div>
        <div style="margin-top: 45px" class="d-inline-block d-sm-none"></div>



        <div class="container-fluid" style="max-width: 1600px; margin: 0 auto; "  id="bodyPage">
            <div class="submenuLateral" id="menuCategoria">
                <?php echo $funciones->itemCategoriaBusqueda($listaCategoria, $categoriabusqueda,$tipobusqueda,$txtbusqueda) ?>
            </div>
            <div class="submenuLateral mt-2" id="menuSubcategoria">
                <?php echo $funciones->itemSubCategoriaBusqueda($listaSubCategoria, $subcategoriabusqueda, $categoriabusqueda, $tipobusqueda, $txtbusqueda); ?>
            </div>
            <div class="submenuLateral mt-2" id="menuProducto">
                <div id="resumenResultado">
                    <?php echo $msn; ?>

                </div>
                <div class="cuerpo">
                    <?php echo $htmlProducto; ?>

                </div>
                <div id="buscarMas" <?php echo $ocultarMas; ?> onclick="cargarMas()">Cargar mas productos</div>
            </div>
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
                    <div id="fechaEntrega" ></div>
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
                    <div id='boxReadSms'>
                        <span class="negrilla mr-2">Teléfono:</span>
                        <span id='telefonoSms'></span>
                        <span class='link' onclick="editarTelefonoSms(1)">Editar Teléfono</span>
                    </div>
                    <div id='boxEditSms'>
                        <label>Teléfono</label>
                        <input type="text" name='smsTelefono' style="margin-bottom: 14px;"><br>
                        <button onclick="editarTelefonoSms(2)" class="btn-danger">Cancelar</button>
                        <button onclick="finalizarVenta(2)">Enviar Sms</button>
                    </div>
                    <label>Enviamos un mensaje a tu telefono celular</label>
                    <div class='spanPop'>Ingresa el código que recibiste pare terminar de realizar el pedido</div>
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
                    <button id='btncontinuar1' onclick="verOrdenCompras()">Ver el Detalle Pedido</button>
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
                    <button  onclick="compartirWp()">Compartir por Whatsapp</button>
                </div>
            </div>
        </div>
    </body>
</html>

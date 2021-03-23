<!DOCTYPE html>
<html manifest="manifest.appcache">
    <head>
        <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="Estilo/bootstrap.min.css" rel="stylesheet" type="text/css"/>
        <link href="Estilo/Estilo.css" rel="stylesheet" type="text/css"/>
        <link href="Estilo/EstiloFecha.css" rel="stylesheet" type="text/css"/>
        <script src="Script/Plugin/jquery-3.3.1.min.js" type="text/javascript"></script>
        <script src="Script/Plugin/jquery-ui.min.js" type="text/javascript"></script>
        <script src="Script/Plugin/popper.min.js" type="text/javascript"></script>
        <script src="Script/Plugin/bootstrap.min.js" type="text/javascript"></script>
        <script src="Script/Plugin/HERRAMIENTAS.js" type="text/javascript"></script>
        <script src="https://maps.googleapis.com/maps/api/js?v=3&key=AIzaSyDAkbFNdLPZweqdm0_51T52uCMVknLqBMk&libraries=places"></script>
        <script src="Script/buscador.js" type="text/javascript"></script>
    </head>
    <body>
        <?php
        include_once "Intranet/Clases/catalogoProducto.php";
        include_once "Intranet/Clases/producto.php";
        include_once "Intranet/Clases/Sucursal.php";
        include_once "Intranet/Clases/linea_producto_tienda.php";
        include_once "Libreria/CONN.php";
        $tienda_id = 4;
        $con = new CONN(0);
        $categoriabusqueda = isset($_GET["c"]) ? $_GET["c"] : "0";
        $subcategoriabusqueda = isset($_GET["s"]) ? $_GET["s"] : "0";
        $txtbusqueda = isset($_GET["b"]) ? $_GET["b"] : "";
        $tipobusqueda = isset($_GET["t"]) ? $_GET["t"] : "0";
        $htmlCategoria = "";
        $htmlSubCategoria = "";

        if ($tipobusqueda === "0") {
            $sub = new linea_producto_tienda($con);
            $lista = $sub->lineaXidCategoria($categoriabusqueda, $tienda_id);
            for ($i = 0; $i < count($lista); $i++) {
                $selected = "";
                $arrayid = explode(",", $subcategoriabusqueda);
                $index = in_array($lista[$i]["id_linea_producto"], $arrayid);
                $query = $subcategoriabusqueda;
                if ($index) {
                    $selected = "selectedSubcategoria";
                    $str = $query = str_replace("," . $lista[$i]["id_linea_producto"], "", $query);
                    $query = str_replace("" . $lista[$i]["id_linea_producto"], "", $query);
                } else {
                    $query = $query . "," . $lista[$i]["id_linea_producto"];
                }

                $htmlSubCategoria .= "<a class='boxSubcategoria $selected' href='./buscador.php?c=" . $categoriabusqueda . "&t=$tipobusqueda&b=$txtbusqueda&s=$query' >" . $lista[$i]["descripcion"] . "</a>";
            }
            $categoria = new catalogoProducto($con);
            $listaCategoria = $categoria->catalogoAsignadoTienda($tienda_id);
            for ($i = 0; $i < count($listaCategoria); $i++) {
                $selected = "";
                if ($categoriabusqueda == $listaCategoria[$i]["id_categoriaProducto"]) {
                    $selected = "selectedSubcategoria";
                }
                $htmlCategoria .= "<a class='boxcategoria $selected' href='./buscador.php?c=" . $listaCategoria[$i]["id_categoriaProducto"] . "&t=$tipobusqueda&b=$txtbusqueda&s=0' >";
                $htmlCategoria .= "<img src='" . $listaCategoria[$i]["foto"] . "'>";
                $htmlCategoria .= "<span>" . $listaCategoria[$i]["nombre"] . "</span>";
                $htmlCategoria .= "</a>";
            }
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
            $id_producto = $prod["id_producto"];
            $htmlProducto .= "<div class='itemProducto' >";
            $htmlProducto .= "<div class='btnadd i" . $id_producto . "' onclick=\"modificarCarrito('',$id_producto,'$nombre','$foto','$precio')\"><span>+</span></div>";
            $htmlProducto .= "<img src='$foto' >";
            $htmlProducto .= "<div class='precio'>Bs. $precio</div>";
            $htmlProducto .= "<div class='nombre'>$nombre</div>";
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
                    <input type="text" onkeyup="buscador(event)" name="buscador" autocomplete="off">
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
                    <input type="text" autocomplete="off">
                    <img src="Imagen/Iconos/lupa.svg" title="buscador">
                </div>
            </div>
        </div>
        <div style="margin-top: 45px" class="d-inline-block d-sm-none"></div>



        <div class="container-fluid" style="max-width: 1600px; margin: 0 auto; "  id="bodyPage">
            <div class="submenuLateral" id="menuCategoria">
                <?php echo $htmlCategoria; ?>
            </div>
            <div class="submenuLateral mt-2" id="menuSubcategoria">
                <?php echo $htmlSubCategoria; ?>
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
                    <br>
                    <label>Intrucciones de Entrega</label>
                    <input type='text' name='intrucciones' autocomplete="off" style="width:100%">
                </div>
                <div class="foot">
                    <span onclick="continuarDelivery()">Atras</span>
                    <button onclick="finalizarVenta()">Realizar Pedido <span class="total"></span></button>
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
        </div>
    </body>
</html>

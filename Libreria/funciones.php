<?php

//include_once "Intranet/Clases/producto.php";
class funciones {

    var $CON;
    var $id_tienda;
    var $urlEmprendedor="https://www.emprendedor-wd.com/externo/lasueca.php?wsdl";

    function __construct($con, $tienda) {
        $this->CON = $con;
        $this->id_tienda = $tienda;
    }

    function itemCategoriaHome($listaCategoria) {
        $htmlCategoria = "";
        for ($i = 0; $i < count($listaCategoria); $i++) {
            $cat = $listaCategoria[$i];
            $id_categoria = $cat["id_categoriaProducto"];
            $htmlCategoria .= "<div class='col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3 p-0'>";
            $htmlCategoria .= "    <div class='item'>";
            $htmlCategoria .= "        <div class='titulo'>" . $cat["nombre"] . "</div>";
            $htmlCategoria .= "        <a href='buscador.php?c=$id_categoria' style='display: block;'><img src='" . $cat["foto"] . "'></a>";
            $htmlCategoria .= "        <a class='link' href='buscador.php?c=$id_categoria'>Comprar Ahora</a>";
            $htmlCategoria .= "    </div>";
            $htmlCategoria .= "</div>";
        }
        return $htmlCategoria;
    }

    function itemCategoriaDetallada($listaCategoria) {
        $htmlCategoria = "";
        for ($i = 0; $i < count($listaCategoria); $i++) {
            $cat = $listaCategoria[$i];
            $id_categoria = $cat["id_categoriaProducto"];
            $htmlCategoria .= "<div class='contenedorProductos'>";
            $htmlCategoria .= "<div class='titulo'>" . $cat["nombre"] . "</div>";
            $htmlCategoria .= "<div class='content'><div class='overflowXcontent'>";
            $htmlCategoria .= $this->buscarProductoXCategoria($id_categoria);
            $htmlCategoria .= "</div></div>";
            $htmlCategoria .= "<div class='text-right'><a class='vermas' href='buscador.php?c=$id_categoria'>Ver más Productos</a></div>";
            $htmlCategoria .= "</div>";
        }
        return $htmlCategoria;
    }

    function buscarProductoXCategoria($id_categoria) {
        $producto = new producto($this->CON);
        $listaProducto = $producto->nuestrosProductosHome($this->id_tienda, "", "$id_categoria", "0", 0, 15)["data"];
        $htmlProducto = "";
        for ($i = 0; $i < count($listaProducto); $i++) {
            $prod = $listaProducto[$i];
            $foto = $prod["foto"];
            $precio = $prod["precio"];
            $comision = $prod["comision"];
            $nombre = $prod["nombre"];
            $detalle = $prod["descripcion"];
            $id_producto = $prod["id_producto"];
            $htmlProducto .= "<div class='itemProducto'  >";
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
        return $htmlProducto;
    }

    function itemCategoriaBusqueda($listaCategoria, $id_seleccionado, $tipobusqueda, $txtbusqueda) {
        $htmlCategoria = "";
        for ($i = 0; $i < count($listaCategoria); $i++) {
            $selected = "";
            if ($id_seleccionado == $listaCategoria[$i]["id_categoriaProducto"]) {
                $selected = "selectedSubcategoria";
            }
            $htmlCategoria .= "<a class='boxcategoria $selected'  href='./buscador.php?c=" . $listaCategoria[$i]["id_categoriaProducto"] . "&t=$tipobusqueda&b=$txtbusqueda&s=0' >";
            $htmlCategoria .= "<img src='" . $listaCategoria[$i]["foto"] . "'>";
            $htmlCategoria .= "<span>" . $listaCategoria[$i]["nombre"] . "</span>";
            $htmlCategoria .= "</a>";
        }
        return $htmlCategoria;
    }

    function itemSubCategoriaBusqueda($listaSubCategoria, $subcategoriabusqueda,$categoriabusqueda,$tipobusqueda,$txtbusqueda) {
        $htmlSubCategoria = "";
        for ($i = 0; $i < count($listaSubCategoria); $i++) {
            $selected = "";
            $arrayid = explode(",", $subcategoriabusqueda);
            $index = in_array($listaSubCategoria[$i]["id_linea_producto"], $arrayid);
            $query = $subcategoriabusqueda;
            if ($index) {
                $selected = "selectedSubcategoria";
                $str = $query = str_replace("," . $listaSubCategoria[$i]["id_linea_producto"], "", $query);
                $query = str_replace("" . $listaSubCategoria[$i]["id_linea_producto"], "", $query);
            } else {
                $query = $query . "," . $listaSubCategoria[$i]["id_linea_producto"];
            }

            $htmlSubCategoria .= "<a class='boxSubcategoria $selected' href='./buscador.php?c=" . $categoriabusqueda . "&t=$tipobusqueda&b=$txtbusqueda&s=$query' >" . $listaSubCategoria[$i]["descripcion"] . "</a>";
        }
        return $htmlSubCategoria;
    }

    function tarifarioEmprendedor() {
        $tarifario=[];
        $options = [
               // 'cache_wsdl' => WSDL_CACHE_NONE,
                'trace' => 1,
            ];
        try {
            $client = new SoapClient($this->urlEmprendedor,$options);
            $result = $client->__soapCall("tarifario",array("parametro1" => "asd"));
            $result_json= json_decode($result);
            if($result_json->error==""){
                $tarifario=$result_json->result;
            }
        } catch (SoapFault $e) {
            $tarifario=[];
        }
        return $tarifario;
    }
}

<?php

class categoriaProducto_linea{

    var $categoriaProducto_id;
    var $linea_producto_id;
    var $CON;

    function __construct($con) {
        $this->CON = $con;
    }

    function contructor($categoriaProducto_id, $linea_producto_id) {
        $this->categoriaProducto_id = $categoriaProducto_id;
        $this->linea_producto_id = $linea_producto_id;
    }

    function buscarXCategoria($id_categoria) {
        $consulta = "select * from lasueca.categoriaproducto_linea where categoriaProducto_id=$id_categoria";
        return $this->CON->consulta2($consulta);
    }
    function buscarXTexto($texto,$estado) {
        $consulta = " select linea_producto_id,categoriaProducto_id";
        $consulta .= " from lasueca.categoriaproducto c, lasueca.categoriaproducto_linea l";
        $consulta .= " where l.categoriaProducto_id=c.id_categoriaProducto";
        $consulta .= " and c.nombre like '%$texto%' and c.estado like '$estado' ";
        return $this->CON->consulta2($consulta);
    }
     
    function insertar($categoriaProducto_id, $linea_producto_id) {
        $consulta = "INSERT INTO `lasueca`.`categoriaproducto_linea` (`categoriaProducto_id`,`linea_producto_id`) VALUES ('$categoriaProducto_id','$linea_producto_id');";
        return $this->CON->manipular($consulta);
    }
    function eliminarxCategoria($idCategoria) {
        $consulta = "delete from lasueca.categoriaproducto_linea where categoriaProducto_id=$idCategoria";
        return $this->CON->manipular($consulta);
    }

}

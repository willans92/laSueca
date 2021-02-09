<?php

class linea_producto_tienda {

    var $tienda_id;
    var $linea_producto_id;
    var $CON;

    function __construct($con) {
        $this->CON = $con;
    }

    function contructor($tienda_id, $linea_producto_id) {
        $this->tienda_id = $tienda_id;
        $this->linea_producto_id = $linea_producto_id;
    }

    function buscarXtienda($idtienda) {
        $consulta = "select * from lasueca.linea_producto_tienda where tienda_id=$idtienda";
        return $this->CON->consulta2($consulta);
    }

    function lineaXidCategoria($idcategoria, $idtienda) {
        $consulta = " select lin.id_linea_producto,lin.descripcion";
        $consulta .= " from lasueca.categoriaproducto_linea l, lasueca.linea_producto lin, lasueca.linea_producto_tienda lp  ";
        $consulta .= " where l.linea_producto_id=lin.id_linea_producto  ";
        $consulta .= " and lp.linea_producto_id=l.linea_producto_id  and lp.tienda_id=$idtienda ";
        $consulta .= " and l.categoriaProducto_id=$idcategoria";
        $consulta .= " order by lin.posicion asc, lin.id_linea_producto desc";
        return $this->CON->consulta2($consulta);
    }

    function insertar($tienda_id, $linea_producto_id) {
        $consulta = "INSERT INTO `lasueca`.`linea_producto_tienda` (`tienda_id`,`linea_producto_id`) VALUES ('$tienda_id','$linea_producto_id');";
        return $this->CON->manipular($consulta);
    }

    function eliminarxCategoria($idtienda) {
        $consulta = "delete from lasueca.linea_producto_tienda where tienda_id=$idtienda";
        return $this->CON->manipular($consulta);
    }

}

<?php

class linea_producto_tienda{

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
        
    function insertar($tienda_id, $linea_producto_id) {
        $consulta = "INSERT INTO `lasueca`.`linea_producto_tienda` (`tienda_id`,`linea_producto_id`) VALUES ('$tienda_id','$linea_producto_id');";
        return $this->CON->manipular($consulta);
    }
    function eliminarxCategoria($idtienda) {
        $consulta = "delete from lasueca.linea_producto_tienda where tienda_id=$idtienda";
        return $this->CON->manipular($consulta);
    }

}

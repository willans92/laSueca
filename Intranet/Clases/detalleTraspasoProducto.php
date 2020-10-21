<?php

class detalleTraspasoProducto {

    var $id_detalleTraspasoProducto;
    var $traspasoProducto_id;
    var $producto_id;
    var $cantidad;
    var $estado;
    var $CON;

    function __construct($con) {
        $this->CON = $con;
    }

    function contructor($id_detalleTraspasoProducto, $traspasoProducto_id, $producto_id, $cantidad) {
        $this->id_detalleTraspasoProducto=$id_detalleTraspasoProducto;
        $this->traspasoProducto_id=$traspasoProducto_id;
        $this->producto_id=$producto_id;
        $this->cantidad=$cantidad;
    }

    function buscarXidcompra($traspaso_id) {
        $consulta = "SELECT * FROM lasueca.detalletraspasoproducto where traspasoProducto_id=$traspaso_id";
        return $this->CON->consulta2($consulta);
    }
    
    function insertar() {
        $consulta = "INSERT INTO lasueca.detalletraspasoproducto (id_detalleTraspasoProducto,traspasoProducto_id,producto_id,cantidad,estado) VALUES (0,'$this->traspasoProducto_id','$this->producto_id','$this->cantidad','activo');";
        return $this->CON->manipular($consulta);
    }
    
    function eliminadoLogico($idTraspaso) {
       $consulta = "update lasueca.detalletraspasoproducto set estado='inactivo' where traspasoProducto_id=$idTraspaso";
       return $this->CON->manipular($consulta);
    }
    function eliminarXidTraspaso($idTraspaso) {
       $consulta = " delete from lasueca.detalletraspasoproducto where  traspasoProducto_id=$idTraspaso";
       return $this->CON->manipular($consulta);
    }
}

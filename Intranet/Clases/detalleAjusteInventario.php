<?php

class detalleAjusteInventario {

    var $id_detalleAjusteInventario;
    var $ajusteInventario_id;
    var $producto_id;
    var $cantidad;
    var $estado;
    var $CON;

    function __construct($con) {
        $this->CON = $con;
    }

    function contructor($id_detalleAjusteInventario, $ajusteInventario_id, $producto_id, $cantidad) {
        $this->id_detalleAjusteInventario=$id_detalleAjusteInventario;
        $this->ajusteInventario_id=$ajusteInventario_id;
        $this->producto_id=$producto_id;
        $this->cantidad=$cantidad;
    }

    function buscarXidAjuste($traspaso_id) {
        $consulta = "SELECT * FROM lasueca.detalleAjusteInventario where ajusteInventario_id=$traspaso_id";
        return $this->CON->consulta2($consulta);
    }
    
    function insertar() {
        $consulta = "INSERT INTO lasueca.detalleAjusteInventario (id_detalleAjusteInventario,ajusteInventario_id,producto_id,cantidad,estado) VALUES (0,'$this->ajusteInventario_id','$this->producto_id','$this->cantidad','activo');";
        return $this->CON->manipular($consulta);
    }
    
    function eliminadoLogico($idTraspaso) {
       $consulta = "update lasueca.detalleAjusteInventario set estado='inactivo' where ajusteInventario_id=$idTraspaso";
       return $this->CON->manipular($consulta);
    }
    function eliminarXidTraspaso($idTraspaso) {
       $consulta = " delete from lasueca.detalleAjusteInventario where  ajusteInventario_id=$idTraspaso";
       return $this->CON->manipular($consulta);
    }
}

<?php

class marca {

    var $id_marca;
    var $descripcion;
    var $empresa_id;
    var $CON;

    function __construct($con) {
        $this->CON = $con;
    }

    function contructor($id_marca, $descripcion) {
        $this->id_marca = $id_marca;
        $this->descripcion = $descripcion;
    }

    function todo() {
        $consulta = "select * from lasueca.marca where empresa_id=87";
        return $this->CON->consulta2($consulta);
    }

    function buscarXID($id) {
        $consulta = "select * from lasueca.marca where id_marca=$id and empresa_id=".$this->CON->empresa_id;
        $result = $this->CON->consulta($consulta);
        $empresa = $this->rellenar($result);
        if ($empresa == null) {
            return null;
        }
        return $empresa[0];
    }

    function modificar($id_marca,$descrip) {
        $consulta = "update lasueca.marca set id_marca =$id_marca, descripcion ='$descrip' where id_marca=$id_marca and empresa_id=".$this->CON->empresa_id ;
        return $this->CON->manipular($consulta);
    }

    function eliminar($id_marca) {
        $consulta = "delete from lasueca.marca where empresa_id=".$this->CON->empresa_id."  and id_marca=" . $id_marca;
        return $this->CON->manipular($consulta);
    }

    function insertar($descrip) {
        $consulta = "insert into lasueca.marca(descripcion,empresa_id) values('$descrip',".$this->CON->empresa_id.")";
        return $this->CON->manipular($consulta);
    }

}

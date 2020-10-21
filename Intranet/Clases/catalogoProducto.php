<?php

class catalogoProducto {

    var $id_categoriaProducto;
    var $nombre;
    var $foto;
    var $estado;
    var $CON;

    function __construct($con) {
        $this->CON = $con;
    }

    function contructor($id_categoriaProducto, $nombre, $estado,$foto) {
        $this->id_categoriaProducto = $id_categoriaProducto;
        $this->nombre = $nombre;
        $this->foto = $foto;
        $this->estado = $estado;
    }

    function buscarXtext($text,$estado) {
        $consulta = "select * from lasueca.categoriaproducto where nombre like '%$text%' and estado like '$estado' order by id_categoriaProducto asc";
        return $this->CON->consulta2($consulta);
    }

    function modificar() {
        $consulta = "UPDATE lasueca.categoriaproducto SET nombre = '$this->nombre',estado = '$this->estado' WHERE id_categoriaProducto = '$this->id_categoriaProducto'";
        return $this->CON->manipular($consulta);
    }
    function modificarFoto($id,$foto) {
        $consulta = "UPDATE lasueca.categoriaproducto SET foto='$foto' WHERE id_categoriaProducto = '$id'";
        return $this->CON->manipular($consulta);
    }

    function insertar() {
        $consulta = "INSERT INTO lasueca.categoriaproducto (id_categoriaProducto,nombre,foto,estado) VALUES ('$this->id_categoriaProducto','$this->nombre','','$this->estado');";
        $resultado = $this->CON->manipular($consulta);
        if (!$resultado) {
            return false;
        }
        $consulta = "SELECT LAST_INSERT_ID() as id";
        $resultado = $this->CON->consulta($consulta);
        $this->id_categoriaProducto = $resultado->fetch_assoc()['id'];
        return true;
    }

}

<?php

class linea_producto {

    var $id_linea_producto;
    var $descripcion;
    var $empresa_id;
    var $posicion;
    var $CON;

    function __construct($con) {
        $this->CON = $con;
    }

    function contructor($id_tipo_producto, $descripcion, $posicion) {
        $this->id_linea_producto = $id_tipo_producto;
        $this->descripcion = $descripcion;
        $this->posicion = $posicion === "" || is_null($posicion) ? 0 : $posicion;
    }

    function todo() {
        $consulta = "select * from lasueca.linea_producto  where empresa_id=" . $this->CON->empresa_id . " order by posicion asc, id_linea_producto asc";
        return $this->CON->consulta2($consulta);
    }

    function lineaNroProducto() {
        $consulta = " select l.id_linea_producto,l.descripcion,l.posicion,count(p.id_producto) producto ";
        $consulta .= " from lasueca.linea_producto l ,lasueca.producto  p";
        $consulta .= " where l.id_linea_producto=p.linea_producto_id";
        $consulta .= " and l.empresa_id=" . $this->CON->empresa_id . "";
        $consulta .= " group by l.id_linea_producto,l.descripcion,l.posicion";
        $consulta .= " order by l.posicion asc, l.id_linea_producto asc";
        return $this->CON->consulta2($consulta);
    }

    function ALERTA_BuscarLinea($empresa_id, $contador, $cantidad) {
        $consulta = "select * from lasueca.linea_producto  where empresa_id=$empresa_id order by posicion asc, id_linea_producto asc  limit $contador,$cantidad";
        $data = $this->CON->consulta2($consulta);
        $consulta = "select count(id_linea_producto) cantidad from lasueca.linea_producto  where empresa_id=$empresa_id";
        $limiteData = $this->CON->consulta($consulta);
        $limite = $limiteData->fetch_assoc()['cantidad'];
        $resultado = array();
        $resultado["limite"] = $limite;
        $resultado["data"] = $data;
        return $resultado;
    }

    function buscarXempresa($empresa) {
        $consulta = "select * from lasueca.linea_producto  where empresa_id=$empresa order by posicion asc, id_linea_producto asc";
        return $this->CON->consulta2($consulta);
    }

    function modificar($id_linea_producto, $nombre, $posicion = 0) {
        $consulta = "update lasueca.linea_producto set posicion=$posicion, id_linea_producto =$id_linea_producto, descripcion ='$nombre' where id_linea_producto=" . $id_linea_producto . " and empresa_id=" . $this->CON->empresa_id;
        return $this->CON->manipular($consulta);
    }

    function eliminar($id_tipo_producto) {
        $consulta = "delete from lasueca.linea_producto where empresa_id=" . $this->CON->empresa_id . "  and id_linea_producto=" . $id_tipo_producto;
        return $this->CON->manipular($consulta);
    }

    function insertar($nombre, $posicion = 0) {
        $consulta = "insert into lasueca.linea_producto(descripcion,empresa_id,posicion) values('" . $nombre . "'," . $this->CON->empresa_id . ",$posicion)";
        return $this->CON->manipular($consulta);
    }

}

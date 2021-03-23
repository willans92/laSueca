<?php

class catalogoProducto {

    var $id_categoriaProducto;
    var $nombre;
    var $foto;
    var $estado;
    var $tipo;
    var $posicion;
    var $CON;

    function __construct($con) {
        $this->CON = $con;
    }

    function contructor($id_categoriaProducto, $nombre, $estado, $foto, $tipo,$posicion) {
        $this->id_categoriaProducto = $id_categoriaProducto;
        $this->nombre = $nombre;
        $this->foto = $foto;
        $this->estado = $estado;
        $this->tipo = $tipo;
        $this->posicion = $posicion;
    }

    function buscarXtext($text, $estado) {
        $consulta = "select * from lasueca.categoriaproducto where nombre like '%$text%' and estado like '$estado' and empresa_id=" . $this->CON->empresa_id . " order by posicion asc, id_categoriaProducto asc";
        return $this->CON->consulta2($consulta);
    }

    function buscarTienda() {
        $consulta = "select * from lasueca.categoriaproducto where estado like 'activo' and tipo like 'normal' order by id_categoriaProducto asc";
        return $this->CON->consulta2($consulta);
    }

    function catalogoAsignadoTienda($id_tienda) {
        $consulta = " select c.id_categoriaProducto,c.nombre,c.foto ";
        $consulta .= " from lasueca.categoriaproducto c ,lasueca.categoriaproducto_linea l, lasueca.linea_producto_tienda lp";
        $consulta .= " where estado like 'activo' and tipo like 'normal' ";
        $consulta .= " and l.categoriaProducto_id=c.id_categoriaProducto ";
        $consulta .= " and lp.linea_producto_id=l.linea_producto_id";
        $consulta .= " and lp.tienda_id=$id_tienda";
        $consulta .= " group by  c.id_categoriaProducto,c.nombre,c.foto ";
        $consulta .= " order by id_categoriaProducto asc";
        return $this->CON->consulta2($consulta);
    }

    function modificar() {
        $consulta = "UPDATE lasueca.categoriaproducto SET tipo='$this->tipo', posicion='$this->posicion', nombre = '$this->nombre',estado = '$this->estado' WHERE id_categoriaProducto = '$this->id_categoriaProducto' and empresa_id=" . $this->CON->empresa_id . "";
        return $this->CON->manipular($consulta);
    }

    function modificarFoto($id, $foto) {
        $consulta = "UPDATE lasueca.categoriaproducto SET foto='$foto' WHERE id_categoriaProducto = '$id' and empresa_id=" . $this->CON->empresa_id . "";
        return $this->CON->manipular($consulta);
    }

    function insertar() {
        $consulta = "INSERT INTO lasueca.categoriaproducto (id_categoriaProducto,nombre,foto,estado,empresa_id,tipo,posicion) VALUES ('$this->id_categoriaProducto','$this->nombre','','$this->estado','" . $this->CON->empresa_id . "','$this->tipo','$this->posicion');";
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

<?php

class almacen {

    var $id_almacen;
    var $nombre;
    var $telefono;
    var $direccion;
    var $posicion;
    var $estado;
    var $codigo;
    var $FechaActualizacion;
    var $usuarioActualizo_id;
    var $sucursal_id;
    var $empresa_id;
    var $CON;

    function __construct($con) {
        $this->CON = $con;
    }

    function contructor($id_almacen, $codigo, $nombre, $telefono, $direccion, $posicion, $estado, $FechaActualizacion, $usuarioActualizo_id, $sucursal_id) {
        $this->id_almacen = $id_almacen;
        $this->nombre = $nombre;
        $this->telefono = $telefono;
        $this->direccion = $direccion;
        $this->codigo = $codigo;
        $this->posicion = $posicion;
        $this->estado = $estado;
        $this->FechaActualizacion = $FechaActualizacion;
        $this->usuarioActualizo_id = $usuarioActualizo_id;
        $this->sucursal_id = $sucursal_id;
    }

    function buscarXestado($estado = "", $sucursal_id = "") {
        $est = "";
        if ($estado !== "") {
            $est = " estado like '$estado' and ";
        }
        $suc = "";
        if ($sucursal_id !== "") {
            $suc = " sucursal_id='$sucursal_id' and ";
        }
        $consulta = "select * from lasueca.almacen where $suc $est empresa_id=" . $this->CON->empresa_id . " order by posicion asc";
        return $this->CON->consulta2($consulta);
    }

    function buscarXid($idalmacen) {
        $consulta = "select * from lasueca.almacen where id_almacen=$idalmacen and empresa_id=" . $this->CON->empresa_id . "  order by posicion asc";
        return $this->CON->consulta2($consulta)[0];
    }

    function todo() {
        $consulta = "select * from lasueca.almacen where empresa_id=" . $this->CON->empresa_id . "  order by posicion asc";
        return $this->CON->consulta2($consulta);
    }

    function buscarXsucursal($idsucursal) {
        $consulta = "select * from lasueca.almacen where sucursal_id=$idsucursal and empresa_id=" . $this->CON->empresa_id . " order by posicion asc";
        return $this->CON->consulta2($consulta);
    }

    function reporteInventario($almacen, $de, $hasta) {
        $alm = "";
        if ($almacen !== "0") {
            $alm = " and d.almacen_id=$almacen";
        }
        $consulta = " select sum(a.salida) salida ,a.producto_id, sum(a.entrada) entrada from ( ";
        
        $consulta .= " select sum(d.cantidad) salida ,d.producto_id, 0 entrada, 1 tipo";
        $consulta .= " from lasueca.detalleventa d, lasueca.venta v";
        $consulta .= " where d.venta_id=v.id_venta  and v.estado like 'activo' and v.empresa_id=" . $this->CON->empresa_id . "";
        $consulta .= $alm;
        $consulta .= " 	and STR_TO_DATE(v.fecha,'%e/%c/%Y') between STR_TO_DATE('$de','%e/%c/%Y') and STR_TO_DATE('$hasta','%e/%c/%Y')";
        $consulta .= "  group by d.producto_id";
        $consulta .= " union";

        $consulta .= " select 0 salida, d.producto_id, sum(d.cantidad) entrada, 2 tipo ";
        $consulta .= " from lasueca.detallecompra d, lasueca.compra c";
        $consulta .= " where d.compra_id=c.id_compra $alm  and c.estado like 'activo' and c.empresa_id=" . $this->CON->empresa_id . "";
        $consulta .= " and STR_TO_DATE(c.fecha,'%e/%c/%Y') between STR_TO_DATE('$de','%e/%c/%Y') and STR_TO_DATE('$hasta','%e/%c/%Y')";
        $consulta .= " group by  d.producto_id";

        $consulta .= " union";
        
    
        $consulta .= " select sum(if(d.cantidad>0,0,d.cantidad*-1)) salida, d.producto_id, sum(if(d.cantidad>0,d.cantidad,0)) entrada, 3 tipo ";
        $consulta .= " from lasueca.ajusteInventario t, lasueca.detalleAjusteInventario d";
        $consulta .= " where  t.estado like 'activo' and t.empresa_id=" . $this->CON->empresa_id . " and t.id_ajusteInventario=d.ajusteInventario_id  ";
        if ($almacen !== "0") {
            $consulta .= " and t.almacen_id=$almacen";
        }
        $consulta .= " and STR_TO_DATE(t.fecha,'%e/%c/%Y') between STR_TO_DATE('$de','%e/%c/%Y') and STR_TO_DATE('$hasta','%e/%c/%Y') ";
        $consulta .= " group by  d.producto_id";

        $consulta .= " union";

        $consulta .= " select 0 salida, d.producto_id, sum(d.cantidad) entrada, 4 tipo";
        $consulta .= " from lasueca.traspasoproducto t, lasueca.detalleTraspasoproducto d";
        $consulta .= " where t.estado like 'activo' and t.empresa_id=" . $this->CON->empresa_id . " and t.id_traspasoproducto=d.traspasoproducto_id ";
        if ($almacen !== "0") {
             $consulta .= " and t.almacenDestino=$almacen";
        }
        $consulta .= " and STR_TO_DATE(t.fecha,'%e/%c/%Y') between STR_TO_DATE('$de','%e/%c/%Y') and STR_TO_DATE('$hasta','%e/%c/%Y') ";
        $consulta .= " group by  d.producto_id, t.almacenDestino";

        $consulta .= " union";

        $consulta .= " select sum(d.cantidad) salida, d.producto_id, 0 entrada, 5 tipo ";
        $consulta .= " from lasueca.traspasoproducto t, lasueca.detalleTraspasoproducto d";
        $consulta .= " where t.estado like 'activo' and t.empresa_id=" . $this->CON->empresa_id . " and t.id_traspasoproducto=d.traspasoproducto_id  ";
        if ($almacen !== "0") {
             $consulta .= " and t.almacenOrigen=$almacen";
        }
        $consulta .= " and STR_TO_DATE(t.fecha,'%e/%c/%Y') between STR_TO_DATE('$de','%e/%c/%Y') and STR_TO_DATE('$hasta','%e/%c/%Y') ";
        $consulta .= " group by  d.producto_id, t.almacenOrigen";
        
        
        $consulta .= " ) a group by  a.producto_id";
        
        
        return $this->CON->consulta2($consulta);
    }

    function modificar() {
        $consulta = "UPDATE lasueca.almacen SET id_almacen = '$this->id_almacen', nombre = '$this->nombre',direccion = '$this->direccion',telefono = '$this->telefono',posicion = '$this->posicion',estado = '$this->estado',codigo = '$this->codigo',sucursal_id = '$this->sucursal_id' WHERE id_almacen = '$this->id_almacen' and empresa_id=" . $this->CON->empresa_id;
        return $this->CON->manipular($consulta);
    }

    function insertar() {
        $consulta = "INSERT INTO lasueca.almacen (id_almacen,nombre,direccion,telefono,posicion,estado,codigo,sucursal_id,FechaActualizacion,usuarioActualizo_id,empresa_id )VALUES('$this->id_almacen','$this->nombre','$this->direccion','$this->telefono','$this->posicion','$this->estado','$this->codigo','$this->sucursal_id','$this->FechaActualizacion','$this->usuarioActualizo_id'," . $this->CON->empresa_id . ")";
        return $this->CON->manipular($consulta);
    }

}

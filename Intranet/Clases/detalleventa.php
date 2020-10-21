<?php

class detalleventa {

    var $id_DetalleVenta;
    var $producto_id;
    var $cantidad;
    var $precio;
    var $DetalleVentacol;
    var $almacen_id;
    var $detallecompra_id;
    var $descuento;
    var $precioTotal;
    var $venta_id;
    var $estado;
    var $fecha;
    var $CON;

    function __construct($con) {
        $this->CON = $con;
    }

    function contructor($id_DetalleVenta, $producto_id, $cantidad, $precio, $almacen_id, $detallecompra_id, $descuento, $precioTotal,$venta_id,$estado,$fecha) {
        $this->estado = $estado;
        $this->fecha = $fecha;
        $this->id_DetalleVenta = $id_DetalleVenta;
        $this->producto_id = $producto_id;
        $this->cantidad = $cantidad;
        $this->precio = $precio;
        $this->almacen_id = $almacen_id;
        $this->detallecompra_id = $detallecompra_id?$detallecompra_id:'null';
        $this->descuento = $descuento;
        $this->precioTotal = $precioTotal;
        $this->venta_id = $venta_id;
    }

    function buscarXid($idventa) {
        $consulta = "select cantidad,P.codigo,precio,precioTotal,descuento,p.nombre ,";
        $consulta .= " ifnull((select concat(fechaVencimiento,'|=|',codigo) from lasueca.lotemercaderia where STR_TO_DATE(fechaRegistrado,'%e/%c/%Y') <= STR_TO_DATE(v.fecha,'%e/%c/%Y')  and detallecompra_id=d.detalleCompra_id order by STR_TO_DATE(fechaRegistrado,'%e/%c/%Y') desc limit 0,1),'') lote";
        $consulta .= " FROM lasueca.detalleventa d, lasueca.producto p, lasueca.venta v";
        $consulta .= "  where v.empresa_id=".$this->CON->empresa_id."  and d.producto_id=p.id_producto and d.venta_id=v.id_venta and venta_id=$idventa";
        return $this->CON->consulta2($consulta);
    }
    function buscarXidventa($idventa) {
        $consulta = "select d.*,l.codigo lote,l.fechaVencimiento from lasueca.detalleventa d left join lasueca.lotemercaderia l on  d.detallecompra_id=l.detallecompra_id where venta_id=$idventa   ";
        return $this->CON->consulta2($consulta);
    }
   

    function modificar($almacen_id) {
        $consulta = "update lasueca.detalleventa set estado='$this->estado',fecha='$this->fecha',id_DetalleVenta =" . $this->id_DetalleVenta . ", producto_id =" . $this->producto_id . ", cantidad =" . $this->cantidad . ", precio =" . $this->precio . ", DetalleVentacol ='" . $this->DetalleVentacol . "', almacen_id =" . $this->almacen_id . ", detallecompra_id =" . $this->detallecompra_id . ", descuento =" . $this->descuento . " where almacen_id=" . $almacen_id;
        return $this->CON->manipular($consulta);
    }
    function modificarEnlace($id_detallevenda,$id_detallecompra) {
        $consulta = "update lasueca.detalleventa set detallecompra_id =$id_detallecompra where id_DetalleVenta=" . $id_detallevenda;
        return $this->CON->manipular($consulta);
    }
    function anularFactura($factura) {
        $consulta = "update lasueca.detalleventa set estado='inactivo' where venta_id=" . $factura;
        return $this->CON->manipular($consulta);
    }

    function eliminar($venta_id) {
        $consulta = "delete from lasueca.detalleventa where venta_id=" . $venta_id;
        return $this->CON->manipular($consulta);
    }

    function insertar() {
        $consulta = "insert into lasueca.detalleventa(id_DetalleVenta, producto_id, cantidad, precio, almacen_id, detallecompra_id, descuento,precioTotal,venta_id,estado,fecha) values(" . $this->id_DetalleVenta . "," . $this->producto_id . "," . $this->cantidad . "," . $this->precio . "," . $this->almacen_id . "," . $this->detallecompra_id . "," . $this->descuento . "," . $this->precioTotal . ",$this->venta_id,'$this->estado','$this->fecha')";
        $resultado = $this->CON->manipular($consulta);
        if (!$resultado) {
            return false;
        }
        $consulta = "SELECT LAST_INSERT_ID() as id";
        $resultado = $this->CON->consulta($consulta);
        $this->id_usuario = $resultado->fetch_assoc()['id'];
        return true;
    }

}

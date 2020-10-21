<?php

class detalleCompra {

    var $id_detalleCompra;
    var $cantidad;
    var $precio;
    var $compra_id;
    var $almacen_id;
    var $producto_id;
    var $fechaActualizacion;
    var $fecha;
    var $estado;
    var $CON;

    function __construct($con) {
        $this->CON = $con;
    }

    function contructor($id_detalleCompra,$cantidad,$precio,$compra_id ,$almacen_id,$producto_id,$fechaActualizacion,$fecha,$estado) {
        $this->id_detalleCompra = $id_detalleCompra;
        $this->cantidad = $cantidad;
        $this->precio = $precio;
        $this->compra_id = $compra_id;
        $this->almacen_id = $almacen_id;
        $this->producto_id = $producto_id;
        $this->fechaActualizacion = $fechaActualizacion;
        $this->fecha = $fecha;
        $this->estado= $estado;
    }

    function buscarEnlaceParaVenta($idproduto,$sucursal,$idDetalle) {
        $consulta = "";
        if($idDetalle!=="0"){
            $consulta = "  select c.id_detallecompra,(c.cantidad-ifnull(v.cantidad,0)) cantidad,c.almacen_id";
            $consulta .= " from lasueca.detallecompra c left join (select detallecompra_id,sum(cantidad) cantidad from lasueca.detalleventa where estado like 'activo' group by detallecompra_id) v";
            $consulta .= " on c.id_detallecompra=v.detallecompra_id";
            $consulta .= " where c.id_detallecompra=$idDetalle";
            $consulta .= " union";
        }
        $consulta .= "    select c.id_detallecompra,(c.cantidad-ifnull(v.cantidad,0)) cantidad,c.almacen_id";
        $consulta .= "  from lasueca.detallecompra c left join (select detallecompra_id,sum(cantidad) cantidad from lasueca.detalleventa where producto_id=$idproduto and estado like 'activo' group by detallecompra_id) v ";
        $consulta .= "  on c.id_detallecompra=v.detallecompra_id";
        $consulta .= "  where c.producto_id=$idproduto and (c.cantidad-ifnull(v.cantidad,0))>0 and c.estado like 'activo'";
        $consulta .= "  and c.almacen_id in (select id_almacen from lasueca.almacen where sucursal_id=$sucursal and empresa_id=".$this->CON->empresa_id." and estado like 'activo')";
        return $this->CON->consulta2($consulta);
    }
    function buscarEnlaceParaVentaUltimaCompra($idproduto) {
        $consulta = "  select d.id_detallecompra,c.almacen_id , 7777 cantidad";
        $consulta .= "  from lasueca.detallecompra d, lasueca.compra c";
        $consulta .= "  where d.compra_id=c.id_compra and d.producto_id=$idproduto";
        $consulta .= "  order by STR_TO_DATE(c.fecha,'%e/%c/%Y %H:%i:%s') desc,d.id_detallecompra desc";
        $consulta .= "  limit 0,1";
        return $this->CON->consulta2($consulta);
    }
    function buscarXidcompra($idcompra) {
        $consulta = "SELECT * ,(select codigo from lasueca.loteMercaderia where empresa_id=".$this->CON->empresa_id."  and detalleCompra_id=d.id_detalleCompra order by id_loteMercaderia desc limit 0,1) lote ,(select fechaVencimiento from lasueca.loteMercaderia where  empresa_id=".$this->CON->empresa_id." and detalleCompra_id=d.id_detalleCompra order by id_loteMercaderia desc limit 0,1) fechaVencimiento FROM lasueca.detallecompra d where compra_id=$idcompra";
        return $this->CON->consulta2($consulta);
    }
    function insertar() {
        $consulta = "INSERT INTO lasueca.detallecompra(id_detalleCompra,cantidad,precio,compra_id,almacen_id,producto_id,fechaActualizacion,fecha,estado) VALUES('$this->id_detalleCompra','$this->cantidad','$this->precio','$this->compra_id','$this->almacen_id','$this->producto_id','$this->fechaActualizacion','$this->fecha','$this->estado');";
        $resultado = $this->CON->manipular($consulta);
        if (!$resultado) {
            return false;
        }
        $consulta = "SELECT LAST_INSERT_ID() as id";
        $resultado = $this->CON->consulta($consulta);
        $this->id_detalleCompra = $resultado->fetch_assoc()['id'];
        return true;
    }
    function modificar($iddetalle) {
        $consulta = "update lasueca.detallecompra set cantidad='$this->cantidad',precio='$this->precio',almacen_id='$this->almacen_id',producto_id='$this->producto_id',fechaActualizacion='$this->fechaActualizacion',fecha='$this->fecha' where id_detalleCompra=$iddetalle";
        return $this->CON->manipular($consulta);
    }
    function eliminarXidDetalleCompra($idCompra,$idDetalleCompra) {
       $consulta = " delete from lasueca.lotemercaderia where empresa_id=".$this->CON->empresa_id."  and  detallecompra_id in ( select id_detalleCompra from lasueca.detallecompra where  compra_id=$idCompra and  id_detalleCompra not in ($idDetalleCompra))";
       if(!$this->CON->manipular($consulta)){
           return false;
       }
        $consulta = "delete from lasueca.detallecompra where compra_id=$idCompra and  id_detalleCompra not in ($idDetalleCompra)";
        return $this->CON->manipular($consulta);
    }
     function eliminadoLogico($id_compra) {
        $consulta = "update lasueca.detallecompra set estado='inactivo' where compra_id=" . $id_compra;
        return $this->CON->manipular($consulta);
    }

}

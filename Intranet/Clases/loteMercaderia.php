<?php

class lotemercaderia {

    var $id_loteMercaderia;
    var $codigo;
    var $fechaVencimiento;
    var $estado;
    var $cantidad;
    var $fechaModificado;
    var $registradoPor;
    var $modificadoPor;
    var $fechaRegistrado;
    var $detallecompra_id;
    var $empresa_id;
    var $CON;

    function __construct($con) {
        $this->CON = $con;
    }

    function contructor($id_loteMercaderia, $codigo, $fechaVencimiento, $estado, $cantidad, $fechaModificado, $registradoPor, $modificadoPor, $fechaRegistrado, $detallecompra_id) {
        $this->id_loteMercaderia = $id_loteMercaderia;
        $this->codigo = $codigo;
        $this->fechaVencimiento = $fechaVencimiento;
        $this->estado = $estado;
        $this->cantidad = $cantidad;
        $this->fechaModificado = $fechaModificado;
        $this->registradoPor = $registradoPor;
        $this->modificadoPor = $modificadoPor;
        $this->fechaRegistrado = $fechaRegistrado;
        $this->detallecompra_id = $detallecompra_id;
    }

    function buscarXid($idlote) {
        $consulta = "select * from lasueca.lotemercaderia where id_loteMercaderia=$idlote and empresa_id=".$this->CON->empresa_id."";
        return $this->CON->consulta2($consulta)[0];
    }

    function buscarXidDetalleCompra($id_detalleCompra) {
        $consulta = "select registradoPor,fechaVencimiento,codigo,registradoPor from lasueca.lotemercaderia where detallecompra_id=$id_detalleCompra and empresa_id=".$this->CON->empresa_id."";
        return $this->CON->consulta2($consulta);
    }

    function buscarLotes($estado) {
        $where = "";
        $order = " order by STR_TO_DATE(l.fechaVencimiento,'%e/%c/%Y') desc ";
        if ($estado === "Vigentes") {
            $where = " and l.estado='activo' and STR_TO_DATE(l.fechaVencimiento,'%e/%c/%Y') >= CURDATE()";
            $order = " order by STR_TO_DATE(l.fechaVencimiento,'%e/%c/%Y') asc ";
        }
        if ($estado === "Vencidos") {
            $where = " and l.estado='activo' and STR_TO_DATE(l.fechaVencimiento,'%e/%c/%Y') < CURDATE()";
        }
        if ($estado === "Anulados") {
            $where = " and l.estado='inactivo'";
        }
        $consulta = " select  l.fechaRegistrado,c.fecha fechaCompra , l.codigo lote,l.fechaVencimiento,l.cantidad, d.producto_id, CONCAT('CF-',c.nroDocumento),  if(c.tipo='Compra Facturada',CONCAT('CF-',c.nroDocumento),CONCAT('NC-',c.nroDocumento)) nroDocumento";
        $consulta .= " ,(ifnull((SELECT sum(i.cantidad) FROM lasueca.detalleventa i where i.detalleCompra_id=l.detalleCompra_id and i.estado='activo'),0) ) vendido  ";
        $consulta .= " , c.id_compra, l.id_loteMercaderia, d.id_detalleCompra  ";
        $consulta .= " from lasueca.lotemercaderia  l, lasueca.detallecompra d, lasueca.compra c";
        $consulta .= " where l.detalleCompra_id=d.id_detalleCompra and c.empresa_id=".$this->CON->empresa_id." and c.id_compra=d.compra_id  and c.estado='activo' $where $order";
        return $this->CON->consulta2($consulta);
    }

    function lotesConStock($id_sucursal) {
        $consulta = " select  l.codigo lote,l.fechaVencimiento, c.producto_id,c.id_detalleCompra ,(c.cantidad-ifnull(v.cantidad,0)) cantidad  ";
        $consulta .= " from lasueca.detallecompra c left join (select detallecompra_id,sum(cantidad) cantidad from lasueca.detalleventa where estado like 'activo' group by detallecompra_id) v   on c.id_detallecompra=v.detallecompra_id , lasueca.lotemercaderia  l";
        $consulta .= " where (c.cantidad-ifnull(v.cantidad,0))>0  and c.estado like 'activo' and l.detalleCompra_id=c.id_detalleCompra ";
        $consulta .= " and c.almacen_id in (select id_almacen from lasueca.almacen where sucursal_id=$id_sucursal and empresa_id=".$this->CON->empresa_id." and estado like 'activo') ";
        $resultado = $this->CON->consulta($consulta);
        $lista = array();
        if ($resultado != null) {
            while ($row = $resultado->fetch_assoc()) {
                $obj = array();
                $obj["id_detalleCompra"] = utf8_encode($row["id_detalleCompra"]);
                $obj["lote"] = utf8_encode($row["lote"]);
                $obj["vencimiento"] = utf8_encode($row["fechaVencimiento"]);
                $obj["producto"] = utf8_encode($row["producto_id"]);
                if (!$lista["p" . $row["producto_id"]]) {
                    $lista["p" . $row["producto_id"]]=array();
                } 
                $lista["p" . $row["producto_id"]][]=$obj;
            }
        }
        return $lista;
    }

    function insertar() {
        $consulta = "INSERT INTO lasueca.lotemercaderia  (id_loteMercaderia,  codigo,  fechaVencimiento,  estado,  cantidad,  fechaModificado,  registradoPor,  modificadoPor,  fechaRegistrado,  detallecompra_id,empresa_id)  VALUES  ('$this->id_loteMercaderia',  '$this->codigo',  '$this->fechaVencimiento',  '$this->estado',  '$this->cantidad',  '$this->fechaModificado',  '$this->registradoPor',  '$this->modificadoPor',  '$this->fechaRegistrado',  '$this->detallecompra_id',".$this->CON->empresa_id.")";
        $resultado = $this->CON->manipular($consulta);
        if (!$resultado) {
            return false;
        }
        return true;
    }

    function cambiarLote($idLote, $fechaModificacion, $usuario_id) {
        $consulta = "update lasueca.lotemercaderia set estado='inactivo',fechaModificado='$fechaModificacion',modificadoPor=$usuario_id  where id_loteMercaderia=$idLote and empresa_id=".$this->CON->empresa_id."";
        return $this->CON->manipular($consulta);
    }

}

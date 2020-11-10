<?php

class cobranza {

    var $id_cobranza;
    var $nroDocumento;
    var $detalle;
    var $fecha;
    var $cobradoPor;
    var $fechaModificacion;
    var $modificadoPor;
    var $sucursal_id;
    var $metodoPago;
    var $empresa_id;
    var $estado;
    var $CON;

    function __construct($con) {
        $this->CON = $con;
    }

    function contructor($id_cobranza, $nroDocumento, $detalle, $fecha, $cobradoPor, $fechaModificacion, $modificadoPor, $sucursal_id, $metodoPago, $estado) {
        $this->id_cobranza = $id_cobranza;
        $this->nroDocumento = $nroDocumento;
        $this->detalle = $detalle;
        $this->fecha = $fecha;
        $this->cobradoPor = $cobradoPor;
        $this->fechaModificacion = $fechaModificacion;
        $this->modificadoPor = $modificadoPor;
        $this->sucursal_id = $sucursal_id;
        $this->metodoPago = $metodoPago;
        $this->estado = $estado;
    }

    function todo() {
        $consulta = "select * from lasueca.cobranza";
        return $this->CON->consulta2($consulta);
    }

    function buscarCuentaXCobrar($txt, $cantidad, $contador) {
        $consulta = "  select *";
        $consulta .= " from (";
        $consulta .= "         select v.id_venta,if(v.tipoDocumento='Factura',CONCAT('VF-',v.nroDocumento),CONCAT('NV-',v.nroNota)) nroDocumento,v.tipoDocumento,c.nombre,c.ci,v.descripcion,v.fecha ,sum(d.precioTotal) deuda";
        $consulta .= "         ,ifnull((select sum(monto) from detallecobranza where venta_id=v.id_venta and estado like 'activo'),0) pagado";
        $consulta .= "         from detalleventa d, venta v, cliente c";
        $consulta .= "         where v.estado='activo' and v.empresa_id=" . $this->CON->empresa_id . "  and (c.nombre like '%$txt%' or c.ci like '%$txt%') and v.id_venta=d.venta_id and c.id_cliente=v.cliente_id";
        $consulta .= "         group by v.id_venta,v.tipoDocumento,v.descripcion,v.fecha) detalle";
        $consulta .= " where detalle.deuda-detalle.pagado>0";
        $consulta .= " order by STR_TO_DATE(detalle.fecha,'%e/%c/%Y'), detalle.id_venta desc limit $contador,$cantidad";
        $data = $this->CON->consulta2($consulta);

        $consulta = " select count(id_venta) cantidad";
        $consulta .= " from (select v.id_venta,v.nroDocumento,v.tipoDocumento,c.nombre,c.ci,v.descripcion,v.fecha ,sum(d.precioTotal) deuda";
        $consulta .= "  ,ifnull((select sum(monto) from detallecobranza where venta_id=v.id_venta  and estado like 'activo'),0) pagado";
        $consulta .= "  from detalleventa d, venta v, cliente c";
        $consulta .= "  where v.estado='activo' and v.empresa_id=" . $this->CON->empresa_id . "  and (c.nombre like '%$txt%' or c.ci like '%$txt%') and v.id_venta=d.venta_id and c.id_cliente=v.cliente_id";
        $consulta .= "  group by v.id_venta,v.tipoDocumento,v.descripcion,v.fecha) detalle";
        $consulta .= "  where detalle.deuda-detalle.pagado>0";
        $limiteData = $this->CON->consulta($consulta);
        $limite = $limiteData->fetch_assoc()['cantidad'];
        $resultado = array();
        $resultado["limite"] = $limite;
        $resultado["data"] = $data;
        return $resultado;
    }

    function CuentaXCobrarXcliente($idCliente) {
        $consulta = "  select *";
        $consulta .= " from (";
        $consulta .= "         select v.id_venta,v.nroDocumento,v.tipoDocumento,v.descripcion,v.fecha ,sum(d.precioTotal) deuda";
        $consulta .= "         ,ifnull((select sum(monto) from detallecobranza where venta_id=v.id_venta and estado like 'activo'),0) pagado";
        $consulta .= "         from detalleventa d, venta v";
        $consulta .= "         where v.estado='activo' and v.empresa_id=" . $this->CON->empresa_id . "  and v.id_venta=d.venta_id and v.cliente_id=$idCliente";
        $consulta .= "         group by v.id_venta,v.tipoDocumento,v.descripcion,v.fecha) detalle";
        $consulta .= " where detalle.deuda-detalle.pagado>0";
        $consulta .= " order by STR_TO_DATE(detalle.fecha,'%e/%c/%Y'), detalle.id_venta desc";
        return $this->CON->consulta2($consulta);
    }

    function buscarXid($idcobranza) {
        $consulta = "select * from lasueca.cobranza  where empresa_id=" . $this->CON->empresa_id . "  and id_cobranza=$idcobranza";
        return $this->CON->consulta2($consulta)[0];
    }

    function buscarXidVenta($idventa) {
        $consulta = "select c.* from lasueca.cobranza c,lasueca.detallecobranza d  where empresa_id=" . $this->CON->empresa_id . "  and d.venta_id=$idventa and c.id_cobranza=d.cobranza_id";
        return $this->CON->consulta2($consulta)[0];
    }

    function estadoCuentaCliente($idcliente) {
        $consulta = "select *";
        $consulta .= " from (";
        $consulta .= " select v.id_venta id,if(v.tipoDocumento='Factura',CONCAT('VF-',v.nroDocumento),CONCAT('NV-',v.nroNota)) nroDocumento, v.tipoDocumento,";
        $consulta .= "		v.fecha, v.descripcion detalle,sum(d.precioTotal) monto,v.id_venta,v.usuario_id usuario, v.estado";
        $consulta .= " from lasueca.venta v, lasueca.detalleventa d";
        $consulta .= " where v.id_venta=d.venta_id and v.cliente_id=$idcliente";
        $consulta .= " group by v.id_venta,if(v.tipoDocumento='Factura',v.nroDocumento,v.nroNota) ,";
        $consulta .= "		v.fecha, v.descripcion ,v.id_venta,v.usuario_id , v.tipoDocumento";
        $consulta .= " union ";

        $consulta .= " SELECT c.id_cobranza id,CONCAT('DC-',c.nroDocumento), 'cobranza' tipoDocumento,c.fecha,d.detalle,sum(d.monto),v.id_venta,c.cobradoPor usuario, c.estado";
        $consulta .= " FROM lasueca.cobranza c, lasueca.detallecobranza d, lasueca.venta v";
        $consulta .= " where  c.id_cobranza=d.cobranza_id and d.venta_id=v.id_venta and v.cliente_id=$idcliente";
        $consulta .= " group by  c.id_cobranza, c.nroDocumento, c.fecha,d.detalle,v.id_venta,c.cobradoPor, c.estado";
        $consulta .= " ) c";
        $consulta .= " order by STR_TO_DATE(c.fecha,'%e/%c/%Y %H:%i:%s') asc";
        return $this->CON->consulta2($consulta);
    }

    function detalleCobranzaXVenta($idventa) {
        $consulta = "select c.fecha,d.detalle,c.metodoPago,u.nombre cobrador,d.monto pagado,CONCAT('NV-',c.nroDocumento) nroDocumento,c.id_cobranza";
        $consulta .= "  from cobranza c, detallecobranza d, usuario u";
        $consulta .= "  where c.id_cobranza=d.cobranza_id  and d.estado like 'activo' and u.id_usuario=c.cobradoPor and d.venta_id=$idventa";
        $consulta .= "  order by STR_TO_DATE(c.fecha,'%e/%c/%Y') asc, id_cobranza asc";
        return $this->CON->consulta2($consulta);
    }

    function deudaCliente($idcliente = "") {
        $cliente = "";
        if ($idcliente !== "") {
            $cliente = " and v.cliente_id=$idcliente";
        }
        $fechaactual = date("d/m/Y");
        //venta contado
        $consulta = " select a.cliente_id, a.limiteCredito , sum(a.deuda) deuda, sum(a.pagado) pagado from ( ";
        
        $consulta .= " select v.cliente_id, c.limiteCredito ,sum(d.precioTotal) deuda, 'ventaContado' tipo ,ifnull((select sum(monto) from lasueca.detallecobranza where venta_id=v.id_venta and estado like 'activo'),0) pagado";
        $consulta .= " from lasueca.detalleventa d, lasueca.venta v, lasueca.cliente c ";
        $consulta .= " where v.estado='activo' and v.id_venta=d.venta_id $cliente  and c.id_cliente=v.cliente_id";
        $consulta .= " and v.empresa_id=" . $this->CON->empresa_id;
        $consulta .= " group by v.cliente_id , c.limiteCredito";

        $consulta .= " union";

        
        $cliente = "";
        if ($idcliente !== "") {
            $cliente = " and p.cliente_id=$idcliente";
        }
        $consulta .= "  SELECT p.cliente_id, c.limiteCredito, sum(d.cuotaActual) deuda, 'prestamo' tipo ";
        $consulta .= "  ,ifnull((select sum(monto) from lasueca.detallecobranza where planprestamo_id=d.id_planprestamo and estado like 'activo'),0) pagado";
        $consulta .= "  FROM lasueca.prestamo p, lasueca.planprestamo d, lasueca.cliente c";
        $consulta .= "  where p.empresa_id=" . $this->CON->empresa_id." $cliente and p.id_prestamo=d.prestamo_id and d.estado like 'activo'";
        $consulta .= "  and c.id_cliente=p.cliente_id and STR_TO_DATE(d.vencimientoActual,'%e/%c/%Y')<=STR_TO_DATE('$fechaactual','%e/%c/%Y')";
        $consulta .= "  group by p.cliente_id , c.limiteCredito";
        
        $consulta .= "   ) a  group by a.cliente_id , a.limiteCredito";
        return $this->CON->consulta2($consulta);
    }

    function modificar($id_cobranza) {
        $consulta = "update lasueca.cobranza set sucursal_id=" . $this->sucursal_id . ",metodoPago='" . $this->metodoPago . "' ,detalle ='" . $this->detalle . "', cobradoPor =" . $this->cobradoPor . ", fechaModificacion ='" . $this->fechaModificacion . "', modificadoPor =" . $this->modificadoPor . ", fecha ='" . $this->fecha . "' where empresa_id=" . $this->CON->empresa_id . "  and id_cobranza=" . $id_cobranza;
        return $this->CON->manipular($consulta);
    }

    function eliminar($id_cobranza) {
        $consulta = "update lasueca.cobranza set  estado ='inactivo' where empresa_id=" . $this->CON->empresa_id . "  and id_cobranza=" . $id_cobranza;
        return $this->CON->manipular($consulta);
    }

    function insertar() {
        $consulta = "insert into lasueca.cobranza (id_cobranza,nroDocumento,detalle,fecha,cobradoPor,modificadoPor,fechaModificacion,sucursal_id,metodoPago,empresa_id,estado) values ('$this->id_cobranza','$this->nroDocumento','$this->detalle','$this->fecha','$this->cobradoPor','$this->modificadoPor','" . $this->fechaModificacion . "'," . $this->sucursal_id . ",'" . $this->metodoPago . "'," . $this->CON->empresa_id . " ,'" . $this->estado . "')";
        $resultado = $this->CON->manipular($consulta);
        if (!$resultado) {
            return false;
        }
        $consulta = "SELECT LAST_INSERT_ID() as id";
        $resultado = $this->CON->consulta($consulta);
        $this->id_cobranza = $resultado->fetch_assoc()['id'];
        return true;
    }

    function generarNroComprobante() {
        $consulta = "select ifnull(nroDocumento,0)+1 nro from cobranza where empresa_id=" . $this->CON->empresa_id . "  order by nroDocumento desc limit 0,1";
        $resultado = $this->CON->consulta($consulta);
        if ($resultado == null) {
            return 1;
        }
        return $resultado->fetch_assoc()['nro'];
    }

    function reporteCobranza($tipo, $de, $hasta) {
        if ($tipo === "Diario") {
            $consulta = " select SUBSTRING(c.fecha, 1, 10) fecha,c.sucursal_id,sum(d.monto) monto ";
            $consulta .= " from lasueca.cobranza c, lasueca.detallecobranza d";
            $consulta .= " where d.cobranza_id=c.id_cobranza";
            $consulta .= " and d.estado like 'activo' and c.empresa_id=" . $this->CON->empresa_id;
            $consulta .= " and STR_TO_DATE(c.fecha,'%e/%c/%Y') between STR_TO_DATE('$de','%e/%c/%Y') and STR_TO_DATE('$hasta','%e/%c/%Y')";
            $consulta .= " group by SUBSTRING(c.fecha, 1, 10),c.sucursal_id";
            $consulta .= " order by STR_TO_DATE(c.fecha,'%e/%c/%Y') desc";
        } else {
            $consulta = "  select ano, mes, sucursal_id, sum(monto) monto ";
            $consulta .= " from (";
            $consulta .= " select year(STR_TO_DATE(c.fecha,'%e/%c/%Y')) ano,month(STR_TO_DATE(c.fecha,'%e/%c/%Y')) mes,";
            $consulta .= " 				c.sucursal_id,d.monto monto ";
            $consulta .= " from lasueca.cobranza c, lasueca.detallecobranza d";
            $consulta .= " where  d.estado like 'activo' and  c.empresa_id=" . $this->CON->empresa_id . " and d.cobranza_id=c.id_cobranza ";
            $consulta .= " ) a";
            $consulta .= " group by ano, mes, sucursal_id";
            $consulta .= " order by ano, mes desc";
        }
        return $this->CON->consulta2($consulta);
    }

    function reporteCobranzaXCobrador($de, $hasta, $empleado) {
        $cobrador = "";
        if ($empleado !== "0") {
            $cobrador = " and c.cobradoPor=$empleado ";
        }
        $consulta = " select SUBSTRING(c.fecha, 1, 10) fecha,c.cobradoPor,sum(d.monto) monto ";
        $consulta .= " from lasueca.cobranza c, lasueca.detallecobranza d";
        $consulta .= " where d.cobranza_id=c.id_cobranza $cobrador";
        $consulta .= " and d.estado like 'activo' and c.empresa_id=" . $this->CON->empresa_id;
        $consulta .= " and STR_TO_DATE(c.fecha,'%e/%c/%Y') between STR_TO_DATE('$de','%e/%c/%Y') and STR_TO_DATE('$hasta','%e/%c/%Y')";
        $consulta .= " group by SUBSTRING(c.fecha, 1, 10),c.cobradoPor";
        $consulta .= " order by STR_TO_DATE(c.fecha,'%e/%c/%Y') desc";
        return $this->CON->consulta2($consulta);
    }

    function reporteCobranzaXCliente($de, $hasta, $cliente) {
        $cli = "";
        if ($cliente !== "0") {
            $cli = " and v.cliente_id=$cliente ";
        }
        $consulta = " select SUBSTRING(c.fecha, 1, 10) fecha,v.cliente_id,sum(d.monto) monto ";
        $consulta .= " from lasueca.cobranza c, lasueca.detallecobranza d, lasueca.venta v";
        $consulta .= " where d.cobranza_id=c.id_cobranza $cli and v.id_venta=d.venta_id";
        $consulta .= " and d.estado like 'activo' and v.estado like 'activo' and c.empresa_id=" . $this->CON->empresa_id;
        $consulta .= " and STR_TO_DATE(c.fecha,'%e/%c/%Y') between STR_TO_DATE('$de','%e/%c/%Y') and STR_TO_DATE('$hasta','%e/%c/%Y')";
        $consulta .= " group by SUBSTRING(c.fecha, 1, 10),v.cliente_id";
        $consulta .= " order by STR_TO_DATE(c.fecha,'%e/%c/%Y') desc";
        return $this->CON->consulta2($consulta);
    }

    function reporteCobranzaDetallada($de, $hasta) {
        $consulta = " select c.fecha,c.sucursal_id,s.nombre sucursal,v.id_venta,c.id_cobranza";
        $consulta .= " 		,c.cobradoPor,sum(d.monto) monto, v.cliente_id";
        $consulta .= " 	, if(v.tipoDocumento='Factura',CONCAT('VF-',v.nroDocumento),CONCAT('NV-',v.nroNota)) nroFactura";
        $consulta .= " 	,CONCAT('NV-',c.nroDocumento) nroDocumento";
        $consulta .= " from lasueca.cobranza c, lasueca.detallecobranza d, lasueca.sucursal s, lasueca.venta v";
        $consulta .= " where  c.empresa_id=" . $this->CON->empresa_id . "  and d.estado like 'activo' and v.estado like 'activo' and d.cobranza_id=c.id_cobranza and s.id_sucursal=c.sucursal_id and v.id_venta=d.venta_id";
        $consulta .= " and STR_TO_DATE(c.fecha,'%e/%c/%Y') between STR_TO_DATE('$de','%e/%c/%Y') and STR_TO_DATE('$hasta','%e/%c/%Y')";
        $consulta .= " group by c.fecha,v.id_venta,c.id_cobranza,c.sucursal_id,s.nombre ,c.nroDocumento ,c.cobradoPor,v.nroDocumento , v.cliente_id ";

        return $this->CON->consulta2($consulta);
    }

    function busquedaAccionXidCobranza($idCobranza, $tipo, $idsucursal) {
        $accion = "";
        $order = "";


        if (($tipo == "siguiente" || $tipo == "anterior") && $idCobranza == 0) {
            $tipo = "ultimo";
        }
        if ($tipo == "actual") {
            $accion = " where  id_cobranza=$idCobranza and sucursal_id=$idsucursal";
        }
        if ($tipo == "anterior") {
            $accion = " where  sucursal_id=$idsucursal and  STR_TO_DATE(fecha ,'%e/%c/%Y %H:%i:%s') < (select STR_TO_DATE(fecha,'%e/%c/%Y %H:%i:%s') from lasueca.cobranza where id_cobranza=$idCobranza)  ";
            $order = " order by STR_TO_DATE(fecha,'%e/%c/%Y %H:%i:%s') desc, id_cobranza desc ";
        }
        if ($tipo == "siguiente") {
            $accion = " where  sucursal_id=$idsucursal and STR_TO_DATE(fecha ,'%e/%c/%Y %H:%i:%s') > (select STR_TO_DATE(fecha,'%e/%c/%Y %H:%i:%s') from lasueca.cobranza where id_cobranza=$idCobranza)  ";
            $order = " order by STR_TO_DATE(fecha,'%e/%c/%Y %H:%i:%s') asc,id_cobranza asc  ";
        }
        if ($tipo == "primero") {
            $order = " order by STR_TO_DATE(fecha,'%e/%c/%Y %H:%i:%s') asc, id_cobranza asc  ";
        }
        if ($tipo == "ultimo") {
            $order = " order by STR_TO_DATE(fecha,'%e/%c/%Y %H:%i:%s') desc, id_cobranza desc  ";
        }
        if ($accion === "") {
            $accion = " where sucursal_id=$idsucursal and v.empresa_id=" . $this->CON->empresa_id . "";
        } else {
            $accion .= " and v.empresa_id=" . $this->CON->empresa_id . "";
        }
        $consulta = "select * from lasueca.cobranza v $accion $order limit 0,1";
        $venta = $this->CON->consulta2($consulta);
        if (count($venta) > 0) {
            return $venta[0];
        }
        $consulta = "select id_cobranza,nroDocumento,detalle,substring(v.fecha,1,10) fecha,cobradoPor,fechaModificacion,modificadoPor,sucursal_id,metodoPago,estado from lasueca.cobranza v where id_cobranza=$idCobranza and v.empresa_id=" . $this->CON->empresa_id . " limit 0,1";
        return $this->CON->consulta2($consulta)[0];
    }

}

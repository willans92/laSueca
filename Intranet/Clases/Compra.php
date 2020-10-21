<?php

class Compra {

    var $id_compra;
    var $fecha;
    var $Detalle;
    var $NroDocumento;
    var $Autorizacion;
    var $tipo;
    var $FechaActualizacion;
    var $tipoPago;
    var $usuarioActualizo_id;
    var $usuarioEncargado_id;
    var $almacen_id;
    var $provedor_id;
    var $tipoCambio;
    var $codigoControl;
    var $empresa_id;
    var $estado;
    var $CON;

    function __construct($con) {
        $this->CON = $con;
    }

    function contructor($id_compra, $fecha, $Detalle, $NroDocumento, $Autorizacion, $tipo, $FechaActualizacion, $tipoPago, $usuarioActualizo_id, $usuarioEncargado_id, $almacen_id, $provedor_id, $tipoCambio, $codigoControl, $estado) {
        $this->id_compra = $id_compra;
        $this->fecha = $fecha;
        $this->Detalle = $Detalle;
        $this->NroDocumento = $NroDocumento;
        $this->Autorizacion = $Autorizacion;
        $this->tipo = $tipo;
        $this->FechaActualizacion = $FechaActualizacion;
        $this->tipoPago = $tipoPago;
        $this->usuarioActualizo_id = $usuarioActualizo_id;
        $this->almacen_id = $almacen_id;
        $this->provedor_id = $provedor_id;
        $this->tipoCambio = $tipoCambio;
        $this->usuarioEncargado_id = $usuarioEncargado_id;
        $this->codigoControl = $codigoControl;
        $this->estado = $estado;
    }

    function modificar() {
        $consulta = "UPDATE lasueca.compra SET usuarioEncargado_id=$this->usuarioEncargado_id, codigoControl='$this->codigoControl', Detalle = '$this->Detalle', NroDocumento = '$this->NroDocumento',Autorizacion = '$this->Autorizacion',tipo = '$this->tipo',fecha = '$this->fecha',FechaActualizacion = '$this->FechaActualizacion',tipoPago = '$this->tipoPago',usuarioActualizo_id = $this->usuarioActualizo_id , almacen_id = $this->almacen_id, provedor_id = $this->provedor_id ,tipoCambio = $this->tipoCambio WHERE id_compra = $this->id_compra and empresa_id=" . $this->CON->empresa_id . "";
        return $this->CON->manipular($consulta);
    }

    function busquedaAccionXidCompra($idcompra, $tipo, $sucursal_id) {
        $suc = "";
        if ($sucursal_id !== "") {
            $suc = " and a.sucursal_id='$sucursal_id' ";
        }

        $accion = "";
        $order = "";
        if (($tipo == "siguiente" || $tipo == "anterior") && $idcompra == 0) {
            $tipo = "ultimo";
        }
        if ($tipo == "actual") {
            $accion = " id_compra=$idcompra and ";
        }
        if ($tipo == "anterior") {
            $accion = " STR_TO_DATE(fecha ,'%e/%c/%Y %H:%i:%s') < (select STR_TO_DATE(fecha,'%e/%c/%Y %H:%i:%s') from lasueca.compra where id_compra=$idcompra) and ";
            $order = " order by STR_TO_DATE(fecha,'%e/%c/%Y %H:%i:%s') desc ";
        }
        if ($tipo == "siguiente") {
            $accion = " STR_TO_DATE(fecha ,'%e/%c/%Y %H:%i:%s') > (select STR_TO_DATE(fecha,'%e/%c/%Y %H:%i:%s') from lasueca.compra where id_compra=$idcompra) and ";
            $order = " order by STR_TO_DATE(fecha,'%e/%c/%Y %H:%i:%s') asc ";
        }
        if ($tipo == "primero") {
            $order = " order by STR_TO_DATE(fecha,'%e/%c/%Y %H:%i:%s') asc  ";
        }
        if ($tipo == "ultimo") {
            $order = " order by STR_TO_DATE(fecha,'%e/%c/%Y %H:%i:%s') desc  ";
        }
        $consulta = "SELECT c.*,p.nombre nombreProvedor FROM lasueca.compra c, lasueca.provedor p, lasueca.almacen a where $accion p.id_provedor=c.provedor_id and c.empresa_id=" . $this->CON->empresa_id . " and a.id_almacen=c.almacen_id $suc $order limit 0,1";
        $compra = $this->CON->consulta2($consulta);
        if (count($compra) > 0) {
            return $compra[0];
        }
        $consulta = "SELECT c.*,p.nombre nombreProvedor FROM lasueca.compra c, lasueca.provedor p, lasueca.almacen a where id_compra=$idcompra and c.empresa_id=" . $this->CON->empresa_id . " and  p.id_provedor=c.provedor_id  and a.id_almacen=c.almacen_id $suc limit 0,1";
        return $this->CON->consulta2($consulta)[0];
    }

  

    function buscarXid($compraID) {
        $consulta = "select * from lasueca.compra where id_compra=$compraID and empresa_id=" . $this->CON->empresa_id . "";
        return $this->CON->consulta2($consulta)[0];
    }

    function eliminar($id_compra) {
        $consulta = "update lasueca.compra set estado='inactivo' where id_compra=" . $id_compra;
        return $this->CON->manipular($consulta);
    }

    function insertar() {
        $consulta = "INSERT INTO lasueca.compra(id_compra,Detalle,NroDocumento,Autorizacion,tipo,fecha,FechaActualizacion,tipoPago,usuarioActualizo_id,usuarioEncargado_id,almacen_id,provedor_id,tipoCambio,codigoControl,empresa_id,estado) VALUES('$this->id_compra','$this->Detalle','$this->NroDocumento','$this->Autorizacion','$this->tipo','$this->fecha','$this->FechaActualizacion','$this->tipoPago','$this->usuarioActualizo_id','$this->usuarioEncargado_id','$this->almacen_id','$this->provedor_id','$this->tipoCambio','$this->codigoControl'," . $this->CON->empresa_id . ",'" . $this->estado . "');";
        if (!$this->CON->manipular($consulta)) {
            return '0';
        }
        $consulta = "SELECT LAST_INSERT_ID() as id";
        $id = $this->CON->consulta2($consulta)[0]['id'];
        return $id;
    }

    function existeNroAutorizacionYFactura($autorizacion, $factura) {
        $consulta = "select id_compra from lasueca.compra where estado='activo' and Autorizacion='$autorizacion' and NroDocumento='$factura' and empresa_id=" . $this->CON->empresa_id;
        $cant = $this->CON->consulta2($consulta);
        if (count($cant) > 0) {
            return true;
        }
        return false;
    }

    function generarLibroCompra($de, $hasta, $sucursal) {
        $suc = "";
        if ($sucursal !== "0") {
            $suc = "  and a.sucursal_id=$sucursal ";
        }
        $consulta .= " select c.id_compra,SUBSTRING(c.fecha , 1, 10) as  fecha, NroDocumento factura,0 as noSujetoCredito,";
        $consulta .= "  p.nit, p.razonsocial, c.Autorizacion, ifnull(c.descuento,0) descuento, sum(d.precio) monto,ifnull(c.codigoControl,'') codigocontrol";
        $consulta .= " from lasueca.compra c, lasueca.detallecompra d, lasueca.provedor p,lasueca.almacen a";
        $consulta .= " where c.id_compra=d.compra_id and c.provedor_id=p.id_provedor $suc and tipo like 'Compra Facturada'  and c.estado like 'activo'";
        $consulta .= " 	 and c.empresa_id=" . $this->CON->empresa_id . " and a.id_almacen=c.almacen_id and STR_TO_DATE(c.fecha ,'%e/%c/%Y') between STR_TO_DATE('$de' ,'%e/%c/%Y') and STR_TO_DATE('$hasta' ,'%e/%c/%Y')";
        $consulta .= " group by c.id_compra,SUBSTRING(c.fecha , 1, 10), NroDocumento,p.nit, p.razonsocial, c.Autorizacion, ifnull(c.descuento,0), ifnull(c.codigoControl,'')";
        $consulta .= " order by STR_TO_DATE(c.fecha ,'%e/%c/%Y') asc";
        return $this->CON->consulta2($consulta);
    }

}

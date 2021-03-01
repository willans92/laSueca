<?php

class venta {

    var $id_venta;
    var $descripcion;
    var $tipoVenta;
    var $fecha;
    var $usuario_id;
    var $fechaModificacion;
    var $nit;
    var $razonsocial;
    var $Autorizacion;
    var $codigoControl;
    var $estado;
    var $cliente_id;
    var $sucursal_id;
    var $tipoPago;
    var $nroDocumento;
    var $fechaLimiteEmision;
    var $mensajeImpuesto;
    var $estadoEntrega;
    var $fechaEntrega;
    var $direccionEntrega;
    var $actividadEconomica;
    var $comentario;
    var $tipoDocumento;
    var $nroNota;
    var $usuarioActualizo_id;
    var $CON;

    function __construct($con) {
        $this->CON = $con;
    }

    function contructor($id_venta, $descripcion, $tipoVenta, $fecha, $usuario_id, $fechaModificacion, $nit, $razonsocial, $Autorizacion, $codigoControl
            , $estado, $cliente_id, $sucursal_id, $tipoPago, $nroDocumento,$fechaLimiteEmision,$mensajeImpuesto,$actividadEconomica,$estadoEntrega,$fechaEntrega 
            ,$direccionEntrega,$comentario,$tipoDocumento,$nroNota,$usuarioActualizo_id) {
        $this->id_venta = $id_venta;
        $this->usuarioActualizo_id= $usuarioActualizo_id;
        $this->descripcion = $descripcion;
        $this->tipoVenta = $tipoVenta;
        $this->tipoDocumento = $tipoDocumento;
        $this->fecha = $fecha;
        $this->usuario_id = $usuario_id;
        $this->fechaModificacion = $fechaModificacion;
        $this->nit = $nit;
        $this->razonsocial = $razonsocial;
        $this->Autorizacion = $Autorizacion;
        $this->codigoControl = $codigoControl;
        $this->estado = $estado;
        $this->cliente_id = $cliente_id;
        $this->sucursal_id = $sucursal_id;
        $this->tipoPago = $tipoPago;
        $this->nroDocumento = $nroDocumento;
        $this->fechaLimiteEmision = $fechaLimiteEmision;
        $this->mensajeImpuesto = $mensajeImpuesto;
        $this->actividadEconomica= $actividadEconomica;
        $this->estadoEntrega= $estadoEntrega;
        $this->fechaEntrega= $fechaEntrega;
        $this->comentario= $comentario;
        $this->direccionEntrega= $direccionEntrega;
        $this->nroNota= $nroNota;
    }

    function todo() {
        $consulta = "select * from lasueca.venta where empresa_id=".$this->CON->empresa_id."";
        return $this->CON->consulta2($consulta);
    }

    function buscarXid($idventa) {
        $consulta = "select * from lasueca.venta v where id_venta=$idventa and v.empresa_id=".$this->CON->empresa_id."";
        return $this->CON->consulta2($consulta)[0];
    }
    function ventaXCliente($idcliente) {
        $consulta = "select v.id_venta,v.fecha,if(v.tipoDocumento='Factura',CONCAT('VF-',v.nroDocumento),CONCAT('NV-',v.nroNota)) nroDocumento, sum(d.precioTotal) facturado, u.nombre vendedor, v.estado";
	$consulta .= "	,ifnull((select sum(monto) from lasueca.detallecobranza where venta_id=v.id_venta and estado like 'activo'),0) cobrado";
        $consulta .= "	from lasueca.venta v, lasueca.detalleventa d, lasueca.usuario u";
        $consulta .= "	where v.id_venta=d.venta_id and v.cliente_id=$idcliente and u.id_usuario=v.usuario_id";
        $consulta .= "	group by v.fecha,v.nroDocumento,v.tipoDocumento, u.nombre,v.id_venta,v.nroNota, v.estado";
        $consulta .= "	order by STR_TO_DATE(v.fecha,'%e/%c/%Y') asc, id_venta asc";
        return $this->CON->consulta2($consulta);
    }

    function reporteVenta($tipo, $de, $hasta,$sucursal) {
        $view="year(STR_TO_DATE(v.fecha,'%e/%c/%Y')) ano,month(STR_TO_DATE(v.fecha,'%e/%c/%Y')) mes,";
        $group="year(STR_TO_DATE(v.fecha,'%e/%c/%Y')), month(STR_TO_DATE(v.fecha,'%e/%c/%Y'))";
        $order=" year(STR_TO_DATE(v.fecha,'%e/%c/%Y')), month(STR_TO_DATE(v.fecha,'%e/%c/%Y'))";
        $fecha="";
        if ($tipo === "Diarias") {
            $view="substring(v.fecha,1,10) fecha ,";
            $group="substring(v.fecha,1,10)";
            $order="STR_TO_DATE(v.fecha,'%e/%c/%Y %H:%i:%s') desc";
            $fecha="and STR_TO_DATE(v.fecha,'%e/%c/%Y') between STR_TO_DATE('$de','%e/%c/%Y') and STR_TO_DATE('$hasta','%e/%c/%Y')";
        }
        $consulta = "select $view v.tipoDocumento,v.sucursal_id,sum(d.precioTotal) contado ,sum(d.descuento) descuento, sum(ifnull(c.precio,0)*d.cantidad) compra";
        $consulta .= "  from lasueca.venta v, lasueca.detalleventa d left join (select id_detalleCompra,precio,cantidad from lasueca.detallecompra where estado like 'activo') c on  d.detallecompra_id = c.id_detalleCompra";
        $consulta .= " where v.id_venta=d.venta_id $fecha and v.empresa_id=".$this->CON->empresa_id."";
        $consulta .= " and v.sucursal_id=$sucursal and  v.estado like 'activo'";
        $consulta .= " group by $group ,v.sucursal_id,v.tipoDocumento";
        $consulta .= " order by $order";
        return $this->CON->consulta2($consulta);
    }

    function reporteVentaXvendedor($de, $hasta, $sucursal) {
        $suc = "";
        if ($sucursal !== "0") {
            $suc = "  and v.sucursal_id=$sucursal ";
        }
        $consulta = " select v.usuario_id,v.tipoDocumento,u.ci ci,u.nombre vendedor,sum(d.precioTotal) venta,sum(ifnull(c.precio,0)*d.cantidad) compra  ";
        $consulta .= "  ,sum(d.descuento) descuento  ";
        $consulta .= "  from lasueca.venta v, lasueca.usuario u,lasueca.detalleventa d left join (select id_detalleCompra,precio,cantidad from lasueca.detallecompra where estado like 'activo') c on  d.detallecompra_id = c.id_detalleCompra";
        $consulta .= "   where v.id_venta=d.venta_id ";
        $consulta .= "   and v.usuario_id=u.id_usuario  and v.estado like 'activo' and d.estado like 'activo'";
        $consulta .= "   and STR_TO_DATE(v.fecha,'%e/%c/%Y') between STR_TO_DATE('$de','%e/%c/%Y') and STR_TO_DATE('$hasta','%e/%c/%Y')  ";
        $consulta .= "   and v.empresa_id=".$this->CON->empresa_id." $suc ";
        $consulta .= "   group by v.usuario_id,u.ci,v.tipoDocumento,u.nombre";
        return $this->CON->consulta2($consulta);
    }
    function reporteVentaXCliente($de, $hasta, $sucursal) {
        $suc = "";
        if ($sucursal !== "0") {
            $suc = "  and v.sucursal_id=$sucursal ";
        }
        $consulta = " select v.cliente_id,v.tipoDocumento,u.ci ci,u.nombre vendedor,sum(d.precioTotal) venta,sum(ifnull(c.precio,0)*d.cantidad) compra  ";
        $consulta .= "  ,sum(d.descuento) descuento  ";
        $consulta .= "  from lasueca.venta v, lasueca.cliente u, lasueca.detalleventa d  left join (select id_detalleCompra,precio,cantidad from lasueca.detallecompra where estado like 'activo') c on  d.detallecompra_id = c.id_detalleCompra";
        $consulta .= "   where v.id_venta=d.venta_id ";
        $consulta .= "   and v.cliente_id=u.id_cliente  and d.estado like 'activo' and v.estado like 'activo'";
        $consulta .= "   and STR_TO_DATE(v.fecha,'%e/%c/%Y') between STR_TO_DATE('$de','%e/%c/%Y') and STR_TO_DATE('$hasta','%e/%c/%Y')  ";
        $consulta .= "   and v.empresa_id=".$this->CON->empresa_id." $suc ";
        $consulta .= "   group by v.cliente_id,u.ci,v.tipoDocumento,u.nombre";
        return $this->CON->consulta2($consulta);
    }

    function reporteVentaXProducto($de, $hasta, $sucursal) {
        $suc = "";
        if ($sucursal !== "0") {
            $suc = "  and v.sucursal_id=$sucursal ";
        }
        $consulta = " select d.producto_id,v.tipoDocumento, sum(d.cantidad) cantidad ,sum(d.precioTotal) venta,sum(ifnull(c.precio,0)*d.cantidad) compra  ";
        $consulta .= "   ,sum(d.descuento) descuento  ";
        $consulta .= "   from lasueca.venta v, lasueca.producto p,lasueca.detalleventa d left join (select id_detalleCompra,precio,cantidad from lasueca.detallecompra where estado like 'activo') c on  d.detallecompra_id = c.id_detalleCompra ";
        $consulta .= "    where v.id_venta=d.venta_id and d.producto_id=p.id_producto ";
        $consulta .= "    and STR_TO_DATE(v.fecha,'%e/%c/%Y') between STR_TO_DATE('$de','%e/%c/%Y') and STR_TO_DATE('$hasta','%e/%c/%Y')  ";
        $consulta .= "    and v.empresa_id=".$this->CON->empresa_id."   and d.estado like 'activo' and v.estado like 'activo'  $suc ";
        $consulta .= "    group by d.producto_id,v.tipoDocumento";
        return $this->CON->consulta2($consulta);
    }
    function reporteVentaXLineaProducto($de, $hasta, $sucursal) {
        $suc = "";
        if ($sucursal !== "0") {
            $suc = "  and v.sucursal_id=$sucursal ";
        }
        $consulta = " select p.linea_producto_id,v.tipoDocumento, sum(d.cantidad) cantidad, sum(d.cantidad) cantidad ,sum(d.precioTotal) venta,sum(ifnull(c.precio,0)*d.cantidad) compra  ";
        $consulta .= "   ,sum(d.descuento) descuento  ";
        $consulta .= "   from lasueca.venta v, lasueca.producto p , lasueca.detalleventa d left join (select id_detalleCompra,precio,cantidad from lasueca.detallecompra where estado like 'activo') c on  d.detallecompra_id = c.id_detalleCompra";
        $consulta .= "    where v.id_venta=d.venta_id and d.producto_id=p.id_producto ";
        $consulta .= "    and STR_TO_DATE(v.fecha,'%e/%c/%Y') between STR_TO_DATE('$de','%e/%c/%Y') and STR_TO_DATE('$hasta','%e/%c/%Y')  ";
        $consulta .= "    and v.empresa_id=".$this->CON->empresa_id." $suc and d.estado like 'activo' and v.estado like 'activo'";
        $consulta .= "    group by p.linea_producto_id,v.tipoDocumento";
        return $this->CON->consulta2($consulta);
    }
    function reporteVentaXMarcaProducto($de, $hasta, $sucursal) {
        $suc = "";
        if ($sucursal !== "0") {
            $suc = "  and v.sucursal_id=$sucursal ";
        }
        $consulta = " select p.marca_id,v.tipoDocumento, sum(d.cantidad) cantidad, sum(d.cantidad) cantidad ,sum(d.precioTotal) venta,sum(ifnull(c.precio,0)*d.cantidad) compra  ";
        $consulta .= "   ,sum(d.descuento) descuento  ";
        $consulta .= "   from lasueca.venta v, lasueca.producto p  , lasueca.detalleventa d left join (select id_detalleCompra,precio,cantidad from lasueca.detallecompra where estado like 'activo') c on  d.detallecompra_id = c.id_detalleCompra";
        $consulta .= "    where v.id_venta=d.venta_id  and d.producto_id=p.id_producto ";
        $consulta .= "    and STR_TO_DATE(v.fecha,'%e/%c/%Y') between STR_TO_DATE('$de','%e/%c/%Y') and STR_TO_DATE('$hasta','%e/%c/%Y')  ";
        $consulta .= "    and v.empresa_id=".$this->CON->empresa_id." $suc and d.estado like 'activo' and v.estado like 'activo'";
        $consulta .= "    group by p.marca_id,v.tipoDocumento";
        return $this->CON->consulta2($consulta);
    }

    function reporteVentaDetallada($de, $hasta) {
        $consulta = " select v.sucursal_id,v.estado,v.fecha,if(v.tipoDocumento='Factura',CONCAT('VF-',v.nroDocumento),CONCAT('NV-',v.nroNota)) nroDocumento,v.nit,v.razonsocial";
        $consulta .= "  ,v.usuario_id,u.nombre vendedor,sum(d.precioTotal) venta,sum(ifnull(c.precio,0)*d.cantidad) compra";
        $consulta .= "  ,sum(d.descuento) descuento,v.id_venta";
        $consulta .= "  from lasueca.venta v,lasueca.usuario u , lasueca.detalleventa d left join (select id_detalleCompra,precio,cantidad from lasueca.detallecompra where estado like 'activo') c on  d.detallecompra_id = c.id_detalleCompra";
        $consulta .= "  where v.id_venta=d.venta_id ";//and d.estado like 'activo'  and v.estado like 'activo'
        $consulta .= "  and v.empresa_id=".$this->CON->empresa_id." and v.usuario_id=u.id_usuario and STR_TO_DATE(v.fecha,'%e/%c/%Y') between STR_TO_DATE('$de','%e/%c/%Y') and STR_TO_DATE('$hasta','%e/%c/%Y')";
        $consulta .= "  group by v.sucursal_id,v.estado,v.fecha,v.sucursal_id ,v.nroDocumento ,v.nit,v.razonsocial,v.id_venta ,if(v.tipoDocumento='Factura',CONCAT('VF-',v.nroDocumento),CONCAT('NV-',v.nroNota))";
        $consulta .= "  ,v.usuario_id,u.nombre ";

        return $this->CON->consulta2($consulta);
    }

    function generarNroFactura($idsucursal, $autorizacion, $fecha) {
        $consulta = "SELECT IF(";
        $consulta .= " (";
        $consulta .= "	select nrodocumento ";
        $consulta .= "	from lasueca.venta ";
        $consulta .= "	where tipoDocumento='Factura' ";
        $consulta .= "	and Autorizacion='$autorizacion' and sucursal_id=$idsucursal ";
        $consulta .= "	and empresa_id=".$this->CON->empresa_id." ";
        $consulta .= "	and STR_TO_DATE(fecha,'%e/%c/%Y') > STR_TO_DATE('$fecha','%e/%c/%Y') ";
        $consulta .= "	order by STR_TO_DATE(fecha,'%e/%c/%Y') desc limit 0,1";

        $consulta .= " )>0";
        $consulta .= " , 0";
        $consulta .= " , ( ifnull((   select nroDocumento+1  ";
        $consulta .= "	from lasueca.venta ";
        $consulta .= " where tipoDocumento='Factura' and Autorizacion='$autorizacion' ";
        $consulta .= " and sucursal_id=$idsucursal ";
        $consulta .= " and empresa_id=".$this->CON->empresa_id." ";
        $consulta .= " order by nroDocumento desc limit 0,1";
        $consulta .= "  ),1)  )";
        $consulta .= " ) nro";
        $venta = $this->CON->consulta2($consulta);
        return $venta[0]["nro"];
    }

    function generarNroDocumento($idsucursal) {
        $consulta .= " select ifnull((";
        $consulta .= "  select nroNota+1 	";
        $consulta .= "  from lasueca.venta  ";
        $consulta .= "  where sucursal_id=$idsucursal and empresa_id=".$this->CON->empresa_id."";
        $consulta .= "  order by nroNota desc limit 0,1";
        $consulta .= "  ),1) nro";
        $venta = $this->CON->consulta2($consulta);
        return $venta[0]["nro"];
    }
    function generarLibroVenta($de,$hasta,$sucursal) {
        $suc = "";
        if ($sucursal !== "0") {
            $suc = "  and v.sucursal_id=$sucursal ";
        }
        $consulta .= " SELECT v.id_venta ,v.fecha,v.nroDocumento factura,v.Autorizacion,if(v.estado='activo','V','A') estado";
	$consulta .= " 	  ,v.nit,v.razonsocial,v.codigoControl,sum(d.precioTotal) monto,sum(d.descuento) descuento";
	$consulta .= " FROM lasueca.venta v, lasueca.detalleventa d";
	$consulta .= " where v.id_venta=d.venta_id $suc and tipoDocumento like 'Factura'";
	$consulta .= " and STR_TO_DATE(v.fecha ,'%e/%c/%Y') between STR_TO_DATE('$de' ,'%e/%c/%Y') and STR_TO_DATE('$hasta' ,'%e/%c/%Y')";
	$consulta .= " and empresa_id=".$this->CON->empresa_id;
	$consulta .= " group by v.id_venta,v.fecha,v.nroDocumento,v.Autorizacion,if(v.estado='activo','V','A'),v.nit,v.razonsocial,v.codigoControl";
	$consulta .= " order by v.nroDocumento asc";
        return $this->CON->consulta2($consulta);
    }
    

    function modificar($id_venta) {
        $consulta = "update lasueca.venta set usuarioActualizo_id=$this->usuarioActualizo_id, nrodocumento=$this->nroDocumento,comentario='$this->comentario',direccionEntrega='$this->direccionEntrega',fechaEntrega='$this->fechaEntrega',estadoEntrega='$this->estadoEntrega',actividadEconomica='$this->actividadEconomica',mensajeImpuesto='$this->mensajeImpuesto',fechaLimiteEmision='$this->fechaLimiteEmision', descripcion ='" . $this->descripcion . "',tipoDocumento='$this->tipoDocumento', tipoVenta ='" . $this->tipoVenta . "', usuario_id =" . $this->usuario_id . ", fechaModificacion ='" . $this->fechaModificacion . "', nit ='" . $this->nit . "', razonsocial ='" . $this->razonsocial . "', Autorizacion ='" . $this->Autorizacion . "', codigoControl ='" . $this->codigoControl . "', estado ='" . $this->estado . "', cliente_id =" . $this->cliente_id . ", sucursal_id =" . $this->sucursal_id . ", tipoPago ='" . $this->tipoPago . "' where empresa_id=".$this->CON->empresa_id." and id_venta=" . $id_venta;
        return $this->CON->manipular($consulta);
    }
    function anularFactura($id_venta,$fecha) {
        $consulta = "update lasueca.venta set fechaModificacion ='$fecha' , estado='inactivo' where empresa_id=".$this->CON->empresa_id." and id_venta=" . $id_venta;
        return $this->CON->manipular($consulta);
    }

    function eliminar($id_venta) {
        $consulta = "delete from lasueca.venta where empresa_id=".$this->CON->empresa_id." and id_venta=" . $id_venta;
        return $this->CON->manipular($consulta);
    }

    function insertar() {
        $consulta = "insert into lasueca.venta(id_venta, descripcion, tipoVenta, fecha, usuario_id, fechaModificacion, nit, razonsocial, Autorizacion, codigoControl, estado, cliente_id, sucursal_id, tipoPago,nroDocumento,fechaLimiteEmision,mensajeImpuesto,actividadEconomica,estadoEntrega,fechaEntrega ,direccionEntrega,comentario,tipoDocumento,nroNota,empresa_id,usuarioActualizo_id) values(" . $this->id_venta . ",'" . $this->descripcion . "','" . $this->tipoVenta . "','" . $this->fecha . "'," . $this->usuario_id . ",'" . $this->fechaModificacion . "','" . $this->nit . "','" . $this->razonsocial . "','" . $this->Autorizacion . "','" . $this->codigoControl . "','" . $this->estado . "'," . $this->cliente_id . "," . $this->sucursal_id . ",'" . $this->tipoPago . "','" . $this->nroDocumento . "','" . $this->fechaLimiteEmision . "','" . $this->mensajeImpuesto . "','" . $this->actividadEconomica . "','" . $this->estadoEntrega . "','" . $this->fechaEntrega . "','" . $this->direccionEntrega . "','" . $this->comentario . "','$this->tipoDocumento',$this->nroNota,".$this->CON->empresa_id.",$this->usuarioActualizo_id)";
        $resultado = $this->CON->manipular($consulta);
        if (!$resultado) {
            return false;
        }
        $consulta = "SELECT LAST_INSERT_ID() as id";
        $resultado = $this->CON->consulta($consulta);
        $this->id_venta = $resultado->fetch_assoc()['id'];
        return true;
    }

    function busquedaAccionXidVenta($idVenta,$tipo,$idsucursal) {
        $accion="";
        $order="";
        
        
        if(($tipo=="siguiente" || $tipo=="anterior") && $idVenta == 0 ){
            $tipo="ultimo";
        }
        if($tipo=="actual"){
            $accion=" where  id_venta=$idVenta and sucursal_id=$idsucursal";
        }
        if($tipo=="anterior"){
            $accion=" where  sucursal_id=$idsucursal and  STR_TO_DATE(fecha ,'%e/%c/%Y %H:%i:%s') < (select STR_TO_DATE(fecha,'%e/%c/%Y %H:%i:%s') from lasueca.venta where id_venta=$idVenta)  ";
            $order=" order by STR_TO_DATE(fecha,'%e/%c/%Y %H:%i:%s') desc ";
        }
        if($tipo=="siguiente"){
            $accion=" where  sucursal_id=$idsucursal and STR_TO_DATE(fecha ,'%e/%c/%Y %H:%i:%s') > (select STR_TO_DATE(fecha,'%e/%c/%Y %H:%i:%s') from lasueca.venta where id_venta=$idVenta)  ";
            $order=" order by STR_TO_DATE(fecha,'%e/%c/%Y %H:%i:%s') asc ";
        }
        if($tipo=="primero"){
            $order=" order by STR_TO_DATE(fecha,'%e/%c/%Y %H:%i:%s') asc  ";
        }
        if($tipo=="ultimo"){
            $order=" order by STR_TO_DATE(fecha,'%e/%c/%Y %H:%i:%s') desc  ";
        }
        if($accion===""){
            $accion=" where sucursal_id=$idsucursal and v.empresa_id=".$this->CON->empresa_id."";
        }else{
            $accion.=" and v.empresa_id=".$this->CON->empresa_id."";
        }
        $consulta = "select * from lasueca.venta v $accion $order limit 0,1";
        $venta=$this->CON->consulta2($consulta);
        if(count($venta)>0){
            return $venta[0];
        }
        $consulta = "select * from lasueca.venta v where id_venta=$idVenta and v.empresa_id=".$this->CON->empresa_id." limit 0,1";
        return $this->CON->consulta2($consulta)[0];
    }
}

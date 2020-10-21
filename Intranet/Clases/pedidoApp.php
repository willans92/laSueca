<?php

class pedidoApp {

    var $id_pedidoApp;
    var $solicitada;
    var $entregada;
    var $nit;
    var $rz;
    var $montoBillete;
    var $estado;
    var $motivo;
    var $costoDelivery;
    var $totalPedido;
    var $direccionApp_id;
    var $sucursal_id;
    var $cliente;
    var $venta_id;
    var $recepcionado;
    var $llamarMoto;
    var $enCamino;
    var $aceptarPedido;
    var $descuento;
    var $usuario_id;
    var $CON;

    function __construct($con) {
        $this->CON = $con;
    }

    function contructor($id_pedidoApp, $solicitada, $entregada, $nit, $rz, $montoBillete, $estado, $motivo, $costoDelivery, $totalPedido, $direccionApp_id, $sucursal_id, $cliente) {
        $this->id_pedidoApp = $id_pedidoApp;
        $this->solicitada = $solicitada;
        $this->entregada = $entregada;
        $this->nit = $nit;
        $this->rz = $rz;
        $this->montoBillete = $montoBillete;
        $this->estado = $estado;
        $this->motivo = $motivo;
        $this->costoDelivery = $costoDelivery;
        $this->totalPedido = $totalPedido;
        $this->direccionApp_id = $direccionApp_id;
        $this->sucursal_id = $sucursal_id;
        $this->cliente = $cliente;
    }

    function insertar() {
        $consulta = "INSERT INTO lasueca.pedidoapp (id_pedidoApp,solicitada,entregada,nit,rz,montoBillete,estado,motivo,costoDelivery,totalPedido,direccionApp_id,sucursal_id,cliente,descuento,usuario_id) VALUES ('$this->id_pedidoApp','$this->solicitada','$this->entregada','$this->nit','$this->rz','$this->montoBillete','$this->estado','$this->motivo','$this->costoDelivery','$this->totalPedido','$this->direccionApp_id','$this->sucursal_id','$this->cliente',0,0);";
        if (!$this->CON->manipular($consulta)) {
            return false;
        }
        $consulta = "SELECT LAST_INSERT_ID() as id";
        $id = $this->CON->consulta2($consulta)[0]['id'];
        $this->id_pedidoApp = $id;
        return true;
    }

    function historicoPedidoXcliente($idcliente, $contador, $cantidad) {
        $consulta = "SELECT p.solicitada,p.estado,p.costoDelivery,p.totalPedido , e.nombreEmpresa, e.appLogo FROM lasueca.pedidoapp p, lasueca.sucursal s, lasueca.empresa e where cliente=$idcliente and  p.sucursal_id=s.id_sucursal and e.id_empresa=s.empresa_id order by id_pedidoApp desc limit $contador,$cantidad";
        $data = $this->CON->consulta2($consulta);
        $consulta = "SELECT count(id_pedidoApp) cantidad FROM lasueca.pedidoapp p, lasueca.sucursal s, lasueca.empresa e where cliente=$idcliente and  p.sucursal_id=s.id_sucursal and e.id_empresa=s.empresa_id";
        $limiteData = $this->CON->consulta($consulta);
        $limite = $limiteData->fetch_assoc()['cantidad'];
        $resultado = array();
        $resultado["limite"] = $limite;
        $resultado["data"] = $data;
        return $resultado;
    }

    function nroPendientes($idsucursal) {
        $consulta = "select count(id_pedidoApp) cantidad from lasueca.pedidoapp where sucursal_id=$idsucursal and (estado like 'pendiente' || estado like 'recepcionado')";
        $nro = $this->CON->consulta($consulta);
        return $nro->fetch_assoc()['cantidad'];
    }

    function buscarXid($idpedido) {
        $consulta = "select p.venta_id,p.nit,p.rz,c.nombre nombrecliente, p.montoBillete,p.costoDelivery, c.telefono telefonoc, d.telefono telefonod, d.direccion direccionc,d.lon lonc,d.lat latc, d.referencia,p.cliente,p.delivery_id, p.estado ,p.id_pedidoApp, s.direccion , s.lon,s.lat ,s.telefono, p.solicitada,p.recepcionado,p.llamarMoto, e.nombreempresa ,p.totalPedido, s.id_sucursal from lasueca.pedidoapp p, lasueca.sucursal s, lasueca.empresa e, lasueca.clienteApp c , lasueca.direccionApp d where p.id_pedidoApp=$idpedido and p.sucursal_id=s.id_sucursal and s.empresa_id=e.id_empresa  and p.cliente=c.id_clienteApp and d.id_direccionApp=p.direccionApp_id";
        $nro = $this->CON->consulta2($consulta);
        return $nro[0];
    }

    function reporteIngresosDeDelivery($id_delivery, $de, $hasta) {
        $consulta = "select estado, count(id_pedidoApp) pedidos, sum(costoDelivery) ingresos from pedidoapp";
        $consulta .= " where delivery_id=$id_delivery and STR_TO_DATE(solicitada,'%e/%c/%Y') between STR_TO_DATE('$de','%e/%c/%Y') and STR_TO_DATE('$hasta','%e/%c/%Y')";
        $consulta .= " group by estado";
        return $this->CON->consulta2($consulta);
    }

    function nropedidoEnCursoDelivery($id_delivery) {
        $consulta = "select count(id_pedidoApp) cantidad  from pedidoapp where delivery_id=$id_delivery and (estado like 'recepcionado' or estado like 'recogiendo pedido'  or estado like 'en camino')";
        return $this->CON->consulta2($consulta)[0]["cantidad"];
    }

    function pedidoEnCursoDelivery($id_delivery) {
        $consulta = "select p.venta_id,p.nit,p.rz,c.nombre nombrecliente, p.montoBillete,p.costoDelivery, c.telefono telefonoc, d.telefono telefonod, d.direccion direccionc,d.lon lonc,d.lat latc, d.referencia,p.cliente,p.delivery_id, p.estado ,p.id_pedidoApp, s.direccion , s.lon,s.lat ,s.telefono, p.solicitada, p.recepcionado,p.llamarMoto,p.enCamino, e.nombreempresa ,p.totalPedido, s.id_sucursal from lasueca.pedidoapp p, lasueca.sucursal s, lasueca.empresa e, lasueca.clienteApp c , lasueca.direccionApp d where p.sucursal_id=s.id_sucursal and s.empresa_id=e.id_empresa  and p.cliente=c.id_clienteApp and d.id_direccionApp=p.direccionApp_id and p.delivery_id=$id_delivery and (p.estado like 'recepcionado' or p.estado like 'recogiendo pedido'  or p.estado like 'en camino')";
        return $this->CON->consulta2($consulta);
    }

    function pedidosRecepcionadosDelivery($ciudad_id, $contador, $cantidad, $lon2, $lat2,$empresa=0) {
        $strEmp="";
        $strAfiliacion=" and e.delivery like 'emprendedor'";
        if($empresa!=0){
            $strEmp=" and s.empresa_id=$empresa ";
            $strAfiliacion=" and e.delivery like 'propia'";
        }
        
        $consulta = "select *";
        $consulta .= "  from (";
        $consulta .= "	select '1' tipo,e.appLogo,p.llamarMoto,p.totalPedido,e.nombreempresa,p.id_pedidoApp,s.lat,s.lon,c.nombre cliente,";
        $consulta .= "		((acos((sin(s.lat * 0.01745329) * sin($lat2 * 0.01745329)) +  (cos(s.lat * 0.01745329) * cos($lat2 * 0.01745329) * cos((s.lon-$lon2) * 0.01745329)) )* 57.29577951)*111.302 *1000) distancia ";
        $consulta .= "	from lasueca.pedidoapp p , lasueca.sucursal s, lasueca.empresa e, lasueca.clienteapp c";
        $consulta .= "	where s.ciudad_id=$ciudad_id $strEmp $strAfiliacion and p.estado like 'recogiendo pedido' and (p.delivery_id=0 || p.delivery_id is null) ";
        $consulta .= "	and s.id_sucursal=p.sucursal_id and e.id_empresa=s.empresa_id and c.id_clienteApp=p.cliente";
        
        if($empresa===0){
            $consulta .= "	union";
            $consulta .= "	SELECT '2' tipo,'img/logo/logoDelivery.png' as appLogo, solicitado llamarMoto";
            $consulta .= "	    ,costo totalPedido , 'Emprendedor Express' nombreempresa,p.id_pedidoCurrier id_pedidoApp,";
            $consulta .= "	    p.lat,p.lon,c.nombre cliente,";
            $consulta .= "		((acos((sin(p.lat * 0.01745329) * sin($lat2 * 0.01745329)) +  (cos(p.lat * 0.01745329) * cos($lat2 * 0.01745329) * cos((p.lon-$lon2) * 0.01745329)) )* 57.29577951)*111.302 *1000) distancia ";
            $consulta .= "	FROM lasueca.pedidocurrier p, lasueca.clienteApp c";
            $consulta .= "	where p.estado like 'pendiente' and p.ciudad_id=$ciudad_id and (p.delivery_id=0 || p.delivery_id is null) and p.clienteApp_id=c.id_clienteApp";

        }
        

        $consulta .= "  ) a";
        $consulta .= " order by STR_TO_DATE(a.llamarMoto,'%e/%c/%Y %H:%i:%s') asc limit $contador,$cantidad";
        $data = $this->CON->consulta2($consulta);
        $consulta = "	select sum(a.cantidad) cantidad from (";
        $consulta .= "	select count(p.id_pedidoApp) cantidad, '1' tipo";
        $consulta .= "	from lasueca.pedidoapp p , lasueca.sucursal s, lasueca.empresa e";
        $consulta .= "	where s.ciudad_id=$ciudad_id and p.estado like 'recogiendo pedido' $strEmp $strAfiliacion and (p.delivery_id=0 || p.delivery_id is null) ";
        $consulta .= "	and s.id_sucursal=p.sucursal_id and e.id_empresa=s.empresa_id";
        if($empresa===0){
            $consulta .= "	union";
            $consulta .= "	SELECT count(p.id_pedidoCurrier) cantidad, '2' tipo";
            $consulta .= "	FROM lasueca.pedidocurrier p";
            $consulta .= "	where p.estado like 'pendiente' and p.ciudad_id=$ciudad_id and (p.delivery_id=0 || p.delivery_id is null)";

        }
        $consulta .= "	) a ";
        $limiteData = $this->CON->consulta($consulta);
        $limite = $limiteData->fetch_assoc()['cantidad'];
        $resultado = array();
        $resultado["limite"] = $limite;
        $resultado["data"] = $data;
        return $resultado;
    }

    function pedidosPendientesAlerta($sucursal_id, $contador, $cantidad) {
        $consulta = "SELECT p.venta_id,p.id_pedidoApp,p.solicitada,p.cliente cliente_id,p.totalPedido,p.estado,c.nombre cliente,d.telefono , c.telefono telefono2, c.foto ";
        $consulta .= "  FROM lasueca.pedidoApp p, lasueca.clienteapp c, lasueca.direccionapp d  ";
        $consulta .= " where p.cliente=c.id_clienteApp and sucursal_id=$sucursal_id ";
        $consulta .= " and (p.estado like 'pendiente' or p.estado like 'recepcionado'  or p.estado like 'recogiendo pedido') ";
        $consulta .= " and d.id_direccionApp=p.direccionapp_id";
        $consulta .= " order by id_pedidoApp asc limit $contador,$cantidad";
        $data = $this->CON->consulta2($consulta);
        $consulta = " SELECT count(p.id_pedidoApp) cantidad ";
        $consulta .= "  FROM lasueca.pedidoApp p, lasueca.clienteapp c, lasueca.direccionapp d  ";
        $consulta .= " where p.cliente=c.id_clienteApp and sucursal_id=$sucursal_id ";
        $consulta .= " and (p.estado like 'pendiente' or p.estado like 'recepcionado'  or p.estado like 'recogiendo pedido') ";
        $consulta .= " and d.id_direccionApp=p.direccionapp_id";
        $limiteData = $this->CON->consulta($consulta);
        $limite = $limiteData->fetch_assoc()['cantidad'];
        $resultado = array();
        $resultado["limite"] = $limite;
        $resultado["data"] = $data;
        return $resultado;
    }

    function buscarPedido($de, $hasta, $ciudad_id, $estado, $cliente, $empresa, $contador, $cantidad, $express, $ver) {
        $ciudad = "";
        $ciudadCurrier = "";
        $ciudadCurrier2 = "";
        if ($ciudad_id !== "") {
            $ciudad = " and dir.ciudad_id=$ciudad_id";
            $ciudadCurrier = " where ciudad_id = $ciudad_id";
            $ciudadCurrier2 = " and p.ciudad_id = $ciudad_id";
        }
        $est = "";
        if ($estado !== "") {
            $est = " and p.estado like '%$estado%' ";
        }
        $exp = "";
        if ($express !== "") {
            $exp = " and p.estado like '%$express%' ";
        }
        $consulta = "select estado,sum(a.cant) cant,sum(a.totalPedido) totalPedido,sum(a.repartidor) repartidor from (";
        if ($ver === "-" || $ver === "pedido") {
            $consulta .= "select p.estado, count(p.id_pedidoApp) cant, sum(p.totalPedido) totalPedido, sum(costoDelivery) repartidor";
            $consulta .= "   from lasueca.pedidoapp p, lasueca.clienteapp c, lasueca.empresa e,";
            $consulta .= "        lasueca.sucursal s, lasueca.direccionapp dir";
            $consulta .= "   where STR_TO_DATE(solicitada,'%e/%c/%Y') between STR_TO_DATE('$de','%e/%c/%Y') and STR_TO_DATE('$hasta','%e/%c/%Y')";
            $consulta .= "         and p.cliente=c.id_clienteapp and e.id_empresa=s.empresa_id";
            $consulta .= "         and s.id_sucursal=p.sucursal_id ";
            $consulta .= "         and c.nombre like '%$cliente%' and e.nombreEmpresa like '%$empresa%'  $ciudad $est ";
            $consulta .= "  and dir.id_direccionapp=p.direccionApp_id";
            $consulta .= " group by p.estado";
        }

        if ($ver === "-") {
            $consulta .= " union";
        }

        if ($ver === "-" || $ver === "express") {
            $consulta .= " select p.estado, COUNT(p.id_pedidoCurrier) cant, 0 totalPedido, SUM(costo) repartidor";
            $consulta .= " from lasueca.clienteapp c,lasueca.pedidocurrier p ";
            $consulta .= " where STR_TO_DATE(solicitado, '%e/%c/%Y') BETWEEN STR_TO_DATE('$de', '%e/%c/%Y') AND STR_TO_DATE('$hasta', '%e/%c/%Y')";
            $consulta .= " $ciudadCurrier2 AND c.nombre LIKE '%$cliente%' $exp AND p.clienteApp_id = c.id_clienteapp ";
            $consulta .= " group by p.estado";
        }
        $consulta .= " )a group by a.estado";

        $resumen = $this->CON->consulta2($consulta);

        $consulta = "select * from (";
        if ($ver === "-" || $ver === "pedido") {
            $consulta .= " select  p.descuento,'1' tipo, p.montoBillete,p.nit,p.rz,p.costoDelivery,p.entregada,p.id_pedidoapp,p.solicitada,p.recepcionado,p.llamarMoto,p.enCamino,c.nombre cliente,c.telefono teflCliente, dir.telefono telfDir,";
            $consulta .= "   e.nombreEmpresa, e.telefono telfEmpresa, s.telefono telfSuc,dir.ciudad_id,s.lat late,s.lon lone,dir.lat,dir.lon,dir.direccion,p.cliente id_cliente, p.sucursal_id,";
            $consulta .= "   p.estado, p.totalPedido, (select nombre from lasueca.delivery where id_delivery=p.delivery_id limit 0,1) delivery, p.delivery_id ";
            $consulta .= "   ,'' detalle ,'' tipoCarrera ,'' referenciaOrigen  ,'' contactoOrigen ,'' telefonoOrigen ,'' referenciaDestino ,'' contactoDestino ,'' telefonoDestino ";
            $consulta .= "   from lasueca.pedidoapp p, lasueca.clienteapp c, lasueca.empresa e,";
            $consulta .= "        lasueca.sucursal s, lasueca.direccionapp dir";
            $consulta .= "   where STR_TO_DATE(solicitada,'%e/%c/%Y') between STR_TO_DATE('$de','%e/%c/%Y') and STR_TO_DATE('$hasta','%e/%c/%Y')";
            $consulta .= "         and c.nombre like '%$cliente%' and e.nombreEmpresa like '%$empresa%'  $ciudad $est ";
            $consulta .= "         and p.cliente=c.id_clienteapp and e.id_empresa=s.empresa_id";
            $consulta .= "         and s.id_sucursal=p.sucursal_id ";
            $consulta .= "  and dir.id_direccionapp=p.direccionApp_id";
        }


        if ($ver === "-") {
            $consulta .= " union";
        }

        if ($ver === "-" || $ver === "express") {
            $consulta .= " select  p.descuento,'2' tipo , '' montoBillete , '' nit ,'' rz ,p.costo costoDelivery , p.entregado entregada ";
            $consulta .= " , p.id_pedidocurrier id_pedidoapp , p.solicitado solicitada , p.recogido recepcionado , p.entregado llamarMoto ,p.vuelta enCamino";
            $consulta .= " , c.nombre cliente , p.telefonoOrigen teflCliente , c.telefono telfDir , '' nombreEmpresa , p.telefonoDestino telfEmpresa";
            $consulta .= " , '' telfSuc , c.ciudad_id , p.lat2 late , p.lon2 lone , p.lat , p.lon , '' direccion , p.clienteApp_id id_cliente";
            $consulta .= " , '0' sucursal_id , p.estado , '0' totalPedido , d.nombre delivery , p.delivery_id ,p.detalle ";
            $consulta .= " ,p.tipo tipoCarrera ,p.referenciaOrigen ,p.contactoOrigen ,p.telefonoOrigen ,p.referenciaDestino ,p.contactoDestino ,p.telefonoDestino";
            $consulta .= " from lasueca.clienteapp c,lasueca.pedidocurrier p left join ";
            $consulta .= " (SELECT id_delivery, nombre FROM lasueca.delivery $ciudadCurrier) d on p.delivery_id=d.id_delivery";
            $consulta .= " where STR_TO_DATE(solicitado, '%e/%c/%Y') BETWEEN STR_TO_DATE('$de', '%e/%c/%Y') AND STR_TO_DATE('$hasta', '%e/%c/%Y')";
            $consulta .= " $ciudadCurrier2 AND c.nombre LIKE '%$cliente%' $exp AND p.clienteApp_id = c.id_clienteapp ";
        }
        $consulta .= " ) a";
        $consulta .= " ORDER BY STR_TO_DATE(a.solicitada, '%e/%c/%Y %H:%i:%s') DESC limit $contador,$cantidad";



        $data = $this->CON->consulta2($consulta);
        $consulta = "select sum(cant) cantidad from (";
        if ($ver === "-" || $ver === "pedido") {
            $consulta .= " select count(p.id_pedidoapp) cant";
            $consulta .= "   from lasueca.pedidoapp p, lasueca.clienteapp c, lasueca.empresa e,";
            $consulta .= "        lasueca.sucursal s, lasueca.direccionapp dir";
            $consulta .= "   where STR_TO_DATE(solicitada,'%e/%c/%Y') between STR_TO_DATE('$de','%e/%c/%Y') and STR_TO_DATE('$hasta','%e/%c/%Y')";
            $consulta .= "         and c.nombre like '%$cliente%' and e.nombreEmpresa like '%$empresa%'  $ciudad $est ";
            $consulta .= "         and p.cliente=c.id_clienteapp and e.id_empresa=s.empresa_id";
            $consulta .= "         and s.id_sucursal=p.sucursal_id ";
            $consulta .= "  and dir.id_direccionapp=p.direccionApp_id";
        }


        if ($ver === "-") {
            $consulta .= " union";
        }
        if ($ver === "-" || $ver === "express") {
            $consulta .= " select count(p.id_pedidocurrier) cant";
            $consulta .= " from lasueca.clienteapp c,lasueca.pedidocurrier p ";
            $consulta .= " where STR_TO_DATE(solicitado, '%e/%c/%Y') BETWEEN STR_TO_DATE('$de', '%e/%c/%Y') AND STR_TO_DATE('$hasta', '%e/%c/%Y') $exp";
            $consulta .= " $ciudadCurrier2 AND c.nombre LIKE '%$cliente%' AND p.clienteApp_id = c.id_clienteapp ";
        }
        $consulta .= " ) a";
        $limiteData = $this->CON->consulta($consulta);
        $limite = $limiteData->fetch_assoc()['cantidad'];
        $resultado = array();
        $resultado["limite"] = $limite;
        $resultado["data"] = $data;
        $resultado["resumen"] = $resumen;
        return $resultado;
    }

    function aceptarPedidoXdelivery($id_pedido, $id_delivery) {
        $consulta = "select count(id_pedidoApp) cantidad from pedidoapp where id_pedidoApp=$id_pedido and (delivery_id=0 || delivery_id is null)";
        $resultado = $this->CON->consulta($consulta);
        $disponible = $resultado->fetch_assoc()['cantidad'];
        if ($disponible === 1 || $disponible === "1") {
            $fechaactual = date("d/m/Y H:i:s");
            $consulta = "update pedidoapp set delivery_id=$id_delivery,aceptarPedido='$fechaactual'   where id_pedidoApp=$id_pedido ";
            return $this->CON->manipular($consulta);
        }
        return false;
    }

    function cambiarDeliveryYestadoPedido($id_pedido, $id_delivery, $estado) {
        $estadoStr = " delivery_id=null, ";
        if ($id_delivery !== "0") {
            $estadoStr = " delivery_id=$id_delivery, ";
        }
        $consulta = "update pedidoapp set $estadoStr estado='$estado' where id_pedidoApp=$id_pedido ";
        return $this->CON->manipular($consulta);
    }

    function recogerPedidoXdelivery($id_pedido) {
        $fechaactual = date("d/m/Y H:i:s");
        $consulta = "update pedidoapp set estado='en camino',enCamino='$fechaactual'  where id_pedidoApp=$id_pedido ";
        return $this->CON->manipular($consulta);
    }

    function entregarPedidoXdelivery($id_pedido) {
        $fechaactual = date("d/m/Y H:i:s");
        $consulta = "update pedidoapp set estado='entregado', entregada='$fechaactual' where id_pedidoApp=$id_pedido ";
        return $this->CON->manipular($consulta);
    }

    function PendienteXsucursal($idsucursal) {
        $consulta = "SELECT p.venta_id,p.recepcionado,p.llamarMoto,p.enCamino,p.id_pedidoApp,p.solicitada,p.cliente cliente_id,p.totalPedido,p.estado,c.nombre cliente,d.telefono , c.telefono telefono2 FROM lasueca.pedidoApp p, lasueca.clienteapp c, lasueca.direccionapp d  where p.cliente=c.id_clienteApp and sucursal_id=$idsucursal and (p.estado like 'pendiente' or p.estado like 'recepcionado'  or p.estado like 'recogiendo pedido') and d.id_direccionApp=p.direccionapp_id  order by id_pedidoApp asc";
        return $this->CON->consulta2($consulta);
    }

    function cancelarPedido($idpedido, $motivo) {
        $fechaactual = date("d/m/Y H:i:s");
        $consulta = "update lasueca.pedidoapp set motivo='$motivo',estado='cancelado',cancelado='$fechaactual' where id_pedidoApp=$idpedido";
        return $this->CON->manipular($consulta);
    }

    function realizarVentaPedido($idpedido, $idventa) {
        $consulta = "update lasueca.pedidoapp set venta_id=$idventa where id_pedidoApp=$idpedido";
        return $this->CON->manipular($consulta);
    }
    function cambiarUbicacionPedido($idpedido, $lon,$lat,$costo,$descuento,$usuario_id) {
        $consulta = "update direccionApp set lon='$lon',lat='$lat' where id_direccionApp=(select direccionApp_id from pedidoapp where id_pedidoApp=$idpedido limit 0,1)";
        if($this->CON->manipular($consulta)){
            $consulta = "update pedidoapp set costoDelivery=$costo,descuento=$descuento,usuario_id=$usuario_id where id_pedidoApp=$idpedido";    
            return $this->CON->manipular($consulta);
        }
        return false;
    }

    function recepcionarPedido($idpedido) {
        $fechaactual = date("d/m/Y H:i:s");
        $consulta = "update lasueca.pedidoapp set estado='recepcionado',recepcionado='$fechaactual' where id_pedidoApp=$idpedido ";
        return $this->CON->manipular($consulta);
    }

    function llamarRepartidor($idpedido) {
        $fechaactual = date("d/m/Y H:i:s");
        $consulta = "update lasueca.pedidoapp set estado='recogiendo pedido',llamarMoto='$fechaactual' where id_pedidoApp=$idpedido ";
        return $this->CON->manipular($consulta);
    }

    function mapaCalorXciudad($ciudad, $dia, $de, $hasta) {
        $fechaactual = date("d/m/Y");
        $fechaPedido = " and STR_TO_DATE(CONCAT('$fechaactual',substring(entregada,12,8)),'%e/%c/%Y %H:%i:%s') between STR_TO_DATE(CONCAT('$fechaactual',' $de:00:00'),'%e/%c/%Y %H:%i:%s') and STR_TO_DATE(CONCAT('$fechaactual',' $hasta:00:00'),'%e/%c/%Y %H:%i:%s') ";
        //$fechaPedido="";
        $consulta = "SELECT e.nombreempresa,e.appLogo ,lon,lat,";
        $consulta .= " (select ifnull(avg(a.cant),0) from (select count(id_pedidoApp) cant from lasueca.pedidoApp where estado like 'entregado' and STR_TO_DATE(entregada,'%e/%c/%Y') < NOW() and WEEKDAY(STR_TO_DATE(entregada,'%e/%c/%Y %H:%i:%s'))=$dia $fechaPedido and sucursal_id=s.id_sucursal group by STR_TO_DATE(entregada,'%e/%c/%Y')) a) promedio";
        $consulta .= " FROM lasueca.sucursal s, lasueca.empresa e";
        $consulta .= " where s.ciudad_id=$ciudad and s.app like 'activo' and e.app like 'activo' ";
        $consulta .= " and ((STR_TO_DATE('$fechaactual $de:00:00','%e/%c/%Y %H:%i:%s') between STR_TO_DATE(CONCAT('$fechaactual', CONCAT(SUBSTRING_INDEX(s.horarioDe1,':',1),':00:00')),'%e/%c/%Y %H:%i:%s') and STR_TO_DATE(CONCAT('05/07/2020', CONCAT(SUBSTRING_INDEX(s.horarioHasta1,':',1),':00:00')),'%e/%c/%Y %H:%i:%s') ) ";
        $consulta .= " ||  (STR_TO_DATE('$fechaactual $de:00:00','%e/%c/%Y %H:%i:%s') between STR_TO_DATE(CONCAT('$fechaactual', CONCAT(SUBSTRING_INDEX(s.horarioDe2,':',1),':00:00')),'%e/%c/%Y %H:%i:%s') and STR_TO_DATE(CONCAT('05/07/2020', CONCAT(SUBSTRING_INDEX(s.horarioHasta2,':',1),':00:00')),'%e/%c/%Y %H:%i:%s') )";
        $consulta .= " ||  (STR_TO_DATE('$fechaactual $hasta:00:00','%e/%c/%Y %H:%i:%s') between STR_TO_DATE(CONCAT('$fechaactual', CONCAT(SUBSTRING_INDEX(s.horarioDe1,':',1),':00:00')),'%e/%c/%Y %H:%i:%s') and STR_TO_DATE(CONCAT('05/07/2020', CONCAT(SUBSTRING_INDEX(s.horarioHasta1,':',1),':00:00')),'%e/%c/%Y %H:%i:%s') ) ";


        $consulta .= " ||  STR_TO_DATE(CONCAT('$fechaactual', CONCAT(SUBSTRING_INDEX(s.horarioDe1,':',1),':00:00')),'%e/%c/%Y %H:%i:%s') between STR_TO_DATE('$fechaactual $de:00:00','%e/%c/%Y %H:%i:%s') and STR_TO_DATE('$fechaactual $hasta:00:00','%e/%c/%Y %H:%i:%s')  ";
        $consulta .= " ||  STR_TO_DATE(CONCAT('$fechaactual', CONCAT(SUBSTRING_INDEX(s.horarioDe2,':',1),':00:00')),'%e/%c/%Y %H:%i:%s') between STR_TO_DATE('$fechaactual $de:00:00','%e/%c/%Y %H:%i:%s') and STR_TO_DATE('$fechaactual $hasta:00:00','%e/%c/%Y %H:%i:%s')  ";
        $consulta .= " ||  STR_TO_DATE(CONCAT('$fechaactual', CONCAT(SUBSTRING_INDEX(s.horarioHasta1,':',1),':00:00')),'%e/%c/%Y %H:%i:%s') between STR_TO_DATE('$fechaactual $de:00:00','%e/%c/%Y %H:%i:%s') and STR_TO_DATE('$fechaactual $hasta:00:00','%e/%c/%Y %H:%i:%s') ";
        $consulta .= " ||  STR_TO_DATE(CONCAT('$fechaactual', CONCAT(SUBSTRING_INDEX(s.horarioHasta2,':',1),':00:00')),'%e/%c/%Y %H:%i:%s') between STR_TO_DATE('$fechaactual $de:00:00','%e/%c/%Y %H:%i:%s') and STR_TO_DATE('$fechaactual $hasta:00:00','%e/%c/%Y %H:%i:%s')  ";

        $consulta .= " ||  (STR_TO_DATE('$fechaactual $hasta:00:00','%e/%c/%Y %H:%i:%s') between STR_TO_DATE(CONCAT('$fechaactual', CONCAT(SUBSTRING_INDEX(s.horarioDe2,':',1),':00:00')),'%e/%c/%Y %H:%i:%s') and STR_TO_DATE(CONCAT('05/07/2020', CONCAT(SUBSTRING_INDEX(s.horarioHasta2,':',1),':00:00')),'%e/%c/%Y %H:%i:%s') ) )";
        $consulta .= " and s.empresa_id=e.id_empresa";
        return $this->CON->consulta2($consulta);
    }

    function reportePedido($tipo, $de, $hasta, $empresa, $ciudad, $estado) {
        $empStr = "";
        if ($empresa !== "0") {
            $empStr = " e.id_empresa=$empresa and ";
        }
        $ciudadStr = "";
        if ($ciudad !== "0") {
            $ciudadStr = " s.ciudad_id=$ciudad and ";
        }
        $estadoStr = "";
        if ($estado !== "") {
            $estadoStr = " p.estado like '$estado' and ";
        }

        $column = "";
        $group = "";
        $orderBy = "";
        $where = " and STR_TO_DATE(p.solicitada,'%e/%c/%Y') between STR_TO_DATE('$de','%e/%c/%Y') and STR_TO_DATE('$hasta','%e/%c/%Y')";
        if ($tipo === "Diario") {
            $column = " SUBSTRING(p.solicitada, 1, 10) fecha, ";
            $group = " SUBSTRING(p.solicitada, 1, 10) , ";
            $orderBy = " order by STR_TO_DATE(solicitada,'%e/%c/%Y') desc ";
        }
        if ($tipo === "Mensual") {
            $column = "  year(STR_TO_DATE(p.solicitada,'%e/%c/%Y')) ano,month(STR_TO_DATE(p.solicitada,'%e/%c/%Y')) mes, ";
            $group = "";
            $orderBy = " order by year(STR_TO_DATE(p.solicitada,'%e/%c/%Y')) desc ,month(STR_TO_DATE(p.solicitada,'%e/%c/%Y')) desc ";
            $where = "";
        }
        $consulta = " select $column p.estado,e.id_empresa,e.nombreEmpresa, ifnull(e.comision,0) comision ,sum(totalPedido) vendido, sum(totalPedido*(ifnull(e.comision,0)/100)) comisionBs ";
        $consulta .= " from pedidoapp p, sucursal s, empresa e";
        $consulta .= " where $empStr $ciudadStr $estadoStr";
        $consulta .= " p.sucursal_id=s.id_sucursal and e.id_empresa=s.empresa_id $where";
        $consulta .= " group by $group p.estado,e.nombreEmpresa, e.comision $orderBy";
        return $this->CON->consulta2($consulta);
    }

}

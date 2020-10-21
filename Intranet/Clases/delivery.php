<?php

class delivery {

    var $id_delivery;
    var $nombre;
    var $cuenta;
    var $contrasena;
    var $tipo;
    var $estado;
    var $registrado;
    var $telefono;
    var $tokenFirebase;
    var $notificacion;
    var $ciudad_id;
    var $direccion;
    var $registradoPor;
    var $ci;
    var $limitePedidos;
    var $limiteCurrier;
    var $afiliado;
    var $empresa_id;
    var $CON;

    function __construct($con) {
        $this->CON = $con;
    }

    function contructor($id_delivery, $nombre, $cuenta, $contrasena, $tipo, $estado,
            $registrado, $telefono, $tokenFirebase, $notificacion, $ciudad_id
            , $direccion, $registradoPor, $ci,$limitePedidos=3,$limiteCurrier=3
            ,$afiliado,$empresa_id) {
        $this->id_delivery = $id_delivery;
        $this->nombre = $nombre;
        $this->afiliado= $afiliado;
        $this->empresa_id= $empresa_id;
        $this->cuenta = $cuenta;
        $this->contrasena = $contrasena;
        $this->tipo = $tipo;
        $this->estado = $estado;
        $this->registrado = $registrado;
        $this->telefono = $telefono;
        $this->tokenFirebase = $tokenFirebase;
        $this->notificacion = $notificacion;
        $this->ciudad_id = $ciudad_id;
        $this->direccion = $direccion;
        $this->registradoPor = $registradoPor;
        $this->ci = $ci;
        $this->limitePedidos = $limitePedidos;
        $this->limiteCurrier = $limiteCurrier;
    }

    function todos() {
        $consulta = "select * from lasueca.delivery";
        return $this->CON->consulta2($consulta);
    }
    function buscarXid($iddelivery) {
        $consulta = "select * from lasueca.delivery where id_delivery=$iddelivery";
        return $this->CON->consulta2($consulta)[0];
    }
    function pedidoEnCursoSucursal($delivery_id) {
        $consulta = "select p.sucursal_id from lasueca.pedidoapp p where p.delivery_id=$delivery_id and (p.estado like 'recepcionado' or p.estado like 'recogiendo pedido'  or p.estado like 'en camino')";
        return $this->CON->consulta2($consulta);
    }
    function pedidoEnCursoCurrier($delivery_id) {
        $consulta = "select count(id_pedidoCurrier) cantidad from lasueca.pedidocurrier  where delivery_id=$delivery_id and estado like 'aceptado' or estado like 'recogido' or (estado like 'entregado' and tipo like 'IDA Y VUELTA')";
        $result = $this->CON->consulta($consulta);
        return $result->fetch_assoc()['cantidad'];
    }
    function buscarXciudad($ciudad_id) {
        $ciudadStr="";
        if($ciudad_id!==""){
            $ciudadStr=" where ciudad_id=$ciudad_id";
        }
        $consulta = "select nombre,tipo,telefono,direccion,id_delivery from lasueca.delivery $ciudadStr";
        return $this->CON->consulta2($consulta);
    }
    function logear($cuenta, $contra) {
        $consulta = "select id_delivery,nombre,tipo,estado,telefono,notificacion,ciudad_id from lasueca.delivery where cuenta like '$cuenta' and contrasena like SHA2('$contra', 256)";
        return $this->CON->consulta2($consulta);
    }
    function existecuenta($cuenta, $id_delivery = "") {
        $delivery = "";
        if ($id_delivery !== "") {
            $delivery = " and id_delivery!=$id_delivery ";
        }
        $consulta = "select count(id_delivery) as cant from lasueca.delivery where cuenta='$cuenta' $delivery";
        $result = $this->CON->consulta($consulta);
        $empresa = $result->fetch_assoc()['cant'];
        return $empresa;
    }
    function deliveryNotificacionActiva($ciudad,$afilicicion='emprendedor',$id_emp=0) {
        $strEmp="";
        if($id_emp!=0){
            $strEmp=" and empresa_id=$id_emp ";
        }
        $consulta = "select tokenFirebase from lasueca.delivery where notificacion like 'activo' $strEmp and afiliado like '$afilicicion'  and ciudad_id=$ciudad";
        return $this->CON->consulta2($consulta);
    }
    function cuentaEstaActiva($id_delivery) {
        $consulta = "select count(id_delivery) cantidad from lasueca.delivery where estado like 'activo' and id_delivery=$id_delivery";
        $cantidad = $this->CON->consulta($consulta);
        return $cantidad->fetch_assoc()['cantidad'];
    }
    function insertar() {
        $consulta = "INSERT INTO lasueca.delivery (id_delivery,nombre,cuenta,contrasena,tipo,estado,registrado,telefono,tokenFirebase,notificacion,ciudad_id,direccion,registradoPor,ci,limitePedidos,limiteCurrier,afiliado,empresa_id) VALUES ('$this->id_delivery','$this->nombre','$this->cuenta',SHA2('$this->contrasena', 256),'$this->tipo','$this->estado','$this->registrado','$this->telefono','$this->tokenFirebase','$this->notificacion','$this->ciudad_id','$this->direccion',$this->registradoPor,'$this->ci',$this->limitePedidos,$this->limiteCurrier,'$this->afiliado','$this->empresa_id')";
        return $this->CON->manipular($consulta);
    }
    function modificar() {  
        $modificarStr=", contrasena = SHA2('$this->contrasena', 256)";
        if($this->contrasena===""){
           $modificarStr=""; 
        }
        $consulta = "UPDATE lasueca.delivery SET limiteCurrier='$this->limiteCurrier', limitePedidos=$this->limitePedidos $modificarStr , nombre = '$this->nombre', cuenta = '$this->cuenta', tipo = '$this->tipo', estado = '$this->estado', telefono = '$this->telefono', ciudad_id = '$this->ciudad_id', direccion = '$this->direccion', registradoPor = '$this->registradoPor',ci = '$this->ci' WHERE id_delivery = '$this->id_delivery';";
        return $this->CON->manipular($consulta);
    }
    function modificarToken($id_delivery, $token) {
        $consulta = "UPDATE lasueca.delivery SET  tokenFirebase = '$token' WHERE id_delivery = '$id_delivery';";
        return $this->CON->manipular($consulta);
    }
    function modificarNotificacion($id_delivery, $estado) {
        $consulta = "UPDATE lasueca.delivery SET  notificacion = '$estado' WHERE id_delivery = '$id_delivery';";
        return $this->CON->manipular($consulta);
    }
    function buscarDelivery($text, $estado, $ciudad, $contador,$empresa_id) {
        $estadoStr = "";
        if ($estado !== "") {
            $estadoStr = "  and estado like '$estado' ";
        }
        $ciudadStr = "";
        if ($ciudad !== "") {
            $ciudadStr = " and ciudad_id=$ciudad ";
        }
        $empresaStr="";
        $consulta = "SELECT * FROM lasueca.delivery where (nombre like '%$text%' or ci like '%$text%') and empresa_id=$empresa_id  $estadoStr  $ciudadStr limit $contador,60";
        $data = $this->CON->consulta2($consulta);
        $consulta = "SELECT count(id_delivery) cantidad FROM lasueca.delivery where (nombre like '%$text%' or ci like '%$text%') and empresa_id=$empresa_id  $estadoStr  $ciudadStr limit $contador,60";
        $limiteData = $this->CON->consulta($consulta);
        $limite = $limiteData->fetch_assoc()['cantidad'];
        $resultado = array();
        $resultado["limite"] = $limite;
        $resultado["data"] = $data;
        return $resultado;
    }

    function ingresosDeliveryXPedido($text, $de,$hasta, $ciudad, $contador,$empresa_id) {
        $ciudad_id = "";
        if ($ciudad !== "") {
            $ciudad_id = "  and d.ciudad_id=$ciudad ";
        }
        $consulta = " select d.nombre, count(p.id_pedidoapp) cantidad, sum(p.costoDelivery) ingresos";
        $consulta .= " from lasueca.pedidoapp p, lasueca.delivery d";
        $consulta .= " where p.estado like 'entregado' $ciudad_id and d.empresa_id =$empresa_id";
        $consulta .= " and STR_TO_DATE(solicitada,'%e/%c/%Y') between STR_TO_DATE('$de','%e/%c/%Y') and STR_TO_DATE('$hasta','%e/%c/%Y')";
        $consulta .= " and (d.nombre like '%$text%' or d.ci like '%$text%') and p.delivery_id=d.id_delivery";
        $consulta .= " group by d.nombre  limit $contador,60";
        $data = $this->CON->consulta2($consulta);
        $consulta = " select count(a.nombre) cantidad from (";
        $consulta .= " select d.nombre, sum(p.costoDelivery) ingresos";
        $consulta .= " from lasueca.pedidoapp p, lasueca.delivery d";
        $consulta .= " where p.estado like 'entregado' $ciudad_id and d.empresa_id =$empresa_id";
        $consulta .= " and STR_TO_DATE(solicitada,'%e/%c/%Y') between STR_TO_DATE('$de','%e/%c/%Y') and STR_TO_DATE('$hasta','%e/%c/%Y')";
        $consulta .= " and (d.nombre like '%$text%' or d.ci like '%$text%') and p.delivery_id=d.id_delivery";
        $consulta .= " group by d.nombre ) a";
        $limiteData = $this->CON->consulta($consulta);
        $limite = $limiteData->fetch_assoc()['cantidad'];
        $resultado = array();
        $resultado["limite"] = $limite;
        $resultado["data"] = $data;
        return $resultado;
    }
    function ingresosDeliveryXCurrier($text, $de,$hasta, $ciudad, $contador,$empresa_id) {
        $ciudad_id = "";
        if ($ciudad !== "") {
            $ciudad_id = "  and d.ciudad_id=$ciudad ";
        }
        $consulta = " select d.nombre, count(p.id_pedidocurrier) cantidad, sum(p.costo) ingresos";
        $consulta .= " from lasueca.pedidocurrier p, lasueca.delivery d";
        $consulta .= " where (p.estado like 'entregado' or p.estado like 'finalizado') $ciudad_id and d.empresa_id =$empresa_id";
        $consulta .= " and STR_TO_DATE(solicitado,'%e/%c/%Y') between STR_TO_DATE('$de','%e/%c/%Y') and STR_TO_DATE('$hasta','%e/%c/%Y')";
        $consulta .= " and (d.nombre like '%$text%' or d.ci like '%$text%') and p.delivery_id=d.id_delivery";
        $consulta .= " group by d.nombre  limit $contador,60";
        $data = $this->CON->consulta2($consulta);
        $consulta = " select count(a.nombre) cantidad from (";
        $consulta .= " select d.nombre";
        $consulta .= " from lasueca.pedidocurrier p, lasueca.delivery d";
        $consulta .= " where (p.estado like 'entregado' or p.estado like 'finalizado') $ciudad_id and d.empresa_id =$empresa_id";
        $consulta .= " and STR_TO_DATE(solicitado,'%e/%c/%Y') between STR_TO_DATE('$de','%e/%c/%Y') and STR_TO_DATE('$hasta','%e/%c/%Y')";
        $consulta .= " and (d.nombre like '%$text%' or d.ci like '%$text%') and p.delivery_id=d.id_delivery";
        $consulta .= " group by d.nombre ) a";
        $limiteData = $this->CON->consulta($consulta);
        $limite = $limiteData->fetch_assoc()['cantidad'];
        $resultado = array();
        $resultado["limite"] = $limite;
        $resultado["data"] = $data;
        return $resultado;
    }

}

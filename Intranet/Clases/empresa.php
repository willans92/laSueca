<?php

class empresa {

    var $id_empresa;
    var $nombreEmpresa;
    var $tipoCambio;
    var $firmaCobranza1;
    var $firmaCobranza2;
    var $firmaNotaVenta1;
    var $firmaNotaVenta2;
    var $firmaNotaVenta3;
    var $firmaNotaVenta4;
    var $firmaNotaCompra1;
    var $firmaNotaCompra2;
    var $firmaNotaCompra3;
    var $firmaNotaCompra4;
    var $codigoUsuario;
    var $codigoProducto;
    var $codigoCliente;
    var $codigoAlmacen;
    var $estado;
    var $app;
    var $appLogo;
    var $appFactura;
    var $aprobado;
    var $aprobadoPor;
    var $empresaADM;
    var $telefono;
    var $ciudad_id;
    var $comision;
    var $posicion;
    var $delivery;
    var $tarifaDelivery;
    var $CON;

    function __construct($con) {
        $this->CON = $con;
    }

    function contructor($id_empresa, $nombreEmpresa, $tipoCambio, $firmaCobranza1
            , $firmaCobranza2, $firmaNotaVenta1, $firmaNotaVenta2, $firmaNotaVenta3
            , $firmaNotaVenta4, $firmaNotaCompra1, $firmaNotaCompra2, $firmaNotaCompra3
            , $firmaNotaCompra4, $estado,$app,$appLogo,$appFactura,$telefono,$ciudad_id
            ,$comision=8,$delivery,$tarifaDelivery) {
        $this->id_empresa = $id_empresa;
        $this->nombreEmpresa = $nombreEmpresa;
        $this->tarifaDelivery = $tarifaDelivery;
        $this->tipoCambio = $tipoCambio;
        $this->ciudad_id = $ciudad_id;
        $this->delivery = $delivery;
        $this->firmaCobranza1 = $firmaCobranza1;
        $this->firmaCobranza2 = $firmaCobranza2;
        $this->firmaNotaVenta1 = $firmaNotaVenta1;
        $this->firmaNotaVenta2 = $firmaNotaVenta2;
        $this->firmaNotaVenta3 = $firmaNotaVenta3;
        $this->firmaNotaVenta4 = $firmaNotaVenta4;
        $this->firmaNotaCompra1 = $firmaNotaCompra1;
        $this->firmaNotaCompra2 = $firmaNotaCompra2;
        $this->firmaNotaCompra3 = $firmaNotaCompra3;
        $this->firmaNotaCompra4 = $firmaNotaCompra4;
        $this->nombreEmpresa = $nombreEmpresa;
        $this->estado = $estado;
        $this->app = $app;
        $this->appLogo = $appLogo;
        $this->appFactura = $appFactura;
        $this->telefono = $telefono;
        $this->comision = $comision;
    }

    function modificar() {
        $consulta = "UPDATE lasueca.empresa SET delivery='$this->delivery',tarifaDelivery='$this->tarifaDelivery', appFactura='$this->appFactura', app='$this->app' , appLogo='$this->appLogo' , nombreEmpresa = '$this->nombreEmpresa',tipoCambio = '$this->tipoCambio',firmaCobranza1 = '$this->firmaCobranza1',firmaCobranza2 = '$this->firmaCobranza2',firmaNotaVenta1 = '$this->firmaNotaVenta1',firmaNotaVenta2 = '$this->firmaNotaVenta2',firmaNotaVenta3 = '$this->firmaNotaVenta3',firmaNotaVenta4 = '$this->firmaNotaVenta4',firmaNotaCompra1 = '$this->firmaNotaCompra1',firmaNotaCompra2 = '$this->firmaNotaCompra2',firmaNotaCompra3 = '$this->firmaNotaCompra3',firmaNotaCompra4 = '$this->firmaNotaCompra4' WHERE id_empresa =" . $this->CON->empresa_id;
        return $this->CON->manipular($consulta);
    }
    function cambiarEstadoApp($idempresa,$estado,$aprobado,$comision,$aprobadoPor,$app,$telefono,$logo) {
        $logoStr="";
        if($logo!=="-"){
            $logoStr=" appLogo='$logo', ";
        }
        $consulta = "UPDATE lasueca.empresa SET $logoStr estado='$estado', aprobado='$aprobado',telefono='$telefono', app='$app', comision=$comision, aprobadoPor=$aprobadoPor  WHERE id_empresa =$idempresa";
        return $this->CON->manipular($consulta);
    }

    function eliminarFuncionalidad() {
        $consulta = "delete from lasueca.configuracionempresa where empresa_id=" . $this->CON->empresa_id;
        return $this->CON->manipular($consulta);
    }

    function insertarFuncionalidad($configuracion_id) {
        $consulta = " insert into configuracionempresa(empresa_id,configuracion_id) values (" . $this->CON->empresa_id . ",$configuracion_id) ";
        return $this->CON->manipular($consulta);
    }

    function buscarXid($empresaID) {
        $consulta = "select * from lasueca.empresa where id_empresa=$empresaID";
        return $this->CON->consulta2($consulta)[0];
    }
    function buscarXidPedido($id_pedido) {
        $consulta = "select e.* from pedidoapp p , empresa e , sucursal s where id_pedidoApp=$id_pedido and  p.sucursal_id=s.id_sucursal and s.empresa_id=e.id_empresa";
        return $this->CON->consulta2($consulta)[0];
    }
    
    function todasEmpresas() {
        $consulta = "select id_empresa,nombreEmpresa from lasueca.empresa";
        return $this->CON->consulta2($consulta);
    }

    function todasEmpresasAPP($text,$contador, $cantidad,$ciudad) {
        
        
        $fechaactual = date("d/m/Y");
        $consulta .= " select * from (";
        $consulta .= " select nombreEmpresa,app,appLogo,id_empresa,appFactura,e.posicion";
        
        
        
        // sucursal
        $consulta .= "  ,(case when ( (select count(s2.id_sucursal) from sucursal s2 ";
        $consulta .= "  where s2.ciudad_id=$ciudad ";
        $consulta .= "  and (SELECT count(id_cerrarAtencion) FROM lasueca.cerraratencion where s2.id_sucursal=sucursal_id and STR_TO_DATE(fecha,'%e/%c/%Y')=CURDATE() and estado like 'activo')=0 ";
        $consulta .= "  and empresa_id=e.id_empresa and estado like 'activo' and app like 'activo' ";
       
        $consulta .= "  and if(s2.tipoAtencion='personalizado', ";
	$consulta .= "  ( ";
	$consulta .= "      select count(id_horarioAtencion)";
        $consulta .= "      from horarioatencion where tipo like 'sucursal' ";
	$consulta .= "  	and WEEKDAY(STR_TO_DATE('$fechaactual','%e/%c/%Y'))=dia";
	$consulta .= "          AND ((NOW() BETWEEN STR_TO_DATE(CONCAT('$fechaactual', horarioDe), '%e/%c/%Y %H:%i:%s') ";
	$consulta .= "          AND STR_TO_DATE(CONCAT('$fechaactual', horarioHasta),'%e/%c/%Y %H:%i:%s'))";
	$consulta .= "          || (NOW() BETWEEN STR_TO_DATE(CONCAT('$fechaactual', horarioDe2),'%e/%c/%Y %H:%i:%s') ";
	$consulta .= "          AND STR_TO_DATE(CONCAT('$fechaactual', horarioHasta2),'%e/%c/%Y %H:%i:%s')))";
	$consulta .= "          and id=s2.id_sucursal ) > 0";
        
        $consulta .= "          ,((NOW() BETWEEN STR_TO_DATE(CONCAT('$fechaactual', horarioDe1),'%e/%c/%Y %H:%i:%s')";
	$consulta .= "           AND STR_TO_DATE(CONCAT('$fechaactual', horarioHasta1),'%e/%c/%Y %H:%i:%s'))";
	$consulta .= "           || (NOW() BETWEEN STR_TO_DATE(CONCAT('$fechaactual', horarioDe2),'%e/%c/%Y %H:%i:%s')";
	$consulta .= "           AND STR_TO_DATE(CONCAT('$fechaactual', horarioHasta2),'%e/%c/%Y %H:%i:%s')))";
        $consulta .= " )  ";
        $consulta .= "   )>0) then 1 else 0 end) sucursalAbierta";
        //sucursal
        
        
        
        
        $consulta .= " ,( ";
	$consulta .= " (select count(id_pedidoApp) cant from lasueca.pedidoApp p,lasueca.sucursal s   where p.estado like 'entregado' and s.id_sucursal=p.sucursal_id and STR_TO_DATE(p.entregada,'%e/%c/%Y') < NOW() and s.empresa_id=e.id_empresa) -  ";
	$consulta .= " (select count(id_pedidoApp)*3 cant from lasueca.pedidoApp p,lasueca.sucursal s   where p.estado like 'cancelado' and s.id_sucursal=p.sucursal_id  and STR_TO_DATE(p.entregada,'%e/%c/%Y') < NOW()   and s.empresa_id=e.id_empresa)  ";
	$consulta .= " ) puntuacion ";
        
        $consulta .= " from lasueca.empresa e where app like 'activo' and nombreEmpresa like '%$text%' and e.estado like 'activo' ";
        $consulta .= " and e.id_empresa in (select empresa_id from lasueca.sucursal where ciudad_id=$ciudad and app like 'activo' and estado like 'activo') ";
        $consulta .= " ) a  order by sucursalAbierta desc, posicion asc, puntuacion desc  limit $contador,$cantidad";
            
        $data = $this->CON->consulta2($consulta);
        $consulta = "select count(*) cantidad from (select (e.id_empresa) from lasueca.empresa e where app like 'activo' and nombreEmpresa like '%$text%' and e.estado like 'activo' and e.id_empresa in (select empresa_id from lasueca.sucursal where ciudad_id=$ciudad and app like 'activo' and estado like 'activo')  ) a $where";
        $limiteData = $this->CON->consulta($consulta);
        $limite = $limiteData->fetch_assoc()['cantidad'];
        $resultado = array();
        $resultado["limite"] = $limite;
        $resultado["data"] = $data;
        return $resultado;
    }
   
    function todasEmpresasAPPXcategoria($text,$contador, $cantidad,$id_categoria="",$ciudad) {
        $categoria="";
        if($id_categoria!==""){
            $categoria=" and c.categoriaApp_id=$id_categoria ";
        }
        
      
        $fechaactual = date("d/m/Y");
        $consulta .= " select * from (";
        $consulta .= " select nombreEmpresa,app,appLogo,id_empresa,appFactura,e.posicion";
        $consulta .= "         ,(select count(id_producto) from producto where app like 'activo' and estado like 'activo' and empresa_id=e.id_empresa) cantproducto ";
       
        
        // sucursal
        $consulta .= "  ,(case when ( (select count(s2.id_sucursal) from sucursal s2 ";
        $consulta .= "  where s2.ciudad_id=$ciudad ";
        $consulta .= "  and (SELECT count(id_cerrarAtencion) FROM lasueca.cerraratencion where s2.id_sucursal=sucursal_id and STR_TO_DATE(fecha,'%e/%c/%Y')=CURDATE() and estado like 'activo')=0 ";
        $consulta .= "  and empresa_id=e.id_empresa and estado like 'activo' and app like 'activo' ";
       
        $consulta .= "  and if(s2.tipoAtencion='personalizado', ";
	$consulta .= "  ( ";
	$consulta .= "      select count(id_horarioAtencion)";
        $consulta .= "      from horarioatencion where tipo like 'sucursal' ";
	$consulta .= "  	and WEEKDAY(STR_TO_DATE('$fechaactual','%e/%c/%Y'))=dia";
	$consulta .= "          AND ((NOW() BETWEEN STR_TO_DATE(CONCAT('$fechaactual', horarioDe), '%e/%c/%Y %H:%i:%s') ";
	$consulta .= "          AND STR_TO_DATE(CONCAT('$fechaactual', horarioHasta),'%e/%c/%Y %H:%i:%s'))";
	$consulta .= "          || (NOW() BETWEEN STR_TO_DATE(CONCAT('$fechaactual', horarioDe2),'%e/%c/%Y %H:%i:%s') ";
	$consulta .= "          AND STR_TO_DATE(CONCAT('$fechaactual', horarioHasta2),'%e/%c/%Y %H:%i:%s')))";
	$consulta .= "          and id=s2.id_sucursal) > 0";
        
        $consulta .= "          ,((NOW() BETWEEN STR_TO_DATE(CONCAT('$fechaactual', horarioDe1),'%e/%c/%Y %H:%i:%s')";
	$consulta .= "           AND STR_TO_DATE(CONCAT('$fechaactual', horarioHasta1),'%e/%c/%Y %H:%i:%s'))";
	$consulta .= "           || (NOW() BETWEEN STR_TO_DATE(CONCAT('$fechaactual', horarioDe2),'%e/%c/%Y %H:%i:%s')";
	$consulta .= "           AND STR_TO_DATE(CONCAT('$fechaactual', horarioHasta2),'%e/%c/%Y %H:%i:%s')))";
        $consulta .= " )  ";
        $consulta .= "   )>0) then 1 else 0 end) sucursalAbierta";
        //sucursal
        
        
        $consulta .= " ,( ";
	$consulta .= " (select count(id_pedidoApp) cant from lasueca.pedidoApp p,lasueca.sucursal s   where p.estado like 'entregado' and s.id_sucursal=p.sucursal_id and STR_TO_DATE(p.entregada,'%e/%c/%Y') < NOW() and s.empresa_id=e.id_empresa) -  ";
	$consulta .= " (select count(id_pedidoApp)*3 cant from lasueca.pedidoApp p,lasueca.sucursal s   where p.estado like 'cancelado' and s.id_sucursal=p.sucursal_id  and STR_TO_DATE(p.entregada,'%e/%c/%Y') < NOW()   and s.empresa_id=e.id_empresa)  ";
	$consulta .= " ) puntuacion ";
        
        $consulta .= " from lasueca.empresa e, lasueca.empresaCategoriaApp c where app like 'activo' and nombreEmpresa like '%$text%' and e.estado like 'activo' $categoria and e.id_empresa=c.empresa_id";
        $consulta .= " and e.id_empresa in (select empresa_id from lasueca.sucursal where  estado like 'activo' and app like 'activo')";
        $consulta .= " ) a   order by (case when sucursalAbierta>0 then 1 else 0 end) desc,posicion asc, puntuacion desc,id_empresa asc limit $contador,$cantidad";
            
        
        
        $data = $this->CON->consulta2($consulta);
        $consulta = " select count(a.id_empresa) cantidad from (";
        $consulta .= " select ";
        $consulta .= "     e.id_empresa";
        $consulta .= " from lasueca.empresa e, lasueca.empresaCategoriaApp c where app like 'activo' and nombreEmpresa like '%$text%' and e.estado like 'activo' $categoria and e.id_empresa=c.empresa_id";
        $consulta .= " and e.id_empresa in (select empresa_id from lasueca.sucursal where estado like 'activo' and app like 'activo')";
        $consulta .= " ) a ";
        $limiteData = $this->CON->consulta($consulta);
        $limite = $limiteData->fetch_assoc()['cantidad'];
        $resultado = array();
        $resultado["limite"] = $limite;
        $resultado["data"] = $data;
        return $resultado;
    }

    function buscarEnAPP() {
        $consulta = "select * from lasueca.empresa where app like 'activo'";
        return $this->CON->consulta2($consulta);
    }

    function cantidadAPP($ciudad) {
        $consulta = "select count(id_empresa) cant from lasueca.empresa where app like 'activo' and estado like 'activo' and id_empresa in (select empresa_id from lasueca.sucursal where ciudad_id=$ciudad and app like 'activo' and estado like 'activo')";
        $cantidad = $this->CON->consulta2($consulta)[0]['cant'];
        return $cantidad;
    }

    function configuracionXidempresa() {
        $consulta = "select c.configuracion_id from lasueca.empresa e, lasueca.configuracionempresa c where e.id_empresa=c.empresa_id and e.id_empresa=" . $this->CON->empresa_id;
        return $this->CON->consulta2($consulta);
    }

    function generarCodigo($tipo) {
        $consulta = "select codigoProducto,codigoAlmacen, codigoUsuario , codigoCliente from lasueca.empresa where id_empresa=" . $this->CON->empresa_id;
        $resultado = $this->CON->consulta2($consulta)[0];
        $producto = $resultado["codigoProducto"];
        $usuario = $resultado["codigoUsuario"];
        $cliente = $resultado["codigoCliente"];
        $almacen = $resultado["codigoAlmacen"];
        $producto = $producto === "" ? 0 : $producto;
        $usuario = $usuario === "" ? 0 : $usuario;
        $cliente = $cliente === "" ? 0 : $cliente;
        $almacen = $almacen === "" ? 0 : $almacen;
        $codigo = 0;
        if ($tipo === "producto") {
            $producto = $producto + 1;
            $codigo = $producto;
            $consulta = "UPDATE lasueca.empresa SET codigoProducto = '$producto'  WHERE id_empresa =" . $this->CON->empresa_id;
            if (!$this->CON->manipular($consulta)) {
                return -1;
            }
        }
        if ($tipo === "almacen") {
            $almacen = $almacen + 1;
            $codigo = $almacen;
            $consulta = "UPDATE lasueca.empresa SET codigoAlmacen = '$almacen'  WHERE id_empresa =" . $this->CON->empresa_id;
            if (!$this->CON->manipular($consulta)) {
                return -1;
            }
        }
        if ($tipo === "cliente") {
            $cliente = $cliente + 1;
            $codigo = $cliente;
            $consulta = "UPDATE lasueca.empresa SET codigoCliente = '$cliente'  WHERE id_empresa =" . $this->CON->empresa_id;
            if (!$this->CON->manipular($consulta)) {
                return -1;
            }
        }
        if ($tipo === "usuario") {
            $usuario = $usuario + 1;
            $codigo = $usuario;
            $consulta = "UPDATE lasueca.empresa SET codigoUsuario = '$usuario'  WHERE id_empresa =" . $this->CON->empresa_id;
            if (!$this->CON->manipular($consulta)) {
                return -1;
            }
        }
        return $codigo;
    }

    function tieneConfiguracion($id_configuracion) {
        $consulta = "select count(c.configuracion_id) cant from lasueca.empresa e, lasueca.configuracionempresa c where e.id_empresa=c.empresa_id and c.configuracion_id=$id_configuracion and e.id_empresa=" . $this->CON->empresa_id;
        return $this->CON->consulta2($consulta)[0]['cant'];
    }
    
    function buscarEmpresas($text,$app,$ciudad,$contador) {
        $estado="";
        if($app!==""){
            $estado="  and app like '$app' ";    
        }
        $ciudadStr="";
        if($ciudad!==""){
            $ciudadStr=" and e.ciudad_id=$ciudad ";
        }
        $consulta = "SELECT e.id_empresa,e.app,e.nombreEmpresa,e.registrado,e.telefono,e.aprobado,appFactura ,(select count(*) from lasueca.sucursal where empresa_id=e.id_empresa) sucursal ,(select count(*) from lasueca.producto where empresa_id=e.id_empresa) producto FROM lasueca.empresa e where nombreEmpresa like '%$text%' $estado  $ciudadStr limit $contador,60";
        $data = $this->CON->consulta2($consulta);
        $consulta = "SELECT count(e.id_empresa) cantidad  FROM lasueca.empresa e where nombreEmpresa like '%$text%' $estado $ciudadStr";
        $limiteData = $this->CON->consulta($consulta);
        $limite = $limiteData->fetch_assoc()['cantidad'];
        $resultado = array();
        $resultado["limite"] = $limite;
        $resultado["data"] = $data;
        return $resultado;
    }

    function insertar() {
        $fechaactual = date("d/m/Y H:i:s");
        $consulta = "INSERT INTO lasueca.empresa(id_empresa,nombreEmpresa,estado,tipoCambio,firmaCobranza1,firmaCobranza2,firmaNotaVenta1,firmaNotaVenta2,firmaNotaVenta3,firmaNotaVenta4,firmaNotaCompra1,firmaNotaCompra2,firmaNotaCompra3,firmaNotaCompra4,app,appLogo,aprobado,empresaADM,registrado,telefono,ciudad_id,comision,posicion,delivery,tarifaDelivery)VALUES('$this->id_empresa','$this->nombreEmpresa','$this->estado','$this->tipoCambio','$this->firmaCobranza1','$this->firmaCobranza2','$this->firmaNotaVenta1','$this->firmaNotaVenta2','$this->firmaNotaVenta3','$this->firmaNotaVenta4','$this->firmaNotaCompra1','$this->firmaNotaCompra2','$this->firmaNotaCompra3','$this->firmaNotaCompra4','$this->app','$this->appLogo','inactivo','Cliente','$fechaactual','$this->telefono',$this->ciudad_id,$this->comision,777,'emprendedor','emprendedor');";
        if (!$this->CON->manipular($consulta)) {
            return false;
        }
        $consulta = "SELECT LAST_INSERT_ID() as id";
        $this->id_empresa = $this->CON->consulta2($consulta)[0]['id'];
        return true;
    }

}

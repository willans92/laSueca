<?php

class Sucursal {

    var $id_sucursal;
    var $nombre;
    var $telefono;
    var $nit;
    var $direccion;
    var $correo;
    var $logo;
    var $documentoVenta;
    var $estructuraDocumentoVenta;
    var $estado ;
    var $empresa_id ;
    var $pais ;
    var $ciudad_id;
    var $horarioDe1;
    var $horarioHasta1;
    var $horarioDe2;
    var $horarioHasta2;
    var $app;
    var $lon;
    var $lat;
    var $tokenFirebase;
    var $tipoAtencion;
    var $CON;

    function __construct($con) {
        $this->CON = $con;
    }

    function contructor($id_sucursal, $nombre, $telefono, $nit, $direccion,  $correo, $logo, $documentoVenta
            ,$estructuraDocumentoVenta,$estado,$pais, $ciudad_id, $horarioDe1, $horarioHasta1, $horarioDe2
            , $horarioHasta2, $app, $lon ,$lat, $tipoAtencion="diario") {
        $this->id_sucursal = $id_sucursal;
        $this->pais = $pais;
        $this->nombre = $nombre;
        $this->documentoVenta = $documentoVenta;
        $this->logo = $logo;
        $this->correo = $correo;
        $this->estructuraDocumentoVenta = $estructuraDocumentoVenta;
        $this->telefono = $telefono;
        $this->nit = $nit;
        $this->direccion = $direccion;
        $this->estado = $estado;
        $this->ciudad_id=$ciudad_id;
        $this->horarioDe1=$horarioDe1;
        $this->horarioHasta1=$horarioHasta1;
        $this->horarioDe2=$horarioDe2;
        $this->horarioHasta2=$horarioHasta2;
        $this->app=$app;
        $this->lon=$lon;
        $this->lat=$lat;
        $this->tipoAtencion=$tipoAtencion;
    }

    function todoParaOption($estado) {
        $consulta = "select id_sucursal,nombre from lasueca.sucursal where estado='$estado' and empresa_id=".$this->CON->empresa_id;
        return $this->CON->consulta2($consulta);
    }
    function documentoVentaSucursal($sucursal_id) {
        $consulta = "select documentoVenta from lasueca.sucursal where id_sucursal=$sucursal_id and empresa_id=".$this->CON->empresa_id;
        return $this->CON->consulta2($consulta)[0]["documentoVenta"];
    }
    function todas() {
        $consulta = "select s.id_sucursal,s.empresa_id, s.nombre, s.telefono, s.nit, s.direccion,  s.correo, s.logo, s.documentoVenta,s.estructuraDocumentoVenta ,s.estado,s.pais, s.ciudad_id, s.horarioDe1, s.horarioHasta1, s.horarioDe2, s.horarioHasta2, s.app, s.lon ,s.lat,c.nombre ciudad from lasueca.sucursal s, lasueca.ciudad c where s.ciudad_id=c.id_ciudad and s.empresa_id=".$this->CON->empresa_id."";
        return $this->CON->consulta2($consulta);
    }
    function buscarXid($idsucursal) {
        $consulta = "select s.tipoAtencion, s.id_sucursal,s.empresa_id, s.nombre, s.telefono, s.nit, s.direccion,  s.correo, s.logo, s.documentoVenta,s.estructuraDocumentoVenta ,s.estado,s.pais, s.ciudad_id, s.horarioDe1, s.horarioHasta1, s.horarioDe2, s.horarioHasta2, s.app, s.lon ,s.lat,c.nombre ciudad from lasueca.sucursal s, lasueca.ciudad c where s.ciudad_id=c.id_ciudad and s.id_sucursal=$idsucursal ";
        return $this->CON->consulta2($consulta)[0];
    }
    function buscarXEmpresa($idempresa) {
        $consulta = "select s.id_sucursal, s.telefono,s.nombre,s.estado, s.tipoAtencion, s.app from lasueca.sucursal s where s.empresa_id=".$idempresa;
        return $this->CON->consulta2($consulta);
    }
    function buscarTokenXidSucursal($idsucursal) {
        $consulta = "select tokenFirebase from lasueca.sucursal where id_sucursal=$idsucursal";
        $respuesta=$this->CON->consulta2($consulta);
        if(count($respuesta)>0){
            $dato=$respuesta[0];
            return $dato["tokenFirebase"];
        }
        return "";
    }
    function buscarXidempresaApp($id_empresa) {
        $fechaactual = date("d/m/Y");
        
        $consultaSuc = " and (case when ( (select count(s2.id_sucursal) from sucursal s2 ";
        $consultaSuc .= "  where s2.id_sucursal=s4.id_sucursal ";
        $consultaSuc .= "  and (SELECT count(id_cerrarAtencion) FROM lasueca.cerraratencion where s2.id_sucursal=sucursal_id and STR_TO_DATE(fecha,'%e/%c/%Y')=CURDATE() and estado like 'activo')=0 ";
        $consultaSuc .= "  and estado like 'activo' and app like 'activo' ";
       
        $consultaSuc .= "  and if(s2.tipoAtencion='personalizado', ";
	$consultaSuc .= "  ( ";
	$consultaSuc .= "      select count(id_horarioAtencion)";
        $consultaSuc .= "      from horarioatencion where tipo like 'sucursal' ";
	$consultaSuc .= "  	and WEEKDAY(STR_TO_DATE('$fechaactual','%e/%c/%Y'))=dia";
	$consultaSuc .= "          AND ((NOW() BETWEEN STR_TO_DATE(CONCAT('$fechaactual', horarioDe), '%e/%c/%Y %H:%i:%s') ";
	$consultaSuc .= "          AND STR_TO_DATE(CONCAT('$fechaactual', horarioHasta),'%e/%c/%Y %H:%i:%s'))";
	$consultaSuc .= "          || (NOW() BETWEEN STR_TO_DATE(CONCAT('$fechaactual', horarioDe2),'%e/%c/%Y %H:%i:%s') ";
	$consultaSuc .= "          AND STR_TO_DATE(CONCAT('$fechaactual', horarioHasta2),'%e/%c/%Y %H:%i:%s')))";
	$consultaSuc .= "          and id=s2.id_sucursal) > 0";
        
        $consultaSuc .= "          ,((NOW() BETWEEN STR_TO_DATE(CONCAT('$fechaactual', horarioDe1),'%e/%c/%Y %H:%i:%s')";
	$consultaSuc .= "           AND STR_TO_DATE(CONCAT('$fechaactual', horarioHasta1),'%e/%c/%Y %H:%i:%s'))";
	$consultaSuc .= "           || (NOW() BETWEEN STR_TO_DATE(CONCAT('$fechaactual', horarioDe2),'%e/%c/%Y %H:%i:%s')";
	$consultaSuc .= "           AND STR_TO_DATE(CONCAT('$fechaactual', horarioHasta2),'%e/%c/%Y %H:%i:%s')))";
        $consultaSuc .= " )  ";
        $consultaSuc .= "   )>0) then true else false end)";
            
        
        
        $consulta = "select id_sucursal,nombre,direccion,lon,lat,horarioDe1,horarioDe2,horarioHasta1,horarioHasta2 from sucursal s4 where estado like 'activo' and app like 'activo' $consultaSuc and empresa_id=".$id_empresa;
        return $this->CON->consulta2($consulta);
    }
    function buscarXestado($estado) {
        $consulta = "select s.tipoAtencion,s.id_sucursal,s.empresa_id, s.nombre, s.telefono, s.nit, s.direccion,  s.correo, s.logo, s.documentoVenta,s.estructuraDocumentoVenta ,s.estado,s.pais, s.ciudad_id, s.horarioDe1, s.horarioHasta1, s.horarioDe2, s.horarioHasta2, s.app, s.lon ,s.lat,c.nombre ciudad from lasueca.sucursal s, lasueca.ciudad c where s.ciudad_id=c.id_ciudad and s.estado='$estado' and s.empresa_id=".$this->CON->empresa_id;
        return $this->CON->consulta2($consulta);
    }
    function insertar() {
        $consulta = "INSERT INTO lasueca.sucursal(id_sucursal,nombre,telefono,nit,direccion,logo,correo,documentoVenta,estructuraDocumentoVenta,estado,empresa_id,pais,ciudad_id,horarioDe1,horarioHasta1, horarioDe2,horarioHasta2, app,lon, lat,tipoAtencion) VALUES ('$this->id_sucursal','$this->nombre','$this->telefono','$this->nit','$this->direccion','$this->logo','$this->correo','$this->documentoVenta','$this->estructuraDocumentoVenta','$this->estado',".$this->CON->empresa_id.",'$this->pais','$this->ciudad_id','$this->horarioDe1','$this->horarioHasta1','$this->horarioDe2','$this->horarioHasta2','$this->app','$this->lon','$this->lat','$this->tipoAtencion')";
        if(!$this->CON->manipular($consulta)){
            return false;
        }
        $consulta="SELECT LAST_INSERT_ID() as id";
        $this->id_sucursal= $this->CON->consulta2($consulta)[0]['id'];
        return true;
    }
    function modificar() {
        $consulta = "UPDATE lasueca.sucursal SET tipoAtencion='$this->tipoAtencion', horarioDe1='$this->horarioDe1',horarioHasta1='$this->horarioHasta1',horarioDe2='$this->horarioDe2',horarioHasta2='$this->horarioHasta2',app='$this->app',lon='$this->lon',lat='$this->lat',pais='$this->pais', ciudad_id='$this->ciudad_id', nombre = '$this->nombre',telefono = '$this->telefono',nit = '$this->nit',direccion = '$this->direccion',logo = '$this->logo',correo = '$this->correo',documentoVenta = '$this->documentoVenta',estructuraDocumentoVenta = '$this->estructuraDocumentoVenta',estado = '$this->estado' WHERE id_sucursal = $this->id_sucursal and empresa_id=".$this->CON->empresa_id."";
        return $this->CON->manipular($consulta);
    }
    function modificarHorarioGPS($tipoAtencion,$horarioDe1,$horarioHasta1,$horarioDe2,$horarioHasta2,$id_sucursal,$lat,$lon) {
        $consulta = "UPDATE lasueca.sucursal SET tipoAtencion='$tipoAtencion', horarioDe1='$horarioDe1',horarioHasta1='$horarioHasta1',horarioDe2='$horarioDe2',horarioHasta2='$horarioHasta2' ,lon='$lon',lat='$lat' WHERE id_sucursal = $id_sucursal";
        return $this->CON->manipular($consulta);
    }
    function modificarToken($idsucursal,$token) {
        $consulta = "UPDATE lasueca.sucursal SET tokenFirebase='$token' WHERE id_sucursal = $idsucursal and empresa_id=".$this->CON->empresa_id."";
        return $this->CON->manipular($consulta);
    }
    function modificarEstadoApp($empresa_id,$idsucursal,$estado,$online,$telefono) {
        
        $consulta = "UPDATE lasueca.sucursal SET estado='$estado', telefono='$telefono',app='$online' WHERE id_sucursal = $idsucursal and empresa_id=$empresa_id";
        return $this->CON->manipular($consulta);
    }
    function modificarLogo($id_sucursal,$logo) {
        $consulta = "UPDATE lasueca.sucursal SET logo = '$logo' WHERE id_sucursal = $id_sucursal and empresa_id=".$this->CON->empresa_id."";
        return $this->CON->manipular($consulta);
    }

}

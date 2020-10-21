<?php

class usuario {

    var $id_usuario;
    var $cuenta;
    var $contrasena;
    var $nombre;
    var $ci;
    var $telefono;
    var $foto;
    var $estado;
    var $sucursal_id;
    var $fechaActualizacion;
    var $fecha_contratado;
    var $direccion;
    var $fecha_retirado;
    var $Perfil_id;
    var $empresa_id;
    var $ciudad_id;
    var $CON;

    function __construct($con) {
        $this->CON = $con;
    }

    function contructor($id_usuario, $cuenta, $contrasena, $nombre, $ci, $telefono, $foto, $estado, $sucursal_id, $fechaActualizacion, $fecha_contratado, $direccion, $fecha_retirado, $Perfil_id,$ciudad_id=0) {
        $this->id_usuario = $id_usuario;
        $this->fecha_retirado = $fecha_retirado;
        $this->cuenta = $cuenta;
        $this->contrasena = $contrasena;
        $this->direccion = $direccion;
        $this->nombre = $nombre;
        $this->ci = $ci;
        $this->telefono = $telefono;
        $this->foto = $foto;
        $this->estado = $estado;
        $this->sucursal_id = $sucursal_id;
        $this->fechaActualizacion = $fechaActualizacion;
        $this->fecha_contratado = $fecha_contratado;
        $this->Perfil_id = $Perfil_id;
        $this->ciudad_id= $ciudad_id;
    }

    function version($nroVersion) {
        $consulta = "SELECT usuario.ciudad_id,usuario.cuenta,usuario.id_usuario ,usuario.nombre ,usuario.ci ,usuario.telefono ,usuario.foto ,usuario.estado ,usuario.sucursal_id	,usuario.fechaActualizacion ,usuario.fecha_contratado ,usuario.direccion ,usuario.fecha_retirado ,usuario.Perfil_id,usuario.empresa_id, version.version FROM lasueca.version,lasueca.usuario where version.nombre ='usuario' and version.version > $nroVersion and  version.empresa_id=".$this->CON->empresa_id."  and usuario.empresa_id=".$this->CON->empresa_id."  and usuario.id_usuario=version.id";
        $resultado = $this->CON->consulta($consulta);
        return $this->CON->rellenarString($resultado);
    }

   

    function todosUsuario($estado) {
        $consulta = "select estado,nombre,id_usuario,Perfil_id,cuenta from lasueca.usuario where estado='$estado' and empresa_id=".$this->CON->empresa_id."";
        return $this->CON->consulta2($consulta);
    }
    function buscartokenAdministrativos($id_ciudad) {
        $consulta = "select  u.tokenFirebase from usuario u,empresa e where e.id_empresa=u.empresa_id and e.empresaADM like '%ADM%' and u.ciudad_id=$id_ciudad and u.estado like 'activo'";
        return $this->CON->consulta2($consulta);
    }
    function todosUsuarioConTokenXsucursal($id_sucursal) {
        $consulta = "SELECT tokenFirebase FROM lasueca.usuario where tokenFirebase is not null and sucursal_id=$id_sucursal";
        return $this->CON->consulta2($consulta);
    }
    function usuarioOption() {
        $consulta = "select nombre,id_usuario from lasueca.usuario where empresa_id=".$this->CON->empresa_id."";
        return $this->CON->consulta2($consulta);
    }

    function buscarPermisoUsuario($idusuario,$tipo) {
        $tipoEmpresa=" and  p.estado like 'activo' ";
        if($tipo==="ADM"){
            $tipoEmpresa="";
        }
        $consulta = "select u.permiso_id,p.CategoriaPermiso_id,p.tipo,p.url,p.titulomenu from lasueca.usuario_permiso u, lasueca.permiso p ,lasueca.usuario u2 where u.usuario_id='$idusuario' $tipoEmpresa and u2.estado like 'activo' and p.id_permiso=u.permiso_id and u2.id_usuario=u.usuario_id and u2.empresa_id=".$this->CON->empresa_id." order by posicion desc";
        return $this->CON->consulta2($consulta);
    }
    function buscarPermisoUsuarioXidpermiso($idusuario,$idpermiso) {
        $consulta = "select count(p.id_permiso) cant from lasueca.usuario_permiso u, lasueca.permiso p ,lasueca.usuario u2 where p.estado like 'activo'  and u.usuario_id='$idusuario' and u2.estado like 'activo' and p.id_permiso=u.permiso_id and p.id_permiso=$idpermiso and u2.id_usuario=u.usuario_id and u2.empresa_id=".$this->CON->empresa_id." order by posicion desc";
        $resultado = $this->CON->consulta($consulta);
        return $resultado->fetch_assoc()['cant'];
    }
    function tienPermisos($idusuario) {
        $consulta = "select count(u.permiso_id) cant from lasueca.usuario_permiso u, lasueca.permiso p where p.estado like 'activo' and p.id_permiso=u.permiso_id and u.usuario_id='$idusuario' order by posicion desc";
        $resultado = $this->CON->consulta($consulta);
        return $resultado->fetch_assoc()['cant'];
    }

    function ultimaVersion() {
        $consulta = "SELECT (version.version+1) version FROM lasueca.version where nombre='usuario' and empresa_id=".$this->CON->empresa_id." order by version desc limit 0,1";
        $resultado = $this->CON->consulta2($consulta);
        if (count($resultado) === 0) {
            return 1;
        } else {
            $nro = $resultado[0]["version"];
            $nro = $nro == 0 || $nro == "" ? 1 : $nro;
            return $nro;
        }
    }
    function modificar($id_usuario) {
        $contrasenatxt = " ,contrasena=SHA2('$this->contrasena', 256)";
        if ($this->contrasena === "") {
            $contrasenatxt = "";
        }
        $consulta = "update lasueca.usuario set ciudad_id=$this->ciudad_id, fecha_retirado ='" . $this->fecha_retirado . "', direccion ='" . $this->direccion . "', id_usuario =" . $this->id_usuario . ", cuenta ='" . $this->cuenta . "' $contrasenatxt , nombre ='" . $this->nombre . "', ci ='" . $this->ci . "', telefono ='" . $this->telefono . "', foto ='" . $this->foto . "', estado ='" . $this->estado . "', sucursal_id =" . $this->sucursal_id . ", fechaActualizacion ='" . $this->fechaActualizacion . "', fecha_contratado ='" . $this->fecha_contratado . "' where empresa_id=".$this->CON->empresa_id." and id_usuario=" . $this->id_usuario;
        return $this->CON->manipular($consulta);
    }

    function modificarCuenta($id_usuario, $cuenta, $contra, $estado, $perfil) {
        $contraStr="";
        if($contra!==""){
            $contraStr=" ,contrasena=SHA2('$contra', 256) ";
        }
        $perfilStr="";
        if($perfil!=="0"){
            $perfilStr=" ,Perfil_id=$perfil ";
        }
        $consulta = "update lasueca.usuario set   cuenta ='$cuenta' $perfilStr $contraStr ,estado ='$estado' where empresa_id=".$this->CON->empresa_id." and id_usuario=$id_usuario";
        return $this->CON->manipular($consulta);
    }
    
    function modificarToken($id_usuario, $token) {
        $consulta = "UPDATE lasueca.usuario SET  tokenFirebase = '$token' WHERE id_usuario = '$id_usuario';";
        return $this->CON->manipular($consulta);
    }
    
    function eliminar($id_usuario) {
        $consulta = "delete from lasueca.usuario where empresa_id=".$this->CON->empresa_id." and id_usuario=" . $id_usuario;
        return $this->CON->manipular($consulta);
    }

    function eliminarXPermisos($idusuario) {
        $consulta = "delete from lasueca.usuario_permiso where usuario_id=$idusuario";
        return $this->CON->manipular($consulta);
    }

    function insertarPermisos($idusuario, $idpermisos) {
        $consulta = "insert into lasueca.usuario_permiso (usuario_id,permiso_id) values ($idusuario,$idpermisos)";
        return $this->CON->manipular($consulta);
    }
    function insertarTodosPermisos($consulta) {
        return $this->CON->manipular($consulta);
    }

    function insertar() {
        $consulta = "INSERT INTO lasueca.usuario(id_usuario,cuenta,contrasena,nombre,ci,telefono,foto,estado,sucursal_id,fecha_contratado,direccion,fecha_retirado,fechaActualizacion,empresa_id,notificacion,ciudad_id)VALUES('$this->id_usuario','$this->cuenta',SHA2('$this->contrasena', 256),'$this->nombre','$this->ci','$this->telefono','$this->foto','$this->estado','$this->sucursal_id','$this->fecha_contratado','$this->direccion','$this->fecha_retirado','$this->fechaActualizacion',".$this->CON->empresa_id.",'activo',$this->ciudad_id)";
        $resultado = $this->CON->manipular($consulta);
        if (!$resultado) {
            return false;
        }
        $consulta = "SELECT LAST_INSERT_ID() as id";
        $resultado = $this->CON->consulta($consulta);
        $this->id_usuario = $resultado->fetch_assoc()['id'];
        return true;
    }

    function existecuenta($cuenta,$id_usuario="") {
        $usuario="";
        if($id_usuario!=="" ){
            $usuario=" and id_usuario!=$id_usuario ";
        }
        $consulta = "select count(*) as cant from lasueca.usuario where cuenta='$cuenta' $usuario";
        $result = $this->CON->consulta($consulta);
        $empresa = $result->fetch_assoc()['cant'];
        return $empresa;
    }

    function logear($cuenta, $contrasena) {
        $consulta = "select count(*) as cant from lasueca.usuario where cuenta like '$cuenta' and contrasena like SHA2('$contrasena', 256)";
        $result = $this->CON->consulta($consulta);
        $empresa = $result->fetch_assoc()['cant'];
        return $empresa;
    }
    function buscarXid($idusuario) {
        $consulta = "select * from lasueca.usuario where empresa_id=".$this->CON->empresa_id." and id_usuario=$idusuario";
        return $this->CON->consulta2($consulta)[0];
    }

    function estadoUsuario($cuenta, $contrasena) {
        $consulta = "select u.ciudad_id ADM_ciudad_id ,u.notificacion,u.id_usuario,e.ciudad_id,u.empresa_id,u.nombre,u.sucursal_id,e.empresaADM,e.nombreempresa from lasueca.usuario u,lasueca.empresa e where u.cuenta='$cuenta' and  u.contrasena=SHA2('$contrasena', 256) and u.estado='ACTIVO' and u.empresa_id=e.id_empresa";
        $resultado = $this->CON->consulta($consulta);
        if ($resultado->num_rows > 0) {
            $row = $resultado->fetch_assoc();
            $usuario = array();
            $usuario["id_usuario"] = $row['id_usuario'] == null ? "" : $row['id_usuario'];
            $usuario["nombre"] = $row['nombre'] == null ? "" : $row['nombre'];
            $usuario["sucursal_id"] = $row['sucursal_id'] == null ? "" : $row['sucursal_id'];
            $usuario["empresa_id"] = $row['empresa_id'] == null ? "" : $row['empresa_id'];
            $usuario["empresaADM"] = $row['empresaADM'] == null ? "" : $row['empresaADM'];
            $usuario["ciudad_id"] = $row['ciudad_id'] == null ? "" : $row['ciudad_id'];
            $usuario["nombreempresa"] = $row['nombreempresa'] == null ? "" : $row['nombreempresa'];
            $usuario["notificacion"] = $row['notificacion'] == null ? "" : $row['notificacion'];
            $usuario["ADM_ciudad_id"] = $row['ADM_ciudad_id'] == null ? "" : $row['ADM_ciudad_id'];
            return $usuario;
        } else {
            return null;
        }
    }
     function modificarNotificacion($id_usuario, $estado) {
        $consulta = "UPDATE lasueca.usuario SET  notificacion = '$estado' WHERE id_usuario = '$id_usuario'";
        return $this->CON->manipular($consulta);
    }

}

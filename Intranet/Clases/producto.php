<?php

class producto {

    var $id_producto;
    var $descripcion;
    var $codigo;
    var $fecha_actualizacion;
    var $foto;
    var $fotoGrande;
    var $marca_id;
    var $codigoBarra;
    var $linea_producto_id;
    var $nombre;
    var $estado;
    var $empresa_id;
    var $app;
    var $posicion;
    var $tipoAtencion;
    var $CON;

    function __construct($con) {
        $this->CON = $con;
    }

    function contructor($id_producto, $descripcion, $codigo, $fecha_actualizacion, $foto, $fotoGrande
            , $marca_id, $linea_producto_id, $codigoBarra, $nombre, $estado, $app, $posicion = 0, $tipoAtencion = "diario") {
        $this->id_producto = $id_producto;
        $this->app = $app;
        $this->descripcion = $descripcion;
        $this->codigo = $codigo;
        $this->codigoBarra = $codigoBarra;
        $this->fecha_actualizacion = $fecha_actualizacion;
        $this->foto = $foto;
        $this->marca_id = $marca_id;
        $this->linea_producto_id = $linea_producto_id;
        $this->nombre = $nombre;
        $this->fotoGrande = $fotoGrande;
        $this->estado = $estado;
        $this->tipoAtencion = $tipoAtencion;
        $this->posicion = $posicion === "" || is_null($posicion) ? 0 : $posicion;
    }

    function todo() {
        $consulta = "select * from lasueca.producto where empresa_id=" . $this->CON->empresa_id;
        $result = $this->CON->consulta($consulta);
        return $this->rellenar($result);
    }

    function buscarXempresa($id_empresa) {
        $consulta = "select id_producto,nombre,foto,app,estado,tipoAtencion ";
        $consulta .= " ,ifnull((select precio from precioventa where producto_id=p.id_producto order by id_precioVenta desc limit 0,1),0) precio";
        $consulta .= " from lasueca.producto p where p.empresa_id=$id_empresa";
        return $this->CON->consulta2($consulta);
    }

    function buscarXid($id_producto) {
        $consulta = "select  *";
        $consulta .= " from lasueca.producto where id_producto=$id_producto";
        return $this->CON->consulta2($consulta)[0];
    }

    function productoMasVendidoHome($id_tienda) {
        $consulta = "select * from ( ";
        $consulta .= " select p.nombre,p.id_producto, p.foto,";
        $consulta .= " (select count(p1.id_pedidoApp) from lasueca.pedidoApp p1, lasueca.detallepedidoapp d1 where p1.estado like 'entregado' and d1.pedidoApp_id=p1.id_pedidoApp and d1.producto_id=p.id_producto) vendido";
        $consulta .= " from lasueca.categoriaproducto_linea l, lasueca.linea_producto lin,lasueca.categoriaproducto c";
        $consulta .= " , lasueca.producto p, lasueca.linea_producto_tienda lp ";
        $consulta .= " where l.linea_producto_id=lin.id_linea_producto ";
        $consulta .= " and l.categoriaProducto_id=c.id_categoriaProducto and p.linea_producto_id=l.linea_producto_id ";
        $consulta .= " and lp.linea_producto_id=l.linea_producto_id and c.estado like 'activo' ";
        $consulta .= " and p.estado like 'activo'  and p.app  like 'activo'  and lp.tienda_id=$id_tienda ";
        $consulta .= " group by p.nombre,p.id_producto, p.foto limit 0,15) a";
        $consulta .= " order by vendido desc , nombre asc, id_producto desc";
        return $this->CON->consulta2($consulta);
    }

    function nuestrosProductosHome($id_tienda, $text, $categoria, $subcategoria, $contador, $cantidad) {
        $strSub="";
        if($subcategoria!="0"){
            $strSub=" and l.linea_producto_id in ($subcategoria) ";
        }
        $strCat="";
        if($categoria!="0"){
            $strCat=" and c.id_categoriaproducto=$categoria ";
        }
        $consulta = " select * from ( ";
        $consulta .= " select p.nombre,p.id_producto, p.foto";
        $consulta .= " ,ifnull((select precio from lasueca.precioventa where producto_id=p.id_producto order by id_precioVenta desc limit 0,1),0) precio";
        $consulta .= " from lasueca.categoriaproducto_linea l,lasueca.categoriaproducto c";
        $consulta .= " , lasueca.producto p, lasueca.linea_producto_tienda lp ";
        $consulta .= " where l.categoriaProducto_id=c.id_categoriaProducto and p.linea_producto_id=l.linea_producto_id ";
        $consulta .= " and lp.linea_producto_id=l.linea_producto_id and c.estado like 'activo' ";
        $consulta .= " and p.estado like 'activo'  and p.app  like 'activo'  ";
        $consulta .= " and lp.tienda_id=$id_tienda and p.nombre like '%$text%' $strCat $strSub";
        $consulta .= " group by p.nombre,p.id_producto, p.foto limit $contador,$cantidad) a";
        $consulta .= " order by id_producto desc";
        $resultado=array();
        $resultado["data"]=$this->CON->consulta2($consulta);
        $consulta = " select a.cant  from ( ";
        $consulta .= " select count(p.id_producto) cant";
        $consulta .= " from lasueca.categoriaproducto_linea l,lasueca.categoriaproducto c";
        $consulta .= " , lasueca.producto p, lasueca.linea_producto_tienda lp ";
        $consulta .= " where l.categoriaProducto_id=c.id_categoriaProducto and p.linea_producto_id=l.linea_producto_id ";
        $consulta .= " and lp.linea_producto_id=l.linea_producto_id and c.estado like 'activo' ";
        $consulta .= " and p.estado like 'activo'  and p.app  like 'activo'  ";
        $consulta .= " and lp.tienda_id=$id_tienda and p.nombre like '%$text%' $strCat $strSub";
        $consulta .= ") a";
        $resultado["limite"]=$this->CON->consulta2($consulta)[0]["cant"];
        return $resultado;
    }

    function productoTienda($id_tienda, $linea, $categoria, $text, $pibote) {
        $consulta .= " select lin.descripcion linea,lin.id_linea_producto,c.nombre categoria,p.nombre,p.codigo ";
        $consulta .= " ,ifnull((select precio from lasueca.precioventa where producto_id=p.id_producto order by id_precioVenta desc limit 0,1),0) precio";
        $consulta .= " ,ifnull((select comision from lasueca.precioventa where producto_id=p.id_producto order by id_precioVenta desc limit 0,1),0) comision";
        $consulta .= " from lasueca.categoriaproducto_linea l, lasueca.linea_producto lin,lasueca.categoriaproducto c, lasueca.producto p, lasueca.linea_producto_tienda lp";
        $consulta .= " where ($linea=0 or  l.linea_producto_id=$linea) and ($categoria=0 or  c.id_categoriaProducto=$categoria) and (p.codigo like '%$text%' or p.nombre like '%$text%')";
        $consulta .= " and l.linea_producto_id=lin.id_linea_producto and l.categoriaProducto_id=c.id_categoriaProducto";
        $consulta .= " and p.linea_producto_id=l.linea_producto_id and lp.linea_producto_id=l.linea_producto_id";
        $consulta .= " and c.estado like 'activo' and p.estado like 'activo'  and p.app  like 'activo'  and lp.tienda_id=$id_tienda limit $pibote,50";
        $resultado = array();
        $resultado["data"] = $this->CON->consulta2($consulta);
        $consulta = " select count(p.id_producto) limite";
        $consulta .= " from lasueca.categoriaproducto_linea l, lasueca.linea_producto lin,lasueca.categoriaproducto c, lasueca.producto p, lasueca.linea_producto_tienda lp";
        $consulta .= " where ($linea=0 or  l.linea_producto_id=$linea) and ($categoria=0 or  c.id_categoriaProducto=$categoria) and (p.codigo like '%$text%' or p.nombre like '%$text%')";
        $consulta .= " and l.linea_producto_id=lin.id_linea_producto and l.categoriaProducto_id=c.id_categoriaProducto";
        $consulta .= " and p.linea_producto_id=l.linea_producto_id and lp.linea_producto_id=l.linea_producto_id";
        $consulta .= " and c.estado like 'activo' and p.estado like 'activo'  and p.app  like 'activo'  and lp.tienda_id=$id_tienda";
        $resultado["limite"] = $this->CON->consulta2($consulta)[0]["limite"];
        return $resultado;
    }

    function version($nroVersion) {
        $consulta = " SELECT p.tipoAtencion,p.descripcion,p.posicion, p.estado, p.id_producto,p.nombre,p.linea_producto_id,p.marca_id,p.codigoBarra,p.codigo , v.version, l.descripcion linea, m.descripcion marca,p.app,p.foto FROM lasueca.version v,lasueca.producto p ,lasueca.marca m , lasueca.linea_producto l where v.nombre ='producto' and v.version > $nroVersion and p.empresa_id=" . $this->CON->empresa_id . "   and v.empresa_id=" . $this->CON->empresa_id . " and p.id_producto=v.id and m.id_marca=p.marca_id and p.linea_producto_id=l.id_linea_Producto ";
        $resultado = $this->CON->consulta($consulta);
        return $this->CON->rellenarString($resultado);
    }

    function historicoProducto($id, $de, $hasta) {
        $consulta = " select a.*,u.nombre from (";
        $consulta .= " select c.id_compra id,c.fecha,c.tipo documento,c.detalle descripcion,c.estado estado ,c.nroDocumento nro, 1 posicion";
        $consulta .= " ,c.usuarioEncargado_id usuario,d.almacen_id,d.cantidad";
        $consulta .= " from lasueca.compra c, lasueca.detallecompra d";
        $consulta .= " where c.empresa_id=" . $this->CON->empresa_id . " and d.producto_id=$id and c.id_compra=d.compra_id and STR_TO_DATE(c.fecha,'%e/%c/%Y') between STR_TO_DATE('$de','%e/%c/%Y') and STR_TO_DATE('$hasta','%e/%c/%Y')  ";
        $consulta .= " group by c.id_compra,c.fecha,c.tipo ,c.detalle ,c.estado ,c.nroDocumento ,c.usuarioEncargado_id ,d.id_detallecompra,d.almacen_id  ";

        $consulta .= " union";

        $consulta .= " select id_venta id,v.fecha,tipoDocumento documento,v.descripcion,v.estado ,if(v.tipoDocumento='Factura',v.nroDocumento,v.nroNota) nro, 5 posicion";
        $consulta .= " ,v.usuario_id usuario,almacen_id,cantidad";
        $consulta .= " FROM lasueca.detalleventa d, lasueca.venta v";
        $consulta .= " where v.empresa_id=" . $this->CON->empresa_id . " and d.producto_id=$id and  d.venta_id=v.id_venta and STR_TO_DATE(v.fecha,'%e/%c/%Y') between STR_TO_DATE('$de','%e/%c/%Y') and STR_TO_DATE('$hasta','%e/%c/%Y')";
        $consulta .= " group by id_venta,v.fecha,tipoDocumento,v.descripcion,v.estado ,v.nroDocumento ,v.usuario_id ,detallecompra_id ,almacen_id,cantidad";
        $consulta .= " union";


        $consulta .= " select t.id_traspasoproducto id, t.fecha, 'Nota de Traspaso Ingreso' documento, t.detalle descripcion, t.estado, nroDocumento nro, 2 posicion,";
        $consulta .= " t.usuarioEncargado usuario,t.almacenDestino almacen_id, d.cantidad";
        $consulta .= " from lasueca.traspasoproducto t, lasueca.detalleTraspasoproducto d";
        $consulta .= " where t.empresa_id=" . $this->CON->empresa_id . " and d.producto_id=$id and t.id_traspasoproducto=d.traspasoproducto_id  and ";
        $consulta .= " STR_TO_DATE(t.fecha,'%e/%c/%Y') between STR_TO_DATE('$de','%e/%c/%Y') and STR_TO_DATE('$hasta','%e/%c/%Y')";
        $consulta .= " group by t.id_traspasoproducto,t.fecha,t.detalle,t.estado ,t.nroDocumento ,t.usuarioEncargado ,t.almacenDestino,d.cantidad";


        $consulta .= " union";


        $consulta .= " select t.id_traspasoproducto id, t.fecha, 'Nota de Traspaso Salida' documento, t.detalle descripcion, t.estado, nroDocumento nro, 3 posicion,";
        $consulta .= " t.usuarioEncargado usuario,t.almacenOrigen almacen_id, d.cantidad";
        $consulta .= " from lasueca.traspasoproducto t, lasueca.detalleTraspasoproducto d";
        $consulta .= " where t.empresa_id=" . $this->CON->empresa_id . " and d.producto_id=$id and t.id_traspasoproducto=d.traspasoproducto_id  and ";
        $consulta .= " STR_TO_DATE(t.fecha,'%e/%c/%Y') between STR_TO_DATE('$de','%e/%c/%Y') and STR_TO_DATE('$hasta','%e/%c/%Y')";
        $consulta .= " group by t.id_traspasoproducto,t.fecha,t.detalle,t.estado ,t.nroDocumento ,t.usuarioEncargado ,t.almacenOrigen,d.cantidad";


        $consulta .= " union";

        $consulta .= " select t.id_ajusteInventario id, t.fecha, 'Nota de Ajuste de Inventario' documento, t.detalle descripcion, t.estado, nroDocumento nro, 4 posicion,";
        $consulta .= " t.usuarioEncargado usuario,t.almacen_id, d.cantidad";
        $consulta .= " from lasueca.ajusteInventario t, lasueca.detalleAjusteInventario d";
        $consulta .= " where t.empresa_id=" . $this->CON->empresa_id . " and d.producto_id=$id and t.id_ajusteInventario=d.ajusteInventario_id  and ";
        $consulta .= " STR_TO_DATE(t.fecha,'%e/%c/%Y') between STR_TO_DATE('$de','%e/%c/%Y') and STR_TO_DATE('$hasta','%e/%c/%Y')";
        $consulta .= "  group by t.id_ajusteInventario,t.fecha,t.detalle,t.estado ,t.nroDocumento ,t.usuarioEncargado ,t.almacen_id,d.cantidad";

        $consulta .= " ) a, lasueca.usuario u";
        $consulta .= " where a.usuario=u.id_usuario and u.empresa_id=" . $this->CON->empresa_id . "";
        $consulta .= " order by STR_TO_DATE(fecha,'%e/%c/%Y') asc, posicion asc, id asc ";
        return $this->CON->consulta2($consulta);
    }

    function ultimaVersion() {
        $consulta = "SELECT (version.version+1) version FROM lasueca.version where nombre='PRODUCTO' and empresa_id=" . $this->CON->empresa_id . " order by version desc limit 0,1";
        $resultado = $this->CON->consulta2($consulta);
        if (count($resultado) === 0) {
            return 1;
        } else {
            $nro = $resultado[0]["version"];
            $nro = $nro == 0 || $nro == "" ? 1 : $nro;
            return $nro;
        }
    }

    function buscarDetalleXID($id) {
        $consulta = "select descripcion,foto,fotoGrande from lasueca.producto where empresa_id=" . $this->CON->empresa_id . " and id_producto=$id";
        $resultado = $this->CON->consulta2($consulta);
        return $resultado[0];
    }

    function buscarProductoxempresaAPP($text, $contador, $cantidad, $id_empresa, $all_estado = false, $solo_enlinea = false) {
        $estado = " and p.estado like 'activo' ";

        $fechaactual = date("d/m/Y");
        $consulta = "select p.marca_id,p.tipoAtencion,p.estado,p.app,p.posicion, p.linea_producto_id,id_producto";
        $consulta .= " ,codigo,foto,nombre,p.descripcion";
        $consulta .= " ,ifnull((select precio from precioventa where producto_id=p.id_producto order by id_precioVenta desc limit 0,1),0) precio ";
        $consulta .= " from lasueca.producto p, lasueca.linea_producto l  ";
        $consulta .= " where p.empresa_id=$id_empresa and (p.codigo like '%$text%' or p.nombre like '%$text%') ";

        if (!$all_estado) {
            $consulta .= " and if(tipoAtencion='personalizado',";
            $consulta .= " (";
            $consulta .= " 	select count(id_horarioAtencion)";
            $consulta .= " 	from horarioatencion";
            $consulta .= " 	where tipo like 'producto' ";
            $consulta .= " 	and WEEKDAY(STR_TO_DATE('$fechaactual','%e/%c/%Y'))=dia";
            $consulta .= " 	AND ((NOW() BETWEEN STR_TO_DATE(CONCAT('$fechaactual', horarioDe),'%e/%c/%Y %H:%i:%s')";
            $consulta .= "   AND STR_TO_DATE(CONCAT('$fechaactual', horarioHasta),'%e/%c/%Y %H:%i:%s'))";
            $consulta .= "   || (NOW() BETWEEN STR_TO_DATE(CONCAT('$fechaactual', horarioDe2),	'%e/%c/%Y %H:%i:%s') ";
            $consulta .= "   AND STR_TO_DATE(CONCAT('$fechaactual', horarioHasta2),'%e/%c/%Y %H:%i:%s')))";
            $consulta .= "   and id=p.id_producto) > 0 ,true) ";
        }

        if ($solo_enlinea) {
            $consulta .= " and app like 'activo' ";
        }
        $consulta .= "  $estado and p.linea_producto_id=l.id_linea_producto order by l.posicion asc, p.posicion asc, p.id_producto asc  limit $contador,$cantidad ";
        $data = $this->CON->consulta2($consulta);
        $consulta = "select count(p.id_producto) cantidad from producto p where empresa_id=$id_empresa and (codigo like '%$text%' or nombre like '%$text%') ";
        $limiteData = $this->CON->consulta($consulta);
        $limite = $limiteData->fetch_assoc()['cantidad'];
        $resultado = array();
        $resultado["limite"] = $limite;
        $resultado["data"] = $data;
        return $resultado;
    }

    function stockXsucursal($idsucursal, $productoAnulados) {
        $suc = "";
        $almacen = "";
        if ($idsucursal !== "0") {
            $suc = "   and v.sucursal_id=$idsucursal ";
            $almacen = " and c.almacen_id in (select id_almacen from lasueca.almacen where sucursal_id=$idsucursal ) ";
        }
        $estado = "";
        if (!$productoAnulados) {
            $estado = " and p.estado like 'activo'";
        }
        $consulta = " SELECT p.id_producto, p.nombre, p.codigo, p.codigoBarra";
        $consulta .= " , (ifnull((select sum(a.cant) cant from (";
        $consulta .= " select sum(d.cantidad)*-1 cant, 5 tipo ";
        $consulta .= " from lasueca.detalleventa d, lasueca.venta v ";
        $consulta .= " where d.producto_id=p.id_producto and v.estado like 'activo' $suc and  d.venta_id=v.id_venta ";
        $consulta .= " union ";
        $consulta .= " select sum(d.cantidad) cant, 4 tipo";
        $consulta .= " from lasueca.detallecompra d, lasueca.compra c ";
        $consulta .= " where d.producto_id=p.id_producto $almacen and c.estado like 'activo' and  d.compra_id=c.id_compra";
        $consulta .= " union ";
        $consulta .= " select sum(d.cantidad) cant, 3 tipo ";
        $consulta .= " from lasueca.ajusteInventario t, lasueca.detalleAjusteInventario d";
        $consulta .= " where d.producto_id=p.id_producto and t.estado like 'activo'  and t.id_ajusteInventario=d.ajusteInventario_id ";
        if ($idsucursal !== "0") {
            $consulta .= " and t.almacen_id in (select id_almacen from lasueca.almacen where sucursal_id=$idsucursal)";
            $consulta .= " union";
            $consulta .= " select sum(d.cantidad) cant, 2 tipo ";
            $consulta .= " from lasueca.traspasoproducto t, lasueca.detalleTraspasoproducto d";
            $consulta .= " where d.producto_id=p.id_producto and t.estado like 'activo' and t.id_traspasoproducto=d.traspasoproducto_id ";
            $consulta .= " and t.almacenDestino in (select id_almacen from lasueca.almacen where sucursal_id=$idsucursal)";
            $consulta .= " union";
            $consulta .= " select sum(d.cantidad)*-1 cant, 2 tipo ";
            $consulta .= " from lasueca.traspasoproducto t, lasueca.detalleTraspasoproducto d";
            $consulta .= " where d.producto_id=p.id_producto and t.estado like 'activo' and t.id_traspasoproducto=d.traspasoproducto_id ";
            $consulta .= " and t.almacenOrigen in (select id_almacen from lasueca.almacen where sucursal_id=$idsucursal)";
        }
        $consulta .= " ) a ),0)) stock  ";
        $consulta .= " , ifnull((SELECT precio FROM lasueca.detallecompra where estado like 'activo' and producto_id=p.id_producto  order by STR_TO_DATE(fecha,'%e/%c/%Y %H:%i:%s') desc, id_detalleCompra desc  limit 0,1),0) precioCompra ";
        $consulta .= " , ifnull((SELECT precio FROM lasueca.precioventa where estado like 'activo' and producto_id=p.id_producto order by STR_TO_DATE(fecha,'%e/%c/%Y %H:%i:%s') desc, id_PrecioVenta desc limit 0,1),0) precioVenta";
        $consulta .= " , ifnull((SELECT comision FROM lasueca.precioventa where estado like 'activo' and producto_id=p.id_producto order by STR_TO_DATE(fecha,'%e/%c/%Y %H:%i:%s') desc, id_PrecioVenta desc limit 0,1),0) comision";
        $consulta .= " , ifnull((SELECT SUBSTRING(fecha , 1, 10) FROM lasueca.detallecompra where estado like 'activo' and producto_id=p.id_producto order by  STR_TO_DATE(fecha,'%e/%c/%Y %H:%i:%s') desc, id_detalleCompra desc limit 0,1),'-') fechaCompra";
        $consulta .= " , ifnull((SELECT SUBSTRING(fecha , 1, 10) FROM lasueca.detalleventa where  estado like 'activo' and producto_id=p.id_producto order by  STR_TO_DATE(fecha,'%e/%c/%Y %H:%i:%s') desc, id_detalleventa desc limit 0,1),'-') fechaVenta";
        $consulta .= " FROM lasueca.producto p where empresa_id=" . $this->CON->empresa_id . " $estado";
        return $this->CON->consulta2($consulta);
    }

    function ultimoprecioCompraXproducto($estado) {
        $est = "";
        if ($estado !== "") {
            $est = " and estado like '$estado' ";
        }
        $consulta = "select id_producto,codigo,codigoBarra,nombre, ifnull((select precio from lasueca.detalleCompra where producto_id=p.id_producto $est order by  STR_TO_DATE(fecha,'%e/%c/%Y') desc,id_detallecompra desc limit 0,1),0) precioCompra from lasueca.producto p where empresa_id=" . $this->CON->empresa_id . "";
        return $this->CON->consulta2($consulta);
    }

    function modificar($id_producto) {
        $consulta = "update lasueca.producto set tipoAtencion='$this->tipoAtencion',posicion=$this->posicion, app='$this->app' , estado='$this->estado' ,codigoBarra ='$this->codigoBarra',nombre ='$this->nombre',id_producto =" . $this->id_producto . ", descripcion ='" . $this->descripcion . "', codigo ='" . $this->codigo . "', fecha_actualizacion ='" . $this->fecha_actualizacion . "', fotoGrande ='" . $this->fotoGrande . "', foto ='" . $this->foto . "', marca_id =" . $this->marca_id . ", linea_producto_id =" . $this->linea_producto_id . " where empresa_id=" . $this->CON->empresa_id . "  and id_producto=" . $id_producto;
        return $this->CON->manipular($consulta);
    }

    function modificarFoto($id_producto, $foto) {
        $consulta = "update lasueca.producto set foto ='" . $foto . "' where empresa_id=" . $this->CON->empresa_id . "  and id_producto=" . $id_producto;
        return $this->CON->manipular($consulta);
    }

    function modificarEstadoApp($id_producto, $empresa_id, $estado, $online, $logo) {
        $logoStr = "";
        if ($logo !== "-") {
            $logoStr = " foto='$logo', ";
        }
        $consulta = "update lasueca.producto set $logoStr estado='" . $estado . "', app='$online' where empresa_id=$empresa_id  and id_producto=$id_producto";
        return $this->CON->manipular($consulta);
    }

    function insertar() {
        $consulta = "insert into lasueca.producto(id_producto, descripcion, codigo, fecha_actualizacion, foto,fotoGrande, marca_id, linea_producto_id,codigoBarra,nombre,estado,empresa_id,app,posicion,tipoAtencion) values(" . $this->id_producto . ",'" . $this->descripcion . "','" . $this->codigo . "','" . $this->fecha_actualizacion . "','" . $this->foto . "','" . $this->fotoGrande . "'," . $this->marca_id . "," . $this->linea_producto_id . ",'" . $this->codigoBarra . "','$this->nombre','$this->estado'," . $this->CON->empresa_id . " ,'$this->app'," . $this->posicion . ",'$this->tipoAtencion')";
        $resultado = $this->CON->manipular($consulta);
        if (!$resultado) {
            return false;
        }
        $consulta = "SELECT LAST_INSERT_ID() as id";
        $resultado = $this->CON->consulta($consulta);
        $this->id_producto = $resultado->fetch_assoc()['id'];
        return true;
    }

}

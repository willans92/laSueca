<?php

class detallePedidoApp {

    var $id_detallePedidoApp;
    var $nota;
    var $cantidad;
    var $precioU;
    var $estado;
    var $montoBillete;
    var $pedidoApp_id;
    var $producto_id;
    var $CON;

    function __construct($con) {
        $this->CON = $con;
    }
    function contructor($id_detallePedidoApp, $nota, $cantidad , $precioU , $estado ,$pedidoApp_id , $producto_id){
        $this->id_detallePedidoApp=$id_detallePedidoApp;
        $this->nota=$nota;
        $this->cantidad=$cantidad;
        $this->precioU=$precioU;
        $this->estado=$estado;
        $this->pedidoApp_id=$pedidoApp_id;
        $this->producto_id=$producto_id;
    }

    function insertar() {
        $consulta = "INSERT INTO lasueca.detallepedidoapp (id_detallePedidoApp,nota,cantidad,precioU,estado,pedidoApp_id,producto_id) VALUES ('$this->id_detallePedidoApp','$this->nota','$this->cantidad','$this->precioU','$this->estado','$this->pedidoApp_id','$this->producto_id');";
         if (!$this->CON->manipular($consulta)) {
            return false;
        }
        $consulta = "SELECT LAST_INSERT_ID() as id";
        $id = $this->CON->consulta2($consulta)[0]['id'];
        $this->id_detallePedidoApp=$id;
        return true;
    }
   
    function buscarxIdpedido($idpedido) {
        $consulta = "select d.*,p.nombre from lasueca.detallepedidoapp d, lasueca.producto p where d.producto_id=p.id_producto and d.pedidoApp_id=$idpedido";
        return $this->CON->consulta2($consulta);
    }
    function pedidosEnCursoXdelyvery($id_delivery) {
        $consulta = "SELECT d.*,p.nombre FROM lasueca.pedidoapp p2, lasueca.detallepedidoapp d , lasueca.producto p WHERE (p2.estado like 'recepcionado' or p2.estado like 'recogiendo pedido'  or p2.estado like 'en camino') and d.producto_id=p.id_producto and p2.id_pedidoApp=d.pedidoApp_id and  delivery_id=$id_delivery";
        return $this->CON->consulta2($consulta);
    }
    function buscarXsucursal($idsucursal) {
        $consulta = "SELECT d.cantidad,d.nota,d.pedidoApp_id,pr.codigo,pr.nombre ";
        $consulta .= " FROM lasueca.pedidoApp p, lasueca.detallepedidoapp d , lasueca.producto pr";
        $consulta .= " where p.id_pedidoapp=d.pedidoapp_id and p.sucursal_id=$idsucursal and pr.id_producto=d.producto_id";
        return $this->CON->consulta2($consulta);
    }

}

<?php

class publicidadApp {

    var $id_publicidadApp;
    var $alias;
    var $texto;
    var $imagen;
    var $colorLetra;
    var $colorFondo;
    var $estado;
    var $tipo;
    var $inicio;
    var $fin;
    var $ciudad_id;
    var $link;
    var $posicion;
    var $CON;

    function __construct($con) {
        $this->CON = $con;
    }

    function contructor($id_publicidadApp, $alias, $texto ,$imagen,$colorLetra
            ,$colorFondo,$estado,$tipo,$inicio, $fin, $ciudad_id, $link, $posicion) {
        $this->id_publicidadApp=$id_publicidadApp;
        $this->alias=$alias;
        $this->texto=$texto;
        $this->imagen=$imagen;
        $this->colorLetra=$colorLetra;
        $this->colorFondo=$colorFondo;
        $this->estado=$estado;
        $this->tipo=$tipo;
        $this->inicio=$inicio;
        $this->fin=$fin;
        $this->ciudad_id=$ciudad_id;
        $this->link=$link;
        $this->posicion=$posicion;
    }

    function buscarXciudad($ciudad_id,$tipo) {
        $consulta = "select * from lasueca.publicidadapp where ciudad_id=$ciudad_id and estado like 'activo' and tipo like '$tipo' ";
        return $this->CON->consulta2($consulta);
    }

    function modificar() {
        $consulta = "UPDATE lasueca.publicidadapp SET id_publicidadApp = '$this->id_publicidadApp',alias = '$this->alias',texto = '$this->texto',imagen = '$this->imagen',colorLetra = '$this->colorLetra',colorFondo = '$this->colorFondo',estado = '$this->estado',tipo = '$this->tipo',inicio = '$this->inicio',fin = '$this->fin',ciudad_id = '$this->ciudad_id' WHERE id_publicidadApp = $this->id_publicidadApp";
        return $this->CON->manipular($consulta);
    }

    function insertar() {
        $consulta = "INSERT INTO lasueca.publicidadapp(id_publicidadApp,alias,texto,imagen,colorLetra,colorFondo,estado,tipo,inicio,fin,ciudad_id) VALUES ('$this->id_publicidadApp','$this->alias','$this->texto','$this->imagen','$this->colorLetra','$this->colorFondo','$this->estado','$this->tipo','$this->inicio','$this->fin','$this->ciudad_id')";
        return $this->CON->manipular($consulta);
    }

}

CREATE DATABASE  IF NOT EXISTS `lasueca` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `lasueca`;
-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: lasueca
-- ------------------------------------------------------
-- Server version	8.0.19

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ajusteinventario`
--

DROP TABLE IF EXISTS `ajusteinventario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ajusteinventario` (
  `id_ajusteInventario` int NOT NULL AUTO_INCREMENT,
  `nroDocumento` int DEFAULT NULL,
  `detalle` varchar(400) DEFAULT NULL,
  `fecha` varchar(45) DEFAULT NULL,
  `fechaActualizado` varchar(45) DEFAULT NULL,
  `estado` varchar(45) DEFAULT NULL,
  `usuarioEncargado` int NOT NULL,
  `usuarioActualizo` int NOT NULL,
  `almacen_id` int NOT NULL,
  `empresa_id` int NOT NULL,
  PRIMARY KEY (`id_ajusteInventario`),
  KEY `fk_ajusteInventario_usuario1_idx` (`usuarioEncargado`),
  KEY `fk_ajusteInventario_usuario2_idx` (`usuarioActualizo`),
  KEY `fk_ajusteInventario_almacen1_idx` (`almacen_id`),
  KEY `fk_ajusteInventario_empresa1_idx` (`empresa_id`),
  CONSTRAINT `fk_ajusteInventario_almacen1` FOREIGN KEY (`almacen_id`) REFERENCES `almacen` (`id_almacen`),
  CONSTRAINT `fk_ajusteInventario_empresa1` FOREIGN KEY (`empresa_id`) REFERENCES `empresa` (`id_empresa`),
  CONSTRAINT `fk_ajusteInventario_usuario1` FOREIGN KEY (`usuarioEncargado`) REFERENCES `usuario` (`id_usuario`),
  CONSTRAINT `fk_ajusteInventario_usuario2` FOREIGN KEY (`usuarioActualizo`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ajusteinventario`
--

LOCK TABLES `ajusteinventario` WRITE;
/*!40000 ALTER TABLE `ajusteinventario` DISABLE KEYS */;
/*!40000 ALTER TABLE `ajusteinventario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `almacen`
--

DROP TABLE IF EXISTS `almacen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `almacen` (
  `id_almacen` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(200) DEFAULT NULL,
  `direccion` varchar(300) DEFAULT NULL,
  `telefono` varchar(150) DEFAULT NULL,
  `posicion` int DEFAULT NULL,
  `estado` varchar(45) DEFAULT NULL,
  `codigo` varchar(300) DEFAULT NULL,
  `sucursal_id` int NOT NULL,
  `usuarioActualizo_id` int NOT NULL,
  `FechaActualizacion` varchar(45) DEFAULT NULL,
  `empresa_id` int NOT NULL,
  PRIMARY KEY (`id_almacen`,`empresa_id`),
  KEY `fk_almacen_sucursal1_idx` (`sucursal_id`),
  KEY `fk_almacen_usuario1_idx` (`usuarioActualizo_id`),
  KEY `fk_almacen_empresa1_idx` (`empresa_id`),
  CONSTRAINT `fk_almacen_empresa1` FOREIGN KEY (`empresa_id`) REFERENCES `empresa` (`id_empresa`),
  CONSTRAINT `fk_almacen_sucursal1` FOREIGN KEY (`sucursal_id`) REFERENCES `sucursal` (`id_sucursal`),
  CONSTRAINT `fk_almacen_usuario1` FOREIGN KEY (`usuarioActualizo_id`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=352 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `almacen`
--

LOCK TABLES `almacen` WRITE;
/*!40000 ALTER TABLE `almacen` DISABLE KEYS */;
INSERT INTO `almacen` VALUES (43,'Almacén Casa Matriz','Av. Tarija equina Warnes','75685675',0,'activo','1',63,149,'31/05/2020 15:20:05',87),(351,'Almacen Centro','Av Beni','757575',1,'activo','2',309,149,'08/10/2020 11:29:54',87);
/*!40000 ALTER TABLE `almacen` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `arqueo`
--

DROP TABLE IF EXISTS `arqueo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `arqueo` (
  `id_arqueo` int NOT NULL AUTO_INCREMENT,
  `fechaDe` varchar(45) DEFAULT NULL,
  `fechaHasta` varchar(45) DEFAULT NULL,
  `monto` decimal(10,2) DEFAULT NULL,
  `pagado` decimal(10,2) DEFAULT NULL,
  `vendedor` int NOT NULL,
  `usuario_id` int NOT NULL,
  `estado` varchar(45) DEFAULT NULL,
  `fechaModificado` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_arqueo`),
  KEY `fk_arqueo_usuario1_idx` (`vendedor`),
  KEY `fk_arqueo_usuario2_idx` (`usuario_id`),
  CONSTRAINT `fk_arqueo_usuario1` FOREIGN KEY (`vendedor`) REFERENCES `usuario` (`id_usuario`),
  CONSTRAINT `fk_arqueo_usuario2` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `arqueo`
--

LOCK TABLES `arqueo` WRITE;
/*!40000 ALTER TABLE `arqueo` DISABLE KEYS */;
/*!40000 ALTER TABLE `arqueo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categoriaapp`
--

DROP TABLE IF EXISTS `categoriaapp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categoriaapp` (
  `id_categoriaApp` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(200) DEFAULT NULL,
  `estado` varchar(45) DEFAULT NULL,
  `icono` varchar(200) DEFAULT NULL,
  `color` varchar(45) DEFAULT NULL,
  `posicion` int DEFAULT NULL,
  PRIMARY KEY (`id_categoriaApp`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoriaapp`
--

LOCK TABLES `categoriaapp` WRITE;
/*!40000 ALTER TABLE `categoriaapp` DISABLE KEYS */;
/*!40000 ALTER TABLE `categoriaapp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categoriapermiso`
--

DROP TABLE IF EXISTS `categoriapermiso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categoriapermiso` (
  `id_CategoriaPermiso` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `posicion` varchar(10) DEFAULT NULL,
  `estado` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_CategoriaPermiso`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoriapermiso`
--

LOCK TABLES `categoriapermiso` WRITE;
/*!40000 ALTER TABLE `categoriapermiso` DISABLE KEYS */;
INSERT INTO `categoriapermiso` VALUES (1,'Venta','1','activo'),(2,'Compra','2','activo'),(3,'Bodega','3','activo'),(4,'Administracion','4','inactivo'),(5,'Configuracion','7','activo'),(6,'Cobranza','5','activo'),(7,'Logística','4','inactivo');
/*!40000 ALTER TABLE `categoriapermiso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categoriaproducto`
--

DROP TABLE IF EXISTS `categoriaproducto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categoriaproducto` (
  `id_categoriaProducto` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(300) DEFAULT NULL,
  `foto` varchar(400) DEFAULT NULL,
  `estado` varchar(45) DEFAULT NULL,
  `empresa_id` int DEFAULT NULL,
  `tipo` varchar(45) DEFAULT NULL,
  `posicion` int DEFAULT NULL,
  PRIMARY KEY (`id_categoriaProducto`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoriaproducto`
--

LOCK TABLES `categoriaproducto` WRITE;
/*!40000 ALTER TABLE `categoriaproducto` DISABLE KEYS */;
INSERT INTO `categoriaproducto` VALUES (23,'Electronica','https://images-na.ssl-images-amazon.com/images/G/01/AmazonExports/Fuji/2020/May/Dashboard/Fuji_Dash_PC_1x._SY304_CB431800965_.jpg','inactivo',87,'normal',NULL),(24,'Muebles','http://localhost/laSueca/intranet/Imagen/Categoria/p_24_foto_09_03_2021_10_50_38.png','activo',87,'normal',5),(25,'Belleza','https://marketing4ecommerce.cl/wp-content/uploads/2018/04/productos-de-belleza-min.jpg','activo',87,'normal',2),(26,'Herramienta de Contruccion','https://previews.123rf.com/images/mihalec/mihalec1705/mihalec170500019/77373787-composici%C3%B3n-de-los-%C3%BAtiles-de-la-construcci%C3%B3n-en-concepto-abstracto-del-edificio-del-fondo-met%C3%A1lico-.jpg','activo',87,'normal',3),(27,'Juguetes Sexuales','https://images-na.ssl-images-amazon.com/images/I/61UFn1xyUeL._AC_SX425_.jpg','activo',87,'normal',1),(28,'Articulos de Cocina','https://i1.wp.com/periodistas-es.com/wp-content/uploads/2020/04/cocina-disen%CC%83ada-por-Consentino.jpg?resize=900%2C604&amp;ssl=1','activo',87,'normal',9),(29,'Jugueteria','https://7mejor.top/wp-content/uploads/2019/10/Mejores-Juguetes.jpg','activo',87,'normal',7),(30,'Joyas','https://radiofides.com/es/wp-content/uploads/2017/03/robo-joyas-y-dinero.jpg','activo',87,'normal',0);
/*!40000 ALTER TABLE `categoriaproducto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categoriaproducto_linea`
--

DROP TABLE IF EXISTS `categoriaproducto_linea`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categoriaproducto_linea` (
  `categoriaProducto_id` int NOT NULL,
  `linea_producto_id` int NOT NULL,
  PRIMARY KEY (`categoriaProducto_id`,`linea_producto_id`),
  KEY `fk_categoriaProducto_has_linea_producto_linea_producto1_idx` (`linea_producto_id`),
  KEY `fk_categoriaProducto_has_linea_producto_categoriaProducto1_idx` (`categoriaProducto_id`),
  CONSTRAINT `fk_categoriaProducto_has_linea_producto_categoriaProducto1` FOREIGN KEY (`categoriaProducto_id`) REFERENCES `categoriaproducto` (`id_categoriaProducto`),
  CONSTRAINT `fk_categoriaProducto_has_linea_producto_linea_producto1` FOREIGN KEY (`linea_producto_id`) REFERENCES `linea_producto` (`id_linea_producto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoriaproducto_linea`
--

LOCK TABLES `categoriaproducto_linea` WRITE;
/*!40000 ALTER TABLE `categoriaproducto_linea` DISABLE KEYS */;
INSERT INTO `categoriaproducto_linea` VALUES (23,1143),(24,1143),(25,1143),(26,1143),(27,1143),(30,1143),(30,1144),(25,1145),(27,1145),(29,1145),(24,1146),(25,1146),(26,1146),(27,1147),(29,1147);
/*!40000 ALTER TABLE `categoriaproducto_linea` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cerraratencion`
--

DROP TABLE IF EXISTS `cerraratencion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cerraratencion` (
  `id_cerrarAtencion` int NOT NULL AUTO_INCREMENT,
  `fecha` varchar(45) DEFAULT NULL,
  `estado` varchar(45) DEFAULT NULL,
  `usuario_id` int DEFAULT NULL,
  `sucursal_id` int DEFAULT NULL,
  PRIMARY KEY (`id_cerrarAtencion`)
) ENGINE=InnoDB AUTO_INCREMENT=588 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cerraratencion`
--

LOCK TABLES `cerraratencion` WRITE;
/*!40000 ALTER TABLE `cerraratencion` DISABLE KEYS */;
/*!40000 ALTER TABLE `cerraratencion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ciudad`
--

DROP TABLE IF EXISTS `ciudad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ciudad` (
  `id_ciudad` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(60) DEFAULT NULL,
  `lon` varchar(45) DEFAULT NULL,
  `lat` varchar(45) DEFAULT NULL,
  `estado` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_ciudad`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ciudad`
--

LOCK TABLES `ciudad` WRITE;
/*!40000 ALTER TABLE `ciudad` DISABLE KEYS */;
INSERT INTO `ciudad` VALUES (1,'Santa Cruz','-63.181530','-17.782786','activo'),(2,'Beni','-64.903951','-14.8344891','activo');
/*!40000 ALTER TABLE `ciudad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cliente`
--

DROP TABLE IF EXISTS `cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cliente` (
  `id_cliente` int NOT NULL AUTO_INCREMENT,
  `ci` varchar(45) DEFAULT NULL,
  `nombre` varchar(400) DEFAULT NULL,
  `telefono` varchar(200) DEFAULT NULL,
  `direccion` varchar(400) DEFAULT NULL,
  `foto` longtext,
  `codigo` varchar(50) DEFAULT NULL,
  `limiteCredito` decimal(10,2) DEFAULT NULL,
  `personaContacto` varchar(150) DEFAULT NULL,
  `telefonoContacto` varchar(60) DEFAULT NULL,
  `nit` varchar(45) DEFAULT NULL,
  `razonSocial` varchar(200) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `emailContacto` varchar(150) DEFAULT NULL,
  `descuento` decimal(10,2) DEFAULT NULL,
  `comentario` mediumtext,
  `fechaNacimiento` varchar(45) DEFAULT NULL,
  `descuentoMax` decimal(10,2) DEFAULT NULL,
  `estado` varchar(45) DEFAULT NULL,
  `empresa_id` int NOT NULL,
  `clienteApp_id` int DEFAULT NULL,
  PRIMARY KEY (`id_cliente`,`empresa_id`),
  KEY `fk_cliente_empresa1_idx` (`empresa_id`),
  CONSTRAINT `fk_cliente_empresa1` FOREIGN KEY (`empresa_id`) REFERENCES `empresa` (`id_empresa`)
) ENGINE=InnoDB AUTO_INCREMENT=3636 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cliente`
--

LOCK TABLES `cliente` WRITE;
/*!40000 ALTER TABLE `cliente` DISABLE KEYS */;
INSERT INTO `cliente` VALUES (2619,'0','Sin Nombre','','','','1',0.00,'','','0','Sin Nombre','','',0.00,'','',0.00,NULL,87,0),(3624,'5618956','williams armando montenegro 2','75685675','av bolivar','','',0.00,'','','5618956','williams armando montenegro','','',0.00,'Cliente con Tienda','',0.00,NULL,87,0),(3625,'1111','williams','77777','','','',0.00,'','','1111','williams','','',0.00,'Cliente con Tienda','',0.00,NULL,87,0),(3626,'','williams','75685675','','','APP-williams',0.00,'','','','','','',0.00,'Cliente Creado por la APP','22/02/2021',0.00,NULL,87,3692),(3627,'','juan pedro aguirres','7777777','','','APP-juan pedro aguirres',0.00,'','','','','','',0.00,'Cliente Creado por la APP','22/02/2021',0.00,NULL,87,3690),(3628,'','ggggg','77077177','','','APP-ggggg',0.00,'','','','','','',0.00,'Cliente Creado por la APP','08/03/2021',0.00,NULL,87,3696),(3629,'','asdasd','2323232','','','APP-asdasd',0.00,'','','','','','',0.00,'Cliente Creado por la APP','13/03/2021',0.00,NULL,87,3697),(3630,'','asdasds','2323223','','','APP-asdasds',0.00,'','','','','','',0.00,'Cliente Creado por la APP','14/03/2021',0.00,NULL,87,3698),(3631,'111111','padre 2','7777777','','','',0.00,'','','111111','padre 2','','',0.00,'Cliente con Tienda','',0.00,NULL,87,0),(3632,'2222222','abuelo 2','55555555','','','',0.00,'','','2222222','abuelo 2','','',0.00,'Cliente con Tienda','',0.00,NULL,87,0),(3633,'2638162','gabriel dabura','77077177','calle 123','','',0.00,'','','2638162','gabriel dabura','prueba 123@gmai.com','',0.00,'Cliente con Tienda','',0.00,NULL,87,0),(3634,'','sssssssss','4444444','','','APP-sssssssss',0.00,'','','','','','',0.00,'Cliente Creado por la APP','30/03/2021',0.00,NULL,87,3702),(3635,'','fffff','888888888','','','APP-fffff',0.00,'','','','','','',0.00,'Cliente Creado por la APP','12/04/2021',0.00,NULL,87,3709);
/*!40000 ALTER TABLE `cliente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clienteapp`
--

DROP TABLE IF EXISTS `clienteapp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clienteapp` (
  `id_clienteApp` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(200) DEFAULT NULL,
  `telefono` varchar(45) DEFAULT NULL,
  `correo` varchar(150) DEFAULT NULL,
  `nit` varchar(45) DEFAULT NULL,
  `razonSocial` varchar(200) DEFAULT NULL,
  `facebook_id` varchar(100) DEFAULT NULL,
  `estado` varchar(45) DEFAULT NULL,
  `ciudad_id` int NOT NULL,
  `foto` varchar(400) DEFAULT NULL,
  `tokenFirebase` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id_clienteApp`),
  KEY `fk_clienteApp_ciudad1_idx` (`ciudad_id`),
  CONSTRAINT `fk_clienteApp_ciudad1` FOREIGN KEY (`ciudad_id`) REFERENCES `ciudad` (`id_ciudad`)
) ENGINE=InnoDB AUTO_INCREMENT=3716 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clienteapp`
--

LOCK TABLES `clienteapp` WRITE;
/*!40000 ALTER TABLE `clienteapp` DISABLE KEYS */;
INSERT INTO `clienteapp` VALUES (3690,'gBRIE{','7777777','','','','0','activo',1,'',''),(3691,'aaaaaaaa','2222222','','','','0','activo',1,'',''),(3692,'williams','75685675','','','','0','activo',1,'',''),(3693,'alonso mendoza','78989888','','','','0','activo',1,'',''),(3694,'aaaaa','3333333','','','','0','activo',1,'',''),(3695,'williams montenegro','75684555','','','','0','activo',1,'',''),(3696,'Bart simpson','77077177','','','','0','activo',1,'',''),(3697,'asdasd','2323232','','','','0','activo',1,'',''),(3698,'asdasds','2323223','','','','0','activo',1,'',''),(3701,'williams','7777877','','','','0','activo',1,'',''),(3702,'sssssssss','4444444','','','','0','activo',1,'',''),(3708,'asdasd','232323232','','','','0','activo',1,'',''),(3709,'fffff','888888888','','','','0','activo',1,'',''),(3710,'2222222222','222222222','','','','0','activo',1,'',''),(3714,'1111111111111111','111111111111111','','','','0','activo',1,'',''),(3715,'Hhhhhhhhj','777777777','','','','0','activo',1,'','');
/*!40000 ALTER TABLE `clienteapp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cobranza`
--

DROP TABLE IF EXISTS `cobranza`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cobranza` (
  `id_cobranza` int NOT NULL AUTO_INCREMENT,
  `nroDocumento` int DEFAULT NULL,
  `detalle` varchar(200) DEFAULT NULL,
  `fecha` varchar(45) DEFAULT NULL,
  `fechaModificacion` varchar(45) DEFAULT NULL,
  `cobradoPor` int NOT NULL,
  `modificadoPor` int NOT NULL,
  `sucursal_id` int NOT NULL,
  `metodoPago` varchar(45) DEFAULT NULL,
  `empresa_id` int NOT NULL,
  `estado` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_cobranza`,`empresa_id`),
  KEY `fk_cobranza_usuario1_idx` (`cobradoPor`),
  KEY `fk_cobranza_usuario2_idx` (`modificadoPor`),
  KEY `fk_cobranza_sucursal1_idx` (`sucursal_id`),
  KEY `fk_cobranza_empresa1_idx` (`empresa_id`),
  CONSTRAINT `fk_cobranza_empresa1` FOREIGN KEY (`empresa_id`) REFERENCES `empresa` (`id_empresa`),
  CONSTRAINT `fk_cobranza_sucursal1` FOREIGN KEY (`sucursal_id`) REFERENCES `sucursal` (`id_sucursal`),
  CONSTRAINT `fk_cobranza_usuario1` FOREIGN KEY (`cobradoPor`) REFERENCES `usuario` (`id_usuario`),
  CONSTRAINT `fk_cobranza_usuario2` FOREIGN KEY (`modificadoPor`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=4632 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cobranza`
--

LOCK TABLES `cobranza` WRITE;
/*!40000 ALTER TABLE `cobranza` DISABLE KEYS */;
INSERT INTO `cobranza` VALUES (4618,1,'Cobranza de Listado de cliente','09/10/2020','09/10/2020 00:43:55',149,149,63,'Efectivo',87,'activo'),(4619,2,'Cobranza','09/10/2020 00:44:35','09/10/2020 00:44:35',150,149,63,'Efectivo',87,'activo'),(4621,3,'Cobranza','22/02/2021 08:43:38','22/02/2021 08:43:38',149,149,63,'Efectivo',87,'activo'),(4622,4,'Cobranza','22/02/2021 09:01:30','22/02/2021 09:01:30',149,149,63,'Efectivo',87,'activo'),(4623,5,'Cobranza','22/02/2021 11:39:16','22/02/2021 11:39:16',149,149,63,'Efectivo',87,'activo'),(4624,6,'Cobranza','08/03/2021 10:07:59','08/03/2021 10:07:59',149,149,63,'Efectivo',87,'activo'),(4625,7,'Cobranza','13/03/2021 16:48:43','13/03/2021 16:48:43',149,149,63,'Efectivo',87,'activo'),(4626,8,'Cobranza','14/03/2021 14:24:31','14/03/2021 14:24:31',149,149,63,'Efectivo',87,'activo'),(4627,9,'Cobranza','14/03/2021 14:24:43','14/03/2021 14:24:43',149,149,63,'Efectivo',87,'activo'),(4628,10,'Cobranza','24/03/2021 10:22:54','24/03/2021 10:22:54',149,149,63,'Efectivo',87,'activo'),(4629,11,'Cobranza','26/03/2021 10:35:41','26/03/2021 10:35:41',149,149,63,'Efectivo',87,'activo'),(4630,12,'Cobranza','30/03/2021 11:13:49','30/03/2021 11:13:49',149,149,63,'Efectivo',87,'activo'),(4631,13,'Cobranza','12/04/2021 11:00:13','12/04/2021 11:00:13',149,149,63,'Efectivo',87,'activo');
/*!40000 ALTER TABLE `cobranza` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `compra`
--

DROP TABLE IF EXISTS `compra`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `compra` (
  `id_compra` int NOT NULL AUTO_INCREMENT,
  `Detalle` varchar(500) DEFAULT NULL,
  `NroDocumento` varchar(100) DEFAULT NULL,
  `Autorizacion` varchar(100) DEFAULT NULL,
  `tipo` varchar(45) DEFAULT NULL,
  `fecha` varchar(45) DEFAULT NULL,
  `FechaActualizacion` varchar(45) DEFAULT NULL,
  `tipoPago` varchar(45) DEFAULT NULL,
  `usuarioActualizo_id` int NOT NULL,
  `usuarioEncargado_id` int NOT NULL,
  `almacen_id` int NOT NULL,
  `provedor_id` int NOT NULL,
  `tipoCambio` decimal(10,2) DEFAULT NULL,
  `codigoControl` varchar(70) DEFAULT NULL,
  `descuento` decimal(10,2) DEFAULT NULL,
  `empresa_id` int NOT NULL,
  `estado` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_compra`,`almacen_id`,`empresa_id`),
  KEY `fk_compra_usuario1_idx` (`usuarioActualizo_id`),
  KEY `fk_compra_usuario2_idx` (`usuarioEncargado_id`),
  KEY `fk_compra_almacen1_idx` (`almacen_id`),
  KEY `fk_compra_provedor1_idx` (`provedor_id`),
  KEY `fk_compra_empresa1_idx` (`empresa_id`),
  CONSTRAINT `fk_compra_almacen1` FOREIGN KEY (`almacen_id`) REFERENCES `almacen` (`id_almacen`),
  CONSTRAINT `fk_compra_empresa1` FOREIGN KEY (`empresa_id`) REFERENCES `empresa` (`id_empresa`),
  CONSTRAINT `fk_compra_provedor1` FOREIGN KEY (`provedor_id`) REFERENCES `provedor` (`id_provedor`),
  CONSTRAINT `fk_compra_usuario1` FOREIGN KEY (`usuarioActualizo_id`) REFERENCES `usuario` (`id_usuario`),
  CONSTRAINT `fk_compra_usuario2` FOREIGN KEY (`usuarioEncargado_id`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=358 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `compra`
--

LOCK TABLES `compra` WRITE;
/*!40000 ALTER TABLE `compra` DISABLE KEYS */;
INSERT INTO `compra` VALUES (357,'Compra Documento','1','','Nota de Compra','01/04/2021 16:09:08','01/04/2021 16:09:08','Contado',149,149,43,279,6.96,'',NULL,87,'activo');
/*!40000 ALTER TABLE `compra` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `configuracion`
--

DROP TABLE IF EXISTS `configuracion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `configuracion` (
  `id_configuracion` int NOT NULL AUTO_INCREMENT,
  `detalle` varchar(500) DEFAULT NULL,
  `estado` varchar(45) DEFAULT NULL,
  `configuracion_id` int DEFAULT NULL,
  PRIMARY KEY (`id_configuracion`),
  KEY `fk_configuracion_configuracion1_idx` (`configuracion_id`),
  CONSTRAINT `fk_configuracion_configuracion1` FOREIGN KEY (`configuracion_id`) REFERENCES `configuracion` (`id_configuracion`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `configuracion`
--

LOCK TABLES `configuracion` WRITE;
/*!40000 ALTER TABLE `configuracion` DISABLE KEYS */;
INSERT INTO `configuracion` VALUES (1,'¿La empresa maneja productos con caducidad o lotes?','activo',NULL),(2,'¿La factura tamaño carta se imprimirá con la fecha de vencimiento del producto?','activo',1),(3,'¿La factura tamaño carta se imprimirá con el número de lote del producto?','activo',1),(4,'¿Al realizar una venta, se podrá vender con stock negativo el producto?','activo',NULL),(5,'¿Al realizar una nueva venta facturada, imprimir nota de venta?','activo',NULL),(6,'¿Al realizar una nueva venta facturada o nota de venta, imprimir su documento de cobranza?','activo',NULL),(7,'¿Al realizar una nueva venta por defecto el monto cobrado será el 100% de la venta?','activo',NULL),(8,'¿La empresa realiza la entrega de productos, posterior a la venta?','activo',NULL),(9,'¿Al registrar una nueva compra, imprimir nota de recepción de compra?','activo',NULL),(10,'¿Al crear un nuevo producto generar código automáticamente?','activo',NULL),(11,'¿Al crear un nuevo cliente generar código automáticamente?','activo',NULL),(12,'¿Al crear un nuevo usuario generar código automáticamente?','inactivo',NULL),(13,'¿Al crear un nuevo almacén generar código automáticamente?','activo',NULL);
/*!40000 ALTER TABLE `configuracion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `configuracionempresa`
--

DROP TABLE IF EXISTS `configuracionempresa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `configuracionempresa` (
  `configuracion_id` int NOT NULL,
  `empresa_id` int NOT NULL,
  PRIMARY KEY (`configuracion_id`,`empresa_id`),
  KEY `fk_configuracion_has_empresa_empresa1_idx` (`empresa_id`),
  KEY `fk_configuracion_has_empresa_configuracion1_idx` (`configuracion_id`),
  CONSTRAINT `fk_configuracion_has_empresa_configuracion1` FOREIGN KEY (`configuracion_id`) REFERENCES `configuracion` (`id_configuracion`),
  CONSTRAINT `fk_configuracion_has_empresa_empresa1` FOREIGN KEY (`empresa_id`) REFERENCES `empresa` (`id_empresa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `configuracionempresa`
--

LOCK TABLES `configuracionempresa` WRITE;
/*!40000 ALTER TABLE `configuracionempresa` DISABLE KEYS */;
INSERT INTO `configuracionempresa` VALUES (4,87);
/*!40000 ALTER TABLE `configuracionempresa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `delivery`
--

DROP TABLE IF EXISTS `delivery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `delivery` (
  `id_delivery` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(200) DEFAULT NULL,
  `cuenta` varchar(45) DEFAULT NULL,
  `contrasena` varchar(400) DEFAULT NULL,
  `tipo` varchar(45) DEFAULT NULL,
  `estado` varchar(45) DEFAULT NULL,
  `registrado` varchar(45) DEFAULT NULL,
  `telefono` varchar(45) DEFAULT NULL,
  `tokenFirebase` varchar(200) DEFAULT NULL,
  `notificacion` varchar(45) DEFAULT NULL,
  `ciudad_id` int NOT NULL,
  `direccion` varchar(400) DEFAULT NULL,
  `registradoPor` int DEFAULT NULL,
  `ci` varchar(45) DEFAULT NULL,
  `limitePedidos` int DEFAULT NULL,
  `limiteCurrier` int DEFAULT NULL,
  `afiliado` varchar(45) DEFAULT NULL,
  `empresa_id` int DEFAULT NULL,
  PRIMARY KEY (`id_delivery`),
  KEY `fk_delivery_ciudad1_idx` (`ciudad_id`),
  CONSTRAINT `fk_delivery_ciudad1` FOREIGN KEY (`ciudad_id`) REFERENCES `ciudad` (`id_ciudad`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `delivery`
--

LOCK TABLES `delivery` WRITE;
/*!40000 ALTER TABLE `delivery` DISABLE KEYS */;
/*!40000 ALTER TABLE `delivery` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalleajusteinventario`
--

DROP TABLE IF EXISTS `detalleajusteinventario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalleajusteinventario` (
  `id_detalleAjusteInventario` int NOT NULL AUTO_INCREMENT,
  `ajusteInventario_id` int NOT NULL,
  `producto_id` int NOT NULL,
  `cantidad` int DEFAULT NULL,
  `estado` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_detalleAjusteInventario`),
  KEY `fk_detalleAjusteInventario_AjusteInventario1_idx` (`ajusteInventario_id`),
  KEY `fk_detalleAjusteInventario_producto1_idx` (`producto_id`),
  CONSTRAINT `fk_detalleAjusteInventario_ajusteInventario1` FOREIGN KEY (`ajusteInventario_id`) REFERENCES `ajusteinventario` (`id_ajusteInventario`),
  CONSTRAINT `fk_detalleAjusteInventario_producto1` FOREIGN KEY (`producto_id`) REFERENCES `producto` (`id_producto`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalleajusteinventario`
--

LOCK TABLES `detalleajusteinventario` WRITE;
/*!40000 ALTER TABLE `detalleajusteinventario` DISABLE KEYS */;
/*!40000 ALTER TABLE `detalleajusteinventario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detallearqueo`
--

DROP TABLE IF EXISTS `detallearqueo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detallearqueo` (
  `arqueo_id` int NOT NULL,
  `venta_id` int NOT NULL,
  `monto` decimal(10,2) DEFAULT NULL,
  KEY `fk_detalleArqueo_venta1_idx` (`venta_id`),
  KEY `fk_detalleArqueo_arqueo1` (`arqueo_id`),
  CONSTRAINT `fk_detalleArqueo_arqueo1` FOREIGN KEY (`arqueo_id`) REFERENCES `arqueo` (`id_arqueo`),
  CONSTRAINT `fk_detalleArqueo_venta1` FOREIGN KEY (`venta_id`) REFERENCES `venta` (`id_venta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detallearqueo`
--

LOCK TABLES `detallearqueo` WRITE;
/*!40000 ALTER TABLE `detallearqueo` DISABLE KEYS */;
/*!40000 ALTER TABLE `detallearqueo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detallecobranza`
--

DROP TABLE IF EXISTS `detallecobranza`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detallecobranza` (
  `id_detalleCobranza` int NOT NULL AUTO_INCREMENT,
  `cobranza_id` int NOT NULL,
  `venta_id` int DEFAULT NULL,
  `monto` decimal(10,4) DEFAULT NULL,
  `detalle` varchar(250) DEFAULT NULL,
  `estado` varchar(45) DEFAULT NULL,
  `planprestamo_id` int DEFAULT NULL,
  PRIMARY KEY (`id_detalleCobranza`),
  KEY `fk_detalleCobranza_Cobranza1_idx` (`cobranza_id`),
  KEY `fk_detalleCobranza_venta1_idx` (`venta_id`),
  KEY `fk_detallecobranza_planprestamo1_idx` (`planprestamo_id`),
  CONSTRAINT `fk_detalleCobranza_Cobranza1` FOREIGN KEY (`cobranza_id`) REFERENCES `cobranza` (`id_cobranza`),
  CONSTRAINT `fk_detallecobranza_planprestamo1` FOREIGN KEY (`planprestamo_id`) REFERENCES `planprestamo` (`id_planprestamo`),
  CONSTRAINT `fk_detalleCobranza_venta1` FOREIGN KEY (`venta_id`) REFERENCES `venta` (`id_venta`)
) ENGINE=InnoDB AUTO_INCREMENT=5013 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detallecobranza`
--

LOCK TABLES `detallecobranza` WRITE;
/*!40000 ALTER TABLE `detallecobranza` DISABLE KEYS */;
INSERT INTO `detallecobranza` VALUES (4999,4618,4750,10.0000,'Pago Parcial','activo',NULL),(5000,4619,4757,10.0000,'Se cobro al realizar la venta','activo',NULL),(5002,4621,4763,805.0000,'Se cobro al realizar la venta','activo',NULL),(5003,4622,4765,260.0000,'Se cobro al realizar la venta','activo',NULL),(5004,4623,4766,265.0000,'Se cobro al realizar la venta','activo',NULL),(5005,4624,4767,425.0000,'Se cobro al realizar la venta','activo',NULL),(5006,4625,4768,200.0000,'Se cobro al realizar la venta','activo',NULL),(5007,4626,4769,200.0000,'Se cobro al realizar la venta','activo',NULL),(5008,4627,4770,200.0000,'Se cobro al realizar la venta','activo',NULL),(5009,4628,4771,1500.0000,'Se cobro al realizar la venta','activo',NULL),(5010,4629,4772,1500.0000,'Se cobro al realizar la venta','activo',NULL),(5011,4630,4773,185.0000,'Se cobro al realizar la venta','activo',NULL),(5012,4631,4774,810.0000,'Se cobro al realizar la venta','activo',NULL);
/*!40000 ALTER TABLE `detallecobranza` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detallecompra`
--

DROP TABLE IF EXISTS `detallecompra`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detallecompra` (
  `id_detalleCompra` int NOT NULL AUTO_INCREMENT,
  `cantidad` int DEFAULT NULL,
  `precio` decimal(10,5) DEFAULT NULL,
  `compra_id` int NOT NULL,
  `almacen_id` int NOT NULL,
  `producto_id` int NOT NULL,
  `fechaActualizacion` varchar(45) DEFAULT NULL,
  `fecha` varchar(45) DEFAULT NULL,
  `estado` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_detalleCompra`,`almacen_id`),
  KEY `fk_detalleCompra_compra1_idx` (`compra_id`),
  KEY `fk_detalleCompra_almacen1_idx` (`almacen_id`),
  KEY `fk_detalleCompra_producto1_idx` (`producto_id`),
  CONSTRAINT `fk_detalleCompra_almacen1` FOREIGN KEY (`almacen_id`) REFERENCES `almacen` (`id_almacen`),
  CONSTRAINT `fk_detalleCompra_compra1` FOREIGN KEY (`compra_id`) REFERENCES `compra` (`id_compra`),
  CONSTRAINT `fk_detalleCompra_producto1` FOREIGN KEY (`producto_id`) REFERENCES `producto` (`id_producto`)
) ENGINE=InnoDB AUTO_INCREMENT=3879 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detallecompra`
--

LOCK TABLES `detallecompra` WRITE;
/*!40000 ALTER TABLE `detallecompra` DISABLE KEYS */;
INSERT INTO `detallecompra` VALUES (3878,1,0.00000,357,43,4940,'01/04/2021 16:09:08','01/04/2021 16:09:08','activo');
/*!40000 ALTER TABLE `detallecompra` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detallepedidoapp`
--

DROP TABLE IF EXISTS `detallepedidoapp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detallepedidoapp` (
  `id_detallePedidoApp` int NOT NULL AUTO_INCREMENT,
  `nota` varchar(400) DEFAULT NULL,
  `cantidad` int DEFAULT NULL,
  `precioU` decimal(10,2) DEFAULT NULL,
  `estado` varchar(45) DEFAULT NULL,
  `pedidoApp_id` int NOT NULL,
  `producto_id` int NOT NULL,
  `comision` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id_detallePedidoApp`),
  KEY `fk_detallePedidoApp_pedidoApp1_idx` (`pedidoApp_id`),
  KEY `fk_detallePedidoApp_producto1_idx` (`producto_id`),
  CONSTRAINT `fk_detallePedidoApp_pedidoApp1` FOREIGN KEY (`pedidoApp_id`) REFERENCES `pedidoapp` (`id_pedidoApp`),
  CONSTRAINT `fk_detallePedidoApp_producto1` FOREIGN KEY (`producto_id`) REFERENCES `producto` (`id_producto`)
) ENGINE=InnoDB AUTO_INCREMENT=4763 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detallepedidoapp`
--

LOCK TABLES `detallepedidoapp` WRITE;
/*!40000 ALTER TABLE `detallepedidoapp` DISABLE KEYS */;
INSERT INTO `detallepedidoapp` VALUES (4685,'',1,35.00,'activo',3506,4941,5.00),(4686,'',2,350.00,'activo',3506,4943,3.00),(4687,'',1,150.00,'activo',3506,4944,4.00),(4688,'',1,200.00,'activo',3506,4945,2.00),(4689,'',1,60.00,'activo',3506,4946,1.00),(4690,'',1,800.00,'activo',3506,4947,5.00),(4691,'',1,35.00,'activo',3507,4941,10.00),(4692,'',2,350.00,'activo',3507,4943,5.00),(4693,'',1,150.00,'activo',3507,4944,2.00),(4694,'',1,200.00,'activo',3507,4945,4.00),(4695,'',1,60.00,'activo',3507,4946,5.00),(4696,'',1,800.00,'activo',3507,4947,2.00),(4697,'',1,150.00,'activo',3508,4944,1.00),(4698,'',1,150.00,'activo',3509,4944,8.00),(4699,'',1,800.00,'activo',3509,4947,5.00),(4700,'',1,150.00,'activo',3510,4944,2.00),(4701,'',1,0.00,'activo',3511,4940,3.00),(4702,'',1,350.00,'activo',3511,4943,4.00),(4703,'',1,200.00,'activo',3511,4945,2.00),(4704,'',1,200.00,'activo',3512,4945,6.00),(4705,'',6,60.00,'activo',3513,4946,2.00),(4706,'',1,200.00,'activo',3514,4945,5.00),(4707,'',1,60.00,'activo',3514,4946,1.00),(4708,'',1,800.00,'activo',3515,4947,2.00),(4709,'',1,5.00,'activo',3515,4948,3.00),(4710,'',1,200.00,'activo',3516,4945,6.00),(4711,'',1,60.00,'activo',3516,4946,5.00),(4712,'',1,5.00,'activo',3516,4948,2.00),(4713,'',1,150.00,'activo',3517,4944,5.00),(4714,'',1,200.00,'activo',3517,4945,2.00),(4715,'',1,60.00,'activo',3517,4946,5.00),(4716,'',3,5.00,'activo',3517,4948,2.00),(4717,'',1,200.00,'activo',3518,4945,5.00),(4718,'',1,200.00,'activo',3519,4945,2.00),(4719,'',2,35.00,'activo',3520,4941,4.00),(4738,'CAMBIADO POR CONTROL PEDIDO',2,350.00,'activo',3522,4943,10.00),(4739,'CAMBIADO POR CONTROL PEDIDO',2,800.00,'activo',3522,4947,10.00),(4740,'CAMBIADO POR CONTROL PEDIDO',1,150.00,'activo',3521,4944,10.00),(4741,'CAMBIADO POR CONTROL PEDIDO',1,35.00,'activo',3521,4941,0.00),(4742,'',1,150.00,'activo',3531,4944,5.00),(4743,'',1,200.00,'activo',3531,4945,3.00),(4744,'',1,200.00,'activo',3532,4945,3.00),(4745,'',1,60.00,'activo',3532,4946,1.00),(4746,'',1,350.00,'activo',3533,4943,10.00),(4747,'',1,150.00,'activo',3533,4944,5.00),(4750,'CAMBIADO POR CONTROL PEDIDO',1,60.00,'activo',3534,4946,1.00),(4751,'CAMBIADO POR CONTROL PEDIDO',5,150.00,'activo',3534,4944,10.00),(4752,'',8,0.00,'activo',3535,4940,0.00),(4753,'',14,35.00,'activo',3535,4941,5.00),(4754,'',1,0.00,'activo',3535,4942,0.00),(4755,'',1,350.00,'activo',3535,4943,10.00),(4756,'',4,200.00,'activo',3535,4945,3.00),(4757,'',3,5.00,'activo',3535,4948,0.00),(4758,'',1,350.00,'activo',3554,4943,1.00),(4759,'',2,200.00,'activo',3554,4945,1.00),(4760,'',1,200.00,'activo',3555,4945,1.00),(4761,'',1,60.00,'activo',3556,4946,1.00),(4762,'',1,800.00,'activo',3556,4947,1.00);
/*!40000 ALTER TABLE `detallepedidoapp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detallesolicitudcomision`
--

DROP TABLE IF EXISTS `detallesolicitudcomision`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detallesolicitudcomision` (
  `SolicitudComision_id` int NOT NULL,
  `pedido_id` int DEFAULT NULL,
  `estado` varchar(45) DEFAULT NULL,
  `montoPago` decimal(10,2) DEFAULT NULL,
  `tienda_id` int DEFAULT NULL,
  KEY `fk_detalleSolicitudComision_SolicitudComision1` (`SolicitudComision_id`),
  CONSTRAINT `fk_detalleSolicitudComision_SolicitudComision1` FOREIGN KEY (`SolicitudComision_id`) REFERENCES `solicitudcomision` (`id_SolicitudComision`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detallesolicitudcomision`
--

LOCK TABLES `detallesolicitudcomision` WRITE;
/*!40000 ALTER TABLE `detallesolicitudcomision` DISABLE KEYS */;
INSERT INTO `detallesolicitudcomision` VALUES (14,3510,'pendiente',3.00,4),(14,3511,'pendiente',18.00,4),(15,3519,'pendiente',2.00,4),(16,3515,'pendiente',6.46,4);
/*!40000 ALTER TABLE `detallesolicitudcomision` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalletraspasoproducto`
--

DROP TABLE IF EXISTS `detalletraspasoproducto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalletraspasoproducto` (
  `id_detalleTraspasoProducto` int NOT NULL AUTO_INCREMENT,
  `traspasoProducto_id` int NOT NULL,
  `producto_id` int NOT NULL,
  `cantidad` int DEFAULT NULL,
  `estado` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_detalleTraspasoProducto`),
  KEY `fk_detalleTraspasoProducto_traspasoProducto1_idx` (`traspasoProducto_id`),
  KEY `fk_detalleTraspasoProducto_producto1_idx` (`producto_id`),
  CONSTRAINT `fk_detalleTraspasoProducto_producto1` FOREIGN KEY (`producto_id`) REFERENCES `producto` (`id_producto`),
  CONSTRAINT `fk_detalleTraspasoProducto_traspasoProducto1` FOREIGN KEY (`traspasoProducto_id`) REFERENCES `traspasoproducto` (`id_traspasoProducto`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalletraspasoproducto`
--

LOCK TABLES `detalletraspasoproducto` WRITE;
/*!40000 ALTER TABLE `detalletraspasoproducto` DISABLE KEYS */;
INSERT INTO `detalletraspasoproducto` VALUES (1,1,4940,1,'activo');
/*!40000 ALTER TABLE `detalletraspasoproducto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalleventa`
--

DROP TABLE IF EXISTS `detalleventa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalleventa` (
  `id_DetalleVenta` int NOT NULL AUTO_INCREMENT,
  `producto_id` int NOT NULL,
  `cantidad` int DEFAULT NULL,
  `precio` decimal(10,2) DEFAULT NULL,
  `almacen_id` int NOT NULL,
  `detallecompra_id` int DEFAULT NULL,
  `descuento` decimal(10,2) DEFAULT NULL,
  `precioTotal` decimal(10,2) DEFAULT NULL,
  `venta_id` int NOT NULL,
  `estado` varchar(45) DEFAULT NULL,
  `fecha` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_DetalleVenta`,`almacen_id`),
  KEY `fk_DetalleVenta_producto1_idx` (`producto_id`),
  KEY `fk_DetalleVenta_almacen1_idx` (`almacen_id`),
  KEY `fk_DetalleVenta_detallecompra1_idx` (`detallecompra_id`),
  KEY `fk_detalleventa_venta1_idx` (`venta_id`),
  CONSTRAINT `fk_DetalleVenta_almacen1` FOREIGN KEY (`almacen_id`) REFERENCES `almacen` (`id_almacen`),
  CONSTRAINT `fk_DetalleVenta_detallecompra1` FOREIGN KEY (`detallecompra_id`) REFERENCES `detallecompra` (`id_detalleCompra`),
  CONSTRAINT `fk_DetalleVenta_producto1` FOREIGN KEY (`producto_id`) REFERENCES `producto` (`id_producto`),
  CONSTRAINT `fk_detalleventa_venta1` FOREIGN KEY (`venta_id`) REFERENCES `venta` (`id_venta`)
) ENGINE=InnoDB AUTO_INCREMENT=31907 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalleventa`
--

LOCK TABLES `detalleventa` WRITE;
/*!40000 ALTER TABLE `detalleventa` DISABLE KEYS */;
INSERT INTO `detalleventa` VALUES (31884,4947,1,800.00,43,NULL,0.00,800.00,4763,'activo','22/02/2021 08:43:38'),(31885,4948,1,5.00,43,NULL,0.00,5.00,4763,'activo','22/02/2021 08:43:38'),(31886,4943,1,350.00,43,NULL,0.00,350.00,4764,'activo','22/02/2021 08:58:32'),(31887,4945,1,200.00,43,NULL,0.00,200.00,4765,'activo','22/02/2021 09:01:30'),(31888,4946,1,60.00,43,NULL,0.00,60.00,4765,'activo','22/02/2021 09:01:30'),(31889,4945,1,200.00,43,NULL,0.00,200.00,4766,'activo','22/02/2021 11:39:16'),(31890,4946,1,60.00,43,NULL,0.00,60.00,4766,'activo','22/02/2021 11:39:16'),(31891,4948,1,5.00,43,NULL,0.00,5.00,4766,'activo','22/02/2021 11:39:16'),(31892,4944,1,150.00,43,NULL,0.00,150.00,4767,'activo','08/03/2021 10:07:59'),(31893,4945,1,200.00,43,NULL,0.00,200.00,4767,'activo','08/03/2021 10:07:59'),(31894,4946,1,60.00,43,NULL,0.00,60.00,4767,'activo','08/03/2021 10:07:59'),(31895,4948,3,5.00,43,NULL,0.00,15.00,4767,'activo','08/03/2021 10:07:59'),(31896,4945,1,200.00,43,NULL,0.00,200.00,4768,'activo','13/03/2021 16:48:43'),(31897,4945,1,200.00,43,NULL,0.00,200.00,4769,'activo','14/03/2021 14:24:31'),(31898,4945,1,200.00,43,NULL,0.00,200.00,4770,'activo','14/03/2021 14:24:43'),(31899,4943,2,350.00,43,NULL,0.00,700.00,4771,'activo','24/03/2021 10:22:54'),(31900,4947,1,800.00,43,NULL,0.00,800.00,4771,'activo','24/03/2021 10:22:54'),(31901,4943,2,350.00,43,NULL,0.00,700.00,4772,'activo','26/03/2021 10:35:41'),(31902,4947,1,800.00,43,NULL,0.00,800.00,4772,'activo','26/03/2021 10:35:41'),(31903,4944,1,150.00,43,NULL,0.00,150.00,4773,'activo','30/03/2021 11:13:49'),(31904,4941,1,35.00,43,NULL,0.00,35.00,4773,'activo','30/03/2021 11:13:49'),(31905,4946,1,60.00,43,NULL,0.00,60.00,4774,'activo','12/04/2021 11:00:13'),(31906,4944,5,150.00,43,NULL,0.00,750.00,4774,'activo','12/04/2021 11:00:13');
/*!40000 ALTER TABLE `detalleventa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `direccionapp`
--

DROP TABLE IF EXISTS `direccionapp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `direccionapp` (
  `id_direccionApp` int NOT NULL AUTO_INCREMENT,
  `alias` varchar(150) DEFAULT NULL,
  `telefono` varchar(100) DEFAULT NULL,
  `direccion` varchar(300) DEFAULT NULL,
  `referencia` varchar(300) DEFAULT NULL,
  `lon` varchar(45) DEFAULT NULL,
  `lat` varchar(45) DEFAULT NULL,
  `estado` varchar(45) DEFAULT NULL,
  `ciudad_id` int NOT NULL,
  `clienteApp_id` int NOT NULL,
  `seleccionado` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id_direccionApp`,`ciudad_id`),
  KEY `fk_direccionApp_ciudad1_idx` (`ciudad_id`),
  KEY `fk_direccionApp_clienteApp1_idx` (`clienteApp_id`),
  CONSTRAINT `fk_direccionApp_ciudad1` FOREIGN KEY (`ciudad_id`) REFERENCES `ciudad` (`id_ciudad`),
  CONSTRAINT `fk_direccionApp_clienteApp1` FOREIGN KEY (`clienteApp_id`) REFERENCES `clienteapp` (`id_clienteApp`)
) ENGINE=InnoDB AUTO_INCREMENT=1774 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `direccionapp`
--

LOCK TABLES `direccionapp` WRITE;
/*!40000 ALTER TABLE `direccionapp` DISABLE KEYS */;
/*!40000 ALTER TABLE `direccionapp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dosificacionsucursal`
--

DROP TABLE IF EXISTS `dosificacionsucursal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dosificacionsucursal` (
  `id_dosificacionSucursal` int NOT NULL AUTO_INCREMENT,
  `sucursal_id` int NOT NULL,
  `nroAutorizacion` varchar(50) DEFAULT NULL,
  `fechaLimiteEmision` varchar(45) DEFAULT NULL,
  `tipoFactura` varchar(60) DEFAULT NULL,
  `actividadEconomica` varchar(1000) DEFAULT NULL,
  `LlaveDosificacion` varchar(100) DEFAULT NULL,
  `estado` varchar(45) DEFAULT NULL,
  `creado` varchar(45) DEFAULT NULL,
  `mensajeImpuesto` longtext,
  PRIMARY KEY (`id_dosificacionSucursal`),
  KEY `fk_DosificacionSucursal_sucursal1_idx` (`sucursal_id`),
  CONSTRAINT `fk_DosificacionSucursal_sucursal1` FOREIGN KEY (`sucursal_id`) REFERENCES `sucursal` (`id_sucursal`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dosificacionsucursal`
--

LOCK TABLES `dosificacionsucursal` WRITE;
/*!40000 ALTER TABLE `dosificacionsucursal` DISABLE KEYS */;
/*!40000 ALTER TABLE `dosificacionsucursal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `empresa`
--

DROP TABLE IF EXISTS `empresa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empresa` (
  `id_empresa` int NOT NULL AUTO_INCREMENT,
  `nombreEmpresa` varchar(200) DEFAULT NULL,
  `estado` varchar(45) DEFAULT NULL,
  `tipoCambio` decimal(10,2) DEFAULT NULL,
  `firmaCobranza1` varchar(200) DEFAULT NULL,
  `firmaCobranza2` varchar(50) DEFAULT NULL,
  `firmaNotaVenta1` varchar(50) DEFAULT NULL,
  `firmaNotaVenta2` varchar(50) DEFAULT NULL,
  `firmaNotaVenta3` varchar(50) DEFAULT NULL,
  `firmaNotaVenta4` varchar(50) DEFAULT NULL,
  `firmaNotaCompra1` varchar(50) DEFAULT NULL,
  `firmaNotaCompra2` varchar(50) DEFAULT NULL,
  `firmaNotaCompra3` varchar(50) DEFAULT NULL,
  `firmaNotaCompra4` varchar(50) DEFAULT NULL,
  `codigoUsuario` int DEFAULT NULL,
  `codigoProducto` int DEFAULT NULL,
  `codigoCliente` int DEFAULT NULL,
  `codigoAlmacen` int DEFAULT NULL,
  `app` varchar(45) DEFAULT NULL,
  `appLogo` varchar(200) DEFAULT NULL,
  `appFactura` varchar(45) DEFAULT NULL,
  `aprobado` varchar(45) DEFAULT NULL,
  `aprobadoPor` int DEFAULT NULL,
  `empresaADM` varchar(45) DEFAULT NULL,
  `registrado` varchar(45) DEFAULT NULL,
  `telefono` varchar(45) DEFAULT NULL,
  `ciudad_id` int DEFAULT NULL,
  `comision` decimal(10,2) DEFAULT NULL,
  `posicion` int DEFAULT NULL,
  `delivery` varchar(45) DEFAULT 'emprendedor',
  `tarifaDelivery` varchar(45) DEFAULT NULL,
  `comisionHijo` decimal(10,2) DEFAULT NULL,
  `comisionNieto` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id_empresa`)
) ENGINE=InnoDB AUTO_INCREMENT=368 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empresa`
--

LOCK TABLES `empresa` WRITE;
/*!40000 ALTER TABLE `empresa` DISABLE KEYS */;
INSERT INTO `empresa` VALUES (87,'W Digital','activo',6.96,'COBRADO POR','PAGADO POR','','ENTREGADO POR','RECIBIDO POR','','VERIFICADO POR','RECIBIDO POR','ENTREGADO POR','RECIBI CONFORME',NULL,NULL,NULL,NULL,'inactivo','https://www.emprendedor-wd.com/Imagen/Empresa/e_87_logo_08_07_2020_21_49_28.png','inactivo','activo',149,'Cliente','31/05/2020 15:20:05','75685675',1,10.00,777,'propia','emprendedor',70.00,60.00);
/*!40000 ALTER TABLE `empresa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `empresacategoriaapp`
--

DROP TABLE IF EXISTS `empresacategoriaapp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empresacategoriaapp` (
  `empresa_id` int NOT NULL,
  `categoriaApp_id` int NOT NULL,
  PRIMARY KEY (`empresa_id`,`categoriaApp_id`),
  KEY `fk_empresa_has_categoriaApp_categoriaApp1_idx` (`categoriaApp_id`),
  KEY `fk_empresa_has_categoriaApp_empresa1_idx` (`empresa_id`),
  CONSTRAINT `fk_empresa_has_categoriaApp_categoriaApp1` FOREIGN KEY (`categoriaApp_id`) REFERENCES `categoriaapp` (`id_categoriaApp`),
  CONSTRAINT `fk_empresa_has_categoriaApp_empresa1` FOREIGN KEY (`empresa_id`) REFERENCES `empresa` (`id_empresa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empresacategoriaapp`
--

LOCK TABLES `empresacategoriaapp` WRITE;
/*!40000 ALTER TABLE `empresacategoriaapp` DISABLE KEYS */;
/*!40000 ALTER TABLE `empresacategoriaapp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historicoplanpago`
--

DROP TABLE IF EXISTS `historicoplanpago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historicoplanpago` (
  `planpago_id` int NOT NULL,
  `empresa_id` int NOT NULL,
  `fechaCreado` varchar(45) DEFAULT NULL,
  `fechaFin` varchar(45) DEFAULT NULL,
  `estado` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`planpago_id`,`empresa_id`),
  KEY `fk_planpago_has_empresa_empresa1_idx` (`empresa_id`),
  KEY `fk_planpago_has_empresa_planpago1_idx` (`planpago_id`),
  CONSTRAINT `fk_planpago_has_empresa_empresa1` FOREIGN KEY (`empresa_id`) REFERENCES `empresa` (`id_empresa`),
  CONSTRAINT `fk_planpago_has_empresa_planpago1` FOREIGN KEY (`planpago_id`) REFERENCES `planpago` (`id_planpago`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historicoplanpago`
--

LOCK TABLES `historicoplanpago` WRITE;
/*!40000 ALTER TABLE `historicoplanpago` DISABLE KEYS */;
/*!40000 ALTER TABLE `historicoplanpago` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `horarioatencion`
--

DROP TABLE IF EXISTS `horarioatencion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `horarioatencion` (
  `id_horarioAtencion` int NOT NULL AUTO_INCREMENT,
  `tipo` varchar(45) DEFAULT NULL,
  `horarioDe` varchar(45) DEFAULT NULL,
  `HorarioHasta` varchar(45) DEFAULT NULL,
  `dia` int DEFAULT NULL,
  `id` int DEFAULT NULL,
  `horarioDe2` varchar(45) DEFAULT NULL,
  `HorarioHasta2` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_horarioAtencion`)
) ENGINE=InnoDB AUTO_INCREMENT=17452 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `horarioatencion`
--

LOCK TABLES `horarioatencion` WRITE;
/*!40000 ALTER TABLE `horarioatencion` DISABLE KEYS */;
/*!40000 ALTER TABLE `horarioatencion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `horarioentrega`
--

DROP TABLE IF EXISTS `horarioentrega`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `horarioentrega` (
  `id_horarioEntrega` int NOT NULL AUTO_INCREMENT,
  `detalle` varchar(100) DEFAULT NULL,
  `horarioDe` varchar(45) DEFAULT NULL,
  `horarioHasta` varchar(45) DEFAULT NULL,
  `estado` varchar(45) DEFAULT NULL,
  `dia` int DEFAULT NULL,
  PRIMARY KEY (`id_horarioEntrega`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `horarioentrega`
--

LOCK TABLES `horarioentrega` WRITE;
/*!40000 ALTER TABLE `horarioentrega` DISABLE KEYS */;
INSERT INTO `horarioentrega` VALUES (1,'de 10:00 a 13:00','10:00:00','13:00:00','activo',4),(2,'de 15:00 a :8:00','15:00:00','18:00:00','activo',3),(3,'hola bebe','00:00:00','00:00:00','inactivo',0),(4,'de 7:08 a 13:02','07:08:09','13:02:03','activo',4),(5,'de 18:00 hasta 19:00','18:00:00','19:00:00','activo',2);
/*!40000 ALTER TABLE `horarioentrega` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `linea_producto`
--

DROP TABLE IF EXISTS `linea_producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `linea_producto` (
  `id_linea_producto` int NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(200) DEFAULT NULL,
  `empresa_id` int NOT NULL,
  `posicion` int DEFAULT NULL,
  PRIMARY KEY (`id_linea_producto`,`empresa_id`),
  KEY `fk_linea_producto_empresa1_idx` (`empresa_id`),
  CONSTRAINT `fk_linea_producto_empresa1` FOREIGN KEY (`empresa_id`) REFERENCES `empresa` (`id_empresa`)
) ENGINE=InnoDB AUTO_INCREMENT=1148 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `linea_producto`
--

LOCK TABLES `linea_producto` WRITE;
/*!40000 ALTER TABLE `linea_producto` DISABLE KEYS */;
INSERT INTO `linea_producto` VALUES (1143,'Electrodomestico',87,1),(1144,'Jugeteria',87,0),(1145,'Ropa',87,2),(1146,'Cosmeticos',87,0),(1147,'Adultos',87,9);
/*!40000 ALTER TABLE `linea_producto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `linea_producto_tienda`
--

DROP TABLE IF EXISTS `linea_producto_tienda`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `linea_producto_tienda` (
  `linea_producto_id` int NOT NULL,
  `tienda_id` int NOT NULL,
  PRIMARY KEY (`linea_producto_id`,`tienda_id`),
  KEY `fk_linea_producto_has_tienda_tienda1_idx` (`tienda_id`),
  KEY `fk_linea_producto_has_tienda_linea_producto1_idx` (`linea_producto_id`),
  CONSTRAINT `fk_linea_producto_has_tienda_linea_producto1` FOREIGN KEY (`linea_producto_id`) REFERENCES `linea_producto` (`id_linea_producto`),
  CONSTRAINT `fk_linea_producto_has_tienda_tienda1` FOREIGN KEY (`tienda_id`) REFERENCES `tienda` (`id_tienda`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `linea_producto_tienda`
--

LOCK TABLES `linea_producto_tienda` WRITE;
/*!40000 ALTER TABLE `linea_producto_tienda` DISABLE KEYS */;
INSERT INTO `linea_producto_tienda` VALUES (1143,4),(1144,4),(1145,4),(1146,4),(1147,4),(1146,7);
/*!40000 ALTER TABLE `linea_producto_tienda` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lotemercaderia`
--

DROP TABLE IF EXISTS `lotemercaderia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lotemercaderia` (
  `id_loteMercaderia` int NOT NULL AUTO_INCREMENT,
  `codigo` varchar(100) DEFAULT NULL,
  `fechaVencimiento` varchar(45) DEFAULT NULL,
  `estado` varchar(45) DEFAULT NULL,
  `cantidad` int DEFAULT NULL,
  `fechaModificado` varchar(45) DEFAULT NULL,
  `registradoPor` int NOT NULL,
  `modificadoPor` int NOT NULL,
  `fechaRegistrado` varchar(45) DEFAULT NULL,
  `detallecompra_id` int NOT NULL,
  `empresa_id` int NOT NULL,
  PRIMARY KEY (`id_loteMercaderia`,`empresa_id`),
  KEY `fk_lotemercaderia_usuario1_idx` (`registradoPor`),
  KEY `fk_lotemercaderia_usuario2_idx` (`modificadoPor`),
  KEY `fk_lotemercaderia_detallecompra1_idx` (`detallecompra_id`),
  KEY `fk_lotemercaderia_empresa1_idx` (`empresa_id`),
  CONSTRAINT `fk_lotemercaderia_detallecompra1` FOREIGN KEY (`detallecompra_id`) REFERENCES `detallecompra` (`id_detalleCompra`),
  CONSTRAINT `fk_lotemercaderia_empresa1` FOREIGN KEY (`empresa_id`) REFERENCES `empresa` (`id_empresa`),
  CONSTRAINT `fk_lotemercaderia_usuario1` FOREIGN KEY (`registradoPor`) REFERENCES `usuario` (`id_usuario`),
  CONSTRAINT `fk_lotemercaderia_usuario2` FOREIGN KEY (`modificadoPor`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=1302 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lotemercaderia`
--

LOCK TABLES `lotemercaderia` WRITE;
/*!40000 ALTER TABLE `lotemercaderia` DISABLE KEYS */;
/*!40000 ALTER TABLE `lotemercaderia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `marca`
--

DROP TABLE IF EXISTS `marca`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `marca` (
  `id_marca` int NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(200) DEFAULT NULL,
  `empresa_id` int NOT NULL,
  PRIMARY KEY (`id_marca`,`empresa_id`),
  KEY `fk_marca_empresa1_idx` (`empresa_id`),
  CONSTRAINT `fk_marca_empresa1` FOREIGN KEY (`empresa_id`) REFERENCES `empresa` (`id_empresa`)
) ENGINE=InnoDB AUTO_INCREMENT=488 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `marca`
--

LOCK TABLES `marca` WRITE;
/*!40000 ALTER TABLE `marca` DISABLE KEYS */;
INSERT INTO `marca` VALUES (487,'Marca Generica',87);
/*!40000 ALTER TABLE `marca` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mensajeguardado`
--

DROP TABLE IF EXISTS `mensajeguardado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mensajeguardado` (
  `id_mensajeGuardado` int NOT NULL AUTO_INCREMENT,
  `detalle` varchar(400) DEFAULT NULL,
  `estado` varchar(45) DEFAULT NULL,
  `tipo` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_mensajeGuardado`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mensajeguardado`
--

LOCK TABLES `mensajeguardado` WRITE;
/*!40000 ALTER TABLE `mensajeguardado` DISABLE KEYS */;
INSERT INTO `mensajeguardado` VALUES (1,'Era un pedido Falso','activo','Cancelacion Pedido'),(2,'El cliente rechazo el pedido','activo','Cancelacion Pedido'),(3,'El cliente no contesto el telefono','activo','Cancelacion Pedido');
/*!40000 ALTER TABLE `mensajeguardado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedidoapp`
--

DROP TABLE IF EXISTS `pedidoapp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedidoapp` (
  `id_pedidoApp` int NOT NULL AUTO_INCREMENT,
  `solicitada` varchar(45) DEFAULT NULL,
  `entregada` varchar(45) DEFAULT NULL,
  `nit` varchar(45) DEFAULT NULL,
  `rz` varchar(45) DEFAULT NULL,
  `montoBillete` decimal(10,2) DEFAULT NULL,
  `estado` varchar(45) DEFAULT NULL,
  `motivo` varchar(45) DEFAULT NULL,
  `costoDelivery` decimal(10,2) DEFAULT NULL,
  `totalPedido` decimal(10,2) DEFAULT NULL,
  `sucursal_id` int DEFAULT NULL,
  `cliente` varchar(200) DEFAULT NULL,
  `venta_id` int DEFAULT NULL,
  `delivery_id` int DEFAULT NULL,
  `recepcionado` varchar(45) DEFAULT NULL,
  `llamarMoto` varchar(45) DEFAULT NULL,
  `enCamino` varchar(45) DEFAULT NULL,
  `cancelado` varchar(45) DEFAULT NULL,
  `aceptarPedido` varchar(45) DEFAULT NULL,
  `descuento` decimal(10,2) DEFAULT NULL,
  `usuario_id` int DEFAULT NULL,
  `metodoPago` varchar(60) DEFAULT NULL,
  `fechaProgramada` varchar(45) DEFAULT NULL,
  `horaProgramada` varchar(45) DEFAULT NULL,
  `id_tienda` int DEFAULT NULL,
  `direccion` varchar(500) DEFAULT NULL,
  `lon` varchar(60) DEFAULT NULL,
  `lat` varchar(60) DEFAULT NULL,
  `intrucciones` varchar(400) DEFAULT NULL,
  PRIMARY KEY (`id_pedidoApp`),
  KEY `fk_pedidoApp_sucursal1_idx` (`sucursal_id`),
  CONSTRAINT `fk_pedidoApp_sucursal1` FOREIGN KEY (`sucursal_id`) REFERENCES `sucursal` (`id_sucursal`)
) ENGINE=InnoDB AUTO_INCREMENT=3557 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedidoapp`
--

LOCK TABLES `pedidoapp` WRITE;
/*!40000 ALTER TABLE `pedidoapp` DISABLE KEYS */;
INSERT INTO `pedidoapp` VALUES (3503,'24/11/2020 13:27:33','','','',0.00,'pendiente','',10.00,1945.00,63,'3691',0,0,'','','','','',0.00,0,'efectivo','24/11/2020','9:00:00',4,'32323','-63.18153','-17.782786',NULL),(3504,'24/11/2020 13:32:05','','','',0.00,'pendiente','',10.00,1945.00,63,'3691',0,0,'','','','','',0.00,0,'efectivo','24/11/2020','9:00:00',4,'32323','-63.18153','-17.782786',NULL),(3505,'24/11/2020 13:32:15','','','',0.00,'pendiente','',10.00,1945.00,63,'3691',0,0,'','','','','',0.00,0,'efectivo','24/11/2020','9:00:00',4,'32323','-63.18153','-17.782786',NULL),(3506,'24/11/2020 13:32:51','','','',0.00,'pendiente','',10.00,1945.00,63,'3690',0,0,'','','','','',0.00,0,'efectivo','24/11/2020','9:00:00',4,'asdasdas','-63.18153','-17.782786',NULL),(3507,'24/11/2020 13:37:06','','','',0.00,'pendiente','',10.00,1945.00,63,'3692',0,0,'','','','','',0.00,0,'efectivo','24/11/2020','9:00:00',4,'av bolivar','-63.18153','-17.782786',NULL),(3508,'24/11/2020 13:38:11','','','',0.00,'pendiente','',10.00,150.00,63,'3693',0,0,'','','','','',0.00,0,'efectivo','24/11/2020','9:00:00',4,'ave algo','-63.18153','-17.782786',NULL),(3509,'07/01/2021 10:03:56','','','',0.00,'pendiente','',10.00,950.00,63,'3690',0,0,'','','','','',0.00,0,'efectivo','07/01/2021','9:00:00',4,'aa','-63.18153','-17.782786',NULL),(3510,'07/01/2021 10:12:39','','','',0.00,'entregado','',10.00,150.00,63,'3694',0,0,'','','','','',0.00,0,'efectivo','07/01/2021','9:00:00',4,'sdf','-63.18153','-17.782786',NULL),(3511,'07/01/2021 10:15:36','','','',0.00,'entregado','',10.00,550.00,63,'3691',0,0,'','','','','',0.00,0,'efectivo','07/01/2021','9:00:00',4,'asdasd','-63.18153','-17.782786',NULL),(3512,'07/01/2021 10:18:31','','','',0.00,'entregado','',10.00,200.00,63,'3691',0,0,'','','','','',0.00,0,'efectivo','07/01/2021','9:00:00',4,'asdasd','-63.18153','-17.782786',NULL),(3513,'09/02/2021 10:12:36','','','',0.00,'entregado','',10.00,360.00,63,'3695',0,0,'','','','','',0.00,0,'efectivo','09/02/2021','9:00:00',4,'av ribera 1232','-63.18426424624876','-17.769076670429655',NULL),(3514,'15/02/2021 11:45:21','','','',0.00,'entregado','',10.00,260.00,63,'3690',4765,0,'','','','','',0.00,0,'efectivo','15/02/2021','14:00:00',4,'av palmar','-63.18153','-17.782786',NULL),(3515,'15/02/2021 11:45:49','','','',0.00,'entregado','',10.00,805.00,63,'3692',0,0,'','','','','',0.00,0,'efectivo','15/02/2021','18:00:00',6,'av algo','-63.18153','-17.782786',NULL),(3516,'22/02/2021 11:34:48','','','',0.00,'entregado','',10.00,265.00,63,'3690',0,0,'','','','','',0.00,0,'efectivo','22/02/2021','14:00:00',6,'Roca y coronado entre 3 y 4to anillo','-63.21818626805742','-17.77563573261883',NULL),(3517,'08/03/2021 09:50:14','','','',0.00,'entregado','',10.00,425.00,63,'3696',0,0,'','','','','',0.00,0,'efectivo','08/03/2021','9:00:00',6,'cond. el bosque casa 33 radial 26','-63.188539198378734','-17.745626627193754',NULL),(3518,'09/03/2021 11:58:14','','','',0.00,'cancelado','asd',10.00,200.00,63,'3697',0,0,'','','','','',0.00,0,'efectivo','09/03/2021','9:00:00',6,'asdasd','-63.18153','-17.782786',NULL),(3519,'09/03/2021 11:59:47','','','',0.00,'cancelado','asd',10.00,200.00,63,'3698',0,0,'','','','','',0.00,0,'efectivo','09/03/2021','9:00:00',5,'asdasd','-63.18153','-17.782786',NULL),(3520,'09/03/2021 12:22:46','','','',0.00,'entregado','',10.00,70.00,63,'3701',0,0,'','','','','',0.00,0,'efectivo','09/03/2021','9:00:00',5,'asdasdasd','-63.18153','-17.782786','hola bebe'),(3521,'17/03/2021 09:52:29','','','',0.00,'entregado','',10.00,185.00,63,'3702',4773,0,'','','','','',0.00,0,'efectivo','18/03/2021','9:00:00',5,'ssssssss','-63.160251145307654','-17.780157571178677',''),(3522,'24/03/2021 10:03:45','','','',0.00,'confirmado','',10.00,2300.00,63,'3696',0,0,'','','','','',0.00,0,'efectivo','25/03/2021','9:00:00',7,'calle saavedra esquina tarija','-63.201356889038095','-17.78867044871237','QYE ME LLEGUE NVUEKLTO NE PAPEL DE REGALO'),(3531,'06/04/2021 09:01:43','','','',0.00,'pendiente','',10.00,350.00,63,'3708',0,0,'','','','','',0.00,0,'efectivo','08/04/2021','de 15:00 a :8:00',4,'2222222','-63.1890498','-17.787149',''),(3532,'06/04/2021 09:03:38','','','',0.00,'pendiente','',10.00,260.00,63,'3691',0,0,'','','','','',0.00,0,'efectivo','08/04/2021','de 15:00 a :8:00',4,'2222222','-63.1890498','-17.787149',''),(3533,'06/04/2021 09:04:25','','','',0.00,'pendiente','',10.00,500.00,63,'3694',0,0,'','','','','',0.00,0,'efectivo','08/04/2021','de 15:00 a :8:00',4,'33333','-63.1890498','-17.787149',''),(3534,'12/04/2021 10:37:28','','','',0.00,'entregado','',10.00,810.00,63,'3709',4774,0,'','','','','',0.00,0,'efectivo','15/04/2021','de 15:00 a :8:00',4,'ol','-63.176703999999994','-17.7831936','fghjk'),(3535,'14/04/2021 20:23:03','','','',0.00,'pendiente','',10.00,1655.00,63,'3710',0,0,'','','','','',0.00,0,'efectivo','15/04/2021','de 15:00 a :8:00',4,'22222222','-63.1678783','-17.7836957',''),(3554,'15/04/2021 12:17:38','','','',0.00,'pendiente','',10.00,750.00,63,'3714',0,0,'','','','','',0.00,0,'efectivo','16/04/2021','de 7:08 a 13:02',4,'11111111111111111','-63.13082879999999','-17.77664',''),(3555,'20/04/2021 00:08:09','','','',0.00,'pendiente','',10.00,200.00,63,'3715',0,0,'','','','','',0.00,0,'efectivo','22/04/2021','de 15:00 a :8:00',4,'Shhsshshshs','-63.18153','-17.782786','Hshshdhddh'),(3556,'20/04/2021 10:21:54','','','',0.00,'pendiente','',10.00,860.00,63,'3696',0,0,'','','','','',0.00,0,'efectivo','21/04/2021','de 18:00 hasta 19:00',4,'Av radial 26','-63.18878369270927','-17.745702991430427','Por favor hctcigchc. H kg yc hg');
/*!40000 ALTER TABLE `pedidoapp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedidocurrier`
--

DROP TABLE IF EXISTS `pedidocurrier`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedidocurrier` (
  `id_pedidoCurrier` int NOT NULL AUTO_INCREMENT,
  `tipo` varchar(45) DEFAULT NULL,
  `detalle` varchar(200) DEFAULT NULL,
  `referenciaOrigen` varchar(200) DEFAULT NULL,
  `contactoOrigen` varchar(100) DEFAULT NULL,
  `telefonoOrigen` varchar(45) DEFAULT NULL,
  `lon` varchar(45) DEFAULT NULL,
  `lat` varchar(45) DEFAULT NULL,
  `referenciaDestino` varchar(200) DEFAULT NULL,
  `contactoDestino` varchar(200) DEFAULT NULL,
  `telefonoDestino` varchar(45) DEFAULT NULL,
  `lon2` varchar(45) DEFAULT NULL,
  `lat2` varchar(45) DEFAULT NULL,
  `estado` varchar(45) DEFAULT NULL,
  `solicitado` varchar(45) DEFAULT NULL,
  `recogido` varchar(45) DEFAULT NULL,
  `entregado` varchar(45) DEFAULT NULL,
  `cancelado` varchar(45) DEFAULT NULL,
  `vuelta` varchar(45) DEFAULT NULL,
  `costo` decimal(10,2) DEFAULT NULL,
  `clienteApp_id` int DEFAULT NULL,
  `delivery_id` int DEFAULT NULL,
  `aceptado` varchar(45) DEFAULT NULL,
  `ciudad_id` int DEFAULT NULL,
  `descuento` decimal(10,2) DEFAULT NULL,
  `usuario_id` int DEFAULT NULL,
  PRIMARY KEY (`id_pedidoCurrier`)
) ENGINE=InnoDB AUTO_INCREMENT=561 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedidocurrier`
--

LOCK TABLES `pedidocurrier` WRITE;
/*!40000 ALTER TABLE `pedidocurrier` DISABLE KEYS */;
/*!40000 ALTER TABLE `pedidocurrier` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `perfil`
--

DROP TABLE IF EXISTS `perfil`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `perfil` (
  `id_Perfil` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(300) DEFAULT NULL,
  `detalle` varchar(500) DEFAULT NULL,
  `empresa_id` int NOT NULL,
  PRIMARY KEY (`id_Perfil`),
  KEY `fk_perfil_empresa1_idx` (`empresa_id`),
  CONSTRAINT `fk_perfil_empresa1` FOREIGN KEY (`empresa_id`) REFERENCES `empresa` (`id_empresa`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `perfil`
--

LOCK TABLES `perfil` WRITE;
/*!40000 ALTER TABLE `perfil` DISABLE KEYS */;
/*!40000 ALTER TABLE `perfil` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `perfil_permiso`
--

DROP TABLE IF EXISTS `perfil_permiso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `perfil_permiso` (
  `permiso_id` int NOT NULL,
  `Perfil_id` int NOT NULL,
  PRIMARY KEY (`permiso_id`,`Perfil_id`),
  KEY `fk_permiso_has_Perfill_Perfill1_idx` (`Perfil_id`),
  KEY `fk_permiso_has_Perfill_permiso1_idx` (`permiso_id`),
  CONSTRAINT `fk_permiso_has_Perfill_Perfill1` FOREIGN KEY (`Perfil_id`) REFERENCES `perfil` (`id_Perfil`),
  CONSTRAINT `fk_permiso_has_Perfill_permiso1` FOREIGN KEY (`permiso_id`) REFERENCES `permiso` (`id_permiso`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `perfil_permiso`
--

LOCK TABLES `perfil_permiso` WRITE;
/*!40000 ALTER TABLE `perfil_permiso` DISABLE KEYS */;
/*!40000 ALTER TABLE `perfil_permiso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permiso`
--

DROP TABLE IF EXISTS `permiso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permiso` (
  `id_permiso` int NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(400) DEFAULT NULL,
  `foto` longtext,
  `nombre` varchar(100) DEFAULT NULL,
  `CategoriaPermiso_id` int NOT NULL,
  `tipo` varchar(45) DEFAULT NULL,
  `url` varchar(100) DEFAULT NULL,
  `titulomenu` varchar(100) DEFAULT NULL,
  `estado` varchar(45) DEFAULT NULL,
  `permisoPadre` int DEFAULT NULL,
  `posicion` int DEFAULT NULL,
  PRIMARY KEY (`id_permiso`),
  KEY `fk_permiso_CategoriaPermiso1_idx` (`CategoriaPermiso_id`),
  KEY `fk_permiso_permiso1_idx` (`permisoPadre`),
  CONSTRAINT `fk_permiso_CategoriaPermiso1` FOREIGN KEY (`CategoriaPermiso_id`) REFERENCES `categoriapermiso` (`id_CategoriaPermiso`),
  CONSTRAINT `fk_permiso_permiso1` FOREIGN KEY (`permisoPadre`) REFERENCES `permiso` (`id_permiso`)
) ENGINE=InnoDB AUTO_INCREMENT=240 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permiso`
--

LOCK TABLES `permiso` WRITE;
/*!40000 ALTER TABLE `permiso` DISABLE KEYS */;
INSERT INTO `permiso` VALUES (29,'Cajero',NULL,'Acceso Proveedor',2,'REDIRECCION','Formularios/Provedor.html','Proveedor','activo',NULL,10),(30,'Vendedor',NULL,'Acceso Formulario Producto',3,'REDIRECCION','Formularios/Producto.html','Producto','activo',NULL,1),(31,'locaya',NULL,'Acceso Configuración Sistema',5,'REDIRECCION','Formularios/ConfiguracionSistema.html','Configuración del Sistema ','activo',NULL,20),(32,'nada',NULL,'Acceso Permisos de Cuentas',5,'REDIRECCION','Formularios/ConfiguracionCuenta.html','Permisos de Cuentas','activo',NULL,10),(33,NULL,NULL,'Acceso Compras',2,'REDIRECCION','Formularios/Compra.html','Compra','activo',NULL,1),(34,NULL,NULL,'Acceso Formulario Almacén',3,'REDIRECCION','Formularios/Almacen.html','Almacén','activo',NULL,10),(35,NULL,NULL,'Acceso Precio Venta',1,'REDIRECCION','Formularios/PrecioVenta.html','Precio Venta','activo',NULL,15),(36,NULL,NULL,'Acceso Venta',1,'REDIRECCION','Formularios/Venta.html','Venta','activo',NULL,1),(37,NULL,NULL,'Acceso Sucursal',1,'REDIRECCION','Formularios/Sucursal.html','Sucursales','activo',NULL,25),(40,NULL,NULL,'Acceso Reporte Venta',1,'REDIRECCION','Formularios/ReporteVenta.html','Reporte de Ventas','activo',NULL,20),(41,NULL,NULL,'Acceso Catálogo de Producto',1,'REDIRECCION','Formularios/CatalogoProducto.html','Catálogo de Producto','activo',NULL,10),(42,NULL,NULL,'Acceso Lista de Clientes',1,'REDIRECCION','Formularios/ListaCliente.html','Lista de Clientes','activo',NULL,5),(43,NULL,NULL,'Acceso Reporte Movimiento Producto',3,'REDIRECCION','Formularios/ReporteMovimientoProducto.html','Reporte Movimiento Producto','activo',NULL,20),(44,NULL,NULL,'Acceso a Cuentas por Cobrar',6,'REDIRECCION','Formularios/CuentaXCobrar.html','Cuenta por Cobrar','activo',NULL,10),(45,NULL,NULL,'Acceso Reporte Cobranza',6,'REDIRECCION','Formularios/ReporteCobranza.html','Reporte de Cobranza','activo',NULL,40),(46,NULL,NULL,'Acceso Lote de Mercaderia',2,'REDIRECCION','Formularios/LoteMercaderia.html','Lote de Mercadería','activo',NULL,20),(47,NULL,NULL,'Acceso Lista de Usuarios',5,'REDIRECCION','Formularios/ListaUsuario.html','Lista Usuario','activo',NULL,1),(50,NULL,NULL,'Acceso Reporte de Inventario',3,'REDIRECCION','Formularios/ReporteInventario.html','Reporte de Inventario','activo',NULL,30),(51,NULL,NULL,'Acceso Registro Cobranza',6,'REDIRECCION','Formularios/RegistroCobranza.html','Registro de Cobranza','activo',NULL,1),(52,NULL,NULL,'Acceso Estado de Cuenta Cliente',6,'REDIRECCION','Formularios/EstadoCuentaCliente.html','Estado de Cuenta Cliente','activo',NULL,30),(54,NULL,NULL,'Registrar Nueva Venta',1,'ELIMINAR',NULL,'Registrar Nueva Venta','activo',36,1),(55,NULL,NULL,'Anular Venta',1,'ELIMINAR',NULL,'Anular Venta','activo',36,3),(56,NULL,NULL,'Modificar Venta',1,'ELIMINAR',NULL,'Modificar Venta','activo',36,4),(57,NULL,NULL,'Re-Imprimir Venta',1,'ELIMINAR',NULL,'Re-Imprimir Venta','activo',36,5),(58,NULL,NULL,'Navegador de registro',1,'ELIMINAR',NULL,'Navegador de registro','activo',36,2),(59,NULL,NULL,'Realizar descuento',1,'BLOQUEAR',NULL,'Realizar descuento','activo',36,6),(60,NULL,NULL,'Seleccionar otro lote al producto',1,'OCULTAR',NULL,'Seleccionar otro lote al producto','activo',36,7),(61,NULL,NULL,'Cambiar documento de venta',1,'BLOQUEAR',NULL,'Cambiar documento de venta','activo',36,8),(62,NULL,NULL,'Cambiar de sucursal a la venta',1,'BLOQUEAR',NULL,'Cambiar de sucursal a la venta','activo',36,9),(63,NULL,NULL,'Cambiar fecha de venta',1,'BLOQUEAR',NULL,'Cambiar fecha de venta','activo',36,10),(64,NULL,NULL,'Cambiar monto cobrado',1,'BLOQUEAR',NULL,'Cambiar monto cobrado','activo',36,11),(65,NULL,NULL,'Cambiar vendedor de la venta',1,'BLOQUEAR',NULL,'Cambiar vendedor de la venta','activo',36,12),(66,NULL,NULL,'Cambiar cobrador de la venta',1,'BLOQUEAR',NULL,'Cambiar cobrador de la venta','activo',36,13),(67,NULL,NULL,'Ver vista previa de la venta',1,'ELIMINAR',NULL,'Ver vista previa de la venta','activo',36,14),(68,NULL,NULL,'Registrar Nuevo Cliente',1,'ELIMINAR',NULL,'Registrar Nuevo Cliente','activo',42,1),(69,NULL,NULL,'Modificar Cliente',1,'ELIMINAR',NULL,'Modificar Cliente','activo',42,2),(70,NULL,NULL,'Imprimir lista de Cliente',1,'ELIMINAR',NULL,'Imprimir lista de Cliente','activo',42,3),(71,NULL,NULL,'Exportar a Excel Lista de Cliente',1,'ELIMINAR',NULL,'Exportar a Excel Lista de Cliente','activo',42,4),(72,NULL,NULL,'Asignar Descuento Cliente',1,'BLOQUEAR',NULL,'Asignar Descuento Cliente','activo',42,5),(73,NULL,NULL,'Asignar Descuento Maximo Cliente',1,'BLOQUEAR',NULL,'Asignar Descuento Máximo Cliente','activo',42,6),(74,NULL,NULL,'Asignar Limite de Credito',1,'BLOQUEAR',NULL,'Asignar Limite de Crédito','activo',42,7),(75,NULL,NULL,'Registro de Cobranza',1,'ELIMINAR',NULL,'Registro de Cobranza','activo',42,9),(76,NULL,NULL,'Ver Resumen Estado Cuentas',1,'ELIMINAR',NULL,'Ver Resumen Estado Cuentas','activo',42,8),(77,NULL,NULL,'Cambiar al cobrador al momento registrar pago',1,'BLOQUEAR',NULL,'Cambiar al Cobrador al Momento Registrar Pago','activo',42,9),(78,NULL,NULL,'Cambiar la fecha de cobra al momento de cobrar',1,'BLOQUEAR',NULL,'Cambiar la fecha de Cobranza al Momento de Cobrar','activo',42,10),(79,NULL,NULL,'Ver Stock Otras Sucursales',1,'BLOQUEAR',NULL,'Ver Stock Otras Sucursales','activo',41,1),(81,NULL,NULL,'Imprimir lista de Producto',1,'ELIMINAR',NULL,'Imprimir lista de Producto','activo',41,3),(82,NULL,NULL,'Exportar Lista de Producto',1,'ELIMINAR',NULL,'Exportar Lista de Producto','activo',41,4),(83,NULL,NULL,'Cambiar Precio de Venta de Productos',1,'ELIMINAR',NULL,'Cambiar Precio de Venta de Productos','activo',35,1),(84,NULL,NULL,'Imprimir lista de Precio',1,'ELIMINAR',NULL,'Imprimir lista de Precio','activo',35,2),(85,NULL,NULL,'Exportar Lista de Precio',1,'ELIMINAR',NULL,'Exportar Lista de Precio','activo',35,3),(86,NULL,NULL,'Registrar Nueva Sucursal',1,'ELIMINAR',NULL,'Registrar Nueva Sucursal','activo',37,1),(87,NULL,NULL,'Imprimir lista de Sucursal',1,'ELIMINAR',NULL,'Imprimir lista de Sucursal','activo',37,2),(88,NULL,NULL,'Exportar Lista de Sucursal',1,'ELIMINAR',NULL,'Exportar Lista de Sucursal','activo',37,3),(89,NULL,NULL,'Modificar Sucursal',1,'ELIMINAR',NULL,'Modificar Sucursal','activo',37,4),(90,NULL,NULL,'Modificar El Estado de la Sucursal',1,'BLOQUEAR',NULL,'Modificar El Estado de la Sucursal','activo',37,5),(100,NULL,NULL,'Registrar Nueva Compra',2,'ELIMINAR',NULL,'Registrar Nueva Compra','activo',33,1),(101,NULL,NULL,'Navegador de registro',2,'ELIMINAR',NULL,'Navegador de registro','activo',33,2),(102,NULL,NULL,'Eliminar Compra',2,'ELIMINAR',NULL,'Eliminar Compra','activo',33,3),(103,NULL,NULL,'Modificar Compra',2,'ELIMINAR',NULL,'Modificar Compra','activo',33,4),(104,NULL,NULL,'Re-Imprimir Compra',2,'ELIMINAR',NULL,'Re-Imprimir Compra','activo',33,5),(105,NULL,NULL,'Cambiar Documento de Compra',2,'BLOQUEAR',NULL,'Cambiar Documento de Compra','activo',33,8),(106,NULL,NULL,'Cambiar Fecha de Compra',2,'BLOQUEAR',NULL,'Cambiar Fecha de Compra','activo',33,10),(107,NULL,NULL,'Cambiar Encargado de Compra',2,'BLOQUEAR',NULL,'Cambiar Encargado de Compra','activo',33,13),(108,NULL,NULL,'Registrar Nueva Proveedor',2,'ELIMINAR',NULL,'Registrar Nueva Proveedor','activo',29,1),(109,NULL,NULL,'Imprimir lista de Proveedor',2,'ELIMINAR',NULL,'Imprimir lista de Proveedor','activo',29,2),(110,NULL,NULL,'Exportar Lista de Proveedor',2,'ELIMINAR',NULL,'Exportar Lista de Proveedor','activo',29,3),(111,NULL,NULL,'Modificar Proveedor',2,'ELIMINAR',NULL,'Modificar Proveedor','activo',29,4),(112,NULL,NULL,'Modificar El Estado de Proveedor',2,'BLOQUEAR',NULL,'Modificar El Estado de Proveedor','activo',29,5),(113,NULL,NULL,'Acceso Lotes Vencidos',2,'ELIMINAR',NULL,'Acceso Lotes Vencidos','activo',46,1),(114,NULL,NULL,'Acceso Lotes Anulados',2,'ELIMINAR',NULL,'Acceso Lotes Anulados','activo',46,2),(115,NULL,NULL,'Imprimir lista de Lotes',2,'ELIMINAR',NULL,'Imprimir lista de Lotes','activo',46,3),(116,NULL,NULL,'Exportar Lista de Lotes',2,'ELIMINAR',NULL,'Exportar Lista de Lotes','activo',46,4),(117,NULL,NULL,'Cambiar Lote',2,'ELIMINAR',NULL,'Cambiar Lote','activo',46,5),(121,NULL,NULL,'Registrar Nuevo Producto',3,'ELIMINAR',NULL,'Registrar Nuevo Producto','activo',30,1),(122,NULL,NULL,'Imprimir lista de Producto',3,'ELIMINAR',NULL,'Imprimir lista de Producto','activo',30,2),(123,NULL,NULL,'Exportar Lista de Producto',3,'ELIMINAR',NULL,'Exportar Lista de Producto','activo',30,3),(124,NULL,NULL,'Modificar Producto',3,'ELIMINAR',NULL,'Modificar Producto','activo',30,4),(125,NULL,NULL,'Modificar El Estado del Producto',3,'BLOQUEAR',NULL,'Modificar El Estado del Producto','activo',30,5),(126,NULL,NULL,'Crear Nueva Línea',3,'ELIMINAR',NULL,'Crear Nueva Linea','activo',30,6),(127,NULL,NULL,'Crear Nueva Marca',3,'ELIMINAR',NULL,'Crear Nueva Marca','activo',30,7),(128,NULL,NULL,'Registrar Nuevo Almacén',3,'ELIMINAR',NULL,'Registrar Nuevo Almacén','activo',34,1),(129,NULL,NULL,'Imprimir lista de Almacénes',3,'ELIMINAR',NULL,'Imprimir lista de Almacénes','activo',34,2),(130,NULL,NULL,'Exportar Lista de Almacénes',3,'ELIMINAR',NULL,'Exportar Lista de Almacénes','activo',34,3),(131,NULL,NULL,'Modificar Almacén',3,'ELIMINAR',NULL,'Modificar Almacén','activo',34,4),(132,NULL,NULL,'Modificar El Estado del Almacén',3,'BLOQUEAR',NULL,'Modificar El Estado del Almacén','activo',34,5),(133,NULL,NULL,'Modificar la Sucursal del Almacén',3,'BLOQUEAR',NULL,'Modificar la Sucursal del Almacén','activo',34,6),(134,NULL,NULL,'Acceso todos los almacenes',3,'CONFIGURAR',NULL,'Acceso todos los almacenes','activo',43,1),(135,NULL,NULL,'Imprimir lista de Almacenes',3,'ELIMINAR',NULL,'Imprimir lista de Almacenes','activo',43,2),(136,NULL,NULL,'Exportar Lista de Almacenes',3,'ELIMINAR',NULL,'Exportar Lista de Almacenes','activo',43,3),(137,NULL,NULL,'Acceso todos los almacenes',3,'CONFIGURAR',NULL,'Acceso todos los almacenes','activo',50,1),(138,NULL,NULL,'Imprimir Reporte Inventario',3,'ELIMINAR',NULL,'Imprimir Reporte Inventario','activo',50,2),(139,NULL,NULL,'Exportar Reporte de Inventario',3,'ELIMINAR',NULL,'Exportar Reporte de Inventario','activo',50,3),(140,NULL,NULL,'Registrar Cobranza',5,'ELIMINAR',NULL,'Registrar Cobranza','activo',51,1),(141,NULL,NULL,'Navegador de registro',5,'ELIMINAR',NULL,'Navegador de registro','activo',51,2),(142,NULL,NULL,'Eliminar Cobranza',5,'ELIMINAR',NULL,'Eliminar Cobranza','activo',51,3),(143,NULL,NULL,'Modificar Cobranza',5,'ELIMINAR',NULL,'Modificar Cobranza','activo',51,4),(144,NULL,NULL,'Re-Imprimir Cobranza',5,'ELIMINAR',NULL,'Re-Imprimir Cobranza','activo',51,5),(145,NULL,NULL,'Cambiar Fecha de Cobranza',5,'BLOQUEAR',NULL,'Cambiar Fecha de Cobranza','activo',51,10),(146,NULL,NULL,'Cambiar cobrador del registro de cobranza',5,'BLOQUEAR',NULL,'Cambiar cobrador del registro de cobranza','activo',51,13),(147,NULL,NULL,'Registrar Cobranza',5,'ELIMINAR',NULL,'Registrar Cobranza','activo',44,1),(148,NULL,NULL,'Imprimir lista Cuenta por cobrar',5,'ELIMINAR',NULL,'Imprimir lista Cuenta por cobrar','activo',44,3),(149,NULL,NULL,'Exportar a Excel Lista de Cuenta por Cobrar',5,'ELIMINAR',NULL,'Exportar a Excel Lista de Cuenta por Cobrar','activo',44,4),(150,NULL,NULL,'Cambiar Fecha al Registrar Cobranza',5,'BLOQUEAR',NULL,'Cambiar Fecha al Registrar Cobranza','activo',44,5),(151,NULL,NULL,'Cambiar Cobrador al Registrar Cobranza',5,'BLOQUEAR',NULL,'Cambiar Cobrador al Registrar Cobranza','activo',44,6),(152,NULL,NULL,'Imprimir lista Cuenta por cobrar',5,'ELIMINAR',NULL,'Imprimir lista Cuenta por cobrar','activo',52,3),(153,NULL,NULL,'Exportar a Excel Lista de Cuenta por Cobrar',5,'ELIMINAR',NULL,'Exportar a Excel Lista de Cuenta por Cobrar','activo',52,4),(154,NULL,NULL,'Imprimir Reporte de Cobranza',5,'ELIMINAR',NULL,'Imprimir Reporte de Cobranza','activo',45,3),(155,NULL,NULL,'Exportar a Excel Reporte de Cobranza',5,'ELIMINAR',NULL,'Exportar a Excel Reporte de Cobranza','activo',45,4),(156,NULL,NULL,'Acceso Reporte Cobranza Mensual',5,'ELIMINAR',NULL,'Acceso Reporte Cobranza Mensual','activo',45,5),(157,NULL,NULL,'Acceso Reporte Cobranza Diario',5,'ELIMINAR',NULL,'Acceso Reporte Cobranza Diario','activo',45,6),(158,NULL,NULL,'Acceso Reporte Cobranza Detallado',5,'ELIMINAR',NULL,'Acceso Reporte Cobranza Detallado','activo',45,7),(159,NULL,NULL,'Acceso Reporte Cobranza Por Cobrador',5,'ELIMINAR',NULL,'Acceso Reporte Cobranza Por Cobrador','activo',45,8),(160,NULL,NULL,'Registrar Nuevo Usuario',5,'ELIMINAR',NULL,'Registrar Nuevo Usuario','activo',47,1),(161,NULL,NULL,'Imprimir lista de Usuarios',5,'ELIMINAR',NULL,'Imprimir lista de Usuarios','activo',47,2),(162,NULL,NULL,'Exportar Lista de Usuarios',5,'ELIMINAR',NULL,'Exportar Lista de Usuarios','activo',47,3),(163,NULL,NULL,'Modificar Usuario',5,'ELIMINAR',NULL,'Modificar Usuario','activo',47,4),(164,NULL,NULL,'Modificar El Estado del Usuario',5,'BLOQUEAR',NULL,'Modificar El Estado del Usuario','activo',47,5),(165,NULL,NULL,'Modificar la Sucursal de Sucursal',5,'BLOQUEAR',NULL,'Modificar la Sucursal de Sucursal','activo',47,6),(166,NULL,NULL,'Agregar y Quitar Cuentas',5,'BLOQUEAR',NULL,'Agregar y Quitar Cuentas','activo',47,7),(167,NULL,NULL,'Imprimir lista de Usuarios',1,'ELIMINAR',NULL,'Imprimir lista de Usuarios','activo',40,1),(168,NULL,NULL,'Exportar Lista de Usuarios',1,'ELIMINAR',NULL,'Exportar Lista de Usuarios','activo',40,2),(169,NULL,NULL,'acceso Reporte Ventas Mensuales',1,'ELIMINAR',NULL,'acceso Reporte Ventas Mensuales','activo',40,3),(170,NULL,NULL,'acceso Reporte Ventas Diarias',1,'ELIMINAR',NULL,'acceso Reporte Ventas Diarias','activo',40,4),(171,NULL,NULL,'acceso Reporte Ventas Detallada',1,'ELIMINAR',NULL,'acceso Reporte Ventas Detallada','activo',40,5),(172,NULL,NULL,'acceso Reporte Ventas Vendedor',1,'ELIMINAR',NULL,'acceso Reporte Ventas Vendedor','activo',40,7),(173,NULL,NULL,'acceso Reporte Ventas Por Producto',1,'ELIMINAR',NULL,'acceso Reporte Ventas Por Producto','activo',40,8),(174,NULL,NULL,'acceso Reporte Ventas Por Línea Producto',1,'ELIMINAR',NULL,'acceso Reporte Ventas Por Línea Producto','activo',40,9),(175,NULL,NULL,'acceso Reporte Ventas Por Cliente',1,'ELIMINAR',NULL,'acceso Reporte Ventas Por Cliente','activo',40,6),(176,NULL,NULL,'acceso Reporte Ventas Por Marca',1,'ELIMINAR',NULL,'acceso Reporte Ventas Por Marca','activo',40,10),(177,NULL,NULL,'Acceso Todos Los Almacenes',2,'LOGICA',NULL,'Acceso Todos Los Almacenes','activo',33,14),(178,NULL,NULL,'Acceso Todos Los Encargados',2,'LOGICA',NULL,'Acceso Todos Los Encargados','activo',33,15),(189,NULL,NULL,'Acceso Reporte Ingreso Delivery',7,'REDIRECCION','Formularios/IngresosDelivery.html','Reporte Ingreso Delivery','activo',NULL,8),(190,NULL,NULL,'Exportar Lista Ingeresos de Delivery',7,'ELIMINAR',NULL,'Exportar Lista Ingeresos de Delivery','activo',189,9),(191,NULL,NULL,'Imprimir Lista Ingeresos de Delivery',7,'ELIMINAR',NULL,'Imprimir Lista Ingeresos de Delivery','activo',189,10),(193,NULL,NULL,'Cambiar Ciudad',7,'BLOQUEAR',NULL,'Cambiar Ciudad','activo',189,12),(196,NULL,NULL,'Acceso Reporte Pedido App',1,'REDIRECCION','Formularios/ReportePedidoApp.html','Reporte Pedido App','activo',NULL,14),(199,NULL,NULL,'Acceso Traspaso de producto',3,'REDIRECCION','Formularios/TraspasoProducto.html','Traspaso de Producto','activo',NULL,5),(200,NULL,NULL,'Registrar Nuevo Traspaso',3,'ELIMINAR',NULL,'Registrar Nuevo Traspaso','activo',199,1),(201,NULL,NULL,'Navegador de registro',3,'ELIMINAR',NULL,'Navegador de registro','activo',199,2),(202,NULL,NULL,'Eliminar Traspaso de producto',3,'ELIMINAR',NULL,'Eliminar Traspaso de producto','activo',199,3),(203,NULL,NULL,'Modificar Traspaso de Producto',3,'ELIMINAR',NULL,'Modificar Traspaso de Producto','activo',199,4),(204,NULL,NULL,'Re-Imprimir Traspaso de Producto',3,'ELIMINAR',NULL,'Re-Imprimir Traspaso de Producto','activo',199,5),(205,NULL,NULL,'Cambiar Fecha de Compra',3,'BLOQUEAR',NULL,'Cambiar Fecha de Compra','activo',199,6),(206,NULL,NULL,'Cambiar Encargado de Compra',3,'BLOQUEAR',NULL,'Cambiar Encargado de Compra','activo',199,7),(207,NULL,NULL,'Acceso Todos Los Almacenes',3,'LOGICA',NULL,'Acceso Todos Los Almacenes','activo',199,8),(208,NULL,NULL,'Acceso Todos Los Encargados',3,'LOGICA',NULL,'Acceso Todos Los Encargados','activo',199,9),(209,NULL,NULL,'Acceso Ajuste de Inventario',3,'REDIRECCION','Formularios/AjusteInventario.html','Ajuste de Inventario','activo',NULL,5),(210,NULL,NULL,'Registrar Nuevo Ajuste de Inventario',3,'ELIMINAR',NULL,'Registrar Nuevo Ajuste de Inventario','activo',209,1),(211,NULL,NULL,'Navegador de registro',3,'ELIMINAR',NULL,'Navegador de registro','activo',209,2),(212,NULL,NULL,'Eliminar Ajuste de Inventario',3,'ELIMINAR',NULL,'Eliminar Ajuste de Inventario','activo',209,3),(213,NULL,NULL,'Modificar Ajuste de Inventario',3,'ELIMINAR',NULL,'Modificar Ajuste de Inventario','activo',209,4),(214,NULL,NULL,'Re-Imprimir Ajuste de Inventario',3,'ELIMINAR',NULL,'Re-Imprimir Ajuste de Inventario','activo',209,5),(215,NULL,NULL,'Cambiar Fecha de Ajuste de Inventario',3,'BLOQUEAR',NULL,'Cambiar Fecha de Ajuste de Inventario','activo',209,6),(216,NULL,NULL,'Cambiar Encargado de Ajuste de Inventario',3,'BLOQUEAR',NULL,'Cambiar Encargado de Ajuste de Inventario','activo',209,7),(217,NULL,NULL,'Acceso Todos Los Almacenes',3,'LOGICA',NULL,'Acceso Todos Los Almacenes','activo',209,8),(218,NULL,NULL,'Acceso Todos Los Encargados',3,'LOGICA',NULL,'Acceso Todos Los Encargados','activo',209,9),(219,NULL,NULL,'Acceso Reporte de Traspaso de Producto',3,'REDIRECCION','Formularios/ReporteTraspasoProducto.html','Reporte Traspaso de Producto','activo',NULL,10),(220,NULL,NULL,'Acceso Reporte Ajuste de Inventario',3,'REDIRECCION','Formularios/ReporteAjusteInventario.html','Reporte Ajuste de Inventario','activo',NULL,11),(221,NULL,NULL,'Acceso Listado de Choferes',7,'REDIRECCION','Formularios/ListaChofer.html','Listado de Choferes','inactivo',NULL,1),(222,NULL,NULL,'Imprimir Lista de Choferes',7,'ELIMINAR',NULL,'Imprimir Lista de Choferes','activo',221,1),(223,NULL,NULL,'Exportar Lista de Choferes',7,'ELIMINAR',NULL,'Exportar Lista de Choferes','activo',221,2),(224,NULL,NULL,'Cambiar Ciudad',7,'BLOQUEAR',NULL,'Cambiar Ciudad','activo',221,3),(225,NULL,NULL,'Registrar nuevo Chofer',7,'ELIMINAR',NULL,'Registrar nuevo de Chofer','activo',221,4),(226,NULL,NULL,'Modificar datos de Chofer',7,'ELIMINAR',NULL,'Modificar datos de Chofer','activo',221,5),(227,NULL,NULL,'Acceso Tarifario del Delivery',7,'REDIRECCION','Formularios/TarifarioDelivery.html','Tarifario del Delivery','activo',NULL,2),(228,NULL,NULL,'Imprimir Lista de tarifa',7,'ELIMINAR',NULL,'Imprimir Lista de tarifa','activo',227,1),(229,NULL,NULL,'Exportar Lista de tarifa',7,'ELIMINAR',NULL,'Exportar Lista de tarifa','activo',227,2),(230,NULL,NULL,'Cambiar Ciudad',7,'BLOQUEAR',NULL,'Cambiar Ciudad','activo',227,3),(231,NULL,NULL,'Registrar nueva tarifa',7,'ELIMINAR',NULL,'Registrar nueva tarifa','activo',227,4),(232,NULL,NULL,'Modificar tarifa',7,'ELIMINAR',NULL,'Modificar tarifa','activo',227,5),(233,NULL,NULL,'Acceso Categoria de Tienda',3,'REDIRECCION','Formularios/CategoriaTienda.html','Categoria de Tienda','activo',NULL,3),(234,NULL,NULL,'Acceso Lista de Tienda',1,'REDIRECCION','Formularios/ListaTienda.html','Lista de Tienda','activo',NULL,NULL),(235,NULL,NULL,'Acceso Prestamo Dinero',1,'REDIRECCION','Formularios/PrestamoDinero.html','Prestamo de Dinero','activo',NULL,NULL),(236,NULL,NULL,'Acceso Control Pedido',1,'REDIRECCION','Formularios/ControlPedido.html','Control de Pedidos','activo',NULL,0),(237,NULL,NULL,'Acceso Horario de Entrega',1,'REDIRECCION','Formularios/HorarioEntrega.html','Horario de Entrega','activo',NULL,0),(238,NULL,NULL,'Acceso Solicitud de Pago',1,'REDIRECCION','Formularios/SolicitudPago.html','Solicitud de Pago','activo',NULL,0),(239,NULL,NULL,'Acceso Arqueo',1,'REDIRECCION','Formularios/Arqueo.html','Arqueo','activo',NULL,NULL);
/*!40000 ALTER TABLE `permiso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `planpago`
--

DROP TABLE IF EXISTS `planpago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `planpago` (
  `id_planpago` int NOT NULL AUTO_INCREMENT,
  `detalle` varchar(200) DEFAULT NULL,
  `precio` decimal(10,2) DEFAULT NULL,
  `estado` varchar(45) DEFAULT NULL,
  `tipo` varchar(45) DEFAULT NULL,
  `tiempo` varchar(45) DEFAULT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_planpago`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `planpago`
--

LOCK TABLES `planpago` WRITE;
/*!40000 ALTER TABLE `planpago` DISABLE KEYS */;
/*!40000 ALTER TABLE `planpago` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `planprestamo`
--

DROP TABLE IF EXISTS `planprestamo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `planprestamo` (
  `id_planprestamo` int NOT NULL AUTO_INCREMENT,
  `detalle` varchar(45) DEFAULT NULL,
  `vencimiento` varchar(45) DEFAULT NULL,
  `vencimientoActual` varchar(45) DEFAULT NULL,
  `cuota` decimal(10,2) DEFAULT NULL,
  `cuotaActual` decimal(10,2) DEFAULT NULL,
  `capital` decimal(10,2) DEFAULT NULL,
  `capitalVivo` decimal(10,2) DEFAULT NULL,
  `interes` decimal(10,2) DEFAULT NULL,
  `gastoAdministrativo` decimal(10,2) DEFAULT NULL,
  `estado` varchar(45) DEFAULT NULL,
  `prestamo_id` int NOT NULL,
  PRIMARY KEY (`id_planprestamo`),
  KEY `fk_planprestamo_prestamo1_idx` (`prestamo_id`),
  CONSTRAINT `fk_planprestamo_prestamo1` FOREIGN KEY (`prestamo_id`) REFERENCES `prestamo` (`id_prestamo`)
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `planprestamo`
--

LOCK TABLES `planprestamo` WRITE;
/*!40000 ALTER TABLE `planprestamo` DISABLE KEYS */;
INSERT INTO `planprestamo` VALUES (60,'Cuota Nro.: 1','08/03/2021','08/03/2021',164.82,164.82,88.87,911.13,25.95,50.00,'activo',13),(61,'Cuota Nro.: 2','08/04/2021','08/04/2021',164.82,164.82,91.17,819.96,23.65,50.00,'activo',13),(62,'Cuota Nro.: 3','08/05/2021','08/05/2021',164.82,164.82,93.54,726.42,21.28,50.00,'activo',13),(63,'Cuota Nro.: 4','08/06/2021','08/06/2021',164.82,164.82,95.97,630.45,18.85,50.00,'activo',13),(64,'Cuota Nro.: 5','08/07/2021','08/07/2021',164.82,164.82,98.46,531.99,16.36,50.00,'activo',13),(65,'Cuota Nro.: 6','08/08/2021','08/08/2021',164.82,164.82,101.02,430.97,13.81,50.00,'activo',13),(66,'Cuota Nro.: 7','08/09/2021','08/09/2021',164.82,164.82,103.64,327.33,11.19,50.00,'activo',13),(67,'Cuota Nro.: 8','08/10/2021','08/10/2021',164.82,164.82,106.33,221.01,8.50,50.00,'activo',13),(68,'Cuota Nro.: 9','08/11/2021','08/11/2021',164.82,164.82,109.09,111.92,5.74,50.00,'activo',13),(69,'Cuota Nro.: 10','08/12/2021','08/12/2021',164.82,164.82,111.92,0.00,2.90,50.00,'activo',13);
/*!40000 ALTER TABLE `planprestamo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `precioventa`
--

DROP TABLE IF EXISTS `precioventa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `precioventa` (
  `id_PrecioVenta` int NOT NULL AUTO_INCREMENT,
  `precio` decimal(10,2) DEFAULT NULL,
  `fecha` varchar(45) DEFAULT NULL,
  `producto_id` int NOT NULL,
  `usuario_id` int NOT NULL,
  `comision` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id_PrecioVenta`,`producto_id`,`usuario_id`),
  KEY `fk_PrecioVenta_producto1_idx` (`producto_id`),
  KEY `fk_PrecioVenta_usuario1_idx` (`usuario_id`),
  CONSTRAINT `fk_PrecioVenta_producto1` FOREIGN KEY (`producto_id`) REFERENCES `producto` (`id_producto`)
) ENGINE=InnoDB AUTO_INCREMENT=9856 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `precioventa`
--

LOCK TABLES `precioventa` WRITE;
/*!40000 ALTER TABLE `precioventa` DISABLE KEYS */;
INSERT INTO `precioventa` VALUES (9849,35.00,NULL,4941,149,5.00),(9850,350.00,'10/11/2020',4943,149,10.00),(9851,150.00,'10/11/2020',4944,149,5.00),(9852,200.00,'10/11/2020',4945,149,3.00),(9853,60.00,'10/11/2020',4946,149,1.00),(9854,800.00,'10/11/2020',4947,149,10.00),(9855,5.00,'10/11/2020',4948,149,0.00);
/*!40000 ALTER TABLE `precioventa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prestamo`
--

DROP TABLE IF EXISTS `prestamo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prestamo` (
  `id_prestamo` int NOT NULL AUTO_INCREMENT,
  `motivo` varchar(500) DEFAULT NULL,
  `fecha` varchar(45) DEFAULT NULL,
  `fechaModificado` varchar(45) DEFAULT NULL,
  `estado` varchar(45) DEFAULT NULL,
  `nroDocumento` varchar(45) DEFAULT NULL,
  `estadoEntrega` varchar(45) DEFAULT NULL,
  `capital` decimal(10,2) DEFAULT NULL,
  `nroCuotas` int DEFAULT NULL,
  `tasaAnual` decimal(10,2) DEFAULT NULL,
  `metodoPago` varchar(45) DEFAULT NULL,
  `documentoPago` varchar(100) DEFAULT NULL,
  `usuario_id` int NOT NULL,
  `modificadoPor` int NOT NULL,
  `cliente_id` int NOT NULL,
  `sucursal_id` int NOT NULL,
  `empresa_id` int NOT NULL,
  `gastoAdministrativo` decimal(10,2) DEFAULT NULL,
  `primerCuota` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_prestamo`),
  KEY `fk_prestamo_usuario1_idx` (`usuario_id`),
  KEY `fk_prestamo_usuario2_idx` (`modificadoPor`),
  KEY `fk_prestamo_cliente1_idx` (`cliente_id`),
  KEY `fk_prestamo_sucursal1_idx` (`sucursal_id`),
  KEY `fk_prestamo_empresa1_idx` (`empresa_id`),
  CONSTRAINT `fk_prestamo_cliente1` FOREIGN KEY (`cliente_id`) REFERENCES `cliente` (`id_cliente`),
  CONSTRAINT `fk_prestamo_empresa1` FOREIGN KEY (`empresa_id`) REFERENCES `empresa` (`id_empresa`),
  CONSTRAINT `fk_prestamo_sucursal1` FOREIGN KEY (`sucursal_id`) REFERENCES `sucursal` (`id_sucursal`),
  CONSTRAINT `fk_prestamo_usuario1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id_usuario`),
  CONSTRAINT `fk_prestamo_usuario2` FOREIGN KEY (`modificadoPor`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prestamo`
--

LOCK TABLES `prestamo` WRITE;
/*!40000 ALTER TABLE `prestamo` DISABLE KEYS */;
INSERT INTO `prestamo` VALUES (13,'Prestamo de dinero','08/03/2021 10:01:21','08/03/2021 10:01:21','activo','1','Entregado',1000.00,10,36.00,'Efectivo','',149,149,3627,63,87,5.00,'08/03/2021');
/*!40000 ALTER TABLE `prestamo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `producto`
--

DROP TABLE IF EXISTS `producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `producto` (
  `id_producto` int NOT NULL AUTO_INCREMENT,
  `descripcion` longtext,
  `codigo` varchar(200) DEFAULT NULL,
  `precio_venta` decimal(10,2) DEFAULT NULL,
  `fecha_actualizacion` varchar(45) DEFAULT NULL,
  `foto` longtext,
  `marca_id` int NOT NULL,
  `linea_producto_id` int NOT NULL,
  `codigoBarra` varchar(200) DEFAULT NULL,
  `nombre` varchar(300) DEFAULT NULL,
  `fotoGrande` longtext,
  `estado` varchar(45) DEFAULT NULL,
  `empresa_id` int NOT NULL,
  `app` varchar(45) DEFAULT NULL,
  `posicion` int DEFAULT NULL,
  `tipoAtencion` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_producto`,`linea_producto_id`,`empresa_id`),
  KEY `fk_PRODUCTO_MARCA1_idx` (`marca_id`),
  KEY `fk_PRODUCTO_TIPO_PRODUCTO1_idx` (`linea_producto_id`),
  KEY `fk_producto_empresa1_idx` (`empresa_id`),
  CONSTRAINT `fk_producto_empresa1` FOREIGN KEY (`empresa_id`) REFERENCES `empresa` (`id_empresa`),
  CONSTRAINT `fk_PRODUCTO_MARCA1` FOREIGN KEY (`marca_id`) REFERENCES `marca` (`id_marca`),
  CONSTRAINT `fk_PRODUCTO_TIPO_PRODUCTO1` FOREIGN KEY (`linea_producto_id`) REFERENCES `linea_producto` (`id_linea_producto`)
) ENGINE=InnoDB AUTO_INCREMENT=4949 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `producto`
--

LOCK TABLES `producto` WRITE;
/*!40000 ALTER TABLE `producto` DISABLE KEYS */;
INSERT INTO `producto` VALUES (4940,'Es un super producto bebe','',NULL,'09/10/2020','http://localhost/laSueca/Imagen/Producto/p_4940_foto_09_10_2020_13_49_49.png',487,1143,'','Producto A','','activo',87,'activo',1,'diario'),(4941,'Victrola - Tocadiscos vintage y transportable de 3 velocidades, con Bluetooth y altavoces integrados','11111',NULL,'13/11/2020','http://localhost/Emprendedor/Imagen/Producto/p_4941_foto_08_10_2020_23_25_31.png',487,1146,'','Producto B','','activo',87,'activo',0,'diario'),(4942,'como esta el producto','',NULL,'09/03/2021','https://m.media-amazon.com/images/I/11tEFlSGn6L._AC_SY200_.jpg',487,1143,'','Producto C','','activo',87,'activo',4,'diario'),(4943,'Victrola - Tocadiscos vintage y transportable de 3 velocidades, con Bluetooth y altavoces integrados','',NULL,'10/11/2020','https://m.media-amazon.com/images/I/41ffko0T3kL._AC_SY200_.jpg',487,1143,'','Extensor de Wifi','','activo',87,'activo',0,'diario'),(4944,'Victrola - Tocadiscos vintage y transportable de 3 velocidades, con Bluetooth y altavoces integrados','',NULL,'10/11/2020','https://m.media-amazon.com/images/I/41KL+iXUXCL._AC_SY200_.jpg',487,1144,'','Bolso de mujer','','activo',87,'activo',0,'diario'),(4945,'Victrola - Tocadiscos vintage y transportable de 3 velocidades, con Bluetooth y altavoces integrados','',NULL,'13/11/2020','https://m.media-amazon.com/images/I/51G8LfsNZzL._AC_SY200_.jpg',487,1146,'','Estuche de colores','','activo',87,'activo',0,'diario'),(4946,'Victrola - Tocadiscos vintage y transportable de 3 velocidades, con Bluetooth y altavoces integrados','',NULL,'13/11/2020','https://m.media-amazon.com/images/I/31i3tpuXxxL._AC_SY200_.jpg',487,1144,'','Audifonos','','activo',87,'activo',0,'diario'),(4947,'Victrola - Tocadiscos vintage y transportable de 3 velocidades, con Bluetooth y altavoces integrados','',NULL,'09/03/2021','https://m.media-amazon.com/images/I/41yavwjp-8L._AC_SY200_.jpg',487,1145,'','Rocola antigua','','activo',87,'activo',1,'diario'),(4948,'Victrola - Tocadiscos vintage y transportable de 3 velocidades, con Bluetooth y altavoces integrados','',NULL,'10/11/2020','https://m.media-amazon.com/images/I/21zodo7QkUL._AC_SY200_.jpg',487,1144,'','audifonos huawei','','activo',87,'activo',0,'diario');
/*!40000 ALTER TABLE `producto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `provedor`
--

DROP TABLE IF EXISTS `provedor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `provedor` (
  `id_provedor` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(500) DEFAULT NULL,
  `razonsocial` varchar(500) DEFAULT NULL,
  `nit` varchar(100) DEFAULT NULL,
  `direccion` varchar(600) DEFAULT NULL,
  `telefono` varchar(200) DEFAULT NULL,
  `email` varchar(300) DEFAULT NULL,
  `personaContacto` varchar(300) DEFAULT NULL,
  `numeroPersonaContacto` varchar(200) DEFAULT NULL,
  `estado` varchar(45) DEFAULT NULL,
  `formaPago` varchar(45) DEFAULT NULL,
  `tipoDocumento` varchar(45) DEFAULT NULL,
  `fechaActualizacion` varchar(45) DEFAULT NULL,
  `usuarioActualizacion_id` int NOT NULL,
  `empresa_id` int NOT NULL,
  PRIMARY KEY (`id_provedor`,`empresa_id`),
  KEY `fk_provedor_usuario1_idx` (`usuarioActualizacion_id`),
  KEY `fk_provedor_empresa1_idx` (`empresa_id`),
  CONSTRAINT `fk_provedor_empresa1` FOREIGN KEY (`empresa_id`) REFERENCES `empresa` (`id_empresa`),
  CONSTRAINT `fk_provedor_usuario1` FOREIGN KEY (`usuarioActualizacion_id`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=280 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `provedor`
--

LOCK TABLES `provedor` WRITE;
/*!40000 ALTER TABLE `provedor` DISABLE KEYS */;
INSERT INTO `provedor` VALUES (279,'Provedor Generico','Provedor Generico','0','','','','','','activo','Contado','Compra Facturada','01/04/2021 04:08:52',149,87);
/*!40000 ALTER TABLE `provedor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `publicidadapp`
--

DROP TABLE IF EXISTS `publicidadapp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `publicidadapp` (
  `id_publicidadApp` int NOT NULL AUTO_INCREMENT,
  `alias` varchar(200) DEFAULT NULL,
  `texto` varchar(400) DEFAULT NULL,
  `imagen` varchar(200) DEFAULT NULL,
  `colorLetra` varchar(45) DEFAULT NULL,
  `colorFondo` varchar(45) DEFAULT NULL,
  `estado` varchar(45) DEFAULT NULL,
  `tipo` varchar(45) DEFAULT NULL,
  `inicio` varchar(45) DEFAULT NULL,
  `fin` varchar(45) DEFAULT NULL,
  `ciudad_id` int DEFAULT NULL,
  `link` varchar(400) DEFAULT NULL,
  `posicion` int DEFAULT NULL,
  PRIMARY KEY (`id_publicidadApp`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `publicidadapp`
--

LOCK TABLES `publicidadapp` WRITE;
/*!40000 ALTER TABLE `publicidadapp` DISABLE KEYS */;
/*!40000 ALTER TABLE `publicidadapp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `solicitudcomision`
--

DROP TABLE IF EXISTS `solicitudcomision`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `solicitudcomision` (
  `id_SolicitudComision` int NOT NULL AUTO_INCREMENT,
  `solicitado` varchar(45) DEFAULT NULL,
  `estado` varchar(45) DEFAULT NULL,
  `nroDocumento` varchar(45) DEFAULT NULL,
  `fechaPagado` varchar(45) DEFAULT NULL,
  `id_tienda` int DEFAULT NULL,
  `actualizadoPor` int DEFAULT NULL,
  `montoPago` decimal(10,2) DEFAULT NULL,
  `tipoPago` varchar(45) DEFAULT NULL,
  `fechaActualizado` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_SolicitudComision`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `solicitudcomision`
--

LOCK TABLES `solicitudcomision` WRITE;
/*!40000 ALTER TABLE `solicitudcomision` DISABLE KEYS */;
INSERT INTO `solicitudcomision` VALUES (14,'22/03/2021 23:36:28','pendiente','',NULL,4,NULL,21.00,'Comision Propia','22/03/2021 23:36:28'),(15,'22/03/2021 23:36:49','pendiente','',NULL,4,NULL,2.00,'Comision Hijo','22/03/2021 23:36:49'),(16,'22/03/2021 23:37:07','pendiente','',NULL,4,NULL,6.46,'Comision Nietos','22/03/2021 23:37:07');
/*!40000 ALTER TABLE `solicitudcomision` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sucursal`
--

DROP TABLE IF EXISTS `sucursal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sucursal` (
  `id_sucursal` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(200) DEFAULT NULL,
  `telefono` varchar(45) DEFAULT NULL,
  `nit` varchar(45) DEFAULT NULL,
  `direccion` varchar(400) DEFAULT NULL,
  `logo` longtext,
  `correo` varchar(400) DEFAULT NULL,
  `documentoVenta` varchar(45) DEFAULT NULL,
  `estructuraDocumentoVenta` varchar(100) DEFAULT NULL,
  `estado` varchar(45) DEFAULT NULL,
  `empresa_id` int NOT NULL,
  `pais` varchar(45) DEFAULT NULL,
  `horarioDe1` varchar(45) DEFAULT NULL,
  `horarioDe2` varchar(45) DEFAULT NULL,
  `app` varchar(45) DEFAULT NULL,
  `lon` varchar(60) DEFAULT NULL,
  `lat` varchar(60) DEFAULT NULL,
  `ciudad_id` int NOT NULL,
  `horarioHasta1` varchar(45) DEFAULT NULL,
  `horarioHasta2` varchar(45) DEFAULT NULL,
  `tokenFirebase` varchar(300) DEFAULT NULL,
  `tipoAtencion` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_sucursal`,`empresa_id`,`ciudad_id`),
  KEY `fk_sucursal_empresa1_idx` (`empresa_id`),
  KEY `fk_sucursal_ciudad1_idx` (`ciudad_id`),
  CONSTRAINT `fk_sucursal_ciudad1` FOREIGN KEY (`ciudad_id`) REFERENCES `ciudad` (`id_ciudad`),
  CONSTRAINT `fk_sucursal_empresa1` FOREIGN KEY (`empresa_id`) REFERENCES `empresa` (`id_empresa`)
) ENGINE=InnoDB AUTO_INCREMENT=427 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sucursal`
--

LOCK TABLES `sucursal` WRITE;
/*!40000 ALTER TABLE `sucursal` DISABLE KEYS */;
INSERT INTO `sucursal` VALUES (63,'Casa Matriz','75685675 - 76862316 - 60842772','1714480010','Calle Saavedra esquina tarija','https://www.emprendedor-wd.com/Imagen/Sucursal/s_63_logo_25_06_2020_20_47_34.png','wdigitalsolutions02@gmail.com','Nota de Venta','Hoja Carta','activo',87,'Bolivia','0:00:00','0:00:00','activo','-63.181530','-17.782786',1,'0:0:00','0:00:00','dIc8e1JNUaE:APA91bFCi_N78erL880i0MbMcnroLtjhVejF2Mp8nXO4oijigG0z0IhpVpdZrRYxv5gswmSZxU1hhusVz30QLL_uQ1Ov5uNFRRYn5JdsCK0zKnhYXItatANVjUz-2xnvk8iR5JXjsjXL','diario'),(309,'Sucursal El Trompillo','75020104','0','av ribera','http://localhost/laSueca/Imagen/Sucursal/s_309_logo_08_10_2020_23_43_29.png','','Nota de Venta','Hoja Carta','activo',87,'Bolivia','0:00:00','0:00:00','inactivo','-63.17470646026612','-17.801828028227106',1,'0:0:00','0:0:00',NULL,'');
/*!40000 ALTER TABLE `sucursal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tarifarioapp`
--

DROP TABLE IF EXISTS `tarifarioapp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tarifarioapp` (
  `id_tarifarioAPP` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `de` decimal(10,2) DEFAULT NULL,
  `hasta` decimal(10,2) DEFAULT NULL,
  `precio` decimal(10,2) DEFAULT NULL,
  `estado` varchar(45) DEFAULT NULL,
  `tipo` varchar(45) DEFAULT NULL,
  `ciudad_id` int DEFAULT NULL,
  `afiliado` varchar(45) DEFAULT NULL,
  `empresa_id` int DEFAULT NULL,
  PRIMARY KEY (`id_tarifarioAPP`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tarifarioapp`
--

LOCK TABLES `tarifarioapp` WRITE;
/*!40000 ALTER TABLE `tarifarioapp` DISABLE KEYS */;
/*!40000 ALTER TABLE `tarifarioapp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tienda`
--

DROP TABLE IF EXISTS `tienda`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tienda` (
  `id_tienda` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(400) DEFAULT NULL,
  `cuenta` varchar(45) DEFAULT NULL,
  `contrasena` varchar(300) DEFAULT NULL,
  `estado` varchar(45) DEFAULT NULL,
  `registrado` varchar(45) DEFAULT NULL,
  `logo` varchar(400) DEFAULT NULL,
  `fechaModifico` varchar(45) DEFAULT NULL,
  `registradoPor` int NOT NULL,
  `modificadoPor` int NOT NULL,
  `cliente_id` int NOT NULL,
  `empresa_id` int DEFAULT NULL,
  `padre` int DEFAULT NULL,
  `banco` varchar(60) DEFAULT NULL,
  `cuentaBancaria` varchar(100) DEFAULT NULL,
  `moneda` varchar(10) DEFAULT NULL,
  `nombreCuenta` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id_tienda`),
  KEY `fk_tienda_usuario1_idx` (`registradoPor`),
  KEY `fk_tienda_usuario2_idx` (`modificadoPor`),
  KEY `fk_tienda_cliente1_idx` (`cliente_id`),
  CONSTRAINT `fk_tienda_cliente1` FOREIGN KEY (`cliente_id`) REFERENCES `cliente` (`id_cliente`),
  CONSTRAINT `fk_tienda_usuario1` FOREIGN KEY (`registradoPor`) REFERENCES `usuario` (`id_usuario`),
  CONSTRAINT `fk_tienda_usuario2` FOREIGN KEY (`modificadoPor`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tienda`
--

LOCK TABLES `tienda` WRITE;
/*!40000 ALTER TABLE `tienda` DISABLE KEYS */;
INSERT INTO `tienda` VALUES (4,'Tienda Totot','williams','e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855','activo','04/04/2021 11:20:25','http://localhost/laSueca/intranet/Imagen/Iconos/earth190.svg','04/04/2021 11:20:25',149,149,3625,87,0,'5555','4444','Bs','55555'),(5,'Padre 2','padre1','3253582ebf67cd8454842dcd61e712bc80caa11587cca5d13e102589dc8ff130','activo','22/03/2021 21:31:49','http://localhost/laSueca/intranet/Imagen/Iconos/earth190.svg','22/03/2021 21:31:49',149,149,3631,87,4,NULL,NULL,NULL,NULL),(6,'Abuelo 2','abuelo','a0e195ed183e85c07549b1bc1071d0b7b671a0820a38f72ff0b5afc2634c831f','activo','22/03/2021 21:32:09','http://localhost/laSueca/intranet/Imagen/Iconos/earth190.svg','22/03/2021 21:32:09',149,149,3632,87,5,NULL,NULL,NULL,NULL),(7,'tienda numero 1','gabrield','a91c925833dd054a93e59c57627ef0e3c451678437f6df97c9ed99c4f3e9dff6','activo','24/03/2021 09:51:06','http://localhost/laSueca/intranet/Imagen/Iconos/earth190.svg','24/03/2021 09:51:06',149,149,3633,87,4,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `tienda` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `traspasoproducto`
--

DROP TABLE IF EXISTS `traspasoproducto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `traspasoproducto` (
  `id_traspasoProducto` int NOT NULL AUTO_INCREMENT,
  `nroDocumento` int DEFAULT NULL,
  `detalle` varchar(400) DEFAULT NULL,
  `fecha` varchar(45) DEFAULT NULL,
  `fechaActualizado` varchar(45) DEFAULT NULL,
  `usuarioEncargado` int NOT NULL,
  `usuarioActualizo` int NOT NULL,
  `almacenOrigen` int NOT NULL,
  `almacenDestino` int NOT NULL,
  `estado` varchar(45) DEFAULT NULL,
  `empresa_id` int NOT NULL,
  PRIMARY KEY (`id_traspasoProducto`),
  KEY `fk_traspasoProducto_usuario1_idx` (`usuarioEncargado`),
  KEY `fk_traspasoProducto_usuario2_idx` (`usuarioActualizo`),
  KEY `fk_traspasoProducto_almacen1_idx` (`almacenOrigen`),
  KEY `fk_traspasoProducto_almacen2_idx` (`almacenDestino`),
  KEY `fk_traspasoProducto_empresa1_idx` (`empresa_id`),
  CONSTRAINT `fk_traspasoProducto_almacen1` FOREIGN KEY (`almacenOrigen`) REFERENCES `almacen` (`id_almacen`),
  CONSTRAINT `fk_traspasoProducto_almacen2` FOREIGN KEY (`almacenDestino`) REFERENCES `almacen` (`id_almacen`),
  CONSTRAINT `fk_traspasoProducto_empresa1` FOREIGN KEY (`empresa_id`) REFERENCES `empresa` (`id_empresa`),
  CONSTRAINT `fk_traspasoProducto_usuario1` FOREIGN KEY (`usuarioEncargado`) REFERENCES `usuario` (`id_usuario`),
  CONSTRAINT `fk_traspasoProducto_usuario2` FOREIGN KEY (`usuarioActualizo`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `traspasoproducto`
--

LOCK TABLES `traspasoproducto` WRITE;
/*!40000 ALTER TABLE `traspasoproducto` DISABLE KEYS */;
INSERT INTO `traspasoproducto` VALUES (1,1,'Traspaso de producto','08/10/2020 23:53:06','08/10/2020 23:53:06',149,149,43,351,'activo',87);
/*!40000 ALTER TABLE `traspasoproducto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `cuenta` varchar(50) DEFAULT NULL,
  `contrasena` longtext,
  `nombre` varchar(400) DEFAULT NULL,
  `ci` varchar(50) DEFAULT NULL,
  `telefono` varchar(150) DEFAULT NULL,
  `foto` longtext,
  `estado` varchar(10) DEFAULT 'ACTIVO',
  `sucursal_id` int DEFAULT NULL,
  `fecha_contratado` varchar(45) DEFAULT NULL,
  `direccion` varchar(400) DEFAULT NULL,
  `fecha_retirado` varchar(45) DEFAULT NULL,
  `Perfil_id` int DEFAULT NULL,
  `fechaActualizacion` varchar(45) DEFAULT NULL,
  `empresa_id` int NOT NULL,
  `notificacion` varchar(45) DEFAULT NULL,
  `tokenFirebase` varchar(300) DEFAULT NULL,
  `ciudad_id` int DEFAULT NULL,
  PRIMARY KEY (`id_usuario`,`empresa_id`),
  KEY `fk_USUARIO_SUCURSAL1` (`sucursal_id`),
  KEY `fk_usuario_Perfil1_idx` (`Perfil_id`),
  KEY `fk_usuario_empresa1_idx` (`empresa_id`),
  CONSTRAINT `fk_usuario_empresa1` FOREIGN KEY (`empresa_id`) REFERENCES `empresa` (`id_empresa`),
  CONSTRAINT `fk_usuario_Perfil1` FOREIGN KEY (`Perfil_id`) REFERENCES `perfil` (`id_Perfil`),
  CONSTRAINT `fk_USUARIO_SUCURSAL1` FOREIGN KEY (`sucursal_id`) REFERENCES `sucursal` (`id_sucursal`)
) ENGINE=InnoDB AUTO_INCREMENT=464 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (149,'williams','b3fddeff8507af6036cb6ba812848a7450edaeb917676991ef7cd301e2577860','Williams Armando Montenegro Mansilla','','75685675','../Imagen/ICONOS/cliente.svg','activo',63,'31/05/2020 15:20:05','Av. Tarija equina Warnes','',NULL,'07/01/2021 10:22:43',87,'activo','cHd7IZdI9KI:APA91bFs-lRYEYUEsEYm-2mSkWFg8GBQC_nyLSCFzKN1cKtS2HhBKo5zYusE7Pc3051JoNsE3Q3HABEPLRgxz05Xm_1uqn8GH1J27M7ORy3H1d_T_auQu388o62WpmCIg_LafGuUa7Cb',2),(150,'angelsossa','9b7af877e7ad4c237a87d38a767e4975ec90b978886e117f1952638a970db4f9','Angel Manuel Jesus Sossa Ortiz','7651384','65214004','../Imagen/ICONOS/cliente.svg','activo',63,'31/05/2020','Trinidad, Urb. San Pedro II, Calle V_2 lote 6','',NULL,'18/06/2020 16:51:21',87,'activo','fcRQ8YJH-AU:APA91bF1D75BJ8zJyoz6j8m-Rin-rXgSQlGr0kfc9mJR19xpEdNG01xqTKN6jhMxHZtW1VuITsA3iAhLSLd1ce-RmlyYZaXSKxkYL1Y6Cu1GjSHi2_HrXFagWemPtimBwjnLesRFYcoy',2),(194,'memo50','00c65e56424eead70dd4c74ba53e84bda36f9d6229df1a97130381511b713992','Guillermo Menacho Chavez','6386285','75020104','../Imagen/ICONOS/cliente.svg','activo',63,'18/06/2020','Av. Centenario #139','',NULL,'18/06/2020 21:51:40',87,'activo','fsFYm-iISJCBBfky758M54:APA91bGJ31LWjDrUlPYfhNEoFEtKZK-t8YNnoB2wpDz2p6P1Jpl6V1jTVQ7RXWtC82jPeSkMfecT_ftkCVXBi98hwP9lEtfMyLbLOZ2Xzp_ynuqdB6kTe1VFPfyyVVDHXJiJT4CiVN9D',1),(334,'Gcabral','dff3c7ef5be6b1dfa77350c0eeb786c529ecc1312f4660b794cbcc1562ef924a','Gilmert Cabral Banegas','','74582706','../Imagen/ICONOS/cliente.svg','activo',63,'06/08/2020','Urb. Los Tocos','',NULL,'19/08/2020 18:12:37',87,'activo','fLltwOzzjtU:APA91bFZ5aayoeHt4kfaO_DsL1YR-PkaZEoi49LQEnqp92wt40MjR2hMS9mHQaN4EUVB3BU1Sp3z-C_Cp1gENIO2cLsZbPsPj-7vOCmnSaVaqUZunGfI9aXH2oD2MT6aNyzCaqDWinFA',2),(384,'luisa','73e4935fcd6dfbc26aa88d49b1304bff6f1dfdcfaa021e72e73d06025286eb1c','Luisa Delgado','11111','','../Imagen/ICONOS/cliente.svg','activo',63,'29/08/2020','','',NULL,'28/10/2020 08:31:54',87,'activo','dJRc-0Mo0Qs:APA91bHU-vax4d1Lwd9Rt_8JHG6D_lw9kxp_SLJ0esiSuKF4mj-AatWCzzt8Yg3SEJpR1eynKqHzj_RIaG2H0P8CbMHTKAQb0UUYVqbcKCM2mhVZW3Kylgodg48djWvb_GvzVSftlR0w',1);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario_permiso`
--

DROP TABLE IF EXISTS `usuario_permiso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario_permiso` (
  `usuario_id` int NOT NULL,
  `permiso_id` int NOT NULL,
  PRIMARY KEY (`usuario_id`,`permiso_id`),
  KEY `fk_usuario_has_permiso_permiso1_idx` (`permiso_id`),
  KEY `fk_usuario_has_permiso_usuario1_idx` (`usuario_id`),
  CONSTRAINT `fk_usuario_has_permiso_permiso1` FOREIGN KEY (`permiso_id`) REFERENCES `permiso` (`id_permiso`),
  CONSTRAINT `fk_usuario_has_permiso_usuario1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario_permiso`
--

LOCK TABLES `usuario_permiso` WRITE;
/*!40000 ALTER TABLE `usuario_permiso` DISABLE KEYS */;
INSERT INTO `usuario_permiso` VALUES (149,29),(150,29),(149,30),(150,30),(149,31),(150,31),(384,31),(149,32),(150,32),(384,32),(149,33),(150,33),(149,34),(150,34),(149,35),(150,35),(384,35),(149,36),(150,36),(384,36),(149,37),(150,37),(384,37),(149,40),(150,40),(384,40),(149,41),(150,41),(334,41),(384,41),(149,42),(150,42),(384,42),(149,43),(150,43),(149,44),(150,44),(149,45),(150,45),(149,46),(149,47),(150,47),(384,47),(149,50),(150,50),(149,51),(150,51),(149,52),(150,52),(149,54),(150,54),(149,55),(150,55),(149,56),(150,56),(149,57),(150,57),(149,58),(150,58),(149,59),(150,59),(149,60),(149,61),(150,61),(149,62),(150,62),(149,63),(150,63),(149,64),(150,64),(149,65),(150,65),(149,66),(150,66),(149,67),(150,67),(149,68),(150,68),(149,69),(150,69),(149,70),(150,70),(149,71),(150,71),(149,72),(150,72),(149,73),(150,73),(149,74),(150,74),(149,75),(150,75),(149,76),(150,76),(149,77),(150,77),(149,78),(150,78),(149,79),(149,81),(149,82),(149,83),(149,84),(149,85),(149,86),(149,87),(149,88),(149,89),(149,90),(149,100),(149,101),(149,102),(149,103),(149,104),(149,105),(149,106),(149,107),(149,108),(149,109),(149,110),(149,111),(149,112),(149,113),(149,114),(149,115),(149,116),(149,117),(149,121),(149,122),(149,123),(149,124),(149,125),(149,126),(149,127),(149,128),(149,129),(149,130),(149,131),(149,132),(149,133),(149,134),(149,135),(149,136),(149,137),(149,138),(149,139),(149,140),(149,141),(149,142),(149,143),(149,144),(149,145),(149,146),(149,147),(149,148),(149,149),(149,150),(149,151),(149,152),(149,153),(149,154),(149,155),(149,156),(149,157),(149,158),(149,159),(149,160),(150,160),(384,160),(149,161),(150,161),(384,161),(149,162),(150,162),(384,162),(149,163),(150,163),(384,163),(149,164),(150,164),(384,164),(149,165),(150,165),(384,165),(149,166),(150,166),(384,166),(149,167),(149,168),(149,169),(149,170),(149,171),(149,172),(149,173),(149,174),(149,175),(149,176),(149,177),(149,178),(150,189),(194,189),(384,189),(149,190),(150,190),(194,190),(384,190),(149,191),(150,191),(194,191),(384,191),(149,193),(150,193),(149,196),(150,196),(384,196),(149,199),(149,200),(149,201),(149,202),(149,203),(149,204),(149,205),(149,206),(149,207),(149,208),(149,209),(149,210),(149,211),(149,212),(149,213),(149,214),(149,215),(149,216),(149,217),(149,218),(149,219),(149,220),(149,222),(149,223),(149,224),(149,225),(149,226),(149,233),(149,234),(384,234),(149,235),(384,235),(149,236),(149,237),(149,238),(149,239);
/*!40000 ALTER TABLE `usuario_permiso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `venta`
--

DROP TABLE IF EXISTS `venta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `venta` (
  `id_venta` int NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(200) DEFAULT NULL,
  `tipoVenta` varchar(50) DEFAULT NULL,
  `fecha` varchar(50) DEFAULT NULL,
  `usuario_id` int NOT NULL,
  `fechaModificacion` varchar(45) DEFAULT NULL,
  `nit` varchar(50) DEFAULT NULL,
  `razonsocial` varchar(150) DEFAULT NULL,
  `Autorizacion` varchar(70) DEFAULT NULL,
  `codigoControl` varchar(60) DEFAULT NULL,
  `estado` varchar(45) DEFAULT NULL,
  `cliente_id` int NOT NULL,
  `sucursal_id` int NOT NULL,
  `tipoPago` varchar(45) DEFAULT NULL,
  `nroDocumento` int DEFAULT NULL,
  `fechaLimiteEmision` varchar(45) DEFAULT NULL,
  `mensajeImpuesto` longtext,
  `actividadEconomica` longtext,
  `estadoEntrega` varchar(45) DEFAULT NULL,
  `fechaEntrega` varchar(45) DEFAULT NULL,
  `direccionEntrega` mediumtext,
  `comentario` mediumtext,
  `tipoDocumento` varchar(45) DEFAULT NULL,
  `nroNota` int DEFAULT NULL,
  `empresa_id` int NOT NULL,
  `usuarioActualizo_id` int NOT NULL,
  PRIMARY KEY (`id_venta`,`empresa_id`,`usuarioActualizo_id`),
  KEY `fk_venta_usuario1_idx` (`usuario_id`),
  KEY `fk_venta_cliente1_idx` (`cliente_id`),
  KEY `fk_venta_sucursal1_idx` (`sucursal_id`),
  KEY `fk_venta_empresa1_idx` (`empresa_id`),
  KEY `fk_venta_usuario2_idx` (`usuarioActualizo_id`),
  CONSTRAINT `fk_venta_cliente1` FOREIGN KEY (`cliente_id`) REFERENCES `cliente` (`id_cliente`),
  CONSTRAINT `fk_venta_empresa1` FOREIGN KEY (`empresa_id`) REFERENCES `empresa` (`id_empresa`),
  CONSTRAINT `fk_venta_sucursal1` FOREIGN KEY (`sucursal_id`) REFERENCES `sucursal` (`id_sucursal`),
  CONSTRAINT `fk_venta_usuario1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id_usuario`),
  CONSTRAINT `fk_venta_usuario2` FOREIGN KEY (`usuarioActualizo_id`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=4775 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `venta`
--

LOCK TABLES `venta` WRITE;
/*!40000 ALTER TABLE `venta` DISABLE KEYS */;
INSERT INTO `venta` VALUES (4750,'Venta Al Contado','Credito','09/10/2020 00:18:57',150,'09/10/2020 00:18:57','0','Sin Nombre','','','activo',2619,63,'Efectivo',0,'','','','Entregado','09/10/2020','','','Nota de Venta',1,87,149),(4757,'Venta Al Contado','Contado','09/10/2020 00:44:35',150,'09/10/2020 00:44:35','0','Sin Nombre','','','activo',2619,63,'Efectivo',0,'','','','Entregado','09/10/2020','','','Nota de Venta',2,87,149),(4763,'Venta Al Contado APP','Contado','22/02/2021 08:43:38',149,'22/02/2021 08:44:33','','','','','inactivo',3626,63,'Efectivo',0,'','','','Entregado','22/02/2021','','','Nota de Venta',3,87,149),(4764,'Venta Al Contado','Credito','22/02/2021 08:58:32',150,'22/02/2021 08:58:32','1111','williams','','','activo',3625,63,'Efectivo',0,'','','','Entregado','22/02/2021','','','Nota de Venta',4,87,149),(4765,'Venta Al Contado APP','Contado','22/02/2021 09:01:30',149,'22/02/2021 09:01:30','','','','','activo',3627,63,'Efectivo',0,'','','','Entregado','22/02/2021','','','Nota de Venta',5,87,149),(4766,'Venta Al Contado APP','Contado','22/02/2021 11:39:16',149,'22/02/2021 11:41:41','','','','','inactivo',3627,63,'Efectivo',0,'','','','Entregado','22/02/2021','','','Nota de Venta',6,87,149),(4767,'Venta Al Contado APP','Contado','08/03/2021 10:07:59',149,'08/03/2021 10:09:45','','','','','inactivo',3628,63,'Efectivo',0,'','','','Entregado','08/03/2021','','','Nota de Venta',7,87,149),(4768,'Venta Al Contado APP','Contado','13/03/2021 16:48:43',149,'13/03/2021 16:48:53','','','','','inactivo',3629,63,'Efectivo',0,'','','','Entregado','13/03/2021','','','Nota de Venta',8,87,149),(4769,'Venta Al Contado APP','Contado','14/03/2021 14:24:31',149,'26/03/2021 10:25:40','','','','','inactivo',3629,63,'Efectivo',0,'','','','Entregado','14/03/2021','','','Nota de Venta',9,87,149),(4770,'Venta Al Contado APP','Contado','14/03/2021 14:24:43',149,'26/03/2021 10:27:18','','','','','inactivo',3630,63,'Efectivo',0,'','','','Entregado','14/03/2021','','','Nota de Venta',10,87,149),(4771,'Venta Al Contado APP','Contado','24/03/2021 10:22:54',149,'26/03/2021 10:31:54','','','','','inactivo',3628,63,'Efectivo',0,'','','','Entregado','24/03/2021','','','Nota de Venta',11,87,149),(4772,'Venta Al Contado APP','Contado','26/03/2021 10:35:41',149,'26/03/2021 10:35:54','','','','','inactivo',3628,63,'Efectivo',0,'','','','Entregado','26/03/2021','','','Nota de Venta',12,87,149),(4773,'Venta Al Contado APP','Contado','30/03/2021 11:13:49',149,'30/03/2021 11:13:49','','','','','activo',3634,63,'Efectivo',0,'','','','Entregado','30/03/2021','','','Nota de Venta',13,87,149),(4774,'Venta Al Contado APP','Contado','12/04/2021 11:00:13',149,'12/04/2021 11:00:13','','','','','activo',3635,63,'Efectivo',0,'','','','Entregado','12/04/2021','','','Nota de Venta',14,87,149);
/*!40000 ALTER TABLE `venta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `version`
--

DROP TABLE IF EXISTS `version`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `version` (
  `id_version` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `version` int DEFAULT NULL,
  `id` int DEFAULT NULL,
  `empresa_id` int NOT NULL,
  PRIMARY KEY (`id_version`,`empresa_id`),
  KEY `fk_version_empresa1_idx` (`empresa_id`),
  CONSTRAINT `fk_version_empresa1` FOREIGN KEY (`empresa_id`) REFERENCES `empresa` (`id_empresa`)
) ENGINE=InnoDB AUTO_INCREMENT=24872 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `version`
--

LOCK TABLES `version` WRITE;
/*!40000 ALTER TABLE `version` DISABLE KEYS */;
INSERT INTO `version` VALUES (11170,'usuario',5,150,87),(11182,'usuario',8,194,87),(20053,'usuario',11,334,87),(24806,'cliente',3,2619,87),(24808,'producto',5,4940,87),(24830,'usuario',16,384,87),(24836,'cliente',7,3624,87),(24838,'producto',7,4943,87),(24839,'producto',8,4944,87),(24843,'producto',12,4948,87),(24845,'producto',14,4946,87),(24846,'producto',15,4945,87),(24847,'producto',16,4941,87),(24848,'usuario',17,149,87),(24850,'cliente',10,3626,87),(24852,'cliente',12,3627,87),(24853,'cliente',13,3628,87),(24854,'producto',17,4947,87),(24855,'producto',18,4942,87),(24856,'cliente',14,3629,87),(24857,'cliente',15,3630,87),(24860,'cliente',18,3631,87),(24861,'cliente',19,3632,87),(24862,'cliente',20,3633,87),(24863,'cliente',21,3634,87),(24870,'cliente',24,3625,87),(24871,'cliente',25,3635,87);
/*!40000 ALTER TABLE `version` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'lasueca'
--

--
-- Dumping routines for database 'lasueca'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-04-21  5:59:20

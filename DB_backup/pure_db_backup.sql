-- MySQL dump 10.13  Distrib 8.0.33, for macos13 (arm64)
--
-- Host: localhost    Database: sre_remote
-- ------------------------------------------------------
-- Server version	8.0.33

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `member`
--

DROP TABLE IF EXISTS `member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `phone` char(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member`
--

LOCK TABLES `member` WRITE;
/*!40000 ALTER TABLE `member` DISABLE KEYS */;
INSERT INTO `member` VALUES (1,'賴小賴','台北市中正區仁愛路二段99號','091234567'),(2,'陳大明','新北市板橋區文化路一段100號','092345678'),(3,'林小芳','台中市西區民生路200號','093456789'),(4,'張美玲','高雄市前金區成功一路82號','094567890'),(5,'王小明','台南市安平區建平路18號','095678901'),(6,'劉大華','新竹市東區光復路一段101號','096789012'),(7,'黃小琳','彰化市中山路二段250號','097890123'),(8,'吳美美','花蓮市國聯一路100號','098901234'),(9,'蔡小虎','屏東市民生路300號','099012345'),(10,'鄭大勇','基隆市信一路50號','091123456'),(11,'謝小珍','嘉義市東區民族路380號','092234567'),(12,'潘大為','宜蘭市中山路二段58號','093345678'),(13,'趙小梅','南投市自由路67號','094456789'),(14,'周小龍','雲林市中正路五段120號','095567890'),(15,'李大同','澎湖縣馬公市中正路200號','096678901');
/*!40000 ALTER TABLE `member` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `package_status`
--

DROP TABLE IF EXISTS `package_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `package_status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `estimated_delivery` timestamp NOT NULL,
  `recipient` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `recipient` (`recipient`),
  CONSTRAINT `package_status_ibfk_1` FOREIGN KEY (`recipient`) REFERENCES `member` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `package_status`
--

LOCK TABLES `package_status` WRITE;
/*!40000 ALTER TABLE `package_status` DISABLE KEYS */;
/*!40000 ALTER TABLE `package_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tracking_location`
--

DROP TABLE IF EXISTS `tracking_location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tracking_location` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tracking_location`
--

LOCK TABLES `tracking_location` WRITE;
/*!40000 ALTER TABLE `tracking_location` DISABLE KEYS */;
INSERT INTO `tracking_location` VALUES (1,'台北物流中心','台北市','台北市中正區忠孝東路100號'),(2,'新竹物流中心','新竹市','新竹市東區光復路一段101號'),(3,'台中物流中心','台中市','台中市西區民生路200號'),(4,'桃園物流中心','桃園市','桃園市中壢區中央西路三段150號'),(5,'高雄物流中心','高雄市','高雄市前金區成功一路82號'),(6,'彰化物流中心','彰化市','彰化市中山路二段250號'),(7,'嘉義物流中心','嘉義市','嘉義市東區民族路380號'),(8,'宜蘭物流中心','宜蘭市','宜蘭市中山路二段58號'),(9,'屏東物流中心','屏東市','屏東市民生路300號'),(10,'花蓮物流中心','花蓮市','花蓮市國聯一路100號'),(11,'台南物流中心','台南市','台南市安平區建平路18號');
/*!40000 ALTER TABLE `tracking_location` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tracking_record`
--

DROP TABLE IF EXISTS `tracking_record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tracking_record` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sno` int NOT NULL,
  `update_time` timestamp NOT NULL,
  `status` int NOT NULL,
  `location` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sno` (`sno`),
  KEY `status` (`status`),
  KEY `location` (`location`),
  CONSTRAINT `tracking_record_ibfk_2` FOREIGN KEY (`status`) REFERENCES `tracking_status` (`id`),
  CONSTRAINT `tracking_record_ibfk_3` FOREIGN KEY (`location`) REFERENCES `tracking_location` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tracking_record`
--

LOCK TABLES `tracking_record` WRITE;
/*!40000 ALTER TABLE `tracking_record` DISABLE KEYS */;
/*!40000 ALTER TABLE `tracking_record` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tracking_status`
--

DROP TABLE IF EXISTS `tracking_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tracking_status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `status` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tracking_status`
--

LOCK TABLES `tracking_status` WRITE;
/*!40000 ALTER TABLE `tracking_status` DISABLE KEYS */;
INSERT INTO `tracking_status` VALUES (1,'Created'),(2,'Package Received'),(3,'In Transit'),(4,'Out for Delivery'),(5,'Delivery Attempted'),(6,'Delivered'),(7,'Returned to Sender'),(8,'Exception');
/*!40000 ALTER TABLE `tracking_status` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-12-03 11:14:50

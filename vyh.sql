-- MySQL dump 10.13  Distrib 8.0.30, for macos12 (arm64)
--
-- Host: localhost    Database: vyh
-- ------------------------------------------------------
-- Server version	8.0.30

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
-- Table structure for table `breed`
--

DROP TABLE IF EXISTS `breed`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `breed` (
  `id` int NOT NULL AUTO_INCREMENT,
  `species` char(1) NOT NULL,
  `breed` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `breed`
--

LOCK TABLES `breed` WRITE;
/*!40000 ALTER TABLE `breed` DISABLE KEYS */;
INSERT INTO `breed` VALUES (1,'c','米克斯貓'),(2,'c','波斯貓'),(3,'c','蘇格蘭折耳貓'),(4,'c','布偶貓'),(5,'c','英國短毛貓'),(6,'c','挪威森林貓'),(7,'c','暹羅貓'),(8,'d','黃金獵犬'),(9,'d','米克斯犬'),(10,'d','拉布拉多'),(11,'d','柴犬'),(12,'d','吉娃娃'),(13,'d','馬爾濟斯'),(14,'d','秋田犬'),(15,'d','博美'),(16,'d','邊境牧羊犬'),(17,'d','巴哥');
/*!40000 ALTER TABLE `breed` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cage`
--

DROP TABLE IF EXISTS `cage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cage` (
  `name` char(3) NOT NULL,
  `inpatient_id` int DEFAULT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `inpatient_id` (`inpatient_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cage`
--

LOCK TABLES `cage` WRITE;
/*!40000 ALTER TABLE `cage` DISABLE KEYS */;
INSERT INTO `cage` VALUES ('A1',NULL),('A2',NULL),('A3',NULL),('A4',NULL),('A5',NULL),('A6',NULL),('A7',NULL),('B1',NULL),('B2',NULL),('B3',NULL),('B4',NULL),('B5',NULL),('B6',NULL),('B7',NULL),('B8',NULL),('C1',NULL),('C2',NULL),('C3',NULL),('C4',NULL),('C5',NULL),('C6',NULL),('C7',NULL),('C8',NULL),('D1',NULL),('D2',NULL),('D3',NULL),('D4',NULL),('D5',NULL),('D6',NULL),('D7',NULL),('D8',NULL),('A8',1);
/*!40000 ALTER TABLE `cage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exam`
--

DROP TABLE IF EXISTS `exam`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exam` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `statement` varchar(255) DEFAULT NULL,
  `price` mediumint unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `exam_index_2` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exam`
--

LOCK TABLES `exam` WRITE;
/*!40000 ALTER TABLE `exam` DISABLE KEYS */;
INSERT INTO `exam` VALUES (1,'病理組織切片',NULL,500),(2,'血液常規計數檢驗',NULL,500),(3,'尿液常規檢查',NULL,600),(4,'糞便檢驗',NULL,300),(5,'白血球形態學檢查',NULL,200),(6,'血液寄生蟲鏡檢',NULL,700),(7,'血液氣體分析',NULL,1200),(8,'血型檢測',NULL,100),(9,'核酸檢驗',NULL,3000),(10,'皮毛檢驗',NULL,200),(11,'細胞學抹片',NULL,300),(12,'皮黴菌培養',NULL,100),(13,'流式細胞儀分析',NULL,2500),(14,'後送傳染病檢驗',NULL,2000),(15,'體液分析',NULL,800),(16,'犬四合一檢驗',NULL,200),(17,'貓二合一檢驗',NULL,200),(18,'貓胰臟炎檢驗',NULL,700),(19,'貓心絲蟲抗原檢驗',NULL,200),(20,'糞便犬小病毒抗原檢測',NULL,700),(21,'犬胰臟炎檢驗',NULL,600),(22,'貓心絲蟲抗體檢驗',NULL,300),(23,'特殊X光檢查',NULL,1200),(24,'常規X光影像拍攝',NULL,600),(25,'CT電腦斷層掃描',NULL,150),(26,'超音波掃描',NULL,700),(27,'X光影像判讀',NULL,250),(28,'CT電腦斷層影像判讀',NULL,250),(29,'口腔鏡檢',NULL,150),(30,'巴氏量表',NULL,300),(31,'血液腎絲球過濾率快篩',NULL,200);
/*!40000 ALTER TABLE `exam` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inpatient`
--

DROP TABLE IF EXISTS `inpatient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inpatient` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` char(10) NOT NULL,
  `vet_id` int NOT NULL,
  `pet_id` int NOT NULL,
  `charge_start` date NOT NULL DEFAULT (curdate()),
  `charge_end` date DEFAULT NULL,
  `cage` char(3) NOT NULL,
  `summary` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `inpatient_index_6` (`code`),
  KEY `pet_id` (`pet_id`),
  KEY `vet_id` (`vet_id`),
  CONSTRAINT `inpatient_ibfk_1` FOREIGN KEY (`pet_id`) REFERENCES `pet` (`id`),
  CONSTRAINT `inpatient_ibfk_2` FOREIGN KEY (`vet_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inpatient`
--

LOCK TABLES `inpatient` WRITE;
/*!40000 ALTER TABLE `inpatient` DISABLE KEYS */;
INSERT INTO `inpatient` VALUES (1,'INP2231988',3,3,'2022-12-01',NULL,'A8','廣東住血線蟲感染、急性腦炎'),(3,'INP2200612',10,2,'2022-12-05','2022-12-04','B1','留院觀察腦後傷口');
/*!40000 ALTER TABLE `inpatient` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inpatient_order`
--

DROP TABLE IF EXISTS `inpatient_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inpatient_order` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` char(10) NOT NULL,
  `inpatient_id` int NOT NULL,
  `date` date NOT NULL DEFAULT (curdate()),
  `created_at` datetime DEFAULT (now()),
  `updated_at` datetime DEFAULT (now()),
  `is_paid` tinyint NOT NULL DEFAULT '0',
  `total` mediumint unsigned NOT NULL DEFAULT '0',
  `comment` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `inpatient_order_index_7` (`code`),
  KEY `inpatient_id` (`inpatient_id`),
  CONSTRAINT `inpatient_order_ibfk_1` FOREIGN KEY (`inpatient_id`) REFERENCES `inpatient` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inpatient_order`
--

LOCK TABLES `inpatient_order` WRITE;
/*!40000 ALTER TABLE `inpatient_order` DISABLE KEYS */;
INSERT INTO `inpatient_order` VALUES (1,'ORD2209246',1,'2022-12-01','2022-12-01 20:56:30','2022-12-01 20:56:30',0,0,'著重觀察生命體徵、有異常迅速回報主治或值班醫師\n'),(2,'ORD2226042',1,'2022-12-02','2022-12-02 17:13:47','2022-12-02 17:13:47',0,0,'著重觀察生命體徵、有異常迅速回報主治或值班醫師\n'),(3,'ORD2270284',1,'2022-12-03','2022-12-05 06:27:18','2022-12-05 06:27:18',0,0,'著重觀察生命體徵、有異常迅速回報主治或值班醫師\n'),(4,'ORD2211942',1,'2022-12-04','2022-12-05 06:27:38','2022-12-05 06:27:38',0,0,'著重觀察生命體徵、有異常迅速回報主治或值班醫師\n');
/*!40000 ALTER TABLE `inpatient_order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inpatient_order_detail`
--

DROP TABLE IF EXISTS `inpatient_order_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inpatient_order_detail` (
  `id` int NOT NULL AUTO_INCREMENT,
  `inpatient_order_id` int NOT NULL,
  `priority` tinyint NOT NULL DEFAULT '0',
  `content` varchar(100) NOT NULL,
  `frequency` varchar(20) DEFAULT NULL,
  `schedule` varchar(100) DEFAULT NULL,
  `price` mediumint unsigned NOT NULL DEFAULT '0',
  `times` tinyint NOT NULL DEFAULT '0',
  `subtotal` mediumint unsigned NOT NULL DEFAULT '0',
  `comment` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `inpatient_order_id` (`inpatient_order_id`),
  CONSTRAINT `inpatient_order_detail_ibfk_1` FOREIGN KEY (`inpatient_order_id`) REFERENCES `inpatient_order` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inpatient_order_detail`
--

LOCK TABLES `inpatient_order_detail` WRITE;
/*!40000 ALTER TABLE `inpatient_order_detail` DISABLE KEYS */;
INSERT INTO `inpatient_order_detail` VALUES (1,1,99,'BT','Q1H','',0,1,0,'2點半後體溫回到38.5'),(2,1,50,'moni WBC, RBC','Q6H','6,12,18,24',0,4,0,''),(3,1,80,'i.v. Thyroxine(liq)','PRN','',0,0,0,'痛覺測試沒反應時時再給'),(4,1,99,'BP','Q1H','',0,0,0,'血壓都在80~90之間'),(5,1,99,'BG','Q1H','',0,0,0,'2點時掉到72, 3點後回到95之後都正常'),(6,2,99,'BT','Q1H','',0,1,0,'2點半後體溫回到38.5'),(7,2,50,'moni WBC, RBC','Q6H','6,12,18,24',0,4,0,''),(8,2,80,'i.v. Thyroxine(liq)','PRN','',0,1,0,'痛覺測試沒反應時時再給'),(9,2,99,'BP','Q1H','',0,1,0,'血壓都在80~90之間'),(10,2,99,'BG','Q1H','',0,1,0,'2點時掉到72, 3點後回到95之後都正常'),(11,3,99,'BT','Q1H','',0,1,0,'2點半後體溫回到38.5'),(12,3,50,'moni WBC, RBC','Q6H','6,12,18,24',0,4,0,''),(13,3,80,'i.v. Thyroxine(liq)','PRN','',0,1,0,'痛覺測試沒反應時時再給'),(14,3,99,'BP','Q1H','',0,1,0,'血壓都在80~90之間'),(15,3,99,'BG','Q1H','',0,1,0,'2點時掉到72, 3點後回到95之後都正常'),(16,4,99,'BT','Q1H','',0,1,0,'2點半後體溫回到38.5'),(17,4,50,'moni WBC, RBC','Q6H','6,12,18,24',0,4,0,''),(18,4,80,'i.v. Thyroxine(liq)','PRN','',0,1,0,'痛覺測試沒反應時時再給'),(19,4,99,'BP','Q1H','',0,1,0,'血壓都在80~90之間'),(20,4,99,'BG','Q1H','',0,1,0,'2點時掉到72, 3點後回到95之後都正常');
/*!40000 ALTER TABLE `inpatient_order_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medication_detail`
--

DROP TABLE IF EXISTS `medication_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medication_detail` (
  `id` int NOT NULL AUTO_INCREMENT,
  `record_medication_id` int NOT NULL,
  `medicine_id` int NOT NULL,
  `dose` int NOT NULL DEFAULT '0',
  `frequency` varchar(20) NOT NULL,
  `day` tinyint NOT NULL DEFAULT '1',
  `quantity` smallint unsigned NOT NULL DEFAULT '1',
  `discount` float NOT NULL DEFAULT '1',
  `subtotal` mediumint unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `record_medication_id` (`record_medication_id`),
  KEY `medicine_id` (`medicine_id`),
  CONSTRAINT `medication_detail_ibfk_1` FOREIGN KEY (`record_medication_id`) REFERENCES `record_medication` (`id`) ON DELETE CASCADE,
  CONSTRAINT `medication_detail_ibfk_2` FOREIGN KEY (`medicine_id`) REFERENCES `medicine` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medication_detail`
--

LOCK TABLES `medication_detail` WRITE;
/*!40000 ALTER TABLE `medication_detail` DISABLE KEYS */;
INSERT INTO `medication_detail` VALUES (1,1,23,20,'3',7,1,1,0),(2,1,25,1,'3',7,1,1,0),(3,2,11,10,'1',1,1,1,0),(4,3,19,1,'1',1,1,1,0),(5,4,27,10,'1',1,1,1,0),(6,5,24,20,'2',7,1,1,0),(7,6,24,20,'10',7,1,1,0),(8,7,15,1,'0',0,1,1,0),(9,8,25,1,'3',14,1,1,0);
/*!40000 ALTER TABLE `medication_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medicine`
--

DROP TABLE IF EXISTS `medicine`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medicine` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `type` varchar(20) NOT NULL,
  `dose` smallint unsigned DEFAULT NULL,
  `dose_unit` varchar(30) DEFAULT NULL,
  `statement` varchar(50) DEFAULT NULL,
  `price` mediumint unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `medicine_index_4` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medicine`
--

LOCK TABLES `medicine` WRITE;
/*!40000 ALTER TABLE `medicine` DISABLE KEYS */;
INSERT INTO `medicine` VALUES (1,'Alenfronate [70mg]','tab',70,'mg',NULL,15),(2,'Bezafibrate [200mg]','tab',200,'mg',NULL,20),(3,'Pentoxifylline [100mg]','tab',100,'mg',NULL,35),(4,'Pentoxifylline [400mg]','tab',400,'mg',NULL,50),(5,'Radi-K 2.54mEq [100mg]','tab',100,'mg',NULL,5),(6,'Tranexamic acid [250mg]','tab',250,'mg',NULL,5),(7,'雲南白藥(膠囊) [0.25g]','cap',250,'mg',NULL,20),(8,'雲南白藥(粉劑) [0.25g]','powder',250,'mg',NULL,20),(9,'保險子 [100mg]','tab',100,'mg',NULL,70),(10,'sodium bicarbonate [600mg]','tab',600,'mg',NULL,5),(11,'Capromorelin [30mg/ml]','liq',30,'mg/ml',NULL,50),(12,'Colchicine秋水仙素 [5mg/ml]','liq',5,'mg/ml',NULL,200),(13,'Famciclovir抗濾兒 [250mg]','tab',250,'mg',NULL,15),(14,'Carbimazole [10mg]','tab',10,'mg',NULL,25),(15,'Fludrocortisone [1mg/錠]','tab',1,'mg',NULL,10),(16,'Fludrocortisonel [1mg/罐]','jar',1,'mg',NULL,10),(17,'Methimazole [5mg]','tab',5,'mg',NULL,5),(18,'Thyroxine昂特欣錠 [1mg/顆]','bar',1,'mg',NULL,30),(19,'Thyroxine昂特欣錠 [1mg/罐]','jar',1,'mg',NULL,30),(20,'Trilostane [120mg]','tab',120,'mg',NULL,5),(21,'Stilboestrol [1mg]','cap',1,'mg',NULL,75),(22,'Proscar [5mg]','cap',5,'mg',NULL,50),(23,'Propalin PPA [75mg/錠]','tab',75,'mg',NULL,30),(24,'Propaliin PPA [40mg/ml]','liq',40,'mg/ml',NULL,20),(25,'Incurin(estriol) [1mg]','tab',1,'mg',NULL,15),(26,'Bethanechol [25mg]','tab',25,'mg',NULL,15),(27,'Sodium sulfate [10mg/ml]','liq',10,'mg/ml',NULL,50);
/*!40000 ALTER TABLE `medicine` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `owner`
--

DROP TABLE IF EXISTS `owner`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `owner` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fullname` varchar(30) NOT NULL,
  `cellphone` char(10) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `owner`
--

LOCK TABLES `owner` WRITE;
/*!40000 ALTER TABLE `owner` DISABLE KEYS */;
INSERT INTO `owner` VALUES (1,'王毅明','0910101010',NULL,NULL),(2,'沈爾裕','0920202020',NULL,NULL),(3,'賴珊潔','0930303030',NULL,NULL),(4,'徐韻雅','0940404040',NULL,NULL),(5,'陳梧皓','0950505050',NULL,NULL),(6,'林柳瑜','0960606060',NULL,NULL),(7,'秦契良','0970707070',NULL,NULL),(8,'張發莒','0980808080',NULL,NULL),(9,'陸久韻','0990909090',NULL,NULL),(10,'林時偍','0901010101',NULL,NULL);
/*!40000 ALTER TABLE `owner` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pet`
--

DROP TABLE IF EXISTS `pet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pet` (
  `id` int NOT NULL AUTO_INCREMENT,
  `owner_id` int NOT NULL,
  `breed_id` int NOT NULL,
  `code` char(10) NOT NULL,
  `name` varchar(50) NOT NULL,
  `sex` tinyint DEFAULT NULL,
  `is_neutered` tinyint DEFAULT '0',
  `birthday` date DEFAULT NULL,
  `chip` bigint unsigned DEFAULT NULL,
  `comment` varchar(256) DEFAULT NULL,
  `status` tinyint NOT NULL DEFAULT '1',
  `status_comment` varchar(60) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `pet_index_1` (`code`),
  KEY `breed_id` (`breed_id`),
  KEY `owner_id` (`owner_id`),
  CONSTRAINT `pet_ibfk_1` FOREIGN KEY (`breed_id`) REFERENCES `breed` (`id`),
  CONSTRAINT `pet_ibfk_2` FOREIGN KEY (`owner_id`) REFERENCES `owner` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pet`
--

LOCK TABLES `pet` WRITE;
/*!40000 ALTER TABLE `pet` DISABLE KEYS */;
INSERT INTO `pet` VALUES (1,1,1,'PET2213579','郡主',0,1,'2020-05-11',984417404433996,'個性很放鬆、餵藥都很順利；五合一疫苗在台大醫院打過了',0,NULL),(2,2,2,'PET2274759','恐龍',1,1,'2012-10-15',284426653306467,'個性兇猛保定建議需要兩人、對aspirin過敏、喜歡吃生食；主人表示可以的話盡量給他自己餵藥',0,NULL),(3,3,3,'PET2200497','花木蘭',0,0,'2015-05-03',501634336743175,'只吃生食，偶而吃罐頭；很親人',1,NULL),(4,4,4,'PET2227618','志豪',1,0,'2022-08-08',855973491260134,'聲帶發育不完全',1,NULL),(5,5,5,'PET2217179','肉燥飯',1,1,'2018-01-13',705843441173825,'聽力不佳、反應較慢；主人很積極看過多家醫院',2,NULL),(6,6,6,'PET2209098','阿橘',0,1,'2015-07-08',229790131213140,'在台大開過腸胃手術取出誤吞的公仔、藥品要注意腸胃耐受度',1,NULL),(7,7,7,'PET2238383','美代子',0,0,'2014-12-14',747494878055539,'對海鮮、魚類過敏',1,NULL),(8,8,8,'PET2229170','豆腐',1,1,'2020-12-01',315467704799070,'被前主人虐待過、不太親人',1,NULL),(9,9,9,'PET2266829','旺醬',1,1,'2009-12-15',886004215704737,'後腳蜂窩性組織炎截肢，有裝輪子活動還算方便',1,NULL),(10,10,10,'PET2209084','小丸子',0,0,'2017-04-15',210870210038819,'有癲癇、左耳後頭骨開過刀脆弱',0,NULL);
/*!40000 ALTER TABLE `pet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `record`
--

DROP TABLE IF EXISTS `record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `record` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` char(10) NOT NULL,
  `vet_id` int NOT NULL,
  `pet_id` int NOT NULL,
  `created_at` datetime NOT NULL DEFAULT (now()),
  `updated_at` datetime NOT NULL DEFAULT (now()),
  `subjective` varchar(512) NOT NULL,
  `objective` varchar(512) NOT NULL,
  `assessment` varchar(512) NOT NULL,
  `plan` varchar(512) NOT NULL,
  `is_archive` tinyint NOT NULL DEFAULT '0',
  `total` mediumint unsigned NOT NULL DEFAULT '0',
  `is_paid` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `record_index_5` (`code`),
  KEY `vet_id` (`vet_id`),
  KEY `pet_id` (`pet_id`),
  CONSTRAINT `record_ibfk_1` FOREIGN KEY (`vet_id`) REFERENCES `user` (`id`),
  CONSTRAINT `record_ibfk_2` FOREIGN KEY (`pet_id`) REFERENCES `pet` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `record`
--

LOCK TABLES `record` WRITE;
/*!40000 ALTER TABLE `record` DISABLE KEYS */;
INSERT INTO `record` VALUES (1,'REC2284614',4,4,'2022-12-01 01:00:49','2022-12-01 20:00:49','叫聲沙啞、像是卡住東西','初步內視鏡檢查結果：聲帶中膜缺乏共振膜','可能是天生聲帶缺陷或早期感染所致，為不可逆的聲帶缺陷','1. 除了聲音外沙啞外，無特別生活上的阻礙，請主人耐心習慣聲音\n2. 若成長過程中叫聲有變特別奇怪在請主人再回來複檢\n3. 安排一個月後預防針',0,0,0),(2,'REC2239953',1,1,'2022-12-01 01:18:19','2022-12-01 20:18:19','食慾不佳、常嘔吐\n大小便量減少\n活動力稍微減低','1. 上腹部按壓有明顯痛覺反應；下腹部則無\n2. 口腔蛀牙、口臭嚴重、牙齦呈現發炎狀態\n','1. 口腔疼痛造成飲食障礙，因而食慾不佳、大小便量減少、精神活動力降低\n2. 上腹部痛覺反應有可能有發炎狀態或飲食過少、胃酸過多導致侵蝕','1. 請主人使用寵物牙刷每天盡可能至少清潔牙齒一次\n2. 先停止一般乾糧的供應，用全能貓口腔照護配方，如果不吃的話可以混在原本的濕糧中盡量多給\n3. 上腹部疼痛先給制酸劑，如有過激的疼痛反應則給止痛藥\n4. 下週回診查看是否依舊腹部疼痛，若依舊疼痛則要安排照胃鏡',0,0,0),(3,'REC2266713',3,3,'2022-12-01 01:48:02','2022-12-01 20:48:02','這兩天活動力大減、逗貓棒也完全沒興趣\n睡的時間變多、幾乎沒吃東西','1. BP = 80 mm/Hg\n2. BT = 37.5\n3. BG = 65 mg/dl\n4. 巴氏量表分數 = 3\n5. WBC = 11 K/dl、RBC = 1.5 M/dl\n####### 6. 廣東住血線蟲 test positive\n7. 白蛋白：高於正常值\n8. 血清谷丙轉氨酶：高於正常值\n9. 血清谷草轉氨酶：高於正常值\n10. 血清乳酸脫氫酶：高於正常值\n11 血清磷酸脫氫酶：正常\n12. 血清γ-谷氨酰轉肽酶：正常\n13 血清尿素：低於正常值\n14. 血清肌酸酐：正常','1. 廣東住血線蟲感染，導致體溫血壓異常低落、低血糖、活動力過低、中樞神經反應低落\n2. 急性腦炎','1. 重症收住院，觀察兩天並持續監測BG, BP, BT, WBC, RBC, palette',0,0,0),(4,'REC2295718',10,10,'2022-12-01 01:06:29','2022-12-01 21:06:29','腎病回診\n尿液有結晶','Blood volatile nitrogen : 551 mg/dl\neGFR < 30\n尿液結晶 > 0.1mm','1. 進入 CKD phase 5 \n2. 要進一步跟飼主討論未來的治療方向','1. 飼主表示以狗狗的生活品質為主，不做太多蛋白質攝取限制，給他吃喜歡吃的就好；若寵愛的腎病配方還可以的話就還是盡量給\n2. 後續固定約診每週一 17:00做hemodialysis，監測eGFR\n3. N waste若持續上升加上生活品質下降到無法自主時要考慮做安樂，已跟飼主溝通後表示會有心理準備',0,0,0),(5,'REC2207007',10,2,'2022-12-05 01:57:29','2022-12-05 11:57:29','撞到頭傷口有點大，容易反覆流血\n情緒變得焦慮','傷口長度 > 1.5cm 深約0.5cm\n體溫為39.2°C\n心率為180次/分\n呼吸率為50次/分\n心聲正常\n體重為4.2公斤。','生命體徵還正常、血小板凝血功能無障礙','###怕感染先收住院觀察傷口癒合情形\n1. 給予該貓咪適當的抗生素治療。\n2. 給予高熱情況下的輔助治療，如止發抽搐的藥物、恢復水分和電解質的補充等。\n3. 加強該貓咪的抗病能力，如給予維生素和礦物質補充劑。\n4. 定期檢查該貓咪的身體狀況，並根據情況調整治療方案。',0,0,0),(6,'REC2275071',10,8,'2022-12-02 01:11:16','2022-12-02 13:11:16','反應有點緩慢，且拉著尾巴走路，沒有像以往一樣積極跑來跑去。','脊柱疼痛反應明顯，而且走路時會出現對應的微動作\n反應不敏感，沒有出現明顯的反應\n呼吸及心跳比較快，其體溫為39℃。','應該是發生了脊椎病變，可能是脊椎間盤突出所導致。\n','1. 進行藥物治療，藥物可以減輕患犬的疼痛以及改善其神經功能；\n2. 進行物理治療，包括靜電刺激、熱敷、按摩等，以改善患犬的血液循環，並減輕患犬的疼痛；\n3. 增加步行，爬樓梯，攀爬等，以維持患犬的肌肉結構和穩定的脊椎功能；',0,0,0),(7,'REC2280789',10,9,'2022-12-02 01:28:24','2022-12-02 13:28:24','飲水量增加、食慾不振且腹部有腫脹\n最近有明顯的肌肉消瘦，而且自從接受截肢手術後，旺醬體重明顯降低。','- 全血檢驗：\n白血球計數13.7x10^3/uL\n血紅素8.2 g/dL\n血小板數495x10^3/uL\n血清肌酐1.4 mg/dL\n血清葡萄糖296 mg/dL\n- 尿液檢驗：\n無白蛋白、無紅血球、尿胆原19 mg/dL','糖尿病（Diabetes Mellitus）','- 由醫師指導每日餵食膳食及血糖管理，並控制旺醬的活動量\n- 醫師會定期檢查旺醬的血糖及尿糖值，並及時調整藥物治療\n- 飼主應注意旺醬的飲水量、食慾及體重，並定期帶旺醬到醫院回診',0,0,0),(8,'REC2238778',10,9,'2022-12-02 01:31:28','2022-12-02 13:31:28','其近期飲水量降低，未見其他異常現象\n主人擔心旺醬有嚴重的疾病，希望能夠做詳細的檢查','1. 全血檢驗\n白血球計數為(WBC) 8.9 x 10^3/uL\n紅血球總數(RBC) 7.3 x 10^6/uL\n血小板數(PLT) 231 x 10^3/uL\n血清尿素氮(BUN) 16 mg/dL\n血清肌酐 (CREA) 1.2 mg/dL；\n2. 尿液檢驗\n尿胆原(UBG) < 10 mg/dL\n尿蛋白(UP) < 10 mg/dL\n尿胆素(BIL) < 0.3 mg/dL\n尿紅素類(URO) < 0.1 mg/dL\n尿潛血(BLD) < 3 mg/dL\n尿酸素(KET) < 10 mg/dL\n尿磷酸鹽(PHOS) < 2 mg/dL\n尿酮體(KET) < 10 mg/dL；\n','診斷為糖尿病後期症狀，失水性腎病變。','1. 給予抗糖尿病藥物：每日1次，每次0.25mg/kg；\n2. 給予補水劑：氯化鉀懸浮液、葡萄糖懸浮液等；\n3. 給予維生素B群：每日1次；\n4. 給予抗炎藥物：每日1次，每次0.2mg/kg；\n5. 定期進行血液和尿液分析，以便更新藥物劑量；\n6. 進行體溫測量，以確保其健康狀態。',0,0,0),(9,'REC2247825',10,5,'2022-12-02 01:50:09','2022-12-02 17:50:09','Vomit since yesterday.\nAnorexia','Dehydration 5-8%\ncPL (+)','Pancreatitis','Hospitalization',0,0,0);
/*!40000 ALTER TABLE `record` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `record_exam`
--

DROP TABLE IF EXISTS `record_exam`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `record_exam` (
  `id` int NOT NULL AUTO_INCREMENT,
  `record_id` int NOT NULL,
  `exam_id` int NOT NULL,
  `file_path` varchar(100) NOT NULL,
  `quantity` tinyint NOT NULL DEFAULT '1',
  `discount` float NOT NULL DEFAULT '1',
  `subtotal` mediumint unsigned NOT NULL DEFAULT '0',
  `comment` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `record_id` (`record_id`),
  KEY `exam_id` (`exam_id`),
  CONSTRAINT `record_exam_ibfk_1` FOREIGN KEY (`record_id`) REFERENCES `record` (`id`) ON DELETE CASCADE,
  CONSTRAINT `record_exam_ibfk_2` FOREIGN KEY (`exam_id`) REFERENCES `exam` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `record_exam`
--

LOCK TABLES `record_exam` WRITE;
/*!40000 ALTER TABLE `record_exam` DISABLE KEYS */;
INSERT INTO `record_exam` VALUES (1,1,29,'',1,1,0,'內視鏡至喉部中膜，無異狀'),(2,2,29,'',1,1,0,'牙周部位'),(3,3,6,'',1,1,0,'廣東住血線蟲 positive'),(4,3,2,'',1,1,0,'WBC, RBC'),(5,3,30,'',1,1,0,'3'),(6,4,7,'',1,1,0,'volatile nitrogen'),(7,4,31,'',1,1,0,'eGFR < 30'),(8,9,29,'',1,1,0,'舌頭潰瘍'),(9,9,3,'',1,1,0,'尿蛋白高'),(10,8,3,'',1,1,0,''),(11,7,2,'',1,1,0,'');
/*!40000 ALTER TABLE `record_exam` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `record_medication`
--

DROP TABLE IF EXISTS `record_medication`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `record_medication` (
  `id` int NOT NULL AUTO_INCREMENT,
  `record_id` int NOT NULL,
  `name` varchar(30) NOT NULL,
  `type` varchar(30) NOT NULL,
  `comment` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `record_id` (`record_id`),
  CONSTRAINT `record_medication_ibfk_1` FOREIGN KEY (`record_id`) REFERENCES `record` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `record_medication`
--

LOCK TABLES `record_medication` WRITE;
/*!40000 ALTER TABLE `record_medication` DISABLE KEYS */;
INSERT INTO `record_medication` VALUES (1,2,'制酸劑','口服','盡可能用全能貓配方騙他吃'),(2,3,'驅蟲藥','注射',''),(3,3,'甲狀腺素','口服',''),(4,3,'急性消炎','注射',''),(5,9,'抗生素','',''),(6,8,'抗利尿劑','口服',''),(7,8,'止痛劑','有疼痛反應再給',''),(8,7,'糖尿病藥','','');
/*!40000 ALTER TABLE `record_medication` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `record_treatment`
--

DROP TABLE IF EXISTS `record_treatment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `record_treatment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `record_id` int NOT NULL,
  `treatment_id` int NOT NULL,
  `quantity` tinyint NOT NULL DEFAULT '1',
  `discount` float NOT NULL DEFAULT '1',
  `subtotal` mediumint unsigned NOT NULL DEFAULT '0',
  `comment` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `record_id` (`record_id`),
  KEY `treatment_id` (`treatment_id`),
  CONSTRAINT `record_treatment_ibfk_1` FOREIGN KEY (`record_id`) REFERENCES `record` (`id`) ON DELETE CASCADE,
  CONSTRAINT `record_treatment_ibfk_2` FOREIGN KEY (`treatment_id`) REFERENCES `treatment` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `record_treatment`
--

LOCK TABLES `record_treatment` WRITE;
/*!40000 ALTER TABLE `record_treatment` DISABLE KEYS */;
INSERT INTO `record_treatment` VALUES (1,2,1,1,1,0,'清除牙結石'),(2,2,42,1,1,0,'全能貓口腔照護配方-OOK2'),(3,3,19,1,1,0,'15cc'),(4,3,18,1,1,0,'診間注射'),(5,4,25,1,1,0,'hemodialysis'),(6,4,42,1,1,0,'寵愛 - KidKeep 配方'),(7,8,19,1,1,0,'15cc');
/*!40000 ALTER TABLE `record_treatment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `register`
--

DROP TABLE IF EXISTS `register`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `register` (
  `id` int NOT NULL AUTO_INCREMENT,
  `vet_id` int NOT NULL,
  `pet_id` int NOT NULL,
  `reserve_time` datetime NOT NULL DEFAULT (now()),
  `subjective` varchar(512) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `pet_id` (`pet_id`),
  KEY `vet_id` (`vet_id`),
  CONSTRAINT `register_ibfk_1` FOREIGN KEY (`pet_id`) REFERENCES `pet` (`id`),
  CONSTRAINT `register_ibfk_2` FOREIGN KEY (`vet_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `register`
--

LOCK TABLES `register` WRITE;
/*!40000 ALTER TABLE `register` DISABLE KEYS */;
INSERT INTO `register` VALUES (2,1,1,'2022-12-07 01:00:11','最近一週吃不多、常嘔吐'),(3,2,2,'2022-12-07 01:00:11','抓老鼠很大力撞到門額頭流血'),(4,3,3,'2022-12-01 02:00:11','沒精神、突然不太愛活動'),(5,4,4,'2022-12-07 02:30:11','叫聲沙啞程度愈趨嚴重'),(6,5,5,'2022-12-07 03:00:11','薪傳轉院過來照心臟超音波'),(7,6,6,'2022-12-07 03:30:11','懷孕產檢'),(8,7,7,'2022-12-07 04:00:11','腳掌不明原因流血'),(9,8,8,'2022-12-07 04:30:11','喘氣頻率高、近兩週掉1公斤'),(10,9,9,'2022-12-07 05:00:11','糖尿病回診'),(11,10,10,'2022-12-07 06:00:11','腎病第四期回診');
/*!40000 ALTER TABLE `register` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `treatment`
--

DROP TABLE IF EXISTS `treatment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `treatment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `statement` varchar(255) DEFAULT NULL,
  `price` mediumint unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `treatment_index_3` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `treatment`
--

LOCK TABLES `treatment` WRITE;
/*!40000 ALTER TABLE `treatment` DISABLE KEYS */;
INSERT INTO `treatment` VALUES (1,'洗牙',NULL,500),(2,'犬驅蟲藥',NULL,400),(3,'貓驅蟲藥',NULL,400),(4,'尿結石手術',NULL,3000),(5,'肛門腺移除',NULL,3000),(6,'接生',NULL,2000),(7,'腹腔鏡手術',NULL,2500),(8,'內視鏡手術',NULL,6000),(9,'犬十合一疫苗',NULL,1500),(10,'犬八合一疫苗',NULL,1200),(11,'犬舍咳疫苗',NULL,600),(12,'犬病毒性腸炎疫苗',NULL,300),(13,'犬瘟熱混合疫苗',NULL,300),(14,'貓瘟三合一疫苗',NULL,1000),(15,'貓五合一疫苗',NULL,1500),(16,'貓傳染性覆膜炎疫苗',NULL,1200),(17,'貓白血病疫苗',NULL,1200),(18,'梨形鞭毛蟲疫苗',NULL,1200),(19,'血清注射(每cc)',NULL,300),(20,'狂犬病疫苗',NULL,500),(21,'陰腔道灌洗',NULL,300),(22,'插胃管',NULL,500),(23,'插氣導管',NULL,500),(24,'子宮灌洗',NULL,300),(25,'腹膜透析',NULL,8000),(26,'全身麻醉',NULL,15000),(27,'鎮靜',NULL,3000),(28,'局部麻醉',NULL,6000),(29,'帝王切開術',NULL,25000),(30,'一般骨科：外部固定',NULL,12000),(31,'一般骨科：內部固定',NULL,20000),(32,'一般骨科：外部手術固定',NULL,15000),(33,'截肢術',NULL,20000),(34,'泌尿道系統手術',NULL,20000),(35,'泌尿系統顯微手術',NULL,50000),(36,'隱睪手術',NULL,8000),(37,'眼球摘除術',NULL,5000),(38,'皮膚整形手術',NULL,2000),(39,'晶片植入及註記',NULL,500),(40,'結紮(睪丸拆除)',NULL,1200),(41,'結紮(子宮摘除)',NULL,6000),(42,'飲食配方治療',NULL,100);
/*!40000 ALTER TABLE `treatment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `hashed_password` char(97) NOT NULL,
  `fullname` varchar(30) NOT NULL,
  `cellphone` char(10) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `date_joined` date NOT NULL DEFAULT (curdate()),
  `date_quitted` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_index_0` (`fullname`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'$argon2id$v=19$m=65536,t=3,p=4$Ey7uykFFy8oxiuy3uW2dRA$R9FZQ0D3rbuFgjk4VsoBdMDmvT4kRoEhtzt1DJVgytg','陳一郎','0911111111',NULL,'2022-12-01',NULL),(2,'$argon2id$v=19$m=65536,t=3,p=4$Ey7uykFFy8oxiuy3uW2dRA$R9FZQ0D3rbuFgjk4VsoBdMDmvT4kRoEhtzt1DJVgytg','廖二坤','0922222222',NULL,'2022-12-01',NULL),(3,'$argon2id$v=19$m=65536,t=3,p=4$Ey7uykFFy8oxiuy3uW2dRA$R9FZQ0D3rbuFgjk4VsoBdMDmvT4kRoEhtzt1DJVgytg','張三豐','0933333333',NULL,'2022-12-01',NULL),(4,'$argon2id$v=19$m=65536,t=3,p=4$Ey7uykFFy8oxiuy3uW2dRA$R9FZQ0D3rbuFgjk4VsoBdMDmvT4kRoEhtzt1DJVgytg','李四端','0944444444',NULL,'2022-12-01',NULL),(5,'$argon2id$v=19$m=65536,t=3,p=4$Ey7uykFFy8oxiuy3uW2dRA$R9FZQ0D3rbuFgjk4VsoBdMDmvT4kRoEhtzt1DJVgytg','林武欽','0955555555',NULL,'2022-12-01',NULL),(6,'$argon2id$v=19$m=65536,t=3,p=4$Ey7uykFFy8oxiuy3uW2dRA$R9FZQ0D3rbuFgjk4VsoBdMDmvT4kRoEhtzt1DJVgytg','黃陸田','0966666666',NULL,'2022-12-01',NULL),(7,'$argon2id$v=19$m=65536,t=3,p=4$Ey7uykFFy8oxiuy3uW2dRA$R9FZQ0D3rbuFgjk4VsoBdMDmvT4kRoEhtzt1DJVgytg','陳綺芳','0977777777',NULL,'2022-12-01',NULL),(8,'$argon2id$v=19$m=65536,t=3,p=4$Ey7uykFFy8oxiuy3uW2dRA$R9FZQ0D3rbuFgjk4VsoBdMDmvT4kRoEhtzt1DJVgytg','本田巴萬','0988888888',NULL,'2022-12-01',NULL),(9,'$argon2id$v=19$m=65536,t=3,p=4$Ey7uykFFy8oxiuy3uW2dRA$R9FZQ0D3rbuFgjk4VsoBdMDmvT4kRoEhtzt1DJVgytg','王玖琴','0999999999',NULL,'2022-12-01',NULL),(10,'$argon2id$v=19$m=65536,t=3,p=4$Ey7uykFFy8oxiuy3uW2dRA$R9FZQ0D3rbuFgjk4VsoBdMDmvT4kRoEhtzt1DJVgytg','梁實秋','0900000000',NULL,'2022-12-01',NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-04-19 16:35:04

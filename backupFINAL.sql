-- MySQL dump 10.13  Distrib 8.0.32, for Linux (x86_64)
--
-- Host: localhost    Database: mydatabase
-- ------------------------------------------------------
-- Server version	8.0.32-0ubuntu0.22.04.2

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
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `userid` int NOT NULL AUTO_INCREMENT,
  `firstname` varchar(50) DEFAULT NULL,
  `lastname` varchar(50) DEFAULT NULL,
  `pass` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `adminclearance` varchar(3) DEFAULT 'no',
  PRIMARY KEY (`userid`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`),
  CONSTRAINT `Users_chk_1` CHECK (((`adminclearance` = _utf8mb4'yes') or (`adminclearance` = _utf8mb4'no')))
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (1,'a','a','$argon2id$v=19$m=65536,t=3,p=4$iS+iFSsUObGUdeFLq1Vt6Q$aud8oc583ah8shQrUR/893KHHwCVIBPFBJdfsGH08IE','a','yes'),(2,'user','2','$argon2id$v=19$m=65536,t=3,p=4$kxx+JsxF7ZHVt5A6k+/clQ$yBEuti/jbQz3dQJtJc/vyBUHesEQryzALC0LYCrfIRo','test@test','no'),(5,'An','Nguyen','$argon2id$v=19$m=65536,t=3,p=4$jnaXvMIpLdcXW/CYiyoGbw$CNvU6k0WqU+gWgu0fLn7C4+chfqtFFEfuZcIUZSUfY4','nguyenthukyan@gmail.com','no'),(7,'nath','dh','$argon2id$v=19$m=65536,t=3,p=4$SMTaiU2NMgicvKXAUiJXSg$Hcn4utOS84k7RzJqHeyabfs5vDX3+jq0iCKUbzMmWZU','danghuynhnathan@gmail.com','yes'),(8,'test','account','$argon2id$v=19$m=65536,t=3,p=4$3JsmXlYkXUdTieDuUo8lQQ$0XOtNO+aywP4lYdo5zV4t+p4h5dc5XB7a1snrCjftsg','test@email.com','no'),(10,'Lebron','James','password','lebronjames@email.com','no'),(11,'Michael','Jordan','password','michaeljordan@email.com','no'),(12,'Kevin','Durant','password','kevindurant@email.com','no'),(13,'Larry','Bird','password','larrybird@email.com','no'),(14,'Magic','Johnson','password','magicjohnson@email.com','no'),(15,'Test','Account','$argon2id$v=19$m=65536,t=3,p=4$P3r/fV/ymj0evjkFPqgueQ$wRtYtOoYpIIYrg0hY/da9n4xxHo7p7kj+ZUmfmPiBAI','compsci2207.marker@gmail.com','yes');
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `club`
--

DROP TABLE IF EXISTS `club`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `club` (
  `clubid` int NOT NULL AUTO_INCREMENT,
  `clubname` varchar(255) DEFAULT NULL,
  `clubdescription` longtext,
  PRIMARY KEY (`clubid`),
  UNIQUE KEY `clubname` (`clubname`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `club`
--

LOCK TABLES `club` WRITE;
/*!40000 ALTER TABLE `club` DISABLE KEYS */;
INSERT INTO `club` VALUES (6,'Competitive Chess','The competitive chess club is a vibrant community of skilled players who gather to engage in intense chess matches and sharpen their strategic thinking. Members participate in regular tournaments, analyze games together, and push each other to reach new heights of mastery in the timeless game of chess.');
/*!40000 ALTER TABLE `club` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clubapplication`
--

DROP TABLE IF EXISTS `clubapplication`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clubapplication` (
  `clubreqid` int NOT NULL AUTO_INCREMENT,
  `userid` int DEFAULT NULL,
  `clubname` varchar(255) DEFAULT NULL,
  `clubdescription` longtext,
  `currentstatus` varchar(10) DEFAULT 'pending',
  PRIMARY KEY (`clubreqid`),
  KEY `userid` (`userid`),
  CONSTRAINT `clubapplication_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `Users` (`userid`) ON DELETE SET NULL,
  CONSTRAINT `clubapplication_chk_1` CHECK (((`currentstatus` = _utf8mb4'pending') or (`currentstatus` = _utf8mb4'approved') or (`currentstatus` = _utf8mb4'declined')))
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clubapplication`
--

LOCK TABLES `clubapplication` WRITE;
/*!40000 ALTER TABLE `clubapplication` DISABLE KEYS */;
INSERT INTO `clubapplication` VALUES (1,1,'soccer','Join us and kick some balls!!','pending');
/*!40000 ALTER TABLE `clubapplication` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `EventId` int NOT NULL AUTO_INCREMENT,
  `clubid` int DEFAULT NULL,
  `userid` int DEFAULT NULL,
  `EventName` varchar(30) DEFAULT NULL,
  `Content` longtext,
  `EventLocation` varchar(40) DEFAULT NULL,
  `EventDate` date DEFAULT NULL,
  `EventTime` time DEFAULT NULL,
  `Publicity` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`EventId`),
  KEY `userid` (`userid`),
  KEY `clubid` (`clubid`),
  CONSTRAINT `events_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `Users` (`userid`) ON DELETE SET NULL,
  CONSTRAINT `events_ibfk_2` FOREIGN KEY (`clubid`) REFERENCES `club` (`clubid`) ON DELETE CASCADE,
  CONSTRAINT `events_chk_1` CHECK (((`Publicity` = _utf8mb4'private') or (`Publicity` = _utf8mb4'public')))
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (4,6,7,'Cool Event','Wow','Adelaide','2023-06-22','23:27:00','public');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback`
--

DROP TABLE IF EXISTS `feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedback` (
  `feedbackid` int NOT NULL AUTO_INCREMENT,
  `content` longtext NOT NULL,
  `userid` int DEFAULT NULL,
  PRIMARY KEY (`feedbackid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback`
--

LOCK TABLES `feedback` WRITE;
/*!40000 ALTER TABLE `feedback` DISABLE KEYS */;
/*!40000 ALTER TABLE `feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `memberapplication`
--

DROP TABLE IF EXISTS `memberapplication`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `memberapplication` (
  `requestid` int NOT NULL AUTO_INCREMENT,
  `userid` int DEFAULT NULL,
  `clubid` int DEFAULT NULL,
  `currentstatus` varchar(10) DEFAULT 'pending',
  PRIMARY KEY (`requestid`),
  KEY `userid` (`userid`),
  KEY `clubid` (`clubid`),
  CONSTRAINT `memberapplication_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `Users` (`userid`) ON DELETE SET NULL,
  CONSTRAINT `memberapplication_ibfk_2` FOREIGN KEY (`clubid`) REFERENCES `club` (`clubid`) ON DELETE SET NULL,
  CONSTRAINT `memberapplication_chk_1` CHECK (((`currentstatus` = _utf8mb4'pending') or (`currentstatus` = _utf8mb4'approved') or (`currentstatus` = _utf8mb4'declined')))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `memberapplication`
--

LOCK TABLES `memberapplication` WRITE;
/*!40000 ALTER TABLE `memberapplication` DISABLE KEYS */;
/*!40000 ALTER TABLE `memberapplication` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `membership`
--

DROP TABLE IF EXISTS `membership`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `membership` (
  `membershipid` int NOT NULL AUTO_INCREMENT,
  `userid` int NOT NULL,
  `clubid` int NOT NULL,
  `memberrole` varchar(10) DEFAULT 'member',
  `subscribe` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`membershipid`),
  KEY `userid` (`userid`),
  KEY `clubid` (`clubid`),
  CONSTRAINT `membership_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `Users` (`userid`) ON DELETE CASCADE,
  CONSTRAINT `membership_ibfk_2` FOREIGN KEY (`clubid`) REFERENCES `club` (`clubid`) ON DELETE CASCADE,
  CONSTRAINT `membership_chk_1` CHECK (((`memberrole` = _utf8mb4'manager') or (`memberrole` = _utf8mb4'member')))
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `membership`
--

LOCK TABLES `membership` WRITE;
/*!40000 ALTER TABLE `membership` DISABLE KEYS */;
INSERT INTO `membership` VALUES (2,10,6,'member',0),(3,11,6,'member',0),(4,12,6,'manager',0),(6,14,6,'member',0),(7,7,6,'manager',0),(9,15,6,'member',0);
/*!40000 ALTER TABLE `membership` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post`
--

DROP TABLE IF EXISTS `post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post` (
  `postid` int NOT NULL AUTO_INCREMENT,
  `userid` int DEFAULT NULL,
  `clubid` int NOT NULL,
  `posttitle` varchar(30) DEFAULT NULL,
  `content` longtext NOT NULL,
  `attachment` varchar(255) DEFAULT NULL,
  `dateandtime` datetime DEFAULT NULL,
  `eventdate` datetime DEFAULT NULL,
  `publicity` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`postid`),
  KEY `userid` (`userid`),
  KEY `clubid` (`clubid`),
  CONSTRAINT `post_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `Users` (`userid`) ON DELETE SET NULL,
  CONSTRAINT `post_ibfk_2` FOREIGN KEY (`clubid`) REFERENCES `club` (`clubid`) ON DELETE CASCADE,
  CONSTRAINT `post_chk_1` CHECK (((`publicity` = _utf8mb4'private') or (`publicity` = _utf8mb4'public')))
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post`
--

LOCK TABLES `post` WRITE;
/*!40000 ALTER TABLE `post` DISABLE KEYS */;
INSERT INTO `post` VALUES (3,7,6,'Welcome to the Chess Club!','We play Chess',NULL,'2023-06-09 13:52:44',NULL,'public'),(4,7,6,'New Post!','New post',NULL,'2023-06-09 14:00:12',NULL,'public');
/*!40000 ALTER TABLE `post` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rsvp`
--

DROP TABLE IF EXISTS `rsvp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rsvp` (
  `rsvpid` int NOT NULL,
  `userid` int DEFAULT NULL,
  `postid` int DEFAULT NULL,
  PRIMARY KEY (`rsvpid`),
  KEY `userid` (`userid`),
  CONSTRAINT `rsvp_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `Users` (`userid`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rsvp`
--

LOCK TABLES `rsvp` WRITE;
/*!40000 ALTER TABLE `rsvp` DISABLE KEYS */;
INSERT INTO `rsvp` VALUES (0,7,NULL);
/*!40000 ALTER TABLE `rsvp` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-06-09 14:09:32

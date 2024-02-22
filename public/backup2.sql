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
-- Current Database: `mydatabase`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `mydatabase` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `mydatabase`;

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
  `pass` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `adminclearance` varchar(3) DEFAULT 'no',
  PRIMARY KEY (`userid`),
  CONSTRAINT `Users_chk_1` CHECK (((`adminclearance` = _utf8mb4'yes') or (`adminclearance` = _utf8mb4'no')))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `club`
--

LOCK TABLES `club` WRITE;
/*!40000 ALTER TABLE `club` DISABLE KEYS */;
INSERT INTO `club` VALUES (1,'Book Club','Welcoming all books enthusiasts! We have weekly reading sessions where we read and share our favorite books.'),(2,'Public Speaking','If you are striving to improve your public speaking skills,\n                                                        then join us in our weekly workshops where we learn from experienced speakers and\n                                                        practice public speaking with a welcoming audience.'),(3,'Dance','We welcome all those with a passion for dancing. Fire up your body with exciting choreographies!');
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clubapplication`
--

LOCK TABLES `clubapplication` WRITE;
/*!40000 ALTER TABLE `clubapplication` DISABLE KEYS */;
/*!40000 ALTER TABLE `clubapplication` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback`
--

DROP TABLE IF EXISTS `feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedback` (
  `feedbackid` int NOT NULL AUTO_INCREMENT,
  `content` longtext,
  PRIMARY KEY (`feedbackid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
  `userid` int DEFAULT NULL,
  `clubid` int DEFAULT NULL,
  `memberrole` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`membershipid`),
  KEY `userid` (`userid`),
  KEY `clubid` (`clubid`),
  CONSTRAINT `membership_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `Users` (`userid`) ON DELETE CASCADE,
  CONSTRAINT `membership_ibfk_2` FOREIGN KEY (`clubid`) REFERENCES `club` (`clubid`) ON DELETE CASCADE,
  CONSTRAINT `membership_chk_1` CHECK (((`memberrole` = _utf8mb4'manager') or (`memberrole` = _utf8mb4'member')))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `membership`
--

LOCK TABLES `membership` WRITE;
/*!40000 ALTER TABLE `membership` DISABLE KEYS */;
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
  `clubid` int DEFAULT NULL,
  `content` longtext,
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post`
--

LOCK TABLES `post` WRITE;
/*!40000 ALTER TABLE `post` DISABLE KEYS */;
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
  `post` int DEFAULT NULL,
  PRIMARY KEY (`rsvpid`),
  KEY `userid` (`userid`),
  KEY `post` (`post`),
  CONSTRAINT `rsvp_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `Users` (`userid`) ON DELETE SET NULL,
  CONSTRAINT `rsvp_ibfk_2` FOREIGN KEY (`post`) REFERENCES `post` (`postid`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rsvp`
--

LOCK TABLES `rsvp` WRITE;
/*!40000 ALTER TABLE `rsvp` DISABLE KEYS */;
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

-- Dump completed on 2023-06-06  4:28:51

/*
 Navicat Premium Data Transfer

 Source Server         : local_root
 Source Server Type    : MySQL
 Source Server Version : 50711
 Source Host           : localhost
 Source Database       : Nourriture

 Target Server Type    : MySQL
 Target Server Version : 50711
 File Encoding         : utf-8

 Date: 07/19/2016 21:23:44 PM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `admin`
-- ----------------------------
DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `password` varchar(40) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
--  Records of `admin`
-- ----------------------------
BEGIN;
INSERT INTO `admin` VALUES ('123', '123');
COMMIT;

-- ----------------------------
--  Table structure for `friend`
-- ----------------------------
DROP TABLE IF EXISTS `friend`;
CREATE TABLE `friend` (
  `user_id` int(11) NOT NULL,
  `friend_id` int(11) NOT NULL,
  KEY `friend_user_id_fk` (`user_id`),
  KEY `friend_friend__fk` (`friend_id`),
  CONSTRAINT `friend_friend__fk` FOREIGN KEY (`friend_id`) REFERENCES `user` (`id`),
  CONSTRAINT `friend_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
--  Records of `friend`
-- ----------------------------
BEGIN;
INSERT INTO `friend` VALUES ('3', '4');
COMMIT;

-- ----------------------------
--  Table structure for `material`
-- ----------------------------
DROP TABLE IF EXISTS `material`;
CREATE TABLE `material` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `img` varchar(100) COLLATE utf8_bin NOT NULL,
  `nutrition_value` varchar(1000) COLLATE utf8_bin NOT NULL,
  `del` smallint(6) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
--  Table structure for `menu`
-- ----------------------------
DROP TABLE IF EXISTS `menu`;
CREATE TABLE `menu` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8_bin NOT NULL,
  `img` varchar(100) COLLATE utf8_bin DEFAULT NULL,
  `price` double NOT NULL,
  `description` varchar(1000) COLLATE utf8_bin NOT NULL,
  `type` varchar(20) COLLATE utf8_bin DEFAULT NULL,
  `del` smallint(6) NOT NULL DEFAULT '0',
  `score` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
--  Records of `menu`
-- ----------------------------
BEGIN;
INSERT INTO `menu` VALUES ('3', '122', '/upload/menu/3/img.png', '122', '122', '122', '0', null), ('4', '1111', '/upload/menu/4/img.jpg', '1111', '1111', '1111', '0', null), ('6', 'n', '/upload/menu/6/img.jpg', '1', '1', '1', '0', null);
COMMIT;

-- ----------------------------
--  Table structure for `menu_evaluate`
-- ----------------------------
DROP TABLE IF EXISTS `menu_evaluate`;
CREATE TABLE `menu_evaluate` (
  `menu_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `evaluate` varchar(1000) COLLATE utf8_bin DEFAULT NULL,
  `score` int(11) DEFAULT NULL,
  KEY `menu_evaluate_menu_id_fk` (`menu_id`),
  KEY `menu_evaluate_user_id_fk` (`user_id`),
  CONSTRAINT `menu_evaluate_menu_id_fk` FOREIGN KEY (`menu_id`) REFERENCES `menu` (`id`),
  CONSTRAINT `menu_evaluate_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
--  Records of `menu_evaluate`
-- ----------------------------
BEGIN;
INSERT INTO `menu_evaluate` VALUES ('3', '3', '呵呵', '5'), ('3', '4', '呵呵', '5');
COMMIT;

-- ----------------------------
--  Table structure for `menu_material`
-- ----------------------------
DROP TABLE IF EXISTS `menu_material`;
CREATE TABLE `menu_material` (
  `menu_id` int(11) NOT NULL,
  `material_id` int(11) NOT NULL,
  KEY `menu_material_menu_id_fk` (`menu_id`),
  KEY `menu_material_material_id_fk` (`material_id`),
  CONSTRAINT `menu_material_material_id_fk` FOREIGN KEY (`material_id`) REFERENCES `material` (`id`),
  CONSTRAINT `menu_material_menu_id_fk` FOREIGN KEY (`menu_id`) REFERENCES `menu` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
--  Table structure for `menu_shop_user`
-- ----------------------------
DROP TABLE IF EXISTS `menu_shop_user`;
CREATE TABLE `menu_shop_user` (
  `menu_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `shop_id` int(11) DEFAULT NULL,
  KEY `menu_shop_user_menu_id_fk` (`menu_id`),
  KEY `menu_shop_user_user_id_fk` (`user_id`),
  KEY `menu_shop_user_shop_id_fk` (`shop_id`),
  CONSTRAINT `menu_shop_user_menu_id_fk` FOREIGN KEY (`menu_id`) REFERENCES `menu` (`id`),
  CONSTRAINT `menu_shop_user_shop_id_fk` FOREIGN KEY (`shop_id`) REFERENCES `shop` (`id`),
  CONSTRAINT `menu_shop_user_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
--  Records of `menu_shop_user`
-- ----------------------------
BEGIN;
INSERT INTO `menu_shop_user` VALUES ('3', null, '23'), ('4', '3', null), ('6', null, '25');
COMMIT;

-- ----------------------------
--  Table structure for `order`
-- ----------------------------
DROP TABLE IF EXISTS `order`;
CREATE TABLE `order` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
--  Table structure for `order_user_shop`
-- ----------------------------
DROP TABLE IF EXISTS `order_user_shop`;
CREATE TABLE `order_user_shop` (
  `order_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `shop_id` int(11) NOT NULL,
  KEY `order_user_shop_user_id_fk` (`user_id`),
  KEY `order_user_shop_order_id_fk` (`order_id`),
  KEY `order_user_shop_shop_id_fk` (`shop_id`),
  CONSTRAINT `order_user_shop_order_id_fk` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`),
  CONSTRAINT `order_user_shop_shop_id_fk` FOREIGN KEY (`shop_id`) REFERENCES `shop` (`id`),
  CONSTRAINT `order_user_shop_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
--  Table structure for `shop`
-- ----------------------------
DROP TABLE IF EXISTS `shop`;
CREATE TABLE `shop` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) COLLATE utf8_bin NOT NULL,
  `phone` varchar(20) COLLATE utf8_bin NOT NULL,
  `address` varchar(200) COLLATE utf8_bin NOT NULL,
  `certificate` varchar(1000) COLLATE utf8_bin DEFAULT NULL,
  `img` varchar(1000) COLLATE utf8_bin DEFAULT NULL,
  `longitude` double NOT NULL,
  `latitude` double NOT NULL,
  `del` smallint(6) NOT NULL DEFAULT '0',
  `description` varchar(2000) COLLATE utf8_bin NOT NULL,
  `ads` varchar(2000) COLLATE utf8_bin DEFAULT NULL,
  `password` varchar(40) COLLATE utf8_bin NOT NULL,
  `reg_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `shop_name_uindex` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
--  Records of `shop`
-- ----------------------------
BEGIN;
INSERT INTO `shop` VALUES ('23', '123', '123', '123', '/upload/shop/23/certificate.jpg', '/upload/shop/23/background.jpg', '123', '123', '0', '123', '123', '123', '2016-07-15 01:49:41'), ('24', '1234', '1234', '1234', '/upload/shop/24/certificate.png', '/upload/shop/24/background.jpg', '1234', '1234', '0', '1234', '1234', '1234', '2016-07-15 20:52:18'), ('25', 'name', '18801405200', '北京交通大学', '/upload/shop/25/certificate.jpg', '/upload/shop/25/background.jpg', '116.272757', '39.927109', '0', 'r', 'titleNourritureAndcontent', '1', '2016-07-17 10:37:07'), ('26', 'nam', '18801405200', '北京交通大学', '/upload/shop/26/certificate.jpg', '/upload/shop/26/background.jpg', '116.184794', '39.94083', '0', 'd', null, '1', '2016-07-17 10:44:28');
COMMIT;

-- ----------------------------
--  Table structure for `user`
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) COLLATE utf8_bin NOT NULL,
  `sex` varchar(2) COLLATE utf8_bin DEFAULT NULL,
  `birthday` datetime DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8_bin NOT NULL,
  `longitude` double DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `del` smallint(6) NOT NULL DEFAULT '0',
  `password` varchar(40) COLLATE utf8_bin NOT NULL,
  `reg_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `device_id` varchar(100) COLLATE utf8_bin DEFAULT NULL,
  `img` varchar(1000) COLLATE utf8_bin DEFAULT NULL,
  `mail` varchar(40) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_name_uindex` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
--  Records of `user`
-- ----------------------------
BEGIN;
INSERT INTO `user` VALUES ('3', '123', '女', '1996-01-01 00:00:00', '123', null, null, '0', '123', null, '123', '/upload/user/3/face.jpg', null), ('4', 'test', '男', null, '123456', null, null, '0', 'test', null, '1234', null, null), ('5', 'jiang', null, null, '12345678910', null, null, '0', '1234', null, null, null, null), ('6', 'wang', null, null, '12345678911', null, null, '0', '827CCB0EEA8A706C4C34A16891F84E7B', null, '550c5683-8f5a-464a-b8be-3b3f56c9b20e', null, null);
COMMIT;

-- ----------------------------
--  Table structure for `user_shop`
-- ----------------------------
DROP TABLE IF EXISTS `user_shop`;
CREATE TABLE `user_shop` (
  `user_id` int(11) NOT NULL,
  `shop_id` int(11) NOT NULL,
  KEY `user_shop_user_id_fk` (`user_id`),
  KEY `user_shop_shop_id_fk` (`shop_id`),
  CONSTRAINT `user_shop_shop_id_fk` FOREIGN KEY (`shop_id`) REFERENCES `shop` (`id`),
  CONSTRAINT `user_shop_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

SET FOREIGN_KEY_CHECKS = 1;

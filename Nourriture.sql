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

 Date: 07/13/2016 09:18:53 AM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `admin`
-- ----------------------------
DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin` (
  `name` varchar(20) COLLATE utf8_bin NOT NULL,
  `password` varchar(40) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
--  Records of `admin`
-- ----------------------------
BEGIN;
INSERT INTO `admin` VALUES ('test', '12345678');
COMMIT;

-- ----------------------------
--  Table structure for `friend`
-- ----------------------------
DROP TABLE IF EXISTS `friend`;
CREATE TABLE `friend` (
  `user_id` int(11) NOT NULL,
  `friend_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`,`friend_id`),
  KEY `friend_friend_id_fk` (`friend_id`),
  CONSTRAINT `friend_friend_id_fk` FOREIGN KEY (`friend_id`) REFERENCES `user` (`id`),
  CONSTRAINT `friend_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
--  Table structure for `material-shop`
-- ----------------------------
DROP TABLE IF EXISTS `material-shop`;
CREATE TABLE `material-shop` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(40) COLLATE utf8_bin NOT NULL,
  `img` varchar(200) COLLATE utf8_bin NOT NULL,
  `nutrition_value` varchar(2000) COLLATE utf8_bin NOT NULL,
  `del` smallint(6) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
--  Table structure for `material-user`
-- ----------------------------
DROP TABLE IF EXISTS `material-user`;
CREATE TABLE `material-user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8_bin NOT NULL,
  `nutrition_value` varchar(1000) COLLATE utf8_bin NOT NULL,
  `del` smallint(6) NOT NULL DEFAULT '0',
  `img` varchar(200) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
--  Records of `material-user`
-- ----------------------------
BEGIN;
INSERT INTO `material-user` VALUES ('1', '23224', '4234234', '0', '2342342');
COMMIT;

-- ----------------------------
--  Table structure for `menu-shop`
-- ----------------------------
DROP TABLE IF EXISTS `menu-shop`;
CREATE TABLE `menu-shop` (
  `id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8_bin NOT NULL,
  `img` varchar(100) COLLATE utf8_bin NOT NULL,
  `price` double NOT NULL,
  `description` varchar(2000) COLLATE utf8_bin DEFAULT NULL,
  `type` varchar(10) COLLATE utf8_bin DEFAULT NULL,
  `del` smallint(6) NOT NULL DEFAULT '0',
  `evaluate` varchar(1000) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `menu-shop_shop_id_fk` FOREIGN KEY (`id`) REFERENCES `shop` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
--  Records of `menu-shop`
-- ----------------------------
BEGIN;
INSERT INTO `menu-shop` VALUES ('1', '2131', '24113', '1234', 'wfwrverrveverv', '1', '0', 'efw32f4');
COMMIT;

-- ----------------------------
--  Table structure for `menu-user`
-- ----------------------------
DROP TABLE IF EXISTS `menu-user`;
CREATE TABLE `menu-user` (
  `id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8_bin NOT NULL,
  `img` varchar(100) COLLATE utf8_bin NOT NULL,
  `price` double DEFAULT NULL,
  `description` varchar(1000) COLLATE utf8_bin NOT NULL,
  `type` varchar(10) COLLATE utf8_bin NOT NULL,
  `del` smallint(6) NOT NULL DEFAULT '0',
  `evaluate` varchar(1000) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `menu-user_user_id_fk` FOREIGN KEY (`id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
--  Records of `menu-user`
-- ----------------------------
BEGIN;
INSERT INTO `menu-user` VALUES ('2', '214', 'ergrgr3qb', null, 'ewrgw3243', 'wqfw2', '0', 'qwe234g2\n\n');
COMMIT;

-- ----------------------------
--  Table structure for `menu_material-shop`
-- ----------------------------
DROP TABLE IF EXISTS `menu_material-shop`;
CREATE TABLE `menu_material-shop` (
  `menu_id` int(11) NOT NULL,
  `material_id` int(11) NOT NULL,
  PRIMARY KEY (`menu_id`,`material_id`),
  KEY `menu_material-shop_material_shop_id_fk` (`material_id`),
  CONSTRAINT `menu_material-shop_material_shop_id_fk` FOREIGN KEY (`material_id`) REFERENCES `material-shop` (`id`),
  CONSTRAINT `menu_material-shop_menu-shop_id_fk` FOREIGN KEY (`menu_id`) REFERENCES `menu-shop` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
--  Table structure for `menu_material-user`
-- ----------------------------
DROP TABLE IF EXISTS `menu_material-user`;
CREATE TABLE `menu_material-user` (
  `menu_id` int(11) NOT NULL,
  `material_id` int(11) NOT NULL,
  PRIMARY KEY (`menu_id`,`material_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
--  Records of `menu_material-user`
-- ----------------------------
BEGIN;
INSERT INTO `menu_material-user` VALUES ('1', '1');
COMMIT;

-- ----------------------------
--  Table structure for `order`
-- ----------------------------
DROP TABLE IF EXISTS `order`;
CREATE TABLE `order` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `shop_id` int(11) NOT NULL,
  `create_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `price` double NOT NULL,
  `finish_date` datetime DEFAULT NULL,
  `menus` varchar(2000) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_user_id_fk` (`user_id`),
  KEY `order_shop_id_fk` (`shop_id`),
  CONSTRAINT `order_shop_id_fk` FOREIGN KEY (`shop_id`) REFERENCES `shop` (`id`),
  CONSTRAINT `order_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
--  Table structure for `shop`
-- ----------------------------
DROP TABLE IF EXISTS `shop`;
CREATE TABLE `shop` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `account` varchar(255) COLLATE utf8_bin NOT NULL,
  `password` varchar(40) COLLATE utf8_bin NOT NULL,
  `certificate` varchar(255) COLLATE utf8_bin NOT NULL,
  `address` varchar(100) COLLATE utf8_bin NOT NULL,
  `name` varchar(40) COLLATE utf8_bin NOT NULL,
  `reg_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `phone` varchar(20) COLLATE utf8_bin NOT NULL,
  `img` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `description` varchar(1000) COLLATE utf8_bin DEFAULT NULL,
  `ads` varchar(1000) COLLATE utf8_bin DEFAULT NULL,
  `longitude` double NOT NULL,
  `latitude` double NOT NULL,
  `del` smallint(6) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `shop_account_uindex` (`account`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
--  Records of `shop`
-- ----------------------------
BEGIN;
INSERT INTO `shop` VALUES ('1', '123456', '13123', '/Public/upload/123456/certificate.jpg', '1232131', '31322', '2016-07-10 09:17:49', '123213', '/Public/upload/123456/background.jpg', '1312', '1231213', '132123', '34.6', '0'), ('2', '123457', '13123', '/Public/upload/123456/certificate.jpg', '1232131', '31321', '2016-07-10 09:17:49', '123213', '/Public/upload/123456/background.jpg', '1312', '1231213', '132123', '34.6', '0'), ('3', '123458', '13123', '/Public/upload/123456/certificate.jpg', '1232131', '31323', '2016-07-10 09:17:49', '123213', '/Public/upload/123456/background.jpg', '1312', '1231213', '132123', '34.6', '0'), ('4', '123459', '13123', '/Public/upload/123456/certificate.jpg', '1232131', '31324', '2016-07-10 09:17:49', '123213', '/Public/upload/123456/background.jpg', '1312', '1231213', '132123', '34.6', '0');
COMMIT;

-- ----------------------------
--  Table structure for `user`
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) COLLATE utf8_bin NOT NULL,
  `account` varchar(40) COLLATE utf8_bin NOT NULL,
  `password` varchar(40) COLLATE utf8_bin NOT NULL,
  `img` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8_bin DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `sex` varchar(2) COLLATE utf8_bin DEFAULT NULL,
  `del` smallint(6) NOT NULL DEFAULT '0',
  `deviceid` varchar(100) COLLATE utf8_bin DEFAULT NULL,
  `reg_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `longitude` double DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_account_uindex` (`account`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
--  Records of `user`
-- ----------------------------
BEGIN;
INSERT INTO `user` VALUES ('1', '12312', '234233', '2423412', '23424', '234234', null, '1', '0', null, '2016-07-12 09:47:32', null, null), ('2', '12311', '234234', '2423412', '23424', '234234', null, '1', '0', null, '2016-07-12 09:47:32', null, null), ('3', '12313', '234235', '2423412', '23424', '234234', null, '1', '0', null, '2016-07-12 09:47:32', null, null);
COMMIT;

-- ----------------------------
--  Table structure for `user_order_shop_evaluate`
-- ----------------------------
DROP TABLE IF EXISTS `user_order_shop_evaluate`;
CREATE TABLE `user_order_shop_evaluate` (
  `user_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `shop_id` int(11) NOT NULL,
  `evaluate` varchar(1000) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`user_id`,`shop_id`,`order_id`),
  KEY `user_order_shop_evaluate_shop_id_fk` (`shop_id`),
  KEY `user_order_shop_evaluate_order_id_fk` (`order_id`),
  CONSTRAINT `user_order_shop_evaluate_order_id_fk` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`),
  CONSTRAINT `user_order_shop_evaluate_shop_id_fk` FOREIGN KEY (`shop_id`) REFERENCES `shop` (`id`),
  CONSTRAINT `user_order_shop_evaluate_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
--  Table structure for `user_shop-focus`
-- ----------------------------
DROP TABLE IF EXISTS `user_shop-focus`;
CREATE TABLE `user_shop-focus` (
  `user_id` int(11) NOT NULL,
  `shop_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`,`shop_id`),
  KEY `user_shop-focus_shop_id_fk` (`shop_id`),
  CONSTRAINT `user_shop-focus_shop_id_fk` FOREIGN KEY (`shop_id`) REFERENCES `shop` (`id`),
  CONSTRAINT `user_shop-focus_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

SET FOREIGN_KEY_CHECKS = 1;

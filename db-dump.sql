-- phpMyAdmin SQL Dump
-- version 3.5.2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: May 08, 2013 at 04:24 PM
-- Server version: 5.5.16
-- PHP Version: 5.3.8

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `synergy`
--

-- --------------------------------------------------------

--
-- Table structure for table `reladmins`
--

CREATE TABLE IF NOT EXISTS `relAdmins` (
  `channel_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`channel_id`,`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `relfavourites`
--

CREATE TABLE IF NOT EXISTS `relFavourites` (
  `channel_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`channel_id`,`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `relfavourites`
--

INSERT INTO `relFavourites` (`channel_id`, `user_id`) VALUES
(1, 1),
(2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `relskips`
--

CREATE TABLE IF NOT EXISTS `relSkips` (
  `media_id` int(10) NOT NULL,
  `user_id` int(11) NOT NULL,
  UNIQUE KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `relskips`
--

INSERT INTO `relSkips` (`media_id`, `user_id`) VALUES
(6, 1);

-- --------------------------------------------------------

--
-- Table structure for table `tblchannels`
--

CREATE TABLE IF NOT EXISTS `tblChannels` (
  `_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `cover_id` varchar(45) NOT NULL,
  `cover_repeat` varchar(10) NOT NULL,
  `cover_pos_x` varchar(10) NOT NULL,
  `cover_pos_y` varchar(10) NOT NULL,
  `custom_url` varchar(45) NOT NULL,
  `owner_id` int(11) NOT NULL,
  `description` varchar(400) NOT NULL,
  `user_limit` int(11) NOT NULL,
  `skip_limit_multiplier` float NOT NULL,
  PRIMARY KEY (`_id`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  UNIQUE KEY `custom_url_UNIQUE` (`custom_url`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `tblchannels`
--

INSERT INTO `tblChannels` (`_id`, `name`, `cover_id`, `cover_repeat`, `cover_pos_x`, `cover_pos_y`, `custom_url`, `owner_id`, `description`, `user_limit`, `skip_limit_multiplier`) VALUES
(1, 'Bronies BW', '2.png', 'no-repeat', 'center', 'center', 'bronies-bw', 1, 'Official German Pony-Music Channel from BroniesBW! We play everything from Ponystep to Ponywhat. Pinkie Pie, Applejack, Twilight Sparkle, Derpy Hooves, Rarity, Sweetie Bell, Big Macintosh, Rainbow Dash, Scootalo, Princess Luna, Princess Celestia', 50, 0),
(2, 'Powermetal is best Metal!', '0.png', 'no-repeat', 'center', 'center', 'powermetal', 1, 'In the name of Metal! Beware of hard beats and fast rhythms on this channel.', 50, 0);

-- --------------------------------------------------------

--
-- Table structure for table `tblmedia`
--

CREATE TABLE IF NOT EXISTS `tblMedia` (
  `_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `caption` varchar(200) NOT NULL,
  `url` varchar(200) NOT NULL,
  `position` int(11) NOT NULL,
  `channel_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `duration` int(11) NOT NULL,
  `start_time` datetime NOT NULL,
  `media_type` varchar(15) NOT NULL DEFAULT 'youtube',
  PRIMARY KEY (`_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=26 ;

--
-- Dumping data for table `tblmedia`
--

INSERT INTO `tblMedia` (`_id`, `caption`, `url`, `position`, `channel_id`, `user_id`, `duration`, `start_time`, `media_type`) VALUES
(1, 'TuXe - Epic Wub Time MoP Wub Remix', 'WgAqoXT-2kM', 4, 1, 1, 241, '2013-05-08 14:59:58', 'youtube'),
(2, 'Eurobeat Brony - Discord (The Living Tombstone''s Remix)', 'xPfMb50dsOk', 5, 1, 1, 194, '2013-05-08 15:04:00', 'youtube'),
(3, 'Raise This Barn - MBAlpha (Remix)', '9FmzLk7jkSA', 6, 1, 1, 242, '2013-05-08 15:07:16', 'youtube'),
(4, '[PMV] Rainbow Factory Music Video', '4PjIhs72l0A', 2, 1, 1, 210, '2013-05-08 16:21:45', 'youtube'),
(5, '[PMV] Awoken', 'KwW9slmrKXo', 3, 1, 1, 283, '2013-05-08 14:55:09', 'youtube'),
(6, 'Replacer - Song for an Earth Pony', 'rpRJfKcip1A', 7, 1, 1, 391, '2013-05-08 15:11:18', 'youtube'),
(7, 'MLP-FiM: Smile Song (Rock Cover)', '1xDzKkjwD7g', 1, 1, 1, 203, '2013-05-08 16:18:21', 'youtube'),
(20, 'Loyalty - original MLP music by AcousticBrony & MandoPony', 'voj9MhBUaTI', 8, 1, 1, 375, '2013-05-08 15:17:54', 'youtube'),
(21, 'Picture Perfect Pony Official Music Video Animation', 'sDdL4z5qfr4', 9, 1, 1, 185, '2013-05-08 15:24:10', 'youtube'),
(22, 'Eurobeat Brony - Luna (The Living Tombstone''s Remix)', 'OrYHuCwfvb4', 10, 1, 1, 166, '2013-05-08 15:27:17', 'youtube'),
(23, 'Fluttershy''s Lament', 'b5YfYtZ32d4', 11, 1, 1, 237, '2013-05-08 15:30:04', 'youtube'),
(24, 'Shinedown - Amaryllis (Full Album)', 'GOuHOReYl9U', 12, 1, 1, 2656, '2013-05-08 15:34:03', 'youtube'),
(25, 'Sabaton - Carolus Rex EN (Lyrics English & Deutsch)', 'Us2ylGAwBnk', 1, 2, 1, 299, '2013-04-28 20:32:12', 'youtube');

-- --------------------------------------------------------

--
-- Table structure for table `tblmessages`
--

CREATE TABLE IF NOT EXISTS `tblMessages` (
  `_id` int(11) NOT NULL AUTO_INCREMENT,
  `timestamp` datetime NOT NULL,
  `content` varchar(400) NOT NULL,
  `user_id` int(11) NOT NULL,
  `channel_id` int(11) NOT NULL,
  PRIMARY KEY (`_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=84 ;

--
-- Dumping data for table `tblmessages`
--

INSERT INTO `tblMessages` (`_id`, `timestamp`, `content`, `user_id`, `channel_id`) VALUES
(1, '2013-03-28 00:00:00', 'Hello, World!', 1, 1),
(3, '2013-03-29 19:48:45', 'blablub', 1, 1),
(4, '2013-03-30 17:48:17', 'ohai', 9, 1),
(5, '2013-03-30 17:48:25', 'heyheyhey', 1, 1),
(6, '2013-03-30 17:48:42', 'scheint ja schon ganz gut zu funktionieren', 9, 1),
(7, '2013-03-30 17:48:47', 'ich bin graycode, du bist graycode, WIR ALLE SIND GRAYCODE xD', 1, 1),
(8, '2013-03-30 17:49:23', 'jarp, was eig als nächstes anliegt ist ne funktionierende playlist :D', 1, 1),
(9, '2013-03-30 17:49:51', 'ok, was funktioniert daran net?', 9, 1),
(10, '2013-03-30 17:50:07', 'hm grob gesagt alles^^''', 1, 1),
(11, '2013-03-30 17:51:03', 'ich hab ja ne mysql-db als backend und weil ich kein sonderlich ausgeklügeltes konzept habe (bis jetzt) gibts dafür noch keine idee^^', 1, 1),
(12, '2013-03-30 17:51:50', '<script type="text/javascript§', 1, 1),
(13, '2013-03-30 17:51:53', 'damnit :D', 1, 1),
(14, '2013-03-30 17:52:02', 'harhar', 9, 1),
(15, '2013-03-30 17:52:04', 'ok', 1, 1),
(16, '2013-03-30 17:52:14', '<script type="text/javascript">alert("blarblarblar");</script>', 1, 1),
(17, '2013-03-30 17:52:20', 'perfekt :D', 1, 1),
(18, '2013-03-30 17:54:17', 'wie hat denn die playlist bei synchtube funktioniert?', 9, 1),
(19, '2013-03-30 17:54:33', 'eine playlist pro channel?', 9, 1),
(20, '2013-03-30 17:54:39', 'jap', 1, 1),
(21, '2013-03-30 17:54:50', 'und dann kann man die als moderator verändern?', 9, 1),
(22, '2013-03-30 17:54:56', 'genau ;)', 1, 1),
(23, '2013-03-30 17:55:03', 'ok', 9, 1),
(24, '2013-03-30 17:55:10', 'ja müsst man sich halt mal n schema überlegen', 1, 1),
(25, '2013-03-30 17:55:20', 'und die reihenfolge ändern, neue hinzufügen', 1, 1),
(26, '2013-03-30 17:55:30', 'hmmmm wart kurz^^', 1, 1),
(27, '2013-03-30 17:55:42', 'kurz meinen laptop booten..', 1, 1),
(28, '2013-03-30 17:56:54', 'hab noch ein kleines modell davon', 1, 1),
(29, '2013-03-30 17:58:05', 'in der tabelle vor de videotitel gibts ja diese nummern, das sind quasi meine positionsangaben', 1, 1),
(30, '2013-03-30 17:58:47', 'wenn der aktuelle titel fertig gespielt ist läuft einfach der nächste in der liste an', 1, 1),
(31, '2013-03-30 17:59:03', 'das problem ist: alles muss sekundengenau auf allen clients laufen', 1, 1),
(32, '2013-03-30 18:03:28', 'joa', 1, 1),
(33, '2013-03-30 18:03:29', 'klar', 9, 1),
(34, '2013-03-30 18:03:46', 'gibts da irgendwelche interfaces mit youtube?', 9, 1),
(35, '2013-03-30 18:04:16', 'apis? ja, zwei eine mit iframes und eine direct mit flash', 1, 1),
(36, '2013-03-30 18:05:11', 'ok', 9, 1),
(37, '2013-03-30 18:05:17', 'https://developers.google.com/youtube/js_api_reference', 1, 1),
(38, '2013-03-30 18:05:28', 'theoretisch kannst du damit alles machen was du willst :D', 1, 1),
(39, '2013-03-30 18:05:59', 'ahja', 9, 1),
(40, '2013-03-30 18:06:55', 'mhm', 1, 1),
(41, '2013-03-30 18:08:17', 'ich benutz im moment die mit directem flash-access, weil die iframe-api unter chrome nicht funktioniert, wenn man kein ssl-zertifikat hat', 1, 1),
(42, '2013-03-30 18:08:50', 'irgendeine policy.. im firefox, ie und safari funktioniert das tadellos aber mit chrome nicht :DD', 1, 1),
(43, '2013-03-30 18:11:54', 'hmkay', 9, 1),
(44, '2013-03-30 18:14:59', 'aber ist nicht so schlimm^^', 1, 1),
(45, '2013-03-30 18:19:07', 'http://94.218.64.58/db-uml.png', 1, 1),
(46, '2013-04-06 19:40:32', 'I''m back!', 1, 1),
(47, '2013-04-07 16:11:09', 'FooBar', 1, 1),
(48, '2013-04-29 22:24:04', 'http://localhost/c/GOuHOReYl9U', 1, 1),
(49, '2013-05-08 10:33:51', 'Checkcheck', 1, 1),
(50, '2013-05-08 10:33:56', 'blabla', 1, 1),
(51, '2013-05-08 10:33:56', 'blabla', 1, 1),
(52, '2013-05-08 10:33:57', 'blabla', 1, 1),
(53, '2013-05-08 10:33:57', 'blabla', 1, 1),
(54, '2013-05-08 10:33:58', 'blabla', 1, 1),
(55, '2013-05-08 10:33:58', 'blabla', 1, 1),
(56, '2013-05-08 10:33:59', 'blabla', 1, 1),
(57, '2013-05-08 10:33:59', 'blabla', 9, 1),
(58, '2013-05-08 10:33:59', 'blabla', 9, 1),
(59, '2013-05-08 10:34:00', 'blabla', 9, 1),
(60, '2013-05-08 10:34:00', 'blabla', 9, 1),
(61, '2013-05-08 10:34:01', 'blabla', 9, 1),
(62, '2013-05-08 10:36:28', 'Lorem', 1, 1),
(63, '2013-05-08 10:36:29', 'Ipsum', 1, 1),
(64, '2013-05-08 10:36:30', 'Dolor', 1, 1),
(65, '2013-05-08 10:36:32', 'Set', 1, 1),
(66, '2013-05-08 10:36:33', 'Amet', 1, 1),
(67, '2013-05-08 10:47:00', 'blabla', 8, 1),
(68, '2013-05-08 10:47:02', 'blabla', 8, 1),
(69, '2013-05-08 10:47:03', 'blabla', 8, 1),
(70, '2013-05-08 10:47:04', 'blabla', 8, 1),
(71, '2013-05-08 10:47:04', 'blabla', 8, 1),
(72, '2013-05-08 10:47:06', 'blabla', 8, 1),
(73, '2013-05-08 10:47:07', 'blabla', 8, 1),
(74, '2013-05-08 10:47:07', 'blabla', 8, 1),
(75, '2013-05-08 10:47:08', 'blabla', 8, 1),
(76, '2013-05-08 10:47:10', 'blabla', 8, 1),
(77, '2013-05-08 10:47:10', 'blabla', 8, 1),
(78, '2013-05-08 10:47:11', 'blabla', 8, 1),
(79, '2013-05-08 10:47:12', 'blabla', 8, 1),
(80, '2013-05-08 10:47:12', 'blabla', 8, 1),
(81, '2013-05-08 11:32:52', 'append', 1, 1),
(82, '2013-05-08 11:38:00', 'root', 3, 1),
(83, '2013-05-08 11:39:30', 'screeny', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `tbltracking`
--

CREATE TABLE IF NOT EXISTS `tblTracking` (
  `_id` int(11) NOT NULL AUTO_INCREMENT,
  `ip_hash` char(64) NOT NULL,
  `channel_id` int(11) NOT NULL,
  `timestamp` datetime NOT NULL,
  PRIMARY KEY (`_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=211 ;

--
-- Dumping data for table `tbltracking`
--

INSERT INTO `tblTracking` (`_id`, `ip_hash`, `channel_id`, `timestamp`) VALUES
(72, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-04-29 22:36:47'),
(73, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-04-29 22:36:51'),
(74, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-04-29 22:50:19'),
(101, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-04-30 00:01:19'),
(102, 'eff8e7ca506627fe15dda5e0e512fcaad70b6d520f37cc76597fdb4f2d83a1a3', 1, '2013-05-08 10:31:21'),
(103, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-05-08 10:32:43'),
(104, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-05-08 10:33:39'),
(105, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-05-08 10:38:24'),
(106, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-05-08 10:39:07'),
(107, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-05-08 10:39:13'),
(108, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-05-08 10:41:24'),
(109, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-05-08 10:41:32'),
(110, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-05-08 10:42:54'),
(111, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-05-08 10:42:59'),
(112, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-05-08 10:43:04'),
(113, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-05-08 10:44:30'),
(114, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-05-08 10:44:45'),
(115, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-05-08 10:46:26'),
(116, 'eff8e7ca506627fe15dda5e0e512fcaad70b6d520f37cc76597fdb4f2d83a1a3', 1, '2013-05-08 10:48:02'),
(117, 'eff8e7ca506627fe15dda5e0e512fcaad70b6d520f37cc76597fdb4f2d83a1a3', 1, '2013-05-08 10:48:49'),
(118, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-05-08 10:49:19'),
(119, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-05-08 11:10:46'),
(120, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-05-08 11:11:04'),
(121, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-05-08 11:11:28'),
(122, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-05-08 11:11:42'),
(123, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-05-08 11:11:58'),
(124, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-05-08 11:12:07'),
(125, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-05-08 11:14:11'),
(126, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-05-08 11:16:02'),
(127, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-05-08 11:16:24'),
(128, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-05-08 11:16:46'),
(129, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-05-08 11:16:57'),
(130, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-05-08 11:18:33'),
(131, 'eff8e7ca506627fe15dda5e0e512fcaad70b6d520f37cc76597fdb4f2d83a1a3', 1, '2013-05-08 11:22:06'),
(132, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-05-08 11:22:10'),
(133, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-05-08 11:23:04'),
(134, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-05-08 11:23:26'),
(135, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-05-08 11:23:46'),
(136, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-05-08 11:24:25'),
(137, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-05-08 11:24:44'),
(210, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-05-08 16:22:28');

-- --------------------------------------------------------

--
-- Table structure for table `tbluser`
--

CREATE TABLE IF NOT EXISTS `tblUser` (
  `_id` int(11) NOT NULL AUTO_INCREMENT,
  `login_name` varchar(45) NOT NULL,
  `display_name` varchar(45) DEFAULT NULL,
  `email` varchar(90) NOT NULL,
  `avatar_id` varchar(45) DEFAULT NULL,
  `strategy` varchar(10) NOT NULL,
  `hash` varchar(200) NOT NULL,
  `session_id` varchar(64) DEFAULT NULL,
  `is_valid` tinyint(1) NOT NULL,
  `validate_hash` char(64) NOT NULL,
  PRIMARY KEY (`_id`),
  UNIQUE KEY `login_name_UNIQUE` (`login_name`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `display_name_UNIQUE` (`display_name`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=10 ;

--
-- Dumping data for table `tbluser`
--

INSERT INTO `tblUser` (`_id`, `login_name`, `display_name`, `email`, `avatar_id`, `strategy`, `hash`, `session_id`, `is_valid`, `validate_hash`) VALUES
(1, 'screeny05', 'Graycode', 'screeny05@gmail.com', NULL, 'local', 'sha1$ddab66da$1$2a0a55b9dd86976bb508368716a8f6707056e625', 'sha1$f05553e2$1$e5bb06d4068aae8587d5ef4f90e083c0606d8eba', 1, ''),
(3, 'root', 'root', 'webmaster@localcraft.de', NULL, 'local', '-', '-', 1, ''),
(8, 'test', 'Test', 'screeny05@goo.com', NULL, 'local', 'sha1$ddab66da$1$2a0a55b9dd86976bb508368716a8f6707056e625', 'sha1$7750c611$1$665bed9c57288f2065e22239ae911e37951e0fbf', 1, ''),
(9, 'switzy', 'Switzy', '-', NULL, 'local', 'sha1$ddab66da$1$2a0a55b9dd86976bb508368716a8f6707056e625', '', 1, '');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

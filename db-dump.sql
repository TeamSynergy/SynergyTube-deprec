-- phpMyAdmin SQL Dump
-- version 3.3.9.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Erstellungszeit: 30. April 2013 um 00:02
-- Server Version: 5.5.9
-- PHP-Version: 5.2.17

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Datenbank: `synergy`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `reladmins`
--

CREATE TABLE IF NOT EXISTS `reladmins` (
  `channel_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`channel_id`,`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `reladmins`
--


-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `relfavourites`
--

CREATE TABLE IF NOT EXISTS `relfavourites` (
  `channel_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`channel_id`,`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `relfavourites`
--

INSERT INTO `relfavourites` (`channel_id`, `user_id`) VALUES
(1, 1),
(2, 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `tblchannels`
--

CREATE TABLE IF NOT EXISTS `tblchannels` (
  `_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `cover_id` varchar(45) NOT NULL,
  `cover_repeat` varchar(10) NOT NULL,
  `cover_pos_x` varchar(10) NOT NULL,
  `cover_pos_y` varchar(10) NOT NULL,
  `custom_url` varchar(45) DEFAULT NULL,
  `owner_id` int(11) NOT NULL,
  `description` varchar(400) NOT NULL,
  `user_limit` int(11) NOT NULL,
  PRIMARY KEY (`_id`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  UNIQUE KEY `custom_url_UNIQUE` (`custom_url`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Daten für Tabelle `tblchannels`
--

INSERT INTO `tblchannels` (`_id`, `name`, `cover_id`, `cover_repeat`, `cover_pos_x`, `cover_pos_y`, `custom_url`, `owner_id`, `description`, `user_limit`) VALUES
(1, 'Bronies BW', '2.png', 'no-repeat', 'center', 'center', 'bronies-bw', 1, 'Official German Pony-Music Channel from BroniesBW! We play everything from Ponystep to Ponywhat. Pinkie Pie, Applejack, Twilight Sparkle, Derpy Hooves, Rarity, Sweetie Bell, Big Macintosh, Rainbow Dash, Scootalo, Princess Luna, Princess Celestia', 50),
(2, 'Powermetal is best Metal!', '0.png', 'no-repeat', 'center', 'center', 'powermetal', 1, 'In the name of Metal! Beware of hard beats and fast rhythms on this channel.', 50);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `tblmedia`
--

CREATE TABLE IF NOT EXISTS `tblmedia` (
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
-- Daten für Tabelle `tblmedia`
--

INSERT INTO `tblmedia` (`_id`, `caption`, `url`, `position`, `channel_id`, `user_id`, `duration`, `start_time`, `media_type`) VALUES
(1, 'TuXe - Epic Wub Time MoP Wub Remix', 'WgAqoXT-2kM', 4, 1, 1, 241, '2013-04-28 22:39:27', 'youtube'),
(2, 'Eurobeat Brony - Discord (The Living Tombstone''s Remix)', 'xPfMb50dsOk', 5, 1, 1, 194, '2013-04-29 22:08:54', 'youtube'),
(3, 'Raise This Barn - MBAlpha (Remix)', '9FmzLk7jkSA', 6, 1, 1, 242, '2013-04-29 22:12:18', 'youtube'),
(4, '[PMV] Rainbow Factory Music Video', '4PjIhs72l0A', 2, 1, 1, 210, '2013-04-28 22:35:53', 'youtube'),
(5, '[PMV] Awoken', 'KwW9slmrKXo', 3, 1, 1, 283, '2013-04-29 22:04:07', 'youtube'),
(6, 'Replacer - Song for an Earth Pony', 'rpRJfKcip1A', 7, 1, 1, 391, '2013-04-29 22:16:27', 'youtube'),
(7, 'MLP-FiM: Smile Song (Rock Cover)', '1xDzKkjwD7g', 1, 1, 1, 203, '2013-04-29 23:38:51', 'youtube'),
(20, 'Loyalty - original MLP music by AcousticBrony & MandoPony', 'voj9MhBUaTI', 8, 1, 1, 375, '2013-04-29 23:39:05', 'youtube'),
(21, 'Picture Perfect Pony Official Music Video Animation', 'sDdL4z5qfr4', 9, 1, 1, 185, '2013-04-29 23:45:39', 'youtube'),
(22, 'Eurobeat Brony - Luna (The Living Tombstone''s Remix)', 'OrYHuCwfvb4', 10, 1, 1, 166, '2013-04-29 23:48:46', 'youtube'),
(23, 'Fluttershy''s Lament', 'b5YfYtZ32d4', 11, 1, 1, 237, '2013-04-29 23:51:38', 'youtube'),
(24, 'Shinedown - Amaryllis (Full Album)', 'GOuHOReYl9U', 12, 1, 1, 2656, '2013-04-29 23:55:37', 'youtube'),
(25, 'Sabaton - Carolus Rex EN (Lyrics English & Deutsch)', 'Us2ylGAwBnk', 1, 2, 1, 299, '2013-04-28 20:32:12', 'youtube');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `tblmessages`
--

CREATE TABLE IF NOT EXISTS `tblmessages` (
  `_id` int(11) NOT NULL AUTO_INCREMENT,
  `timestamp` datetime NOT NULL,
  `content` varchar(400) NOT NULL,
  `user_id` int(11) NOT NULL,
  `channel_id` int(11) NOT NULL,
  PRIMARY KEY (`_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=49 ;

--
-- Daten für Tabelle `tblmessages`
--

INSERT INTO `tblmessages` (`_id`, `timestamp`, `content`, `user_id`, `channel_id`) VALUES
(1, '2013-03-28 00:00:00', 'Hello, World!', 1, 1),
(3, '2013-03-29 19:48:45', 'blablub', 1, 1),
(4, '2013-03-30 17:48:17', 'ohai', 1, 1),
(5, '2013-03-30 17:48:25', 'heyheyhey', 1, 1),
(6, '2013-03-30 17:48:42', 'scheint ja schon ganz gut zu funktionieren', 1, 1),
(7, '2013-03-30 17:48:47', 'ich bin graycode, du bist graycode, WIR ALLE SIND GRAYCODE xD', 1, 1),
(8, '2013-03-30 17:49:23', 'jarp, was eig als nächstes anliegt ist ne funktionierende playlist :D', 1, 1),
(9, '2013-03-30 17:49:51', 'ok, was funktioniert daran net?', 1, 1),
(10, '2013-03-30 17:50:07', 'hm grob gesagt alles^^''', 1, 1),
(11, '2013-03-30 17:51:03', 'ich hab ja ne mysql-db als backend und weil ich kein sonderlich ausgeklügeltes konzept habe (bis jetzt) gibts dafür noch keine idee^^', 1, 1),
(12, '2013-03-30 17:51:50', '<script type="text/javascript§', 1, 1),
(13, '2013-03-30 17:51:53', 'damnit :D', 1, 1),
(14, '2013-03-30 17:52:02', 'harhar', 1, 1),
(15, '2013-03-30 17:52:04', 'ok', 1, 1),
(16, '2013-03-30 17:52:14', '<script type="text/javascript">alert("blarblarblar");</script>', 1, 1),
(17, '2013-03-30 17:52:20', 'perfekt :D', 1, 1),
(18, '2013-03-30 17:54:17', 'wie hat denn die playlist bei synchtube funktioniert?', 1, 1),
(19, '2013-03-30 17:54:33', 'eine playlist pro channel?', 1, 1),
(20, '2013-03-30 17:54:39', 'jap', 1, 1),
(21, '2013-03-30 17:54:50', 'und dann kann man die als moderator verändern?', 1, 1),
(22, '2013-03-30 17:54:56', 'genau ;)', 1, 1),
(23, '2013-03-30 17:55:03', 'ok', 1, 1),
(24, '2013-03-30 17:55:10', 'ja müsst man sich halt mal n schema überlegen', 1, 1),
(25, '2013-03-30 17:55:20', 'und die reihenfolge ändern, neue hinzufügen', 1, 1),
(26, '2013-03-30 17:55:30', 'hmmmm wart kurz^^', 1, 1),
(27, '2013-03-30 17:55:42', 'kurz meinen laptop booten..', 1, 1),
(28, '2013-03-30 17:56:54', 'hab noch ein kleines modell davon', 1, 1),
(29, '2013-03-30 17:58:05', 'in der tabelle vor de videotitel gibts ja diese nummern, das sind quasi meine positionsangaben', 1, 1),
(30, '2013-03-30 17:58:47', 'wenn der aktuelle titel fertig gespielt ist läuft einfach der nächste in der liste an', 1, 1),
(31, '2013-03-30 17:59:03', 'das problem ist: alles muss sekundengenau auf allen clients laufen', 1, 1),
(32, '2013-03-30 18:03:28', 'joa', 1, 1),
(33, '2013-03-30 18:03:29', 'klar', 1, 1),
(34, '2013-03-30 18:03:46', 'gibts da irgendwelche interfaces mit youtube?', 1, 1),
(35, '2013-03-30 18:04:16', 'apis? ja, zwei eine mit iframes und eine direct mit flash', 1, 1),
(36, '2013-03-30 18:05:11', 'ok', 1, 1),
(37, '2013-03-30 18:05:17', 'https://developers.google.com/youtube/js_api_reference', 1, 1),
(38, '2013-03-30 18:05:28', 'theoretisch kannst du damit alles machen was du willst :D', 1, 1),
(39, '2013-03-30 18:05:59', 'ahja', 1, 1),
(40, '2013-03-30 18:06:55', 'mhm', 1, 1),
(41, '2013-03-30 18:08:17', 'ich benutz im moment die mit directem flash-access, weil die iframe-api unter chrome nicht funktioniert, wenn man kein ssl-zertifikat hat', 1, 1),
(42, '2013-03-30 18:08:50', 'irgendeine policy.. im firefox, ie und safari funktioniert das tadellos aber mit chrome nicht :DD', 1, 1),
(43, '2013-03-30 18:11:54', 'hmkay', 1, 1),
(44, '2013-03-30 18:14:59', 'aber ist nicht so schlimm^^', 1, 1),
(45, '2013-03-30 18:19:07', 'http://94.218.64.58/db-uml.png', 1, 1),
(46, '2013-04-06 19:40:32', 'I''m back!', 1, 1),
(47, '2013-04-07 16:11:09', 'FooBar', 1, 1),
(48, '2013-04-29 22:24:04', 'http://localhost/c/GOuHOReYl9U', 1, 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `tbltracking`
--

CREATE TABLE IF NOT EXISTS `tbltracking` (
  `_id` int(11) NOT NULL AUTO_INCREMENT,
  `ip_hash` char(64) NOT NULL,
  `channel_id` int(11) NOT NULL,
  `timestamp` datetime NOT NULL,
  PRIMARY KEY (`_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=102 ;

--
-- Daten für Tabelle `tbltracking`
--

INSERT INTO `tbltracking` (`_id`, `ip_hash`, `channel_id`, `timestamp`) VALUES
(72, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-04-29 22:36:47'),
(73, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-04-29 22:36:51'),
(74, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-04-29 22:50:19'),
(75, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-04-29 22:50:55'),
(76, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-04-29 22:51:13'),
(77, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-04-29 22:53:57'),
(78, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-04-29 22:54:21'),
(79, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-04-29 22:54:41'),
(80, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-04-29 22:55:09'),
(81, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-04-29 22:56:28'),
(82, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-04-29 22:57:02'),
(83, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-04-29 22:58:48'),
(84, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-04-29 22:59:07'),
(85, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-04-29 22:59:30'),
(86, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-04-29 23:03:21'),
(87, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-04-29 23:35:51'),
(88, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-04-29 23:37:24'),
(89, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-04-29 23:39:28'),
(90, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-04-29 23:39:35'),
(91, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-04-29 23:39:54'),
(92, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-04-29 23:40:21'),
(93, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-04-29 23:51:44'),
(94, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-04-29 23:52:03'),
(95, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-04-29 23:54:49'),
(96, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-04-29 23:54:52'),
(97, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-04-29 23:55:47'),
(98, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-04-29 23:55:48'),
(99, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-04-29 23:58:00'),
(100, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-04-29 23:58:36'),
(101, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', 1, '2013-04-30 00:01:19');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `tbluser`
--

CREATE TABLE IF NOT EXISTS `tbluser` (
  `_id` int(11) NOT NULL AUTO_INCREMENT,
  `login_name` varchar(45) NOT NULL,
  `display_name` varchar(45) DEFAULT NULL,
  `email` varchar(90) NOT NULL,
  `avatar_id` varchar(45) DEFAULT NULL,
  `strategy` varchar(10) NOT NULL,
  `hash` varchar(200) NOT NULL,
  `session_id` varchar(64) DEFAULT NULL,
  `is_valid` tinyint(1) NOT NULL,
  `validate_hash` char(60) NOT NULL,
  PRIMARY KEY (`_id`),
  UNIQUE KEY `login_name_UNIQUE` (`login_name`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `display_name_UNIQUE` (`display_name`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=7 ;

--
-- Daten für Tabelle `tbluser`
--

INSERT INTO `tbluser` (`_id`, `login_name`, `display_name`, `email`, `avatar_id`, `strategy`, `hash`, `session_id`, `is_valid`, `validate_hash`) VALUES
(1, 'screeny05', 'Graycode', 'screeny05@gmail.com', NULL, 'local', 'sha1$ddab66da$1$2a0a55b9dd86976bb508368716a8f6707056e625', 'sha1$6944cf6b$1$f3a93b9207df6f4bd93cb64d634acdb380e4adb4', 1, ''),
(3, 'root', 'root', 'webmaster@localcraft.de', NULL, 'local', '-', '-', 1, '');

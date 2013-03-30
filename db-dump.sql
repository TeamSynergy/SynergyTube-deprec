-- phpMyAdmin SQL Dump
-- version 3.3.9.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Erstellungszeit: 30. März 2013 um 17:22
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
(1, 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `tblchannels`
--

CREATE TABLE IF NOT EXISTS `tblchannels` (
  `_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `cover_id` varchar(45) NOT NULL,
  `custom_url` varchar(45) DEFAULT NULL,
  `owner_id` int(11) NOT NULL,
  `description` varchar(400) NOT NULL,
  `description_short` varchar(120) DEFAULT NULL,
  `views` int(10) unsigned NOT NULL,
  PRIMARY KEY (`_id`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  UNIQUE KEY `custom_url_UNIQUE` (`custom_url`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Daten für Tabelle `tblchannels`
--

INSERT INTO `tblchannels` (`_id`, `name`, `cover_id`, `custom_url`, `owner_id`, `description`, `description_short`, `views`) VALUES
(1, 'Bronies BW', '', 'bronies-bw', 1, 'Official German Pony-Music Channel from BroniesBW! We play everything from Ponystep to Ponywhat. Pinkie Pie, Applejack, Twilight Sparkle, Derpy Hooves, Rarity, Sweetie Bell, Big Macintosh, Rainbow Dash, Scootalo, Princess Luna, Princess Celestia', 'Official German Pony-Music Channel from BroniesBW! We play everything from Ponystep to Ponywhat.', 0);

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=6 ;

--
-- Daten für Tabelle `tblmedia`
--

INSERT INTO `tblmedia` (`_id`, `caption`, `url`, `position`, `channel_id`, `user_id`, `duration`, `start_time`, `media_type`) VALUES
(1, 'TuXe - Epic Wub Time MoP Wub Remix', 'https://www.youtube.com/watch?v=WgAqoXT-2kM', 1, 1, 1, 241, '0000-00-00 00:00:00', 'youtube'),
(2, 'Eurobeat Brony - Discord (The Living Tombstone''s Remix)', 'https://www.youtube.com/watch?v=xPfMb50dsOk', 4, 1, 1, 194, '0000-00-00 00:00:00', 'youtube'),
(3, 'Raise This Barn - MBAlpha (Remix)', 'https://www.youtube.com/watch?v=9FmzLk7jkSA', 5, 1, 1, 242, '0000-00-00 00:00:00', 'youtube'),
(4, '[PMV] Rainbow Factory Music Video', 'https://www.youtube.com/watch?v=4PjIhs72l0A', 2, 1, 1, 210, '0000-00-00 00:00:00', 'youtube'),
(5, '[PMV] Awoken', 'https://www.youtube.com/watch?v=KwW9slmrKXo', 3, 1, 1, 283, '0000-00-00 00:00:00', 'youtube');

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

--
-- Daten für Tabelle `tblmessages`
--

INSERT INTO `tblmessages` (`_id`, `timestamp`, `content`, `user_id`, `channel_id`) VALUES
(1, '2013-03-28 00:00:00', 'Hello, World!', 1, 1),
(3, '2013-03-29 19:48:45', 'blablub', 1, 1);

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
  PRIMARY KEY (`_id`),
  UNIQUE KEY `login_name_UNIQUE` (`login_name`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `display_name_UNIQUE` (`display_name`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Daten für Tabelle `tbluser`
--

INSERT INTO `tbluser` (`_id`, `login_name`, `display_name`, `email`, `avatar_id`) VALUES
(1, 'screeny05', 'Graycode', 'screeny05@gmail.com', NULL);

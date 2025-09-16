-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: May 31, 2025 at 10:55 PM
-- Server version: 8.0.40
-- PHP Version: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `event_dashboard`
--

-- --------------------------------------------------------

--
-- Table structure for table `calendar_group`
--

CREATE TABLE `calendar_group` (
  `id` int NOT NULL,
  `u_user_id` int DEFAULT NULL,
  `member_contacts` json NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `group_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `calendar_group` varchar(155) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `groupImage` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `calendar_group`
--

INSERT INTO `calendar_group` (`id`, `u_user_id`, `member_contacts`, `created_at`, `updated_at`, `group_name`, `calendar_group`, `groupImage`) VALUES
(1, 1, '[1, 2, 3, 4]', '2025-05-19 12:57:58', '2025-05-21 11:40:22', 'Tahir Group', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int NOT NULL,
  `uniqueEventId` varchar(36) NOT NULL,
  `uniqueCreatorId` varchar(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `startDate` date DEFAULT NULL,
  `endDate` date DEFAULT NULL,
  `startTime` time DEFAULT NULL,
  `endTime` time DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `uniqueLink` varchar(255) DEFAULT NULL,
  `address` json DEFAULT NULL,
  `icsDetails` json DEFAULT NULL,
  `ics_modified` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `calendar_id` int DEFAULT NULL,
  `message` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `uniqueEventId`, `uniqueCreatorId`, `title`, `startDate`, `endDate`, `startTime`, `endTime`, `email`, `name`, `uniqueLink`, `address`, `icsDetails`, `ics_modified`, `created_at`, `updated_at`, `calendar_id`, `message`) VALUES
(1, '40342efd-7dfe-4138-b2a5-1c1c47a3eb96', '1', '1st Event of this Project', NULL, NULL, NULL, NULL, 'tahir@kodxsystem.com', 'Tahir Amjad', '/chat/40342efd-7dfe-4138-b2a5-1c1c47a3eb96/1', '{\"city\": \"Lahore\", \"room\": \"\", \"place\": \"\", \"state\": \"Punjab\", \"country\": \"Pakistan\"}', '{\"mail\": \"tahir@kodxsystem.com\", \"name\": \"Tahir Amjad\", \"extra\": [{\"message\": \"This is the first test event\"}, {\"location\": \"Lahore, Punjab, Pakistan\"}, {\"members\": \"[{\\\"indexKey\\\":\\\"0\\\",\\\"user_type\\\":\\\"main\\\",\\\"name\\\":\\\"Tahir Amjad\\\",\\\"email\\\":\\\"tahir@kodxsystem.com\\\",\\\"mobile\\\":\\\"07378492257\\\",\\\"isEmailChecked\\\":false,\\\"isMobileChecked\\\":false}]\"}, {\"contact_group_id\": \"Tahir Group\"}, {\"city\": \"Lahore\"}, {\"state\": \"Punjab\"}, {\"country\": \"Pakistan\"}, {\"room\": \"\"}, {\"place\": \"\"}], \"title\": \"1st Event of this Project\", \"status\": \"CONFIRMED\", \"summary\": \"1st Event of this Project\", \"website\": \"\", \"location\": \", , , , Lahore, Punjab, Pakistan, \", \"attendees\": [{\"name\": \"Tahir Amjad\", \"role\": \"REQ-PARTICIPANT\", \"rsvp\": true, \"email\": \"tahir@kodxsystem.com\", \"cutype\": \"GROUP\", \"mobile\": \"07378492257\", \"partstat\": \"NOT-ACCEPTED\"}], \"creatorId\": 1, \"timeSlots\": [{\"end\": \"20250519T1300Z\", \"type\": 1, \"start\": \"20250519T1200Z\", \"slotName\": \"KodX-1\"}, {\"end\": null, \"type\": 2, \"start\": null, \"slotName\": \"\", \"weekdays\": []}], \"eventEmail\": \"\", \"calendar_id\": \"\", \"description\": \"\", \"lastModified\": \"20250519T125758Z\", \"eventLocation\": \"\", \"uniqueEventId\": \"40342efd-7dfe-4138-b2a5-1c1c47a3eb96\"}', '2025-05-19 12:57:58', '2025-05-19 12:57:58', '2025-05-19 12:57:58', 1, 'This is the first test event'),
(2, '7b9faa05-33cf-4c2a-a907-e30aa0b1c4bb', '2', '2nd Event where I am adding a new user', NULL, NULL, NULL, NULL, 'tahiramjad79@gmail.com', 'Tahir Amjad', '/chat/7b9faa05-33cf-4c2a-a907-e30aa0b1c4bb/1', '{\"city\": \"Lahore\", \"room\": \"\", \"place\": \"\", \"state\": \"Punjab\", \"country\": \"Pakistan\"}', '{\"mail\": \"tahiramjad79@gmail.com\", \"name\": \"Tahir Amjad\", \"extra\": [{\"message\": \"This is the 2nd Event for Testing with. new User\"}, {\"location\": \"Lahore, Punjab, Pakistan\"}, {\"members\": \"[{\\\"indexKey\\\":\\\"0\\\",\\\"user_type\\\":\\\"main\\\",\\\"name\\\":\\\"Tahir Amjad\\\",\\\"email\\\":\\\"tahir@kodxsystem.com\\\",\\\"mobile\\\":\\\"07378492257\\\",\\\"isEmailChecked\\\":false,\\\"isMobileChecked\\\":false},{\\\"indexKey\\\":\\\"1\\\",\\\"user_type\\\":\\\"main\\\",\\\"name\\\":\\\"MUHAMMAD TAHIR AMJAD\\\",\\\"email\\\":\\\"tahiramjad79@gmail.com\\\",\\\"mobile\\\":\\\"03224512868\\\",\\\"isEmailChecked\\\":false,\\\"isMobileChecked\\\":false}]\"}, {\"contact_group_id\": \"1\"}, {\"city\": \"Lahore\"}, {\"state\": \"Punjab\"}, {\"country\": \"Pakistan\"}, {\"room\": \"\"}, {\"place\": \"\"}], \"title\": \"2nd Event where I am adding a new user\", \"status\": \"CONFIRMED\", \"summary\": \"2nd Event where I am adding a new user\", \"website\": \"\", \"location\": \", , , , Lahore, Punjab, Pakistan, \", \"attendees\": [{\"name\": \"Tahir Amjad\", \"role\": \"REQ-PARTICIPANT\", \"rsvp\": true, \"email\": \"tahir@kodxsystem.com\", \"cutype\": \"GROUP\", \"mobile\": \"07378492257\", \"partstat\": \"NOT-ACCEPTED\"}, {\"name\": \"MUHAMMAD TAHIR AMJAD\", \"role\": \"REQ-PARTICIPANT\", \"rsvp\": true, \"email\": \"tahiramjad79@gmail.com\", \"cutype\": \"GROUP\", \"mobile\": \"03224512868\", \"partstat\": \"NOT-ACCEPTED\"}], \"creatorId\": 1, \"timeSlots\": [{\"end\": \"20250519T1301Z\", \"type\": 1, \"start\": \"20250519T1200Z\", \"slotName\": \"KodX-2\"}, {\"end\": null, \"type\": 2, \"start\": null, \"slotName\": \"\", \"weekdays\": []}], \"eventEmail\": \"\", \"calendar_id\": \"Tahir Group\", \"description\": \"\", \"lastModified\": \"20250519T130713Z\", \"eventLocation\": \"\", \"uniqueEventId\": \"7b9faa05-33cf-4c2a-a907-e30aa0b1c4bb\"}', '2025-05-19 13:07:13', '2025-05-19 13:07:13', '2025-05-22 09:45:13', 1, 'This is the 2nd Event for Testing with. new User'),
(3, '46805b06-939a-47f5-a59d-9ea7d915581f', '1', 'Tahir Amjad', NULL, NULL, NULL, NULL, 'tahir@kodxsystem.com', 'Tahir Amjad', '/chat/46805b06-939a-47f5-a59d-9ea7d915581f/1', '{}', '{\"mail\": \"tahir@kodxsystem.com\", \"name\": \"Tahir Amjad\", \"extra\": [{\"message\": \"This is an Event with Multiple \"}, {\"location\": \"\"}, {\"members\": \"[{\\\"indexKey\\\":\\\"0\\\",\\\"user_type\\\":\\\"main\\\",\\\"name\\\":\\\"Tahir Amjad\\\",\\\"email\\\":\\\"tahir@kodxsystem.com\\\",\\\"mobile\\\":\\\"07378492257\\\",\\\"isEmailChecked\\\":false,\\\"isMobileChecked\\\":false},{\\\"indexKey\\\":\\\"1\\\",\\\"user_type\\\":\\\"main\\\",\\\"name\\\":\\\"MUHAMMAD TAHIR\\\",\\\"email\\\":\\\"tahiramjad79@gmail.com\\\",\\\"mobile\\\":\\\"03224512868\\\",\\\"isEmailChecked\\\":false,\\\"isMobileChecked\\\":false},{\\\"indexKey\\\":\\\"2\\\",\\\"user_type\\\":\\\"main\\\",\\\"name\\\":\\\"Tahir 321\\\",\\\"email\\\":\\\"tahir123@gmail.com\\\",\\\"mobile\\\":\\\"03224512869\\\",\\\"isEmailChecked\\\":false,\\\"isMobileChecked\\\":false},{\\\"indexKey\\\":\\\"3\\\",\\\"user_type\\\":\\\"main\\\",\\\"name\\\":\\\"Tahir 123\\\",\\\"email\\\":\\\"tahir123@kodxsystem.com\\\",\\\"mobile\\\":\\\"07378492258\\\",\\\"isEmailChecked\\\":false,\\\"isMobileChecked\\\":false}]\"}, {\"contact_group_id\": \"1\"}, {\"isPaid\": \"true\"}], \"title\": \"Tahir Amjad\", \"status\": \"CONFIRMED\", \"summary\": \"Tahir Amjad\", \"website\": \"\", \"location\": \", , , , , , , \", \"attendees\": [{\"name\": \"Tahir Amjad\", \"role\": \"REQ-PARTICIPANT\", \"rsvp\": true, \"email\": \"tahir@kodxsystem.com\", \"cutype\": \"GROUP\", \"mobile\": \"07378492257\", \"partstat\": \"NOT-ACCEPTED\"}, {\"name\": \"MUHAMMAD TAHIR\", \"role\": \"REQ-PARTICIPANT\", \"rsvp\": true, \"email\": \"tahiramjad79@gmail.com\", \"cutype\": \"GROUP\", \"mobile\": \"03224512868\", \"partstat\": \"NOT-ACCEPTED\"}, {\"name\": \"Tahir 321\", \"role\": \"REQ-PARTICIPANT\", \"rsvp\": true, \"email\": \"tahir123@gmail.com\", \"cutype\": \"GROUP\", \"mobile\": \"03224512869\", \"partstat\": \"NOT-ACCEPTED\"}, {\"name\": \"Tahir 123\", \"role\": \"REQ-PARTICIPANT\", \"rsvp\": true, \"email\": \"tahir123@kodxsystem.com\", \"cutype\": \"GROUP\", \"mobile\": \"07378492258\", \"partstat\": \"NOT-ACCEPTED\"}], \"creatorId\": 1, \"timeSlots\": [{\"end\": \"20250521T1300Z\", \"type\": 1, \"start\": \"20250521T1200Z\", \"slotName\": \"KodX-3\"}, {\"end\": null, \"type\": 2, \"start\": null, \"slotName\": \"\", \"weekdays\": []}], \"eventEmail\": \"\", \"calendar_id\": \"Tahir Group\", \"description\": \"\", \"lastModified\": \"20250521T114023Z\", \"eventLocation\": \"\", \"uniqueEventId\": \"46805b06-939a-47f5-a59d-9ea7d915581f\"}', '2025-05-21 11:40:23', '2025-05-21 11:40:23', '2025-05-21 11:40:23', 1, 'This is an Event with Multiple '),
(4, '05a4673c-b8a1-4b4a-a6c4-07eb880d31fb', '1', 'Hello there', NULL, NULL, NULL, NULL, 'tahir@kodxsystem.com', 'Tahir Amjad', '/chat/05a4673c-b8a1-4b4a-a6c4-07eb880d31fb/1', '{\"city\": \"Lahore\", \"room\": \"\", \"place\": \"\", \"state\": \"Punjab\", \"country\": \"Pakistan\"}', '{\"mail\": \"tahir@kodxsystem.com\", \"name\": \"Tahir Amjad\", \"extra\": [{\"message\": \"Hi testing this Paid Event\"}, {\"location\": \"Lahore, Punjab, Pakistan\"}, {\"members\": \"[{\\\"indexKey\\\":\\\"0\\\",\\\"user_type\\\":\\\"main\\\",\\\"name\\\":\\\"Tahir Amjad\\\",\\\"email\\\":\\\"tahir@kodxsystem.com\\\",\\\"mobile\\\":\\\"07378492257\\\",\\\"isEmailChecked\\\":false,\\\"isMobileChecked\\\":false},{\\\"indexKey\\\":\\\"1\\\",\\\"user_type\\\":\\\"main\\\",\\\"name\\\":\\\"MUHAMMAD TAHIR\\\",\\\"email\\\":\\\"tahiramjad79@gmail.com\\\",\\\"mobile\\\":\\\"03224512868\\\",\\\"isEmailChecked\\\":false,\\\"isMobileChecked\\\":false},{\\\"indexKey\\\":\\\"2\\\",\\\"user_type\\\":\\\"main\\\",\\\"name\\\":\\\"Tahir 321\\\",\\\"email\\\":\\\"tahir123@gmail.com\\\",\\\"mobile\\\":\\\"03224512869\\\",\\\"isEmailChecked\\\":false,\\\"isMobileChecked\\\":false},{\\\"indexKey\\\":\\\"3\\\",\\\"user_type\\\":\\\"main\\\",\\\"name\\\":\\\"Tahir 123\\\",\\\"email\\\":\\\"tahir123@kodxsystem.com\\\",\\\"mobile\\\":\\\"07378492258\\\",\\\"isEmailChecked\\\":false,\\\"isMobileChecked\\\":false}]\"}, {\"contact_group_id\": \"1\"}, {\"isPaid\": \"true\"}, {\"city\": \"Lahore\"}, {\"state\": \"Punjab\"}, {\"country\": \"Pakistan\"}, {\"room\": \"\"}, {\"place\": \"\"}], \"title\": \"Hello there\", \"status\": \"CONFIRMED\", \"summary\": \"Hello there\", \"website\": \"\", \"location\": \", , , , Lahore, Punjab, Pakistan, \", \"attendees\": [{\"name\": \"Tahir Amjad\", \"role\": \"REQ-PARTICIPANT\", \"rsvp\": true, \"email\": \"tahir@kodxsystem.com\", \"cutype\": \"GROUP\", \"mobile\": \"07378492257\", \"partstat\": \"NOT-ACCEPTED\"}, {\"name\": \"MUHAMMAD TAHIR\", \"role\": \"REQ-PARTICIPANT\", \"rsvp\": true, \"email\": \"tahiramjad79@gmail.com\", \"cutype\": \"GROUP\", \"mobile\": \"03224512868\", \"partstat\": \"NOT-ACCEPTED\"}, {\"name\": \"Tahir 321\", \"role\": \"REQ-PARTICIPANT\", \"rsvp\": true, \"email\": \"tahir123@gmail.com\", \"cutype\": \"GROUP\", \"mobile\": \"03224512869\", \"partstat\": \"NOT-ACCEPTED\"}, {\"name\": \"Tahir 123\", \"role\": \"REQ-PARTICIPANT\", \"rsvp\": true, \"email\": \"tahir123@kodxsystem.com\", \"cutype\": \"GROUP\", \"mobile\": \"07378492258\", \"partstat\": \"NOT-ACCEPTED\"}], \"creatorId\": 1, \"timeSlots\": [{\"end\": \"20250530T1300Z\", \"type\": 1, \"start\": \"20250510T1200Z\", \"slotName\": \"KodX-4\"}, {\"end\": null, \"type\": 2, \"start\": null, \"slotName\": \"\", \"weekdays\": []}], \"eventEmail\": \"\", \"calendar_id\": \"Tahir Group\", \"description\": \"\", \"lastModified\": \"20250521T125517Z\", \"eventLocation\": \"\", \"uniqueEventId\": \"05a4673c-b8a1-4b4a-a6c4-07eb880d31fb\"}', '2025-05-21 12:55:17', '2025-05-21 12:55:17', '2025-05-21 12:55:17', 1, 'Hi testing this Paid Event'),
(5, 'c685b60f-30b5-43c9-ba99-cb68d58789c3', '1', 'Hello there', NULL, NULL, NULL, NULL, 'tahir@kodxsystem.com', 'Tahir Amjad', '/chat/c685b60f-30b5-43c9-ba99-cb68d58789c3/1', '{\"city\": \"Lahore\", \"room\": \"\", \"place\": \"\", \"state\": \"Punjab\", \"country\": \"Pakistan\"}', '{\"mail\": \"tahir@kodxsystem.com\", \"name\": \"Tahir Amjad\", \"extra\": [{\"message\": \"This is the test Message\"}, {\"location\": \"Lahore, Punjab, Pakistan\"}, {\"members\": \"[{\\\"indexKey\\\":\\\"0\\\",\\\"user_type\\\":\\\"main\\\",\\\"name\\\":\\\"Tahir Amjad\\\",\\\"email\\\":\\\"tahir@kodxsystem.com\\\",\\\"mobile\\\":\\\"07378492257\\\",\\\"isEmailChecked\\\":false,\\\"isMobileChecked\\\":false},{\\\"indexKey\\\":\\\"1\\\",\\\"user_type\\\":\\\"main\\\",\\\"name\\\":\\\"MUHAMMAD TAHIR\\\",\\\"email\\\":\\\"tahiramjad79@gmail.com\\\",\\\"mobile\\\":\\\"03224512868\\\",\\\"isEmailChecked\\\":false,\\\"isMobileChecked\\\":false},{\\\"indexKey\\\":\\\"2\\\",\\\"user_type\\\":\\\"main\\\",\\\"name\\\":\\\"Tahir 321\\\",\\\"email\\\":\\\"tahir123@gmail.com\\\",\\\"mobile\\\":\\\"03224512869\\\",\\\"isEmailChecked\\\":false,\\\"isMobileChecked\\\":false},{\\\"indexKey\\\":\\\"3\\\",\\\"user_type\\\":\\\"main\\\",\\\"name\\\":\\\"Tahir 123\\\",\\\"email\\\":\\\"tahir123@kodxsystem.com\\\",\\\"mobile\\\":\\\"07378492258\\\",\\\"isEmailChecked\\\":false,\\\"isMobileChecked\\\":false}]\"}, {\"contact_group_id\": \"1\"}, {\"isPaid\": \"true\"}, {\"city\": \"Lahore\"}, {\"state\": \"Punjab\"}, {\"country\": \"Pakistan\"}, {\"room\": \"\"}, {\"place\": \"\"}], \"title\": \"Hello there\", \"status\": \"CONFIRMED\", \"summary\": \"Hello there\", \"website\": \"\", \"location\": \", , , , Lahore, Punjab, Pakistan, \", \"attendees\": [{\"name\": \"Tahir Amjad\", \"role\": \"REQ-PARTICIPANT\", \"rsvp\": true, \"email\": \"tahir@kodxsystem.com\", \"cutype\": \"GROUP\", \"mobile\": \"07378492257\", \"partstat\": \"NOT-ACCEPTED\"}, {\"name\": \"MUHAMMAD TAHIR\", \"role\": \"REQ-PARTICIPANT\", \"rsvp\": true, \"email\": \"tahiramjad79@gmail.com\", \"cutype\": \"GROUP\", \"mobile\": \"03224512868\", \"partstat\": \"NOT-ACCEPTED\"}, {\"name\": \"Tahir 321\", \"role\": \"REQ-PARTICIPANT\", \"rsvp\": true, \"email\": \"tahir123@gmail.com\", \"cutype\": \"GROUP\", \"mobile\": \"03224512869\", \"partstat\": \"NOT-ACCEPTED\"}, {\"name\": \"Tahir 123\", \"role\": \"REQ-PARTICIPANT\", \"rsvp\": true, \"email\": \"tahir123@kodxsystem.com\", \"cutype\": \"GROUP\", \"mobile\": \"07378492258\", \"partstat\": \"NOT-ACCEPTED\"}], \"creatorId\": 1, \"timeSlots\": [{\"end\": \"20250530T1300Z\", \"type\": 1, \"start\": \"20250510T1200Z\", \"slotName\": \"KodX-4\"}, {\"end\": null, \"type\": 2, \"start\": null, \"slotName\": \"\", \"weekdays\": []}], \"eventEmail\": \"\", \"calendar_id\": \"Tahir Group\", \"description\": \"\", \"lastModified\": \"20250521T130059Z\", \"eventLocation\": \"\", \"uniqueEventId\": \"c685b60f-30b5-43c9-ba99-cb68d58789c3\"}', '2025-05-21 13:00:59', '2025-05-21 13:00:59', '2025-05-21 13:00:59', 1, 'This is the test Message'),
(6, 'b2638bb4-b0e0-4339-811c-d1be7f981f1d', '1', 'Testing For Timeslots', NULL, NULL, NULL, NULL, 'tahir@kodxsystem.com', 'Tahir Amjad', '/chat/b2638bb4-b0e0-4339-811c-d1be7f981f1d/1', '{\"city\": \"Lahore\", \"room\": \"\", \"place\": \"\", \"state\": \"Punjab\", \"country\": \"Pakistan\"}', '{\"mail\": \"tahir@kodxsystem.com\", \"name\": \"Tahir Amjad\", \"extra\": [{\"message\": \"This is a testing For Tahir\"}, {\"location\": \"Lahore, Punjab, Pakistan\"}, {\"members\": \"[{\\\"indexKey\\\":\\\"0\\\",\\\"user_type\\\":\\\"main\\\",\\\"name\\\":\\\"Tahir Amjad\\\",\\\"email\\\":\\\"tahir@kodxsystem.com\\\",\\\"mobile\\\":\\\"07378492257\\\",\\\"isEmailChecked\\\":false,\\\"isMobileChecked\\\":false},{\\\"indexKey\\\":\\\"1\\\",\\\"user_type\\\":\\\"main\\\",\\\"name\\\":\\\"MUHAMMAD TAHIR\\\",\\\"email\\\":\\\"tahiramjad79@gmail.com\\\",\\\"mobile\\\":\\\"03224512868\\\",\\\"isEmailChecked\\\":false,\\\"isMobileChecked\\\":false},{\\\"indexKey\\\":\\\"2\\\",\\\"user_type\\\":\\\"main\\\",\\\"name\\\":\\\"Tahir 321\\\",\\\"email\\\":\\\"tahir123@gmail.com\\\",\\\"mobile\\\":\\\"03224512869\\\",\\\"isEmailChecked\\\":false,\\\"isMobileChecked\\\":false},{\\\"indexKey\\\":\\\"3\\\",\\\"user_type\\\":\\\"main\\\",\\\"name\\\":\\\"Tahir 123\\\",\\\"email\\\":\\\"tahir123@kodxsystem.com\\\",\\\"mobile\\\":\\\"07378492258\\\",\\\"isEmailChecked\\\":false,\\\"isMobileChecked\\\":false}]\"}, {\"contact_group_id\": \"1\"}, {\"isPaid\": \"true\"}, {\"city\": \"Lahore\"}, {\"state\": \"Punjab\"}, {\"country\": \"Pakistan\"}, {\"room\": \"\"}, {\"place\": \"\"}], \"title\": \"Testing For Timeslots\", \"status\": \"CONFIRMED\", \"summary\": \"Testing For Timeslots\", \"website\": \"\", \"location\": \", , , , Lahore, Punjab, Pakistan, \", \"attendees\": [{\"name\": \"Tahir Amjad\", \"role\": \"REQ-PARTICIPANT\", \"rsvp\": true, \"email\": \"tahir@kodxsystem.com\", \"cutype\": \"GROUP\", \"mobile\": \"07378492257\", \"partstat\": \"NOT-ACCEPTED\"}, {\"name\": \"MUHAMMAD TAHIR\", \"role\": \"REQ-PARTICIPANT\", \"rsvp\": true, \"email\": \"tahiramjad79@gmail.com\", \"cutype\": \"GROUP\", \"mobile\": \"03224512868\", \"partstat\": \"NOT-ACCEPTED\"}, {\"name\": \"Tahir 321\", \"role\": \"REQ-PARTICIPANT\", \"rsvp\": true, \"email\": \"tahir123@gmail.com\", \"cutype\": \"GROUP\", \"mobile\": \"03224512869\", \"partstat\": \"NOT-ACCEPTED\"}, {\"name\": \"Tahir 123\", \"role\": \"REQ-PARTICIPANT\", \"rsvp\": true, \"email\": \"tahir123@kodxsystem.com\", \"cutype\": \"GROUP\", \"mobile\": \"07378492258\", \"partstat\": \"NOT-ACCEPTED\"}], \"creatorId\": 1, \"timeSlots\": [{\"end\": \"20250530T1300Z\", \"type\": 1, \"start\": \"20250510T1200Z\", \"slotName\": \"KodX-3\"}, {\"end\": null, \"type\": 2, \"start\": null, \"slotName\": \"\", \"weekdays\": []}], \"eventEmail\": \"\", \"calendar_id\": \"Tahir Group\", \"description\": \"\", \"lastModified\": \"20250521T132912Z\", \"eventLocation\": \"\", \"uniqueEventId\": \"b2638bb4-b0e0-4339-811c-d1be7f981f1d\"}', '2025-05-21 13:29:12', '2025-05-21 13:29:12', '2025-05-21 13:29:12', 1, 'This is a testing For Tahir'),
(7, '98c0fffd-4a1e-4976-9ca1-5d2ab70245f6', '1', 'Testing', NULL, NULL, NULL, NULL, 'tahir@kodxsystem.com', 'Tahir Amjad', '/chat/98c0fffd-4a1e-4976-9ca1-5d2ab70245f6/1', '{\"city\": \"Lahore\", \"room\": \"\", \"place\": \"\", \"state\": \"Punjab\", \"country\": \"Pakistan\"}', '{\"mail\": \"tahir@kodxsystem.com\", \"name\": \"Tahir Amjad\", \"extra\": [{\"message\": \"This is for the testing Purpose\"}, {\"location\": \"Lahore, Punjab, Pakistan\"}, {\"members\": \"[{\\\"indexKey\\\":\\\"0\\\",\\\"user_type\\\":\\\"main\\\",\\\"name\\\":\\\"Tahir Amjad\\\",\\\"email\\\":\\\"tahir@kodxsystem.com\\\",\\\"mobile\\\":\\\"07378492257\\\",\\\"isEmailChecked\\\":false,\\\"isMobileChecked\\\":false},{\\\"indexKey\\\":\\\"1\\\",\\\"user_type\\\":\\\"main\\\",\\\"name\\\":\\\"MUHAMMAD TAHIR\\\",\\\"email\\\":\\\"tahiramjad79@gmail.com\\\",\\\"mobile\\\":\\\"03224512868\\\",\\\"isEmailChecked\\\":false,\\\"isMobileChecked\\\":false},{\\\"indexKey\\\":\\\"2\\\",\\\"user_type\\\":\\\"main\\\",\\\"name\\\":\\\"Tahir 321\\\",\\\"email\\\":\\\"tahir123@gmail.com\\\",\\\"mobile\\\":\\\"03224512869\\\",\\\"isEmailChecked\\\":false,\\\"isMobileChecked\\\":false},{\\\"indexKey\\\":\\\"3\\\",\\\"user_type\\\":\\\"main\\\",\\\"name\\\":\\\"Tahir 123\\\",\\\"email\\\":\\\"tahir123@kodxsystem.com\\\",\\\"mobile\\\":\\\"07378492258\\\",\\\"isEmailChecked\\\":false,\\\"isMobileChecked\\\":false}]\"}, {\"contact_group_id\": \"1\"}, {\"isPaid\": \"true\"}, {\"city\": \"Lahore\"}, {\"state\": \"Punjab\"}, {\"country\": \"Pakistan\"}, {\"room\": \"\"}, {\"place\": \"\"}], \"title\": \"Testing\", \"status\": \"CONFIRMED\", \"summary\": \"Testing\", \"website\": \"\", \"location\": \", , , , Lahore, Punjab, Pakistan, \", \"attendees\": [{\"name\": \"Tahir Amjad\", \"role\": \"REQ-PARTICIPANT\", \"rsvp\": true, \"email\": \"tahir@kodxsystem.com\", \"cutype\": \"GROUP\", \"mobile\": \"07378492257\", \"partstat\": \"NOT-ACCEPTED\"}, {\"name\": \"MUHAMMAD TAHIR\", \"role\": \"REQ-PARTICIPANT\", \"rsvp\": true, \"email\": \"tahiramjad79@gmail.com\", \"cutype\": \"GROUP\", \"mobile\": \"03224512868\", \"partstat\": \"NOT-ACCEPTED\"}, {\"name\": \"Tahir 321\", \"role\": \"REQ-PARTICIPANT\", \"rsvp\": true, \"email\": \"tahir123@gmail.com\", \"cutype\": \"GROUP\", \"mobile\": \"03224512869\", \"partstat\": \"NOT-ACCEPTED\"}, {\"name\": \"Tahir 123\", \"role\": \"REQ-PARTICIPANT\", \"rsvp\": true, \"email\": \"tahir123@kodxsystem.com\", \"cutype\": \"GROUP\", \"mobile\": \"07378492258\", \"partstat\": \"NOT-ACCEPTED\"}], \"creatorId\": 1, \"timeSlots\": [{\"end\": \"20250521T1300Z\", \"type\": 1, \"start\": \"20250521T1200Z\", \"slotName\": \"KodX-8\"}, {\"end\": null, \"type\": 2, \"start\": null, \"slotName\": \"\", \"weekdays\": []}], \"eventEmail\": \"\", \"calendar_id\": \"Tahir Group\", \"description\": \"\", \"lastModified\": \"20250521T133231Z\", \"eventLocation\": \"\", \"uniqueEventId\": \"98c0fffd-4a1e-4976-9ca1-5d2ab70245f6\"}', '2025-05-21 13:32:31', '2025-05-21 13:32:31', '2025-05-21 13:32:31', 1, 'This is for the testing Purpose'),
(8, '43f5fb6a-7916-4a57-9f8a-ea12535ff4ad', '1', 'asdasd', NULL, NULL, NULL, NULL, 'tahir@kodxsystem.com', 'Tahir Amjad', '/chat/43f5fb6a-7916-4a57-9f8a-ea12535ff4ad/1', '{\"city\": \"Lahore\", \"room\": \"\", \"place\": \"\", \"state\": \"Punjab\", \"country\": \"Pakistan\"}', '{\"mail\": \"tahir@kodxsystem.com\", \"name\": \"Tahir Amjad\", \"extra\": [{\"message\": \"This si testing\"}, {\"location\": \"Lahore, Punjab, Pakistan\"}, {\"members\": \"[{\\\"indexKey\\\":\\\"0\\\",\\\"user_type\\\":\\\"main\\\",\\\"name\\\":\\\"Tahir Amjad\\\",\\\"email\\\":\\\"tahir@kodxsystem.com\\\",\\\"mobile\\\":\\\"07378492257\\\",\\\"isEmailChecked\\\":false,\\\"isMobileChecked\\\":false},{\\\"indexKey\\\":\\\"1\\\",\\\"user_type\\\":\\\"main\\\",\\\"name\\\":\\\"MUHAMMAD TAHIR\\\",\\\"email\\\":\\\"tahiramjad79@gmail.com\\\",\\\"mobile\\\":\\\"03224512868\\\",\\\"isEmailChecked\\\":false,\\\"isMobileChecked\\\":false},{\\\"indexKey\\\":\\\"2\\\",\\\"user_type\\\":\\\"main\\\",\\\"name\\\":\\\"Tahir 321\\\",\\\"email\\\":\\\"tahir123@gmail.com\\\",\\\"mobile\\\":\\\"03224512869\\\",\\\"isEmailChecked\\\":false,\\\"isMobileChecked\\\":false},{\\\"indexKey\\\":\\\"3\\\",\\\"user_type\\\":\\\"main\\\",\\\"name\\\":\\\"Tahir 123\\\",\\\"email\\\":\\\"tahir123@kodxsystem.com\\\",\\\"mobile\\\":\\\"07378492258\\\",\\\"isEmailChecked\\\":false,\\\"isMobileChecked\\\":false}]\"}, {\"contact_group_id\": \"1\"}, {\"isPaid\": \"true\"}, {\"city\": \"Lahore\"}, {\"state\": \"Punjab\"}, {\"country\": \"Pakistan\"}, {\"room\": \"\"}, {\"place\": \"\"}], \"title\": \"asdasd\", \"status\": \"CONFIRMED\", \"summary\": \"asdasd\", \"website\": \"\", \"location\": \", , , , Lahore, Punjab, Pakistan, \", \"attendees\": [{\"name\": \"Tahir Amjad\", \"role\": \"REQ-PARTICIPANT\", \"rsvp\": true, \"email\": \"tahir@kodxsystem.com\", \"cutype\": \"GROUP\", \"mobile\": \"07378492257\", \"partstat\": \"NOT-ACCEPTED\"}, {\"name\": \"MUHAMMAD TAHIR\", \"role\": \"REQ-PARTICIPANT\", \"rsvp\": true, \"email\": \"tahiramjad79@gmail.com\", \"cutype\": \"GROUP\", \"mobile\": \"03224512868\", \"partstat\": \"NOT-ACCEPTED\"}, {\"name\": \"Tahir 321\", \"role\": \"REQ-PARTICIPANT\", \"rsvp\": true, \"email\": \"tahir123@gmail.com\", \"cutype\": \"GROUP\", \"mobile\": \"03224512869\", \"partstat\": \"NOT-ACCEPTED\"}, {\"name\": \"Tahir 123\", \"role\": \"REQ-PARTICIPANT\", \"rsvp\": true, \"email\": \"tahir123@kodxsystem.com\", \"cutype\": \"GROUP\", \"mobile\": \"07378492258\", \"partstat\": \"NOT-ACCEPTED\"}], \"creatorId\": 1, \"timeSlots\": [{\"end\": \"20250530T1300Z\", \"type\": 1, \"start\": \"20250510T1200Z\", \"slotName\": \"KodX-4\"}, {\"end\": null, \"type\": 2, \"start\": null, \"slotName\": \"\", \"weekdays\": []}], \"eventEmail\": \"\", \"calendar_id\": \"Tahir Group\", \"description\": \"\", \"lastModified\": \"20250521T140344Z\", \"eventLocation\": \"\", \"uniqueEventId\": \"43f5fb6a-7916-4a57-9f8a-ea12535ff4ad\"}', '2025-05-21 14:03:44', '2025-05-21 14:03:44', '2025-05-21 14:03:44', 1, 'This si testing'),
(9, '9a8c1cf5-de79-4752-bd5b-01d05092c5e0', '2', 'nlkandqiundjkqws', NULL, NULL, NULL, NULL, 'tahiramjad79@gmail.com', 'Tahir Amjad', '/chat/9a8c1cf5-de79-4752-bd5b-01d05092c5e0/1', '{\"city\": \"Lahore\", \"room\": \"\", \"place\": \"\", \"state\": \"Punjab\", \"country\": \"Pakistan\"}', '{\"mail\": \"tahiramjad79@gmail.com\", \"name\": \"Tahir Amjad\", \"extra\": [{\"message\": \"This is testing again\"}, {\"location\": \"Lahore, Punjab, Pakistan\"}, {\"members\": \"[{\\\"indexKey\\\":\\\"0\\\",\\\"user_type\\\":\\\"main\\\",\\\"name\\\":\\\"Tahir Amjad\\\",\\\"email\\\":\\\"tahir@kodxsystem.com\\\",\\\"mobile\\\":\\\"07378492257\\\",\\\"isEmailChecked\\\":false,\\\"isMobileChecked\\\":false},{\\\"indexKey\\\":\\\"1\\\",\\\"user_type\\\":\\\"main\\\",\\\"name\\\":\\\"MUHAMMAD TAHIR\\\",\\\"email\\\":\\\"tahiramjad79@gmail.com\\\",\\\"mobile\\\":\\\"03224512868\\\",\\\"isEmailChecked\\\":false,\\\"isMobileChecked\\\":false},{\\\"indexKey\\\":\\\"2\\\",\\\"user_type\\\":\\\"main\\\",\\\"name\\\":\\\"Tahir 321\\\",\\\"email\\\":\\\"tahir123@gmail.com\\\",\\\"mobile\\\":\\\"03224512869\\\",\\\"isEmailChecked\\\":false,\\\"isMobileChecked\\\":false},{\\\"indexKey\\\":\\\"3\\\",\\\"user_type\\\":\\\"main\\\",\\\"name\\\":\\\"Tahir 123\\\",\\\"email\\\":\\\"tahir123@kodxsystem.com\\\",\\\"mobile\\\":\\\"07378492258\\\",\\\"isEmailChecked\\\":false,\\\"isMobileChecked\\\":false}]\"}, {\"contact_group_id\": \"1\"}, {\"isPaid\": \"true\"}, {\"city\": \"Lahore\"}, {\"state\": \"Punjab\"}, {\"country\": \"Pakistan\"}, {\"room\": \"\"}, {\"place\": \"\"}], \"title\": \"nlkandqiundjkqws\", \"status\": \"CONFIRMED\", \"summary\": \"nlkandqiundjkqws\", \"website\": \"\", \"location\": \", , , , Lahore, Punjab, Pakistan, \", \"attendees\": [{\"name\": \"Tahir Amjad\", \"role\": \"REQ-PARTICIPANT\", \"rsvp\": true, \"email\": \"tahir@kodxsystem.com\", \"cutype\": \"GROUP\", \"mobile\": \"07378492257\", \"partstat\": \"NOT-ACCEPTED\"}, {\"name\": \"MUHAMMAD TAHIR\", \"role\": \"REQ-PARTICIPANT\", \"rsvp\": true, \"email\": \"tahiramjad79@gmail.com\", \"cutype\": \"GROUP\", \"mobile\": \"03224512868\", \"partstat\": \"NOT-ACCEPTED\"}, {\"name\": \"Tahir 321\", \"role\": \"REQ-PARTICIPANT\", \"rsvp\": true, \"email\": \"tahir123@gmail.com\", \"cutype\": \"GROUP\", \"mobile\": \"03224512869\", \"partstat\": \"NOT-ACCEPTED\"}, {\"name\": \"Tahir 123\", \"role\": \"REQ-PARTICIPANT\", \"rsvp\": true, \"email\": \"tahir123@kodxsystem.com\", \"cutype\": \"GROUP\", \"mobile\": \"07378492258\", \"partstat\": \"NOT-ACCEPTED\"}], \"creatorId\": 1, \"timeSlots\": [{\"end\": \"20250521T1300Z\", \"type\": 1, \"start\": \"20250521T1200Z\", \"slotName\": \"KodX-9\"}, {\"end\": null, \"type\": 2, \"start\": null, \"slotName\": \"\", \"weekdays\": []}], \"eventEmail\": \"\", \"calendar_id\": \"Tahir Group\", \"description\": \"\", \"lastModified\": \"20250521T140449Z\", \"eventLocation\": \"\", \"uniqueEventId\": \"9a8c1cf5-de79-4752-bd5b-01d05092c5e0\"}', '2025-05-21 14:04:49', '2025-05-21 14:04:48', '2025-05-22 09:45:19', 1, 'This is testing again');

-- --------------------------------------------------------

--
-- Table structure for table `event_fee_details`
--

CREATE TABLE `event_fee_details` (
  `id` int NOT NULL,
  `event_id` int NOT NULL,
  `invoice_id` int NOT NULL,
  `batch_date` date NOT NULL,
  `payment_terms` enum('today','tomorrow','before-class-start','after-class-end','day-class-starts','specific-date','each-occurrence','day-of-the-month','each-start-date','each-end-date','once-per-month','15th-of-the-month','last-day-of-the-month') CHARACTER SET utf32 COLLATE utf32_swedish_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `event_fee_details`
--

INSERT INTO `event_fee_details` (`id`, `event_id`, `invoice_id`, `batch_date`, `payment_terms`, `created_at`, `updated_at`) VALUES
(1, 3, 25, '2025-05-21', 'today', '2025-05-21 12:54:18', '2025-05-21 12:54:18'),
(2, 3, 26, '2025-05-21', 'today', '2025-05-21 12:54:18', '2025-05-21 12:54:18'),
(3, 3, 27, '2025-05-21', 'today', '2025-05-21 12:54:18', '2025-05-21 12:54:18'),
(4, 3, 28, '2025-05-21', 'today', '2025-05-21 12:54:18', '2025-05-21 12:54:18'),
(5, 4, 29, '2025-05-22', 'tomorrow', '2025-05-21 12:55:24', '2025-05-21 12:55:24'),
(6, 4, 30, '2025-05-22', 'tomorrow', '2025-05-21 12:55:24', '2025-05-21 12:55:24'),
(7, 4, 31, '2025-05-22', 'tomorrow', '2025-05-21 12:55:24', '2025-05-21 12:55:24'),
(8, 4, 32, '2025-05-22', 'tomorrow', '2025-05-21 12:55:24', '2025-05-21 12:55:24'),
(9, 6, 37, '2025-05-22', 'tomorrow', '2025-05-21 13:31:21', '2025-05-21 13:31:21'),
(10, 6, 38, '2025-05-22', 'tomorrow', '2025-05-21 13:31:21', '2025-05-21 13:31:21'),
(11, 6, 39, '2025-05-22', 'tomorrow', '2025-05-21 13:31:21', '2025-05-21 13:31:21'),
(12, 6, 40, '2025-05-22', 'tomorrow', '2025-05-21 13:31:21', '2025-05-21 13:31:21'),
(13, 7, 53, '2025-05-22', 'tomorrow', '2025-05-21 13:53:38', '2025-05-21 13:53:38'),
(14, 7, 54, '2025-05-22', 'tomorrow', '2025-05-21 13:53:38', '2025-05-21 13:53:38'),
(15, 7, 55, '2025-05-22', 'tomorrow', '2025-05-21 13:53:38', '2025-05-21 13:53:38'),
(16, 7, 56, '2025-05-22', 'tomorrow', '2025-05-21 13:53:38', '2025-05-21 13:53:38'),
(17, 7, 57, '2025-05-22', 'tomorrow', '2025-05-21 13:58:15', '2025-05-21 13:58:15'),
(18, 7, 58, '2025-05-22', 'tomorrow', '2025-05-21 13:58:15', '2025-05-21 13:58:15'),
(19, 7, 59, '2025-05-22', 'tomorrow', '2025-05-21 13:58:15', '2025-05-21 13:58:15'),
(20, 7, 60, '2025-05-22', 'tomorrow', '2025-05-21 13:58:15', '2025-05-21 13:58:15'),
(21, 7, 61, '2025-05-22', 'tomorrow', '2025-05-21 13:59:49', '2025-05-21 13:59:49'),
(22, 7, 62, '2025-05-22', 'tomorrow', '2025-05-21 13:59:49', '2025-05-21 13:59:49'),
(23, 7, 63, '2025-05-22', 'tomorrow', '2025-05-21 13:59:49', '2025-05-21 13:59:49'),
(24, 7, 64, '2025-05-22', 'tomorrow', '2025-05-21 13:59:49', '2025-05-21 13:59:49'),
(25, 7, 65, '2025-05-22', 'tomorrow', '2025-05-21 14:02:48', '2025-05-21 14:02:48'),
(26, 7, 66, '2025-05-22', 'tomorrow', '2025-05-21 14:02:48', '2025-05-21 14:02:48'),
(27, 7, 67, '2025-05-22', 'tomorrow', '2025-05-21 14:02:48', '2025-05-21 14:02:48'),
(28, 7, 68, '2025-05-22', 'tomorrow', '2025-05-21 14:02:48', '2025-05-21 14:02:48'),
(29, 8, 69, '2025-05-22', 'tomorrow', '2025-05-21 14:03:52', '2025-05-21 14:03:52'),
(30, 8, 70, '2025-05-22', 'tomorrow', '2025-05-21 14:03:52', '2025-05-21 14:03:52'),
(31, 8, 71, '2025-05-22', 'tomorrow', '2025-05-21 14:03:52', '2025-05-21 14:03:52'),
(32, 8, 72, '2025-05-22', 'tomorrow', '2025-05-21 14:03:52', '2025-05-21 14:03:52'),
(33, 9, 73, '2025-05-22', 'tomorrow', '2025-05-21 14:05:07', '2025-05-21 14:05:07'),
(34, 9, 74, '2025-05-22', 'tomorrow', '2025-05-21 14:05:07', '2025-05-21 14:05:07'),
(35, 9, 75, '2025-05-22', 'tomorrow', '2025-05-21 14:05:07', '2025-05-21 14:05:07'),
(36, 9, 76, '2025-05-22', 'tomorrow', '2025-05-21 14:05:07', '2025-05-21 14:05:07');

-- --------------------------------------------------------

--
-- Table structure for table `event_member_request`
--

CREATE TABLE `event_member_request` (
  `id` int NOT NULL,
  `eventId` int NOT NULL,
  `uniqueEventId` varchar(36) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `accept` tinyint(1) NOT NULL DEFAULT '0',
  `accepted_on` timestamp NULL DEFAULT NULL,
  `details` text,
  `is_invited` tinyint DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `member_contact_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `event_member_request`
--

INSERT INTO `event_member_request` (`id`, `eventId`, `uniqueEventId`, `name`, `email`, `mobile`, `accept`, `accepted_on`, `details`, `is_invited`, `created_at`, `updated_at`, `member_contact_id`) VALUES
(1, 1, '40342efd-7dfe-4138-b2a5-1c1c47a3eb96', NULL, NULL, NULL, 1, '2025-05-27 09:22:05', '{\"name\":\"Tahir Amjad\",\"email\":\"tahir@kodxsystem.com\",\"mobile\":\"07378492257\",\"rsvp\":true,\"partstat\":\"NOT-ACCEPTED\",\"role\":\"REQ-PARTICIPANT\",\"cutype\":\"GROUP\"}', NULL, '2025-05-19 12:57:58', '2025-05-27 09:22:04', 1),
(2, 2, '7b9faa05-33cf-4c2a-a907-e30aa0b1c4bb', NULL, NULL, NULL, 1, '2025-05-27 09:22:05', '{\"name\":\"Tahir Amjad\",\"email\":\"tahir@kodxsystem.com\",\"mobile\":\"07378492257\",\"rsvp\":true,\"partstat\":\"NOT-ACCEPTED\",\"role\":\"REQ-PARTICIPANT\",\"cutype\":\"GROUP\"}', NULL, '2025-05-19 13:07:13', '2025-05-27 09:22:04', 1),
(3, 2, '7b9faa05-33cf-4c2a-a907-e30aa0b1c4bb', NULL, NULL, NULL, 1, '2025-05-19 13:14:43', '{\"name\":\"MUHAMMAD TAHIR AMJAD\",\"email\":\"tahiramjad79@gmail.com\",\"mobile\":\"03224512868\",\"rsvp\":true,\"partstat\":\"NOT-ACCEPTED\",\"role\":\"REQ-PARTICIPANT\",\"cutype\":\"GROUP\"}', NULL, '2025-05-19 13:07:13', '2025-05-19 13:14:42', 2),
(4, 3, '46805b06-939a-47f5-a59d-9ea7d915581f', NULL, NULL, NULL, 1, '2025-05-27 09:22:05', '{\"name\":\"Tahir Amjad\",\"email\":\"tahir@kodxsystem.com\",\"mobile\":\"07378492257\",\"rsvp\":true,\"partstat\":\"NOT-ACCEPTED\",\"role\":\"REQ-PARTICIPANT\",\"cutype\":\"GROUP\"}', NULL, '2025-05-21 11:40:23', '2025-05-27 09:22:04', 1),
(5, 3, '46805b06-939a-47f5-a59d-9ea7d915581f', NULL, NULL, NULL, 0, NULL, '{\"name\":\"MUHAMMAD TAHIR\",\"email\":\"tahiramjad79@gmail.com\",\"mobile\":\"03224512868\",\"rsvp\":true,\"partstat\":\"NOT-ACCEPTED\",\"role\":\"REQ-PARTICIPANT\",\"cutype\":\"GROUP\"}', NULL, '2025-05-21 11:40:23', '2025-05-21 11:40:23', 2),
(6, 3, '46805b06-939a-47f5-a59d-9ea7d915581f', NULL, NULL, NULL, 0, NULL, '{\"name\":\"Tahir 321\",\"email\":\"tahir123@gmail.com\",\"mobile\":\"03224512869\",\"rsvp\":true,\"partstat\":\"NOT-ACCEPTED\",\"role\":\"REQ-PARTICIPANT\",\"cutype\":\"GROUP\"}', NULL, '2025-05-21 11:40:23', '2025-05-21 11:40:23', 3),
(7, 3, '46805b06-939a-47f5-a59d-9ea7d915581f', NULL, NULL, NULL, 0, NULL, '{\"name\":\"Tahir 123\",\"email\":\"tahir123@kodxsystem.com\",\"mobile\":\"07378492258\",\"rsvp\":true,\"partstat\":\"NOT-ACCEPTED\",\"role\":\"REQ-PARTICIPANT\",\"cutype\":\"GROUP\"}', NULL, '2025-05-21 11:40:23', '2025-05-21 11:40:23', 4),
(8, 4, '05a4673c-b8a1-4b4a-a6c4-07eb880d31fb', NULL, NULL, NULL, 1, '2025-05-27 09:22:05', '{\"name\":\"Tahir Amjad\",\"email\":\"tahir@kodxsystem.com\",\"mobile\":\"07378492257\",\"rsvp\":true,\"partstat\":\"NOT-ACCEPTED\",\"role\":\"REQ-PARTICIPANT\",\"cutype\":\"GROUP\"}', NULL, '2025-05-21 12:55:17', '2025-05-27 09:22:04', 1),
(9, 4, '05a4673c-b8a1-4b4a-a6c4-07eb880d31fb', NULL, NULL, NULL, 0, NULL, '{\"name\":\"MUHAMMAD TAHIR\",\"email\":\"tahiramjad79@gmail.com\",\"mobile\":\"03224512868\",\"rsvp\":true,\"partstat\":\"NOT-ACCEPTED\",\"role\":\"REQ-PARTICIPANT\",\"cutype\":\"GROUP\"}', NULL, '2025-05-21 12:55:17', '2025-05-21 12:55:17', 2),
(10, 4, '05a4673c-b8a1-4b4a-a6c4-07eb880d31fb', NULL, NULL, NULL, 0, NULL, '{\"name\":\"Tahir 321\",\"email\":\"tahir123@gmail.com\",\"mobile\":\"03224512869\",\"rsvp\":true,\"partstat\":\"NOT-ACCEPTED\",\"role\":\"REQ-PARTICIPANT\",\"cutype\":\"GROUP\"}', NULL, '2025-05-21 12:55:17', '2025-05-21 12:55:17', 3),
(11, 4, '05a4673c-b8a1-4b4a-a6c4-07eb880d31fb', NULL, NULL, NULL, 0, NULL, '{\"name\":\"Tahir 123\",\"email\":\"tahir123@kodxsystem.com\",\"mobile\":\"07378492258\",\"rsvp\":true,\"partstat\":\"NOT-ACCEPTED\",\"role\":\"REQ-PARTICIPANT\",\"cutype\":\"GROUP\"}', NULL, '2025-05-21 12:55:17', '2025-05-21 12:55:17', 4),
(12, 5, 'c685b60f-30b5-43c9-ba99-cb68d58789c3', NULL, NULL, NULL, 1, '2025-05-27 09:22:05', '{\"name\":\"Tahir Amjad\",\"email\":\"tahir@kodxsystem.com\",\"mobile\":\"07378492257\",\"rsvp\":true,\"partstat\":\"NOT-ACCEPTED\",\"role\":\"REQ-PARTICIPANT\",\"cutype\":\"GROUP\"}', NULL, '2025-05-21 13:00:59', '2025-05-27 09:22:04', 1),
(13, 5, 'c685b60f-30b5-43c9-ba99-cb68d58789c3', NULL, NULL, NULL, 0, NULL, '{\"name\":\"MUHAMMAD TAHIR\",\"email\":\"tahiramjad79@gmail.com\",\"mobile\":\"03224512868\",\"rsvp\":true,\"partstat\":\"NOT-ACCEPTED\",\"role\":\"REQ-PARTICIPANT\",\"cutype\":\"GROUP\"}', NULL, '2025-05-21 13:00:59', '2025-05-21 13:00:59', 2),
(14, 5, 'c685b60f-30b5-43c9-ba99-cb68d58789c3', NULL, NULL, NULL, 0, NULL, '{\"name\":\"Tahir 321\",\"email\":\"tahir123@gmail.com\",\"mobile\":\"03224512869\",\"rsvp\":true,\"partstat\":\"NOT-ACCEPTED\",\"role\":\"REQ-PARTICIPANT\",\"cutype\":\"GROUP\"}', NULL, '2025-05-21 13:00:59', '2025-05-21 13:00:59', 3),
(15, 5, 'c685b60f-30b5-43c9-ba99-cb68d58789c3', NULL, NULL, NULL, 0, NULL, '{\"name\":\"Tahir 123\",\"email\":\"tahir123@kodxsystem.com\",\"mobile\":\"07378492258\",\"rsvp\":true,\"partstat\":\"NOT-ACCEPTED\",\"role\":\"REQ-PARTICIPANT\",\"cutype\":\"GROUP\"}', NULL, '2025-05-21 13:00:59', '2025-05-21 13:00:59', 4),
(16, 6, 'b2638bb4-b0e0-4339-811c-d1be7f981f1d', NULL, NULL, NULL, 1, '2025-05-27 09:22:05', '{\"name\":\"Tahir Amjad\",\"email\":\"tahir@kodxsystem.com\",\"mobile\":\"07378492257\",\"rsvp\":true,\"partstat\":\"NOT-ACCEPTED\",\"role\":\"REQ-PARTICIPANT\",\"cutype\":\"GROUP\"}', NULL, '2025-05-21 13:29:12', '2025-05-27 09:22:04', 1),
(17, 6, 'b2638bb4-b0e0-4339-811c-d1be7f981f1d', NULL, NULL, NULL, 0, NULL, '{\"name\":\"MUHAMMAD TAHIR\",\"email\":\"tahiramjad79@gmail.com\",\"mobile\":\"03224512868\",\"rsvp\":true,\"partstat\":\"NOT-ACCEPTED\",\"role\":\"REQ-PARTICIPANT\",\"cutype\":\"GROUP\"}', NULL, '2025-05-21 13:29:12', '2025-05-21 13:29:12', 2),
(18, 6, 'b2638bb4-b0e0-4339-811c-d1be7f981f1d', NULL, NULL, NULL, 0, NULL, '{\"name\":\"Tahir 321\",\"email\":\"tahir123@gmail.com\",\"mobile\":\"03224512869\",\"rsvp\":true,\"partstat\":\"NOT-ACCEPTED\",\"role\":\"REQ-PARTICIPANT\",\"cutype\":\"GROUP\"}', NULL, '2025-05-21 13:29:12', '2025-05-21 13:29:12', 3),
(19, 6, 'b2638bb4-b0e0-4339-811c-d1be7f981f1d', NULL, NULL, NULL, 0, NULL, '{\"name\":\"Tahir 123\",\"email\":\"tahir123@kodxsystem.com\",\"mobile\":\"07378492258\",\"rsvp\":true,\"partstat\":\"NOT-ACCEPTED\",\"role\":\"REQ-PARTICIPANT\",\"cutype\":\"GROUP\"}', NULL, '2025-05-21 13:29:12', '2025-05-21 13:29:12', 4),
(20, 7, '98c0fffd-4a1e-4976-9ca1-5d2ab70245f6', NULL, NULL, NULL, 1, '2025-05-27 09:22:05', '{\"name\":\"Tahir Amjad\",\"email\":\"tahir@kodxsystem.com\",\"mobile\":\"07378492257\",\"rsvp\":true,\"partstat\":\"NOT-ACCEPTED\",\"role\":\"REQ-PARTICIPANT\",\"cutype\":\"GROUP\"}', NULL, '2025-05-21 13:32:31', '2025-05-27 09:22:04', 1),
(21, 7, '98c0fffd-4a1e-4976-9ca1-5d2ab70245f6', NULL, NULL, NULL, 0, NULL, '{\"name\":\"MUHAMMAD TAHIR\",\"email\":\"tahiramjad79@gmail.com\",\"mobile\":\"03224512868\",\"rsvp\":true,\"partstat\":\"NOT-ACCEPTED\",\"role\":\"REQ-PARTICIPANT\",\"cutype\":\"GROUP\"}', NULL, '2025-05-21 13:32:31', '2025-05-21 13:32:31', 2),
(22, 7, '98c0fffd-4a1e-4976-9ca1-5d2ab70245f6', NULL, NULL, NULL, 0, NULL, '{\"name\":\"Tahir 321\",\"email\":\"tahir123@gmail.com\",\"mobile\":\"03224512869\",\"rsvp\":true,\"partstat\":\"NOT-ACCEPTED\",\"role\":\"REQ-PARTICIPANT\",\"cutype\":\"GROUP\"}', NULL, '2025-05-21 13:32:31', '2025-05-21 13:32:31', 3),
(23, 7, '98c0fffd-4a1e-4976-9ca1-5d2ab70245f6', NULL, NULL, NULL, 0, NULL, '{\"name\":\"Tahir 123\",\"email\":\"tahir123@kodxsystem.com\",\"mobile\":\"07378492258\",\"rsvp\":true,\"partstat\":\"NOT-ACCEPTED\",\"role\":\"REQ-PARTICIPANT\",\"cutype\":\"GROUP\"}', NULL, '2025-05-21 13:32:31', '2025-05-21 13:32:31', 4),
(24, 8, '43f5fb6a-7916-4a57-9f8a-ea12535ff4ad', NULL, NULL, NULL, 1, '2025-05-27 09:22:05', '{\"name\":\"Tahir Amjad\",\"email\":\"tahir@kodxsystem.com\",\"mobile\":\"07378492257\",\"rsvp\":true,\"partstat\":\"NOT-ACCEPTED\",\"role\":\"REQ-PARTICIPANT\",\"cutype\":\"GROUP\"}', NULL, '2025-05-21 14:03:44', '2025-05-27 09:22:04', 1),
(25, 8, '43f5fb6a-7916-4a57-9f8a-ea12535ff4ad', NULL, NULL, NULL, 0, NULL, '{\"name\":\"MUHAMMAD TAHIR\",\"email\":\"tahiramjad79@gmail.com\",\"mobile\":\"03224512868\",\"rsvp\":true,\"partstat\":\"NOT-ACCEPTED\",\"role\":\"REQ-PARTICIPANT\",\"cutype\":\"GROUP\"}', NULL, '2025-05-21 14:03:44', '2025-05-21 14:03:44', 2),
(26, 8, '43f5fb6a-7916-4a57-9f8a-ea12535ff4ad', NULL, NULL, NULL, 0, NULL, '{\"name\":\"Tahir 321\",\"email\":\"tahir123@gmail.com\",\"mobile\":\"03224512869\",\"rsvp\":true,\"partstat\":\"NOT-ACCEPTED\",\"role\":\"REQ-PARTICIPANT\",\"cutype\":\"GROUP\"}', NULL, '2025-05-21 14:03:44', '2025-05-21 14:03:44', 3),
(27, 8, '43f5fb6a-7916-4a57-9f8a-ea12535ff4ad', NULL, NULL, NULL, 0, NULL, '{\"name\":\"Tahir 123\",\"email\":\"tahir123@kodxsystem.com\",\"mobile\":\"07378492258\",\"rsvp\":true,\"partstat\":\"NOT-ACCEPTED\",\"role\":\"REQ-PARTICIPANT\",\"cutype\":\"GROUP\"}', NULL, '2025-05-21 14:03:44', '2025-05-21 14:03:44', 4),
(28, 9, '9a8c1cf5-de79-4752-bd5b-01d05092c5e0', NULL, NULL, NULL, 1, '2025-05-27 09:22:05', '{\"name\":\"Tahir Amjad\",\"email\":\"tahir@kodxsystem.com\",\"mobile\":\"07378492257\",\"rsvp\":true,\"partstat\":\"NOT-ACCEPTED\",\"role\":\"REQ-PARTICIPANT\",\"cutype\":\"GROUP\"}', NULL, '2025-05-21 14:04:49', '2025-05-27 09:22:04', 1),
(29, 9, '9a8c1cf5-de79-4752-bd5b-01d05092c5e0', NULL, NULL, NULL, 0, NULL, '{\"name\":\"MUHAMMAD TAHIR\",\"email\":\"tahiramjad79@gmail.com\",\"mobile\":\"03224512868\",\"rsvp\":true,\"partstat\":\"NOT-ACCEPTED\",\"role\":\"REQ-PARTICIPANT\",\"cutype\":\"GROUP\"}', NULL, '2025-05-21 14:04:49', '2025-05-21 14:04:49', 2),
(30, 9, '9a8c1cf5-de79-4752-bd5b-01d05092c5e0', NULL, NULL, NULL, 0, NULL, '{\"name\":\"Tahir 321\",\"email\":\"tahir123@gmail.com\",\"mobile\":\"03224512869\",\"rsvp\":true,\"partstat\":\"NOT-ACCEPTED\",\"role\":\"REQ-PARTICIPANT\",\"cutype\":\"GROUP\"}', NULL, '2025-05-21 14:04:49', '2025-05-21 14:04:49', 3),
(31, 9, '9a8c1cf5-de79-4752-bd5b-01d05092c5e0', NULL, NULL, NULL, 0, NULL, '{\"name\":\"Tahir 123\",\"email\":\"tahir123@kodxsystem.com\",\"mobile\":\"07378492258\",\"rsvp\":true,\"partstat\":\"NOT-ACCEPTED\",\"role\":\"REQ-PARTICIPANT\",\"cutype\":\"GROUP\"}', NULL, '2025-05-21 14:04:49', '2025-05-21 14:04:49', 4);

-- --------------------------------------------------------

--
-- Table structure for table `event_time_slots`
--

CREATE TABLE `event_time_slots` (
  `id` int NOT NULL,
  `event_id` int NOT NULL,
  `slot_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `startDate` date DEFAULT NULL,
  `endDate` date DEFAULT NULL,
  `startTime` time DEFAULT NULL,
  `endTime` time DEFAULT NULL,
  `weekdays` json DEFAULT NULL,
  `type` enum('1','2') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `event_time_slots`
--

INSERT INTO `event_time_slots` (`id`, `event_id`, `slot_name`, `startDate`, `endDate`, `startTime`, `endTime`, `weekdays`, `type`) VALUES
(1, 1, 'KodX-1', '2025-05-19', '2025-05-19', '12:00:00', '13:00:00', '[]', '1'),
(2, 1, '', NULL, NULL, NULL, NULL, '[]', '2'),
(3, 2, 'KodX-2', '2025-05-19', '2025-05-19', '12:00:00', '13:01:00', '[]', '1'),
(4, 2, '', NULL, NULL, NULL, NULL, '[]', '2'),
(5, 3, 'KodX-3', '2025-05-21', '2025-05-21', '12:00:00', '13:00:00', '[]', '1'),
(6, 3, '', NULL, NULL, NULL, NULL, '[]', '2'),
(7, 4, 'KodX-4', '2025-05-10', '2025-05-30', '12:00:00', '13:00:00', '[]', '1'),
(8, 4, '', NULL, NULL, NULL, NULL, '[]', '2'),
(9, 5, 'KodX-4', '2025-05-10', '2025-05-30', '12:00:00', '13:00:00', '[]', '1'),
(10, 5, '', NULL, NULL, NULL, NULL, '[]', '2'),
(11, 6, 'KodX-3', '2025-05-10', '2025-05-30', '12:00:00', '13:00:00', '[]', '1'),
(12, 6, '', NULL, NULL, NULL, NULL, '[]', '2'),
(13, 7, 'KodX-8', '2025-05-21', '2025-05-21', '12:00:00', '13:00:00', '[]', '1'),
(14, 7, '', NULL, NULL, NULL, NULL, '[]', '2'),
(15, 8, 'KodX-4', '2025-05-10', '2025-05-30', '12:00:00', '13:00:00', '[]', '1'),
(16, 8, '', NULL, NULL, NULL, NULL, '[]', '2'),
(17, 9, 'KodX-9', '2025-05-21', '2025-05-21', '12:00:00', '13:00:00', '[]', '1'),
(18, 9, '', NULL, NULL, NULL, NULL, '[]', '2');

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

CREATE TABLE `invoices` (
  `id` int NOT NULL,
  `invoice_number` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_id` int NOT NULL,
  `teacher_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `student_id` int NOT NULL,
  `family_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `total_amount` double NOT NULL,
  `location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pdf_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `logo_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `invoice_instruction_type` enum('batch-this-alone','batch-with-another-class','batch-by-family','batch-by-family-with-another-class') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `UCID` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `invoices`
--

INSERT INTO `invoices` (`id`, `invoice_number`, `event_id`, `teacher_id`, `student_id`, `family_id`, `total_amount`, `location`, `pdf_path`, `logo_path`, `invoice_instruction_type`, `created_at`, `updated_at`, `UCID`) VALUES
(1, '559194', 3, '1', 1, NULL, 0, '', '/uploads/invoices/05-2025/559194.pdf', NULL, 'batch-this-alone', '2025-05-21 11:44:41', '2025-05-21 11:44:47', NULL),
(2, '206113', 3, '1', 2, NULL, 0, '', '/uploads/invoices/05-2025/206113.pdf', NULL, 'batch-this-alone', '2025-05-21 11:44:41', '2025-05-21 11:44:51', NULL),
(3, '669802', 3, '1', 3, NULL, 0, '', '/uploads/invoices/05-2025/669802.pdf', NULL, 'batch-this-alone', '2025-05-21 11:44:41', '2025-05-21 11:44:53', NULL),
(4, '279084', 3, '1', 4, NULL, 0, '', '/uploads/invoices/05-2025/279084.pdf', NULL, 'batch-this-alone', '2025-05-21 11:44:41', '2025-05-21 11:44:55', NULL),
(5, '496012', 3, '1', 1, NULL, 0, '', '/uploads/invoices/05-2025/496012.pdf', NULL, 'batch-this-alone', '2025-05-21 11:50:32', '2025-05-21 11:50:36', NULL),
(6, '746285', 3, '1', 2, NULL, 0, '', '/uploads/invoices/05-2025/746285.pdf', NULL, 'batch-this-alone', '2025-05-21 11:50:32', '2025-05-21 11:50:37', NULL),
(7, '868131', 3, '1', 3, NULL, 0, '', '/uploads/invoices/05-2025/868131.pdf', NULL, 'batch-this-alone', '2025-05-21 11:50:32', '2025-05-21 11:50:39', NULL),
(8, '334464', 3, '1', 4, NULL, 0, '', '/uploads/invoices/05-2025/334464.pdf', NULL, 'batch-this-alone', '2025-05-21 11:50:32', '2025-05-21 11:50:41', NULL),
(9, '644799', 3, '1', 1, NULL, 0, '', '/uploads/invoices/05-2025/644799.pdf', NULL, 'batch-this-alone', '2025-05-21 11:50:55', '2025-05-21 11:50:59', NULL),
(10, '563349', 3, '1', 2, NULL, 0, '', '/uploads/invoices/05-2025/563349.pdf', NULL, 'batch-this-alone', '2025-05-21 11:50:55', '2025-05-21 11:51:01', NULL),
(11, '804662', 3, '1', 3, NULL, 0, '', '/uploads/invoices/05-2025/804662.pdf', NULL, 'batch-this-alone', '2025-05-21 11:50:55', '2025-05-21 11:51:04', NULL),
(12, '555843', 3, '1', 4, NULL, 0, '', '/uploads/invoices/05-2025/555843.pdf', NULL, 'batch-this-alone', '2025-05-21 11:50:55', '2025-05-21 11:51:08', NULL),
(13, '999769', 3, '1', 1, NULL, 0, '', '/uploads/invoices/05-2025/999769.pdf', NULL, 'batch-this-alone', '2025-05-21 11:52:40', '2025-05-21 11:52:43', NULL),
(14, '996218', 3, '1', 2, NULL, 0, '', '/uploads/invoices/05-2025/996218.pdf', NULL, 'batch-this-alone', '2025-05-21 11:52:40', '2025-05-21 11:52:45', NULL),
(15, '153804', 3, '1', 3, NULL, 0, '', '/uploads/invoices/05-2025/153804.pdf', NULL, 'batch-this-alone', '2025-05-21 11:52:40', '2025-05-21 11:52:48', NULL),
(16, '948861', 3, '1', 4, NULL, 0, '', '/uploads/invoices/05-2025/948861.pdf', NULL, 'batch-this-alone', '2025-05-21 11:52:40', '2025-05-21 11:52:50', NULL),
(17, '728583', 3, '1', 1, NULL, 0, '', '/uploads/invoices/05-2025/728583.pdf', NULL, 'batch-this-alone', '2025-05-21 11:54:48', '2025-05-21 11:54:50', NULL),
(18, '742200', 3, '1', 2, NULL, 0, '', '/uploads/invoices/05-2025/742200.pdf', NULL, 'batch-this-alone', '2025-05-21 11:54:48', '2025-05-21 11:54:56', NULL),
(19, '812663', 3, '1', 3, NULL, 0, '', '/uploads/invoices/05-2025/812663.pdf', NULL, 'batch-this-alone', '2025-05-21 11:54:48', '2025-05-21 11:54:57', NULL),
(20, '379550', 3, '1', 4, NULL, 0, '', '/uploads/invoices/05-2025/379550.pdf', NULL, 'batch-this-alone', '2025-05-21 11:54:48', '2025-05-21 11:55:00', NULL),
(21, '964626', 3, '1', 1, NULL, 0, '', '/uploads/invoices/05-2025/964626.pdf', NULL, 'batch-this-alone', '2025-05-21 11:55:43', '2025-05-21 11:55:45', NULL),
(22, '853444', 3, '1', 2, NULL, 0, '', '/uploads/invoices/05-2025/853444.pdf', NULL, 'batch-this-alone', '2025-05-21 11:55:43', '2025-05-21 11:55:47', NULL),
(23, '718463', 3, '1', 3, NULL, 0, '', '/uploads/invoices/05-2025/718463.pdf', NULL, 'batch-this-alone', '2025-05-21 11:55:43', '2025-05-21 11:55:49', NULL),
(24, '246815', 3, '1', 4, NULL, 0, '', '/uploads/invoices/05-2025/246815.pdf', NULL, 'batch-this-alone', '2025-05-21 11:55:43', '2025-05-21 11:55:51', NULL),
(25, '485135', 3, '1', 1, NULL, 0, '', '/uploads/invoices/05-2025/485135.pdf', NULL, 'batch-this-alone', '2025-05-21 12:54:18', '2025-05-21 12:54:21', NULL),
(26, '612985', 3, '1', 2, NULL, 0, '', '/uploads/invoices/05-2025/612985.pdf', NULL, 'batch-this-alone', '2025-05-21 12:54:18', '2025-05-21 12:54:23', NULL),
(27, '773274', 3, '1', 3, NULL, 0, '', '/uploads/invoices/05-2025/773274.pdf', NULL, 'batch-this-alone', '2025-05-21 12:54:18', '2025-05-21 12:54:25', NULL),
(28, '855866', 3, '1', 4, NULL, 0, '', '/uploads/invoices/05-2025/855866.pdf', NULL, 'batch-this-alone', '2025-05-21 12:54:18', '2025-05-21 12:54:27', NULL),
(29, '979744', 4, '1', 1, NULL, 2000, 'Lahore, , , Punjab, Pakistan', '/uploads/invoices/05-2025/979744.pdf', NULL, 'batch-this-alone', '2025-05-21 12:55:24', '2025-05-21 12:55:28', NULL),
(30, '348233', 4, '1', 2, NULL, 2000, 'Lahore, , , Punjab, Pakistan', '/uploads/invoices/05-2025/348233.pdf', NULL, 'batch-this-alone', '2025-05-21 12:55:24', '2025-05-21 12:55:30', NULL),
(31, '832781', 4, '1', 3, NULL, 2000, 'Lahore, , , Punjab, Pakistan', '/uploads/invoices/05-2025/832781.pdf', NULL, 'batch-this-alone', '2025-05-21 12:55:24', '2025-05-21 12:55:31', NULL),
(32, '127250', 4, '1', 4, NULL, 2000, 'Lahore, , , Punjab, Pakistan', '/uploads/invoices/05-2025/127250.pdf', NULL, 'batch-this-alone', '2025-05-21 12:55:24', '2025-05-21 12:55:33', NULL),
(33, '594868', 5, '1', 1, NULL, 10000, 'Lahore, , , Punjab, Pakistan', '/uploads/invoices/05-2025/594868.pdf', NULL, 'batch-by-family', '2025-05-21 13:01:19', '2025-05-21 13:01:22', NULL),
(34, '345576', 5, '1', 2, NULL, 10000, 'Lahore, , , Punjab, Pakistan', '/uploads/invoices/05-2025/345576.pdf', NULL, 'batch-by-family', '2025-05-21 13:01:19', '2025-05-21 13:01:23', NULL),
(35, '213108', 5, '1', 3, NULL, 10000, 'Lahore, , , Punjab, Pakistan', '/uploads/invoices/05-2025/213108.pdf', NULL, 'batch-by-family', '2025-05-21 13:01:19', '2025-05-21 13:01:26', NULL),
(36, '298179', 5, '1', 4, NULL, 10000, 'Lahore, , , Punjab, Pakistan', '/uploads/invoices/05-2025/298179.pdf', NULL, 'batch-by-family', '2025-05-21 13:01:19', '2025-05-21 13:01:29', NULL),
(37, '244066', 6, '1', 1, NULL, 2000, 'Lahore, , , Punjab, Pakistan', '/uploads/invoices/05-2025/244066.pdf', NULL, 'batch-this-alone', '2025-05-21 13:31:21', '2025-05-21 13:31:25', NULL),
(38, '631815', 6, '1', 2, NULL, 2000, 'Lahore, , , Punjab, Pakistan', '/uploads/invoices/05-2025/631815.pdf', NULL, 'batch-this-alone', '2025-05-21 13:31:21', '2025-05-21 13:31:28', NULL),
(39, '935165', 6, '1', 3, NULL, 2000, 'Lahore, , , Punjab, Pakistan', '/uploads/invoices/05-2025/935165.pdf', NULL, 'batch-this-alone', '2025-05-21 13:31:21', '2025-05-21 13:31:30', NULL),
(40, '977098', 6, '1', 4, NULL, 2000, 'Lahore, , , Punjab, Pakistan', '/uploads/invoices/05-2025/977098.pdf', NULL, 'batch-this-alone', '2025-05-21 13:31:21', '2025-05-21 13:31:32', NULL),
(41, '825219', 7, '1', 1, NULL, 0, 'Lahore, , , Punjab, Pakistan', '/uploads/invoices/05-2025/825219.pdf', NULL, 'batch-this-alone', '2025-05-21 13:32:54', '2025-05-21 13:32:58', NULL),
(42, '889384', 7, '1', 2, NULL, 0, 'Lahore, , , Punjab, Pakistan', '/uploads/invoices/05-2025/889384.pdf', NULL, 'batch-this-alone', '2025-05-21 13:32:54', '2025-05-21 13:33:00', NULL),
(43, '315582', 7, '1', 3, NULL, 0, 'Lahore, , , Punjab, Pakistan', '/uploads/invoices/05-2025/315582.pdf', NULL, 'batch-this-alone', '2025-05-21 13:32:54', '2025-05-21 13:33:02', NULL),
(44, '625329', 7, '1', 4, NULL, 0, 'Lahore, , , Punjab, Pakistan', '/uploads/invoices/05-2025/625329.pdf', NULL, 'batch-this-alone', '2025-05-21 13:32:54', '2025-05-21 13:33:04', NULL),
(45, '679352', 7, '1', 1, NULL, 0, 'Lahore, , , Punjab, Pakistan', '/uploads/invoices/05-2025/679352.pdf', NULL, 'batch-this-alone', '2025-05-21 13:37:43', '2025-05-21 13:37:46', NULL),
(46, '782693', 7, '1', 2, NULL, 0, 'Lahore, , , Punjab, Pakistan', '/uploads/invoices/05-2025/782693.pdf', NULL, 'batch-this-alone', '2025-05-21 13:37:43', '2025-05-21 13:37:48', NULL),
(47, '956183', 7, '1', 3, NULL, 0, 'Lahore, , , Punjab, Pakistan', '/uploads/invoices/05-2025/956183.pdf', NULL, 'batch-this-alone', '2025-05-21 13:37:43', '2025-05-21 13:37:51', NULL),
(48, '403879', 7, '1', 4, NULL, 0, 'Lahore, , , Punjab, Pakistan', '/uploads/invoices/05-2025/403879.pdf', NULL, 'batch-this-alone', '2025-05-21 13:37:43', '2025-05-21 13:37:53', NULL),
(49, '477047', 7, '1', 1, NULL, 0, 'Lahore, , , Punjab, Pakistan', '/uploads/invoices/05-2025/477047.pdf', NULL, 'batch-this-alone', '2025-05-21 13:48:03', '2025-05-21 13:48:06', NULL),
(50, '591317', 7, '1', 2, NULL, 0, 'Lahore, , , Punjab, Pakistan', '/uploads/invoices/05-2025/591317.pdf', NULL, 'batch-this-alone', '2025-05-21 13:48:03', '2025-05-21 13:48:09', NULL),
(51, '396296', 7, '1', 3, NULL, 0, 'Lahore, , , Punjab, Pakistan', '/uploads/invoices/05-2025/396296.pdf', NULL, 'batch-this-alone', '2025-05-21 13:48:03', '2025-05-21 13:48:12', NULL),
(52, '754711', 7, '1', 4, NULL, 0, 'Lahore, , , Punjab, Pakistan', '/uploads/invoices/05-2025/754711.pdf', NULL, 'batch-this-alone', '2025-05-21 13:48:03', '2025-05-21 13:48:15', NULL),
(53, '389323', 7, '1', 1, NULL, 0, 'Lahore, , , Punjab, Pakistan', '/uploads/invoices/05-2025/389323.pdf', NULL, 'batch-this-alone', '2025-05-21 13:53:38', '2025-05-21 13:53:41', NULL),
(54, '632698', 7, '1', 2, NULL, 0, 'Lahore, , , Punjab, Pakistan', '/uploads/invoices/05-2025/632698.pdf', NULL, 'batch-this-alone', '2025-05-21 13:53:38', '2025-05-21 13:53:43', NULL),
(55, '324220', 7, '1', 3, NULL, 0, 'Lahore, , , Punjab, Pakistan', '/uploads/invoices/05-2025/324220.pdf', NULL, 'batch-this-alone', '2025-05-21 13:53:38', '2025-05-21 13:53:46', NULL),
(56, '338754', 7, '1', 4, NULL, 0, 'Lahore, , , Punjab, Pakistan', '/uploads/invoices/05-2025/338754.pdf', NULL, 'batch-this-alone', '2025-05-21 13:53:38', '2025-05-21 13:53:47', NULL),
(57, '181227', 7, '1', 1, NULL, 0, 'Lahore, , , Punjab, Pakistan', '/uploads/invoices/05-2025/181227.pdf', NULL, 'batch-this-alone', '2025-05-21 13:58:15', '2025-05-21 13:58:19', NULL),
(58, '245012', 7, '1', 2, NULL, 0, 'Lahore, , , Punjab, Pakistan', '/uploads/invoices/05-2025/245012.pdf', NULL, 'batch-this-alone', '2025-05-21 13:58:15', '2025-05-21 13:58:23', NULL),
(59, '370054', 7, '1', 3, NULL, 0, 'Lahore, , , Punjab, Pakistan', '/uploads/invoices/05-2025/370054.pdf', NULL, 'batch-this-alone', '2025-05-21 13:58:15', '2025-05-21 13:58:25', NULL),
(60, '185216', 7, '1', 4, NULL, 0, 'Lahore, , , Punjab, Pakistan', '/uploads/invoices/05-2025/185216.pdf', NULL, 'batch-this-alone', '2025-05-21 13:58:15', '2025-05-21 13:58:28', NULL),
(61, '216051', 7, '1', 1, NULL, 0, 'Lahore, , , Punjab, Pakistan', '/uploads/invoices/05-2025/216051.pdf', NULL, 'batch-this-alone', '2025-05-21 13:59:49', '2025-05-21 13:59:54', NULL),
(62, '783054', 7, '1', 2, NULL, 0, 'Lahore, , , Punjab, Pakistan', '/uploads/invoices/05-2025/783054.pdf', NULL, 'batch-this-alone', '2025-05-21 13:59:49', '2025-05-21 13:59:56', NULL),
(63, '297518', 7, '1', 3, NULL, 0, 'Lahore, , , Punjab, Pakistan', '/uploads/invoices/05-2025/297518.pdf', NULL, 'batch-this-alone', '2025-05-21 13:59:49', '2025-05-21 13:59:59', NULL),
(64, '290159', 7, '1', 4, NULL, 0, 'Lahore, , , Punjab, Pakistan', '/uploads/invoices/05-2025/290159.pdf', NULL, 'batch-this-alone', '2025-05-21 13:59:49', '2025-05-21 14:00:03', NULL),
(65, '956979', 7, '1', 1, NULL, 0, 'Lahore, , , Punjab, Pakistan', '/uploads/invoices/05-2025/956979.pdf', NULL, 'batch-this-alone', '2025-05-21 14:02:48', '2025-05-21 14:02:55', NULL),
(66, '388342', 7, '1', 2, NULL, 0, 'Lahore, , , Punjab, Pakistan', '/uploads/invoices/05-2025/388342.pdf', NULL, 'batch-this-alone', '2025-05-21 14:02:48', '2025-05-21 14:02:58', NULL),
(67, '665556', 7, '1', 3, NULL, 0, 'Lahore, , , Punjab, Pakistan', '/uploads/invoices/05-2025/665556.pdf', NULL, 'batch-this-alone', '2025-05-21 14:02:48', '2025-05-21 14:03:00', NULL),
(68, '675084', 7, '1', 4, NULL, 0, 'Lahore, , , Punjab, Pakistan', '/uploads/invoices/05-2025/675084.pdf', NULL, 'batch-this-alone', '2025-05-21 14:02:48', '2025-05-21 14:03:03', NULL),
(69, '556858', 8, '1', 1, NULL, 2000, 'Lahore, , , Punjab, Pakistan', '/uploads/invoices/05-2025/556858.pdf', NULL, 'batch-this-alone', '2025-05-21 14:03:52', '2025-05-21 14:03:56', NULL),
(70, '415561', 8, '1', 2, NULL, 2000, 'Lahore, , , Punjab, Pakistan', '/uploads/invoices/05-2025/415561.pdf', NULL, 'batch-this-alone', '2025-05-21 14:03:52', '2025-05-21 14:03:58', NULL),
(71, '596158', 8, '1', 3, NULL, 2000, 'Lahore, , , Punjab, Pakistan', '/uploads/invoices/05-2025/596158.pdf', NULL, 'batch-this-alone', '2025-05-21 14:03:52', '2025-05-21 14:04:03', NULL),
(72, '929631', 8, '1', 4, NULL, 2000, 'Lahore, , , Punjab, Pakistan', '/uploads/invoices/05-2025/929631.pdf', NULL, 'batch-this-alone', '2025-05-21 14:03:52', '2025-05-21 14:04:06', NULL),
(73, '892669', 9, '1', 1, NULL, 0, 'Lahore, , , Punjab, Pakistan', '/uploads/invoices/05-2025/892669.pdf', NULL, 'batch-this-alone', '2025-05-21 14:05:07', '2025-05-21 14:05:11', NULL),
(74, '879544', 9, '1', 2, NULL, 0, 'Lahore, , , Punjab, Pakistan', '/uploads/invoices/05-2025/879544.pdf', NULL, 'batch-this-alone', '2025-05-21 14:05:07', '2025-05-21 14:05:13', NULL),
(75, '828995', 9, '1', 3, NULL, 0, 'Lahore, , , Punjab, Pakistan', '/uploads/invoices/05-2025/828995.pdf', NULL, 'batch-this-alone', '2025-05-21 14:05:07', '2025-05-21 14:05:15', NULL),
(76, '296174', 9, '1', 4, NULL, 0, 'Lahore, , , Punjab, Pakistan', '/uploads/invoices/05-2025/296174.pdf', NULL, 'batch-this-alone', '2025-05-21 14:05:07', '2025-05-21 14:05:16', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `invoice_items`
--

CREATE TABLE `invoice_items` (
  `id` int NOT NULL,
  `invoice_id` int NOT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `quantity` int NOT NULL,
  `unit_price` double NOT NULL,
  `total_amount` double NOT NULL,
  `item_type` enum('one-time-fee','total-class-count','bill-per-class','bill-per-month','bill-all-in-advance') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_id` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `invoice_items`
--

INSERT INTO `invoice_items` (`id`, `invoice_id`, `description`, `quantity`, `unit_price`, `total_amount`, `item_type`, `created_at`, `updated_id`) VALUES
(1, 1, NULL, 1, 100, 0, 'one-time-fee', '2025-05-21 11:44:41', '2025-05-21 11:44:41'),
(2, 2, NULL, 1, 100, 0, 'one-time-fee', '2025-05-21 11:44:41', '2025-05-21 11:44:41'),
(3, 3, NULL, 1, 100, 0, 'one-time-fee', '2025-05-21 11:44:41', '2025-05-21 11:44:41'),
(4, 4, NULL, 1, 100, 0, 'one-time-fee', '2025-05-21 11:44:41', '2025-05-21 11:44:41'),
(5, 5, NULL, 1, 100, 0, 'one-time-fee', '2025-05-21 11:50:32', '2025-05-21 11:50:32'),
(6, 6, NULL, 1, 100, 0, 'one-time-fee', '2025-05-21 11:50:32', '2025-05-21 11:50:32'),
(7, 7, NULL, 1, 100, 0, 'one-time-fee', '2025-05-21 11:50:32', '2025-05-21 11:50:32'),
(8, 8, NULL, 1, 100, 0, 'one-time-fee', '2025-05-21 11:50:32', '2025-05-21 11:50:32'),
(9, 9, NULL, 1, 100, 0, 'one-time-fee', '2025-05-21 11:50:55', '2025-05-21 11:50:55'),
(10, 10, NULL, 1, 100, 0, 'one-time-fee', '2025-05-21 11:50:55', '2025-05-21 11:50:55'),
(11, 11, NULL, 1, 100, 0, 'one-time-fee', '2025-05-21 11:50:55', '2025-05-21 11:50:55'),
(12, 12, NULL, 1, 100, 0, 'one-time-fee', '2025-05-21 11:50:55', '2025-05-21 11:50:55'),
(13, 13, NULL, 1, 100, 0, 'one-time-fee', '2025-05-21 11:52:40', '2025-05-21 11:52:40'),
(14, 14, NULL, 1, 100, 0, 'one-time-fee', '2025-05-21 11:52:40', '2025-05-21 11:52:40'),
(15, 15, NULL, 1, 100, 0, 'one-time-fee', '2025-05-21 11:52:40', '2025-05-21 11:52:40'),
(16, 16, NULL, 1, 100, 0, 'one-time-fee', '2025-05-21 11:52:40', '2025-05-21 11:52:40'),
(17, 17, NULL, 1, 100, 0, 'one-time-fee', '2025-05-21 11:54:48', '2025-05-21 11:54:48'),
(18, 18, NULL, 1, 100, 0, 'one-time-fee', '2025-05-21 11:54:48', '2025-05-21 11:54:48'),
(19, 19, NULL, 1, 100, 0, 'one-time-fee', '2025-05-21 11:54:48', '2025-05-21 11:54:48'),
(20, 20, NULL, 1, 100, 0, 'one-time-fee', '2025-05-21 11:54:48', '2025-05-21 11:54:48'),
(21, 21, NULL, 1, 100, 0, 'one-time-fee', '2025-05-21 11:55:43', '2025-05-21 11:55:43'),
(22, 22, NULL, 1, 100, 0, 'one-time-fee', '2025-05-21 11:55:43', '2025-05-21 11:55:43'),
(23, 23, NULL, 1, 100, 0, 'one-time-fee', '2025-05-21 11:55:43', '2025-05-21 11:55:43'),
(24, 24, NULL, 1, 100, 0, 'one-time-fee', '2025-05-21 11:55:43', '2025-05-21 11:55:43'),
(25, 25, NULL, 1, 100, 0, 'one-time-fee', '2025-05-21 12:54:18', '2025-05-21 12:54:18'),
(26, 26, NULL, 1, 100, 0, 'one-time-fee', '2025-05-21 12:54:18', '2025-05-21 12:54:18'),
(27, 27, NULL, 1, 100, 0, 'one-time-fee', '2025-05-21 12:54:18', '2025-05-21 12:54:18'),
(28, 28, NULL, 1, 100, 0, 'one-time-fee', '2025-05-21 12:54:18', '2025-05-21 12:54:18'),
(29, 29, NULL, 21, 100, 2000, 'one-time-fee', '2025-05-21 12:55:24', '2025-05-21 12:55:24'),
(30, 30, NULL, 21, 100, 2000, 'one-time-fee', '2025-05-21 12:55:24', '2025-05-21 12:55:24'),
(31, 31, NULL, 21, 100, 2000, 'one-time-fee', '2025-05-21 12:55:24', '2025-05-21 12:55:24'),
(32, 32, NULL, 21, 100, 2000, 'one-time-fee', '2025-05-21 12:55:24', '2025-05-21 12:55:24'),
(33, 33, NULL, 21, 500, 10000, 'total-class-count', '2025-05-21 13:01:19', '2025-05-21 13:01:19'),
(34, 34, NULL, 21, 500, 10000, 'total-class-count', '2025-05-21 13:01:19', '2025-05-21 13:01:19'),
(35, 35, NULL, 21, 500, 10000, 'total-class-count', '2025-05-21 13:01:19', '2025-05-21 13:01:19'),
(36, 36, NULL, 21, 500, 10000, 'total-class-count', '2025-05-21 13:01:19', '2025-05-21 13:01:19'),
(37, 37, NULL, 21, 100, 2000, 'one-time-fee', '2025-05-21 13:31:21', '2025-05-21 13:31:21'),
(38, 38, NULL, 21, 100, 2000, 'one-time-fee', '2025-05-21 13:31:21', '2025-05-21 13:31:21'),
(39, 39, NULL, 21, 100, 2000, 'one-time-fee', '2025-05-21 13:31:21', '2025-05-21 13:31:21'),
(40, 40, NULL, 21, 100, 2000, 'one-time-fee', '2025-05-21 13:31:21', '2025-05-21 13:31:21'),
(41, 41, NULL, 1, 100, 0, 'one-time-fee', '2025-05-21 13:32:54', '2025-05-21 13:32:54'),
(42, 42, NULL, 1, 100, 0, 'one-time-fee', '2025-05-21 13:32:54', '2025-05-21 13:32:54'),
(43, 43, NULL, 1, 100, 0, 'one-time-fee', '2025-05-21 13:32:54', '2025-05-21 13:32:54'),
(44, 44, NULL, 1, 100, 0, 'one-time-fee', '2025-05-21 13:32:54', '2025-05-21 13:32:54'),
(45, 45, NULL, 1, 100, 0, 'one-time-fee', '2025-05-21 13:37:43', '2025-05-21 13:37:43'),
(46, 46, NULL, 1, 100, 0, 'one-time-fee', '2025-05-21 13:37:43', '2025-05-21 13:37:43'),
(47, 47, NULL, 1, 100, 0, 'one-time-fee', '2025-05-21 13:37:43', '2025-05-21 13:37:43'),
(48, 48, NULL, 1, 100, 0, 'one-time-fee', '2025-05-21 13:37:43', '2025-05-21 13:37:43'),
(49, 49, NULL, 1, 100, 0, 'one-time-fee', '2025-05-21 13:48:03', '2025-05-21 13:48:03'),
(50, 50, NULL, 1, 100, 0, 'one-time-fee', '2025-05-21 13:48:03', '2025-05-21 13:48:03'),
(51, 51, NULL, 1, 100, 0, 'one-time-fee', '2025-05-21 13:48:03', '2025-05-21 13:48:03'),
(52, 52, NULL, 1, 100, 0, 'one-time-fee', '2025-05-21 13:48:03', '2025-05-21 13:48:03'),
(53, 53, NULL, 1, 100, 0, 'one-time-fee', '2025-05-21 13:53:38', '2025-05-21 13:53:38'),
(54, 54, NULL, 1, 100, 0, 'one-time-fee', '2025-05-21 13:53:38', '2025-05-21 13:53:38'),
(55, 55, NULL, 1, 100, 0, 'one-time-fee', '2025-05-21 13:53:38', '2025-05-21 13:53:38'),
(56, 56, NULL, 1, 100, 0, 'one-time-fee', '2025-05-21 13:53:38', '2025-05-21 13:53:38'),
(57, 57, NULL, 1, 100, 0, 'one-time-fee', '2025-05-21 13:58:15', '2025-05-21 13:58:15'),
(58, 58, NULL, 1, 100, 0, 'one-time-fee', '2025-05-21 13:58:15', '2025-05-21 13:58:15'),
(59, 59, NULL, 1, 100, 0, 'one-time-fee', '2025-05-21 13:58:15', '2025-05-21 13:58:15'),
(60, 60, NULL, 1, 100, 0, 'one-time-fee', '2025-05-21 13:58:15', '2025-05-21 13:58:15'),
(61, 61, NULL, 1, 100, 0, 'total-class-count', '2025-05-21 13:59:49', '2025-05-21 13:59:49'),
(62, 62, NULL, 1, 100, 0, 'total-class-count', '2025-05-21 13:59:49', '2025-05-21 13:59:49'),
(63, 63, NULL, 1, 100, 0, 'total-class-count', '2025-05-21 13:59:49', '2025-05-21 13:59:49'),
(64, 64, NULL, 1, 100, 0, 'total-class-count', '2025-05-21 13:59:49', '2025-05-21 13:59:49'),
(65, 65, NULL, 1, 100, 0, 'total-class-count', '2025-05-21 14:02:48', '2025-05-21 14:02:48'),
(66, 66, NULL, 1, 100, 0, 'total-class-count', '2025-05-21 14:02:48', '2025-05-21 14:02:48'),
(67, 67, NULL, 1, 100, 0, 'total-class-count', '2025-05-21 14:02:48', '2025-05-21 14:02:48'),
(68, 68, NULL, 1, 100, 0, 'total-class-count', '2025-05-21 14:02:48', '2025-05-21 14:02:48'),
(69, 69, NULL, 21, 100, 2000, 'total-class-count', '2025-05-21 14:03:52', '2025-05-21 14:03:52'),
(70, 70, NULL, 21, 100, 2000, 'total-class-count', '2025-05-21 14:03:52', '2025-05-21 14:03:52'),
(71, 71, NULL, 21, 100, 2000, 'total-class-count', '2025-05-21 14:03:52', '2025-05-21 14:03:52'),
(72, 72, NULL, 21, 100, 2000, 'total-class-count', '2025-05-21 14:03:52', '2025-05-21 14:03:52'),
(73, 73, NULL, 1, 100, 0, 'total-class-count', '2025-05-21 14:05:07', '2025-05-21 14:05:07'),
(74, 74, NULL, 1, 100, 0, 'total-class-count', '2025-05-21 14:05:07', '2025-05-21 14:05:07'),
(75, 75, NULL, 1, 100, 0, 'total-class-count', '2025-05-21 14:05:07', '2025-05-21 14:05:07'),
(76, 76, NULL, 1, 100, 0, 'total-class-count', '2025-05-21 14:05:07', '2025-05-21 14:05:07');

-- --------------------------------------------------------

--
-- Table structure for table `member_contacts`
--

CREATE TABLE `member_contacts` (
  `id` int NOT NULL,
  `member_id` int NOT NULL,
  `first_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `display_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_type` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `preferred_notification` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `member_contacts`
--

INSERT INTO `member_contacts` (`id`, `member_id`, `first_name`, `last_name`, `display_name`, `email`, `phone`, `user_type`, `parent_id`, `created_at`, `updated_at`, `preferred_notification`) VALUES
(1, 1, 'Tahir', 'Amjad', 'Tahir Amjad', 'tahir@kodxsystem.com', '07378492257', 'main', NULL, '2025-05-19 12:57:57', '2025-05-19 13:02:16', 'email'),
(2, 2, 'MUHAMMAD', 'TAHIR', 'MUHAMMAD TAHIR', 'tahiramjad79@gmail.com', '03224512868', 'main', NULL, '2025-05-19 13:07:13', '2025-05-19 13:10:38', 'email'),
(3, 3, 'Tahir', '321', 'Tahir 321', 'tahir123@gmail.com', '03224512869', 'main', NULL, '2025-05-21 11:40:22', '2025-05-21 11:40:22', NULL),
(4, 4, 'Tahir', '123', 'Tahir 123', 'tahir123@kodxsystem.com', '07378492258', 'main', NULL, '2025-05-21 11:40:22', '2025-05-21 11:40:22', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int NOT NULL,
  `recipient_id` int DEFAULT NULL,
  `sender` varchar(255) NOT NULL,
  `rich_text_content` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `event_id` varchar(36) DEFAULT NULL,
  `timeslot_id` int DEFAULT NULL,
  `recurring_id` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `recipient_id`, `sender`, `rich_text_content`, `created_at`, `updated_at`, `event_id`, `timeslot_id`, `recurring_id`) VALUES
(1, NULL, '1', '{\"type\": \"file\", \"content\": \"Event%20Details%3A%0AKodX-1%3A%2012%3A00%20PM%20-%201%3A00%20PM%20Monday%20May%2019th%202025%0A%20Invalid%20date%20-%20Invalid%20date%20Invalid%20date%20-%20Invalid%20date%0A%0ALocation%3A%20Lahore%2C%20Punjab%2C%20Pakistan%0ANotes%3A%20This%20is%20the%20first%20test%20event\", \"attachment\": [{\"url\": \"http://localhost:3002/ics/40342efd-7dfe-4138-b2a5-1c1c47a3eb96.ics\", \"name\": \"event.ics\", \"path\": \"/ics/40342efd-7dfe-4138-b2a5-1c1c47a3eb96.ics\", \"type\": \"text/calendar\"}]}', '2025-05-19 12:57:58', '2025-05-19 12:57:58', '40342efd-7dfe-4138-b2a5-1c1c47a3eb96', NULL, NULL),
(7, NULL, '2', '{\"type\": \"file\", \"content\": \"Event%20Details%3A%0AKodX-2%3A%2012%3A00%20PM%20-%201%3A01%20PM%20Monday%20May%2019th%202025%0A%20Invalid%20date%20-%20Invalid%20date%20Invalid%20date%20-%20Invalid%20date%0A%0ALocation%3A%20Lahore%2C%20Punjab%2C%20Pakistan%0ANotes%3A%20This%20is%20the%202nd%20Event%20for%20Testing%20with.%20new%20User\", \"attachment\": [{\"url\": \"http://localhost:3002/ics/7b9faa05-33cf-4c2a-a907-e30aa0b1c4bb.ics\", \"name\": \"event.ics\", \"path\": \"/ics/7b9faa05-33cf-4c2a-a907-e30aa0b1c4bb.ics\", \"type\": \"text/calendar\"}]}', '2025-05-19 13:07:13', '2025-05-19 13:07:13', '7b9faa05-33cf-4c2a-a907-e30aa0b1c4bb', NULL, NULL),
(11, NULL, '2', '{\"type\": \"text\", \"content\": \"Sending a test message\", \"attachment\": []}', '2025-05-19 13:10:45', '2025-05-19 13:10:45', '7b9faa05-33cf-4c2a-a907-e30aa0b1c4bb', NULL, NULL),
(12, NULL, '2', '{\"type\": \"text\", \"content\": \"Screenshot testing\", \"attachment\": []}', '2025-05-19 13:11:53', '2025-05-19 13:11:53', '7b9faa05-33cf-4c2a-a907-e30aa0b1c4bb', NULL, NULL),
(13, NULL, '2', '{\"type\": \"text\", \"content\": \"Hi There\", \"attachment\": []}', '2025-05-19 13:12:59', '2025-05-19 13:12:59', '7b9faa05-33cf-4c2a-a907-e30aa0b1c4bb', NULL, NULL),
(14, NULL, '1', '{\"type\": \"text\", \"content\": \"I\'m new on this Platform\", \"attachment\": []}', '2025-05-19 13:14:48', '2025-05-19 13:14:48', '7b9faa05-33cf-4c2a-a907-e30aa0b1c4bb', NULL, NULL),
(15, NULL, '1', '{\"type\": \"file\", \"content\": \"Event%20Details%3A%0AKodX-3%3A%2012%3A00%20PM%20-%201%3A00%20PM%20Wednesday%20May%2021st%202025%0A%20Invalid%20date%20-%20Invalid%20date%20Invalid%20date%20-%20Invalid%20date%0A%0ALocation%3A%20-%0ANotes%3A%20This%20is%20an%20Event%20with%20Multiple%20\", \"attachment\": [{\"url\": \"http://localhost:3002/ics/46805b06-939a-47f5-a59d-9ea7d915581f.ics\", \"name\": \"event.ics\", \"path\": \"/ics/46805b06-939a-47f5-a59d-9ea7d915581f.ics\", \"type\": \"text/calendar\"}]}', '2025-05-21 11:40:23', '2025-05-21 11:40:23', '46805b06-939a-47f5-a59d-9ea7d915581f', NULL, NULL),
(16, NULL, '1', '{\"type\": \"file\", \"content\": \"Event%20Details%3A%0AKodX-4%3A%2012%3A00%20PM%20-%201%3A00%20PM%20Saturday%20May%2010th%202025%0A%20Invalid%20date%20-%20Invalid%20date%20Invalid%20date%20-%20Invalid%20date%0A%0ALocation%3A%20Lahore%2C%20Punjab%2C%20Pakistan%0ANotes%3A%20Hi%20testing%20this%20Paid%20Event\", \"attachment\": [{\"url\": \"http://localhost:3002/ics/05a4673c-b8a1-4b4a-a6c4-07eb880d31fb.ics\", \"name\": \"event.ics\", \"path\": \"/ics/05a4673c-b8a1-4b4a-a6c4-07eb880d31fb.ics\", \"type\": \"text/calendar\"}]}', '2025-05-21 12:55:17', '2025-05-21 12:55:17', '05a4673c-b8a1-4b4a-a6c4-07eb880d31fb', NULL, NULL),
(17, NULL, '1', '{\"type\": \"file\", \"content\": \"Event%20Details%3A%0AKodX-4%3A%2012%3A00%20PM%20-%201%3A00%20PM%20Saturday%20May%2010th%202025%0A%20Invalid%20date%20-%20Invalid%20date%20Invalid%20date%20-%20Invalid%20date%0A%0ALocation%3A%20Lahore%2C%20Punjab%2C%20Pakistan%0ANotes%3A%20This%20is%20the%20test%20Message\", \"attachment\": [{\"url\": \"http://localhost:3002/ics/c685b60f-30b5-43c9-ba99-cb68d58789c3.ics\", \"name\": \"event.ics\", \"path\": \"/ics/c685b60f-30b5-43c9-ba99-cb68d58789c3.ics\", \"type\": \"text/calendar\"}]}', '2025-05-21 13:00:59', '2025-05-21 13:00:59', 'c685b60f-30b5-43c9-ba99-cb68d58789c3', NULL, NULL),
(18, NULL, '1', '{\"type\": \"file\", \"content\": \"Event%20Details%3A%0AKodX-3%3A%2012%3A00%20PM%20-%201%3A00%20PM%20Saturday%20May%2010th%202025%0A%20Invalid%20date%20-%20Invalid%20date%20Invalid%20date%20-%20Invalid%20date%0A%0ALocation%3A%20Lahore%2C%20Punjab%2C%20Pakistan%0ANotes%3A%20This%20is%20a%20testing%20For%20Tahir\", \"attachment\": [{\"url\": \"http://localhost:3002/ics/b2638bb4-b0e0-4339-811c-d1be7f981f1d.ics\", \"name\": \"event.ics\", \"path\": \"/ics/b2638bb4-b0e0-4339-811c-d1be7f981f1d.ics\", \"type\": \"text/calendar\"}]}', '2025-05-21 13:29:12', '2025-05-21 13:29:12', 'b2638bb4-b0e0-4339-811c-d1be7f981f1d', NULL, NULL),
(19, NULL, '1', '{\"type\": \"file\", \"content\": \"Event%20Details%3A%0AKodX-8%3A%2012%3A00%20PM%20-%201%3A00%20PM%20Wednesday%20May%2021st%202025%0A%20Invalid%20date%20-%20Invalid%20date%20Invalid%20date%20-%20Invalid%20date%0A%0ALocation%3A%20Lahore%2C%20Punjab%2C%20Pakistan%0ANotes%3A%20This%20is%20for%20the%20testing%20Purpose\", \"attachment\": [{\"url\": \"http://localhost:3002/ics/98c0fffd-4a1e-4976-9ca1-5d2ab70245f6.ics\", \"name\": \"event.ics\", \"path\": \"/ics/98c0fffd-4a1e-4976-9ca1-5d2ab70245f6.ics\", \"type\": \"text/calendar\"}]}', '2025-05-21 13:32:31', '2025-05-21 13:32:31', '98c0fffd-4a1e-4976-9ca1-5d2ab70245f6', NULL, NULL),
(20, NULL, '1', '{\"type\": \"file\", \"content\": \"Event%20Details%3A%0AKodX-4%3A%2012%3A00%20PM%20-%201%3A00%20PM%20Saturday%20May%2010th%202025%0A%20Invalid%20date%20-%20Invalid%20date%20Invalid%20date%20-%20Invalid%20date%0A%0ALocation%3A%20Lahore%2C%20Punjab%2C%20Pakistan%0ANotes%3A%20This%20si%20testing\", \"attachment\": [{\"url\": \"http://localhost:3002/ics/43f5fb6a-7916-4a57-9f8a-ea12535ff4ad.ics\", \"name\": \"event.ics\", \"path\": \"/ics/43f5fb6a-7916-4a57-9f8a-ea12535ff4ad.ics\", \"type\": \"text/calendar\"}]}', '2025-05-21 14:03:45', '2025-05-21 14:03:45', '43f5fb6a-7916-4a57-9f8a-ea12535ff4ad', NULL, NULL),
(21, NULL, '2', '{\"type\": \"file\", \"content\": \"Event%20Details%3A%0AKodX-9%3A%2012%3A00%20PM%20-%201%3A00%20PM%20Wednesday%20May%2021st%202025%0A%20Invalid%20date%20-%20Invalid%20date%20Invalid%20date%20-%20Invalid%20date%0A%0ALocation%3A%20Lahore%2C%20Punjab%2C%20Pakistan%0ANotes%3A%20This%20is%20testing%20again\", \"attachment\": [{\"url\": \"http://localhost:3002/ics/9a8c1cf5-de79-4752-bd5b-01d05092c5e0.ics\", \"name\": \"event.ics\", \"path\": \"/ics/9a8c1cf5-de79-4752-bd5b-01d05092c5e0.ics\", \"type\": \"text/calendar\"}]}', '2025-05-21 14:04:49', '2025-05-21 14:04:49', '9a8c1cf5-de79-4752-bd5b-01d05092c5e0', NULL, NULL),
(22, NULL, '1', '{\"type\": \"text\", \"content\": \"hip\", \"attachment\": []}', '2025-05-22 09:48:07', '2025-05-22 09:48:07', '46805b06-939a-47f5-a59d-9ea7d915581f', NULL, NULL),
(23, NULL, '1', '{\"type\": \"text\", \"content\": \"Hi\", \"attachment\": []}', '2025-05-22 14:03:26', '2025-05-22 14:03:26', '40342efd-7dfe-4138-b2a5-1c1c47a3eb96', NULL, NULL),
(24, NULL, '1', '{\"type\": \"text\", \"content\": \"Hello\", \"attachment\": []}', '2025-05-22 20:53:19', '2025-05-22 20:53:19', '40342efd-7dfe-4138-b2a5-1c1c47a3eb96', NULL, NULL),
(25, NULL, '1', '{\"type\": \"text\", \"content\": \"This is a testing message\", \"attachment\": []}', '2025-05-22 20:53:25', '2025-05-22 20:53:25', '40342efd-7dfe-4138-b2a5-1c1c47a3eb96', NULL, NULL),
(26, NULL, '1', '{\"type\": \"text\", \"content\": \"Can you read this\", \"attachment\": []}', '2025-05-22 20:53:28', '2025-05-22 20:53:28', '40342efd-7dfe-4138-b2a5-1c1c47a3eb96', NULL, NULL),
(27, NULL, '1', '{\"type\": \"text\", \"content\": \"it is on 23 May 2025\", \"attachment\": []}', '2025-05-22 20:53:35', '2025-05-22 20:53:35', '40342efd-7dfe-4138-b2a5-1c1c47a3eb96', NULL, NULL),
(28, NULL, '1', '{\"type\": \"text\", \"content\": \"This is a test new message\", \"attachment\": []}', '2025-05-22 21:41:42', '2025-05-22 21:41:42', '98c0fffd-4a1e-4976-9ca1-5d2ab70245f6', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `prooffers`
--

CREATE TABLE `prooffers` (
  `id` int NOT NULL,
  `proteacher_id` int NOT NULL,
  `classLevel` varchar(255) DEFAULT NULL,
  `className` varchar(255) DEFAULT NULL,
  `classDesc` varchar(255) DEFAULT NULL,
  `startDate` varchar(255) DEFAULT NULL,
  `endDate` varchar(255) DEFAULT NULL,
  `startDay` varchar(255) DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `classTags` varchar(255) DEFAULT NULL,
  `classPromotion` varchar(255) DEFAULT NULL,
  `classtime` time DEFAULT NULL,
  `expirationDate` varchar(255) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `created_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Table structure for table `pro_event_class_fees`
--

CREATE TABLE `pro_event_class_fees` (
  `CLASS_ID` int NOT NULL,
  `BATCH_ID` int NOT NULL,
  `TERMS` varchar(255) CHARACTER SET utf16 COLLATE utf16_swedish_ci NOT NULL,
  `MEMBER_LIST` varchar(255) CHARACTER SET utf32 COLLATE utf32_swedish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Table structure for table `pro_locations`
--

CREATE TABLE `pro_locations` (
  `id` int NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `address2` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `postalcode` int DEFAULT NULL,
  `ismetro` int DEFAULT NULL,
  `issuburban` int DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Table structure for table `recipients`
--

CREATE TABLE `recipients` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `studentprofile`
--

CREATE TABLE `studentprofile` (
  `id` int UNSIGNED NOT NULL,
  `CLSTParentID` int DEFAULT NULL,
  `CLStudentID` int DEFAULT NULL,
  `CLSTBillingID` int DEFAULT NULL,
  `CLSTParentName1` varchar(255) DEFAULT NULL,
  `CLSTParentName2` varchar(255) DEFAULT NULL,
  `CLSTFirstName` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `CLSTMiddleName` varchar(255) DEFAULT NULL,
  `CLSTLastName` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `CLSTFirst_LastName` int DEFAULT NULL,
  `CLSTPreferredName` varchar(255) DEFAULT NULL,
  `CLSTPreferredPronoun` varchar(50) DEFAULT NULL,
  `CLSTGender` varchar(50) DEFAULT NULL,
  `CLCity` varchar(255) DEFAULT NULL,
  `CLMobile` varchar(20) DEFAULT NULL,
  `CLSTMobile` varchar(20) DEFAULT NULL,
  `CLSTDOB` date DEFAULT NULL,
  `CLEmail` varchar(255) DEFAULT NULL,
  `CLSTEmail` varchar(255) DEFAULT NULL,
  `CLAddress` text,
  `CLActivate` date DEFAULT NULL,
  `STParticipation` varchar(255) DEFAULT NULL,
  `STMessages` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `MainClientID` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `studentprofile`
--

INSERT INTO `studentprofile` (`id`, `CLSTParentID`, `CLStudentID`, `CLSTBillingID`, `CLSTParentName1`, `CLSTParentName2`, `CLSTFirstName`, `CLSTMiddleName`, `CLSTLastName`, `CLSTFirst_LastName`, `CLSTPreferredName`, `CLSTPreferredPronoun`, `CLSTGender`, `CLCity`, `CLMobile`, `CLSTMobile`, `CLSTDOB`, `CLEmail`, `CLSTEmail`, `CLAddress`, `CLActivate`, `STParticipation`, `STMessages`, `created_at`, `MainClientID`) VALUES
(1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-05-19 12:57:57', 1),
(2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-05-19 13:07:13', 2),
(3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-05-21 11:40:22', 3),
(4, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-05-21 11:40:22', 4);

-- --------------------------------------------------------

--
-- Table structure for table `u_user`
--

CREATE TABLE `u_user` (
  `u_user_id` int NOT NULL,
  `u_user_first_name` varchar(100) DEFAULT NULL,
  `u_user_last_name` varchar(100) DEFAULT NULL,
  `u_user_email_address` varchar(150) NOT NULL,
  `u_user_password` varchar(75) NOT NULL,
  `u_user_username` varchar(100) DEFAULT NULL,
  `u_user_contact_no` varchar(14) NOT NULL,
  `u_user_venue_address1` varchar(255) DEFAULT NULL,
  `u_user_venue_address2` varchar(255) DEFAULT NULL,
  `u_user_zipcode` varchar(14) DEFAULT NULL,
  `u_user_website_url` varchar(255) DEFAULT NULL,
  `u_user_description` text,
  `u_user_images` varchar(150) DEFAULT NULL,
  `u_user_cover_image` varchar(150) DEFAULT NULL,
  `u_user_status` enum('Active','DeActive') DEFAULT NULL,
  `u_user_registered_date` datetime DEFAULT NULL,
  `is_admin_UCID` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `u_user`
--

INSERT INTO `u_user` (`u_user_id`, `u_user_first_name`, `u_user_last_name`, `u_user_email_address`, `u_user_password`, `u_user_username`, `u_user_contact_no`, `u_user_venue_address1`, `u_user_venue_address2`, `u_user_zipcode`, `u_user_website_url`, `u_user_description`, `u_user_images`, `u_user_cover_image`, `u_user_status`, `u_user_registered_date`, `is_admin_UCID`) VALUES
(1, 'Tahir', 'Amjad', 'tahir@kodxsystem.com', '', NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2, 'Tahir', 'Amjad', 'tahiramjad79@gmail.com', '', NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `calendar_group`
--
ALTER TABLE `calendar_group`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `event_fee_details`
--
ALTER TABLE `event_fee_details`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `event_member_request`
--
ALTER TABLE `event_member_request`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `event_time_slots`
--
ALTER TABLE `event_time_slots`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `invoice_items`
--
ALTER TABLE `invoice_items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `member_contacts`
--
ALTER TABLE `member_contacts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `recipient_id` (`recipient_id`);

--
-- Indexes for table `recipients`
--
ALTER TABLE `recipients`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_email` (`email`);

--
-- Indexes for table `studentprofile`
--
ALTER TABLE `studentprofile`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `u_user`
--
ALTER TABLE `u_user`
  ADD PRIMARY KEY (`u_user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `calendar_group`
--
ALTER TABLE `calendar_group`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `event_fee_details`
--
ALTER TABLE `event_fee_details`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `event_member_request`
--
ALTER TABLE `event_member_request`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `event_time_slots`
--
ALTER TABLE `event_time_slots`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `invoices`
--
ALTER TABLE `invoices`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=77;

--
-- AUTO_INCREMENT for table `invoice_items`
--
ALTER TABLE `invoice_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=77;

--
-- AUTO_INCREMENT for table `member_contacts`
--
ALTER TABLE `member_contacts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `recipients`
--
ALTER TABLE `recipients`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `studentprofile`
--
ALTER TABLE `studentprofile`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `u_user`
--
ALTER TABLE `u_user`
  MODIFY `u_user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`recipient_id`) REFERENCES `recipients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

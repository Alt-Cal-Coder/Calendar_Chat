-- phpMyAdmin SQL Dump
-- version 5.1.1deb5ubuntu1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Oct 29, 2024 at 06:24 PM
-- Server version: 8.0.35
-- PHP Version: 8.1.2-1ubuntu2.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `event-invitation-chat`
--

-- --------------------------------------------------------

--
-- Table structure for table `calendar_group`
--

CREATE TABLE `calendar_group` (
  `id` int NOT NULL,
  `name` varchar(255) DEFAULT 'DEFAULT',
  `creator_user_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `members_contacts` json NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int NOT NULL,
  `uniqueEventId` varchar(36) NOT NULL,
  `uniqueCreatorId` varchar(36) NOT NULL,
  `calendar_id` int DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `uniqueLink` varchar(255) DEFAULT NULL,
  `address` json DEFAULT NULL,
  `message` longtext,
  `icsDetails` json DEFAULT NULL,
  `ics_modified` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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

-- --------------------------------------------------------

--
-- Table structure for table `event_member_request`
--

CREATE TABLE `event_member_request` (
  `id` int NOT NULL,
  `eventId` int NOT NULL,
  `uniqueEventId` varchar(36) NOT NULL,
  `member_contact_id` int NOT NULL,
  `accept` tinyint(1) NOT NULL DEFAULT '0',
  `accepted_on` timestamp NULL DEFAULT NULL,
  `details` text,
  `is_invited` tinyint DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `event_time_slots`
--

CREATE TABLE `event_time_slots` (
  `id` int NOT NULL,
  `event_id` int NOT NULL,
  `slot_name` varchar(255) NOT NULL,
  `startDate` date DEFAULT NULL,
  `endDate` date DEFAULT NULL,
  `startTime` time DEFAULT NULL,
  `endTime` time DEFAULT NULL,
  `weekdays` json DEFAULT NULL,
  `type` enum('1','2') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

CREATE TABLE `invoices` (
  `id` int NOT NULL,
  `invoice_number` varchar(50) NOT NULL,
  `event_id` int NOT NULL,
  `teacher_id` varchar(255) NOT NULL,
  `student_id` int NOT NULL,
  `family_id` varchar(255) DEFAULT NULL,
  `total_amount` double NOT NULL,
  `location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `pdf_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `logo_path` varchar(255) DEFAULT NULL,
  `invoice_instruction_type` enum('batch-this-alone','batch-with-another-class','batch-by-family','batch-by-family-with-another-class') DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `invoice_items`
--

CREATE TABLE `invoice_items` (
  `id` int NOT NULL,
  `invoice_id` int NOT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `quantity` int NOT NULL,
  `unit_price` double NOT NULL,
  `total_amount` double NOT NULL,
  `item_type` enum('one-time-fee','total-class-count','bill-per-class','bill-per-month','bill-all-in-advance') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_id` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `member_contacts`
--

CREATE TABLE `member_contacts` (
  `id` int NOT NULL,
  `member_id` int NOT NULL,
  `first_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `last_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `display_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int NOT NULL,
  `calendar_id` int DEFAULT NULL,
  `event_id` varchar(255) DEFAULT NULL,
  `event_member_ids` int DEFAULT NULL,
  `sender_member_contact_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `rich_text_content` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
-- Table structure for table `studentprofile`
--

CREATE TABLE `studentprofile` (
  `id` int UNSIGNED NOT NULL,
  `CLSTParentID` varchar(255) NOT NULL,
  `CLStudentID` varchar(255) NOT NULL,
  `CLSTBillingID` varchar(255) NOT NULL,
  `CLSTParentName1` varchar(255) DEFAULT NULL,
  `CLSTParentName2` varchar(255) DEFAULT NULL,
  `CLSTFirstName` varchar(255) NOT NULL,
  `CLSTMiddleName` varchar(255) DEFAULT NULL,
  `CLSTLastName` varchar(255) NOT NULL,
  `CLSFirst_LastName` varchar(155) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL,
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
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Table structure for table `u_user`
--

CREATE TABLE `u_user` (
  `u_user_id` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
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
  `u_user_registered_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
  ADD KEY `recipient_id` (`event_member_ids`);

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
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `event_fee_details`
--
ALTER TABLE `event_fee_details`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `event_member_request`
--
ALTER TABLE `event_member_request`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `event_time_slots`
--
ALTER TABLE `event_time_slots`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `invoices`
--
ALTER TABLE `invoices`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `invoice_items`
--
ALTER TABLE `invoice_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `member_contacts`
--
ALTER TABLE `member_contacts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`event_member_ids`) REFERENCES `member_contacts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
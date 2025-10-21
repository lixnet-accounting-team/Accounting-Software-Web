-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 21, 2025 at 08:26 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

START TRANSACTION;

SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */
;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */
;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */
;
/*!40101 SET NAMES utf8mb4 */
;

--
-- Database: `accounting`
--

-- --------------------------------------------------------

--
-- Table structure for table `api_tokens`
--

CREATE TABLE `api_tokens` (
    `id` int(11) NOT NULL,
    `user_id` int(11) NOT NULL,
    `token` varchar(128) NOT NULL,
    `expires_at` datetime NOT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

--
-- Dumping data for table `api_tokens`
--

INSERT INTO
    `api_tokens` (
        `id`,
        `user_id`,
        `token`,
        `expires_at`,
        `created_at`
    )
VALUES (
        2,
        2,
        'f075e11deeafefcfd19b2e7b170f469dd08d72121cf9a01d5149b7c3bb40b56f',
        '2025-09-26 15:22:03',
        '2025-09-25 13:22:03'
    ),
    (
        3,
        3,
        'b4f35c346bcaf528be6de2b4d5be62041ccf37c0f564d31f12717517ba99866d',
        '2025-09-27 07:20:48',
        '2025-09-26 05:20:48'
    ),
    (
        4,
        4,
        'e02814366af75835e68f02134b183c05aaef3bb7d1c7cf9117bf82c66d792a49',
        '2025-09-27 12:46:46',
        '2025-09-26 10:46:46'
    ),
    (
        6,
        6,
        '5282d0a424a8db5c750f223cd19a178ea0d9f205598d3221262cf896eaf5990c',
        '2025-10-08 07:31:17',
        '2025-10-07 05:31:17'
    ),
    (
        7,
        6,
        '2f99a1543277ed51b3997d2c5f1d80a60dd400d34df9b505543d89ecda754de4',
        '2025-10-08 07:32:02',
        '2025-10-07 05:32:02'
    ),
    (
        8,
        6,
        '30eaefe53721e92c45db2244df61d1fda3b309032cc293b65a55b34781f6f75d',
        '2025-10-08 14:14:44',
        '2025-10-07 12:14:44'
    ),
    (
        9,
        7,
        '01ac833080a5294714010e6cf960175820215e12f16f0e828de322e16b25f815',
        '2025-10-14 13:43:38',
        '2025-10-13 11:43:38'
    ),
    (
        10,
        7,
        '069efb8dd9ae6a487f790d0ccb4bd2af493e0f147fa704bb9a4d97917e551cd4',
        '2025-10-14 15:16:17',
        '2025-10-13 13:16:17'
    ),
    (
        11,
        7,
        'a8745233a93c08325e81139d206f2a6560a7a22b59699964873dd69522c8d7e2',
        '2025-10-14 17:18:15',
        '2025-10-13 15:18:15'
    ),
    (
        12,
        7,
        '9950058b50339dc98ad949a56b2c3d2a676410dd185f4fed51046f968bdef3a3',
        '2025-10-14 17:18:34',
        '2025-10-13 15:18:34'
    ),
    (
        13,
        7,
        'ae768bb16496a0561442d90e464f073e8afcea1d3eda69ae67171a7b3fa74635',
        '2025-10-14 17:19:15',
        '2025-10-13 15:19:15'
    ),
    (
        14,
        7,
        '168c24dbbcf24b9209112af435d44c818777a2a41b793b4a3358ba10ac1e6dfe',
        '2025-10-14 17:28:16',
        '2025-10-13 15:28:16'
    ),
    (
        15,
        9,
        'f5a4cfa455f300243f428e4f45723e6f007158f908d1640e0c13cd94cbb4ff85',
        '2025-10-14 17:42:37',
        '2025-10-13 15:42:37'
    ),
    (
        16,
        9,
        'b684105ed5ff9eb11f787a7bf578aec3814098b3436e111bb5ebe0a3a4330d81',
        '2025-10-14 18:05:19',
        '2025-10-13 16:05:19'
    ),
    (
        17,
        9,
        '0041c62b45d63438dc92ccda801562431743475d4ac23703fa69e10c8682f299',
        '2025-10-14 18:12:10',
        '2025-10-13 16:12:10'
    ),
    (
        18,
        9,
        'e15b76c98ff89d22b8a8a4af8f98c37022836de7308272854489493478577607',
        '2025-10-14 18:12:43',
        '2025-10-13 16:12:43'
    ),
    (
        19,
        9,
        'f7030f140294cfafaf92a7e4aeb9cfc3cd110bdc41f254d8b5965da8c758c019',
        '2025-10-14 18:20:31',
        '2025-10-13 16:20:31'
    ),
    (
        20,
        9,
        '3a7866e9d53b9918ef099ed94b2c60c157fd71f0f6c5fd7379e3b40189f2c25f',
        '2025-10-14 18:20:33',
        '2025-10-13 16:20:33'
    ),
    (
        21,
        9,
        '3715b04b750386808b505f6bf2d32844648f8a7297eb02e3424d3fd2cbec6de8',
        '2025-10-14 18:21:24',
        '2025-10-13 16:21:24'
    ),
    (
        22,
        9,
        '8b1442246f51d280a6dd93c74398fb9c59f9cd3b8b720d2fa4483906ee30b3bc',
        '2025-10-14 18:32:09',
        '2025-10-13 16:32:09'
    ),
    (
        23,
        9,
        'efd980adadec7dc7d3a458826250f7cafecbaa0dec9824ec94fdadd1b2cf2487',
        '2025-10-14 18:41:18',
        '2025-10-13 16:41:18'
    ),
    (
        24,
        9,
        '33df0761574c215026fef66679deb4cbe6163d1097adc2114311a8cf9269093b',
        '2025-10-14 19:11:55',
        '2025-10-13 17:11:55'
    ),
    (
        25,
        9,
        '6742a1780460521844765bcbd656bbfefd0ff65748d0845904574953785035d9',
        '2025-10-14 19:18:20',
        '2025-10-13 17:18:20'
    ),
    (
        26,
        9,
        'a1fc9f244e91855d678f45eea6fe569408cc91f855f378b13a871c1cf9b3b1f7',
        '2025-10-14 19:25:01',
        '2025-10-13 17:25:01'
    ),
    (
        27,
        9,
        '1f1054df62ffcfa118522248b8292f99a3c41269ba208e660140a68431e8fd8f',
        '2025-10-15 08:17:55',
        '2025-10-14 06:17:55'
    ),
    (
        28,
        9,
        '7d38cdd97054d48de8f2aca418bac4722effee68d95832b633542c759bfd01f6',
        '2025-10-15 08:39:24',
        '2025-10-14 06:39:24'
    ),
    (
        29,
        9,
        'd729f1c1296758918e42061dedcf2ae0578d4d87e168f7bea244d0ed569335c9',
        '2025-10-15 17:22:22',
        '2025-10-14 15:22:22'
    ),
    (
        30,
        9,
        '1b5963f331dd1543421623dd6292af6a16c111cad78c73511ececb6ac829e53f',
        '2025-10-15 17:57:34',
        '2025-10-14 15:57:34'
    ),
    (
        31,
        9,
        'fd7392ae5f2f2046be54b03b3d47ba5a632a81f765a11bdc650f4e610375ae47',
        '2025-10-15 18:16:09',
        '2025-10-14 16:16:09'
    ),
    (
        32,
        9,
        '7f60e4f19f9ed068eadeefbdb64b8e3642f89b9a355acf2be075db5418ba1e56',
        '2025-10-15 18:17:02',
        '2025-10-14 16:17:02'
    ),
    (
        33,
        9,
        '5275cae13b0679cec6e18f99e00c349695d7f1cc7e91740600a16fb485e99f82',
        '2025-10-15 18:18:46',
        '2025-10-14 16:18:46'
    ),
    (
        34,
        9,
        'e6989e045948c533561a9c9c952b376b6c0ada19a1e7b30c51a1d14cb85b5b6e',
        '2025-10-15 19:38:15',
        '2025-10-14 17:38:15'
    ),
    (
        35,
        9,
        'ec8dfc866d6aa46f41ff6c919270ac5b09cb0200027f945f8d79628970919a3e',
        '2025-10-15 20:24:44',
        '2025-10-14 18:24:44'
    ),
    (
        36,
        9,
        'e04c73d615abc2cb6be6fc1b3badf52ae4751c9f79d2a58400a19588165ce782',
        '2025-10-15 20:29:46',
        '2025-10-14 18:29:46'
    ),
    (
        37,
        9,
        'bedf23d6d8cf7bd10a1c7e5a1c846bf25ba841178194974d1be230a66dec8c23',
        '2025-10-15 20:48:47',
        '2025-10-14 18:48:47'
    ),
    (
        38,
        9,
        '72c18194999d0206a903fd34bc834eabf7282e963bc1fbad92cf2ff9ec9728e3',
        '2025-10-15 20:51:24',
        '2025-10-14 18:51:24'
    ),
    (
        39,
        10,
        'a5a80de8801530ea91115c3d78d6d21b9b3457a3c4c92487c94db693bfb46c74',
        '2025-10-15 21:11:15',
        '2025-10-14 19:11:15'
    ),
    (
        40,
        9,
        '19bbb26a23956927e261aa9f95601465a2aecfa5a634da735dcab546de86273b',
        '2025-10-16 07:38:57',
        '2025-10-15 05:38:58'
    ),
    (
        41,
        9,
        '320396fe7a56ce949973405f36e98c51973260085fe13f54a37aa42b24cd0422',
        '2025-10-16 07:38:57',
        '2025-10-15 05:38:58'
    ),
    (
        42,
        9,
        '5b945cffbfebf07d8f657a23c3859df0d4ac5cf2857708db34b8bd866c7e9224',
        '2025-10-16 08:10:24',
        '2025-10-15 06:10:24'
    ),
    (
        43,
        9,
        '123da3e6a129171d42cfbd21c76bcbce66f04defe170b6da920a38f5ff3be589',
        '2025-10-16 09:38:15',
        '2025-10-15 07:38:15'
    ),
    (
        44,
        9,
        '2b15f5fcdd10a8b27dd440fdaacb71dbba581ae5c99ecf632544bae9126b008f',
        '2025-10-16 17:02:58',
        '2025-10-15 15:02:58'
    ),
    (
        45,
        9,
        'e8651f5f977ea6f5b10ff66a9991e1f952a69fa96703dd4b9cc684f8152b42e9',
        '2025-10-16 17:04:55',
        '2025-10-15 15:04:55'
    ),
    (
        46,
        9,
        '2da09a4b65ab2eafaa8db57a329c11eb93d5cab06b42e0bbe3565597762f0e99',
        '2025-10-16 17:10:52',
        '2025-10-15 15:10:52'
    ),
    (
        47,
        9,
        'a3c517ff8b689f5a43c1373fddb37c10c532c2dd51f16e6e242d44fde8adf480',
        '2025-10-17 14:53:20',
        '2025-10-16 12:53:20'
    ),
    (
        48,
        9,
        '10e6f528ea78a43f5b0c3f6c743baae0d5b5d1a59cf631fb63b35c121cff6e74',
        '2025-10-17 17:10:17',
        '2025-10-16 15:10:17'
    ),
    (
        49,
        9,
        '8a356b8790eb9210344cc54720c7307f142e12b95a42c462e7f9ebaae52c6cd7',
        '2025-10-17 17:38:43',
        '2025-10-16 15:38:43'
    ),
    (
        50,
        9,
        '7d3ebe58b44d7a412ef0f419dba2b8543f663f90cce5f0a1eb786917ddd3c36d',
        '2025-10-17 17:43:46',
        '2025-10-16 15:43:46'
    ),
    (
        51,
        9,
        'de3c10944122373b7c49553d9114140689545b76de59d69f53fcfa84a0c9ac4a',
        '2025-10-17 18:06:53',
        '2025-10-16 16:06:53'
    ),
    (
        52,
        9,
        'a3dd5781f89f60706dc2644b48689bc5bb8c3a47daede71706aa7d46826f94b4',
        '2025-10-17 18:12:39',
        '2025-10-16 16:12:39'
    ),
    (
        53,
        9,
        'b926f164788af3c8039e05e4ee86d9c06bcd3f9be3c76cb6c5cbac852960695e',
        '2025-10-17 18:22:23',
        '2025-10-16 16:22:23'
    ),
    (
        54,
        9,
        '10b78a43e8432efacf20b317c126754efe8e680633f997f4cbfae2a3de73b782',
        '2025-10-17 19:25:11',
        '2025-10-16 17:25:11'
    ),
    (
        55,
        9,
        'f919cc59c9311123b112494e5b7d6e154292fea2aec2eddd8b564b53f2d87a00',
        '2025-10-18 13:01:09',
        '2025-10-17 11:01:09'
    ),
    (
        56,
        9,
        '18dd5ef60033c7ede7ba2f9325ac4dcd1b624a4d9bf48c217f51e0f2929c8c1d',
        '2025-10-20 10:33:47',
        '2025-10-19 08:33:48'
    ),
    (
        57,
        9,
        '1b3c8373e29fa4ed378ad8f83190696c9873e14d92839dea71ab5d472306208c',
        '2025-10-20 14:50:55',
        '2025-10-19 12:50:55'
    ),
    (
        58,
        9,
        '6711bbebc81a4522632459eedfdfa4d8bbaf71c757879c6b589946ce0ea9bfe5',
        '2025-10-22 05:52:03',
        '2025-10-21 03:52:03'
    );

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
    `id` int(11) NOT NULL,
    `name` varchar(150) NOT NULL,
    `email` varchar(150) DEFAULT NULL,
    `phone` varchar(50) DEFAULT NULL,
    `address` text DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO
    `customers` (
        `id`,
        `name`,
        `email`,
        `phone`,
        `address`,
        `created_at`
    )
VALUES (
        2,
        'Villi Nguyo',
        'villi@example.com',
        '0711345678',
        'Nairobi, Kenya',
        '2025-09-25 13:25:24'
    ),
    (
        8,
        'Stan Lee',
        'stan@example.com',
        '0712345678',
        'Nairobi, Kenya',
        '2025-09-26 11:14:20'
    ),
    (
        9,
        'Chicolate Marble',
        'chicolate@example.com',
        '0712345678',
        'Nairobi, Kenya',
        '2025-10-13 16:59:42'
    ),
    (
        10,
        'Bravin Charles',
        'bravin@example.com',
        '0788665533',
        'Nairobi, Kenya',
        '2025-10-13 17:25:42'
    ),
    (
        11,
        'Tibe Okonji',
        'tibe@example.com',
        '0723324554',
        'Nairobi, Kenya',
        '2025-10-13 17:33:21'
    ),
    (
        12,
        'Alfred Muhoro',
        'alfred@example.com',
        '0765564332',
        'Nairobi, Kenya',
        '2025-10-13 17:34:40'
    ),
    (
        13,
        'Sharlyn Wambui',
        'sharlyn@example.com',
        '0765564389',
        'Nairobi, Kenya',
        '2025-10-13 17:34:59'
    ),
    (
        14,
        'Random Name',
        'random@example.com',
        '0112345654',
        'Nairobi, Kenya',
        '2025-10-14 06:18:35'
    ),
    (
        15,
        'Another Name',
        'another@example.com',
        '1234567898',
        'Nairobi, Kenya',
        '2025-10-14 06:19:31'
    ),
    (
        16,
        'Prosper',
        'max@example.com',
        '0798324434',
        'Nairobi, Kenya',
        '2025-10-14 06:20:28'
    ),
    (
        26,
        'Innocent Nguyo Villi',
        'inno@example.com',
        '0798370570',
        'Nairobi, Kenya',
        '2025-10-15 15:03:37'
    ),
    (
        27,
        'Sala',
        'sala@123',
        '1212121212',
        'Nairobi, Kenya',
        '2025-10-15 17:33:20'
    ),
    (
        28,
        'Mo Sala',
        'sala@1234',
        '1212121212',
        'Nairobi, Kenya',
        '2025-10-15 17:50:37'
    ),
    (
        29,
        'Alfred Muhoro',
        'fred@123',
        '1234567887',
        'Nairobi, Kenya',
        '2025-10-15 17:53:32'
    ),
    (
        30,
        'Stranger',
        'strange@123',
        '1324354657',
        'Nairobi, Kenya',
        '2025-10-15 18:26:26'
    ),
    (
        31,
        'Raila',
        'rao@123',
        '0978097889',
        'Nairobi, Kenya',
        '2025-10-16 13:51:12'
    ),
    (
        32,
        'Kibaki',
        'kbk@123',
        '0798370570',
        'Nairobi, Kenya',
        '2025-10-16 14:11:21'
    ),
    (
        33,
        'Unyee',
        'unyee@123',
        '2345678998',
        'Nairobi, Kenya',
        '2025-10-16 15:23:09'
    );

-- --------------------------------------------------------

--
-- Table structure for table `expenses`
--

CREATE TABLE `expenses` (
    `id` int(11) NOT NULL,
    `user_id` int(11) DEFAULT NULL,
    `title` varchar(200) NOT NULL,
    `amount` decimal(12, 2) NOT NULL,
    `category` varchar(100) DEFAULT NULL,
    `date` date NOT NULL,
    `notes` text DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

--
-- Dumping data for table `expenses`
--

INSERT INTO
    `expenses` (
        `id`,
        `user_id`,
        `title`,
        `amount`,
        `category`,
        `date`,
        `notes`,
        `created_at`
    )
VALUES (
        1,
        NULL,
        'Office Supplies',
        3000.50,
        'Stationery',
        '2025-09-25',
        'Pens and paper',
        '2025-09-26 09:51:12'
    ),
    (
        2,
        NULL,
        'Rent',
        5000.00,
        'Rent',
        '2025-09-25',
        'Warehouse',
        '2025-09-26 09:52:20'
    ),
    (
        3,
        NULL,
        'Electricity Bill',
        1200.00,
        'Utilities',
        '2025-09-20',
        'September KPLC',
        '2025-09-26 09:54:07'
    ),
    (
        4,
        NULL,
        'Internet ',
        2500.00,
        'Utilities',
        '2025-09-18',
        'WiFi monthly plan',
        '2025-09-26 09:55:23'
    ),
    (
        6,
        NULL,
        'Stationery',
        800.00,
        'Office Supplies',
        '2025-09-10',
        'Pens, notebooks, printer ink',
        '2025-09-26 09:56:53'
    ),
    (
        8,
        NULL,
        'Maintenance',
        2000.00,
        'Repairs',
        '2025-09-12',
        'AC repair',
        '2025-09-26 11:16:07'
    ),
    (
        16,
        NULL,
        'Food',
        3000.00,
        'Meals',
        '2025-10-16',
        '',
        '2025-10-16 13:48:20'
    ),
    (
        17,
        NULL,
        'Transport',
        4000.00,
        'Allowances',
        '2025-10-16',
        '',
        '2025-10-16 13:48:44'
    ),
    (
        18,
        NULL,
        'Allowances',
        10000.00,
        'Allowances',
        '2025-10-16',
        '',
        '2025-10-16 13:49:05'
    ),
    (
        19,
        NULL,
        'Random',
        30000.00,
        'Expenses',
        '2025-10-15',
        '',
        '2025-10-16 14:10:36'
    ),
    (
        20,
        NULL,
        'Tax',
        50000.00,
        'Legal',
        '2025-10-10',
        '',
        '2025-10-16 15:24:46'
    );

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

CREATE TABLE `invoices` (
    `id` int(11) NOT NULL,
    `customer_id` int(11) NOT NULL,
    `user_id` int(11) DEFAULT NULL,
    `invoice_number` varchar(50) NOT NULL,
    `date` date NOT NULL,
    `due_date` date DEFAULT NULL,
    `total` decimal(12, 2) NOT NULL DEFAULT 0.00,
    `status` enum(
        'draft',
        'sent',
        'paid',
        'overdue'
    ) DEFAULT 'draft',
    `notes` text DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

--
-- Dumping data for table `invoices`
--

INSERT INTO
    `invoices` (
        `id`,
        `customer_id`,
        `user_id`,
        `invoice_number`,
        `date`,
        `due_date`,
        `total`,
        `status`,
        `notes`,
        `created_at`
    )
VALUES (
        2,
        2,
        7,
        'INV-001',
        '2025-10-07',
        '2025-10-15',
        2000.00,
        'paid',
        'Payment Received',
        '2025-10-13 11:47:53'
    ),
    (
        3,
        26,
        NULL,
        'INV000003',
        '2025-10-08',
        '2025-10-15',
        500.00,
        'draft',
        '',
        '2025-10-15 15:03:37'
    ),
    (
        4,
        8,
        NULL,
        'INV000004',
        '2025-10-08',
        '2025-10-15',
        500.00,
        'draft',
        '',
        '2025-10-15 15:05:57'
    ),
    (
        6,
        11,
        NULL,
        'INV000006',
        '2025-10-08',
        '2025-10-15',
        1000.00,
        'draft',
        'Payment Received',
        '2025-10-15 17:52:09'
    ),
    (
        7,
        29,
        NULL,
        'INV000007',
        '2025-10-08',
        '2025-10-15',
        1000.00,
        'draft',
        '',
        '2025-10-15 17:53:32'
    ),
    (
        8,
        30,
        NULL,
        'INV000008',
        '2025-10-08',
        '2025-10-15',
        100000.00,
        'draft',
        'Payment Pending',
        '2025-10-15 18:26:26'
    ),
    (
        9,
        31,
        NULL,
        'INV000009',
        '2025-10-15',
        '2025-10-15',
        60000.00,
        'draft',
        '',
        '2025-10-16 14:08:56'
    ),
    (
        10,
        32,
        NULL,
        'INV000010',
        '2025-10-15',
        '2025-10-15',
        50000.00,
        'draft',
        '',
        '2025-10-16 14:11:21'
    ),
    (
        11,
        33,
        NULL,
        'INV000011',
        '2025-10-08',
        '2025-10-09',
        10000.00,
        'draft',
        '',
        '2025-10-16 15:23:09'
    ),
    (
        13,
        26,
        NULL,
        'INV000013',
        '2025-10-16',
        '2025-10-16',
        50000.00,
        'draft',
        '',
        '2025-10-16 16:45:47'
    ),
    (
        14,
        26,
        NULL,
        'INV000014',
        '2025-10-16',
        '2025-10-16',
        100000.00,
        'draft',
        '',
        '2025-10-16 16:47:27'
    ),
    (
        15,
        26,
        NULL,
        'INV000015',
        '2025-09-13',
        '2025-09-13',
        100.00,
        'draft',
        '',
        '2025-10-16 16:52:43'
    );

-- --------------------------------------------------------

--
-- Table structure for table `invoice_items`
--

CREATE TABLE `invoice_items` (
    `id` int(11) NOT NULL,
    `invoice_id` int(11) NOT NULL,
    `description` varchar(255) DEFAULT NULL,
    `quantity` int(11) NOT NULL DEFAULT 1,
    `unit_price` decimal(12, 2) NOT NULL,
    `line_total` decimal(12, 2) NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

--
-- Dumping data for table `invoice_items`
--

INSERT INTO
    `invoice_items` (
        `id`,
        `invoice_id`,
        `description`,
        `quantity`,
        `unit_price`,
        `line_total`
    )
VALUES (
        1,
        2,
        'Logo Design',
        2,
        500.00,
        1000.00
    ),
    (
        2,
        2,
        'Hosting Fee',
        1,
        1000.00,
        1000.00
    ),
    (
        3,
        3,
        'Logo Design',
        1,
        500.00,
        500.00
    ),
    (
        4,
        4,
        'Logo Design',
        1,
        500.00,
        500.00
    ),
    (
        7,
        6,
        'Hosting Fee',
        1,
        1000.00,
        1000.00
    ),
    (
        8,
        7,
        'Hosting Fee',
        1,
        1000.00,
        1000.00
    ),
    (
        9,
        8,
        'PS5',
        1,
        100000.00,
        100000.00
    ),
    (
        10,
        9,
        'TCL TV',
        1,
        60000.00,
        60000.00
    ),
    (
        11,
        10,
        'SONY TV',
        1,
        50000.00,
        50000.00
    ),
    (
        12,
        11,
        'Controller',
        1,
        10000.00,
        10000.00
    ),
    (
        14,
        13,
        'PS4',
        1,
        50000.00,
        50000.00
    ),
    (
        15,
        14,
        'PS5',
        1,
        100000.00,
        100000.00
    ),
    (
        16,
        15,
        'Chapo',
        1,
        100.00,
        100.00
    );

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
    `id` int(11) NOT NULL,
    `name` varchar(100) NOT NULL,
    `email` varchar(150) NOT NULL,
    `password_hash` varchar(255) NOT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO
    `users` (
        `id`,
        `name`,
        `email`,
        `password_hash`,
        `created_at`
    )
VALUES (
        1,
        'John Doe',
        'john@example.com',
        '$2y$10$zQoYK62hL1TTaKRRd5cGkue8hyWyo7uwNHpXe0cQHR1I3Xz40/SKm',
        '2025-09-25 13:08:14'
    ),
    (
        2,
        'Test User',
        'test@example.com',
        '$2y$10$PfIU4SvNxsiZdWu3d4Pxn.bfuTTB17YIkjEW2APWboAR8AA7n0VTq',
        '2025-09-25 13:17:38'
    ),
    (
        3,
        'Sting',
        'sting@example.com',
        '$2y$10$ApQslwHQoXv44iwCHDv9WOKjhY8M4S.1gbDMgkyBfLEOeDNDOX3eW',
        '2025-09-26 05:20:17'
    ),
    (
        4,
        'Joseph',
        'joseph@example.com',
        '$2y$10$750Cze.2WG.F2s9n1cS1Qu4Pwq/dMOnGVjQ5a9pOoCVNmXKsou2gy',
        '2025-09-26 10:45:52'
    ),
    (
        5,
        'Dan',
        'dan@example.com',
        '$2y$10$688J8yDKyYPyMhX5Ly06uO2eoUyjIsFDSXGp/P6mLksiesh91OcLS',
        '2025-09-26 11:11:57'
    ),
    (
        6,
        'Test User',
        'testt@example.com',
        '$2y$10$aShO.uXaLD9F6O/TCYfio.6AO5bXdWEOm2L4O1Phnvusq2vrd/ZSK',
        '2025-10-07 05:30:51'
    ),
    (
        7,
        'Chico',
        'chico@example.com',
        '$2y$10$5qFSNkQGGdBJLguKuD0E8.ge3Cbm0wSHuZlpVf8BhI1E7Drr0qiTe',
        '2025-10-13 11:43:07'
    ),
    (
        8,
        'Nguyo',
        'nguyo@example.com',
        '$2y$10$zRBVJIe/zr.Z5/lDDkfSSORhCk6Nbyl4YYKkSN24drQ0VezGnZXte',
        '2025-10-13 15:31:43'
    ),
    (
        9,
        'Inno',
        'inno@example.com',
        '$2y$10$oD2M7Phe5EgeQ6KBMp0sn.iwX.plYaQa4FVerd8DDW2iokmSMST4.',
        '2025-10-13 15:42:22'
    ),
    (
        10,
        'Me Myself',
        'me@myself',
        '$2y$10$QbXRjPZTH..PIHQNMmwpXemCBR2k2OYxz7O.j4XSz273m0bPqs6rG',
        '2025-10-14 19:11:04'
    );

--
-- Indexes for dumped tables
--

--
-- Indexes for table `api_tokens`
--
ALTER TABLE `api_tokens`
ADD PRIMARY KEY (`id`),
ADD UNIQUE KEY `token` (`token`),
ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers` ADD PRIMARY KEY (`id`);

--
-- Indexes for table `expenses`
--
ALTER TABLE `expenses`
ADD PRIMARY KEY (`id`),
ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `invoices`
--
ALTER TABLE `invoices`
ADD PRIMARY KEY (`id`),
ADD UNIQUE KEY `invoice_number` (`invoice_number`),
ADD KEY `customer_id` (`customer_id`),
ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `invoice_items`
--
ALTER TABLE `invoice_items`
ADD PRIMARY KEY (`id`),
ADD KEY `invoice_id` (`invoice_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
ADD PRIMARY KEY (`id`),
ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `api_tokens`
--
ALTER TABLE `api_tokens`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 59;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 36;

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 22;

--
-- AUTO_INCREMENT for table `invoices`
--
ALTER TABLE `invoices`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 16;

--
-- AUTO_INCREMENT for table `invoice_items`
--
ALTER TABLE `invoice_items`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 17;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `api_tokens`
--
ALTER TABLE `api_tokens`
ADD CONSTRAINT `api_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `expenses`
--
ALTER TABLE `expenses`
ADD CONSTRAINT `expenses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `invoices`
--
ALTER TABLE `invoices`
ADD CONSTRAINT `invoices_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
ADD CONSTRAINT `invoices_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `invoice_items`
--
ALTER TABLE `invoice_items`
ADD CONSTRAINT `invoice_items_ibfk_1` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON DELETE CASCADE;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */
;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */
;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */
;
-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 25-12-2023 a las 23:20:18
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `cxc`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `id` int(10) NOT NULL,
  `nombre` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cxc`
--

CREATE TABLE `cxc` (
  `id` int(10) NOT NULL,
  `idemp` int(10) NOT NULL,
  `idmon` int(10) NOT NULL,
  `idcli` int(10) NOT NULL,
  `tipo` int(1) NOT NULL,
  `fecha` date NOT NULL,
  `descrip` varchar(50) NOT NULL,
  `pagado` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cxcdet`
--

CREATE TABLE `cxcdet` (
  `id` int(10) NOT NULL,
  `idparent` int(10) NOT NULL,
  `codigo` varchar(20) NOT NULL,
  `descrip` varchar(50) NOT NULL,
  `precio` decimal(16,2) NOT NULL,
  `cantidad` int(10) NOT NULL,
  `monto` decimal(16,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cxcpag`
--

CREATE TABLE `cxcpag` (
  `id` int(10) NOT NULL,
  `idparent` int(10) NOT NULL,
  `fecha` date NOT NULL,
  `descrip` varchar(50) NOT NULL,
  `monto` decimal(16,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empresas`
--

CREATE TABLE `empresas` (
  `id` int(10) NOT NULL,
  `nombre` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `monedas`
--

CREATE TABLE `monedas` (
  `id` int(10) NOT NULL,
  `nombre` varchar(20) NOT NULL,
  `siglas` varchar(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(10) NOT NULL,
  `nickname` varchar(20) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `pwd` text NOT NULL,
  `chpwd` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nickname`, `nombre`, `email`, `pwd`, `chpwd`) VALUES
(1, 'admin', 'OSCAR URDANETA', 'oscarenriqueurdaneta@gmail.com', '9ee39160b8457edcb1a8c5473d8b32d5efb322e9d5ffa84fc48ade4b97e94db352abd2034501f9c50c53e85f138f03ac6fe325e07b2b5aaed5da1c8ddef18851', 0);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cdx_nombre` (`nombre`);

--
-- Indices de la tabla `cxc`
--
ALTER TABLE `cxc`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `cxcdet`
--
ALTER TABLE `cxcdet`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cdx_idparent` (`idparent`);

--
-- Indices de la tabla `cxcpag`
--
ALTER TABLE `cxcpag`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cdx_idparent` (`idparent`);

--
-- Indices de la tabla `empresas`
--
ALTER TABLE `empresas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cdx_nombre` (`nombre`);

--
-- Indices de la tabla `monedas`
--
ALTER TABLE `monedas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cdx_nombre` (`nombre`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cdx_nickname` (`nickname`),
  ADD KEY `cdx_email` (`email`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

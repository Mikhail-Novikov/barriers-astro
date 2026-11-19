<?php

if (!function_exists('loadEnv')) {
  /**
   * Загружает переменные окружения из файлов .env
   *
   * @param array $paths Пути к файлам .env (по умолчанию ищет в корне проекта и в корне веб-сервера)
   */
  function loadEnv(array $paths = []): void
  {
    $defaultPaths = [
      __DIR__ . '/../../.env',
      isset($_SERVER['DOCUMENT_ROOT'])
        ? dirname(rtrim($_SERVER['DOCUMENT_ROOT'], '/\\')) . '/.env'
        : '',
      isset($_SERVER['DOCUMENT_ROOT'])
        ? rtrim($_SERVER['DOCUMENT_ROOT'], '/\\') . '/.env'
        : '',
    ];

    foreach (array_unique(array_filter(array_merge($paths, $defaultPaths))) as $path) {
      if (!is_readable($path)) {
        continue;
      }

      foreach (file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#') || !str_contains($line, '=')) {
          continue;
        }

        [$name, $value] = array_map('trim', explode('=', $line, 2));
        $value = trim($value, "\"'");

        if ($name !== '' && getenv($name) === false) {
          putenv($name . '=' . $value);
          $_ENV[$name] = $value;
          $_SERVER[$name] = $value;
        }
      }

      break;
    }
  }
}

if (!function_exists('envValue')) {
  /**
   * Получает значение переменной окружения
   *
   * @param string $name Имя переменной
   * @param string $default Значение по умолчанию, если переменная не установлена
   * @return string Значение переменной окружения или значение по умолчанию
   */
  function envValue(string $name, string $default = ''): string
  {
    $value = getenv($name);
    return $value === false || $value === '' ? $default : $value;
  }
}

if (!function_exists('envBool')) {
  /**
   * Получает значение переменной окружения как булево значение
   *
   * @param string $name Имя переменной
   * @param bool $default Значение по умолчанию, если переменная не установлена
   * @return bool Булево значение переменной окружения или значение по умолчанию
   */
  function envBool(string $name, bool $default = false): bool
  {
    $value = getenv($name);
    if ($value === false || $value === '') {
      return $default;
    }

    return filter_var($value, FILTER_VALIDATE_BOOL);
  }
}

if (!function_exists('envInt')) {
  /**
   * Получает значение переменной окружения как целое число
   *
   * @param string $name Имя переменной
   * @param int $default Значение по умолчанию, если переменная не установлена
   * @return int Целое число из переменной окружения или значение по умолчанию
   */
  function envInt(string $name, int $default = 0): int
  {
    $value = getenv($name);
    return $value === false || $value === '' ? $default : (int) $value;
  }
}

if (!function_exists('envList')) {
  /**
   * Получает значение переменной окружения как массив строк, разделенных указанным разделителем
   *
   * @param string $name Имя переменной
   * @param string $separator Разделитель (по умолчанию запятая)
   * @return array Массив строк из переменной окружения
   */
  function envList(string $name, string $separator = ','): array
  {
    return array_values(array_filter(
      array_map('trim', explode($separator, envValue($name))),
      static fn(string $value): bool => $value !== ''
    ));
  }
}

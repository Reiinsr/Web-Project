<?php
// Railway/Render entry point - redirects to index.html for SPA routing
// This file ensures PHP is detected and handles API routes

$request_uri = $_SERVER['REQUEST_URI'];
$path = parse_url($request_uri, PHP_URL_PATH);

// If it's an API route, let it pass through (handled by the actual PHP files)
if (strpos($path, '/api/') === 0) {
    // API routes are handled by their respective PHP files
    return false;
}

// For all other routes, serve index.html (SPA routing)
if (!file_exists(__DIR__ . $path) || is_dir(__DIR__ . $path)) {
    include __DIR__ . '/index.html';
} else {
    return false; // Let the server handle static files
}
?>


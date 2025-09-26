<?php
// backend/api/utils.php

// Example utility functions
function sanitizeString($str) {
    return htmlspecialchars(strip_tags($str));
}

function formatDate($datetime) {
    return date("Y-m-d H:i:s", strtotime($datetime));
}

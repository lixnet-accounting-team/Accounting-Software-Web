<?php
echo "<h1>🎉 PHP is working!</h1>";
echo "<p>Current time: " . date('Y-m-d H:i:s') . "</p>";
echo "<p>PHP Version: " . phpversion() . "</p>";

// Test array (like we'll use for our accounting data)
$customers = [
    ['name' => 'John Doe', 'email' => 'john@email.com'],
    ['name' => 'Jane Smith', 'email' => 'jane@email.com']
];

echo "<h2>Sample Customer Data:</h2>";
foreach($customers as $customer) {
    echo "<p>👤 " . $customer['name'] . " - " . $customer['email'] . "</p>";
}
?>
<?php 
    define('DB_SERVER', 'localhost');
    define('DB_USERNAME', 'root');
    define('DB_PASSWORD', '');
    define('DB_NAME', 'keith_db');

    $connection = mysqli_connect(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);

    if(!$connection->connect_error) {
        
    }else {
        echo "The db connection has failed: " . $connection->connect_error;
    }
?>
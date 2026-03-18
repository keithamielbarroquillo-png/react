<?php

include_once 'cors.php';
include_once 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {

    $data = json_decode(file_get_contents("php://input"), true);

    $id = $data['ID'];
    $username = $data['Name'];
    $password = $data['Password'];

    $sql = "UPDATE users SET Name='$username', Password='$password' WHERE ID='$id'";
    $result = $connection->query($sql);

    if ($result) {
        $response = array(
            'status' => 'success',
            'message' => 'User updated.'
        );
    } else {
        $response = array(
            'status' => 'error',
            'message' => 'Failed to update.'
        );
    }

    echo json_encode($response);
}
<?php

include_once 'cors.php';
include_once 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {

    $data = json_decode(file_get_contents("php://input"), true);

    $id = $data['id'];

    $sql = "DELETE FROM users WHERE id = '$id'";
    $result = $connection->query($sql);

    if ($result) {
        $response = array(
            'status' => 'success',
            'message' => 'User deleted successfully.'
        );
    } else {
        $response = array(
            'status' => 'error',
            'message' => 'Failed to delete user.'
        );
    }

    echo json_encode($response);
}
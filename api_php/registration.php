<?php 

include_once 'cors.php';
include_once 'db_connection.php';

if($_SERVER['REQUEST_METHOD'] === 'POST') {

    $data = json_decode(file_get_contents("php://input"), true);

    $username = $data['username'];
    $password = $data['password'];

    $checkSql = "SELECT * FROM users WHERE Name = ?";
    $stmt = $connection->prepare($checkSql);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if($result->num_rows > 0) {
        $response = array(
            'status' => 'error',
            'message' => 'Username already exists.',
            'data' => null
        );
    } else {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $insertSql = "INSERT INTO users (Name, Password) VALUES (?, ?)";
        $stmt = $connection->prepare($insertSql);
        $stmt->bind_param("ss", $username, $hashedPassword);

        if($stmt->execute()) {
            $response = array(
                'status' => 'success',
                'message' => 'User registered successfully.',
                'data' => array(
                    'Name' => $username
                )
            );
        } else {
            $response = array(
                'status' => 'error',
                'message' => 'Failed to register user.',
                'data' => null
            );
        }
    }

    echo json_encode($response);
}
?>
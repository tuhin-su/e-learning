<?php
    include "models/state.php";
    function security():State{
        $ret = new State();
        $ret->state = true;

        $is_https = false;
        // https check
        if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') {
            $is_https = true;
        }
        
        // if you are behind a proxy or load balancer that handles SSL termination:
        if (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') {
            $is_https = true;
        }
        
        // Output result
        if (!$is_https) {
            // $ret->state = false; // enable when diploay server
            $ret->msg = "HTTPS is required";
            return $ret;
        }

        return $ret;
    }

    function validateSession() {
        session_start();
        $sessionLifetime = 3 * 24 * 60 * 60; // 3 days in seconds
    
        // Check if a session start time is set
        if (isset($_SESSION['start_time'])) {
            $currentTime = time();
            $sessionStartTime = $_SESSION['start_time'];
            $sessionExpiryTime = $sessionStartTime + $sessionLifetime;
    
            // If the current time is greater than the expiry time, destroy the session
            if ($currentTime > $sessionExpiryTime) {
                session_unset();
                session_destroy();
                echo "Session has expired and is destroyed.";
                return;
            } else {
                // If a reset request is made before expiration, extend the session
                if (isset($_POST['reset_request'])) {
                    $_SESSION['start_time'] = time();
                    echo "Session has been extended for another 3 days.";
                } else {
                    echo "Session is active.";
                }
            }
        } else {
            // If no session start time is set, initialize it
            $_SESSION['start_time'] = time();
            echo "Session started.";
        }
    }

    function encodeToBase64($data) {
        // Convert data to JSON string
        $jsonString = json_encode($data);
    
        // Encode JSON string to Base64
        $base64String = base64_encode($jsonString);
    
        return $base64String;
    }

    function decodeFromBase64($base64String) {
        // Decode Base64 string to JSON string
        $jsonString = base64_decode($base64String);
    
        // Convert JSON string to PHP array or object
        $data = json_decode($jsonString, true); // Use `true` for associative array
    
        return $data;
    }
?>
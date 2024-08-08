<?php
    $db = "epiz_33648996_main";
    $db_user = "dbs";
    $db_host = "db";
    $db_pass = "pass";
    $dbConnect = new mysqli($db_host, $db_user, $db_pass, $db);
    if ($dbConnect->connect_error){
        die("Connection failed: " . $dbConnect->connect_error);
    }
?>
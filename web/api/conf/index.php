<?php
    $db = "epiz_33648996_main";
    $db_user = "dbs";
    $db_host = "db";
    $db_pass = "pass";
    $dbConnect = new mysqli($db_host, $db_user, $db_pass, $db);
    if ($dbConnect->connect_error){
        echo encodeToBase64([
            "state" => false,
            "msg" => "Database connection failed: ". $dbConnect->connect_error,
        ]);
    }

    function getVer(){
        global $dbConnect;
        $resp = new State();
        $resp->state = false;
        $sql = "SELECT MAX(version) as ver  FROM resources;";
        if ($res = $dbConnect->query($sql)) {
            if ($res->num_rows > 0) {
                $resp->state = true;
                $resp->msg = $res->fetch_row()[0];
                return $resp;
            }
            $resp->msg = "No versions found";
        }
        $resp->msg="Unable execute query";
        return $resp;
    }

    function getRes($name){
        global $dbConnect;
        $name = mysqli_real_escape_string($dbConnect, $name);
        $resp = new State();
        $resp->state = false;
        $sql = "SELECT name,data,type FROM resources WHERE name = '$name';";
        if ($res = $dbConnect->query($sql)) {
            if ($res->num_rows > 0) {
                $resp->state = true;
                $resp->msg = $res->fetch_row();
                return $resp;
            }
            $resp->msg = "No resorces found for version: $name";
        }
        $resp->msg="Unable execute query";
        return $resp;
    }
?>
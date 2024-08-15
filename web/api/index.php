<?php
    
    require_once "./conf/index.php";
    require_once "./function/function.php";
    $responce = array();
    $responce["state"] = true;
    switch ($_SERVER["REQUEST_URI"]) {
        case '/api/login':
            if ($_SERVER["REQUEST_METHOD"] == "POST") {
                $data = decodeFromBase64($_POST['data']);
                $responce["msg"] = $data;
            }
            break;
        case '/api/ver':
            $tmp = getVer();
            if (!$tmp->state) {
                $responce["state"]=false;
                $responce["msg"] = "IN VALID ERROR";
            }
            else{
                $responce["ver"] = $tmp->msg;
            }
            
            
            break;
        
        default:
            echo $_SERVER["REQUEST_URI"];
            break;
    }

    header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
    echo encodeToBase64($responce);
?>
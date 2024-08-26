<?php
    session_start();
    require_once "./conf/index.php";
    require_once "./function/function.php";
    $responce = array();
    $responce["state"] = true;
    switch ($_SERVER["REQUEST_URI"]) {
        // he:login
        case '/api/login':
            if ($_SERVER["REQUEST_METHOD"] == "POST") {
                $data = decodeFromBase64($_POST['data']);
                $tmp = loginCheck($data['userId'],$data['passwd']);
                if (!$tmp["status"]) {
                    $responce["state"]=false;
                    $responce["msg"] = "IN VALID ERROR";
                }
                else{
                    $responce["msg"] = $tmp["msg"];
                }
            }
            else if($_SERVER["REQUEST_METHOD"] == "GET") {
                $responce["state"] = authValidation();
            }
            else{
                $responce["state"]=false;
                $responce["msg"] = "IN VALID METHOD";
            }
            break;
        // he:logout
        case '/api/logout':
            session_unset();
            session_destroy();
            $responce["state"] = true;
            break;

        // he:res
        case '/api/res':
            $data = decodeFromBase64($_POST['data']);
            $tmp = getRes($data["name"]);
            if (!$tmp->state) {
                $responce["state"]=false;
                $responce["msg"] = "IN VALID ERROR";
            }
            else{
                $responce["res"] = $tmp->msg;
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
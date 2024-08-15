<?php
include "./function/function.php";
$responce = array();
// session validation
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    session_id($_SERVER["HTTP_AUTHORIZATION"]);
    session_start();
}
else{
    session_start();
    $responce["auth"]=session_id();
}


if (!security()->state) {
    die("Access Denied");
}

// validate session
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    validateSession();
}

// connect databse
include "conf/index.php";
// handel GET requst
$sate = new State();
$sate -> state = true;


if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // hendel it all type resorses
    if (isset($_GET['data'])) {
        $data = decodeFromBase64($_GET['data']);
        if (isset($data['reqFor'])) {
            switch ($data['reqFor']) {
                    // return ondemant resorce 
                case 'res':
                    $res = getRes($data['name']);
                    if (!$res->state) {
                        $sate->state = false;
                        $sate->msg = $res->msg;
                    } else {
                        $responce["res"] = $res->msg;
                    }
                    break;


                    // return version 
                case 'ver':
                    $res = getVer();
                    if (!$res->state) {
                        $sate->state = false;
                        $sate->msg = $res->msg;
                    } else {
                        $responce["res"] = ["ver", $res->msg];
                    }
                    break;

                default:
                    // send error if requst type not define
                    $sate->state = false;
                    $sate->msg = "Invalid request type";
                    break;
            }
        } else {
            $sate->state = false;
            $sate->msg = "No request type provided";
        }
    } else {
        $sate->state = false;
        $sate->msg = "No dagta provided";
    }
}
// handel post rquest
else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $auth = authValidation();
    $data = decodeFromBase64($_POST['data']);
    if ($data["reqFor"]=='form') {
        $fromData=$data["data"];
        switch ($data['form']) {
            case 'login':
                $loginStat = loginCheck($fromData["userId"],$fromData["passwd"]);
                $sate->msg = $loginStat['msg'];
                if (!$loginStat["status"]) {
                    $sate->state=false;
                }
                else{
                    $responce["do"]=[
                        "redirect"=>"app-dashbord"
                    ];
                }
                break;
            
            default:
                # code...
                break;
        }
    }

    else if ($data["reqFor"]=="auth")
    {
        $sate->state=$auth;
        $sate->msg="Authentication failed";
    }
}


header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
$responce["state"] = $sate;
echo encodeToBase64($responce);

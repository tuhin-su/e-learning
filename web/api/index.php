<?php
include "./function/function.php";
if (!security()->state) {
    die("Access Denied");
}

// validate session
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    validateSession();
}

// connect databse
include "./conf/index.php";
// handel GET requst
$responce = array();
$sate = new State();
$sate->state = true;
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
                        $responce["ver"] = $res->msg;
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
        $sate->msg = "No data provided";
    }
}
// handel post rquest
else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    echo "POST";
}

$responce["state"] = $sate;
echo encodeToBase64($responce);

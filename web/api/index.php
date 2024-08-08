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
    
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // hendel it all type resorses
        if(isset($_GET['data'])){
            $data = $_GET['data'];
            if(isset($data['reqFor'])){
                switch ($data['reqFor']) {
                    case 'resorce':
                        $responce["data"]="re";
                        break;
                    
                    default:
                        # code...
                        break;
                }
            }
            else{
                $sate->state = false;
                $sate->msg = "No request type provided";
            }
        }
        else{
            $sate->state = false;
            $sate->msg = "No data provided";
        }
    }
    // handel post rquest
    else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        echo "POST";
    }

    $responce["state"]=$sate;
    echo encodeToBase64($responce);
?>
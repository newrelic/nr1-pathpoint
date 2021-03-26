<?php
$st = file_get_contents("../.env.json");
$config = json_decode($st, true);
$APIKEY = $config["API_KEY"];
$accountID = $config["accountID"];
require("newrelicFunctions.php");
$dashboards= getDashboardsList( 'pathpoint-',$APIKEY);
foreach($dashboards["dashboards"] as $dashboard){
    print("Removing DashboardID=".$dashboard['id']." Name:".$dashboard['title']);
    $result = deleteDashboardByID($dashboard['id'],$APIKEY);
    if($result["dashboard"]["id"]==$dashboard['id']){
        print("--->OK\n");
    }else{
        print("-->ERROR\n");
    }
}

 
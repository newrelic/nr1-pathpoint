<?php
// Enable Dashboards creation
//------------------------------------------------------------------------------------
$st = file_get_contents("../.env.json");
$config = json_decode($st, true);
$APIKEY = "API_KEY";//$config["API_KEY"];
$accountID = "ACCOUNT_ID";//$config["accountID"];
require("newrelicFunctions.php");
//------------------------------------------------------------------------------------

$f = fopen("touchpoints.csv", "r");
$stage_names = [];

$string = file_get_contents("../nerdlets/pathpoint-nerdlet/config/view.json");
$view = json_decode($string, true);

for ($i = 0; $i < count($view["stages"]); $i++) {
    $stage_names[] = $view["stages"][$i]["title"];
}

$touchPoints = [
    [
        "index" => 0,
        "country" => "PRODUCTION",
        "touchpoints" => []
    ]
];
removeTouchpoints($view);
$createDashboards = false;
//----------------------------------------------------------------------------
$message   =  "\n\nDo you whant to create default Dashboards on the client Account?[y/n]";
print $message;
flush();
$confirmation  =  trim( fgets( STDIN ) );
if ( $confirmation == 'y' ) {
   $createDashboards = true;
   print("\nCreateting Dashboards...\n\n");
   $actualDashboardsList = getDashboardsList('pathpoint--', $APIKEY);
}

$xx = 0;
$readingHeader = true;
while (($datos = fgetcsv($f, 1000, ",")) !== FALSE) {
    if ($readingHeader) {
        $readingHeader = false;
    } else {
        $stages[0] = $datos[0];
        $touchpoint = $datos[1];
        $steps = $datos[2];
        $touchpointType = $datos[3];
        $min_count = $datos[4];
        $min_apdex = $datos[5];
        $max_response_time = $datos[6];
        $max_error_percentage = $datos[7];
        $max_avg_response_time = $datos[8];
        $max_total_check_time = $datos[9];
        $min_success_percentage = $datos[10];
        $multiAccountID = $datos[11];
        $tp_query = $datos[12];
        if($createDashboards){
            $touchpointLink = createDashboardForStage($stages[0], $touchpoint, $actualDashboardsList);
        }else{
            $touchpointLink = $datos[13];
        }
        $measureTime = $datos[14];
        $touchpoint_timeout = $datos[15];
        
        //----------------------------------
        foreach ($stages as $stage) {
            if (valida_stage($stage)) {
                addTouchpoint(stage_index($stage), $touchpointType, $touchpoint, $steps, $touchpointLink, $tp_query, $min_count, $min_apdex, $max_response_time, $max_error_percentage, $max_avg_response_time, $max_total_check_time, $min_success_percentage,$multiAccountID, $measureTime, $touchpoint_timeout);
            }
        }
    }
}
fclose($f);

$ff = fopen("temporal", "w");
fwrite($ff, json_encode($touchPoints));
fclose($ff);
shell_exec("cat temporal | jq > ../nerdlets/pathpoint-nerdlet/config/touchPoints.json");

$ff = fopen("temporal", "w");
fwrite($ff, json_encode($view));
fclose($ff);
shell_exec("cat temporal | jq > ../nerdlets/pathpoint-nerdlet/config/view.json");


function valida_stage($stage)
{
    global $stage_names;
    foreach ($stage_names as $stname) {
        if ($stname == $stage) {
            return true;
        }
    }
    return false;
}

function stage_index($stage)
{
    global $stage_names;
    for ($index = 0; $index < count($stage_names); $index++) {
        if ($stage_names[$index] == $stage) {
            return $index;
        }
    }
}

function removeTouchpoints(&$view)
{
    global $stage_names;
    for ($i = 0; $i < count($stage_names); $i++) {
        $view["stages"][$i]["touchpoints"] = [];
        for ($ss = 0; $ss < count($view["stages"][$i]["steps"]); $ss++) {
            if (array_key_exists("sub_steps", $view["stages"][$i]["steps"][$ss])) {
                for ($s = 0; $s < count($view["stages"][$i]["steps"][$ss]["sub_steps"]); $s++) {
                    $view["stages"][$i]["steps"][$ss]["sub_steps"][$s]["relationship_touchpoints"] = [];
                }
            } else {
                $view["stages"][$i]["steps"][$ss]["relationship_touchpoints"] = [];
            }
        }
    }
}

function getStepIndex($stage_index, $steps)
{
    global $view;
    $s = explode(",", $steps);

    $result = [];
    if( $steps == ''){
        return $result;
    }
    foreach ($s as $code) {
        $code = trim($code);
        //print("stage-".$stage_index." code:".$code."\n");
        $result[] = $view["stages"][$stage_index]["steps"][$code[0] - 1]["sub_steps"][ord($code[1]) - 65]["index"];
    }
    return $result;
}

function setRelationship($stage_index, $relationIndex, $tpIndex)
{
    global $view;
    for ($ss = 0; $ss < count($view["stages"][$stage_index]["steps"]); $ss++) {
        if (array_key_exists("sub_steps", $view["stages"][$stage_index]["steps"][$ss])) {
            for ($s = 0; $s < count($view["stages"][$stage_index]["steps"][$ss]["sub_steps"]); $s++) {
                if ($view["stages"][$stage_index]["steps"][$ss]["sub_steps"][$s]["index"] == $relationIndex) {
                    $view["stages"][$stage_index]["steps"][$ss]["sub_steps"][$s]["relationship_touchpoints"][] = $tpIndex;
                }
            }
        } else {
            if ($view["stages"][$stage_index]["steps"][$ss]["index"] == $relationIndex) {
                $view["stages"][$stage_index]["steps"][$ss]["relationship_touchpoints"][] = $tpIndex;
            }
        }
    }
}

function getDashboardLink($link)
{
    if ($link != '') {
        return $link;
    } else {
        return false;
    }
}

function addTouchpoint($stage_index, $touchpointType, $touchpoint, $steps, $touchpointLink, $tp_query, $min_count, $min_apdex, $max_response_time, $max_error_percentage, $max_avg_response_time, $max_total_check_time, $min_success_percentage, $multiAccountID, $measureTime, $touchpoint_timeout)
{
    global $view;
    global $touchPoints;
    $tpIndex = count($view["stages"][$stage_index]["touchpoints"]) + 1;
    $historicError = false;
    $touchPoints[0]["touchpoints"][] = [
        "stage_index" => ($stage_index + 1),
        "value" => $touchpoint,
        "touchpoint_index" => $tpIndex,
        "status_on_off" => true,
        "relation_steps" => getStepIndex($stage_index, $steps),
        "measure_points" => []
    ];
    $last = count($touchPoints[0]["touchpoints"]);
    if ($touchpointType == 'PRC') {
        $touchPoints[0]["touchpoints"][$last - 1]["measure_points"][] = [
            "type" => $touchpointType,
            "timeout" => (int) $touchpoint_timeout,
            "query" => $tp_query,
            "min_count" => (int) $min_count,
            "session_count" => 0
        ];
    }else if ($touchpointType == 'PCC') {
        $touchPoints[0]["touchpoints"][$last - 1]["measure_points"][] = [
            "type" => $touchpointType,
            "timeout" => (int) $touchpoint_timeout,
            "query" => $tp_query,
            "min_count" => (int) $min_count,
            "transaction_count" => 0
        ];
    }else if ($touchpointType == 'APP') {
        $touchPoints[0]["touchpoints"][$last - 1]["measure_points"][] = [
            "type" => $touchpointType,
            "timeout" => (int) $touchpoint_timeout,
            "query" => $tp_query,
            "min_apdex" => (float) $min_apdex,
            "max_response_time" => (float) $max_response_time,
            "max_error_percentage" => (float) $max_error_percentage,
            "apdex_value" => 0,
            "response_value" => 0,
            "error_percentage" => 0
        ];
    }else if ($touchpointType == 'FRT') {
        $touchPoints[0]["touchpoints"][$last - 1]["measure_points"][] = [
            "type" => $touchpointType,
            "timeout" => (int) $touchpoint_timeout,
            "query" => $tp_query,
            "min_apdex" => (float) $min_apdex,
            "max_response_time" => (float) $max_response_time,
            "max_error_percentage" => (float) $max_error_percentage,
            "apdex_value" => 0,
            "response_value" => 0,
            "error_percentage" => 0
        ];
    }else if ($touchpointType == 'SYN') {
        $touchPoints[0]["touchpoints"][$last - 1]["measure_points"][] = [
            "type" => $touchpointType,
            "timeout" => (int) $touchpoint_timeout,
            "query" => $tp_query,
            "max_avg_response_time" => (float) $max_avg_response_time,
            "max_total_check_time" => (float) $max_total_check_time,
            "min_success_percentage" => (float) $min_success_percentage,
            "success_percentage" => 0,
            "max_duration" => 0,
            "max_request_time" =>0
        ];
    }else if ($touchpointType == 'WLD') {
        $touchPoints[0]["touchpoints"][$last - 1]["measure_points"][] = [
            "type" => $touchpointType,
            "timeout" => (int) $touchpoint_timeout,
            "query" => $tp_query,
            "status_value" => 'NO-VALUE'
        ];
    }
    if($multiAccountID !== ''){
        $lastMeasure = count($touchPoints[0]["touchpoints"][$last - 1]["measure_points"]);
        $touchPoints[0]["touchpoints"][$last - 1]["measure_points"][$lastMeasure-1]["accountID"] = (int) $multiAccountID;
    }
    if($measureTime !== ''){
        $lastMeasure = count($touchPoints[0]["touchpoints"][$last - 1]["measure_points"]);
        $touchPoints[0]["touchpoints"][$last - 1]["measure_points"][$lastMeasure-1]["measure_time"] = $measureTime;
    }
    $view["stages"][$stage_index]["touchpoints"][] = [
        "index" => $tpIndex,
        "stage_index" => $stage_index + 1,
        "status_on_off" => true,
        "response_error" => false,
        "show_grey_square" => false,
        "active" => false,
        "value" => $touchpoint,
        "highlighted" => false,
        "error" => false,
        "history_error" => $historicError,
        "countrys" => [
            0
        ],
        "dashboard_url" => [
            getDashboardLink($touchpointLink)
        ],
        "relation_steps" => getStepIndex($stage_index, $steps)
    ];
    foreach (getStepIndex($stage_index, $steps) as $relationIndex) {
        setRelationship($stage_index, $relationIndex, $tpIndex);
    }
}

function createDashboardForStage($stage, $touchpoint, $actualDashboardsList)
{
    global $APIKEY;
    global $accountID;
    //print_r($actualDashboardsList["dashboards"]); exit;
    $dashboardTitle = "pathpoint-" . $stage . "-" . $touchpoint;
    foreach ($actualDashboardsList["dashboards"] as $dashboard) {
        //print_r($dashboard); exit;
        if ($dashboard["title"] == $dashboardTitle) {
            // print("Removing Existing DashboardID=" . $dashboard['id'] . " Name:" . $dashboard['title']);
            // $result = deleteDashboardByID($dashboard['id'], $APIKEY);
            // if ($result["dashboard"]["id"] == $dashboard['id']) {
            //     print("--->OK\n");
            // } else {
            //     print("-->ERROR\n");
            // }

            // Do not create Dashboard because it already exists
            print("Dashboard allready exist--> ID=" . $dashboard['id'] . "\n");
            $dashboardGuid = getDashboardGuid($dashboardTitle, $APIKEY, $accountID);
            print("DashbordGUID=" . $dashboardGuid . "\n");
            return "https://one.newrelic.com/redirect/entity/" . $dashboardGuid;
        }
    }
    // Create a New Dashboars
    $string = file_get_contents("dashboard_model.json");
    $dashboardModel = json_decode($string, true);
    //Update the Dashdoard model Account ID
    for($i=0;$i<count($dashboardModel["dashboard"]["widgets"]);$i++){
        $dashboardModel["dashboard"]["widgets"][$i]["account_id"]= intval($accountID);
        //print($dashboardModel["dashboard"]["widgets"][$i]["account_id"]."\n");
    }
    $apmServiceGuid = getApmServiceGuid($touchpoint, $APIKEY, $accountID);

    $dashboardModel["dashboard"]["title"] = $dashboardTitle;
    $apmLink = "";
    if ($apmServiceGuid) {
        $apmLink = "https://one.newrelic.com/redirect/entity/" . $apmServiceGuid;
    }
    $dashboardModel["dashboard"]["widgets"][0]["data"][0]["source"] = "[Go to APM Dashboard](" . $apmLink . ")\n";
    $dashboardModel["dashboard"]["widgets"][1]["data"][0]["nrql"] = "SELECT count(*),max(duration) as max,min(duration) as min,average(duration) as average,median(duration),percentage(count(*), WHERE error is true) as percentage_error" .
        " FROM Transaction WHERE appName='" . $touchpoint . "'" .
        " SINCE 30 minutes ago";
    $dashboardModel["dashboard"]["widgets"][1]["presentation"]["title"] = $touchpoint . " Statistics";

    $dashboardModel["dashboard"]["widgets"][2]["data"][0]["nrql"] = "SELECT count(*) as count" .
        " FROM Transaction WHERE appName='" . $touchpoint . "'" .
        " TIMESERIES auto SINCE 30 minutes ago";

    $dashboardModel["dashboard"]["widgets"][3]["data"][0]["nrql"] = "SELECT average(duration),median(duration),max(duration),min(duration) " .
        " FROM Transaction WHERE appName='" . $touchpoint . "'" .
        " TIMESERIES AUTO SINCE 30 minutes ago";

    $dashboardModel["dashboard"]["widgets"][4]["data"][0]["nrql"] = "SELECT count(*)" .
        " FROM Transaction WHERE appName='" . $touchpoint . "'" .
        " TIMESERIES AUTO FACET request.headers.userAgent SINCE 30 minutes ago";

    $dashboardModel["dashboard"]["widgets"][5]["data"][0]["nrql"] = "SELECT count(*)" .
        " FROM Transaction WHERE appName='" . $touchpoint . "'" .
        " FACET request.headers.host  SINCE 30 minutes ago";

    $dashboardId = createDashboard(json_encode($dashboardModel), $APIKEY);
    print("Created Dashboard--> ID=" . $dashboardId . "\n");

    $dashboardGuid = getDashboardGuid($dashboardTitle, $APIKEY, $accountID);
    print("DashbordGUID=" . $dashboardGuid . "\n");
    return "https://one.newrelic.com/redirect/entity/" . $dashboardGuid;
}

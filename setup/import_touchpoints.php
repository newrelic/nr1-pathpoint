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
        $touchpointType = $datos[1];
        $touchpoint = $datos[2];
        $steps = $datos[3];

        $tp_queryCount = $datos[4];
        $tp_queryError = $datos[5];

        $tp_error_threshold = $datos[6];
        $tp_apdex_query = $datos[7];
        $apdex_time = $datos[8];

        $tp_session_query = $datos[9];
        $tp_session_duration = $datos[10];

        if($createDashboards){
            $touchpointLink = createDashboardForStage($stages[0], $touchpoint, $actualDashboardsList);
        }else{
            $touchpointLink = $datos[11];
        }

        //----------------------------------
        foreach ($stages as $stage) {
            if (valida_stage($stage)) {
                addTouchpoint(stage_index($stage), $touchpointType, $touchpoint, $steps, $touchpointLink, $tp_queryCount, $tp_queryError, $tp_error_threshold, $tp_apdex_query, $apdex_time, $tp_session_query,$tp_session_duration);
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

function addTouchpoint($stage_index, $touchpointType, $touchpoint, $steps, $touchpointLink, $tp_queryCount, $tp_queryError, $tp_error_threshold, $tp_apdex_query, $apdex_time, $tp_session_query, $tp_session_duration)
{
    global $view;
    global $touchPoints;
    $tpIndex = count($view["stages"][$stage_index]["touchpoints"]) + 1;
    $historicError = false;
    if ($touchpointType == 0) {
        $touchPoints[0]["touchpoints"][] = [
            "stage_index" => ($stage_index + 1),
            "value" => $touchpoint,
            "touchpoint_index" => $tpIndex,
            "status_on_off" => true,
            "relation_steps" => getStepIndex($stage_index, $steps),
            "measure_points" => [
                [
                    "type" => 0,
                    "query" => $tp_queryCount,
                    "count" => 0
                ],
                [
                    "type" => 1,
                    "query" => $tp_queryError,
                    "error_threshold" => (int) $tp_error_threshold,
                    "error_percentage" => 0
                ],
                [
                    "type" => 2,
                    "query" => $tp_apdex_query,
                    "apdex" => 0,
                    "apdex_time" => (int) $apdex_time,
                ]
            ]
        ];
        //SESSIONS_COUNT
        $last = count($touchPoints[0]["touchpoints"]);
        $touchPoints[0]["touchpoints"][$last - 1]["measure_points"][] = [
            "type" => 3,
            "query" => $tp_session_query,
            "count" => 0
        ];
        // SESSION_TIME
        $touchPoints[0]["touchpoints"][$last - 1]["measure_points"][] = [
            "type" => 4,
            "query" => $tp_session_duration,
            "sessions" => []
        ];
    }else if($touchpointType==1){
        $touchPoints[0]["touchpoints"][] = [
            "stage_index" => ($stage_index + 1),
            "value" => $touchpoint,
            "touchpoint_index" => $tpIndex,
            "status_on_off" => true,
            "relation_steps" => getStepIndex($stage_index, $steps),
            "measure_points" => [
                [
                    "type" => 20,
                    "query" => $tp_queryCount,
                    "error_threshold" => (int) $tp_error_threshold,
                    "count" => 0,
                    "error_percentage" => 0
                ]
            ]
        ];
    }
    //$n = rand(1, 100);
    $view["stages"][$stage_index]["touchpoints"][] = [
        "index" => $tpIndex,
        "stage_index" => $stage_index + 1,
        "status_on_off" => true,
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

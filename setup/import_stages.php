<?php
$f = fopen("steps.csv", "r");

$string = file_get_contents("initial_view.json");
$view_base = json_decode($string, true);
$currentStage = "";
//----------------------------------------------------------------------------
while (($datos = fgetcsv($f, 1000, ",")) !== FALSE) {
    $stage = $datos[0];
    if ($currentStage != trim($stage)) {
        $currentStage = trim($stage);
        addStage($stage);
    }
}
//----------------------------------

fclose($f);


$ff = fopen("temporal", "w");
fwrite($ff, json_encode($view_base));
fclose($ff);
shell_exec("cat temporal | jq > ../nerdlets/pathpoint-nerdlet/config/view.json");

//----------------------------------------------------------------------------

function addStage($stage)
{
    global $view_base;
    $index = count($view_base["stages"]) + 1;
    $ligth="good";
    $active_dotted="none";
    if($index==4){ $ligth="danger";}
    if($index==5){ $ligth="warning";}
    //if($index==2 || $index==5){ $active_dotted="dashed";}
    $view_base["stages"][] = [
        "index" => $index,
        "title" => $stage,
        "latencyStatus" => false,
        "status_color" => $ligth,
        "gout_enable" => false,
        "gout_quantity" => 150,
        "money_enabled" => false,
        "trafficIconType" => "traffic", 
        "money" => "",
        "icon_active" => ($index % 2 == 0),
        "icon_description" => ($index <3)? "medal":"star",
        "icon_visible" => false,
        "congestion" => [
            "value" => 0,
            "percentage" => 15,
        ],
        "capacity" => 0,
        "total_count" => 0,
        "active_dotted" => $active_dotted,
        "active_dotted_color" => "#828282",
        "steps" => [],
        "touchpoints" => []
    ];
}

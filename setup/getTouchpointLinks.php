<?php
$string = file_get_contents("../nerdlets/pathpoint-nerdlet/config/view.json");
$view = json_decode($string, true);
for($i=0;$i<count($view["stages"]);$i++){
    $count = count($view["stages"][$i]["touchpoints"]);
    for($y=0;$y<$count;$y++){
        print($view["stages"][$i]["touchpoints"][$y]["dashboard_url"][0]."\n");
    }
}
<?php
$f = fopen("steps.csv", "r");

$string = file_get_contents("../nerdlets/pathpoint-nerdlet/config/view.json");
$view_base= json_decode($string, true);
$stepIndex = 1;
$currentStage = "";
$stageIndex = 0;
//----------------------------------------------------------------------------
while (($datos = fgetcsv($f, 1000, ",")) !== FALSE) {
    $stage = $datos[0];
    $steps = explode("|",$datos[1]);
    //----------------------------------
    addSteps($stage,$steps);
}
fclose($f);


$ff = fopen("temporal","w");
fwrite($ff,json_encode($view_base));
fclose($ff);
shell_exec("cat temporal | jq > ../nerdlets/pathpoint-nerdlet/config/view.json");

//----------------------------------------------------------------------------



function addSteps($stage,$steps){
    global $view_base;
    global $stepIndex;
    global $currentStage;
    global $stageIndex;
    if($stage!=$currentStage){
        $stepIndex = 1;
        $currentStage = $stage;
        $stageIndex++;
    }
    for($i=0;$i<count($view_base["stages"]);$i++){
        if($view_base["stages"][$i]["title"]==$stage){
            $view_base["stages"][$i]["steps"][]=[
                "value"=> "",
                "sub_steps"=> []
            ];
            $last = count($view_base["stages"][$i]["steps"])-1;
            for($s=0;$s<count($steps);$s++){
                $latency = (($stepIndex==1)&&($s==0))? true : false;
                $n = rand(1,100);
                if(!$latency){
                    $latency = ($n<9)? true:false;
                }
                $stepId = "ST".$stageIndex."-LINE".($last+1)."-SS".($s+1);
                $n = rand(1,100);
                $dark = (($n<15)&&($i<4))? true : false;
                $view_base["stages"][$i]["steps"][$last]["sub_steps"][] = [
                    "index"=> $stepIndex,
                    "id" => $stepId,
                    "canary_state"=> false,
                    "latency"=> $latency,
                    "value"=> $steps[$s],
                    "dark"=> $dark,
                    "history_error"=> false,
                    "dotted"=> false,
                    "highlighted"=> false,
                    "error"=> false,
                    "index_stage"=> $i+1,
                    "relationship_touchpoints"=> []
                            
                ];
                $stepIndex++;
            }
            return;
        }
    }
    
}


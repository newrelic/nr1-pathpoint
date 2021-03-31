<?php

//------------------------------------------------
function createDashboard($dashboardBody, $APIKEY)
{

    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => "https://api.newrelic.com/v2/dashboards.json",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "POST",
        CURLOPT_POSTFIELDS => $dashboardBody,
        CURLOPT_HTTPHEADER => array(
            "Content-Type: application/json",
            "Api-Key: " . $APIKEY
        ),
    ));

    $response = curl_exec($curl);
    curl_close($curl);
    $dashboardModel = json_decode($response, true);
    return ($dashboardModel['dashboard']["id"]);
}

function getDashboardGuid($dashboardName, $APIKEY, $accountID)
{

    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => "https://api.newrelic.com/graphql",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "POST",
        CURLOPT_POSTFIELDS => "{\"query\":\"{\\n  actor {\\n    entitySearch(query: \\\"accountId=\\u0027".$accountID."\\u0027 and name=\\u0027" . $dashboardName . "\\u0027\\\", sortBy: NAME) {\\n      results {\\n        entities {\\n          guid\\n        }\\n      }\\n    }\\n  }\\n}\\n\", \"variables\":\"\"}",
        CURLOPT_HTTPHEADER => array(
            "Content-Type: application/json",
            "Api-Key: " . $APIKEY
        ),
    ));

    $response = curl_exec($curl);

    curl_close($curl);
    $dashboard = json_decode($response, true);
    return ($dashboard["data"]["actor"]["entitySearch"]["results"]["entities"][0]["guid"]);
}

function getDashboardsList($dashboardLikeNane, $APIKEY)
{
    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => "https://api.newrelic.com/v2/dashboards.json?filter%5Btitle%5D=pathpoint",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "GET",
        CURLOPT_POSTFIELDS => "filter%5Btitle%5D=pathpoint",
        CURLOPT_HTTPHEADER => array(
            "Content-Type: application/x-www-form-urlencoded",
            "Api-Key: " . $APIKEY
        ),
    ));
    $response = curl_exec($curl);

    curl_close($curl);
    $dashboards = json_decode($response, true);
    return $dashboards;
}

function deleteDashboardByID($dashboardID,$APIKEY){
    $curl = curl_init();

    curl_setopt_array($curl, array(
      CURLOPT_URL => "https://api.newrelic.com/v2/dashboards/".$dashboardID.".json",
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_ENCODING => "",
      CURLOPT_MAXREDIRS => 10,
      CURLOPT_TIMEOUT => 0,
      CURLOPT_FOLLOWLOCATION => true,
      CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
      CURLOPT_CUSTOMREQUEST => "DELETE",
      CURLOPT_HTTPHEADER => array(
        "Api-Key: ".$APIKEY
      ),
    ));
    
    $response = curl_exec($curl);
    
    curl_close($curl);
    $dashboards = json_decode($response, true);
    return $dashboards;
}

function getApmServiceGuid($apmServiceName, $APIKEY,$accountID)
{

    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => "https://api.newrelic.com/graphql",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "POST",
        CURLOPT_POSTFIELDS => "{\"query\":\"{\\n  actor {\\n    entitySearch(query: \\\"accountId=\\u0027".$accountID."\\u0027 and name=\\u0027" . $apmServiceName . "\\u0027\\\", sortBy: NAME) {\\n      results {\\n        entities {\\n          guid\\n        entityType\\n        }\\n      }\\n    }\\n  }\\n}\\n\", \"variables\":\"\"}",
        CURLOPT_HTTPHEADER => array(
            "Content-Type: application/json",
            "Api-Key: " . $APIKEY
        ),
    ));

    $response = curl_exec($curl);

    curl_close($curl);
    $dashboard = json_decode($response, true);
    foreach($dashboard["data"]["actor"]["entitySearch"]["results"]["entities"] as $entity){
        if($entity["entityType"]=="APM_APPLICATION_ENTITY"){
            return $entity["guid"];
        }
    }
    return null;
}
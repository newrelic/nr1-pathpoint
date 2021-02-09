<?php
$string = file_get_contents("../nerdlets/pathpoint-nerdlet/config/touchpoints.json");
$touchpoints = json_decode($string, true);

$max = count($touchpoints[0]["touchpoints"]);
print("\n");
print('var raw1 = JSON.stringify({"query":"{ actor {');
for ($i = 0; $i < 21; $i++) {
    $stage_index = $touchpoints[0]["touchpoints"][$i]["stage_index"];
    $touchpoint_index = $touchpoints[0]["touchpoints"][$i]["touchpoint_index"];
    print(' measure_'.$stage_index.'_'.$touchpoint_index.': account(id: "+myAccountID+") { nrql(query: \"');
    //print('SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM ');
    print($touchpoints[0]["touchpoints"][$i]["measure_points"][0]["query"]);
    print(' SINCE 5 minutes AGO');
    print('\", timeout: 10) {results }}');
}
print('}}","variables":""});');
print("\n");
print('var raw2 = JSON.stringify({"query":"{ actor {');
for ($i = 21; $i < 41; $i++) {
    $stage_index = $touchpoints[0]["touchpoints"][$i]["stage_index"];
    $touchpoint_index = $touchpoints[0]["touchpoints"][$i]["touchpoint_index"];
    print(' measure_'.$stage_index.'_'.$touchpoint_index.': account(id: "+myAccountID+") { nrql(query: \"');
    //print('SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM ');
    print($touchpoints[0]["touchpoints"][$i]["measure_points"][0]["query"]);
    print(' SINCE 5 minutes AGO');
    print('\", timeout: 10) {results }}');
}
print('}}","variables":""});');
print("\n");
print('var raw3 = JSON.stringify({"query":"{ actor {');
for ($i = 41; $i < 61; $i++) {
    $stage_index = $touchpoints[0]["touchpoints"][$i]["stage_index"];
    $touchpoint_index = $touchpoints[0]["touchpoints"][$i]["touchpoint_index"];
    print(' measure_'.$stage_index.'_'.$touchpoint_index.': account(id: "+myAccountID+") { nrql(query: \"');
    //print('SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM ');
    print($touchpoints[0]["touchpoints"][$i]["measure_points"][0]["query"]);
    print(' SINCE 5 minutes AGO');
    print('\", timeout: 10) {results }}');
}
print('}}","variables":""});');
print("\n");
print('var raw4 = JSON.stringify({"query":"{ actor {');
for ($i = 61; $i < 70; $i++) {
    $stage_index = $touchpoints[0]["touchpoints"][$i]["stage_index"];
    $touchpoint_index = $touchpoints[0]["touchpoints"][$i]["touchpoint_index"];
    print(' measure_'.$stage_index.'_'.$touchpoint_index.': account(id: "+myAccountID+") { nrql(query: \"');
    //print('SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM ');
    print($touchpoints[0]["touchpoints"][$i]["measure_points"][0]["query"]);
    print(' SINCE 5 minutes AGO');
    print('\", timeout: 10) {results }}');
}
$i=70;
    $stage_index = $touchpoints[0]["touchpoints"][$i]["stage_index"];
    $touchpoint_index = $touchpoints[0]["touchpoints"][$i]["touchpoint_index"];
    print(' measure_'.$stage_index.'_'.$touchpoint_index.': account(id: "+myAccountID+") { nrql(query: \"');
    print($touchpoints[0]["touchpoints"][$i]["measure_points"][0]["query"]);
    print(' SINCE 5 minutes AGO');
    print('\", timeout: 10) {results }}');
$i=71;
    $stage_index = $touchpoints[0]["touchpoints"][$i]["stage_index"];
    $touchpoint_index = $touchpoints[0]["touchpoints"][$i]["touchpoint_index"];
    print(' measure_'.$stage_index.'_'.$touchpoint_index.': account(id: "+myAccountID+") { nrql(query: \"');
    print($touchpoints[0]["touchpoints"][$i]["measure_points"][0]["query"]);
    print(' SINCE 5 minutes AGO');
    print('\", timeout: 10) {results }}');

print('}}","variables":""});');
print("\n");


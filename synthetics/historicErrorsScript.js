/* eslint-disable prefer-template */
/* eslint-disable prettier/prettier */
// Insert API Credentials
const myAccountID = $secure.PATHPOINT_SYN_ACCOUNTID;
const myInsertKey = $secure.PATHPOINT_INGEST_LICENSE;
const graphQLKey =  $secure.PATHPOINT_USER_API_KEY;

//Import the `assert` module to validate results.
var today = new Date();
var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = date + ' ' + time;

const touchpoints = [
    {
        stage_index: 1,
        touchpoint_index: 1,
        type: 'PRC',
        timeout: 10,
        query: "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='queue'",
        min_count: 10,
        measure_time: '15 minutes ago'
    }
];
let rawData = [];
let responses = [];
function callback()

var raw1 = JSON.stringify({ "query": "{ actor { measure_1_1: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-cbms-catalog-api' AND request.uri !='/CheckServlet.srv' AND request.uri!='/checkservlet.srv' AND httpResponseCode!='401' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_1_2: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-cbms-catalog-processing' AND request.uri !='/CheckServlet.srv' SINCE 5 minutes AGO\", timeout: 10)  {results }}}}", "variables": "" });


//console.log(raw);
var graphqlpack1 = {
    headers: {
        "Content-Type": "application/json",
        "API-Key": graphQLKey
    },
    url: 'https://api.newrelic.com/graphql',
    body: raw1

};
var graphqlpack2 = {
    headers: {
        "Content-Type": "application/json",
        "API-Key": graphQLKey
    },
    url: 'https://api.newrelic.com/graphql',
    body: raw2

};
var graphqlpack3 = {
    headers: {
        "Content-Type": "application/json",
        "API-Key": graphQLKey
    },
    url: 'https://api.newrelic.com/graphql',
    body: raw3

};
var graphqlpack4 = {
    headers: {
        "Content-Type": "application/json",
        "API-Key": graphQLKey
    },
    url: 'https://api.newrelic.com/graphql',
    body: raw4

};
var return1 = null;
var return2 = null;
var return3 = null;
var return4 = null;

function callback1(err, response, body) {
    return1 = JSON.parse(body);
    $http.post(graphqlpack2, callback2);
}

function callback2(err, response, body) {
    return2 = JSON.parse(body);
    $http.post(graphqlpack3, callback3);
}

function callback3(err, response, body) {
    return3 = JSON.parse(body);
    $http.post(graphqlpack4, callback4);
}

function callback4(err, response, body) {
    return4 = JSON.parse(body);
    var events = [];
    var event = null;
    var c = null;
    for (const [key, value] of Object.entries(return1.data.actor)) {
        c = key.split("_");
        if (value.nrql.results != null) {
            event = {
                "eventType": "PathpointHistoricErrors",
                "stage_index": parseInt(c[1]),
                "touchpoint_index": parseInt(c[2]),
                "count": value.nrql.results[0].count,
                "percentage": value.nrql.results[0].percentage
            }
            console.log(event);
            events.push(event);
        }
    }
    for (const [key, value] of Object.entries(return2.data.actor)) {
        c = key.split("_");
        if (value.nrql.results != null) {
            event = {
                "eventType": "PathpointHistoricErrors",
                "stage_index": parseInt(c[1]),
                "touchpoint_index": parseInt(c[2]),
                "count": value.nrql.results[0].count,
                "percentage": value.nrql.results[0].percentage
            }
            console.log(event);
            events.push(event);
        }
    }
    for (const [key, value] of Object.entries(return3.data.actor)) {
        c = key.split("_");
        if (value.nrql.results != null) {
            event = {
                "eventType": "PathpointHistoricErrors",
                "stage_index": parseInt(c[1]),
                "touchpoint_index": parseInt(c[2]),
                "count": value.nrql.results[0].count,
                "percentage": value.nrql.results[0].percentage
            }
            console.log(event);
            events.push(event);
        }
    }
    for (const [key, value] of Object.entries(return4.data.actor)) {
        c = key.split("_");
        if (value.nrql.results != null) {
            if (key == 'measure_3_19' || key == 'measure_3_20') {
                event = {
                    "eventType": "PathpointHistoricErrors",
                    "stage_index": parseInt(c[1]),
                    "touchpoint_index": parseInt(c[2]),
                    "count": value.nrql.results[0].R1,
                    "percentage": value.nrql.results[0].R2
                }
            } else {
                event = {
                    "eventType": "PathpointHistoricErrors",
                    "stage_index": parseInt(c[1]),
                    "touchpoint_index": parseInt(c[2]),
                    "count": value.nrql.results[0].count,
                    "percentage": value.nrql.results[0].percentage
                }
            }
            console.log(event);
            events.push(event);
        }
    }

    var raw5 = JSON.stringify(events);
    var options = {
        //Define endpoint URL.
        url: "https://insights-collector.newrelic.com/v1/accounts/" + myAccountID + "/events",
        //Define body of POST request.
        body: raw5,
        //Define insert key and expected data type.
        headers: {
            'X-Insert-Key': myInsertKey,
            'Content-Type': 'application/json'
        }
    };
    console.log(options);
    $http.post(options, function (error, response, body) {
        console.log(response.statusCode + " status code FUNCIONO");
        var info = JSON.parse(body);
        console.log(info);
    });
}
//Make GET request, passing in options and callback.
$http.post(graphqlpack1, callback1);


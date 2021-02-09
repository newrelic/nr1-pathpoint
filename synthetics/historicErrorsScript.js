//Insert API Credentials

var myAccountID = $secure.PATHPOINT_HISTORIC_ERROR_ACCOUNTID;
var myInsertKey = $secure.PATHPOINT_HISTORIC_ERROR_INSERT_KEY;
var myQueryKey = $secure.PATHPOINT_HISTORIC_ERROR_QUERY_KEY;
var graphQLKey = $secure.PATHPOINT_HISTORIC_ERROR_GRAPHQL_KEY;

//Import the `assert` module to validate results.
var today = new Date();
var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = date + ' ' + time;


var raw1 = JSON.stringify({ "query": "{ actor { measure_1_1: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-cbms-catalog-api' AND request.uri !='/CheckServlet.srv' AND request.uri!='/checkservlet.srv' AND httpResponseCode!='401' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_1_2: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-cbms-catalog-processing' AND request.uri !='/CheckServlet.srv' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_1_3: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-cbms-cache-loader' AND request.uri !='/CheckServlet.srv' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_1_4: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-cbms-auth' AND request.uri !='/CheckServlet.srv' AND request.uri!='/checkservlet.srv' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_1_5: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-catalog-service' AND request.uri !='/health' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_1_6: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-cbms-task' AND request.uri !='/CheckServlet.srv' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_1_7: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-cbms-ambassador' AND request.uri !='/CheckServlet.srv' AND request.uri!='/checkservlet.srv' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_1_8: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-loca' AND request.uri  LIKE '/v1/localize%' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_1_9: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-data-service' AND request.uri !='/health' AND httpResponseCode!='404' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_1_10: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-voltron' AND request.uri ='/customs/v1/calculate' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_1_11: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-perseus-service' AND request.uri !='/up' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_1_12: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-cbms-consulate' AND request.uri !='/CheckServlet.srv' AND request.uri!='/checkservlet.srv' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_1_13: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-promotions-service' AND request.uri !='/health' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_1_14: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-backstore' AND request.uri !='/management/health' AND httpResponseCode!='401' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_1_15: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-cbt-api' AND request.uri !='/status' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_1_16: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-cbt-settings' AND request.uri !='/status' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_2_1: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-welcomemat' AND request.uri !='/health' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_2_2: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-cbms-auth' AND request.uri !='/CheckServlet.srv' AND request.uri!='/checkservlet.srv' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_2_3: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-cbms-cache-loader' AND request.uri !='/CheckServlet.srv' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_2_4: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-data-service' AND request.uri !='/health' AND httpResponseCode!='404' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_2_5: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-loca' AND request.uri  LIKE '/v1/localize%' SINCE 5 minutes AGO\", timeout: 10) {results }}}}", "variables": "" });
var raw2 = JSON.stringify({ "query": "{ actor { measure_2_6: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-depot' AND request.uri !='/health' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_2_7: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-merchconf' AND request.uri !='/health' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_2_8: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-port' AND request.uri !='/status' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_2_9: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-cbt-api' AND request.uri !='/status' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_2_10: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-cbt-settings' AND request.uri !='/status' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_2_11: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-bfx-police' AND request.uri !='/health' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_2_12: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-cms-v2' AND request.uri !='/NONE' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_2_13: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-bfaccounts-api' AND request.uri !='/status' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_2_14: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-bfaccounts-auth' AND request.uri !='/' AND request.uri!='/status' AND request.uri!='/uuid' AND httpResponseCode='200' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_3_1: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-envoy-core' AND request.uri !='/health' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_3_2: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-checkout-ng' AND request.uri !='/status' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_3_3: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-bfaccounts-api' AND request.uri !='/status' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_3_4: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-bfaccounts-auth' AND request.uri !='/' AND request.uri!='/status' AND request.uri!='/uuid' AND httpResponseCode='200' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_3_5: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-cbms-checkout' AND request.uri !='/CheckServlet.srv' AND request.uri!='/checkout/checkoutAPI-v2.srv' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_3_6: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-promotions-service' AND request.uri !='/health' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_3_7: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-cbms-rabbit-consumers' AND request.uri !='/CheckServlet.srv' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_3_8: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-threeds-service' AND request.uri !='/ctrl/health/' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_3_9: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-voltron' AND request.uri ='/customs/v1/calculate' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_3_10: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-perseus-service' AND request.uri !='/up' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_3_11: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-calculation-manager-service' AND request.uri !='/status' SINCE 5 minutes AGO\", timeout: 10) {results }}}}", "variables": "" });
var raw3 = JSON.stringify({ "query": "{ actor { measure_3_12: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-fraud-service' AND request.uri !='/health' AND request.uri!='/status' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_3_13: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-payment-configuration-service' AND request.uri !='/NONE' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_3_14: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='pci-prd-smartproxy-endpoint' AND request.uri !='/NONE' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_3_15: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-worldpay-service' AND request.uri !='/health' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_3_16: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-wp-apm-driver' AND request.uri !='/health' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_3_17: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-cybersource-driver' AND request.uri !='/ctrl/health/' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_3_18: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-cybersource-service' AND request.uri !='/status' AND request.uri!='/health' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_4_1: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-cbms-orders-api' AND request.uri !='/CheckServlet.srv' AND request.uri!='/checkservlet.srv' AND httpResponseCode!='400' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_4_2: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-cbms-auth' AND request.uri !='/CheckServlet.srv' AND request.uri!='/checkservlet.srv' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_4_3: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-cbms-cache-loader' AND request.uri !='/CheckServlet.srv' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_4_4: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-bfx-oms' AND request.uri !='/health' AND request.uri!='/status' AND httpResponseCode!='404' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_4_5: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-cbms-task' AND request.uri !='/CheckServlet.srv' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_4_6: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-cbms-rabbit-consumers' AND request.uri !='/CheckServlet.srv' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_4_7: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-mail-grid-service' AND request.uri !='/monitoring/health' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_4_8: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-fraud-service' AND request.uri !='/status' AND request.uri!='/health' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_5_1: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-cbms-hub' AND request.uri !='/CheckServlet.srv' AND request.uri!='/checkservlet.srv' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_5_2: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-cbms-auth' AND request.uri !='/CheckServlet.srv' AND request.uri!='/checkservlet.srv' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_5_3: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-cbms-cache-loader' AND request.uri !='/CheckServlet.srv' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_5_4: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-shipping-service' AND request.uri !='/up' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_5_5: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-shipout-service' AND request.uri !='/health' AND request.uri!='/status' SINCE 5 minutes AGO\", timeout: 10) {results }}}}", "variables": "" });
var raw4 = JSON.stringify({ "query": "{ actor { measure_5_6: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-shipoutui' AND request.uri !='/health' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_5_7: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-cbms-orders-api' AND request.uri !='/CheckServlet.srv' AND request.uri!='/checkservlet.srv' AND httpResponseCode!='400' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_5_8: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-scaler' AND request.uri !='/health' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_5_9: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-mail-grid-service' AND request.uri !='/monitoring/health' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_5_10: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-cbms-task' AND request.uri !='/CheckServlet.srv' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_5_11: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-cbms-rabbit-consumers' AND request.uri !='/CheckServlet.srv' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_5_12: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-tracking' AND request.uri !='/healthcheck' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_5_13: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-uturn' AND request.uri !='/health' AND httpResponseCode!='400' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_5_14: account(id: "+myAccountID+") { nrql(query: \"SELECT count(*),percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='prd-cbms-consulate' AND request.uri !='/CheckServlet.srv' AND request.uri!='/checkservlet.srv' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_3_19: account(id: "+myAccountID+") { nrql(query: \"SELECT FILTER(count(*), WHERE message like '%responseCode=SUCCESS%') as R1, FILTER(count(*), WHERE message like '%responseCode=FAILED%') as R2 FROM Log WHERE message like '%com.borderfree.vcards.thirdparty.wex%' SINCE 5 minutes AGO\", timeout: 10) {results }} measure_3_20: account(id: "+myAccountID+") { nrql(query: \"SELECT FILTER(count(*), WHERE data.request.detailed_result='1') as R1, FILTER(count(*), WHERE data.request.detailed_result='0') as R2 FROM Log WHERE service_name='prd/dutycalc-service' SINCE 5 minutes AGO\", timeout: 10) {results }}}}", "variables": "" });

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


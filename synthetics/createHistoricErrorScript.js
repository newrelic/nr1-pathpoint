function historicErrorScript(){
let data = {
    header:null,
    footer:null
}
data.header = `
var myAccountID = $secure.PATHPOINT_HISTORIC_ERROR_ACCOUNTID;
var myInsertKey = $secure.PATHPOINT_HISTORIC_ERROR_INSERT_KEY;
var myQueryKey = $secure.PATHPOINT_HISTORIC_ERROR_QUERY_KEY;
var graphQLKey = $secure.PATHPOINT_HISTORIC_ERROR_GRAPHQL_KEY;

var today = new Date();
var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = date + ' ' + time;

`;
data.footer =`

    var rawN = JSON.stringify(events);
    var options = {
        //Define endpoint URL.
        url: "https://insights-collector.newrelic.com/v1/accounts/" + myAccountID + "/events",
        //Define body of POST request.
        body: rawN,
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
`;

    return data;
}

export { historicErrorScript };
/* eslint no-use-before-define: 0 */
// -------------------------------------------------------------------
// This script is a sample to install using a Synthetic Script Monitor
// to work in combination with a APS(Api-Status) Touchpoint Type
// ------------------------------------------------------------------
var myAccountID = NEWRELIC-ACCOUNT-ID;
var myInsertKey = 'HERE-NEWRELIC-INSERT-API-KEY';
//Define your authentication credentials
var baseURL = 'https://api.zt-ft.com/';
var pathURL = 'glp-op/health/connections';
var subKey = 'CLIENT-SERVICE-API-KEY';
var options = {
    uri: baseURL + pathURL,
    headers: {
    'Ocp-Apim-Subscription-Key': subKey,
    'Content-Type': 'application/json'
   }
};
function callback (err, response, body){
   var events = [];
   var event = null;
   bodyParsed = JSON.parse(body);
   event = {
    eventType: "PathpointKpiHealth",
    databaseStatus: bodyParsed.database.status,
    databaseStatusCode: bodyParsed.database.statusCode,
    keoStatus: bodyParsed.keo.status,
    keoStatusCode: bodyParsed.keo.statusCode,
    tpStatus: bodyParsed.tp.status,
    tpStatusCode: bodyParsed.tp.statusCode,
    herokuCopecStatus: bodyParsed.herokuCopec.status,
    herokuCopecStatusCode: bodyParsed.herokuCopec.statusCode,
    herokuMexicoStatus: bodyParsed.herokuMexico.status,
    herokuMexicoStatusCode: bodyParsed.herokuMexico.statusCode,
    mazStatus: bodyParsed.maz.status,
    mazStatusCode: bodyParsed.maz.statusCode,
    isStatus: bodyParsed.is.status,
    isStatusCode: bodyParsed.is.statusCode
  };
  console.log(event);
  events.push(event);
  var raw5 = JSON.stringify(events);
  var options5 = {
    url: "https://insights-collector.newrelic.com/v1/accounts/" + myAccountID + "/events",
    body: raw5,
    headers: {
      'X-Insert-Key': myInsertKey,
      'Content-Type': 'application/json'
    }
  };
  $http.post(options5, function(error, response, body) {
    console.log(response.statusCode + " status code WORK!!");
    var info = JSON.parse(body);
    console.log(info);
  });
}

$http.get(options,callback);
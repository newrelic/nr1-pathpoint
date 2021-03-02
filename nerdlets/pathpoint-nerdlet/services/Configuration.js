import {
    AccountStorageMutation,
    AccountsQuery,
    AccountStorageQuery
} from 'nr1';
import { historicErrorScript } from '../../../synthetics/createHistoricErrorScript';
import NerdletData from "../../../nr1.json";

export default class Configuration {
    measureNames = [
        "STANDARD-APM-COUNT-AND",
        "ERROR-PERCENTAGE-QUERY",
        "APDEX-QUERY",
        "UNIQUE-SESSIONS-COUNT-QUERY",
        "COUNT-SESSIONS-FACET-QUERY",
        "FULL-OPEN-QUERY"
    ]
    constructor(states) {
        this.accountId = null;
        this.pathpointId = NerdletData.id;
        this.LastStorageVersion = 0;
        this.states = states;
        this.configuration = {
            pathpointVersion: null,
            banner_kpis: [],
            stages: []
        }
    }

    async getAccountID() {
        return new Promise((resolve, reject) => {
            AccountsQuery.query()
                .then(({ data }) => {
                    this.accountId = data[0].id;
                    //console.log("AccountID:", this.accountId);
                    return resolve();
                })
                .catch((err) => {
                    console.log(err);
                    return reject(err)
                });
        });
    }

    async checkVersion() {
        return new Promise((resolve, reject) => {
            AccountStorageQuery.query({
                accountId: this.accountId,
                collection: 'pathpoint',
                documentId: 'version',
            }).then(({ data }) => {
                if (data != null) {
                    //console.log("INICIANDO-READ-CURRENT-VERSION:",data.Version);
                    this.LastStorageVersion = data.Version;
                }
                return resolve();
            }).catch((error) => {
                return reject(error)
            });
        });
    }

    async getInitialDataFromStorage() {
        return new Promise((resolve, reject) => {
            AccountStorageQuery.query({
                accountId: this.accountId,
                collection: 'pathpoint',
                documentId: 'newViewJSON',
            }).then(({ data }) => {
                if (data != null) {
                    // IF data Exist
                    console.log('READ NEW VIEW FROM STORAGE');
                    this.states.stages = data.ViewJSON;
                    this.states.banner_kpis = data.BannerKpis;
                }
                return resolve();
            });
        });
    }

    async loadInitialData() {
        console.log('INICIANDO(', this.states.version, ')');
        await this.getAccountID();
        await this.checkVersion();
        if (this.LastStorageVersion == this.states.version) {
            console.log('INICIANDO-CARGANDO-ALL-DATA-FROM-STORAGE');
            await this.getInitialDataFromStorage();
        } else {
            console.log('GRABANDO-AL-STORAGE-ALL-DATA');
            this.setInitialDataViewToStorage();
        }
    }

    setInitialDataViewToStorage() {
        // Write a document
        AccountStorageMutation.mutate({
            accountId: this.accountId,
            actionType: AccountStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
            collection: 'pathpoint',
            documentId: 'newViewJSON',
            document: {
                ViewJSON: this.states.stages,
                BannerKpis: this.states.banner_kpis
            },
        }).then(({ data }) => {
            console.log('SAVE NEW VIEW TO STORAGE');
        });
    }

    setInitialDataTouchpointsToStorage() {
        // Write a document
        AccountStorageMutation.mutate({
            accountId: this.accountId,
            actionType: AccountStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
            collection: 'pathpoint',
            documentId: 'touchpoints',
            document: {
                TouchPoints: this.states.updateData.touchPoints
            },
        }).then(({ data }) => {
            console.log('SAVE NEW TOUCHPOINTS TO STORAGE');
        });
    }

    getCurrentHistoricErrorScript() {
        let data = historicErrorScript();
        let pathpointId = `var pathpointId = "` + this.pathpointId + `";
        `;
        return pathpointId + data.header + this.createNrqlQueriesForHistoricErrorScript() + data.footer;
    }

    getCurrentConfigurationJSON() {
        console.log("Cargando data de Configuracion");
        this.readPathpointConfig();
        return JSON.stringify(this.configuration, null, 4);
    }

    waitToUpdate() {
        if (!this.states.updateData.loading) {
            console.log("UPDATE-NOW");
            this.states.updateData.loading = true;
            this.updateNewConfiguration();
            console.log("DATOS ACTUALIZADOS.");
            console.log("GUI UPDATE");
            this.updateNewGui();
            this.states.updateData.loading = false;
        } else {
            console.log("WAITING-TO-UPDATE");
            setTimeout(() => {
                this.waitToUpdate();
            }, 1000);
        }
    }

    setConfigurationJSON(configuration, updateNewGui) {
        this.updateNewGui = updateNewGui;
        this.configurationJSON = JSON.parse(configuration);
        this.waitToUpdate();
    }

    updateNewConfiguration() {

        let stageDef = null;
        let sub_stepDef = null;
        let stepDef = null;
        let tpDef = null;
        let tpDef2 = null;
        let measure = null;
        let tpIndex = 1;
        let stageIndex = 1;
        let substepIndex = 1;
        //TO DO  : JSON SCHEMA VCALIDATOR
        this.states.stages.length = 0; // clear the OBJ
        this.states.updateData.touchPoints.length = 0; // clear the OBJ
        this.states.updateData.touchPoints.push(
            {
                index: 0,
                country: "PRODUCTION",
                touchpoints: []
            }
        );
        this.states.banner_kpis.length = 0;
        let kpi = null;
        this.configurationJSON.banner_kpis.forEach(banner_kpi => {
            kpi = {
                "description": banner_kpi.description,
                "prefix": banner_kpi.prefix,
                "suffix": banner_kpi.suffix,
                "query": banner_kpi.query,
                "type": 100,
                "value": 0
            }
            this.states.banner_kpis.push(kpi);
        });
        this.configurationJSON.stages.forEach(stage => {
            stageDef = {
                index: stageIndex,
                title: stage.title,
                latencyStatus: false,
                status_color: "good",
                gout_enable: false,
                gout_quantity: 150,
                money_enabled: false,
                trafficIconType: "traffic",
                money: "",
                icon_active: 0,
                icon_description: "star",
                icon_visible: false,
                congestion: {
                    value: 0,
                    percentage: 0,
                },
                capacity: 0,
                total_count: 0,
                active_dotted: stage.active_dotted,
                active_dotted_color: "#828282",
                steps: [],
                touchpoints: []
            }
            // Adding STEPS
            substepIndex = 1;
            stage.steps.forEach(step => {
                stepDef = {
                    value: "",
                    sub_steps: []
                }
                step.values.forEach(sub_step => {
                    sub_stepDef = {
                        index: substepIndex,
                        id: sub_step.id,
                        canary_state: false,
                        latency: true,
                        value: sub_step.title,
                        dark: false,
                        sixth_sense: false,
                        history_error: false,
                        dotted: false,
                        highlighted: false,
                        error: false,
                        index_stage: stageIndex,
                        relationship_touchpoints: []
                    }
                    stepDef.sub_steps.push(sub_stepDef);
                    substepIndex++;
                });
                stageDef.steps.push(stepDef);
            });
            // Adding Touchpoints
            stage.touchpoints.forEach(tp => {
                tpDef = {
                    index: tpIndex,
                    stage_index: stageIndex,
                    status_on_off: tp.status_on_off,
                    active: false,
                    value: tp.title,
                    highlighted: false,
                    error: false,
                    history_error: false,
                    sixth_sense: false,
                    sixth_sense_url: [[]],
                    countrys: [0],
                    dashboard_url: tp.dashboard_url,
                    relation_steps: tp.related_steps.split(",")
                }
                tpDef2 = {
                    stage_index: stageIndex,
                    value: tp.title,
                    touchpoint_index: tpIndex,
                    status_on_off: tp.status_on_off,
                    relation_steps: tp.related_steps.split(","),
                    measure_points: []
                }
                tp.queries.forEach(query => {
                    if (query.type == this.measureNames[0]) {
                        measure = {
                            type: 0,
                            query: query.query,
                            count: 0
                        }
                    } else if (query.type == this.measureNames[1]) {
                        measure = {
                            type: 1,
                            query: query.query,
                            error_threshold: "5",
                            error_percentage: 0
                        }
                    } else if (query.type == this.measureNames[2]) {
                        measure = {
                            type: 2,
                            query: query.query,
                            apdex: 0,
                            apdex_time: "50"
                        }
                    } else if (query.type == this.measureNames[3]) {
                        measure = {
                            type: 3,
                            query: query.query,
                            count: 0
                        }
                    } else if (query.type == this.measureNames[4]) {
                        measure = {
                            type: 4,
                            query: query.query,
                            sessions: []
                        }
                    } else if (query.type == this.measureNames[5]) {
                        measure = {
                            type: 20,
                            query: query.query,
                            error_threshold: query.error_threshold,
                            count: 0,
                            error_percentage: 0
                        }
                    }
                    tpDef2.measure_points.push(measure);
                });
                stageDef.touchpoints.push(tpDef);
                this.states.updateData.touchPoints[0].touchpoints.push(tpDef2);
                tpIndex++;
            });

            this.states.stages.push(stageDef);
            stageIndex++;
            tpIndex = 1;
        });
        this.updateTouchpointsRelationship();
        this.setInitialDataViewToStorage();
        this.setInitialDataTouchpointsToStorage();
        this.states.updateData.updateTouchpointCopy();
        this.states.updateData.stages = this.states.stages;
        this.states.updateData.banner_kpis = this.banner_kpis;
        //console.log(this.states.stages);
        //console.log(this.states.updateData.touchPoints);
    }

    updateTouchpointsRelationship() {
        //Touchpoints Relationship
        this.states.updateData.touchPoints[0].touchpoints.forEach(touchpoint => {
            var indexList = [];
            touchpoint.relation_steps.forEach(value => {
                indexList.push(this.getIndexStep(touchpoint.stage_index, value));
            });
            touchpoint.relation_steps = indexList;
        });
        this.states.stages.forEach(stage => {
            stage.touchpoints.forEach(touchpoint => {
                var indexList = [];
                touchpoint.relation_steps.forEach(value => {
                    indexList.push(this.getIndexStep(touchpoint.stage_index, value));
                });
                touchpoint.relation_steps = indexList;
                // SET Steps Relationship
                this.setStepsRelationship(touchpoint.stage_index, indexList, touchpoint.index);
            });
        });
        //console.log(this.states.updateData.touchPoints[0].touchpoints);
        //console.log(this.states.stages);
    }

    getIndexStep(stage_index, stepId) {
        //console.log('Stage:',stage_index,',stepId:',stepId);
        let found = false;
        let index = 0;
        this.states.stages[stage_index - 1].steps.some(step => {
            found = false;
            step.sub_steps.some(sub_step => {
                if (sub_step.id == stepId) {
                    index = sub_step.index;
                    found = true;
                    return true;
                }
            });
            if (found) {
                return true;
            }
        });
        return index;
    }

    setStepsRelationship(stage_index, indexList, touchpoint_index) {
        let found = false;
        for (var i = 0; i < indexList.length; i++) {
            this.states.stages[stage_index - 1].steps.some(step => {
                found = false;
                step.sub_steps.some(sub_step => {
                    if (sub_step.index == indexList[i]) {
                        sub_step.relationship_touchpoints.push(touchpoint_index);
                        found = true;
                        return true;
                    }
                });
                if (found) {
                    return true;
                }
            });
        }
    }

    getRelatedSteps(stage_index, index) {
        let related_steps = [];
        this.states.updateData.touchPoints.forEach(element => {
            if (element.index == this.states.updateData.city) {
                element.touchpoints.some(touchpoint => {
                    if (touchpoint.stage_index == stage_index && touchpoint.touchpoint_index == index) {
                        touchpoint.relation_steps.forEach(value => {
                            related_steps.push(value);
                        });
                        return true;
                    }
                });
            }
        });
        return this.getStepsIds(stage_index, related_steps);
    }

    getStepsIds(stage_index, related_steps) {
        let relatedIds = '';
        let found = false;
        for (var i = 0; i < related_steps.length; i++) {
            this.states.stages[stage_index - 1].steps.some(step => {
                found = false;
                step.sub_steps.some(sub_step => {
                    if (sub_step.index == related_steps[i]) {
                        if (relatedIds != '') { relatedIds += ','; }
                        relatedIds += sub_step.id;
                        found = true;
                        return true;
                    }
                });
                if (found) { return true; }
            });
        }
        return relatedIds;
    }

    getTouchpointQueryes(stage_index, index) {
        let queries = [];
        this.states.updateData.touchPoints.forEach(element => {
            if (element.index == this.states.updateData.city) {
                element.touchpoints.some(touchpoint => {
                    if (touchpoint.stage_index == stage_index && touchpoint.touchpoint_index == index) {
                        touchpoint.measure_points.forEach(measure => {
                            if (measure.type == 0) {
                                queries.push({ type: this.measureNames[0], query: measure.query, error_threshold: measure.error_threshold });
                            } else if (measure.type == 1) {
                                queries.push({ type: this.measureNames[1], query: measure.query, apdex_time: measure.apdex_time });
                            } else if (measure.type == 2) {
                                queries.push({ type: this.measureNames[2], query: measure.query });
                            } else if (measure.type == 3) {
                                queries.push({ type: this.measureNames[3], query: measure.query });
                            } else if (measure.type == 20) {
                                queries.push({ type: this.measureNames[5], query: measure.query, error_threshold: measure.error_threshold });
                            }
                        });
                        return true;
                    }
                });
            }
        });
        return queries;
    }

    readPathpointConfig() {
        let i = 0;
        let line = 0;
        let kpi = null;
        this.configuration.pathpointVersion = this.states.version;
        this.configuration.banner_kpis.length = 0;
        for (let i = 0; i < this.states.banner_kpis.length; i++) {
            kpi = {
                "description": this.states.banner_kpis[i].description,
                "prefix": this.states.banner_kpis[i].prefix,
                "suffix": this.states.banner_kpis[i].suffix,
                "query": this.states.banner_kpis[i].query
            }
            this.configuration.banner_kpis.push(kpi);
        }
        this.configuration.stages.length = 0;
        this.states.stages.forEach(stage => {
            this.configuration.stages.push({ title: stage.title, active_dotted: stage.active_dotted, steps: [], touchpoints: [] });
            i = this.configuration.stages.length;
            line = 0;
            //FILL STEPS
            stage.steps.forEach(step => {
                var s_steps = [];
                var ssn = 1;
                line++;
                step.sub_steps.forEach(sub_step => {
                    //step_id = 'ST'+i+'-LINE'+line+'-SS'+ssn;
                    s_steps.push({ title: sub_step.value, id: sub_step.id });
                    ssn++;
                });
                this.configuration.stages[i - 1].steps.push({ line: line, values: s_steps });
            });
            // FILL TOUCHPOINTS
            stage.touchpoints.forEach(tp => {
                this.configuration.stages[i - 1].touchpoints.push({
                    title: tp.value,
                    status_on_off: tp.status_on_off,
                    dashboard_url: tp.dashboard_url,
                    related_steps: this.getRelatedSteps(tp.stage_index, tp.index),
                    queries: this.getTouchpointQueryes(tp.stage_index, tp.index),
                });
            });
        });
    }

    createNrqlQueriesForHistoricErrorScript() {
        let data = 'var raw1 = JSON.stringify({"query":"{ actor {';
        let i = 0;
        let n = 1;
        let countBreak = 20;
        this.states.updateData.touchPoints.forEach(element => {
            if (element.index == this.states.updateData.city) {
                element.touchpoints.forEach(touchpoint => {
                    data += ' measure_' + touchpoint.stage_index + '_' + touchpoint.touchpoint_index + '_' + touchpoint.measure_points[0].type + ': account(id: "+myAccountID+") { nrql(query: \\"';
                    if (touchpoint.measure_points[0].type == 20) {
                        var query2 = touchpoint.measure_points[0].query;
                    } else {
                        var query = touchpoint.measure_points[0].query.split(" ");
                        var query2 = "SELECT count(*), percentage(count(*), WHERE error is true) as percentage";
                        for (var wi = 2; wi < query.length; wi++) {
                            query2 += " " + query[wi];
                        }
                    }
                    data += query2;
                    data += ' SINCE 5 minutes AGO';
                    data += '\\", timeout: 10) {results }}';
                    i++;
                    if (i == countBreak) {
                        i = 0;
                        data += '}}","variables":""});';
                        data += `
`;
                        n++;
                        data += 'var raw' + n + ' = JSON.stringify({"query":"{ actor {';
                    }
                });
                data += '}}","variables":""});';
                data += `
`;
            }
        });
        for (var w = 1; w <= n; w++) {
            data += `
var graphqlpack`+ w + ` = {
    headers: {
        "Content-Type": "application/json",
        "API-Key": graphQLKey
    },
    url: 'https://api.newrelic.com/graphql',
    body: raw`+ w + `
};

var return`+ w + ` = null;

`;
        }
        for (var w = 1; w < n; w++) {
            data += `
function callback`+ w + `(err, response, body) {
    return`+ w + ` = JSON.parse(body);
    $http.post(graphqlpack`+ (w + 1) + `, callback` + (w + 1) + `);
} 

`;
        }
        data += `
function callback`+ n + `(err, response, body) {
    return`+ n + ` = JSON.parse(body);
    var events = [];
    var event = null;
    var c = null;
`;
        for (var w = 1; w <= n; w++) {
            data += `
    for (const [key, value] of Object.entries(return`+ w + `.data.actor)) {
        c = key.split("_");
        if (value.nrql.results != null) {
            if(c[3]=='0'){
                event = {
                    "eventType": "PathpointHistoricErrors",
                    "pathpointId": pathpointId,
                    "stage_index": parseInt(c[1]),
                    "touchpoint_index": parseInt(c[2]),
                    "count": value.nrql.results[0].count,
                    "percentage": value.nrql.results[0].percentage
                }
            }else{
                event = {
                    "eventType": "PathpointHistoricErrors",
                    "pathpointId": pathpointId,
                    "stage_index": parseInt(c[1]),
                    "touchpoint_index": parseInt(c[2]),
                    "count": value.nrql.results[0].R1,
                    "percentage": value.nrql.results[0].R2
                }
            }
            
            console.log(event);
            events.push(event);
        }
    }

`;
        }
        return data;
    }
}

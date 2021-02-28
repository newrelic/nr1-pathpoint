import {
    AccountStorageMutation,
    AccountsQuery,
    AccountStorageQuery
} from 'nr1';
import { NerdGraphQuery } from 'nr1';
import TouchPoints from "../config/touchPoints.json";
import Capacity from "../config/capacity.json";
import NerdletData from "../../../nr1.json";

export default class UpdateData {
    constructor(stages, version) {
        this.minPercentageError = 100;
        this.historicErrorsDays = 8;
        this.historicErrorsHighLightPercentage = 26;
        this.stages = stages;
        this.version = version;
        this.accountId = null;
        this.loading = false;
        this.graphQlmeasures = [];
        this.touchPoints = TouchPoints;
        this.pathpointID = NerdletData.id;
        this.touchPointsCopy = null;
        this.capacity = Capacity;
        this.city = 0;
        this.capacityUpdatePending = false;
        this.stepsByStage = this.getStepsByStage();
        this.getAccountId();

    }

    async startUpdate(timeRange, city, getOldSessions, stages, banner_kpis) {
        this.stages = stages;
        this.banner_kpis = banner_kpis;
        if (this.accountId == null) {
            return;
        }
        console.log("Oldsession:", getOldSessions);
        this.loading = true;
        // CALL API FETCH LEVELS
        this.timeRange = timeRange;
        this.city = city;
        this.getOldSessions = getOldSessions;
        await this.touchPointsUpdate();
        await this.updateMerchatKpi();
        this.calculateUpdates();
        this.updateMaxCapacity();
        this.loading = false;
        //console.log(this.touchPoints);
        console.log('finish updates.');
    }

    getAccountId() {
        AccountsQuery.query()
            .then(({ data }) => {
                this.accountId = data[0].id;
                console.log("AccountID:", this.accountId);
                this.checkVersion();
                //this.setDBmaxCapacity();  // Uncomment to RESET with JSON values, comment the next line
                this.getDBmaxCapacity();
                this.getStorageHistoricErrorsParams();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    checkVersion() {
        // Read a document
        AccountStorageQuery.query({
            accountId: this.accountId,
            collection: 'pathpoint',
            documentId: 'version',
        }).then(({ data }) => {
            if (data != null) {
                // IF data Exist
                console.log('READ STORAGE VERSION');
                if (data.Version != this.version) {
                    this.setStorageTouchpoints();
                    this.setVersion();
                    //this.setTouchpointsStatus();
                } else {
                    this.getStorageTouchpoints();
                }
            } else {
                this.setVersion();
            }
        });
    }

    setVersion() {
        // Write a document
        AccountStorageMutation.mutate({
            accountId: this.accountId,
            actionType: AccountStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
            collection: 'pathpoint',
            documentId: 'version',
            document: {
                Version: this.version
            },
        }).then(({ data }) => {
            console.log('SAVE VERSION TO STORAGE');
            console.log(data.nerdStorageWriteDocument.Version);
        });
    }

    updateTouchpointCopy() {
        this.touchPointsCopy = JSON.parse(JSON.stringify(this.touchPoints)); // clone the touchpoints with new reference
    }

    getStorageTouchpoints() {
        // Read a document
        AccountStorageQuery.query({
            accountId: this.accountId,
            collection: 'pathpoint',
            documentId: 'touchpoints',
        }).then(({ data }) => {
            if (data != null) {
                // IF data Exist
                console.log('READ STORAGE TOUCHPOINTS');
                //console.log(data.TouchPoints);
                this.touchPoints = data.TouchPoints;
                this.touchPointsCopy = JSON.parse(JSON.stringify(this.touchPoints)); // clone the touchpoints with new reference
                this.getMinPercentageError();
                this.setTouchpointsStatus();
            } else {
                this.setStorageTouchpoints();
            }
        });
    }

    setStorageTouchpoints() {
        // Write a document
        this.touchPointsCopy = JSON.parse(JSON.stringify(this.touchPoints));
        AccountStorageMutation.mutate({
            accountId: this.accountId,
            actionType: AccountStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
            collection: 'pathpoint',
            documentId: 'touchpoints',
            document: {
                TouchPoints: this.touchPoints
            },
        }).then(({ data }) => {
            if (data != null) {
                console.log('SAVE TOUCHPOINTS TO STORAGE');
                this.getMinPercentageError();
                //console.log(data.nerdStorageWriteDocument.TouchPoints);
            }
        });
    }

    getDBmaxCapacity() {
        // Read a document
        AccountStorageQuery.query({
            accountId: this.accountId,
            collection: 'pathpoint',
            documentId: 'maxCapacity',
        }).then(({ data }) => {
            if (data != null) {
                // IF data Exist
                console.log('READ MAX CAPACITY');
                this.capacity = data.Capacity;
            } else {
                this.setDBmaxCapacity();
            }
        });
    }

    setDBmaxCapacity() {
        // Write a document
        AccountStorageMutation.mutate({
            accountId: this.accountId,
            actionType: AccountStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
            collection: 'pathpoint',
            documentId: 'maxCapacity',
            document: {
                Capacity: this.capacity
            },
        }).then(({ data }) => {
            if (data != null) {
                console.log('SAVE MAX CAPACITY');
                //console.log(data.nerdStorageWriteDocument.Capacity);
            }
        });
    }

    getMinPercentageError() {
        this.minPercentageError = 100;
        this.touchPoints.forEach(element => {
            if (element.index == this.city) {
                element.touchpoints.forEach(touchpoint => {
                    touchpoint.measure_points.forEach(measure => {
                        if (measure.type == 0 || measure.type == 20) {
                            if (measure.error_threshold < this.minPercentageError) {
                                this.minPercentageError = measure.error_threshold;
                            }
                        }
                    });
                });
            }
        });
        console.log("CurrentMinPercentageError:", this.minPercentageError);
    }

    getStorageHistoricErrorsParams() {
        // Read a document
        AccountStorageQuery.query({
            accountId: this.accountId,
            collection: 'pathpoint',
            documentId: 'HistoricErrorsParams',
        }).then(({ data }) => {
            if (data != null) {
                // IF data Exist
                console.log('READ HistoricErrorsParams');
                this.historicErrorsDays = data.historicErrorsDays;
                this.historicErrorsHighLightPercentage = data.historicErrorsHighLightPercentage;
            } else {
                this.setStorageHistoricErrorsParams();
            }
        });
    }

    setStorageHistoricErrorsParams() {
        // Write a document
        AccountStorageMutation.mutate({
            accountId: this.accountId,
            actionType: AccountStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
            collection: 'pathpoint',
            documentId: 'HistoricErrorsParams',
            document: {
                historicErrorsDays: this.historicErrorsDays,
                historicErrorsHighLightPercentage: this.historicErrorsHighLightPercentage
            },
        }).then(({ data }) => {
            if (data != null) {
                console.log('SAVE HistoricErrorsParams');
                //console.log(data.nerdStorageWriteDocument.Capacity);
            }
        });
    }


    updateHistoricParameters(days, percentage) {
        this.historicErrorsDays = days;
        this.historicErrorsHighLightPercentage = percentage;
        this.setStorageHistoricErrorsParams();
    }

    getHistoricParameters() {
        let values = { days: 0, percentage: 0 }
        values.days = this.historicErrorsDays;
        values.percentage = this.historicErrorsHighLightPercentage;
        return values;
    }

    async readHistoricErrors() {

        let query = "SELECT count(*) FROM PathpointHistoricErrors WHERE pathpoint_id=" + this.pathpointId + " percentage>" +
            this.minPercentageError +
            " FACET stage_index,touchpoint_index,percentage LIMIT MAX" +
            " SINCE " + this.historicErrorsDays + " days ago";
        let gql = `{
            actor { account(id: ${this.accountId}) {
                nrql(query: "${query}", timeout: 10) {
                    results
                }
            }}}`;
        console.log(gql);
        const { data, error } = await NerdGraphQuery.query({ query: gql });
        if (error) {
            console.log('Nerdgraph Error:', error);
        }
        if (data.actor.account.nrql != null) {
            //console.log(data.actor.account.nrql);
            this.calculateHistoricErrors(data.actor.account.nrql);
        }
    }

    calculateHistoricErrors(nrql) {
        let results = nrql.results;
        let key = '';
        var historicErrors = {};
        var errorLength = 0;
        //console.log(results.length);
        for (let i = 0; i < results.length; i++) {
            key = 'tp_' + results[i].facet[0] + '_' + results[i].facet[1];

            if (results[i].facet[2] >= this.getTouchpointErrorThreshold(results[i].facet[0], results[i].facet[1])) {
                //console.log('errorTH:',results[i].facet[2]);
                if (!(key in historicErrors)) {
                    errorLength++;
                    historicErrors[key] = results[i].count;
                } else {
                    historicErrors[key] += results[i].count;
                }
            }
        }
        //console.log(errorLength);
        const sortable = Object.fromEntries(
            Object.entries(historicErrors).sort(([, a], [, b]) => b - a)
        );
        //errorLength 100
        //x this.historicErrorsHighLightPercentage
        let NumOfErrorsToShow = Math.round(this.historicErrorsHighLightPercentage * errorLength / 100);
        let count = 0;
        console.log("errorLength=", errorLength);
        console.log("NumOfErrorsToShow=", NumOfErrorsToShow);
        this.clearTouchpointHistoricError();
        for (const [key, value] of Object.entries(sortable)) {
            count++;
            if (count <= NumOfErrorsToShow) {
                var c = key.split("_");
                this.setTouchpointHistoricError(c[1], c[2]);
                console.log(key, value);
            }
        }

    }

    getTouchpointErrorThreshold(stage_index, touchpoint_index) {
        let value = 0;
        this.touchPoints.some(element => {
            if (element.index == this.city) {
                element.touchpoints.some(touchpoint => {
                    if (touchpoint.stage_index == stage_index && touchpoint.touchpoint_index == touchpoint_index) {
                        touchpoint.measure_points.some(measure => {
                            if (measure.type == 0 || measure.type == 20) {
                                value = measure.error_threshold;
                                return true;
                            }
                        });
                        return true;
                    }
                });
                return true;
            }
        });
        //console.log('SI=',stage_index,'TI=',touchpoint_index,'V=',value);
        return value;
    }

    clearTouchpointHistoricError() {
        this.stages.forEach(stage => {
            stage.touchpoints.forEach(touchpoint => {
                touchpoint.history_error = false;
            });
        });
    }

    setTouchpointHistoricError(stage_index, touchpoint_index) {
        this.stages.some(stage => {
            if (stage.index == stage_index) {
                stage.touchpoints.some(touchpoint => {
                    if (touchpoint.index == touchpoint_index) {
                        touchpoint.history_error = true;
                        return true;
                    }
                });
                return true;
            }
        });
    }

    setTouchpointsStatusFromMainContainer(stages) {
        this.stages = stages
        this.setTouchpointsStatus()
    }

    setTouchpointsStatus() {
        if (this.touchPoints != null) {
            this.touchPoints.forEach(element => {
                if (element.index == this.city) {
                    element.touchpoints.forEach(touchpoint => {
                        this.updateTouchpointStatus(touchpoint);
                    });
                }
            });
        }
    }

    updateTouchpointStatus(touchpoint) {
        this.stages.some(stage => {
            if (stage.index == touchpoint.stage_index) {
                stage.touchpoints.some(tp => {
                    if (tp.index == touchpoint.touchpoint_index) {
                        tp.status_on_off = touchpoint.status_on_off;
                        return true;
                    }
                });
                return true;
            }
        });
    }

    checkMaxCapacity(currentValue, stage) {
        let timeRange = "STAGES";
        for (const [key, value] of Object.entries(this.capacity[this.city])) {
            if (key == timeRange) {
                var result = Math.max(value[stage], currentValue);
                if (value[stage] < currentValue) {
                    console.log("READY-TO-UPDATE-CAPACITY")
                    this.capacityUpdatePending = true;
                    value[stage] = currentValue * 2;
                }
                return result;
            }
        }
        return currentValue;
    }

    updateMaxCapacity() {
        if (this.capacityUpdatePending) {
            this.capacityUpdatePending = false;
            this.setDBmaxCapacity();
        }
    }

    timeRangeTransform(timeRange, sessionsRange) {
        let time_start = 0;
        let time_end = 0;
        if (timeRange == "5 MINUTES AGO") {
            if (sessionsRange && this.getOldSessions) {
                time_start = Math.floor(Date.now() / 1000) - 10 * 59; // 10min-10seg
                time_end = Math.floor(Date.now() / 1000) - 5 * 58; // 5min - 10seg
                return time_start + ' UNTIL ' + time_end;
            }
            return timeRange;
        }
        switch (timeRange) {
            case "30 MINUTES AGO":
                time_start = Math.floor(Date.now() / 1000) - 40 * 60;
                time_end = Math.floor(Date.now() / 1000) - 30 * 60;
                break;
            case "60 MINUTES AGO":
                time_start = Math.floor(Date.now() / 1000) - 70 * 60;
                time_end = Math.floor(Date.now() / 1000) - 60 * 60;
                break;
            case "3 HOURS AGO":
                time_start = Math.floor(Date.now() / 1000) - 3 * 60 * 60 - 10 * 60;
                time_end = Math.floor(Date.now() / 1000) - 3 * 60 * 60;
                break;
            case "6 HOURS AGO":
                time_start = Math.floor(Date.now() / 1000) - 6 * 60 * 60 - 10 * 60;
                time_end = Math.floor(Date.now() / 1000) - 6 * 60 * 60;
                break;
            case "12 HOURS AGO":
                time_start = Math.floor(Date.now() / 1000) - 12 * 60 * 60 - 10 * 60;
                time_end = Math.floor(Date.now() / 1000) - 12 * 60 * 60;
                break;
            case "24 HOURS AGO":
                time_start = Math.floor(Date.now() / 1000) - 24 * 60 * 60 - 10 * 60;
                time_end = Math.floor(Date.now() / 1000) - 24 * 60 * 60;
                break;
            case "3 DAYS AGO":
                time_start = Math.floor(Date.now() / 1000) - 3 * 24 * 60 * 60 - 10 * 60;
                time_end = Math.floor(Date.now() / 1000) - 3 * 24 * 60 * 60;
                break;
            case "7 DAYS AGO":
                time_start = Math.floor(Date.now() / 1000) - 3 * 24 * 60 * 60 - 10 * 60;
                time_end = Math.floor(Date.now() / 1000) - 3 * 24 * 60 * 60;
                break;
            default:
                return timeRange;
        }
        if (sessionsRange && this.getOldSessions) {
            time_start = time_start - 10 * 59;
            time_end = time_end - 5 * 58;
        }
        return time_start + ' UNTIL ' + time_end;
    }

    async updateMerchatKpi() {
        console.log('Updating Banner KPI ');
        this.graphQlmeasures.length = 0; // clear the ARRAY
        for (let i = 0; i < this.banner_kpis.length; i++) {
            //console.log("KPI_Query[",i,"]=",this.banner_kpis[i].query);
            this.graphQlmeasures.push([this.banner_kpis[i], this.banner_kpis[i].query]);
        }
        await this.nrdbQuery();
    }


    async touchPointsUpdate() {
        console.log('touchPointsUpdate ==>  City:' + this.city + ' TimeRange:' + this.timeRange);
        this.graphQlmeasures.length = 0; // clear the ARRAY
        this.touchPoints.forEach(element => {
            if (element.index == this.city) {
                element.touchpoints.forEach(touchpoint => {
                    if (touchpoint.status_on_off) {
                        touchpoint.measure_points.forEach(measure => {
                            this.fetchMeasure(measure);
                        });
                    }
                });
            }
        });
        //console.log(this.graphQlmeasures);
        if (this.graphQlmeasures.length > 0) {
            await this.nrdbQuery();
        }
    }

    fetchMeasure(measure) {
        if (measure.type == 0) {
            let query = measure.query
                + " SINCE " + this.timeRangeTransform(this.timeRange, false);
            //console.log(query);
            this.graphQlmeasures.push([measure, query]);
        } else if (measure.type == 1) {
            let query = measure.query
                + " SINCE " + this.timeRangeTransform(this.timeRange, false);
            this.graphQlmeasures.push([measure, query]);
            //console.log(query);
        } else if (measure.type == 2) {
            let query = measure.query
                + " SINCE " + this.timeRangeTransform(this.timeRange, false);
            this.graphQlmeasures.push([measure, query]);
            //console.log(query); 
        } else if (measure.type == 3 && measure.query != '') {
            let query = measure.query
                + " SINCE " + this.timeRangeTransform(this.timeRange, false);
            this.graphQlmeasures.push([measure, query]);
            //console.log(query); 
        } else if (measure.type == 4 && measure.query != '') {
            let query = measure.query
                + " SINCE " + this.timeRangeTransform(this.timeRange, true);
            this.graphQlmeasures.push([measure, query]);
            //console.log(query); 
        } else if (measure.type == 20) { // LOG measure Type, it uses COMPLETE QUERY
            let query = measure.query
                + " SINCE " + this.timeRangeTransform(this.timeRange, false);
            this.graphQlmeasures.push([measure, query]);
            //console.log(query); 
        }
    }

    async nrdbQuery() {
        const { data, errors, n } = await this.evaluateMeasures();
        if (n == 0) { return 0 } // SI no hay querys NO hace la llamada al GraphQL
        if (errors && errors.length > 0) {
            console.log('Nerdgraph Error:', errors);
        }
        // Set the values
        //console.log(data);
        for (const [key, value] of Object.entries(data.actor)) {
            var c = key.split("_");
            if (c[0] == 'measure') {
                var measure = this.graphQlmeasures[Number(c[1])][0];
                if (measure.type == 0 && value.nrql != null) {
                    measure.count = value.nrql.results[0].count;
                } else if (measure.type == 1 && value.nrql != null) {
                    measure.error_percentage = value.nrql.results[0].percentage == null ? 0 : value.nrql.results[0].percentage;
                } else if (measure.type == 2 && value.nrql != null) {
                    //console.log("APDEX:", value.nrql.results[0].score);
                    measure.apdex = value.nrql.results[0].score;
                } else if (measure.type == 3 && value.nrql != null) {
                    measure.count = value.nrql.results[0].session;
                    //console.log("SessionCount:",measure.count);
                } else if (measure.type == 4 && value.nrql != null) {
                    //console.log("Sesions:",value.nrql.results);
                    this.setSessions(measure, value.nrql.results);
                } else if (measure.type == 20 && value.nrql != null) {
                    //console.log("Log Measure:",value.nrql.results[0]);
                    this.setLogsMeasure(measure, value.nrql.results[0]);
                } else if (measure.type == 100 && value.nrql != null) {
                    //console.log("KPI result:",value.nrql.results[0]);
                    measure.value = value.nrql.results[0].value;
                }
            }
        }
    }

    async evaluateMeasures() {
        let gql = `{
         actor {`;
        let alias = '';
        let n = 0;
        const itemsByPage = 60;
        if (this.graphQlmeasures.length > itemsByPage) {
            let dataReturn = {
                actor: {}
            };
            let errorsReturn = [];
            let control = 0;
            const pages = Math.ceil(this.graphQlmeasures.length / itemsByPage);
            for (let i = 0; i < pages; i++) {
                let dataSplit = this.graphQlmeasures.slice(control, control + itemsByPage);
                dataSplit.forEach(nrql => {
                    alias = 'measure_' + n;
                    n += 1;
                    gql += `${alias}: account(id: ${this.accountId}) {
                        nrql(query: "${nrql[1]}", timeout: 10) {
                            results
                        }
                    }`;
                });
                gql += `}}`;
                const { data, errors } = await NerdGraphQuery.query({ query: gql });
                dataReturn.actor = Object.assign(dataReturn.actor, data.actor);
                if (errors && errors.length > 0) errorsReturn.push(errors);
                gql = `{
                    actor {`;
                alias = '';
                control += itemsByPage;
            }
            return { data: dataReturn, n, errors: errorsReturn }
        } else {
            this.graphQlmeasures.forEach(nrql => {
                alias = 'measure_' + n;
                n += 1;
                gql += `${alias}: account(id: ${this.accountId}) {
                    nrql(query: "${nrql[1]}", timeout: 10) {
                        results
                    }
                }`;
            });
            gql += `}}`;
            const { data, errors } = await NerdGraphQuery.query({ query: gql });
            return { data, n, errors }
        }
    }


    setLogsMeasure(measure, results) {
        let total = results.R1 + results.R2;
        measure.count = results.R1;
        if (total == 0) {
            measure.error_percentage = 0;
        } else {
            measure.error_percentage = Math.round(results.R2 / total * 10000) / 100;
        }
    }

    setSessionTime(measure_sessions, sessionID) {
        let session_time = Math.floor(Date.now() / 1000);
        if (this.getOldSessions) {
            session_time = session_time - 5 * 58; // 5min-10seg
        }
        measure_sessions.some(m_sess => {
            if (m_sess.id == sessionID) {
                session_time = m_sess.time;
                return true;
            }
        });
        return session_time;
    }

    setSessions(measure, sessions) {
        let new_sessions = [];
        sessions.forEach(session => {
            new_sessions.push(
                {
                    "id": session.facet,
                    "time": this.setSessionTime(measure.sessions, session.facet)
                }
            );
        });
        measure.sessions = new_sessions;
        //console.log("Sesions:",measure.sessions);
    }

    calculateUpdates() {
        //console.log("Calculate Updates");
        this.clearTouchpointError();
        this.touchPoints.forEach(element => {
            if (element.index == this.city) {
                this.countryCalculateUpdates(element);
            }
        });
    }

    getSessionsPercentage(sessions) {
        //console.log("SESSIONS:",sessions);
        if (sessions.length == 0) {
            return 0;
        }
        let count = 0;
        let currentTime = Math.floor(Date.now() / 1000);
        sessions.forEach(session => {
            if ((currentTime - session.time) > 5 * 60) {
                count++;
            }
        });
        return count / sessions.length;
    }

    getmeasures(element) {
        let total_count = 0;
        let count_by_stage = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let sessions_by_stage = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let session_percentage_by_stage = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let apdex_by_stage = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        let min_apdex_touchpoint_index_by_stage = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let logmeasure_by_stage = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        element.touchpoints.forEach(touchpoint => {
            if (touchpoint.status_on_off) {
                touchpoint.measure_points.forEach(measure => {
                    if (measure.type == 0) {
                        total_count += measure.count;
                        count_by_stage[touchpoint.stage_index - 1] += measure.count;
                    } else if (measure.type == 2) {
                        if (apdex_by_stage[touchpoint.stage_index - 1] > measure.apdex) {
                            apdex_by_stage[touchpoint.stage_index - 1] = measure.apdex;
                            min_apdex_touchpoint_index_by_stage[touchpoint.stage_index - 1] = touchpoint.touchpoint_index;
                        }
                    } else if (measure.type == 3) {
                        sessions_by_stage[touchpoint.stage_index - 1] += measure.count;
                    } else if (measure.type == 4) {
                        session_percentage_by_stage[touchpoint.stage_index - 1] = this.getSessionsPercentage(measure.sessions);
                    } else if (measure.type == 20) {
                        logmeasure_by_stage[touchpoint.stage_index - 1] += measure.count;
                    }
                });
            }
        });
        // console.log("total_count:",total_count);
        // console.log("count_by_stage:",count_by_stage);
        // console.log("sessions_by_stage:",sessions_by_stage);
        // console.log("session_percentage_by_stage:",session_percentage_by_stage);
        // console.log("apdex_by_stage:",apdex_by_stage);
        // console.log("min_apdex_touchpoint_index_by_stage:",min_apdex_touchpoint_index_by_stage);

        return {
            "total_count": total_count,
            "count_by_stage": count_by_stage,
            "sessions_by_stage": sessions_by_stage,
            "session_percentage_by_stage": session_percentage_by_stage,
            "apdex_by_stage": apdex_by_stage,
            "min_apdex_touchpoint_index_by_stage": min_apdex_touchpoint_index_by_stage,
            "logmeasure_by_stage": logmeasure_by_stage
        }
    }

    countryCalculateUpdates(element) {
        let values = this.getmeasures(element);
        //console.log("total-use=" + values.total_count);
        let totalUse = values.total_count;
        totalUse = totalUse == 0 ? 1 : totalUse;
        for (let i = 0; i < this.stages.length; i++) { // for Each Stage
            this.stages[i].status_color = 'good';
            // SET color for error condition
            this.stages[i].status_color = this.updateErrorCondition(this.stages[i].status_color, this.getStageError(i + 1, element));
            //------------------------------
            this.stages[i].total_count = values.count_by_stage[i];
            this.stages[i].congestion.value = Math.round(values.count_by_stage[i] / totalUse * 10000) / 100;

            this.stages[i].capacity = values.count_by_stage[i] / this.checkMaxCapacity(values.count_by_stage[i], i) * 100;

            // Check Congestion according to response speed
            this.stages[i].congestion.percentage = (1 - values.apdex_by_stage[i]) * 100;

            //Change the total_count according to Sessions
            if (values.sessions_by_stage[i] != 0) {
                //if (i == 1 || i == 2 || i == 4) {
                this.stages[i].trafficIconType = "people";
                this.stages[i].total_count = values.sessions_by_stage[i];
                this.stages[i].congestion.value = Math.round(values.session_percentage_by_stage[i] * 10000) / 100;
            } else {
                this.stages[i].trafficIconType = "traffic";
            }
            // Adding Log count Measure
            if (values.logmeasure_by_stage[i] != 0) {
                this.stages[i].total_count = this.stages[i].total_count + values.logmeasure_by_stage[i];
            }



        }
        this.updateMaxLatencySteps(values.min_apdex_touchpoint_index_by_stage);

    }

    updateMaxLatencySteps(max_duration_touchpoint_index_by_stage) {
        for (let i = 0; i < this.stages.length; i++) { // for Each Stage
            this.stages[i].steps.forEach(step => {
                step.sub_steps.forEach(sub_step => {
                    sub_step.latency = false;
                    sub_step.relationship_touchpoints.forEach(touchPointIndex => {
                        if (touchPointIndex == max_duration_touchpoint_index_by_stage[i]) {
                            sub_step.latency = true;
                        }
                    });
                });
            });
        }
    }

    updateErrorCondition(actual, nextvalue) {
        if (actual == 'danger') { return actual; }
        if (nextvalue == 'danger') { return nextvalue; }
        if (actual == 'warning') { return actual; }
        if (nextvalue == 'warning') { return nextvalue; }
        return actual;
    }

    getStepsByStage() {
        let reply = [];
        let idx = 0;
        this.stages.forEach(stage => {
            idx = stage.steps[stage.steps.length - 1].sub_steps.length - 1;
            reply.push(stage.steps[stage.steps.length - 1].sub_steps[idx].index);
        });
        return reply;
    }

    getTotalStepsWithError(steps_with_error) {
        let count = 0;
        let i = 0;
        while (i < steps_with_error.length) {
            count += steps_with_error[i];
            i++;
        }
        return count;
    }

    getStageError(stage, element) {
        let count_touchpoints = 0;
        let steps_with_error = [];
        while (steps_with_error.length < this.stepsByStage[stage - 1]) {
            steps_with_error.push(0);
        }
        element.touchpoints.forEach(touchpoint => {
            if (touchpoint.stage_index == stage && touchpoint.status_on_off) {
                count_touchpoints += 1;
                touchpoint.measure_points.forEach(measure => {
                    if (measure.type == 1) {
                        if (measure.error_percentage > measure.error_threshold) {
                            touchpoint.relation_steps.forEach(rel => {
                                steps_with_error[rel - 1] = 1;
                            });
                            this.setTouchpointError(touchpoint.stage_index, touchpoint.touchpoint_index);
                        }
                    } else if (measure.type == 2) {
                        if (measure.apdex < 0.4) {
                            touchpoint.relation_steps.forEach(rel => {
                                steps_with_error[rel - 1] = 1;
                            });
                            this.setTouchpointError(touchpoint.stage_index, touchpoint.touchpoint_index);
                        }
                    } else if (measure.type == 20) {
                        if (measure.error_percentage > measure.error_threshold) {
                            touchpoint.relation_steps.forEach(rel => {
                                steps_with_error[rel - 1] = 1;
                            });
                            this.setTouchpointError(touchpoint.stage_index, touchpoint.touchpoint_index);
                        }
                    }
                });
            }
        });
        if (count_touchpoints > 0) {
            let porcentage = this.getTotalStepsWithError(steps_with_error) / this.stepsByStage[stage - 1];
            if (porcentage >= 0.5) {
                return 'danger';
            }
            if (porcentage >= 0.15) {
                return 'warning';
            }
            return 'good';
        } else {
            return 'good';
        }
    }

    setTouchpointError(stage_index, touchpoint_index) {
        this.stages[stage_index - 1].touchpoints.forEach(touchpoint => {
            if (touchpoint.index == touchpoint_index) {
                touchpoint.error = true;

            }
        });
        this.stages[stage_index - 1].steps.forEach(step => {
            step.sub_steps.forEach(sub_step => {
                sub_step.relationship_touchpoints.forEach(value => {
                    if (value == touchpoint_index) {
                        sub_step.error = true;
                    }
                });
            });
        });
    }

    // remove all the touchpoins error before to calculate again
    clearTouchpointError() {
        for (let i = 0; i < this.stages.length; i++) {
            this.stages[i].touchpoints.forEach(touchpoint => {
                touchpoint.error = false;
            });
            this.stages[i].steps.forEach(step => {
                step.sub_steps.forEach(sub_step => {
                    sub_step.error = false;
                });
            });
        }
    }

    offAllTouchpoints() {
        this.touchPoints.some(element => {
            if (element.index == this.city) {
                element.touchpoints.forEach(tp => {
                    tp.status_on_off = false;
                });
                return true;
            }
        });
    }

    enableTouchpoint(stageIndex, touchPointIndex) {
        this.touchPoints.some(element => {
            if (element.index == this.city) {
                element.touchpoints.some(tp => {
                    if (tp.stage_index == stageIndex && tp.touchpoint_index == touchPointIndex) {
                        tp.status_on_off = true;
                        return true;
                    }
                });
                return true;
            }
        });
    }

    enableCanaryTouchPoints() {
        for (let i = 0; i < this.stages.length; i++) { // for Each Stage
            this.stages[i].steps.forEach(step => {
                step.sub_steps.forEach(sub_step => {
                    if (sub_step.canary_state == true) {
                        sub_step.relationship_touchpoints.forEach(touchPointIndex => {
                            this.enableTouchpoint(i + 1, touchPointIndex);
                        });
                    }
                });
            });
        }
    }

    setCanaryData() {
        this.offAllTouchpoints();
        this.enableCanaryTouchPoints();
        this.setTouchpointsStatus();
    }

    clearCanaryData(stages) {
        //console.log('ORIGINAL TOUCHPOINTS:');
        this.stages = stages
        if (this.touchPointsCopy != null) {
            //console.log(this.touchPointsCopy);
            this.touchPoints = JSON.parse(JSON.stringify(this.touchPointsCopy));
            this.setTouchpointsStatus();
        }
    }

    updateTouchpointOnOff(touchpoint, updateStorage) {
        this.touchPoints.some(element => {
            if (element.index == this.city) {
                element.touchpoints.some(tp => {
                    if (tp.stage_index == touchpoint.stage_index && tp.touchpoint_index == touchpoint.index) {
                        tp.status_on_off = touchpoint.status_on_off;
                        console.log("ACTUALIZANDO:", tp.stage_index, ":", tp.touchpoint_index, ":", tp.status_on_off);
                        if (updateStorage) {
                            this.setStorageTouchpoints();
                        }
                        return true;
                    }
                });
                return true;
            }
        });
    }

    getTouchpointStatusOnOff(touchpoint) {
        let touchpoint_status = false;
        this.touchPoints.some(element => {
            if (element.index == this.city) {
                element.touchpoints.some(tp => {
                    if (tp.stage_index == touchpoint.stage_index && tp.touchpoint_index == touchpoint.index) {
                        touchpoint_status = tp.status_on_off;
                        //console.log("GET_touchpoint_status:", tp.stage_index, ":", tp.touchpoint_index, ":", tp.status_on_off);
                        return true;
                    }
                });
                return true;
            }
        });
        return touchpoint_status;
    }

    getTouchpointTune(touchpoint) {
        let datos = null;
        this.touchPoints.some(element => {
            if (element.index == this.city) {
                element.touchpoints.some(tp => {
                    if (tp.stage_index == touchpoint.stage_index && tp.touchpoint_index == touchpoint.index) {
                        if (tp.measure_points.length > 1) {
                            datos = {
                                error_threshold: tp.measure_points[0].error_threshold,
                                apdex_time: tp.measure_points[1].apdex_time
                            }
                        } else {
                            datos = {
                                error_threshold: tp.measure_points[0].error_threshold,
                                apdex_time: 0
                            }
                        }
                        return true;
                    }
                });
                return true;
            }
        });
        return datos;
    }

    updateTouchpointTune(touchpoint, datos) {
        this.touchPoints.some(element => {
            if (element.index == this.city) {
                element.touchpoints.some(tp => {
                    if (tp.stage_index == touchpoint.stage_index && tp.touchpoint_index == touchpoint.index) {
                        if (tp.measure_points.length > 1) {
                            tp.measure_points[0].error_threshold = datos.error_threshold;
                            tp.measure_points[1].apdex_time = datos.apdex_time;
                        } else {
                            tp.measure_points[0].error_threshold = datos.error_threshold;
                        }
                        this.setStorageTouchpoints();
                        return true;
                    }
                });
                return true;
            }
        });
    }

    getTouchpointQuerys(touchpoint) {
        let datos = [];
        this.touchPoints.some(element => {
            if (element.index == this.city) {
                element.touchpoints.some(tp => {
                    if (tp.stage_index == touchpoint.stage_index && tp.touchpoint_index == touchpoint.index) {
                        //let datos = [];
                        let actualValue = 0;
                        tp.measure_points.forEach(measure => {
                            if (measure.type == 0) {
                                datos.push(
                                    {
                                        label: "Count Query",
                                        value: actualValue,
                                        type: 0,
                                        query_start: "",
                                        query_body: measure.query,
                                        query_footer: "SINCE " + this.timeRangeTransform(this.timeRange, false)
                                    }
                                );
                            } else if (measure.type == 1) {
                                datos.push(
                                    {
                                        label: "Error Percentage Query",
                                        value: actualValue,
                                        type: 1,
                                        query_start: "",
                                        query_body: measure.query,
                                        query_footer: "SINCE " + this.timeRangeTransform(this.timeRange, false)
                                    }
                                );
                            } else if (measure.type == 2) {
                                datos.push(
                                    {
                                        label: "Apdex Query",
                                        value: actualValue,
                                        type: 2,
                                        query_start: "",
                                        query_body: measure.query,
                                        query_footer: "SINCE " + this.timeRangeTransform(this.timeRange, false)
                                    }
                                );
                            } else if (measure.type == 3) {
                                datos.push(
                                    {
                                        label: "Session Query",
                                        value: actualValue,
                                        type: 3,
                                        query_start: "",
                                        query_body: measure.query,
                                        query_footer: "SINCE " + this.timeRangeTransform(this.timeRange, false)
                                    }
                                );
                            } else if (measure.type == 4) {
                                datos.push(
                                    {
                                        label: "Session Query Duration",
                                        value: actualValue,
                                        type: 4,
                                        query_start: "",
                                        query_body: measure.query,
                                        query_footer: "SINCE " + this.timeRangeTransform(this.timeRange, false)
                                    }
                                );
                            } else if (measure.type == 20) {
                                datos.push(
                                    {
                                        label: "Log Measure Query",
                                        value: actualValue,
                                        type: 20,
                                        query_start: "",
                                        query_body: measure.query,
                                        query_footer: this.timeRangeTransform(this.timeRange, false)
                                    }
                                );
                            }
                            actualValue++;
                        });
                        return true;
                    }
                });
                return true;
            }
        });
        return datos;
    }

    updateTouchpointQuerys(touchpoint, datos) {
        this.touchPoints.some(element => {
            if (element.index == this.city) {
                element.touchpoints.some(tp => {
                    if (tp.stage_index == touchpoint.stage_index && tp.touchpoint_index == touchpoint.index) {
                        datos.forEach(dato => {
                            this.updateMeasure(dato, tp.measure_points);
                        });
                        this.setStorageTouchpoints();
                        return true;
                    }
                });
                return true;
            }
        });
    }

    updateMeasure(data, measure_points) {
        measure_points.some(measure => {
            if (measure.type == data.type) {
                if (measure.type == 4) {
                    measure.appName = data.query_body;
                } else {
                    measure.query = data.query_body;
                }
                return true;
            }
        });
    }
}
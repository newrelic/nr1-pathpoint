![Image](screenshots/logo_pathpoint.png)

# JSON-Schema

Pathpoint is configured using a JSON configuration file, which is written to the needs of your particular business.

## Working with the JSON configuration file

If you need to tweak your KPIs, Stages, Steps, or Touchpoints (including their queries), open the JSON configuration file you are using, with a program like Visual Studio, and find the section you want to change.

Now, before you make any changes to the JSON configuration file, keep in mind the rules about the parts you should not change, because they are REQUIRED for Pathpoint to work. This guide will also show what changes you can make, on the parts of the JSON configuration file you can modify.

## KPIs

* Type ; Required - [100, 101] - 100 represents current value, 101 compares current value with past value  
* Name ; Required - "KPI Name"
* Short Name; Required, to show in "GUI"  
* Measure : Required  
  * AccountID; Required - 123456 - Your Account Id Number
  * Query ; Required - The query changes depending on the KPI Type  
  * Link ; Required - short Permalink
* value_type ; Required - [INT, FLOAT]  
* Prefix ; Required - some prefix to show in the GUI KPI, sample "$"  
* Suffix ; Required - some suffix to show in the GUI KPI, sample "Orders"

### KPI Type 101 Sample

```bash
"kpis": [
        {
            "type": 101,
            "name": "Accounts Values",
            "shortName": "Acc-Val",
            "measure": [
                {
                    "accountID": 123456,
                    "query": "SELECT sum(cost) as value FROM CustomerAccount COMPARE WITH 1 day ago",
                    "link": "https://onenr.io/0JBQrGyBNwZ"
                }
            ],
            "value_type": "FLOAT",
            "prefix": "",
            "suffix": ""
        }
    ]

```

### KPI Type 100 Sample

```bash

"kpis": [
        {
            "type": 100,
            "name": "Unique Agents",
            "shortName": "U-Agent",
            "measure": [
                {
                    "accountID": 123456,
                    "query": "SELECT uniqueCount(operatorID) as value FROM Log",
                    "link": "https://onenr.io/0JBQrGyBNwZ"
                }
            ],
            "value_type": "INT",
            "prefix": "",
            "suffix": ""
        }
    ]

```

## STAGES

* Title; Required,  by default use "none",  
* Active_dotted; Required - the choices are "none", and "dotted" - by default use none, dotted is to show a division line between Stages (which is placed to the left of the Stage you selected in this setting).
* ArrowMode; Required - the choices are "FLOW" showing the arrow (by default use FLOW) , or "STATIC" which turns the arrow in the Stage header into a rectangle. Use Upper case for both of these choices.
* Steps; Required - Defined Line by Line.
  * Line; Required - Step line  number [1..6].
  * Values; Required - One Object by every Sub Step in the Line, Max 6 Sub Steps.
  * Title; Required - Step Name to show in the GUI.
  * Id; Required - Any Unique ID, by default is recommended to use: StageIndex-LineIndex-SubStepIndex, example: ST1-LINE1-SS1

### And this is how the Stages area appears on the JSON configuration file

```bash
    "stages": [
        {
            "title": "CUSTOMER ENTRY",
            "active_dotted": "none",
            "arrowMode": "FLOW",
            "steps": [
                {
                    "line": 1,
                    "values": [
                        {
                            "title": "Web Home Page",
                            "id": "ST1-LINE1-SS1"
                        },
                        {
                            "title": "Mobile Home",
                            "id": "ST1-LINE1-SS2"
                        }
                    ]
                },
                {
                    "line": 2,
                    "values": [
                        {
                            "title": "Login Web",
                            "id": "ST1-LINE2-SS1"
                        },
                        {
                            "title": "Mobile Web",
                            "id": "ST1-LINE2-SS2"
                        }
                    ]
                }
            ]
```

## Touchpoints

* Title": Required - touchpoint Name - Recommend that you add the touchpoint Type at the end of the given name, example; "Chat (PCC)"
* Status_on_off; Required - the choices are true or false, which turns the Touchpoint off.  
* Dashboard_url; Required - Link to Touchpoint Dashboard - short Permalink, sample "https://onenr.io/06vjA0kaWRP"
* Related_steps; Required - any related step ID separated by commas, sample  "ST1-LINE2-SS1,ST1-LINE3-SS3"
* Queries; Required - the query changes depending of the Touchpoint Type.

### And this is how the Touchpoints area appears on the JSON configuration file

```bash
    "touchpoints": [
        {
            "title": "Agents (PRC)",
            "status_on_off": true,
            "dashboard_url": [
                "https://onenr.io/0mMRNMd3lwn"
            ],
            "related_steps": "ST2-LINE2-SS1",
            "queries": [
                {
```

### Now, you will see one example Query for every touchpoint Type

### TYPE : PRC

```bash
"queries": [
  {
    "type": "Person-Count",
    "accountID": 123456,
    "query": "SELECT uniqueCount(operatorID) as session FROM Log",
    "query_timeout": 10,
    "min_count": 1,
    "max_count": 101,
    "measure_time": "5 MINUTES AGO"
  }
```

### TYPE : PCC

```bash
"queries": [
  {
    "type": "Process-Count",
    "accountID": 123456,
    "query": "SELECT count(*) as count from Log WHERE application LIKE 'SolutionCenter_JBoss' and channel = 'chat'",
    "query_timeout": 10,
    "min_count": 1,
    "max_count": 101,
    "measure_time": "5 MINUTES AGO"
  }

```

## TYPE : APP

```bash
"queries": [
  {
    "type": "Application-Performance",
    "accountID": 123456,
    "query": "SELECT filter(apdex(duration, t:0.028), WHERE 1=1) as apdex, filter( max(duration), WHERE 1=1) as response,filter(percentage(count(*), WHERE error is true), WHERE 1=1) as error from Transaction WHERE appName='QS'",
    "query_timeout": 10,
    "min_apdex": 0.4,
    "max_response_time": 0.5,
    "max_error_percentage": 5,
    "measure_time": "5 MINUTES AGO"
  }
```

## TYPE : FRT

```bash
"queries": [
  {
    "type": "FrontEnd-Performance",
    "accountID": 123456,
    "query": "SELECT filter(apdex(duration, t:1), WHERE 1=1) as apdex, filter( max(duration), WHERE 1=1) as response,filter(percentage(count(*), WHERE error is true), WHERE 1=1) as error from PageView WHERE appName='QS'",
    "query_timeout": 10,
    "min_apdex": 0.6,
    "max_response_time": 1.2,
    "max_error_percentage": 5,
    "measure_time": "5 MINUTES AGO"
  }
```

## TYPE : SYN

```bash
"queries": [
  {
    "type": "Synthetics-Check",
    "accountID": 123456,
    "query": "SELECT filter(percentage(count(result),WHERE result='SUCCESS'),WHERE 1=1) as success, max(duration) as duration, max(longRunningTasksAvgTime) as request from SyntheticCheck,SyntheticRequest WHERE monitorName='BDB Live person'",
    "query_timeout": 10,
    "max_avg_response_time": 0.7,
    "max_total_check_time": 1.25,
    "min_success_percentage": 98,
    "measure_time": "3 hours ago"
  }
```

### TYPE : WLD

```bash
"queries": [
  {
    "type": "Workload-Status",
    "accountID": 123456,
    "query": "SELECT latest(statusValue) as statusValue FROM WorkloadStatus WHERE entity.name='ACME Banking'",
    "query_timeout": 10,
    "measure_time": "5 MINUTES AGO"
  }
```

## Type; DRP

```bash
"queries": [
  {
    "type": "Drops-Count",
    "accountID": 123456,
    "query": "SELECT count(*) as count FROM Public_APICall WHERE api='adyen.com'",
    "query_timeout": 10,
    "measure_time": "48 HOURS AGO"
  }
```

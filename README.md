[![New Relic One Catalog Project header](https://github.com/newrelic/opensource-website/raw/master/src/images/categories/New_Relic_One_Catalog_Project.png)](https://opensource.newrelic.com/oss-category/#new-relic-one-catalog-project)

[![Pull Request](https://github.com/newrelic/nr1-pathpoint/actions/workflows/pr.yml/badge.svg)](https://github.com/newrelic/nr1-pathpoint/actions/workflows/pr.yml)
[![Node.js CI](https://github.com/newrelic/nr1-pathpoint/actions/workflows/node.js.yml/badge.svg)](https://github.com/newrelic/nr1-pathpoint/actions/workflows/node.js.yml)
[![Repolinter Action](https://github.com/newrelic/nr1-pathpoint/actions/workflows/repolinter.yml/badge.svg?branch=main)](https://github.com/newrelic/nr1-pathpoint/actions/workflows/repolinter.yml)
[![NR1 Library Deprecation Checks](https://github.com/newrelic/nr1-pathpoint/actions/workflows/nr1_library_deprecation_check.yml/badge.svg)](https://github.com/newrelic/nr1-pathpoint/actions/workflows/nr1_library_deprecation_check.yml)
[![Release](https://github.com/newrelic/nr1-pathpoint/actions/workflows/release.yml/badge.svg)](https://github.com/newrelic/nr1-pathpoint/actions/workflows/release.yml)




# Pathpoint

## NEW RELIC STAFF: For a working e-commerce config example compatible with Demotron use [this one](examples/nr-demotron-order-processing.json)

## Other Pathpoint Config Examples:
- *Dummy* config (suitable for any NR account)](examples/Pathpoint_Json_v1.5%20(13).json)
- [Simple e-commerce example](examples/e-commerce-membership.json)
- [video/media process example](examples/video-processing.json)

![UI Overview](screenshots/main-ui.png)

## Description

Pathpoint is an enterprise platform tracker that models system health in relation to actual user-impacting business stages.  

### Stages

These are the highest level business stages.   At the actual system level these will be a rollup of many services and methods.  PathPoint will give us a view of Latency, Utilization and Errors for each high level business stage.  As an example from an e-commerce customer may identify the following business critical stages: PRE-PROCESSING, PRE-ORDER, CHECKOUT, ORDER MANAGEMENT, DISTRIBUTION & RETURNS.

![Stages](screenshots/stages.png)

### Steps

These are “sub-stages” of a parent stage.  that represent a more granular aggregation of services.  Clicking on a step will highly show more detailed services and functions in the TouchPoints list below.  If a stage has a red border it means there is an error anomaly for this stage.  Below are example steps from an ecommerce company.  In this example these steps correspond to APM services.

![Steps](screenshots/steps.png)

### Touchpoints

These are the most granular entities in the PathPoint model.  PathPoint TouchPoints are often a specific APM or Browser application, but you can use any NRQL query as a touchpoint.  The health status of a TouchPoint will be tied to error rate and latency.

![Touchpoints](screenshots/touchpoints.png)

### Canary Filter

![Canary Filter](screenshots/canary.png)

### Flame Filter

![Canary Filter](screenshots/flame.png)

## Open source license

This project is distributed under the [Apache 2 license](LICENSE).

## What do you need to make this work?

Pathpoint will work in nearly any New Relic account.  To get started you'll need some telemetry in your account that you care about.  This could be any of the following telemetry types: Metrics, Events, Logs, Traces.  A common starting place for Pathpoint is APM Events and Logs, but it is up to you.   The other thing you'll need to know is how this telemetry maps onto the business process you want to model as stages and steps.  That may require some internal disucssions with your stakeholders to understand how things really fit  in.

When you are ready to make some edits you can simply download the current version of the JSON config, edit and re-upload it.  You can also use "right click" to adjust touchpoint configurations.

## In-Product Support

In the Pathpoint UI it is possible to submit a support issue which will be triaged by the Pathpoint team.   They will respond within a few days to update you on our overall assesment and if we are able to resolve the issue we'll provide an ETA.

## Getting started

First, ensure that you have [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) and [NPM](https://www.npmjs.com/get-npm) installed. If you're unsure whether you have one or both of them installed, run the following command(s) (If you have them installed these commands will return a version number, if not, the commands won't be recognized):

```bash
git --version
npm -v
```

Next, install the [NR1 CLI](https://one.newrelic.com/launcher/developer-center.launcher) by going to [this link](https://one.newrelic.com/launcher/developer-center.launcher) and following the instructions (5 minutes or less) to install and setup your New Relic development environment.

Next, to clone this repository and run the code locally against your New Relic data, execute the following command:

```bash
nr1 nerdpack:clone -r https://github.com/newrelic/nr1-pathpoint.git
cd nr1-pathpoint
nr1 nerdpack:serve
```

Visit [https://one.newrelic.com/?nerdpacks=local](https://one.newrelic.com/?nerdpacks=local), navigate to the Nerdpack, and :sparkles:


## Deploying this Nerdpack

Open a command prompt in the nerdpack's directory and run the following commands.

```bash
# To create a new uuid for the nerdpack so that you can deploy it to your account:
nr1 nerdpack:uuid -g [--profile=your_profile_name]

# To see a list of APIkeys / profiles available in your development environment:
# nr1 profiles:list
nr1 nerdpack:publish [--profile=your_profile_name]
nr1 nerdpack:deploy [-c [DEV|BETA|STABLE]] [--profile=your_profile_name]
nr1 nerdpack:subscribe [-c [DEV|BETA|STABLE]] [--profile=your_profile_name]
```

Visit [https://one.newrelic.com](https://one.newrelic.com), navigate to the Nerdpack, and :sparkles:

## Enabling the Support System

In order for the support system to work you will need to configure a Jira endpoint to submit issues to a special Jira project.  The variable that governs this is `proxyJira`.  This value may be pre-populated in the NR1 catalog repository, but if not you will need to get the valid URL from your New Relic account team.

```bash
{
    "proxyJira":"[Pathpoint Proxy URL]"
}
```

## Support

New Relic has open-sourced this project. This project is provided AS-IS WITHOUT WARRANTY OR DEDICATED SUPPORT. Issues and contributions should be reported to the project here on GitHub.

We encourage you to bring your experiences and questions to the [Explorers Hub](https://discuss.newrelic.com) where our community members collaborate on solutions and new ideas.

### Community

New Relic hosts and moderates an online forum where customers can interact with New Relic employees as well as other customers to get help and share best practices. Like all official New Relic open source projects, there's a related Community topic in the New Relic Explorers Hub. You can find this project's topic/threads here:

https://discuss.newrelic.com/t/pathpoint

### Issues / enhancement requests

Issues and enhancement requests can be submitted in the [Issues tab of this repository](../../issues). Please search for and review the existing open issues before submitting a new issue.

### Security

As noted in our [security policy](https://github.com/newrelic/nr1-pathponit/security/policy), New Relic is committed to the privacy and security of our customers and their data. We believe that providing coordinated disclosure by security researchers and engaging with the security community are important means to achieve our security goals.

If you believe you have found a security vulnerability in this project or any of New Relic's products or websites, we welcome and greatly appreciate you reporting it to New Relic through [HackerOne](https://hackerone.com/newrelic).

## Contributing

Contributions are encouraged! If you submit an enhancement request, we'll invite you to contribute the change yourself. Please review our [Contributors Guide](CONTRIBUTING.md).

Keep in mind that when you submit your pull request, you'll need to sign the CLA via the click-through using CLA-Assistant. If you'd like to execute our corporate CLA, or if you have any questions, please drop us an email at opensource+nr1-pathpoint@newrelic.com.

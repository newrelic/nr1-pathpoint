/* eslint-disable prefer-template */
/* eslint-disable prettier/prettier */
// Insert API Credentials
const myAccountID = $secure.PATHPOINT_SYN_ACCOUNTID;
const pathpointID = 'XXXXXXXXX';
const graphQLKey =  $secure.PATHPOINT_USER_API_KEY;
const myInsertKey = $secure.PATHPOINT_INGEST_LICENSE;

const touchpoints = [
  [
    {
      stage_index: 1,
      stage_name: 'Login',
      touchpoint_name: 'Okta - Token',
      touchpoint_index: 1,
      type: 'API',
      measure: {
        accountID: 2781667,
      max_error_percentage: 0.05,
      max_response_time: 500,
      measure_time: "5 MINUTES AGO",
      min_apdex: 0.4,
      query: "SELECT 1 as apdex, 0 as error, filter(average(numeric(message.message)), WHERE 1=1) as response from Log where appName = '210135-Partner Ready Portal (PRP)-Production' and method.name  = 'executeTokenRequest'",
      
      }
    },
    {
      stage_index: 1,
      stage_name: 'Login',
      touchpoint_name: 'Okta - UserInfo',
      touchpoint_index: 2,
      type: 'API',
      measure: {
        accountID: 2781667,
      max_error_percentage: 0.05,
      max_response_time: 500,
      measure_time: "5 MINUTES AGO",
      min_apdex: 0.4,
      query: "SELECT 1 as apdex, 0 as error, filter(average(numeric(message.message)), WHERE 1=1) as response from Log where appName = '210135-Partner Ready Portal (PRP)-Production' and method.name  = 'executeUserInfoRequest'",
      
      }
    },
    {
      stage_index: 1,
      stage_name: 'Login',
      touchpoint_name: 'Login Page',
      touchpoint_index: 3,
      type: 'API',
      measure: {
        accountID: 2781667,
      max_error_percentage: 0.05,
      max_response_time: 5,
      measure_time: "5 MINUTES AGO",
      min_apdex: 0.4,
      query: "FROM BrowserInteraction SELECT 1 as apdex, 0 as error, filter(average(timeToDomInteractive), WHERE 1=1) as response WHERE appName = '210135-Partner Ready Portal (PRP)-Production' and targetUrl = 'https://partner.hpe.com/web/prp'",
      
      }
    },
    {
      stage_index: 1,
      stage_name: 'Login',
      touchpoint_name: 'System Overall Infra health',
      touchpoint_index: 4,
      type: 'WLD',
      measure: {
        accountID: 2781667,
      measure_time: "15 MINUTES AGO",
      query: "SELECT latest(statusValue) as statusValue FROM WorkloadStatus WHERE entity.name = 'PartnerReadyPortal(PRP)-PROD_Infra'",
      
      }
    },
    {
      stage_index: 1,
      stage_name: 'Login',
      touchpoint_name: 'System Overall Performance',
      touchpoint_index: 6,
      type: 'APP',
      measure: {
        accountID: 2781667,
      max_error_percentage: 0.8,
      max_response_time: 500,
      measure_time: "15 MINUTES AGO",
      min_apdex: 0.5,
      query: "SELECT filter(apdex(duration, t:0.028), WHERE 1=1) as apdex, filter( max(duration), WHERE 1=1) as response,filter(percentage(count(*), WHERE error is true), WHERE 1=1) as error from Transaction WHERE appName = '210135-Partner Ready Portal (PRP)-Production'",
      
      }
    },
    {
      stage_index: 1,
      stage_name: 'Login',
      touchpoint_name: '# of User Impacted due to Failures',
      touchpoint_index: 7,
      type: 'DRP',
      measure: {
        accountID: 2781667,
      measure_time: "48 HOURS AGO",
      query: "SELECT count(*) FROM Transaction where appName = '210135-Partner Ready Portal (PRP)-Production' and request.uri='/group/prp' and numeric(http.statusCode) >= 500",
      
      }
    },
    {
      stage_index: 1,
      stage_name: 'Login',
      touchpoint_name: 'Home Page Load',
      touchpoint_index: 8,
      type: 'API',
      measure: {
        accountID: 2781667,
      max_error_percentage: 0.05,
      max_response_time: 7,
      measure_time: "5 MINUTES AGO",
      min_apdex: 0.4,
      query: "FROM BrowserInteraction SELECT 1 as apdex, 0 as error, filter(average(timeToDomInteractive), WHERE 1=1) as response WHERE appName = '210135-Partner Ready Portal (PRP)-Production' and targetUrl = 'https://partner.hpe.com/'",
      
      }
    },
    {
      stage_index: 1,
      stage_name: 'Login',
      touchpoint_name: 'Login Page - Synthetic Availability',
      touchpoint_index: 9,
      type: 'SYN',
      measure: {
        accountID: 2781667,
      max_avg_response_time: 0,
      max_duration: 0,
      max_request_time: 0,
      max_total_check_time: 0,
      measure_time: "5 MINUTES AGO",
      min_success_percentage: 0,
      query: "select percentage(count(*), where responseCode <500) as success, max(duration) as duration, max(longRunningTasksAvgTime) as request from SyntheticRequest where entityGuid = 'Mjc4MTY2N3xTWU5USHxNT05JVE9SfDVlNDIyOTNhLWIxZDItNGFjOC1iNGRkLTE5MjZiZTA4MzM1Yg' and URL ='https://partner.hpe.com/web/prp'",
      
      }
    },
    {
      stage_index: 1,
      stage_name: 'Login',
      touchpoint_name: 'Home Page - Synthetic Availability',
      touchpoint_index: 10,
      type: 'SYN',
      measure: {
        accountID: 2781667,
      max_avg_response_time: 0,
      max_duration: 0,
      max_request_time: 0,
      max_total_check_time: 0,
      measure_time: "15 MINUTES AGO",
      min_success_percentage: 0,
      query: "select percentage(count(*), where responseCode <500) as success, max(duration) as duration, max(longRunningTasksAvgTime) as request from SyntheticRequest where entityGuid = 'Mjc4MTY2N3xTWU5USHxNT05JVE9SfDVlNDIyOTNhLWIxZDItNGFjOC1iNGRkLTE5MjZiZTA4MzM1Yg' and URL ='https://partner.hpe.com/group/prp'",
      
      }
    },
    {
      stage_index: 2,
      stage_name: 'Opportunity',
      touchpoint_name: 'Load Opportunity Page',
      touchpoint_index: 2,
      type: 'APS',
      measure: {
        accountID: 2781667,
      measure_time: "5 MINUTES AGO",
      min_success_percentage: 95,
      query: "SELECT percentage(count(*), WHERE numeric(http.statusCode) >=200 and numeric(http.statusCode) <=499) FROM Transaction WHERE appName like '210135-Partner Ready Portal (PRP)-Production' and request.uri in ('/group/prp/esm/-/link/189005', '/group/prp/esm/-/link/179401', '/group/prp/esm/-/link/179301')",
      
      }
    },
    {
      stage_index: 2,
      stage_name: 'Opportunity',
      touchpoint_name: 'System Overall Infra health',
      touchpoint_index: 3,
      type: 'WLD',
      measure: {
        accountID: 2781667,
      measure_time: "15 MINUTES AGO",
      query: "SELECT latest(statusValue) as statusValue FROM WorkloadStatus WHERE entity.name = 'PartnerReadyPortal(PRP)-PROD_Infra'",
      
      }
    },
    {
      stage_index: 2,
      stage_name: 'Opportunity',
      touchpoint_name: 'Create Quote',
      touchpoint_index: 5,
      type: 'APS',
      measure: {
        accountID: 2781667,
      measure_time: "5 MINUTES AGO",
      min_success_percentage: 95,
      query: "SELECT percentage(count(*), where numeric(http.statusCode) >=200 and numeric(http.statusCode) <=499)  FROM Transaction where appName = '212948-Next Generation Quoter-PRD'  and request.uri='/q2cwngq/selfservice/getEmptyQuote'",
      
      }
    },
    {
      stage_index: 2,
      stage_name: 'Opportunity',
      touchpoint_name: 'System Overall Performance',
      touchpoint_index: 6,
      type: 'APP',
      measure: {
        accountID: 2781667,
      max_error_percentage: 5,
      max_response_time: 500,
      measure_time: "15 MINUTES AGO",
      min_apdex: 0.4,
      query: "SELECT filter(apdex(duration, t:0.028), WHERE 1=1) as apdex, filter( max(duration), WHERE 1=1) as response,filter(percentage(count(*), WHERE error is true), WHERE 1=1) as error from Transaction WHERE appName = '210135-Partner Ready Portal (PRP)-Production'",
      
      }
    },
    {
      stage_index: 2,
      stage_name: 'Opportunity',
      touchpoint_name: 'Tool Catalogue',
      touchpoint_index: 7,
      type: 'API',
      measure: {
        accountID: 2781667,
      max_error_percentage: 0.05,
      max_response_time: 500,
      measure_time: "5 MINUTES AGO",
      min_apdex: 0.4,
      query: "FROM BrowserInteraction SELECT 1 as apdex, 0 as error, filter(average(duration), WHERE 1=1)*1000 as response WHERE appName = '210135-Partner Ready Portal (PRP)-Production' and targetUrl = 'https://partner.hpe.com/tools-catalog'",
      
      }
    },
    {
      stage_index: 3,
      stage_name: 'Start Quote',
      touchpoint_name: 'Import Opty',
      touchpoint_index: 1,
      type: 'APS',
      measure: {
        accountID: 2781667,
      measure_time: "5 MINUTES AGO",
      min_success_percentage: 95,
      query: "SELECT percentage(count(*), where numeric(http.statusCode) >=200 and numeric(http.statusCode) <=499) FROM Transaction WHERE appName ='212948-Next Generation Quoter-PRD' and request.uri='/q2cwngq/opty/lookup'",
      
      }
    },
    {
      stage_index: 3,
      stage_name: 'Start Quote',
      touchpoint_name: 'Add Product',
      touchpoint_index: 2,
      type: 'APS',
      measure: {
        accountID: 2781667,
      measure_time: "5 MINUTES AGO",
      min_success_percentage: 95,
      query: "SELECT percentage(count(*), WHERE numeric(http.statusCode) >=200 and numeric(http.statusCode) <=499) FROM Transaction WHERE appName='212948-Next Generation Quoter-PRD' AND  request.uri='/q2cwngq/itemDetail/getNewItemDetail'",
      
      }
    },
    {
      stage_index: 3,
      stage_name: 'Start Quote',
      touchpoint_name: 'Config Product',
      touchpoint_index: 3,
      type: 'APS',
      measure: {
        accountID: 2781667,
      measure_time: "5 MINUTES AGO",
      min_success_percentage: 95,
      query: "SELECT percentage(count(*), WHERE numeric(http.statusCode) >=200 and numeric(http.statusCode) <=499) FROM Transaction WHERE appName='212948-Next Generation Quoter-PRD' AND request.uri='/q2cwngq/ocaConfig/getBomByUcid' or request.uri='/q2cwngq/ocacomparison/checkifmerge' or request.uri= '/q2cwngq/importMultipleUcids' or request.uri='/q2cwngq/itemDetail/getBundleBOM'",
      
      }
    },
    {
      stage_index: 3,
      stage_name: 'Start Quote',
      touchpoint_name: 'SaveQuote',
      touchpoint_index: 4,
      type: 'APS',
      measure: {
        accountID: 2781667,
      measure_time: "5 MINUTES AGO",
      min_success_percentage: 95,
      query: "from Transaction select percentage(count(*), where numeric(http.statusCode) >=200 and numeric(http.statusCode) <=499) as percentage where appName = '212948-Next Generation Quoter-PRD' and request.uri='/q2cwngq/qids/saveNewQuoteToQids'",
      
      }
    },
    {
      stage_index: 3,
      stage_name: 'Start Quote',
      touchpoint_name: 'System Overall Infra Health',
      touchpoint_index: 5,
      type: 'WLD',
      measure: {
        accountID: 2781667,
      measure_time: "15 MINUTES AGO",
      query: "SELECT latest(statusValue) as statusValue  FROM WorkloadStatus WHERE entity.name = 'NextGenerationQuoter-PROD_Infra'",
      
      }
    },
    {
      stage_index: 3,
      stage_name: 'Start Quote',
      touchpoint_name: 'Synthetic Availability',
      touchpoint_index: 6,
      type: 'SYN',
      measure: {
        accountID: 2781667,
      max_avg_response_time: 200000,
      max_duration: 0,
      max_request_time: 0,
      max_total_check_time: 900000,
      measure_time: "15 MINUTES AGO",
      min_success_percentage: 95,
      query: "SELECT percentage(count(result),WHERE result='SUCCESS') as success, average(SyntheticCheck.duration) as duration, sum(SyntheticCheck.duration) as request from SyntheticCheck WHERE entityGuid ='Mjc4MTY2N3xTWU5USHxNT05JVE9SfDQ5YTMwMmMwLTM4MTQtNDgxMS04YWYyLWM4NmY5MmFhODAxZA' ",
      
      }
    }
  ],
  [
    {
      stage_index: 3,
      stage_name: 'Start Quote',
      touchpoint_name: '# of Saved Quotes - Passed',
      touchpoint_index: 7,
      type: 'PCC',
      measure: {
        accountID: 2781667,
      max_count: 1500,
      measure_time: "15 MINUTES AGO",
      min_count: 1,
      query: "SELECT count(*)  FROM Transaction where appName = '212948-Next Generation Quoter-PRD' and numeric(http.statusCode) >=200 and numeric(http.statusCode) <=499 and request.uri='/q2cwngq/qids/saveNewQuoteToQids'",
      
      }
    },
    {
      stage_index: 3,
      stage_name: 'Start Quote',
      touchpoint_name: '# of Saved Quotes - Failed',
      touchpoint_index: 8,
      type: 'PCC',
      measure: {
        accountID: 2781667,
      max_count: 1,
      measure_time: "15 MINUTES AGO",
      min_count: 0,
      query: "SELECT count(*)  FROM Transaction where appName = '212948-Next Generation Quoter-PRD'  and numeric(http.statusCode) >=500 and request.uri='/q2cwngq/qids/saveNewQuoteToQids'",
      
      }
    },
    {
      stage_index: 3,
      stage_name: 'Start Quote',
      touchpoint_name: 'System Overall Performance',
      touchpoint_index: 9,
      type: 'APP',
      measure: {
        accountID: 2781667,
      max_error_percentage: 0.5,
      max_response_time: 1000,
      measure_time: "15 MINUTES AGO",
      min_apdex: 0.4,
      query: "SELECT filter(apdex(duration, t:0.028), WHERE 1=1) as apdex, filter( max(duration), WHERE 1=1) as response,filter(percentage(count(*), WHERE error is true), WHERE 1=1) as error from Transaction WHERE appName = '212948-Next Generation Quoter-PRD'",
      
      }
    },
    {
      stage_index: 3,
      stage_name: 'Start Quote',
      touchpoint_name: 'Drop outs - Save Quotes',
      touchpoint_index: 10,
      type: 'DRP',
      measure: {
        accountID: 2781667,
      measure_time: "48 HOURS AGO",
      query: "SELECT count(*)  FROM Transaction where appName = '212948-Next Generation Quoter-PRD'  and numeric(http.statusCode) >=500 and request.uri='/q2cwngq/qids/saveNewQuoteToQids'",
      
      }
    },
    {
      stage_index: 3,
      stage_name: 'Start Quote',
      touchpoint_name: 'S4',
      touchpoint_index: 11,
      type: 'PCC',
      measure: {
        accountID: 2781667,
      max_count: 0,
      measure_time: "5 MINUTES AGO",
      min_count: 0,
      query: "FROM `LOGSER_INFORWARDER:IT_LOGSER` SELECT count(UUID) as count where app_name='S4_ERP_DCP' WHERE UUID IS NOT NULL AND SRV_NAME IN ('ZMM_GW_PRODUCTS_MODEL_SRV') limit max ",
      
      }
    },
    {
      stage_index: 3,
      stage_name: 'Start Quote',
      touchpoint_name: 'MDCP',
      touchpoint_index: 12,
      type: 'APS',
      measure: {
        accountID: 2948931,
      measure_time: "5 MINUTES AGO",
      min_success_percentage: 95,
      query: "SELECT percentage(count(*), where numeric(http.statusCode) >=200 and numeric(http.statusCode) <=499) FROM Transaction WHERE appName ='213679-Master Data Control Point - MDM-PRD' and request.uri like '%/organizationAccountV4WebService%'",
      
      }
    },
    {
      stage_index: 4,
      stage_name: 'Price',
      touchpoint_name: 'Addison pricing call',
      touchpoint_index: 1,
      type: 'APS',
      measure: {
        accountID: 2781667,
      measure_time: "5 MINUTES AGO",
      min_success_percentage: 95,
      query: "select percentage(count(*), where numeric(http.statusCode) >=200 and numeric(http.statusCode) <=499) as percentage from Transaction where appName in ('211240-ADDISON-Production-pricing-services', '211240-ADDISON-Production-pricing', '211240-ADDISON-Production-deal-services', '211240-ADDISON-Production-service-delivery') and (request.uri like '%/api/deal-offers%' or request.uri like '%/api/get-exchange-rate%' or request.uri like '%/api/get-ibp-exclusion%' or request.uri like '%/api/get-ibp-percentage%' or request.uri like '%/api/pricing/flexible-ibp%' or request.uri ='%/api/promotion-deals%' or request.uri like '%/api/search/products%' or request.uri like '%/api/v2/discount-indicators%' or request.uri ='%/api/v2/pricing/promotion-deals%' or request.uri ='%/api/v2/simulations/offer-prices%' or request.uri ='%/api/v3/simulate-sales-orders%')",
      
      }
    },
    {
      stage_index: 4,
      stage_name: 'Price',
      touchpoint_name: 'C4 cost',
      touchpoint_index: 2,
      type: 'APS',
      measure: {
        accountID: 2948931,
      measure_time: "5 MINUTES AGO",
      min_success_percentage: 95,
      query: "SELECT percentage(count(*), WHERE numeric(http.statusCode) >=200 and numeric(http.statusCode) <=499) FROM Transaction WHERE appName='213390-Cross-Category Cost Convergence-PRD' AND request.uri = '/C4OutputPort'",
      
      }
    },
    {
      stage_index: 4,
      stage_name: 'Price',
      touchpoint_name: 'Optimus (PROS)',
      touchpoint_index: 3,
      type: 'APS',
      measure: {
        accountID: 2948930,
      measure_time: "5 MINUTES AGO",
      min_success_percentage: 95,
      query: "select percentage(count(*), where numeric(http.statusCode) >=200 and numeric(http.statusCode) <=499) from Transaction where appName = '213083-Pricing Analytics-PRD-Optimus' and request.uri='/optimus/services/OptimusService'",
      
      }
    },
    {
      stage_index: 4,
      stage_name: 'Price',
      touchpoint_name: 'PPSS',
      touchpoint_index: 4,
      type: 'APS',
      measure: {
        accountID: 2948930,
      measure_time: "5 MINUTES AGO",
      min_success_percentage: 95,
      query: "from Transaction select percentage(count(*), where numeric(http.statusCode) >=200 and numeric(http.statusCode) <=499) where appName in ('213083-Pricing Analytics-PRD-PPSS','213083-Pricing Analytics-PRD') and request.uri='/axis2/services/PricingService'",
      
      }
    },
    {
      stage_index: 4,
      stage_name: 'Price',
      touchpoint_name: 'AutoSave to Qids',
      touchpoint_index: 5,
      type: 'APS',
      measure: {
        accountID: 2948930,
      measure_time: "5 MINUTES AGO",
      min_success_percentage: 95,
      query: "SELECT percentage(count(*), WHERE numeric(http.statusCode) >=200 and numeric(http.statusCode) <=499) FROM Transaction WHERE appName='213049-CORONA-PRD' AND request.uri like '%quoteServices/WriteQuoteService/jacksonJson%'",
      
      }
    },
    {
      stage_index: 4,
      stage_name: 'Price',
      touchpoint_name: '# of Price Check - Passed',
      touchpoint_index: 6,
      type: 'PCC',
      measure: {
        accountID: 2781667,
      max_count: 8000,
      measure_time: "15 MINUTES AGO",
      min_count: 1,
      query: "SELECT count(*) FROM Transaction WHERE numeric(http.statusCode) >=200 and numeric(http.statusCode) <=499 and appName LIKE '212948-Next Generation Quoter-PRD' and request.uri='/q2cwngq/ngqpricing/refreshOptimusWithSH'",
      
      }
    },
    {
      stage_index: 4,
      stage_name: 'Price',
      touchpoint_name: 'System Overall Infra Health',
      touchpoint_index: 7,
      type: 'WLD',
      measure: {
        accountID: 2781667,
      measure_time: "15 MINUTES AGO",
      query: "SELECT latest(statusValue) as statusValue  FROM WorkloadStatus WHERE entity.name = 'NextGenerationQuoter-PROD_Infra'",
      
      }
    },
    {
      stage_index: 4,
      stage_name: 'Price',
      touchpoint_name: '# of Price Check - Failed',
      touchpoint_index: 9,
      type: 'PCC',
      measure: {
        accountID: 2781667,
      max_count: 3,
      measure_time: "15 MINUTES AGO",
      min_count: 0,
      query: "SELECT count(*) FROM Transaction WHERE numeric(http.statusCode) >=500 and appName LIKE '212948-Next Generation Quoter-PRD' and request.uri='/q2cwngq/ngqpricing/refreshOptimusWithSH'",
      
      }
    },
    {
      stage_index: 4,
      stage_name: 'Price',
      touchpoint_name: 'System Overall Performance',
      touchpoint_index: 10,
      type: 'APP',
      measure: {
        accountID: 2781667,
      max_error_percentage: 0.5,
      max_response_time: 1000,
      measure_time: "15 MINUTES AGO",
      min_apdex: 0.4,
      query: "SELECT filter(apdex(duration, t:0.028), WHERE 1=1) as apdex, filter( max(duration), WHERE 1=1) as response,filter(percentage(count(*), WHERE error is true), WHERE 1=1) as error from Transaction WHERE appName = '212948-Next Generation Quoter-PRD'",
      
      }
    },
    {
      stage_index: 4,
      stage_name: 'Price',
      touchpoint_name: 'SFDC Deal reg',
      touchpoint_index: 11,
      type: 'APS',
      measure: {
        accountID: 2781667,
      measure_time: "5 MINUTES AGO",
      min_success_percentage: 95,
      query: "SELECT percentage(count(*), where numeric(http.statusCode) >=200 and numeric(http.statusCode) <=499)  FROM Transaction where appName = '212948-Next Generation Quoter-PRD' and request.uri='/q2cwngq/ngqpricing/getDealRegBenefits'",
      
      }
    },
    {
      stage_index: 4,
      stage_name: 'Price',
      touchpoint_name: 'Drop Outs - Price checks',
      touchpoint_index: 12,
      type: 'DRP',
      measure: {
        accountID: 2781667,
      measure_time: "48 HOURS AGO",
      query: "SELECT count(*) FROM Transaction WHERE numeric(http.statusCode) >=500 and appName LIKE '212948-Next Generation Quoter-PRD' and request.uri='/q2cwngq/ngqpricing/refreshOptimusWithSH'",
      
      }
    },
    {
      stage_index: 4,
      stage_name: 'Price',
      touchpoint_name: 'S4',
      touchpoint_index: 13,
      type: 'PCC',
      measure: {
        accountID: 2781667,
      max_count: 0,
      measure_time: "5 MINUTES AGO",
      min_count: 0,
      query: "select count(UUID) as count FROM `LOGSER_INFORWARDER:IT_LOGSER` where app_name='S4_ERP_DCP' and SRV_NAME IN ('Z_OFFERPRICE_CPQ_SRV', 'Z_SOURCE_CHANGE_TO_S4_OM_SRV', 'ZSA_GW_GET_IBP_EXC_S4_SRV', 'ZSA_GW_GET_IBP_PER_S4_SRV','ZOM_GW_IBP_FLEX_S4_SRV', 'Z_PROMO_DEAL_REQUEST_ODS_SRV', 'Z_DEAL_NON_DISC_FLAG_ODS_SRV', 'Z_PROMO_DEAL_ID_PRICING_ODS_SRV', 'Z_OFFER_PRICE_FROM_S4_R2_OM_SRV', 'Z_SO_SIMULATE_NGQ_TO_S4_SRV', 'ZMM_GW_PRODUCTS_MODEL_SRV') WHERE UUID IS NOT NULL limit max",
      
      }
    },
    {
      stage_index: 5,
      stage_name: 'Complete Quote',
      touchpoint_name: 'Validate Price',
      touchpoint_index: 1,
      type: 'APS',
      measure: {
        accountID: 2781667,
      measure_time: "5 MINUTES AGO",
      min_success_percentage: 95,
      query: "SELECT percentage(count(*), WHERE numeric(http.statusCode) >=200 and numeric(http.statusCode) <=499) FROM Transaction WHERE appName='212948-Next Generation Quoter-PRD' AND  request.uri='/q2cwngq/ngqpricing/preCompleteCheck'",
      
      }
    },
    {
      stage_index: 5,
      stage_name: 'Complete Quote',
      touchpoint_name: 'Bundle',
      touchpoint_index: 2,
      type: 'APS',
      measure: {
        accountID: 2781667,
      measure_time: "5 MINUTES AGO",
      min_success_percentage: 95,
      query: "SELECT percentage(count(*), WHERE numeric(http.statusCode) >=200 and numeric(http.statusCode) <=499) FROM Transaction WHERE appName='212948-Next Generation Quoter-PRD' AND  request.uri = '/q2cwngq/ngq/ngq/bundleCheck'",
      
      }
    }
  ],
  [
    {
      stage_index: 5,
      stage_name: 'Complete Quote',
      touchpoint_name: 'Config Check (clic)',
      touchpoint_index: 3,
      type: 'APS',
      measure: {
        accountID: 2781667,
      measure_time: "5 MINUTES AGO",
      min_success_percentage: 95,
      query: "SELECT percentage(count(*), WHERE numeric(http.statusCode) >=200 and numeric(http.statusCode) <=499) FROM Transaction WHERE appName='212948-Next Generation Quoter-PRD' AND  request.uri='/q2cwngq/ngq/ngq/submitToClic'",
      
      }
    },
    {
      stage_index: 5,
      stage_name: 'Complete Quote',
      touchpoint_name: 'Data Check',
      touchpoint_index: 4,
      type: 'APS',
      measure: {
        accountID: 2781667,
      measure_time: "5 MINUTES AGO",
      min_success_percentage: 95,
      query: "SELECT percentage(count(*), WHERE numeric(http.statusCode) >=200 and numeric(http.statusCode) <=499) FROM Transaction WHERE appName='212948-Next Generation Quoter-PRD'  and request.uri ='/q2cwngq/prevalidation/dataCheck'",
      
      }
    },
    {
      stage_index: 5,
      stage_name: 'Complete Quote',
      touchpoint_name: 'Deal Create',
      touchpoint_index: 5,
      type: 'APS',
      measure: {
        accountID: 2781667,
      measure_time: "5 MINUTES AGO",
      min_success_percentage: 95,
      query: "SELECT percentage(count(*), WHERE numeric(http.statusCode) >=200 and numeric(http.statusCode) <=499) FROM Transaction WHERE appName='212948-Next Generation Quoter-PRD' AND request.uri='/q2cwngq/ngqedm/createDealWin'",
      
      }
    },
    {
      stage_index: 5,
      stage_name: 'Complete Quote',
      touchpoint_name: 'Update Quote',
      touchpoint_index: 6,
      type: 'APS',
      measure: {
        accountID: 2781667,
      measure_time: "5 MINUTES AGO",
      min_success_percentage: 95,
      query: "SELECT percentage(count(*), where numeric(http.statusCode) >=200 and numeric(http.statusCode) <=499)  FROM Transaction where appName = '212948-Next Generation Quoter-PRD' and  request.uri='/q2cwngq/ngqaction/updateQuote'",
      
      }
    },
    {
      stage_index: 5,
      stage_name: 'Complete Quote',
      touchpoint_name: 'System Overall Infra Health',
      touchpoint_index: 8,
      type: 'WLD',
      measure: {
        accountID: 2781667,
      measure_time: "15 MINUTES AGO",
      query: "SELECT latest(statusValue) as statusValue  FROM WorkloadStatus WHERE entity.name = 'NextGenerationQuoter-PROD_Infra'",
      
      }
    },
    {
      stage_index: 5,
      stage_name: 'Complete Quote',
      touchpoint_name: '# of Save Quotes - Failed',
      touchpoint_index: 10,
      type: 'PCC',
      measure: {
        accountID: 2781667,
      max_count: 1,
      measure_time: "15 MINUTES AGO",
      min_count: 0,
      query: "SELECT count(*)  FROM Transaction where appName = '212948-Next Generation Quoter-PRD' and request.uri='/q2cwngq/qids/saveNewQuoteToQids' and numeric(http.statusCode) >=500 ",
      
      }
    },
    {
      stage_index: 5,
      stage_name: 'Complete Quote',
      touchpoint_name: 'System Overall Performance',
      touchpoint_index: 11,
      type: 'APP',
      measure: {
        accountID: 2781667,
      max_error_percentage: 0.5,
      max_response_time: 1000,
      measure_time: "15 MINUTES AGO",
      min_apdex: 0.4,
      query: "SELECT filter(apdex(duration, t:0.028), WHERE 1=1) as apdex, filter( max(duration), WHERE 1=1) as response,filter(percentage(count(*), WHERE error is true), WHERE 1=1) as error from Transaction WHERE appName = '212948-Next Generation Quoter-PRD'",
      
      }
    },
    {
      stage_index: 5,
      stage_name: 'Complete Quote',
      touchpoint_name: 'Drop outs - Complete Quotes',
      touchpoint_index: 12,
      type: 'DRP',
      measure: {
        accountID: 2781667,
      measure_time: "48 HOURS AGO",
      query: "SELECT count(*)  FROM Transaction where appName = '212948-Next Generation Quoter-PRD' and request.uri='/q2cwngq/qids/saveNewQuoteToQids' and numeric(http.statusCode) >=500 ",
      
      }
    },
    {
      stage_index: 5,
      stage_name: 'Complete Quote',
      touchpoint_name: 'S4',
      touchpoint_index: 13,
      type: 'PCC',
      measure: {
        accountID: 2781667,
      max_count: 0,
      measure_time: "5 MINUTES AGO",
      min_count: 0,
      query: "FROM `LOGSER_INFORWARDER:IT_LOGSER` SELECT count(UUID) as count where app_name='S4_ERP_DCP' WHERE UUID IS NOT NULL AND SRV_NAME IN ('ZOM_GW_CREAT_DEAL_S4_R2_SRV') limit max  ",
      
      }
    },
    {
      stage_index: 6,
      stage_name: 'Convert',
      touchpoint_name: 'Addison Customer Preference Services',
      touchpoint_index: 1,
      type: 'APS',
      measure: {
        accountID: 2781667,
      measure_time: "5 MINUTES AGO",
      min_success_percentage: 95,
      query: "FROM Transaction select percentage(count(*), where numeric(http.statusCode) >=200 and numeric(http.statusCode) <=499) WHERE appName='211240-ADDISON-Production' AND request.uri LIKE '%customer-preference%'",
      
      }
    },
    {
      stage_index: 6,
      stage_name: 'Convert',
      touchpoint_name: 'Config Check',
      touchpoint_index: 2,
      type: 'APS',
      measure: {
        accountID: 2781667,
      measure_time: "5 MINUTES AGO",
      min_success_percentage: 95,
      query: "FROM Transaction select percentage(count(*), where numeric(http.statusCode) >=200 and numeric(http.statusCode) <=499) WHERE appName='213051-Next Gen Quote-To-Order Conversion Engine-PRD' and request.uri='/q2cngom/qtco/fannr/getFanFromClic' ",
      
      }
    },
    {
      stage_index: 6,
      stage_name: 'Convert',
      touchpoint_name: 'Entity MDM',
      touchpoint_index: 3,
      type: 'APS',
      measure: {
        accountID: 2781667,
      measure_time: "5 MINUTES AGO",
      min_success_percentage: 95,
      query: "FROM Transaction select percentage(count(*), where numeric(http.statusCode) >=200 and numeric(http.statusCode) <=499) WHERE appName='213051-Next Gen Quote-To-Order Conversion Engine-PRD' and request.uri='/q2cngom/qtco/emdm/getlocation' or request.uri='/q2cngom/qtco/emdm/lookup' or request.uri='/q2cngom/qtco/emdm/search'",
      
      }
    },
    {
      stage_index: 6,
      stage_name: 'Convert',
      touchpoint_name: 'Seeburger idoc',
      touchpoint_index: 4,
      type: 'APS',
      measure: {
        accountID: 2781667,
      measure_time: "5 MINUTES AGO",
      min_success_percentage: 95,
      query: "FROM Transaction select percentage(count(*), where numeric(http.statusCode) >=200 and numeric(http.statusCode) <=499) WHERE appName='213051-Next Gen Quote-To-Order Conversion Engine-PRD'  and request.uri='/q2cngom/qtco/ws/cto/convert'",
      
      }
    },
    {
      stage_index: 6,
      stage_name: 'Convert',
      touchpoint_name: 'System Overall Infra Health',
      touchpoint_index: 5,
      type: 'WLD',
      measure: {
        accountID: 2781667,
      measure_time: "15 MINUTES AGO",
      query: "SELECT latest(statusValue) as statusValue FROM WorkloadStatus WHERE entity.name='NextGenerationQuoterConvert-PROD_Infra'",
      
      }
    },
    {
      stage_index: 6,
      stage_name: 'Convert',
      touchpoint_name: 'System Overall Performance',
      touchpoint_index: 6,
      type: 'APP',
      measure: {
        accountID: 2781667,
      max_error_percentage: 0.5,
      max_response_time: 1000,
      measure_time: "15 MINUTES AGO",
      min_apdex: 0.4,
      query: "SELECT filter(apdex(duration, t:0.028), WHERE 1=1) as apdex, filter( max(duration), WHERE 1=1) as response,filter(percentage(count(*), WHERE error is true), WHERE 1=1) as error from Transaction WHERE appName='213051-Next Gen Quote-To-Order Conversion Engine-PRD'",
      
      }
    },
    {
      stage_index: 6,
      stage_name: 'Convert',
      touchpoint_name: 'Read Quote',
      touchpoint_index: 7,
      type: 'APS',
      measure: {
        accountID: 2948930,
      measure_time: "5 MINUTES AGO",
      min_success_percentage: 95,
      query: "FROM Transaction select percentage(count(*), where numeric(http.statusCode) >=200 and numeric(http.statusCode) <=499) WHERE appName='213049-CORONA-PRD' and request.uri LIKE '%/readquote/jacksonJson%'",
      
      }
    }
  ]
];


const graphQLdata = [];

touchpoints.forEach( tp_group => {
let data = '{ actor { ';
tp_group.forEach( tp =>{
data +=  `measure_${tp.stage_index}_${tp.touchpoint_index}: account(id: ${tp.measure.accountID}) { nrql(query: "${tp.measure.query} SINCE ${tp.measure.measure_time}", timeout:10) {results}} `;
});
data +='}}';
const gql = { query: data , variables: ''};
graphQLdata.push(gql);
});

graphQLdata.forEach( gql =>{
const raw = JSON.stringify(gql);
const graphqlpack = {
headers: {
    "Content-Type": "application/json",
    "API-Key": graphQLKey
},
url: 'https://api.newrelic.com/graphql',
body: raw
};
console.log(raw);
$http.post(graphqlpack, callback);
});


const responses = [];
let totalResponses = 0;
function callback(err, response, body) {
const results = JSON.parse(body);
responses.push(results);
totalResponses++;
console.log('Responses:',totalResponses);
if (totalResponses === graphQLdata.length){
ProcessData();
}
}

function ProcessData() {
console.log('Processing Responses...');
const events = [];
let event = null;
let c = null;
let stage_index = 0;
let touchpoint_index = 0;
responses.forEach( response =>{
for (const [key, value] of Object.entries(response.data.actor)) {
  c = key.split("_");
  if (value.nrql && value.nrql.results && value.nrql.results != null) {
    stage_index = parseInt(c[1]);
    touchpoint_index = parseInt(c[2]);
    event = MakeEvent(value.nrql.results[0],stage_index,touchpoint_index);
    console.log(event);
    events.push(event);
  }
}
});
const raw = JSON.stringify(events);
const options = {
    url: "https://insights-collector.newrelic.com/v1/accounts/" + myAccountID + "/events",
    body: raw,
    headers: {
        'X-Insert-Key': myInsertKey,
        'Content-Type': 'application/json'
    }
};
$http.post(options, function (error, response, body) {
    console.log('Ingestionresponse code: ',response.statusCode);
    const info = JSON.parse(body);
    console.log(info);
});
}

function MakeEvent(results,stage_index,touchpoint_index) {
const tp = GetTouchpoint(stage_index,touchpoint_index);
let error = true;
let measure_results = null;
switch (tp.type) {
  case 'PRC':
    if (Reflect.has(results,'session')){
      error =  results.session < tp.measure.min_count;
      measure_results = {
        session_count: results.session
      }
    }
    break;
  case 'PCC':
    if (Reflect.has(results,'count')){
      error = results.count < tp.measure.min_count;
      measure_results = {
        transaction_count: results.count
      }
    }
    break;
  case 'APP':
  case 'FRT':
  case 'API':
    if (Reflect.has(results,'apdex') &&
    Reflect.has(results,'score') &&
    Reflect.has(results,'response') &&
    Reflect.has(results,'error')
    ) {
      error = results.error > tp.measure.max_error_percentage || results.score < tp.measure.min_apdex || results.response > tp.measure.max_response_time;
      measure_results = {
        apdex_value: results.score,
        response_value: results.response,
        error_percentage: results.error
      }
    }
    break;
  case 'SYN':
    if (Reflect.has(results,'success') &&
    Reflect.has(results,'duration') &&
    Reflect.has(results,'request')
    ) {
      error = results.success < tp.measure.min_success_percentage || results.request > tp.measure.max_avg_response_time || results.duration > tp.measure.max_total_check_time;
      measure_results = {
        success_percentage: results.success,
        max_duration: results.duration,
        max_request_time: results.request,
      }
    }
    break;
  case 'WLD':
    if (Reflect.has(results,'statusValue')) {
      error = results.status_value === 'DISRUPTED' || results.status_value === 'UNKNOWN' || results.status_value === 'NO-VALUE'
      measure_results = {
        status_value: results.status_value
      }
    }
    break;
  case 'DRP':
    if (Reflect.has(results,'count')) {
      error = false;
      measure_results = {
        value: results.count
      }
    }
    break;
  case 'APC':
    if (Reflect.has(results,'count')) {
      error = results.count < tp.measure.min_count;
      measure_results = {
        api_count: results.count
      }
    }
    break;
  case 'APS':
    if (Reflect.has(results,'percentage')) {
      error = results.percentage < tp.measure.min_success_percentage;
      measure_results = {
        success_percentage: results.percentage
      }
    }
    break;
  case 'VAL':
    if (Reflect.has(results,'value')) {
      error = results.value > tp.measure.max_value;
      measure_results = {
        value: results.value
      }
    }
    break;
}
return {
  eventType: 'PathpointHistoricErrors',
  pathpoint_id: pathpointID,
  stage_name: tp.stage_name,
  stage_index: stage_index,
  touchpoint_index: touchpoint_index,
  touchpoint_name: tp.touchpoint_name,
  touchpoint_type: tp.type,
  error: error,
  ...measure_results
};
}

function GetTouchpoint(stage_index,touchpoint_index){
let touchpoint = null;
touchpoints.some( tpgroup =>{
const foundg = tpgroup.some( tp => {
  let found = false;
  if (tp.stage_index === stage_index && tp.touchpoint_index === touchpoint_index) {
    touchpoint = tp;
    found = true;
  }
  return found;
});
return foundg;
});
return touchpoint;
}

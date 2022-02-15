# adyen_notification_worker

This script capture Adyen Webhook Notifications and send it to Newrelic Database using the Newrelic Ingestion API.

### Require Newrelic Ingestion Credentials
```
// Credentials
const newRelic_INGESTION_KEY = "NRII-INGESTION-KEY";
const newRelic_ACCOUNT_ID = "NEW-RELIC-ACCOUNT-ID";
```
https://docs.newrelic.com/docs/apis/insights-apis/query-insights-event-data-api/

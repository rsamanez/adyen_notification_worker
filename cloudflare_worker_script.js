addEventListener("fetch", (event) => {
  event.respondWith(
    handleRequest(event.request).catch(
      (err) => new Response(err.stack, { status: 500 })
    )
  );
});
// Credentials
const newRelic_INGESTION_KEY = "NRII-INGESTION-KEY";
const newRelic_ACCOUNT_ID = "NEW-RELIC-ACCOUNT-ID";

/**
 * Many more examples available at:
 *   https://developers.cloudflare.com/workers/examples
 * @param {Request} request
 * @returns {Promise<Response>}
 */
async function handleRequest(request) {
  const { pathname } = new URL(request.url);
  
  if (pathname.startsWith("/notifications")) {

    // Newrelic Ingestion Headers
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("X-Insert-Key", newRelic_INGESTION_KEY);
  
    const newRelicEvents = [];
    // Notification Request JSON
    const payload = await request.clone()
    const notificationRequest =  await payload.json();
 

    const notificationRequestItems = notificationRequest.notificationItems;
    // Handling multiple notificationRequests

    notificationRequestItems.forEach(function(notificationRequestItem){

        const notification = notificationRequestItem.NotificationRequestItem

      // Handle the notification
      // Process the notification based on the eventCode
        const merchantReference = notification.merchantReference;
        const eventCode = notification.eventCode;
        if(eventCode=='AUTHORISATION'){
          const amount_currency = notification.amount.currency;
          const amount_value = notification.amount.value;
          const event_date = notification.eventDate;
          const merchant_code = notification.merchantAccountCode;
          const merchant_ref = notification.merchantReference;
          const payment_method = notification.paymentMethod;
          const psp = notification.pspReference;
          const reason = notification.reason;
          const success = notification.success;
          newRelicEvents.push(
            {
              "eventType": "AdyenNotifications",
              "notificationType": "AUTHORISATION",
              "amountCurrency": amount_currency,
              "amountValue" : amount_value,
              "eventDate": event_date,
              "merchantCode": merchant_code,
              "merchantReference": merchant_ref,
              "paymentMethod": payment_method,
              "pspReference": psp,
              "reason": reason,
              "success": success
            }
          );
        }
        //TODO process other notification Types
    });
    var raw = JSON.stringify(newRelicEvents);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(`https://insights-collector.newrelic.com/v1/accounts/${newRelic_ACCOUNT_ID}/events`, requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
    
    return new Response("[accepted]", {
      headers: { "Content-Type": "application/json" },
    });
  }

  return fetch("https://welcome.developers.workers.dev");
}

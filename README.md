# Bitespeed Backend Task: Identity Reconciliation

Hosted Link - https://bitespeed-04ev.onrender.com/

# Endpoint Details
## URL: [identity-reconsiliation](https://bitespeed-04ev.onrender.com/)/identify
## Method: POST
## Request Body: 
  <p>JSON object with optional email and phoneNumber fields.</p>
  <p>  @email - Email Id of Contact </p>
  <p>@phoneNumber - PhoneNumber of Contact</p>

## Response: JSON object with consolidated contact information:
  <p>@primaryContactId</p>
  <p>@emails - Array</p>
  <p>@phoneNumbers - Array</p>
  <p>@secondaryContactIds - Array</p>

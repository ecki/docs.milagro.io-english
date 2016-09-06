---
currentMenu: milagro-mfa-api-reference
---

<div id="generated-toc" class="generate_from_h2"></div>

# API Reference - Milagro Multi-Factor Authentication

| Acronym | Description         |
|---------|-----------------------------|
| RPS   | Relying Party Service    |
| RPA   | Relying Party Application  |
| D-TA  | Distributed Trust Authority |
| ACL   | Access Control List     |
| OTP   | One-Time Password      |
| OTT   | One-Time Token       |

## System Overview

The platform consists of two groups of Services: local services running on a server and cloud hosted services.

### Local Services

**RPS/Milagro MFA Server** - Relying Party Service. Implements the authentication protocol and workflows. The RPS serves as an abstraction layer between the specific implementation of the protocol and the RPA. RPS also serves as an authentication server
**D-TA** - Distributed Trust Authority Service, running on the server. Responsible to generate Client and Server Secret Shares as well as Time Permit Shares
**RPA** - Relying Party Application. This is the Application to which end-users are authenticated through the Milagro MFA Platform.

### Cloud-hosted Services

**D-TA** - Distributed Trust Authority Service, running in the cloud. Responsible for generating Client and Server Secret Shares as well as Time Permit Shares.
**D-TA Proxy** - Proxies requests to the D-TA, validating RPS signatures. The D-TA Proxy is public-facing, while the D-TAs are not be publicly accessible.
**Time Permits Service** - A service responsible to publish Time Permits to an online storage (CDN), such as AWS S3.
**Registration Service** - A service that handles new server's registration.

## RPS

The RPS resides on the server. The RPS serves as an abstraction layer between the authentication protocol, workflow and crypto, and the RPA. The RPS provides an API to the RPA, for the operations that the RPA is responsible for, and which cannot be performed by the RPS itself.

### SystemArchitecture
The RPS is a Python written service, based on the Tornado framework, i.e. it serves requests in a single thread utilizing non-blocking IO operations.

The RPS should not be exposed to the public Internet, but it should be accessible by the Client either through the RPA or through a dedicated public facing proxy (e.g. Nginx). For this reason, all the public RPS API requests start with a predefined prefix, which is set by default to */rps*.
Any request that starts with that prefix should be redirected to the RPS by the public facing service - that is the RPA or a proxy. RPS API requests that do not start with the prefix should be accessible only from the server's private network, and more specifically, by the RPA.

Additionally, the RPS will implement an ACL, so only authorized machines will be able to make requests to its API.

### RPS Scalability and High Availability

By default, the RPS will store all of its work data in its memory storage. This approach, although simpler and more secure, introduces a problem when the RPS needs to be scaled or made highly available. For this reason the RPS supports an option to use Redis as a work storage and have several RPS instances work together, behind a load balancer. Since the actual state is stored on Redis, the RPS instances become stateless and mutually replaceable. For more information regarding the configuration for Redis storage, see the <a href="../configuration/milagro-mfa-configuration.html">configuration</a> guide.

### RPS API

#### Client Initialization
___
##### GET /rps/clientSettings
___
Called by the client (PIN Pad), through a proxy, to obtain the setting it should use. Most of the settings are service endpoints and server details.

**Parameters:**

**Data:**

**Response:** 200 OK on success, 4xx otherwise

**Response Data:**

```
{
  "mpinAuthServerURL": <mpin-auth-endpoint>,
  "timePermitsURL": <customer-time-permit-endpoint>,
  "timePermitsStorageURL": <certivox-time-permit-cache-url>,
  "authenticateURL": <auth-validation-endpoint>,
  "timePermitsStorageURL": <tp-storage-url>,
  "certivoxURL": <certivox-services-url>,
  "mobileAuthenticateURL": <mobile-auth-validation-endpoint>,
  "signatureURL": <signature-endpoint>,
  "requestOTP": <request-otp>,
  "setupDoneURL": <setup-done-endpoint>,
  "successLoginURL": <successful-login-url>,
  "accessNumberURL": <access-number-endpoint>,
  "getAccessNumberURL": <get-access-number-endpoint>,
  "accessNumberDigits": <access-number-digits>,
  "accessNumberUseCheckSum": <access-number-use-checksum>,
  "cSum": <access-number-checksum-method>,
  "seedValue": <seed-value>,
  "registerURL": <user-register-endpoint>,
  "identityCheckRegex": <identity-check-regex>,
  "useWebSocket": <use-web-sockets>,
  "setDeviceName": <set-device-name>,
  "appID": <app-id>
}
```

<*mpin-auth-endpoint*> - Milagro MFA Server end-user authentication. On this URL the client will open a WebSocket or make the "/pass1" and "/pass2" requests.
Example: "/rps"

<*customer-time-permit-endpoint*> - Endpoint on which requests to the local server D-TA for Time Permit Share should be done.
Example: " rps/timePermit"

<*MIRACL-time-permit-cache-url*> - Base URL of cache storage for cloud stored Time Permit Share.

<*auth-validation-endpoint*> - Endpoint implemented by the RPA for authentication validation.
Example: "/mpinAuthenticate".

<*tp-storage-url*> - Base URL for the time permit storage. This is the storage where pre-generated shares of time permits are published in the cloud.
Example: "https://s3-eu-west-1.amazonaws.com/freetier-timeperbit-bucket-qa-v3"

<*MIRACL-services-url*> - Base URL for the clooud hosted services.
Example: "https://m-pinapi-qa-v03.MIRACL.org/v0.3"

<*mobile-auth-validation-endpoint*> - Endpoint for mobile authentication.
Example: " rps/authenticate"

<*signature-endpoint*> - Endpoint for requesting Relying Party Signature, further used to get Client Secret Share.
Example: " rps/signature"

<*request-otp*> - Indicates (true or false) whether One-Time Password should be generated on successful authentication. (not used in the current version of MFA Server)

<*setup-done-endpoint*> - Endpoint for the setupDone request.
Example: " rps/setupDone"

<*successful-login-url*> - URL that the PIN Pad should load after a successful end-user authentication.

<*access-number-endpoint*> - Endpoint for Access Number polling request.
Example: " rps/accessnumber"

<*get-access-number-endpoint*> - Endpoint for Access Number generating request.
Example:" rps/getAccessNumber"

<*access-number-digits*> - Number of digits for the requested Access Number.
Example (and Default): 7

<*access-number-use-checksum*> - Indicates (true or false) whether the client should validate the Access Number checksum or not. The default is 'true'.

<*access-number-checksum-method*> - It is a constant set to 1.

<*seed-value*> - Ephemeral hex-encoded value, used as a seed for further random number generation.

<*user-register-endpoint*> - Endpoint for initiating end-user registration flow.
Example: "rps/user"

<*identity-check-regex*> -A regular expression used to verify the format of a new end-user identity.
Example: [0-9a-zA-Z]

<*use-web-sockets*>Indicates (true or false) whether the PIN Pad should make an attempt to use WebSockets when authenticating an end-user against the M-Pin Server. If not specified, the default is*true*.

<*set-device-name*> - Indicates (true or false) whether the client should display to and enable the user to set a friendly name for the device. If so, the client should send the device name with the PUT /rps/user request.

<*app-id*> - Server specific Application ID, received upon registration for the Milagro MFA service. It is one of the parameters in the key.json file

<*registration-ott*> - The registration reference number (OTT) provided in the response of PUT/rps/user/<mpin-id\>
___
##### Setup
___
The purpose of the Setup process is as follows:

- Verify the user identity.
- Get the two Shares of the Client Secret and combine them.
- Extract the user PIN Code from the Client Secret to form the M-Pin Token.
- Store the M-Pin Token on the Client machine.

___
##### PUT /rps/user/<mpin−id\>
___
This request is made by the Client (through a proxy) to initiate the Setup flow for an end-user, or to restart it. When the flow is initially started, the request is made without the optional */&lt;mpin-id&gt;*. In this case the RPS generates a new *&lt;mpin-id&gt;* which is returned in the response data. The *&lt;mpin-id&gt;* is a hex-encoded JSON structure of the following form:

```
{
  "issued": <date-time>,
  "userID": <user-identity>,
  "mobile": <1|0>,
  "salt": <64-bit-hex-encoded-random-number>
}
```

In certain cases, the Setup flow might need to be re-started for an already generated <mpin-id>. In this case the optional /<mpin-id> in the request is appended, as well as the regOTT parameter in the request data.

During this request, the RPS makes a POST /verify request to the RPA, sending to it an activateKey. During the POST /verify request the RPA could validate whether the provided <user-id\> is a valid system user, could initiate a user verification procedure (e.g. sending verification e-mail) or use the optional <user-data\> for additional operations that are required to validate the end-user. As a result, the RPA might indicate to the RPS whether the user should be made active immediately, or the RPS should wait for the user identity verification to be completed. When the identity verification is completed, the RPA should make a POST /user/<mpin-id\> request, providing the activateKey, to be able to proceed further with the flow . The actual RPA endpoint for thePOST /verify request is configurable.

**Parameters:** none

**Data:**

</br>
```
{
  "userId": <user-id>,
  "deviceId": <device-id>,
  "mobile": <0|1>,
  "regOTT": <registration-ott>,
  <user-data>
}
```
</br>

<*user-id*> - The string identifying the end-user. It might be the end-user e-mail address or any other system-unique string.

<*device-id*> - (Optional) Depending on the server preferences, the Client might provide a friendly name describing the device from which the request is coming. This name will be further forwarded to the RPA so it can attach it to the end-user information that it stores.

<*mobile*> - Indicates (1 or 0) whether the flow is carried out by the mobile client (1), or not (0).

<*registration-ott*> - (Optional) In case an already started setup flow should be re-started, this should be the original <registration-ott\> that was returned in the initial response.

<*user-data*> - (Optional) The server might pass to the PIN Pad Client some server-specific data that would help to verify the end-user in the RPA. This data is an opaque request, passed to the RPA in the POST /verify .

**Response:** 200 OK on success, 4xx otherwise

**Response Data:**

```
{
  "expireTime": <utc-formatted-expiration-time>,
  "active": <true|false>,
  "regOTT": <registration-ott>,
  "nowTime": <utc-formatted-current-time>,
  "mpinId": <mpin-id>
}
```
<*utc-formatted-expiration-time*> - Expiration time for the user setup flow in case the RPS should wait for the user verification to be completed.

<*active*> - Indicates (true or false) whether the user has been made active already, and no further user verification is required.

<*registration-ott*> - A reference number identifying the setup process for the given <mpin-id\>. This number is valid only until the flow is complete or expired, and serves as a type of OTT.

<*utc-formatted-current-time*> - The current system time.

<*mpin-id*> - The formed hex-encoded M-Pin ID for the end-user identified by <user-id\>. If <mpin-id\> is appended in the request, the same <mpin-id\> will be returned here. Otherwise the RPS generates a new <mpin-id\>.
___
##### POST /user/<mpin-id\>
___
This request is made by the RPA when the end-user identity verification is complete.

<mpin-id\> is the hex-encoded M-Pin ID

**Parameters:** <none>

**Data:**

```
{
  "activateKey": <activation-key>
}
```
<*activation-key*> - The activation key provided by the RPS during the POST /verify request to the RPA.

**Response:** 200 OK on success, 4xx otherwise

**Response Data:** <none\>
___
##### GET /rps/signature/<mpin-id>?regOTT=<registration-ott\>
___
This request is made by the Client (through a proxy) and serves several purposes:

- To obtain the server share of the Time Permit. As part of this request the RPS will get the Time Permit share from the server D-TA and will return it in the response.
- To obtain the parameters that should be used to request the cloud share of the Time Permit. Those parameters include a unique signature without which the cloud-hosted D-TA will not fulfill the request.
- To generate obfuscated (hashed) M-Pin ID, which is further used by the cloud-hosted services to identify the end-user.

*&lt;mpin-id&gt;* is the hex-encoded M-Pin ID.

**Parameters:** regOTT=&lt;registration-ott&gt;

<*registration-ott*> - The registration reference number (OTT) provided in the response of PUT /rps/user[/&lt;mpin-id&gt;]

**Data:** <none>

**Response:** 200 OK on success, 4xx otherwise

**Response Data:**

```
{
  "clientSecretShare": <client-secret-share>,
  "params": <client-secret-request-params>
}
```
<*client-secret-share*> - Client Secret Share from the server-hosted D-TA Service.

Parameters (including signature) that should be used to request the other Client Secret Share from the cloud-hosted D-TA Service. Those parameters are formatted as request query parameters in the form:
</br>
		app_id=<app_id>&hash_mpin_id=<hash_mpin_id>&\nexpires=<expires>&mobile=<mobile>&signature=<signature>
</br><br />
___
##### POST /rps/setupDone/&lt;mpin-id&gt;
___
This request is made by the Client (through a proxy) to announce that the end-user has finalized the setup process, providing his/her PIN Number. Currently no action is taken by the RPS during this request.

*&lt;mpin-id&gt;* is the hex-encoded M-Pin ID

**Parameters:** &lt;none&gt;

**Data:** &lt;none&gt;

**Response:** 200 OK on success, 4xx otherwise

**Response Data:** &lt;none&gt;<br /><br />

#### Authentication

The Authentication of a user starts with getting a Time Permit for that user identity for the current date. The Time Permit is combined from two shares - one from the server D-TA and one from cloud-hosted D-TA. For efficiency, the cloud share of the Time Permit is cached in two levels - on the Client side (1) and/or on a dedicated cache storage (2). The Client should first of all check whether there is a Time Permit (TP) for the current date cached on the local machine. If so, it should use it. Otherwise, it should make a request to the second cache level - the TP storage. If the TP is retrieved from there, it should be cached locally and used until the end of the day. If there is no TP on the cache storage, a request should be made to the could-hosted D-TA, which will serve the TP, will generate new TP's for the next few days and will store them to the cache storage.
___
##### GET /rps/timePermit/<mpin-id\>
___
This request is made by the Client (through a proxy) to obtain the server share of the Time Permit for the given <mpin-id\>. The RPS makes a request to the server-hosted D-TA Service to obtain the Time Permit Share and returns the result to the Client. Prior to sending the request to the D-TA, the RPS will make a *GET /permitUser?mpin_id=* request to the RPA, which might revoke the access to the service for the specified user. The RPA should respond with 200 OK, if the RPS should proceed with the time permit request, or with 403 if the user is revoked. The actual RPA endpoint for the*GET /permitUser* request is configurable. If it is not configured, the RPS will not make this request and will assume that no user should be revoked by the RPA.

Additional purpose of this request is to provide the Client with the current date and the location of the cache storage for cloud share of the Time Permit. The Client should use those in order to check whether the cloud TP share is stored locally, or on the cache storage, or it should be requested from the cloud-hosted D-TA.

As part of this request the RPS will also generate and return in the response a unique signature which should further be used in the request for the second Time Permit Share from the cloud-hosted D-TA Service.

*<mpin-id\>* is the hex-encoded M-Pin ID.

**Parameters:** <none\>

**Data:** <none\>

**Response:** 200 OK on success, 4xx otherwise

**Response Data:**

</br>

```
{
  "date": <current-date>,
  "message": <response-message>,
  "version": <mpin-version>,
  "timePermit": <time-permit-share>,
  "storageId": <storage-id>,
  "signature": <signature>
}
```

<*current-date*> - The current date in days since the Epoch (1 January 1970, UTC).

<*response-message*> - A response message, usually "M-Pin Time Permit Generated".

<*mpin-version*> - The version of the M-Pin protocol, currently "0.3".

<*time-permit-share*> - Time Permit Share from the server-hosted D-TA Service.

<*storage-id*> - ID under which the cloud Time Permit Share is possibly stored on the cache storage. This ID is appended to the base Storage URL received in the Client Settings, to form the full URL for accessing the cache storage.

<*signature*> - A unique signature that should be used in subsequent request for the cloud share of the Time Permit.

<*current-date*> - The current date in days since the Epoch (1 January 1970, UTC.
<br /><br />
___
##### PUT /token
___
This request is made by the MFA Server as a result of authentication attempt. The server passes a token which indicates whether the authentication was successful or not, as well as a reference number (serving as an OTT) for the authentication attempt. This reference number is also provided to the Client, which further posts it to the POST /authenticate request to verify the authentication. This call is assumed to be performed over a secured SSL channel.

**Parameters:** &lt;none&gt;

**Data:**

```
{
  "token": <auth-token>,
  "authOTT": <authentication-ott>,
  "signature": <signature>
}
```

<*auth-token*> - A Plain Authentication Token in the form of JSON object. Example:

```
{
  "WID": "0",
  "expires": "2014-03-18T09:00:33Z",
  "pinError": 0,
  "successCode": 0,
  "OTP": "0",
  "mpin_id": <mpin-id-plain>,
  "mpin_id_hex": <mpin-id-hex>,
  "pinErrorCost": 0
}

```

<*authentication-ott*>- Authentication reference number (OTT)

<*signature*>- HMAC signature over the next fields: <mpinidhex><successCode><expires><WID><OTP><authOTT>
The validity of this signature is verified by the RPS.

**Response:** 200 OK on success, 4xx otherwise

**Response Data:** &lt;none&gt;
<br /><br />
___
##### POST /authenticate
___
This request is made by the RPA to validate successful authentication for an end-user. The RPA should provide the authentication reference number <*authentication-ott*>, in order for the RPS to validate the authentication result.

**Parameters:** &lt;none&gt;

**Data:**

```
{
  "authOTT": <authentication-ott>
}
```
<*authentication-ott*> - The authentication reference number (OTT) provided in the final result of the protocol dance between the Client and the Server.

**Response:**

200 Authentication successful - on success;

401 Wrong PIN - on unsuccessful authentication;

410 Wrong PIN - after N unsuccessful authentication

408 Expired authentication request - the authOTT is invalid or expired.

**Response Data:**

```
{
  "status": <response-status>,
  "message": <response-message>,
  "userId": <user-id>,
  "mpinId": <mpin-id>
}
```

<*response-status*> - The status of the authentication, either 200, 401 or 410. The same as the HTTP status code

<*response-message*> - Response message for the authentication. The same as the message in the HTTP status - "Authentication successful" or "Wrong PIN"

<*user-id*> - The identity of the user being authenticated.

<*mpin-id*> - The hex-encoded M-Pin ID of the user being authenticated.
<br /><br />
#### Mobile Authentication
___
##### POST /loginResult
___
This request is made by the RPA to inform the RPS for a potential login restriction for the end-user that is currently being authenticated, and to provide optional logout data. This request is mostly useful for the Mobile authentication flow, where the Mobile App should receive as a response to the POST /rps/authenticate request a valid status, as well as the required data for a subsequent logout operation. If the *waitForLoginResult* configuration option is set to *True*, then the RPS will wait for this request before returning a response to POST /rps/authenticate, otherwise it will return the response right after returning response to the POST /authenticate request from the RPA.

**Parameters:** &lt;none&gt;

**Data:**

```
{
  "status": <status>,
  "authOTT": <authentication-ott>,
  "logoutURL": <logout-endpoint>,
  "logoutData": <logout-data>
}
```

<*status*> - If the RPA doesn't band the user from logging-in, the status should be 200. Otherwise the status might be 401 or 410. See valid response of POST /rps/authenticate

<*authentication-ott*> - Authentication reference number (OTT)

<*logout-endpoint*> - (Optional) Endpoint to which the Mobile App should make request to logout the end-user. This endpoint might be alternatively set in the Configuration file.

<*logout-data*> - (Optional) Any data that the Mobile App should provide while making request to the <logout-endpoint>. This data might be a JSON object as well. If the logoutData is not present, then the Mobile App will not present to the end-user the option to logout.

**Response:** 200 OK on success, 4xx otherwise

**Response Data:** &lt;none&gt;
___
##### POST /rps/getAccessNumber
___
This request is made by the Client (through a proxy) to obtain the Access Number that is required for authentication through the Mobile Client.

**Parameters:** &lt;none&gt;

**Data:** &lt;none&gt;

**Response:** 200 OK on success, 4xx otherwise

**Response Data:**

```
{
  "localTimeStart": <access-number-expiration-start>,
  "ttlSeconds": <access-number-expiration-in-seconds>,
  "localTimeEnd": <access-number-expiration-end>,
  "webOTT": <web-ott>,
  "accessNumber": <access-number>
}
```
<*access-number-expiration-in-seconds*> - Access Number expiration period in seconds.

<*access-number-expiration-start*> - Start time of Access Number expiration in seconds since the Epoch.

<*access-number-expiration-end*> - End time of Access Number expiration in seconds since the Epoch.

<*web-ott*> - Reference number (serves as OTT) for the mobile authentication

<*access-number*> - The Access Number.
___
##### POST /rps/accessnumber
___
This request is made by the Client (through a proxy) to check whether an end-user has authenticated through the Mobile App. The Client provides the *webOTT* to refer to the relevant mobile authentication transaction. When an end-user has authenticated successfully through the Mobile Client, an *authOTT* is returned, so subsequent authentication requests to the RPA might be executed.

**Parameters:** &lt;none&gt;

**Data:**

```
{
  "webOTT": <web-ott>
}
```

**Response:**

200 OK - Successful Authentication.

401 Unauthorized - User has not been authorized successfully yet.

**Response Data:**

Sent only with 200 OK response

```
{
  "authOTT": <authentication-ott>
}
```

<*authentication-ott*> - The authentication reference number (OTT) provided in the final result of the protocol dance between the Client and the MFA Server.
___
##### POST /rps/authenticate
___
This request is made by the Mobile Client (through a proxy) to authenticate an end-user. The Mobile Client passes the *authOTT* that was returned by the MFA Server as a result of the protocol dance. The RPS obtains the Authentication Token using the *authOTT* and verifies the result of the authentication.

**Parameters:** &lt;none&gt;

**Data:**

```
{
  "mpinResponse": {
    "authOTT": <authentication-ott>,
    "version": <mpin-version>,
    "type": "PASS2"
  }
}
```

<*authentication-ott*> - The authentication reference number (OTT) provided in the final result of the protocol dance between the Client and the Server.

<*mpin-version*> - The version of the M-Pin protocol, currently "0.3".

**Response:**

200 Authentication successful - on success;

401 Wrong PIN - on unsuccessful authentication;

410 Wrong PIN - after N unsuccessful authentication attempts.

408 Expired authentication request - the authOTT is invalid or expired.

**Response Data:** &lt;none&gt;
<br /><br />
#### Expected API for the RPA

The RPA is the only part in the system that is strictly specific to each server instance and implements the logic of the specific Web Application. In order for this Web Application to serve as RPA, it should implement the below RESTful endpoints. Note that the actual URL's for the endpoints are customizable, and therefore example endpoint names are shown in the brackets. The actual endpoint URLs should be configured in the RPS.
___
##### End-user Verification Callback Endpoint (POST /verify)
___
This request is made as part of the end-user registration and activation flow. The request is made by the RPS to the RPA to either verify the end-user identity in-place, or to initiate end-user identity verification process. If the RPA is able to verify the identity in-place, then it should return 200 OK with response data { "forceActivate": true }. If a verification process has been started (e.g. via sending a verification e-mail to the end-user), then the RPA should make a POST /user/&lt;mpin-id request to the RPS when the user identity has been verified, providing the same*activateKey* that was received in this request.

**Parameters:** &lt;none&gt;

**Data:**

```
{
  "activateKey": <activate-key>,
  "mpinId": <mpin-id>,
  "mobile": <0|1>,
  "userId": <user-id>,
  "expireTime": <utc-formatted-expiration-time>,
  "resend": <true|false>,
  "deviceName": <device-name>
  "userData": <user-data>
}
```
<*activation-key*> - An activation reference number, identifying the specific end-user verification and activation process.

<*mpin-id*> - The hex-encoded M-Pin ID of the user being registered/set-up.

<*mobile*> - Indicates (1 or 0) whether the flow is carried out by the mobile client (1), or not (0).

<*user-id*> - The identity of the user being registered/set-up.

<*utc-formatted-expiration-time*> - Expiration time for the user setup flow in case the RPS should wait for the user verification to be completed.

<*resend*> - Indicates (true or false) whether the setup flow for that user was just started, or re-started. If the end-user failed to receive the a verification e-mail (for instance) and requests to re-send the e-mail, this flag will be true.

<*device-name*> - A friendly name describing the device from which the user is trying to register. The RPA might associate and save this name with the mpin-id in order to be able later to recognize the mpin-id given the device name.

<*user-data*> - Some opaque user data that is sent by the PIN Pad during the PUT /rps/user/<mpin-id\> request to the RPS. The RPS just passes that data to the RPA "as is". This data might be used by the RPA as additional assistance the end-user verification process. The data might be set via the PIN Pad registerRequestFormatter() callback

**Response:**

200 OK - user identity is verified or a verification process has been started

4xx - user verification has failed.

**Response Data:**

```
{
  "forceActivate": <true|false>
}
```
*forceActivate* should be set to true if the end-user has been verified in-place and the RPS should not expect further POST /user/<mpin-id\> request to activate the user.
___
##### End-user Permission Callback Endpoint (GET /permitUser?mpin_id=&lt;mpin-id&gt;)
___
This request is optionally made as part of the end-user authentication flow. It is not mandatory to implement this endpoint. If implemented, the RPS will make this request to the RPA in order to assert that the end-user authentication might proceed on, and it can request the time permit shares for that user.

If this endpoint is not set in the RPS configuration, the RPS won't make this request and will assume that the RPA is not interested to revoke any end-users.

**Parameters:** mpin_id=&lt;mpin-id&gt;

*&lt;mpin-id&gt;* is the hex-encoded M-Pin ID.

**Data:** &lt;none&gt;

**Response:**

200 OK - end-user is permitted to proceed with authentication

4xx - end-user is not permitted not proceed with authentication

**Response Data:** &lt;none&gt;
___
##### End-user Authentication Endpoint (POST /authenticate)
___
This request is part of the end-user authentication flow. It is made by the PIN Pad to the RPA in order to verify the end-user authentication against the MFA Server. The PIN Pad first authenticates the end-user against the server and athen sends the result of that authentication to the RPA for verification. The RPA should then make POST /authenticate request to the RPS, sending only the*authOTT* in the request data. The RPS verifies that this*authOTT* corresponds to a valid Authentication Token and return status. The RPA should return the same status in the response to the PIN Pad, but it can return also some custom response data that might be used on the client side.

Implementing this endpoint is mandatory, and its URL should be set in the RPS configuration. The RPS will propagate it to the PIN Pad within the Client Settings.

**Parameters:** &lt;none&gt;

**Data:**

```
{
  "mpinResponse": {
    "version": "0.3",
    "authOTT": <authentication-ott>,
    "pass": 2
  }
}
```

<*authentication-ott*> - Authentication reference number (OTT)

**Response:** The response should be basically the same as the one returned by the RPS*POST /authenticate* request

200 Authentication successful - on success;

401 Wrong PIN - on unsuccessful authentication;

410 Wrong PIN - after N unsuccessful authentication attempts;

408 Expired authentication request - the authOTT is invalid or expired.

**Response Data:** &lt;none&gt; or any JSON-formatted application-specific data. This data might be used on the front-end side to implement any application-specific logic.
<br /><br />
### Workflows

#### End user registration flow

<img abp="4005" class="confluence-embedded-image" confluence-query-params="effects=border-simple,shadow-kn" data-image-src="/download/attachments/11534356/M-Pin%20Setup.png?version=11&amp;modificationDate=1413213302000&amp;api=v2&amp;effects=border-simple,shadow-kn" height="1413" src="http://docs.miracl.com/userfiles/1995/3089/ckfinder/images/M-Pin%20Setup.png?dc=201502241747-0" style="margin-right: auto; margin-left: auto; display: block;" width="1260" />

#### End user authentication flow

<img abp="4009" class="confluence-embedded-image" confluence-query-params="effects=border-simple,shadow-kn" data-image-src="/download/attachments/11534356/M-Pin%20Authentication.png?version=8&amp;modificationDate=1413213302000&amp;api=v2&amp;effects=border-simple,shadow-kn" height="1163" src="http://docs.miracl.com/userfiles/1995/3089/ckfinder/images/M-Pin%20Authentication(1).png?dc=201502241747-0" style="margin-right: auto; margin-left: auto; display: block;" width="1261" />

#### End user mobile authentication

<img abp="4013" class="confluence-embedded-image" confluence-query-params="effects=border-simple,shadow-kn" data-image-src="/download/attachments/11534356/M-Pin%20Mobile%20Authentication.png?version=7&amp;modificationDate=1413213302000&amp;api=v2&amp;effects=border-simple,shadow-kn" height="1310" src="http://docs.miracl.com/userfiles/1995/3089/ckfinder/images/M-Pin%20Mobile%20Authentication.png?dc=201502241747-0" style="margin-right: auto; margin-left: auto; display: block;" width="1256" />

**language** py
**title** <installation-folder>/config_rps.py
</br></br>
<pre><code>
		from __future__ import unicode_literals

		"""HTTP server settings"""
		address = <rps-listen-address>
		port = <rps-port>

		"""Set Access-Control-Allow-Origin header"""
		allowOrigin = <access-control-allow-origin>

		"""Time synchronization
		To be able to perform time based verification, by default RPS syncs its time
		with CertiVox servers. If you set it to False, you should still sync the server
		using an accurate NTP time server!
		"""
		syncTime = <sync-time>

		"""
		Dynamic options url
		Location to be queried for dynamically (runtime) changeable options.
		'None' mean dynamic options are disabled and it is default value.
		"""
		dynamicOptionsURL = <dynamic-options-url>

		"""The location of your keys file (relative to mpin-backend/servers/dta)."""
		credentialsFile = <credentials-file>

		"""Entropy sources
		D-TA supports multiple ways to gather entropy random, urandom, certivox or
		combination of those.
		"""
		EntropySources = <entropy-source>

		"""CertiVox server secret share acquisition
		- dta - get server secret from CertiVox dta automatically on start
		- credentials.json - get server secret from credentials.json (key: certivox_server_secret)
		- manual - service will prompt for it
		- the secret itself
		You can get your CertiVox server secret by:
		  ./scripts/getServerSecretShare.py credentials.json
		which will output your credentials json including certivox_server_secret.
		NOTE: Don't pipe it directly to the same file - you'll lose your original
		   credentials file.
		Alternatively you can copy only your certivox_server_secret value and supply it
		either manually or via config.py setting the certivoxServerSecret to the
		corresponding value.
		"""
		certivoxServerSecret = <server-secret-source>

		"""Local DTA address."""
		DTALocalURL = <local-dta-url>

		"""Access number options
		- enable access number
		- accessNumberExpireSeconds - The default time client will show the access number
		- accessNumberExtendValiditySeconds - Validity of the access number (on top of accessNumberExpireSeconds)
		- accessNumberUseCheckSum - Should access number have checksum
		"""
		requestOTP = <request-otp>
		accessNumberExpireSeconds = <access-number-expiration-in-seconds>
		accessNumberExtendValiditySeconds = <access-number-extend-validity-in-seconds>
		accessNumberUseCheckSum = <access-number-use-checksum>

		"""Authentication options
		- waitForLoginResult -For the mobile flow. Wait the browser login before showing the Done/Logout button.
		"""
		waitForLoginResult = <wait-for-login-result>
		VerifyUserExpireSeconds = <user-verification-expiration-in-seconds>
		maxInvalidLoginAttempts = <max-invalid-login-attempts>
		cacheTimePermits = <cache-time-permits>

		"""RPA options
		- RPAPermitUserURL - RPA Revocation endpoint
		- RegisterForwardUserHeaders - Coma separated list of headers
		  - '' - do not forward headers
		  -* - forward all headers
		- LogoutURL - RPA Logout url. For logout using the mobile client.
		"""
		RPAVerifyUserURL = <rpa-verify-user-endpoint>
		RPAPermitUserURL = <rpa-permit-user-endpoint>
		RPAAuthenticateUserURL = <rpa-auth-validation-endpoint>
		RegisterForwardUserHeaders = <forward-headers>
		LogoutURL = <logout-endpoint>

		"""PIN pad client options"""
		rpsBaseURL = <rps-public-requests-base-url>
		rpsPrefix = <rps-public-requests-prefix>
		setDeviceName = <set-device-name>

		"""Key value storage options"""
		storage = <storage>

		redisHost = <redis-host>
		redisPort = <redis-port>
		redisDB = <redis-db>
		redisPassword = <redis-password>
		redisPrefix = <redis-prefix>

		fileStorageLocation = <json-storage-file-name>

		"""Debug options"""
		logLevel = <log-level>
</code></pre>

*&lt;rps-port&gt;* - The port on which the RPS listens. Example: 8011

*&lt;rps-public-requests-base-url&gt;* - Base URL for the Public RPS API. This is address of the proxy, through which RPS requests might be done and could be relative. The client will append to this URL &quot;/rps/&lt;endpoint&gt;&quot; to make a request to the RPS. Example (Default): &quot;&quot; (empty)

*&lt;rps-public-requests-prefix&gt;* - The prefix for Public RPS API. Example (Default): &quot;rps&quot;

*&lt;credentials-file&gt;* - The file that includes the Customer credential as App ID and App Key. Example: <span abp="4147">&quot;/opt/mpin/credentials.json&quot;

*&lt;entropy-source&gt;* - Defines where the RPS gets entropy from. Two sources are available &#39;dev_urandom&#39; and &#39;certivox&#39; as each one could be used to get the whole entropy from, or both could be combined with a specific percentage of entropy to be retrieved from each source. Examples: &#39;dev_urandom:100&#39; (the Default), &#39;dev_urandom:60,certivox:40&#39;.

*&lt;server-secret-source&gt;* - Defines where the RPS, serving as a M-Pin Auth. Server, should take its Server Secret from. The available options are:

- get the secret from the D-TA
- read it from the credentials file
- the RPS will prompt to read it from the user/admin

Explicitly specified in the config file.

Example (Default): &#39;dta&#39;  

*&lt;rpa-verify-user-endpoint&gt;* - The RPA endpoint for end-user identity verification. Example: &quot;http://127.0.0.1:8005/mpinVerify&quot;

*&lt;rpa-auth-validation-endpoint&gt;* - Endpoint implemented by the RPA for authentication validation. Example: &quot;/mpinAuthenticate&quot;

*&lt;rpa-permit-user-endpoint&gt;* - Endpoint implemented by the RPA for end-user revocation. Example: &quot;http://127.0.0.1:8005/mpinPermitUser&quot;

*&lt;local-dta-url&gt;* - The URL for the Customer-hosted D-TA Service. Example: &quot;http://127.0.0.1:8001&quot;

*&lt;wait-for-login-result&gt;* - Indicates (True or False) whether the RPS should wait for the POST /loginResult request before returning response to POST /rps/authenticate.

*&lt;logout-endpoint&gt;* - Default endpoint, typically implemented by the RPA, to which the Mobile App should make the logout request. This endpoint might be overwritten with the POST /loginResult, or alternatively might not be set as configuration option, but provided only during the request. Example: &quot;/logout&quot;

*&lt;set-device-name&gt;* - Indication (True or False) that is send from the RPS to the Client within the Client Settings. If set to *True*, the Client should obtain a friendly device name and send it to the RPS within the PUT /rps/user request. The RPS will then forward it to the RPA within the POST /verify request.

*&lt;request-otp&gt;* - Indicates (True or False) whether One-Time Password should be generated on successful authentication. Used for the Arion Server.

*&lt;access-number-expiration-in-seconds&gt;* - Access Number expiration period in seconds.

*&lt;access-number-extend-validity-in-seconds&gt;* Additional extension in seconds of the Access Number validity. While the previous number *&lt;access-number-expiration-in-seconds&gt;* is the one that the user sees in the UI. This additional extension is invisible and is meant to allow the user to enter an access number in the last seconds of the timeout period, and it is still processed. Example (Default): 5

*&lt;access-number-use-checksum&gt;* - Indicates (True or False) whether the generated Access Number includes a checksum digit, or not. This option is also provided in the client settings so the Client can act accordingly.

*&lt;user-verification-expiration-in-seconds&gt;* - Expiration time in seconds for the end-user identity verification completion. Example: <span abp="4183">3600

*&lt;storage&gt;* - The storage mechanism that the RPS should use. Currently available storage&#39;s are &quot;memory&quot; (default), &quot;redis&quot;

*&lt;redis-host&gt;* - The address of the Redis storage to be used in case that storage option is set to &quot;redis&quot;. Example: &quot;127.0.0.1&quot;

*&lt;redis-prefix&gt;* - Prefix to be used when storing elements on Redis. Example: &quot;mpin&quot;

*&lt;json-storage-file-name&gt;* - Path and name for the JSON-formatted file to be used as a storage. This option is useful when several RPS instances are running on the same machine for better CPU core utilization.

*&lt;access-control-allow-origin&gt;* - a list of origins that are specified in the Access-Control-Allow-Origin header. The format is a comma-separated list, enclosed by square brackets. The default is to allow any origin - [&#39;*&#39;]

*&lt;sync-time&gt;* - Indicates (True or False) whether the RPS should make an attempt to syn its time with the CertiVox API. The RPS should be in sync with the rest of the services in any case, but the machine on which it is running might be synced through other means, like NTP.

*&lt;max-invalid-login-attempts&gt;* - The number of consecutive invalid login attempts after which the end-user is blocked. Example (Default): 3

*&lt;cache-time-permits&gt;* - Indicates (True or False) whether the RPS should cache the time permits that the local D-TA generates. If they are cached, it is done either in memory on in the Redis database.

*&lt;dynamic-options-url&gt;* - URL to retrieve dynamic configuration options from. This option allows the RPA to provide an endpoint from which the RPS could retrieve some of the config options. This way the RPA could control some of the RPS&#39;s config options. If not specified or set to &#39;None&#39;, the RPS won&#39;t query for dynamic options, which is the default.

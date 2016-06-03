---
currentMenu: milagro-mfa-api-reference
---

<div id="generated-toc" class="generate_from_h2"></div>

# Milagro MFA Server API Reference


## Acronyms

<table abp="2763" class="confluenceTable tablesorter">
	<thead abp="2764">
		<tr abp="2765" class="sortableHeader">
			<th abp="2766" class="confluenceTh sortableHeader" data-column="0">
			<div abp="2767" class="tablesorter-header-inner">Acronym</div>
			</th>
			<th abp="2768" class="confluenceTh sortableHeader" data-column="1">
			<div abp="2769" class="tablesorter-header-inner">Description</div>
			</th>
		</tr>
	</thead>
	<tbody abp="2770">
		<tr abp="2771">
			<td abp="2772" class="confluenceTd">RPS</td>
			<td abp="2773" class="confluenceTd">Relying Party Service</td>
		</tr>
		<tr abp="2774">
			<td abp="2775" class="confluenceTd">RPA</td>
			<td abp="2776" class="confluenceTd">Relying Party Application</td>
		</tr>
		<tr abp="2777">
			<td abp="2778" class="confluenceTd">D-TA</td>
			<td abp="2779" class="confluenceTd">Distributed Trust Authority</td>
		</tr>
		<tr abp="2780">
			<td abp="2781" class="confluenceTd">ACL</td>
			<td abp="2782" class="confluenceTd">Access Control List</td>
		</tr>
		<tr abp="2783">
			<td abp="2784" class="confluenceTd">OTP</td>
			<td abp="2785" class="confluenceTd">One-Time Password</td>
		</tr>
		<tr abp="2786">
			<td abp="2787" class="confluenceTd" colspan="1">OTT</td>
			<td abp="2788" class="confluenceTd" colspan="1">One-Time Token</td>
		</tr>
	</tbody>
</table>

## System Overview

The platform consists of two groups of Services - local services running on a server and cloud hosted services.

### Local Services

- **RPS/Milagro MFA Server** - Relying Party Service. Implements the authentication protocol and workflows. &nbsp;The RPS serves as an abstraction layer between the specific implementation of the protocol and the RPA.&nbsp; RPS also serves as an authentication server
- **D-TA** - Distributed Trust Authority Service, running on the server. Responsible to generate Client and Server Secret Shares as well as Time Permit Shares
- **RPA** - Relying Party Application. This is the Application to which end-users are authenticated through the Milagro MFA Platform.

### Cloud-hosted Services

- **D-TA** - Distributed Trust Authority Service, running in the cloud. Responsible for generating Client and Server Secret Shares as well as Time Permit Shares.
- **D-TA Proxy** - Proxies requests to the D-TA, validating RPS signatures. The D-TA Proxy is public-facing, while the D-TAs are not be publicly accessible.
- **Time Permits Service** - A service responsible to publish Time Permits to an online storage (CDN), such as AWS S3.
- **Registration Service** - A service that handles new server's registration.

## RPS

The RPS resides on the server. The RPS serves as an abstraction layer between the authentication protocol, workflow and crypto, and the RPA. The RPS provides an API to the RPA, for the operations that the RPA is responsible for, and which cannot be performed by the RPS itself.


### SystemArchitecture
The RPS is a Python written service, based on the Tornado framework, i.e. it serves requests in a single thread utilizing non-blocking IO operations.

The RPS should not be exposed to the public Internet, but it should be accessible by the Client either through the RPA or through a dedicated public facing proxy (e.g. Nginx). For this reason, all the public RPS API requests start with a predefined prefix, which is set by default to */rps*.
Any request that starts with that prefix should be redirected to the RPS by the public facing service - that is the RPA or a proxy. RPS API requests that do not start with the prefix should be accessible only from the server's private network, and more specifically, by the RPA.

Additionally, the RPS will implement an ACL, so only authorized machines will be able to make requests to its API

### RPS Scalability and High Availability

By default, the RPS will store all of its work data in its memory storage. This approach, although simpler and more secure, introduces a problem when the RPS needs to be scaled or made highly available. For this reason the RPS supports an option to use Redis as a work storage and have several RPS instances work together, behind a load balancer. Since the actual state is stored on Redis, the RPS instances become stateless and mutually replaceable. For more information regarding the configuration for Redis storage, see the <a abp="2837" hqid="1662952" href="../configuration/milagro-mfa-configuration.html">configuration</a> guide.

### RPS API

#### Client Initialization

##### GET /rps/clientSettings

<p abp="2846">Called by the client (PIN Pad), through a proxy, to obtain the setting it should use. Most of the settings are service endpoints and server details.</p>

<p abp="2847"><strong abp="2848">Parameters:</strong>&nbsp;&lt;none&gt;</p>

<p abp="2849"><strong abp="2850">Data:</strong>&nbsp;&lt;none&gt;</p>

<p abp="2851"><strong abp="2852">Response:</strong>&nbsp;200 OK on success, 4xx otherwise</p>

<p abp="2853"><strong abp="3134" style="line-height: 1.6em;">Response Data:</strong></p>


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
<*use-web-sockets*>Indicates (true or false) whether the PIN Pad should make an attempt to use WebSockets when authenticating an end-user against the M-Pin Server. If not specified, the default is *true*.

<*set-device-name*> - Indicates (true or false) whether the client should display to and enable the user to set a friendly name for the device. If so, the client should send the device name with the PUT /rps/user request.

<*app-id*> - Server specific Application ID, received upon registration for the Milagro MFA service. It is one of the parameters in the key.json file

<*registration-ott*> - The registration reference number (OTT) provided in the response of PUT/rps/user/<mpin-id\>


<h4 abp="3006" id="TechSpec-M-Pinv0.3RelyingPartyService-Setup"><span abp="3007">Setup</span></h4>

<p abp="3009"><span abp="3010">The purpose of the Setup process is as follows:</span></p>

<ol abp="3011">
	<li abp="3012"><span abp="3013">Verify the user identity</span></li>
	<li abp="3014"><span abp="3015">Get the two Shares of the Client Secret and combine them.</span></li>
	<li abp="3016"><span abp="3017">Extract the user PIN Code from the Client Secret to form the M-Pin Token.</span></li>
	<li abp="3018"><span abp="3019">Store the M-Pin Token on the Client machine.</span></li>
</ol>
</div>

### PUT /rps/user/<mpin−id\>

This request is made by the Client (through a proxy) to initiate the Setup flow for an end-user, or to re-start it. When the flow is initially started, the request is made without the optional&nbsp;<em abp="3024">/&lt;mpin-id&gt;</em>. In this case the RPS generates a new &lt;mpin-id&gt; which is returned in the response data. The &lt;mpin-id&gt; is a hex-encoded JSON structure of the following form:

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

## POST /user/<mpin-id\>

This request is made by the RPA when the end-user identity verification is complete.

<mpin-id\> is the hex-encoded M-Pin ID

**Parameters:** <none>

Data:

```
{
    "activateKey": <activation-key>
}
```
<*activation-key*> - The activation key provided by the RPS during the POST /verify request to the RPA.

**Response:** 200 OK on success, 4xx otherwise

**Response Data:** <none\>

### GET /rps/signature/<mpin-id>?regOTT=<registration-ott\>

This request is made by the Client (through a proxy) and serves several purposes:

- To obtain the server share of the Time Permit. As part of this request the RPS will get the Time Permit share from the server D-TA and will return it in the response.
- To obtain the parameters that should be used to request the cloud share of the Time Permit. Those parameters include a unique signature without which the cloud-hosted D-TA will not fulfill the request.
- To generate obfuscated (hashed) M-Pin ID, which is further used by the cloud-hosted services to identify the end-user.

<p abp="3223">&lt;mpin-id&gt; is the hex-encoded M-Pin ID.</p>

<p abp="3224"><strong abp="3225">Parameters:&nbsp;</strong>regOTT=&lt;registration-ott&gt;</p>

<p abp="3226"><em abp="3227">&lt;registration-ott&gt;</em>&nbsp;- The registration reference number (OTT) provided in the response of&nbsp;<span abp="3228">PUT /rps/user[/&lt;mpin-id&gt;]</span></p>

<p abp="3230"><strong abp="3231">Data:</strong>&nbsp;&lt;none&gt;</p>

<p abp="3232"><strong abp="3233">Response:</strong>&nbsp;200 OK on success, 4xx otherwise</p>

<p abp="3234"><strong abp="3235">Response Data:</strong><span abp="3236">&nbsp;</span></p>

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
</br>
<h5 abp="3263" id="TechSpec-M-Pinv0.3RelyingPartyService-POST/rps/setupDone/&lt;mpin-id&gt;">POST /rps/setupDone/&lt;mpin-id&gt;</h5>

<p abp="3265">This request is made by the Client (through a proxy) to announce that the end-user has finalized the setup process, providing his/her PIN Number. Currently no action is taken by the RPS during this request.</p>

<p abp="3266"><em abp="3267">&lt;mpin-id&gt;</em>&nbsp;is the hex-encoded M-Pin ID</p>

<p abp="3268"><strong abp="3269">Parameters:&nbsp;</strong>&lt;none&gt;</p>

<p abp="3270"><strong abp="3271">Data:</strong>&nbsp;&lt;none&gt;</p>

<p abp="3272"><strong abp="3273">Response:</strong>&nbsp;200 OK on success, 4xx otherwise</p>

<p abp="3274"><strong abp="3275">Response Data:</strong><span abp="3276">&nbsp;&lt;none&gt;</span></p>

<h4 abp="3277" id="TechSpec-M-Pinv0.3RelyingPartyService-Authentication"><span abp="3278">Authentication</span></h4>

The Authentication of a user starts with getting a Time Permit for that user identity for the current date. The Time Permit is combined from two shares - one from the server D-TA and one from cloud-hosted D-TA. For efficiency, the cloud share of the Time Permit is cached in two levels - on the Client side (1) and/or on a dedicated cache storage (2). The Client should first of all check whether there is a Time Permit (TP) for the current date cached on the local machine. If so, it should use it. Otherwise, it should make a request to the second cache level - the TP storage. If the TP is retrieved from there, it should be cached locally and used until the end of the day. If there is no TP on the cache storage, a request should be made to the could-hosted D-TA, which will serve the TP, will generate new TP's for the next few days and will store them to the cache storage.

#### GET /rps/timePermit/<mpin-id\>

This request is made by the Client (through a proxy) to obtain the server share of the Time Permit for the given <mpin-id\>. The RPS makes a request to the server-hosted D-TA Service to obtain the Time Permit Share and returns the result to the Client. Prior to sending the request to the D-TA, the RPS will make a *GET /permitUser?mpin_id=* request to the RPA, which might revoke the access to the service for the specified user. The RPA should respond with 200 OK, if the RPS should proceed with the time permit request, or with 403 if the user is revoked. The actual RPA endpoint for the *GET /permitUser* request is configurable. If it is not configured, the RPS will not make this request and will assume that no user should be revoked by the RPA.

Additional purpose of this request is to provide the Client with the current date and the location of the cache storage for cloud share of the Time Permit. The Client should use those in order to check whether the cloud TP share is stored locally, or on the cache storage, or it should be requested from the cloud-hosted D-TA.

As part of this request the RPS will also generate and return in the response a unique signature which should further be used in the request for the second Time Permit Share from the cloud-hosted D-TA Service.

<mpin-id\> is the hex-encoded M-Pin ID.

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
</br>

<*current-date*> - The current date in days since the Epoch (1 January 1970, UTC).

<*response-message*> - A response message, usually "M-Pin Time Permit Generated".

<*mpin-version*> - The version of the M-Pin protocol, currently "0.3".

<*time-permit-share*> - Time Permit Share from the server-hosted D-TA Service.

<*storage-id*> - ID under which the cloud Time Permit Share is possibly stored on the cache storage. This ID is appended to the base Storage URL received in the Client Settings, to form the full URL for accessing the cache storage.

<*signature*> - A unique signature that should be used in subsequent request for the cloud share of the Time Permit.
<p abp="3339"><em abp="3340">&lt;current-date&gt;</em>&nbsp;- The current date in days since the Epoch (<span abp="3341">1 January 1970, UTC</span>).</p>


<h5 abp="3358" id="TechSpec-M-Pinv0.3RelyingPartyService-PUT/token">PUT /token</h5>

<p abp="3360">This request is made by the MFA Server as a result of authentication attempt. The server passes a token which indicates whether the authentication was successful or not, as well as a reference number (serving as an OTT) for the authentication attempt. This reference number is also provided to the Client, which further posts it to the&nbsp;POST /authenticate&nbsp;request to verify the authentication. This call is assumed to be performed over a secured SSL channel.</p>

<p abp="3362"><strong abp="3363">Parameters:&nbsp;</strong>&lt;none&gt;</p>

<p abp="3364"><strong abp="3365">Data:</strong></p>

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

<*signature*>- HMAC signature over the next fields: `<mpinidhex><successCode><expires><WID><OTP><authOTT>`
The validity of this signature is verified by the RPS.

<p abp="3457"><strong abp="3458">Response:</strong><span abp="3459">&nbsp;200 OK on success, 4xx otherwise</span></p>

<p abp="3460"><strong abp="3461">Response Data:</strong>&nbsp;&lt;none&gt;</p>

<h5 abp="3462" id="TechSpec-M-Pinv0.3RelyingPartyService-POST/authenticate">POST /authenticate</h5>

This request is made by the RPA to validate successful authentication for an end-user. The RPA should provide the authentication reference number <*authentication-ott*>, in order for the RPS to validate the authentication result.

<p abp="3467"><strong abp="3468">Parameters:&nbsp;</strong>&lt;none&gt;</p>

<p abp="3469"><strong abp="3470">Data:</strong></p>

```
{
    "authOTT": <authentication-ott>
}
```
<*authentication-ott*>- The authentication reference number (OTT) provided in the final result of the protocol dance between the Client and the Server

<p abp="3490"><strong abp="3491">Response:</strong></p>

<p abp="3492"><span abp="3493">200 Authentication successful - on success;</span></p>

<p abp="3494"><span abp="3495">401 Wrong PIN - on unsuccessful authentication;</span></p>

<p abp="3496"><span abp="3497">410 Wrong PIN&nbsp;- after N&nbsp;unsuccessful&nbsp;authentication&nbsp;</span>attempts.</p>

<p abp="3498">408&nbsp;Expired authentication request - the authOTT is invalid or expired.</p>

<p abp="3499"><strong abp="3500">Response Data:</strong></p>

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

<h4 abp="3542" id="TechSpec-M-Pinv0.3RelyingPartyService-MobileAuthentication">Mobile Authentication</h4>

<h5 abp="3544" id="TechSpec-M-Pinv0.3RelyingPartyService-POST/loginResult"><span abp="3545">POST /loginResult</span><span abp="3547">&nbsp;</span></h5>

<p abp="3548"><span abp="3549">This request is made by the RPA to inform the RPS for a potential login restriction for the end-user that is currently being authenticated, and to provide optional logout data. This request is mostly useful for the Mobile authentication flow, where the Mobile App should receive as a response to the&nbsp;<span abp="3550">POST /rps/authenticate&nbsp;request a valid status, as well as the required data for a subsequent logout operation.</span><span abp="3552">&nbsp;If the&nbsp;</span><span abp="3553"><em abp="3554">waitForLoginResult</em>&nbsp;configuration option is set to&nbsp;<em abp="3556">True</em>, then the RPS will wait for this request before returning a response to&nbsp;POST /rps/authenticate, otherwise it will return the response right after returning response to the&nbsp;</span><span abp="3558">POST /authenticate&nbsp;request from the RPA.</span>&nbsp;</span></p>


<p abp="3560"><strong abp="3561">Parameters:&nbsp;</strong>&lt;none&gt;<span abp="3562">&nbsp;</span></p>

<p abp="3563"><strong abp="3564">Data:</strong></p>


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

<p abp="3605"><strong abp="3606">Response:</strong><span abp="3607">&nbsp;200 OK on success, 4xx otherwise</span><span abp="3608">&nbsp;</span></p>

<p abp="3609"><strong abp="3610">Response Data:</strong>&nbsp;&lt;none&gt;</p>

<h5 abp="3611" id="TechSpec-M-Pinv0.3RelyingPartyService-POST/rps/getAccessNumber"><span abp="3612">POST /rps/getAccessNumber</span></h5>

<p abp="3614"><span abp="3615">This request is made by the Client (through a proxy) to obtain the Access Number that is required for authentication through the Mobile Client.</span></p>

<p abp="3616"><strong abp="3617">Parameters:&nbsp;</strong>&lt;none&gt;</p>

<p abp="3618"><strong abp="3619">Data:</strong>&nbsp;&lt;none&gt;</p>

<p abp="3620"><strong abp="3621">Response:</strong><span abp="3622">&nbsp;200 OK on success, 4xx otherwise</span></p>

<p abp="3623"><strong abp="3624">Response Data:</strong><span abp="3625">&nbsp;</span></p>

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

<h5 abp="3670" id="TechSpec-M-Pinv0.3RelyingPartyService-POST/rps/accessnumber">POST /rps/accessnumber</h5>

<p abp="3672">This request is made by the Client (through a proxy) to check whether an end-user has authenticated through the Mobile App. The Client provides the&nbsp;<em abp="3673">webOTT</em>&nbsp;to refer to the relevant mobile authentication transaction. When an end-user has authenticated successfully through the Mobile Client, an&nbsp;<em abp="3674">authOTT</em>&nbsp;is returned, so subsequent authentication&nbsp;requests to the RPA might be executed.</p>

<p abp="3675"><strong abp="3676">Parameters:&nbsp;</strong>&lt;none&gt;</p>

<p abp="3677"><strong abp="3678">Data:</strong></p>

```
{
    "webOTT": <web-ott>
}
```

<p abp="3696"><strong abp="3697">Response:</strong></p>

<p abp="3698"><span abp="3699">200 OK - Successful Authentication.</span></p>

<p abp="3700"><span abp="3701">401 Unauthorized - User has not been authorized successfully yet.</span></p>

<p abp="3702"><strong abp="3703">Response Data:</strong></p>

<p abp="3704">Sent only with 200 OK response</p>

```
{
    "authOTT": <authentication-ott>
}
```

<*authentication-ott*> - The authentication reference number (OTT) provided in the final result of the protocol dance between the Client and the MFA Server.

<h5 abp="3724" id="TechSpec-M-Pinv0.3RelyingPartyService-POST/rps/authenticate">POST /rps/authenticate</h5>

This request is made by the Mobile Client (through a proxy) to authenticate an end-user. The Mobile Client passes the*authOTT* that was returned by the MFA Server as a result of the protocol dance. The RPS obtains the Authentication Token using the *authOTT* and verifies the result of the authentication.

<p abp="3729"><strong abp="3730">Parameters:&nbsp;</strong>&lt;none&gt;</p>

<p abp="3731"><strong abp="3732">Data:</strong></p>

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

<p abp="3772"><strong abp="3773">Response:</strong></p>

<p abp="3774">200 Authentication successful - on success;</p>

<p abp="3775">401 Wrong PIN - on unsuccessful authentication;</p>

<p abp="3776">410 Wrong PIN&nbsp;- after N&nbsp;unsuccessful&nbsp;authentication&nbsp;attempts.</p>

<p abp="3777">408&nbsp;Expired authentication request - the authOTT is invalid or expired.</p>

<p abp="3778"><strong abp="3779">Response Data:</strong>&nbsp;&lt;none&gt;</p>

<h3 abp="3780" id="TechSpec-M-Pinv0.3RelyingPartyService-ExpectedAPIfortheRPA"><span abp="3781">Expected API for the RPA</span></h3>

The RPA is the only part in the system that is strictly specific to each server instance and implements the logic of the specific Web Application. In order for this Web Application to serve as RPA, it should implement the below RESTful endpoints. Note that the actual URL's for the endpoints are customizable, and therefore example endpoint names are shown in the brackets. The actual endpoint URLs should be configured in the RPS.

<h5 abp="3785" id="TechSpec-M-Pinv0.3RelyingPartyService-End-userVerificationCallbackEndpoint(POST/verify)">End-user Verification Callback Endpoint (POST /verify)</h5>

This request is made as part of the end-user registration and activation flow. The request is made by the RPS to the RPA to either verify the end-user identity in-place, or to initiate end-user identity verification process. If the RPA is able to verify the identity in-place, then it should return 200 OK with response data `{ "forceActivate": true }`. If a verification process has been started (e.g. via sending a verification e-mail to the end-user), then the RPA should make a POST /user/&lt;mpin-id request to the RPS when the user identity has been verified, providing the same *activateKey* that was received in this request.

<p abp="3794"><strong abp="3795">Parameters:</strong>&nbsp;&lt;none&gt;</p>

<p abp="3796"><strong abp="3797">Data:</strong></p>

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


<p abp="3873"><strong abp="3874">Response:</strong></p>

<p abp="3875">200 OK - user identity is verified or a verification process has been started</p>

<p abp="3876"><span abp="3877">4xx - user verification has failed.</span></p>

<p abp="3878"><strong abp="3879">Response Data:</strong></p>

```
{
    "forceActivate": <true|false>
}
```
*forceActivate* should be set to true if the end-user has been verified in-place and the RPS should not expect further POST /user/<mpin-id\> request to activate the user.

<h5 abp="3907" id="TechSpec-M-Pinv0.3RelyingPartyService-End-userPermissionCallbackEndpoint(GET/permitUser?mpin_id=&lt;mpin-id&gt;)"><span abp="3908">End-user Permission Callback&nbsp;</span>Endpoint&nbsp;<span abp="3911">(GET /permitUser?mpin_id=&lt;mpin-id&gt;)</span></h5>

This request is optionally made as part of the end-user authentication flow. It is not mandatory to implement this endpoint. If implemented, the RPS will make this request to the RPA in order to assert that the end-user authentication might proceed on, and it can request the time permit shares for that user.

If this endpoint is not set in the RPS configuration, the RPS won't make this request and will assume that the RPA is not interested to revoke any end-users.


<p abp="3917"><strong abp="3918">Parameters:</strong>&nbsp;mpin_id=&lt;mpin-id&gt;</p>

<p abp="3919"><em abp="3920">&lt;mpin-id&gt;</em>&nbsp;is the hex-encoded M-Pin ID.</p>

<p abp="3921"><strong abp="3922">Data:</strong>&nbsp;&lt;none&gt;</p>

<p abp="3923"><strong abp="3924">Response:</strong></p>

<p abp="3925">200 OK - end-user is permitted to proceed with authentication</p>

<p abp="3926"><span abp="3927">4xx - end-user is not permitted not&nbsp;proceed with authentication</span></p>

<p abp="3928"><strong abp="3929">Response Data:</strong>&nbsp;&lt;none&gt;</p>

<h5 abp="3930" id="TechSpec-M-Pinv0.3RelyingPartyService-End-userAuthenticationEndpoint(POST/authenticate)">End-user Authentication&nbsp;<span abp="3932">Endpoint&nbsp;</span><span abp="3933">(POST /authenticate)</span></h5>

This request is part of the end-user authentication flow. It is made by the PIN Pad to the RPA in order to verify the end-user authentication against the MFA Server. The PIN Pad first authenticates the end-user against the server and athen sends the result of that authentication to the RPA for verification. The RPA should then make POST /authenticate request to the RPS, sending only the *authOTT* in the request data. The RPS verifies that this *authOTT* corresponds to a valid Authentication Token and return status. The RPA should return the same status in the response to the PIN Pad, but it can return also some custom response data that might be used on the client side.

Implementing this endpoint is mandatory, and its URL should be set in the RPS configuration. The RPS will propagate it to the PIN Pad within the Client Settings.

**Parameters**: <none>
**Data**:


<p abp="3945"><strong abp="3946">Parameters:</strong>&nbsp;&lt;none&gt;</p>

<p abp="3947"><strong abp="3948">Data:</strong></p>

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


<p abp="3986"><strong abp="3987">Response:&nbsp;</strong><span abp="3988">The response should be basically the same as the one returned by the RPS&nbsp;</span><em abp="3989">POST /<span abp="3990">authenticate&nbsp;</span></em><span abp="3991">request</span></p>

<p abp="3992">200 Authentication successful - on success;</p>

<p abp="3993">401 Wrong PIN - on unsuccessful authentication;</p>

<p abp="3994">410 Wrong PIN&nbsp;- after N&nbsp;unsuccessful&nbsp;authentication&nbsp;attempts.</p>

<p abp="3995">408&nbsp;Expired authentication request - the authOTT is invalid or expired.</p>

<p abp="3996"><strong abp="3997">Response Data:&nbsp;</strong>&lt;none&gt; or any JSON-formatted application-specific data.&nbsp;This data might be used on the front-end side to implement any application-specific logic<span abp="3998">.</span></p>

<h3 abp="3999" id="TechSpec-M-Pinv0.3RelyingPartyService-Workflows"><span abp="4000">Workflows</span></h3>

<h4 abp="4002" id="TechSpec-M-Pinv0.3RelyingPartyService-M-PinSetup">End user registration flow</h4>

<p abp="4004"><img abp="4005" class="confluence-embedded-image" confluence-query-params="effects=border-simple,shadow-kn" data-image-src="/download/attachments/11534356/M-Pin%20Setup.png?version=11&amp;modificationDate=1413213302000&amp;api=v2&amp;effects=border-simple,shadow-kn" height="1413" src="http://docs.miracl.com/userfiles/1995/3089/ckfinder/images/M-Pin%20Setup.png?dc=201502241747-0" style="margin-right: auto; margin-left: auto; display: block;" width="1260" /></p>

<h4 abp="4006" id="TechSpec-M-Pinv0.3RelyingPartyService-M-PinAuthentication">End user authentication flow</h4>

<p abp="4008"><img abp="4009" class="confluence-embedded-image" confluence-query-params="effects=border-simple,shadow-kn" data-image-src="/download/attachments/11534356/M-Pin%20Authentication.png?version=8&amp;modificationDate=1413213302000&amp;api=v2&amp;effects=border-simple,shadow-kn" height="1163" src="http://docs.miracl.com/userfiles/1995/3089/ckfinder/images/M-Pin%20Authentication(1).png?dc=201502241747-0" style="margin-right: auto; margin-left: auto; display: block;" width="1261" /></p>

<h4 abp="4010" id="TechSpec-M-Pinv0.3RelyingPartyService-M-PinMobileAuthentication">End user mobile authentication</h4>

<p abp="4012"><img abp="4013" class="confluence-embedded-image" confluence-query-params="effects=border-simple,shadow-kn" data-image-src="/download/attachments/11534356/M-Pin%20Mobile%20Authentication.png?version=7&amp;modificationDate=1413213302000&amp;api=v2&amp;effects=border-simple,shadow-kn" height="1310" src="http://docs.miracl.com/userfiles/1995/3089/ckfinder/images/M-Pin%20Mobile%20Authentication.png?dc=201502241747-0" style="margin-right: auto; margin-left: auto; display: block;" width="1256" /></p>

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
		    - * - forward all headers
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
</br></br>
<p abp="4134"><em abp="4135">&lt;rps-port&gt;</em>&nbsp;- The port on which the RPS listens. Example: 8011</p>

<p abp="4138"><em abp="4139">&lt;rps-public-requests-base-url&gt;</em><span abp="4140">&nbsp;- Base URL for the Public RPS API. This is address of the proxy, through which RPS requests might be done and could be relative. The client will append to this URL &quot;/rps/&lt;endpoint&gt;&quot; to make a request to the RPS. Example (Default):</span>&quot;&quot; (empty)</p>

<p abp="4142"><em abp="4143">&lt;rps-public-requests-prefix&gt;</em>&nbsp;- The prefix for Public RPS API. Example (Default): &quot;rps&quot;</p>

<p abp="4144"><span abp="4145"><em abp="4146">&lt;credentials-file&gt;</em>&nbsp;- The file that includes the Customer credential&nbsp;as App ID and App Key. Example:&nbsp;</span><span abp="4147">&quot;/opt/mpin/credentials.json&quot;</span></p>

<p abp="4148">&lt;entropy-source&gt;&nbsp;- Defines where the RPS gets entropy from. Two sources are available &#39;dev_urandom&#39; and &#39;certivox&#39; as each one could be used to get the whole entropy from, or both could be combined with a specific percentage of entropy to be retrieved from each source. Examples: &#39;dev_urandom:100&#39; (the Default), &#39;dev_urandom:60,certivox:40&#39;.</p>

<p abp="4148"><em style="margin: 0px; padding: 0px; border: none;"><span class="diff-html-added" style="margin: 0px; padding: 2px 4px; border: 0px rgb(147, 196, 159);">&lt;server-secret-source&gt;</span></em><span class="diff-html-added" style="margin: 0px; padding: 2px 4px; border: 0px rgb(147, 196, 159);">&nbsp;- Defines where the RPS, serving as a M-Pin Auth. Server, should take its Server Secret from. The available options are:</span></p>

<ul class="diff-block-target diff-block-context" style="font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif; margin: 10px 0px 0px 40px; padding: 0px; border: none; color: rgb(51, 51, 51); font-size: 12px; line-height: 17.1429px; background-color: rgb(255, 255, 255);">
	<li><span class="diff-html-added" style="margin: 0px; padding: 2px 4px; border: 0px rgb(147, 196, 159);">&#39;dta&#39; - get the secret from the D-TA</span></li>
	<li><span class="diff-html-added" style="margin: 0px; padding: 2px 4px; border: 0px rgb(147, 196, 159);">&#39;credentials.json&#39; - read it from the credentials file</span></li>
	<li><span class="diff-html-added" style="margin: 0px; padding: 2px 4px; border: 0px rgb(147, 196, 159);">&#39;manual&#39; - the RPS will prompt to read it from the user/admin</span></li>
	<li><span class="diff-html-added" style="margin: 0px; padding: 2px 4px; border: 0px rgb(147, 196, 159);">Explicitly specified in the config file.</span></li>
</ul>

<p class="diff-block-target diff-block-context" style="font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif; margin: 10px 0px 0px 30px; padding: 0px; border: none; color: rgb(110, 112, 110); font-size: 12px; line-height: 17.1429px; background-color: rgb(255, 255, 255);"><span style="color:#000000;"><span style="font-size:14px;"><span class="diff-html-added" style="margin: 0px; padding: 2px 4px; border: 0px rgb(147, 196, 159);">Example (Default): &#39;dta&#39;</span></span></span></p>

<p abp="4148"><em abp="4152">&lt;rpa-verify-user-endpoint&gt;</em>&nbsp;- The RPA endpoint for end-user identity verification. Example:&nbsp;&quot;http://127.0.0.1:8005/mpinVerify&quot;</p>

<p abp="4153"><em abp="4154">&lt;rpa-auth-validation-endpoint&gt;</em><span abp="4155">&nbsp;- Endpoint implemented by the RPA for&nbsp;</span>authentication&nbsp;validation.&nbsp;<span abp="4157">Example: &quot;/mpinAuthenticate&quot;</span></p>

<p abp="4158"><span abp="4159"><em abp="4160">&lt;rpa-permit-user-endpoint&gt;</em>&nbsp;- Endpoint implemented by the RPA for&nbsp;end-user revocation. Example: &quot;http://127.0.0.1:8005/mpinPermitUser&quot;</span></p>

<p abp="4161"><em abp="4162">&lt;local-dta-url&gt;</em>&nbsp;- The URL for the Customer-hosted D-TA Service. Example:&nbsp;<span abp="4163">&quot;http://127.0.0.1:8001&quot;</span></p>

<p abp="4164"><span abp="4165"><em abp="4166">&lt;wait-for-login-result&gt;</em>&nbsp;- Indicates (True or False) whether the RPS should wait for the&nbsp;</span><span abp="4167">POST /loginResult&nbsp;request before returning response to&nbsp;POST /rps/authenticate.</span></p>

<p abp="4168"><span abp="4169"><em abp="4170">&lt;logout-endpoint&gt;</em>&nbsp;- Default endpoint, typically implemented by the RPA, to which the Mobile App should make the logout request. This endpoint might be overwritten with the&nbsp;POST /loginResult, or alternatively might not be set as configuration option, but provided only during the request. Example: &quot;/logout&quot;</span></p>

<p abp="4171"><em abp="4172">&lt;set-device-name&gt;</em>&nbsp;- Indication&nbsp;(True or False) that is send from the RPS to the Client within the Client Settings. If set to&nbsp;<em abp="4173">True</em>, the Client should obtain a friendly device name and send it to the RPS within the&nbsp;PUT /rps/user&nbsp;request. The RPS will then forward it to the RPA within the&nbsp;POST /verify&nbsp;request.</p>

<p abp="4174"><em abp="4175">&lt;request-otp&gt;</em><span abp="4176">&nbsp;- Indicates (True or False) whether One-Time Password should be generated on successful&nbsp;authentication.&nbsp;</span><span abp="4177">Used for the Arion Server.</span></p>

<p abp="4178"><em abp="4179">&lt;access-number-expiration-in-seconds&gt;</em><span abp="4180">&nbsp;- Access Number expiration period in seconds.</span></p>

<p abp="4178"><em abp="4179">&lt;access-number-extend-validity-in-seconds&gt;</em>&nbsp;Additional extension in seconds of the Access Number validity. While the previous number&nbsp;<em style="font-family: Verdana, Arial, Helvetica, sans-serif; line-height: 19.2px; font-size: 14px; background-color: rgb(255, 255, 255);"><span class="diff-html-added" style="margin: 0px; padding: 2px 4px; border: 0px rgb(147, 196, 159);">&lt;access-number-expiration-in-seconds&gt;</span></em>&nbsp;is the one that the user sees in the UI. This additional extension is invisible and is meant to allow the user to enter an access number in the last seconds of the timeout period, and it is still processed. Example (Default): 5</p>

<p abp="4178"><span abp="4182"><em abp="4182">&lt;access-number-use-checksum&gt;</em>&nbsp;- Indicates (True or False) whether the generated Access Number includes a checksum digit, or not. This option is also provided in the client settings so the Client can act accordingly.</span></p>

<p abp="4181"><em abp="4182">&lt;user-verification-expiration-in-seconds&gt;</em>&nbsp;- Expiration time in seconds for the end-user identity verification completion. Example:&nbsp;<span abp="4183">3600</span></p>

<p abp="4193"><span abp="4194"><em abp="4195">&lt;storage&gt;</em>&nbsp;- The storage mechanism that the RPS should use. Currently available storage&#39;s are &quot;memory&quot; (default), &quot;redis&quot;</span></p>

<p abp="4196"><em abp="4197">&lt;redis-host&gt;</em>&nbsp;- The address of the Redis storage to be used in case that storage option is set to &quot;redis&quot;. Example: &quot;127.0.0.1&quot;</p>

<p abp="4204"><em abp="4205">&lt;redis-prefix&gt;</em>&nbsp;- Prefix to be used when storing elements on Redis. Example: &quot;mpin&quot;</p>

<p abp="4204"><em style="margin: 0px; padding: 0px; border: none;"><span class="diff-html-added" style="margin: 0px; padding: 2px 4px; border: 0px rgb(147, 196, 159);">&lt;json-storage-file-name&gt;</span></em><span class="diff-html-added" style="margin: 0px; padding: 2px 4px; border: 0px rgb(147, 196, 159);">&nbsp;- Path and name for the JSON-formatted file to be used as a storage. This option is useful when several RPS instances are running on the same machine for better CPU core utilization.</span></p>

<p abp="4204"><em style="margin: 0px; padding: 0px; border: none;"><span class="diff-html-added" style="margin: 0px; padding: 2px 4px; border: 0px rgb(147, 196, 159);">&lt;access-control-allow-origin&gt;</span></em><span class="diff-html-added" style="margin: 0px; padding: 2px 4px; border: 0px rgb(147, 196, 159);">&nbsp;- a list of origins that are specified in the Access-Control-Allow-Origin header. The format is a comma-separated list, enclosed by square brackets. The default is to allow any origin -&nbsp;[&#39;*&#39;]&nbsp;</span></p>

<p abp="4204"><em style="margin: 0px; padding: 0px; border: none;"><span class="diff-html-added" style="margin: 0px; padding: 2px 4px; border: 0px rgb(147, 196, 159);">&lt;sync-time&gt;</span></em><span style="margin: 0px; padding: 2px 4px; border: 0px rgb(147, 196, 159);">&nbsp;- Indicates (True or False) whether the RPS should make an attempt to syn its time with the CertiVox API. The RPS should be in sync with the rest of the services in any case, but the machine on which it is running might be synced through&nbsp;other means, like NTP.</span></p>

<p abp="4204"><em style="margin: 0px; padding: 0px; border: none;"><span class="diff-html-added" style="margin: 0px; padding: 2px 4px; border: 0px rgb(147, 196, 159);">&lt;max-invalid-login-attempts&gt;</span></em><span class="diff-html-added" style="margin: 0px; padding: 2px 4px; border: 0px rgb(147, 196, 159);">&nbsp;- The number of consecutive invalid login attempts after which the end-user is blocked. Example (Default): 3</span></p>

<p abp="4204"><em style="margin: 0px; padding: 0px; border: none;"><span class="diff-html-added" style="margin: 0px; padding: 2px 4px; border: 0px rgb(147, 196, 159);">&lt;cache-time-permits&gt;</span></em><span class="diff-html-added" style="margin: 0px; padding: 2px 4px; border: 0px rgb(147, 196, 159);">&nbsp;- Indicates (True or False) whether the RPS should cache the time permits that the local D-TA generates. If they are cached, it is done either in memory on in the Redis database.</span></p>

<p abp="4204"><em style="margin: 0px; padding: 0px; border: none;"><span class="diff-html-added" style="margin: 0px; padding: 2px 4px; border: 0px rgb(147, 196, 159);">&lt;dynamic-options-url&gt;</span></em><span class="diff-html-added" style="margin: 0px; padding: 2px 4px; border: 0px rgb(147, 196, 159);">&nbsp;- URL to retrieve dynamic configuration options from. This option allows the RPA to provide an endpoint from which the RPS could retrieve some of the config options. This way the RPA could control some of the RPS&#39;s config options. If not specified or set to &#39;None&#39;, the RPS won&#39;t query for dynamic options, which is the default.</span></p>
</div>

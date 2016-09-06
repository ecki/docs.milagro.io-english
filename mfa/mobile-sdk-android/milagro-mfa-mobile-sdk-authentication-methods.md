---
currentMenu: milagro-mfa-mobile-sdk-authentication-methods-android
---

# Authentication Methods

This page provides a list of the Authentication methods used, along with brief descriptions, in the M-Pin Mobile SDK for iOS. They relate to performing User Authentication.

To view the other methods, refer to the [API Reference](/milagro-mfa-mobile-sdk-api-reference.html) page.
___
## StartAuthentication
___

This method starts the authentication process for a given `user`. It attempts to retrieve the Time Permits for the user. If successful, it returns status code `OK`, and if not, it returns status code `REVOKED`. If the Time Permits are retrieved, the app reads the PIN/secret from the end-user and calls one of the `FinishAuthentication` variants to authenticate the user.

### Definition
```
Status StartAuthentication(User user)
```

### Parameters
|Parameter Name|Parameter Type|Required?|Description|
|--------------|--------------|---------|-----------|
|`user`|User|Yes|The user ID|

### Return Status Codes

* `OK` - The authentication process has been started successfully
* `REVOKED` - Time permit for the given user was refused by the server.
* `FLOW_ERROR` - The user is in the incorrect state, i.e. its state is not `REGISTERED`

### Example

```
Status status = sdk.StartAuthentication(user);

switch (status.getStatusCode())
{
    case Status.Code.OK:
        break;
    case Status.Code.REVOKED:
        // User is revoked, cannot authenticate
        break;
    default:
        // Show error message and exit
        break;
}

String authPin;
//
// Read PIN Code or secret from the user
//
status = sdk.FinishAuthentication(user, authPin);

switch (status.getStatusCode())
{
    case Status.Code.OK:
        // Authentication successful
        break;
    case Status.Code.INCORRECT_PIN:
        // Authentication failed
        if (user.GetState() == State.BLOCKED)
        {
            // User is blocked and cannot authenticate anymore
        }
        break;
    default:
        // Show error message and exit
        break;
}
```
___
## CheckAccessNumber
___
This method is used only when a user needs to be authenticated to a remote (browser) session, using Access Number. The access numbers have a check-sum digit in them which needs to be verified on the client side, in order to prevent calling the back-end with non-compliant access numbers. The method returns status `OK` if successful, and status `INCORRECT_ACCESS_NUMBER` if not.

### Definition
```
Status CheckAccessNumber(String accessNumber)
```

### Parameters
|Parameter Name|Parameter Type|Required?|Description|
|--------------|--------------|---------|-----------|
|`accessNumber`|String|Yes|Access Number used for authenticating a user to a remote browser|

### Return Status
* `OK` (if successful)
* `INCORRECT_ACCESS_NUMBER` (if not)

### Examples
```
Status status = sdk.StartAuthentication(user);

switch (status.getStatusCode())
{
    case Status.Code.OK:
        break;
    case Status.Code.REVOKED:
        // User is revoked, cannot authenticate
        break;
    default:
        // Show error message and exit
        break;
}

String accessNumber;
//
// Read Access Number from the user
//

status = sdk.CheckAccessNumber(accessNumber);

if (status.getStatusCode() != Status.Code.OK)
{
    // Access Number is not correct
}

String authPin;
//
// Read PIN Code or secret from the user
//
status = sdk.FinishAuthenticationAN(user, authPin, accessNumber);

switch (status.getStatusCode())
{
    case Status.Code.OK:
        // Authentication successful
        break;
    case Status.Code.INCORRECT_ACCESS_NUMBER:
        // Access Number not accepted by server
        break;
    case Status.Code.INCORRECT_PIN:
        // Authentication failed
        if (user.GetState() == State.BLOCKED)
        {
            // User is blocked and cannot authenticate anymore
        }
        break;
    default:
        // Show error message and exit
        break;
}
```
___
## FinishAuthentication
___
This method performs end-user authentication. The `user` to be authenticated and the pin (secret) are passed as parameters. The method uses the provided pin and the stored M-Pin Token to do the authentication against the Milagro MFA Server and then logs into the RPA. The RPA passes back User Data with the authentication response, which is returned to the application through the `authResultData` parameter. If authenticated, the returned status is OK and if not, it would be `INCORRECT_PIN`.

After the third (configurable in the RPS) unsuccessful authentication attempt, the method returns status `INCORRECT_PIN` and the User State is set to `BLOCKED`.

### Definition
```
Status FinishAuthentication(User user, String pin)

Status FinishAuthentication(User user, String pin, StringBuilder authResultData)

```

### Parameters

|Parameter Name|Parameter Type|Required?|Description|
|--------------|--------------|---------|-----------|
|`user`|User|Yes|The User ID|
|`pin`|String|Yes|The PIN/secret entered by the end-user|
|`authResultData`|StringBuilder|No|The authentication result data that is returned by the RPA|

### Return Values
* `OK` - Authentication successfull
* `INCORRECT_PIN` - Authentication failed.
* `FLOW_ERROR` - The user is in the incorrect state.

### Example
```
Status status = sdk.StartAuthentication(user);

switch (status.getStatusCode())
{
    case Status.Code.OK:
        break;
    case Status.Code.REVOKED:
        // User is revoked, cannot authenticate
        break;
    default:
        // Show error message and exit
        break;
}

String authPin;
//
// Read PIN Code or secret from the user
//
status = sdk.FinishAuthentication(user, authPin);

switch (status.getStatusCode())
{
    case Status.Code.OK:
        // Authentication successful
        break;
    case Status.Code.INCORRECT_PIN:
        // Authentication failed
        if (user.GetState() == State.BLOCKED)
        {
            // User is blocked and cannot authenticate anymore
        }
        break;
    default:
        // Show error message and exit
        break;
}
```
___
## FinishAuthenticationOTP
___
This method performs end-user authentication for an OTP. It is similar to the FinishAuthentication method but the RPA issues an OTP instead of logging the user into the application. The returned status is also similar to the FinishAuthentication method except that an OTP structure is returned.

The OTP structure is as follows:
```
class OTP
{
public:
    String otp;
    long expireTime;
    int ttlSeconds;
    long nowTime;
    Status status;
};
```
|Terms used|Description|
|----------|-----------|
|otp|The otp string is the issued OTP|
|expireTime|The M-Pin system time when the OTP expires|
|ttlSeconds|The expiration period in seconds|
|nowTime|The current M-Pin system time|
|status|The status of the OTP generation. If OK - OTP is successfully generated, if `FLOW_ERROR` - OTP was not generated, probably because the RPA doesn't support that functionality.|

_Note that OTP is generated only by RPA's that support this functionality, such as M-Pin SSO. For RPA's that do not support OTP generation, the status within the returned otp structure would be Status `FLOW_ERROR`._

### Definition
```
Status FinishAuthenticationOTP(User user, String pin, OTP otp)
```

### Parameters

|Parameter Name|Parameter Type|Required?|Description|
|--------------|--------------|---------|-----------|
|`user`|User|Yes|The user that is being authenticated|
|`pin`|String|Yes|The PIN/secret that the user has entered|
|`otp`|OTP|Yes|The resulting OTP is returned here.|

### Return Status
* `OK` - Authentication successfull
* `INCORRECT_PIN` - Authentication failed.
* `FLOW_ERROR` - The user is in the incorrect state.

### Examples
```
Status status = sdk.StartAuthentication(user);

switch (status.getStatusCode())
{
    case Status.Code.OK:
        break;
    case Status.Code.REVOKED:
        // User is revoked, cannot authenticate
        break;
    default:
        // Show error message and exit
        break;
}

String authPin;
//
// Read PIN Code or secret from the user
//
OTP otp = new OTP();
status = sdk.FinishAuthenticationOTP(user, authPin, otp);

switch (status.getStatusCode())
{
    case Status.Code.OK:
        // Authentication successful
        if (otp.status == null || otp.status.getStatusCode() != Status.Code.OK)
        {
            // Provided OTP is not valid - backend doesn't support OTP, exit
        }
        // Display otp.otp to the user
        // otp.ttlSeconds holds the OTP expiration time in seconds
        break;
    case Status.Code.INCORRECT_PIN:
        // Authentication failed
        if (user.GetState() == State.BLOCKED)
        {
            // User is blocked and cannot authenticate anymore
        }
        break;
    default:
        // Show error message and exit
        break;
}
```
___
## FinishAuthenticationAN
___
This method authenticates a user with an Access Number which is obtained out-of-band, either from a browser session, through reading a QR code orsent via Push Message. The user then logs into the PC/Browser session which was associated with the provided Access Number although the actual authentication is done on the Mobile Device.

`accessNumber` is the Access Number obtained out-of-band.

### Definition
```
Status FinishAuthenticationAN(User user, String pin, String accessNumber)
```

### Parameters

|Parameter Name|Parameter Type|Required?|Description|
|--------------|--------------|---------|-----------|
|`user`|User|Yes|The user that is being authenticated|
|`pin`|String|Yes|The PIN/secret that the user has entered|
|`accessNumber`|String|Yes|The Access Number obtained out-of-band and required for the authentication.|

### Return Status

* `OK` - Successful Authentication
* `INCORRECT_PIN` - Authentication failed because of an incorrect PIN code. After the third (configurable in the RPS) unsuccessful authentication attempt, the method still returns status `INCORRRECT_PIN` but the user state is set to `BLOCKED`.
* `INCORRECT_ACCESS_NUMBER` - The authentication failed because of incorrect _Access Number_.

### Examples
```
Status status = sdk.StartAuthentication(user);

switch (status.getStatusCode())
{
    case Status.Code.OK:
        break;
    case Status.Code.REVOKED:
        // User is revoked, cannot authenticate
        break;
    default:
        // Show error message and exit
        break;
}

String accessNumber;
//
// Read Access Number from the user
//

status = sdk.CheckAccessNumber(accessNumber);

if (status.getStatusCode() != Status.Code.OK)
{
    // Access Number is not correct
}

String authPin;
//
// Read PIN Code or secret from the user
//
status = sdk.FinishAuthenticationAN(user, authPin, accessNumber);

switch (status.getStatusCode())
{
    case Status.Code.OK:
        // Authentication successful
        break;
    case Status.Code.INCORRECT_ACCESS_NUMBER:
        // Access Number not accepted by server
        break;
    case Status.Code.INCORRECT_PIN:
        // Authentication failed
        if (user.GetState() == State.BLOCKED)
        {
            // User is blocked and cannot authenticate anymore
        }
        break;
    default:
        // Show error message and exit
        break;
}
```
___
## CanLogout
___

This method is used after authentication with an Access Number through `FinishAuthenticationAN`. After such an authentication, the Mobile Device can log out the end-user from the Browser session, if the RPA supports that functionality. This method checks whether logout information was provided by the RPA and the remote (Browser) session can be terminated from the Mobile Device. The method will return `true` if the user can be logged-out from the remote session, and `false` otherwise.

### Definition

```
boolean CanLogout(User user)
```

### Parameters

|Parameter Name|Parameter Type|Required?|Description|
|--------------|--------------|---------|-----------|
|`user`|User|Yes|The User ID|

### Return Values

* `true` – the User can be logged out from the remote session
* `false` – the User cannot be logged out from the remote session

### Example
The following code snippet logs out the User from the browser/online session after one minute.

The code assumes the `accessNumber` to be an input from the user.

```
Status status = sdk.FinishAuthenticationAN(user, pin, accessNumber);

if (status.getStatusCode() != Status.Code.OK) {
    // handle error
}

if (sdk.CanLogout(user)) {
    SystemClock.sleep(60000);   //Waiting for 60 seconds before logging out
    sdk.Logout(user);
}
```
___
## Logout
___

This method tries to log out the end-user from a remote (Browser) session after a successful authentication through FinishAuthenticationAN. Before calling this method, it is recommended to ensure that logout data was provided by the RPA and that the logout operation can be actually performed. The method will return `TRUE` if the logged-out request to the RPA was successful, and `FALSE` otherwise.

### Definition

```
boolean Logout(User user)
```

### Parameters

|Parameter Name|Parameter Type|Required?|Description|
|--------------|--------------|---------|-----------|
|`user`|User|Yes|The User ID|

### Return Values

* `true` – the log-out request to the RPA has been successful
* `false` – the log-out request to the RPA has failed

### Example

The following code snippet logs out the User from the browser/online session after one minute.

The code assumes the `accessNumber` to be an input from the user.
```
Status status = sdk.FinishAuthenticationAN(user, pin, accessNumber);

if (status.getStatusCode() != Status.Code.OK) {
    // handle error
}

if (sdk.CanLogout(user)) {
    SystemClock.sleep(60000);   //Waiting for 60 seconds before logging out
    sdk.Logout(user);
}
```

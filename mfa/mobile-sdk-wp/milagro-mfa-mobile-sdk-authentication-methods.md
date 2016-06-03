---
currentMenu: milagro-mfa-mobile-sdk--authentications-methods-wp
---
## StartAuthentication

### Description

This method starts the authentication process for a given user. It attempts to retrieve the Time Permits for the user. If successful, it returns status OK, and if not, it returns status Revoked. If the Time Permits are retrieved, the app reads the PIN/secret from the end-user and calls one of the FinishAuthentication variants to authenticate the user.

### Definition
```
Status StartAuthentication(User user)
```

###Parameters

| Parameter Name     | Parameter Type     | Required? | Description |
| :------------- | :------------- |:------------- |:------------- |
| user     | User       | Yes | The ID of the user |

### Return Status

**OK:** The authentication process has been started successfully   
**Revoked:** Time permit for the given user was refused by the server   
**FlowError:** The user is in the incorrect state, i.e. its state is not Registered    

### Example
```
Status status = sdk.StartAuthentication(user);

switch (status.StatusCode)
{
    case Status.Code.OK:
        break;
    case Status.Code.Revoked:
        // User is revoked, cannot authenticate
        break;
    default:
        // Show error message and exit
        break;
}

string authPin;
//
// Read PIN Code or secret from the user
//
status = sdk.FinishAuthentication(user, authPin);

switch (status.StatusCode)
{
    case Status.Code.OK:
        // Authentication successful
        break;
    case Status.Code.IncorrectPIN:
        // Authentication failed
        if (user.UserState == User.State.Blocked)
        {
            // User is blocked and cannot authenticate anymore
        }
        break;
    default:
        // Show error message and exit
        break;
}
```

## CheckAccessNumber

### Description

This method is used only when a user needs to be authenticated to a remote (browser) session, using Access Number. The access numbers have a check-sum digit in them which needs to be verified on the client side, in order to prevent calling the back-end with non-compliant access numbers. The method returns status OK, if successful, and status IncorrectAccessNumber, if not.

### Definition
```
Status CheckAccessNumber(string accessNumber)
```

### Parameters

| Parameter Name     | Parameter Type     | Required? | Description |
| :------------- | :------------- |:------------- |:------------- |
| accessNumber     | String      | Yes | The access number that the user needs in order to authenticate to a remote browser session |


### Return Values

**OK** (if successful)    
**IncorrectAccessNumber** (if not)   

### Examples
```
Status status = sdk.StartAuthentication(user);

switch (status.StatusCode)
{
    case Status.Code.OK:
        break;
    case Status.Code.Revoked:
        // User is revoked, cannot authenticate
        break;
    default:
        // Show error message and exit
        break;
}

string accessNumber;
//
// Read Access Number from the user
//

status = sdk.CheckAccessNumber(accessNumber);

if (status != null && status.StatusCode != Status.Code.OK)
{
    // Access Number is not correct
}

string authPin;
//
// Read PIN Code or secret from the user
//
status = sdk.FinishAuthenticationAN(user, authPin, accessNumber);

switch (status.StatusCode)
{
    case Status.Code.OK:
        // Authentication successful
        break;
    case Status.Code.IncorrectAccessNumber:
        // Access Number not accepted by server
        break;
    case Status.Code.IncorrectPIN:
        // Authentication failed
        if (user.UserState == User.State.Blocked)
        {
            // User is blocked and cannot authenticate anymore
        }
        break;
    default:
        // Show error message and exit
        break;
}
```

## FinishAuthentication

### Description

This method performs end-user authentication. The user to be authenticated and the pin (secret) are passed as parameters. The method uses the provided pin and the stored M-Pin Token to do the authentication against the M-Pin Authentication Server and then logs into the RPA. The RPA passes back User Data with the authentication response, which is returned to the application through the authResultData parameter. If authenticated, the returned status is OK and if not, it would be IncorrectPIN. After the third (configurable in the RPS) unsuccessful authentication attempt, the method returns status IncorrectPIN and the User State is set to Blocked.

### Definition
```
Status FinishAuthentication(User user, string pin, string authResultData = null)
```

### Parameters

| Parameter Name     | Parameter Type     | Required? | Description |
| :------------- | :------------- |:------------- |:------------- |
| user     | User      | Yes | The user |
| pin     | String      | Yes | the four digit pin that the user enters on the pinpad |
| authResultData     | String      | No | The authentication result data that is returned by the RPA |

### Return Values

**OK:** Authentication successful   
**IncorrectPIN:** Authentication failed    
**FlowError:** The user is in the incorrect state    

### Example
```
Status status = sdk.StartAuthentication(user);

switch (status.StatusCode)
{
    case Status.Code.OK:
        break;
    case Status.Code.Revoked:
        // User is revoked, cannot authenticate
        break;
    default:
        // Show error message and exit
        break;
}

string authPin;
//
// Read PIN Code or secret from the user
//
status = sdk.FinishAuthentication(user, authPin);

switch (status.StatusCode)
{
    case Status.Code.OK:
        // Authentication successful
        break;
    case Status.Code.IncorrectPIN:
        // Authentication failed
        if (user.UserState == User.State.Blocked)
        {
            // User is blocked and cannot authenticate anymore
        }
        break;
    default:
        // Show error message and exit
        break;
}
```

## FinishAuthenticationOTP

### Description

This method performs end-user authentication for an OTP. It is similar to the FinishAuthentication Method but the RPA issues an OTP instead of logging the user into the application. The returned status is also similar to the FinishAuthentication Method except that an OTP structure is returned.

The OTP structure is as follows:
```
public class OTP
{
    public string Otp { get { ... } set { ... } }
    public long ExpireTime { get { ... } set { ... } }
    public int TtlSeconds { get { ... } set { ... } }
    public long NowTime { get { ... } set { ... } }
    public Status Status { get { ... } set { ... } }    
}
```
| Term used | Description     |
| :------------- | :------------- |
| Otp       | The otp string is the issued OTP       |
| ExpireTime | The M-Pin system time when the OTP expires |
| TtlSeconds |	The expiration period in seconds |
| NowTime	| The current M-Pin system time |
| Status	| The status of the OTP generation. If OK - OTP is successfully generated, if FLOW_ERROR - OTP was not generated, probably because the RPA doesn't support that functionality. |

Note that Otp is generated only by RPAs that support this functionality, such as M-Pin SSO. For RPAs that do not support OTP generation, the status within the returned Otp structure would be status FlowError.

### Definition
```
Status FinishAuthenticationOTP(User user, string pin, OTP otp)
```

### Parameters

| Parameter Name     | Parameter Type     | Required? | Description |
| :------------- | :------------- |:------------- |:------------- |
| user     | User      | Yes | The user |
| pin     | String      | Yes | the four digit pin that the user enters on the pinpad |
| otp     | String      | No | The resulting OTP is returned here |

### Return Values

**OK:** Authentication successful  
**IncorrectPIN:** Authentication failed   
**FlowError:** The user is in the incorrect state   

### Examples
```
Status status = sdk.StartAuthentication(user);

switch (status.StatusCode)
{
    case Status.Code.OK:
        break;
    case Status.Code.Revoked:
        // User is revoked, cannot authenticate
        break;
    default:
        // Show error message and exit
        break;
}

string authPin;
//
// Read PIN Code or secret from the user
//
OTP otp = new OTP();
status = sdk.FinishAuthenticationOTP(user, authPin, otp);

switch (status.StatusCode)
{
    case Status.Code.OK:
        // Authentication successful
        if (otp.Status == null || otp.Status.StatusCode != Status.Code.OK)
        {
            // Provided OTP is not valid - backend doesn't support OTP, exit
        }
        // Display otp.Otp to the user
        // otp.TtlSeconds holds the OTP expiration time in seconds
        break;
    case Status.Code.IncorrectAccessNumber:
        // Access Number not accepted by server
        break;
    case Status.Code.IncorrectPIN:
        // Authentication failed
        if (user.UserState == User.State.Blocked)
        {
            // User is blocked and cannot authenticate anymore
        }
        break;
    default:
        // Show error message and exit
        break;
}
```

## FinishAuthenticationAN

### Description

This method authenticates a user with an Access Number which is obtained out-of-band, either from a browser session, through reading a QR code orsent via Push Message . The user then logs into the PC/Browser session which was associated with the provided Access Number although the actual authentication is done on the Mobile Device.
accessNumber is the Access Number obtained out-of-band.

### Definition
```
Status FinishAuthenticationAN(User user, string pin, string accessNumber)
```

### Parameters

| Parameter Name     | Parameter Type     | Required? | Description |
| :------------- | :------------- |:------------- |:------------- |
| user     | User      | Yes | The user |
| pin     | String      | Yes | the four digit pin that the user enters on the pinpad |
| accessNumber     | String      | Yes | The access number that the user needs in order to authenticate to a remote browser |

### Return Values

**OK:** Authentication successful   
**IncorrectPIN:** Authentication failed   
**IncorrectAccessNumber:** The provided accessNumber is not correct   
**FlowError:** The user is in the incorrect state   

### Examples
```
Status status = sdk.StartAuthentication(user);

switch (status.StatusCode)
{
    case Status.Code.OK:
        break;
    case Status.Code.Revoked:
        // User is revoked, cannot authenticate
        break;
    default:
        // Show error message and exit
        break;
}

string accessNumber;
//
// Read Access Number from the user
//

status = sdk.CheckAccessNumber(accessNumber);

if (status != null && status.StatusCode != Status.Code.OK)
{
    // Access Number is not correct
}

string authPin;
//
// Read PIN Code or secret from the user
//
status = sdk.FinishAuthenticationAN(user, authPin, accessNumber);

switch (status.StatusCode)
{
    case Status.Code.OK:
        // Authentication successful
        break;
    case Status.Code.IncorrectAccessNumber:
        // Access Number not accepted by server
        break;
    case Status.Code.IncorrectPIN:
        // Authentication failed
        if (user.UserState == User.State.Blocked)
        {
            // User is blocked and cannot authenticate anymore
        }
        break;
    default:
        // Show error message and exit
        break;
}
```

## CanLogout

### Description

This method checks if a user's logout information was provided by the RPA, and the remote (Browser) session can be terminated from a mobile device. It is used after authentiction with an Access Number, through the FinishAuthenticationAN method. It will return true if the user can be logged-out from the remote session, and false otherwise.

### Definition
```
bool CanLogout(User user)
```

### Parameters

| Parameter Name     | Parameter Type     | Required? | Description |
| :------------- | :------------- |:------------- |:------------- |
| user     | User      | Yes | The user ID |


### Return Values

**true:** the User can be logged out from the remote session    

**false:** the User cannot be logged out from the remote session    

### Example

The following code demonstrates the use of the method:
```
Status status = sdk.FinishAuthenticationAN(user, authPin, accessNumber);

if (status.StatusCode != Status.Code.OK)
{
    // handle error
}

if (sdk.CanLogout(user))
{
    await Task.Delay(60000);;   //Waiting for 60 seconds before logging out
    sdk.Logout(user);
}
```

## Logout

### Description

This method tries to log the user out of a remote (Browser) session after successfully authenticating them via the FinishAuthenticationAN method. Before calling this method, ensure that logout data was provided by the RPA and that the logout operation can be actually performed. The method returns true if the logged-out request to the RPA is successful, and false otherwise.

### Definition
```
Bool Logout(User user)
```

###Parameters

| Parameter Name     | Parameter Type     | Required? | Description |
| :------------- | :------------- |:------------- |:------------- |
| user     | User      | Yes | The user ID |


### Return Values

**true:** the log-out request to the RPA has been successful      

**false:** the log-out request to the RPA has failed    

### Example

The following code demonstrates the use of the method:
```
Status status = sdk.FinishAuthenticationAN(user, authPin, accessNumber);

if (status.StatusCode != Status.Code.OK)
{
    // handle error
}

if (sdk.CanLogout(user))
{
    await Task.Delay(60000);;   //Waiting for 60 seconds before logging out
    sdk.Logout(user);
}
```

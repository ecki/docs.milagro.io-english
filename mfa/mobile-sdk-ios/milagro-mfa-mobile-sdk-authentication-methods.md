---
currentMenu: milagro-mfa-mobile-sdk-user-authentications-methods-ios
---

<div id="generated-toc" class="generate_from_h2"></div>


## Authentication Methods Reference

### Overview

This page provides a list of the Authentication methods used, along with brief descriptions, in the Milagro MFA Mobile SDK for iOS. They relate to performing User Authentication.

To view the other methods, refer to the API Reference page.

### StartAuthentication Method

#### Description

This method starts the authentication process for a given user. It attempts to retrieve the Time Permits for the user. If successful, it returns status code OK, and if not, it returns status code REVOKED. If the Time Permits are retrieved, the app reads the PIN/secret from the end-user and calls one of the FinishAuthentication variants to authenticate the user.

#### Definition

		(MpinStatus*) StartAuthentication: (const id<IUser>) user;

#### Parameters

| Parameter Name | Parameter Type | Required? | Description |
|----------------|----------------|-----------|-------------|
| user           | IUser          | Yes       | The User ID |


#### Return Status


**OK:** The authentication process has been started successfully   
**REVOKED:** Time permit for the given user was refused by the server.   
**FLOW_ERROR:** The user is in the incorrect state, i.e. its state is not REGISTERED   

#### Example

		MpinStatus* mpinStatus = [MPin StartAuthentication:iuser];

		switch (mpinStatus.status) {
		case OK:
				break;
		case REVOKED:
				// User is revoked, canot authenticate
				break;
		default:
				// Show error message and exit
				break;
		}

		NSString* authPin;
		//
		// Read PIN Code or secret from the user
		//

		mpinStatus = [MPin FinishAuthentication:iuser pin:authPin];

		switch (mpinStatus.status) {
		case OK:
				// Authentication successful
				break;
		case INCORRECT_PIN:
				// Authentication failed
				if ([iuser getState] == BLOCKED) {
						// User is blocked and cannot authenticate anymore
				}
				break;
		default:
				// Show error message and exit
				break;
		}


#### CheckAccessNumber

#### Description
This method is used only when a user needs to be authenticated to a remote (browser) session, using Access Number. The access numbers have a check-sum digit in them which needs to be verified on the client side, in order to prevent calling the back-end with non-compliant access numbers. The method returns status OK if successful, and INCORRECT_ACCESS_NUMBER if not.

#### Definition

		+ (MpinStatus*) CheckAccessNumber: (NSString*) an;

#### Parameters

| Parameter Name | Parameter Type | Required? | Description                                 |
|----------------|----------------|-----------|---------------------------------------------|
| an             | NSString*      | Yes       | Access Number used to authenticate the user |

#### Definition

    + (MpinStatus*) CheckAccessNumber: (NSString*) an;

| Parameter Name | Parameter Type | Required? | Description                                 |
|----------------|----------------|-----------|---------------------------------------------|
| an             | NSString*      | Yes       | Access Number used to authenticate the user |

Return Values

**OK:** if successful   
**INCORRECT_ACCESS_NUMBER:** if not   

#### Examples

    MpinStatus* mpinStatus = [MPin StartAuthentication:iuser];

    switch (mpinStatus.status) {
        case OK:
            break;
        case REVOKED:
            // User is revoked, canot authenticate
            break;
        default:
            // Show error message and exit
            break;
    }

    NSString* accessNumber;
    //
    // Read Access Number from the user
    //

    mpinStatus = [MPin CheckAccessNumber:accessNumber];

    if ( mpinStatus.status != OK ) {
        // Access Number is not correct
    }

    NSString* authPin;
    //
    // Read PIN Code or secret from the user
    //

    mpinStatus = [MPin FinishAuthenticationAN:iuser pin:authPin accessNumber:accessNumber];

    switch (mpinStatus.status) {
        case OK:
            // Authentication successful
            break;
        case INCORRECT_ACCESS_NUMBER :
            // Access Number not accepted by server
            break;
        case INCORRECT_PIN:
            // Authentication failed
            if ([iuser getState] == BLOCKED) {
                // User is blocked and cannot authenticate anymore
            }
            break;
        default:
            // Show error message and exit
            break;
    }

### FinishAuthentication

#### Description

This method performs end-user authentication. The user to be authenticated and the pin (secret) are passed as parameters. The method uses the provided pin and the stored M-Pin Token to do the authentication against the M-Pin Authentication Server and then logs into the RPA. The RPA passes back User Data with the authentication response, which is returned to the application through the authResultData parameter. If authenticated, the returned status is OK and if not, it would be INCORRECT_PIN. After the third (configurable in the RPS) unsuccessful authentication attempt, the method returns status INCORRECT_PIN and the User State is set to BLOCKED.

### Definition

    + (MpinStatus*) FinishAuthentication: (const id<IUser>) user pin: (NSString*) pin;

    + (MpinStatus*) FinishAuthentication: (const id<IUser>) user pin: (NSString*) pin authResultData: (NSString**) authResultData;

### Parameters

| Parameter Name | Parameter Type | Required? | Description                                                                         |
|----------------|----------------|-----------|-------------------------------------------------------------------------------------|
| user           | IUser          | Yes       | The User ID                                                                         |
| pin            | NSString*      | Yes       | The PIN/secret entered by the end-user                                              |
| authResultData | NSString**     | No        | Optionally, the result of the authentication would be passed back in that parameter |

#### Return Status

**OK:** Authentication successful   
**INCORRECT_PIN:** Authentication failed   
**FLOW_ERROR:** The user is in the incorrect state   

#### Example

    MpinStatus* mpinStatus = [MPin StartAuthentication:iuser];

    switch (mpinStatus.status) {
        case OK:
            break;
        case REVOKED:
            // User is revoked, canot authenticate
            break;
        default:
            // Show error message and exit
            break;
    }

    NSString* authPin;
    //
    // Read PIN Code or secret from the user
    //

    mpinStatus = [MPin FinishAuthentication:iuser pin:authPin];

    switch (mpinStatus.status) {
        case OK:
            // Authentication successful
            break;
        case INCORRECT_PIN:
            // Authentication failed
            if ([iuser getState] == BLOCKED) {
                // User is blocked and cannot authenticate anymore
            }
            break;
        default:
            // Show error message and exit
            break;
    }

### FinishAuthenticationOTP

#### Description

This method performs end-user authentication for an OTP. It is similar to the FinishAuthentication method but the RPA issues an OTP instead of logging the user into the application. The returned status is also similar to the FinishAuthentication method except that an OTP structure is also returned. The OTP structure is as follows:

    @interface OTP: NSObject

    @property (nonatomic, retain, readonly) MpinStatus* status;
    @property (nonatomic, retain, readonly) NSString* otp;
    @property (atomic, readonly) long expireTime;
    @property (atomic, readonly) int ttlSeconds;
    @property (atomic, readonly) long nowTime;

    -(id) initWith: (MpinStatus*)status otp: (NSString*)otp expireTime: (long)expTime ttlSeconds: (int)ttlSeconds nowTime: (long)nowTime;

    @end

| Terms used | Description                                                                                                                                                                  |
|------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| otp        | The otp string is the issued OTP                                                                                                                                             |
| expireTime | The M-Pin system time when the OTP expires                                                                                                                                   |
| ttlSeconds | The expiration period in seconds                                                                                                                                             |
| nowTime    | The current M-Pin system time                                                                                                                                                |
| status     | The status of the OTP generation. If OK - OTP is successfully generated, if FLOW_ERROR - OTP was not generated, probably because the RPA doesn't support that functionality. |

Note that OTP is generated only by RPA that supports that functionality, such as M-Pin SSO. For RPA's that do not support OTP generation the status within the returned otp structure would be Status FLOW_ERROR.

#### Definition

    + (MpinStatus*) FinishAuthenticationOTP: (id<IUser>) user pin:
    (NSString*) pin otp: (OTP**) otp;

| Parameter Name | Parameter Type | Required? | Description                              |
|----------------|----------------|-----------|------------------------------------------|
| user           | IUser          | Yes       | The user that is being authenticated     |
| pin            | NSString*      | Yes       | The PIN/secret that the user has entered |
| otp            | OTP**          | Yes       | The resulting OTP is returned here.      |

#### Return Values

**OK:** Authentication successful  
**INCORRECT_PIN:** Authentication failed.   
**FLOW_ERROR:** The user is in the incorrect state.   

#### Examples
```
MpinStatus* mpinStatus = [MPin StartAuthentication:iuser];

switch (mpinStatus.status) {
    case OK:
        break;
    case REVOKED:
        // User is revoked, canot authenticate
        break;
    default:
        // Show error message and exit
        break;
}

NSString* authPin;
//
// Read PIN Code or secret from the user
//

OTP *otp = nil;
mpinStatus = [MPin FinishAuthenticationOTP:iuser pin:authPin otp:&otp];

switch (mpinStatus.status) {
    case OK:
        // Authentication successful
        if ( otp == nil || otp.status.status != OK ) {
            // Provided OTP is not valid - backend doesn't support OTP, exit
        }
        // Display otp.otp to the user
        // otp.ttlSeconds holds the OTP expiration time in seconds
        break;
    case INCORRECT_PIN:
        // Authentication failed
        if ([iuser getState] == BLOCKED) {
            // User is blocked and cannot authenticate anymore
        }
        break;
    default:
        // Show error message and exit
        break;
}
```
### FinishAuthenticationAN

#### Description

This method authenticates a user with an Access Number which is obtained out-of-band, either from a browser session, through reading a QR code orsent via Push Message . The user then logs into the PC/Browser session which was associated with the provided Access Number although the actual authentication is done on the Mobile Device.
accessNumber is the Access Number obtained out-of-band.

#### Definition

    + (MpinStatus*) FinishAuthenticationAN: (id<IUser>) user pin:
    (NSString*) pin accessNumber: (NSString*) an;

#### Parameters

| Parameter Name | Parameter Type | Required? | Description                                                                 |
|----------------|----------------|-----------|-----------------------------------------------------------------------------|
| user           | IUser          | Yes       | The user that is being authenticated                                        |
| pin            | NSString*      | Yes       | The PIN/secret that the user has entered                                    |
| an             | NSString*      | Yes       | The Access Number obtained out-of-band and required for the authentication. |

#### Return Status

**OK:** Successful Authentication   
**INCORRECT_PIN:** Authentication failed because of an incorrect PIN code. After the third (configurable in the RPS) unsuccessful authentication attempt, the method still returns status INCORRRECT_PIN but the user state is set to BLOCKED.</br>     **INCORRECT_ACCESS_NUMBER:** The authentication failed because of incorrect Access Number.

#### Examples

    MpinStatus* mpinStatus = [MPin StartAuthentication:iuser];

    switch (mpinStatus.status) {
        case OK:
            break;
        case REVOKED:
            // User is revoked, canot authenticate
            break;
        default:
            // Show error message and exit
            break;
    }

    NSString* accessNumber;
    //
    // Read Access Number from the user
    //

    mpinStatus = [MPin CheckAccessNumber:accessNumber];

    if ( mpinStatus.status != OK ) {
        // Access Number is not correct
    }

    NSString* authPin;
    //
    // Read PIN Code or secret from the user
    //

    mpinStatus = [MPin FinishAuthenticationAN:iuser pin:authPin accessNumber:accessNumber];

    switch (mpinStatus.status) {
        case OK:
            // Authentication successful
            break;
        case INCORRECT_ACCESS_NUMBER :
            // Access Number not accepted by server
            break;
        case INCORRECT_PIN:
            // Authentication failed
            if ([iuser getState] == BLOCKED) {
                // User is blocked and cannot authenticate anymore
            }
            break;
        default:
            // Show error message and exit
            break;
    }

### CanLogout Method

#### Description

This method checks if a user's logout information was provided by the RPA, and the remote (Browser) session can be terminated from a mobile device. It is used after authentiction with an Access Number, through the FinishAuthenticationAN method. It will return TRUE if the user can be logged-out from the remote session, and FALSE otherwise.

#### Definition

    + (Boolean) CanLogout: (const id<IUser>) user;

#### Example

| Parameter Name | Parameter Type | Required? | Description |
|----------------|----------------|-----------|-------------|
| user           | IUser          | Yes       | The User ID |


#### Return Values

**TRUE:** the User can be logged out from the remote session

**FALSE:** the User cannot be logged out from the remote session

#### Example

The following code demonstrates the use of the method:
```
MpinStatus* mpinStatus = [MPin Authenticate:iuser];

// To logout
if([Mpin CanLogout:iuser])
{
    [Mpin Logout:iuser];
}
```

### Logout Method

#### Description

This method tries to log the user out of a remote (Browser) session after successfully authenticating them via the FinishAuthenticationAN method. Before calling this method, ensure that logout data was provided by the RPA and that the logout operation can be actually performed. The method returns TRUE if the logged-out request to the RPA is successful, and FALSE otherwise.

#### Definition

    + (Boolean) Logout: (const id<IUser>) user;

#### Parameters

| Parameter Name | Parameter Type | Required? | Description |
|----------------|----------------|-----------|-------------|
| user           | IUser          | Yes       | The User ID |

#### Return Values

**TRUE:** the log-out request to the RPA has been successful

**FALSE:** the log-out request to the RPA has failed

#### Example

The following code demonstrates the use of the method:
```
MpinStatus* mpinStatus = [MPin Authenticate:iuser];

// To logout
if([Mpin CanLogout:iuser])
{
    [Mpin Logout:iuser];
}
```

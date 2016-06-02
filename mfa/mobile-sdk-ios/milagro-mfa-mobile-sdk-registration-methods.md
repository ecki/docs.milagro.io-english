---
currentMenu: milagro-mfa-mobile-sdk-registration-methods-ios
---
## Overview

This page provides a list, along with brief descriptions, of the Registration methods used in the Milagro MFA Mobile SDK for iOS. They describe the procedures involved in registering a new user.

To view the other methods, refer to the API Reference page.

## StartRegistration

### Description

This method initializes the registration for a User that has already been created. The server starts the registration flow, sending the necessary requests to the back-end service. The State of the User instance will change to STARTED_REGISTRATION. The status will indicate whether the operation was successful or not. During this call, an M-Pin ID for the end-user will be issued by the RPS and stored within the user object. The RPA can also start a user identity verification procedure, by sending a verification e-mail.

The application can also pass additional userData which might help the RPA to verify the user identity. The RPA might decide to verify the identity without starting a verification process. In this case, the returned status from the call will still be OK, but the User State will be set to ACTIVATED.

### What Is the Difference Between StartRegistration and RestartRegistration?

The StartRegistration method generates a new M-Pin ID while RestartRegistration uses the ID that has already been generated for the user. So StartRegistration can only be called for Users in the INVALID state while RestartRegistration is used for those in the STARTED_REGISTRATION state. Besides this, both methods work identically, as they both cause the RPA to re-start the User identity verification process.

### Definition

    + (MpinStatus*) StartRegistration: (const id<IUser>) user;

    + (MpinStatus*) StartRegistration: (const id<IUser>) user userData: (NSString*) userData;

    + (MpinStatus*) StartRegistration: (const id<IUser>) user activateCode: (NSString*) activateCode;

    + (MpinStatus*) StartRegistration: (const id<IUser>) user activateCode: (NSString*) activateCode userData: (NSString*) userData;

### Parameters

| Parameter Name | Parameter Type | Required? | Description                                                                                           |
|----------------|----------------|-----------|-------------------------------------------------------------------------------------------------------|
| user           | IUser          | Yes       | The user to be registered                                                                             |
| userData       | NSString*      | No        | Optional application specific user data that might be needed by the RPA in order to register the user |
| activateCode   | NSString*      | No        | Optional activation code that might be issued by the RPA and required during the registration process |

### Return Values

- OK: User registation started successfully
- IDENTITY_NOT_AUTHORIZED: User registration refused by remote server
- FLOW_ERROR: the User is in the incorrect state, i.e. its state is not INVALID

### Example

The following code snippet creates a new User and handles its registration process:

    id iuser = [MPin MakeNewUser:@"me@MIRACL.org" deviceName:@"My Smartphone"];
    MpinStatus* mpinStatus = [MPin StartRegistration:iuser];

    if(mpinStatus.status != OK) {
        // Handle error
    }

### RestartRegistration

Description

The RestartRegistration method re-initializes the registration process for a User whose registration process has already started. The method causes the RPA to re-start the User identity verification procedure by sending a verification email. The User’s status remains at STARTED_REGISTRATION until the ConfirmRegistration method has been executed successfully.

In a demo application, the RPA can be configured to verify identities without starting a verification process. In this case, the status of the call will still be OK, but the User state will be set to ACTIVATED.
The application might require some additional data (passed in the userData parameter) to verify the user’s identity.

### What Is the Difference Between StartRegistration and RestartRegistration?

The StartRegistration method generates a new M-Pin ID while RestartRegistration uses the ID that has already been generated for the user. So StartRegistration can be called only for Users in the INVALID state and RestartRegistration is designed to be used for Users in the STARTED_REGISTRATION state. Apart from that, both methods work basically the same, as they both cause the RPA to re-start the User identity verification.

### Definition

    + (MpinStatus*) RestartRegistration: (const id<IUser>) user;

    + (MpinStatus*) RestartRegistration: (const id<IUser>) user userData: (const NSString*) userData;

### Parameters

| Parameter Name | Parameter Type | Required? | Description                                                                                           |
|----------------|----------------|-----------|-------------------------------------------------------------------------------------------------------|
| user           | IUser          | Yes       | The user to be registered                                                                             |
| userData       | NSString       | No        | Optional application specific user data that might be needed by the RPA in order to register the user |


### Return Values

**OK:** User registered has been restarted successfully.

**IDENTITY_NOT_AUTHORIZED:** User registration refused by remote server

**FLOW_ERROR:** the User is in the incorrect state, i.e its state is not STARTED_REGISTRATION

### Example

The following code snippet demonstrates a sample implementation of restarting a User registration
```
id iuser = [MPin MakeNewUser:@"me@MIRACL.org" deviceName:@"My Smartphone"];
MpinStatus* mpinStatus = [MPin StartRegistration:iuser];

if(mpinStatus.status != OK) {
    // Handle error
}

if ([iuser getState] == STARTED_REGISTRATION)
{
    // Waiting for identity verification, which doesn't happen
    mpinStatus = [MPin RestartRegistration:iuser];

    //
    // Wait for identity confirmation
    //

    mpinStatus = [MPin ConfirmRegistration:iuser];

    if (mpinStatus.status == IDENTITY_NOT_VERIFIED) {
        // The identity has not been verified
    } else if (mpinStatus.status != OK) {
        // Handle error
    }

    NSString* setupPin;

    /* Read PIN from user */

    mpinStatus = [MPin FinishRegistration:iuser pin:setupPin];

    if (mpinStatus.status != OK) {
        // Handle error
    }
}
```

### Confirm Registration

#### Description

The ConfirmRegistration method allows the application to check whether the user identity verification process has been finalized or not. The user object should be either in the STARTED_REGISTRATION or the ACTIVATED state. The latter is possible if the RPA activated the user immediately with the call to StartRegistration and no verification process is started. During the call to ConfirmRegistration, the SDK will try to retrieve a Client Key for the user, which will succeed if the user has already been verified/activated, but will fail otherwise. The method returns status OK if the Client Key is successfully retrieved and IDENTITY_NOT_VERIFIED if the identity is not verified. If the method is successful, the application will get the desired PIN/secret from the end-user and then call FinishRegistration to provide the PIN.

Note The application can provide a platform specific identifier for sending push messages to the device by using the optional parameter pushMessageIdentifier. The push messages can be used as an alternative to the Access Number, as part of the authentication flow.

#### Definition

    + (MpinStatus*) ConfirmRegistration: (const id<IUser>) user;

    + (MpinStatus*) ConfirmRegistration: (const id<IUser>) user pushNotificationIdentifier: (NSString*) pushNotificationIdentifier;

#### Parameters

| Parameter Name             | Parameter Type | Required? | Description                                                                                                                                       |
|----------------------------|----------------|-----------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| user                       | IUser          | Yes       | The user that is being registered                                                                                                                 |
| pushNotificationIdentifier | NSString*      | No        | An application instance specific Push Message Identifier/Token, which could later be used by the server to send Push Messages to the application. |

#### Return Values

**OK:** if the client key is successfully retrieved   
**IDENTITY_NOT_VERIFIED:** if the user identity is not verified   

#### Example

    id iuser = [MPin MakeNewUser:@"me@MIRACL.org" deviceName:@"My Smartphone"];
    MpinStatus* mpinStatus = [MPin StartRegistration:iuser];

    if(mpinStatus.status != OK) {
        // Handle error
    }

    if ([iuser getState] == STARTED_REGISTRATION)
    {
        // Waiting for identity verification, which doesn't happen
        mpinStatus = [MPin RestartRegistration:iuser];

        //
        // Wait for identity confirmation
        //

        mpinStatus = [MPin ConfirmRegistration:iuser];

        if (mpinStatus.status == IDENTITY_NOT_VERIFIED) {
            // The identity has not been verified
        } else if (mpinStatus.status != OK) {
            // Handle error
        }

        NSString* setupPin;

        /* Read PIN from user */

        mpinStatus = [MPin FinishRegistration:iuser pin:setupPin];

        if (mpinStatus.status != OK) {
            // Handle error
        }
    }

### FinishRegistration

#### Description

This method finalizes the user registration process. It extracts the M-Pin Token from the Client Key for the provided pin (secret), and then stores the token in the secure storage. On successful completion, the User state will be set to REGISTERED and the method will return status OK.

#### Definition

    + (MpinStatus*) FinishRegistration: (const id<IUser>) user pin: (NSString*) pin;

| Parameter Name | Parameter Type | Required? | Description                         |
|----------------|----------------|-----------|-------------------------------------|
| user           | IUser          | Yes       | The User ID                         |
| pin            | NSString*      | Yes       | The pin that is entered by the user |

#### Return Status

**OK:** User registered successfully and its status set to REGISTERED

**FLOW_ERROR:** the User object is in an incorrect state (see the 'User States' page in this section of the menu)

#### Example

The following code snippet creates a new User identity for a particular device and if the registration process is successful, finalizes it.

    id iuser = [MPin MakeNewUser:@"me@MIRACL.org" deviceName:@"My Smartphone"];
    MpinStatus* mpinStatus = [MPin StartRegistration:iuser];

    if(mpinStatus.status != OK) {
        // Handle error
    }

    if ([iuser getState] == STARTED_REGISTRATION)
    {
        // Waiting for identity verification, which doesn't happen
        mpinStatus = [MPin RestartRegistration:iuser];

        //
        // Wait for identity confirmation
        //

        mpinStatus = [MPin ConfirmRegistration:iuser];

        if (mpinStatus.status == IDENTITY_NOT_VERIFIED) {
            // The identity has not been verified
        } else if (mpinStatus.status != OK) {
            // Handle error
        }

        NSString* setupPin;

        /* Read PIN from user */

        mpinStatus = [MPin FinishRegistration:iuser pin:setupPin];

        if (mpinStatus.status != OK) {
            // Handle error
        }
    }

---
currentMenu: milagro-mfa-mobile-sdk-registration-methods-android
---

# Registration Methods

## Overview

This section provides a list and brief description of the Registration methods used in the Milagro MFA Mobile SDK for Android. The methods detail the process of registering a new User.

To view all methods used, refer to the [API Reference](/milagro-mfa-mobile-sdk-api-reference.html) page.

# StartRegistration

## Description
This method initializes the registration for a User that has already been created. The SDK starts the M-Pin Setup flow, sending the necessary requests to the back-end service. The State of the User instance will change to `STARTED_REGISTRATION`. The status will indicate whether the operation was successful or not. During this call, an M-Pin ID for the end-user will be issued by the RPS and stored within the user object. The RPA can also start a user identity verification procedure, by sending a verification e-mail.

The optional `activateCode` parameter might be provided if the registration process requires such. In cases when the user verification is done through a _One-Time-Code_ (OTC) or through an SMS that carries such code, this OTC should be passed as the `activateCode` parameter. In those cases, the identity verification should be completed instantly and the User State will be set to `ACTIVATED`.

The application can also pass additional `userData` which might help the RPA to verify the user identity. The RPA might decide to verify the identity without starting a verification process. In this case, the `Status` of the call will still be `OK`, but the User State will be set to `ACTIVATED`.

## Definition
```
Status StartRegistration(User user)

Status StartRegistration(User user, String activateCode)

Status StartRegistration(User user, String activateCode, String userData)
```

## Parameters
|Parameter Name|Parameter Type|Required?|Description|
|--------------|--------------|---------|-----------|
|`user`|User|Yes|The ID of the User|
|`activateCode`|String|No|Optional Activation Code that might be required by the RPA in order to register a user.|
|`userData`|String|No|Additional User data that might be required by the RPA to verify the user’s identity|

## Return Values
* `OK` – User registered successfully and its status set to `REGISTERED`
* `IDENTITY_NOT_AUTHORIZED` – User registration refused by remote server
* `FLOW_ERROR` – the User is in the incorrect state, i.e. its state is not `INVALID`

## Example
The following code snippet creates a new User and handles its registration process.

```
Status status = sdk.StartRegistration(user);

if (status.getStatusCode() != Status.Code.OK) {
    // handle error
}

if (user.getState() != State.ACTIVATED) {
    int i = 0;

    while (user.getState() == State.STARTED_REGISTRATION) {

       // waiting for verification to be completed
       status = sdk.ConfirmRegistration(user); // if the verification has completed successfully, this displays the M-Pin PIN-Pad for the user to set up their PIN

       if (status.getStatusCode() != Status.Code.OK) {
          if (status.getStatusCode() == Status.Code.IDENTITY_NOT_VERIFIED) {
             //User identity has not been verified yet
             i++;
             if (i >= 12) {
                status = sdk.RestartRegistration(user);

                if (status.getStatusCode() != Status.Code.OK) {
                   // handle error
                }
                i = 0;
             }
             SystemClock.sleep(10000);
          }
          else {
             // handle error
          }
       }
    }
}

status = sdk.ConfirmRegistration(user);

if (status.getStatusCode() != Status.Code.OK) {
    // handle error
}

String pin;
/** Ask the user to provide PIN or other secret here **/

status = sdk.FinishRegistration(user, pin);
if (status.getStatusCode() != Status.Code.OK) {
      // handle error
}
```
# <pre>RestartRegistration</pre>
## Description

This method re-initializes the registration process for a user, where registration has already started. The difference between this method and `StartRegistration()` is that it will not generate a new M-Pin ID, but will use the one that was already generated. Besides that, the methods follow the same procedures, such as getting the RPA to re-start the user identity verification procedure of sending a verification email to the user.

The application could also pass additional `userData` to help the RPA to verify the user identity. The RPA might decide to verify the identity without starting a verification process. In this case, the `Status` of the call will still be `OK`, but the User State will be set to `ACTIVATED`.

_Note: In a demo application, the RPA can be configured to verify identities without starting a verification process. In this case, the status of the call will still be OK, but the User state is set to `ACTIVATED`. The application might require some additional data (passed in the `userData` parameter) to verify the user’s identity._

## Definition
```
Status StartRegistration(User user)

Status StartRegistration(User user, String activateCode)

Status StartRegistration(User user, String activateCode, String userData)
```
## Parameters
|Parameter Name|Parameter Type|Required?|Description|
|--------------|--------------|---------|-----------|
|`user`|User|Yes|The ID of the User|
|`activateCode`|String|No|Optional Activation Code that might be required by the RPA in order to register a user.|
|`userData`|String|No|Additional User data that might be required by the RPA to verify the user’s identity|

## Return Values

* `OK` – User registered successfully and its status set to `REGISTERED`
* `IDENTITY_NOT_AUTHORIZED` – User registration refused by remote server
* `FLOW_ERROR` – the User is in the incorrect state, i.e. its state is not `INVALID`

## Example
The following code snippet creates a new User and handles its registration process.

```
Status status = sdk.StartRegistration(user);

if (status.getStatusCode() != Status.Code.OK) {
    // handle error
}

if (user.getState() != State.ACTIVATED) {
    int i = 0;

    while (user.getState() == State.STARTED_REGISTRATION) {

       // waiting for verification to be completed
       status = sdk.ConfirmRegistration(user); // if the verification has completed successfully, this displays the M-Pin PIN-Pad for the user to set up their PIN

       if (status.getStatusCode() != Status.Code.OK) {
          if (status.getStatusCode() == Status.Code.IDENTITY_NOT_VERIFIED) {
             //User identity has not been verified yet
             i++;
             if (i >= 12) {
                status = sdk.RestartRegistration(user);

                if (status.getStatusCode() != Status.Code.OK) {
                   // handle error
                }
                i = 0;
             }
             SystemClock.sleep(10000);
          }
          else {
             // handle error
          }
       }
    }
}

status = sdk.ConfirmRegistration(user);

if (status.getStatusCode() != Status.Code.OK) {
    // handle error
}

String pin;
/** Ask the user to provide PIN or other secret here **/

status = sdk.FinishRegistration(user, pin);
if (status.getStatusCode() != Status.Code.OK) {
      // handle error
}
```



## What Is the Difference Between `StartRegistration` and `RestartRegistration`?

The [`StartRegistration`] method generates a new M-Pin ID while `RestartRegistration` uses the ID that has already been generated for the user. So `StartRegistration` is called only for Users in the `INVALID` state while `RestartRegistration` is called for Users in the `STARTED_REGISTRATION` state. Besides this, they are very similar, as they both cause the RPA to re-start the User identity verification.



# <pre>ComfirmRegistration</pre>
## Description
The `ConfirmRegistration` method allows the application to check whether the user identity verification process has been finalized or not. The `user` object should be either in the `STARTED_REGISTRATION` or the `ACTIVATED` state. The latter is possible if the RPA activated the user immediately with the call to `StartRegistration` and no verification process is started. During the call to `ConfirmRegistration`, the SDK will try to retrieve a Client Key for the user, which will succeed if the user has already been verified/activated, but will fail otherwise. The method returns status `OK` if the Client Key is successfully retrieved and `IDENTITY_NOT_VERIFIED` if the identity is not verified. If the method is successful, the application will get the desired PIN/secret from the end-user and then call `FinishRegistration` to provide the PIN.

_Note:_ The application can provide a platform specific identifier for sending push messages to the device by using the optional parameter `pushMessageIdentifier`. The push messages can be used as an alternative to the Access Number, as part of the authentication flow.

## Definition
```
Status ConfirmRegistration(User user)

Status ConfirmRegistration(User user, String pushMessageIdentifier)
```

## Parameters

|Parameter Name|Parameter Type|Required?|Description|
|--------------|--------------|---------|-----------|
|`user`|User|Yes|The ID of the User|
|`pushMessageIdentifier`|String|No|Push Message Identifier or Token that is unique to the installed application and could be used to send push messages to it.|

## Return Values
* `OK` – User is registered successfully and its status is set to `REGISTERED`
* `FLOW_ERROR` – The `User` object is not in the incorrect state (See [User States](/milagro-mfa-mobile-sdk-user-states.html))

## Example
The following code snippet creates a new User identity and, if the registration process is successful, finalizes it.

```
User user = sdk.MakeNewUser("me@miracl.org");
Status status = sdk.StartRegistration(user);

if (status.getStatusCode() != Status.Code.OK) {
   // handle error
}

switch (user.GetState())
{
    case State.STARTED_REGISTRATION:
        //
        // Wait for identity confirmation
        //
        break;        
    case State.ACTIVATED:
        break;
    default:
        // Something went wrong
}

status = sdk.ConfirmRegistration(user);

if (status.getStatusCode() != Status.Code.OK) {
   // handle error
}

String setupPin;

/* Read PIN from user */

status = sdk.FinishRegistration(user, setupPin);

if (status.getStatusCode() != Status.Code.OK) {
   // handle error
}
```

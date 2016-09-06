---
currentMenu: milagro-mfa-mobile-sdk-registration-methods-wp
---

# Registration methods
___
## StartRegistration
___

This method initializes the registration for a User that has already been created. The SDK starts the M-Pin Setup flow, sending the necessary requests to the back-end service. The State of the User instance will change to StartedRegistration. The status will indicate whether the operation was successful or not. During this call, an M-Pin ID for the end-user will be issued by the RPS and stored within the user object. The RPA can also start a user identity verification procedure, by sending a verification e-mail.

The application can also pass additional userData which might help the RPA to verify the user identity. The RPA might decide to verify the identity without starting a verification process. In this case, the status of the call will still be OK, but the User State will be set to Activated.

### What Is the Difference Between StartRegistration and RestartRegistration?

The StartRegistration method generates a new M-Pin ID while RestartRegistration uses the ID that has already been generated for the user. So StartRegistration can only be called for Users in the Invalid state while RestartRegistration is used for those in the StartedRegistration state. Besides this, both methods work identically, as they both cause the RPA to re-start the User identity verification process.

### Definition
```
Status StartRegistration(User user, string activateCode = "", string userData="")
```

### Parameters

| Parameter Name     | Parameter Type     | Required? | Description |
| :------------- | :------------- |:------------- |:------------- |
| user     | User       | Yes | The ID of the user |
| activateCode   | String       | No  | Optional activation code that might be issued by the RPA and required during the registration process. |
| userData     | String       | No | Optional application specific data that might be needed/required by the RPA in order to register the user |


### Return Values

**OK:** User registation started successfully

**IdentityNotAuthorized:** User registration refused by remote server

**FlowError:** the User is in the incorrect state, i.e. its state is not Invalid

### Example

The following code snippet creates a new User and handles its registration process:
```
User user = sdk.MakeNewUser(@"me@domain.com");
status = sdk.StartRegistration(user);

if (status != null && status.StatusCode != Status.Code.OK)
{
    // Handle error
}

switch (user.UserState)
{
    case User.State.StartedRegistration:
        //
        // Wait for identity confirmation
        //
        break;        
    case User.State.Activated:
        break;
    default:
        // Something went wrong
}

status = sdk.ConfirmRegistration(user);

if (status != null && status.StatusCode != Status.Code.OK)
{
    // Handle error
}

status = sdk.FinishRegistration(user, setupPin);

if (status.StatusCode != Status.Code.OK)
{
    // Handle error
}
```
___
## RestartRegistration
___

The RestartRegistration method re-initializes the registration process for a User for which the registration process has already started. The method causes the RPA to re-start the User identity verification procedure (like sending a verification email, for instance).

The User’s status remains StartedRegistration until the ConfirmRegistration method has been executed successfully.

In a demo application, the RPA can be configured to verify identities without starting a verification process. In this case, the status of the call will still be OK, but the User state will be set to Activated.
The application might require some additional data (passed in the userData parameter) to verify the user’s identity.

### Difference Between StartRegistration and RestartRegistration methods

The StartRegistration method generates a new M-Pin ID while RestartRegistration uses the ID that has already been generated for the user. So StartRegistration can be called only for Users in the Invalid state whereas RestartRegistration is meant for Users in the StartedRegistration state. Besides this, both the methods work in the same way, as they both cause the RPA to re-start the User identity verification.

### Definition
```
Status RestartRegistration(User user, string userData = "")
```

### Parameters

| Parameter Name     | Parameter Type     | Required? | Description |
| :------------- | :------------- |:------------- |:------------- |
| user     | User       | Yes | The ID of the user |
| userData     | String       | No | Additional User data that might be required by the RPA to verify the user’s identity |

### Return Values

**OK:** User registered has been restarted successfully.

**IdentityNotAuthorized:** User registration refused by remote server

**FlowError:** the User is in the incorrect state, i.e its state is not StartedRegistration

### Example

The following code snippet demonstrates a sample usage of restarting a User registration.
```
User user = sdk.MakeNewUser(@"me@domain.com");
status = sdk.StartRegistration(user);

if (status != null && status.StatusCode != Status.Code.OK)
{
    // Handle error
}

if (user.UserState == User.State.StartedRegistration)
{
    // Waiting for identity verification, which doesn't happen
    status = sdk.RestartRegistration(user);

    //
    // Wait for identity confirmation
    //

    status = sdk.ConfirmRegistration(user);

    if (status != null && status.StatusCode != Status.Code.OK)
    {
        // Handle error
    }

    status = sdk.FinishRegistration(user, setupPin);

  }
    if (status.StatusCode != Status.Code.OK)
    {
        // Handle error
    }
```
___
## ConfirmRegistration
___

This method allows the application to check whether the user identity verification process has been finalized or not. The user object should be either in the StartedRegistration or the Activated state. The latter is possible if the RPA activated the user immediately with the call to StartRegistration and no verification process is started.

During the call to ConfirmRegistration, the SDK will try to retrieve Client Key for the user, which will succeed if the user has already been verified/activated, but will fail otherwise. The method returns status OK if the Client Key is successfully retrieved and IdentityNotVerified if the identity is not verified. If the method is successful, the application will get the desired PIN/secret from the end-user and then call FinishRegistration, provididing the PIN.

**Note:** The application can provide a platform specific identifier for sending push messages to the device by using the optional parameter pushMessageIdentifier. The push messages can be used as an alternative to the Access Number, as part of the authentication flow.

### Definition
```
Status ConfirmRegistration(User user, string pushMessageIdentifier = "")
```

### Parameters

| Parameter Name     | Parameter Type     | Required? | Description |
| :------------- | :------------- |:------------- |:------------- |
| user     | User       | Yes | The ID of the user |
| pushMessageIdentifier     | String       | No |   |


### Return Values

**OK:** if the client key is successfully retrieved   
**IdentityNotVerified:** if the user identity is not verified   

### Example
```
User user = sdk.MakeNewUser(@"me@domain.com");
status = sdk.StartRegistration(user);

if (status != null && status.StatusCode != Status.Code.OK)
{
    // Handle error
}

switch (user.UserState)
{
    case User.State.StartedRegistration:
        //
        // Wait for identity confirmation
        //
        break;        
    case User.State.Activated:
        break;
    default:
        // Something went wrong
}

status = sdk.ConfirmRegistration(user);

if (status != null && status.StatusCode != Status.Code.OK)
{
    // Handle error
}

status = sdk.FinishRegistration(user, setupPin);

if (status.StatusCode != Status.Code.OK)
{
    // Handle error
}
```
___
## FinishRegistration
___

This method finalizes the user registration process. It extracts the M-Pin Token from the Client Key for the provided pin (secret), and then stores the token in the secure storage. On successful completion, the User state will be set to Registered and the method will return status OK.

### Definition
```
Status FinishRegistration(User user, string pin)
```

### Parameters

| Parameter Name     | Parameter Type     | Required? | Description |
| :------------- | :------------- |:------------- |:------------- |
| user     | User       | Yes | The pin that is unique to that user |
| pin    | String       | Yes | The pin that is entered by that user  |

### Return Values

**OK:** User registered successfully and its status set to Registered   

**FlowError:** the User object is in an incorrect state. See [Understanding User States](milagro-mfa-mobile-sdk-user-states.html)    

### Example

The following code snippet creates a new User identity for a particular device and if the registration process is successful, finalizes it.
```
User user = sdk.MakeNewUser(@"me@domain.com");
status = sdk.StartRegistration(user);

if (status != null && status.StatusCode != Status.Code.OK)
{
    // Handle error
}

switch (user.UserState)
{
    case User.State.StartedRegistration:
        //
        // Wait for identity confirmation
        //
        break;        
    case User.State.Activated:
        break;
    default:
        // Something went wrong
}

status = sdk.ConfirmRegistration(user);

if (status != null && status.StatusCode != Status.Code.OK)
{
    // Handle error
}

string setupPin;

​/* Read PIN from user */

status = sdk.FinishRegistration(user, setupPin);

if (status.StatusCode != Status.Code.OK)
{
    // Handle error
}
```

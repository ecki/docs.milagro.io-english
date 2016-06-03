---
currentMenu: milagro-mfa-mobile-sdk-generic-example-wp
---

# Generic M-Pin App Code Example - Milagro MFA Mobile SDK for Windows Phone

# Overview

This page provides a generic code example of an Milagro App for Windows phones to help you get started with the SDK. It demonstrates the full Milagro User registration/authentication cycle in its correct succession: initialization, User creation and verification, and then User verification.

You can use this example as a “skeleton” on which to further build your specific use cases and functionalities.

## Example - needs to be replaced by a Windows example
```
//
// Initializing the SDK for the first time
//
MPin sdk = new MPin();

IDictionary<string, string> config = new Dictionary<string, string>();
config.Add("backend", "http://my.backend.com");

Status status = sdk.Init(config);

//
// Process service changed
//
status = sdk.SetBackend("http://my.secondBackend.com");

if (status.StatusCode != Status.Code.OK)
{
    // Show error message and exit
}

//
// Creating a User identity
//
User user = sdk.MakeNewUser(@"me@domain.com");
status = sdk.StartRegistration(user);

if (status != null && status.StatusCode != Status.Code.OK)
{
    // Show error message and exit
}

switch (user.UserState)
{
    case User.State.StartedRegistration:
    {
        bool waitForCofirmation = true;

        while (waitForCofirmation)
        {
            // Wait for user identity confirmation            
            status = sdk.ConfirmRegistration(user);

            if (status.StatusCode == Status.Code.IdentityNotVerified)
            {
                await Task.Delay(3000);
                continue;
            }

            if (status.StatusCode != Status.Code.OK)
            {
                // Show error message and exit
            }

            waitForCofirmation = false;
        }
        break;        
    }
    case User.State.Activated:
    {
        status = sdk.ConfirmRegistration(user);

        if (status.StatusCode != Status.Code.OK)
        {
            // Show error message and exit
        }
        break;
    }
    default:
        // Something went wrong
        // Show error message and exit
}

string setupPin;
//
// Read PIN Code or secret from the user
//
status = sdk.FinishRegistration(user, setupPin);
if (status.StatusCode != Status.Code.OK)
{
    // Show error message and exit
}

//
// Retrieving the stored User identities
//
List<User> users = new List<User>();
sdk.ListUsers(users);

//
// Authenticating the User
//
status = sdk.StartAuthentication(user);

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

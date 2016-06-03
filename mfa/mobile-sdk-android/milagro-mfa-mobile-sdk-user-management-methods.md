---
currentMenu: milagro-mfa-mobile-sdk-user-management-methods-android
---

# User Management Methods
## Overview
This page provides a list and brief description of the User Management methods used in the Milagro MFA Mobile SDK for Android. They relate to user management operations like creating, retrieving and deleting users.<br>To view a list of all methods, refer to the [API Reference](milagro-mfa-mobile-sdk-api-reference.html) page.

# <pre>MakeNewUser</pre>
## Description
The `MakeNewUser` method creates a new `User` object where the `User` object represents an end-user of the Milagro MFA authentication. The User has its own unique identity which is passed as the id parameter to this method. You can also specify an optional `deviceName` as a User can have multiple devices. The `deviceId` is passed to the RPA which stores it and uses it later to determine which M-Pin ID is associated with this device. The return value is a reference to the newly created user.<br>
The newly created User is in an INVALID state.<br>
For a description of the User class, see [Understanding User States](milagro-mfa-mobile-sdk-user-states.html)<br>
The Java version of the User class is as follows:
```java
public class User implements Closeable {

    public enum State {
        INVALID,
        STARTED_REGISTRATION,
        ACTIVATED,
        REGISTERED,
        BLOCKED
    };

    public String getId() {
        ...
    }

    public State getState() {
        ...
    }

    @Override
    public String toString() {
        return getId();
    }

    ...
}
```
## Definition
```java
User MakeNewUser(String id)
User MakeNewUser(String id, String deviceName)
```

## Parameters
|Parameter Name|Parameter Type|Required?|Description|
|--------------|--------------|---------|-----------|
|`id`|_String_|Yes|A string that uniquely identifies the User, e.g. the end-user’s email address|
|`deviceName`|_String_|No|A string identifying the particular end-user device. Each `deviceName` must be unique for its User.|

## Return Values
Returns an object for the new User
## Example

The following code snippet creates a new User identity:
```
User user = sdk.MakeNewUser("me@miracl.org");
Status status = sdk.StartRegistration(user);

if (status.getStatusCode() != Status.Code.OK) {
   // handle error
}

if (user.getState() != State.ACTIVATED) {
   // ask for verification
}

status = sdk.ConfirmRegistration(user);

if (status.getStatusCode() != Status.Code.OK) {
   // handle error
}

String pin;

/** Ask user to provide PIN or other secret here **/

status = sdk.FinishRegistration(user, pin);

if (status.getStatusCode() != Status.Code.OK) {
   // handle error
}
```

# <pre>ListUsers</pre>
## Description
The `ListUsers` method populates a list with all current Users, irrespective of their state. The SDK's Users List contains a list of users in various states, which reflects their registration statuses.

## Definition
```
void ListUsers(List<User> users)

```
## Parameters
|Parameter Name|Parameter Type|Required?|Description|
|--------------|--------------|---------|-----------|
|`users`|_List<User\>_|Yes|The list of users showing their registration status|
## Return Values
None
## Example
The following code snippet matches a User's identity against the list of all Users and if there is a match, deletes the selected User.
```
List usersList = new ArrayList();
User selectedUser;
sdk.ListUsers(usersList);
for (User user : usersList) {
        if ("me@MIRACL.org".equals(user.getId())) {
            selectedUser = user;
         break;
            }
        }
if (selectedUser) {
    sdk.DeleteUser(selectedUser);
    }
```
# <pre>DeleteUser</pre>
## Description
The `DeleteUser` method deletes a User from the Users List maintained by the SDK and all the data related to this User, such as the User’s M-Pin ID, State and M-Pin Token.

As the `DeleteUser` method deletes all the data related to the User, a new User with the same identity can be created after that with the MakeNewUser method.

## Definition
```
void DeleteUser(User user)
```
## Parameters
|Parameter Name|Parameter Type|Required?|Description|
|--------------|--------------|---------|-----------|
|user|User|Yes|The User ID|

## Return Values
None
## Example
The following code snippet matches a User's identity against the list of all Users and if there is a match, deletes the selected User.
```
List usersList = new ArrayList();
User selectedUser;
sdk.ListUsers(usersList);
for (User user : usersList) {
    if ("me@MIRACL.org".equals(user.getId())) {
        selectedUser = user; break;
        }
    }

if (selectedUser) { sdk.DeleteUser(selectedUser); }
```

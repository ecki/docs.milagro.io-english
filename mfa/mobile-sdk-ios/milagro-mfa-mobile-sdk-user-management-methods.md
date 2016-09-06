---
currentMenu: milagro-mfa-mobile-sdk-user-management-methods-ios
---
# User Management Methods

This page provides a list, along with brief descriptions, of the User Management methods used in the Milagro MFA Mobile SDK for iOS. To view the other methods, refer to the [API Reference](milagro-mfa-mobile-sdk-api-reference.html) page.
___
## MakeNewUser
___

This method creates a new User object which represents an end-user . The User has its own unique identity which is passed as the id parameter to this method. You can also specify an optional deviceName, as a User can have multiple Devices. The deviceId is passed to the RPA which stores it and uses it later to determine which M-Pin ID is associated with this Device. The return value is a reference to the newly created user.

Note: The newly created User is in an INVALID state.
For a description of the User class, see Understanding User States.

The Objective-C version of the User class is as follows:

    typedef NS_ENUM(NSInteger, UserState)
    {
        INVALID,
        STARTED_REGISTRATION,
        REGISTERED,
        ACTIVATED,
        BLOCKED
    };

    @protocol IUser <NSObject>
    -(NSString*) getIdentity;
    -(UserState) getState;
    @end

### Definition

    + (id<IUser>) MakeNewUser: (const NSString*) identity;

    + (id<IUser>) MakeNewUser: (const NSString*) identity deviceName: (const NSString*) devName;

### Parameters

| Parameter Name | Parameter Type | Required? | Description                                                                                                       |   |
|----------------|----------------|-----------|-------------------------------------------------------------------------------------------------------------------|---|
| identity       | NSString       | Yes       | A string that uniquely identifies the User, e.g. the end-user’s email address.                                    |   |
| devName        | NSString       | No        | A user-friendly string that identifies the particular end-user device. Each deviceID must be unique for its User. |   |

### Return Values

Returns an object for the new User.

### Example 1 of 2

The following code snippet creates a new User identity.

    id iuser = [MPin MakeNewUser:@"me@MIRACL.org"];
    MpinStatus* mpinStatus = [MPin StartRegistration:iuser];

    switch (mpinStatus.status) {
    case OK:
        switch ([iuser getState]) {
        case INVALID:
           /* Do something */
           break;
        case STARTED_REGISTRATION:
           /* Do something */
           break;
        case ACTIVATED:
           /* Do something */
           break;
        case REGISTERED:
           /* Do something */
           break;
        default:
           /* Do something */
           break;
        }
        break;

    default:
        /* Do something */
        break;
    }

### Example 2 of 2

The following code snippet creates a new User identity specifying a Device Name.

    id iuser = [MPin MakeNewUser:@"me@MIRACL.org" deviceName:@"My office smartphone"];
    MpinStatus* mpinStatus = [MPin StartRegistration:iuser];

    switch (mpinStatus.status) {
    case OK:
        switch ([iuser getState]) {
        case INVALID:
           /* Do something */
           break;
        case STARTED_REGISTRATION:
           /* Do something */
           break;
        case ACTIVATED:
           /* Do something */
           break;
        case REGISTERED:
           /* Do something */
           break;
        default:
           /* Do something */
           break;
        }
        break;

    default:
        /* Do something */
        break;
    }
___
## DeleteUser
___

This method deletes a user from the users list that the SDK maintains. All the user data, including its M-Pin ID, its state and M-Pin Token will be deleted.

As the DeleteUser method deletes all the data related to the User, a new User with the same identity can be created after that, using the MakeNewUser method.

### Definition

    + (void) DeleteUser: (const id<IUser>) user;

### Parameters

| Parameter Name | Parameter Type | Required? | Description |   |
|----------------|----------------|-----------|-------------|---|
| user           | IUser          | Yes       | The User ID |   |

### Return Values

None

### Example

The following code snippet matches a User's identity against the list of all Users and if there is a match, deletes the selected User.
```
NSMutableArray *users = [MPin listUsers];

for (int i = 0; i < [users count]; i++) {
    id iuser = [users objectAtIndex:i];
    [MPin DeleteUser:iuser];
}
```
___
## ListUsers
___

This method populates the provided vector with all the users that are currently available in the SDK's users list. They will be listed according to their states to indicate their registration status.

### Definition
```
+ (NSMutableArray*) listUsers;
```

### Parameters

| Parameter Name | Parameter Type | Required? | Description |
|----------------|----------------|-----------|-------------|
| listUsers      | NSMutableArray |           |             |

### Return Values

Returns a list of users in `NSMutableArray*` format.

### Example

The following code snippet matches a User's identity against the list of all Users and if there is a match, deletes the selected User.
```
NSMutableArray *users = [MPin listUsers];

for (int i = 0; i < [users count]; i++) {
    id iuser = [users objectAtIndex:i];
    [MPin DeleteUser:iuser];
}
```

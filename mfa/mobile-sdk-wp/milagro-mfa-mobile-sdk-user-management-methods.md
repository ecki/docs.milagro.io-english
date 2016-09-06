---
currentMenu: milagro-mfa-mobile-sdk-user-management-methods-wp
---

# User Management Methods
___
## MakeNewUser
___

This method creates a new User object which represents an end-user of the M-Pin authentication. The User has its own unique identity which is passed as the id parameter to this method. You can also specify an optional deviceName, as a User can have multiple Devices. The device name is passed to the RPA which stores it and uses it later to determine which M-Pin ID is associated with this Device. The return value is a reference to the newly created user.

The newly created User is in the Invalid state
```
public class User : IDisposable
{
    public enum State
    {
        Invalid,
        StartedRegistration,
        Activated,
        Registered,
        Blocked
    };

    public String Id { get { ... } }
    public State UserState { get { ... } }

    public override string ToString()
    {
        return this.Id;
    }
    ....
}
```
### Definition
```
User MakeNewUser(string id, string deviceName = "")
```
### Parameters

| Parameter Name     | Parameter Type     | Required ? | Description |
| :------------- | :------------- |:------------- |:------------- |
| id      | String       | Yes | A string that uniquely identifies the User, e.g. the end-user’s email address  |
| deviceName | string | Yes | A string that specifies the device name |

### Return Values

Returns an object for the new User

### Example

The following code snippet creates a new User identity, specifying a Device Name.
```
User user = sdk.MakeNewUser(@"me@miracl.com", "My smartphone");

status = sdk.StartRegistration(user);

if (status != null && status.StatusCode == Status.Code.OK)
{
    switch (user.UserState)
    {
        case User.State.StartedRegistration:
            /* Do something */
            break;
        case User.State.Activated:
            /* Do something */
            break;
        default:
            /* Do something */
            break;
    }
}
else
{
    // Handle error
}
```
___
## DeleteUser
___

This method deletes a user from the users list that the SDK maintains. All the user data, including its M-Pin ID, its state and M-Pin Token will be deleted.

**Note:** As the DeleteUser method deletes all the data related to the User, a new User with the same identity can be created after that using the MakeNewUser method.

### Definition
```
void DeleteUser(User user);
```

### Parameters

| Parameter Name     | Parameter Type     | Required ? | Description |
| :------------- | :------------- |:------------- |:------------- |
| user      | User       | Yes | The User ID  |

### Return Values

None

### Example

The following code snippet deletes all the available users.
```
List<User> users = new List<User>();
sdk.ListUsers(users);

for (int i = 0; i < users.Count; i++)
{
    sdk.DeleteUser(users[i]);
}
```
___
## ListUsers
___

This method populates the provided vector with all the users that are currently available in the SDK's users list. The listed users' state indicates their registration status.

### Definition
```
void ListUsers(List<User> users)
```
### Return Values

The users list is populates in the provided users parameter. The method itself doesn't return any value.

### Example

The following code snippet deletes all the available users.
```
List<User> users = new List<User>();
sdk.ListUsers(users);

for (int i = 0; i < users.Count; i++)
{
    sdk.DeleteUser(users[i]);
}
```

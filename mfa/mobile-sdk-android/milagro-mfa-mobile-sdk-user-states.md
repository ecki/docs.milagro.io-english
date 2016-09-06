---
currentMenu: milagro-mfa-mobile-sdk-user-states-android
---

# Understanding User States

This page briefly describes the states of the `User` object and when they are assigned. A physical user is represented by a `User` object. The `User` object supports several states which shows the progress of the physical user through the various stages of the registration process and their current permissions, in order to access the system.

The following table shows the states of the `User` object in the chronological order in which they are normally assigned to a User.

|State|Description|
|-----|-----------|
|`INVALID`|The `User` object has been created, but the User registration process has not started yet; any newly created Users are in an `INVALID` state.<br>To start User registration, call the `StartRegistration` method. The `INVALID` state is also temporarily assigned to a User that has just been deleted until the User is physically deleted from memory.|
|`STARTED_REGISTRATION`|The `User` object has been created, and the User registration process has started but not yet completed. The User’s state remains `STARTED_REGISTRATION` until the `ConfirmRegistration` method is executed successfully. The `STARTED_REGISTRATION` state indicates that if the registration procedure needs to be done anew, you must use the `RestartRegistration` method and not the `StartRegistration` method. The `StartRegistration` method will return `FLOW_ERROR` in this case.|
|`REGISTERED`|The User registration has completed successfully and the User can now authenticate to the M-Pin System.|
|`ACTIVATED`|Temporary state for the special case in which a User can be registered without going through a verification process, e.g. in the case of a demo app. In this special case, the `ACTIVATED` state is assigned to the User upon `StartRegistration`, which allows the `ConfirmRegistration` method to be called and to succeed without waiting for identity verification.|
|`BLOCKED`|State assigned to a User upon reaching the maximum allowed number of unsuccessful login attempts (3 by default, configurable through the `maxInvalidLoginAttempts` option the in the RPS). Once this state is set, the end-user is blocked and should re-register.|

The `User` class is as follows:

```
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

---
currentMenu: milagro-mfa-mobile-sdk-user-states-ios
---
# Understanding User States

## Overview

This page explains briefly what states the User objects are in and when they are assigned. A physical user of the Milagro MFA authentication platform is represented by a User object. The User object supports several states which shows the progress of the physical user through the stages of the registration process and their current permissions to access the system.

## User States

The following table presents the states of the User object in the chronological order in which they normally are assigned to a User.

| State                | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
|----------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| INVALID              | The User object has been created, but the User registration process has not started yet; any newly created Users are in anINVALID state. (To begin User registration, call theStartRegistration method.) The INVALID state is also temporarily assigned to a User that has just been deleted until the User is physically deleted from memory.                                                                                                                            |
| STARTED_REGISTRATION | The User object has been created, and the User registration process has started but not yet completed. The User’s state remainsSTARTED_REGISTRATION until the ConfirmRegistrationmethod is executed successfully. The STARTED_REGISTRATIONstate indicates that if the registration procedure needs to be done anew, you must use the RestartRegistration method and not the StartRegistration method (The StartRegistrationmethod will return a FLOW_ERROR in this case). |
| REGISTERED           | The User registration has completed successfully and the User can now authenticate to the M-Pin System.                                                                                                                                                                                                                                                                                                                                                                   |
| ACTIVATED            | Temporary state for the special case in which a User can be registered without going through a verification process, e.g. in case of a demo app. In this special case, the ACTIVATED state is assigned to the User upon StartRegistration, which allows theConfirmRegistration method to be called and to succeed without waiting for identity verification.                                                                                                              |
| BLOCKED              | State assigned to a User upon reaching the maximum allowed number of unsuccessful login attempts (3 by default, configurable through the maxInvalidLoginAttempts option the in the RPS.) Once this state is set, the end-user is blocked and should re-register.                                                                                                                                                                                                          |

## The User Class

The User class looks as follows:
```
typedef NS_ENUM(NSInteger, UserState)

{

INVALID,

STARTED_REGISTRATION,

REGISTERED,

ACTIVATED,

BLOCKED

};

@protocol IUser

-(NSString*) getIdentity;

-(UserState) getState;

@end
```

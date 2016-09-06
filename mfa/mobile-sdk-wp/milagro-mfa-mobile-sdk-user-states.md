---
currentMenu: milagro-mfa-mobile-sdk-user-states-wp
---

<div id="generated-toc" class="generate_from_h2"></div>

# Understanding User States

This page explains briefly the various `User` objects and when they are assigned.

## Overview

A physical user of the Milagro Platform is represented by a `User` object. The User object supports several states showing the progress of the physical user through the stages of the registration process and their current permissions to access the system.</p>

## User States

The following table presents the states of the `User` object in the chronological order in which they are normally assigned to a User:

| State               | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
|---------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Invalid             | The User object has been created, but the User registration process has not started yet; any newly created Users are in an Invalid state. To begin User registration, call the StartRegistration method. The Invalid state is also temporarily assigned to a User that has just been deleted until the User is physically deleted from memory.                                                                                                                           |
| StartedRegistration | The User object has been created, and the User registration process has started but not yet completed. The User’s state remains StartedRegistration until the ConfirmRegistration method is executed successfully. The StartedRegistration state indicates that if the registration procedure needs to be done anew, you must use the RestartRegistration method and not the StartRegistration method. The StartRegistration method will return FlowError in this case). |
| Registered          | The User registration has completed successfully and the User can now authenticate to the M-Pin System.                                                                                                                                                                                                                                                                                                                                                                  |
| Activated           | A temporary state for the special case in which a User can be registered,without going through a verification process, e.g. in the case of a,demo app. In this special case, the Activated state is assigned to the User upon StartRegistration, which allows the ConfirmRegistration method to be called and to succeed without waiting for identity verification.                                                                                                      |
| Blocked             | State assigned to a User upon reaching the maximum allowed number of,unsuccessful login attempts (three by default, configurable through the maxInvalidLoginAttempts option the in the RPS.) Once this state is set, the end-user is blocked and should re-register.                                                                                                                                                                                                     |

The `User` class is as follows:
```
public class User : IDisposable
{
    public enum State
    {
        /// <summary>
        /// The <see cref="User"/> object has been created, but the registration process has not started yet; any newly created Users are in Invalid state. (To begin User registration, call the StartRegistration method). The Invalid state is also temporarily assigned to a User that has just been deleted until the User is physically deleted from memory.
        /// </summary>
        Invalid,
        /// <summary>
        /// The <see cref="User"/> object has been created, and the User registration process has started but not yet completed. The User’s state remains StartedRegistration until the FinishRegistration method is executed successfully. The StartedRegistration state indicates that if the registration procedure needs to be done again, you must use the RestartRegistration method and not the StartRegistration method (the StartRegistration method will return FlowError in this case.).
        /// </summary>
        StartedRegistration,
        /// <summary>
        ///  A temporary state for a special case in which a <see cref="User"/> can be registered without going through a verification process, e.g. in case of a demo app. In this special case, the Activated state is assigned to the User upon StartRegistration, which allows the FinsihRegistration method to be called and to succeed without waiting for identity verification.
        /// </summary>
        Activated,
        /// <summary>
        /// The <see cref="User"/> registration has completed successfully and the User can now authenticate to the M-Pin System.
        /// </summary>
        Registered,
        /// <summary>
        /// A state assigned to a <see cref="User"/> upon reaching the maximum allowed number of unsuccessful login attempts (3 by default, configurable through the maxInvalidLoginAttempts option the in the RPS.) Once this state is set, the end-user is blocked and should re-register.
        /// </summary>
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

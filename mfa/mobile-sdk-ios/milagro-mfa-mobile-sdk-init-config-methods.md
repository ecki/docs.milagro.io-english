---
currentMenu: milagro-mfa-mobile-sdk-init-config-methods-ios
---
## Overview

This page provides a list, along with brief descriptions, of the Initialization and Configuration methods used in the Milagro MFA Mobile SDK for iOS. They relate to intializing the Milagro MFA Mobile SDK and configuring the back-end URL.

To view the other methods, see the API Reference page.

### InitSDK

#### Description

This method constructs/initializes the SDK object.

Note that after this initialization, the SDK will not be ready for usage until SetBackend is called with a valid Definition
Definition

    + (void) initSDK;

#### Parameters

None.

#### Return Values

None. This method always succeeeds.

#### Example
```
/*
* Initializing the SDK
*/
[MPin initSDK];
MpinStatus* status = [MPin SetBackend:@"http://my.backend.com"];

if (mpinStatus.status != OK) {
    // Show error message and exit
}
```

### TestBackend

#### Description

This method tests if server is a valid back-end URL by trying to retrieve Client Settings from it. You can specify a custom RPS prefix if it was customized at the back-end and is different from the default "rps". If the back-end URL is a valid one, the method will return status OK.

#### Definition
```
+ (MpinStatus*) TestBackend: (const NSString*) url;
+ (MpinStatus*) TestBackend: (const NSString*) url rpsPrefix: (const NSString*) rpsPrefix;
```
#### Parameters

| Parameter Name | Parameter Type | Required? | Description                                                                                                                                                    |
|----------------|----------------|-----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| url            | NSString*      | Yes       | The URL of the M-Pin back-end service to test.                                                                                                                 |
| rpsPrefix      | NSString*      | No        | A string representing the prefix for the requests to the RPS. Required only if the default prefix has been changed. If not provided, the value defaults torps. |

#### Return Status

**OK** - Back-end service URL verifies OK

**NETWORK_ERROR** - Back-end service URL verification failed

#### Example

The code snippet below tests the following URL:http://ec2-54-77-232-113.eu-west-1.compute.amazonaws.com

```
MpinStatus* mpinStatus = [MPin TestBackend:@"http://ec2-54-77-232-113.eu-west-1.compute.amazonaws.com"];

if (mpinStatus.status != OK) {
    // Show error message
}
```

### SetBackend

#### Description

This method changes the currently configured back-end in the SDK. url is the new back-end URL that should be used. Optionally, a custom RPS prefix might be specified if it was customized at the back-end and is different from the default "rps". If successful, the method will return status OK.

#### Definition
```
+ (MpinStatus*) SetBackend: (const NSString*) url;
+ (MpinStatus*) SetBackend: (const NSString*) url rpsPrefix: (const NSString*) rpsPrefix;
```

#### Parameters

| Parameter Name | Parameter Type | Required? | Description                                                                                                                                                    |
|----------------|----------------|-----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| url            | NSString*      | Yes       | The server URL used for the new M-Pin back-end service.                                                                                                        |
| rpsPrefix      | NSString*      | No        | A string representing the prefix for the requests to the RPS. Required only if the default prefix has been changed. If not provided, the value defaults torps. |

#### Return Values

**OK** – Back-end service URL configured successfully

**NETWORK_ERROR** – Setting back-end service URL failed  
</br>
#### Example

The following example sets the M-Pin back-end service to http://ec2-54-77-232-113.eu-west-1.compute.amazonaws.com:

```
MpinStatus* mpinStatus = [MPin SetBackend:@"http://ec2-54-77-232-113.eu-west-1.compute.amazonaws.com"];

if (mpinStatus.status != OK) {
    // Show error message
}
```

### GetClientParam Method

#### Description

This method returns the value for a Client Setting with the given key. The value is returned as a String always, i.e. when a numeric or a boolean value is expected, the conversion should be handled by the application. It uses the following client settings:

**accessNumberDigits** - The number of Access Number digits that should be entered by the user, prior to calling **`FinishAuthenticationAN**
</br></br>
**setDeviceName** - Indicates (true/false) whether the application should ask the user to insert a Device Name and pass it to the **MakeNewUser** method
</br></br>
**appID** - Unique ID assigned to each customer or application, used by the backend. It is a hex-encoded long numeric value and can only be used for information purposes and does not affect the behaviour of the application in any way
</br></br>

 #### Definition
```
+ (NSString*) GetClientParam: (const NSString*) key;
```

#### Parameters

| Parameter Name | Parameter Type | Required? | Description                         |
|----------------|----------------|-----------|-------------------------------------|
| key            | NSString*      | Yes       | The name of the requested parameter |

#### Return Values

NSString - the value of the requested client parameter

Example
```
NSString* appID = [MPin GetClientParam:@"appID"];

if ( appID == nil ) {
    //Handle error
}
```

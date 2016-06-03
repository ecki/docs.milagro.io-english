---
currentMenu: milagro-mfa-mobile-sdk-init-config-methods-android
---

# Initialization and Configuration Methods

## Overview

This page provides a list and brief description of the Initialization and Configuration methods used in the Milagro Mobile SDK for Android. They relate to initializing the SDK and configuring the back-end URL.

To view the other methods, refer to the [API Reference](/milagro-mfa-mobile-sdk-api-reference.html) page.

# MPinSDK
## Description
This method constructs an SDK instance.
## Definition
```
MPinSDK()
```
## Parameters
None
## Return Values
None
## Example
The following example initializes an instance and sets the back-end service to http://ec2-54-77-232-113.eu-west-1.compute.amazonaws.com.
```
// Create a new MPinSDK instance
MPinSDK sdk = new MPinSDK();

// Initialize the SDK
HashMap<String, String> config = new HashMap<>();
config.put("backend", "http://ec2-54-77-232-113.eu-west-1.compute.amazonaws.com");

Status status = sdk.Init(config, context);
```
# Init
## Description
This method initializes the SDK. It receives a key/value map of the configuration parameters. The additional context parameter is of type `android.content.Context` and is usually retrieved from the system's `getApplicationContext()` method.
## Definition
```
Status Init(Map<String, String> config, Context context)
```
## Parameters
|Parameter Name|Parameter Type|Required?|Description|
|--------------|--------------|---------|-----------|
|`config`|Map&lt;String, String&gt;|Yes|Key/value dictionary of initialization parameters|
|`IContext`|Context|No|An additional context parameter of type `android.content.Content`. It is usually retrieved from the system's `getApplicationContext()` method.|
## Return Values
* `NETWORK_ERROR` - in case there was a problem to communicate with the back-end

## Example
```
MPinSDK sdk = new MPinSDK();

HashMap<String, String> config = new HashMap<String, String>();
config.put(MPinSDK.CONFIG_BACKEND, "http://ec2-54-77-232-113.eu-west-1.compute.amazonaws.com");

Status status = sdk.Init(config, context);

if (status.getStatusCode() != Status.Code.OK) {
    // handle error
}
```

# <pre>SetBackend</pre>

## Description
The `SetBackend` method modifies the currently configured back-end service. The back-end is initially set at SDK initialization (i.e. through the Mpin method), but it can be changed at any time using `SetBackend`.
## Definition

```
Status SetBackend(String server)
Status SetBackend(String server, String rpsPrefix)
```
## Parameters

|Parameter Name|Parameter Type|Required?|Description|
|--------------|--------------|---------|-----------|
|`server`|String|Yes|The server URL used for the new M-Pin back-end service.|
|`rpsPrefix`|String|No|A string representing the prefix for the requests to the RPS. Required only if the default prefix has been changed. If not provided, the value defaults to `rps`.|

## Return Values

* `OK` – Back-end service URL configured successfully
* `NETWORK_ERROR` – The specified back-end could not be reached

## Example

The following example sets the back-end service to http://ec2-54-77-232-113.eu-west-1.compute.amazonaws.com
```
Status status = sdk.SetBackend(“http://ec2-54-77-232-113.eu-west-1.compute.amazonaws.com”);
if (status.getStatusCode() != Status.Code.OK) {

// handle error

}
```
# <pre>TestBackend</pre>

## Description

The `TestBackend` method tests whether the back-end service is operational by sending a request for retrieving the Client Settings to back-end.

## Definition

```
Status TestBackend(String server)
Status TestBackend(String server, String rpsPrefix)
```

# <pre>GetClientParam</pre>

## Description

This method returns the value for a _Client Setting_ with the given key. The value is returned as a String always, i.e. when a numeric or a boolean value is expected, the conversion should be handled by the application. It uses the following client settings:

*  `accessNumberDigits` - The number of Access Number digits that should be entered by the user, prior to calling `FinishAuthenticationAN`
*  `setDeviceName` - Indicates (`true`/`false`) whether the application should ask the user to insert a _Device Name_ and pass it to the `MakeNewUser` method
*  `appID` - Unique ID assigned to each customer or application, used by the backend. It is a hex-encoded long numeric value and can only be used for information purposes and does not affect the behaviour of the application in any way.

## Definition

```
String GetClientParam(String key)
```

## Parameters

|Parameter Name|Parameter Type|Required?|Description|
|--------------|--------------|---------|-----------|
|`key`|String|Yes|The name of the requested parameter|

## Return Values
String - the value of the requested client parameter

## Example
```
String appID = sdk.GetClientParam("appID");
```

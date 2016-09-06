---
currentMenu: milagro-mfa-mobile-sdk-init-config-methods-wp
---

# Initialization and Configuration methods
___
## MPin
___

The MPin method is the constructor for the M-Pin SDK instance. It receives the required configuration settings as a parameter.

### Definition
```
MPin()
```

### Parameters

None

### Return Values

None

### Example

The following example initializes an M-Pin SDK instance and sets the M-Pin back-end service to http://ec2-54-77-232-113.eu-west-1.compute.amazonaws.com.
```
MPin sdk = new MPin();

IDictionary<string, string> config = new Dictionary<string, string>();
config.Add("backend", "http://my.backend.com");

Status status = sdk.Init(config);
```
___
## Init
___

This method initializes the SDK. It receives a key/value dictionary of the configuration parameters. The context parameter is optional. If not set, an instance of Context class is used. The application can provide its own context, if necessary, to override the http request and storage functionality implementations.

### Definition
```
Status Init(IDictionary<string, string> config, IContext context = null)
```

### Parameters

| Parameter Name | Parameter Type              | Required? | Description                                                                                                          |
|----------------|-----------------------------|-----------|----------------------------------------------------------|
| config         | IDictionary<string, string> | Yes       | Key/value dictionary of initialization parameters                                                                    |
| context        | IContext                    | No        | Optional context to overwrite the default SDK context object. It is recomended to not overwrite the default context. |

### Return Values

**OK**
**NetworkError:** in case there was a problem to communicate with the back-end

### Example
```
MPin sdk = new MPin();

IDictionary<string, string> config = new Dictionary<string, string>();
config.Add("backend", "http://my.backend.com");

Status status = sdk.Init(config);

if (status.StatusCode != Status.Code.OK)
{
    // Show error message and exit
}
```
___
## TestBackend Method
___

This method tests if backend is a valid back-end URL by trying to retrieve Client Settings from it. You can specify a custom RPS prefix if it was customized at the back-end and is different from the default "rps". If the back-end URL is a valid one, the method will return status OK.

If **rpsPrefix** is not specified, the default value is "rps".

### Definition
```
Status TestBackend(string backend, string rpsPrefix = "")
```

### Parameters

| Parameter Name     | Parameter Type     | Required? | Description |
| :------------- | :------------- |:------------- |:------------- |
| backend     | String       | Yes | The URL of the M-Pin back-end service to test  |
| rpsPrefix   | String       | No  |A string representing the prefix for the requests to the RPS. Required only if the default prefix has been changed. If not provided, the value defaults to rps |

### Return Values

**OK:** Back-end service URL verifies OK

**NetworkError:** Back-end service URL verification failed

### Example

The code snippet below tests the following URL: http://ec2-54-77-232-113.eu-west-1.compute.amazonaws.com.
```
status = sdk.TestBackend("http://ec2-54-77-232-113.eu-west-1.compute.amazonaws.com");

if (status.StatusCode != Status.Code.OK)
{
    // Handle error
}
```
___
## SetBackend Method
___

This method changes the currently configured back-end in the Core. Initially you can set the back-end through the Init method, after which you can change it using this method. backend is the new back-end URL that should be used. Optionally, a custom RPS prefix might be specified if it was customized at the back-end and is different from the default "rps". If successful, the method will return status OK.

### Definition
```
Status SetBackend(string backend, string rpsPrefix = "")
```
### Parameters

| Parameter Name     | Parameter Type     | Required? | Description |
| :------------- | :------------- |:------------- |:------------- |
| backend     | String       | Yes | The URL of the new M-Pin back-end service |
| rpsPrefix   | String       | No  |A string representing the prefix for the requests to the RPS. Required only if the default prefix has been changed. If not provided, the value defaults to rps |

### Return Values

**OK:** Back-end service URL configured successfully   

**NetworkError:** Setting back-end service URL failed   

### Example

The following example sets the M-Pin back-end service to http://ec2-54-77-232-113.eu-west-1.compute.amazonaws.com.
```
status = sdk.SetBackend("http://ec2-54-77-232-113.eu-west-1.compute.amazonaws.com");

if (status.StatusCode != Status.Code.OK)
{
    // Handle error
}
```
___
## GetClientParam Method
___

The GetClientParam method returns the value for a Client Setting with the given key. The value is returned as a String always, i.e. when a numeric or a boolean value is expected, the conversion should be handled by the application. It uses the following client settings:

**accessNumberDigits:** The number of Access Number digits that should be entered by the user, prior to calling FinishAuthenticationAN.   </br>

**setDeviceName:** Indicates (true/false) whether the application should ask the user to insert a Device Name and pass it to the: </br>   **MakeNewUser** method.    </br>

**appID:** Unique ID assigned to each customer or application, used by the backend. It is a hex-encoded long numeric value and can only be used for information purposes and does not affect the behaviour of the application in any way.   

### Definition
```
string GetClientParam(string key)
```

### Parameters

| Parameter Name     | Parameter Type     | Required? | Description |
| :------------- | :------------- |:------------- |:------------- |
| key     | String       | Yes | The name of the requested parameter |

### Return Values

The string value of the requested parameter

### Example
```
string appID = sdk.GetClientParam("appID");
```

---
currentMenu: milagro-mfa-logging-services
---

## Logging Services

If you want to log the Services for troubleshooting, set the level of detail of logged messages for all the services to **Debug.**<br /><br />

**1.** Set the `logLevel` option of each service to Debug.

**2.** Restart the services by running the following commands:<br /><br />
```
<installation-folder>/mpin stop
<installation-folder>/mpin start
```
The log files reside in the following locations:

- **RPS**: `<installation-folder>/mpin-<X.X>/servers/rps/rps.log`
- **D-TA**: `<installation-folder>/mpin-<X.X>/servers/dta/dta.log`

where installation-folder is the installation folder and X.X;. is the version, e.g. 3.5.

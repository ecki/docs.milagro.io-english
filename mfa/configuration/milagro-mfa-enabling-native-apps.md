---
currentMenu: milagro-mfa-enabling-native-apps
---

# Enabling Native Apps

You can enable authentication from a native mobile app manually by following the steps below:
<br /><br />
**1.** Edit `<installation directory>/config_demo.py`
<br /><br />
**2. Add** the following entries:  
<br />
```
mobileUseNative = True
mobileConfigURL = '<URL>/rps/mobileConfig'
```
where `<URL>` is the public URL from which your webapp (RPA) is served.
<br /><br />
**3.** Then **restart** the M-Pin Services.  

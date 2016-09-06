---
currentMenu: milagro-mfa-manually-applying-server-secrets
---

# Applying Server Secrets

To install a server to be part of a cluster, it must have the same server secret as the original one.
<br /><br />
You can find the secret on the original server in
```
/<install directory>/credentials.json
```
To apply the server secret from the first instance to a subsequent instance:
<br /><br />
**1.** Copy credentials.json to the installation directory of the subsequent installation.
<br /><br />
**2.** Update the following configuration file:
<br /><br />
```
/<install directory>/config_rps.py
```
Change the following line:

`​# certivoxServerSecret = 'dta' # Default`

to

`certivoxServerSecret = 'credentials.json'`

The servers must have external internet access to work properly.

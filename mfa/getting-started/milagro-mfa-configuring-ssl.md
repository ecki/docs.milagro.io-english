---
currentMenu: milagro-mfa-configuring-ssl
---
<div id="generated-toc" class="generate_from_h2"></div>

##Configuring SSL

This page provides an example whereby you can protect your demonstration installation using SSL by using the popular open source proxy server, nginx, in front of the Milago demo site and related services.

One of the consequences of configuring nginx in this manner is that it will also make your installation visible to other machines on the same network.

These instructions make two assumptions:
<br /><br />
**1.** That no changes have been made to the Milagro configuration files. Therefore we recommend reverting the configuration files back to the copies made in Making the Demo Accessible Externally.</br></br>
**2.** That you already have a default installation of nginx with SSL support enabled and have an SSL certificate and key file available.
<br /><br />
You first need to copy your .crt key files to `/opt/mpin/mpin-4.0/servers/demo`

Now access the demonstration site by visiting the following URL in a browser on another machine on the same network as you M-Pin Server:
```
https://IP ADDRESS
```

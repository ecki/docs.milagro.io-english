---
currentMenu: milagro-mfa-enabling-html5
---
## Enabling the HTML5 mobile authentication

In the HTML page in which the Browser PIN Pad is integrated, the Browser PIN Pad should be configured with the URL for the Mobile App via the `mobileAppFullURL` setting:
```
<script type="text/javascript">
new mpin({
. . .
mobileAppFullURL: "<mobile-app-base-url>/index.html",
. . .
});
</script>
```
<p>By default, the Mobile App will make a request to get its client settings to the following relative URL: /rps/clientSettings. Therefore it is required to serve the Mobile App from the RPA's domain, which will allow the AJAX request for the client settings to reach the Proxy which, in turn, will propagate the request with the rps prefix to the RPS. If this requirement is not met, the Mobile App's default settings should be modified accordingly and the App should be re-built.</p>

<p>The HTML5 mobile app should be served by your web application. To this end, you need to get the source from GitHub and serve the app from its location.</p>

<p> For full instructions follow this <a href="../javascript/milagro-mfa-javascript-guide.html"> link. </a> </p>

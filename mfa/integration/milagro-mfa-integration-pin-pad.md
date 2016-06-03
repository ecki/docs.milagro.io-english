---
currentMenu: milagro-mfa-integration-pin-pad
---

# Integrating the PIN Pad

The PIN Pad should be integrated into the web application (RPA) login HTML page. To do this:

**1.** Include the PIN Pad's main module, mpin.js, by adding a script tag similar to the following, into the HTML head:
	```
	<script type="text/javascript" src="{mpin-path}/mpin.js" />
	```

**2.** Instantiate and Initialize an mpin object. This is done with the following JavaScript code:
	```
	new mpin( <init-options> );
	```

The following is a sample HTML page implementation:​
```
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>M-Pin demo</title>
<link href="/public/css/MIRACL.css?v=ee4d555e38d8c86110e6130f077bc6e2" rel="stylesheet" type="text/css" />
<link href="/public/css/mpin.min.css?v=b7676587a6d88e2818ef2f1a7d1fdae6" rel="stylesheet" type="text/css" />
<!-- Favicons
================================================== -->
<link rel="shortcut icon"
href="/public/images/favicon.ico?v=206feb63bb8d6b052afb1192d57d83a7">
<!-- Fonts
================================================== -->
<link
href='//fonts.googleapis.com/css?family=Roboto:400,400italic,700,700italic' rel='stylesheet' type='text/css'>
<script type="text/javascript"
src="https://mpin.MIRACL.net/v0.3/mpin.js?r=139539313122"></script>
<script type="text/javascript">
new mpin( {
targetElement: "pinHolder", clientSettingsURL:
"http://192.168.10.138:8005/rps/clientSettings",
mobileAppFullURL: "http://192.168.10.138:8005/m/index.html",
successSetupURL: "/successSetup", successLoginURL: "/protected", onSuccessSetup: function(setupData, onSuccess) {
console.log("Setup PIN successful") onSuccess()
},
onSuccessLogin: function(authData) { console.log("Login successful") window.location = "/protected"
},
onVerifySuccess: function(data){
},
identityCheckRegex: "[0-9a-zA-Z]+"
});
</script>
</head>
<body>
<div id="header">
<div class="container">
<a href="http://MIRACL.com" target="_blank"
class="logo1"><img src="/public/images/MIRACL-logo.jpg?v=0517e63d9febecab7894f22262f21d67" alt="MIRACL Logo" width="170" height="33" title="MIRACL Logo" style="border-style:
none"></a>
<a href="http://www.MIRACL.com/m-pin/", target="_blank"
class="logo2"><img alt="M-Pin strong authentication logo" src="/public/images/m-pin-logostrong.png?v=3517e8e85a0030f3f4fad11d0e9448c9" width="152" height="54" title="M-Pin strong authentication logo" style="border-style: none"></a>
</div>
<div class="clear"></div>
</div>
<div id="content">
<div class="container">
<div class="nav">
<ul>
<li><a href="/" class="active">Home</a></li>
<li><a href="http://www.MIRACL.com/mpin/", target="_blank">About M-Pin</a></li>
<li><a href="http://www.MIRACL.com/m-pindownload" target="_blank">Download M-Pin</a></li>
<li><a href="https://MIRACL.org" target="_blank">Community</a></li>
</ul>
<div class="clear"></div>
</div>
<div class="content">
<h1>Welcome to the M-Pin System Demo</h1>
<!--action box start-->
<div class="one column center grey marBot20 marTop20">
<div id="pinHolder" style="margin:auto; width:260px;">
Loading PinPad...
</div>
</div>
<div class="clear"></div>
</div>
<!--action box end-->
<div id="footer">&copy; 2013 MIRACL UK Limited, All Rights
Reserved.</div>
</div>
</div>
</body>
</html>
```
The source should be retrieved from GitHub and served from a location of your choice.

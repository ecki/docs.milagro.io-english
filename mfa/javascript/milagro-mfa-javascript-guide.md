---
currentMenu: milagro-mfa-mobile-sdk-developer-guide
---
<div id="generated-toc" class="generate_from_h2"></div>

# Developer Guide - Milagro MFA JavaScript Client

The Milagro JavaScript Client is the client library for **Milagro MFA**. It is made from two components: the browser client (also called PIN pad) and the HTML5 mobile client.

## PIN Pad

The PIN Pad is a JavaScript software component that should be integrated into the Customer's Application Web Page. The PIN Pad encapsulates all the operations and logic that needs to be performed at the front-end, in order to register and authenticate an end-user.

## HTML5 Mobile client

The Mobile App is a JavaScript application, much similar to the PIN Pad. The Mobile App also carries out the operations needed to register and authenticate an end-user, but the user is authenticated to a browser session, rather than to a session on the mobile device.

## Building the PIN Pad

**1.** NOTE: You might have to update your package distribution system.<br />For Ubuntu you would need to do:<br /><br />`sudo apt-get update`<br /><br />
**2.** Install *Node Package Manager* and *Node*. For instance on Ubuntu you need to do:<br /><br />
`sudo apt-get install npm`<br />
`sudo npm install -g n`<br />
`sudo n 0.10.33`.<br /><br />NOTE that you need *curl* installed to do this.<br /><br />
**3.** Install *grunt* and the required modules<br /><br />
`sudo npm install -g grunt-cli`<br /><br />
**4.** Install *handlebars* and the required modules<br /><br />
`sudo npm install -g handlebars@3.0.1`<br /><br />
**5.** Install *bower* and the required modules<br /><br />
`sudo npm install -g bower`<br /><br />
**6.** Checkout/Clone the repository to `<work-dir>`<br /><br />
**7.** Install the locally required modules for Node<br /><br />
`cd <work-dir>/browser` or `cd <work-dir>/mobile`<br />
`sudo npm install`<br /><br />
**8.** Create `settings.json` file<br /><br />
`cp settings.json_build settings.json`<br /><br />
NOTE Available templates: milagro.<br /><br />
**9.** Build the app<br />
`grunt build`
<br /><br />
The built app should be placed in `<work-dir>/build/out/browser` or `<work-dir>/build/out/mobile`.
<br /><br />
**NOTE** that the `settings.json` file that was created above, should be modified with the correct base URL for the PIN Pad resources and with the desired template. For more details see the bellow documentation.

<p>For further details see the <a href="../getting-started/milagro-mfa-developer-guide.html"> Milagro MFA Developer Guide. </a>

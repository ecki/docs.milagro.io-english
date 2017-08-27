---
currentMenu: milagro-mfa-email-verification
---

#Email Verification

**1.** Stop all the M-Pin services by running the following command in the M-Pin installation directory (default is /opt/mpin):
</br></br>
```
sudo ./mpin stop all
```

You need to edit /opt/mpin/config_demo.py
</br>
Scroll down to the **# Verification emails settings;** section and amend/add the following parameters:

**_forceActivate:_** change this to **False** </br>
**_emailSubject:_** set this to the subject you wish your verification email to have. The default subject is
set as: 'M-Pin demo: New user activation' </br>
**_emailSender:_** set this to the email address that you want the verification email to be sent from </br>
**_smtpServer:_** the name of the SMTP server you are using </br>
**_smtpPort:_** the port of the SMTP server you are using. Default is ***25***</br>
**_smtpUser:_** the username of your SMTP account</br>
**_smtpPassword:_** the password for the above account</br>
**_smtpUseTLS:_** change this to **True** and uncomment it to enable it.</br>

**2.** Now start all the M-Pin services:
```
sudo ./mpin start all
```
**3.** Visit the following URL again:

```
http://IP ADDRESS:8005
```

Your identity already exists in the browser, so the PIN pad will immediately ask you for your PIN to login.</br></br>
However, as we now want to show email verification working, instead of entering your PIN, take the following steps:

- Click the menu icon at the top-right of the PIN pad to display the identity management screen.
- Click the pencil icon next to your identity, then **Remove identity**
- Confirm it by clicking **Yes, Remove it.**
- You will then see the screen which prompts you to create a new identity.
- Enter your email address, then **Setup M-Pin**
- You should get an email with an activation link. Click that activation link in your email to confirm your identity.
- Click **Confirm and activate** to activate your identity.
- Once you have activated it, close this screen and go back to your Identity page and click **I confirmed my email**.
- The next screen with your new email address indicates that it has been verified.

**4.** Now just set up your pin and knock yourselves out!

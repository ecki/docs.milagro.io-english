---
currentMenu: milagro-mfa-integration-username-pin
---

# Integrating Milagro MFA in a web app

This page describes how to create a simple username and password Relying Party Application (RPA) website using Python and then shows you how to convert this application to use Milagro MFA aunthentication.

## Pre-requisites

This example was built using Ubuntu 14 but should work similarly on any modern Linux or Mac OS X machine with Python 2.7. However, there are some pre-requisites that you need to install:

PIP (Python Package Installer):
```
sudo apt-get install python-pip
```
Python modules "flask" & "requests":
```
sudo pip install flask requests
```
CURL:
```
sudo apt-get install curl
```
## Installing Milagro Server

If you have not already installed the server, see the [developer guide](../getting-started/milagro-mfa-developer-guide.html)

## Building the Username and Password Application

Create a file named rpa.py

In this file define the Python environment, import the modules we need to build the application and create an instance of the Flask class:
```
#! /usr/bin/env python

# import required modules including the Flask web app framework

from flask import Flask, request, redirect, render_template, jsonify, make_response
from flask import send_from_directory
import json
import requests

# create Flask application

app = Flask(__name__)
```

Note that some of the modules loaded above are not required by the username and password site but will be required when we convert to Milagro MFA Authentication, so we will load them all now.

Next we create an endpoint for the root of the application that points to index.html (which we will create later):

```
#add root endpoint for index.html

@app.route("/")

#define index function

def index():
    return render_template("index.html")
```

Next we create an endpoint for the login page from which we can read the submitted username and password and call a function (see later) to validate them.  If they are valid, the user is redirected to the protected page and a simple cookie is set containing the username.  If the username and password combination is not valid, then the login page is displayed again with an error message:

```
# add login page endpoint for loginform.html

@app.route("/login", methods=["GET", "POST"])

#define login function

def login():
    if request.method == "POST":

#set username and password from POST request:

        username = request.form["username"]
        password = request.form["password"]
        if validateUsername(username, password): #see below for validate function

#if the username and password are valid, set a simple cookie and redirect to the protected page

            resp = make_response(redirect("/protected"))
            resp.set_cookie("username", username)
            return resp
        else:

#if the username and password are not valid, return error message and return to login form

            return render_template("loginform.html", message="INVALID USERNAME OR PASSWORD")

#if GET request, simply return the login form

    else:
        return render_template("loginform.html")
```

Now we create an endpoint for the protected page (protected.html).  If no cookie is present, the user is redirected back to the root page (index.html).

If there is a cookie present, the protected page is displayed (protected.html).

We set username to the username in the cookie which protected.html displays.

```
# add "protected" end point

@app.route("/protected")
def protected():
    loggeduser = request.cookies.get("username")

# if no cookies, then redirect to the index page

    if not loggeduser:
        return redirect("/")

# if there is a cookie, then redirect to the protected page

    else:
        return render_template("protected.html", username=loggeduser)
```

The final endpoint we create is for the logout link on the protected page.  This deletes the cookie and redirects the user back to the root page:
```
# add "logout" endpoint - deletes cookie and redirects to the home page

@app.route("/logout")
def logout():
                resp = make_response(redirect("/"))
                resp.delete_cookie("username")
                return resp
```

We now create a function to verify the entered username and password.   Note that in reality, this function would likely lookup the user and (hashed) password in a database or LDAP directory, but for the sake of simplicity, we simply hard code the acceptable usernames and password into the Python code.

```
# simple validate user function
def validateUsername(username, password):

                return username == "john" and password == "123"
```

Finally we run the application defining the IP address and port we want the application to run on, and set the debug mode.

```
# run the app on localhost port 8005

app.run(host="0.0.0.0", port=8005, debug=True)
```

## Building the Username & Password Web Pages

Here we create the three web pages referenced by the RPA.  Note that these should be saved into the /templates subfolder of the directory that the RPA Python app is saved to.

### Index page (index.html)

First we create a simple index.html page that tells the user that they are not logged in and gives them a link to the login page:

```
<!DOCTYPE HTML>
<html>
    <head>
    </head>
    <body>
        <h1>Hello. You are not logged in</h1>
        <p>You need to <a href="/login">login</a></p>
    </body>
</html>
```

### Login Page (loginform.html)

Next we create the login page with a placeholder for error messages and a form to allow the user to enter their username and password:
```
<!DOCTYPE HTML>
<html>
<body>
            <p style="color:red">{{ message }}</p>
            <form method="POST">
                <label>Username: </label><input type="text" name="username" /><br/>
                <label>Password: </label><input type="password" name="password" /><br/>
                <input type="submit" name="submit" />
            </form>
</body>
</html>
```

### Protected Page (protected.html)

Finally we create the protected page that tells the user that they are logged in and provides a logout link:
```
<!DOCTYPE HTML>
<html>
<body>
    <h1 style="color:green">You are logged in as {{ username }}</h1>
    <a href="/logout">Logout</a>
</body>
</html>
```

### Running the Username & Password RPA

We can start the RPA from the directory into which it has been saved by making rpa.py executable and running it as follows:
```
chmod +x rpa.py
```
```
./rpa.py
```
Next open a browser on the same machine and visit the following address:
```
http://0.0.0.0:8005
```
You should see the following page:
</br></br>
![image1](https://trecugggine.files.wordpress.com/2016/05/2015_01_05_17_15_181.png)

Clicking "Login" takes you to the login form where you can enter the username and password hardcoded above:
</br></br>
![image2](https://trecugggine.files.wordpress.com/2016/05/2015_01_05_17_17_122.png)

If you enter an incorrect username or password, an error message is displayed:
</br></br>
![image3](https://trecugggine.files.wordpress.com/2016/05/2015_01_05_17_18_073.png)

If the username and password are valid, you will be redirected to the protected page and your username will be displayed:

![image4](https://trecugggine.files.wordpress.com/2016/05/2015_01_05_17_19_064.png)


## Converting the RPA to use M-Pin

Now we have a fully working username and password RPA, we can convert it to use Milagro MFA instead.

### New Login Page (loginform.html)

First we need to edit loginform.html and add a reference in the header of the login page to the Javascript that runs the PIN pad.

Note: In this case we are using an instance hosted by MIRACL.com but you can build the Milagro MFA JavaScript Client. For directions, see the [developer guide](../javascript/milagro-mfa-javascript-guide.html).

We initialize the PIN pad by setting the targetElement (where it should be displayed), clientSettingURL (the URL on the M-Pin server that it will get the parameters it needs to run from), mobileAppFullURL (location of the mobile application) & successLoginURL (the URL to redirect the user to upon successful authentication):

```
<script type="text/javascript" src="https://mpin.miracl.com/v4/mpin.js"></script>
 <script>
 new mpin({
     targetElement: "pinHolder",
     clientSettingsURL: "http://127.0.0.1:8011/rps/clientSettings",
     mobileAppFullURL: "http://127.0.0.1:8005/m",
     successLoginURL: "/protected"
 })
</script>
```

Next we can remove the code for the username and password form and replace it with a div tag to hold the PIN pad:

```
<div id="pinHolder" style="width:260px;">
                Loading PinPad...
            </div>
```

### Milagro MFA Enabled RPA

Now we can update the Python RPA (rpa.py) by inserting the following code snippets before the validate user function. First we add an endpoint to verify that the user is authorized to register with Milagro MFA. We extract the userID from the request and display it at the console. Finally we return “forceActivate” to allow the user to create their PIN immediately. (In a production deployment, you would typically lookup the userID in your own directory to check that they are authorised in which case the user would be sent an email with a verification link allowing them to prove that they are who they claim to be).
```
# add verify endpoint

@app.route("/mpinVerify", methods=["POST"])

def mpinVerify():

# get data from POST request

data = json.loads(request.stream.read())

# get username from data

print "User trying to register: ", data["userId"]

# verification process would go here - e.g. send email

# forceActivate allows the user to create their PIN immediately

return jsonify({"forceActivate": True})
```

Next we add the authentication endpoint:
```
# add authenticate end point

@app.route("/mpinAuthenticate", methods=["POST"])

def mpinAuthenticate():
```

Then we read the data from the POST request to this endpoint:
```
#read data from POST request

data = json.loads(request.stream.read())
```

When a user authenticates with the server, a one-time-token (authOTT) is generated and returned to the PIN pad.  The same token is also sent to the Milagro MFA Relying Party Service (RPS) along with the result of the authentication attempt.  We therefore need to extract the authOTT from the request:
```
#extract auth one time token from PIN pad

authOTT = data["mpinResponse"]["authOTT"]
```

Next we send the authOTT to the RPS to get the result of the authentication attempt:
```
#check auth one time token with the RPS

rpsurl = "http://127.0.0.1:8011/authenticate"

reqData = {

"authOTT": authOTT

}
```

Then we get the result back from the RPS and extract the result of the authentication attempt along with the username:
```
#get result from RPS

result = requests.post(rpsurl, data=json.dumps(reqData), headers={"content-type": "application/json"})

#extract data from result

rpsData = json.loads(result.text)

#extract username and authentication status

userId = rpsData.get("userId")

status = rpsData.get("status")
```

We then print the name of the user attempting to authenticate to the console:
```
# print username of user trying to authenticate

print "User tries to authenticate: ", userId
```

Then we check whether the authentication attempt was successful and if so, set the cookie as before and redirect the user to the protected page:
```
#display message and set cookie if authentication successful

if status == 200:

print "Successfull authentication for ", userId

resp = make_response("")

resp.set_cookie("username", userId)

return resp, 200
```

If the authentication attempt is unsuccessful, we print an error message:
```
#display error if authentication attempt unsuccessful

else:

print "Authentication failed: ", rpsData.get("message")

resp = make_response("")

return resp, status
```

The server installation includes the static files for the mobile site.  These files must be hosted somewhere, so in this demonstration we will host them as part of the RPA.  Therefore we need to create an endpoint for these files:
```
#create end point for mobile app

@app.route('/m')

def serveMobileIndex():

return redirect("/m/index.html")

@app.route('/m/&lt;path:filename&gt;')

def serveMobile(filename):

return send_from_directory('/opt/mpin/mobile/', filename)
```

Finally we need to create an endpoint for the client settings which the PIN pad needs to access when it is initialized:
```
#create end point for PIN pad client settings

@app.route('/rps/clientSettings')

def serveRPSSettings():

return requests.get("http://127.0.0.1:8011/rps/clientSettings").text
```

## Running the Milagro-Enabled RPA

When you save changes to rpa.py it will automatically restart itself so there is no need to do this yourself.  Visit the same URL on which the RPA is running and you will see the same root page:

<img class="alignnone size-full wp-image-25759563" src="https://trecugggine.files.wordpress.com/2016/05/2015_01_06_10_26_551.png" alt="2015_01_06_10_26_551" width="709" height="227" />

Now, clicking "login" displays the M-Pin PIN pad instead of the username and password form:

<img class="alignnone size-full wp-image-25759566" src="https://trecugggine.files.wordpress.com/2016/05/2015_01_06_10_28_222.png" alt="2015_01_06_10_28_222" width="709" height="569" />

&nbsp;

Select "Sign in from here":

<img class="alignnone size-full wp-image-25759570" src="https://trecugggine.files.wordpress.com/2016/05/2015_01_06_10_29_4731.png" alt="2015_01_06_10_29_4731" width="709" height="569" />

&nbsp;

Enter your email address and click "Setup M-Pin":

<img class="alignnone size-full wp-image-25759573" src="https://trecugggine.files.wordpress.com/2016/05/2015_01_06_10_30_424.png" alt="2015_01_06_10_30_424" width="709" height="569" />

&nbsp;

Enter a 4-digit PIN and click "Setup":

<img class="alignnone size-full wp-image-25759578" src="https://trecugggine.files.wordpress.com/2016/05/2015_01_06_10_31_1451.png" alt="2015_01_06_10_31_1451" width="709" height="569" />

&nbsp;

Click "Sign in now":

<img class="alignnone size-full wp-image-25759581" src="https://trecugggine.files.wordpress.com/2016/05/2015_01_06_10_31_536.png" alt="2015_01_06_10_31_536" width="709" height="569" />

&nbsp;

Enter your PIN and click "Login".  You will now see the same protected page as before:

<img class="alignnone size-full wp-image-25759584" src="https://trecugggine.files.wordpress.com/2016/05/2015_01_06_10_32_357.png" alt="2015_01_06_10_32_357" width="709" height="262" />

&nbsp;

&nbsp;

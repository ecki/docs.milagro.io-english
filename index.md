---
currentMenu: home
---
<div id="generated-toc" class="generate_from_h2"></div>

# Trust in the Internet is at an all time low.
## It's time for action.

From its earliest days, one of the building blocks of trust and security on the Internet was cryptography. Unfortunately with the technology then available, the only solution to secure web services was the highly centralised concept called PKI, i.e., Public Key Infrastructure.

Put simply, Public Key Infrastructure is a technology in which __trusted authorities__ authoritatively bind public keys to real world identities by issuing digitally signed __certificates__ in the name of the verified real world identity.  

As an example, a web server under the control of Google would have a digital certificate stating the web server's identity is __google.com__. The web browser uses the public key of the entity that digitally signed and issued the certificate to verify that the certificate is valid. These public keys used the verify the signature are embedded in operating systems and browsers from Google, Microsoft, Firefox and others.  

If the signature is valid, the the web browser can "trust" that the server belongs to Google because the certificate says its so.  By trusting the web server, the web browser is enabled to create a cryptographically secure connection to the web server. In this way, digital certificates enable on-line shopping and the secure use of the cloud by providing a key ingredient in creating secure communication protocols such as SSL / TLS and virtual private networks (VPN). By encrypting the connection between web server and browser, data traveling between browser and web server, such as credit cards and personal information, is secured from theft and compromise.

The entity that issues digital certificates is called a __Certificate Authority__ (or "CA"). The CA's private key that is used to sign these digital certificates is called a CA __root key__.  The more browsers and operating systems 'trust' the signature of the CA's root key, the more valuable a CA becomes.

As a result, this has led to a distortion in the commercial certificate market, where, as of a few months ago, 95% of all commercial certificates were issued from five certificate authorities, all located in the United States (along with their root keys).  To many, this disproportionate amount of centralised responsibility and power does not fit comfortably with the original ethos of the Internet.

If the Certificate Authority's root key is revealed or compromised, the whole edifice unravels, and all certificates issued by the Certificate Authority must be revoked. The topic of the commercial certificate authority market's woes has been extensively covered, suffice to say that we are seeing Internet scale commercial and security issues that are directly attributable to the limitations of PKI's fundamental architecture, which is now over thirty years old.

In an attempt to "patch" PKI, many projects and initiatives have surfaced to minimise the commercial CA cartel's risk of choking off Internet growth or creating an Internet security "black swan" event. On the commercial side of the spectrum, the excellent [Let's Encrypt](https://letsencrypt.org/) is breaking the stranglehold of the commercial certificate market cartel with a free, automated certificate authority.

On the ecosystem side, [Google's Certificate Transparency Project](https://www.certificate-transparency.org/), seeks to catch out rouge certificate authorities who issue illegitimately obtained but legitimate acting certificates.  A relatively new process that seeks to patch the broken certificate revocation processes PKI is known for, called OCSP stapling, was also introduced recently.  Both initiatives have been met with criticism from various corners because they introduce their own security risks or don't (can't) fix the fundamental limitations of PKI's centralised architecture.

These initiatives all provide ample evidence that PKI's problems are mounting under the increasing load of a growing, distributed Internet.

If PKI has problems now, what happens in 2020, when 25 billion more devices are projected to be connected the Internet?

## Enter the Internet of Things

By even the smallest industry analysts calculations, the next phase of the Internet growth, driven by Internet of Things deployments and the move to app-centric (vs. browser) software as a service delivery models, will result in growth rates that will dwarf current dwarf rates.

This next phase of the Internet's evolution demands a new approach to security. As the architecture of these deployments is fundamentally different to the current __n__ web browser to __n__ web servers architecture, we have a unique opportunity to upgrade the cryptographic systems and trust models used in these deployments.

Consider the following: End Users operating their desktop browsers have been educated by the commercial Certificate Authority industry to "look for the green padlock" when connecting to web applications across the Internet, from Facebook to online banking and shopping sites. Green text and / or green locks indicate a secure SSL / TLS connection from the web browser to the web server.

You, the reader, have no doubt done this yourself (hopefully).

Now answer this question:

When was the last time you checked for green text or a green lock when using your favourite app on your mobile device?

The answer is, most likely, you never have.

This isn't an accusation that you, dear reader, are not concerned about the security of the app you are using. It's just evidence that PKI doesn't provide the same level of utility in a n'browser to n'server context vs. an app or IoT deployment context.

Below is a simple graphic to show the difference.

SHOW GRAPHIC

## A Different Approach





Consider the deployment scenario for a mobile app with millions of users or an Internet scale smart meter rollout.

Apache Milagro (incubating) seeks to provide a positive alternative to PKI infrastructure where certificates

Because the trust issue was not dealt with properly from the start, the Internet faces an uncertain future. Currently trust in the Internet is at an all time low. An Internet of Things will be a disaster unless we fix this. Part of the problem was the lack of vision to see that these shortcomings were not inevitable.


$$y^2=x^3+Ax+B$$

where $A=0$ or $A=-3$. Edwards curves are supported using both regular
and twisted Edwards format:-

$$Ax^2+y^2=1+Bx^2y^2$$

where $A=1$ or $A=-1$. Montgomery curves are represented as:-

$$y^2=x^3+Ax^2+x$$

where $A$ must be small.

## Announcement List

Have we made progress on Grav? Because I am getting a lot of CousCous.

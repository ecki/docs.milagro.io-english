---
currentMenu: home
---
<div id="generated-toc" class="generate_from_h2"></div>

# Trust in the Internet is at an all time low.
## It's time for something new.

NOTE: Skip this section and proceed to the next section if you are familiar with the concepts behind 

From its earliest days, one of the building blocks of trust and security on the Internet was cryptography. Unfortunately with the technology then available, the only solution to secure web services was the highly centralised concept called PKI, i.e., Public Key Infrastructure.

Public Key Infrastructure is a technology in which __trusted authorities__ authoritatively bind public keys to real world identities by issuing digitally signed __certificates__ in the name of the verified real-world identity.  

As an example, a web server under the control of Google would have a digital certificate stating the web server's identity is __google.com__. The web browser uses the public key of the entity that digitally signed and issued the certificate to verify that the certificate is valid. These public keys used the verify the signature become embedded in operating systems and browsers from Google, Microsoft, Firefox and others.  

If the signature is valid, the web browser can "trust" that the server belongs to Google because the certificate says it's so.  By trusting the web server, the web browser is enabled to create a cryptographically secure connection to the web server. In this way, digital certificates allow on-line shopping and the safe use of the cloud by providing an essential ingredient in creating secure communication protocols such as SSL / TLS and virtual private networks (VPN). By encrypting the connection between web server and browser, data travelling between browser and web server, such as credit cards and personal information, is secured from theft and compromise.

The entity that issues digital certificates is called a __Certificate Authority__ (or "CA"). The CA's private key that is used to sign these digital certificates is known as a CA __root key__.  The more browsers and operating systems 'trust' the signature of the CA's root key, the more valuable a CA becomes.

As a result, this has led to a distortion in the commercial certificate market, where, as of a few months ago, 95% of all certificates issued by commercial providers were issued from five certificate authorities, all located in the United States (along with their root keys) (SHOW REFERENCES).  To many, this disproportionate amount of centralised responsibility and power does not fit comfortably with the original ethos of the Internet.

If the Certificate Authority's root key is revealed or compromised, the whole edifice unravels, and all certificates issued by the Certificate Authority are, theoretically, revoked.(SHOW DIGINOTAR REFERENCE) The topic of the commercial certificate authority market's woes is extensively covered online, suffice to say Internet scale business and security issues that are directly attributable to the limitations of PKI's fundamental architecture, which is now over thirty years old, are apparent.(SHOW REFERENCES)

In an attempt to "patch" PKI, many projects and initiatives have surfaced to minimise the commercial CA cartel's risk of choking off Internet growth or creating an Internet security "black swan" event. On the business side of the spectrum, the excellent [Let's Encrypt](https://letsencrypt.org/) is breaking the stranglehold of the commercial certificate market cartel with a free, automated certificate authority.

On the ecosystem side, the valiant [Google's Certificate Transparency Project](https://www.certificate-transparency.org/), seeks to catch out certificate authorities who issue illegitimately obtained but legitimate acting certificates.  A relatively new process that aims to patch the broken certificate revocation processes PKI is known for, called OCSP stapling, was also introduced recently.  Both initiatives have attracted criticism from various corners because they add security risks or don't (can't) fix the fundamental limitations of PKI's centralised architecture. (SHOW REFERENCES)

These initiatives all provide ample evidence that PKI's problems are mounting under the increasing load of a growing, distributed Internet.

If PKI has problems now, what happens in 2020, when 25 billion more devices are projected to be connected the Internet? (SHOW REFERENCE)

## Enter the Internet of Things

By even the smallest industry analysts calculations, the next phase of the Internet growth, driven by Internet of Things deployments and the move to app-centric (vs. browser) software as a service delivery models, will result in Internet adoption growth rates that will dwarf current rates.

This next phase of the Internet's evolution demands a new approach to security.  The architecture of these deployments is fundamentally different to the current n'web browser to n'web servers architecture, we have a unique opportunity to upgrade the cryptographic systems and trust models used in these deployments.

Consider the following: End Users operating their desktop browsers have been educated by the commercial Certificate Authority industry to "look for the green padlock" when connecting to web applications across the Internet, from Facebook to online banking and shopping sites. Green text and or green locks indicate a secure SSL / TLS connection from the web browser to the web server.

You, the reader, have no doubt done this yourself (hopefully).

Now answer this question:

When was the last time you checked for green text or a green lock when using your favourite app on your mobile device?

The answer is, most likely, you never have.

The answer is not an accusation that app users are not concerned about the security of the app they use. It's just evidence that PKI doesn't provide the same level of utility in a n'browser to n'server context vs. an app or IoT deployment context.

Below is a simple graphic to show the difference.

SHOW GRAPHIC

As you can see, the n'browser to n'server context contains a requirement that web servers MUST provide a universal method of authenticating themselves to the hundreds of millions of different browsers that connect to them.  While not without issues, PKI is a suitable fit for this context, and its success is evident by the overwhelming adoption and rapid growth of Let's Encrypt.(SHOW REFERENCE)

##

In decades past, it was envisioned that PKI could also provide security for client or end user authentication, where billions of client or end user certificates get issued to the citizens of the Internet. It is evident this has not come to pass, as PKIs architectural issues were too significant to overcome.

On the web and in the browser, authentication methods such as passwords and two-factor authentication (if security is a concern) are run over PKI-enabled secure channels such as SSL / TLS. If these secure channels between web server and browser didn't exist, password and one-time password authentication could not be deployed in a secure manner, since the password or one-time password would be unsecured in transit between the web browser and web server.

One could make the connection between the failure of PKI and commercial certificate authorities to fulfil the promise of easy and wide-spread client certificate deployment, which would have enabled strong mutual authentication between an end user and web application, to the explosion of industrial scale username and password smash' n grab attacks.

It is easy to envision the world where passwords would not be the dominant authentication technique used on the Internet today if PKI scaled to every browser and end user on the Internet. Passwords would not be needed.

In an IoT or app-centric context, we have a fundamentally different set of issues because of an obvious truism; apps or IoT devices are not browsing from web server on domain A to web server on domain B.

In general, apps or IoT devices are purpose-built to connect to ONE SPECIFIC DOMAIN.

SHOW GRAPHIC

It is evident from the graphic above that IoT and app-centric deployments will require fundamentally different authentication and security paradigm.

In an app-centric or IoT device Internet scale deployment where millions of clients connect to clouds hosting an array of micro services on one particular domain, the pressing challenge is a mutual client to server authentication, and server to client authentication, where millions of clients are programmed to connect securely to a static domain.  

Ideally, this same authentication process would be a step or building block in cryptographic protocols to enable SSL / TLS, digital signatures, and be applicable in forward-looking initiatives such as blockchain technologies.

PKI can't fulfil this requirement because its fundamental architecture is incompatible with capabilities required. The evidence is already there:

PKI has never achieved Internet scale certificate deployments for end users, which would equate to millions or billions of client certificates, despite being commercially available for over twenty-five years.

There is no initiative or technical development currently under development in the PKI ecosystem that can fix its legion of issues to make it suitable for these deployment scenarios.

It's time for action. It's time for something new.

## REFERENCES

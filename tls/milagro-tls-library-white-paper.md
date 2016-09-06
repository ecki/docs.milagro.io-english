---
currentMenu: milagro-tls-library-white-paper
---

<div id="generated-toc" class="generate_from_h2"></div>

# White Paper - Milagro TLS Library

**Milagro TLS: pairing-based cryptography for Transport Layer Security**

*Alessandro Budroni, Kealan McCusker*<br />
<a href="http://www.miracl.com/miracl-crypto-labs">MIRACL Labs</a>

*Abstract* – This document introduces two key exchange algorithms based on
Pairing-Based Cryptography (PBC) for the Transport Layer Security
(TLS) protocol. In particular, it specifies the use of two identity-
based key exchange algorithm in TLS handshake.

## Introduction

Pairing-Based Crypto (PBC) is emerging as a  solution to complex
problems that proved intractable to the standard mathematics of
Public-Key Cryptography such as Identity-Based Encryption, whereby
the identity of a client can be used as their public key <a href="#11">11</a>.

Milagro TLS proposes the use of PBC for mutually authenticated key
agreement. There are two new  key exchange algorithms in this draft;
P2P and Client-Server. The P2P solution uses the Chow-Choo protocol
and Client-Server uses the MPIN Protocol <a href="#9">9</a><a href="#10">10</a>.

The mbed TLS library has been extended to incorporate the new key-
exchange algorithms <a href="#14">14</a>

Milagro TLS uses a curve that has security at the AES-128 level.

This document describes an addition to TLS 1.2 <a href="#1">1</a> to support PBC. In
particular, it defines:
<ul>
<li>Milagro_CS: a key-exchange algorithm based on MPIN-FULL protocol <a href="#9">9</a>.
This is a Client-to-Server protocol that allows mutually authenticated key agreement.
In this protocol the client secrets are in G1 and the server secret is in G2.  
For a Type-3 pairing there is assumed to be no computable isomorphism between these
groups, even though both are of the same order.</li>

<li>Milagro_P2P: a key-exchange algorithm based on Chow-Choo protocol <a href="#10">10</a>.
It can operate in P2P or client/server mode. User of this protocol are issued sender
keys in G1 and receiver keys in G2. The server that sends the ServerKeyExchange is
considered the sender in  this protocol.</li>
</ul>

## Requirements Notation

The keywords "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT",
"SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this
document are to be interpreted as described in <a href="#2">2</a>.
</br></br>
### Definitions

Digital Identity: Digital Identity is the data that uniquely
describes a person or a thing, and typically contains some
information about that entity's relationships.
</br></br>
### Abbreviations

**ECC** Elliptic Curve Cryptography

**PBC** Pairing-Based Cryptography

**AES** Advanced Encryption Standard

**TA** Trusted Authority

**Peer-to-Peer**  P2P

**Milagro_CS** Milagro Client-to-Server

**Milagro_P2P** Milagro Peer-to-Peer

**E** is an ordinary pairing-friendly elliptic curve over a finite field
**F**, defined by a fixed prime modulus p.

**e:** G1 X G2 -> GT is a computable bi-linear map on E. G1 is defined as
a group of points on E. G2 is defined as a group of points on a twist
of E. Both groups are of prime order q. GT is a finite extension
field of F, also of order q.
</br></br>
### Conventions

**IdC:** Digital identity of the client

**IdS:** Digital identity of the server

**H1:** Maps string value to a point on the curve in G1.

**H2:** Maps string value to a point on the curve in G_2

**Hq:** Hashes inputs to an integer modulo the curve order q.

**Hg:** Generate AES key

**SHA-256:** Perform the SHA256 function.

## Key Exchange Algorithms

### MILAGRO_CS

Here we briefly resume the main steps of the MPIN-FULL key-exchange
algorithm, see <a href="#8">8</a> and <a href="#9">9</a> for details.

The TA provides the client key s.A, in G1 and the server key s.Q, in
G2.

MPIN Full was envisaged as a two factor authentication solution but
in this context, as this is a machine to machine protocol, there is
no requirement for a second factor and therefore the PIN is set to
zero in the code.

The ClientHello message MUST have an extension which contains three
public parameters:
<ul>
<li>IdC, the identity of the client. This can be the identity in clear
or the hash of identity. In the latter case  the IdC is encrypted
after the session key is established and sent to the server to
complete client authentication.</li>

<li>U = x.(H1(IdC))and x is a random number modulo the curve order.
When time permits are used then this value is set to
U = x.(H1(IdC)+H1(d|SHA-256(IdC))), where d is the Epoch days</li>

<li>t, the epoch time at which authentication occurred.</li>

<li>V = -(x+y)(s.A), where y = Hq(t|U) and A =H1(IdC).
When time permits are enabled then it must be added to s.A prior to
multiplication.</li>
</ul>

The server itself calculates A by applying the same hash function H1
to the claimed digital identity i.e. H1(IdA) or H1(IdA) + H1(d,SHA-
256(IdA) in the case of time permits being used. Then the Server MUST
check that e(V,Q).e(U+yA,s.Q) = 1. If this tests fails then the
connection is terminated by the server with a proper alert message
and the attempted Client connection is rejected.

Through the ServerKeyExchange message, the server send a  ECDH public
key W=w.A, where w is a random number modulo the curve order and A is
H1(IdA) or H1(IdA) + H1(d,SHA-256(IdA) if time permits used.

Through the ClientKeyExchange message, the client send its ECDH
public key R=r.A, where r is a random number modulo the curve order.

At this point, both the client and the server are able to compute a
16-bytes shared premaster secret:
<ul>
<li>The client first computes the parameter h = Hq(A,U,y,V,R,W), then
computes the premaster secret as K = Hg(e(s.A,Q)^(r+h)|x.W).</li>

<li>The server first computes the parameter h = Hq(A,U,y,V,R,W), then
computes the premaster secret as K = Hg(e(R+h.A,s.Q)|w.U).</li>
</ul>
See <a href="#9">9</a> for more details.
</br></br>
### MILAGRO_P2P

Here we briefly resume the main steps of the Chow-Choo key-exchange
Algorithm <a href="#10">10</a>.

Choo-Chow key-exchange algorithm is designed for communications peer-
to-peer. The TA provides the server with a sender key in G1 i.e.
SKeyG1 and client with receiver key in G2 I.e. CKeyG2 based on their
respective identities.

The main steps of the algorithm are:
<ul>
<li>The server computes a random integer x modulo the curve order,
computes a point on the group G1 as PsG1 = x.H1(IdS) which is its
public parameter and sends the pair (IdS,PsG1) to the client.</li>

<li>The client receives the pair of parameter from the server, computes
two random integers Y and W modulo the curve order, compute the
following; PcG2 = Y.H2(IdC), PgG1 = W.H1(IdS), pic =
Hq(PcG2||PsG1||PgG1||IdS), pis = Hq(PsG1||PcG2||PgG1||IdC) and the
value k = e(pis.H(IdS)+PsG1,(y+pic).CKeyG2).</li>

<li>client computes the premaster secret as K = Hg(k,w.PsG1).</li>

<li>client sends the triple (IdC,PsG1,PgG1) to server.</li>

<li>server receives the parameters from the client and computes the following
pis = Hq(PsG1||PcG2||PgG1), pic = Hq(PcG2||PsG1||PgG1) and the
value k = e((x+pis).SKeyG1,pic.B+PcG2).</li>

<li>server computes the premaster secret as K = Hg(k,x.PsG1).</li>
</ul>

## Data Structures and Computations

This document introduces two new Pairing-Based key exchange
algorithms for TLS.  All of them use PBC to compute the TLS premaster
secret. The derivation of the TLS master secret from the premaster
secret and the subsequent generation of bulk encryption/MAC keys and
initialization vectors is independent of the key exchange algorithm
and not impacted by the introduction of PBC and ECC.


	enum {  
		Milagro_CS,
 		Milagro_P2P,
	} KeyExchangeAlgorithm;


The first key-exchange algorithm is Milagro_CS and it is designed for
client-to-server communications. It is based on the MPIN-FULL key
exchange protocol <a href="#9">9</a>, which is an extension of the M-Pin
Authentication Protocol <a href="#8">8</a>.

The second key-exchange algorithm is Milagro_P2P and it is designed
for peer-to-peer communications. It is based on the CHOW-CHOO
protocol <a href="#10">10</a>.


Here we summarize the steps of TLS-Handshake used by those two key-
exchange algorithms.

    Client                      Server
    ------                      ------

    ClientHello                 --------->
                                                ServerHello
                                                ServerKeyExchange
                                <---------      ServerHelloDone
    ClientKeyExchange
    [ChangeCipherSpec]
    Finished                    --------->
                                                [ChangeCipherSpec]
                                <---------      Finished

    Application Data            <-------->      Application Data


The following messages of TLS-Handshake MUST NOT be sent for those
two key-exchange algorithms: (Server)Certificate, CertificateRequest,
(Client)Certificate and CertificateVerify.
</br></br>
### ClientHello Extension

This section specifies a TLS extension that can be included with the
ClientHello message as described in <a href="#3">3</a>, the Milagro_CS Extension.

When this extension are sent:

The extension MUST be sent along with any ClientHello message that
proposes Milagro_CS key-exchange algorithms and it MUST NOT be sent
with any other ClientHello message that doesn't proposes this
cipher.


Meaning of this extension:

This extension allow the Client to authenticate itself with the
Server and to exchange part of the parameters that will be used to
compute the premaster secret.


Structure of these extensions:

Two octets are used to indicate the extension type. In the case of the Milagro_CS extension
these are 0x0025. The general structure of TLS extensions is described in <a href="#3">3</a>, and
this specification adds a new type to ExtensionType.

    enum { Milagro_CS_ext } ExtensionType;

    struct {
            uint16 length_hash_IdC,
            uint16 length_U,
            uint16 length_V,
            opaque hash_IdC[length_hash_IdC],
            opaque U[length_U],
            opaque V[length_V],
            uint32 time_value,
            (255)
    } Milagro_CS_ext;

**length_hash_IdC, length_U, length_V:** length of the parameters.</br>
**hash_IdC:** hash of the client's identity.</br>
**U:** first parameter sent by the client.</br>
**V:** second parameter sent by the client.</br>
**time_value:** current epoch time in seconds.</br>


Actions of the Server:

If Milagro_CS is between the key-exchange algorithms available of
the server, then he MUST check if the time_value received from the
client differs too much from the current time. If the difference is
more than a fixed value then he has to refuse the client. If this
check has a successful ending it is  RECOMMENDED, regardless of the
chosen cipher suite, that he tries to authenticate the Client as
explained in 3.1, and, in case of failing, he has to refuse the
client.

See <a href="#8">8</a> for details about the authentication.
</br></br>
### Server Key Exchange

This document introduces two new ServerKeyExchange messages, one for
each key-exchange algorithm.

If the cipher suite chosen by the server has Milagro_CS as key-
exchange algorithm, then the server MUST compute the parameter W, as
explained in 3.1 and send it.


If the cipher suite chosen by the server has Milagro_P2P as key-
exchange algorithm, then the server MUST compute the the public
parameter PaG1 as explained in 3.2 and send it with its digital
identity IdS.

The ServerKeyExchange message is extended as follows.


    select (KeyExchangeAlgorithm) {
      case Milagro_CS:
           uint16         length_W;
           opaque         W[length_W];
      case Milagro_P2P:
           uint16         length_IdS;
           uint16         length_PsG1;
           opaque         IdS[length_IdS];
           opaque         PsG1[length_PsG1];
    } ServerKeyExchange;


### Client Key Exchange


If the cipher suite chosen by the server has Milagro_CS as key-
exchange algorithm, then the client MUST compute the parameter R, as
explained in 3.1 and send it.


If the cipher suite chosen by the server has Milagro_P2P as key-
exchange algorithm, then the client MUST compute the parameters PgG1
and PbG2 as explained in 3.2 and send them with its digital identity
IdC.


The ClientKeyExchange message is extended as follows.


    select (KeyExchangeAlgorithm) {
      case Milagro_CS:
           uint16 length_R;
           opaque R[length_R];
      case Milagro_P2P:
           uint16 length_IdC;
           uint16 length_PgG1;
           uint16 length_PcG2;
           opaque IdC[length_IdC];
           opaque PgG1[length_PgG1];
           opaque PcG2[length_PcG2];
    } ClientKeyExchange;


## Cipher Suites

The following defines new cipher suites that use the key exchange
algorithms specified in Section 3.

- CipherSuite TLS_MILAGRO_CS_WITH_AES_128_GCM_SHA256       = {0xC0,0xB1}
- CipherSuite TLS_MILAGRO_CS_WITH_AES_128_GCM_SHA512       = {0xC0,0xB2}
- CipherSuite TLS_MILAGRO_CS_WITH_CAMELLIA_128_GCM_SHA256  = {0xC0,0xB3}
- CipherSuite TLS_MILAGRO_CS_WITH_CAMELLIA_128_GCM_SHA512  = {0xC0,0xB4}
- CipherSuite TLS_MILAGRO_CS_WITH_3DES_EDE_CBC_SHA512      = {0xC0,0xB5}
- CipherSuite TLS_MILAGRO_CS_WITH_3DES_EDE_CBC_SHA256      = {0xC0,0xB6}
- CipherSuite TLS_MILAGRO_CS_WITH_NULL_SHA256              = {0xC0,0xB7}
- CipherSuite TLS_MILAGRO_CS_WITH_NULL_SHA512              = {0xC0,0xB8}

- CipherSuite TLS_MILAGRO_P2P_WITH_AES_128_GCM_SHA256      = {0xC0,0xB9}
- CipherSuite TLS_MILAGRO_P2P_WITH_AES_128_GCM_SHA512      = {0xC0,0xC0}
- CipherSuite TLS_MILAGRO_P2P_WITH_CAMELLIA_128_GCM_SHA256 = {0xC0,0xC1}
- CipherSuite TLS_MILAGRO_P2P_WITH_CAMELLIA_128_GCM_SHA512 = {0xC0,0xC2}
- CipherSuite TLS_MILAGRO_P2P_WITH_3DES_EDE_CBC_SHA512     = {0xC0,0xC3}
- CipherSuite TLS_MILAGRO_P2P_WITH_3DES_EDE_CBC_SHA256     = {0xC0,0xC4}
- CipherSuite TLS_MILAGRO_P2P_WITH_NULL_SHA256             = {0xC0,0xC5}
- CipherSuite TLS_MILAGRO_P2P_WITH_NULL_SHA256             = {0xC0,0xC6}

The key exchange method, cipher, and hash algorithm for each of these
cipher suites are easily determined by examining the name. Ciphers (other
than AES ciphers) and hash algorithms are defined in <a href="#1">1</a>. AES cipher is
defined in <a href="#5">5</a>, GCM in <a href="#6">6</a> and the hash algorithm is
defined in <a href="#7">7</a>.

The cipher suite name space is maintained by IANA.  See Section 7 for
information on how new value assignments are added.

## Security Considerations

For TLS handshakes using PBC cipher suites, the security
considerations in appendices D, E and F of <a href="#1">1</a> apply accordingly.

Security discussion specific to PBC can be also found in <a href="#11">11</a>.

Implementers and users must also consider whether they need forward
secrecy.  Forward secrecy refers to the property that session keys
are not compromised if the static, certified keys belonging to the
server and client are compromised.  The MILAGRO_CS and MILAGRO_P2P
key exchange algorithms provide forward secrecy protection in the
event of server and/or client's secret compromise.
</br></br>
### MILAGRO_CS

A replay-attack might be mounted by re-sending the parameters sent
with the extension of ClientHello from a previous conversation. This
will not be successful if the difference between the current time on
the server and time parameter in the ClientHello message is too
large.

An active attacker might allow the server to complete the first part
of the protocol and then attempt to hijack the link before the
calculation of the key. But observe how the value of x is re-used for
the calculation of the Diffie-Hellman component of the key. This
binds both parts of the protocol together and effectively blocks any
hijacking attempt.

A Key Compromise Impersonation (KCI) attack, whereby an attacker
steals the client credentials and poses as a valid server, is
impossible to mount due to fact that random integer r is used in the
key agreement protocol.
</br></br>
### MILAGRO_P2P

This key exchange algorithm has been proved secure under the
Bilinear-Diffie-Hellman (BDH) assumption in the Canetti-Krawczyk <a href="#10">10</a>.

## IANA Considerations

This document introduces in section 4.1 and 5 some additions to Transport Layer Security
(TLS) Parameters.

Any assignments in this document require IETF Consensus action <a href="#4">4</a>

## References

  <cite id="1">T. Dierks,  E. Rescorla, "The Transport Layer Security (TLS) Protocol Version 1.2", RFC 5246, August 2008</cite>
  <cite id="2"> Bradner S., "Key words for use in RFCs to Indicate Requirement Levels", RFC 2119, March 1997</cite>
  <cite id="3">Blake-Wilson, S., Nystrom, M., Hopwood, D., Mikkelsen, J., and T.Wright, "Transport Layer Security (TLS) Extensions", RFC 4366, April 2006.</cite>
  <cite id="4">Narten, T. and H. Alvestrand, "Guidelines for Writing an IANA Considerations Section in RFCs", RFC 2434, October 1998.</cite>
  <cite id="5">National Institute of Standards and Technology, "Specification for the Advanced Encryption Standard (AES)", FIPS 197, November 2001.</cite>
  <cite id="6">National Institute of Standards and Technology, "Recommendation for Block Cipher Modes of Operation: Galois/Counter Mode (GCM) for Confidentiality and Authentication", SP 800-38D, November 2007.</cite>
  <cite id="7">National Institute of Standards and Technology, "Secure Hash Standard", FIPS PUB 180-4, August 2015.</cite>
  <cite id="8">Scott, M. "M-Pin: A Multi-Factor Zero Knowledge Authentication Protocol", Miracl Labs.</cite>
  <cite id="9">Scott, M. "M-Pin Full Technology (Version 3.0)", Miracl Labs.</cite>
  <cite id="10">Sherman S.M. Chow and Kim-Kwang Raymond Choo, "Strongly-Secure Identity-based Key Agreement and Anonymous Extension", Cryptology ePrint Archive, Report 2007/018,2007.</cite>
  <cite id="11">D. Boneh and M. Franklin. Identity-based encryption from the Weil pairing. SIAM Journal of Computing, 32(3):586-615, 2003.</cite>
  <cite id="12">S. Galbraith, K. Paterson, and N. Smart. Pairings for cryptographers. Discrete Applied Mathematics, 156:3113-3121, 2008.</cite>
  <cite id="13">P.S.L.M. Barreto and M. Naehrig. Pairing-friendly elliptic curves of prime order. In Selected Areas in Cryptology SAC 2005, volume 3897 of Lecture Notes in Computer Science, pages 319-331. Springer-Verlag, 2006.</cite>
  <cite id="14">"mbed TLS," ARM. https://tls.mbed.org</cite>


## Authors' Addresses

Alessandro Budroni
MIRACL
Email: alessandro.budroni@miracl.com


Kealan McCusker
MIRACL
Email: kealan.mccusker@miracl.com

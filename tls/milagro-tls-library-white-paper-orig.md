---
currentMenu: milagro-tls-library-white-paper
---


<div id="generated-toc" class="generate_from_h2"></div>

<header class="col-span">
  <h1 class="title counter-skip"><em>Milagro TLS: pairing-based cryptography for Transport Layer Security</em></h1>
  <div class="authors col-1">
    <div class="authors">
      <div>Alessandro Budroni</div>
      <div>Kealan McCusker</div>
      <div><a href="http://www.miracl.com/miracl-crypto-labs">MIRACL Labs</a></div>
      <div>Dublin, Ireland</div>
    </div>
    <div class="author">
      <div>-</div>
      <div>-</div>
      <div>-</div>
    </div>
</header>


## Abstract

This document introduces two key-exchange algorithms that are both
based on pairing-based cryptography. The first is designed for
Client-to-Server communication and the second for Peer-to-Peer.

## Status of This Memo

This Internet-Draft is submitted in full conformance with the
provisions of BCP 78 and BCP 79.

Internet-Drafts are working documents of the Internet Engineering
Task Force (IETF).  Note that other groups may also distribute
working documents as Internet-Drafts.  The list of current Internet-
Drafts is at http://datatracker.ietf.org/drafts/current/.

Internet-Drafts are draft documents valid for a maximum of six months
and may be updated, replaced, or obsoleted by other documents at any
time.  It is inappropriate to use Internet-Drafts as reference
material or to cite them other than as "work in progress."

This Internet-Draft will expire on November 11, 2016.

## Copyright Notice

Copyright (c) 2016 IETF Trust and the persons identified as the
document authors.  All rights reserved.

This document is subject to BCP 78 and the IETF Trust's Legal
Provisions Relating to IETF Documents
(http://trustee.ietf.org/license-info) in effect on the date of
publication of this document.  Please review these documents
carefully, as they describe your rights and restrictions with respect
to this document.  Code Components extracted from this document must
include Simplified BSD License text as described in Section 4.e of
the Trust Legal Provisions and are provided without warranty as
described in the Simplified BSD License.

## Introduction

Pairing-Based Crypto (PBC) is emerging as a  solution to complex problems that proved
intractable to the standard mathematics of Public-Key Cryptography such as Identity-Based
Encryption, whereby the identity of a client can be used as their public key <a href="#11">11</a>.

For Milagro TLS a Type-3 pairing is used which is a mapping $G1 x G2$ $-> GT$ <a href="#12">12</a>.
The groups $G1$, $G2$ and $GT$ are all of the same prime order $q$. A pairing works on a special pairing friendly elliptic curve <a href="#13">13</a>.

For a BN curve $G1$ are points on the curve over the base field $F_p$ $G2$ are points on the sextic twist of the curve over the quadratic extension field $F_p$<sup>2</sup>, and $GT$ are elements in the cyclotomic subgroup embedded in the finite extension field $F_p$<sup>12</sup>.

The pairing itself is written as a function with two inputs $C = e(P,Q)$, where $P$ is a member of $G1$, $Q$ is a member of $G2$ and $C$ is a member of $GT$. The most important property of the pairing is its bilinearity:

$e(aP,Q) = e(P,Q)^a = e(P,aQ)$

Milagro TLS uses a BN pairing friendly curve which has security at the AES-128 level.

This document describes an addition to TLS 1.2 <a href="#1">1</a> to support PBC. In
particular, it defines:
* ___Milagro CS___: a key-exchange algorithm based on MPIN-FULL protocol <a href="#9">9</a>.
This is a Client-to-Server protocol that allows mutually authenticated key agreement. In this protocol the client secrets are in $G1$ and the server secret is in $G2$. For a Type-3 pairing there is assumed to be no computable isomorphism between these groups, even though both are of the same order.
* ___Milagro P2P___: a key-exchange algorithm based on Chow-Choo protocol <a href="#10">10</a>. It can operate in P2P or client/server mode. User of this protocol are issued sender keys in $G1$ and receiver keys in $G2$. The server that sends the ServerKeyExchange is considered the sender in this protocol.


## Requirements Notation

The keywords "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT",
"SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this
document are to be interpreted as described in <a href="#2">2</a>.

### Definitions

Two-Factor Authentication: Two-factor Authentication, also known as
2FA, is a technology which allows a client to authenticate itself to
a server using two independent sources of data. These MUST be such
that knowledge of one factor does not reveal the other factor. Any
third party who obtains by whatever means one factor for a certain
identity MUST NOT be able to authenticate themselves to the Server in
that identity.

Digital Identity: Digital Identity is the data that uniquely
describes a person or a thing, and typically contains some
information about that entity's relationships.

### Abbreviations

ECC Elliptic Curve Cryptography

PBC Pairing-Based Cryptography

AES Advanced Encryption Standard

TA Trusted Authority

Milagro_CS Milagro Client-to-Server

Milagro_P2P Milagro Peer-to-Peer

### Conventions

IdC: Digital identity of the client

IdS: Digital identity of the server

H1: Maps string value to a point on the curve in G1.

H2: Maps string value to a point on the curve in G_2

Hq: Hashes inputs to an integer modulo the curve order q.

SHA-256: Perform the SHA256 function.

Wc/Ws: we use this notation to indicate for example the parameter W
of the Client in case of Wc and the parameter W of the Server in case
of Ws.

SKc/SKs: denotes the session key of the Client/Server.

SIdC/SIdS: denotes the session identifier for the Client/Server.

||: denotes the concatenation of messages.

## Key Exchange Algorithms

### MILAGRO_CS

Here we briefly resume the main steps of the MPIN-FULL key-exchange
algorithm, see <a href="#8">8</a> and <a href="#9">9</a> for details.

The TA provides the client key s.A, in G1 and the server key s.Q, in
G2.

MPIN Full was envisaged as a 2FA solution but as this is a machine to
machine protocol there is no requirement to enter a PIN and it is set
to zero in the code.

The ClientHello message MUST have an extension which contains three
public parameters:

* IdC, the identity of the client. This can be the identity in clear
  or the hash of identity. In the latter case  the IdC is encrypted
  after the session key is established and sent to the server to
  complete client authentication.

* U = x.(H1(IdC))and x is a random number modulo the curve order.
  When time permits are used then this value is set to
  U = x.(H1(IdC)+H1(d|SHA-256(IdC))), where d is the Epoch days

* UT = x.(H1(IdA)+H1(d||SHA-256(IdA))), where d is the Epoch days

* t, the epoch time at which authentication occurred.

* V = -(x+y)(s.A), where y = Hq(t|U) or Hq(t,UT) if time permits are
  used and A =H1(IdC). When time permits are enabled then they  must
  be added to sA.

The server itself calculates A by applying the same hash function H1
to the claimed digital identity i.e. H1(IdA) or H1(IdA) + H1(d,SHA-
256(IdA) in the case of time permits being used. Then the Server MUST
check that e(V,Q).e(U+yA,s.Q) = 1 or e(V,Q).e(UT+y.A,s.Q) for time
permits. If this tests fails then the connection is terminated by the
server with a proper alert message (which one?), and the attempted
Client connection is rejected.

Through the ServerKeyExchange message, the server send a  ECDH public
key W=w.A, where w is a random number modulo the curve order and A is
H1(IdA) or H1(IdA) + H1(d,SHA-256(IdA) if time permits used.

Through the ClientKeyExchange message, the client send its ECDH
public key R=r.A, where r is a random number modulo the curve order.


At this point, both the client and the server are able to compute a
16-bytes shared premaster secret:


* The client first computes the parameter h = Hq(A,U,y,V,R,W), then
  computes the premaster secret as K = Hg(e(s.A,Q)^(r+h)|x.W).


* The server first computes the parameter h = Hq(A,U,y,V,R,W), then
  computes the premaster secret as K = Hg(e(R+h.A,s.Q)|w.U).

See <a href="#9">9</a> for more details.


### MILAGRO_P2P


Here we briefly resume the main steps of the Chow-Choo key-exchange
algorithm <a href="#10">10</a>.

Choo-Chow key-exchange algorithm is designed for peer-to-peer communications .
The TA provides the server with a sender key in G1 i.e.
AKeyG1 and client with receiver key in G2 I.e. BKeyG2 based on their
respective identities.


The main steps of the algorithm are:

* The server computes a random integer x modulo the curve order,
  computes a point on the group G1 as PaG1 = x.H1(IdS) which is its
  public parameter and sends the pair (IdS,PaG1) to Bob.

* The client receives the pair of parameter from the server, computes
  two random integers Y and W modulo the curve order, compute the
  following: PbG2 = Y.H2(IdC), PgG1 = W.H1(IDa), pib =
  Hq(PbG2||PaG1||PgG1||IDa), pia = Hq(PaG1||PbG2||PgG1||IdC) and the
  value k = e(pia.H(IDa)+PaG1,(y+pib).BKeyG2).

* client computes the premaster secret as K = H(k,w.PaG1).

* client sends the triple (IdC,PaG1,PgG1) to server.

* server receives the parameters from Bob and computes the following
  pia = Hq(PaG1||PbG2||PgG1), pib = Hq(PbG2||PaG1||PgG1) and the
  value k = e((x+pia).AKeyG1,pib.B+PbG2).

* server compute the premaster secret as K = H(k,x.PaG1).


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

The general structure of TLS extensions is described in <a href="#3">3</a>, and
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

    length_hash_IdC, length_U, length_V: length of the parameters.
    hash_IdC: hash of the client's identity.
    U: first parameter sent by the client.
    V: second parameter sent by the client.
    time_value: current epoch time in seconds.


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
           uint16         length_PaG1;
           opaque         IdS[length_IdS];
           opaque         PaG1[length_PaG1];
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
           uint16 length_PbG2;
           opaque IdC[length_IdC];
           opaque PgG1[length_PgG1];
           opaque PbG2[length_PbG2];
    } ClientKeyExchange;


## Cipher Suites


The table below defines new cipher suites that use the key exchange
algorithms specified in Section 3.

* CipherSuite TLS_MILAGRO_CS_WITH_AES_128_GCM_SHA256  = { 0xC0, 0xB1 }
* CipherSuite TLS_MILAGRO_P2P_WITH_AES_128_GCM_SHA256 = { 0xC0, 0xB2 }

The key exchange method, cipher, and hash algorithm for each of these
cipher suites are easily determined by examining the name. AES cipher
is defined in <a href="#5">5</a>, GCM in <a href="#6">6</a>  and the
hash algorithm is defined in <a href="#7">7</a>.

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

### MILAGRO_P2P

This key exchange algorithm has been proved secure under the
Bilinear-Diffie-Hellman (BDH) assumption in the Canetti-Krawczyk <a href="#10">10</a>.

## IANA Considerations

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


## Authors' Addresses

Alessandro Budroni
Miracl ltd.
Email: alessandro.budroni@miracl.com


Kealan McCusker
Miracl ltd.
Email: kealan.mccusker@miracl.com

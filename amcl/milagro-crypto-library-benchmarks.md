---
currentMenu: milagro-crypto-library-benchmarks
---

## Benchmarks

Since AMCL is intended for the Internet of Things, we think it appropriate to give some timings based on an implementation on the Raspberry Pi (version 2) computer, which is based on a 32-bit ARM7 chip. We do not overclock the 900MHz processor.

We developed three API programs, one which tests standard methods of elliptic curve key exchange, public key cryptography and digital signature. Another implements all components of the M-Pin protocol, a pairing-based protocol of medium complexity [@mpin].  The former uses the ed25519 Edwards curve [@bernstein-duif-lange-schwabe-yang] with its pseudo-mersenne modulus, and the latter a BN curve. Finally we implement all the steps of the RSA public key encryption protocol using 2048-bit keys, that is key generation, encryption and decryption.

These might be regarded as representative of what might be expected for an implementation of a typical elliptic curve (ECC) protocol, a typical pairing-based (PBC) protocol, and a typical classic public key protocol based on RSA.
The results in the first table indicate the code and stack requirements when these programs were compiled using version 4.8 of the GCC compiler, using the standard -O3 (optimize for best performance) and -Os (optimize for minimum size) flags, and a flag to indicate the specific ARM architecture (Cortex-A7).

|Method & Flag|Code Size|Maximum Stack Usage|
|:-------------:|:------------:|:------------:|
|ECC  -O3|  68085 |  4140 |
|ECC  -Os|  31115 |  3752 |
|PBC  -O3|  84031 |  8140 |
|PBC  -Os|  46044 |  7904 |
|RSA  -O3|  61461 |  5332 |
|RSA  -Os|  23449 |  5228 |
<p align="center">
<b>Table 1. Typical Memory Footprint</b><br>
</p>
</b><br>


Next we give some timings for a single SPA-protected ECC point multiplication on an Edwards curve, for the calculation of a single PBC pairing on the BN curve, and for a SPA-protected 2048-bit RSA decryption.

|   |Time in milliseconds|
|:------|:------:|
|ECC point multiplication -O3|3.9|
|ECC point multiplication -Os|5.9|
|PBC pairing -O3|47.4|
|PBC pairing -Os|77.3|
|RSA decryption -O3|155|
|RSA decryption -Os|233|
<p align="center">
<b>Table 2. C Benchmarks</b><br>
</p>
</b><br>


Observe that we do not compare these timings with any other - because that is not the point.
The point is - are they "good enough" for whatever application you have in mind? And we suspect that, in the great majority of cases, they are.
Clearly for Java and Javascript we are completely at the mercy of the efficiency (or otherwise) of the virtual machine. As can be seen from these Javascript timings, these can vary significantly.

|   |Device|Browser|Time in seconds|
|:------|:------|:------|:------:|
|  ECC point multiplication   |   Raspberry Pi  |   Epiphany  |  0.65  |
|   |   Apple iPad 2  |   Safari  |  0.096  |
|   |   Samsung Galaxy Note 4  |   Chrome  |  0.018  |
|  PBC pairing   |    Raspberry Pi  |   Epiphany  |  11.0|
|  |    Apple iPad 2  |   Safari  |  1.6|
|  |    Samsung Galaxy Note 4  |   Chrome  |  0.30|
<p align="center">
<b>Table 3. JavaScript Benchmarks</b><br>
</p>
</b><br>

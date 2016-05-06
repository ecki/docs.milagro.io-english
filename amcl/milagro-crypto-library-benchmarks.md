---
currentMenu: milagro-crypto-library-benchmarks
---

**Benchmarks**

Since AMCL is intended for the Internet of Things, we think it appropriate to give some timings based on an implementation on the Raspberry Pi (version 2) computer, which is based on a 32-bit ARM7 chip. We do not overclock the 900MHz processor.

We developed three API programs, one which tests standard methods of elliptic curve key exchange, public key cryptography and digital signature. Another implements all components of the M-Pin protocol, a pairing-based protocol of medium complexity [@mpin].  The former uses the ed25519 Edwards curve [@bernstein-duif-lange-schwabe-yang] with its pseudo-mersenne modulus, and the latter a BN curve. Finally we implement all the steps of the RSA public key encryption protocol using 2048-bit keys, that is key generation, encryption and decryption.

These might be regarded as representative of what might be expected for an implementation of a typical elliptic curve (ECC) protocol, a typical pairing-based (PBC) protocol, and a typical classic public key protocol based on RSA.
The results in the first table indicate the code and stack requirements when these programs were compiled using version 4.8 of the GCC compiler, using the standard -O3 (optimize for best performance) and -Os (optimize for minimum size) flags, and a flag to indicate the specific ARM architecture (Cortex-A7).
<br></br>
<markdeep>
|Method & Flag|Code Size|Maximum Stack Usage|
|:-------------:|:------------:|:------------:|
|ECC  -O3|  68085 |  4140 |
|ECC  -Os|  31115 |  3752 |
|PBC  -O3|  84031 |  8140 |
|PBC  -Os|  46044 |  7904 |
|RSA  -O3|  61461 |  5332 |
|RSA  -Os|  23449 |  5228 |
[Table 1: Typical Memory Footprint]
</markdeep>
<br></br>


Next we give some timings for a single SPA-protected ECC point multiplication on an Edwards curve, for the calculation of a single PBC pairing on the BN curve, and for a SPA-protected 2048-bit RSA decryption.
<br></br>
<markdeep>
|   |Time in milliseconds|
|:------|:------:|
|ECC point multiplication -O3|3.9|
|ECC point multiplication -Os|5.9|
|PBC pairing -O3|47.4|
|PBC pairing -Os|77.3|
|RSA decryption -O3|155|
|RSA decryption -Os|233|
[Table 2: C Benchmarks]
</markdeep>
<br></br>


Observe that we do not compare these timings with any other - because that is not the point.
The point is - are they "good enough" for whatever application you have in mind? We suspect that, in the great majority of cases, they are.
Clearly for Java and Javascript we are completely at the mercy of the efficiency (or otherwise) of the virtual machine. As can be seen from these Javascript timings, these can vary significantly.
<br></br>
<markdeep>
|   |Device|Browser|Time in seconds|
|:------|:------|:------|:------:|
|  ECC point multiplication   |   Raspberry Pi  |   Epiphany  |  0.65  |
|   |   Apple iPad 2  |   Safari  |  0.096  |
|   |   Samsung Galaxy Note 4  |   Chrome  |  0.018  |
|  PBC pairing   |    Raspberry Pi  |   Epiphany  |  11.0|
|  |    Apple iPad 2  |   Safari  |  1.6|
|  |    Samsung Galaxy Note 4  |   Chrome  |  0.30|
[Table 3: JavaScript Benchmarks]
<br></br>
<markdeep>

**References**

<p></p>
<div class="references">
  <cite id="AMCL-on-GitHub"><a href="https://www.github.com">Milagro Crypto Library on GitHub</a></cite>
  <cite id="m-n-l">Miele and Lenstra, A Treatise on Electricity and Magnetism, 3rd ed., vol. 2. Oxford: Clarendon, 1892, pp.68–73.</cite>
  <cite id="barreto-naehrig">P.S.L.M. Barreto and M. Naehrig, <q>Fine particles, thin films and exchange anisotropy,</q> in Magnetism, vol. III, G. T. Rado and H. Suhl, Eds. New York: Academic, 1963, pp. 271–350.</cite>
  <cite id="mpin">K. Elissa, <q>Title of paper if known,</q> unpublished.</cite>
  <cite id="park13">Park, T. H., Saxena, A., Jagannath, S., Wiedenbeck, S., and Forte, A. Towards a taxonomy of errors in HTML and CSS. In <em>Proc. ICER 2013</em>, ACM Press (2013), 75-82.</cite>
  <cite id="nicole">R. Nicole, <q>Title of paper with only first word capitalized,</q> J. Name Stand. Abbrev., in press.</cite>
  <cite id="yorozu87">Y. Yorozu, M. Hirano, K. Oka, and Y. Tagawa, <q>Electron spectroscopy studies on magneto-optical media and plastic substrate interface,</q> IEEE Transl. J. Magn. Japan, vol. 2, pp. 740–741, August 1987 [Digests 9th Annual Conf. Magnetics Japan, p. 301, 1982].</cite>
  <cite id="young89">M. Young, The Technical Writer’s Handbook. Mill Valley, CA: University Science, 1989.</cite>
</div>



<script>window.markdeepOptions = {mode: 'html'};</script>
<script src="markdeep.min.js"></script>
<script src="https://casual-effects.com/markdeep/latest/markdeep.min.js"></script>

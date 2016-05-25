---
currentMenu: pairing-crypto-protocols
layout: markdeep
---
<div id="generated-toc" class="generate_from_h2"></div>
<style>h1:before, h2:before, h3:before { content: none; }</style>

<!--- <div class="abstract">
<span class="footnote">
Note: This document uses sections from the MIRACL Labs M-Pin Full Paper, published in 2015.<p></p>MIRACL Ltd, along with NTT Labs and NTTi3, are the originators of the Milagro Project. The original LaTex authored PDF version is available for download <a href="docs.milagro.io/mpinfull.pdf">here</a>.</span></p>
</div>
--->

## Introduction

The Milagro framework relies on Distributed Trust Authorities to issue shares of Type-3 Pairing keys to Milagro Crypto Apps, such as the Milagro MFA server and clients, or to software or hardware applications that have embedded Milagro code in order derive the functional capabilities.

As outlined in the previous section, Type-3 pairings were selected as they are the most efficient pairing and will work with non-supersingular pairing-friendly curves. These operate as $G_1$ x $G_2 \rightarrow G_T$, where $G_2$ is a particular group of points, again of the order $q$, but on a twisted elliptic curve defined over an extension which is a divisor of $k$.
These curves can be constructed to be a near perfect fit at any required level of security <a href="#freeman-scott-teske">1</a>. The pairing protocols within the Milagro framework all work on a Type-3 setting.

## M-Pin Protocol - Introduction

The genesis of the M-Pin Protocol was first put forward in a research paper by [Dr. Michael Scott](https://scholar.google.com/citations?user=GsM-aeEAAAAJ&hl=en) in 2002 <a href="#Scott1">2</a>. The M-Pin Protocol has been iterated on several times over the years since, to develop three distinct modes, which will be explored in the following sections.

 As noted in [Milagro Crypto Concepts](milagro-concepts.html), the M-Pin Protocol is of these classifications and exploits the features of:
* Elliptic Curve Cryptography
* Pairing Based Cryptography
* Identity Based Encryption
* Zero Knowledge Proof

Because of the characteristics that M-Pin inherits from the four techniques above, the M-Pin Protocol and its variants are able to deliver:
* Multi-factor authentication (MFA) using Zero Knowledge Proof
* Authenticated Key Agreement
* Distribution, or splitting, of Trust Authorities
* Covert Channel Communication

The three modes of operation of the M-Pin Protocol are as follows:
* **M-Pin 1-pass**: Client to server authentication via digital signature, this mode implements a *non-interactive* zero knowledge proof and is resistant to [MITM (man in the middle)](https://en.wikipedia.org/wiki/Man-in-the-middle_attack) attacks.
* **M-Pin 2-pass**: Client to server authentication via a *interactive* zero knowledge proof, resistant to [MITM](https://en.wikipedia.org/wiki/Man-in-the-middle_attack) and [KCI (Key Compromise Impersonation)](https://kcitls.org) attacks.
* **M-Pin FULL**: Mutual client to server authentication via a *interactive* zero knowledge proof, resistant to MITM and KCI attacks and able to drive an Authenticated [Key Agreement](https://en.wikipedia.org/wiki/Key-agreement_protocol) between client and server, resulting in 128 bit shared secret key.

Note that the M-Pin Full Authenticated Key Agreement possesses the quality of [perfect forward secrecy (PFS)](https://en.wikipedia.org/wiki/Forward_secrecy), meaning, even if the client and server long term keys are compromised, the past session keys (used to encrypt TLS traffic, for example) are not compromised.

## Chow-Choo Protocol - Introduction

The Chow-Choo Protocol was developed by Sherman S.M. Chow and Kim-Kwang Raymond Choo and published in 2007 via a research paper titled Strongly-Secure Identity-based Key Agreement <a href="#chow-choo">3</a>.

<figure>
  <figcaption><strong>PROTOCOL MODE RECOMMENDATIONS</strong></figcaption>
<markdeep>
      Mode                          |   Use Cases
-------------------------------------|------------
M-Pin 1-Pass | Digital signature authentication in battery or bandwidth constrained environments such as IoT devices, embedded applications and mobile apps.
M-Pin 1-Pass + M-Pin 2-Pass      | Digital signature and client to server authentication in smartphones apps, desktop browsers and software applications.
M-Pin 2-Pass | Client to server authentication in smartphones apps, desktop browsers and software applications.
M-Pin FULL | Mutual client and server authentication with authenticated key agreement for use in smartphones apps, hardware and software applications. Authenticated Key Agreement with PFS can be used as the basis for TLS sessions between clients and servers.
Chow-Choo | Mutual peer to peer authentication with authenticated key agreement for use in smartphones apps, hardware and software applications. Authenticated Key Agreement with PFS can be used as the basis for TLS sessions between clients and servers and peer to peer.
</markdeep>
</figure>

<!---
The M-Pin Protocol has been iterated on several times over the years since, and has been shown to be proven secure under the computational BDH (Bilinear Diffie-Hellman) assumption, and in the Canetti-Krawczyk (CK) security model <a href="#boyd">3</a>.

Furthermore Gorantla, Boyd and Nieto extend this protocol again to the M-Pin 'one-pass' setting, and provide a proof in a modified extended Canetti-Krawczyk (eCK) setting <a href="#gorantla">4</a>.

Furthermore Gorantla, Boyd and Nieto extend this protocol again to the M-Pin 'one-pass' setting, and provide a proof in a modified extended Canetti-Krawczyk (eCK) setting <a href="#gorantla">4</a>.

--->

<!--- This is the Chow Choo protocol in a Mathml table / frame because redering in Math LaTex equations exposes a bug in MathJax. It's just one equation!  --->

<figure>
	<html>
	<math xmlns="http://www.w3.org/1998/Math/MathML" display='block'>
			<mtable frame="solid" rowlines="solid" rowalign="center" mathbackground="white">
			<mstyle mathsize='.85em'>
		<mtr>
			<mtd>
				<mspace width="0.1em" />
			</mtd>
			<mtd columnalign="left">
				<mtable class="m-matrix">
					<mtr>
						<mtd>
							<mtext>SENDER</mtext>
						</mtd>
						<mtd>
							<mtext>RECEIVER</mtext>
						</mtd>
					</mtr>
					<mtr>
						<mtd>
							<mi>x</mi>
							<mo>&#x02208;</mo>
							<msubsup>
								<mi>&#x02124;</mi>
								<mi>q</mi>
								<mo>*</mo>
							</msubsup>
						</mtd>
						<mtd>
						</mtd>
					</mtr>
					<mtr>
						<mtd>
							<mi>A</mi>
							<mi>G</mi>
							<mn>1</mn>
							<mo>:</mo>
							<mo>=</mo>
							<msub>
								<mi>H</mi>
								<mn>1</mn>
							</msub>
							<mrow>
								<mo form="prefix">(</mo>
								<mi>I</mi>
								<mo>&#x02146;</mo>
								<mi>A</mi>
								<mo form="postfix">)</mo>
							</mrow>
						</mtd>
						<mtd>
						</mtd>
					</mtr>
					<mtr>
						<mtd>
							<mi>P</mi>
							<mi>a</mi>
							<msub>
								<mi>G</mi>
								<mn>1</mn>
							</msub>
							<mo>:</mo>
							<mo>=</mo>
							<mi>x</mi>
							<mo>&#x022C5;</mo>
							<mi>A</mi>
							<msub>
								<mi>G</mi>
								<mn>1</mn>
							</msub>
						</mtd>
						<mtd>
						</mtd>
					</mtr>
					<mtr>
						<mtd>
							<mi>I</mi>
							<mo>&#x02146;</mo>
							<mi>A</mi>
							<mo>,</mo>
							<mi>P</mi>
							<mi>a</mi>
							<msub>
								<mi>G</mi>
								<mn>1</mn>
							</msub>
							<mo>&#x027F6;</mo>
						</mtd>
						<mtd>
						</mtd>
					</mtr>
					<mtr>
						<mtd>
						</mtd>
						<mtd>
							<mi>y</mi>
							<mo>,</mo>
							<mi>w</mi>
							<mo>&#x02208;</mo>
							<msubsup>
								<mi>&#x02124;</mi>
								<mi>q</mi>
								<mo>*</mo>
							</msubsup>
						</mtd>
					</mtr>
					<mtr>
						<mtd>
						</mtd>
						<mtd>
							<mi>A</mi>
							<msub>
								<mi>G</mi>
								<mn>1</mn>
							</msub>
							<mo>:</mo>
							<mo>=</mo>
							<msub>
								<mi>H</mi>
								<mn>1</mn>
							</msub>
							<mrow>
								<mo form="prefix">(</mo>
								<mi>I</mi>
								<mo>&#x02146;</mo>
								<mi>A</mi>
								<mo form="postfix">)</mo>
							</mrow>
						</mtd>
					</mtr>
					<mtr>
						<mtd>
						</mtd>
						<mtd>
							<mi>B</mi>
							<msub>
								<mi>G</mi>
								<mn>2</mn>
							</msub>
							<mo>:</mo>
							<mo>=</mo>
							<msub>
								<mi>H</mi>
								<mn>2</mn>
							</msub>
							<mrow>
								<mo form="prefix">(</mo>
								<mi>I</mi>
								<mo>&#x02146;</mo>
								<mi>B</mi>
								<mo form="postfix">)</mo>
							</mrow>
						</mtd>
					</mtr>
					<mtr>
						<mtd>
						</mtd>
						<mtd>
							<mi>P</mi>
							<mi>b</mi>
							<msub>
								<mi>G</mi>
								<mn>2</mn>
							</msub>
							<mo>:</mo>
							<mo>=</mo>
							<mi>y</mi>
							<mo>&#x022C5;</mo>
							<mi>B</mi>
							<msub>
								<mi>G</mi>
								<mn>2</mn>
							</msub>
						</mtd>
					</mtr>
					<mtr>
						<mtd>
						</mtd>
						<mtd>
							<mi>P</mi>
							<mi>g</mi>
							<msub>
								<mi>G</mi>
								<mn>1</mn>
							</msub>
							<mo>:</mo>
							<mo>=</mo>
							<mi>w</mi>
							<mo>&#x022C5;</mo>
							<mi>A</mi>
							<msub>
								<mi>G</mi>
								<mn>1</mn>
							</msub>
						</mtd>
					</mtr>
					<mtr>
						<mtd>
						</mtd>
						<mtd>
							<mtext>pia</mtext>
							<mo>:</mo>
							<mo>=</mo>
							<msub>
								<mi>H</mi>
								<mi>q</mi>
							</msub>
							<mrow>
								<mo form="prefix">(</mo>
								<mi>P</mi>
								<mi>a</mi>
								<msub>
									<mi>G</mi>
									<mn>1</mn>
								</msub>
								<mo>&#x02016;</mo>
								<mi>P</mi>
								<mi>b</mi>
								<msub>
									<mi>G</mi>
									<mn>2</mn>
								</msub>
								<mo>&#x02016;</mo>
								<mi>P</mi>
								<mi>g</mi>
								<msub>
									<mi>G</mi>
									<mn>1</mn>
								</msub>
								<mo>&#x02016;</mo>
								<mi>I</mi>
								<mo>&#x02146;</mo>
								<mi>B</mi>
								<mo form="postfix">)</mo>
							</mrow>
						</mtd>
					</mtr>
					<mtr>
						<mtd>
						</mtd>
						<mtd>
							<mtext>pib</mtext>
							<mo>:</mo>
							<mo>=</mo>
							<msub>
								<mi>H</mi>
								<mi>q</mi>
							</msub>
							<mrow>
								<mo form="prefix">(</mo>
								<mi>P</mi>
								<mi>b</mi>
								<msub>
									<mi>G</mi>
									<mn>2</mn>
								</msub>
								<mo>&#x02016;</mo>
								<mi>P</mi>
								<mi>a</mi>
								<msub>
									<mi>G</mi>
									<mn>1</mn>
								</msub>
								<mo>&#x02016;</mo>
								<mi>P</mi>
								<mi>g</mi>
								<msub>
									<mi>G</mi>
									<mn>1</mn>
								</msub>
								<mo>&#x02016;</mo>
								<mi>I</mi>
								<mo>&#x02146;</mo>
								<mi>A</mi>
								<mo form="postfix">)</mo>
							</mrow>
						</mtd>
					</mtr>
					<mtr>
						<mtd>
						</mtd>
						<mtd>
							<mi>k</mi>
							<mo>:</mo>
							<mo>=</mo>
							<mi>e</mi>
							<mrow>
								<mo form="prefix">(</mo>
								<mtext>pia</mtext>
								<mo>&#x022C5;</mo>
								<mi>A</mi>
								<msub>
									<mi>G</mi>
									<mn>1</mn>
								</msub>
								<mo>+</mo>
								<mi>P</mi>
								<mi>a</mi>
								<msub>
									<mi>G</mi>
									<mn>1</mn>
								</msub>
								<mo>,</mo>
								<mo form="prefix">(</mo>
								<mi>y</mi>
								<mo>+</mo>
								<mtext>pib</mtext>
								<mo form="postfix">)</mo>
								<mo>&#x022EF;</mo>
								<mo>&#x022C5;</mo>
								<mi>B</mi>
								<msub>
									<mi>G</mi>
									<mn>2</mn>
								</msub>
								<mo form="postfix">)</mo>
							</mrow>
						</mtd>
					</mtr>
					<mtr>
						<mtd>
						</mtd>
						<mtd>
							<mi>K</mi>
							<mo>:</mo>
							<mo>=</mo>
							<mi>H</mi>
							<mrow>
								<mo form="prefix">(</mo>
								<mi>k</mi>
								<mo>,</mo>
								<mi>w</mi>
								<mo>&#x022C5;</mo>
								<mi>P</mi>
								<mi>a</mi>
								<msub>
									<mi>G</mi>
									<mn>1</mn>
								</msub>
								<mo form="postfix">)</mo>
							</mrow>
						</mtd>
					</mtr>
					<mtr>
						<mtd>
						</mtd>
						<mtd>
							<mo>&#x027F5;</mo>
							<mi>I</mi>
							<mo>&#x02146;</mo>
							<mi>B</mi>
							<mo>,</mo>
							<mi>P</mi>
							<mi>g</mi>
							<msub>
								<mi>G</mi>
								<mn>1</mn>
							</msub>
							<mo>,</mo>
							<mi>P</mi>
							<mi>b</mi>
							<msub>
								<mi>G</mi>
								<mn>2</mn>
							</msub>
						</mtd>
					</mtr>
					<mtr>
						<mtd>
							<mi>B</mi>
							<msub>
								<mi>G</mi>
								<mn>2</mn>
							</msub>
							<mo>:</mo>
							<mo>=</mo>
							<msub>
								<mi>H</mi>
								<mn>2</mn>
							</msub>
							<mrow>
								<mo form="prefix">(</mo>
								<mi>I</mi>
								<mo>&#x02146;</mo>
								<mi>B</mi>
								<mo form="postfix">)</mo>
							</mrow>
						</mtd>
						<mtd>
						</mtd>
					</mtr>
					<mtr>
						<mtd>
							<mtext>pia</mtext>
							<mo>:</mo>
							<mo>=</mo>
							<msub>
								<mi>H</mi>
								<mi>q</mi>
							</msub>
							<mrow>
								<mo form="prefix">(</mo>
								<mi>P</mi>
								<mi>a</mi>
								<msub>
									<mi>G</mi>
									<mn>1</mn>
								</msub>
								<mo>&#x02016;</mo>
								<mi>P</mi>
								<mi>b</mi>
								<msub>
									<mi>G</mi>
									<mn>2</mn>
								</msub>
								<mo>&#x02016;</mo>
								<mi>P</mi>
								<mi>g</mi>
								<msub>
									<mi>G</mi>
									<mn>1</mn>
								</msub>
								<mo>&#x02016;</mo>
								<mi>I</mi>
								<mo>&#x02146;</mo>
								<mi>B</mi>
								<mo form="postfix">)</mo>
							</mrow>
						</mtd>
						<mtd>
						</mtd>
					</mtr>
					<mtr>
						<mtd>
							<mtext>pib</mtext>
							<mo>:</mo>
							<mo>=</mo>
							<msub>
								<mi>H</mi>
								<mi>q</mi>
							</msub>
							<mrow>
								<mo form="prefix">(</mo>
								<mi>P</mi>
								<mi>b</mi>
								<msub>
									<mi>G</mi>
									<mn>2</mn>
								</msub>
								<mo>&#x02016;</mo>
								<mi>P</mi>
								<mi>a</mi>
								<msub>
									<mi>G</mi>
									<mn>1</mn>
								</msub>
								<mo>&#x02016;</mo>
								<mi>P</mi>
								<mi>g</mi>
								<msub>
									<mi>G</mi>
									<mn>1</mn>
								</msub>
								<mo>&#x02016;</mo>
								<mi>I</mi>
								<mo>&#x02146;</mo>
								<mi>A</mi>
								<mo form="postfix">)</mo>
							</mrow>
						</mtd>
						<mtd>
						</mtd>
					</mtr>
					<mtr>
						<mtd>
							<mi>k</mi>
							<mo>:</mo>
							<mo>=</mo>
							<mi>e</mi>
							<mrow>
								<mo form="prefix">(</mo>
								<mo form="prefix">(</mo>
								<mi>x</mi>
								<mo>+</mo>
								<mi>p</mi>
								<mi>i</mi>
								<mi>a</mi>
								<mo form="postfix">)</mo>
								<mo>&#x022EF;</mo>
								<mo>&#x022C5;</mo>
								<mi>A</mi>
								<msub>
									<mi>G</mi>
									<mn>1</mn>
								</msub>
								<mo>,</mo>
								<mtext>pib</mtext>
								<mo>&#x022C5;</mo>
								<mi>B</mi>
								<msub>
									<mi>G</mi>
									<mn>2</mn>
								</msub>
								<mo>+</mo>
								<mi>P</mi>
								<mi>b</mi>
								<msub>
									<mi>G</mi>
									<mn>2</mn>
								</msub>
								<mo form="postfix">)</mo>
							</mrow>
						</mtd>
						<mtd>
						</mtd>
					</mtr>
					<mtr>
						<mtd>
							<mi>K</mi>
							<mo>:</mo>
							<mo>=</mo>
							<mi>H</mi>
							<mrow>
								<mo form="prefix">(</mo>
								<mi>k</mi>
								<mo>,</mo>
								<mi>x</mi>
								<mo>&#x022C5;</mo>
								<mi>P</mi>
								<mi>g</mi>
								<msub>
									<mi>G</mi>
									<mn>1</mn>
								</msub>
								<mo form="postfix">)</mo>
							</mrow>
						</mtd>
						<mtd>
						</mtd>
					</mtr>
				</mtable>
			</mtd>
		</mtr>
	</mtable>
	</math>
	</html>
	<figcaption>Chow-Choo Protocol</figcaption>
</figure>
---

**Notes on Chow-Choo Protocol:**
<markdeep>
* $G_1$: a $r$-order cyclic subgroup of $E(F_p)$.
* $G_2$: a subgroup of$E(F_{p^k})$, where $k$ is the embedding degree of the Curve.
* $H1$: Maps string value to a point on the curve in $G_1$.
* $H2$: Maps string value to a point on the curve in $G_2$.
* $Hq$: Hashes inputs to an integer modulo the curve order $q$.
* H(): Hash function.
* $||$: denotes the concatenation of messages.
</markdeep>

<markdeep>
<style>h1:before, h2:before { content: none; }</style>
## REFERENCES
</markdeep>
<p></p>
<div class="references">
	<cite id="freeman-scott-teske">D. Freeman and M. Scott and E. Teske. A taxonomy of pairing-friendly elliptic curves. Journal of Cryptography. 2010. Pages 224 -- 280. Volume 23.</cite>
	<cite id="Scott1">M. Scott. Authenticated ID-based Key Exchange and remote log-in with simple token and PIN number. Cryptology ePrint Archive, Report 2002/164. http://eprint.iacr.org.</cite>
	<cite id="boyd">C. Boyd and A. Mathuria, Protocols for Authentication and Key Establishment, Springer-Verlag, 2003.</cite>
  <cite id="chow-choo">Chow, S.S.M., Choo, K.-K.R.: Strongly-Secure Identity-based Key Agreement and Anonymous Extension. Cryptology ePrint Archive, Report 2007/018.</cite>
</div>

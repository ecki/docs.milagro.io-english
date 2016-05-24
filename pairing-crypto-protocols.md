---
currentMenu: pairing-crypto-protocols
layout: markdeep
---
<div id="generated-toc" class="generate_from_h2"></div>
<style>h1:before, h2:before { content: none; }</style>

## Introduction

The Milagro framework relies on Distributed Trust Authorities to issue shares of Type-3 Pairing keys to Milagro Crypto Apps, such as the Milagro MFA server and clients, or to software or hardware applications that have embedded Milagro code in order derive the functional capabilities.

Type-3 pairings were selected as they are the most efficient pairing and will work with non-supersingular pairing-friendly curves. These operate as $G_1$ x $G_2 \rightarrow G_T$, where $G_2$ is a particular group of points, again of the order $q$, but on a twisted elliptic curve defined over an extension which is a divisor of $k$.
These curves can be constructed to be a near perfect fit at any required level of security <a href="#freeman-scott-teske">1</a>. The pairing protocols within the Milagro framework all work on a Type-3 setting.

## M-Pin Protocol

The genesis of the M-Pin Protocol was first put forward in a research paper by [Dr. Michael Scott](https://scholar.google.com/citations?user=GsM-aeEAAAAJ&hl=en) in 2002 <a href="#Scott1">2</a>. The M-Pin Protocol has been iterated on several times over the years since, and has been shown to be proven secure under the computational BDH (Bilinear Diffie-Hellman) assumption, and in the Canetti-Krawczyk (CK) security model \cite{boyd}. Furthermore Gorantla, Boyd and Nieto \cite{gorantla} (section 4.3) extend this protocol again to the M-Pin 'one-pass' setting, and provide a proof in a modified extended Canetti-Krawczyk (eCK) setting.


 As noted in [Milagro Crypto Concepts](milagro-concepts.html), the M-Pin Protocol is of these classifications and exploits the features of:

* Elliptic Curve Cryptography
* Pairing Based Cryptography
* Identity Based Encryption
* Zero Knowledge Proof

Because of the characteristics that M-Pin inherits from the four techniques above, the M-Pin Protocol and its four variants are able to deliver:
* Multi factor authentication using Zero Knowledge Proof
* Authenticated Key Agreement
* Distribution, or splitting, of Trust Authorities
* Covert Channel Communication


<!--- This is the Chow Choo protocol in a table / frame  --->

<figure>
	<html>
	<math xmlns="http://www.w3.org/1998/Math/MathML" display='block'>
			<mtable frame="solid" rowlines="solid" rowalign="center">
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
	<cite id="eason55">G. Eason, B. Noble, and I. N. Sneddon, <q>On certain integrals of Lipschitz-Hankel type involving products of Bessel functions,</q> Phil. Trans. Roy. Soc. London, vol. A247, pp. 529–551, April 1955. (<em>references</em>)</cite>
  <cite id="maxwell1892">J. Clerk Maxwell, A Treatise on Electricity and Magnetism, 3rd ed., vol. 2. Oxford: Clarendon, 1892, pp.68–73.</cite>
  <cite id="jacobs63">I. S. Jacobs and C. P. Bean, <q>Fine particles, thin films and exchange anisotropy,</q> in Magnetism, vol. III, G. T. Rado and H. Suhl, Eds. New York: Academic, 1963, pp. 271–350.</cite>
  <cite id="elissa">K. Elissa, <q>Title of paper if known,</q> unpublished.</cite>
  <cite id="park13">Park, T. H., Saxena, A., Jagannath, S., Wiedenbeck, S., and Forte, A. Towards a taxonomy of errors in HTML and CSS. In <em>Proc. ICER 2013</em>, ACM Press (2013), 75-82.</cite>
  <cite id="nicole">R. Nicole, <q>Title of paper with only first word capitalized,</q> J. Name Stand. Abbrev., in press.</cite>
  <cite id="yorozu87">Y. Yorozu, M. Hirano, K. Oka, and Y. Tagawa, <q>Electron spectroscopy studies on magneto-optical media and plastic substrate interface,</q> IEEE Transl. J. Magn. Japan, vol. 2, pp. 740–741, August 1987 [Digests 9th Annual Conf. Magnetics Japan, p. 301, 1982].</cite>
  <cite id="young89">M. Young, The Technical Writer’s Handbook. Mill Valley, CA: University Science, 1989.</cite>
</div>

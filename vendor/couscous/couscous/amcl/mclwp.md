---
currentMenu: milagro-crypto-library-white-paper
---
<div id="generated-toc" class="generate_from_h2"></div>

<header class="col-span">
  <h1 class="title counter-skip"><em>Apache Milagro Crypto Library White Paper</em></h1>
  <div class="authors col-1">
    <div class="author">
      <div>Mike Scott</div>
      <div><a href="http://www.miracl.com/miracl-crypto-labs">MIRACL Labs</a></div>
      <div>Dublin, Ireland</div>
    </div>
    <div class="author">
      <div>-</div>
      <div>-</div>
      <div>-</div>
    </div>
</header>

<div class="abstract">
  <p><em>Abstract</em> — We introduce a new multi-lingual crypto library, specifically designed to support the Internet of Things.</p>
</div>

## 1 Introduction
One of the major mysteries in the real-world of crypto is resistance to the exploitation of new research ideas. Its not that cryptographic research has failed to throw up new ideas that have the potential for commercial exploitation -- far from it. But in the real-world, 1970's crypto rules supreme, and very little happens that isn't PKI/RSA based. The reasons for this are many and varied. However one part of the puzzle might be the non-availability of easy-to-use open source cryptographic tools, that do not require in depth cryptographic expertise to deploy.

There are many crypto libraries out there. Many offer a bewildering variety of cryptographic primitives, at different levels of security. Many use extensive assembly language in order to be as fast as possible. Many are very **BIG**, even bloated. Some rely on other external libraries. Many were designed by academics for academics, and so are not really suitable for commercial use. Many are otherwise excellent, but not written in our favourite language.

The Apache Milagro Crypto Library (AMCL) is different; AMCL is completely self-contained, except for the requirement for an external entropy source for random number generation.

AMCL is portable - there is no assembly language. The original version is written in C, Java, Javascript, Go and Swift using only generic programming constructs, but AMCL is truly multi-lingual, as compatible  versions will be available in many other languages. These versions will be identical in that for the same inputs they will not only produce the same outputs, but all internal calculations will also be the same.

AMCL is fast, but does not attempt to set speed records (a particular academic obsession). There are of course contexts where speed is of the essence; for example for a server farm which must handle multiple SSL connections, and where a 10% speed increase implies the need for 10% less servers, with a a 10% saving on electricity. But in the Internet of Things we would suggest that this is less important. In general the speed is expected to be "good enough". However AMCL is small. Some libraries boast of having hundreds of thousands of lines of code - AMCL has less than 10,000. AMCL takes up the minimum of ROM/RAM resources in order to fit into the smallest possible embedded footprint, consistent with other design constraints. It is expected that this will be vital for implementations that support security in the Internet of Things. AMCL (the C version) only uses stack memory, and is thus natively multi-threaded.

Only one level of security is supported, equivalent to 128-bit AES. This is the current standard level for cryptography that is expected to be unbreakable. As a justification we could not improve on that given by Miele and Lenstra<a href="#m-n-l">2</a>.

_"With 128-bit security more than sufficient for the foreseeable future, it is not clear either what purpose is served by higher security levels, other than catering to TOP SECRET 192-bit security ..... In this context it is interesting to note that 256-bit AES, also prescribed ...... for TOP SECRET, was introduced only to still have a 128-bit secure symmetric cipher in the post-quantum world......, and that 192-bit security was merely a side-effect that resulted from the calculation (128+256)/2 ....... In that world ECC is obsolete anyhow."_

AMCL makes most of the choices for you as to which primitives to use, based on the best available current advice. Specifically it uses AES-128 for symmetric encryption, SHA256 for hashing, 256-bit prime field elliptic curves for public key protocols, and 256-bit BN curves to support pairing-based protocols. However three different parameterizations of Elliptic curve are supported - Weierstrass, Edwards and
Montgomery, as each is appropriate within its own niche.

In each case only the standard projective coordinates are used. But you do get to
choose the actual elliptic curve, with support for three different forms of the modulus. For pairings we assume a modulus congruent to $3 \bmod 8$ with a D-type twist, parameterized by a negative $x$ value<a href="#barreto-naehrig">3</a>. Standard modes of AES are supported, plus GCM mode for authenticated encryption.

The C version of AMCL is configured at compile time for 16, 32 or 64 bit processors, and for a specific elliptic curve. The Java and Javascript versions are (obviously) processor agnostic, but the same choices of elliptic curve are available.

AMCL is written with an awareness of the abilities of modern pipelined processors. In particular there was an awareness that the unpredictable program branch should be avoided at all costs, not only as it slows down the processor, but as it may open the door to side-channel attacks. The innocuous looking ```if``` statement - unless its outcome can be accurately predicted - is the enemy
of quality crypto software.

In the sequel we refer to the C version of AMCL, unless otherwise specified. We emphasis that all AMCL versions are completely self-contained. No external libraries or packages are required to implement all of the supported cryptographic functionality (other than for an external entropy source).

## 2 Context

A crypto library does not function is isolation. The AMCL was originally designed to support the MIRACL Distributed Datacenter Crypto (DDC) platform for cloud providers and device manufacturers. The MIRACL DDC platform in intended to be cloud-based infrastructure agnostic yet support the M-Pin protocols<a href="#mpin">4</a> for MFA and TLS, but which we believe has wider application to novel protocols of particular relevance to the IoT.

This document describes the AMCL library which was originally designed for internal use, but which has now reached a level of maturity where we are pleased to make it available as a service to the wider community as an open source product, under a standard [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0).

## 3 Library Structure

The modules that make up AMCL are shown below, with some indication of how they interact. Several example APIs will be provided to implement common protocols. Note that all interaction with the API is via machine-independent endian-indifferent arrays of bytes (a.k.a. octet strings). Therefore the underlying workings of the library are invisible to the consumer of its services.
<br></br>
<figure>
  <img src="clint.eps.jpg">
  <figcaption>The AMCL Library</figcaption>
</figure>
<br></br>
The symmetric encryption and hashing code, along with the random number generation, is uninteresting, and since we make no claims for it, we will not refer to it again. It was mostly borrowed from our well-known open source (AGPL License) MIRACL library.

## 4 Handling **BIG** Numbers

### 4.1 Representation

One of the major design decisions is how to represent the 256-bit field elements required for the elliptic curve and pairing-based cryptography. Here there are two different approaches.

One is to pack the bits as tightly as possible into computer words. For example on a 64-bit computer 256-bit numbers can be stored in just 4 words. However to manipulate numbers in this form, even for simple addition, requires handling of carry bits if overflow is to be avoided, and a high-level language does not have direct access to carry flags. It is possible to emulate the flags, but this would be inefficient. In fact this approach is only really suitable for an assembly language implementation.

The alternative idea is to use extra words for the representation, and then try to offset the additional cost by taking full advantage of the "spare" bits in every word. This idea follows a "corner of the literature" [@bernstein-chuengsatiansup-lange] which has been promoted by Bernstein and his collaborators in several publications. Refer to figure [#words], where each digit of the representation is stored as a signed integer which is the size of the processor word-length.

Note that almost all arithmetic takes place modulo a 256-bit prime number, the modulus representing the field over which the elliptic curve is defined, here denoted as $p$.

On 64-bit processors, AMCL represents numbers to the base $2^{56}$ in a 5 element array, the Word Excess is 7 bits, and for a 256-bit modulus the Field Excess is 24 bits.

On 32-bit processors, AMCL represents numbers to the base $2^{29}$ in a 9 element array, the Word Excess is 2 bits, and for a 256-bit modulus the Field Excess is 5 bits.

On 16-bit processors, AMCL represents numbers to the base $2^{13}$ in a 20 element array, the Word Excess is 2 bits, and for a 256-bit modulus the Field Excess is 4 bits.

Such a representation of a 256-bit number is referred to as a **BIG**. Addition or subtraction of a pair of **BIG**s, results in another **BIG**.

The Java version uses exactly the same 32-bit representation as above.

For Javascript (where all numbers are stored as 64-bit floating point with a 52-bit mantissa, but mostly manipulated as 32-bit integers), numbers are represented to the base $2^{24}$ in an 11 element array, the Word Excess is 7 bits, and the Field Excess for a 256-bit modulus is 8 bits.

### 4.2 Addition and Subtraction

The existence of a word excess means for example that multiple field elements can be added together digit by digit, without processing of carries, before overflow can occur.

Only occasionally will there be a requirement to _normalize_ these _extended_ values, that is to force them back into the original format. Note that this is independent of the modulus.

The existence of a field excess means that, independent of the word excess, multiple field elements can be added together before it is required to reduce the sum with respect to the modulus. In the literature this is referred to as lazy, or delayed, reduction. In fact we allow the modulus to be as small as 254 bits, which obviously increases the field excess.

Note that these two mechanisms associated with the word excess and the field excess (often confused in the literature) operate largely independently of each other.

AMCL has no support for negative numbers. Therefore subtraction will be implemented as field negation followed by addition. Negation is performed using the method described as Option 1 in [@aranha-karabina-longa-gebotys-lopez]. Basically the number of the active bits in the field excess of the number to be negated is determined, the modulus is shifted left by this amount plus one, and the value to be negated is subtracted from this value.

Note that because of the "plus 1", this will always produce a positive result at the cost of eating a bit into the field excess.
<br></br>
<figure>
  <img src="words.eps.jpg">
  <figcaption>small 256-bit number representation</figcaption>
</figure>
<br></br>
Normalization of extended numbers requires the word excess of each digit to be shifted right by the number of base bits, and added to the next digit, working right to left. Note that when numbers are subtracted digit-by-digit individual digits may become negative. However since we are avoiding using the sign bit, due to the magic of 2's complement arithmetic, this all works fine without any conditional branches.

Reduction of unreduced **BIG** numbers is carried out using a simple shift-compare-and-subtract of the modulus, with one subtraction needed on average half of the time for every active bit in the field excess. Hopefully such reductions will rarely be required, as they are slow and involve unpredictable program branches.

Since the length of field elements is fixed at compile time, it is expected that the compiler will unroll most of the time-critical loops. In any case the conditional branch required at the foot of a fixed-size loop can be accurately predicted by modern hardware.

The problem now is to decide when to normalize and when to reduce numbers to avoid the possibility of overflow. There are two ways of doing this. One is to monitor the excesses at run-time and act when the threat of overflow arises. The second is to do a careful analysis of the code and insert normalization and reduction code at points where the possibility of overflow may arise, based on a static worst-case
analysis.

The field excess $E_n$ of a number $n$ is easily captured by a simple masking and shifting of the top word. If two normalized numbers $a$ and $b$ are to be added then the excess of their sum will be at worst $E_a + E_b +1$. As long as this is less than $2^{FE}$ where $FE$ is the field excess, then we are fine. Otherwise both numbers should be reduced prior to the addition.

In AMCL these checks are performed at run-time. However, as we shall see, in practice these reductions are very rarely required. So the ```if``` statement used to control them is highly predictable. Observe that even in the worst case, for a 16-bit implementation, the excess is a generous $FE=4$, and so many elements can be added or subtracted before reduction is required.

The worst case word excess for the result of a calculation is harder to calculate at run time, as it would require inspection of every digit of every **BIG**. This would slow computation down to an unacceptable extent. Therefore in this case we use static analysis and insert normalization code where we know it might be needed. This process was supported by special debugging code that warned of places where overflow was possible, based on a simple worst-case analysis.

### 4.3 Multiplication and Reduction

To support multiplication of **BIG**s, we will require a double-length ***DBIG*** type. Also the partial products that arise in the process of long multiplication will require a double-length data type. Fortunately many popular C compilers, like Gnu GCC, always support an integer type that is double the native word-length. For Java the "int" type is 32-bits and there is a double-length "long" type which is 64-bit. Of course for Javascript a double length type is not possible, and so the partial products must be accommodated within the 52-bit mantissa.

It is generally accepted that the fastest way to do multi-precision multiplication is to accumulate the double-length partial products that contribute to each column in the classic school-boy long multiplication algorithm, also known as the Comba method. Then at the foot of the column the total is split into the sum for that column, and the carry to the next column, working right-to-left.

If the numbers are normalized prior to the multiplication, then with the word excesses that we have chosen, this will not result in overflow. The **DBIG** product will be automatically normalized as a result of this process. Squaring can be done in a similar fashion, but only requires just over half of the number of partial products, and so it may be somewhat faster.

The **DBIG** value that results from a multiplication or squaring may be immediately reduced with respect to the modulus to bring it back to a **BIG**. However again we may choose to delay this reduction, and therefore we need the ability to safely add and subtract **DBIG** numbers while again avoiding overflow.

The method used for full reduction of a **DBIG** back to a **BIG** depends on the form of the modulus. We choose to support three distinct types of modulus, (a) pseudo Mersenne of the form $2^n-c$ where $c$ is small and $n$ is the size of the modulus in bits,(b) Montgomery-friendly of the form $k.2^n-1$, and (c) moduli of no special form. For cases (b) and (c) we convert all field elements to Montgomery's _n_\/-residue form, and use Montgomery's fast method for modular reduction [@montgomery].

In all cases the **DBIG** number to be reduced $y$ must be in the range $0<y<pR$ (a requirement of Montgomery's method), and the result $x$ is guaranteed to be in the range $0<x<2p$, where $R=2^{256+FE}$ for a 256-bit modulus. Note that the **BIG** result will be (nearly) fully reduced. The fact than we allow $x$ to be larger than $p$ means that we can avoid the notorious Montgomery "final subtraction" [@montgomery].

Observe how unreduced numbers involved in complex calculations tend to be (nearly fully) reduced if they are involved in a modular multiplication. So for example if field element $x$ has a large field excess, and if we calculate $x=x.y$, then as long as the unreduced product is less than $pR$, the result will be a nearly fully reduced $x$. So in many cases there is a natural tendency for field excesses not to grow without limit, and not to overflow, without requiring explicit action on our part.

Consider now a sequence of code that adds, subtracts and multiplies field elements, as might arise in elliptic curve additions and doublings. Assume that the code has been analyzed and that normalization code has been inserted where needed. Assume that the reduction code that activates if there is a possibility of an element overflowing its field excess, while present, never in fact is triggered (due to the behavior described above).

Then we assert that there is only one possible place in which an unpredicted branch may occur. This will be in the negation code associated with a subtraction, where the number of bits in the field excess must be counted. However we would point out that some architectures do now support machine code instructions that count the number of active bits in a computer register - although unfortunately this capability is not supported by the typical high-level language syntax.

## 5 Extension Field arithmetic

To support cryptographic pairings we will need support for extension fields. We use a towering of extensions, from from $F_p$ to $F_p$<sup>2</sup> to $F_p$<sup>4</sup> to $F_p$<sup>12</sup> as required for BN curves [@barreto-naehrig]. An element of the quadratic extension field will be represented as $f=a+ib$, where $i$ is the square root of the quadratic non-residue -1. To add, subtract and multiply them we use the obvious methods.

However for negation we can construct $-f=-a-ib$ as $b-(a+b)+i.(a-(a+b)$ which requires only one base field negation. A similar idea can be used recursively for higher order extensions, so that only one base field negation is ever required.

## 6 Elliptic Curves

Three types of Elliptic curve are supported for the implementation of Elliptic Curve Cryptography (ECC), but curves are limited to popular families that support faster implementation. Weierstrass curves are supported using the Short Weierstrass representation:-

$$y^2=x^3+Ax+B$$

where $A=0$ or $A=-3$. Edwards curves are supported using both regular
and twisted Edwards format:-

$$Ax^2+y^2=1+Bx^2y^2$$

where $A=1$ or $A=-1$. Montgomery curves are represented as:-

$$y^2=x^3+Ax^2+x$$

where $A$ must be small.

In the particular case of elliptic curve point multiplication, there are potentially a myriad of very dangerous side-channel attacks that arise from using the classic double-and-add algorithm and its variants. Vulnerabilities arise if branches are taken that depend on secret bits, or if data is even accessed using secret values as indices. Many types of counter-measures have been suggested. The simplest solution is to use a constant-time algorithm like the Montgomery ladder, which has a very simple structure, uses very little  memory and has no key-bit-dependent branches.

If using a Montgomery representation of the elliptic curve the Montgomery ladder [@montgomery2] is in fact the optimal algorithm for point multiplication. For other representations we use a fixed-sized signed window method, as described in [@bos-costello-longa-naehrig]. AMCL has built-in support for most standardized elliptic curves, along with many curves that have been proposed for standardization at our chosen level of security.

Specifically it supports the NIST curve [@certicom], [@nist], the well known Curve25519 [@bernstein], the 256-bit Brainpool curve [@brainpool], the ANSSI curve [@ANSSI], and four NUMS (Nothing-Up-My-Sleeve) curves proposed by Bos et al. [@bos-costello-longa-naehrig]. Some of these proposals support only a Weierstrass representation, but many also allow an Edwards and Montgomery form. Tools are provided to allow easy integration of more curves.

## 7 Support for classic Finite Field Methods

Before Elliptic Curves, cryptography depended on methods based on simple finite fields. The most famous of these would be the well known RSA method. These methods have the advantage of being effectively parameterless, and therefore the issue of trust in parameters that arises for elliptic curves, is not an issue.

However these methods are subject to index calculus based methods of cryptanalysis, and so fields and keys are typically much larger. So how to support for example a 2048-bit implementation of RSA based on a library designed for optimized 256-bit operations? The idea is simple; use AMCL as a virtual 256-bit machine, and build 2048-bit arithmetic on top of that.

And to claw back some decent performance use the Karatsuba method [@knuth] so that for example 2048-bit multiplication recurses efficiently right down to 256-bit operations. Of course the downside of the Karatsuba method is that while it saves on multiplications, the number of additions and subtractions is greatly increased.  However the existence of generous word excesses in our representation makes this less of a problem, as most additions can be carried out without normalization.

Secret key operations like RSA decryption use the Montgomery ladder to achieve side-channel-attack resistance.

The implementation can currently support $1024.2^n$ bit fields, so for example 2048-bit RSA can be used to get reasonably close to the AES-128-bit level of security, and if desired 4096 bit RSA can be used to comfortably exceed it.

Note that this code is supported independently of the elliptic curve code. So for example RSA and ECC can be run together within a single application.

However we regard these methods as "legacy" as in our view ECC based methods are a much better fit for the IoT.

## 8 Multi-Lingual support

It is a **BIG** ask to develop and maintain multiple versions of a crypto library written in radically different languages such as C, Java, Javascript, Go and Swift. This has discouraged the use of language specific methods (which are in any case of little relevance here), and strongly encouraged the use of simple, generic computer language constructs.

This approach brings a surprising bonus: AMCL can be automatically converted to many other languages using available translator tools. For example Tangible Software Solutions [@tss] market a Java to C# converter. This generated an efficient fully functional C# version of AMCL within minutes. The same company market a Java to Visual Basic converter.

Google have a Java to Objective C converter [@gol] specifically designed to convert Android apps developed in Java, to iOS apps written in Objective C.

Of course not all languages can be supported in this way, so support for some will be developed manually. In particular a Rust version is currently under development.

## 9 Discussion

We found in our code that, with few exceptions, reductions due to possible overflow of the field excess of a **BIG** were very rare, especially for the 64-bit version of the library. Similarly normalization was rarely needed for the 64-bit code. This is due to the much greater excesses that apply in the 64-bit representation. In some experiments we calculated thousands of random pairings, and reduction due to field excess overflow detection never happened.

In general in developing AMCL we tried to use optimal methods, without going to what we (very subjectively) regarded as extremes in order to maximize performance.  Algorithms that require less memory were generally preferred if the impact on performance was not large. Some optimizations, while perfectly valid, are hard to implement without having a significant impact on program readability and maintainability. Deciding which optimizations to use and which to reject (on the grounds of code size and negative impact on code
readability and maintainability) is admittedly rather arbitrary!

One notable omission from AMCL is the use of pre-computation on fixed parameters in order to speed up certain calculations. We try to justify this, rather unconvincingly, by pointing out that pre-computation must of necessity increase code size. Furthermore such methods are more sensitive to side-channel attacks and much of their speed advantage will be lost if they are to be fully side-channel protected. Also pre-computation on secret values clearly increases the amount of secret data that needs to be protected.

However the development roadmap view might change in later versions depending on the project supporters in-the-field experiences of using AMCL.

## REFERENCES
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

<h2>Some Common Mistakes</h2>
<ul>
  <li>The word <q>data</q> is plural, not singular.</li>
  <li>The subscript for the permeability of vacuum μ0, and other common scientific constants, is zero with subscript formatting, not a lowercase letter <q>o</q>.</li>
  <li>In American English, commas, semi-/colons, periods, question and exclamation marks are located within quotation marks only when a complete thought or name is cited, such as a title or full quotation. When quotation marks are used, instead of a bold or italic typeface, to highlight a word or phrase, punctuation should appear outside of the quotation marks. A parenthetical phrase or statement at the end of a sentence is punctuated outside of the closing parenthesis (like this). (A parenthetical sentence is punctuated within the parentheses.)</li>
  <li>A graph within a graph is an <q>inset</q>, not an <q>insert</q>. The word alternatively is preferred to the word <q>alternately</q> (unless you really mean something that alternates).</li>
  <li>Do not use the word <q>essentially</q> to mean <q>approximately</q> or <q>effectively</q>.</li>
  <li>In your paper title, if the words <q>that uses</q> can accurately replace the word <q>using</q>, capitalize the <q>u</q>; if not, keep using lower-cased.</li>
  <li>Be aware of the different meanings of the homophones <q>affect</q> and <q>effect</q>, <q>complement</q> and <q>compliment</q>, <q>discreet</q> and <q>discrete</q>, <q>principal</q> and <q>principle</q>.</li>
  <li>Do not confuse <q>imply</q> and <q>infer</q>.</li>
  <li>The prefix <q>non</q> is not a word; it should be joined to the word it modifies, usually without a hyphen.</li>
  <li>There is no period after the <q>et</q> in the Latin abbreviation <q>et al.</q>.</li>
  <li>The abbreviation <q>i.e.</q> means <q>that is</q>, and the abbreviation <q>e.g.</q> means <q>for example</q>.</li>
</ul>

<h1>Using the Template</h1>
<p>After the text edit has been completed, the paper is ready for the template. Duplicate the template file by using the Save As command, and use the naming convention prescribed by your conference for the name of your paper. In this newly created file, highlight all of the contents and import your prepared text file. You are now ready to style your paper; use the scroll down window on the left of the MS Word Formatting toolbar.</p>

<h2>Authors and Affiliations</h2>
<p>The template is designed so that author affiliations are not repeated each time for multiple authors of the same affiliation. Please keep your affiliations as succinct as possible (for example, do not differentiate among departments of the same organization). This template was designed for two affiliations.</p>

<ol>
  <li><em>For author/s of only one affiliation (Heading 3):</em> To change the default, adjust the template as follows.
    <ol>
      <li><em>Selection (Heading 4):</em> Highlight all author and affiliation lines.</li>
      <li><em>Change number of columns:</em> Select the Columns icon from the MS Word Standard toolbar and then select <q>1 Column</q> from the selection palette.</li>
      <li><em>Deletion:</em> Delete the author and affiliation lines for the second affiliation.</li>
    </ol>
  </li>
  <li><em>For author/s of more than two affiliations:</em> To change the default, adjust the template as follows.
    <ol>
      <li><em>Selection:</em> Highlight all author and affiliation lines.</li>
      <li><em>Change number of columns:</em> Select the <q>Columns</q> icon from the MS Word Standard toolbar and then select <q>1 Column</q> from the selection palette.</li>
      <li><em>Highlight author and affiliation lines of affiliation 1 and copy this selection.</em></li>
      <li><em>Formatting:</em> Insert one hard return immediately after the last character of the last affiliation line. Then paste down the copy of affiliation 1. Repeat as necessary for each additional affiliation.</li>
      <li><em>Reassign number of columns:</em> Place your cursor to the right of the last character of the last affiliation line of an even numbered affiliation (e.g., if there are five affiliations, place your cursor at end of fourth affiliation). Drag the cursor up to highlight all of the above author and affiliation lines. Go to Column icon and select <q>2 Columns</q>. If you have an odd number of affiliations, the final affiliation will be centered on the page; all previous will be in two columns.</li>
    </ol>
  </li>
</ol>

<h2>Identify the Headings</h2>
<p>Headings, or heads, are organizational devices that guide the reader through your paper. There are two types: component heads and text heads.</p>
<p>Component heads identify the different components of your paper and are not topically subordinate to each other. Examples include Acknowledgments and References and, for these, the correct style to use is <q>Heading 5</q>. Use <q>figure caption</q> for your Figure captions, and <q>table head</q> for your table title. Run- in heads, such as <q>Abstract</q>, will require you to apply a style (in this case, italic) in addition to the style provided by the drop down menu to differentiate the head from the text.</p>
<p>Text heads organize the topics on a relational, hierarchical basis. For example, the paper title is the primary text head because all subsequent material relates and elaborates on this one topic. If there are two or more sub-topics, the next level head (uppercase Roman numerals) should be used and, conversely, if there are not at least two sub-topics, then no subheads should be introduced. Styles named <q>Heading 1</q>, <q>Heading 2</q>, <q>Heading 3</q>, and <q>Heading 4</q> are prescribed.</p>

<h2>Figures and Tables</h2>
<ol>
  <ol>
    <li><em>Positioning Figures and Tables:</em> Place figures and tables at the top and bottom of columns. Avoid placing them in the middle of columns. Large figures and tables may span across both columns. Figure captions should be below the figures; table heads should appear above the tables. Insert figures and tables after they are cited in the text. Use the abbreviation <q>Fig. 1</q>, even at the beginning of a sentence.</li>
  </ol>
</ol>

<table style="margin-bottom: 0;">
  <thead>
    <tr>
      <th rowspan="2">Table<br>Head</th>
      <th colspan="3">Table Column Head</th>
    </tr>
    <tr>
      <th><em>Table column subhead</em></th>
      <th><em>Subhead</em></th>
      <th><em>Subhead</em></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>copy</td>
      <td>More table copy<sup>a</sup></td>
      <td></td>
      <td></td>
    </tr>
  </tbody>
  <caption>Table Type Styles</caption>
</table>
<div style="text-align: right; font-size: 9pt;"><sup>a</sup>Sample of a Table footnote. (<em>Table footnote</em>)</div>

<figure>
  <figcaption>Example of a figure caption. (figure caption)</figcaption>
  <div style="border: 1px solid #000; height: 110px; margin-top: 6px;"></div>
</figure>
<br></br>

<figure>
  <img src="amcl0x.png">
  <figcaption>Example Figure</figcaption>
</figure>
<br></br>



|Alice - identity $ID_a$|Server|
|:----------------------:|:----------------------:|
|Generates random $x<q$|Generates random $y<q$|
|$A=H(ID_a)$||
|$U=x{A}$||
|$ID_a$, $U~~ \rightarrow  $||
| |$\leftarrow y$|
|$V=-(x+y){((s-\alpha)A+\alpha A)} \rightarrow$||
| |$A=H(ID_a)$|
| |$g=e(V,Q).e(U+yA,sQ)$|
| |if $g \ne 1$, reject the connection|

<figcaption>Example of a figure caption. (figure caption)</figcaption>
<br></br>

<p>Figure Labels: Use 8 point Times New Roman for Figure labels. Use words rather than symbols or abbreviations when writing Figure axis labels to avoid confusing the reader. As an example, write the quantity <q>Magnetization</q>, or <q>Magnetization, M</q>, not just <q>M</q>. If including units in the label, present them within parentheses. Do not label axes only with units. In the example, write <q>Magnetization (A/m)</q> or <q>Magnetization {A[m(1)]}</q>, not just <q>A/m</q>. Do not label axes with a ratio of quantities and units. For example, write <q>Temperature (K)</q>, not <q>Temperature/K</q>.</p>

<h5>Acknowledgment <em>(Heading 5)</em></h5>
<p>The preferred spelling of the word <q>acknowledgment</q> in America is without an <q>e</q> after the <q>g</q>. Avoid the stilted expression <q>one of us (R. B. G.) thanks ...</q>. Instead, try <q>R. B. G. thanks...</q>. Put sponsor acknowledgments in the unnumbered footnote on the first page.</p>

<h5 class="references">References</h5>
<p>The template will number citations consecutively within brackets <a href="#eason55">1</a>. The sentence punctuation follows the bracket <a href="#maxwell1892">2</a>. Refer simply to the reference number, as in <a href="#jacobs63">3</a>—do not use <q>Ref. <a href="#jacobs63">3</a></q> or <q>reference <a href="#jacobs63">3</a></q> except at the beginning of a sentence: <q>Reference <a href="#jacobs63">3</a> was the first ...</q></p>
<p>Number footnotes separately in superscripts. Place the actual footnote at the bottom of the column in which it was cited. Do not put footnotes in the reference list. Use letters for table footnotes.</p>
<p>Unless there are six authors or more give all authors’ names; do not use <q>et al.</q>. Papers that have not been published, even if they have been submitted for publication, should be cited as <q>unpublished</q> <a href="#elissa">4</a>. Papers that have been accepted for publication should be cited as <q>in press</q> <a href="#nicole">5</a>. Capitalize only the first word in a paper title, except for proper nouns and element symbols.</p>
<p>For papers published in translation journals, please give the English citation first, followed by the original foreign-language citation <a href="#yorozu87">7</a>.</p>

|Alice - identity $ID_a$|Server|
|:----------------------:|:----------------------:|
|Generates random $x<q$|Generates random $y<q$|
|$A=H(ID_a)$||
|$U=x{A}$||
|$ID_a$, $U~~ \rightarrow  $||
| |$\leftarrow y$|
|$V=-(x+y){((s-\alpha)A+\alpha A)} \rightarrow$||
| |$A=H(ID_a)$|
| |$g=e(V,Q).e(U+yA,sQ)$|
| |if $g \ne 1$, reject the connection|
<table>
  <caption>M-Pin</caption>
</table>
<br></br>

## REFERENCES
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

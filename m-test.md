---
currentMenu: m-test
---

Welcome to Markdeep. It's the simple way to write plain text with
_style_. From http://casual-effects.com/markdeep.


Section
===============================================================================

Subsection
-------------------------------------------------------------------------------
<markdeep>
**Bibliography**:
[#Kajiya86]: James T. Kajiya. 1986. The Rendering Equation.
In _Proceedings of Computer Graphics and Interactive Techniques
(SIGGRAPH '86)_, ACM, 143-150. http://dx.doi.org/10.1145/15922.15902
</markdeep>
<br></br>

<markdeep>
[^syntax]: Endnotes look like reference-style links with an empty text
field. Endnotes may not contain multiple paragraphs (sorry, David
Foster Wallace), although they may refer to _other_ endnotes.
</markdeep>
<br></br>


<markdeep>
LaTeX and other languages that use dollar signs work fine inside code
fences:

````````````````````````````````````
$ \int_0^1 x^2 dx $

$$$a = $$$e

````````````````````````````````````
</markdeep>
<br></br>

<markdeep>
Basic Formatting
=======================================================================================
Text formatting:

    Source                               |     Result
-----------------------------------------|------------------------------
`**bold**`                               | **bold**
`__bold__`                               | __bold__
`*italic*`                               | *italic*
`_italic_`                               | _italic_
`~~strikethrough~~`                      | ~~strikethrough~~
<code>`inline code`</code>               | `inline code`
`5 kg/m^3`                               | 5 kg/m^3

</markdeep>
<br></br>

$$y^2=x^3+Ax+B$$

where $A=0$ or $A=-3$. Edwards curves are supported using both regular
and twisted Edwards format:-

$$Ax^2+y^2=1+Bx^2y^2$$

where $A=1$ or $A=-1$. Montgomery curves are represented as:-

$$y^2=x^3+Ax^2+x$$

where $A$ must be small.

<script>window.markdeepOptions = {mode: 'html'};</script>
<script src="markdeep.min.js"></script>
<script src="https://casual-effects.com/markdeep/latest/markdeep.min.js"></script>

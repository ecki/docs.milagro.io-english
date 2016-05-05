---
currentMenu: m-test
---

Welcome to Markdeep. It's the simple way to write plain text with
_style_. From http://casual-effects.com/markdeep.

<markdeep>
Section
===============================================================================

Subsection
-------------------------------------------------------------------------------

**Bibliography**:
[#Kajiya86]: James T. Kajiya. 1986. The Rendering Equation.
In _Proceedings of Computer Graphics and Interactive Techniques
(SIGGRAPH '86)_, ACM, 143-150. http://dx.doi.org/10.1145/15922.15902

[^syntax]: Endnotes look like reference-style links with an empty text
field. Endnotes may not contain multiple paragraphs (sorry, David
Foster Wallace), although they may refer to _other_ endnotes.
<markdeep>

$$y^2=x^3+Ax+B$$

where $A=0$ or $A=-3$. Edwards curves are supported using both regular
and twisted Edwards format:-

$$Ax^2+y^2=1+Bx^2y^2$$

where $A=1$ or $A=-1$. Montgomery curves are represented as:-

$$y^2=x^3+Ax^2+x$$

where $A$ must be small.
<script>window.markdeepOptions = {mode: 'html'};</script>
<script src="markdeep.min.js"></script>

---
currentMenu: m-test
layout: markdeep
---

Welcome to Markdeep. It's the simple way to write plain text with
_style_. From http://casual-effects.com/markdeep.


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


<markdeep>
**Bibliography**:
[#Kajiya86]: James T. Kajiya. 1986. The Rendering Equation.
In _Proceedings of Computer Graphics and Interactive Techniques
(SIGGRAPH '86)_, ACM, 143-150. http://dx.doi.org/10.1145/15922.15902

</markdeep>
<br></br>


<markdeep>
Maine | Iowa | Colorado
-------|------|----------
  1   |  4   |   10
 ME   |  IA  |   CO
Blue  | Red  | Brown
[Optional caption]


Maine | Iowa | Colorado
-------|------|----------
  1   |  4   |   10
 ME   |  IA  |   CO
Blue  | Red  | Brown
[Table [states]: Caption with label.]


With alignment:

Item | Type | Cost
---- |:----:| ----:
Fish |  F   | 1.00
Axe  |  W   | 3.25
Gold |  I   |20.50

</markdeep>
<br></br>


<diagram>

A         B         C
*-------->o<------->o
^        / ^        |
|       v   \       v
o----->o---->o<---->*
D      E     F      G

</diagram>
<br></br>


<markdeep>
If the schedule is sufficiently long and dense, a calendar preview
is shown before it. Formatted schedule lists
look like:

Tuesday Feb 16, 2016: Project Launch
 - Create specifications
 - Initialize revision control system

Friday Feb 19, 2016: Build Milestone
 - Build system fully functional
 - Placeholder unit tests committed

 _Plan for weekend overtime if we miss this milestone_

Wednesday Feb 24, 2016: Site Visit
 **Whole team vistits client**. Dress appropriately.

Friday Feb 26, 2016: Demo Milestone
 - Internal demonstrations for management
 - QA reports due

Tuesday Feb 29, 2016: Code Freeze
 - Commit final features before this date
 - Only priority 1 fixes with issue tracking numbers
   after this point

Monday November 18, 2016: ApacheCon Europe

Monday Mar 7, 2016: Beta

Wednesday Mar 16, 2016: Gold

</markdeep>
<br></br>


<diagram>

.---.       .-.        .-.       .-.                                       .-.              
| A +----->| 1 +<---->| 2 |<----+ 4 +------------------.                  | 8 |             
'---'       '-'        '+'       '-'                    |                  '-'              
                       |         ^                     |                   ^               
                       v         |                     v                   |               
                      .-.      .-+-.        .-.      .-+-.      .-.       .+.       .---.  
                     | 3 +---->| B |<----->| 5 +---->| C +---->| 6 +---->| 7 |<---->| D |  
                      '-'      '---'        '-'      '---'      '-'       '-'       '---'  

</diagram>
<br></br>


<markdeep>
Multiple Columns
========================================================================
<div style="columns:2;-webkit-columns:2;-moz-columns:2;column-gap:3em;-webkit-column-gap:3em;-moz-column-gap:3em">
You can use the CSS
[columns](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Columns/Using_multi-column_layouts)
style to make an HTML multicolumn block. Then, just use regular Markdeep within it and the
browser will automatically apply your multicolumn layout.

Browsers are even smart enough to break the columns correctly when
printing to PDF or to a printer. However, for a long document the
multiples columns don't work well when displayed on screen. There are
no discrete pages in that case to break columns. So, the browser will
make each column as long as the entire document, which is probably not
what you want.

So, multi-column only works well if you know that you have very short
sections (as in this example), or if you were planning on printing to
separate pages when done.
</div>
</markdeep>
<br></br>


<markdeep>
$$ \Lo(X, \wo) = \Le(X, \wo) + \int_\Omega \Li(X, \wi) ~ f_X(\wi, \wo) ~ | \n \cdot \wi | ~ d\wi $$

You can also use LaTeX equation syntax directly to obtain numbered
equations:

\begin{equation}
e^{i \pi} + 1 = 0
\end{equation}

\begin{equation}
\mathbf{A}^{-1}\vec{b} = \vec{x}
\end{equation}

\begin{equation}
\mbox{ALICE} & \mbox{BOB} \\
x \in \mathbb{Z}_{q}^{*} & \\
AG1 := H_{1}(IdA) & \\
PaG_{1} := x\cdot AG_{1} & \\
IdA, PaG_{1} \longrightarrow & \\
&  y,w \in \mathbb{Z}_{q}^{*}\\
&  AG_{1} := H_{1}(IdA)\\
&  BG_{2} := H_{2}(IdB)\\
& PbG_{2} := y\cdot BG_{2}\\
& PgG_{1} := w\cdot AG_{1}\\
& pia := H_{q}(PaG_{1}\| PbG_{2} \| PgG_{1}\|IdB)\\
& pib := H_{q}(PbG_{2}\|PaG_{1} \|PgG_{1}\| IdA)\\
& k:=e(pia\cdot AG_{1}+PaG_{1},(y+pib)\cdot s \cdot BG_{2})\\
& K:=H(k,w\cdot PaG_{1})\\
& \longleftarrow IdB, PgG_{1}, PbG_{2}\\
BG_{2} := H_{2}(IdB) & \\
pia := H_{q}(PaG_{1}\| PbG_{2} \| PgG_{1}\|IdB) & \\
pib := H_{q}(PbG_{2}\|PaG_{1} \|PgG_{1}\| IdA) & \\
k := e((x+pia)\cdot s \cdot AG_{1}, pib\cdot BG_{2} + PbG_{2}) & \\
K := H(k,x\cdot PgG_{1}) & \\
\end{equation}

If you don't have equations in your document, then Markdeep won't
connect to the MathJax server. Either way, it runs MathJax after
processing the rest of the document, so there is no delay.

Markdeep is smart enough to distinguish non-math use of dollar signs,
such as $2.00 and $4.00, US$5, and 3$. Inline
math requires consistent spaces (or punctuation) either outside or inside
of the LaTeX dollar signs to distinguish them them from
regular text usage. Thus, the following all work:

- $x^2$
- $ x^2 $
- ($x^2$)
- ($ x^2 $)
- Variable $x^2$,
- Variable $ x^2 $

Unless you've changed out the default MathJax processor, you can define
your own LaTeX macros by executing `\newcommand` within dollar signs,
just as you would in LaTeX.  Markdeep provides a handful of commands
defined this way by default because they're things that I frequently
need:

   Code            |   Symbol
-------------------|------------
 `\O(n)`           |  $\O(n)$
 `\mathbf{M}^\T`   |  $\mathbf{M}^\T$
 `45\degrees`      |  $45\degrees$
 `x \in \Real`     |  $x \in \Real$
 `x \in \Integer`  |  $x \in \Integer$
 `x \in \Boolean`  |  $x \in \Boolean$
 `x \in \Complex`  |  $x \in \Complex$
 `\n`              |  $\n$
 `\w`              |  $\w$
 `\wo`             |  $\wo$
 `\wi`             |  $\wi$
 `\wh`             |  $\wh$
 `\Li`             |  $\Li$
 `\Lo`             |  $\Lo$
 `\Lr`             |  $\Lr$
 `\Le`             |  $\Le$


# ATX Headers
In addition to the underlined headers, you can also use ATX-style
headers, with multiple # signs:

## H2
### H3
#### H4
##### H5
###### H6
Although: do you really need six levels of subsection nesting?!
</markdeep>
<br></br>



<script>window.markdeepOptions = {mode: 'html'};</script>
<script src="markdeep.min.js"></script>
<script src="https://casual-effects.com/markdeep/latest/markdeep.min.js"></script>

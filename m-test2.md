---
currentMenu: m-test2
layout: markdeep
---

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


<markdeep>

$$ \Lo(X, \wo) = \Le(X, \wo) + \int_\Omega \Li(X, \wi) ~ f_X(\wi, \wo) ~ | \n \cdot \wi | ~ d\wi $$

</markdeep>
<br></br>


You can also use LaTeX equation syntax directly to obtain numbered
equations:

</markdeep>

|Alice|Bob|
|:----------------------:|:----------------------:|
|\begin{equation}x \in \mathbb{Z}_{q}^{*}\end{equation}||
|\begin{equation}AG1 := H_{1}(IdA)\end{equation}||
|\begin{equation}PaG_{1} := x\cdot AG_{1}\end{equation}||
|\begin{equation}IdA, PaG_{1} \longrightarrow\end{equation}||
| |\begin{equation}y,w \in \mathbb{Z}_{q}^{*}\end{equation}|



|AG1 := H_{1}(IdA)||
|$U=x{A}$||
|$ID_a$, $U~~ \rightarrow  $||
| |$\leftarrow y$|
|$V=-(x+y){((s-\alpha)A+\alpha A)} \rightarrow$||
| |$A=H(ID_a)$|
| |$g=e(V,Q).e(U+yA,sQ)$|
| |if $g \ne 1$, reject the connection|


\begin{matrix}
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
\end{matrix}

</markdeep>
<br></br>

<script>window.markdeepOptions = {mode: 'html'};</script>
<script src="markdeep.min.js"></script>
<script src="https://casual-effects.com/markdeep/latest/markdeep.min.js"></script>

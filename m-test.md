---
currentMenu: m-test
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


<script>window.markdeepOptions = {mode: 'html'};</script>
<script src="markdeep.min.js"></script>
<script src="https://casual-effects.com/markdeep/latest/markdeep.min.js"></script>

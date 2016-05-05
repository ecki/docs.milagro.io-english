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


<markdeep>
*************************************************************************************************
*.-------------------.                           ^                      .---.                   *
*|    A Box          |__.--.__    __.-->         |                      |   |                   *
*|                   |        '--'               v                      |   |                   *
*'-------------------'                                                  |   |                   *
*                       Round                                       *---(-. |                   *
*  .-----------------.  .-------.    .----------.         .-------.     | | |                   *
* |   Mixed Rounded  | |         |  / Diagonals  \        |   |   |     | | |                   *
* | & Square Corners |  '--. .--'  /              \       |---+---|     '-)-'       .--------.  *
* '--+------------+-'  .--. |     '-------+--------'      |   |   |       |        / Search /   *
*    |            |   |    | '---.        |               '-------'       |       '-+------'    *
*    |<---------->|   |    |      |       v                Interior                 |     ^     *
*    '           <---'      '----'   .-----------.              ---.     .---       v     |     *
* .------------------.  Diag line    | .-------. +---.              \   /           .     |     *
* |   if (a > b)     +---.      .--->| |       | |    | Curved line  \ /           / \    |     *
* |   obj->fcn()     |    \    /     | '-------' |<--'                +           /   \   |     *
* '------------------'     '--'      '--+--------'      .--. .--.     |  .-.     +Done?+-'      *
*    .---+-----.                        |   ^           |\ | | /|  .--+ |   |     \   /         *
*    |   |     | Join                   |   | Curved    | \| |/ | |    \    |      \ /          *
*    |   |     +---->  |                 '-'  Vertical  '--' '--'  '--  '--'        +  .---.    *
*    '---+-----'       |                                                            |  | 3 |    *
*                      v                             not:line    'quotes'        .-'   '---'    *
*                  .---+--------.            /            A || B   *bold*       |        ^      *
*                 |   Not a dot  |      <---+---<--    A dash--is not a line    v        |      *
*                  '---------+--'          /           Nor/is this.            ---              *
*************************************************************************************************

</markdeep>
<br></br>



<markdeep>
                                                   *****************************
1. Monday                                          *   A         B         C   *
2. Tuesday                                         *   *-------->o<------->o   *
  1. Morning                                       *   ^        / ^        |   *
  2. Afternoon                                     *   |       v   \       v   *
3. Wednesday                                       *   o----->o---->o<---->*   *
  - Bullets                                        *   D      E     F      G   *
  - Bullets                                        *****************************
4. Thursday
5. Friday

</markdeep>
<br></br>




<script>window.markdeepOptions = {mode: 'html'};</script>
<script src="markdeep.min.js"></script>
<script src="https://casual-effects.com/markdeep/latest/markdeep.min.js"></script>

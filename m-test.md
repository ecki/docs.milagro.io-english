---
currentMenu: m-test
---

# Some text

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

You can add CSS to change the styles. See the Custom Formatting section
for some examples.

Formatted text may **cross
lines** and be as small as **a** single character. It can _also
  be indented and
  split across lines_ simultaneously.

Markdeep intelligently does not apply bold or italic formatting to
math expressions such as x = 3 * y - 2 * z or WORDS_WITH_INTERNAL_UNDERSCORES.
It also protects HTML `<tags>` in code blocks from disappearing.

If you _want_ italics or bold inside of a word, for example in: SCUBA = <b>S</b>elf <b>C</b>ontained
<b>U</b>nderwater <b>B</b>reathing <b>A</b>pparatus, then just use HTML `<b>` and `<i>`
tags---a markdown syntax won't be any more readable in that case.

Exponents only work for positive and negative integers. For arbitrary exponents,
use LaTeX notation: `x^y` ==> $x^y$, or HTML tags: `x<sup>y</sup>` ==> x<sup>y.
</markdeep>

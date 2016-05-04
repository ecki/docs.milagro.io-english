---
currentMenu: contributing
---

# Contribution Guidelines


<div id="generated-toc" class="generate_from_h2"></div>

**Before opening an issue to report a bug or request help, make sure you've checked the [Common Issues](common-issues.html) and [Getting Help](getting-help.html) pages.**

-----

## Localization Support

When developing, please always use language strings (`@lang('path/to/file.string')` in blades, `Lang::get('path/to/file.string')` in controllers) instead of regular text on any user-facing text, so that we can easily extend your changes out to the translation community.

You do not need to provide translated strings for all of the languages we support, only English (`app/lang/en`). We use CrowdIn for translation management by native speakers, so you only need to provide English strings. More info on translations TBD.

-----

## Contributor Code of Conduct

Please note that this project is released with a Contributor Code of Conduct. By participating in this project you agree to abide by its terms. See the source on TBD to read the current version of the Code of Conduct.

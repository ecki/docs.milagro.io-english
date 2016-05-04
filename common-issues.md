---
currentMenu: common-issues
---

# Example Common Issues

<div id="generated-toc" class="generate_from_h2"></div>

While installation should be pretty simple, here are some of the more common questions/issues people have.

-----

## Example: The requested URL /auth/signin was not found on this server
Chances are that `mod_rewrite` is either not installed on your system, or has not been configured correctly for your virtualhost using AllowOverride.

__Troubleshooting:__
Add garbage text into the `public/.htaccess` file on your local install and hit the homepage again. If it bombs out (it should), then mod_rewrite is probably working. If it doesn't, it means your webserver isn't even looking for the .htaccess rules and you'll need to check your virtualhost config.

(Make sure to take the garbage out of the .htaccess file once you've gotten it sorted!)

-----

## Example Common Issues: PHP Warning: require(/var/www/html/snipeit/bootstrap/../vendor/autoload.php): failed to open stream: No such file or directory

When you see this error, it means that you either forgot to install or run composer, or you did and it failed somewhere and didn't complete, so the dependencies Snipe-IT needs were not installed. See the docs on <a href="installation/composer.html">installing and running composer</a>, and check for any errors composer might return when you attempt to run `composer install`.

Once your composer errors are resolved, you can <a href="installation/command-line.html">continue with the installation</a>.

-----

**Nikolai, you need to fill in these sections.**

<!DOCTYPE html>
<html lang="en">
    <!--suppress HtmlRequiredTitleElement -->
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
        @inertiaHead
    </head>
    <body>
        @routes
        @inertia
        @vite('resources/ts/app.ts')
    </body>
</html>

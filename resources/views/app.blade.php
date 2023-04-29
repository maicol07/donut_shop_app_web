<!DOCTYPE html>
<html lang="en">
    <!--suppress HtmlRequiredTitleElement -->
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@400;500;700&family=Kantumruy+Pro:wght@400;500;700&display=swap" rel="stylesheet">
        @inertiaHead
    </head>
    <body>
        @routes
        @inertia
        @vite('resources/ts/app.ts')
    </body>
</html>

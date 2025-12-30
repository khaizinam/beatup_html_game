const mix = require('laravel-mix');

mix.js('src/js/app.js', 'public/js')
    .setPublicPath('public');

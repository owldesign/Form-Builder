let mix = require('laravel-mix');

const sourcePath = 'development';
const distPath = 'formbuilder/resources';

mix.js(sourcePath + '/js/formbuilder.js', distPath + '/js/')
    .js(sourcePath + '/js/dashboard.js', distPath + '/js/')
    .js(sourcePath + '/js/entries.js', distPath + '/js/')
    .js(sourcePath + '/js/charts.js', distPath + '/js/')
    .js(sourcePath + '/js/groups.js', distPath + '/js/')
    .js(sourcePath + '/js/designer.js', distPath + '/js/')
    .js(sourcePath + '/js/field-designer.js', distPath + '/js/')
    .js(sourcePath + '/js/tab-designer.js', distPath + '/js/')
    .js(sourcePath + '/js/forms.js', distPath + '/js/')
    .js(sourcePath + '/js/option.js', distPath + '/js/')
    .js(sourcePath + '/js/modal.js', distPath + '/js/')
    .js(sourcePath + '/js/tags.js', distPath + '/js/')
    .js(sourcePath + '/js/fields.js', distPath + '/js/')
    .js(sourcePath + '/js/integrations.js', distPath + '/js/')
    .sass(sourcePath + '/scss/formbuilder.scss', distPath + '/css/')
        .options({
            processCssUrls: false
        })
    .sourceMaps();
if $ and window.Garnish
    if window.FormBuilder
        unreadCount = window.FormBuilder.unreadCount
        formCount = window.FormBuilder.formCount
        templateCount = window.FormBuilder.templateCount
        #$('<style>#nav-formbuilder .subnav > li:nth-child(2)::after{display:block;content:"'+formCount+'"}</style>').appendTo('head')
        if unreadCount > 0
            $('<style>#nav-formbuilder .subnav > li:nth-child(3)::after{display:block;content:"'+unreadCount+'"}</style>').appendTo('head')
        #$('<style>#nav-formbuilder .subnav > li:nth-child(4)::after{display:block;content:"'+templateCount+'"}</style>').appendTo('head')

    Branding = Garnish.Base.extend(displayFooter: (plugin) ->
        brandHtml = '<ul>'
        brandHtml += '<li><a href="' + plugin.pluginUrl + '" target="_blank">' + plugin.pluginName + '</a> ' + plugin.pluginVersion + '</li>'
        brandHtml += '<li> Made by <a href="' + plugin.developerUrl + '" target="_blank">' + plugin.developerName + '</a> (owldesign)</li>'
        brandHtml += '</ul>'
        $('#footer').append brandHtml
    )
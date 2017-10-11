if $ and window.Garnish
    Branding = Garnish.Base.extend(displayFooter: (plugin) ->
        brandHtml = '<ul>'
        brandHtml += '<li><a href="' + plugin.pluginUrl + '" target="_blank">' + plugin.pluginName + '</a> ' + plugin.pluginVersion + '</li>'
        brandHtml += '<li> Made by <a href="' + plugin.developerUrl + '" target="_blank">' + plugin.developerName + '</a> (owldesign)</li>'
        brandHtml += '</ul>'
        $('#footer').append brandHtml
    )


Garnish.$doc.ready ->
    menuItem = $('#nav-formbuilder')
    data =
        title: window.FormBuilder.pageTitle
    Craft.postActionRequest 'formBuilder/renderNavigation', data, $.proxy(((response, textStatus) ->
        if response.success
            menuItem.append response.markup

        if window.FormBuilder.unreadCount > 0
            $('.total-entry-count').html window.FormBuilder.unreadCount
        else
            if $('body').hasClass 'fb-dashboard'
                $('.notifications .total-entry-count').html '0'
            else
                $('.total-entry-count').html ''

    ), this)

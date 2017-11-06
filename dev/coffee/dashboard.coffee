if $ and window.Garnish
#    $('.tout-action-trigger').on 'click', (e) ->
#        e.preventDefault()
#
#        $menu = $('<div class="tout-dropdown"/>').html(
#            '<ul class="form-item-menu">' +
#            '</ul>')
#
#        if type == 'forms'
#            $('<li><a href="'+window.FormBuilder.adminUrl+'/forms/new">Create New</a></li>').appendTo($menu.find('ul'))
#            $('<li><a href="'+window.FormBuilder.adminUrl+'/forms">View All</a></li>').appendTo($menu.find('ul'))
#        else if type == 'entries'
#            $('<li><a href="'+window.FormBuilder.adminUrl+'/entries">View All</a></li>').appendTo($menu.find('ul'))
#
#        new (Garnish.HUD)($(this), $menu,
#            hudClass: 'hud fb-hud touthud'
#            closeOtherHUDs: false)

    loader = $('.slack-loader')
    $('#slack-invitation').on 'submit', (e) ->
        loader.velocity 'fadeIn', duration: '200'
        e.preventDefault()

        data = $(this).serialize()

        Craft.postActionRequest 'https://formbuildertools.slack.com/join/shared_invite/enQtMjQ1OTExNTQ1ODQ2LWU1OWY0YTY3Mzc2ZWU2MTc5Mzc2MjNlZjIyNmU4YWIxZWZjZDlkZTY0NDY1ZWI4NmFlZjcxODQ4NDA0YTFlNjc', data, (response, textStatus) ->
            console.log response
#        Craft.postActionRequest 'https://formbuilder.tools/actions/nutshell/slack/invite', data, (response, textStatus) ->
#            loader.velocity 'fadeOut', duration: '100'
#            console.log response
#            if response.result.ok
#                $('.invitation-message').html(response.message).velocity 'fadeIn', duration: '300'
#            else
#                if response.result.error == 'invalid_email'
#                    $('.invitation-message').html('Invalid Email Address').velocity 'fadeIn', duration: '300'
#                else if response.result.error == 'already_invited'
#                    $('.invitation-message').html('You are already invited, please check your email or contact me at vadim@owl-design.net').velocity 'fadeIn', duration: '300'
if $ and window.Garnish
    FormBuilderSection = Garnish.Base.extend(
        $container: null
        $titlebar: null
        $fieldsContainer: null
        $optionsContainer: null
        $previewContainer: null
        $actionMenu: null
        $collapserBtn: null
        $optionBtn: null
        $sectionToggleInput: null
        $menuBtn: null
        $status: null

        modal: null
        collapsed: false

        optionCollapsed: true

        init: (el) ->
            @$container = $(el)
            @$menuBtn = @$container.find('.actions > .settings')
            @$collapserBtn = @$container.find '.actions > .bodytoggle'
            @$optionBtn = @$container.find '.actions > .optionstoggle'
            @$sectionToggleInput = @$container.find '.section-toggle'
            @$titlebar = @$container.find('.titlebar')
            @$fieldsContainer = @$container.find('.body')
            @$optionsContainer = @$container.find('.body-options')
            @$previewContainer = @$container.find('.preview')
            @$status = @$container.find('.actions > .status')

            menuBtn = new (Garnish.MenuBtn)(@$menuBtn)
            @$actionMenu = menuBtn.menu.$container
            menuBtn.menu.settings.onOptionSelect = $.proxy(this, 'onMenuOptionSelect')
            if Garnish.hasAttr(@$container, 'data-collapsed')
                @collapse()

            @_handleTitleBarClick = (ev) ->
                ev.preventDefault()
                @toggle()

            @addListener @$collapserBtn, 'click', @toggle
            @addListener @$optionBtn, 'click', @toggleOptions
            @addListener @$titlebar, 'doubletap', @_handleTitleBarClick

        toggle: ->
            if @collapsed
                @expand()
            else
                @$sectionToggleInput.prop 'checked', true
                @collapse true

        toggleOptions: ->
            if @optionCollapsed
                @expandOption()
            else
                @collapseOption true

        collapse: (animate) ->
            @$sectionToggleInput.prop 'checked', true
            if @collapsed
                return

            @$container.addClass 'bodycollapsed'
            previewHtml = ''

            title = @$titlebar.find('.tout-title').text()

            if title == 'Fields'
                $fields = @$fieldsContainer.find('.fld-field:not(.unused)').length
                $customTemplates = @$fieldsContainer.find('.custom-email:not(.unused)').length
                if $fields > 0
                    previewHtml +=  "| #{$fields} Total Fields"
                if $customTemplates > 0
                    previewHtml += " | #{$customTemplates} Custom Templates"

            @$previewContainer.html(previewHtml)

            @$fieldsContainer.velocity 'stop'
            @$container.velocity 'stop'

            if animate
                @$fieldsContainer.velocity 'fadeOut', duration: 'fast'
                @$container.velocity { height: '100%' }, 'fast'
            else
                @$previewContainer.show()
                @$fieldsContainer.hide()
                @$container.css height: '100%'

            setTimeout $.proxy((->
                @$actionMenu.find('a[data-action=collapse]:first').parent().addClass 'hidden'
                @$actionMenu.find('a[data-action=expand]:first').parent().removeClass 'hidden'
            ), this), 200

            @collapsed = true

        collapseOption: (animate) ->
            if @optionCollapsed
                return

            @$container.addClass 'optionscollapsed'

            @$optionsContainer.velocity 'stop'
            @$container.velocity 'stop'

            if animate
                @$optionsContainer.velocity 'fadeOut', duration: 'fast'
                @$container.velocity { height: '100%' }, 'fast'
            else
                @$optionsContainer.hide()
                @$container.css height: '100%'

            @optionCollapsed = true

        expandOption: () ->
            if !@optionCollapsed
                return

            @collapse true

            @$container.removeClass 'optionscollapsed'

            @$optionsContainer.velocity 'stop'
            @$container.velocity 'stop'

            collapsedContainerHeight = @$container.height()
            @$container.height 'auto'
            @$optionsContainer.show()
            expandedContainerHeight = @$container.height()
            @$container.height(collapsedContainerHeight)
            @$optionsContainer.hide().velocity 'fadeIn', duration: 'fast'
            @$container.velocity { height: expandedContainerHeight }, 'fast', $.proxy((->
                @$container.height 'auto'
            ), this)

            @optionCollapsed = false

        expand: () ->
            @$sectionToggleInput.prop 'checked', false
            if !@collapsed
                return

            @collapseOption true

            @$container.removeClass 'bodycollapsed'
            @$fieldsContainer.velocity 'stop'
            @$container.velocity 'stop'

            collapsedContainerHeight = @$container.height()
            @$container.height 'auto'
            @$fieldsContainer.show()
            expandedContainerHeight = @$container.height()
            @$container.height(collapsedContainerHeight)
            @$fieldsContainer.hide().velocity 'fadeIn', duration: 'fast'
            @$container.velocity { height: expandedContainerHeight }, 'fast', $.proxy((->
                @$container.height 'auto'
            ), this)

            setTimeout $.proxy((->
                @$actionMenu.find('a[data-action=collapse]:first').parent().removeClass 'hidden'
                @$actionMenu.find('a[data-action=expand]:first').parent().addClass 'hidden'
            ), this), 200
            @collapsed = false

        disable: () ->
            @$fieldsContainer.find('.enable-notification-section').prop('checked', false)
            @$status.removeClass 'on'
            @$status.addClass 'off'

            setTimeout $.proxy((->
                @$actionMenu.find('a[data-action=disable]:first').parent().addClass 'hidden'
                @$actionMenu.find('a[data-action=enable]:first').parent().removeClass 'hidden'
            ), this), 200
            @collapse true

        enable: () ->
            @$fieldsContainer.find('.enable-notification-section').prop('checked', true)
            @$status.removeClass 'off'
            @$status.addClass 'on'

            setTimeout $.proxy((->
                @$actionMenu.find('a[data-action=disable]:first').parent().removeClass 'hidden'
                @$actionMenu.find('a[data-action=enable]:first').parent().addClass 'hidden'
            ), this), 200

        delete: () ->
            @$container.remove()

        settings: ->
            if !@modal
                @modal = new SettingsModal(@)
            else
                @modal.show()

        updateSectionSettings: ->
            $.each @modal.$modalInputs, $.proxy(((i, input) ->
                value = $(input).val()
                if value != ''
                    @$container.prepend($(input).addClass('hidden'))
            ), this)


        onMenuOptionSelect: (option) ->
            $option = $(option)
            switch $option.data('action')
                when 'collapse'
                    @collapse true
                when 'expand'
                    @expand()
                when 'disable'
                    @disable()
                when 'enable'
                    @enable()
                    @expand()
                when 'delete'
                    @delete()
                when 'settings'
                    @settings()
    )

    Garnish.$doc.ready ->
        if Craft.elementIndex
            Craft.elementIndex.on 'selectSource', (e) ->
                groupId = e.target.$source.data 'id'
                if groupId
                    $('#new-form-btn').attr("href", "/admin/formbuilder/forms/new?groupId=#{groupId}");
                else
                    $('#new-form-btn').attr('href', '/admin/formbuilder/forms/new?groupId=1');

            Craft.elementIndex.on 'updateElements', (e) ->
                elementsCount = e.target.view.elementSelect.$items.length
                groupId = e.target.$source.data 'id'
                if groupId
                    $('#new-form-btn').attr("href", "/admin/formbuilder/forms/new?groupId=#{groupId}");
                else
                    $('#new-form-btn').attr('href', '/admin/formbuilder/forms/new?groupId=1');
                if elementsCount == 0
                    e.target.view.elementSelect.$container.html($('<tr><td colspan="6">'+Craft.t("No forms available")+'</td></tr>'))

        new Clipboard('.copy-handle', target: (trigger) ->
            handle = $(trigger).data 'handle'
            Craft.cp.displayNotice Craft.t("Form handle `#{handle}` copied")
        )

        new Clipboard('.twig-snippet', text: (trigger) ->
            handle = $(trigger).data 'handle'
            snippet = '{{ craft.formBuilder.form("'+handle+'") }}'
            Craft.cp.displayNotice snippet + Craft.t(" copied")
            return snippet
        )

        $('.delete-form').on 'click', (e) ->
            e.preventDefault()
            data = id: $(this).data 'id'
            if confirm Craft.t("Are you sure you want to delete this form and all its entries?")
                Craft.postActionRequest 'formBuilder/form/delete', data, $.proxy(((response, textStatus) ->
                    if textStatus == 'success'
                        Craft.cp.displayNotice Craft.t('Form deleted')
                        window.location.href = '/admin/formbuilder/forms'
                ), this)
if $ and window.Garnish
    Craft.FileUploadsIndex = Garnish.Base.extend(
        $container: $('.upload-details')
        elementIndex: null

        init: (elementIndex, container, settings) ->
            @elementIndex = elementIndex
            @$container = $(container)
            @setSettings settings, Craft.BaseElementIndexView.defaults
            @$loadingMoreSpinner = $('<div class="centeralign hidden">' + '<div class="spinner loadingmore"></div>' + '</div>').insertAfter(@$container)

            @$elementContainer = @getElementContainer()
            $elements = @$elementContainer.children()

            if @settings.context == 'index'
                @addListener @$elementContainer, 'dblclick', (ev) ->
                    `var $element`
                    $target = $(ev.target)
                    if $target.hasClass('element')
                        $element = $target
                    else
                        $element = $target.closest('.element')
                    if $element.length
                        @createElementEditor $element

        getElementContainer: () ->
            @$table = @$container.find('table:first')
            @$table.children 'tbody:first'

        createElementEditor: ($element) ->
             new (Craft.ElementEditor)($element,
                 onSaveElement: $.proxy(((response) ->
                     Craft.cp.displayNotice Craft.t('Asset updated')
             ), this))
    )

    Garnish.$doc.ready ->
        if Craft.elementIndex
            Craft.elementIndex.on 'updateElements', (e) ->
                elementsCount = e.target.view.elementSelect.$items.length
                if elementsCount == 0
                    e.target.view.elementSelect.$container.html($('<tr><td colspan="6">'+Craft.t("No entries available")+'</td></tr>'))

        $('.submission-action-trigger').on 'click', (e) ->
            e.preventDefault()
            type = $(this).data 'type'
            formId = $(this).data 'form-id'
            entryId = $(this).data 'entry-id'
            fileIds = $(this).data 'file-ids'

            $menu = $('<div class="tout-dropdown"/>').html(
                '<ul class="form-item-menu">' +
                '</ul>')

            if type == 'submission'
                $('<li><a href="#" class="delete-submission">Delete Submission</a></li>').appendTo($menu.find('ul'))
            else if type == 'form'
                $('<li><a href="/admin/formbuilder/forms/edit/'+formId+'">View Form</a></li>').appendTo($menu.find('ul'))
            else if type == 'uploads'
                $('<li><a href="/admin/formbuilder/entries" class="delete-all-files">Delete All</a></li>').appendTo($menu.find('ul'))
                $('<li><a href="/admin/formbuilder/entries" class="download-all-files">Download All</a></li>').appendTo($menu.find('ul'))

            new (Garnish.HUD)($(this), $menu,
                hudClass: 'hud fb-hud submissionhud'
                closeOtherHUDs: false)

            $menu.find('.delete-submission').on 'click', (e) ->
                e.preventDefault()
                data = id: entryId
                if confirm Craft.t("Are you sure you want to delete this entry?")
                    Craft.postActionRequest 'formBuilder/entry/delete', data, $.proxy(((response, textStatus) ->
                        if textStatus == 'success'
                            Craft.cp.displayNotice Craft.t('Entry deleted')
                            window.location.href = '/admin/formbuilder/entries'
                    ), this)

            $menu.find('.delete-all-files').on 'click', (e) ->
                e.preventDefault()
                data = fileId: fileIds
                if confirm Craft.t("Are you sure you want to delete all files?")
                    Craft.postActionRequest 'assets/deleteFile', data, $.proxy(((response, textStatus) ->
                        if response.success
                            for hudID of Garnish.HUD.activeHUDs
                                Garnish.HUD.activeHUDs[hudID].hide()
                            $('.upload-details').addClass 'zap'
                            setTimeout (->
                                $('.upload-details').remove()
                            ), 300
                    ), this)

            $menu.find('.download-all-files').on 'click', (e) ->
                e.preventDefault()
                Craft.cp.displayNotice Craft.t('Downloading...')
                data =
                    ids: fileIds
                    formId: formId
                Craft.postActionRequest 'formBuilder/entry/downloadAllFiles', data, $.proxy(((response, textStatus) ->
                    if response.success
                        window.location = '/actions/formBuilder/entry/downloadFiles?filePath=' + response.filePath
                        Craft.cp.displayNotice Craft.t('Download Successful')
                    else
                        Craft.cp.displayError Craft.t(response.message)
                    for hudID of Garnish.HUD.activeHUDs
                        Garnish.HUD.activeHUDs[hudID].hide()
                ), this)
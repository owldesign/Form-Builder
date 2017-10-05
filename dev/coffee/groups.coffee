if $ and window.Garnish
    Groups = Garnish.Base.extend(
        $groups: null
        $selectedGroup: null
        $newGroupBtn: null
        modal: null

        init: ->
            @$groups = $('#groups')
            @$selectedGroup = @$groups.find('a.sel:first')
            @$newGroupBtn = $('#newgroupbtn')

            @addListener @$newGroupBtn, 'click', 'addNewGroup'

            $groupSettingsBtn = $('#groupsettingsbtn')

            if $groupSettingsBtn.length
                menuBtn = $groupSettingsBtn.data 'menubtn'
                menuBtn.settings.onOptionSelect = $.proxy(((elem) ->
                    action = $(elem).data 'action'
                    switch action
                        when 'rename'
                            @renameSelectedGroup()
                        when 'delete'
                            @deleteSelectedGroup()
                ), this)


        addNewGroup: ->
            if !@modal
                @modal = new GroupModal(@)
            else
                @modal.show()

        renameSelectedGroup: ->
            oldName = @$selectedGroup.text()
            newName = @promptForGroupName(oldName)
            console.log @$selectedGroup
            if newName and newName != oldName
                data =
                    id: @$selectedGroup.data 'id'
                    name: newName
                Craft.postActionRequest 'formBuilder/group/save', data, $.proxy(((response, textStatus) ->
                    if textStatus == 'success'
                        if response.success
                            @$selectedGroup.text response.group.name
                            Craft.cp.displayNotice Craft.t('Group renamed.')
                        else if response.errors
                            errors = @flattenErrors(response.errors)
                            alert Craft.t('Could not rename the group:') + '\n\n' + errors.join('\n')
                        else
                            Craft.cp.displayError()
                ), this)

        promptForGroupName: (oldName) ->
            prompt Craft.t('What do you want to name your group?'), oldName

        deleteSelectedGroup: ->
            @$selectedGroup = $('#groups a.sel')

            if @$selectedGroup.data('id') == 1
                Craft.cp.displayError(Craft.t('Cannot delete Default group'))
            else
                if confirm(Craft.t('Are you sure you want to delete this group and all its forms?'))
                    data = id: @$selectedGroup.data 'id'
                    Craft.postActionRequest 'formBuilder/group/delete', data, $.proxy(((response, textStatus) ->
                        if textStatus == 'success'
                            if response.success
                                location.href = Craft.getUrl('formbuilder/forms')
                            else
                                Craft.cp.displayError()
                    ), this)

        flattenErrors: (responseErrors) ->
            errors = []
            for attribute of responseErrors
                errors = errors.concat(responseErrors[attribute])
            errors
    )

    GroupItem = Garnish.Modal.extend(
        $groupListItem: null
        $group: null
        $editGroupBtn: null

        id: null
        label: null
        iconName: null

        modal: null

        init: (el) ->
            @$groupListItem = $(el)
            @$group = @$groupListItem.find 'a'
            @$editGroupBtn = @$group.find '.edit-group'

            @id = @$group.data 'id'
            @label = @$group.data 'label'
            @iconName = @$group.data 'icon-name'

            @addListener @$editGroupBtn, 'click', 'edit'

        edit: ->
            if !@modal
                @modal = new GroupModal(@)
            else
                @modal.show()

    )

    GroupModal = Garnish.Modal.extend(
        group: null
        $form: null
        $modalInputs: null

        init: (group) ->
            self = @
            @group = group
            @base()
            console.log @group.id
            @$form = $('<form class="modal fitted formbuilder-modal">').appendTo(Garnish.$bod)
            @setContainer @$form
            title = if @group.id then Craft.t('Edit Group') else Craft.t('New Group')
            body = $([
                '<header>'
                '<span class="modal-title">'+title+'</span>'
                '</header>'
                '<div class="body"></div>'
                '<footer class="footer">'
                '<div class="buttons">'
                '<input type="button" class="btns btn-modal cancel" value="'+Craft.t('Cancel')+'">'
                '<input type="submit" class="btns btn-modal submit" value="'+Craft.t('Save')+'">'
                '</div>'
                '</footer>'
            ].join('')).appendTo(@$form)

            label = if @group.label then @group.label else ''
            iconName = if @group.iconName then @group.iconName else ''

            $input = "<input type='text' class='groupName' value='#{label}' data-hint='NAME' data-name='groupName' />"
            $input2 = "<input type='text' class='groupIcon' value='#{iconName}' data-hint='ICON' data-name='groupIcon' />"

            @renderInputs($input, '', 'text', 'groupName', 'NAME', 'groupName')
            @renderInputs($input2, '', 'text', 'groupIcon', 'ICON', 'iconName')

            @show()

            @$saveBtn = body.find '.submit'
            @$cancelBtn = body.find '.cancel'

            @addListener @$cancelBtn, 'click', 'hide'
            @addListener @$form, 'submit', 'save'

        renderInputs: (el, value, type, name, hint, className) ->
            $input = $('<div class="fb-field">' +
              '<div class="input-hint">' +
              hint +
              '</div>' +
              el +
              '</div>')

            @$form.find('.body').append($input)

        save: (e) ->
            e.preventDefault()
            self = @
            groupName = @$form.find('.groupName').val()
            groupIcon = @$form.find('.groupIcon').val()
            inputLength = @$form.find('.groupName').val().length
            if inputLength > 0
                data =
                    id: if @group.id then @group.id else null
                    name: groupName
                    settings:
                        icon:
                            name: groupIcon
                Craft.postActionRequest 'formBuilder/group/save', data, $.proxy(((response, textStatus) ->
                    if textStatus == 'success'
                        if response.success
                            location.href = Craft.getUrl('formbuilder/forms')
                        else if response.errors
                            errors = @flattenErrors(response.errors)
                            alert Craft.t('Could not create the group:') + '\n\n' + errors.join('\n')
                        else
                            Craft.cp.displayError()
                ), this)

        flattenErrors: (responseErrors) ->
            errors = []
            for attribute of responseErrors
                errors = errors.concat(responseErrors[attribute])
            errors

    )

    Garnish.$doc.ready ->
        FormGroups = new Groups

        $.each $('.group-item'), (i, item) ->
            new GroupItem(item)

#        $('.edit-group').on 'click', (e) ->
#            id = $(this).parent().data 'id'
#            label = $(this).parent().data 'label'
#            iconName = $(this).parent().data 'icon-name'
#            console.log id
#            console.log label
#            console.log iconName
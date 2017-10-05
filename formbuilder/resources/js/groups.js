var GroupItem, GroupModal, Groups;

if ($ && window.Garnish) {
  Groups = Garnish.Base.extend({
    $groups: null,
    $selectedGroup: null,
    $newGroupBtn: null,
    modal: null,
    init: function() {
      var $groupSettingsBtn, menuBtn;
      this.$groups = $('#groups');
      this.$selectedGroup = this.$groups.find('a.sel:first');
      this.$newGroupBtn = $('#newgroupbtn');
      this.addListener(this.$newGroupBtn, 'click', 'addNewGroup');
      $groupSettingsBtn = $('#groupsettingsbtn');
      if ($groupSettingsBtn.length) {
        menuBtn = $groupSettingsBtn.data('menubtn');
        return menuBtn.settings.onOptionSelect = $.proxy((function(elem) {
          var action;
          action = $(elem).data('action');
          switch (action) {
            case 'rename':
              return this.renameSelectedGroup();
            case 'delete':
              return this.deleteSelectedGroup();
          }
        }), this);
      }
    },
    addNewGroup: function() {
      if (!this.modal) {
        return this.modal = new GroupModal(this);
      } else {
        return this.modal.show();
      }
    },
    renameSelectedGroup: function() {
      var data, newName, oldName;
      oldName = this.$selectedGroup.text();
      newName = this.promptForGroupName(oldName);
      console.log(this.$selectedGroup);
      if (newName && newName !== oldName) {
        data = {
          id: this.$selectedGroup.data('id'),
          name: newName
        };
        return Craft.postActionRequest('formBuilder/group/save', data, $.proxy((function(response, textStatus) {
          var errors;
          if (textStatus === 'success') {
            if (response.success) {
              this.$selectedGroup.text(response.group.name);
              return Craft.cp.displayNotice(Craft.t('Group renamed.'));
            } else if (response.errors) {
              errors = this.flattenErrors(response.errors);
              return alert(Craft.t('Could not rename the group:') + '\n\n' + errors.join('\n'));
            } else {
              return Craft.cp.displayError();
            }
          }
        }), this));
      }
    },
    promptForGroupName: function(oldName) {
      return prompt(Craft.t('What do you want to name your group?'), oldName);
    },
    deleteSelectedGroup: function() {
      var data;
      this.$selectedGroup = $('#groups a.sel');
      if (this.$selectedGroup.data('id') === 1) {
        return Craft.cp.displayError(Craft.t('Cannot delete Default group'));
      } else {
        if (confirm(Craft.t('Are you sure you want to delete this group and all its forms?'))) {
          data = {
            id: this.$selectedGroup.data('id')
          };
          return Craft.postActionRequest('formBuilder/group/delete', data, $.proxy((function(response, textStatus) {
            if (textStatus === 'success') {
              if (response.success) {
                return location.href = Craft.getUrl('formbuilder/forms');
              } else {
                return Craft.cp.displayError();
              }
            }
          }), this));
        }
      }
    },
    flattenErrors: function(responseErrors) {
      var attribute, errors;
      errors = [];
      for (attribute in responseErrors) {
        errors = errors.concat(responseErrors[attribute]);
      }
      return errors;
    }
  });
  GroupItem = Garnish.Modal.extend({
    $groupListItem: null,
    $group: null,
    $editGroupBtn: null,
    id: null,
    label: null,
    iconName: null,
    modal: null,
    init: function(el) {
      this.$groupListItem = $(el);
      this.$group = this.$groupListItem.find('a');
      this.$editGroupBtn = this.$group.find('.edit-group');
      this.id = this.$group.data('id');
      this.label = this.$group.data('label');
      this.iconName = this.$group.data('icon-name');
      return this.addListener(this.$editGroupBtn, 'click', 'edit');
    },
    edit: function() {
      if (!this.modal) {
        return this.modal = new GroupModal(this);
      } else {
        return this.modal.show();
      }
    }
  });
  GroupModal = Garnish.Modal.extend({
    group: null,
    $form: null,
    $modalInputs: null,
    init: function(group) {
      var $input, $input2, body, iconName, label, self, title;
      self = this;
      this.group = group;
      this.base();
      console.log(this.group.id);
      this.$form = $('<form class="modal fitted formbuilder-modal">').appendTo(Garnish.$bod);
      this.setContainer(this.$form);
      title = this.group.id ? Craft.t('Edit Group') : Craft.t('New Group');
      body = $(['<header>', '<span class="modal-title">' + title + '</span>', '</header>', '<div class="body"></div>', '<footer class="footer">', '<div class="buttons">', '<input type="button" class="btns btn-modal cancel" value="' + Craft.t('Cancel') + '">', '<input type="submit" class="btns btn-modal submit" value="' + Craft.t('Save') + '">', '</div>', '</footer>'].join('')).appendTo(this.$form);
      label = this.group.label ? this.group.label : '';
      iconName = this.group.iconName ? this.group.iconName : '';
      $input = "<input type='text' class='groupName' value='" + label + "' data-hint='NAME' data-name='groupName' />";
      $input2 = "<input type='text' class='groupIcon' value='" + iconName + "' data-hint='ICON' data-name='groupIcon' />";
      this.renderInputs($input, '', 'text', 'groupName', 'NAME', 'groupName');
      this.renderInputs($input2, '', 'text', 'groupIcon', 'ICON', 'iconName');
      this.show();
      this.$saveBtn = body.find('.submit');
      this.$cancelBtn = body.find('.cancel');
      this.addListener(this.$cancelBtn, 'click', 'hide');
      return this.addListener(this.$form, 'submit', 'save');
    },
    renderInputs: function(el, value, type, name, hint, className) {
      var $input;
      $input = $('<div class="fb-field">' + '<div class="input-hint">' + hint + '</div>' + el + '</div>');
      return this.$form.find('.body').append($input);
    },
    save: function(e) {
      var data, groupIcon, groupName, inputLength, self;
      e.preventDefault();
      self = this;
      groupName = this.$form.find('.groupName').val();
      groupIcon = this.$form.find('.groupIcon').val();
      inputLength = this.$form.find('.groupName').val().length;
      if (inputLength > 0) {
        data = {
          id: this.group.id ? this.group.id : null,
          name: groupName,
          settings: {
            icon: {
              name: groupIcon
            }
          }
        };
        return Craft.postActionRequest('formBuilder/group/save', data, $.proxy((function(response, textStatus) {
          var errors;
          if (textStatus === 'success') {
            if (response.success) {
              return location.href = Craft.getUrl('formbuilder/forms');
            } else if (response.errors) {
              errors = this.flattenErrors(response.errors);
              return alert(Craft.t('Could not create the group:') + '\n\n' + errors.join('\n'));
            } else {
              return Craft.cp.displayError();
            }
          }
        }), this));
      }
    },
    flattenErrors: function(responseErrors) {
      var attribute, errors;
      errors = [];
      for (attribute in responseErrors) {
        errors = errors.concat(responseErrors[attribute]);
      }
      return errors;
    }
  });
  Garnish.$doc.ready(function() {
    var FormGroups;
    FormGroups = new Groups;
    return $.each($('.group-item'), function(i, item) {
      return new GroupItem(item);
    });
  });
}

var FormBuilderSection;

if ($ && window.Garnish) {
  FormBuilderSection = Garnish.Base.extend({
    $container: null,
    $titlebar: null,
    $fieldsContainer: null,
    $optionsContainer: null,
    $previewContainer: null,
    $actionMenu: null,
    $collapserBtn: null,
    $optionBtn: null,
    $sectionToggleInput: null,
    $menuBtn: null,
    $status: null,
    modal: null,
    collapsed: false,
    optionCollapsed: true,
    init: function(el) {
      var menuBtn;
      this.$container = $(el);
      this.$menuBtn = this.$container.find('.actions > .settings');
      this.$collapserBtn = this.$container.find('.actions > .bodytoggle');
      this.$optionBtn = this.$container.find('.actions > .optionstoggle');
      this.$sectionToggleInput = this.$container.find('.section-toggle');
      this.$titlebar = this.$container.find('.titlebar');
      this.$fieldsContainer = this.$container.find('.body');
      this.$optionsContainer = this.$container.find('.body-options');
      this.$previewContainer = this.$container.find('.preview');
      this.$status = this.$container.find('.actions > .status');
      menuBtn = new Garnish.MenuBtn(this.$menuBtn);
      this.$actionMenu = menuBtn.menu.$container;
      menuBtn.menu.settings.onOptionSelect = $.proxy(this, 'onMenuOptionSelect');
      if (Garnish.hasAttr(this.$container, 'data-collapsed')) {
        this.collapse();
      }
      this._handleTitleBarClick = function(ev) {
        ev.preventDefault();
        return this.toggle();
      };
      this.addListener(this.$collapserBtn, 'click', this.toggle);
      this.addListener(this.$optionBtn, 'click', this.toggleOptions);
      return this.addListener(this.$titlebar, 'doubletap', this._handleTitleBarClick);
    },
    toggle: function() {
      if (this.collapsed) {
        return this.expand();
      } else {
        this.$sectionToggleInput.prop('checked', true);
        return this.collapse(true);
      }
    },
    toggleOptions: function() {
      if (this.optionCollapsed) {
        return this.expandOption();
      } else {
        return this.collapseOption(true);
      }
    },
    collapse: function(animate) {
      var $customTemplates, $fields, previewHtml, title;
      this.$sectionToggleInput.prop('checked', true);
      if (this.collapsed) {
        return;
      }
      this.$container.addClass('bodycollapsed');
      previewHtml = '';
      title = this.$titlebar.find('.tout-title').text();
      if (title === 'Fields') {
        $fields = this.$fieldsContainer.find('.fld-field:not(.unused)').length;
        $customTemplates = this.$fieldsContainer.find('.custom-email:not(.unused)').length;
        if ($fields > 0) {
          previewHtml += "| " + $fields + " Total Fields";
        }
        if ($customTemplates > 0) {
          previewHtml += " | " + $customTemplates + " Custom Templates";
        }
      }
      this.$previewContainer.html(previewHtml);
      this.$fieldsContainer.velocity('stop');
      this.$container.velocity('stop');
      if (animate) {
        this.$fieldsContainer.velocity('fadeOut', {
          duration: 'fast'
        });
        this.$container.velocity({
          height: '100%'
        }, 'fast');
      } else {
        this.$previewContainer.show();
        this.$fieldsContainer.hide();
        this.$container.css({
          height: '100%'
        });
      }
      setTimeout($.proxy((function() {
        this.$actionMenu.find('a[data-action=collapse]:first').parent().addClass('hidden');
        return this.$actionMenu.find('a[data-action=expand]:first').parent().removeClass('hidden');
      }), this), 200);
      return this.collapsed = true;
    },
    collapseOption: function(animate) {
      if (this.optionCollapsed) {
        return;
      }
      this.$container.addClass('optionscollapsed');
      this.$optionsContainer.velocity('stop');
      this.$container.velocity('stop');
      if (animate) {
        this.$optionsContainer.velocity('fadeOut', {
          duration: 'fast'
        });
        this.$container.velocity({
          height: '100%'
        }, 'fast');
      } else {
        this.$optionsContainer.hide();
        this.$container.css({
          height: '100%'
        });
      }
      return this.optionCollapsed = true;
    },
    expandOption: function() {
      var collapsedContainerHeight, expandedContainerHeight;
      if (!this.optionCollapsed) {
        return;
      }
      this.collapse(true);
      this.$container.removeClass('optionscollapsed');
      this.$optionsContainer.velocity('stop');
      this.$container.velocity('stop');
      collapsedContainerHeight = this.$container.height();
      this.$container.height('auto');
      this.$optionsContainer.show();
      expandedContainerHeight = this.$container.height();
      this.$container.height(collapsedContainerHeight);
      this.$optionsContainer.hide().velocity('fadeIn', {
        duration: 'fast'
      });
      this.$container.velocity({
        height: expandedContainerHeight
      }, 'fast', $.proxy((function() {
        return this.$container.height('auto');
      }), this));
      return this.optionCollapsed = false;
    },
    expand: function() {
      var collapsedContainerHeight, expandedContainerHeight;
      this.$sectionToggleInput.prop('checked', false);
      if (!this.collapsed) {
        return;
      }
      this.collapseOption(true);
      this.$container.removeClass('bodycollapsed');
      this.$fieldsContainer.velocity('stop');
      this.$container.velocity('stop');
      collapsedContainerHeight = this.$container.height();
      this.$container.height('auto');
      this.$fieldsContainer.show();
      expandedContainerHeight = this.$container.height();
      this.$container.height(collapsedContainerHeight);
      this.$fieldsContainer.hide().velocity('fadeIn', {
        duration: 'fast'
      });
      this.$container.velocity({
        height: expandedContainerHeight
      }, 'fast', $.proxy((function() {
        return this.$container.height('auto');
      }), this));
      setTimeout($.proxy((function() {
        this.$actionMenu.find('a[data-action=collapse]:first').parent().removeClass('hidden');
        return this.$actionMenu.find('a[data-action=expand]:first').parent().addClass('hidden');
      }), this), 200);
      return this.collapsed = false;
    },
    disable: function() {
      this.$fieldsContainer.find('.enable-notification-section').prop('checked', false);
      this.$status.removeClass('on');
      this.$status.addClass('off');
      setTimeout($.proxy((function() {
        this.$actionMenu.find('a[data-action=disable]:first').parent().addClass('hidden');
        return this.$actionMenu.find('a[data-action=enable]:first').parent().removeClass('hidden');
      }), this), 200);
      return this.collapse(true);
    },
    enable: function() {
      this.$fieldsContainer.find('.enable-notification-section').prop('checked', true);
      this.$status.removeClass('off');
      this.$status.addClass('on');
      return setTimeout($.proxy((function() {
        this.$actionMenu.find('a[data-action=disable]:first').parent().removeClass('hidden');
        return this.$actionMenu.find('a[data-action=enable]:first').parent().addClass('hidden');
      }), this), 200);
    },
    "delete": function() {
      return this.$container.remove();
    },
    settings: function() {
      if (!this.modal) {
        return this.modal = new SettingsModal(this);
      } else {
        return this.modal.show();
      }
    },
    updateSectionSettings: function() {
      return $.each(this.modal.$modalInputs, $.proxy((function(i, input) {
        var value;
        value = $(input).val();
        if (value !== '') {
          return this.$container.prepend($(input).addClass('hidden'));
        }
      }), this));
    },
    onMenuOptionSelect: function(option) {
      var $option;
      $option = $(option);
      switch ($option.data('action')) {
        case 'collapse':
          return this.collapse(true);
        case 'expand':
          return this.expand();
        case 'disable':
          return this.disable();
        case 'enable':
          this.enable();
          return this.expand();
        case 'delete':
          return this["delete"]();
        case 'settings':
          return this.settings();
      }
    }
  });
  Garnish.$doc.ready(function() {
    if (Craft.elementIndex) {
      Craft.elementIndex.on('selectSource', function(e) {
        var groupId;
        groupId = e.target.$source.data('id');
        if (groupId) {
          return $('#new-form-btn').attr("href", window.FormBuilder.adminUrl + ("/forms/new?groupId=" + groupId));
        } else {
          return $('#new-form-btn').attr('href', window.FormBuilder.adminUrl + '/forms/new?groupId=1');
        }
      });
      Craft.elementIndex.on('updateElements', function(e) {
        var elementsCount, groupId;
        elementsCount = e.target.view.elementSelect.$items.length;
        groupId = e.target.$source.data('id');
        if (groupId) {
          $('#new-form-btn').attr("href", window.FormBuilder.adminUrl + ("/forms/new?groupId=" + groupId));
        } else {
          $('#new-form-btn').attr('href', window.FormBuilder.adminUrl + '/forms/new?groupId=1');
        }
        if (elementsCount === 0) {
          return e.target.view.elementSelect.$container.html($('<tr><td colspan="6">' + Craft.t("No forms available") + '</td></tr>'));
        }
      });
    }
    new Clipboard('.copy-handle', {
      target: function(trigger) {
        var handle;
        handle = $(trigger).data('handle');
        return Craft.cp.displayNotice(Craft.t("Form handle `" + handle + "` copied"));
      }
    });
    new Clipboard('.twig-snippet', {
      text: function(trigger) {
        var handle, snippet;
        handle = $(trigger).data('handle');
        snippet = '{{ craft.formBuilder.form({formHandle: "' + handle + '", submission: submission is defined ? submission : null})}}';
        Craft.cp.displayNotice(snippet + Craft.t(" copied"));
        return snippet;
      }
    });
    return $('.delete-form').on('click', function(e) {
      var data;
      e.preventDefault();
      data = {
        id: $(this).data('id')
      };
      if (confirm(Craft.t("Are you sure you want to delete this form and all its entries?"))) {
        return Craft.postActionRequest('formBuilder/form/delete', data, $.proxy((function(response, textStatus) {
          if (textStatus === 'success') {
            Craft.cp.displayNotice(Craft.t('Form deleted'));
            return window.location.href = window.FormBuilder.adminUrl + '/forms';
          }
        }), this));
      }
    });
  });
}

(function($) {
  var FieldEditor, FieldHtmlSettingsModal, FieldInputSettingsModal, FieldSettings;
  FieldSettings = {
    setup: function() {}
  };
  if ($ && window.Garnish && window.Craft) {
    FieldSettings = new (Garnish.Base.extend({
      fields: null,
      layouts: null,
      inputs: null,
      htmls: null,
      settings: null,
      init: function() {
        this.fields = {};
        this.layouts = {};
        this.inputs = {};
        this.htmls = {};
        return this.settings = {};
      },
      setup: function() {
        var FLD, FLD_field, FLD_init, FLD_options;
        if (Craft.FieldLayoutDesigner) {
          FLD = Craft.FieldLayoutDesigner;
          FLD_init = FLD.prototype.init;
          FLD_field = FLD.prototype.initField;
          FLD_options = FLD.prototype.onFieldOptionSelect;
          FLD.prototype.init = function() {
            FLD_init.apply(this, arguments);
            return this.fieldEditor = new window.FieldEditor(this);
          };
          FLD.prototype.initField = function($field) {
            var $editBtn, $html, $menu, $ul, menu, menuBtn;
            FLD_field.apply(this, arguments);
            $editBtn = $field.find('.settings');
            menuBtn = $editBtn.data('menubtn');
            menu = menuBtn.menu;
            $menu = menu.$container;
            $ul = $menu.children('ul');
            $html = $('<li><a data-action="fieldhtml">' + Craft.t('HTML Settings') + '</a></li>').appendTo($ul);
            return menu.addOptions($html.children('a'));
          };
          return FLD.prototype.onFieldOptionSelect = function(option) {
            var $field, $option, action;
            FLD_options.apply(this, arguments);
            $option = $(option);
            $field = $option.data('menu').$anchor.parent();
            action = $option.data('action');
            switch (action) {
              case 'fieldinput':
                return this.trigger('inputSettingsSelected', {
                  target: $option[0],
                  $target: $option,
                  $field: $field,
                  fld: this,
                  id: $field.data('id') | 0
                });
              case 'fieldhtml':
                return this.trigger('htmlSettingsSelected', {
                  target: $option[0],
                  $target: $option,
                  $field: $field,
                  fld: this,
                  id: $field.data('id') | 0
                });
            }
          };
        }
      },
      getFieldInfo: function(id) {
        return this.fields[id];
      },
      getFieldLayoutId: function(element) {
        var $form, $input;
        $form = element ? $(element) : Craft.cp.$primaryForm;
        $input = $form.find('input[name="fieldLayoutId"]');
        if ($input.length) {
          return $input.val() | 0;
        } else {
          return false;
        }
      },
      getHtmlSettingsOnFieldLayout: function(fieldLayoutId) {
        var htmls;
        fieldLayoutId = isNaN(fieldLayoutId) ? this.getFieldLayoutId() : fieldLayoutId;
        htmls = {};
        $.each(this.htmls, function(key, item) {
          var fieldId;
          fieldId = item.fieldId;
          if (parseInt(item.fieldLayoutId) === fieldLayoutId) {
            return htmls[fieldId] = item.html;
          }
        });
        return htmls;
      },
      getInputSettingsOnFieldLayout: function(fieldLayoutId) {
        var inputs;
        fieldLayoutId = isNaN(fieldLayoutId) ? this.getFieldLayoutId() : fieldLayoutId;
        inputs = {};
        $.each(this.inputs, function(key, item) {
          var fieldId;
          fieldId = item.fieldId;
          if (parseInt(item.fieldLayoutId) === fieldLayoutId) {
            return inputs[fieldId] = item.input;
          }
        });
        return inputs;
      }
    }));
    FieldEditor = Garnish.Base.extend({
      fld: null,
      inputs: null,
      htmls: null,
      namespace: 'formbuilder',
      $form: null,
      init: function(fld) {
        var fieldLayoutId;
        if (!(fld instanceof Craft.FieldLayoutDesigner)) {
          return;
        }
        this.fld = fld;
        this.fld.on('inputSettingsSelected', $.proxy(this.openInputSettingsModal, this));
        this.fld.on('htmlSettingsSelected', $.proxy(this.openHtmlSettingsModal, this));
        this.$form = this.fld.$container.closest('form');
        this.inputs = {};
        this.htmls = {};
        fieldLayoutId = FieldSettings.getFieldLayoutId(this.$form);
        if (fieldLayoutId !== false) {
          this.applyHtmlFieldSettings(fieldLayoutId);
          return this.applyInputFieldSettings(fieldLayoutId);
        }
      },
      applyHtmlFieldSettings: function(fieldLayoutId) {
        var fieldId, initSettings, results, setting;
        initSettings = FieldSettings.getHtmlSettingsOnFieldLayout(fieldLayoutId);
        this.htmls = initSettings;
        if (initSettings) {
          results = [];
          for (fieldId in initSettings) {
            if (initSettings.hasOwnProperty(fieldId)) {
              setting = initSettings[fieldId];
              results.push(this.setFormData(fieldId, setting, 'html'));
            } else {
              results.push(void 0);
            }
          }
          return results;
        }
      },
      applyInputFieldSettings: function(fieldLayoutId) {
        var fieldId, initSettings, results, setting;
        initSettings = FieldSettings.getInputSettingsOnFieldLayout(fieldLayoutId);
        this.inputs = initSettings;
        if (initSettings) {
          results = [];
          for (fieldId in initSettings) {
            if (initSettings.hasOwnProperty(fieldId)) {
              setting = initSettings[fieldId];
              results.push(this.setFormData(fieldId, setting, 'input'));
            } else {
              results.push(void 0);
            }
          }
          return results;
        }
      },
      openInputSettingsModal: function(e) {
        var fieldId, fieldInfo, modal, self;
        self = this;
        fieldId = e.id;
        fieldInfo = FieldSettings.getFieldInfo(fieldId);
        modal = new FieldInputSettingsModal(fieldInfo);
        modal.on('setInputSettings', function(e) {
          return self.setFormData(fieldId, e.settings, 'input');
        });
        return modal.show(this.inputs);
      },
      openHtmlSettingsModal: function(e) {
        var fieldId, fieldInfo, modal, self;
        self = this;
        fieldId = e.id;
        fieldInfo = FieldSettings.getFieldInfo(fieldId);
        modal = new FieldHtmlSettingsModal(fieldInfo);
        modal.on('setHtmlSettings', function(e) {
          return self.setFormData(fieldId, e.settings, 'html');
        });
        return modal.show(this.htmls);
      },
      setFormData: function(fieldId, data, type) {
        var $container, $field, name;
        $container = this.fld.$container;
        $field = $container.find('.fld-field[data-id="' + fieldId + '"]');
        name = this.namespace + '[field][' + fieldId + '][' + type + ']';
        if (type === 'input') {
          $field.children('.input-settings-item').remove();
        } else if (type === 'html') {
          $field.children('.html-settings-item').remove();
        }
        return $.each(data, function(key, item) {
          $field.children('input[name="' + name + '[' + key + ']"]').remove();
          if (item) {
            return $('<input type="hidden" name="' + name + '[' + key + ']">').val(item).appendTo($field);
          }
        });
      }
    });
    FieldHtmlSettingsModal = Garnish.Modal.extend({
      field: null,
      init: function(field) {
        var body;
        this.field = field;
        this.base();
        this.$form = $('<form class="modal fitted formbuilder-modal">').appendTo(Garnish.$bod);
        this.setContainer(this.$form);
        body = $(['<header>', '<span class="modal-title">', 'HTML Settings', '</span>', '<div class="instructions">', 'Add custom input html settings', '</div>', '</header>', '<div class="body">', '<div class="fb-field">', '<div class="input-hint">', 'CLASS', '</div>', '<input type="text" class="text fullwidth html-settings-class">', '</div>', '<div class="fb-field">', '<div class="input-hint">', 'ID', '</div>', '<input type="text" class="text fullwidth html-settings-id">', '</div>', '<div class="fb-field">', '<div class="input-hint">', 'STYLE', '</div>', '<textarea class="text fullwidth html-settings-styles"></textarea>', '</div>', '</div>', '<footer class="footer">', '<div class="buttons">', '<input type="button" class="btns btn-modal cancel" value="' + Craft.t('Cancel') + '">', '<input type="submit" class="btns btn-modal submit" value="' + Craft.t('Save') + '">', '</div>', '</footer>'].join('')).appendTo(this.$form);
        this.$htmlSettingsClass = body.find('.html-settings-class');
        this.$htmlSettingsId = body.find('.html-settings-id');
        this.$htmlSettingsStyles = body.find('.html-settings-styles');
        this.$cancelBtn = body.find('.cancel');
        this.addListener(this.$cancelBtn, 'click', 'hide');
        return this.addListener(this.$form, 'submit', 'onFormSubmit');
      },
      onFormSubmit: function(e) {
        e.preventDefault();
        if (!this.visible) {
          return;
        }
        this.trigger('setHtmlSettings', {
          settings: {
            "class": this.$htmlSettingsClass.val(),
            id: this.$htmlSettingsId.val(),
            styles: this.$htmlSettingsStyles.val()
          }
        });
        return this.hide();
      },
      onFadeOut: function() {
        this.base();
        return this.destroy();
      },
      destroy: function() {
        this.base();
        this.$container.remove();
        return this.$shade.remove();
      },
      show: function(html) {
        var self, values;
        self = this;
        values = html[this.field.id];
        $.each(values, function(key, value) {
          if (key === 'class' && value) {
            self.$htmlSettingsClass.val(value);
          }
          if (key === 'id' && value) {
            self.$htmlSettingsId.val(value);
          }
          if (key === 'styles' && value) {
            return self.$htmlSettingsStyles.val(value);
          }
        });
        if (!Garnish.isMobileBrowser()) {
          setTimeout($.proxy((function() {
            return this.$htmlSettingsClass.focus();
          }), this), 100);
        }
        return this.base();
      }
    });
    FieldInputSettingsModal = Garnish.Modal.extend({
      field: null,
      init: function(field) {
        var body;
        this.field = field;
        this.base();
        this.$form = $('<form class="modal fitted formbuilder-modal">').appendTo(Garnish.$bod);
        this.setContainer(this.$form);
        body = $(['<header>', '<span class="modal-title">', 'Input Settings', '</span>', '<div class="instructions">', 'Add custom input settings', '</div>', '</header>', '<div class="body">', '<div class="fb-field">', '<div class="input-hint">', 'SIZE', '</div>', '<input type="text" class="text fullwidth input-settings-size">', '</div>', '</div>', '<footer class="footer">', '<div class="buttons">', '<input type="button" class="btns btn-modal cancel" value="' + Craft.t('Cancel') + '">', '<input type="submit" class="btns btn-modal submit" value="' + Craft.t('Save') + '">', '</div>', '</footer>'].join('')).appendTo(this.$form);
        this.$inputSettingsSize = body.find('.input-settings-size');
        this.$cancelBtn = body.find('.cancel');
        this.addListener(this.$cancelBtn, 'click', 'hide');
        return this.addListener(this.$form, 'submit', 'onFormSubmit');
      },
      onFormSubmit: function(e) {
        e.preventDefault();
        if (!this.visible) {
          return;
        }
        this.trigger('setInputSettings', {
          settings: {
            size: this.$inputSettingsSize.val()
          }
        });
        return this.hide();
      },
      onFadeOut: function() {
        this.base();
        return this.destroy();
      },
      destroy: function() {
        this.base();
        this.$container.remove();
        return this.$shade.remove();
      },
      show: function(input) {
        var self, values;
        self = this;
        values = input[this.field.id];
        $.each(values, function(key, value) {
          if (key === 'size' && value) {
            return self.$inputSettingsSize.val(value);
          }
        });
        if (!Garnish.isMobileBrowser()) {
          setTimeout($.proxy((function() {
            return this.$inputSettingsSize.focus();
          }), this), 100);
        }
        return this.base();
      }
    });
    window.FieldSettings = FieldSettings;
    window.FieldEditor = FieldEditor;
    window.FieldInputSettingsModal = FieldInputSettingsModal;
    return window.FieldHtmlSettingsModal = FieldHtmlSettingsModal;
  }
})(window.jQuery);

function isToggler(item) {
    console.log(item)
}

var OptionModal;

window.OptionModal = Garnish.Modal.extend({
    option: null,
    $form: null,
    $modalInputs: null,
    $redactor: null,
    $validationItems: [],
    
    $togglerInput: null,
    hasTogglers: false,

    errors: [],
    errorLength: 0,

    init: function(option) {
        var body, fields, self;
        self = this;
        this.option = option;
        this.base();
        this.$form = $('<form class="modal fitted formbuilder-modal">').appendTo(Garnish.$bod);
        this.setContainer(this.$form);
        
        body = $([
            '<header>', 
                '<span class="modal-title">', option.$data.title, '</span>', 
                '<div class="instructions">', option.$data.instructions, '</div>', 
            '</header>', 
            '<div class="body"></div>', 
            '<footer class="footer">', 
                '<div class="buttons">', 
                    '<input type="button" class="btns btn-modal cancel" value="' + Craft.t('Cancel') + '">', 
                    '<input type="submit" class="btns btn-modal submit" value="' + Craft.t('Save') + '">', 
                '</div>', 
            '</footer>'].join('')).appendTo(this.$form);
        
        toggler = option.$inputs.some(function(elem) { return elem.toggler } )
        this.hasTogglers = toggler

        $.each(option.$inputs, function(i, item) {
            var $input, camelClassName, className, required, validation;
            required = item.required ? 'data-required' : 'data-not-required';
            
            if (item.toggler) {
                self.$togglerInput = item;
            }

            if (item.type !== 'checkbox' && !item.toggler) {
                className = item.name.replace(/[_\W]+/g, "-").slice(0, -1);
                
                camelClassName = className.replace(/-([a-z])/g, function(g) {
                    return g[1].toUpperCase();
                });

                if (item.validation) {
                    validation = item.validation;
                    validation['passed'] = false;
                    validation['inputClass'] = className;
                    self.$validationItems[i] = item;
                }

                if (item.type === 'textarea') {
                    $input = "<textarea class='" + className + " " + required + "' value='" + item.value + "' data-hint='" + item.hint + "' data-name='" + item.name + "' " + required + " />" + item.value + "</textarea>";
                } else if (item.type === 'select') {
                    $input = $.parseJSON(item.options);
                } else {
                    $input = "<input type='" + item.type + "' class='" + className + " " + required + "' value='" + item.value + "' data-hint='" + item.hint + "' data-name='" + item.name + "' " + required + " />";
                }

                return self.renderInputs(required, $input, item.value, item.type, item.name, item.hint, className);
            }
        });

        if (this.option.$container.hasClass('has-fields')) {
            fields = new Fields(this.option, this.$form);
        }

        this.$modalInputs = this.$form.find('.body').find('input, textarea, select');

        if (this.$togglerInput) {
            this.activateFieldToggle();
        }

        this.show();
        this.$saveBtn = body.find('.submit');
        this.$cancelBtn = body.find('.cancel');
        this.addListener(this.$cancelBtn, 'click', 'cancel');

        return this.addListener(this.$form, 'submit', 'save');
    },

    activateFieldToggle: function() {
        let $toggler
        let item

        $toggler = this.$form.find('.toggle-btn')

        if (this.$togglerInput.value) {
            item = this.$form.find('[data-selection-target="' + this.$togglerInput.value + '"]')
            item.parent().addClass('active-field')
        } else {
            $($toggler[0]).parent().addClass('active-field')
            target = $($toggler[0]).data('selection-target')
            input = $('input[name="' + this.$togglerInput.name + '"]')
            input.val(target)
        }

        $toggler.on('click', $.proxy((function(e) {
            let input
            let target

            // $toggler.removeClass('active-field');
            $toggler.parent().removeClass('active-field')

            $(e.target).parent().addClass('active-field')
            // $(e.target).addClass('active-field');

            target = $(e.target).data('selection-target')
            input = $('input[name="' + this.$togglerInput.name + '"]')
            input.val(target)
        }), this))

    },

    renderInputs: function(required, el, value, type, name, hint, className) {
        var $input, togglerClass

        togglerClass = this.hasTogglers ? 'toggle-field' : ''
        if (type === 'select') {
            $input = $(
                '<div class="fb-field '+togglerClass+'">' + 
                    '<div class="input-hint">' + hint + '</div>' + 
                    '<div class="select input"><select class="' + className + ' ' + required + '" data-hint="' + hint + '" data-name="' + name + '" /></div>' + 
                '</div>');
            $.each(el, function(i, item) {
                $input.find('select').append($('<option>', {
                    value: item.value,
                    text: item.label
                }));
            });
            $input.find('select').val(value);
        } else {
            $input = $(
                '<div class="fb-field '+togglerClass+'">' + 
                    '<div class="input-hint">' + hint + '</div>' + 
                    '<div class="input">' + el + '</div>' + 
                '</div>');
        }

        if (this.hasTogglers) {
            $input.append($('<div class="toggle-btn" data-selection-target="' + hint.toLowerCase() + '"></div>'))
        }

        this.$form.find('.body').append($input);

        // if (type === 'textarea') {
        //     return this.initRedactor(el);
        // }
    },

    initRedactor: function(item) {
        var className, el;
        className = $(item)[0].className;
        el = this.$form.find("." + className);
        el.redactor({
            maxHeight: 160,
            minHeight: 150,
            maxWidth: '400px',
            buttons: ['bold', 'italic', 'link', 'horizontalrule'],
            plugins: ['fontfamily', 'fontsize', 'alignment', 'fontcolor']
        });

        return this.$redactor = el.redactor('core.object');
    },

    cancel: function() {
        if (!this.option.editing) {
            this.option.$edit.addClass('hidden');
            this.option.$container.removeClass('option-enabled');
            this.option.$resultContainer.html('');
            this.option.$toggle.html('ENABLE');
            this.disableOption();
            return this.closeModal();
        } else {
            return this.closeModal();
        }
    },

    disableOption: function() {
        if (this.option.$enableCheckbox) {
            return this.option.$enableCheckbox.prop('checked', false);
        }
    },

    hide: function() {
        return this.cancel();
    },

    closeModal: function(ev) {
        this.disable();

        if (ev) {
            ev.stopPropagation();
        }

        if (this.$container) {
            this.$container.velocity('fadeOut', {
                duration: Garnish.FX_DURATION
            });

            this.$shade.velocity('fadeOut', {
                duration: Garnish.FX_DURATION,
                complete: $.proxy(this, 'onFadeOut')
            });

            if (this.settings.hideOnShadeClick) {
                this.removeListener(this.$shade, 'click');
            }

            this.removeListener(Garnish.$win, 'resize');
        }

        this.visible = false;
        Garnish.Modal.visibleModal = null;
        
        if (this.settings.hideOnEsc) {
            Garnish.escManager.unregister(this);
        }

        this.trigger('hide');

        return this.settings.onHide();
    },

    runValidation: function(e) {
        var self;
        e.preventDefault();
        self = this;

        if (this.$validationItems) {
            return $.each(this.$validationItems, function(i, item) {
                var input;
                input = self.$form.find("." + item.validation.inputClass);
                if (input.val().match(/^\d+$/)) {
                    return item.validation.passed = true;
                } else {
                    item.validation.passed = false;
                    return Craft.cp.displayNotice(item.validation.errorMessage);
                }
            });
        } else {
            return this.save();
        }
    },

    save: function(e) {
        var self;
        e.preventDefault();
        self = this;

        if (this.option.$container.hasClass('tags')) {
            this.checkErrors();
            if (this.errors.length > 0) {
                $.each(self.errors, function(i, item) {
                    $(item).parent().parent().addClass('error');
                });

                Garnish.shake(this.$container);
            } else {
              this.updateOption();
            }
        } else {
            this.checkErrors();
            if (this.errorLength === this.$modalInputs.length) {
                $.each(self.errors, function(i, item) {
                    if ($(item).is('select')) {
                        $(item).parent().parent().addClass('error');
                    } else {
                        $(item).parent().parent().addClass('error');
                    }
                });

                Garnish.shake(this.$container);
            } else {
                this.updateOption();
            }
        }
    },

    checkErrors: function() {
        var self;
        self = this;
        this.errors = [];
        this.errorLength = 0;

        $.each(this.$modalInputs, function(i, item) {
            if ($(item).hasClass('data-required')) {
                if ($(item).val() === '') {
                    self.errors[i] = item;
                    self.errorLength += 1;
                }
            }
        });
    },

    updateOption: function() {
        this.option.updateHtmlFromModal();
        this.closeModal();
        this.$form[0].reset();

        Craft.cp.displayNotice(this.option.$data.successMessage);
    }
});
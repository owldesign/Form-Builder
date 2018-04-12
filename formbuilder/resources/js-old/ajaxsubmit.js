var AjaxForm,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

AjaxForm = (function() {
  function AjaxForm(el) {
    this.init = bind(this.init, this);
    this.$form = $(el);
    this.$notificationContainer = $('<div></div>');
  }

  AjaxForm.prototype.init = function() {
    return this.$form.on('submit', $.proxy(((function(_this) {
      return function(e) {
        e.preventDefault();
        return _this.submitForm(e);
      };
    })(this)), this));
  };

  AjaxForm.prototype.submitForm = function(e) {
    var data, url;
    data = this.$form.serialize();
    url = '/actions/formBuilder/entry/save';
    this.$form.addClass('submitting');
    return $.post(url, data, $.proxy((function(response) {
      var responseEvent;
      this.$form.removeClass('submitting');
      this.$form.append(this.$notificationContainer);
      if (response.success) {
        if (window.CustomEvent) {
          responseEvent = new CustomEvent('formbuilder:submit', {
            detail: {
              'response': response,
              'class': e.currentTarget.className,
              'handle': e.currentTarget.id
            },
            bubbles: true,
            cancelable: true
          });
          e.currentTarget.dispatchEvent(responseEvent);
        }
        this.$notificationContainer.html('<p class="form-notification success-message">' + response.message + '</p>');
        return this.$form[0].reset();
      } else {
        return this.$notificationContainer.html('<p class="form-notification fail-message">' + response.message + '</p>');
      }
    }), this));
  };

  return AjaxForm;

})();

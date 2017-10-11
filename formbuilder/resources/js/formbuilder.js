var Branding;

if ($ && window.Garnish) {
  Branding = Garnish.Base.extend({
    displayFooter: function(plugin) {
      var brandHtml;
      brandHtml = '<ul>';
      brandHtml += '<li><a href="' + plugin.pluginUrl + '" target="_blank">' + plugin.pluginName + '</a> ' + plugin.pluginVersion + '</li>';
      brandHtml += '<li> Made by <a href="' + plugin.developerUrl + '" target="_blank">' + plugin.developerName + '</a> (owldesign)</li>';
      brandHtml += '</ul>';
      return $('#footer').append(brandHtml);
    }
  });
}

Garnish.$doc.ready(function() {
  var data, menuItem;
  menuItem = $('#nav-formbuilder');
  data = {
    title: window.FormBuilder.pageTitle
  };
  return Craft.postActionRequest('formBuilder/renderNavigation', data, $.proxy((function(response, textStatus) {
    if (response.success) {
      menuItem.append(response.markup);
    }
    if (window.FormBuilder.unreadCount > 0) {
      return $('.total-entry-count').html(window.FormBuilder.unreadCount);
    } else {
      if ($('body').hasClass('fb-dashboard')) {
        return $('.notifications .total-entry-count').html('0');
      } else {
        return $('.total-entry-count').html('');
      }
    }
  }), this));
});

var Branding, formCount, templateCount, unreadCount;

if ($ && window.Garnish) {
  if (window.FormBuilder) {
    unreadCount = window.FormBuilder.unreadCount;
    formCount = window.FormBuilder.formCount;
    templateCount = window.FormBuilder.templateCount;
    if (unreadCount > 0) {
      $('<style>#nav-formbuilder .subnav > li:nth-child(3)::after{display:block;content:"' + unreadCount + '"}</style>').appendTo('head');
    }
  }
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

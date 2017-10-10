var loader;

if ($ && window.Garnish) {
  loader = $('.slack-loader');
  $('#slack-invitation').on('submit', function(e) {
    var data;
    loader.velocity('fadeIn', {
      duration: '200'
    });
    e.preventDefault();
    data = $(this).serialize();
    return Craft.postActionRequest('https://formbuildertools.slack.com/join/shared_invite/enQtMjQ1OTExNTQ1ODQ2LWU1OWY0YTY3Mzc2ZWU2MTc5Mzc2MjNlZjIyNmU4YWIxZWZjZDlkZTY0NDY1ZWI4NmFlZjcxODQ4NDA0YTFlNjc', data, function(response, textStatus) {
      return console.log(response);
    });
  });
}

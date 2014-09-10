if (Meteor.isClient) {
  Transform = famous.core.Transform;

  Session.set('menuOpen', false);

  // Translation for "main" page, depending on whether menu is open or not
  Template.famousInit.menuTranslate = function() {
    return Session.get('menuOpen') ? [250,0,20] : [0,0,20];
  }

  // Set the transition to be used when translate= changes reactively
  Template.main.rendered = function() {
    FView.from(this).modifierTransition = { curve: 'easeInOut', duration: 500 };
  }

  // On click, toggle the menuOpen state / reactive Session variable
  Template.main.famousEvents({
    'mouseup': function(event, tpl) {
      Session.set('menuOpen', !Session.get('menuOpen'));
    }
  });

  // Simple queue.  Push functions which will get run and removed every 100ms
  var queue = [];
  Meteor.setInterval(function() {
    if (queue.length)
      queue.shift()();
  }, 100);

  Deps.autorun(function() {
    if (Session.get('menuOpen'))
      _.each(FView.byId('menu').children, function(strip) {
        // Move the strips out of sight immediately
        strip.modifier.setTransform(Transform.translate(-500,85));

        // And queue them to stagger in back to their original position
        queue.push(function() {
          strip.modifier.setTransform(Transform.translate(0,0),
            { duration: 500, curve: 'easeOut' });
        });
      });
  });

}
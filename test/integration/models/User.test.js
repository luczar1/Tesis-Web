var util = require('util');

describe('User (model)', function() {

  describe('#checkUser()', function() {
    it('Deberia devolver un usuario', function (done) {
      User.checkUser("prueba@prueba.com", "prueba")
        .then(function(user) {

          if (!user) {
            return done(new Error(
              'Deberia devolver un usuario '+
              'Pero deolvio: '+util.inspect(user, {depth:null})+''
            ));
          }//-•

          return done();

        })
        .catch(done);
    });
  });
  describe('#checkUser()', function() {
    it('Debería devolver false', function (done) {
      User.checkUser("prueba@prueba.com", "prueba2")
        .then(function(user) {
          if (!user) {
           return done();
          }//-•

          return done(new Error(
            'Deberia devolver un usuario '+
            'Pero deolvio: '+util.inspect(user, {depth:null})+''
          ));

        })
        .catch(done);
    });
  });

});

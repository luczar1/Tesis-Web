/*
var util = require('util');

describe('User (model)', function() {

  describe('#login()', function() {
    it('Deberia devolver True (Good Password)', function (done) {
      User.login("prueba@prueba.com", "prueba", req.session)
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

    it('Debería devolver false (Bad Password)', function (done) {
      User.login("prueba@prueba.com", "prueba2", req.session)
        .then(function(user) {
          if (!user) {
            return done();
          }//-•

          return done(new Error(
            'Deberia devolver un usuario '+
            'Pero devolvio: '+util.inspect(user, {depth:null})+''
          ));

        })
        .catch(done);
    });
  });
});
*/

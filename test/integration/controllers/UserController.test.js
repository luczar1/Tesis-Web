var supertest = require('supertest');

describe('UserController', function() {


  describe('#login()', function() {
    it('Deberia permanecer en /login', function (done) {
      supertest(sails.hooks.http.app)
        .get('/login')
        .expect(200, done);
    });
    it('Deberia redireccionar a /login (Bad Password)', function (done) {
      supertest(sails.hooks.http.app)
        .post('/login')
        .send({ email: 'prueba@prueba.com', pass: 'badPass' })
        .expect(302)
        .expect('location','/login', done);
    });

    it('Deberia redireccionar a  /panel/home (Good Password)', function (done) {
      supertest(sails.hooks.http.app)
        .post('/login')
        .send({ email: 'prueba@prueba.com', pass: 'prueba' })
        .expect(302)
        .expect('location','/panel/home', done);
    });
    it('Deberia devolver notFound', function (done) {
      supertest(sails.hooks.http.app)
        .get('/user')
        .expect(404, done);
    });
  });

  describe('#logout()', function() {
    it('Deberia redireccionar a  /login', function (done) {
      supertest(sails.hooks.http.app)
        .get('/logout')
        .expect(302)
        .expect('location','/login', done);
    });
  });


});

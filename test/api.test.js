const request = require('supertest');

const app = require('../src/app');

describe('GET /', () => {
  it('Verification GET /mspr-ci/customers/{userId}', function(done) {
    request(app)
      .get('/mspr-ci/customers/zYpb4pQ6AlTJ0i9bDk6r')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

describe('GET /', () => {
  it('Verification GET /mspr-ci/customers', function(done) {
    request(app)
      .get('/mspr-ci/customers')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

describe('GET /', () => {
  it('Verification GET /mspr-ci/purchases/{userId}', function(done) {
    request(app)
      .get('/mspr-ci/purchases/zYpb4pQ6AlTJ0i9bDk6r')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

describe('GET /', () => {
  it('Verification GET /mspr-ci/turnovers', function(done) {
    request(app)
      .get('/mspr-ci/turnovers')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});
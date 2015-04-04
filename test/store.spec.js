var expect = require('chai').expect;
var NeedThis = require('../');

describe('NeedThis store', function() {
  describe('Constructor', function() {
    it('should be a constructor', function() {
      expect(NeedThis).to.be.a('function');
    });
  });
  describe('specific store methods', function() {
    var store;
    before(function() {
      store = new NeedThis();
      var User = function User() {
      };
      store.store(User);
    });

    describe('#find', function() {
      it('should add an item to the cache when it doesn\'t exist yet', function(done) {
        expect(store.grab('user', 'schniz')).to.be.falsey;
        store.find('user', 'schniz').then(function(user) {
          expect(user).to.not.be.undefined.and.not.be.null;
          done();
        }).catch(done);
      });
      it('should call fetch only once for two searches', function(done) {
        var oldFetcher = store.fetcher;
        var times = 0;
        store.fetcher = function(fetchData, callbacks) {
          times++;
          if (times > 1) return done(new Error('called fetch more than once'));
          Object.keys(callbacks).forEach(function(storeName) {
            Object.keys(callbacks[storeName]).forEach(function(ids) {
              callbacks[storeName][ids].forEach(function(callback) {
                callback();
              });
            });
          });
        };
        Promise.all([
          store.find('user', 'schniz'),
          store.find('user', 'kfirstri')
        ]).then(function() {
          store.fetcher = oldFetcher;
          done();
        }).catch(function(err) {
          store.fetcher = oldFetcher;
          done(err);
        });
      });
    });

    describe('#fetch', function() {
    });
  });
});

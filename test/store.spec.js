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
    });

    describe('#fetch', function() {
    });
  });
});

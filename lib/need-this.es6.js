var request = require('superagent');
var debug = require('debug')('need-this');
var Im = require('immutable');

class NeedThis {
  constructor() {
    this.stores = {};
    this.queue = Im.Set();
    this.callbackQueues = {};
  }

  /**
   * Create the specific store in the big store
   *
   * @return {NeedThis} the big store
   */
  store(storeClass, name) {
    ['find', 'grab'].forEach(func => {
      storeClass[func] = this[func].bind(storeClass, storeClass.name);
    });
    storeClass.store = this;
    this.stores[storeClass.name.toLowerCase()] = {};
    return this;
  }

  /**
   * Finds a record in a store, given the ID
   * @param {string} store The store name
   * @param {string} id    The record ID
   * @return {Promise} that returns the value, if its in the cache, it will return it immediately,
   *                   and you can bind to the 'change' event for the updates.
   */
  find(store, id) {
    return new Promise((resolve, reject) => {
      let result = this.stores[store][id];
      if (result) resolve(result);
      reject(new Error('need to fetch'));
    }).catch(() => {
      return this.fetch(store, id);
    });
  }

  /**
   * Creates a new request request, if the queue is not empty.
   *
   * @return {NeedThis} the big store
   */
  engageQueue() {
    if (this.isNextQueue || !this.queue.size) return;
    this.isNextQueue = setTimeout(() => {
      this.callServer();
    }, 20);
    return this;
  }

  /**
   * The method for calling the server side
   *
   * @return {void}
   */
  callServer() {
    var queue = this.queue;
    this.isNextQueue = false;
    queue.forEach(item => {
      debug(`fetching ${item.get('store')}:${item.get('id')}`);
      var data = {
        id: 'schniz',
        name: 'Gal Schlezinger'
      };
      this.callbackQueues[item.get('store')][item.get('id')].forEach(item => item(data));
    });
  }

  /**
   * Forces a server side fetch
   *
   * @param {string} store The store name
   * @param {string} id    The record ID
   * @return {Promise} that will be resolved when there is a response from the server
   */
  fetch(store, id) {
    this.queue = this.queue.add(Im.Map({ store: store, id: id }));
    this.engageQueue();
    return new Promise((resolve, reject) => {
      this.callbackQueues[store] = this.callbackQueues[store] || {};
      this.callbackQueues[store][id] = this.callbackQueues[store][id] || [];
      this.callbackQueues[store][id].push(resolve);
    }).then(data => {
      this.stores[store][id] = data;
      return this.grab(store, id);
    });
  }

  /**
   * Just grabbin' something from the cache.
   *
   * @param {string} store The store name
   * @param {string} id    The record ID
   * @return {mixed} the data stored in the cache for the specific item at the current time.
   */
  grab(store, id) {
    return this.stores[store][id];
  }
}

NeedThis.needThis = null;

module.exports = NeedThis;

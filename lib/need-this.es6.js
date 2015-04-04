var request = require('superagent');
var debug = require('debug')('need-this');
var Im = require('immutable');

var DebugDataFetcher = require('./fetchers/debug-data-fetcher');

class NeedThis {
  constructor() {
    this.stores = {};
    this.queue = Im.Set();
    this.callbackQueues = {};
    this.fetcher = DebugDataFetcher;
    this.timePerFetch = 20; // ms
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
    }, this.timePerFetch);
    return this;
  }

  /**
   * clears the queue
   *
   * @return {Immutable.Set} contains the current set
   */
  clearQueue() {
    var queue = this.queue;
    this.queue = this.queue.clear();
    this.isNextQueue = false;
    return queue;
  }

  /**
   * The method for calling the server side
   *
   * @return {void}
   */
  callServer() {
    let queue = this.clearQueue();
    this.fetcher(queue, this.callbackQueues);
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

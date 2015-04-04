var debug = require('debug')('need-this:fetcher:debug');

/**
 * Fetching demo data for NeedThis 
 * Call the callbacks with the same data over and over again.
 * @return {undefined}
 */
module.exports = (dataToFetch, callbacks) => {
  dataToFetch.forEach(item => {
  let key = [item.get('store'), item.get('id')];
    debug(`fetching ${key.join(':')}`);
    var data = {
      id: item.get('id'),
      name: 'Gal Schlezinger'
    };
    callbacks[item.get('store')][item.get('id')].forEach(callback => callback(data));
  });
};

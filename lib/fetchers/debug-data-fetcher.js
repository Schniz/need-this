var debug = require('debug')('need-this:fetcher:debug');

module.exports = (dataToFetch, callbacks) => {
  dataToFetch.forEach(item => {
  let key = [item.get('store'), item.get('id')];
    debug(`fetching ${key.join(':')}`);
    var data = {
      id: 'schniz',
      name: 'Gal Schlezinger'
    };
    callbacks[item.get('store')][item.get('id')].forEach(callback => callback(data));
  });
};

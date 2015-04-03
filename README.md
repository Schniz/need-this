WebSockets Integ for React
==========================

Basically will produce a WebSockets that you can call:

```javascript
{
  "modelName": ['attributeName', 'attributeName']
}
```

and then the React will update the children.

React Ideas
===========

GraphQL
-------
Still I can't decide between the `GraphQL` of facebook:

```javascript
class MyComp extends React.Component {
  getQuery() {
    return `{
      modelName: {
        attributeName1,
        attributeName2
      }
    }`;
  }
}
```

Simple JSON Query
-----------------

```javascript
var needThis = require('need-this').needThis; // or just null?

class MyComp extends React.Component {
  getQuery() {
    return {
      modelName: {
        attributeName1: needThis,
        attributeName2: needThis,
        attributeName3: needThis
      }
    };
  }
}
```

One store with Socket.IO
------------------------
### Simple JSON
```javascript
var store = require('./store');
var needThis = require('need-this').needThis;

class MyComp extends React.Component {
  constructor() {
    this.bindQuery();
  }
  bindQuery() {
    store.iNeed({
      modelName: {
        attributeName1: needThis
      }
    });
  }
}
```

### Modeling
- ID is just a string. you can render it the way you want, but it must be unique for not having problems.
- All the data will be stored in `this.data`
- Fucking simple implementation. `User.find(id)` will return a Promise: if there is something on the cache, it will provide it, but add a request to the dispatcher to grab a new copy.
- 20ms between each request. so we'd request one time and then refresh the cache.

#### OO Classes

```javascript
class User extends NeedThisModel {
  id() {
    return this.data._id;
  }
}

class Point extends NeedThisModel {
  id() {
    return [this.data.x, this.data.y].join(",")
  }
}
```

#### Wrappers

```javascript
class Post {
  id() {
    return this.slug;
  }
}

module.exports = needThis(Post);
```

#### Wrapper in a store

```javascript
var store = require('./store'); // the only store

class Message {
  id() {
    return `${this.from}:${this.to}:${this.timestamp}`;
  }
}

store.needThis(Message);
```

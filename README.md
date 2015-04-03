WebSockets Integ for React
==========================

Basically will produce a WebSockets that you can call:

```javascript
{
  "modelName": ['attributeName', 'attributeName']
}
```

and then the React will update the children.

Running through the React App:
------------------------------

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

or doing just something simple as

``javascript
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

or maybe implementing one store:

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

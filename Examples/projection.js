let { data, Person } = require('./filterArray'),
    S = require('./setFuncs');

let PersonProperties = 
      Object.getOwnPropertyNames(Person.prototype)
            .reduce((obj, propName) => {
              obj[propName] = 
                Object.getOwnPropertyDescriptor(Person.prototype, propName); 
              return obj
            }, {});

let dataPrototypeSym = Symbol('dataProtortype'),
    projFieldsSym = Symbol('projFields');

function Query(proto, data) {
  this.data = data;
  this[dataPrototypeSym] = proto;
  this[projFieldsSym] = 
    data.length !== 0
    ? new Set(Object.getOwnPropertyNames(proto))
    : null;
}

Query.prototype.projection = function(fields, excluding=false) {
  let projFields = this[projFieldsSym];
  this[projFieldsSym] = projFields !== null
                        ? ( excluding
                          ? S.substruct(fields, projFields)
                          : S.intersect(fields, projFields))
                        : ( excluding 
                          ? null
                          : new Set(fields));
  return this;
}

Query.prototype.project = function() {
  let res = this.data.map(elem => {
    let res = Object.keys(elem).reduce((obj, propName) => {
      obj[propName] = elem[propName];
      return obj;
    }, Object.create(Person.prototype, PersonProperties));
    return res;
  });
  return res;
}

function testProjectionWithFunc(func, ...args) {
  let query = new Query(Person.prototype, data);
  func(query.projection(...args).project());
}

function testProjection(...args) {
  testProjectionWithFunc(console.log, ...args);
}

function testProjectionAge(...args) {
  testProjectionWithFunc(x => console.log(x[0].birth), ...args);
}

testProjection(['name', 'city']);
testProjection(['name', 'city'], true);
testProjectionAge(['name']);
testProjectionAge(['name'], true);

module.exports = {
  Query
}

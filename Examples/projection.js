let { data, Person } = require('./filterArray'),
    S = require('./setFuncs');

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
  return this.data.map(elem => {
    let res = Array.prototype.slice.call(elem);
    res.__proto__ = Person.prototype;
    return res;
  });
}

function testProjectionWithFunc(func, ...args) {
  let query = new Query(Person.prototype, data);
  func(query.projection(...args).project());
}

function testProjection(...args) {
  testProjectionWithFunc(console.log, ...args);
}

function testProjectionAge(...args) {
  testProjectionWithFunc(x => console.log(x[0].age), ...args);
}

testProjection(['name', 'city']);
testProjection(['name', 'city'], true);
testProjectionAge(['name']);
testProjectionAge(['name'], true);

module.exports = {
  Query
}

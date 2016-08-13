let { data, metadata, buildGetter, Person } = require('./filterArray'),
    S = require('./setFuncs');

let metadataSym = Symbol('metadata'),
    projFieldsSym = Symbol('projFields');

function Query(metadata, data) {
  this.data = data;
  this[metadataSym] = metadata;
  this[projFieldsSym] = new Set(Object.keys(metadata));
}

Query.prototype.projection = function(fields, excluding=false) {
  let projFields = this[projFieldsSym];
  this[projFieldsSym] = excluding
                      ? S.substruct(projFields, fields)
                      : S.intersect(fields, projFields);
  return this;
}

Query.prototype.project = function() {
  let metadata = this[metadataSym],
      projFields = this[projFieldsSym];

  var i = 0;
  function Projection() {}
  [...projFields].forEach(fieldname => {
    buildGetter(Projection.prototype, fieldname, metadata[fieldname], i++);
  });

  return this.data.map(elem => {
    var i = 0;
    let res = [...projFields].reduce((resArr, fieldname) => {
      resArr[i++] = elem[fieldname];
      return resArr;
    }, new Array(projFields.length));
  
    res.__proto__ = Projection.prototype;
    return res;
  });
}

function testProjectionWithFunc(func, ...args) {
  let query = new Query(metadata, data);
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
testProjectionAge(['name', 'age']);

module.exports = {
  Query
}

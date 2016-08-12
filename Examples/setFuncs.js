function intersect(col1, col2) {
  let arr1 = colToArr(col1),
      set2 = colToSet(col2);
  return arr1.filter(el => set2.has(el));
}

function substruct(col1, col2) {
  let arr1 = colToArr(col1),
      set2 = colToSet(col2);
  return arr1.filter(el => !set2.has(el));
}

function colToArr(col) {
  return col.__proto__ !== Array.prototype
       ? [...col]
       : col;
}

function colToSet(col) {
  return col.__proto__ !== Set.prototype
       ? new Set(colToArr(col))
       : col;
}

module.exports = {
  intersect,
  substruct
}

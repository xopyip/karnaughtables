let tableOr = function (a: boolean[], b: boolean[]): boolean[] {
  return Array.from(Array(16), (_, i) => a[i] || b[i]);
};

let tableAnd = function (a: boolean[], b: boolean[]): boolean[] {
  return Array.from(Array(16), (_, i) => a[i] && b[i]);
};

let tableNeq = function (a: boolean[]): boolean[] {
  return Array.from(Array(16), (_, i) => !a[i]);
};

let column = function (n: number): boolean[] {
  return Array.from(Array(16), (_, i) => i % 4 === n - 1);
};

let row = function (n: number): boolean[] {
  return Array.from(Array(16), (_, i) => Math.floor(i / 4) === n - 1);
};

const signals: { [K in any]: boolean[] } = {
  'A': tableOr(column(2), column(3)),
  'B': tableOr(column(3), column(4)),
  'C': tableOr(row(2), row(3)),
  'D': tableOr(row(3), row(4))
};

export {tableOr, tableNeq, tableAnd, column, row, signals};
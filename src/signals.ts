/**
 * Returns 4x4 that has true where at least one of given arrays contains true
 * @param a : boolean[]
 * @param b : boolean[]
 */
let tableOr = function (a: boolean[], b: boolean[]): boolean[] {
  return Array.from(Array(16), (_, i) => a[i] || b[i]);
};

/**
 * Returns 4x4 that has only true where both of given arrays contains true
 * @param a : boolean[]
 * @param b : boolean[]
 */
let tableAnd = function (a: boolean[], b: boolean[]): boolean[] {
  return Array.from(Array(16), (_, i) => a[i] && b[i]);
};

/**
 * Returns 4x4 that has negated values
 * @param a
 */
let tableNeq = function (a: boolean[]): boolean[] {
  return Array.from(Array(16), (_, i) => !a[i]);
};

/**
 * Returns 4x4 table with column filled with true values
 * @param n
 */
let column = function (n: number): boolean[] {
  return Array.from(Array(16), (_, i) => i % 4 === n - 1);
};

/**
 * Returns 4x4 table with row filled with true values
 * @param n
 */
let row = function (n: number): boolean[] {
  return Array.from(Array(16), (_, i) => Math.floor(i / 4) === n - 1);
};

/**
 * Map of basic signals
 */
const signals: { [K in any]: boolean[] } = {
  'A': tableOr(column(2), column(3)),
  'B': tableOr(column(3), column(4)),
  'C': tableOr(row(2), row(3)),
  'D': tableOr(row(3), row(4))
};

/**
 * Returns index of row (0-3)
 * @param idx
 */
const getRow = function (idx: number) {
  return Math.floor(idx / 4);
}
/**
 * Returns index of column (0-3)
 * @param idx
 */
const getColumn = function (idx: number) {
  return idx % 4;
}

/**
 * Contains functions that returns index of sibling in specific direction
 */
const SignalMove = {
  LEFT: (idx: number) => idx - idx % 4 + (idx + 3) % 4,
  RIGHT: (idx: number) => idx - idx % 4 + (idx + 1) % 4,
  UP: (idx: number) => (idx - 4 + 16) % 16,
  DOWN: (idx: number) => (idx + 4 + 16) % 16,
}
/**
 * converts list of columns to signal requirements
 * @param columns
 */
const lookupColumnToSignal = function (columns: number[]) {
  if (columns.length === 4) {
    return ""; //any combination of column signals
  }
  if (columns.length === 2) {
    return ["B\u0305", "A", "B", "A\u0305"][Math.min(columns[0], columns[1])];
  }
  return ["A\u0305B\u0305", "AB\u0305", "AB", "A\u0305B"][columns[0]];
}
/**
 * converts list of rows to signal requirements
 * @param rows
 */
const lookupRowToSignal = function (rows: number[]) {
  if (rows.length === 4) {
    return ""; //any combination of row signals
  }
  if (rows.length === 2) {
    return ["D\u0305", "C", "D", "C\u0305"][Math.min(rows[0], rows[1])];
  }
  return ["C\u0305D\u0305", "CD\u0305", "CD", "C\u0305D"][rows[0]];
}

export {
  tableOr,
  tableNeq,
  tableAnd,
  column,
  row,
  signals,
  SignalMove,
  getRow,
  getColumn,
  lookupColumnToSignal,
  lookupRowToSignal
};
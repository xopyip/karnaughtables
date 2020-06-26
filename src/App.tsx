import React, {useState} from 'react';
import EquationInput from "./components/EquationInput";
import {
  getColumn,
  getRow,
  lookupColumnToSignal,
  lookupRowToSignal,
  SignalMove,
  signals,
  tableAnd,
  tableNeq,
  tableOr
} from "./signals";
import KarnaughTable from "./components/KarnaughTable";


function App() {

  let [equation, setEquation] = useState("AB\u0305 + C\u0305A");
  let [tableStates, setTableStates] = useState(Array.from(Array(16), (_) => false));

  let updateEquation = function (eq: string) {
    setEquation(eq);
    let groups = eq.split("+").map(e => e.trim());
    let table = Array.from(Array(16), (_) => false);
    for (let group of groups) {
      let groupTable = Array.from(Array(16), (_) => true);
      for (let c = 0; c < group.length; c++) {
        let signal = signals[group[c]];
        if (c + 1 < group.length && group[c + 1] === '\u0305') {
          signal = tableNeq(signal);
          c++;
        }
        groupTable = tableAnd(groupTable, signal);
      }
      table = tableOr(table, groupTable);
    }
    setTableStates(table);
  };

  //IT'S MAGIC, IT WORKS, DONT TOUCH
  let growRectangle = (table: boolean[], idx: number): number[] => {
    let w = 1, h = 1;
    //if right value is also true then extend
    if (table[SignalMove.RIGHT(idx)] && w === 1) {
      w += 1;
    }
    //if right value is also true then move start to the left and extend
    if (table[SignalMove.LEFT(idx)] && w === 1) {
      idx = SignalMove.LEFT(idx);
      w += 1;
    }
    //we always dont have checked left value, so if two values to the left are true then all values in row is true
    if (w === 2 && table[SignalMove.LEFT(idx)] && table[SignalMove.LEFT(SignalMove.LEFT(idx))]) {
      idx = getRow(idx) * 4;
      w = 4;
    }

    //if value below is also true then extend
    if (h === 1) {
      let can = true;
      for (let dx = 0; dx < w; dx++)
        if (!table[SignalMove.DOWN(getRow(idx) * 4 + (getColumn(idx) + dx) % 4)]) can = false;
      if (can) h += 1;
    }
    //if value above is also true then move start to the row above and extend height
    if (h === 1) {
      let can = true;
      for (let dx = 0; dx < w; dx++)
        if (!table[SignalMove.UP(getRow(idx) * 4 + (getColumn(idx) + dx) % 4)]) can = false;
      if (can) {
        idx = SignalMove.UP(idx);
        h += 1;
      }
    }
    //we always dont have checked value above, so if two values to above are true then all values in column is true
    if (h === 2) {
      let can = true;
      for (let dx = 0; dx < w; dx++)
        if (!table[SignalMove.UP(getRow(idx) * 4 + (getColumn(idx) + dx) % 4)] || !table[SignalMove.UP(SignalMove.UP(getRow(idx) * 4 + (getColumn(idx) + dx) % 4))]) can = false;
      if (can) {
        idx = getColumn(idx);
        h = 4;
      }
    }
    //return indexes of biggest rectangle
    return Array.from(Array(w), (_, i) => getRow(idx) * 4 + (getColumn(idx) + i) % 4) //get indexes of first row
      .flatMap(x => Array.from(Array(h), (_, i) => (x + 4 * i) % 16)); //and flatmap them to all rows
  }

  let updateStatesTable = function (table: boolean[]) {
    setTableStates(table);
    let lookupTable = [...table]; //create copy of table, it contains true only in fields that are not covered by previous rectangles
    let idx;
    let limit = 16;
    let newEquation = "";
    while ((idx = lookupTable.findIndex(en => en)) > -1) { //find first true
      if (newEquation.length > 0) {
        newEquation += " + ";
      }
      let biggestRectangle = growRectangle(table, idx); //create biggest rectangle for that point
      biggestRectangle.forEach(i => lookupTable[i] = false); //update temp table
      //find all columns and rows
      let columns = biggestRectangle.map(idx => getColumn(idx)).filter((v, i, a) => a.indexOf(v) === i);
      let rows = biggestRectangle.map(idx => getRow(idx)).filter((v, i, a) => a.indexOf(v) === i);
      //create new equation
      newEquation += lookupColumnToSignal(columns) + lookupRowToSignal(rows);
      if (limit-- <= 0) {
        //break in case of infinite loop
        //i don't know if that is possible but who cares
        console.log("ERROR");
        return;
      }
    }
    setEquation(newEquation);
  }

  return (
    <div className="App">
      <EquationInput updateEquation={updateEquation} equation={equation}/>
      <KarnaughTable tableStates={tableStates} updateTableStates={updateStatesTable}/>
      <span className={"footer"}>Code: <a
        href={"https://github.com/xopyip/karnaughtables"}>https://github.com/xopyip/karnaughtables</a></span>
    </div>
  );
}

export default App;

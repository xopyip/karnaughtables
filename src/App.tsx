import React, {useState} from 'react';
import EquationInput from "./components/EquationInput";
import {signals, tableAnd, tableNeq, tableOr} from "./signals";
import KarnaughTable from "./components/KarnaughTable";


function App() {

  let [equation, setEquation] = useState("AB\u0305 + C\u0305A");
  let [tableStates, setTableStates] = useState(Array.from(Array(16), (_) => false));

  let updateEquation = function (eq: string) {
    setEquation(eq);
    let groups = equation.split("+").map(e => e.trim());
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

  return (
    <div className="App">
      <EquationInput updateEquation={updateEquation}/>
      <KarnaughTable tableStates={tableStates}/>
    </div>
  );
}

export default App;

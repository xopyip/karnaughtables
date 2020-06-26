import React, {useState, useEffect, KeyboardEvent } from 'react';
import './App.css';

interface ISelectionInput {
  selectionStart : number;
  value : string;
}

function hasSelection(element: any): element is ISelectionInput {
  return (typeof element.selectionStart === "number") && (typeof element.value === "string");
}

function App() {

  let [equation, setEquation] = useState("AB\u0305 + C\u0305A");
  let [tableStates, setTableStates] = useState(Array.from(Array(16), (_, i) => false));

  let computeEquation = function(eq : string){
    setEquation(eq);
    let groups = equation.split("+").map(e => e.trim());
    let table = Array.from(Array(16), (_, i) => false);
    for(let group of groups){
      let groupTable = Array.from(Array(16), (_, i) => true);
      for(let c = 0; c<group.length; c++){
        let signal = signals[group[c]];
        if(c + 1 < group.length && group[c + 1] === '\u0305'){
          signal = tableNeq(signal);
          c++;
        }
        groupTable = tableAnd(groupTable, signal);
      }
      table = tableOr(table, groupTable);
    }
    setTableStates(table);
  };

  let keyDown = function(event : KeyboardEvent<HTMLInputElement>){
    if(hasSelection(event.target)){
      let el : ISelectionInput = event.target;
      let position = el.selectionStart;
      if(event.key === "Backspace"){
        let pre = el.value.substring(0, position-1);
        if(el.value[position-1] === '\u0305'){
          pre = el.value.substring(0, position-2);
        }
        computeEquation(pre + el.value.substring(position, event.target.value.length));
        return;
      }
      if(event.key === "+"){
        computeEquation(el.value.substring(0, position) + " + " + el.value.substring(position, event.target.value.length));
        return;
      }
      if((['A', 'B', 'C', 'D'].includes(event.key.toUpperCase()))){
        computeEquation(el.value.substring(0, position) +
          event.key.toUpperCase() +
          (event.altKey ? '\u0305' : '') +
          el.value.substring(position, event.target.value.length));
        return;
      }
    }
  }

  let tableOr = function(a : boolean[], b: boolean[]) : boolean[]{
    return Array.from(Array(16), (_, i) => a[i] || b[i]);
  }

  let tableAnd = function(a : boolean[], b: boolean[]) : boolean[]{
    return Array.from(Array(16), (_, i) => a[i] && b[i]);
  }

  let tableNeq = function(a : boolean[]) : boolean[]{
    return Array.from(Array(16), (_, i) => !a[i]);
  }

  let column = function(n : number) : boolean[]{
    return Array.from(Array(16), (_, i) => i%4 === n-1);
  }

  let row = function(n : number) : boolean[]{
    return Array.from(Array(16), (_, i) => Math.floor(i/4)  === n-1);
  }

  const signals : { [K in any]: boolean[] } = {
    'A': tableOr(column(2), column(3)),
    'B': tableOr(column(3), column(4)),
    'C': tableOr(row(2), row(3)),
    'D': tableOr(row(3), row(4))
  };

  return (
    <div className="App">
      <div className={"equation"}>
        <div>
          <span>Wzór sygnału:</span> <input type={"text"} value={equation} onKeyDown={keyDown}/>
        </div>
        <div>
          <span className={"tip"}>lewy alt + sygnał = negacja sygnału</span>
        </div>
      </div>
      <div className={"karnaught"}>
        <table>
          <tbody>
          <tr>
            <td><span className={"top"}>BA</span><span className={"bottom"}>DC</span></td>
            <td>00</td>
            <td>01</td>
            <td>11</td>
            <td>10</td>
          </tr>
          <tr>
            <td>00</td>
            <td>{tableStates[0] ? '1' : '0'}</td>
            <td>{tableStates[1] ? '1' : '0'}</td>
            <td>{tableStates[2] ? '1' : '0'}</td>
            <td>{tableStates[3] ? '1' : '0'}</td>
          </tr>
          <tr>
            <td>01</td>
            <td>{tableStates[4] ? '1' : '0'}</td>
            <td>{tableStates[5] ? '1' : '0'}</td>
            <td>{tableStates[6] ? '1' : '0'}</td>
            <td>{tableStates[7] ? '1' : '0'}</td>
          </tr>
          <tr>
            <td>11</td>
            <td>{tableStates[8] ? '1' : '0'}</td>
            <td>{tableStates[9] ? '1' : '0'}</td>
            <td>{tableStates[10] ? '1' : '0'}</td>
            <td>{tableStates[11] ? '1' : '0'}</td>
          </tr>
          <tr>
            <td>10</td>
            <td>{tableStates[12] ? '1' : '0'}</td>
            <td>{tableStates[13] ? '1' : '0'}</td>
            <td>{tableStates[14] ? '1' : '0'}</td>
            <td>{tableStates[15] ? '1' : '0'}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;

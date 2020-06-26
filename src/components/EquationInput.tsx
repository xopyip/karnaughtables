import React, {Component, KeyboardEvent, ReactNode} from 'react';

type EquationInputProps = {
  updateEquation: Function,
};
type EquationInputState = {
  equation: string,
};


interface ISelectionInput {
  selectionStart: number;
  value: string;
}

function hasSelection(element: any): element is ISelectionInput {
  return (typeof element.selectionStart === "number") && (typeof element.value === "string");
}

class EquationInput extends Component<EquationInputProps, EquationInputState> {
  constructor(props: EquationInputProps) {
    super(props);
    this.state = {
      equation: "AB\u0305 + C\u0305A"
    }
    this.keyDown = this.keyDown.bind(this);
  }

  keyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (hasSelection(event.target)) {
      let el: ISelectionInput = event.target;
      let position = el.selectionStart;
      let newEquation = el.value;
      if (event.key === "Backspace") {
        let pre = el.value.substring(0, position - 1);
        if (el.value[position - 1] === '\u0305') {
          pre = el.value.substring(0, position - 2);
        }
        newEquation = pre + el.value.substring(position, event.target.value.length);

      } else if (event.key === "+") {
        newEquation = el.value.substring(0, position) + " + " + el.value.substring(position, event.target.value.length);

      } else if ((['A', 'B', 'C', 'D'].includes(event.key.toUpperCase()))) {
        newEquation = el.value.substring(0, position) +
          event.key.toUpperCase() +
          (event.altKey ? '\u0305' : '') +
          el.value.substring(position, event.target.value.length);
      }
      this.setState({equation: newEquation});
      this.props.updateEquation(newEquation);
    }
  }

  render(): ReactNode {
    return (
      <div className={"equation"}>
        <div>
          <span>Wzór sygnału:</span> <input type={"text"} value={this.state.equation} onKeyDown={this.keyDown}/>
        </div>
        <div>
          <span className={"tip"}>lewy alt + sygnał = negacja sygnału</span>
        </div>
      </div>
    );
  }
}

export default EquationInput;
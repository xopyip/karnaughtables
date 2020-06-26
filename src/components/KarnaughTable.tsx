import React, {Component, ReactNode} from 'react';

type KarnaughTableProps = {
  tableStates: boolean[],
  updateTableStates: Function,
};

class KarnaughTable extends Component<KarnaughTableProps> {
  constructor(props: KarnaughTableProps) {
    super(props);
    this.flipBit = this.flipBit.bind(this);
  }

  flipBit(idx: number) {
    this.props.updateTableStates([...this.props.tableStates].map((en, i) => i === idx ? !en : en));
  }

  render(): ReactNode {
    return (
      <div className={"karnaugh"}>
        <table>
          <tbody>
          <tr>
            <td><span className={"top"}>BA</span><span className={"bottom"}>DC</span></td>
            <td>00</td>
            <td>01</td>
            <td>11</td>
            <td>10</td>
          </tr>
          {["00", "01", "11", "10"].map((num, idx) => (
            <tr key={num}>
              <td>{num}</td>
              <td onClick={() => this.flipBit(idx * 4)}
                  data-karnaugh={this.props.tableStates[idx * 4]}>{this.props.tableStates[idx * 4] ? "1" : "0"}</td>
              <td onClick={() => this.flipBit(idx * 4 + 1)}
                  data-karnaugh={this.props.tableStates[idx * 4 + 1]}>{this.props.tableStates[idx * 4 + 1] ? "1" : "0"}</td>
              <td onClick={() => this.flipBit(idx * 4 + 2)}
                  data-karnaugh={this.props.tableStates[idx * 4 + 2]}>{this.props.tableStates[idx * 4 + 2] ? "1" : "0"}</td>
              <td onClick={() => this.flipBit(idx * 4 + 3)}
                  data-karnaugh={this.props.tableStates[idx * 4 + 3]}>{this.props.tableStates[idx * 4 + 3] ? "1" : "0"}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default KarnaughTable;
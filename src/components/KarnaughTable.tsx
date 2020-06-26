import React, {Component, ReactNode} from 'react';

type KarnaughTableProps = {
  tableStates: boolean[],
};

class KarnaughTable extends Component<KarnaughTableProps> {
  constructor(props: KarnaughTableProps) {
    super(props);
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
              <td>{this.props.tableStates[idx * 4] ? '1' : '0'}</td>
              <td>{this.props.tableStates[idx * 4 + 1] ? '1' : '0'}</td>
              <td>{this.props.tableStates[idx * 4 + 2] ? '1' : '0'}</td>
              <td>{this.props.tableStates[idx * 4 + 3] ? '1' : '0'}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default KarnaughTable;
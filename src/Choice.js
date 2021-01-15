import React from "react";

import "./Choice.css";

class Choice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  setSelected() {
    this.props.setSelected(this.props.text);
  }
  render() {
    return (
      <div
        className={
          "hoverable choice " +
          (this.props.reveal
            ? this.props.correct
              ? this.props.selected
                ? "correct-answer-text"
                : "corrected-answer-text"
              : this.props.selected
              ? "wrong-answer-text"
              : "answer-text"
            : "answer-text")
        }
        onClick={() => this.setSelected()}
      >
        {this.props.show
          ? this.props.text
          : this.props.selected
          ? this.props.text
          : "???"}
      </div>
    );
  }
}
export default Choice;

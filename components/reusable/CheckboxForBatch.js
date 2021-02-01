//instructions
//props:
//selected: if you set selected to true it will be selected
//onPress: calls your function while toggling the checkbox on and off
//selectAll: select the entire array
//arr: pass in an array of objects linked to the checkbox
//id: if the array has this id in it it will be checked
//color: choose desired color, otherwise will be the default of #3796ff or grey

import React, { Component } from "react";
import { TouchableOpacity } from "react-native";
import { checkbox } from "../../Styles/Styles";
import Icon from "../reusable/Icon";

export default class CheckboxForBatch extends Component {
  static navigationOptions = {};
  constructor(props) {
    super(props);
    this.state = {
      disabled: !this.props.disabled ? this.props.disabled : false,
      ion:
        this.props.filter === true
          ? "../../assets/vectoricons/squarefull.png"
          : "../../assets/vectoricons/square.png",
    };
  }

  clickHandler = () => {
    const full = "../../assets/vectoricons/squarefull.png";
    const notFull = "../../assets/vectoricons/square.png";
    if (this.state.ion === full) {
      this.setState({ ion: notFull });
    } else {
      this.setState({ ion: full });
    }
  };

  render() {
    return (
      <React.Fragment>
        <TouchableOpacity
          underlayColor="none"
          onPress={() => {
            this.clickHandler(), this.props.onPress();
          }}
          style={checkbox.checkboxWrapper}
          disabled={this.state.disabled}
        >
          {this.state.ion === "../../assets/vectoricons/square.png" ? (
            <Icon
              functionality="icon"
              size={35}
              source={require("../../assets/vectoricons/square.png")}
            />
          ) : (
            <Icon
              functionality="icon"
              size={35}
              source={require("../../assets/vectoricons/squarefull.png")}
            />
          )}
        </TouchableOpacity>
      </React.Fragment>
    );
  }
}

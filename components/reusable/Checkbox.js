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
import { getMultipleSelectedHandlerArr } from "../../App";
import { checkbox } from "../../Styles/Styles";
import Icon from "../reusable/Icon";

export default class Checkbox extends Component {
  static navigationOptions = {};
  constructor(props) {
    super(props);
    this.state = {
      disabled: "",
      ion:
        this.props.selectAll === false &&
        JSON.stringify(this.props.arr).includes(
          JSON.stringify(this.props.id)
        ) === true
          ? "../../assets/vectoricons/square.png"
          : this.props.selected === true
          ? "../../assets/vectoricons/square.png"
          : "../../assets/vectoricons/squarefull.png",
    };
  }

  clickHandler = () => {
    if (this.state.color === "grey") {
      this.setState({
        color: "#3796ff",
        ion: "md-square",
      });
    } else {
      this.setState({ color: "grey", ion: "md-square-outline" });
    }
  };
  componentDidUpdate = () => {
    if (typeof this.props.disabled === "boolean") {
      if (this.state.disabled != this.props.disabled) {
        this.setState({ disabled: this.props.disabled });
      }
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
          style={[checkbox.checkboxWrapper]}
          disabled={this.state.disabled}
        >
          {this.props.selectAll === false &&
          JSON.stringify(getMultipleSelectedHandlerArr()).includes(
            JSON.stringify(this.props.id)
          ) === true ? (
            <Icon
              functionality="icon"
              size={35}
              source={require("../../assets/vectoricons/squarefull.png")}
            />
          ) : this.props.selected === true ? (
            <Icon
              functionality="icon"
              size={35}
              source={require("../../assets/vectoricons/squarefull.png")}
            />
          ) : this.state.selected === true ? (
            <Icon
              functionality="icon"
              size={35}
              source={require("../../assets/vectoricons/squarefull.png")}
            />
          ) : (
            <Icon
              functionality="icon"
              size={35}
              source={require("../../assets/vectoricons/square.png")}
            />
          )}
        </TouchableOpacity>
      </React.Fragment>
    );
  }
}

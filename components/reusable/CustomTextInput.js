// this component replaces the TextInput component
// you can customize it by adding color="desired color", backgroundColor="desired color, or text="diesired text""
//props are
//
//color, backgroundColor, text, containerWidth, borderRadius, width
//onChangeText, multiline, secureTextEntry, placeholder, editable, value: same as textinput
//validate: if set to true color will change red if value is less than 1

import React, { Component } from "react";
import { TextInput, View } from "react-native";
import { customTextInput, global } from "../../Styles/Styles";

export default class CustomTextInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      backgroundColor: "#ececec",
      width: this.props.width ? this.props.width : "80%",
      containerWidth: this.props.containerWidth
        ? this.props.containerWidth
        : "100%",
      borderRadius: this.props.borderRadius ? this.props.borderRadius : 5,
      editable: this.props.editable,
    };
  }

  onFocus = () => {
    this.setState({ backgroundColor: "white" });
  };
  onBlur = () => {
    this.setState({ backgroundColor: "#ececec" });
  };
  render() {
    return (
      <View
        style={[
          customTextInput.container,
          { width: this.state.containerWidth },
        ]}
      >
        <TextInput
          editable={this.props.editable === false ? false : true}
          multiline={this.props.multiline ? this.props.multiline : false}
          autoCapitalize="none"
          name=""
          editable={this.state.editable}
          secureTextEntry={this.props.secureTextEntry}
          onFocus={() => this.onFocus()}
          onBlur={() => this.onBlur()}
          placeholder={this.props.placeholder}
          style={[
            global.textInput,
            {
              width: this.state.width,
              borderRadius: this.state.borderRadius,
              backgroundColor: this.state.backgroundColor,
              borderColor:
                this.props.validate === true
                  ? this.props.value.length > 1
                    ? "lightgrey"
                    : "red"
                  : "lightgrey",
            },
          ]}
          value={this.props.value}
          onChangeText={this.props.onChangeText}
        />
      </View>
    );
  }
}

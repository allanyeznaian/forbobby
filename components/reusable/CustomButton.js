//custom button component
// you can customize it by adding color="desired color", backgroundColor="desired color, or text="desired text""
// instead of using "onPress", in the parent component, use "clicked={}"
//        props:
//              color, backgroundColor, text, clicked, left, top, alignItems, containerWidth, disabled
//
//
///

import React, { Component } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { customButton, global } from "../../Styles/Styles";

export default class CustomButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: this.props.color ? this.props.color : "white",
      backgroundColor: this.props.backgroundColor
        ? this.props.backgroundColor
        : "#3796ff",
      width: this.props.width ? this.props.width : "80%",
      containerWidth: this.props.containerWidth
        ? this.props.containerWidth
        : "100%",
      alignContent: this.props.alignContent
        ? this.props.alignContent
        : "center",
      alignItems: this.props.alignItems ? this.props.alignItems : "center",
      left: this.props.left ? this.props.left : 0,
      right: this.props.right ? this.props.right : 0,
      marginLeft: this.props.marginLeft ? this.props.marginLeft : 0,
      marginRight: this.props.marginRight ? this.props.marginRight : 0,
      fontSize: !this.props.fontSize ? 14 : this.props.fontSize,
    };
  }
  render() {
    return (
      <View
        style={[
          {
            width: this.state.containerWidth,
            alignItems: this.state.alignItems,
            left: this.state.left,
            right: this.state.right,
            alignContent: this.state.alignContent,
            marginLeft: this.state.marginLeft,
            marginRight: this.state.marginRight,
          },
          customButton.wrapper,
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            this.props.clicked();
          }}
          disabled={this.props.disabled === true ? true : false}
          style={[
            {
              width: this.state.width,
              backgroundColor:
                this.props.forDelete === true
                  ? "tomato"
                  : this.props.forDelete === false
                  ? "grey"
                  : this.props.forPrint === true
                  ? this.state.backgroundColor
                  : this.props.forPrint === false
                  ? "grey"
                  : this.state.backgroundColor,
            },
            customButton.button,
          ]}
        >
          <Text
            style={[
              {
                color: this.state.color,
                fontSize: this.state.fontSize,
              },
              global.text,
            ]}
          >
            {this.props.text}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

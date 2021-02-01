//example <Icon source={require(/imagelocation/)} />
//props:
//functionality: set to button if it can be pressed, set to icon if static image
//size
//opacity,height,width
//style: regular style format {{something: something}}
//backgroundColor
//source

import React, { Component } from "react";
import { Image, TouchableOpacity, View } from "react-native";

export default class Icon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      size: this.props.size,
    };
  }
  render() {
    if (this.props.functionality === "button") {
      return (
        <TouchableOpacity onPress={() => this.props.onPress()}>
          <Image
            style={[
              {
                opacity: this.props.opacity,
                height: this.state.size,
                width: this.state.size,
              },
              this.props.backgroundColor && {
                backgroundColor: this.props.backgroundColor,
              },
              this.props.style && this.props.style,
            ]}
            source={this.props.source}
          />
        </TouchableOpacity>
      );
    } else if (this.props.functionality === "icon") {
      return (
        <View>
          <Image
            style={[
              {
                opacity: this.props.opacity,
                height: this.state.size,
                width: this.state.size,
              },
              this.props.backgroundColor && {
                backgroundColor: this.props.backgroundColor,
              },
              this.props.style && this.props.style,
            ]}
            source={this.props.source}
          />
        </View>
      );
    }
  }
}

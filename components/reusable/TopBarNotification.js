// this component brings a pop up notification on the top of the screen
// you can customize it by adding color="desired color", backgroundColor="desired color, or text="desired text""
//props:
//color, backgroundColor, text,

import React, { Component } from "react";
import { AppRegistry, Animated, Text, View, Dimensions } from "react-native";
import { topBarNotification, global } from "../../Styles/Styles";

export default class animated_notification extends Component {
  state = {
    value: "",
    notification: this.props.text,
    opacity: new Animated.Value(0),
    offset: new Animated.Value(0),
    width: Math.round(Dimensions.get("window").width),
    color: this.props.color ? this.props.color : "white",
    backgroundColor: this.props.backgroundColor
      ? this.props.backgroundColor
      : "tomato",
  };
  componentDidMount = () => {
    this.setState(
      {
        value: this.props.text,
        notification: this.state.value,
      },
      () => {
        this.state.offset.setValue(40 * -1);
        Animated.sequence([
          Animated.parallel([
            Animated.timing(this.state.opacity, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(this.state.offset, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]),
          Animated.delay(1500),
          Animated.parallel([
            Animated.timing(this.state.opacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(this.state.offset, {
              toValue: 40 * -1,
              duration: 300,
              useNativeDriver: true,
            }),
          ]),
        ]).start();
      }
    );
  };

  render() {
    const notificationStyle = {
      opacity: this.state.opacity,
      transform: [
        {
          translateY: this.state.offset,
        },
      ],
    };
    return (
      <View style={topBarNotification.container}>
        <Animated.View
          style={[
            topBarNotification.notification,
            { backgroundColor: this.state.backgroundColor },
            notificationStyle,
          ]}
          ref={(notification) => (this._notification = notification)}
        >
          <Text
            style={
              (topBarNotification.notificationText, { color: this.state.color })
            }
          >
            {this.props.text}
          </Text>
        </Animated.View>
      </View>
    );
  }
}
AppRegistry.registerComponent(
  "animated_notification",
  () => animated_notification
);

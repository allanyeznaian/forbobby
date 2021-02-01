//Pangea loading component
//as long as it's imported in another component it will show
//import
//import LoadingSpinner from "../reusable/LoadingSpinner";
//usage
//<LoadingSpinner />

import React, { Component } from "react";
import { View, Animated, Easing } from "react-native";
import Pangea from "../../assets/images/Pangea_Logo.png";
import { loadingSpinner } from "../../Styles/Styles";

export default class LoadingSpinner extends Component {
  constructor(props) {
    super(props);
    this.state = { spinAnim: new Animated.Value(0) };
  }

  componentDidMount = () => {
    Animated.loop(
      Animated.timing(this.state.spinAnim, {
        toValue: 1,
        duration: 1020,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  render() {
    const spin = this.state.spinAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"],
    });
    return (
      <View style={loadingSpinner.imageWrapper}>
        <Animated.Image
          style={[
            loadingSpinner.image,
            {
              transform: [{ rotate: spin }],
            },
          ]}
          source={Pangea}
        />
      </View>
    );
  }
}

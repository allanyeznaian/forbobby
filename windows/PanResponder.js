import React, { Component } from "react";
import { PanResponder, View, Modal } from "react-native";
import { global } from "../Styles/Styles";

export default class App extends Component {
  state = {
    show: false,
  };
  _panResponder = {};
  timer = 0;
  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => {
        this.resetTimer();
        this.props.test("A");
        return true;
      },
      onMoveShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => {
        this.resetTimer();
        this.props.test("B");
        return false;
      },
      onMoveShouldSetPanResponderCapture: () => false,
      onPanResponderTerminationRequest: () => true,
      onShouldBlockNativeResponder: () => false,
    });
    this.timer = setTimeout(() => {
      //called when timed out
      this.props.timedOut();
      this.setState({ show: true });
    }, 5000);
  }

  resetTimer() {
    clearTimeout(this.timer);
    if (this.state.show) this.setState({ show: false });
    this.timer = setTimeout(() => {
      this.setState({ show: true });
    }, 5000);
  }

  render() {
    return (
      <Modal visible={false} style={global.height100}>
        <View {...this._panResponder.panHandlers}>
          {this.props.data}
          {/* {this.state.show ? <Text>Timer Expired : 5sec</Text> : null} */}
        </View>
      </Modal>
    );
  }
}

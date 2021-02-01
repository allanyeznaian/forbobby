//Pangea loading component
//as long as it's imported in another component it will show
//import
//import LoadingSpinner from "../reusable/LoadingSpinner";
//usage
//<LoadingSpinner />

import React, { Component } from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  Modal,
  Dimensions,
} from "react-native";
import { global } from "../../Styles/Styles";

export default class ImageProof extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgString: "",
      fullScreen: false,
    };
  }

  componentDidMount = () => {};
  fullScreen = () => {
    this.setState({ fullScreen: true });
  };
  closeModal = () => {
    this.setState({ fullScreen: false });
  };

  render() {
    if (this.state.fullScreen === true) {
      return (
        <Modal transparent={false} visible={true} animationType={"fade"}>
          <TouchableOpacity onPress={() => this.closeModal()}>
            <Text>a;lksdfja</Text>
          </TouchableOpacity>
          <Image
            style={{ backgroundColor: "blue" }}
            source={{
              // uri: this.state.imageLink,
              // uri:"http://pangea-usa.com/PShandler.ashx?ea9b44e7-c21d-4877-b710-8f0ba91356af",
              // uri: this.props.uri,
              uri:
                "https://www.textuar.com/blogold/wp-content/uploads/2017/11/free-images-for-copywriting.jpg",
            }}
            height={this.props.imageHeight}
            width={this.props.imageWidth}
          />
        </Modal>
      );
    } else {
      return (
        <React.Fragment>
          <View style={{ flexDirection: "row", padding: 20 }}>
            <TouchableOpacity
              style={{
                position: "absolute",
                left: 0,
                backgroundColor: "green",
                margin: 10,
                padding: 5,
                borderRadius: 2,
              }}
              onPress={() => this.fullScreen()}
            >
              <Text style={{ color: "white" }}>Full</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                position: "absolute",
                right: 0,
                backgroundColor: "red",
                margin: 10,
                padding: 5,
                borderRadius: 2,
              }}
              onPress={() => this.props.startAnimation("close")}
            >
              <Text style={{ color: "white" }}>X</Text>
            </TouchableOpacity>
          </View>
          <View>
            {/* <Image
              // style={login.logo}
              source={require("../../assets/images/Pangea_Logo.png")}
            /> */}
            <Image
              // source={require("../../assets/images/Pangea_Logo.png")}
              source={{
                uri: this.props.uri,
                // "https://aboutreact.com/wp-content/uploads/2018/07/react_native_imageview.png",
              }}
              style={{ height: 300, width: 300 }}
              // extStyle={global.marginAuto}
            />
          </View>
        </React.Fragment>
      );
    }
  }
}

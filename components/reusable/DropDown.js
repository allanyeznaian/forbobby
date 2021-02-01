import React, { Component } from "react";
//You need to import anything here to be able to use it down below, find <CustomTextInput as an example

import { Image, View, ScrollView, Text, Modal } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import CustomButton from "./CustomButton";
import TopBarNotification from "./TopBarNotification";
import { dropdown, global } from "../../Styles/Styles";
import Icon from "./Icon";

export default class Login extends Component {
  // you need to have this included to be able to navigate components
  // if you navigate to Login from another component it will take you here
  static navigationOptions = {
    title: "Login",
  };

  constructor(props) {
    super(props);
    //this is the state. this is where the components data is stored.
    this.state = {
      showModal: false,
    };
  }
  //   static getDerivedStateFromProps(nextProps, prevState) {
  //     const data = nextProps.navigation.state.params;
  //     if (data) {
  //       return {
  //         data: data,
  //         notificationText: data.notificationText,
  //         shouldNotify: true,
  //       };
  //     } else {
  //       return {
  //         null: null,
  //       };
  //     }
  //   }

  //   justForHeader={-22}
  //   options={this.props.main_AheadInfoArray}
  //   onSelect={(e) => {
  // this.dropdown_GetByAd(this.props.main_AheadInfoArray[e]);
  //   }}
  //   defaultValue={
  // this.props.main_AheadInfoArray[this.props.defaultSignTypeID]
  //   }
  layout = (e) => {};
  showModal = () => {
    this.setState({ showModal: true });
  };
  render() {
    return (
      <View
        style={dropdown.container}
        onLayout={(event) => {
          const layout = event.nativeEvent.layout;
          this.layout(layout);
          this.setState({
            height: layout.height,
            width: layout.width,
            x: layout.x,
            y: layout.y,
          });
          //   console.log("height:", layout.height);
          //   console.log("width:", layout.width);
          //   console.log("x:", layout.x);
          //   console.log("y:", layout.y);
        }}
      >
        <TouchableHighlight
          style={{
            borderColor: "grey",
            borderWidth: 2,
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 4,
            paddingBottom: 4,
            borderRadius: 2,
            elevation: 5,
          }}
          onPress={this.showModal}
        >
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>
            {this.props.defaultValue
              ? this.props.defaultValue
              : "Please Select..."}
            <Icon
              size={22}
              functionality="icon"
              source={require("../../assets/vectoricons/dropdown.png")}
            />
          </Text>
        </TouchableHighlight>
        {this.state.showModal === true && (
          <View style={{ width: 55 }}>
            <Modal
              supportedOrientations={[
                "portrait",
                "portrait-upside-down",
                "landscape",
                "landscape-left",
                "landscape-right",
              ]}
              transparent={true}
            >
              <ScrollView
                style={
                  {
                    // position: "absolute",
                  }
                }
              >
                {this.props.options.map((e) => {
                  return (
                    <TouchableHighlight
                      style={{
                        backgroundColor: "white",
                        borderColor: "grey",
                        borderWidth: 2,
                        paddingLeft: 5,
                        paddingRight: 5,
                        paddingTop: 2,
                        paddingBottom: 2,
                      }}
                    >
                      <Text style={{ textAlign: "center" }}>{e}</Text>
                    </TouchableHighlight>
                  );
                })}
              </ScrollView>
            </Modal>
          </View>
        )}
      </View>
    );
  }
}

import React, { Component } from "react";
//You need to import anything here to be able to use it down below, find <CustomTextInput as an example

import { Image, View, Text, Modal } from "react-native";
import { users_post } from "../scripts/API";
import { TouchableHighlight } from "react-native-gesture-handler";
import CustomButton from "../components/reusable/CustomButton";
import TopBarNotification from "../components/reusable/TopBarNotification";
import CustomTextInput from "../components/reusable/CustomTextInput";
import LoadingSpinner from "../components/reusable/LoadingSpinner";
import Icon from "../components/reusable/Icon";
import { login, global } from "../Styles/Styles";
import { addError } from "../App";

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
      // user: "rid7155",
      // pass: "blackfoot",
      // user: "pco0124",
      // pass: "sanjuancapistrano",
      // user: "ck10",
      // pass: "phoenix",
      user: "",
      pass: "",
      // user: "rse0200",
      // pass: "thibodaux",
      // user: "pst1803",
      // pass: "petsmart",
      // user: "pst0124",
      // pass: "petsmart",
      // user: "svt8747",
      // pass: "hobart",
      // user: "mds3011",
      // pass: "eauclaire",
      notificationText: "",
      showPass: false,
      shouldNotify: false,
      incorrectCredentials: false,
      isLoading: false,
      gotLocation: false,
      data: "",
      null: null,
    };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    const data = nextProps.navigation.state.params;
    if (data) {
      return {
        data: data,
        notificationText: data.notificationText,
        shouldNotify: true,
      };
    } else {
      return {
        null: null,
      };
    }
  }

  passwordBox = (e) => {
    this.setState({ width: e * 0.8 });
  };
  notify = (e) => {
    this.setState({ shouldNotify: true, notificationText: e });
  };
  onLoginClicked = () => {
    //you can manipulate the state by setting state like below
    this.setState({ shouldNotify: false, isLoading: true });
    if (this.state.pass.length * this.state.user.length > 0) {
      if (this.state.pass.length > 1) {
        //the users_post function can be found in the API.js file which is where all the ajax calls live
        users_post({
          userName: this.state.user,
          pass: this.state.pass,
        }).then((resp) => {
          if (resp.Handling === "failed") {
            this.setState({
              notificationText: "The username or password is incorrect",
              shouldNotify: true,
              pass: "",
              isLoading: false,
            });
          } else if (resp.Handling === "success") {
            if (resp.Model.LevelTypeId == 4) {
              signTypes = [];
              let arr = resp.Model.signTypes;
              for (let i = 0; i < arr.length; i++) {
                const obj = {
                  SignTypeID: arr[i].SignTypeId,
                  Sign: arr[i].LevelUserInfoSignTypeCustomName,
                };
                signTypes.push(obj);
              }
              departments = [];
              let arr1 = resp.Model.levelDepartments;
              for (let i = 0; i < arr1.length; i++) {
                departments.push(arr1[i]);
              }
              departments.push({
                DepartmentID: 0,
                DepartmentName: "All Departments",
                department: {
                  DepartmentId: 0,
                  DepartmentName: "All Departments",
                },
              });
              //navigate begin
              //this is how you navigate to other pages, the object being sent with the navigation can be accessed from
              //"nextProps" in the getDerivedStateFromProps(nextProps) function in the landing component.
              //you can find example of this function in the home component
              const { navigate } = this.props.navigation;
              this.setState({ isLoading: false });
              navigate("Main", {
                data: resp,
                departments: departments,
                signTypes: signTypes,
                loggedIn: true,
              });
              //navigate end
            } else {
              this.setState({
                notificationText: "Only stores supported on this app",
                shouldNotify: true,
                user: "",
                pass: "",
                isLoading: false,
              });
            }
          } else if (resp === "network error") {
            this.setState({
              notificationText: "Network Error",
              pass: "",
              user: "",
              shouldNotify: true,
              isLoading: false,
            });
          }
        });
      }
    }
  };
  pass = (e) => {
    this.setState({ pass: e });
  };
  user = (e) => {
    this.setState({ user: e });
  };

  forgotPassword = () => {
    null;
  };

  render() {
    return (
      <View style={login.container}>
        {this.state.isLoading === true && (
          <Modal transparent={true}>
            <View style={global.alignItemsCenter}>
              <LoadingSpinner />
            </View>
          </Modal>
        )}
        {this.state.shouldNotify === true && (
          // this shows a small popup notification on the top of the screen
          <TopBarNotification text={this.state.notificationText} />
        )}
        <Image
          style={login.logo}
          source={require("../assets/images/Pangea_Logo.png")}
        />
        <CustomTextInput
          // this is how text inputs work
          // value is where the string is stored
          validate={true}
          value={this.state.user}
          placeholder="Username"
          // onChangeText should set the same state as value, in this case, this.user(e) is called
          // everytime a key is entered and e is the key that's entered
          onChangeText={(e) => this.user(e)}
        />
        <View
          style={global.row}
          onLayout={(event) => {
            this.passwordBox(event.nativeEvent.layout.width);
          }}
        >
          {/* Custom Text input component works just like a regular TextInput component
          but with some functionality included. */}
          <CustomTextInput
            editable={this.state.isLoading === true ? false : true}
            validate={true}
            placeholder="Password"
            value={this.state.pass}
            onChangeText={(e) => this.pass(e)}
            secureTextEntry={!this.state.showPass === true ? true : false}
          />
          <View style={[global.absolute]}>
            <View style={[login.absoluteChild, { left: this.state.width }]}>
              {this.state.showPass === true ? (
                <Icon
                  functionality="button"
                  size={36}
                  onPress={() => this.setState({ showPass: false })}
                  source={require("../assets/vectoricons/showPass.png")}
                />
              ) : (
                <Icon
                  functionality="button"
                  size={36}
                  opacity={0.4}
                  onPress={() => this.setState({ showPass: true })}
                  source={require("../assets/vectoricons/hidePass.png")}
                />
              )}
            </View>
          </View>
        </View>

        <View style={login.forgotPWWrapper}>
          {/* this is one way to make html link style buttons */}
          <TouchableHighlight
            disabled={this.state.isLoading === true ? true : false}
            onPress={() => this.forgotPassword()}
          >
            <Text style={login.forgotPWText}>Forgot Password?</Text>
          </TouchableHighlight>
          {/* end button */}
        </View>
        {/* this is a custom button, you can find more details in the CustomButton.js file */}
        <CustomButton
          disabled={
            this.state.isLoading === true
              ? true
              : this.state.pass.length * this.state.user.length > 0
              ? this.state.pass.length > 1
                ? false
                : true
              : true
          }
          text="Login"
          clicked={() => this.onLoginClicked()}
          backgroundColor={
            this.state.isLoading === true ? "lightgrey" : "#3796ff"
          }
        />
      </View>
    );
  }
}

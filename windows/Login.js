import React, { Component } from "react";
//You need to import anything here to be able to use it down below, find <CustomTextInput as an example

import {
  Image,
  View,
  Text,
  Modal,
  TouchableOpacity,
  Alert,
} from "react-native";
import { users_post } from "../scripts/API";
import { TouchableHighlight } from "react-native-gesture-handler";
import CustomButton from "../components/reusable/CustomButton";
import TopBarNotification from "../components/reusable/TopBarNotification";
import CustomTextInput from "../components/reusable/CustomTextInput";
import LoadingSpinner from "../components/reusable/LoadingSpinner";
import Icon from "../components/reusable/Icon";
import { login, global } from "../Styles/Styles";
import { addError } from "../App";

// import * as WebBrowser from "expo-web-browser";
// import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
// import { Client } from "@microsoft/microsoft-graph-client";
// import {
//   AuthManager,
//   // signInAsync,
//   // getAccessTokenAsync,
//   // signOutAsync,
// } from "../scripts/AuthManager";

import MicrosoftLoginHandler from "../scripts/MicrosoftLoginHandler";
import { AuthManager } from "../scripts/AuthManager";

import configFile from "../auth.config";
import OKTALoginHandler from "../AuthOKTA";

// import { ParamListBase } from "@react-navigation/native";
// import { StackNavigationProp } from "@react-navigation/stack";

// import { AuthContext } from "../AuthContext";

// const authContext = React.useMemo(
//   () => ({
//     signIn: async () => {
//       await signInAsync();
//       const token = await getAccessTokenAsync();
//       dispatch({ type: "SIGN_IN", token: token });
//     },
//     signOut: async () => {
//       await signOutAsync();
//       dispatch({ type: "SIGN_OUT" });
//     },
//   }),
//   []
// );
// export const AUTH_HANDLER = (e) => {
//   console.log(":DLKFJ:SDLKFJ");
//   const user = "ck10";
//   const pass = "phoenix";
//   // Login.transfer(user, pass);
// };

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
      user: "rid7155",
      pass: "blackfoot",
      // user: "pco0124",
      // pass: "sanjuancapistrano",
      // user: "ck10",
      // pass: "phoenix",
      // user: "",
      // pass: "",
      // user: "rse0200",
      // pass: "thibodaux",
      // user: "pst1803",
      // pass: "petsmart",
      // user: "pst1804",
      // pass: "springfield",
      // user: "pst0124",
      // pass: "petsmart",
      // user: "svt8747",
      // pass: "hobart",
      // user: "mds3011",
      // pass: "eauclaire",
      shouldLogin: false,
      authType: "",
      showInitialScreen: true,
      notificationText: "",
      showPass: false,
      shouldNotify: false,
      incorrectCredentials: false,
      isLoading: false,
      gotLocation: false,
      data: "",
      null: null,
      firstTimeAUTH: true,
    };
  }

  static testing() {
    console.log("TESTING STATIC FUNCTION");

    // testmest();
    // this.setState({
    //   user: "ck10",
    //   pass: "phoenix",
    // });
    // return { user: "ck10", pass: "phoenix" };
    // this.onLoginClicked();
  }

  componentDidUpdate = () => {
    console.log("222");
    if (this.state.shouldLogin === true) {
      this.setState({ shouldLogin: false });
      this.continueLoggingIn();
    }
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    console.log("ASDF");
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
  transfer = (user, pass) => {
    this.setState({ user: user, pass: pass });
    this.onLoginClicked();
  };
  componentDidMount = () => {
    // createConfig({
    //   clientId: configFile.oidc.clientId,
    //   redirectUri: configFile.oidc.redirectUri,
    //   endSessionRedirectUri: configFile.oidc.endSessionRedirectUri,
    //   discoveryUri: configFile.oidc.discoveryUri,
    //   scopes: configFile.oidc.scopes,
    //   requireHardwareBackedKeyStore:
    //     configFile.oidc.requireHardwareBackedKeyStore,
    // });
    // this.checkAuthentication();
    this.setState({ firstTimeAUTH: true });
    // console.log(this.props.screenProps.action);
  };
  passwordBox = (e) => {
    this.setState({ width: e * 0.8 });
  };
  notify = (e) => {
    this.setState({ shouldNotify: true, notificationText: e });
  };
  onLoginClicked = (ALFR) => {
    console.log("ALFR ALFR", ALFR);
    //you can manipulate the state by setting state like below
    this.setState({ shouldNotify: false, isLoading: true });
    // if (this.state.pass.length * this.state.user.length > 0) {
    // if (this.state.pass.length > 1) {
    //the users_post function can be found in the API.js file which is where all the ajax calls live
    // const myPromise = "";
    // if (ALFR === "SIGNSHARE") {
    //   myPromise = users_post({
    //     userName: this.state.user,
    //     pass: this.state.pass,
    //   });
    // } else if (ALFR === "") {
    //   myPromise = users_post({
    //     userName: this.state.user,
    //     pass: this.state.pass,
    //   });
    // }
    const myPromise = users_post({
      userName: this.state.user,
      pass: this.state.pass,
    });
    myPromise.then((resp) => {
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
    // }
    // } else {
    //   this.notify("OOPS! Something went wrong");
    // }
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

  signInToSignShare = () => {
    this.setState({ showInitialScreen: false });
  };
  signInWithOKTA = (e) => {
    setTimeout(() => {
      this.setState({
        shouldLogin: true,
        authType: "OKTA",
        user: "ck10",
        pass: "phoenix",
      });
    });

    // this.continueLoggingIn();
    // console.log("GOOOOOD");
    // }, 10000);
    // }
    // setTimeout(() => {
    //   console.log("DO IT NOW");
    // }, 200);
    // this.setState({ showInitialScreen: false, user: "ck10", pass: "phoenix" });
  };
  continueLoggingIn = () => {
    // this.onLoginClicked();
    setTimeout(() => {
      this.onLoginClicked(this.state.authType);
    }, 200);
  };
  signInWithMicrosoft = async (e) => {
    console.log("::");
    // React.useEffect(() => {
    //   WebBrowser.warmUpAsync();
    //   return () => {
    //     WebBrowser.coolDownAsync();
    //   };
    // }, []);
    // WebBrowser.maybeCompleteAuthSession();
    // // Endpoint
    // const discovery = {
    //   authorizationEndpoint: "https://dev-75313886.okta.com/oauth2/default",
    //   // tokenEndpoint: "https://www.reddit.com/api/v1/access_token",
    // };
    // console.log(discovery);
    // const [request, response, promptAsync] = useAuthRequest(
    //   {
    //     clientId: "0oag2oh3vsHaP1fdM5d6",
    //     scopes: ["identity"],
    //     // For usage in managed apps using the proxy
    //     redirectUri: makeRedirectUri({
    //       // For usage in bare and standalone
    //       native: "SignShareByPangea://redirect",
    //     }),
    //   },
    //   discovery
    // );
    // React.useEffect(() => {
    //   if (response?.type === "success") {
    //     const { code } = response.params;
    //     console.log("SUCHES ", response);
    //   } else {
    //     console.log("NO BITCH");
    //   }
    // }, [response]);
    // // try {
    // //   // console.log(e);
    // //   // console.log(AuthManager.signInAsync());
    // //   e.signIn();
    // //   // AuthManager.signInAsync();
    // //   console.log(e, await AuthManager.getAccessTokenAsync());
    // //   // const prom = AuthManager.signInAsync();
    // //   const accessToken = await AuthManager.getAccessTokenAsync();
    // //   // TEMPORARY
    // //   this.setState({ userFirstName: accessToken, userLoading: false });
    // // } catch (asdf) {
    // //   Alert.alert(
    // //     "Error getting token",
    // //     JSON.stringify(asdf),
    // //     [
    // //       {
    // //         text: "OK",
    // //       },
    // //     ],
    // //     { cancelable: false }
    // //   );
    // // }
    // // const authContext = React.useMemo(
    // //   () => ({
    // //     signIn: async () => {
    // //       await AuthManager.signInAsync();
    // //       const token = await AuthManager.getAccessTokenAsync();
    // //       dispatch({ type: "SIGN_IN", token: token });
    // //     },
    // //     signOut: async () => {
    // //       await AuthManager.signOutAsync();
    // //       dispatch({ type: "SIGN_OUT" });
    // //     },
    // //   }),
    // //   []
    // // );
    // // try {
    // //   let accessToken = "";
    // //   AuthManager.signInAsync();
    // //   accessToken = AuthManager.getAccessTokenAsync();
    // //   dispatch({ type: "SIGN_IN", token: token });
    // //   alert(JSON.stringify(accessToken));
    // //   // const accessToken = await AuthManager.getAccessTokenAsync();
    // //   // alert(JSON.stringify(accessToken));
    // //   // TEMPORARY
    // //   this.setState({ userFirstName: accessToken, userLoading: false });
    // // } catch (error) {
    // //   Alert.alert(
    // //     "Error getting token",
    // //     JSON.stringify(error),
    // //     [
    // //       {
    // //         text: "OK",
    // //       },
    // //     ],
    // //     { cancelable: false }
    // //   );
    // // }
  };
  doSomething = (e) => {
    console.log("DO SOMETHING", e);
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
        {this.state.showInitialScreen === true ? (
          <Modal transparent={true} animationType="fade" visible={true}>
            <Image
              style={login.backgroundImage}
              source={require("../assets/images/fruits-veggies.jpg")}
            />
            <View style={login.filter}>
              <View style={[login.initialScreenSubWrapper, global.marginAuto]}>
                <CustomButton
                  width="100%"
                  text="Sign in to SignShare"
                  clicked={this.signInToSignShare}
                />
                <View style={login.space} />
                <MicrosoftLoginHandler signIn={this.signInWithMicrosoft} />
                <View style={login.space} />
                <OKTALoginHandler
                  onLoginClicked={this.signInWithOKTA}
                  doSomething={this.doSomething}
                />
                {/* <TouchableOpacity
                  onPress={this.signInWithMicrosoft}
                  style={login.microsoftButton}
                >
                  <Image
                    style={login.microsoftIcon}
                    source={require("../assets/images/microsoft.png")}
                  />
                  <View style={global.marginAuto}>
                    <Text style={login.microsoftButtonText}>
                      Sign in with Microsoft
                    </Text>
                  </View>
                </TouchableOpacity> */}
              </View>
            </View>
          </Modal>
        ) : (
          <React.Fragment>
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
              clicked={() => this.onLoginClicked("SIGNSHARE")}
              backgroundColor={
                this.state.isLoading === true ? "lightgrey" : "#3796ff"
              }
            />
            <View style={login.space} />
            <CustomButton
              disabled={this.state.isLoading === true ? true : false}
              text="Cancel"
              clicked={() => {
                this.setState({ showInitialScreen: true });
              }}
              backgroundColor={
                this.state.isLoading === true ? "lightgrey" : "tomato"
              }
            />
          </React.Fragment>
        )}
      </View>
    );
  }
}

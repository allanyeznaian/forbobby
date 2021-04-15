import React, { Fragment } from "react";
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Dimensions,
  // PanResponder,
  View,
  Text,
  StatusBar,
  YellowBox,
  LogBox,
} from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import AppNavigator from "./navigation/AppNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Login from "./windows/Login";

//temp disable yellow warning box
console.disableYellowBox = true;
// //disable console warnings for setting a timer and virtualizedlists
// import { LogBox } from "react-native";
LogBox.ignoreLogs([
  "Warning: ...",
  "VirtualizedLists ...",
  "Require cycles ...",
]); // Ignore log notification by message
LogBox.ignoreAllLogs(true); //Ignore all log notifications
// LogBox.ignoreAllLogs(true);

//
//
//

//temporary storage

const state = {
  keepItemArraySign: [],
  keepItemArrayTag: [],
  defaultDepartment: "",
  aheadInfoArr: [],
  isCalled: false,
  multiEditFirstTime: false,
  errorArr: [],
  multipleSelectedHandlerArray: [],
  oktaLogoWidth: 0,
  platform: "",
  request: "",
  response: "",
  authInfo: "",
  user: "",
  pass: "",
  triggerAuth: true,
};
export const resetLogout = () => {
  state.keepItemArraySign = [];
  state.keepItemArrayTag = [];
  state.defaultDepartment = "";
  state.aheadInfoArr = [];
  state.isCalled = false;
  state.multiEditFirstTime = false;
  state.errorArr = [];
  state.multipleSelectedHandlerArray = [];
};

export const createNewID = () => {
  const id =
    s4() +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    s4() +
    s4();
  id.toString();
  return id;
};

export const getTriggerAuth = () => {
  return state.triggerAuth;
};
export const setTriggerAuth = (e) => {
  state.triggerAuth = e;
};

export const setAuthInfo = async (platform, request, response) => {
  state.platform = platform;
  state.request = request;
  state.response = response;
  const obj = {
    platform: platform,
    request: request,
    response: response,
  };
  authInfo = obj;
  const id = "ID";
  try {
    console.log("THIS SHOULD CALL ONCE ONLY");
    AsyncStorage.getItem(id, (err, result) => {
      // const aaa = JSON.parse(result);
      // console.log(
      //   "FIRST RESULT",
      //   result
      //   // aaa.response.params.code,
      //   // response.params.code
      // );
      if (result != null) {
        // setTimeout(() => {
        //   console.log("GOOOD 1111111111");
        //   // state.user = "ck10";
        //   // state.pass = "phoenix";
        //   // Login.testing("result");
        // }, 10000);
      } else {
        AsyncStorage.setItem(
          id,
          JSON.stringify(obj)
          // , (a, b) => {
          //   console.log(a, b);
          //   AsyncStorage.getItem(id, (err, resultInner) => {
          //     // console.log("SECOND RESULT", resultInner);
          //     if (resultInner != null) {
          //       setTimeout(() => {
          //         console.log("BADDD");
          //         // Login.testing("resultInner");
          //       }, 10000);
          //     }
          // });
          // });
          // }
        );
      }
    });
  } catch {
    // );

    // , () => {
    // AsyncStorage.getItem(idO, (err, result) => {
    //   const { navigate } = this.props.navigation;
    // console.log("Created!");
    // this.toBeReset();
    // navigate("Home", {
    // home: true
    // });
    // }
    console.log("NOT CREATED");
  }

  // console.log(platform, request, response);
};
export const getAuthInfo = (platform) => {
  if (platform == "OKTA") {
    console.log(2, state.request.length);
    //if token is expired log in
    if (state.request.length == +0 && state.response.length == +0) {
      return "none";
    } else {
      return { request: state.request, response: state.response };
    }
  }
  if (platform == "microsoft") {
    return (
      state.request.length * state.response.length !== 0
        ? "none"
        : state.request,
      state.response
    );
  }
};

export const oktaLogoSetWidth = (e) => {
  state.oktaLogoWidth = e;
};
export const oktaLogoGetWidth = () => {
  return state.oktaLogoWidth;
};

export const setMultipleSelectedHandlerArr = (e) => {
  state.multipleSelectedHandlerArray = e;
};
export const getMultipleSelectedHandlerArr = () => {
  return state.multipleSelectedHandlerArray;
};

export const addError = (e) => {
  state.errorArr.push(e);
};
export const getName = () => {
  return state.errorArr;
};

export const errorReportAdd = (e) => {};

export const defaultDepartment = (defDept) => {
  state.defaultDepartment = defDept;
};
export const getDefaultDepartment = () => {
  return state.defaultDepartment;
};

export const array = (signType) => {
  if (signType === 1) {
    return state.keepItemArraySign;
  } else if (signType === 8) {
    return state.keepItemArrayTag;
  } else {
    return [];
  }
};

export const setCalled = (b) => {
  state.isCalled = b;
};
export const getCalled = () => {
  return state.isCalled;
};

export const setAhead = (aheadInfoArrz) => {
  state.aheadInfoArr = aheadInfoArrz;
};
export const getAhead = () => {
  return state.aheadInfoArr;
};

export const setMultiEditFirstTime = (b) => {
  state.multiEditFirstTime = b;
};
export const getMultiEditFirstTime = () => {
  return state.multiEditFirstTime;
};
//
//business logic

export const keepItem = (data, action, signType_) => {
  if (action === "ADD_ITEM" && signType_ === 1) {
    for (let i = 0; i < data.length; i++) {
      if (state.keepItemArraySign.length > 0) {
        if (
          state.keepItemArraySign
            .map((e) => {
              return e.levelSignId;
            })
            .indexOf(data[i].levelSignId) > -1
        ) {
        } else {
          state.keepItemArraySign.push(data[i]);
        }
      } else {
        state.keepItemArraySign.push(data[i]);
      }
    }
  } else if (action === "ADD_ITEM" && signType_ === 8) {
    for (let i = 0; i < data.length; i++) {
      if (state.keepItemArrayTag.length > 0) {
        if (
          state.keepItemArrayTag
            .map((e) => {
              return e.levelSignId;
            })
            .indexOf(data[i].levelSignId) > -1
        ) {
        } else {
          state.keepItemArrayTag.push(data[i]);
        }
      } else {
        state.keepItemArrayTag.push(data[i]);
      }
    }
  } else if (action === "REMOVE_ITEM") {
    if (signType_ === 1) {
      for (let i = 0; i < state.keepItemArraySign.length; i++) {
        if (state.keepItemArraySign[i].levelSignId === data.levelSignId) {
          state.keepItemArraySign.splice(i, 1);
          break;
        }
      }
    }
    if (signType_ === 8) {
      for (let i = 0; i < state.keepItemArrayTag.length; i++) {
        if (state.keepItemArrayTag[i].levelSignId === data.levelSignId) {
          state.keepItemArrayTag.splice(i, 1);
          break;
        }
      }
    }
  }
};
//
//
//
//

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoggedIn: false,
      userName: "",
      pass: "",
      data: "",
      height: Math.round(Dimensions.get("screen").height),
      marginTop: getStatusBarHeight(),
    };
  }

  componentDidMount = () => {
    const majorVersionIOS = parseInt(Platform.Version, 10);
    if (Platform.OS === "ios") {
      if (majorVersionIOS <= 9) {
        this.setState({
          height:
            Math.round(Dimensions.get("screen").height) -
            getStatusBarHeight() -
            44,
          marginTop: getStatusBarHeight(),
        });
      } else {
        this.setState({
          height: Math.round(Dimensions.get("screen").height),
          marginTop: getStatusBarHeight(),
        });
      }
    } else {
      this.setState({
        height: Math.round(Dimensions.get("screen").height),
        marginTop: getStatusBarHeight(),
      });
    }
  };

  componentDidUpdate = () => {
    console.log(
      "updating in app.js. i want to show this when the big settimeout gets called"
    );
  };

  handleLogin = (bool, data) => {
    if (bool === true) {
      this.setState({ isLoggedIn: true, data: data });
    } else {
      this.setState({ isLoggedIn: false });
    }
  };

  getUserLocationHandler = () => {};

  render() {
    return (
      <ScrollView
        scrollEnabled={false}
        nestedScrollEnabled={false}
        style={{
          marginTop: this.state.marginTop ? this.state.marginTop : 0,
          height: this.state.height ? this.state.height : 0,
        }}
      >
        <AppNavigator screenProps={{ action: getAuthInfo("OKTA") }} />
      </ScrollView>
    );
  }
}

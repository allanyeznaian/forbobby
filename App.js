import React, { Component } from "react";
import {
  Platform,
  ScrollView,
  Dimensions,
  // PanResponder,
  StatusBar,
  YellowBox,
  LogBox,
} from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import AppNavigator from "./navigation/AppNavigator";

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

export default class App extends Component {
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
        <AppNavigator />
      </ScrollView>
    );
  }
}

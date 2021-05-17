//contents:
//getcall method
//navbar methods, navbar begin
//checkbox toggle griddata
//footer method, footer begin
//logout method
//loading sign begin
//header begin
//no signs check begin(griddata)
//home begin
//if not logged in begin

//phone height

//apibody data
//where the body data comes from

//props:
//navigation(): this is the functioncalled from navigation

import React, { Component } from "react";
import {
  ScrollView,
  Dimensions,
  Text,
  View,
  PanResponder,
  Platform,
  Modal,
} from "react-native";
import Home from "./Home";
import Navbar from "../components/navbar/Navbar";
import HomeHeader from "../components/HomeHeader";
import DepartmentsScrollView from "../components/DepartmentsScrollView";
import TopBarNotification from "../components/reusable/TopBarNotification";
import LoadingSpinner from "../components/reusable/LoadingSpinner";
import PrintBatch from "../components/PrintSignBatch";
import Search from "../components/Search";
import MultiEdit from "../components/MultiEdit/MultiEdit";
import { data_get, data_get_batches, data_check_date } from "../scripts/API";
import { AuthSession } from "expo";
import OrderStock from "../components/OrderStock";
import { main, global } from "../Styles/Styles";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { RotationGestureHandler } from "react-native-gesture-handler";
import {
  keepItem,
  array,
  getDefaultDepartment,
  getAhead,
  getCalled,
  setCalled,
  resetLogout,
  levelSignIdStore,
} from "../App";
console.disableYellowBox = true;
export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      backToHome: false,
      auditModeTest: "",
      arrayLevelFields: [],
      firstLoginTag: false,
      // isLoading: true,
      surname: "",
      keepItemSignArray: 0,
      keepItemTagArray: 0,
      isLoggedIn: false,
      isMenuShowing: "",
      isMenuShowingFromMain: "",
      dataFromLogin: "",
      levelId: "",
      showScannedItems: "",
      showScannedGrid: false,
      level: "",
      auditMode: false,
      prevBody: [
        {
          currentAhead: "",
          currentLevelID: "",
          currentSignTypeID: "",
          currentLevelTypeID: "",
          currentDepartmentID: "",
          batchTypeID: "",
          searchValues: "",
        },
      ],
      // enableMultipleSelectFromGrid: false,
      height:
        Math.round(Dimensions.get("screen").height) -
        Math.round(
          Dimensions.get("screen").height -
            Math.round(Dimensions.get("window").height) -
            getStatusBarHeight()
        ),
      isSignBatchLoading: false,
      loadSecond: false,
      loadHome: false,
      shouldNotify: false,
      notificationText: "",
      dataFromUser: "",
      showprintBatchScreen: false,
      showBatchEditScreen: false,
      printBatchData: [],
      enableDeleteSelected: false,
      invisibleHome: false,
      //data from login
      data: "",
      levelUserInfoId: "",

      levelTypeID: "",
      //this is to get rid of the "no signs" notification when app first loads
      arrGrid: [{ header: "" }],
      toBeDeletedArray: [],
      //navbar
      currentSignTypeID: "",
      signTypes: "",

      //homeheader
      adTo: "",
      adFrom: "",
      hideDeletePrintButtons: false,
      hideFilter: "",
      hideFilterTextInput: "",

      //homeheader/dropdown
      main_AheadInfoArray: [],

      //footer
      departments: [],

      //create sign/tag screen
      showCreateScreen: false,
      showMultiEdit: false,

      //orderstock
      showOrderStockScreen: false,
      orderStockSelected: "",

      //print/publish screen
      showPrintScreen: false,

      headeroneFieldLabel: "",
      headertwoFieldLabel: "",
      headerthreeFieldLabel: "",
      promoLevelStamps: [],
      batchTypeID: "",
      printBatchHideAhead: false,
      showBatchEditScreenInitialScreen: true,
      footerHeight: 0,
      headerHeight: 0,
      //for panresponder
      show: false,
      isLoading: false,
      //for disabling buttons/textinputs while loading spinner is active
      disabled: "",
      //search
      showSearchPrompt: false,
      searchText: "",
      prevSearchedText: "",
      isSearched: false,
      isSearchedOriginally: false,
      isMultiEditActive: false,

      keepItemArray: [],
      nonEditable: false,

      //this is the data that tells us which features of the app are available to which users
      LevelUserMaxQuantityPerStore: "",
      LevelUserEdit: "",
      LevelUserPrint: "",
      LevelUserEnter: "",
      LevelUserDelete: "",
      LevelUserShell: "",
      LevelUserStoreMaxQuantityPerStore: "",
      LevelUserApplyDictionary: "",
      LevelUserSignTypeColumn: "",
      LevelUserCustomColumn: "",
      LevelUserLevelToCapture: "",
      LevelUserCycleFormat: "",
      LevelUserShellStockMessage: "",
      LevelUserCampaignVisible: "",
      LevelUserFeatureVisible: "",
      LevelUserProgramVisible: "",
      LevelUserPlanVisible: "",
      LevelUserSizeVisible: "",
      LevelUserPrintAllButton: "",
      LevelUserKeepSignCheckbox: "",
      LevelUserInfoMultiEdit: "",
      MaximumOrderStockQuantity: "",
      MatrixIgnorePromotion: "",
      LevelUserInfoBuildBatch: "",
    };
  }
  _panResponder = {};
  timer = 0;

  static navigationOptions = {
    title: "Main",
  };
  static getDerivedStateFromProps(nextProps, prevState) {
    //nextProps will show you the data that was sent from the Login component
    //returning the object updates the state
    const data = nextProps.navigation.state.params;
    return {
      data: data,
      userID: data.data.Description,
      //for rid 6155
      // userID: "6a430ecf-a82c-4231-8cd0-12b70238d035",
      level: data.data.Model,
      dataFromLogin: data,
      isLoggedIn: data.loggedIn,
      defaultSignTypeID:
        data.data.Model.LevelUserInfo.LevelUserDefaultSignTypeID,
      levelUserInfoId: data.data.Model.LevelUserInfoID,
      levelTypeID: data.data.Model.LevelTypeId,
      signTypes: data.signTypes,
      departments: data.departments,
      levelId: data.data.Model.LevelID,
      surname: data.data.Model.LevelUserInfo.Surname,

      //this is the data that tells us which features of the app are available to which users

      LevelUserEdit: data.data.Model.LevelUserInfo.LevelUserEdit,
      LevelUserPrint: data.data.Model.LevelUserInfo.LevelUserPrint,
      LevelUserEnter: data.data.Model.LevelUserInfo.LevelUserEnter,
      LevelUserDelete: data.data.Model.LevelUserInfo.LevelUserDelete,

      LevelUserShell: data.data.Model.LevelUserInfo.LevelUserShell,
      LevelUserShellStockMessage:
        data.data.Model.LevelUserInfo.LevelUserShellStockMessage,

      LevelUserApplyDictionary:
        data.data.Model.LevelUserInfo.LevelUserApplyDictionary,
      LevelUserSignTypeColumn:
        data.data.Model.LevelUserInfo.LevelUserSignTypeColumn,
      LevelUserCustomColumn:
        data.data.Model.LevelUserInfo.LevelUserCustomColumn,
      LevelUserLevelToCapture:
        data.data.Model.LevelUserInfo.LevelUserLevelToCapture,
      LevelUserCycleFormat: data.data.Model.LevelUserInfo.LevelUserCycleFormat,
      LevelUserShellStockMessage:
        data.data.Model.LevelUserInfo.LevelUserShellStockMessage,
      LevelUserCampaignVisible:
        data.data.Model.LevelUserInfo.LevelUserCampaignVisible,
      LevelUserFeatureVisible:
        data.data.Model.LevelUserInfo.LevelUserFeatureVisible,
      LevelUserProgramVisible:
        data.data.Model.LevelUserInfo.LevelUserProgramVisible,
      LevelUserPlanVisible: data.data.Model.LevelUserInfo.LevelUserPlanVisible,
      LevelUserSizeVisible: data.data.Model.LevelUserInfo.LevelUserSizeVisible,
      LevelUserPrintAllButton:
        data.data.Model.LevelUserInfo.LevelUserPrintAllButton,
      MatrixIgnorePromotion:
        data.data.Model.LevelUserInfo.MatrixIgnorePromotion,
      LevelUserKeepSignCheckbox:
        data.data.Model.LevelUserInfo.LevelUserKeepSignCheckbox,

      //2nd sign qty
      LevelUserStoreMaxQuantityPerStore:
        data.data.Model.LevelUserInfo.LevelUserStoreMaxQuantityPerStore,
      //1st sign qty
      LevelUserMaxQuantityPerStore:
        data.data.Model.LevelUserInfo.LevelUserMaxQuantityPerStore,
      LevelUserInfoMultiEdit:
        data.data.Model.LevelUserInfo.LevelUserInfoMultiEdit,
      MaximumOrderStockQuantity:
        data.data.Model.LevelUserInfo.MaximumOrderStockQuantity,
      LevelUserInfoPrintBatch:
        data.data.Model.LevelUserInfo.LevelUserInfoPrintBatch,
      LevelUserInfoBuildBatch:
        data.data.Model.LevelUserInfo.LevelUserInfoBuildBatch,
    };
  }

  componentDidMount = () => {
    setTimeout(() => {
      this.setState({ loadHome: true, isLoading: true });
    }, 1);
    setTimeout(() => {
      this.setState({ loadSecond: true });
    }, 2);

    if (this.state.defaultSignTypeID === 1) {
    } else if (this.state.defaultSignTypeID === 8) {
      this.setState({ firstLoginTag: true }, () => {
        this.refs.child.select({
          Sign: "Batch Edit",
          SignTypeID: "Batch Edit",
        });
      });
    }
    // else if (this.state.defaultSignTypeID === 4) {
    //   this.refs.child.select({
    //     Sign: "search",
    //     SignTypeID: 3,
    //   });
    // }

    // // timer put it back correctly
    // this.timer = setTimeout(() => {
    //   // this.navbar_Logout("Logged out due to inactivity");
    // }, 600000);
    // this.setState({ isLoading: false });
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: () => this.resetTimer(),
    });
    // this.resetTimer();
  };
  componentDidUpdate = () => {
    // this.resetTimer();
    // if(this.state == )
  };
  shouldComponentUpdate = (e) => {
    return e;
  };

  backToHome = (action) => {
    this.setState({
      auditMode: false,
      auditModeTest: "",
      backToHome: true,
    });
    if (action === "goBackAllTheWay") {
      this.refs.refsHomeGrid.exitScanned("fromedit");
      this.getCall("fromedit");
      if (
        !this.state.showprintBatchScreen &&
        !this.state.showBatchEditScreen &&
        !this.state.showOrderStockScreen &&
        this.state.currentSignTypeID != 8 &&
        this.state.auditMode === false
      ) {
        this.departmentSelectNoCall(this.state.currentDepartmentID);
      }
      this.setState({
        arrGrid: [],
        backToHome: false,
        // defaultSignTypeID: this.state.currentAhead,
      });
      this.refs.header.dropdown_GetByAd_noCall(
        this.state.currentAhead === +-1
          ? "Current Ad"
          : this.state.currentAhead === +-2
          ? "Prior Ad"
          : this.state.currentAhead === +0
          ? "Next Ad"
          : this.state.currentAhead === +1
          ? "Kit Prep"
          : -1
      );

      // // this.refs.refsHomeGrid.exitScanned();
      // if (this.state.defaultSignTypeID === 1) {
      //   this.refs.child.select({
      //     Sign: "Promo",
      //     SignTypeID: 1,
      //   });
      // } else if (this.state.defaultSignTypeID === 8) {
      //   this.setState({ firstLoginTag: true }, () => {
      //     this.refs.child.select({
      //       Sign: "Batch Edit",
      //       SignTypeID: "Batch Edit",
      //     });
      //   });
      // }
    }

    this.setState({ backToHome: false });
  };

  //timeout method
  resetTimer() {
    // clearTimeout(this.timer);
    // if (this.state.show) this.setState({ show: false });
    // this.timer = setTimeout(() => {
    //   this.navbar_Logout("Logged out due to inactivity");
    // }, 1800000);
  }

  //logout method
  navbar_Logout = (e) => {
    if (e) {
      const { navigate } = this.props.navigation;
      navigate("Login", {
        notificationText: e,
        loggedIn: false,
      });
    } else {
      const { navigate } = this.props.navigation;
      navigate("Login");
    }
    resetLogout();
  };

  main_Ahead = (e) => {
    this.setState({ currentAhead: e, isLoading: true }, () => {
      if (this.state.showMultiEdit === true) {
        this.getCallFilter(true);
        this.setState({ isLoading: false });
      } else {
        this.getCallFilter();
      }
    });
  };

  //footer method
  departmentsScrollView_Department = (e) => {
    // alert(
    //   this.state.currentDepartmentID + JSON.stringify(this.state.backToHome)
    // );
    if (this.state.backToHome === true) {
      this.departmentSelectNoCall(this.state.currentDepartmentID);
    }
    this.setState(
      {
        currentDepartmentID:
          this.state.backToHome === true ? this.state.currentDepartmentID : e,
        isLoading: true,
        searchText: "",
        prevSearchedText: "",
      },

      () => {
        if (this.state.showMultiEdit === true) {
          this.getCallFilter(true);
        } else {
          this.getCallFilter();
        }
      }
    );
  };
  departmentSelectNoCall = (e) => {
    const arr = [...this.state.departments];
    let departmentName = "";
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].DepartmentID === e) {
        departmentName = arr[i].department.DepartmentName;
        break;
      }
    }
    this.refs.depRef.departmentSelectNoCall(departmentName);
    this.setState({ currentDepartmentID: e });
  };

  //navbar methods
  navbar_MultiEdit = () => {
    this.setState({
      showMultiEdit: true,
      showprintBatchScreen: false,
      showBatchEditScreen: false,
      invisibleHome: false,
      showScannedGrid: false,
      showScannedItems: false,
      showOrderStockScreen: false,
    });
  };
  navbar_TagStock = () => {
    this.setState(
      {
        showMultiEdit: false,
        showOrderStockScreen: false,
        invisibleHome: false,
        showScannedGrid: false,
        showScannedItems: false,
      },
      () => {
        this.setState({ showOrderStockScreen: true });
      }
    );
  };
  navbar_SignStock = () => {
    this.setState(
      {
        showMultiEdit: false,
        showOrderStockScreen: false,
        invisibleHome: false,
        showScannedGrid: false,
        showScannedItems: false,
      },
      () => {
        this.setState({ showOrderStockScreen: true });
      }
    );
  };
  navbar_SignBatch = (description, bool) => {
    this.setState({ invisibleHome: true, showMultiEdit: false });
    if (bool === true) {
      this.setState({ showprintBatchScreen: false });
    }
    const body = {
      levelID: this.state.levelId,
    };

    data_get_batches(body).then((resp) => {
      const arr = [];
      if (resp.Handling === "Success") {
        for (let i = 0; i < resp.Model.length; i++) {
          if (resp.Model[i].isSign) {
            arr.push(resp.Model[i]);
          }
        }
        this.setState({ printBatchData: arr }, () => {
          this.setState({ showprintBatchScreen: true });
        });
      }
    });
  };
  navbar_TagBatch = (description, bool) => {
    this.setState({ invisibleHome: true, showMultiEdit: false });
    if (bool === true) {
      this.setState({ showprintBatchScreen: false });
    }
    const body = {
      levelID: this.state.levelId,
    };

    data_get_batches(body).then((resp) => {
      const arr = [];
      this.setState({ isLoading: false });
      if (resp.Handling === "Success") {
        if (description === "tagbatch") {
          for (let i = 0; i < resp.Model.length; i++) {
            if (!resp.Model[i].isSign) {
              arr.push(resp.Model[i]);
            }
          }
          this.setState({ printBatchData: arr }, () => {
            this.setState({ showprintBatchScreen: true, isLoading: false });
          });
        } else if (description === "batchedit") {
          this.showScannedItems(false);
          this.setState({
            showprintBatchScreen: false,
            hideFilter: false,
            hideFilterGlitch: false,
            hideFilterTextInput: false,
          });
          for (let i = 0; i < resp.Model.length; i++) {
            //take a deeper look into this, see what this does exactly
            //un comment this later, the code under this is for the petsmart testing
            if (!resp.Model[i].isSign && !resp.Model[i].IsPrintBatch) {
              arr.push(resp.Model[i]);
            }
            // this.setState({ showBatchEditScreen: false }, () => {
            //   this.setState({ showBatchEditScreen: true });
            // });
            // if (!resp.Model[i].isSign) {
            //   arr.push(resp.Model[i]);
            // }
          }

          this.setState({ printBatchData: arr, hideFilterGlitch: false });

          if (this.state.showScannedItems === true) {
            if (this.state.showScannedGrid === true) {
              this.hideScannedItems();
            }
          }
        }
      }
    });
  };
  //this method handles the sliding navbar buttons
  navbar_promo = () => {
    let defDepName = "";
    if (getDefaultDepartment().department.DepartmentName.length > 0) {
      defDepName = getDefaultDepartment().department;
    }
    this.setState(
      {
        prevSearchedText: "",
        currentDepartmentID: getDefaultDepartment().department.DepartmentID,
        currentSignTypeID: 1,
        main_AheadInfoArray: getAhead(),
        nonEditable: false,
        showMultiEdit: false,
        invisibleHome: false,
        currentSignTypeID: 1,
        showprintBatchScreen: false,
        showOrderStockScreen: false,
        hideDeletePrintButtons: false,
        showBatchEditScreen: false,
        batchTypeID: "",
        printBatchHideAhead: false,
        hideFilter: false,
        hideFilterTextInput: false,
        orderStockSelected: "",
        loadHome: true,
      },
      () => {
        this.enableDeleteSelected([]);
        this.refs.depRef.departmentSelectNoCall(
          getDefaultDepartment().department.DepartmentName
        );
        this.getCall();
        // this.getCallFilter();
      }
    );
  };
  navbar_SignType = (e, a, c) => {
    this.setState({ prevSearchedText: "", batchTypeID: "" });
    if (e != "Audit") {
      this.setState({ auditMode: false });
    }
    if (e === "Sign Batch") {
      // showpringBatchScreen is set to false and right back to true
      // so that it refreshes the print batch screen
      this.setState({ showprintBatchScreen: false }, () => {
        this.setState({
          nonEditable: false,
          showMultiEdit: false,
          showprintBatchScreen: true,
          showOrderStockScreen: false,
          showBatchEditScreen: false,
          //arrGrid is an empty array so that it clears the stored data from
          //previous requests
          arrGrid: [],
          //
          hideDeletePrintButtons: true,
          currentSignTypeID: 1,
          printBatchHideAhead: true,
          hideFilter: true,
          hideFilterTextInput: true,
          currentAhead: -1,
          orderStockSelected: "",
          isLoading: false,
        });

        this.refs.header.resetBatchHeader();

        if (this.state.showScannedItems === true) {
          if (this.state.showScannedGrid === true) {
            this.hideScannedItems();
          }
        }
      });
      if (this.state.loadHome === true) {
        this.uncheckAll();
      }
    } else if (e === "Audit") {
      this.setState({ auditMode: true });
      this.refs.refsHomeGrid.showScanner(true, "Audit");
    } else if (e === "Tag Batch") {
      this.setState({ showprintBatchScreen: false }, () => {
        this.setState({
          nonEditable: false,
          showMultiEdit: false,
          showprintBatchScreen: true,
          showOrderStockScreen: false,
          showBatchEditScreen: false,
          currentSignTypeID: 8,
          arrGrid: [],
          hideDeletePrintButtons: true,
          printBatchHideAhead: true,
          hideFilter: true,
          hideFilterTextInput: true,
          currentAhead: -1,
          orderStockSelected: "",
        });

        this.refs.header.resetBatchHeader();
        if (this.state.showScannedItems === true) {
          if (this.state.showScannedGrid === true) {
            this.hideScannedItems();
          }
        }
      });
      if (this.state.loadHome === true) {
        this.uncheckAll();
      }
    } else if (e === "Sign Stock") {
      this.setState(
        { showOrderStockScreen: false, invisibleHome: false },
        () => {
          this.setState({
            nonEditable: false,
            showMultiEdit: false,
            showprintBatchScreen: false,
            showOrderStockScreen: true,
            showBatchEditScreen: false,
            currentSignTypeID: 1,
            arrGrid: [],
            hideDeletePrintButtons: true,
            printBatchHideAhead: true,
            hideFilter: true,
            hideFilterTextInput: true,
            currentAhead: -1,
            orderStockSelected: "Sign Stock",
            loadHome: false,
          });

          this.refs.header.resetBatchHeader();
          if (this.state.showScannedItems === true) {
            if (this.state.showScannedGrid === true) {
              this.hideScannedItems();
            }
          }
        }
      );
      if (this.state.loadHome === true) {
        this.uncheckAll();
      }
    } else if (e === "Tag Stock") {
      this.setState(
        { showOrderStockScreen: false, invisibleHome: false },
        () => {
          this.setState({
            nonEditable: false,
            showMultiEdit: false,
            showprintBatchScreen: false,
            showOrderStockScreen: true,
            showBatchEditScreen: false,
            currentSignTypeID: 8,
            arrGrid: [],
            hideDeletePrintButtons: true,
            printBatchHideAhead: true,
            hideFilter: true,
            hideFilterTextInput: true,
            currentAhead: -1,
            orderStockSelected: "Tag Stock",
            loadHome: false,
          });

          this.refs.header.resetBatchHeader();
          if (this.state.showScannedItems === true) {
            if (this.state.showScannedGrid === true) {
              this.hideScannedItems();
            }
          }
        }
      );
      if (this.state.loadHome === true) {
        this.uncheckAll();
      }
    } else if (e === "Multi Edit") {
      if (a !== 1 && a !== 8) {
        this.setState(
          {
            nonEditable: false,
            searchText: "",
            searchValues: "",
            currentSignTypeID: 1,
            currentDepartmentID: getDefaultDepartment(),
          },
          () => {
            this.refs.depRef.clickHandlerFromRef(getDefaultDepartment());
            // this.getCallFilter("", [], "", true);
          }
        );
      }
      if (a === 1 || a === 8) {
        this.setState({ currentSignTypeID: a });
      } else if (
        a === "Multi Edit" &&
        this.state.currentSignTypeID != 1 &&
        this.state.currentSignTypeID != 8
      ) {
        this.setState({
          currentSignTypeID: getDefaultDepartment(),
          searchValues: " ",
          searchText: " ",
        });
      }
      this.setState(
        {
          isLoading: false,
          showMultiEdit: true,
          invisibleHome: false,
          // currentSignTypeID: a != 1 ? a!= 8 ,
          showprintBatchScreen: false,
          showOrderStockScreen: false,
          hideDeletePrintButtons: false,
          showBatchEditScreen: false,
          batchTypeID: "",
          printBatchHideAhead: false,
          hideFilter: false,
          hideFilterTextInput: false,
          orderStockSelected: "",
          loadHome: true,
          arrGrid: [],
        },
        () => {
          this.enableDeleteSelected([]);
          // this.getCallFilter();
          // this.setState({ arrGrid: [] });
        }
      );
      if (this.state.loadHome === true) {
        this.setState({ invisibleHome: false });
        // this.uncheckAll();
        // this.refs.header.resetBatchHeader();
      }
    } else if (e === "Batch Edit") {
      this.setState({
        nonEditable: false,
        showMultiEdit: false,
        invisibleHome: false,
        arrGrid: [],
        showBatchEditScreen: true,
        showOrderStockScreen: false,
        showprintBatchScreen: false,
        currentSignTypeID: 8,
        loadHome: true,
        printBatchHideAhead: true,
        showBatchEditScreenInitialScreen: true,
        currentAhead: -1,
        orderStockSelected: "",
      });
      this.enableDeleteSelected([]);
      if (this.state.loadHome === true) {
        if (this.state.firstLoginTag === true) {
          this.uncheckAll();
        } else {
          this.setState({ firstLoginTag: false });
        }

        this.refs.header.resetBatchHeader();
      }
      if (this.state.showScannedItems === true) {
        if (this.state.showScannedGrid === true) {
          this.hideScannedItems();
        }
      }
    } else if (e === 6) {
      this.setState(
        {
          nonEditable: true,
          showMultiEdit: false,
          invisibleHome: false,
          currentSignTypeID: e,
          showprintBatchScreen: false,
          showOrderStockScreen: false,
          hideDeletePrintButtons: false,
          showBatchEditScreen: false,
          batchTypeID: "",
          printBatchHideAhead: false,
          hideFilter: false,
          hideFilterTextInput: false,
          orderStockSelected: "",
          loadHome: true,
        },
        () => {
          this.enableDeleteSelected([]);
          this.getCallFilter();
        }
      );
    } else {
      this.setState(
        {
          nonEditable: false,
          showMultiEdit: false,
          invisibleHome: false,
          currentSignTypeID: e,
          showprintBatchScreen: false,
          showOrderStockScreen: false,
          hideDeletePrintButtons: false,
          showBatchEditScreen: false,
          batchTypeID: "",
          printBatchHideAhead: false,
          hideFilter: false,
          hideFilterTextInput: false,
          orderStockSelected: "",
          loadHome: true,
        },
        () => {
          this.enableDeleteSelected([]);
          this.getCallFilter();
        }
      );
      if (this.state.loadHome === true) {
        this.setState({ invisibleHome: false });
        this.uncheckAll();
        this.refs.header.resetBatchHeader();
      }
    }
  };
  //this method unchecks the "all" checkbox in homeheader
  uncheckAll = () => {
    // if (this.state.showMultiEdit === false) {
    this.refs.refsHomeGrid.uncheckAll();
    // }
  };
  navbar_ToggleMenu = (bool) => {
    this.setState({ isMenuShowing: bool });
  };
  closeNav = (bool) => {
    if (this.state.isMenuShowing === true) {
      this.setState({ isMenuShowing: false });
      //openDrawer() lives in the Navbar component
      this.refs.child.openDrawer();
    } else if (bool === true) {
      this.setState({ isMenuShowing: true });
      this.refs.child.openDrawer();
    }
  };
  //-------------------------------
  //getCall method
  //this gets all the data from the api for the grid content based on the contents
  //returned by login response coupled with the selections made in the header
  //and footer

  enableDeleteSelected = (e) => {
    if (e.length > 0) {
      this.setState({ enableDeleteSelected: true, toBeDeletedArray: e });
    } else {
      this.setState({ enableDeleteSelected: false });
    }
  };

  //this tells the client to NOT show "No Signs" when first pressing batch edit
  showBatchEditScreenInitialScreen = () => {
    this.setState({ showBatchEditScreenInitialScreen: false });
  };

  //this filter method prevents getCall from being called more than once on login
  getCallFilter = (b) => {
    if (
      this.state.currentAhead != undefined ||
      (this.state.currentAhead != undefined &&
        this.state.currentSignTypeID != undefined &&
        this.state.currentDepartmentID != undefined)
    ) {
      this.setState({ getCallTester: true }, () => {
        if (this.state.getCallTester === true) {
          // if (getCalled() === false) {
          if (b === true) {
            this.getCall("", [], "", true);
          } else {
            this.getCall();
          }
          this.setState({ getCallTester: false });
          // }
        }
      });
    }
  };
  notify = (e) => {
    this.setState({ shouldNotify: false }, () => {
      this.setState({ notificationText: e, shouldNotify: true });
    });
  };
  //
  getBatchData = (batchTypeID) => {
    if (this.state.showScannedItems && this.state.showScannedGrid) {
      this.hideScannedItems();
    }
    this.setState({ batchTypeID: batchTypeID, searchText: "" });
    setTimeout(() => {
      this.getCallFilter();
    }, 10);
  };
  hideFilterGlitch = (bool) => {
    this.setState({ hideFilterGlitch: bool });
  };
  // getCall = (e, newArr, idForScanner, isMultiEditFirstTime) => {
  //     data_get().then((resp) => {
  //     if (resp.Handling == "success") {
  //       const signs = resp.Model.Signs;
  //       for (let i = 0; i < signs.length; i++) {
  //         console.log(signs[i].LevelSignID);
  //       }
  //     }
  //   });
  // }

  getCall = (e, newArr, idForScanner, isMultiEditFirstTime) => {
    if (e === "scannerSearch") {
      const body = {
        currentAhead: -1,
        currentLevelID: this.state.data.data.Model.LevelID,
        currentSignTypeID: 8,
        currentLevelTypeID: this.state.levelTypeID,
        currentDepartmentID: 0,
        batchTypeID: 0,
        searchValues: newArr,
      };
      let lsiArr = [];
      data_get(body, isMultiEditFirstTime, this.state.showMultiEdit, e).then(
        (resp) => {
          //if success then set UPCText to empty string

          // console.log(
          //   "HALAHALA",
          //   resp.Model.Signs.map((e) => {
          //     return e.LevelSignID;
          //   })
          // );
          // return resp.Model.Signs.map((e) => {
          //   return (lsiArr = e.LevelSignID);
          // });
          levelSignIdStore(resp.Model.Signs);
        }

        //take lsiArr to barcodesanner
      );
    } else {
      if (this.state.backToHome == true) {
        e = "fromedit";
      }
      let headeroneFieldLabel = "";
      let headertwoFieldLabel = "";
      let headerthreeFieldLabel = "";
      //this gets hit right away
      // make parsing efficient
      //update this.state.arrgrid
      if (isMultiEditFirstTime == true) {
        setCalled(false);
        // isMultiEditFirstTime = true;
        setTimeout(() => {
          this.setState({ isLoading: false });
        }, 1000);
      }
      if (getCalled() === false) {
        setCalled(true);
        if (isMultiEditFirstTime == true) {
          // this.setState({currentDepartmentID:})
        }
        // if (this.state.searchText.length > 0) {
        //   this.setState({ isSearched: true, currentDepartmentID: 0 });
        // }
        if (
          this.state.searchText.length > 0 &&
          this.state.currentSignTypeID === 8
        ) {
          this.setState({
            prevSearchedText: this.state.searchText,
            isSearchedOriginally: true,
            isSearched: true,
            batchTypeID: 0,
            currentDepartmentID: 0,
          });
        } else if (this.state.searchText.length == +0) {
          this.setState({
            prevSearchedText: "",
            isSearched: this.state.showMultiEdit === false ? false : true,
            isSearchedOriginally:
              this.state.showMultiEdit === false ? false : true,
            searchText: "",
          });
        }
        this.setState({ isLoading: true, showSearchPrompt: false });

        if (this.state.showprintBatchScreen) {
          this.setState({ isLoading: false });
        }
        setTimeout(() => {
          if (
            this.state.showOrderStockScreen === false &&
            this.state.showprintBatchScreen === false &&
            this.state.showMultiEdit === false
          ) {
            this.refs.refsHomeGrid.resetPagination();
          }
        }, 200);

        if (!this.state.batchTypeID == 0 && isMultiEditFirstTime === false) {
          this.setState({ reload: true });
          if (e === "deletedMultiple") {
            this.setState({
              shouldNotify: true,
              notificationText: "Signs Deleted",
            });
            this.refs.refsHomeGrid.deleteFromArray(newArr);
          }
          if (e === "deleted") {
            this.setState({
              shouldNotify: true,
              notificationText: "Sign Deleted",
            });
          }

          //the api call body data is all stored in state, coming
          //from other components
          //for example, if you choose "Next Ad", that will send over
          //the correct ahead type and trigger this post request
          //and populate the grid and correct dates
          const body = {
            currentAhead: this.state.currentAhead,
            currentLevelID: this.state.data.data.Model.LevelID,
            currentSignTypeID: this.state.currentSignTypeID,
            currentLevelTypeID: this.state.levelTypeID,
            currentDepartmentID: this.state.currentDepartmentID,
            batchTypeID:
              this.state.searchText.length > 0
                ? 0
                : this.state.batchTypeID
                ? this.state.batchTypeID
                : 0,
            searchValues:
              this.state.batchTypeID.length < 1
                ? this.state.isSearched === true
                  ? this.state.prevSearchedText
                  : this.state.searchText
                : this.state.searchText,
          };

          setTimeout(() => {
            if (
              body.currentAhead != this.state.prevBody[0].currentAhead ||
              body.currentLevelID != this.state.prevBody[0].currentLevelID ||
              body.currentSignTypeID !=
                this.state.prevBody[0].currentSignTypeID ||
              body.currentLevelTypeID !=
                this.state.prevBody[0].currentLevelTypeID ||
              body.currentDepartmentID !=
                this.state.prevBody[0].currentDepartmentID ||
              body.batchTypeID != this.state.prevBody[0].batchTypeID ||
              this.state.showprintBatchScreen == false
            ) {
              this.setState({
                showScannedGrid: false,
                showScannedItems: false,
              });
              if (
                this.state.showBatchEditScreen === false &&
                this.state.showprintBatchScreen === false &&
                this.state.showPrintScreen === false &&
                this.state.showScannedGrid === true &&
                this.state.showScannedItems === true
              ) {
                this.refs.refsHomeGrid.noScanner();
              }
            }
          }, 50);
          //this is the actual api call

          data_get(
            body,
            isMultiEditFirstTime,
            this.state.showMultiEdit,
            e
          ).then((resp) => {
            this.setState({
              timeLoggedIn: new Date().getTime(),
              prevBody: [body],
              // main_AheadInfoArray: resp.Model.AheadInfo,
              searchText: "",
            });
            if (!resp.Model.AheadInfo) {
              this.setState({ main_AheadInfoArray: getAhead() });
            } else if (resp.Model.AheadInfo[0] == null) {
              this.setState({ main_AheadInfoArray: getAhead() });
            } else {
              this.setState({ main_AheadInfoArray: resp.Model.AheadInfo });
            }
            this.uncheckAll();
            this.setState({
              reload: false,
              trigger: true,
              showBatchEditScreenInitialScreen: false,
            });
            if (resp.Model.Signs.length < 1) {
              this.setState({ isLoading: false });
            }
            if (resp.Handling === "success") {
              //this removes duplicates when searching items
              if (body.searchValues.length > 0) {
                // const arr = resp.Model.Signs;
                // for (let i = 0; i < arr.length; i++) {
                //   arr.map((e, index) => {
                //     if (arr[i].LevelSignID === e.LevelSignID && index != i) {
                //       arr.splice(index, 1);
                //     }
                //   });
                // }
              }
              let newDate = /([^T]+)/;
              const arraySigns = resp.Model.Signs;
              const arrayLevelFields = resp.Model.LevelFields;
              const arrGrid = [];
              const promoLevelStamps = [];

              for (let i = 0; i < arraySigns.length; i++) {
                const obj = {
                  key: i,
                  signLastUpdated: arraySigns[i].LevelSignLastUpdated,
                  levelSignId: arraySigns[i].LevelSignID,
                  id: arraySigns[i].SignID,
                  headerone: "",
                  headeroneFieldLabel: "",
                  headertwo: "",
                  headertwoFieldLabel: "",
                  headerthree: "",
                  headerthreeFieldLabel: "",
                  promo: promoLevelStamps,
                  qty: arraySigns[i].LevelSignQuantity,
                  defaultPromo: arraySigns[i].levelStamp.stamp.StampClientName,
                  levelId: arraySigns[i].LevelID,
                  ahead: this.state.currentAhead,
                  stampId: arraySigns[i].levelStamp.StampId,
                  completeSignObject: "",
                  // promos: arraySigns[i].PromoLevelStamps.map((e) => {
                  //   return { stampName: e.StampClientName, stampId: e.StampId };
                  // })
                };
                for (let a = 0; a < arraySigns[i].SignFields.length; a++) {
                  for (let c = 0; c < arrayLevelFields.length; c++) {
                    if (
                      arrayLevelFields[c].FieldId ===
                      arraySigns[i].SignFields[a].FieldID
                    ) {
                      obj.completeSignObject = arraySigns[i].SignFields;
                      // obj.completeFieldObject = arrayLevelFields
                      //outer contents of items in list: example: header, description, brand

                      if (arrayLevelFields[c].LevelFieldOrder === +0) {
                        let a1 = arrayLevelFields[c].FieldLabel;
                        obj.headeroneFieldLabel = a1;
                        headeroneFieldLabel = a1;
                        obj.headerone =
                          arraySigns[i].SignFields[a].SignFieldValue;
                      } else if (arrayLevelFields[c].LevelFieldOrder === +1) {
                        let a2 = arrayLevelFields[c].FieldLabel;
                        obj.headertwoFieldLabel = a2;
                        headertwoFieldLabel = a2;
                        obj.headertwo =
                          arraySigns[i].SignFields[a].SignFieldValue;
                      } else if (arrayLevelFields[c].LevelFieldOrder === +2) {
                        let a3 = arrayLevelFields[c].FieldLabel;
                        obj.headerthreeFieldLabel = a3;
                        headerthreeFieldLabel = a3;
                        obj.headerthree =
                          arraySigns[i].SignFields[a].SignFieldValue;
                      } else {
                        break;
                      }
                      // obj.completeSignObject = arraySigns[i].SignFields;
                      // //outer contents of items in list: example: header, description, brand
                      // if (arrayLevelFields[c].LevelFieldOrder == 0) {
                      //   obj.headerone =
                      //     arraySigns[i].SignFields[a].SignFieldValue;
                      //   obj.headeroneFieldLabel =
                      //     arrayLevelFields[c].FieldLabel;
                      //   this.setState({
                      //     headeroneFieldLabel: arrayLevelFields[c].FieldLabel,
                      //   });
                      // }
                      // if (arrayLevelFields[c].LevelFieldOrder == 1) {
                      //   obj.headertwo =
                      //     arraySigns[i].SignFields[a].SignFieldValue;
                      //   obj.headertwoFieldLabel =
                      //     arrayLevelFields[c].FieldLabel;
                      //   this.setState({
                      //     headertwoFieldLabel: arrayLevelFields[c].FieldLabel,
                      //   });
                      // }
                      // if (arrayLevelFields[c].LevelFieldOrder == 2) {
                      //   obj.headerthree =
                      //     arraySigns[i].SignFields[a].SignFieldValue;
                      //   obj.headerthreeFieldLabel =
                      //     arrayLevelFields[c].FieldLabel;
                      //   this.setState({
                      //     headerthreeFieldLabel: arrayLevelFields[c].FieldLabel,
                      //   });
                      // }
                    }
                  }
                }
                for (
                  let z = 0;
                  z < arraySigns[i].PromoLevelStamps.length;
                  z++
                ) {
                  promoLevelStamps.push({
                    stampName:
                      arraySigns[i].PromoLevelStamps[z].StampClientName,
                    stampId: arraySigns[i].PromoLevelStamps[z].StampId,
                  });
                }
                arrGrid.push(obj);
                // setTimeout(() => {
                //   this.setState({ shouldNotify: false });
                // }, 2500);
              }
              // if (this.state.showMultiEdit === false) {
              this.refs.refsHomeGrid.resetTextInput();
              // }

              this.setState(
                {
                  dataFromUser: resp,
                  arrGrid: arrGrid,
                  adFrom: resp.Model.StartDate.match(newDate)[0],
                  adTo: resp.Model.EndDate.match(newDate)[0],
                  // main_AheadInfoArray: resp.Model.AheadInfo,
                },
                () => {
                  // alert(JSON.stringify(arrGrid));
                  if (!resp.Model.AheadInfo) {
                    this.setState({ main_AheadInfoArray: getAhead() });
                  } else if (resp.Model.AheadInfo[0] == null) {
                    this.setState({ main_AheadInfoArray: getAhead() });
                  } else {
                    this.setState({
                      main_AheadInfoArray: resp.Model.AheadInfo,
                    });
                  }
                  this.setState({ trigger: false }, () => {
                    if (idForScanner) {
                      this.setState(
                        { showScannedItems: false },
                        () =>
                          this.refs.refsHomeGrid.handleScanner(
                            idForScanner,
                            null,
                            true
                          ),
                        () => {
                          this.setState({ showScannedItems: true });
                        }
                      );
                    }
                  });
                }
              );
            } else if (resp.Handling === "failed") {
              this.setState({
                notificationText: "network error",
                shouldNotify: true,
                pass: "",
                isLoading: false,
              });
            } else if (resp === "network error") {
              this.setState({
                notificationText: "Network Error",
                shouldNotify: true,
                isLoading: false,
              });
            }
          });
        } else {
          if (e === "deletedMultiple") {
            this.setState({
              shouldNotify: true,
              notificationText: "Signs Deleted",
            });
            this.refs.refsHomeGrid.deleteFromArray(newArr);
          }
          if (e === "deleted") {
            this.setState({
              shouldNotify: true,
              notificationText: "Sign Deleted",
            });
          }

          //the api call body data is all stored in state, coming
          //from other components
          //for example, if you choose "Next Ad", that will send over
          //the correct ahead type and trigger this post request
          //and populate the grid and correct dates
          const body = {
            currentAhead: this.state.currentAhead,
            currentLevelID: this.state.data.data.Model.LevelID,
            currentSignTypeID: this.state.currentSignTypeID,
            currentLevelTypeID: this.state.levelTypeID,
            currentDepartmentID: this.state.currentDepartmentID,
            batchTypeID:
              this.state.searchText.length > 0
                ? 0
                : this.state.batchTypeID
                ? this.state.batchTypeID
                : 0,

            searchValues:
              this.state.batchTypeID.length < 1
                ? this.state.isSearched === true
                  ? this.state.prevSearchedText
                  : this.state.searchText
                : this.state.searchText,
          };
          setTimeout(() => {
            if (
              body.currentAhead != this.state.prevBody[0].currentAhead ||
              body.currentLevelID != this.state.prevBody[0].currentLevelID ||
              body.currentSignTypeID !=
                this.state.prevBody[0].currentSignTypeID ||
              body.currentLevelTypeID !=
                this.state.prevBody[0].currentLevelTypeID ||
              body.currentDepartmentID !=
                this.state.prevBody[0].currentDepartmentID ||
              body.batchTypeID != this.state.prevBody[0].batchTypeID
            ) {
              this.setState({
                showScannedGrid: false,
                showScannedItems: false,
              });
              if (
                this.state.showBatchEditScreen === false &&
                this.state.showprintBatchScreen === false &&
                this.state.showPrintScreen === false &&
                this.state.showScannedGrid === true &&
                this.state.showScannedItems === true
              ) {
                this.refs.refsHomeGrid.noScanner();
              }
            }
          }, 50);

          data_get(
            body,
            isMultiEditFirstTime,
            this.state.showMultiEdit,
            e
          ).then((resp) => {
            // let farr = [];
            // let i = 0;
            // while (i < resp.Model.Signs.length) {
            //   farr.push(resp.Model.Signs[i].LevelSignID);
            //   i += 1;
            // }

            // for (let i = 0; i < resp.Model.Signs.length; i++) {
            //   farr.push(resp.Model.Signs[i].LevelSignID);
            // }
            // alert(JSON.stringify(farr));
            this.setState({
              timeLoggedIn: new Date().getTime(),
              prevBody: [body],
              // main_AheadInfoArray: resp.Model.AheadInfo,
              searchText: "",
            });
            if (!resp.Model.AheadInfo) {
              this.setState({ main_AheadInfoArray: getAhead() });
            } else if (resp.Model.AheadInfo[0] == null) {
              this.setState({ main_AheadInfoArray: getAhead() });
            } else {
              this.setState({ main_AheadInfoArray: resp.Model.AheadInfo });
            }
            this.uncheckAll();
            this.setState({
              reload: false,
              trigger: true,
              showBatchEditScreenInitialScreen: false,
            });
            if (resp.Model.Signs.length < 1) {
              this.setState({ isLoading: false });
            }
            if (resp.Handling === "success") {
              //this removes duplicates when searching items
              // if (body.searchValues.length > 0) {
              //   // const arr = resp.Model.Signs;
              //   // for (let i = arr.length - 1; i > -1; i--) {
              //   //   arr[i].LevelSigns.map((e, index) => {
              //   //     if (e.LevelSignID === e.LevelSignID && i != index) {
              //   //       arr.splice(i, 1);
              //   //     }
              //   //   });
              //   // }
              // }
              let newDate = /([^T]+)/;
              const arraySigns = resp.Model.Signs;
              const arrayLevelFields = resp.Model.LevelFields;
              const arrGrid = [];
              const promoLevelStamps = [];
              this.setState({ arrayLevelFields: resp.Model.arrayLevelFields });

              for (let i = 0; i < arraySigns.length; i++) {
                // if (i === +0) {
                //   alert("IT IS 0");
                // }
                // if (i === arraySigns.length - 1) {
                //   alert("IT IS THE END ");
                // }
                const obj = {
                  key: JSON.stringify(i),
                  signLastUpdated: arraySigns[i].LevelSignLastUpdated,
                  levelSignId: arraySigns[i].LevelSignID,
                  id: arraySigns[i].SignID,
                  headerone: "",
                  headeroneFieldLabel: "",
                  headertwo: "",
                  headertwoFieldLabel: "",
                  headerthree: "",
                  headerthreeFieldLabel: "",
                  promo: promoLevelStamps.slice(0, 3),
                  qty: arraySigns[i].LevelSignQuantity,
                  qtyDefault: arraySigns[i].sign.SignQuantity,
                  // qtyDefault: 2,
                  defaultPromo: arraySigns[i].levelStamp.StampClientName,
                  // defaultPromo: ":DLKFJ:LSDKJF",
                  levelId: arraySigns[i].LevelID,
                  campaignId: arraySigns[i].CampaignID,
                  ahead: this.state.currentAhead,
                  levelSignStampId: arraySigns[i].StampID,
                  stampId: arraySigns[i].levelStamp.StampId,
                  // stampId: 234234,
                  completeSignObject: "",
                  promos: arraySigns[i].PromoLevelStamps.map((e) => {
                    return {
                      stampName: e.StampClientName,
                      stampId: e.StampId,
                      //below are for proofing the image
                      campaignId: e.stamp.CampaignID,
                      featureId: e.stamp.FeatureID,
                      programId: e.stamp.ProgramID,
                      planId: e.stamp.PlanID,
                      sizeId: e.stamp.stock.SizeId,
                      stockId: e.stamp.StockID,

                      surname: this.state.surname,
                      levelid: this.state.levelId,

                      width: e.stamp.stock.stockSize.SizeWidth,
                      height: e.stamp.stock.stockSize.SizeHeight,
                    };
                  }),
                  // promos: ["a", "b"],
                };

                for (let a = 0; a < arraySigns[i].SignFields.length; a++) {
                  //all signs showing here
                  for (let c = 0; c < arrayLevelFields.length; c++) {
                    if (
                      arrayLevelFields[c].FieldId ===
                      arraySigns[i].SignFields[a].FieldID
                      //   &&
                      // arrayLevelFields[c].LevelFieldOrder == i
                    ) {
                      obj.completeSignObject = arraySigns[i].SignFields;
                      // obj.completeFieldObject = arrayLevelFields
                      //outer contents of items in list: example: header, description, brand

                      if (arrayLevelFields[c].LevelFieldOrder === +0) {
                        let a1 = arrayLevelFields[c].FieldLabel;
                        obj.headeroneFieldLabel = a1;
                        headeroneFieldLabel = a1;
                        obj.headerone =
                          arraySigns[i].SignFields[a].SignFieldValue;
                      } else if (arrayLevelFields[c].LevelFieldOrder === +1) {
                        let a2 = arrayLevelFields[c].FieldLabel;
                        obj.headertwoFieldLabel = a2;
                        headertwoFieldLabel = a2;
                        obj.headertwo =
                          arraySigns[i].SignFields[a].SignFieldValue;
                      } else if (arrayLevelFields[c].LevelFieldOrder === +2) {
                        let a3 = arrayLevelFields[c].FieldLabel;
                        obj.headerthreeFieldLabel = a3;
                        headerthreeFieldLabel = a3;
                        obj.headerthree =
                          arraySigns[i].SignFields[a].SignFieldValue;
                      } else {
                        break;
                      }

                      // if (arrayLevelFields[c].LevelFieldOrder == 0) {
                      //   obj.headerone =
                      //     arraySigns[i].SignFields[a].SignFieldValue;
                      //   obj.headeroneFieldLabel =
                      //     arrayLevelFields[c].FieldLabel;
                      //   this.setState({
                      //     headeroneFieldLabel: arrayLevelFields[c].FieldLabel,
                      //   });
                      // } else if (arrayLevelFields[c].LevelFieldOrder == 1) {
                      //   obj.headertwo =
                      //     arraySigns[i].SignFields[a].SignFieldValue;
                      //   obj.headertwoFieldLabel =
                      //     arrayLevelFields[c].FieldLabel;
                      //   this.setState({
                      //     headertwoFieldLabel: arrayLevelFields[c].FieldLabel,
                      //   });
                      // } else if (arrayLevelFields[c].LevelFieldOrder == 2) {
                      //   obj.headerthree =
                      //     arraySigns[i].SignFields[a].SignFieldValue;
                      //   obj.headerthreeFieldLabel =
                      //     arrayLevelFields[c].FieldLabel;
                      //   this.setState({
                      //     headerthreeFieldLabel: arrayLevelFields[c].FieldLabel,
                      //   });
                      // } else {
                      //   break;
                      // }
                    }
                  }
                }
                // for (let z = 0; z < arraySigns[i].PromoLevelStamps.length; z++) {
                //   promoLevelStamps.push({
                //     stampName: !body.batchTypeID
                //       ? arraySigns[i].PromoLevelStamps[z].StampClientName
                //       : arraySigns[i].PromoLevelStamps[z].StampClientName,
                //     stampId: !body.batchTypeID
                //       ? arraySigns[i].PromoLevelStamps[z].StampId
                //       : arraySigns[i].PromoLevelStamps[z].stampId,
                //   });
                // }

                arrGrid.push(obj);
                // setTimeout(() => {
                //   this.setState({ shouldNotify: false });
                // }, 2500);
              }
              this.setState({
                promoLevelStamps: [...new Set(promoLevelStamps)],
              });
              // if (this.state.showMultiEdit === false) {
              this.refs.refsHomeGrid.resetTextInput();
              // }
              this.setState(
                {
                  dataFromUser: resp,
                  arrGrid: arrGrid,
                  adFrom: resp.Model.StartDate.match(newDate)[0],
                  adTo: resp.Model.EndDate.match(newDate)[0],
                  headeroneFieldLabel: headeroneFieldLabel,
                  headertwoFieldLabel: headertwoFieldLabel,
                  headerthreeFieldLabel: headerthreeFieldLabel,
                  // main_AheadInfoArray: resp.Model.AheadInfo,
                },
                () => {
                  // alert(Date.now());
                  // alert(JSON.stringify(arrGrid));
                  // alert(JSON.stringify(arrGrid));
                  if (
                    !resp.Model.AheadInfo ||
                    resp.Model.AheadInfo[0] == null
                  ) {
                    this.setState({ main_AheadInfoArray: getAhead() });
                  }
                  // else if (resp.Model.AheadInfo[0] == null) {
                  // this.setState({ main_AheadInfoArray: getAhead() });
                  // }
                  else {
                    this.setState({
                      main_AheadInfoArray: resp.Model.AheadInfo,
                    });
                  }
                  this.setState({ trigger: false }, () => {
                    if (idForScanner) {
                      this.setState(
                        { showScannedItems: false },
                        () =>
                          this.refs.refsHomeGrid.handleScanner(
                            idForScanner,
                            null,
                            true
                          ),
                        () => {
                          this.setState({ showScannedItems: true });
                        }
                      );
                    }
                  });
                }
              );
            } else if (resp.Handling === "failed") {
              this.setState({
                notificationText: "network error",
                shouldNotify: true,
                pass: "",
                isLoading: false,
              });
            } else if (resp === "network error") {
              this.setState({
                notificationText: "Network Error",
                shouldNotify: true,
                isLoading: false,
              });
            }
          });
        }
        if (
          this.state.showScannedItems === true &&
          this.state.showScannedGrid === true
        ) {
          this.setState({ showScannedItems: false }, () =>
            this.setState({ showScannedItems: true })
          );
        }
        setTimeout(() => {
          if (this.state.showprintBatchScreen === true) {
            this.setState({ isLoading: false });
          }
        }, 200);
      }
    }
  };

  // getCall = (e, newArr, idForScanner, isMultiEditFirstTime) => {
  //   //this gets hit right away
  //   // make parsing efficient
  //   //update this.state.arrgrid
  //   if (isMultiEditFirstTime == true) {
  //     setCalled(false);
  //     // isMultiEditFirstTime = true;
  //     setTimeout(() => {
  //       this.setState({ isLoading: false });
  //     }, 1000);
  //   }
  //   if (getCalled() === false) {
  //     setCalled(true);
  //     if (isMultiEditFirstTime == true) {
  //       // this.setState({currentDepartmentID:})
  //     }
  //     // if (this.state.searchText.length > 0) {
  //     //   this.setState({ isSearched: true, currentDepartmentID: 0 });
  //     // }
  //     if (
  //       this.state.searchText.length > 0 &&
  //       this.state.currentSignTypeID === 8
  //     ) {
  //       this.setState({
  //         prevSearchedText: this.state.searchText,
  //         isSearchedOriginally: true,
  //         isSearched: true,
  //         batchTypeID: 0,
  //         currentDepartmentID: 0,
  //       });
  //     } else if (this.state.searchText.length == +0) {
  //       this.setState({
  //         prevSearchedText: "",
  //         isSearched: this.state.showMultiEdit === false ? false : true,
  //         isSearchedOriginally:
  //           this.state.showMultiEdit === false ? false : true,
  //         searchText: "",
  //       });
  //     }
  //     this.setState({ isLoading: true, showSearchPrompt: false });

  //     if (this.state.showprintBatchScreen) {
  //       this.setState({ isLoading: false });
  //     }
  //     setTimeout(() => {
  //       if (
  //         this.state.showOrderStockScreen === false &&
  //         this.state.showprintBatchScreen === false &&
  //         this.state.showMultiEdit === false
  //       ) {
  //         this.refs.refsHomeGrid.resetPagination();
  //       }
  //     }, 200);

  //     if (!this.state.batchTypeID == 0 && isMultiEditFirstTime === false) {
  //       this.setState({ reload: true });
  //       if (e === "deletedMultiple") {
  //         this.setState({
  //           shouldNotify: true,
  //           notificationText: "Signs Deleted",
  //         });
  //         this.refs.refsHomeGrid.deleteFromArray(newArr);
  //       }
  //       if (e === "deleted") {
  //         this.setState({
  //           shouldNotify: true,
  //           notificationText: "Sign Deleted",
  //         });
  //       }

  //       //the api call body data is all stored in state, coming
  //       //from other components
  //       //for example, if you choose "Next Ad", that will send over
  //       //the correct ahead type and trigger this post request
  //       //and populate the grid and correct dates
  //       const body = {
  //         currentAhead: this.state.currentAhead,
  //         currentLevelID: this.state.data.data.Model.LevelID,
  //         currentSignTypeID: this.state.currentSignTypeID,
  //         currentLevelTypeID: this.state.levelTypeID,
  //         currentDepartmentID: this.state.currentDepartmentID,
  //         batchTypeID:
  //           this.state.searchText.length > 0
  //             ? 0
  //             : this.state.batchTypeID
  //             ? this.state.batchTypeID
  //             : 0,
  //         searchValues:
  //           this.state.batchTypeID.length < 1
  //             ? this.state.isSearched === true
  //               ? this.state.prevSearchedText
  //               : this.state.searchText
  //             : this.state.searchText,
  //       };

  //       setTimeout(() => {
  //         if (
  //           body.currentAhead != this.state.prevBody[0].currentAhead ||
  //           body.currentLevelID != this.state.prevBody[0].currentLevelID ||
  //           body.currentSignTypeID !=
  //             this.state.prevBody[0].currentSignTypeID ||
  //           body.currentLevelTypeID !=
  //             this.state.prevBody[0].currentLevelTypeID ||
  //           body.currentDepartmentID !=
  //             this.state.prevBody[0].currentDepartmentID ||
  //           body.batchTypeID != this.state.prevBody[0].batchTypeID ||
  //           this.state.showprintBatchScreen == false
  //         ) {
  //           this.setState({ showScannedGrid: false, showScannedItems: false });
  //           if (
  //             this.state.showBatchEditScreen === false &&
  //             this.state.showprintBatchScreen === false &&
  //             this.state.showPrintScreen === false &&
  //             this.state.showScannedGrid === true &&
  //             this.state.showScannedItems === true
  //           ) {
  //             this.refs.refsHomeGrid.noScanner();
  //           }
  //         }
  //       }, 50);
  //       //this is the actual api call
  //       data_get(body, isMultiEditFirstTime, this.state.showMultiEdit, e).then(
  //         (resp) => {
  //           this.setState({
  //             timeLoggedIn: new Date().getTime(),
  //             prevBody: [body],
  //             // main_AheadInfoArray: resp.Model.AheadInfo,
  //             searchText: "",
  //           });
  //           if (!resp.Model.AheadInfo) {
  //             this.setState({ main_AheadInfoArray: getAhead() });
  //           } else if (resp.Model.AheadInfo[0] == null) {
  //             this.setState({ main_AheadInfoArray: getAhead() });
  //           } else {
  //             this.setState({ main_AheadInfoArray: resp.Model.AheadInfo });
  //           }
  //           this.uncheckAll();
  //           this.setState({
  //             reload: false,
  //             trigger: true,
  //             showBatchEditScreenInitialScreen: false,
  //           });
  //           if (resp.Model.Signs.length < 1) {
  //             this.setState({ isLoading: false });
  //           }
  //           if (resp.Handling === "success") {
  //             //this removes duplicates when searching items
  //             if (body.searchValues.length > 0) {
  //               // const arr = resp.Model.Signs;
  //               // for (let i = 0; i < arr.length; i++) {
  //               //   arr.map((e, index) => {
  //               //     if (arr[i].LevelSignID === e.LevelSignID && index != i) {
  //               //       arr.splice(index, 1);
  //               //     }
  //               //   });
  //               // }
  //             }
  //             let newDate = /([^T]+)/;
  //             const arraySigns = resp.Model.Signs;
  //             const arrayLevelFields = resp.Model.LevelFields;
  //             const arrGrid = [];
  //             const promoLevelStamps = [];

  //             for (let i = 0; i < arraySigns.length; i++) {
  //               const obj = {
  //                 signLastUpdated: arraySigns[i].LevelSignLastUpdated,
  //                 levelSignId: arraySigns[i].LevelSignID,
  //                 id: arraySigns[i].SignID,
  //                 headerone: "",
  //                 headeroneFieldLabel: "",
  //                 headertwo: "",
  //                 headertwoFieldLabel: "",
  //                 headerthree: "",
  //                 headerthreeFieldLabel: "",
  //                 promo: promoLevelStamps,
  //                 qty: arraySigns[i].LevelSignQuantity,
  //                 defaultPromo: arraySigns[i].levelStamp.stamp.StampClientName,
  //                 levelId: arraySigns[i].LevelID,
  //                 ahead: this.state.currentAhead,
  //                 stampId: arraySigns[i].levelStamp.StampId,
  //                 completeSignObject: "",
  //                 // promos: arraySigns[i].PromoLevelStamps.map((e) => {
  //                 //   return { stampName: e.StampClientName, stampId: e.StampId };
  //                 // })
  //               };
  //               for (let a = 0; a < arraySigns[i].SignFields.length; a++) {
  //                 for (let c = 0; c < arrayLevelFields.length; c++) {
  //                   if (
  //                     arrayLevelFields[c].FieldId ===
  //                     arraySigns[i].SignFields[a].FieldID
  //                   ) {
  //                     obj.completeSignObject = arraySigns[i].SignFields;
  //                     //outer contents of items in list: example: header, description, brand
  //                     if (arrayLevelFields[c].LevelFieldOrder == 0) {
  //                       obj.headerone =
  //                         arraySigns[i].SignFields[a].SignFieldValue;
  //                       obj.headeroneFieldLabel =
  //                         arrayLevelFields[c].FieldLabel;
  //                       this.setState({
  //                         headeroneFieldLabel: arrayLevelFields[c].FieldLabel,
  //                       });
  //                     }
  //                     if (arrayLevelFields[c].LevelFieldOrder == 1) {
  //                       obj.headertwo =
  //                         arraySigns[i].SignFields[a].SignFieldValue;
  //                       obj.headertwoFieldLabel =
  //                         arrayLevelFields[c].FieldLabel;
  //                       this.setState({
  //                         headertwoFieldLabel: arrayLevelFields[c].FieldLabel,
  //                       });
  //                     }
  //                     if (arrayLevelFields[c].LevelFieldOrder == 2) {
  //                       obj.headerthree =
  //                         arraySigns[i].SignFields[a].SignFieldValue;
  //                       obj.headerthreeFieldLabel =
  //                         arrayLevelFields[c].FieldLabel;
  //                       this.setState({
  //                         headerthreeFieldLabel: arrayLevelFields[c].FieldLabel,
  //                       });
  //                     }
  //                   }
  //                 }
  //               }
  //               for (
  //                 let z = 0;
  //                 z < arraySigns[i].PromoLevelStamps.length;
  //                 z++
  //               ) {
  //                 promoLevelStamps.push({
  //                   stampName:
  //                     arraySigns[i].PromoLevelStamps[z].StampClientName,
  //                   stampId: arraySigns[i].PromoLevelStamps[z].StampId,
  //                 });
  //               }
  //               arrGrid.push(obj);
  //               setTimeout(() => {
  //                 this.setState({ shouldNotify: false });
  //               }, 2500);
  //             }
  //             // if (this.state.showMultiEdit === false) {
  //             this.refs.refsHomeGrid.resetTextInput();
  //             // }

  //             this.setState(
  //               {
  //                 dataFromUser: resp,
  //                 arrGrid: arrGrid,
  //                 adFrom: resp.Model.StartDate.match(newDate)[0],
  //                 adTo: resp.Model.EndDate.match(newDate)[0],
  //                 // main_AheadInfoArray: resp.Model.AheadInfo,
  //               },
  //               () => {
  //                 // alert(JSON.stringify(arrGrid));
  //                 if (!resp.Model.AheadInfo) {
  //                   this.setState({ main_AheadInfoArray: getAhead() });
  //                 } else if (resp.Model.AheadInfo[0] == null) {
  //                   this.setState({ main_AheadInfoArray: getAhead() });
  //                 } else {
  //                   this.setState({
  //                     main_AheadInfoArray: resp.Model.AheadInfo,
  //                   });
  //                 }
  //                 this.setState({ trigger: false }, () => {
  //                   if (idForScanner) {
  //                     this.setState(
  //                       { showScannedItems: false },
  //                       () =>
  //                         this.refs.refsHomeGrid.handleScanner(
  //                           idForScanner,
  //                           null,
  //                           true
  //                         ),
  //                       () => {
  //                         this.setState({ showScannedItems: true });
  //                       }
  //                     );
  //                   }
  //                 });
  //               }
  //             );
  //           } else if (resp.Handling === "failed") {
  //             this.setState({
  //               notificationText: "network error",
  //               shouldNotify: true,
  //               pass: "",
  //               isLoading: false,
  //             });
  //           } else if (resp === "network error") {
  //             this.setState({
  //               notificationText: "Network Error",
  //               shouldNotify: true,
  //               isLoading: false,
  //             });
  //           }
  //         }
  //       );
  //     } else {
  //       if (e === "deletedMultiple") {
  //         this.setState({
  //           shouldNotify: true,
  //           notificationText: "Signs Deleted",
  //         });
  //         this.refs.refsHomeGrid.deleteFromArray(newArr);
  //       }
  //       if (e === "deleted") {
  //         this.setState({
  //           shouldNotify: true,
  //           notificationText: "Sign Deleted",
  //         });
  //       }

  //       //the api call body data is all stored in state, coming
  //       //from other components
  //       //for example, if you choose "Next Ad", that will send over
  //       //the correct ahead type and trigger this post request
  //       //and populate the grid and correct dates
  //       const body = {
  //         currentAhead: this.state.currentAhead,
  //         currentLevelID: this.state.data.data.Model.LevelID,
  //         currentSignTypeID: this.state.currentSignTypeID,
  //         currentLevelTypeID: this.state.levelTypeID,
  //         currentDepartmentID: this.state.currentDepartmentID,
  //         batchTypeID:
  //           this.state.searchText.length > 0
  //             ? 0
  //             : this.state.batchTypeID
  //             ? this.state.batchTypeID
  //             : 0,

  //         searchValues:
  //           this.state.batchTypeID.length < 1
  //             ? this.state.isSearched === true
  //               ? this.state.prevSearchedText
  //               : this.state.searchText
  //             : this.state.searchText,
  //       };
  //       setTimeout(() => {
  //         if (
  //           body.currentAhead != this.state.prevBody[0].currentAhead ||
  //           body.currentLevelID != this.state.prevBody[0].currentLevelID ||
  //           body.currentSignTypeID !=
  //             this.state.prevBody[0].currentSignTypeID ||
  //           body.currentLevelTypeID !=
  //             this.state.prevBody[0].currentLevelTypeID ||
  //           body.currentDepartmentID !=
  //             this.state.prevBody[0].currentDepartmentID ||
  //           body.batchTypeID != this.state.prevBody[0].batchTypeID
  //         ) {
  //           this.setState({ showScannedGrid: false, showScannedItems: false });
  //           if (
  //             this.state.showBatchEditScreen === false &&
  //             this.state.showprintBatchScreen === false &&
  //             this.state.showPrintScreen === false &&
  //             this.state.showScannedGrid === true &&
  //             this.state.showScannedItems === true
  //           ) {
  //             this.refs.refsHomeGrid.noScanner();
  //           }
  //         }
  //       }, 50);

  //       data_get(body, isMultiEditFirstTime, this.state.showMultiEdit, e).then(
  //         (resp) => {
  //           this.setState({
  //             timeLoggedIn: new Date().getTime(),
  //             prevBody: [body],
  //             // main_AheadInfoArray: resp.Model.AheadInfo,
  //             searchText: "",
  //           });
  //           if (!resp.Model.AheadInfo) {
  //             this.setState({ main_AheadInfoArray: getAhead() });
  //           } else if (resp.Model.AheadInfo[0] == null) {
  //             this.setState({ main_AheadInfoArray: getAhead() });
  //           } else {
  //             this.setState({ main_AheadInfoArray: resp.Model.AheadInfo });
  //           }
  //           this.uncheckAll();
  //           this.setState({
  //             reload: false,
  //             trigger: true,
  //             showBatchEditScreenInitialScreen: false,
  //           });
  //           if (resp.Model.Signs.length < 1) {
  //             this.setState({ isLoading: false });
  //           }
  //           if (resp.Handling === "success") {
  //             //this removes duplicates when searching items
  //             if (body.searchValues.length > 0) {
  //               // const arr = resp.Model.Signs;
  //               // for (let i = arr.length - 1; i > -1; i--) {
  //               //   arr[i].LevelSigns.map((e, index) => {
  //               //     if (e.LevelSignID === e.LevelSignID && i != index) {
  //               //       arr.splice(i, 1);
  //               //     }
  //               //   });
  //               // }
  //             }
  //             let newDate = /([^T]+)/;
  //             const arraySigns = resp.Model.Signs;
  //             const arrayLevelFields = resp.Model.LevelFields;
  //             const arrGrid = [];
  //             const promoLevelStamps = [];

  //             for (let i = 0; i < arraySigns.length; i++) {
  //               const obj = {
  //                 signLastUpdated: arraySigns[i].LevelSignLastUpdated,
  //                 levelSignId: arraySigns[i].LevelSignID,
  //                 id: arraySigns[i].SignID,
  //                 headerone: "",
  //                 headeroneFieldLabel: "",
  //                 headertwo: "",
  //                 headertwoFieldLabel: "",
  //                 headerthree: "",
  //                 headerthreeFieldLabel: "",
  //                 promo: promoLevelStamps.slice(0, 3),
  //                 qty: arraySigns[i].LevelSignQuantity,
  //                 qtyDefault: arraySigns[i].sign.SignQuantity,
  //                 // qtyDefault: 2,
  //                 defaultPromo: arraySigns[i].levelStamp.StampClientName,
  //                 // defaultPromo: ":DLKFJ:LSDKJF",
  //                 levelId: arraySigns[i].LevelID,
  //                 campaignId: arraySigns[i].CampaignID,
  //                 ahead: this.state.currentAhead,
  //                 levelSignStampId: arraySigns[i].StampID,
  //                 stampId: arraySigns[i].levelStamp.StampId,
  //                 // stampId: 234234,
  //                 completeSignObject: "",
  //                 promos: arraySigns[i].PromoLevelStamps.map((e) => {
  //                   return {
  //                     stampName: e.StampClientName,
  //                     stampId: e.StampId,
  //                     //below are for proofing the image
  //                     campaignId: e.stamp.CampaignID,
  //                     featureId: e.stamp.FeatureID,
  //                     programId: e.stamp.ProgramID,
  //                     planId: e.stamp.PlanID,
  //                     sizeId: e.stamp.stock.SizeId,
  //                     stockId: e.stamp.StockID,

  //                     surname: this.state.surname,
  //                     levelid: this.state.levelId,

  //                     width: e.stamp.stock.stockSize.SizeWidth,
  //                     height: e.stamp.stock.stockSize.SizeHeight,
  //                   };
  //                 }),
  //                 // promos: ["a", "b"],
  //               };

  //               for (let a = 0; a < arraySigns[i].SignFields.length; a++) {
  //                 //all signs showing here

  //                 for (let c = 0; c < arrayLevelFields.length; c++) {
  //                   if (
  //                     arrayLevelFields[c].FieldId ===
  //                     arraySigns[i].SignFields[a].FieldID
  //                   ) {
  //                     obj.completeSignObject = arraySigns[i].SignFields;

  //                     //outer contents of items in list: example: header, description, brand
  //                     if (arrayLevelFields[c].LevelFieldOrder == 0) {
  //                       obj.headerone =
  //                         arraySigns[i].SignFields[a].SignFieldValue;
  //                       obj.headeroneFieldLabel =
  //                         arrayLevelFields[c].FieldLabel;
  //                       this.setState({
  //                         headeroneFieldLabel: arrayLevelFields[c].FieldLabel,
  //                       });
  //                     }
  //                     if (arrayLevelFields[c].LevelFieldOrder == 1) {
  //                       obj.headertwo =
  //                         arraySigns[i].SignFields[a].SignFieldValue;
  //                       obj.headertwoFieldLabel =
  //                         arrayLevelFields[c].FieldLabel;
  //                       this.setState({
  //                         headertwoFieldLabel: arrayLevelFields[c].FieldLabel,
  //                       });
  //                     }
  //                     if (arrayLevelFields[c].LevelFieldOrder == 2) {
  //                       obj.headerthree =
  //                         arraySigns[i].SignFields[a].SignFieldValue;
  //                       obj.headerthreeFieldLabel =
  //                         arrayLevelFields[c].FieldLabel;
  //                       this.setState({
  //                         headerthreeFieldLabel: arrayLevelFields[c].FieldLabel,
  //                       });
  //                     }
  //                   }
  //                 }
  //               }
  //               // for (let z = 0; z < arraySigns[i].PromoLevelStamps.length; z++) {
  //               //   promoLevelStamps.push({
  //               //     stampName: !body.batchTypeID
  //               //       ? arraySigns[i].PromoLevelStamps[z].StampClientName
  //               //       : arraySigns[i].PromoLevelStamps[z].StampClientName,
  //               //     stampId: !body.batchTypeID
  //               //       ? arraySigns[i].PromoLevelStamps[z].StampId
  //               //       : arraySigns[i].PromoLevelStamps[z].stampId,
  //               //   });
  //               // }

  //               arrGrid.push(obj);
  //               setTimeout(() => {
  //                 this.setState({ shouldNotify: false });
  //               }, 2500);
  //             }
  //             this.setState({
  //               promoLevelStamps: [...new Set(promoLevelStamps)],
  //             });
  //             // if (this.state.showMultiEdit === false) {
  //             this.refs.refsHomeGrid.resetTextInput();
  //             // }
  //             this.setState(
  //               {
  //                 dataFromUser: resp,
  //                 arrGrid: arrGrid,
  //                 adFrom: resp.Model.StartDate.match(newDate)[0],
  //                 adTo: resp.Model.EndDate.match(newDate)[0],
  //                 // main_AheadInfoArray: resp.Model.AheadInfo,
  //               },
  //               () => {
  //                 // alert(JSON.stringify(arrGrid));
  //                 if (!resp.Model.AheadInfo) {
  //                   this.setState({ main_AheadInfoArray: getAhead() });
  //                 } else if (resp.Model.AheadInfo[0] == null) {
  //                   this.setState({ main_AheadInfoArray: getAhead() });
  //                 } else {
  //                   this.setState({
  //                     main_AheadInfoArray: resp.Model.AheadInfo,
  //                   });
  //                 }
  //                 this.setState({ trigger: false }, () => {
  //                   if (idForScanner) {
  //                     this.setState(
  //                       { showScannedItems: false },
  //                       () =>
  //                         this.refs.refsHomeGrid.handleScanner(
  //                           idForScanner,
  //                           null,
  //                           true
  //                         ),
  //                       () => {
  //                         this.setState({ showScannedItems: true });
  //                       }
  //                     );
  //                   }
  //                 });
  //               }
  //             );
  //           } else if (resp.Handling === "failed") {
  //             this.setState({
  //               notificationText: "network error",
  //               shouldNotify: true,
  //               pass: "",
  //               isLoading: false,
  //             });
  //           } else if (resp === "network error") {
  //             this.setState({
  //               notificationText: "Network Error",
  //               shouldNotify: true,
  //               isLoading: false,
  //             });
  //           }
  //         }
  //       );
  //     }
  //     if (
  //       this.state.showScannedItems === true &&
  //       this.state.showScannedGrid === true
  //     ) {
  //       this.setState({ showScannedItems: false }, () =>
  //         this.setState({ showScannedItems: true })
  //       );
  //     }
  //     setTimeout(() => {
  //       if (this.state.showprintBatchScreen === true) {
  //         this.setState({ isLoading: false });
  //       }
  //     }, 200);
  //   }
  // };
  deleteMultipleHandlerArray = () => {
    this.setState({});
  };
  showPrintScreen = (e) => {
    this.setState({ auditModeTest: e });
    if (e === "auditMode") {
      this.refs.refsHomeGrid.showPrintScreen(true, "auditMode");
    } else {
      this.refs.refsHomeGrid.showPrintScreen(e);
    }
  };
  //checkbox toggle griddata ,allows checkbox in griddata to work
  homeHeader_EnableMultipleSelectFromGrid = (bool) => {
    this.setState({ enableMultipleSelectFromGrid: bool });
  };
  //-------------------------------
  toggleCreateScreen = () => {
    if (this.state.showCreateScreen === true) {
      this.setState({ showCreateScreen: false });
    } else if (this.state.showCreateScreen === false) {
      this.setState({ showCreateScreen: true });
      this.closeNav();
    }
  };
  footerHeight = (e) => {
    this.setState({ footerHeight: e });
  };
  headerHeight = (e) => {
    this.setState({ headerHeight: e });
  };
  selectStock = (e) => {
    this.setState(
      {
        isLoading: true,
        showOrderStockScreen: false,
        currentSignTypeID: e.SignTypeID === "Tag Stock" ? 8 : 1,
      },
      () => {
        this.setState({ showOrderStockScreen: true }, () => {
          setTimeout(() => {
            this.refs.child.select(e);
          }, 50);
        });
      }
    );
  };
  timedOut = () => {
    alert("Session timed out");
  };
  hideScannedItems = () => {
    this.setState({ showScannedItems: false, showScannedGrid: false });
    this.refs.refsHomeGrid.removeScannedItemGrid();
  };
  showScannedItems = (bool) => {
    this.setState({ showScannedItems: bool });
  };
  removeScannedItem = (e) => {
    this.refs.refsHomeGrid.removeScannedItem(e);
  };
  activateSearch = (signType) => {
    this.setState({
      showSearchPrompt: true,
      batchTypeID: "",
      currentSignTypeID:
        this.state.showMultiEdit === true
          ? this.state.currentSignTypeID
          : signType,
    });
  };
  cancelSearch = () => {
    this.setState({ showSearchPrompt: false });
  };
  search = (e, action) => {
    if (this.state.batchTypeID == 0 || this.state.batchTypeID.length < 1) {
      this.refs.header.resetBatchHeader();
    }

    if (e.length > 1) {
      let strz = e.replace(/\s*,\s*/g, ",");
      let str = strz.replace(/\,*,\,*/g, ",");
      this.setState(
        {
          searchText: str,
          prevSearchedText: str,
          isSearchedOriginally: true,
          isSearched: true,
          batchTypeID: 0,
        },
        () => {
          this.getCallFilter(action);
        }
      );
    } else {
      this.notify("Enter a Search Term");
    }
  };
  refreshBatchEdit = () => {
    this.navbar_TagBatch("batchedit");
    this.navbar_SignType("Batch Edit");
  };
  setSearched = (bool) => {
    this.setState({ isSearched: bool });
  };
  keepItems = (data, action, signType) => {
    keepItem(data, action, signType);
    this.setState({
      keepItemSignArray: array(1).length,
      keepItemTagArray: array(8).length,
    });
  };
  multiEditActivate = () => {
    this.refs.refsHomeGrid.multiEditActivate();
  };

  audit = (bool) => {
    this.setState({ auditMode: bool });
  };

  checkDate = (e) => {
    // var nameArr = names.split(',');
    //create comma seperated items in string
    let arr = this.state.arrGrid;
    let arr2 = JSON.parse(e);
    let newArr = [];
    //this is comparing the login time vs the last time the signs were updated
    for (let i = 0; i < arr.length; i++) {
      for (let a = 0; a < arr2.length; a++) {
        if (arr2[a].SignID === arr[i].id) {
          newArr.push(arr2[a].SignID);
          break;
        }
      }
    }
    let unique = [...new Set(newArr)];
    const bodyArr = unique.join(", ");
    const body = {
      SignIDs: JSON.stringify(bodyArr),
    };
    let bool = "";
    data_check_date({ SignIDs: bodyArr }).then((resp) => {
      if (resp.Handling === "success") {
        for (let i = 0; i < resp.Model.length; i++) {
          if (resp.Model[i].signLastUpdated > this.state.timeLoggedIn) {
            // this.getCall("fromedit");
            // alert("DO THE CALL");
            //do the call
          } else {
            // alert("do it locally");
            //update local signs
          }
        }
      }
    });
    // return bool;
    // for(let i = 0; i < SLU.length; i++){
    //   for(let a = 0; a < newArr.length; a++){
    //     if(SLU)
    //   }
    // }
  };

  render() {
    return (
      <View {...this._panResponder.panHandlers}>
        {this.state.shouldNotify === true && (
          // this shows a small popup notification on the top of the screen
          <TopBarNotification text={this.state.notificationText} />
        )}
        {/* loading sign begin */}
        <React.Fragment>
          {this.state.isLoading === true && !this.state.showprintBatchScreen && (
            <View style={main.spinner}>
              <LoadingSpinner />
            </View>
          )}
        </React.Fragment>
        {/* loading sign end */}
        <View style={main.container}>
          {this.state.isLoggedIn === true ? (
            <React.Fragment>
              <View style={main.columnReverse}>
                {/* navbar begin */}
                <View style={global.absolute}>
                  <View style={main.aboveNavHeight} />
                  <Navbar
                    main_promo={this.navbar_promo}
                    LevelUserInfoPrintBatch={this.state.LevelUserInfoPrintBatch}
                    LevelUserShell={this.state.LevelUserShell}
                    LevelUserInfoMultiEdit={this.state.LevelUserInfoMultiEdit}
                    MatrixIgnorePromotion={this.state.MatrixIgnorePromotion}
                    main_MultiEdit={this.navbar_MultiEdit}
                    main_TagStock={this.navbar_TagStock}
                    main_SignStock={this.navbar_SignStock}
                    data={this.state.data}
                    isLoggedIn={this.state.isLoggedIn}
                    defaultSignTypeID={this.state.defaultSignTypeID}
                    levelTypeID={this.state.levelTypeID}
                    signTypes={this.state.signTypes}
                    currentDepartmentID={this.state.currentDepartmentID}
                    departments={this.state.departments}
                    full_Data={this.state.dataFromUser}
                    main_Data={this.state.signTypes}
                    ref="child"
                    main_Logout={this.navbar_Logout}
                    main_PrintBatch={this.navbar_PrintBatch}
                    main_TagBatch={this.navbar_TagBatch}
                    main_SignBatch={this.navbar_SignBatch}
                    adFrom={this.state.adFrom}
                    adTo={this.state.adTo}
                    {...this.props}
                    main_DefaultSignType={this.state.defaultSignTypeID}
                    //api body data
                    dataFromLogin={this.state.dataFromLogin}
                    main_Selected={this.navbar_SignType}
                    //
                    toggleCreateScreen={this.toggleCreateScreen}
                    main_IsMenuShowing={this.navbar_ToggleMenu}
                  />
                </View>
                {/* navbar end */}
              </View>

              <View style={[global.row]}>
                {/* header begin */}
                <View style={main.columnReverse}>
                  {this.state.loadSecond === true && (
                    <View
                      onLayout={(event) => {
                        this.headerHeight(event.nativeEvent.layout.height);
                      }}
                      style={[global.width100]}
                    >
                      <HomeHeader
                        backToHome={this.backToHome}
                        auditMode={this.state.auditMode}
                        multiEditActivate={this.multiEditActivate}
                        currentSignType={this.state.currentSignTypeID}
                        setSignType={(signType) => {
                          this.setState({ currentSignTypeID: signType });
                          this.navbar_SignType("Multi Edit", signType);
                        }}
                        showMultiEdit={this.state.showMultiEdit}
                        storedSigns={array(this.state.currentSignTypeID)}
                        storedSignsLength={
                          this.state.currentSignTypeID === 1
                            ? this.state.keepItemSignArray
                            : this.state.keepItemTagArray
                        }
                        activateSearch={this.activateSearch}
                        defaultSignTypeID={this.state.defaultSignTypeID}
                        removeScannedItem={this.removeScannedItem}
                        showScannedItems={this.state.showScannedItems}
                        disabled={this.state.disabled}
                        hideFilter={this.hideFilterGlitch}
                        showPrintBatch={this.state.showprintBatchScreen}
                        showOrderStock={this.state.showOrderStockScreen}
                        isLoading={(e) => this.setState({ isLoading: e })}
                        isLoadingrn={
                          this.state.isLoading === true
                            ? true
                            : this.state.isSignBatchLoading === true
                            ? true
                            : false
                        }
                        headerHeight={this.headerHeight}
                        ref="header"
                        printBatch={this.state.printBatchHideAhead}
                        getBatchData={this.getBatchData}
                        data={this.state.printBatchData}
                        batchEdit={this.state.showBatchEditScreen}
                        openDrawer={this.closeNav}
                        hideDeletePrintButtons={
                          this.state.showBatchEditScreen === true
                            ? false
                            : this.state.hideDeletePrintButtons
                        }
                        getCall={this.getCall}
                        toBeDeletedArray={this.state.toBeDeletedArray}
                        isDeleteEnabled={this.state.enableDeleteSelected}
                        main_AdFrom={this.state.adFrom}
                        main_AdTo={this.state.adTo}
                        main_AheadInfoArray={this.state.main_AheadInfoArray}
                        main_BatchTypeInfoArray={this.state.printBatchData}
                        main_Data={this.state.dataFromUser}
                        showPrintScreen={this.showPrintScreen}
                        //api body data
                        main_SelectedAd={this.main_Ahead}
                        currentAhead={this.state.currentAhead}
                        test={this.state.dataFromUser}
                      />
                    </View>
                  )}
                </View>
                <View style={main.gap}></View>
              </View>
              {this.state.showSearchPrompt && (
                <Search
                  cancelSearch={this.cancelSearch}
                  search={(e) => this.search(e)}
                />
              )}

              <View>
                <View style={global.row}>
                  <View
                    style={[
                      {
                        //this is where the specific phone heights go
                        height:
                          Platform.OS == "android"
                            ? this.state.height -
                              this.state.headerHeight -
                              this.state.footerHeight -
                              44
                            : parseInt(Platform.Version, 10) >= 9 &&
                              //the 811 height is specific for iphone x/xr
                              Dimensions.get("window").height > 811
                            ? this.state.height -
                              this.state.headerHeight -
                              this.state.footerHeight -
                              getStatusBarHeight() -
                              64
                            : this.state.height -
                              this.state.headerHeight -
                              this.state.footerHeight -
                              44,
                      },
                      global.width100,
                    ]}
                  >
                    {/* no signs check begin */}
                    <React.Fragment>
                      {/* {this.state.showMultiEdit === true && (
                        <Modal transparent={false} visible={true}>
                          <MultiEdit cancel={this.cancelMultiEdit} />
                        </Modal>
                      )} */}
                      {this.state.showprintBatchScreen === true ? (
                        <View>
                          <PrintBatch
                            // {...this._panResponder.panHandlers}
                            reloadSigns={this.navbar_SignBatch}
                            reloadTags={this.navbar_TagBatch}
                            data={this.state.printBatchData}
                            levelUserInfoId={this.state.levelUserInfoId}
                            levelID={this.state.levelId}
                            currentSignTypeID={this.state.currentSignTypeID}
                            isSignBatchLoading={(e) =>
                              this.setState({ isSignBatchLoading: e })
                            }
                            isLoading={(e) => this.setState({ isLoading: e })}
                          />
                        </View>
                      ) : this.state.showOrderStockScreen === true ? (
                        <View>
                          <OrderStock
                            LevelUserShellStockMessage={
                              this.state.LevelUserShellStockMessage
                            }
                            MaximumOrderStockQuantity={
                              this.state.MaximumOrderStockQuantity
                            }
                            levelId={this.state.levelId}
                            stockSignTypeId={this.state.currentSignTypeID}
                            ahead={this.state.currentAhead}
                            selectStock={this.selectStock}
                            selected={this.state.orderStockSelected}
                            currentSignTypeID={this.state.currentSignTypeID}
                            isLoading={(e) => this.setState({ isLoading: e })}
                            isLoadingSpinnerActive={this.state.isLoading}
                            notify={this.notify}
                          />
                        </View>
                      ) : (
                        this.state.arrGrid.length < 1 &&
                        this.state.showBatchEditScreenInitialScreen ===
                          false && (
                          <ScrollView
                            scrollEnabled={false}
                            onLayout={(event) => {
                              this.setState({ isLoading: false });
                            }}
                          >
                            <Text style={[main.noSigns, main.marginTop45]}>
                              No Signs
                            </Text>
                          </ScrollView>
                        )
                      )}
                    </React.Fragment>

                    {/* no signs check end */}
                    <View
                      style={{
                        height: !this.state.invisibleHome
                          ? this.state.arrGrid.length < 1
                            ? 0
                            : "100%"
                          : 0,
                        width: this.state.arrGrid.length < 1 ? 0 : "100%",
                      }}
                    >
                      {this.state.loadHome === true && (
                        <Home
                          getSearchForUPC={this.getSearchForUPC}
                          audit={this.audit}
                          auditMode={this.state.auditMode}
                          backToHome={this.backToHome}
                          checkDate={this.checkDate}
                          LevelUserInfoBuildBatch={
                            this.state.LevelUserInfoBuildBatch
                          }
                          nonEditable={this.state.nonEditable}
                          LevelUserStoreMaxQuantityPerStore={
                            this.state.LevelUserStoreMaxQuantityPerStore
                          }
                          LevelUserMaxQuantityPerStore={
                            this.state.LevelUserMaxQuantityPerStore
                          }
                          showMultiEdit={this.state.showMultiEdit}
                          keepItems={this.keepItems}
                          keepItemArray={this.state.keepItemArray}
                          storedSigns={array(this.state.currentSignTypeID)}
                          showScannedGrid={(e) => {
                            this.setState({ showScannedGrid: e });
                          }}
                          showScannedItems={this.showScannedItems}
                          hideFilterGlitch={
                            this.state.hideFilterGlitch
                              ? true
                              : this.state.printBatchData.length < 1 &&
                                this.state.showBatchEditScreen === true
                              ? true
                              : false
                          }
                          hideBarCodeScanner={false}
                          getBatchData={this.getBatchData}
                          data={this.state.printBatchData}
                          batchEdit={this.state.showBatchEditScreen}
                          batchTypeID={this.state.batchTypeID}
                          notify={this.notify}
                          promoLevelStamps={this.state.promoLevelStamps}
                          main_Data={this.state.arrGrid}
                          main_Trigger={this.state.trigger}
                          main_EnableMultipleSelectFromGrid={
                            this.state.enableMultipleSelectFromGrid
                          }
                          main_EnableMultipleSelectFromGridFunc={
                            this.homeHeader_EnableMultipleSelectFromGrid
                          }
                          getCall={this.getCall}
                          ref="refsHomeGrid"
                          showPrintScreen={this.state.showPrintScreen}
                          showprintBatchScreen={this.state.showprintBatchScreen}
                          {...this.props}
                          headeroneFieldLabel={this.state.headeroneFieldLabel}
                          headertwoFieldLabel={this.state.headertwoFieldLabel}
                          headerthreeFieldLabel={
                            this.state.headerthreeFieldLabel
                          }
                          hideFilterTextInput={this.state.hideFilterTextInput}
                          hideFilter={
                            this.state.hideFilter === true
                              ? true
                              : this.state.arrGrid.length < 1
                              ? true
                              : false
                          }
                          disabled={this.state.isLoadingrn}
                          isLoading={(e) => this.setState({ isLoading: e })}
                          main_EnableDeleteSelected={this.enableDeleteSelected}
                          levelUserInfoId={this.state.levelUserInfoId}
                          levelId={this.state.data.data.Model.LevelID}
                          currentSignTypeID={this.state.currentSignTypeID}
                          refreshBatchEdit={this.refreshBatchEdit}
                          setSearched={this.setSearched}
                          isSearchedOriginally={this.state.isSearchedOriginally}
                          // level={this.state.level}
                          level={this.state.level}
                          surName={this.state.surname}
                        />
                      )}
                    </View>
                    {/* home end */}
                  </View>
                </View>
              </View>
              {/* footer begin */}
              <View
                onLayout={(event) => {
                  this.footerHeight(event.nativeEvent.layout.height);
                }}
                style={global.row}
              >
                {!this.state.showprintBatchScreen &&
                  !this.state.showBatchEditScreen &&
                  !this.state.showOrderStockScreen &&
                  this.state.currentSignTypeID != 8 &&
                  this.state.auditMode === false && (
                    <View style={main.footer}>
                      <DepartmentsScrollView
                        showMultiEdit={this.state.showMultiEdit}
                        height={this.footerHeight}
                        main_Data={this.state.departments}
                        departmentSelectNoCall={this.departmentSelectNoCall}
                        //api body data
                        main_Selected={this.departmentsScrollView_Department}
                        disabled={this.state.isLoadingrn}
                        ref="depRef"
                        //
                      />
                    </View>
                  )}
              </View>
              {/* footer end */}
            </React.Fragment>
          ) : (
            // if not logged in begin
            <View>
              <Text>you are not logged in</Text>
              <Button onPress={this.backToLogin} />
            </View>
            //if not logged in end
          )}
        </View>
      </View>
    );
  }
}

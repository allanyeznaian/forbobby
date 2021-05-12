// exported to Main.js
// props:
//main_Data: where the navbar items come from
//main_DefaultSignType: the default signType
//main_SignStock: functional prop that tells the home screen to show the order stock component
//                with the corresponding data
//main_TagStock: "" "" ""
//main_Logout: 'logs out' of the app and takes you to login component
//main_SignBatch: shows the print batch component
//main_TagBatch: """"""
//main_IsMenuShowing(bool): if bool === true menu will show, if false, menu will hide

import React, { Component } from "react";
import { Text, TouchableOpacity, View, Platform } from "react-native";
import Modal from "react-native-modal";
import { setCalled } from "../../App";
import { navbar, global } from "../../Styles/Styles";
import Icon from "../reusable/Icon";

export default class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMenu: false,
      printBatchIsExpanded: false,
      orderStockIsExpanded: false,
      navbarItems: [],
      selected: "",
      backgroundColorSelected: "#3796ff",
    };
  }
  componentDidMount = () => {
    const arr = [...this.props.main_Data];
    arr.sort((a, b) =>
      a.SignTypeID > b.SignTypeID ? 1 : b.SignTypeID > a.SignTypeID ? -1 : 0
    );
    // arr.splice(1, 0, { Sign: "Audit", SignTypeID: "Audit" });
    arr.splice(1, 0, { Sign: "Batch Edit", SignTypeID: "Batch Edit" });
    // if(this.props.LevelUserDefaultSignTypeID === 4){

    // }
    if (this.props.LevelUserInfoPrintBatch === true) {
      arr.push({ Sign: "Print Batch", SignTypeID: "Print Batch" });
      arr.push({ Sign: "Tag Batch", SignTypeID: "Tag Batch" });
      arr.push({ Sign: "Sign Batch", SignTypeID: "Sign Batch" });
    }

    if (this.props.LevelUserShell === true) {
      arr.push(
        { Sign: "Order Stock", SignTypeID: "Order Stock" },
        { Sign: "Tag Stock", SignTypeID: "Tag Stock" },
        { Sign: "Sign Stock", SignTypeID: "Sign Stock" }
      );
    }
    if (this.props.LevelUserInfoMultiEdit === true) {
      arr.push({ Sign: "Multi Edit", SignTypeID: "Multi Edit" });
    }
    arr.push({ Sign: "Logout", SignTypeID: "Logout" });

    for (let i = 0; i < arr.length; i++) {
      if (arr[i].Sign === "Tag") {
        arr.splice(i, 1);
      }
    }
    for (let i = 0; i < arr.length; i++) {
      if (this.props.main_DefaultSignType == arr[i].SignTypeID) {
        this.select(arr[i]);
      }
      if (arr[i].Sign === "Incomplete") {
        arr.splice(i, 1);
      }
      if (arr[i].Sign === "Custom Library") {
        arr.splice(i, 1);
      }
      if (this.props.LevelUserInfoMultiEdit != true) {
        if (arr[i].Sign === "Multi Edit") {
          arr.splice(i, 1);
        }
      }
    }
    this.setState({ navbarItems: arr });
  };
  create = () => {
    this.props.toggleCreateScreen();
  };
  openDrawer = () => {
    if (this.state.showMenu === true) {
      this.setState({ showMenu: false });
      this.props.main_IsMenuShowing(false);
    } else {
      this.setState({ showMenu: true });
      this.props.main_IsMenuShowing(true);
    }
  };

  select = (e) => {
    setCalled(false);
    this.setState(
      { selected: e.Sign != "Audit" ? e.Sign : this.state.selected },
      () => {
        if (e.Sign === "Tag Batch" || e.Sign === "Sign Batch") {
          this.setState({ printBatchIsExpanded: true });
        } else if (e.Sign === "Tag Stock" || e.Sign === "Sign Stock") {
          this.setState({ orderStockIsExpanded: true });
        } else {
          this.setState({
            orderStockIsExpanded: false,
            printBatchIsExpanded: false,
          });
        }

        if (e.Sign !== "Print Batch" && e.Sign !== "Order Stock") {
          if (e.Sign == "Promo" && e.SignTypeID == 1) {
            this.props.main_promo();
          } else {
            this.props.main_Selected(
              e.Sign === "Logout" ? this.props.main_Logout() : e.SignTypeID,
              e.Sign === "Tag Batch"
                ? this.setState(this.props.main_TagBatch("tagbatch", false))
                : e.SignTypeID,
              e.Sign === "Sign Batch"
                ? this.setState(this.props.main_SignBatch("signbatch", false))
                : e.SignTypeID,
              e.Sign === "Batch Edit"
                ? this.setState(this.props.main_TagBatch("batchedit"))
                : e.SignTypeID,
              e.Sign === "Tag Stock"
                ? this.props.main_TagStock()
                : e.SignTypeID,
              e.Sign === "Sign Stock"
                ? this.props.main_SignStock()
                : e.SignTypeID,
              e.Sign === "Multi Edit"
                ? this.props.main_MultiEdit()
                : e.SignTypeID
            );
          }

          if (this.state.showMenu === true) {
            this.setState({ showMenu: false });
          }
        }
        if (e.Sign === "Print Batch") {
          this.setState({
            printBatchIsExpanded: !this.state.printBatchIsExpanded,
            orderStockIsExpanded: false,
          });
        }
        if (e.Sign === "Order Stock") {
          this.setState({
            orderStockIsExpanded: !this.state.orderStockIsExpanded,
            printBatchIsExpanded: false,
          });
        }
      }
    );
  };
  render() {
    return (
      <View>
        <Modal
          isVisible={this.state.showMenu}
          animationIn="slideInLeft"
          animationOut="slideOutLeft"
          onBackdropPress={() => this.setState({ showMenu: false })}
          hideModalContentWhileAnimating={true}
          onSwipeComplete={() => this.setState({ showMenu: false })}
          swipeDirection="left"
        >
          <View style={[navbar.container]}>
            {/* ================================================================ */}
            {/* <TouchableOpacity
              onPress={() => this.create()}
              style={[
                styles.buttonStyle,
                {
                  backgroundColor:
                    this.state.selected === "Create"
                      ? this.state.backgroundColorSelected
                      : "white"
                }
              ]}
            >
              <Text
                style={[
                  navbar.textStyle,
                  {
                    color: this.state.selected === "Create" ? "white" : "black"
                  }
                ]}
              >
                Create
              </Text>
            </TouchableOpacity> */}
            {/* =================================================================== */}
            {this.state.navbarItems.map((e, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => this.select(e)}
                  style={
                    e.Sign === "Tag Batch"
                      ? this.state.printBatchIsExpanded === false
                        ? navbar.height0
                        : [
                            navbar.buttonStyle,
                            global.zIndex,
                            {
                              backgroundColor:
                                this.state.selected === "Tag Batch"
                                  ? this.state.backgroundColorSelected
                                  : e.Sign === "Tag Batch"
                                  ? "#eff3fb"
                                  : e.Sign === "Sign Batch"
                                  ? "#eff3fb"
                                  : "white",
                            },
                          ]
                      : e.Sign === "Sign Batch"
                      ? this.state.printBatchIsExpanded === false
                        ? [{ height: 0 }]
                        : [
                            navbar.buttonStyle,
                            global.zIndex,
                            {
                              backgroundColor:
                                this.state.selected === e.Sign
                                  ? this.state.backgroundColorSelected
                                  : e.Sign === "Tag Batch"
                                  ? "#eff3fb"
                                  : e.Sign === "Sign Batch"
                                  ? "#eff3fb"
                                  : "white",
                            },
                          ]
                      : e.Sign === "Tag Stock"
                      ? this.state.orderStockIsExpanded === false
                        ? [
                            {
                              height: 0,
                            },
                          ]
                        : [
                            navbar.buttonStyle,
                            global.zIndex,
                            {
                              backgroundColor:
                                this.state.selected === e.Sign
                                  ? this.state.backgroundColorSelected
                                  : e.Sign === "Tag Stock"
                                  ? "#eff3fb"
                                  : e.Sign === "Sign Stock"
                                  ? "#eff3fb"
                                  : "white",
                            },
                          ]
                      : e.Sign === "Sign Stock"
                      ? this.state.orderStockIsExpanded === false
                        ? [{ height: 0 }]
                        : [
                            navbar.buttonStyle,
                            {
                              zIndex: 999999999999,
                              backgroundColor:
                                this.state.selected === e.Sign
                                  ? this.state.backgroundColorSelected
                                  : e.Sign === "Tag Stock"
                                  ? "#eff3fb"
                                  : e.Sign === "Sign Stock"
                                  ? "#eff3fb"
                                  : "white",
                            },
                          ]
                      : e.Sign === "Order Stock"
                      ? [
                          {
                            backgroundColor:
                              this.state.orderStockIsExpanded === true
                                ? "grey"
                                : "lightgrey",
                          },
                          navbar.buttonStyle,
                        ]
                      : e.Sign === "Print Batch"
                      ? [
                          {
                            backgroundColor:
                              this.state.printBatchIsExpanded === true
                                ? "grey"
                                : "lightgrey",
                          },
                          navbar.buttonStyle,
                        ]
                      : [
                          navbar.buttonStyle,
                          {
                            backgroundColor:
                              this.state.selected === e.Sign
                                ? this.state.backgroundColorSelected
                                : "white",
                          },
                        ]
                  }
                >
                  <View style={global.row}>
                    <Text
                      style={[
                        navbar.textStyle,
                        {
                          color:
                            this.state.selected === e.Sign ? "white" : "black",
                        },
                      ]}
                    >
                      {e.Sign}
                    </Text>
                    {e.Sign === "Print Batch" ? (
                      <Icon
                        functionality="icon"
                        source={require("../../assets/vectoricons/dropdown.png")}
                        size={22}
                      />
                    ) : (
                      e.Sign === "Order Stock" && (
                        <Icon
                          functionality="icon"
                          source={require("../../assets/vectoricons/dropdown.png")}
                          size={22}
                        />
                      )
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </Modal>
      </View>
    );
  }
}

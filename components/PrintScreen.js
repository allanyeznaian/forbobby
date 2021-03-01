//props need to have an array of strings fed into it to populate the button scroller
//see <DepartmentsScrollView /> in the Home page for an example
//props:
//uncheckAll(): this will call the function to uncheck everything
//delete(e, bool): this will delete one of the items selected to be printed
//gridData_Cancel(false, text): cancels displaying the PrintScreen.js component, text is for the topbarnotification text
//headeroneFieldLabel, headertwoFieldLabel, headerthreeFieldLabel
//ahead, levelId, .levelUserInfoId, currentSignTypeID,

import React, { Component } from "react";
import {
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  View,
  Alert,
} from "react-native";
import CustomTextInput from "./reusable/CustomTextInput";
import TopBarNotification from "./reusable/TopBarNotification";
import { data_post_publish_print_batches } from "../scripts/API";
import LoadingSpinner from "./reusable/LoadingSpinner";
import PDFReader from "rn-pdf-reader-js";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import { printScreen, global, printSignBatch } from "../Styles/Styles";
import Icon from "./reusable/Icon";
import { array } from "../App";
import Checkbox from "./reusable/Checkbox";

export default class PrintScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      backgroundColor: "#ececec",
      data: [],
      batchName: "",
      date: "",
      levelId: "",
      isLoading: false,
      showNewModalForLinks: false,
      showPDF: false,
      links: [],
      tee: [],
      notify: false,
      supressMarginNotation: false,
      supressDepartmentSlip: false,
      supressStoreSlip: false,
      comingleStocks: false,
      selectedItems: true,
      savedItems: false,
      signType: "",
      storeArr: [],
      activateEdit: false,
    };
  }

  componentDidMount = () => {
    setTimeout(() => {
      const arr = [...this.props.data];
      const arr2 = array(this.props.currentSignTypeID);
      this.setState({
        data: arr,
        storeArr: arr2,
        selectedItems: arr.length > 0 ? true : false,
        savedItems: arr.length < 1 && true,
      });
    }, 200);
  };

  //this is wired to the x button of each SAVED item on this list
  deleteFromStore = (e) => {
    this.props.keepItems(e, "REMOVE_ITEM", this.props.currentSignTypeID);
    const arr2 = array(this.props.currentSignTypeID);
    this.setState({ storeArr: arr2 });
    if (this.state.data.length === 0 && this.state.storeArr.length === 0) {
      this.cancel();
      this.props.uncheckAll();
    } else if (arr2.length < 1) {
      this.setState({ savedItems: false, selectedItems: true });
    }
  };

  //this is wired to the X button of each item on this list
  delete = (e, bool) => {
    this.props.delete(e, bool);
    const arr = [...this.state.data];
    const arr2 = array(this.props.currentSignTypeID);
    this.setState({ storeArr: arr2 });
    var index = arr.findIndex(function (o) {
      return o.levelSignId === e.levelSignId;
    });
    if (index !== -1) arr.splice(index, 1);
    this.setState({ data: arr });
    if (arr.length === 0) {
      this.setState({ selectedItems: false, savedItems: true });
    }
    if (arr.length === 0 && arr2.length === 0) {
      this.props.uncheckAll();
      this.cancel();
    }
  };
  batchName = (e) => {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    var hours = today.getHours();
    var minutes = today.getMinutes();
    var seconds = today.getSeconds();
    var ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    var strTime = hours + ":" + minutes + ":" + seconds + " " + ampm;
    today = mm + "/" + dd + "/" + yyyy + " " + strTime;
    this.setState({
      batchName: e,
      date: today,
    });
  };
  clickHandler = (e) => {
    this.setState({ selected: e });
  };
  cancel = (bool, text) => {
    this.props.gridData_Cancel(false, text);
  };
  cancelPDF = () => {
    this.setState({ url: "", showPDF: false, isLoading: false });
  };
  saveItems = (e) => {
    this.props.keepItems([e], "ADD_ITEM", this.props.currentSignTypeID);
    const arr2 = array(this.props.currentSignTypeID);
    this.setState({ storeArr: arr2 });
  };
  publishPrint = (e, a) => {
    this.setState({ isLoading: true, notify: false });
    let arr = [];
    if (a != "stored") {
      arr = [...this.state.data];
    } else if (a === "stored") {
      arr = [...this.state.storeArr];
    }
    const obj = {
      buttonCall: e,
      LevelID: "",
      batchName: this.state.batchName + " " + this.state.date,
      levelSignsToPrint: null,
      batchTypeIDs: 0,
      LevelUserInfoID: this.props.levelUserInfoId,
      SignTypeID: this.props.currentSignTypeID,
      SupressDepartmentSlip: this.state.supressDepartmentSlip,
      SupressMarginNotation: this.state.supressMarginNotation,
      SupressStoreSlip: this.state.supressStoreSlip,
      ComingleStocks: this.state.comingleStocks,
    };
    const signsArr = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[0] === "all") {
        arr.splice(0, 1);
      }
      obj.LevelID = this.props.levelId;
      signsArr.push(arr[i].levelSignId);
    }
    obj.levelSignsToPrint = signsArr.join(",");

    const body = obj;
    data_post_publish_print_batches(body).then((resp) => {
      if (resp.Handling === "success" && obj.buttonCall === "Print") {
        const arr = resp.Description;
        const array = arr.split(",");
        const z = [];
        for (let i = 0; i < array.length; i++) {
          z.push({ link: array[i] });
        }
        z.splice(z.length - 1, 1);
        setTimeout(() => {
          this.setState({ tee: z });
        }, 100);
        this.setState({
          isLoading: false,
          links: resp.Description,
          showNewModalForLinks: true,
        });
      }
      if (resp.Handling === "success" && obj.buttonCall === "Publish") {
        this.setState({ isLoading: false });
        if (this.props.batchEdit === true) {
          this.props.refreshBatchEdit();
          this.props.uncheckAll();
        }

        this.cancel(false, "Published");
      } else if (resp.Handling === "failed") {
        this.setState({ notify: true, isLoading: false });
      }
    });
  };
  openPDF = (url) => {
    this.setState({
      url: url.link,
      isLoading: true,
      notify: false,
    });

    this.downloadFile(url.link);
  };
  downloadFile(url) {
    let fileUri = FileSystem.documentDirectory + ".pdf";
    FileSystem.downloadAsync(url, fileUri)
      .then(({ uri }) => {
        this.saveFile(url);
      })
      .catch((error) => {
        this.setState({ isLoading: false, notify: true });
      });
  }
  linkFunc = (url) => {
    const reg = /[^\/]+$/;
    const reg2 = /^([^_]*_){2}/;
    const ma = url.match(reg)[0];
    const match = ma.match(reg2)[0];
    const link = match.substring(0, match.length - 1);
    return link;
  };
  saveFile = async (fileUri) => {
    FileSystem.downloadAsync(fileUri, FileSystem.documentDirectory + ".pdf")
      .then(({ uri }) => {
        this.setState({ fileUri: uri }, () => {
          this.setState({ showPDF: true });
        });
      })
      .catch((error) => {
        this.setState({ notify: true, isLoading: false });
      });
  };
  showNewModalForLinks = () => {
    return <Modal animationType="slide" visible={true}></Modal>;
  };
  sendToPrinter = async () => {
    const fileToBePrinted = this.state.fileUri;
    Print.printAsync({
      uri: fileToBePrinted,
    })
      .then(() => {
        this.cancelPDF();
      })
      .catch((error) => {});
  };
  handleCheckbox = (e) => {
    if (e === "savedItems") {
      this.setState({ savedItems: true, selectedItems: false });
    } else if (e === "selectedItems") {
      this.setState({ savedItems: false, selectedItems: true });
    }
  };
  activateEdit = (data) => {
    this.props.triggerMultiEdit();
    this.setState({ activateEdit: true });
    this.props.activateEditFromPrint(data);
    //this.cancel()
  };
  deactivateEdit = () => {
    this.setState({ activateEdit: false });
  };

  render() {
    if (this.state.showPDF === true) {
      return (
        <Modal animationType="slide" visible={true}>
          <PDFReader
            source={{
              uri: this.state.fileUri,
            }}
          />
          <View style={[global.row, printScreen.buttonWrapper]}>
            <TouchableOpacity
              style={[global.tomato, global.buttonPrint]}
              onPress={() => this.cancelPDF()}
            >
              <Text style={global.textWhiteCenter}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[global.pangeaBlue, global.buttonPrint]}
              onPress={() => this.sendToPrinter()}
            >
              <Text style={global.textWhiteCenter}>Print PDF</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      );
    }
    return (
      <React.Fragment>
        <View style={{ height: 400 }}>
          <Modal animationType="slide" visible={true}>
            {this.state.showPDF === false &&
              this.state.showNewModalForLinks === false &&
              this.props.multiEditActivate === false &&
              this.props.auditMode === false && (
                <View
                  style={[
                    printScreen.headerCheckboxWrapper,
                    printScreen.topButtonMargin,
                  ]}
                >
                  <Checkbox
                    selected={this.state.selectedItems}
                    onPress={() => {
                      this.handleCheckbox("selectedItems");
                    }}
                    disabled={this.props.data.length > 0 ? false : true}
                  />
                  <Text
                    style={[
                      global.font16,
                      {
                        fontWeight:
                          this.state.selectedItems === true ? "bold" : "normal",
                        color:
                          this.props.data.length > 0 ? "black" : "lightgrey",
                      },
                    ]}
                  >
                    Selected items
                  </Text>
                  <Text>{"   "}</Text>
                  <Checkbox
                    selected={this.state.savedItems}
                    onPress={() => {
                      this.handleCheckbox("savedItems");
                    }}
                    disabled={this.state.storeArr.length > 0 ? false : true}
                  />
                  <Text
                    style={[
                      global.font16,
                      {
                        fontWeight:
                          this.state.savedItems === true ? "bold" : "normal",
                        color:
                          this.state.storeArr.length > 0
                            ? "black"
                            : "lightgrey",
                      },
                    ]}
                  >
                    Manage saved items
                  </Text>
                </View>
              )}

            {this.state.notify === true && (
              <TopBarNotification text="network error" />
            )}
            {this.state.showNewModalForLinks === true ? (
              <View style={[global.modalWrapper]}>
                {this.state.tee.map((e, index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      style={
                        index % 2 == 0
                          ? printSignBatch.pdfLinkWrapper
                          : printSignBatch.pdfLinkWrapperAlt
                      }
                      onPress={() => this.openPDF(e)}
                    >
                      <Text style={printScreen.links}>
                        {this.linkFunc(e.link)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : (
              <View style={global.modalWrapper}>
                {this.state.isLoading === true && (
                  <View style={global.loadingSpinner}>
                    <LoadingSpinner />
                  </View>
                )}
                {this.props.multiEditActivate === false &&
                  this.props.LevelUserInfoBuildBatch === true && (
                    <React.Fragment>
                      <Text
                        style={[
                          global.marginAuto,
                          {
                            color:
                              this.state.batchName.length < 2
                                ? "tomato"
                                : "black",
                          },
                        ]}
                      >
                        Batch Name
                        {this.state.batchName.length < 2
                          ? " Required For Publishing!"
                          : ":"}
                      </Text>
                      <CustomTextInput
                        validate={true}
                        value={this.state.batchName}
                        onChangeText={(e) => this.batchName(e)}
                      />
                    </React.Fragment>
                  )}

                <View style={printScreen.margin} />

                <View style={[printScreen.background, global.row]}>
                  {/* <View> */}
                  {this.props.multiEditActivate === false &&
                    this.state.selectedItems === true &&
                    this.props.auditMode === false && (
                      <Text
                        style={[
                          // printScreen.bold,
                          // printScreen.col2,
                          { width: "6%" },
                        ]}
                      ></Text>
                    )}
                  <Text
                    style={[
                      printScreen.bold,
                      printScreen.col2,
                      {
                        width:
                          this.state.selectedItems === false
                            ? "31%"
                            : this.props.auditMode === true
                            ? "31%"
                            : !this.props.multiEditActivate
                            ? "29%"
                            : "31%",
                      },
                    ]}
                  >
                    {this.props.headeroneFieldLabel}
                  </Text>
                  {/* </View> */}
                  {/* <View> */}
                  <Text
                    style={[
                      printScreen.bold,
                      printScreen.col2,
                      {
                        width:
                          this.state.selectedItems === false
                            ? "31%"
                            : this.props.auditMode === true
                            ? "31%"
                            : !this.props.multiEditActivate
                            ? "29%"
                            : "31%",
                      },
                    ]}
                  >
                    {this.props.headertwoFieldLabel}
                  </Text>

                  {/* </View> */}
                  {/* <View> */}
                  <Text
                    style={[
                      printScreen.bold,
                      printScreen.col2,
                      {
                        width:
                          this.state.selectedItems === false
                            ? "31%"
                            : this.props.auditMode === true
                            ? "31%"
                            : !this.props.multiEditActivate
                            ? "29%"
                            : "31%",
                      },
                    ]}
                  >
                    {this.props.headerthreeFieldLabel}
                  </Text>
                  <Text style={printScreen.closeBackground} />
                  {/* </View> */}
                </View>
                <ScrollView style={printScreen.scrollViewHeight}>
                  {this.state.selectedItems === true &&
                    this.props.data.map((e, index) => {
                      return (
                        <View key={index} style={global.row}>
                          {e.ahead == this.props.ahead ? (
                            <React.Fragment>
                              {this.props.multiEditActivate === false &&
                                this.props.auditMode === false && (
                                  <TouchableOpacity
                                    style={[
                                      {
                                        backgroundColor:
                                          this.state.storeArr
                                            .map((a) => {
                                              return a.levelSignId;
                                            })
                                            .indexOf(e.levelSignId) > -1
                                            ? "#d9ad34"
                                            : "#3796ff",
                                      },
                                      printScreen.add,
                                    ]}
                                    disabled={
                                      this.state.storeArr
                                        .map((a) => {
                                          return a.levelSignId;
                                        })
                                        .indexOf(e.levelSignId) > -1
                                        ? true
                                        : false
                                    }
                                    onPress={() => {
                                      this.saveItems(e);
                                    }}
                                  >
                                    <Text
                                      style={[
                                        printScreen.font20,
                                        {
                                          color:
                                            this.state.storeArr
                                              .map((a) => {
                                                return a.levelSignId;
                                              })
                                              .indexOf(e.levelSignId) > -1
                                              ? "grey"
                                              : "white",
                                        },
                                      ]}
                                    >
                                      +
                                    </Text>
                                  </TouchableOpacity>
                                )}
                              {/* {this.props.multiEditActivate === false ?
                            
                          } */}
                              <TouchableOpacity
                                onPress={() => this.activateEdit(e)}
                                disabled={!this.props.multiEditActivate}
                                style={[
                                  printScreen.col2,
                                  {
                                    width:
                                      !this.props.multiEditActivate &&
                                      this.props.auditMode === false
                                        ? "29%"
                                        : "31%",
                                  },
                                ]}
                              >
                                <Text style={global.textAlignCenter}>
                                  {" "}
                                  {e.headerone}{" "}
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => this.activateEdit(e)}
                                disabled={!this.props.multiEditActivate}
                                style={[
                                  printScreen.col2,
                                  {
                                    width:
                                      !this.props.multiEditActivate &&
                                      this.props.auditMode === false
                                        ? "29%"
                                        : "31%",
                                  },
                                ]}
                              >
                                <Text style={global.textAlignCenter}>
                                  {" "}
                                  {e.headertwo}{" "}
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => this.activateEdit(e)}
                                disabled={!this.props.multiEditActivate}
                                style={[
                                  printScreen.col2,
                                  {
                                    width:
                                      !this.props.multiEditActivate &&
                                      this.props.auditMode === false
                                        ? "29%"
                                        : "31%",
                                  },
                                ]}
                              >
                                <Text style={global.textAlignCenter}>
                                  {" "}
                                  {e.headerthree}{" "}
                                </Text>
                              </TouchableOpacity>
                              <View style={printScreen.closeBackground}>
                                <View style={global.marginAutoVertical}>
                                  <Icon
                                    backgroundColor="white"
                                    size={20}
                                    disabled={this.state.isLoading}
                                    functionality="button"
                                    onPress={() => this.delete(e, true)}
                                    style={printScreen.closebuttonWidth}
                                    source={require("../assets/vectoricons/closered.png")}
                                  />
                                </View>
                              </View>
                            </React.Fragment>
                          ) : (
                            <View />
                          )}
                        </View>
                      );
                    })}
                  {this.state.savedItems === true && (
                    <View style={[global.pangeaBlue, global.row]}>
                      <Text
                        style={[printScreen.savedItemsText, global.marginAuto]}
                      >
                        SAVED ITEMS
                      </Text>
                    </View>
                  )}

                  {this.state.storeArr.length > 0 &&
                    this.state.savedItems === true &&
                    this.state.storeArr.map((e, index) => {
                      return (
                        <React.Fragment>
                          <View
                            key={index}
                            style={[global.row, global.lightGrey]}
                          >
                            <React.Fragment>
                              <View style={printScreen.col}>
                                <Text style={global.textAlignCenter}>
                                  {" "}
                                  {e.headerone}{" "}
                                </Text>
                              </View>
                              <View style={printScreen.col}>
                                <Text style={global.textAlignCenter}>
                                  {" "}
                                  {e.headertwo}{" "}
                                </Text>
                              </View>
                              <View style={printScreen.col}>
                                <Text style={global.textAlignCenter}>
                                  {" "}
                                  {e.headerthree}{" "}
                                </Text>
                              </View>
                              <View style={printScreen.closeBackground}>
                                <View style={global.marginAutoVertical}>
                                  <Icon
                                    backgroundColor="white"
                                    size={20}
                                    disabled={this.state.isLoading}
                                    functionality="button"
                                    onPress={() =>
                                      this.deleteFromStore(e, true)
                                    }
                                    style={printScreen.closebuttonWidth}
                                    source={require("../assets/vectoricons/closered.png")}
                                  />
                                </View>
                              </View>
                            </React.Fragment>
                          </View>
                        </React.Fragment>
                      );
                    })}
                </ScrollView>
              </View>
            )}

            <View style={global.buttonWrapper}>
              {this.state.showNewModalForLinks === false &&
                this.props.multiEditActivate === false && (
                  <TouchableOpacity
                    style={[
                      printScreen.buttonPrint,
                      {
                        backgroundColor:
                          this.state.isLoading === true ? "grey" : "blue",
                      },
                    ]}
                    onPress={() =>
                      Alert.alert(
                        "",

                        "What would you like to print?", // <- this part is optional, you can pass an empty string
                        [
                          {
                            text: "Cancel",
                            onPress: null,
                          },
                          this.props.data.length > 0 && {
                            text: "print",
                            onPress: () => this.publishPrint("Print"),
                          },
                          this.props.multiEditActivate === false &&
                            this.props.auditMode === false &&
                            this.state.storeArr.length > 0 && {
                              text: "Print saved items",
                              onPress: () =>
                                this.publishPrint("Print", "stored"),
                            },
                        ],
                        { cancelable: true }
                      )
                    }
                    disabled={this.state.isLoading}
                  >
                    <Text style={global.textWhiteCenter}>Print</Text>
                  </TouchableOpacity>
                )}
              {this.state.showNewModalForLinks === false &&
                this.props.multiEditActivate === false &&
                this.props.LevelUserInfoBuildBatch === true && (
                  <TouchableOpacity
                    style={[
                      {
                        backgroundColor:
                          this.state.batchName.length < 2 ? "grey" : "blue",
                      },
                      printScreen.buttonPrint,
                    ]}
                    onPress={() =>
                      Alert.alert(
                        "",

                        "What would you like to publish?", // <- this part is optional, you can pass an empty string
                        [
                          {
                            text: "Cancel",
                            onPress: null,
                          },
                          this.props.data.length > 0 && {
                            text: "publish",
                            onPress: () => this.publishPrint("Publish"),
                          },
                          this.state.storeArr.length > 0 &&
                            this.props.multiEditActivate === false &&
                            this.props.auditMode === false && {
                              text: "Publish saved items",
                              onPress: () =>
                                this.publishPrint("Publish", "stored"),
                            },
                        ],
                        { cancelable: true }
                      )
                    }
                    disabled={
                      this.state.batchName.length < 2
                        ? true
                        : this.state.isLoading
                    }
                  >
                    <Text style={global.textWhiteCenter}>Publish</Text>
                  </TouchableOpacity>
                )}
              <TouchableOpacity
                style={[global.tomato, printScreen.buttonPrint]}
                onPress={() => this.cancel()}
              >
                <Text style={global.textWhiteCenter}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      </React.Fragment>
    );
  }
}

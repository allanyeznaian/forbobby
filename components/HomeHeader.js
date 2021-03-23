//props:
//main_Data: array of objects, comes from loaduserbucket response
//batchEdit
//toBeDeletedArray: this is an array of levelSignIds
//getCall("deletedMultiple", newArr): this calls the api to get the data once deleting is complete
//main_SelectedAd(num): this is for the ahead dropdown. this gives a number that represents the ahead
//getBatchData(e.BatchTypeId): this is for when batchedit is selected
//openDrawer(true); if true, the navbar will show
//showPrintScreen(): shows the PrintScreen.js component
//headerHeight(e): the height of the header, e represents the value of the height
//main_AheadInfoArray: this is the content of the ahead dropdown. array of objects
//main_AdFrom, main_AdTo: ahead dates
//hideDeletePrintButtons === false && (
//data: data from Main.js
//isDeleteEnabled: enables or disables delete button
//hideDeletePrintButtons: this tells you whether to hide the delete and print buttons

import React, { Component } from "react";
import {
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { setCalled } from "../App";
import CustomButton from "./reusable/CustomButton";
import Checkbox from "./reusable/Checkbox";
import ModalDropdown from "./reusable/react-native-modal-dropdown/index";
// import ModalDropdown from "./reusable/DropDown";
import { data_delete_signs } from "../scripts/API";
import PangeaImageWhite from "../assets/images/Pangea-Logo-WHITE.png";
import { homeHeader, global } from "../Styles/Styles";
import Icon from "./reusable/Icon";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSignType: 1,
      currentBatch: "",
      currentBatchName: "Select a batch",
      newUser: "",
      adFrom: "",
      adTo: "",
      selectedAd: "",
      data: "",
      batchEditAbove: false,
      isModalFromGridDataShowing: false,
      dataFromUser: this.props.main_Data,
      aheadInfoArray: [],
      currentBatch: this.props.data ? this.props.batchEdit : "",
    };
  }

  componentDidMount = () => {
    this.dropdown_GetByAd("Current Ad");
    // this.refs.dropdownref.select(i);
    if (this.props.batchEdit && !this.state.batchEditAbove) {
      this.props.hideFilter(true);
    }
    if (this.props.main_Data) {
      this.setState(
        { data: this.props.main_Data, dropdownArray: this.props.main_Data },
        () => {}
      );
    }
  };

  resetBatchHeader = () => {
    this.setState({
      batchEditAbove: false,
      currentBatchName: "Select a batch",
    });
  };
  onDeleteSelectedClicked = () => {
    setCalled(false);
    this.props.isLoading(true);
    const arr = this.props.toBeDeletedArray;
    const newArr = [];
    for (let i = 0; i < arr.length; i++) {
      newArr.push(arr[i].levelSignId);
      if (this.props.showScannedItems) {
        this.props.removeScannedItem(arr[i].levelSignId);
      }
    }
    this.deleteMultiple(newArr.join(","), newArr);
  };
  deleteMultiple = (e, newArr) => {
    setCalled(false);
    this.props.isLoading(true);
    this.setState({ showNotification: false });
    const body = {
      LevelSignID: e,
    };
    data_delete_signs(body).then((resp) => {
      if (resp.Handling === "success") {
        this.props.getCall("deletedMultiple", newArr);
        this.props.isLoading(false);
      }
    });
  };
  dropdown_GetByAd_noCall = (selectedAd) => {
    this.setState({ selectedAd: selectedAd });
  };
  dropdown_GetByAd = (selectedAd) => {
    if (
      selectedAd === +-2 ||
      selectedAd === +-1 ||
      selectedAd === +0 ||
      selectedAd === +1
    ) {
      setCalled(false);
      this.setState({ backToHomeTrigger: true });
    } else {
      this.setState({ backToHomeTrigger: false });
      setCalled(false);
      const num =
        selectedAd == "Current Ad"
          ? -1
          : selectedAd == "Prior Ad"
          ? -2
          : selectedAd == "Next Ad"
          ? 0
          : selectedAd == "Kit Prep"
          ? 1
          : "";
      this.props.main_SelectedAd(num);
    }
  };
  dropdownHandler = (e, aboveTrue) => {
    if (aboveTrue === "aboveTrue") {
      this.setState({ batchEditAbove: true });
    }

    this.setState({ currentBatch: e, currentBatchName: e.BatchTypeName });
    this.props.getBatchData(e.BatchTypeId);
  };
  openDrawer = () => {
    this.props.openDrawer(true);
  };
  print = (e) => {
    setCalled(false);
    this.props.showPrintScreen(e);
  };
  headerHeight = (e) => {
    this.props.headerHeight(e);
  };
  displayBatch = () => {};
  activateSearch = (signType) => {
    setCalled(false);
    this.props.activateSearch(signType);
  };
  checkboxHandler = (sign) => {
    setCalled(false);
    this.props.setSignType(sign === "Tags" ? 8 : 1);
    this.setState({ currentSignType: sign === "Tags" ? 8 : 1 });
  };
  multiEdit = () => {
    this.props.multiEditActivate();
  };
  placeHol = () => {
    this.setState({ backToHomeTrigger: true });
    this.props.backToHome("goBackAllTheWay");
  };
  render() {
    return (
      <React.Fragment>
        <View
          onLayout={(event) => {
            this.headerHeight(event.nativeEvent.layout.height);
          }}
          style={[global.container]}
        >
          <View style={homeHeader.logo}>
            <Image style={homeHeader.img} source={PangeaImageWhite} />
          </View>
          <View style={homeHeader.dropdownWrapper}>
            <View style={(homeHeader.dropdownSubWrapper, global.width100)}>
              <View style={[homeHeader.absolute]}></View>
            </View>
          </View>

          <View
            style={[global.row, global.subContainer, homeHeader.containerWidth]}
          >
            <View style={homeHeader.marg}>
              {this.props.auditMode != true && (
                <React.Fragment>
                  <TouchableOpacity
                    onPress={() => this.openDrawer()}
                    underlayColor="none"
                    style={homeHeader.menuButton}
                    disabled={this.props.isLoadingrn === true ? true : false}
                  >
                    <Icon
                      functionality="icon"
                      size={44}
                      source={require("../assets/vectoricons/menu.png")}
                    />
                  </TouchableOpacity>
                  <View style={[global.row, homeHeader.adToAndFrom]}>
                    <Text style={[global.bold, global.marginLeft15]}>
                      {!this.props.batchEdit === true &&
                      !this.props.printBatch === true &&
                      this.props.currentSignType != 8 &&
                      this.props.auditMode === false
                        ? "Ad From"
                        : ""}
                    </Text>
                    <Text style={[global.bold, homeHeader.marginLeft30]}>
                      {!this.props.batchEdit === true &&
                      !this.props.printBatch === true &&
                      this.props.currentSignType != 8 &&
                      this.props.auditMode === false
                        ? "To"
                        : ""}
                    </Text>
                  </View>
                  <View style={[global.row, homeHeader.adWrapperMargin]}>
                    <Text>
                      {!this.props.batchEdit === true &&
                      !this.props.printBatch === true &&
                      this.props.currentSignType != 8 &&
                      this.props.auditMode === false
                        ? this.props.main_AdFrom
                        : ""}
                    </Text>
                    <Text style={[global.marginLeft15]}>
                      {!this.props.batchEdit === true &&
                      !this.props.printBatch === true &&
                      this.props.currentSignType != 8 &&
                      this.props.auditMode === false
                        ? this.props.main_AdTo
                        : ""}
                    </Text>
                  </View>
                </React.Fragment>
              )}
            </View>
            {this.props.auditMode === true && (
              <View style={homeHeader.dropdownWrapper1}>
                <CustomButton
                  width="100%"
                  alignContent="center"
                  containerWidth="50%"
                  marginLeft="auto"
                  marginRight="auto"
                  text="Back"
                  backgroundColor="tomato"
                  clicked={() =>
                    Alert.alert(
                      "Please Confirm",
                      "Progress will be lost if you haven't saved",
                      [
                        { text: "Cancel", onPress: null },
                        {
                          text: "OK",
                          onPress: () => this.placeHol(),
                        },
                      ],
                      { cancelable: true }
                    )
                  }
                  disabled={false}
                />
                <CustomButton
                  width="100%"
                  alignContent="center"
                  containerWidth="50%"
                  marginLeft="auto"
                  forPrint={
                    this.props.isLoadingrn === true
                      ? false
                      : this.props.storedSignsLength != 0
                      ? true
                      : this.props.isDeleteEnabled === true
                      ? true
                      : false
                  }
                  marginRight="auto"
                  text="Print"
                  clicked={() => this.print("auditMode")}
                  disabled={
                    this.props.storedSignsLength != 0
                      ? false
                      : this.props.isDeleteEnabled === true
                      ? false
                      : true
                  }
                />
              </View>
            )}
            {!this.props.batchEdit === true &&
            this.props.currentSignType != 8 &&
            !this.props.printBatch === true &&
            this.props.auditMode === false ? (
              <View style={homeHeader.dropdownWrapper1}>
                <ModalDropdown
                  justForHeader={-22}
                  options={this.props.main_AheadInfoArray}
                  onSelect={(e) => {
                    this.dropdown_GetByAd(this.props.main_AheadInfoArray[e]);
                  }}
                  defaultValue={
                    this.props.main_AheadInfoArray[
                      this.state.backToHomeTrigger === true
                        ? this.props.currentAhead + 2
                        : this.props.defaultSignTypeID
                    ]
                  }
                />
              </View>
            ) : (
              this.state.batchEditAbove === true &&
              this.props.showMultiEdit === false &&
              this.props.auditMode === false && (
                <View style={[global.column, global.marginAuto]}>
                  <Text style={global.bold}>
                    Batch: {JSON.stringify(this.props.isBatch)}
                  </Text>
                  <ModalDropdown
                    width={Math.round(Dimensions.get("window").width) * 0.75}
                    defaultValue={this.state.currentBatchName}
                    options={this.props.data.map((e) => e.BatchTypeName)}
                    ref="dropdownref"
                    onSelect={(s) => {
                      this.dropdownHandler(this.props.data[s]);
                    }}
                  />
                </View>
              )
            )}
          </View>
          {this.props.batchEdit === true &&
            this.state.batchEditAbove === false &&
            (this.props.data.length > 0 ? (
              <View style={global.subContainer}>
                <View style={[global.row, global.marginAuto]}>
                  <React.Fragment>
                    <Text>Batch: {JSON.stringify(this.props.isBatch)}</Text>

                    <ModalDropdown
                      width={Math.round(Dimensions.get("window").width) * 0.75}
                      // defaultValue={this.state.currentBatchName}
                      defaultValue={
                        this.props.isBatch === true
                          ? this.state.currentBatchName
                          : "Select a batch"
                      }
                      options={this.props.data.map((e) => e.BatchTypeName)}
                      onSelect={(s) => {
                        this.dropdownHandler(this.props.data[s], "aboveTrue");
                      }}
                    />
                  </React.Fragment>
                </View>
              </View>
            ) : (
              <View>
                <Text style={[homeHeader.noBatchText, global.textAlignCenter]}>
                  No Batches Available
                </Text>
              </View>
            ))}
          {this.props.showMultiEdit === true && (
            <View>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                Choose what to search for
              </Text>
              <View style={[global.marginAuto, global.row]}>
                <Text>Signs</Text>
                <Checkbox
                  selected={this.state.currentSignType === 1 ? true : false}
                  onPress={() => this.checkboxHandler("Signs")}
                />
                <Text>Tags</Text>
                <Checkbox
                  selected={this.state.currentSignType === 8 ? true : false}
                  onPress={() => this.checkboxHandler("Tags")}
                />
              </View>
              {/* <View style={global.row}>
                <CustomButton
                  width="100%"
                  alignContent="center"
                  containerWidth="30%"
                  marginLeft="auto"
                  forPrint={!this.props.isLoadingrn}
                  marginRight="auto"
                  text="Search"
                  clicked={() =>
                    this.activateSearch(this.state.currentSignType)
                  }
                  disabled={this.props.isLoadingrn}
                />
              </View> */}
            </View>
          )}
          {this.props.hideDeletePrintButtons === false &&
          this.props.batchEdit === true
            ? this.props.data.length < 1 && <View />
            : this.props.showOrderStock === false &&
              this.props.showPrintBatch === false && (
                <View style={homeHeader.dropdownWrapper}>
                  <View style={homeHeader.cancelButton}>
                    {this.props.showMultiEdit === false &&
                      this.props.auditMode != true &&
                      this.props.currentAhead != +-2 && (
                        <CustomButton
                          width="100%"
                          alignContent="center"
                          forDelete={this.props.isDeleteEnabled}
                          marginLeft="auto"
                          marginRight="auto"
                          containerWidth="30%"
                          text="Delete"
                          clicked={() =>
                            Alert.alert(
                              "",
                              "Permanently Delete Selected Signs?",
                              [
                                { text: "Cancel", onPress: null },
                                {
                                  text: "OK",
                                  onPress: this.onDeleteSelectedClicked,
                                },
                              ],
                              { cancelable: true }
                            )
                          }
                          disabled={
                            this.props.isDeleteEnabled === true ? false : true
                          }
                        />
                      )}
                    {this.props.auditMode != true && (
                      <CustomButton
                        width="100%"
                        alignContent="center"
                        containerWidth="30%"
                        marginLeft="auto"
                        forPrint={!this.props.isLoadingrn}
                        marginRight="auto"
                        text="Search"
                        clicked={() => this.activateSearch(1)}
                        disabled={this.props.isLoadingrn}
                      />
                    )}

                    {this.props.showMultiEdit === false &&
                      this.props.auditMode != true && (
                        <CustomButton
                          width="100%"
                          alignContent="center"
                          containerWidth="30%"
                          marginLeft="auto"
                          forPrint={
                            this.props.isLoadingrn === true
                              ? false
                              : this.props.storedSignsLength != 0
                              ? true
                              : this.props.isDeleteEnabled === true
                              ? true
                              : false
                          }
                          marginRight="auto"
                          text="Print"
                          clicked={() => this.print()}
                          disabled={
                            this.props.storedSignsLength != 0
                              ? false
                              : this.props.isDeleteEnabled === true
                              ? false
                              : true
                          }
                        />
                      )}
                    {this.props.showMultiEdit === true && (
                      <CustomButton
                        width="100%"
                        alignContent="center"
                        containerWidth="30%"
                        marginLeft="auto"
                        // forPrint={
                        //   this.props.isLoadingrn === true
                        //     ? false
                        //     : this.props.storedSigns.length != 0
                        //     ? true
                        //     : this.props.isDeleteEnabled === true
                        //     ? true
                        //     : false
                        // }
                        forPrint={
                          this.props.isDeleteEnabled === true ? true : false
                        }
                        marginRight="auto"
                        text="Edit selected"
                        clicked={() => this.multiEdit()}
                        disabled={
                          this.props.isDeleteEnabled === true ? false : true
                        }
                      />
                    )}
                  </View>
                </View>
              )}
          {this.props.batchEdit && this.props.auditMode != true && (
            <View style={homeHeader.dropdownWrapper}>
              <View style={homeHeader.cancelButton}>
                {this.props.showMultiEdit === false && (
                  <CustomButton
                    width="100%"
                    alignContent="center"
                    forDelete={this.props.isDeleteEnabled}
                    marginLeft="auto"
                    marginRight="auto"
                    containerWidth="30%"
                    text="Delete"
                    clicked={() =>
                      Alert.alert(
                        "",
                        "Permanently Delete Selected Signs?",
                        [
                          { text: "Cancel", onPress: null },
                          {
                            text: "OK",
                            onPress: this.onDeleteSelectedClicked,
                          },
                        ],
                        { cancelable: true }
                      )
                    }
                    disabled={
                      this.props.isDeleteEnabled === true ? false : true
                    }
                  />
                )}

                <CustomButton
                  width="100%"
                  alignContent="center"
                  containerWidth="30%"
                  marginLeft="auto"
                  forPrint={!this.props.isLoadingrn}
                  marginRight="auto"
                  text="Search"
                  clicked={() => this.activateSearch(8)}
                  disabled={this.props.isLoadingrn}
                />
                {this.props.showMultiEdit === false && (
                  <CustomButton
                    width="100%"
                    alignContent="center"
                    containerWidth="30%"
                    marginLeft="auto"
                    forPrint={
                      this.props.isLoadingrn === true
                        ? false
                        : this.props.storedSigns.length != 0
                        ? true
                        : this.props.isDeleteEnabled === true
                        ? true
                        : false
                    }
                    marginRight="auto"
                    text="Print"
                    clicked={() => this.print()}
                    disabled={
                      this.props.storedSigns.length != 0
                        ? false
                        : this.props.isDeleteEnabled === true
                        ? false
                        : true
                    }
                  />
                )}
                {this.props.showMultiEdit === true && (
                  <CustomButton
                    width="100%"
                    alignContent="center"
                    containerWidth="30%"
                    marginLeft="auto"
                    forPrint={
                      this.props.isLoadingrn === true
                        ? false
                        : this.props.storedSigns.length != 0
                        ? true
                        : this.props.isDeleteEnabled === true
                        ? true
                        : false
                    }
                    marginRight="auto"
                    text="Edit selected"
                    clicked={() => this.multiEdit()}
                    disabled={
                      this.props.storedSigns.length != 0
                        ? false
                        : this.props.isDeleteEnabled === true
                        ? false
                        : true
                    }
                  />
                )}
              </View>
            </View>
          )}
        </View>
      </React.Fragment>
    );
  }
}

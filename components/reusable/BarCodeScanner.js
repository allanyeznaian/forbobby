//for petsmart
// create function to just scan items, and if the items dont match
//have it automatically print,
//if items match, then press ok maybe

import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Alert,
  Dimensions,
  TouchableOpacity,
  Platform,
  Linking,
  TextInput,
  Modal,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { barCodeScanner, global } from "../../Styles/Styles";
import CustomButton from "./CustomButton";
import CustomTextInput from "./CustomTextInput";
import { data_get_data_for_edit } from "../../scripts/API";
import { levelSignIdStore } from "../../App";

export default function App(props) {
  const state = {
    showSuccessModal: "",
    showFailedModal: false,
    item: true,
    arr: [],
    response: "",
    boolScannedArr: false,
    boolMainData: false,
    placeHolder: "",
    qrSize: Dimensions.get("window").width * 0.9,

    toBeDisplayed: [],
    isLoading: false,
    signData: props.currentScannedItem,

    qp: false,
    au: true,
  };

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);
  (requestPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }),
    [];

  let toBeDisplayed = [];
  const getMainSignData = async () => {
    const it = props.handleScanner(props.UPCText, "getStampId");
    const arr = [];
    if (!it) {
      return null;
    } else {
      const body = {
        // stampIDs: props.gridData_Data.stampId,
        stampIDs: it.stampId,
        includePromotionField: false,
        includeSizeField: false,
        includeQuantityField: false,
      };
      // if (this.state.signData.signLastUpdated < this.props.signLastUpdated(this.state.signId)) {
      //   this.props.gridData_Cancel();
      // }
      data_get_data_for_edit(body).then((resp) => {
        //validation, you can find if validation is needed in the if statement just below
        for (let i = 0; i < resp.length; i++) {
          const obj = {
            label: resp[i].TemplateFieldName,
            order: resp[i].TemplateFieldSortOrder,
            value: "",
            country: "",
            fieldId: resp[i].FieldId,
            arr: {
              country: resp[i].fieldset.map((e) => {
                return {
                  country: e.FieldSetText,
                  order: e.FieldSetOrder,
                  fieldSetValue: e.FieldSetValue,
                };
              }),
            },
            signId: state.signData.id,
            signLastUpdated: state.signData.signLastUpdated,
            signfieldId: "",
          };
          for (let r = 0; r < it.completeSignObject.length; r++) {
            if (it.completeSignObject[r].FieldID === resp[i].FieldId) {
              obj.value = it.completeSignObject[r].SignFieldValue;
              obj.fieldSetValue = it.completeSignObject[r].SignFieldValue;
              obj.signfieldId = it.completeSignObject[r].SignFieldID;
            }
          }
          arr.push(obj);
        }
        arr.sort((a, b) => a.order > b.order);
        (state.templateFieldData = arr), (state.data = arr);
        state.isLoading = false;
        let test = "";
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].fieldSetValue) {
            if (arr[i].fieldSetValue.length > 0) {
              test = test + arr[i].label + ": " + arr[i].fieldSetValue + "\n";
            }
          }
        }
        toBeDisplayed.push(test);
        return test;
      });
      return arr;
    }
    // for (let i = 0; i < this.props.superData.length; i++) {
    //   if (this.props.superData[i].id === this.props.gridData_Data.id)
    //     this.setState({ signData: this.props.superData[i] });
    // }
    // alert(JSON.stringify(it.stampId));

    // setTimeout(() => {
    // alert(JSON.stringify(props.currentScannedItem));
  };

  const toggle = (e) => {
    if (e === "audit" && props.toggler != "audit") {
      props.toggle(e);
    } else if (e === "quickprint" && props.toggler != "quickprint") {
      props.toggle(e);
    }
  };

  print = async (data) => {
    // console.log(
    //   "ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
    //   JSON.stringify(data)
    // );
    const test = getMainSignData();
    const obj = {
      buttonCall: "Print",
      LevelID: props.levelID,
      batchName: "",
      levelSignsToPrint: toBeDisplayed[0],
      batchTypeIDs: 0,
      LevelUserInfoID: props.levelUserInfoId,
      SignTypeID: props.currentSignTypeID,
      SupressDepartmentSlip: false,
      SupressMarginNotation: false,
      SupressStoreSlip: false,
      ComingleStocks: false,
    };
    setTimeout(() => {
      console.log(obj);
    }, 100);
  };

  addItem = (data, action) => {
    setScanned(false);
    props.handleScanner(
      data,
      "addItem",
      action === "auditMode" ? "auditMode" : ""
    );

    state.item = true;
    props.UPCReset();
  };
  continueAddingItem = (data) => {
    setScanned(false);
    props.handleScanner(data, "continue");
    state.item = true;
    props.UPCReset();
  };

  const handleBarCodeScanned = async ({ type, data }, e, action) => {
    //ONLY FOR IF CAMERA IS BEING USED
    // if(isdevice zebra button is active)
    // scanner light only active while in audit/zebra print mode
    // if(item scanned turn off scanner light and keep off until let go and pressed again and beep)
    // if(item not found, or error make another beep)
    // if (props.isFocused() === false) {
    if (props.toggler === "quickprint") {
      if (props.UPCText != undefined) {
        if (props.UPCText.length > 0 && e === "fromSearch") {
          data = props.UPCText;
        }
      }
      let levelSignId = "";
      setTimeout(() => {
        props.getCall("scannerSearch", data),
          () => {
            setTimeout(() => {
              console.log(
                "THIS IS LEVELSIGNID IN HANDLBARCODE SCANNED",
                levelSignIdStore("get")
              );
            }, 100);
          };
        // myPromisez.then(() => {});
        //make sure everything is being set properly
        //above method should GET the lvlsignid which is succesful
        //it must set the
        //DO A CHECK HERE TO SEE IF THERE"S MORE THAN ONE
        //ALSO DO A CHECK HERE FOR THE DANGLER
      }, 150);

      // setTimeout(() => {}, 1000);
    } else {
      await getMainSignData();
      if (props.UPCText != undefined) {
        if (props.UPCText.length > 0 && e === "fromSearch") {
          data = props.UPCText;
        }
      }

      // BNOBBY QUESTIONS PREPARE FOR TOMORROW

      setScanned(true);
      setTimeout(() => {
        console.log(props.scannedItem);
        if (props.isForForm === true) {
          props.scannedItem(data);
        } else {
          state.item = false;
          props.scannedArr.map((e) => {
            return e.completeSignObject.map((a) => {
              return (
                a.SignFieldValue === data &&
                ((state.response = "Barcode already scanned"),
                (state.placeHolder = data))
              );
            });
          });
          if (state.response != "Barcode already scanned") {
            props.mainData.map((e) => {
              return e.completeSignObject.map((a) => {
                return a.SignFieldValue === data && (state.response = "add");
              });
            });
          }
          if (
            state.response != "add" &&
            state.response != "Barcode already scanned" &&
            props.auditMode != true
          ) {
            //look
            //nothing happening here
            state.response = "Signa does not exist";
          } else if (
            state.response != "add" &&
            state.response != "Barcode already scanned" &&
            props.auditMode === true
          ) {
            props.getCall("scannerSearch", data);
            //get all these signfield values etc and compare with required contents of parsed BARCODE
            // this condition happens when you scan a barcode that doesnt exist
            // console.log(props.scannedItem);

            state.response = "Sign does not exist";

            // (props.currentScannedItem.headeroneFieldLabel.length > 0
            //   ? props.currentScannedItem.headeroneFieldLabel +
            //     ": " +
            //     props.currentScannedItem.headerone +
            //     "\n"
            //   : "") +
            // (props.currentScannedItem.headertwoFieldLabel.length > 0
            //   ? props.currentScannedItem.headertwoFieldLabel +
            //     ": " +
            //     props.currentScannedItem.headertwo +
            //     "\n"
            //   : "") +
            // (props.currentScannedItem.headerthreeFieldLabel.length > 0
            //   ? props.currentScannedItem.headerthreeFieldLabel +
            //     ": " +
            //     props.currentScannedItem.headerthree +
            //     "\n"
            //   : "");

            // + (

            // )
            props.UPCReset();
          }
          if (state.response === "add" && !props.auditMode) {
            state.response = "asdf";
            return Alert.alert(
              "",
              "Continue scanning items?",
              [
                {
                  text: "No",
                  onPress: () => addItem({ type: type, data: data }),
                },
                {
                  text: "Yes",
                  onPress: () => continueAddingItem({ type: type, data: data }),
                },
              ],
              { cancelable: false }
            );
          } else if (state.response === "add" && props.auditMode === true) {
            state.response = "asdf";
            // return something();

            // Alert.alert("", "IT FOUND THE ITEM AND SHOULD NOW COMPARE", [
            //   { text: "GOOD?", onPress: () => {} },
            // ]);
            // <Modal
            //   visible={true}
            //   animationType="fade"
            //   transparent={true}
            //   style={{ width: "50%", height: "30%" }}
            // >
            //   <View>
            //     <TouchableOpacity style={{ backgroundColor: "green" }}>
            //       <Text>asdfasdfasdf</Text>
            //     </TouchableOpacity>
            //   </View>
            // </Modal>look here
            Alert.alert(
              "Items Do Not Match",
              toBeDisplayed.length > 1 ? "error" : toBeDisplayed[0],
              // getMainSignData()
              // state.toBeDisplayed.map((e) => {
              //   return (
              //     e.fieldSetValue &&
              //     e.fieldSetValue.length > 0 &&
              //     e.label + ": " + e.fieldSetValue + "\n"
              //   );
              // })
              // ),

              // for (let i = 0; i < arr.length; i++) {
              //   if (arr[i].fieldSetValue) {
              //     if (arr[i].fieldSetValue.length > 0) {
              //       console.log(arr[i].label);
              //       state.test.push(arr[i].label + ": " + arr[i].fieldSetValue + "\n");
              //     }
              //   }
              // }

              // console.log(test);

              // state.toBeDisplayed = arr;
              [
                {
                  text: "Print",
                  onPress: () => print(data),
                },
                {
                  text: "Done",
                  onPress: () =>
                    addItem({ type: type, data: data }, "auditMode"),
                },
                {
                  text: "Scan",
                  onPress: () => continueAddingItem({ type: type, data: data }),
                },
              ],
              { cancelable: false }
            );
          } else if (state.response === "Barcode already scanned") {
            Alert.alert(
              "Barcode already scanned",
              "Would you like to add to the queue anyways?",
              [
                { text: "No", onPress: () => setScanned(false) },
                {
                  text: "Yes",
                  onPress: () => continueAddingItem({ type: type, data: data }),
                },
              ],
              { cancelable: false }
            );
          } else {
            Alert.alert(
              "",
              state.response,
              [{ text: "OK", onPress: () => setScanned(false) }],
              { cancelable: false }
            );
          }
          state.response = "asdf";
        }
      }, 150);
    }
    // }

    // }
  };

  if (Platform.OS === "ios" && hasPermission === null) {
    return <React.Fragment></React.Fragment>;
  } else if (Platform.OS === "android" && hasPermission === null) {
    return (
      <React.Fragment>
        <View style={barCodeScanner.permissionBackground} />
      </React.Fragment>
    );
  } else if (hasPermission === true && !props.auditMode) {
    return (
      <View style={[barCodeScanner.barCodeWrapper, global.alignItemsCenter]}>
        <View style={[global.absolute, global.zIndex]}>
          <Image
            style={[barCodeScanner.qr]}
            source={require("../../assets/images/scanner.png")}
          />
        </View>
        <View style={[global.absolute, global.zIndex]}>
          <TouchableOpacity
            style={barCodeScanner.cancelWrapper}
            onPress={
              props.auditMode === true
                ? () => props.backToHome()
                : () => props.handleScanner()
            }
          >
            <Text style={barCodeScanner.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
        <BarCodeScanner
          onBarCodeScanned={
            state.item === true && scanned ? undefined : handleBarCodeScanned
          }
          style={StyleSheet.absoluteFillObject}
        />
      </View>
    );
  } else if (hasPermission === true && props.auditMode === true) {
    return (
      <View style={[barCodeScanner.barCodeWrapper, global.alignItemsCenter]}>
        <View style={[global.absolute, global.zIndex]}>
          <Image
            style={[barCodeScanner.qr]}
            source={require(// state.showSuccessModal === true
            // ? "../../assets/images/success.png"
            // :
            "../../assets/images/scanner.png")}
          />
        </View>
        <View
          style={[
            global.absolute,
            global.zIndex,
            { backgroundColor: "transparent" },
          ]}
        >
          {/* {state.showSuccessModal === true ? (
            setTimeout(() => {
              <View style={[global.zIndex]}>
                <Image
                  style={[barCodeScanner.qr]}
                  source={require("../../assets/images/success.png")}
                />
              </View>;
            }, 150)
          ) : ( */}
          {/* )} */}
          {/* <View style={{ height: 20, opacity: 0.9 }}></View> */}
          {/* <View style={[global.row, global.marginAuto]}>
            <CustomButton
              containerWidth="25%"
              width="90%"
              text="ADD"
              onPress={() => {
                alert("ADD TO LIST");
              }}
            />
            <CustomButton
              containerWidth="25%"
              width="90%"
              text="PRINT"
              onPress={() => {
                alert("TO PRINT SCREEN");
              }}
            />
          </View> */}
          <View style={{ backgroundColor: "transparent" }}>
            <View style={[global.row, { alignSelf: "center" }]}>
              <TouchableOpacity
                style={{
                  padding: 3,
                  borderRadius: 2,
                  borderWidth: props.toggler === "audit" ? 1 : 0,
                  borderColor: "white",
                  backgroundColor:
                    props.toggler === "audit"
                      ? "rgba(44, 68, 86, 0.7)"
                      : "transparent",
                }}
                onPress={() => toggle("audit")}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 14,
                    fontWeight: "bold",
                    textAlign: "center",
                    marginTop: "auto",
                    marginBottom: "auto",
                  }}
                >
                  Audit
                </Text>
              </TouchableOpacity>
              <View style={{ width: 15 }} />
              <TouchableOpacity
                style={{
                  padding: 3,
                  borderRadius: 2,
                  borderWidth: props.toggler === "quickprint" ? 1 : 0,
                  borderColor: "white",
                  backgroundColor:
                    props.toggler === "quickprint"
                      ? "rgba(44, 68, 86, 0.7)"
                      : "transparent",
                }}
                onPress={() => toggle("quickprint")}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 14,
                    fontWeight: "bold",
                    textAlign: "center",
                    marginTop: "auto",
                    marginBottom: "auto",
                  }}
                >
                  Zebra
                </Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={[
                { width: "80%", backgroundColor: "lightgrey" },
                global.textInput,
                global.marginAuto,
              ]}
              placeHolder="Enter UPC"
              value={props.UPCText}
              onChangeText={(e) => {
                props.onChangeText(e);
              }}
              //FOR IF CAMERA IS BEING USED
              // onFocus={() => {
              //   props.isFocused(true);
              // }}
              // onBlur={() => {
              //   props.isFocused(false);
              // }}
            />
            <TouchableOpacity
              style={[
                global.textInput,
                global.marginAuto,
                {
                  backgroundColor:
                    props.UPCText.length > 0 ? "#3796ff" : "grey",
                  width: "80%",
                },
              ]}
              onPress={() => handleBarCodeScanned(props.UPCText, "fromSearch")}
              disabled={props.UPCText.length > 0 ? false : true}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 14,
                  fontWeight: "bold",
                  textAlign: "center",
                  marginTop: "auto",
                  marginBottom: "auto",
                }}
              >
                SEARCH
              </Text>
            </TouchableOpacity>
            {/* <CustomButton
              text="SEARCH"
              // backgroundColor="black"
              onPress={() => {}}
            /> */}
          </View>

          <TouchableOpacity
            style={barCodeScanner.cancelWrapperAudit}
            onPress={() =>
              props.scannedArr.length > 0
                ? addItem({ type: "", data: "" }, "auditMode")
                : props.backToHome()
            }
          >
            <Text style={[barCodeScanner.cancelTextAudit]}>
              Exit Audit Mode
            </Text>
          </TouchableOpacity>
        </View>
        <BarCodeScanner
          onBarCodeScanned={
            state.item === true && scanned ? undefined : handleBarCodeScanned
          }
          style={StyleSheet.absoluteFillObject}
        />
      </View>
    );
  } else if (Platform.OS === "android" && hasPermission === false) {
    return (
      <React.Fragment>
        <View style={[global.alignItemsCenter, global.marginAutoVertical]}>
          <Text>Request permission to use camera?</Text>
          <View style={global.padding10} />
          <CustomButton text="Yes" clicked={() => requestPermission()} />
          <View style={global.padding10} />
          <CustomButton text="Go back" clicked={() => props.handleScanner()} />
        </View>
      </React.Fragment>
    );
  } else if (Platform.OS === "ios" && hasPermission === false) {
    return (
      <React.Fragment>
        <View style={[global.alignItemsCenter, global.marginAutoVertical]}>
          <Text>Request permission to use camera?</Text>
          <View style={global.padding10} />
          <CustomButton
            text="Yes"
            clicked={() => Linking.openURL("app-settings:")}
          />
          <View style={global.padding10} />
          <CustomButton text="Go back" clicked={() => props.handleScanner()} />
        </View>
      </React.Fragment>
    );
  }
}

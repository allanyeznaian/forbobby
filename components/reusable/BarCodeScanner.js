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

  const handleBarCodeScanned = ({ type, data }, e) => {
    if (props.UPCText.length > 0 && e === "fromSearch") {
      data = props.UPCText;
    }
    setScanned(true);
    setTimeout(() => {
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
          state.response = "Sign does not exist";
        } else if (
          state.response != "add" &&
          state.response != "Barcode already scanned" &&
          props.auditMode === true
        ) {
          state.response = "Good";
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
          // </Modal>
          Alert.alert(
            "Items Do Not Match",
            "Continue scanning?",
            [
              {
                text: "No",
                onPress: () => addItem({ type: type, data: data }, "auditMode"),
              },
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

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
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { barCodeScanner, global } from "../../Styles/Styles";
import CustomButton from "./CustomButton";

export default function App(props) {
  const state = {
    item: true,
    arr: [],
    response: "",
    boolScannedArr: false,
    boolMainData: false,
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

  addItem = (data) => {
    setScanned(false);
    props.handleScanner(data, "addItem");
    state.item = true;
  };
  continueAddingItem = (data) => {
    setScanned(false);
    props.handleScanner(data, "continue");
    state.item = true;
  };

  const handleBarCodeScanned = ({ type, data }) => {
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
              (state.response = "Barcode already scanned")
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
          state.response != "Barcode already scanned"
        ) {
          state.response = "Sign does not exist";
        }
        if (state.response === "add") {
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
  } else if (hasPermission === true) {
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
            onPress={() => props.handleScanner()}
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

//this is the container that holds the grid you see on log in

import React, { Component } from "react";
import { View, Text, Modal, TouchableOpacity, Dimensions } from "react-native";
import CustomButton from "./reusable/CustomButton";
import CustomTextInput from "./reusable/CustomTextInput";
import BarCodeScannerComponent from "./reusable/BarCodeScanner";
import { search } from "../Styles/Styles";
import Icon from "./reusable/Icon";

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newUser: "",
      searchText: "",
      showScanner: false,
      barcode: "",
      value: "",
      scanned: false,
    };
  }

  componentDidMount = () => {};
  handleScanner = (bool) => {
    this.setState({ showScanner: bool, scanned: false });
  };
  scanned = (barcode) => {
    this.setState({ scanned: true }, () => {
      if (this.state.scanned === true) {
        this.handleScanner(false);
        setTimeout(() => {
          if (this.state.searchText.includes(barcode)) {
            alert("Barcode already scanned");
          } else if (this.state.scanned == false) {
            setTimeout(() => {
              this.setState({
                barcode: barcode,
                value: barcode,
                searchText:
                  this.state.searchText.length > 0
                    ? this.state.searchText + "," + barcode
                    : barcode,
              });
            }, 150);
          }
        }, 150);
        this.setState({ scanned: false });
      }
    });
  };
  textHandler = (e, a) => {
    if (a == "text") {
      this.setState({ searchText: e });
    }
  };
  render() {
    return (
      <React.Fragment>
        {this.state.showScanner === true && (
          <Modal>
            <BarCodeScannerComponent
              isForForm={true}
              handleScanner={this.handleScanner}
              scannedItem={this.scanned}
            />
          </Modal>
        )}
        <Modal visible={true} transparent={true} animationType="fade">
          <TouchableOpacity
            style={search.outsidePopup}
            onPress={() => this.props.cancelSearch()}
          ></TouchableOpacity>
          <View style={search.container}>
            <View style={search.header}>
              <Text style={search.headerText}>Search</Text>
              <TouchableOpacity
                style={search.cancelButton}
                onPress={this.props.cancelSearch}
              >
                <Text style={search.cancelText}>X</Text>
              </TouchableOpacity>
            </View>
            <View style={search.contentContainer}>
              <View style={search.textInputWrapper}>
                <CustomTextInput
                  containerWidth="90%"
                  width="100%"
                  multiline={true}
                  value={this.state.searchText}
                  onChangeText={(e) => {
                    this.textHandler(e, "text");
                  }}
                />
              </View>
              <View style={search.barcodeWrapper}>
                <Icon
                  functionality="button"
                  size={40}
                  source={require("../assets/vectoricons/barcodescanner.png")}
                  onPress={() => this.handleScanner(true)}
                />
              </View>
              <View style={search.buttonWrapper}>
                <CustomButton
                  width="100%"
                  alignContent="center"
                  forDelete={this.props.isDeleteEnabled}
                  marginLeft="auto"
                  marginRight="auto"
                  containerWidth="90%"
                  text="Search"
                  fontSize={12}
                  clicked={() => this.props.search(this.state.searchText)}
                />
              </View>
            </View>
            <Text style={search.instructionsText}>
              Seperate Search Terms by Commas
            </Text>
          </View>
        </Modal>
      </React.Fragment>
    );
  }
}

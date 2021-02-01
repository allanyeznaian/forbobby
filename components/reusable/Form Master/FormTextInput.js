//this works just like the customtextinput component but is for forms
//takes props from FormMaster.js
//props:
//width, containerWidth, borderRadius, backgroundColor
//editable: if set to false the textbox will be disabled
//data: array of objects/formdata
//onChangeValue, onFocus, multiline onBlur, secureTextEntry, placeholder, value: same as textinput
//label: adds a label above the text input
//validation: if set true, will change color to red if value is less than 1

import React, { Component } from "react";
import { TextInput, Text, View, Modal } from "react-native";
import { formTextInput, global, gridData } from "../../../Styles/Styles";
import Icon from "../Icon";
import BarCodeScannerComponent from "../BarCodeScanner";

export default class FormTextInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showScanner: false,
      value: "",
      backgroundColor: "#eff3fb",
      width: this.props.width ? this.props.width : "80%",
      containerWidth: this.props.containerWidth
        ? this.props.containerWidth
        : "100%",
      borderRadius: this.props.borderRadius ? this.props.borderRadius : 5,
      editable: this.props.editable,
      backgroundColorText: "#E8E8E8",
      borderColor: "grey",
      barcode: "",
    };
  }
  componentDidMount = () => {
    this.setState({ value: this.props.value });
  };
  handleScanner = (bool) => {
    this.setState({ showScanner: bool });
  };
  textHandler = (e, label) => {
    const obj = [...this.props.data];
    for (let i = 0; i < obj.length; i++) {
      if (obj[i].label === label) {
        obj[i].value = e;
        obj[i].fieldSetValue = e;
      }
    }
    this.setState({ obj: { label: label, value: e }, value: e });

    //will not properly work without setTimeout
    //setTimeout is called here because the js above must be
    //rendered before the code in the timeout function
    setTimeout(() => {
      var index = obj.findIndex(function (o) {
        return o.label === label;
      });
      if (index !== -1) {
        obj[index].value = this.state.value;
      }
      this.props.onChangeValue(obj);
    }, 1);
  };
  scanned = (barcode) => {
    this.handleScanner(false);
    this.setState({ barcode: barcode, value: barcode });
    this.textHandler(barcode, this.props.label);
  };
  onFocus = () => {
    this.setState({ backgroundColorText: "white", borderColor: "#3796ff" });
    this.props.onFocus();
  };
  onBlur = () => {
    this.setState({ backgroundColorText: "#E8E8E8", borderColor: "grey" });
    this.props.onBlur();
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
        <View
          style={[
            global.topLeft0,
            {
              width: this.state.containerWidth,
              backgroundColor: this.state.backgroundColor,
            },
          ]}
        >
          <View style={global.row}>
            <Text style={[formTextInput.text]}>{this.props.label}</Text>
          </View>
        </View>
        <View
          style={[
            global.topLeft0,
            formTextInput.align,
            { backgroundColor: this.state.backgroundColor },
          ]}
        >
          <View style={[global.row]}>
            <TextInput
              multiline={true}
              autoCapitalize="none"
              name=""
              editable={this.state.editable}
              secureTextEntry={this.props.secureTextEntry}
              onFocus={() => this.onFocus()}
              onBlur={() => this.onBlur()}
              placeholder={this.props.placeholder}
              style={[
                formTextInput.textInput,
                {
                  width: this.props.label.includes("UPC")
                    ? "65%"
                    : this.state.width,
                  borderRadius: this.state.borderRadius,
                  backgroundColor: this.state.backgroundColorText,
                  borderColor: this.state.borderColor,
                },
              ]}
              value={this.state.value}
              onChangeText={(e) => {
                this.textHandler(e, this.props.label);
              }}
            />
            {this.props.label.includes("UPC") && (
              <View style={[gridData.iconHeaderWrapper]}>
                <Icon
                  functionality="button"
                  size={40}
                  source={require("../../../assets/vectoricons/barcodescanner.png")}
                  onPress={() => this.handleScanner(true)}
                />
              </View>
            )}
          </View>
          <View style={formTextInput.space}></View>
        </View>
      </React.Fragment>
    );
  }
}

// this component replaces the TextInput component
//props are
//data which needs an array of objects like this
//======================================================
//          { label: labels, text: "" },
//          { label: from, text: "" },
//          { label: db, text: "" }
//======================================================

//,
//
//props:
//backgroundColor, width, containerWidth, borderRadius
//editable: bool~ tells you whether the form field can be edited or not
//data: the complete data from the GridDataEditModal.js component
//dropdown(): returns object of selected dropdown item
//checkboxHandler(): returns object of checked item
//onChangeValue(): same as textInput
//countries: this calls a function from GridDataEditModal.js component with the complete object of chosen countries
//calendar(): this sends over the chosent date
//batchTypeID:

import React, { Component } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import FormTextInput from "./FormTextInput";
import Checkbox from "../Checkbox";
import ModalDropdown from "../react-native-modal-dropdown/index";
import Calendar from "../Calendar";
import { formMaster, global } from "../../../Styles/Styles";

export default class CustomTextInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      backgroundColor: this.props.backgroundColor,
      width: this.props.width ? this.props.width : "80%",
      containerWidth: this.props.containerWidth
        ? this.props.containerWidth
        : "100%",
      borderRadius: this.props.borderRadius ? this.props.borderRadius : 5,
      editable: this.props.editable,
      arr: [],
      countryArray: [],
      y: 0,
      date: "",
      countryList: [],
      loadDropdown: false,
      data: [],
      height: Math.round(Dimensions.get("window").height),
    };
  }
  componentDidMount = () => {
    this.date("NEW");
    const countryArray = [...this.state.countryArray];
    for (let i = 0; i < this.props.data.length; i++) {
      this.setState({
        [this.props.data[i].label]: this.props.data[i].fieldSetValue,
      });
      if (this.props.data[i].formType === "cool") {
        for (let z = 0; z < this.props.data[i].arr.country.length; z++) {
          countryArray.push(this.props.data);
        }
        this.setState({
          countryList: this.props.data[i].fieldSetValue
            ? this.props.data[i].fieldSetValue.split(",")
            : [],
        });
      }
    }
    this.setState({ countryArray: countryArray });
  };
  date = (d) => {
    this.setState({ date: d });
    if (d === "NEW") {
      const today = new Date();
      const date =
        today.getFullYear() +
        "-" +
        parseInt(today.getMonth() + 1) +
        "-" +
        today.getDate();
      this.setState({ date: date });
    }
  };

  find_dimesions(layout, index, e) {
    const newArr = [...this.state.arr];
    const obj = {
      y: layout.y,
      index: e.displayOrder,
      label: e.label,
      value: e.value,
      formType: e.formType,
    };

    newArr.push(obj);
    this.setState({ arr: newArr });
  }
  handleDropdown = (innerObj, outerObj) => {
    const obj = {
      FieldID: outerObj.fieldId,
      SignFieldID: outerObj.signfieldId,
      FieldSetValue: innerObj.fieldSetValue,
      SignID: outerObj.signId,
      Value: innerObj.country,
    };
    this.props.dropdown(obj);
  };
  checkboxHandler = (e) => {
    const obj = {
      FieldID: e.fieldId,
      SignFieldID: e.signfieldId,
      FieldSetValue: e.fieldSetValue,
      SignID: e.signId,
    };
    this.props.checkboxHandler(obj);
  };
  onChangeValue = (e) => {
    this.setState({ currentTextValue: e });
    this.props.onChangeValue(e);
  };
  handleCountry = (signfieldValue, fieldId, signfieldId, signId) => {
    const arr = [...this.state.countryList];
    if (arr.indexOf(signfieldValue) === -1) arr.push(signfieldValue);
    else {
      arr.splice(arr.indexOf(signfieldValue), 1);
    }
    const obj = {
      FieldID: fieldId,
      SignFieldID: signfieldId,
      SignFieldValue: arr.join(),
      SignID: signId,
    };
    this.setState({ countryList: arr });
    this.props.countries(obj);
  };
  handleCalendar = (date, object) => {
    const obj = {
      FieldID: object.fieldId,
      SignFieldID: object.signfieldId,
      FieldSetValue: date.split("-").join("/"),
      SignID: object.signId,
    };
    this.props.calendar(obj);
  };
  onFocus = () => {};
  onBlur = () => {};

  render() {
    return (
      <View style={[global.width100]}>
        <View
          style={[
            global.topLeft0,
            { backgroundColor: this.state.backgroundColor },
          ]}
        >
          {this.props.data.map((e, index) => {
            return (
              <View
                style={{ backgroundColor: this.state.backgroundColor }}
                key={index}
                onLayout={(event) => {
                  this.find_dimesions(event.nativeEvent.layout, index, e);
                }}
              >
                {e.fieldSetValue == "False" ? (
                  <View
                    style={[
                      formMaster.labelWrapper,
                      {
                        backgroundColor: this.state.backgroundColor,
                      },
                    ]}
                  >
                    <Text style={formMaster.text}>{e.label}</Text>
                    <Checkbox
                      selected={false}
                      onPress={() => {
                        this.checkboxHandler(e);
                      }}
                    />
                  </View>
                ) : e.fieldSetValue == "True" ? (
                  <View
                    style={[
                      formMaster.labelWrapper,
                      {
                        backgroundColor: this.state.backgroundColor,
                      },
                    ]}
                  >
                    <Text style={formMaster.text}>{e.label}</Text>
                    <Checkbox
                      selected={true}
                      onPress={() => {
                        this.checkboxHandler(e);
                      }}
                    />
                  </View>
                ) : e.formType === "calendar" ? (
                  <View style={formMaster.calendar}>
                    <Text style={[formMaster.text, formMaster.flexStart]}>
                      {e.label}
                    </Text>
                    <Calendar
                      backgroundColor="white"
                      defaultIncoming={e.value.split("/").join("-")}
                      checkDate={this.state.date.split("/").join("-")}
                      date={(a) => this.handleCalendar(a, e)}
                    />
                  </View>
                ) : e.formType === "text" ? (
                  e.fieldSetValue !== "False" &&
                  e.fieldSetValue !== "True" && (
                    <View
                      style={{
                        backgroundColor:
                          e.value.length < 1
                            ? "tomato"
                            : this.state.backgroundColor,
                      }}
                    >
                      <FormTextInput
                        backgroundColor={this.state.backgroundColor}
                        text={e.value}
                        validation={
                          e.label === "Header"
                            ? true
                            : e.label === "Brand"
                            ? true
                            : e.label === "Description"
                            ? true
                            : e.label === "Sale Price"
                            ? true
                            : e.label === "Regular Price"
                            ? true
                            : false
                        }
                        placeholder={e.value}
                        onFocus={() => this.onFocus(this.state.arr[index])}
                        onBlur={this.onBlur}
                        data={this.props.data}
                        value={e.fieldSetValue}
                        label={e.label}
                        onChangeValue={() => {
                          this.onChangeValue(e, e.label);
                        }}
                      />
                    </View>
                  )
                ) : e.formType === "dropdown" ? (
                  <React.Fragment>
                    <Text
                      style={[
                        formMaster.text,
                        formMaster.label,
                        {
                          backgroundColor: this.state.backgroundColor,
                        },
                      ]}
                    >
                      {e.label}
                    </Text>
                    <View
                      style={[
                        formMaster.marginR,
                        {
                          backgroundColor: this.state.backgroundColor,
                        },
                      ]}
                    >
                      <ModalDropdown
                        options={e.arr.country.map((z) => z.country)}
                        defaultValue={
                          e.arr.country
                            .map((r) => {
                              return r.fieldSetValue;
                            })
                            .indexOf(e.value) !== -1
                            ? e.arr.country[
                                e.arr.country
                                  .map((r) => {
                                    return r.fieldSetValue;
                                  })
                                  .indexOf(e.value)
                              ].country
                            : ""
                        }
                        onSelect={(s) => {
                          this.handleDropdown(e.arr.country[s], e);
                        }}
                      />
                    </View>
                  </React.Fragment>
                ) : (
                  e.formType === "cool" && (
                    <React.Fragment>
                      <View
                        style={[
                          formMaster.margin10,
                          {
                            height: this.state.height / 3,
                          },
                        ]}
                      >
                        <Text style={[formMaster.text, formMaster.label]}>
                          {e.label}
                        </Text>
                        <View style={[formMaster.grey, formMaster.marginR]}>
                          {!this.props.batchTypeID && (
                            <ScrollView
                              nestedScrollEnabled={true}
                              style={[
                                formMaster.countryListWrapper,
                                {
                                  height: this.state.height / 3,
                                },
                              ]}
                            >
                              {e.arr.country.map((z, index) => (
                                <TouchableOpacity
                                  key={index}
                                  style={{
                                    backgroundColor:
                                      this.state.countryList.indexOf(
                                        z.fieldSetValue
                                      ) > -1
                                        ? "lightgrey"
                                        : "white",
                                  }}
                                  onPress={() =>
                                    this.handleCountry(
                                      z.fieldSetValue,
                                      e.fieldId,
                                      e.signfieldId,
                                      e.signId
                                    )
                                  }
                                >
                                  <Text>{z.country}</Text>
                                </TouchableOpacity>
                              ))}
                            </ScrollView>
                          )}
                        </View>
                      </View>
                    </React.Fragment>
                  )
                )}
              </View>
            );
          })}
        </View>
      </View>
    );
  }
}

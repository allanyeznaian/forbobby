//props
//superData: this is selected items fields
//gridData_Data: this is the selected items values
//gridData_Cancel(e): this closes the GridDataEditModal.js component. e is the text that the topbarnotification will show
//batchTypeID:

//validation
import React, { Component } from "react";
import {
  Animated,
  Text,
  TouchableOpacity,
  Modal,
  View,
  ScrollView,
  Dimensions,
  Easing,
  Image,
} from "react-native";
import {
  data_get_data_for_edit,
  data_save_edited,
  data_get_image_proof,
} from "../scripts/API";
import FormMaster from "./reusable/Form Master/FormMaster";
import LoadingSpinner from "./reusable/LoadingSpinner";
import Icon from "./reusable/Icon";
import ImageProof from "./reusable/ImageProof";
import CustomButton from "./reusable/CustomButton";
import TopBarNotification from "./reusable/TopBarNotification";
import { gridDataEditModal, global } from "../Styles/Styles";

export default class GridDataEditModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      backgroundColor: "#ececec",
      data: "",
      headerone: "",
      headertwo: "",
      headerthree: "",
      formFields: [],
      textHandler: "",
      updatedDate: "",
      templateFieldData: [],
      date: "",
      newCountryObj: "",
      isLoading: false,
      signData: "",
      saveButton: "blue",
      proofButton: "green",
      callSave: false,
      notificationText: "",
      shouldNotify: false,
      levelSignId: this.props.levelSignId,
      levelId: this.props.levelId,
      changedSignFieldArr: [],
      testData: [],
      proofArr: [],
      // userId: "6a430ecf-a82c-4231-8cd0-12b70238d035",

      offset: new Animated.Value(0),
      imageOffset: new Animated.Value(0),

      imageLink: "",
      showImageProof: false,
      imageHeightAction: "close",
    };
    this.animatedValue = new Animated.Value(0);
    this.animatedValueImage = new Animated.Value(
      Dimensions.get("screen").height
    );
  }
  componentDidMount = () => {
    this.getMainSignData(this.props.isMultiEditActive);
    for (let i = 0; i < this.props.superData.length; i++) {
      if (this.props.superData[i].id === this.props.gridData_Data.id) {
        this.setState({ signData: this.props.superData[i] });
      }
    }

    this.setState({ isLoading: true });
    setTimeout(() => {
      const body = {
        stampIDs: this.props.gridData_Data.stampId,
        includePromotionField: false,
        includeSizeField: false,
        includeQuantityField: false,
      };

      data_get_data_for_edit(body).then((resp) => {
        this.setState({ testData: resp.Model });
        //validation, you can find if validation is needed in the if statement just below
        const arr = [];
        for (let i = 0; i < resp.length; i++) {
          const obj = {
            formType:
              resp[i].TemplateFieldName === "COOL"
                ? "cool"
                : resp[i].fieldset.length > 0
                ? "dropdown"
                : resp[i].TemplateFieldType === "Date"
                ? "calendar"
                : "text",
            required: resp[i].TemplateFieldIsRequired,
            required2: resp[i].IsRequired,
            //
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
            signId: this.state.signData.id,
            signfieldId: "",
          };
          for (
            let r = 0;
            r < this.state.signData.completeSignObject.length;
            r++
          ) {
            if (
              this.state.signData.completeSignObject[r].FieldID ===
              resp[i].FieldId
            ) {
              obj.value = this.state.signData.completeSignObject[
                r
              ].SignFieldValue;
              obj.fieldSetValue = this.state.signData.completeSignObject[
                r
              ].SignFieldValue;
              obj.signfieldId = this.state.signData.completeSignObject[
                r
              ].SignFieldID;
            }
          }
          arr.push(obj);
        }
        arr.sort((a, b) => a.order > b.order);
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].arr.country.length > 0) {
            arr[i].arr.country.sort((a, b) => a.order > b.order);
            for (let z = 0; z < arr[i].arr.country.length; z++) {
              if (arr[i].arr.country[z].fieldSetValue === "") {
                arr[i].arr.country.unshift(arr[i].arr.country.splice(z, 1)[0]);
              }
            }
          }
        }
        this.setState({ templateFieldData: arr, data: arr, isLoading: false });
      });
    }, 200);
  };

  getMainSignData = (bool) => {
    for (let i = 0; i < this.props.superData.length; i++) {
      if (this.props.superData[i].id === this.props.gridData_Data.id)
        this.setState({ signData: this.props.superData[i] });
    }

    this.setState({ isLoading: true });
    setTimeout(() => {
      const body = {
        stampIDs: this.props.gridData_Data.stampId,
        includePromotionField: false,
        includeSizeField: false,
        includeQuantityField: false,
      };
      // if (this.state.signData.signLastUpdated < this.props.signLastUpdated(this.state.signId)) {
      //   this.props.gridData_Cancel();
      // }
      data_get_data_for_edit(body).then((resp) => {
        //validation, you can find if validation is needed in the if statement just below

        const arr = [];
        for (let i = 0; i < resp.length; i++) {
          const obj = {
            formType:
              resp[i].TemplateFieldName === "COOL"
                ? "cool"
                : resp[i].fieldset.length > 0
                ? "dropdown"
                : resp[i].TemplateFieldType === "Date"
                ? "calendar"
                : "text",
            //
            required: resp[i].TemplateFieldIsRequired,
            required2: resp[i].IsRequired,
            //
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
            signId: this.state.signData.id,
            signLastUpdated: this.state.signData.signLastUpdated,
            signfieldId: "",
          };
          for (
            let r = 0;
            r < this.state.signData.completeSignObject.length;
            r++
          ) {
            if (
              this.state.signData.completeSignObject[r].FieldID ===
              resp[i].FieldId
            ) {
              obj.value = this.state.signData.completeSignObject[
                r
              ].SignFieldValue;
              obj.fieldSetValue = this.state.signData.completeSignObject[
                r
              ].SignFieldValue;
              obj.signfieldId = this.state.signData.completeSignObject[
                r
              ].SignFieldID;
            }
          }
          arr.push(obj);
        }
        arr.sort((a, b) => a.order > b.order);
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].arr.country.length > 0) {
            arr[i].arr.country.sort((a, b) => a.order > b.order);
            for (let z = 0; z < arr[i].arr.country.length; z++) {
              if (arr[i].arr.country[z].fieldSetValue === "") {
                arr[i].arr.country.unshift(arr[i].arr.country.splice(z, 1)[0]);
              }
            }
          }
        }
        this.setState({ templateFieldData: arr, data: arr, isLoading: false });
      });
    }, 200);
  };

  save = () => {
    //test call here for date/time
    let arrCheck = [];
    setTimeout(() => {
      let arr = [];
      const cool = this.state.newCountryObj;
      this.setState({ isLoading: true });
      let salePrice = "";
      let regPrice = "";
      let header = "a";
      let brand = "a";
      let description = "a";
      //look here
      // alert(this.state.signData.signLastUpdated);
      for (let i = 0; i < this.state.data.length; i++) {
        if (this.state.data[i].label === "Sale Price") {
          salePrice = this.state.data[i].fieldSetValue;
        }
        if (this.state.data[i].label === "Regular Price") {
          regPrice = this.state.data[i].fieldSetValue;
        }
        if (this.state.data[i].label === "Header") {
          header = this.state.data[i].fieldSetValue;
        }
        if (this.state.data[i].label === "Brand") {
          brand = this.state.data[i].fieldSetValue;
        }
        if (this.state.data[i].label === "Description") {
          description = this.state.data[i].fieldSetValue;
        }
        arr.push({
          SignFieldValue: this.state.data[i].fieldSetValue,
          SignID: this.state.data[i].signId,
          FieldID: this.state.data[i].fieldId,
          SignFieldID: this.state.data[i].signfieldId,
        });
      }
      if (salePrice && salePrice.length < 1) {
        this.notify("Sale Price field required");
        this.setState({ isLoading: false });
      } else if (regPrice && regPrice.length < 1) {
        this.notify("Regular Price field required");
        this.setState({ isLoading: false });
      } else if (salePrice && regPrice && +salePrice > +regPrice) {
        this.notify("Sale price cannot exceed regular price");
        this.setState({ isLoading: false });
      } else if (brand && brand.length < 1) {
        this.notify("Brand field required");
        this.setState({ isLoading: false });
      } else if (description && description.length < 1) {
        this.notify("Description field reqruired");
        this.setState({ isLoading: false });
      } else if (header && header.length < 1) {
        this.notify("Header field required");
        this.setState({ isLoading: false });
      } else if (
        (salePrice && isNaN(salePrice) === true) ||
        (regPrice && isNaN(regPrice) === true)
      ) {
        this.notify("Prices must be in numbers");
        this.setState({ isLoading: false });
      } else {
        for (let i = 0; i < arr.length; i++) {
          if (
            arr[i].FieldID &&
            arr[i].FieldID === this.state.updatedDate.FieldID
          ) {
            arr.splice(i, 1, this.state.updatedDate);
          }
          if (
            arr[i].FieldID &&
            arr[i].FieldID === this.state.newCountryObj.FieldID
          ) {
            arr.splice(i, 1, cool);
          }
        }
        let bodyContents = {};
        if (this.props.isMultiEditActive === false) {
          bodyContents = {
            jsonLocalSign: JSON.stringify(arr),
            loggedInLevelID: this.props.levelId,
          };
        } else if (this.props.isMultiEditActive === true) {
          const zarr = [...this.props.multipleSelectedHandlerArray];

          const templateArr = [...this.state.changedSignFieldArr];
          let newArr = [];
          for (let i = 0; i < templateArr.length; i++) {
            newArr.push(templateArr[i]);
            for (let a = 0; a < zarr.length; a++) {
              if (zarr[a].id != templateArr[i].SignID)
                newArr.push({
                  //zarr[z].stampId
                  FieldID: templateArr[i].FieldID,
                  SignFieldID: templateArr[i].SignFieldID,
                  SignFieldValue: templateArr[i].SignFieldValue,
                  SignID: zarr[a].id,
                });
            }
          }
          arrCheck = newArr;
          bodyContents = {
            jsonLocalSign: JSON.stringify(newArr),
            loggedInLevelID: this.props.levelId,
          };
        }
        for (let i = 0; i < arr.length; i++) {}
        const body = JSON.stringify(bodyContents);

        data_save_edited(body).then((resp) => {
          if (resp.Handling === "success") {
            //look
            const asdf = this.props.checkDate(bodyContents.jsonLocalSign);
            alert(JSON.stringify(asdf));

            setTimeout(() => {
              if (
                this.props.isScannedArrShowing === true &&
                !this.props.isSearchedOriginally
              ) {
                this.props.gridData_Cancel("updated scanned");
              } else if (
                this.props.isScannedArrShowing === true &&
                this.props.isSearchedOriginally === true
              ) {
                this.props.gridData_Cancel(
                  "updated scanned",
                  "Updating Searched"
                );
              } else if (
                this.props.isSearchedOriginally === true &&
                !this.props.isMultiEditActive
              ) {
                this.props.gridData_Cancel("sign updated", "Updating Searched");
              } else if (
                this.props.isSearchedOriginally === true &&
                this.props.isMultiEditActive === true
              ) {
                this.props.gridData_Cancel(
                  "sign updated",
                  "Updating Searched",
                  "MultiEdit"
                );
              } else {
                this.props.gridData_Cancel("sign updated");
              }
            }, 10);
          } else {
            this.setState({ isLoading: false });
          }
        });
      }
    }, 1);

    this.setState({ shouldNotify: false });
  };
  notify = (e) => {
    this.setState({ notificationText: e, shouldNotify: true });
  };
  date = (date, fieldId, signId, signFieldId) => {
    const obj = {
      SignFieldValue: date,
      SignID: signId,
      FieldID: fieldId,
      SignFieldID: signFieldId,
    };
    this.setState({ updatedDate: obj });
  };
  countries = (e) => {
    this.setState({ newCountryObj: e });
  };
  dropdown = (e) => {
    const arr = [...this.state.data];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].fieldId === e.FieldID) {
        arr[i].value = e.Value;
        arr[i].country = e.Value;
        arr[i].fieldSetValue = e.FieldSetValue;
      }
    }
    this.setState({ data: arr, templateFieldData: arr });
  };
  calendar = (e) => {
    const arr = [...this.state.data];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].fieldId === e.FieldID) {
        arr[i].value = e.FieldSetValue;
        arr[i].fieldSetValue = e.FieldSetValue;
      }
    }
    this.setState({ data: arr, templateFieldData: arr });
  };
  checkboxHandler = (e) => {
    const arr = [...this.state.data];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].fieldId === e.FieldID) {
        if (arr[i].fieldSetValue === "False") {
          arr[i].fieldSetValue = "True";
          arr[i].value = "True";
        } else if (arr[i].fieldSetValue === "True") {
          arr[i].fieldSetValue = "False";
          arr[i].value = "False";
        }
      }
    }
    this.setState({ data: arr, templateFieldData: arr });
  };
  clickHandler = (e) => {
    this.setState({ selected: e });
  };
  textHandler = (e) => {
    let arr = this.state.changedSignFieldArr;
    let object = {
      SignFieldID: e.signfieldId,
      SignFieldValue: e.fieldSetValue,
      FieldID: e.fieldId,
      SignID: e.signId,
    };
    if (arr.length < 1) {
      arr.push(object);
    } else {
      var ind = arr
        .map((a) => {
          return a.FieldID;
        })
        .indexOf(e.fieldId);
      if (ind != -1) {
        if (arr[ind].FieldID === e.fieldId) {
          arr[ind].SignFieldValue = e.fieldSetValue;
        }
      } else {
        arr.push(object);
      }
    }
    for (let i = 0; 9 < arr.length; i++) {
      if (this.props.data.stampId != arr[i].stampId) {
        arr.splice(i, 1);
      }
    }
    this.setState({ changedSignFieldArr: arr });
    this.setState({ textHandler: e });
  };

  cancel = (e) => {
    this.setState({ showImageProof: false, imageLink: "" });
    this.props.gridData_Cancel(e);
  };
  proof = () => {
    const height = Dimensions.get("screen").width / 1.825;
    const width = Dimensions.get("screen").width;
    this.setState({ imageWidth: width, imageHeight: height });

    let zarr = [];
    let arr = [...this.state.signData.completeSignObject];
    for (let i = 0; i < arr.length; i++) {
      zarr.push({
        SignFieldID: arr[i].SignFieldID,
        SignID: arr[i].SignID,
        FieldID: arr[i].FieldID,
        SignFieldLastUpdate: arr[i].SignFieldLastUpdate,
        SignFieldValue: arr[i].SignFieldValue,
        field: {
          FieldId: arr[i].field.FieldId,
          FieldTypeId: arr[i].field.FieldTypeId,
          FieldModeTypeId: arr[i].field.FieldModeTypeId,
          FieldNatureId: arr[i].field.FieldNatureId,
          FieldLabel: arr[i].field.FieldLabel,
          FieldDescription: arr[i].field.FieldDescription,
          FieldVisible: arr[i].field.FieldVisible,
          FieldMatrixShow: arr[i].field.FieldMatrixShow,
          FieldStaticId: arr[i].field.FieldStaticId,
          FieldEnforceNoString: arr[i].field.FieldEnforceNoString,
          FieldSetValueOrIndex: arr[i].field.FieldSetValueOrIndex,
          fieldType: arr[i].field.fieldType,
          templateField: arr[i].field.templateField,
          SwapEligible: arr[i].field.SwapEligible,
          SwapManager: arr[i].field.SwapManager,
        },
        superfield: arr[i].superfield,
      });
    }
    let body = {
      // LevelSignStampID
      LevelSignStampID: this.props.gridData_Data.levelSignStampId,
      imageName: null,
      stampID: this.props.gridData_Data.stampId,
      width: "365",
      height: "200",
      divisionSurname: this.props.level.LevelUserInfo.Surname,
      jsonLocalSign: JSON.stringify(zarr),
      isSignSwapSwitch: false,
      levelId: this.props.levelId,
    };
    this.setState({ showImageProof: true });
    // this.startAnimation("half");
    data_get_image_proof(JSON.stringify(body)).then((resp) => {
      if (resp.Handling === "success") {
        this.setState({
          imageLink: resp.Model,
        });
        this.startAnimation("half");
      } else {
        this.notify("Image not available");
        this.setState({
          imageLink: "",
        });
        this.startAnimation("close");
      }
    });
  };
  startAnimation = (action) => {
    Animated.timing(this.animatedValue, {
      toValue:
        action === "half"
          ? Dimensions.get("screen").height / 2
          : // : action === "full"
            // ? Dimensions.get("screen").height
            action === "close" && 0,
      duration: 500,
      easing: Easing.ease,
    }).start();
    Animated.timing(this.animatedValueImage, {
      toValue:
        action === "half"
          ? Dimensions.get("screen").height / 2
          : // : action === "full"
            // ? 0
            action === "close" && Dimensions.get("screen").height,
      duration: 500,
      easing: Easing.ease,
    }).start();
  };

  setNewDate = (e) => {};
  render() {
    return (
      <React.Fragment>
        <Modal animationType="slide" visible={true}>
          {this.state.isLoading === true ? (
            <View style={global.alignItemsCenter}>
              <LoadingSpinner />
            </View>
          ) : (
            <React.Fragment>
              <Animated.View
                style={{
                  height: this.animatedValue.interpolate({
                    inputRange: [
                      0,
                      Dimensions.get("screen").height / 2,
                      Dimensions.get("screen").height,
                    ],
                    outputRange: [
                      Dimensions.get("screen").height,
                      Dimensions.get("screen").height / 2,
                      0,
                    ],
                  }),
                }}
              >
                <View style={[gridDataEditModal.modalWrapper]}>
                  <ScrollView
                    style={gridDataEditModal.height70}
                    nestedScrollEnabled={true}
                  >
                    <Text style={gridDataEditModal.titleText}>Edit Sign</Text>
                    <FormMaster
                      backgroundColor="#eff3fb"
                      batchTypeID={this.props.batchTypeID}
                      data={this.state.templateFieldData}
                      date={this.date}
                      country={this.addCountry}
                      countries={this.countries}
                      onChangeValue={this.textHandler}
                      dropdown={this.dropdown}
                      checkboxHandler={this.checkboxHandler}
                      calendar={this.calendar}
                    />
                  </ScrollView>
                  <View style={gridDataEditModal.margin}></View>
                </View>
                <View style={gridDataEditModal.buttonWrapper}>
                  {/* <TouchableOpacity
                    style={[
                      { backgroundColor: this.state.proofButton },
                      gridDataEditModal.greyButton,
                    ]}
                    onPress={() => this.proof()}
                  >
                    <Text style={global.textWhiteCenter}>Proof</Text>
                  </TouchableOpacity> */}
                  <TouchableOpacity
                    style={[
                      { backgroundColor: this.state.saveButton },
                      global.greyButton,
                    ]}
                    onPress={() => this.save()}
                  >
                    <Text style={global.textWhiteCenter}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[global.tomato, global.greyButton]}
                    onPress={() => this.cancel()}
                  >
                    <Text style={global.textWhiteCenter}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
              <Animated.View
                style={{
                  height: this.animatedValueImage.interpolate({
                    inputRange: [
                      0,
                      Dimensions.get("screen").height / 2,
                      Dimensions.get("screen").height,
                    ],
                    outputRange: [
                      Dimensions.get("screen").height,
                      Dimensions.get("screen").height / 2,
                      0,
                    ],
                  }),
                }}
              >
                <ImageProof
                  uri={this.state.imageLink}
                  startAnimation={this.startAnimation}
                  height={this.state.imageHeight}
                  width={this.state.imageWidth}
                  extStyle={global.marginAuto}
                />
              </Animated.View>
            </React.Fragment>
          )}
          {this.state.shouldNotify === true && (
            <View
              style={[global.zIndex, gridDataEditModal.notificationWrapper]}
            >
              <TopBarNotification text={this.state.notificationText} />
            </View>
          )}
        </Modal>
      </React.Fragment>
    );
  }
}

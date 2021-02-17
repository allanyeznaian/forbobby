import { Dimensions, StyleSheet, Platform } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";

export const global = {
  //aligning/positioning
  absolute: {
    position: "absolute",
  },
  alignItemsCenter: {
    alignItems: "center",
  },
  column: {
    flexDirection: "column",
  },
  marginAuto: {
    marginLeft: "auto",
    marginRight: "auto",
  },
  marginAutoVertical: {
    marginTop: "auto",
    marginBottom: "auto",
  },
  marginLeft15: {
    marginLeft: 15,
  },
  marginTope15: {
    marginTop: 15,
  },
  row: {
    flexDirection: "row",
  },
  topLeft0: {
    left: 0,
    top: 0,
  },
  height100: {
    height: "100%",
  },
  width100: {
    width: "100%",
  },
  width70: {
    width: "70%",
  },
  zIndex: {
    zIndex: 99999999999,
  },
  padding10: {
    padding: 10,
  },
  width200: {
    width: 200,
  },

  //wrappers
  buttonWrapper: {
    flexDirection: "row",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "auto",
    marginBottom: "auto",
  },
  modalWrapper: {
    marginLeft: "auto",
    marginRight: "auto",
    borderColor: "black",
    borderWidth: 5,
    borderRadius: 10,
    width: "90%",
    height: "55%",
    justifyContent: "center",
    marginTop: "auto",
    marginBottom: "auto",
  },

  //containers
  container: {
    display: "flex",
    width: "100%",
    alignContent: "center",
  },
  printAndStockContainer: {
    display: "flex",
    alignContent: "center",
    marginLeft: "5%",
    marginRight: "5%",
    marginTop: "2%",
    marginBottom: "2%",
  },
  subContainer: {
    borderColor: "lightgrey",
    borderWidth: 1,
  },

  //buttons
  buttonPrint: {
    width: 100,
    borderRadius: 5,
    margin: 10,
    borderColor: "lightgrey",
    borderWidth: 2,
    padding: 10,
  },
  greyButton: {
    width: 100,
    borderRadius: 5,
    margin: 30,
    borderColor: "lightgrey",
    borderWidth: 2,
    padding: 10,
  },

  //other
  header: {
    fontWeight: "bold",
    color: "#618cad",
    fontSize: 20,
  },
  loadingSpinner: {
    alignItems: "center",
    zIndex: 9999999999999999999999999999999999999999999999999999,
  },

  //Text
  bold: {
    fontWeight: "bold",
  },
  font16: {
    fontSize: 16,
  },
  text: {
    textAlign: "center",
    width: "100%",
    fontWeight: "bold",
  },
  textAlignCenter: {
    textAlign: "center",
  },
  textWhiteCenter: {
    color: "white",
    textAlign: "center",
  },

  //TextInputs
  textInput: {
    height: 50,
    marginTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    color: "#000",
    borderWidth: 1,
  },

  //backgroundColors
  white: {
    backgroundColor: "white",
  },
  blue: {
    backgroundColor: "blue",
  },
  pangeaBlue: {
    backgroundColor: "#3796ff",
  },
  tomato: {
    backgroundColor: "tomato",
  },
  lightGrey: { backgroundColor: "lightgrey" },
};

export const barCodeScanner = {
  barCodeWrapper: {
    backgroundColor: "black",
    height: Math.round(Dimensions.get("screen").height),
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  cancelText: {
    fontWeight: "bold",
    color: "white",
    fontSize: 28,
  },
  cancelTextAudit: {
    fontWeight: "bold",
    color: "white",
    fontSize: 22,
  },
  cancelWrapper: {
    backgroundColor: "transparent",
    padding: 30,
    paddingTop: 75,
    opacity: 1,
    alignItems: "center",
    marginBottom:
      (Dimensions.get("screen").height -
        Dimensions.get("window").width * 0.9 * 2) /
      2,
    marginTop: 45,
    width: Dimensions.get("window").width,
    height: "100%",
  },
  cancelWrapperAudit: {
    backgroundColor: "transparent",
    // padding: 30,
    // paddingTop: 45,
    // opacity: 1,
    alignItems: "center",
    marginBottom:
      (Dimensions.get("screen").height -
        Dimensions.get("window").width * 0.9 * 2) /
      2,
    marginTop: 15,
    width: Dimensions.get("window").width,
    height: "100%",
  },
  iconWrapper: {
    bottom: 20,
    left: Math.round(Dimensions.get("window").width) - 44,
  },
  permissionBackground: {
    backgroundColor: "black",
    height: Math.round(Dimensions.get("window").height),
    width: Math.round(Dimensions.get("window").width),
  },
  qr: {
    height: Math.round(Dimensions.get("screen").height),
    width: Math.round(Dimensions.get("screen").width),
  },
};

export const checkbox = {
  checkboxWrapper: {
    height: 36,
    width: 36,
  },
};

export const customButton = {
  button: {
    padding: 10,
    fontSize: 17,
    borderRadius: 5,
  },
  wrapper: {
    top: 0,
    backgroundColor: "white",
  },
};

export const customTextInput = {
  container: {
    alignItems: "center",
    left: 0,
    top: 0,
    backgroundColor: "white",
  },
};

export const departmentScrollView = {
  adTabButtons: {
    padding: 15,
    flexDirection: "column",
    borderWidth: 2,
  },
};

export const dropdown = {};

export const formMaster = {
  grey: {},

  calendar: {
    marginLeft: "10%",
    marginRight: "10%",
    display: "flex",
  },
  countryListWrapper: {
    width: "100%",
    borderWidth: 2,
    borderColor: "grey",
    position: "absolute",
  },
  flexStart: {
    alignItems: "flex-start",
  },
  label: {
    marginLeft: "10%",
    alignItems: "flex-start",
  },
  marginR: {
    marginLeft: "10%",
    marginBottom: "10%",
    marginRight: "10%",
  },

  labelWrapper: {
    marginLeft: "10%",
    marginRight: "10%",
    flexDirection: "row",
  },
  margin10: {
    marginBottom: "10%",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
};

export const formTextInput = {
  align: {
    alignItems: "center",
    width: "100%",
  },
  space: {
    height: 12,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: "10%",
    marginRight: "10%",
  },
  textInput: {
    height: 50,
    paddingLeft: 10,
    paddingRight: 10,
    color: "#000",
    borderWidth: 1,
  },
};

export const gridData = {
  animatedText: {
    marginTop: "auto",
    marginBottom: "auto",
    marginLeft: "auto",
    marginRight: "auto",
    fontSize: 16,
    color: "white",
  },
  animatedTextDelete: {
    marginTop: "auto",
    marginBottom: "auto",
    fontSize: 16,
    color: "white",
  },
  buttonSwipeable: {
    alignContent: "center",
    width: "25%",
  },
  checkboxAllTextWrapper: {
    marginLeft: "4%",
    marginBottom: 8,
  },
  checkboxSwipeableWrapper: {
    position: "absolute",
    alignItems: "flex-end",
  },
  checkboxWrapper: {
    width: 44,
    height: 36,
  },
  checkboxParentWrapper: {
    flexDirection: "column",
    zIndex: 999999999999,
  },
  filterBox: {
    width: "100%",
    flexDirection: "column",
  },
  flexEnd: {
    alignSelf: "flex-end",
  },
  grey: {
    backgroundColor: "grey",
  },
  gridSubItemText: {
    fontWeight: "bold",
    flexDirection: "column",
    width: "35%",
  },
  gridSubItemTextTwo: {
    flexDirection: "column",
    width: "60%",
  },
  headerFieldLabelWrapper: {
    marginLeft: "13%",
  },
  hiddenItemWrapper: {
    flexDirection: "row",
    minHeight: "100%",
    maxHeight: "100%",
  },
  iconHeaderWrapper: {
    flexDirection: "column",
    width: "15%",
    alignItems: "center",
    marginTop: 10,
  },
  iconWrapper: {
    height: 25,
    width: 30,
  },
  itemWrapper: {
    backgroundColor: "white",
    borderColor: "lightgrey",
    borderWidth: 1,
  },
  keepItemCheckboxWrapper: {
    right: 0,
  },
  marg: {
    marginTop: 0,
    marginBottom: 7,
  },
  marginAnimatedText: {
    marginRight: 35,
  },
  orange: {
    backgroundColor: "#ffab00",
  },
  renderItemWrapper: {
    position: "absolute",
    marginLeft: "2%",
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: "#DDD",
    flex: 1,
    flexDirection: "row",
  },
  scrollView: {
    height: "100%",
    width: "100%",
    marginBottom: 50,
  },
  width5: {
    width: "5%",
  },
  width25: {
    width: "25%",
  },
  width30: {
    width: "30%",
  },
  width40: {
    width: "40%",
  },
};

const h = Dimensions.get("screen").height;
const s = getStatusBarHeight();
const gH = "70%";

export const gridDataEditModal = {
  buttonWrapper: {
    flexDirection: "row",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: Platform.OS === "ios" ? "auto" : 0,
    marginBottom: Platform.OS === "ios" ? "auto" : 0,
    // marginBottom: (Platform.OS = "android" ? "20%" : "auto"),
  },
  greyButton: {
    width: 100,
    borderRadius: 5,
    margin: 5,
    borderColor: "lightgrey",
    borderWidth: 2,
    padding: 10,
  },
  height70: {
    height: "70%",
  },
  margin: {
    // marginBottom: 10,
  },
  modalWrapper: {
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: Platform.OS === "android" ? 20 : "auto",
    marginBottom: Platform.OS === "android" ? 0 : "auto",
    borderRadius: 10,
    width: "90%",
    justifyContent: "center",
    // marginTop: "auto",
    // marginBottom: "auto",
    backgroundColor: "#eff3fb",
    borderColor: "grey",
    borderWidth: 3,
    elevation: 10,
  },
  notificationWrapper: {
    position: "absolute",
    elevation: 15,
  },
  titleText: {
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 15,
    color: "#618cad",
    textAlign: "center",
  },
};

export const gridDataPromoQtyModal = {
  bottomRow: {
    flexDirection: "row",
    marginBottom: 5,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 0,
  },
  topRow: {
    flexDirection: "row",
    marginTop: 5,
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: 0,
  },
  dropdownWrapper: {
    flexDirection: "row",
    // width: "50%"
  },
  leftOutline: {
    width: "70%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  rightOutline: {
    width: "30%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  itemWrapper: {
    flexDirection: "row",
    backgroundColor: "#eff3fb",
  },
  modalWrapper: {
    backgroundColor: "#eff3fb",
    marginLeft: "auto",
    marginRight: "auto",
    borderColor: "grey",
    borderWidth: 3,
    borderRadius: 10,
    elevation: 10,
    width: "90%",
    height: "55%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "auto",
    marginBottom: "auto",
  },
  labelText: {
    fontSize: 14,
  },
  titleText: {
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 30,
    marginTop: -30,
    color: "#618cad",
  },
};

export const home = {
  adTabButtons: {
    padding: 5,
    flexDirection: "column",
    borderRadius: 0,
    borderColor: "grey",
    borderWidth: 2,
  },
  thirdRowText: {
    paddingLeft: 10,
    paddingRight: 10,
    width: 100,
  },
  wrapper: {
    minHeight: "100%",
    maxHeight: "100%",
    marginBottom: 50,
  },
};

export const homeHeader = {
  adToAndFrom: {
    marginLeft: 35,
    height: 20,
  },
  absolute: {
    flexDirection: "column",
    width: "50%",
  },
  adWrapperMargin: {
    marginLeft: 50,
  },
  containerWidth: {
    maxWidth: "100%",
    minWidth: "100%",
    width: "100%",
  },
  adTabButtons: {
    flexDirection: "column",
    borderRadius: 0,
    borderColor: "grey",
    borderWidth: 2,
  },
  deleteAllButton: {
    backgroundColor: "tomato",
    flexDirection: "row-reverse",
    borderRadius: 2,
    borderColor: "lightgrey",
    padding: 2,
  },
  dropdown: {
    width: 100,
    backgroundColor: "lightgrey",
  },
  dropdownWrapper: {
    borderColor: "lightgrey",
    borderWidth: 1,
    maxWidth: "100%",
  },
  dropdownWrapper1: {
    marginLeft: "auto",
    marginRight: "auto",
    flexDirection: "row",
    alignItems: "center",
  },
  dropdownSubWrapper: {
    alignItems: "center",
    flexDirection: "row",
  },
  img: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: "contain",
  },
  logo: {
    width: "100%",
    height: 45,
    flexDirection: "row-reverse",
    backgroundColor: "#618cad",
    paddingTop: 5,
    paddingBottom: 5,
  },
  cancelButton: {
    flexDirection: "row",
    width: "100%",
    paddingTop: 5,
    paddingBottom: 5,
  },
  marginLeft30: {
    marginLeft: 30,
  },
  marginText: {
    marginLeft: 25,
  },
  marg: {
    marginTop: 5,
    marginBottom: 5,
  },
  menuButton: {
    position: "absolute",
    height: 44,
    width: 44,
  },
  noBatchText: {
    width: "100%",
    fontWeight: "bold",
    color: "tomato",
    fontSize: 30,
    padding: 18,
  },
};

export const imagePreview = {
  imageWrapper: {
    height: "100%",
    width: "100%",
  },
};

export const loadingSpinner = {
  image: {
    height: 20,
    width: 60,
    position: "absolute",
    zIndex: 99999999999999999999999999999999999999999999,
  },
  imageWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    marginTop: Math.round(Dimensions.get("window").height) / 2,
    backgroundColor: "white",
    width: 60,
    height: 60,
    borderColor: "lightgrey",
    borderWidth: 1,
    borderRadius: 30,
    zIndex: 99999999999999999999999999999999999999999998,
    shadowColor: "black",
    shadowOffset: { width: 2, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
  },
};

export const login = {
  eye: {
    justifyContent: "flex-end",
  },
  forgotPWText: {
    color: "#3796ff",
    textDecorationLine: "underline",
  },
  forgotPWWrapper: {
    marginBottom: 10,
    left: 85,
  },
  absoluteChild: {
    // left: 283,
    top: 18,
  },
  text: {
    textAlign: "center",
    width: "100%",
    fontWeight: "bold",
    color: "white",
  },
  logo: {
    marginTop: 25,
    marginBottom: 25,
    resizeMode: "stretch",
  },
  container: {
    marginTop: 35,
    height: "100%",
    width: "100%",
    alignItems: "center",
    left: 0,
    top: 0,
    backgroundColor: "white",
  },
};

export const main = {
  small: {
    paddingHorizontal: 10,
    paddingVertical: 12,
    width: 75,
  },
  aboveNavHeight: {
    height: 98,
  },
  columnReverse: {
    flexDirection: "column-reverse",
  },
  container: {
    height: "100%",
    flex: 1,
    display: "flex",
    // marginTop: Platform.OS === "android" ? 20 : 0,
    // paddingTop: 35,
    // marginTop: getStatusBarHeight() - 7,
  },
  footer: {
    bottom: 0,
  },
  marginTop45: {
    marginTop: 45,
  },
  gap: {
    height: 88,
    position: "relative",
  },
  noSigns: {
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "auto",
    marginBottom: "auto",
    fontWeight: "bold",
    fontSize: 50,
    color: "tomato",
  },
  spinner: {
    alignItems: "center",
    marginLeft: "auto",
    marginRight: "auto",
    elevation: 9,
    zIndex: 9,
  },
  width100: {
    //global.width100
    width: "100%",
  },
};

export const modalDropdown = {
  button: {
    justifyContent: "center",
    borderColor: "black",
  },
  buttonText: {
    fontSize: 14,
    marginTop: "auto",
    marginBottom: "auto",
    // padding: 5
  },
  dropdown: {
    position: "absolute",
    height: (33 + StyleSheet.hairlineWidth) * 5,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "lightgray",
    // padding: 5,
    borderRadius: 2,
    backgroundColor: "white",
    justifyContent: "center",
  },
  highlightedRowText: {
    color: "black",
    backgroundColor: "lightgrey",
    fontWeight: "bold",
  },
  itemWrapper: {
    flexDirection: "row",
    borderWidth: 2,
    borderColor: "grey",
    borderRadius: 2,
    shadowColor: "black",
    shadowOpacity: 0.5,
    elevation: 1,
    shadowOffset: { width: 2 },
    shadowRadius: 5,
    backgroundColor: "white",
  },
  modal: {
    flexGrow: 1,
  },
  rowText: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 11,
    color: "gray",
    // backgroundColor: "white",
    textAlignVertical: "center",
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "lightgray",
  },
};

export const multiEdit = {};

export const navbar = {
  buttonStyle: {
    padding: 10,
    fontSize: 17,
    width: "100%",
    borderWidth: 1,
    borderColor: "lightgrey",
  },
  container: {
    width: "50%",
    alignContent: "flex-start",
    bottom: 95,
    right: 15,
    backgroundColor: "white",
  },
  height0: {
    height: 0,
  },
  iconWrapper: {
    alignItems: "center",
    zIndex: 99999999,
    flexDirection: "row",
    marginTop: 45,
  },
  textStyle: {
    textAlign: "center",
    width: "90%",
    fontWeight: "bold",
  },
};

export const orderStock = {
  buttonStyle: {
    marginLeft: "auto",
    marginRight: "auto",
    alignItems: "center",
    width: "80%",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#3796ff",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  cancelButtonWrapper: {
    flexDirection: "column",
    width: "20%",
    borderWidth: 1,
    borderColor: "lightgrey",
    alignItems: "center",
  },
  cancelButton: {
    elevation: 3,
    borderRadius: 3,
    borderWidth: 1,
    padding: 4,
    width: "90%",
    marginTop: "auto",
    marginBottom: "auto",
  },
  cancelButtonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: 11.5,
  },
  checkboxWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxSignWrapper: {
    marginLeft: "10%",
    flexDirection: "row",
    alignItems: "center",
  },
  headerHeight: {
    height: Platform.OS === "ios" ? 50 : 30,
  },
  image: {
    marginTop: 12.5,
    width: 125,
    borderWidth: 1,
    borderColor: "lightgrey",
    resizeMode: "contain",
  },
  loadingSpinner: {
    // marginTop: -300,
    display: "flex",
    flex: 1,
    alignItems: "center",
    alignContent: "center",
    zIndex: 99999,
    elevation: 99999,
    position: "absolute",
    marginLeft: "auto",
    marginRight: "auto",
  },
  margin: {
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 15,
  },
  margin30: {
    marginTop: 30,
  },
  orderedItemsText: {
    fontSize: 12,
  },
  orderedStockWrapper: {
    width: "95%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  orderedStockHeaderWrapper: {
    marginTop: 20,
    flexDirection: "row",
    width: "100%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  orderedStockHeaderItems: {
    flexDirection: "column",
    width: "20%",
    borderWidth: 1,
    borderColor: "lightgrey",
  },
  orderStatusText: {
    fontWeight: "bold",
    fontSize: 17,
  },
  orderWrapper: {
    marginTop: 30,
    alignItems: "center",
  },
  qtyWrapper: {
    width: 50,
    marginBottom: 12.5,
  },
  row: {
    flexWrap: "wrap",
    flexDirection: "row",
  },
  space50: {
    height: 50,
  },
  stockContainer: {
    height: "auto",
    width: 175,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: "black",
    elevation: 2,
    alignItems: "center",
  },
  text: {
    marginRight: 3,
  },
  width65: {
    width: "65%",
  },
};

export const printScreen = {
  add: {
    alignItems: "center",
    alignSelf: "center",
    height: "100%",
    borderColor: "grey",
    borderWidth: 1,
    width: "6%",
  },
  background: {
    backgroundColor: "lightgrey",
  },
  bold: {
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonPrint: {
    width: "20%",
    borderRadius: 5,
    margin: 5,
    borderColor: "lightgrey",
    borderWidth: 2,
    padding: 10,
  },
  buttonWrapper: {
    flexDirection: "row",
    marginBottom: "10%",
    marginTop: "auto",
    marginLeft: "auto",
    marginRight: "auto",
  },
  topButtonMargin: {
    flexDirection: "row",
    marginTop: 55,
  },
  closeBackground: {
    width: "7%",
    borderColor: "grey",
    borderWidth: 1,
    alignItems: "center",
    backgroundColor: "white",
  },
  closeButtonWidth: {
    width: "7%",
    borderColor: "grey",
    borderWidth: 1,
    alignItems: "center",
    textAlign: "center",
  },
  col: {
    borderColor: "grey",
    borderWidth: 1,
    flexDirection: "column",
    width: "31%",
  },
  colNoOutline: {
    flexDirection: "column",
    width: "31%",
  },
  col2: {
    borderColor: "grey",
    borderWidth: 1,
    flexDirection: "column",
    //
    // width: "29%",
    //
  },
  colNoOutline2: {
    flexDirection: "column",
    width: "29%",
  },
  font20: {
    fontSize: 25,
    // fontWeight: "bold",
  },

  headerCheckboxWrapper: {
    marginLeft: "auto",
    marginRight: "auto",
    flexDirection: "row",
    marginTop: 30,
  },
  links: {
    textAlign: "center",
    color: "blue",
    padding: 5,
  },
  margin: {
    marginTop: 10,
  },
  savedItemsText: {
    color: "white",
    fontWeight: "bold",
  },
  scrollViewHeight: {
    height: "45%",
  },
};

export const printSignBatch = {
  batchList: {
    position: "absolute",
    borderColor: "grey",
    borderWidth: 2,
  },
  proceedButton: {
    marginLeft: "auto",
    marginRight: "auto",
    alignItems: "center",
    width: "80%",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  pdfLink: {
    color: "blue",
    padding: 5,
    textAlign: "center",
  },
  pdfLinkWrapper: {
    backgroundColor: "#eff3fb",
    padding: 5,
    borderColor: "black",
    borderBottomWidth: 1,
    borderTopWidth: 1,
  },
  pdfLinkWrapperAlt: {
    backgroundColor: "#d3d3d3",
    padding: 5,
    borderColor: "grey",
    borderBottomWidth: 1,
    borderTopWidth: 1,
  },
  proceedText: {
    fontWeight: "bold",
    fontSize: 17,
    color: "white",
  },
  noBatchesText: {
    marginLeft: "auto",
    marginRight: "auto",
    fontSize: 28,
    marginTop: 44,
    fontWeight: "bold",
    color: "tomato",
  },
  wrapper: {
    marginBottom: 50,
  },
};

export const search = {
  buttonWrapper: {
    flexDirection: "column",
    width: "25%",
    alignContent: "center",
  },
  cancelButton: {
    position: "absolute",
    right: 5,
  },
  cancelText: {
    color: "white",
    padding: 5,
  },
  container: {
    backgroundColor: "white",
    width: "80%",
    borderWidth: 2,
    borderRadius: 2,
    borderColor: "black",
    elevation: 9,
    marginTop: 200,
    marginLeft: "auto",
    marginRight: "auto",
    paddingBottom: 10,
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 5,
      width: 5,
    },
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 2,
  },
  header: {
    backgroundColor: "#618cad",
    height: 30,
    width: "100%",
    alignContent: "center",
    flexDirection: "row",
  },
  headerText: {
    padding: 5,
    color: "white",
    display: "flex",
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
    fontWeight: "bold",
    textAlign: "center",
  },
  instructionsText: {
    textAlign: "center",
    marginTop: 7,
    color: "grey",
  },
  outsidePopup: {
    position: "absolute",
    height: Math.round(Dimensions.get("window").height),
    width: Math.round(Dimensions.get("window").width),
  },
  textInputWrapper: {
    flexDirection: "column",
    width: "60%",
    alignItems: "center",
  },
  barcodeWrapper: {
    width: "15%",
  },
};

export const topBarNotification = {
  container: {
    zIndex: 999,
    elevation: 999,
    width: Math.round(Dimensions.get("window").width),
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
  },
  notification: {
    zIndex: 999,
    elevation: 999,
    width: Math.round(Dimensions.get("window").width),
    // position: "absolute",
    height: 60,
    paddingHorizontal: 7,
    paddingVertical: 15,
    left: 0,
    top: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationText: {
    color: "#FFF",
  },
};

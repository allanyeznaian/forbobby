//contents:
//modal methods, modals begin
//filter method, filter begin
//swipeable methods swipeable begin
//delete button begin --if swiped right
//delete api methods
//edit button begin, promo qty button end --if swiped left
//checkbox method, checkbox begin

//props:
//home_Data: this is the complete Signs array from the load user bucket response
//showPrintScreen: bool
//home_EnableMultipleSelectFromGrid: bool
//promoLevelStamps: promo level stamps for the GridDataPromoModal.js component
//ahead: the current ahead
//isLoading(bool): displays LoadingSpinner.js component from the Main.js component
//notify(string): displays the topBarNotification.js Component
//getBatchData(e.BatchTypeId)
//getCall():this calls the api for load user bucket

import React, { Component } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  Dimensions,
  View,
  Alert,
  Modal,
  TouchableHighlightBase,
} from "react-native";
import Icon from "./reusable/Icon";
import ListSignGrid from "./reusable/ListSignGrid";
import CustomTextInput from "./reusable/CustomTextInput";
import GridDataEditModal from "./GridDataEditModal";
import GridDataPromoQtyModal from "./GridDataPromoQtyModal";
import Checkbox from "./reusable/Checkbox";
import PrintScreen from "./PrintScreen";
import { data_delete_sign } from "../scripts/API";
import { SwipeListView, SwipeRow } from "react-native-swipe-list-view";
import TopBarNotification from "./reusable/TopBarNotification";
import { gridData, global } from "../Styles/Styles";
import BarCodeScannerComponent from "./reusable/BarCodeScanner";
import { setCalled, setMultipleSelectedHandlerArr } from "../App";

export default class GridData extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      UPCText: "",
      showExitScannedButton: false,
      multiEditTrigger: false,
      backgroundColor: "#ececec",
      dataForEditAndPromo: [],
      arr: this.props.home_Data,
      filteredArr: this.props.home_Data,
      multipleSelectedHandlerArray: [],
      multipleSelectedHandlerArrayNew: [],
      search: "",
      showEditModal: false,
      showPromoModal: false,
      showSearchPrompt: false,
      showPrintScreen: this.props.showPrintScreen,
      enableMultipleSelectFromGrid: this.props
        .home_EnableMultipleSelectFromGrid,
      width: Math.round(Dimensions.get("window").width),
      arrFinal: [],
      promoLevelStamps: this.props.promoLevelStamps,
      reloadCheckbox: false,
      ahead: this.props.ahead,
      i: "",
      allArrSelected: false,
      width: Math.round(Dimensions.get("window").width),
      shouldNotify: false,
      notificationText: "",
      scroll: true,
      arrayChunks: [],
      chunkIndex: 0,
      prevChunkIndex: "",
      showScanner: false,
      scannedArr: [],
      showScannedItems: false,
      isFilteringScanned: false,
      exiting: false,
      keepItemArray: [],
      manageStore: false,
      multiEditActivate: false,
      currentScannedItem: "",
      confirmMultipleReviewArr: [],
      confirmMultipleReviewVisible: false,
    };
    this.oldState = {};
    this.refsArray = [];
    this.prevOpenedRow;
  }
  componentDidMount = () => {
    // this.props.isLoading(true);
    this._isMounted = true;
    // if (this.props.hideFilter === true) {
    //   this.props.isLoading(false);
    // }
    // this.props.isLoading(false);
    // if (this.props.superData.completeSignObject.length < 1) {
    //   this.props.isLoading(false);
    // }
  };
  showPrintScreen = (bool, e) => {
    if (e === "Published") {
      this.props.notify("Published");
      this.setState({ showPrintScreen: bool });
    } else if (e === "auditMode") {
      this.props.audit(bool);
      this.setState({ showExitScannedButton: true });
      // this.exitScanned();
      this.setState({ auditMode: true });
    } else {
      this.setState({ showPrintScreen: bool, auditMode: false });
    }
  };

  //dropdown method for batchedit
  dropdownHandler = (e) => {
    this.setState({ currentBatch: e });
    this.props.getBatchData(e.BatchTypeId);
    setTimeout(() => {
      this.reload();
    }, 100);
  };
  //modal methods
  promoQuantity = (e, s) => {
    this.setState({
      data: e,
      levelSignIdForData: s.item.levelSignId,
      showPromoModal: true,
    });
  };
  edit = (e, data) => {
    this.setState({
      data: e,
      showEditModal: true,
    });
  };
  gridDataPromoModal_Cancelled = (e, info) => {
    setTimeout(() => {
      this.setState({ showPromoModal: false });
      if (e === "notify created") {
        this.props.getCall("frompromo");
        this.props.notify("2nd Sign Created");
        this.setState({
          showPromoModal: false,
        });
        this.reload();
      } else if (e === "sign updated") {
        if (info === "Updating Searched") {
          this.props.setSearched(true);
        } else {
          this.props.setSearched(false);
        }
        this.props.getCall("frompromo");
        this.props.notify("Sign Updated");
        this.setState({ showPromoModal: false });
        this.reload();
      } else if (e === "updated scanned") {
        if (info == "Updating Searched") {
          this.props.setSearched(true);
        } else {
          this.props.setSearched(false);
        }

        this.props.notify("Sign updated");
        let arr = [...this.state.scannedArr];
        this.props.getCall(null, null, arr);
        this.handleScanner(arr, null, true);
        this.setState({ showPromoModal: false });
      } else {
        this.setState({ showPromoModal: false });
      }
    }, 100);
  };
  gridDataEditModal_Cancelled = (e, info, mul) => {
    this.setState({ showEditModal: false });
    if (e === "sign updated") {
      this.props.notify("Sign Updated");
      if (info === "Updating Searched") {
        this.props.setSearched(true);
      } else {
        this.props.setSearched(false);
      }
      this.props.getCall("fromedit");
      this.setState({ showEditModal: false });
      if (mul === "MultiEdit") {
        this.setState({ multiEditActivate: false });
      }
    } else if (e === "updated scanned" && info != "Updating Searched") {
      this.props.setSearched(false);
      this.props.notify("Sign updated");

      let arr = [...this.state.scannedArr];
      this.props.getCall("fromedit", null, arr);
      this.handleScanner(arr, null, true);
      this.setState({ showEditModal: false });
    } else if (e === "updated scanned" && info == "Updating Searched") {
      this.props.setSearched(true);
      this.props.notify("Sign updated");
      let arr = [...this.state.scannedArr];
      this.props.getCall("fromedit", null, arr);
      this.handleScanner(arr, null, true);
      this.setState({ showEditModal: false });
    } else {
      this.setState({ showEditModal: false });
    }
  };
  //delete api methods
  delete = (e) => {
    this.props.isLoading(true);
    this.setState({ showNotification: false });
    const body = {
      LevelSignID: e,
    };
    data_delete_sign(body).then((resp) => {
      if (resp.Handling === "success") {
        this.props.getCall("deleted");
        const obj = { levelSignId: e };
        this.multipleSelectedHandler(obj, true, true);
      } else if (resp.Handling === "failed") {
        this.props.notify("network error");
      }
    });
  };
  //---------------------
  uncheckAll = () => {
    this.setState({
      multipleSelectedHandlerArray: [],
      allArrSelected: false,
    });
    setMultipleSelectedHandlerArr([]);
    this.props.home_EnableDeleteSelected([]);
    this.reload();
  };
  //reload method
  reload = () => {
    setCalled(false);
    this.props.isLoading(true);
    this.setState(
      {
        reloadCheckbox: true,
      },
      () => {
        this.setState({ reloadCheckbox: false });
      }
    );
  };
  filter = (e) => {
    this.setState({ search: e });
    setTimeout(() => {
      let data =
        this.state.showScannedItems === true
          ? [...this.state.scannedArr]
          : [...this.props.home_Data];
      data = data
        .filter(function (item) {
          return (
            item.headerone.toLowerCase().includes(e.toLowerCase()) ||
            item.headertwo.toLowerCase().includes(e.toLowerCase()) ||
            item.headerthree.toLowerCase().includes(e.toLowerCase())
          );
        })
        .map(function ({
          key,
          id,
          levelSignId,
          headerone,
          headeroneFieldLabel,
          headertwo,
          headertwoFieldLabel,
          headerthree,
          headerthreeFieldLabel,
          promo,
          qty,
          qtyDefault,
          ahead,
          stampId,
          levelSignStampId,
          signLastUpdated,
        }) {
          return {
            key,
            id,
            levelSignId,
            headerone,
            headeroneFieldLabel,
            headertwo,
            headertwoFieldLabel,
            headerthree,
            headerthreeFieldLabel,
            promo,
            qty,
            qtyDefault,
            ahead,
            stampId,
            levelSignStampId,
            signLastUpdated,
          };
        });
      const arrayChunks = [].concat.apply(
        [],
        data.map(function (elem, i) {
          return i % 10 ? [] : [data.slice(i, i + 10)];
        })
      );
      // const arrayChunks = data.chunk_inefficient(20);
      this.setState(
        {
          arrayChunks: arrayChunks,
          filteredArr:
            e.length > 0
              ? data
              : this.state.showScannedItems === true
              ? this.state.scannedArr
              : this.props.home_Data,
          isFilteringScanned:
            this.state.showScannedItems === true && e.length > 0 ? true : false,
          dataForEditAndPromo: this.props.home_Data,
          prevChunkIndex: this.state.chunkIndex,
          reloadCheckbox: true,
          loading: false,
        },
        () => {
          this.setState({ reloadCheckbox: false });
        }
      );
      if (e.length > 0) {
        this.setState({ chunkIndex: 0 });
      }
    }, 10);
  };
  // swipe, then based on index use
  resetTextInput = () => {
    this.filter("");
  };
  //-----------------------------

  //checkbox method
  //this is the method that enables you to select/deselect multiple signs
  selectAll = (e) => {
    if (this.state.auditMode === true) {
      // setTimeout(() => {
      const arr = [...this.state.scannedArr];
      this.setState({
        multipleSelectedHandlerArray: arr,
        allArrSelected: true,
      });
      setMultipleSelectedHandlerArr(arr);
      this.props.home_EnableDeleteSelected(arr);
      this.reload();
      // }, 1000);
    } else if (
      this.state.showScannedItems === true &&
      this.state.allArrSelected === false
    ) {
      const arr = [...this.state.scannedArr];
      this.setState({
        multipleSelectedHandlerArray: arr,
        allArrSelected: true,
      });
      setMultipleSelectedHandlerArr(arr);
      this.props.home_EnableDeleteSelected(arr);
      this.reload();
    } else if (this.state.allArrSelected === false) {
      const arr = [...this.props.home_Data];
      this.setState({
        multipleSelectedHandlerArray: arr,
        allArrSelected: true,
      });
      setMultipleSelectedHandlerArr(arr);
      this.props.home_EnableDeleteSelected(arr);
      this.reload();
    } else if (this.state.allArrSelected === true) {
      this.props.home_EnableDeleteSelected([]);
      this.setState({
        multipleSelectedHandlerArray: [],
        allArrSelected: false,
      });
      setMultipleSelectedHandlerArr([]);
      this.reload();
    }
    if (e === "audit") {
      this.showPrintScreen(true, "auditMode");
    }
  };
  multipleSelectedHandler = (id, bool, deleted) => {
    // alert(id);
    const arr = [...this.state.multipleSelectedHandlerArray];
    const newArr = [];
    var index = arr.findIndex(function (o) {
      if (id.levelSignId == undefined) {
        return o.levelSignId === id;
      } else {
        return o.levelSignId === id.levelSignId;
      }
    });
    if (index !== -1) arr.splice(index, 1);
    else {
      arr.push(id);
    }
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].ahead == this.props.ahead) {
        newArr.push(arr[i]);
      }
    }
    this.setState({
      multipleSelectedHandlerArray: arr,
    });
    // if (deleted === true) {
    // }
    if (bool === true) {
      this.reload();
    }
    setMultipleSelectedHandlerArr(arr);
    this.props.home_EnableDeleteSelected(arr);
  };
  //------------------------------
  showFilteredOnly = () => {
    if (this.state.showCheckedFilter === true) {
      this.setState({ showCheckedFilter: false });
    } else {
      this.setState({ showCheckedFilter: true });
    }
  };
  loadMore = (n) => {
    this.props.isLoading(true);
    let index = this.state.chunkIndex;
    for (let i = 0; i < this.state.arrayChunks.length; i++) {
      if (n === "forward") {
        if (this.state.chunkIndex <= this.state.arrayChunks.length - 2) {
          this.setState({ chunkIndex: index + 1 });
        }
      }
      if (n === "back") {
        if (this.state.chunkIndex > 0) {
          this.setState({ chunkIndex: index - 1 });
        }
      }
    }
    this.reload();
  };
  resetPagination = () => {
    setTimeout(() => {}, 100);

    this.setState({
      chunkIndex: +0,
    });
  };
  layout = (data) => {
    setCalled(false);
    const arr =
      this.state.showScannedItems === false
        ? this.state.arrayChunks[this.state.chunkIndex]
        : this.state.isFilteringScanned === true
        ? this.state.filteredArr
        : this.state.scannedArr;
    if (data.item.levelSignId === arr[arr.length - 1].levelSignId) {
      this.props.isLoading(false);
    }
  };
  layoutMandatory = (aaa) => {
    this.props.isLoading(false);
    if (this.props.nonEditable === true) {
      this.props.isLoading(false);
    }
  };
  showScanner = (bool, action) => {
    if (bool === true || bool === false) {
      this.setState({ auditMode: action === "Audit" ? true : false }, () =>
        this.setState({ showScanner: true })
      );
    } else {
      this.setState({ showScanner: true, auditMode: false });
    }
  };
  confirmMultipleReview = (e) => {
    this.setState({
      confirmMultipleReviewArr: e,
      confirmMultipleReviewVisible: true,
    });
    // console.log(
    //   "THIS IS IN CONFIRMMULTIPLEREVIEW",
    //   e.map((a) => {
    //     return JSON.stringify({ levelsignid: a.levelSignId, signID: a.id });
    //   })
    // );
  };
  handleScanner = (data, bool, refreshBool) => {
    // console.log(data);

    //if item "does not exist"
    //check to see what the department is
    //
    //get item from db INSTEAD of matrix array, then compare to the data that was scanned
    //if scanned item is out of date and incorrect
    //
    //get item from db INSTEAD of matrix array and do the SAME THING IT ALREADY DOES
    //BUT you need to create a new array for the matrix with the new items
    //
    let currentItemArr = [];
    this.setState({ textForBarcode: JSON.stringify(data) });
    let currentScannedItem = "";
    if (bool === "getStampId") {
      let newArr = [...this.props.home_Data];
      for (let i = 0; i < newArr.length; i++) {
        for (let z = 0; z < newArr[i].completeSignObject.length; z++) {
          if (
            newArr[i].completeSignObject[z].SignFieldValue ===
            this.state.UPCText
          ) {
            currentScannedItem = newArr[i];
            return newArr[i];
          }
        }
      }
    } else if (this.state.scannedArr.length == "0" && !data) {
      this.props.showScannedGrid(false);
      this.props.showScannedItems(false);
      this.setState({ showScanner: false });
    } else {
      this.props.showScannedGrid(true);
      var scannedArr = [...this.state.scannedArr];
      let newArr = [...this.props.home_Data];

      if (bool === "continue") {
        for (let i = 0; i < newArr.length; i++) {
          for (let z = 0; z < newArr[i].completeSignObject.length; z++) {
            if (newArr[i].completeSignObject[z].SignFieldValue === data.data) {
              currentScannedItem = newArr[i];
              scannedArr.push(newArr[i]);
              currentItemArr.push(newArr[i]);
            }
          }
        }
      } else if (bool === "addItem") {
        for (let i = 0; i < newArr.length; i++) {
          for (let z = 0; z < newArr[i].completeSignObject.length; z++) {
            if (newArr[i].completeSignObject[z].SignFieldValue === data.data) {
              currentScannedItem = newArr[i];
              scannedArr.push(newArr[i]);
              currentItemArr.push(newArr[i]);
            }
          }
        }

        this.setState({ showScanner: false });
      } else if (refreshBool === true) {
        const emptyArr = [];
        this.setState({ showEditModal: false, showPromoModal: false });
        for (let i = 0; i < newArr.length; i++) {
          for (let z = 0; z < scannedArr.length; z++) {
            if (newArr[i].levelSignId === scannedArr[z].levelSignId) {
              scannedArr.splice(z, 1);
              scannedArr.push(newArr[i]);
              currentScannedItem = newArr[i];
            }
          }
        }
      } else {
        this.setState({ showScanner: false });
      }
      // const unique = [...new Set(scannedArr)]; this was changed because of wanting to add the same item to matrix
      const unique = scannedArr;

      if (unique.length > 0) {
        this.props.showScannedItems(true);
      } else {
        this.props.showScannedItems(false);
      }
      const arrayChunks = [].concat.apply(
        [],
        unique.map(function (elem, i) {
          return i % 10 ? [] : [unique.slice(i, i + 10)];
        })
      );
      this.setState(
        {
          scannedArr: unique,
          arrayChunks: arrayChunks,
          showScannedItems: unique.length > 0 ? true : false,
          currentScannedItem: currentScannedItem,
        },
        () => {
          this.reloadData();
          if (refreshBool === "auditMode") {
            // const arr = [...this.state.scannedArr];
            this.selectAll("audit");
          }
        }
      );
    }
    if (currentItemArr.length > 1) {
      // Alert.alert("MULTIPLE ITEMS WITH THE SAME UPC, PLEASE CHECK SELECTED ITEMS");
      Alert.alert(
        "MULTIPLE ITEMS WITH THE SAME UPC DETECTED",
        "PLEASE MANUALLY REVIEW THE CHECKMARKED ITEMS",
        [
          // { text: "Cancel", onPress: null },
          {
            text: "OK",
            onPress: () => this.confirmMultipleReview(currentItemArr),
          },
        ]
        // { cancelable: true }
      );
    }
    this.setState({ UPCText: "" });
  };
  UPCReset = () => {
    this.setState({ UPCText: "" });
  };
  noScanner = () => {
    this.setState({
      scannedArr: [],
      showScannedGrid: false,
      showScannedItems: false,
    });
  };
  reloadData = () => {
    setCalled(false);
    this.setState({ reloadData: true });
    setTimeout(() => {
      this.setState({ reloadData: false });
    }, 5);
    this.setState({ showScannedItems: false }, () => {
      this.setState({ showScannedItems: true });
    });
  };
  removeScannedItemGrid = () => {
    setCalled(false);
    this.props.showScannedItems(false);
    this.setState({ showScannedItems: false, scannedArr: [] });
  };
  exitScanned = (action) => {
    setCalled(false);
    if (action === "fromedit") {
    } else {
      this.props.getCall();
    }
    this.props.showScannedItems(false);
    this.setState({
      exiting: true,
      showScannedItems: false,
      scannedArr: [],
      isFilteringScanned: false,
      filteredArr: action == "fromedit" ? [] : this.props.home_Data,
      arr: action == "fromedit" ? [] : this.props.home_Data,
    });
    if (action != "fromedit") {
      this.reload();
    }
    // this.reload();
  };
  removeScannedItemFromArray = (e) => {
    const arr = [...this.state.scannedArr];
    const arrChunk = [...this.state.arrayChunks[this.state.chunkIndex]];
    const mArr = [...this.state.multipleSelectedHandlerArray];

    mArr.map((a, index) => {
      a.levelSignId === e && mArr.splice(index, 1);
    });
    this.setState({ multipleSelectedHandlerArray: mArr });
    arrChunk.map((a, index) => {
      a.levelSignId === e && arrChunk.splice(index, 1);
    });

    if (arr.length > 1) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].levelSignId === e) {
          arr.splice(i, 1);
          this.setState({ scannedArr: arr }, () => {
            this.handleScanner(this.state.textForBarcode);
          });
        }
      }
    } else if (this.state.auditMode === true) {
      this.setState({
        showScannedItems: false,
        scannedArr: [],
        auditMode: false,
      });
      this.props.backToHome("goBackAllTheWay");
    } else {
      this.props.backToHome("goBackAllTheWay");
      this.setState({ showScannedItems: false, scannedArr: [] });
    }
  };
  triggerMultiEdit = () => {
    this.setState({ multiEditTrigger: true });
  };
  onRowDidOpen = (rowKey) => {};
  activateSearch = (signType) => {
    this.setState({ showSearchPrompt: true, currentSignTypeID: signType });
  };
  refreshBatchEdit = () => {
    setCalled(false);
    this.props.refreshBatchEdit();
  };
  keepItems = (data, action, signType) => {
    if (action === "ADD_ITEM") {
      this.props.keepItems(data, action, signType);
    } else if (action === "REMOVE_ITEM") {
      this.props.keepItems(data, action, signType);
    }
  };
  multiEditActivate = () => {
    this.setState({ multiEditActivate: true });
  };
  multiEditCancel = () => {
    this.setState({ multiEditActivate: false });
  };
  activateEditFromPrint = (data) => {
    this.edit(data);
  };
  //renders the rows
  renderItem = (data, rowKey) => (
    // this.props.loading(false),
    <View
      onLayout={(event) => {
        this.layoutMandatory(data);
      }}
      key={rowKey}
      style={[
        gridData.itemWrapper,
        {
          backgroundColor: data.index % 2 == 0 ? "#eff3fb" : "#d3d3d3",
        },
      ]}
    >
      <View style={[global.row, gridData.renderItemWrapper]}>
        {/* checkbox begin */}
        {this.state.reloadCheckbox === false && (
          <View style={gridData.checkboxSwipeableWrapper}>
            <Checkbox
              arr={this.state.multipleSelectedHandlerArray}
              selectAll={false}
              id={data.item.levelSignId}
              onPress={() => this.multipleSelectedHandler(data.item)}
              disabled={this.props.disabled}
            />
          </View>
        )}
        {/* checkbox end */}
        <Text
          style={{
            color: this.state.selected === data ? "white" : "black",
          }}
        >
          {this.props.home_EnableMultipleSelectFromGrid}
        </Text>
      </View>

      <View style={[global.column, gridData.headerFieldLabelWrapper]}>
        <View style={global.row}>
          <Text style={[gridData.gridSubItemText]}>
            {JSON.stringify(data.index)}
            {data.item.headeroneFieldLabel
              ? data.item.headeroneFieldLabel + ": "
              : ""}
          </Text>
          <Text style={gridData.gridSubItemTextTwo}>{data.item.headerone}</Text>
        </View>
      </View>
      <View style={gridData.headerFieldLabelWrapper}>
        <View style={global.row}>
          <Text style={gridData.gridSubItemText}>
            {data.item.headertwoFieldLabel
              ? data.item.headertwoFieldLabel + ": "
              : ""}
          </Text>
          <Text style={gridData.gridSubItemTextTwo}>{data.item.headertwo}</Text>
        </View>
      </View>
      <View style={gridData.headerFieldLabelWrapper}>
        <View style={global.row}>
          <Text style={gridData.gridSubItemText}>
            {data.item.headerthreeFieldLabel
              ? data.item.headerthreeFieldLabel + ": "
              : ""}
          </Text>
          <Text style={gridData.gridSubItemTextTwo}>
            {data.item.headerthree}
          </Text>
        </View>
      </View>
    </View>
  );

  // renders the items behind the row ~ delete, edit, and promo
  renderHiddenItem = (data, rowKey) => (
    <View
      onLayout={(event) => {
        this.layout(data);
      }}
      key={rowKey}
      style={gridData.hiddenItemWrapper}
    >
      {/* delete button begin */}
      {this.state.showScannedItems === false ? (
        <TouchableOpacity
          style={[global.tomato, gridData.width40, global.alignItemsCenter]}
          onPress={() =>
            Alert.alert(
              "",
              data.item.headerone.length > 0
                ? "Permanently Delete Sign " +
                    JSON.stringify(data.item.headerone) +
                    "?"
                : "Permanently Delete Sign?",
              [
                { text: "Cancel", onPress: null },
                {
                  text: "OK",
                  onPress: () => this.delete(data.item.levelSignId),
                },
              ],
              { cancelable: true }
            )
          }
          disabled={this.props.disabled}
        >
          <Text
            style={[
              gridData.animatedTextDelete,
              global.textAlignCenter,
              gridData.marginAnimatedText,
            ]}
          >
            DELETE
          </Text>
          <View
            style={[
              gridData.animatedTextDelete,
              global.textAlignCenter,
              gridData.marginAnimatedText,
            ]}
          >
            <Icon
              functionality="icon"
              size={30}
              source={require("../assets/vectoricons/trash.png")}
            />
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[global.tomato, gridData.width40, global.alignItemsCenter]}
          onPress={() =>
            Alert.alert(
              "",
              "Remove Scanned Item" + " " + data.item.headerone.length > 0
                ? "Remove Scanned Item" +
                    " " +
                    JSON.stringify(data.item.headerone) +
                    "?"
                : data.item.headertwo.length > 0
                ? "Remove Scanned Item" +
                  " " +
                  JSON.stringify(data.item.headertwo) +
                  "?"
                : data.item.headerthree.length > 0
                ? "Remove Scanned Item" +
                  " " +
                  JSON.stringify(data.item.headerthree) +
                  "?"
                : +"item" + "?",
              [
                { text: "Cancel", onPress: null },
                {
                  text: "OK",
                  onPress: () =>
                    this.removeScannedItemFromArray(data.item.levelSignId),
                },
              ],
              { cancelable: true }
            )
          }
          disabled={this.props.disabled}
        >
          <Text
            style={[
              gridData.animatedTextDelete,
              global.textAlignCenter,
              gridData.marginAnimatedText,
            ]}
          >
            Remove
          </Text>
          <View
            style={[
              gridData.animatedTextDelete,
              global.textAlignCenter,
              gridData.marginAnimatedText,
            ]}
          >
            <Icon
              functionality="icon"
              size={30}
              source={require("../assets/vectoricons/trash.png")}
            />
          </View>
        </TouchableOpacity>
      )}

      <View style={gridData.width5} />
      {/* delete button end )} */}
      {/* edit button begin */}
      <TouchableOpacity
        style={[gridData.buttonSwipeable, gridData.grey, gridData.width30]}
        onPress={() => this.edit(data.item, data)}
        disabled={this.props.disabled}
      >
        <Text style={[gridData.animatedText]}>Edit</Text>
      </TouchableOpacity>
      {/* edit button end */}

      {/* promo qty button begin */}
      <TouchableOpacity
        style={[gridData.buttonSwipeable, gridData.orange, gridData.width25]}
        onPress={() => this.promoQuantity(data.item, data)}
        disabled={this.props.disabled}
      >
        <Text style={[gridData.animatedText]}>Promo & {"\n"}Quantity</Text>
      </TouchableOpacity>
      {/* promo qty button end */}
    </View>
  );

  backToHome = () => {
    this.setState(
      { auditMode: false, showScanner: false, auditModeTest: "" },
      () => {
        this.props.backToHome();
      }
    );
  };
  onChangeText = (e) => {
    this.setState({ UPCText: e });
  };
  render() {
    // this will be to review multiple items that have the same UPC when auditing
    // if (this.state.confirmMultipleReviewVisible === true) {
    //   <Modal>
    //   <SwipeListView
    //   data={
    //     this.state.showScannedItems === false
    //       ? this.state.arrayChunks[this.state.chunkIndex]
    //       : this.state.isFilteringScanned === true
    //       ? this.state.filteredArr
    //       : this.state.arrayChunks[this.state.chunkIndex]
    //     // this.state.scannedArr
    //   }
    //   // windowSize={10}
    //   renderItem={this.renderItem}
    //   renderHiddenItem={
    //     !this.props.nonEditable ? this.renderHiddenItem : () => {}
    //   }
    //   leftOpenValue={
    //     this.props.auditMode === true
    //       ? this.state.width / 3
    //       : this.props.ahead === -2
    //       ? 0.1
    //       : this.props.home_EnableDeleteSelected === false
    //       ? 0.1
    //       : this.state.width / 3
    //   }
    //   rightOpenValue={-this.state.width / 2}
    //   stopLeftSwipe={
    //     this.props.auditMode === true
    //       ? this.state.width / 3
    //       : this.props.ahead === -2
    //       ? 0.1
    //       : this.props.home_EnableDeleteSelected === false
    //       ? 0.1
    //       : this.state.width / 3
    //   }
    //   friction={80}
    //   stopRightSwipe={-this.state.width / 2}
    //   // keyExtractor={(data, rowKey) => JSON.stringify(rowKey + 1)}
    //   scrollEnabled={true}
    //   showsVerticalScrollIndicator={true}
    //   swipeToOpenVelocityContribution={76}
    //   closeOnScroll={false}
    //   closeOnRowPress={false}
    // />
    //   </Modal>;
    // } else
    // this if statement allows for the component to refresh
    if (this.props.home_Trigger === false) {
      return (
        <React.Fragment>
          {this.state.shouldNotify === true && (
            <TopBarNotification text={this.state.notificationText} />
          )}
          {this.state.showScanner === true && (
            <Modal>
              <BarCodeScannerComponent
                UPCReset={this.UPCReset}
                UPCText={this.state.UPCText}
                onChangeText={this.onChangeText}
                text={this.state.textForBarcode}
                backToHome={this.backToHome}
                auditModeFromProps={this.props.auditMode}
                auditMode={
                  // this.props.surName === "pst" ? true : false
                  true
                  // this.state.auditMode === true
                  //   ? true
                  //   : this.state.auditModeTest === "auditMode"
                  //   ? true
                  //   : this.props.auditMode === true
                  //   ? true
                  //   : false
                }
                currentScannedItem={this.state.currentScannedItem}
                isForForm={false}
                handleScanner={this.handleScanner}
                mainData={this.props.home_Data}
                scannedArr={this.state.scannedArr}
                gridData_Data={this.state.data}
              />
            </Modal>
          )}
          {/* modals begin */}
          {this.state.multiEditActivate === true &&
            this.state.multiEditTrigger === false && (
              <React.Fragment>
                {/* <View style={{ height: "50%" }}>
                <GridDataEditModal
                  isScannedArrShowing={this.state.showScannedItems}
                  batchTypeID={this.props.batchTypeID}
                  superData={this.props.home_Data}
                  gridData_Data={this.state.data}
                  gridData_Cancel={this.gridDataEditModal_Cancelled}
                  levelSignId={this.state.levelSignIdForData}
                  levelId={this.props.levelId}
                  isSearched={this.props.isSearched}
                  isSearchedOriginally={this.props.isSearchedOriginally}
                />
              </View> */}
                <View style={{ height: "50%" }}>
                  <PrintScreen
                    triggerMultiEdit={this.triggerMultiEdit}
                    LevelUserInfoBuildBatch={this.props.LevelUserInfoBuildBatch}
                    activateEditFromPrint={this.activateEditFromPrint}
                    multiEditActivate={true}
                    storedSigns={[]}
                    keepItems={this.keepItems}
                    uncheckAll={this.uncheckAll}
                    notify={this.props.notify}
                    data={this.state.multipleSelectedHandlerArray}
                    gridData_Cancel={this.multiEditCancel}
                    headeroneFieldLabel={this.props.headeroneFieldLabel}
                    headertwoFieldLabel={this.props.headertwoFieldLabel}
                    headerthreeFieldLabel={this.props.headerthreeFieldLabel}
                    delete={this.multipleSelectedHandler}
                    ahead={this.props.ahead}
                    currentSignTypeID={this.props.currentSignTypeID}
                    levelUserInfoId={this.props.levelUserInfoId}
                    levelId={this.props.levelId}
                    refresh={this.refreshBatchEdit}
                    batchEdit={this.props.batchEdit}
                    currentBatch={this.state.currentBatch}
                    refreshBatchEdit={this.props.refreshBatchEdit}
                  />
                </View>
              </React.Fragment>
            )}

          {this.state.showPrintScreen === true && (
            <PrintScreen
              auditMode={
                this.state.auditMode === true
                  ? true
                  : this.state.auditModeTest === "auditMode"
                  ? true
                  : this.props.auditMode === true
                  ? true
                  : false
              }
              scannedArr={this.state.scannedArr}
              LevelUserInfoBuildBatch={this.props.LevelUserInfoBuildBatch}
              multiEditActivate={false}
              storedSigns={[]}
              keepItems={this.keepItems}
              uncheckAll={this.uncheckAll}
              notify={this.props.notify}
              data={this.state.multipleSelectedHandlerArray}
              gridData_Cancel={this.showPrintScreen}
              headeroneFieldLabel={this.props.headeroneFieldLabel}
              headertwoFieldLabel={this.props.headertwoFieldLabel}
              headerthreeFieldLabel={this.props.headerthreeFieldLabel}
              delete={this.multipleSelectedHandler}
              ahead={this.props.ahead}
              currentSignTypeID={this.props.currentSignTypeID}
              levelUserInfoId={this.props.levelUserInfoId}
              levelId={this.props.levelId}
              refresh={this.refreshBatchEdit}
              batchEdit={this.props.batchEdit}
              currentBatch={this.state.currentBatch}
              refreshBatchEdit={this.props.refreshBatchEdit}
            />
          )}
          {this.state.showEditModal === true ? (
            <GridDataEditModal
              checkDate={this.props.checkDate}
              level={this.props.level}
              multipleSelectedHandlerArray={
                this.state.multipleSelectedHandlerArray
              }
              isMultiEditActive={this.state.multiEditActivate}
              isScannedArrShowing={this.state.showScannedItems}
              batchTypeID={this.props.batchTypeID}
              superData={this.props.home_Data}
              gridData_Data={this.state.data}
              gridData_Cancel={this.gridDataEditModal_Cancelled}
              levelSignId={this.state.levelSignIdForData}
              levelId={this.props.levelId}
              isSearched={this.props.isSearched}
              isSearchedOriginally={this.props.isSearchedOriginally}
            />
          ) : (
            this.state.showPromoModal === true && (
              <GridDataPromoQtyModal
                LevelUserStoreMaxQuantityPerStore={
                  this.props.LevelUserStoreMaxQuantityPerStore
                }
                LevelUserMaxQuantityPerStore={
                  this.props.LevelUserMaxQuantityPerStore
                }
                isScannedArrShowing={this.state.showScannedItems}
                notify={() => this.notifyCreated()}
                levelSignIdForData={this.state.levelSignIdForData}
                superData={this.props.home_Data}
                defaultPromoLevelSign={this.state.data}
                gridData_Cancel={this.gridDataPromoModal_Cancelled}
                gridData_Data={this.state.data}
                isSearched={this.props.isSearched}
                isSearchedOriginally={this.props.isSearchedOriginally}
              />
            )
          )}
          {/* modals end */}
          {/* filter begin */}
          <View style={[global.row, gridData.marg]}>
            {this.props.hideFilter === false &&
              this.state.reloadCheckbox === false && (
                <View
                  style={[
                    gridData.checkboxParentWrapper,
                    gridData.iconHeaderWrapper,
                  ]}
                >
                  <View style={gridData.checkboxWrapper}>
                    <Checkbox
                      disabled={this.props.disabled}
                      selected={this.state.allArrSelected}
                      selectAll={true}
                      onPress={() =>
                        this.props.showMultiEdit === true &&
                        this.state.allArrSelected === false
                          ? Alert.alert(
                              "Confirmation",
                              "By selecting this box, you acknowledge that once your edits are submitted, they cannot be changed or reverted. Pangea is not responsible for incorrect pricing, information, or Ad date changes submitted through the Multi-edit interface. Any incorrect submissions must be reported through customer support, and may incur programming charges should Pangea be required to make corrections on your behalf.",
                              [
                                { text: "Cancel", onPress: null },
                                {
                                  text: "I Agree",
                                  onPress: () => this.selectAll(),
                                },
                              ],
                              { cancelable: true }
                            )
                          : this.selectAll()
                      }
                    />
                  </View>
                  <View style={gridData.checkboxAllTextWrapper}>
                    <Text>All&#8681; </Text>
                  </View>
                </View>
              )}
            {!this.props.hideFilterTextInput &&
              // !this.props.hideFilterGlitch &&
              this.props.hideFilter === false && (
                <View style={global.width70}>
                  <View style={[global.absolute, gridData.filterBox]}>
                    <CustomTextInput
                      value={this.state.search}
                      onChangeText={(e) => this.filter(e)}
                      placeholder={"Filter"}
                      width="100%"
                      marginRight={44}
                      editable={this.props.disabled}
                    />
                  </View>
                </View>
              )}

            {this.props.hideFilter === false &&
              this.state.reloadCheckbox === false && (
                <View style={[gridData.iconHeaderWrapper]}>
                  <Icon
                    functionality="button"
                    size={40}
                    source={require("../assets/vectoricons/barcodescanner.png")}
                    onPress={() =>
                      this.setState({ auditMode: true }, () => {
                        this.showScanner(
                          "",
                          // this.state.auditModeTest === "auditModeTest"
                          //   ? "Audit"
                          //   : this.state.auditMode === true
                          // ?
                          "Audit"
                          // : ""
                        );
                      })
                    }
                  />
                </View>
              )}
          </View>
          {/* filter end */}
          {/* swipeable begin */}
          <ScrollView style={gridData.scrollView} nestedScrollEnabled={true}>
            {this.state.reloadCheckbox === false && (
              <React.Fragment>
                {this.state.arrayChunks.length > 1 && (
                  // !this.state.showScannedItems &&
                  <React.Fragment>
                    <View style={[global.row, global.marginAuto]}>
                      <TouchableOpacity
                        style={gridData.iconWrapper}
                        onPress={() => {
                          this.state.chunkIndex > 0
                            ? this.loadMore("back")
                            : {};
                        }}
                        disabled={this.props.disabled}
                      >
                        <Icon
                          functionality="icon"
                          size={22}
                          source={require("../assets/vectoricons/rewind.png")}
                        />
                      </TouchableOpacity>
                      <Text>
                        {this.state.chunkIndex + 1} of{" "}
                        {this.state.arrayChunks.length}
                        {"  "}
                      </Text>
                      <TouchableOpacity
                        style={gridData.iconWrapper}
                        onPress={() => {
                          this.loadMore("forward");
                        }}
                        disabled={this.props.disabled}
                      >
                        <Icon
                          functionality="icon"
                          size={22}
                          source={require("../assets/vectoricons/forward.png")}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={global.row}></View>
                  </React.Fragment>
                )}
                {this.state.showScannedItems === true &&
                  this.state.auditMode != true &&
                  this.state.showExitScannedButton === false && (
                    <TouchableOpacity
                      style={[global.pangeaBlue]}
                      onPress={() => this.exitScanned()}
                    >
                      <Text style={global.textWhiteCenter}>
                        Exit scanned items list
                      </Text>
                    </TouchableOpacity>
                  )}
                {/* <Text> */}
                {/* {
                  this.state.showScannedItems === false
                    ? this.state.arrayChunks[this.state.chunkIndex]
                    : this.state.isFilteringScanned === true
                    ? this.state.filteredArr
                    : this.state.scannedArr.map((e) => {
                        return <Text>{e.id}</Text>;
                      })
                  // .map((e, index) => {
                  //     return (
                  //       <SwipeRow
                  //         // key={index}
                  //         renderItem={
                  //           <View>
                  //             <Text>{JSON.stringify(e)}</Text>
                  //           </View>
                  //         }
                  //         renderHiddenItem={
                  //           <View>
                  //             <TouchableOpacity
                  //               style={{ backgroundColor: "blue" }}
                  //               onPress={() => {}}
                  //             />
                  //           </View>
                  //         }
                  //       />
                  //     );
                  // }
                  // )
                } */}
                {/* </Text> */}
                {/* <SwipeListView
                  data={
                    this.state.showScannedItems === false
                      ? this.state.arrayChunks[this.state.chunkIndex]
                      : this.state.isFilteringScanned === true
                      ? this.state.filteredArr
                      : this.state.scannedArr
                  }
                  windowSize={10}
                  renderItem={this.renderItem}
                  renderHiddenItem={
                    !this.props.nonEditable ? this.renderHiddenItem : () => {}
                  }
                  leftOpenValue={
                    this.props.auditMode === true
                      ? this.state.width / 3
                      : this.props.ahead === -2
                      ? 0.1
                      : this.props.home_EnableDeleteSelected === false
                      ? 0.1
                      : this.state.width / 3
                  }
                  rightOpenValue={-this.state.width / 2}
                  stopLeftSwipe={
                    this.props.auditMode === true
                      ? this.state.width / 3
                      : this.props.ahead === -2
                      ? 0.1
                      : this.props.home_EnableDeleteSelected === false
                      ? 0.1
                      : this.state.width / 3
                  }
                  friction={80}
                  stopRightSwipe={-this.state.width / 2}
                  keyExtractor={(data, rowKey) => JSON.stringify(rowKey + 1)}
                  scrollEnabled={true}
                  showsVerticalScrollIndicator={true}
                  swipeToOpenVelocityContribution={76}
                  closeOnScroll={false}
                  closeOnRowPress={false}
                /> */}
                <SwipeListView
                  data={
                    this.state.showScannedItems === false
                      ? this.state.arrayChunks[this.state.chunkIndex]
                      : this.state.isFilteringScanned === true
                      ? this.state.filteredArr
                      : this.state.arrayChunks[this.state.chunkIndex]
                    // this.state.scannedArr
                  }
                  // windowSize={10}
                  renderItem={this.renderItem}
                  renderHiddenItem={
                    !this.props.nonEditable ? this.renderHiddenItem : () => {}
                  }
                  leftOpenValue={
                    this.props.auditMode === true
                      ? this.state.width / 3
                      : this.props.ahead === -2
                      ? 0.1
                      : this.props.home_EnableDeleteSelected === false
                      ? 0.1
                      : this.state.width / 3
                  }
                  rightOpenValue={-this.state.width / 2}
                  stopLeftSwipe={
                    this.props.auditMode === true
                      ? this.state.width / 3
                      : this.props.ahead === -2
                      ? 0.1
                      : this.props.home_EnableDeleteSelected === false
                      ? 0.1
                      : this.state.width / 3
                  }
                  friction={80}
                  stopRightSwipe={-this.state.width / 2}
                  // keyExtractor={(data, rowKey) => JSON.stringify(rowKey + 1)}
                  scrollEnabled={true}
                  showsVerticalScrollIndicator={true}
                  swipeToOpenVelocityContribution={76}
                  closeOnScroll={false}
                  closeOnRowPress={false}
                />
                <View></View>

                {/* <Basic
                  data={
                    this.state.showScannedItems === false
                      ? this.state.arrayChunks[this.state.chunkIndex]
                      : this.state.isFilteringScanned === true
                      ? this.state.filteredArr
                      : this.state.scannedArr
                  }
                /> */}
              </React.Fragment>
            )}
          </ScrollView>
          {/* swipeable end */}
        </React.Fragment>
      );
    } else {
      return <View></View>;
    }
  }
}

//props:
//levelID, levelUserInfoId, currentSignTypeID
//main_Data: array of objects coming from the Main.js component

import React, { Component } from "react";
import {
  Text,
  TouchableOpacity,
  Dimensions,
  Modal,
  View,
  ScrollView,
  Platform,
} from "react-native";
import CustomTextInput from "./reusable/CustomTextInput";
import TopBarNotification from "./reusable/TopBarNotification";
import CheckboxForBatch from "./reusable/CheckboxForBatch";
import {
  data_get_batch_elements_by_id,
  data_post_publish_print_batches,
} from "../scripts/API";
import LoadingSpinner from "./reusable/LoadingSpinner";
import PDFReader from "rn-pdf-reader-js";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import { printSignBatch, global } from "../Styles/Styles";

export default class PrintSignBatch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newUser: "",
      data: this.props.main_Data,
      filter: "",
      selectedAd: "",
      isModalFromGridDataShowing: false,
      height: Math.round(Dimensions.get("window").height),
      color: "white",
      backgroundColor: "grey",
      arr: [],
      data: [],
      filteredArr: [],
      arrNoBatchesFilteredArr: [],
      batchElements: [],
      arrForFilter: [],
      batchTypeIDs: "",
      initialStartup: "",
      isLoading: "",
      keepScreenBlank: false,
      pendingPrint: true,
      printedDefault: true,
      IMD1: true,
      IMD2: true,
      F1: true,
      supressMarginNotation: false,
      supressDepartmentSlip: false,
      supressStoreSlip: false,
      comingleStocks: false,
      notify: false,
      notificationText: "",
      showBatches: false,
    };
  }

  componentDidMount = () => {
    this.load();
  };
  load = () => {
    if (Platform.OS === "ios" && Dimensions.get("window").height < 811) {
      setTimeout(() => {
        this.setState({ isLoading: false });
        this.props.isSignBatchLoading(false);
        this.props.isLoading(false);
      }, 1000);
    }
    this.props.isSignBatchLoading(true);
    this.setState({
      initialStartup: true,
      isLoading: true,
    });
    this.getBatches();
  };
  getBatches = () => {
    this.setState({
      arr: [],
      keepScreenBlank: true,
    });
    setTimeout(() => {
      const data = [...this.props.data];
      const body = {
        levelUserInfoID: this.props.levelUserInfoId,
      };
      const arr = [];
      const narr = [];
      const zarr = [];
      data_get_batch_elements_by_id(body).then((resp) => {
        if (resp.Handling === "Success") {
          this.setState({
            selectedAd: "Current Ad",
            data: data,
            filteredArr: data,
            arrNoBatchesFilteredArr: data,
            batchElementsData: resp.Model,
          });

          const keys = Object.keys(resp.Model);
          const values = Object.values(resp.Model);
          for (let i = 0; i < keys.length; i++) {
            if (
              keys[i] !== "TilingOrientation" &&
              keys[i] !== "TilingPosition" &&
              keys[i] !== "Week"
            ) {
              arr.push({ label: keys[i], value: values[i] });

              if (keys[i] === "PrintedDefault") {
                this.setState({ printedDefault: values[i] });
              }
            }
          }

          for (let i = 0; i < arr.length; i++) {
            if (arr[i].label.includes("Label")) {
              narr.push(arr[i]);
            }
            for (let z = 0; z < narr.length; z++) {
              zarr.push({
                label: narr[z].label.slice(0, -5),
                value: narr[z].value,
              });
            }
          }
          zarr.push({ label: "Pending Print", value: true });
          const newArr = Array.from(
            new Set(
              zarr.map((a) => {
                return { label: a.label, value: a.value };
              })
            )
          );

          const uniq = new Set(newArr.map((e) => JSON.stringify(e)));

          const res = Array.from(uniq).map((e) => JSON.parse(e));
          this.setState({ batchElements2: res });
          const completeArr = [];
          for (let i = 0; i < arr.length; i++) {
            if (arr[i].value == true) {
              completeArr.push(arr[i]);
            }
          }
          var props = ["label", "value"];
          var result = completeArr
            .filter(function (o1) {
              return !res.some(function (o2) {
                return o1.label === o2.label;
              });
            })
            .map(function (o) {
              return props.reduce(function (newo, label) {
                newo[label] = o[label];
                return newo;
              }, {});
            });
          for (let i = 0; i < res.length; i++) {
            result.push(res[i]);
          }

          for (let i = 0; i < result.length; i++) {
            if (result[i].label === "PrintedDefault") {
              result.push(result.splice(i, 1)[0]);
            }
          }
          this.setState({ batchElements: result, narr: narr });
        }
        this.props.isSignBatchLoading(false);
        this.setState({
          initialStartup: false,
          keepScreenBlank: false,
          isLoading: false,
          showBatches: true,
        });
      });
    }, 500);
  };
  print = (e) => {
    this.getBatches();
    this.props.isSignBatchLoading(true);
    this.setState({
      isLoading: true,
      notify: false,
      arr: [],
    });
    const obj = {
      buttonCall: "PRINT",
      LevelID: this.props.levelID,
      batchName: "",
      levelSignsToPrint: 0,
      batchTypeIDs: "",
      LevelUserInfoID: this.props.levelUserInfoId,
      SignTypeID: this.props.currentSignTypeID,
      SupressDepartmentSlip: this.state.supressDepartmentSlip,
      SupressMarginNotation: this.state.supressMarginNotation,
      SupressStoreSlip: this.state.supressStoreSlip,
      ComingleStocks: this.state.comingleStocks,
    };
    const batches = [];
    for (let i = 0; i < this.state.arr.length; i++) {
      batches.push(this.state.arr[i].BatchTypeId);
    }
    const list = batches.join(",");
    obj.batchTypeIDs = list;

    const body = obj;
    data_post_publish_print_batches(body).then((resp) => {
      this.setState({
        notify: false,
      });
      if (resp.Handling === "success") {
        if (!resp.Description) {
          this.props.isSignBatchLoading(false);
          this.setState({ isLoading: false });
          this.notify("No signs in batch");
        } else {
          const arr = resp.Description.split(",");

          arr.splice(arr.length - 1, 1);
          this.setState({ tee: arr });
          this.props.isSignBatchLoading(false);
          this.setState({
            isLoading: false,
            links: resp.Description,
            showNewModalForLinks: true,
            comingleStocks: false,
            supressDepartmentSlip: false,
            supressMarginNotation: false,
            supressStoreSlip: false,
          });
        }
      } else if (resp.Handling === "failed") {
        this.notify("Network error");
        this.props.isSignBatchLoading(false);
        this.setState({ isLoading: false });
      }
    });
  };
  notify = (e) => {
    this.setState({ notificationText: e, notify: true });
  };
  // filter method
  filter = (e) => {
    this.setState({ filter: e });
    setTimeout(() => {
      let data = [...this.state.data];
      data = data
        .filter(function (item) {
          return item.BatchTypeName.toLowerCase().includes(e.toLowerCase());
        })
        .map(function ({
          BatchCompleted,
          BatchTypeId,
          BatchTypeName,
          DateCreated,
          DownloadDate,
          IsDivision,
          IsPrintBatch,
          IsStores,
          LevelId,
          LevelUserInfold,
          Printed,
          isSign,
          level,
        }) {
          return {
            BatchCompleted,
            BatchTypeId,
            BatchTypeName,
            DateCreated,
            DownloadDate,
            IsDivision,
            IsPrintBatch,
            IsStores,
            LevelId,
            LevelUserInfold,
            Printed,
            isSign,
            level,
          };
        });
      this.setState({ filteredArr: e.length > 0 ? data : this.state.data });
    }, 1);
  };

  selected = (e) => {
    const arr = [...this.state.arr];
    var index = arr.findIndex(function (o) {
      return o.BatchTypeId === e.BatchTypeId;
    });
    if (index !== -1) arr.splice(index, 1);
    else {
      arr.push(e);
    }
    this.setState({
      arr: arr,
    });
    this.setState({
      batchTypeIDs: arr,
    });
  };

  //opens the pdf
  openPDF = (url) => {
    this.props.isSignBatchLoading(true);
    this.setState({
      url: url,
      isLoading: true,
      notify: false,
    });
    this.downloadFile(url);
  };
  //creates the pdf link
  linkFunc = (url) => {
    const reg = /[^\/]+$/;
    const reg2 = /^([^_]*_){2}/;
    const ma = url.match(reg)[0];
    const match = ma.match(reg2)[0];
    const link = match.substring(0, match.length - 1);
    return link;
  };
  //downloads the pdf
  downloadFile(url) {
    let fileUri = FileSystem.documentDirectory + ".pdf";
    FileSystem.downloadAsync(url, fileUri)
      .then(({ uri }) => {
        this.saveFile(url);
      })
      .catch((error) => {
        this.props.isSignBatchLoading(false);
        this.setState({ isLoading: false, notify: true });
      });
  }
  //saves download to phone
  saveFile = async (fileUri) => {
    FileSystem.downloadAsync(fileUri, FileSystem.documentDirectory + ".pdf")
      .then(({ uri }) => {
        this.props.isSignBatchLoading(false);
        this.setState({ fileUri: uri }, () => {
          this.setState({ isLoading: false, showPDF: true });
        });
      })
      .catch(() => {
        this.props.isSignBatchLoading(false);
        this.setState({ notify: true, isLoading: false });
      });
  };
  cancelPDF = () => {
    this.setState({ showPDF: false });
  };
  sendToPrinter = async () => {
    const fileToBePrinted = this.state.fileUri;
    Print.printAsync({
      uri: fileToBePrinted,
    })
      .then(() => {
        this.cancelPDF();
      })
      .catch((error) => {});
  };
  checkboxFilter = () => {
    let arr = [...this.state.data];
    if (this.state.IMD1 === false) {
      for (let i = 0; i < arr.length; i++) {
        if (!arr[i].IsDivision) {
          arr.splice(i, 1);
          i--;
        }
      }
    }
    if (!this.state.IMD2) {
      for (let i = 0; i < arr.length; i++) {
        if (!arr[i].IsStores) {
          arr.splice(i, 1);
          i--;
        }
      }
    }
    if (!this.state.F1) {
      for (let i = 0; i < arr.length; i++) {
        if (!arr[i].IsPrintBatch) {
          arr.splice(i, 1);
          i--;
        }
      }
    }
    if (!this.state.printedDefault) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].Printed) {
          arr.splice(i, 1);
          i--;
        }
      }
    }
    if (!this.state.pendingPrint) {
      for (let i = 0; i < arr.length; i++) {
        if (!arr[i].Printed) {
          arr.splice(i, 1);
          i--;
        }
      }
    }
    this.setState({ filteredArr: arr });
  };
  checkbox = (e) => {
    //batch filters
    //printed-Printed
    if (e.label === "PrintedDefault") {
      this.setState({ printedDefault: !this.state.printedDefault });
    }
    //handheldbatches-IsDivision
    if (e.label === "IMD1") {
      this.setState({ IMD1: !this.state.IMD1 });
    }
    //IsStores-Unscheduled Price Changes
    if (e.label === "IMD2") {
      this.setState({
        IMD2: !this.state.IMD2,
      });
    }
    if (e.label === "Pending Print") {
      this.setState({ pendingPrint: !this.state.pendingPrint });
    }
    if (e.label === "F1") {
      this.setState({ F1: !this.state.F1 });
    }
    // filter end
    if (e.label === "SupressDepartmentSlip") {
      if (this.state.supressDepartmentSlip === false) {
        this.setState({
          supressDepartmentSlip: true,
        });
      } else {
        this.setState({ supressDepartmentSlip: false });
      }
    }
    if (e.label === "SupressMarginNotation") {
      if (this.state.supressMarginNotation === false) {
        this.setState({
          supressMarginNotation: true,
        });
      } else {
        this.setState({ supressMarginNotation: false });
      }
    }
    if (e.label === "SupressStoreSlip") {
      if (this.state.supressStoreSlip === false) {
        this.setState({ supressStoreSlip: true });
      } else {
        this.setState({ supressStoreSlip: false });
      }
    }
    if (e.label === "ComingleStocks") {
      if (this.state.comingleStocks === false) {
        this.setState({ comingleStocks: true });
      } else {
        this.setState({ comingleStocks: false });
      }
    } else {
      if (this.state[e.label] === true) {
        this.setState({ [e.label]: false });
      } else {
        this.setState({ [e.label]: true });
      }
    }

    setTimeout(() => {
      this.checkboxFilter();
    }, 5);
  };
  cancel = () => {
    this.setState({
      showNewModalForLinks: false,
      filteredArr: [],
    });
    if (this.props.currentSignTypeID === +1) {
      this.props.reloadSigns("Sign Batch", true);
    } else if (this.props.currentSignTypeID === +8) {
      this.props.reloadTags("tagbatch", true);
    }
  };

  render() {
    if (this.state.isLoading === true) {
      return (
        <View style={global.loadingSpinner}>
          <LoadingSpinner />
        </View>
      );
    } else if (this.state.keepScreenBlank === true) {
      return <React.Fragment />;
    } else if (this.state.arrNoBatchesFilteredArr.length < 1) {
      if (!this.state.initialStartup) {
        return (
          <View>
            <Text style={printSignBatch.noBatchesText}>
              No Batches Available
            </Text>
          </View>
        );
      }
    }
    if (this.state.showPDF === true) {
      return (
        <Modal animationType="slide" visible={true}>
          <PDFReader
            source={{
              uri: this.state.fileUri,
            }}
          />
          <View style={global.row}>
            <TouchableOpacity
              style={[global.tomato, global.buttonPrint]}
              onPress={() => this.cancelPDF()}
            >
              <Text style={global.textWhiteCenter}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[global.pangeaBlue, global.buttonPrint]}
              onPress={() => this.sendToPrinter()}
            >
              <Text style={global.textWhiteCenter}>Print PDF</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      );
    }
    return (
      <React.Fragment>
        {this.state.showNewModalForLinks === true ? (
          <Modal animationType="slide" visible={true}>
            <View style={global.modalWrapper}>
              {this.state.tee.map((e, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    style={
                      index % 2 == 0
                        ? printSignBatch.pdfLinkWrapper
                        : printSignBatch.pdfLinkWrapperAlt
                    }
                    onPress={() => this.openPDF(e)}
                  >
                    <Text style={printSignBatch.pdfLink}>
                      {this.linkFunc(e)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <TouchableOpacity
              style={[global.tomato, global.buttonPrint, global.buttonCenter]}
              onPress={() => this.cancel()}
            >
              <Text style={global.textWhiteCenter}>Cancel</Text>
            </TouchableOpacity>
          </Modal>
        ) : (
          <ScrollView>
            {this.state.notify === true && (
              <TopBarNotification text={this.state.notificationText} />
            )}

            <View style={global.printAndStockContainer}>
              <View style={[global.printAndStockContainer]}>
                <Text
                  style={[
                    global.header,
                    { height: Platform.OS === "ios" ? 50 : 30 },
                  ]}
                >
                  Batch
                </Text>
              </View>
              <View
                style={[global.width100, { height: this.state.height / 4 }]}
              >
                <ScrollView
                  nestedScrollEnabled={true}
                  style={[
                    printSignBatch.batchList,
                    global.width100,
                    { height: this.state.height / 4 },
                  ]}
                >
                  {this.state.showBatches &&
                    this.state.filteredArr.length > 0 &&
                    this.state.filteredArr.map((e, index) => {
                      return (
                        <View key={index} style={global.row}>
                          <TouchableOpacity
                            style={global.row}
                            onPress={() => {
                              this.selected(e);
                            }}
                          >
                            <Text
                              style={[
                                {
                                  backgroundColor:
                                    this.state.arr
                                      .map((e) => {
                                        return e.BatchTypeId;
                                      })
                                      .indexOf(e.BatchTypeId) !== -1
                                      ? "grey"
                                      : "white",
                                  fontWeight:
                                    e.Printed === true ? "normal" : "bold",
                                  color:
                                    this.state.arr
                                      .map((e) => {
                                        return e.BatchTypeId;
                                      })
                                      .indexOf(e.BatchTypeId) !== -1
                                      ? "white"
                                      : "black",
                                },
                              ]}
                            >
                              {e.BatchTypeName}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                </ScrollView>
              </View>

              <View style={global.row}>
                <CustomTextInput
                  placeholder="Filter batches list..."
                  value={this.state.filter}
                  onChangeText={(e) => this.filter(e)}
                />
              </View>
              <View>
                {this.state.batchElements.map((e, index) => {
                  return (
                    <View key={index} style={global.row}>
                      <CheckboxForBatch
                        onPress={() =>
                          this.checkbox(
                            e,
                            e.value === null ? false : e.value === true && true
                          )
                        }
                        filter={
                          e.label === "PrintedDefault"
                            ? true
                            : e.label === "F1"
                            ? true
                            : e.label === "IMD2"
                            ? true
                            : e.label === "IMD1"
                            ? true
                            : e.label === "Pending Print" && true
                        }
                      />
                      <Text style={global.bold}>
                        {e.label === "PrintedDefault" && e.value === true
                          ? "Printed"
                          : e.value === false
                          ? "Pending Print"
                          : e.value === true
                          ? e.label.match(/[A-Z][a-z]+|[0-9]+/g).join(" ")
                          : e.value}
                      </Text>
                    </View>
                  );
                })}

                <TouchableOpacity
                  style={[
                    printSignBatch.proceedButton,
                    {
                      backgroundColor:
                        this.state.arr.length > 0 ? "#3796ff" : "lightgrey",
                    },
                  ]}
                  disabled={this.state.arr.length == 0 ? true : false}
                  onPress={() => this.print()}
                >
                  <Text style={printSignBatch.proceedText}>Proceed</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        )}
      </React.Fragment>
    );
  }
}

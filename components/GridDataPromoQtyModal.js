//props need to have an array of strings fed into it to populate the button scroller
//see <DepartmentsScrollView /> in the Home page for an example
//props:
//gridData_Data: this is the data from the GridData.js component
//superData: ""
//gridData_Promo:
//levelSignIdForData:
//promoLevelStamps: these are the stamps, ie sizes

import React, { Component } from "react";
import { Text, TouchableOpacity, Modal, View, Dimensions } from "react-native";
import ModalDropdown from "../components/reusable/react-native-modal-dropdown/index";
import TopBarNotification from "./reusable/TopBarNotification";
import { data_post_2ndSign } from "../scripts/API";
import LoadingSpinner from "./reusable/LoadingSpinner";
import { gridDataPromoQtyModal, global } from "../Styles/Styles";

export default class GridDataPromoQtyModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      backgroundColor: "#ececec",
      selected: "",
      selected2: 0,
      qty: "",
      qty2: 0,
      qtyDefault: 1,
      defaultPromo: "",
      showWarning: false,
      notificationText: "",
      isLoading: false,
      promoLevelSigns: [],
      promoLevelSignsSuper: [],
      qtyOptions: [],
      qtyOptions2ndSign: [],
    };
  }
  getUnique = (arr, comp) => {
    const unique = arr
      .map((e) => e[comp])
      .map((e, i, final) => final.indexOf(e) === i && i)
      .filter((e) => arr[e])
      .map((e) => arr[e]);
    return unique;
  };
  componentDidMount = () => {
    let qtyArr = [];
    const qtyFromProps = this.props.LevelUserMaxQuantityPerStore;
    if (qtyFromProps > 0) {
      for (let i = 1; i < qtyFromProps + 1; i++) {
        qtyArr.push(i);
      }
      this.setState({ qtyOptions: qtyArr });
    }
    qtyArr2ndSign = [];
    const qtyFromPropsFor2ndSign = this.props.LevelUserStoreMaxQuantityPerStore;
    if (qtyFromPropsFor2ndSign > 0) {
      for (let i = 1; i < qtyFromPropsFor2ndSign + 1; i++) {
        qtyArr2ndSign.push(i);
      }
      this.setState({ qtyOptions2ndSign: qtyArr2ndSign });
    }

    let ar = [];
    for (let i = 0; i < this.props.superData.length; i++) {
      if (this.props.superData[i].promos) {
        if (
          this.props.superData[i].levelSignId ===
          this.props.gridData_Data.levelSignId
        ) {
          this.props.superData[i].promos.map((e) => {
            ar.push({ stampId: e.stampId, stampName: e.stampName });
          }),
            this.setState({
              signData: this.props.superData[i],
              promoLevelSignsSuper: this.getUnique(ar, "stampId"),
            });
        }
      } else {
        if (
          this.props.superData[i].levelSignId ===
          this.props.gridData_Data.levelSignId
        ) {
          this.props.superData[i].promo.map((e) => {
            ar.push({ stampId: e.stampId, stampName: e.stampName });
          }, this.setState({ signData: this.props.superData[i], promoLevelSignsSuper: this.getUnique(ar, "stampId") }));
        }
      }
    }
    this.setState({ promoLevelSignsSuper: this.getUnique(ar, "stampId") });
    setTimeout(() => {
      let defPromo = "";
      let defStampId = "";
      let defQty = "";
      for (let i = 0; i < this.props.superData.length; i++) {
        if (
          this.props.superData[i].levelSignId ===
          this.props.gridData_Data.levelSignId
        ) {
          defPromo = this.props.superData[i].defaultPromo;
          defStampId = this.props.superData[i].stampId;
          defQty = this.props.gridData_Data.qty;
        }
      }
      this.setState({
        selected: defPromo,
        stampId: defStampId,
        qty: defQty,
      });
      this.setState({
        data: this.props.superData,
        qtyDefault: 1,
      });
      for (let i = 0; i < this.state.promoLevelSignsSuper.length; i++) {
        if (
          this.state.selected === this.state.promoLevelSignsSuper[i].stampName
        ) {
          this.refs.dropdownref.select(i);
        }
      }
    }, 500);
  };
  item = (e) => {
    this.setState({ item: e });
  };
  clickHandler = (e) => {
    this.setState({ selected: e.stampName, stampId: e.stampId });
  };
  clickHandlerQty = (e) => {
    var x = +e + 1;
    this.setState({ qty: x });
  };
  clickHandler2 = (e, og) => {
    for (let i = 0; i < og.length; i++) {
      if (e === og[i].stampName) {
        this.setState({ stampId2: og[i].stampId });
        break;
      }
    }
    this.setState({ selected2: e });
  };
  clickHandler2Qty = (e) => {
    var x = +e + 1;
    this.setState({ qty2: x });
  };
  cancel = (e) => {
    this.props.gridData_Cancel(e);
  };
  save = () => {
    this.setState({ showWarning: false });

    if (this.state.selected === this.state.selected2) {
      this.setState({
        notificationText: "2nd Sign Can Not Be The Same",
        showWarning: true,
        isLoading: false,
      });
      setTimeout(() => {
        this.setState({ showWarning: false });
      }, 2500);
    } else {
      this.setState({ isLoading: true });
      const body = {
        StampID: this.state.stampId,
        Qty: this.state.qty,
        secondStampID: this.state.stampId2 ? this.state.stampId2 : 0,
        secondQty: this.state.qty2 ? this.state.qty2 : 0,
        levelSignID: this.props.levelSignIdForData,
      };
      data_post_2ndSign(body).then((resp) => {
        if (resp.Handling === "success") {
          if (this.state.selected2.length > 0) {
            setTimeout(() => {
              this.cancel("notify created");
            }, 10);
          } else {
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
              } else if (this.props.isSearchedOriginally === true) {
                this.props.gridData_Cancel("sign updated", "Updating Searched");
              } else {
                this.cancel("sign updated");
              }
            }, 10);
          }
        }
      });
    }
  };
  render() {
    const list = this.state.promoLevelSignsSuper.map((e) => e.stampName);
    const index = list.indexOf(this.state.selected);
    if (this.state.promoLevelSignsSuper.length > 0) {
      list.splice(index, 1);
    }

    return (
      <React.Fragment>
        <Modal animationType="slide" visible={true}>
          {this.state.showWarning === true && (
            <TopBarNotification text={this.state.notificationText} />
          )}
          {this.state.isLoading === true ? (
            <View style={global.alignItemsCenter}>
              <LoadingSpinner />
            </View>
          ) : (
            <React.Fragment>
              <View style={gridDataPromoQtyModal.modalWrapper}>
                <Text style={gridDataPromoQtyModal.titleText}>
                  Promo & Quantity
                </Text>

                <View style={gridDataPromoQtyModal.itemWrapper}>
                  <View style={gridDataPromoQtyModal.dropdownWrapper}>
                    <View style={gridDataPromoQtyModal.leftOutline}>
                      <View style={gridDataPromoQtyModal.topRow}>
                        <Text>Promo: </Text>
                      </View>
                      <View style={gridDataPromoQtyModal.bottomRow}>
                        <ModalDropdown
                          ref="dropdownref"
                          width={
                            Math.round(Dimensions.get("window").width) * 0.55
                          }
                          onSelect={
                            this.state.promoLevelSignsSuper.length > 0
                              ? (e) => {
                                  this.clickHandler(
                                    this.state.promoLevelSignsSuper[e]
                                  );
                                }
                              : () => {}
                          }
                          defaultValue={this.state.selected}
                          defaultIndex={this.state.gridData_Data}
                          options={
                            this.state.promoLevelSignsSuper.length > 1
                              ? this.state.promoLevelSignsSuper.map(
                                  (e) => e.stampName
                                )
                              : [this.state.selected]
                          }
                          backgroundColor="lightgrey"
                        />
                      </View>
                    </View>
                    <View style={gridDataPromoQtyModal.rightOutline}>
                      <View style={gridDataPromoQtyModal.topRow}>
                        <Text style={gridDataPromoQtyModal.labelText}>
                          Quantity:{" "}
                        </Text>
                      </View>
                      <View style={gridDataPromoQtyModal.bottomRow}>
                        <ModalDropdown
                          width={
                            Math.round(Dimensions.get("window").width) * 0.15
                          }
                          onSelect={(e) => {
                            this.clickHandlerQty(e);
                          }}
                          defaultValue={JSON.stringify(
                            this.props.gridData_Data.qty
                          )}
                          defaultIndex={this.props.gridData_Data.qty - 1}
                          options={this.state.qtyOptions}
                          backgroundColor="lightgrey"
                        />
                      </View>
                    </View>
                  </View>
                </View>
                {this.state.promoLevelSignsSuper.length > 1 && (
                  <View
                    style={[
                      gridDataPromoQtyModal.itemWrapper,
                      global.marginTop15,
                    ]}
                  >
                    <View style={gridDataPromoQtyModal.dropdownWrapper}>
                      <View style={gridDataPromoQtyModal.leftOutline}>
                        <View style={gridDataPromoQtyModal.topRow}>
                          <Text>2nd Size: </Text>
                        </View>
                        <View style={gridDataPromoQtyModal.bottomRow}>
                          <ModalDropdown
                            width={
                              Math.round(Dimensions.get("window").width) * 0.55
                            }
                            onSelect={(e) => {
                              this.clickHandler2(
                                list[e],
                                this.state.promoLevelSignsSuper
                              );
                            }}
                            options={list}
                            backgroundColor="lightgrey"
                          />
                        </View>
                      </View>

                      <View style={gridDataPromoQtyModal.rightOutline}>
                        <View style={gridDataPromoQtyModal.topRow}>
                          <Text style={gridDataPromoQtyModal.labelText}>
                            2nd Qty:
                          </Text>
                        </View>
                        <View style={[gridDataPromoQtyModal.bottomRow]}>
                          <ModalDropdown
                            width={
                              Math.round(Dimensions.get("window").width) * 0.15
                            }
                            onSelect={(e, a) => {
                              this.clickHandler2Qty(e, a);
                            }}
                            options={this.state.qtyOptions2ndSign}
                            backgroundColor="lightgrey"
                            defaultValue={JSON.stringify(this.state.qtyDefault)}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                )}
              </View>
              <View style={global.buttonWrapper}>
                <TouchableOpacity
                  style={[global.blue, global.greyButton]}
                  onPress={() => {
                    this.save();
                  }}
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
            </React.Fragment>
          )}
        </Modal>
      </React.Fragment>
    );
  }
}

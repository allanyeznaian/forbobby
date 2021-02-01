//props:
//levelId, stockSignTypeId, ahead
//selectStock(obj): this function sends the object of the stock
//selected: this tells you which SignType you are on

import React, { Component } from "react";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Alert,
} from "react-native";
import Checkbox from "./reusable/Checkbox";
import ModalDropdown from "./reusable/react-native-modal-dropdown";
import {
  data_get_stocks,
  data_get_stock_deploys,
  data_order_stocks,
  data_get_ordered_stocks,
  data_cancel_ordered_stock,
  data_cancel_ordered_stockDeploy,
} from "../scripts/API";
import { global, orderStock } from "../Styles/Styles";

export default class OrderStock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arr: [],
      orderedStocks: {},
      stockDeployData: [],
      stockData: [],
      dropdownOptions: [
        "Current Order - Not Shipped",
        "Shipped - Pending Delivery",
      ],
      headerText: "",
      qtyOptions: [0],
      toBeSentArr: [],
      loadData: true,
      shouldNotify: false,
      notificationText: "",
      bodyAhead: +-1,
      showCancel: true,
      stockArray: [],
    };
  }
  componentDidMount = () => {
    if (this.props.MaximumOrderStockQuantity > 0) {
      let qtyArr = [];
      const qty = this.props.MaximumOrderStockQuantity;
      for (let i = 0; i < qty + 1; i++) {
        qtyArr.push(i);
      }
      this.setState({ qtyOptions: qtyArr });
    }
    this.props.isLoading(true);
    this.getStocks();
    this.getOrderedStocks();
    const today = new Date();
    this.setState({
      todaysDate:
        parseInt(today.getMonth() + 1) +
        "/" +
        today.getDate() +
        "/" +
        today.getFullYear(),
    });
  };
  getOrderedStocks = () => {
    //get ordered stocks
    this.props.isLoading(true);
    let newDate = /([^T]+)/;
    let body = {
      LevelID: this.props.levelId,
      Ahead: this.state.bodyAhead,
    };
    const arr = [];
    const arrShipped = [];
    data_get_ordered_stocks(body).then((resp) => {
      if (resp.Handling === "success") {
        if (resp.Model.ShellDeploys.length > 0) {
          for (let i = 0; i < resp.Model.ShellDeploys.length; i++) {
            if (
              new Date(resp.Model.EndDate) < new Date(this.state.todaysDate)
            ) {
              arrShipped.push({
                type: "stockDeploy",
                description:
                  resp.Model.ShellDeploys[i].stockdeploy.StockClientDescription,
                qty: resp.Model.ShellDeploys[i].ShellQtyOrdered,
                orderDate: resp.Model.ShellDeploys[i].ShellDateOrdered.match(
                  newDate
                )[0],
                stockType: resp.Model.ShellDeploys[i].StockSignTypeName,
                stockDeployId: resp.Model.ShellDeploys[i].ShellDeployId,
                shipped: resp.Model.Ahead,
              });
            }
            arr.push({
              type: "stockDeploy",
              description:
                resp.Model.ShellDeploys[i].stockdeploy.StockClientDescription,
              qty: resp.Model.ShellDeploys[i].ShellQtyOrdered,
              orderDate: resp.Model.ShellDeploys[i].ShellDateOrdered.match(
                newDate
              )[0],
              stockType: resp.Model.ShellDeploys[i].StockSignTypeName,
              stockDeployId: resp.Model.ShellDeploys[i].ShellDeployId,
              shipped: resp.Model.Ahead,
            });
          }
        }
        if (resp.Model.Shells.length > 0) {
          for (let i = 0; i < resp.Model.Shells.length; i++) {
            if (
              new Date(resp.Model.EndDate) < new Date(this.state.todaysDate)
            ) {
              arrShipped.push({
                type: "stock",
                description: resp.Model.Shells[i].stock.StockClientDescription,
                qty: resp.Model.Shells[i].ShellQtyOrdered,
                orderDate: resp.Model.Shells[i].ShellDateOrdered.match(
                  newDate
                )[0],
                stockType: resp.Model.Shells[i].StockSignTypeName,
                stockDeployId: resp.Model.Shells[i].ShellId,
                shipped: resp.Model.Ahead,
              });
            }
            arr.push({
              type: "stock",
              description: resp.Model.Shells[i].stock.StockClientDescription,
              qty: resp.Model.Shells[i].ShellQtyOrdered,
              orderDate: resp.Model.Shells[i].ShellDateOrdered.match(
                newDate
              )[0],
              stockType: resp.Model.Shells[i].StockSignTypeName,
              stockDeployId: resp.Model.Shells[i].ShellId,
              shipped: resp.Model.Ahead,
            });
          }
        }
        arr.sort(function (a, b) {
          var dateA = new Date(a.ShellDateOrdered),
            dateB = new Date(b.ShellDateOrdered);
          return dateA - dateB;
        });
        this.setState({
          orderedStocks: arr,
          shippedStocks: arrShipped,
          stockArray: arr,
        });
      } else {
        this.notify("network error");
      }
    });
  };
  getStocks = () => {
    //get stocks
    this.setState({ loadData: true });
    this.props.isLoading(true);
    const body = {
      LevelID: this.props.levelId,
      StockSignTypeID: this.props.stockSignTypeId,
      Ahead: this.props.ahead,
    };

    data_get_stock_deploys(body).then((resp) => {
      if (resp.Description === "success") {
        let arr = [];
        for (let i = 0; i < resp.Model.StockDeploys.length; i++) {
          let img =
            "https://signshare.com/images/" +
            resp.Model.StockDeploys[i].stockImage.ImageName +
            ".JPG";
          arr.push({
            data: resp.Model.StockDeploys[i],
            uri: img,
            width: 100,
            height: 100,
          });
        }
        setTimeout(() => {
          this.setState({ stockDeployData: arr });
        }, 150);
      }
    });
    data_get_stocks(body).then((resp) => {
      if (resp.Description === "success") {
        let arr = [];

        for (let i = 0; i < resp.Model.Stocks.length; i++) {
          let img =
            "https://signshare.com/images/" +
            resp.Model.Stocks[i].stockImage.ImageName +
            ".JPG";
          setTimeout(() => {
            arr.push({
              data: resp.Model.Stocks[i],
              uri: img,
              width: 100,
              height: 100,
            });
          }, 1);
        }
        setTimeout(() => {
          this.setState({ stockData: arr }, () => {
            this.props.isLoading(false);
          });
        }, 150);
      }
    });

    setTimeout(() => {
      this.setState({ loadData: true });
    }, 300);
  };
  notify = (e) => {
    this.props.notify(e);
  };
  dropdown = (e) => {
    const current = this.state.orderedStocks;
    const shipped = this.state.shippedStocks;
    if (e === "Current Order - Not Shipped") {
      this.setState({ showCancel: true, stockArray: current });
    } else if (e === "Shipped - Pending Delivery")
      this.setState({ showCancel: false, stockArray: shipped });
  };
  qty = (count, stockId) => {
    const arr = [...this.state.toBeSentArr];
    if (count == "0") {
      if (arr.length != 0) {
        for (let i = 0; i < arr.length; i++) {
          if (!arr[i].StockID) {
            if (arr[i].StockDeployID == stockId.data.StockDeployId) {
              arr.splice(i, 1);
            }
          } else {
            if (arr[i].StockID == stockId.data.StockId) {
              arr.splice(i, 1);
            }
          }
        }
      }
    } else if (arr.length === 0) {
      if (count != "0") {
        if (!stockId.data.StockId) {
          arr.push({
            LevelID: this.props.levelId,
            StockID: 0,
            StockDeployID: stockId.data.StockDeployId,
            ShellQtyOrdered: count,
          });
        } else {
          arr.push({
            LevelID: this.props.levelId,
            StockID: stockId.data.StockId,
            StockDeployID: 0,
            ShellQtyOrdered: count,
          });
        }
      }
    } else if (count != "0") {
      if (
        arr
          .map((e) => {
            return !e.StockID ? e.StockDeployID : e.StockID;
          })
          .indexOf(
            !stockId.data.StockId
              ? stockId.data.StockDeployId
              : stockId.data.StockId
          ) > -1
      ) {
        arr.splice(
          arr
            .map((e) => {
              return !e.StockID ? e.StockDeployID : e.StockID;
            })
            .indexOf(
              !stockId.data.StockId
                ? stockId.data.StockDeployId
                : stockId.data.StockId
            ),
          1
        );
        if (!stockId.data.StockId) {
          arr.push({
            LevelID: this.props.levelId,
            StockID: 0,
            StockDeployID: stockId.data.StockDeployId,
            ShellQtyOrdered: count,
          });
        } else {
          arr.push({
            LevelID: this.props.levelId,
            StockID: stockId.data.StockId,
            StockDeployID: 0,
            ShellQtyOrdered: count,
          });
        }
      } else {
        if (!stockId.data.StockId) {
          arr.push({
            LevelID: this.props.levelId,
            StockID: 0,
            StockDeployID: stockId.data.StockDeployId,
            ShellQtyOrdered: count,
          });
        } else {
          arr.push({
            LevelID: this.props.levelId,
            StockID: stockId.data.StockId,
            StockDeployID: 0,
            ShellQtyOrdered: count,
          });
        }
      }
    }
    this.setState({ toBeSentArr: arr });
  };
  orderSave = () => {
    //save
    this.setState({ shouldNotify: false });
    this.props.isLoading(true);
    const body = {
      jsonLocalShells: JSON.stringify(this.state.toBeSentArr),
    };
    data_order_stocks(body).then((resp) => {
      if (resp.Handling === "success") {
        setTimeout(() => {
          this.props.isLoading(false);
          this.setState({ loadData: false, toBeSentArr: [] });
          this.reload();
          this.notify("Ordered successfuly");
        }, 10);
      } else {
        this.props.isLoading(false);
      }
    });
  };
  checkboxHandler = (e) => {
    const obj = {
      Sign: e,
      SignTypeID: e,
    };
    this.props.selectStock(obj);
  };
  cancel = (e, obj) => {
    this.props.isLoading(true);
    if (obj.type === "stockDeploy") {
      let body = {
        shellDeployID: e,
      };

      data_cancel_ordered_stockDeploy(body).then((resp) => {
        if (resp.Handling === "success") {
          this.setState({ shouldNotify: false });
          this.notify("Order cancelled");
          this.reload();
        } else {
          this.notify("network error");
        }
        this.props.isLoading(false);
      });
    } else if (obj.type === "stock") {
      let body = {
        shellID: e,
      };
      data_cancel_ordered_stock(body).then((resp) => {
        if (resp.Handling === "success") {
          this.setState({ shouldNotify: false });
          this.notify("Order cancelled");
          this.reload();
        } else {
          this.notify("network error");
        }
        this.props.isLoading(false);
      });
    }
  };
  reload = () => {
    this.setState({ orderedStocks: [] });
    this.getOrderedStocks();
    this.getStocks();
  };
  render() {
    return (
      <React.Fragment>
        <ScrollView nestedScrollEnabled={true}>
          <View style={[global.printAndStockContainer]}>
            <Text
              style={[
                global.header,
                global.marginAuto,
                orderStock.headerHeight,
              ]}
            >
              Pre-Printed Stock
            </Text>
          </View>
          <View style={[global.row, global.marginAuto]}>
            <View style={orderStock.checkboxSignWrapper}>
              <Text style={orderStock.text}>Sign Stock</Text>
              <Checkbox
                selected={this.props.selected === "Sign Stock" ? true : false}
                onPress={() => {
                  this.checkboxHandler("Sign Stock");
                }}
                disabled={this.props.isLoadingSpinnerActive}
              />
            </View>
            <View style={orderStock.checkboxWrapper}>
              <Text style={orderStock.text}>Tag Stock</Text>
              <Checkbox
                selected={this.props.selected === "Tag Stock" ? true : false}
                onPress={() => {
                  this.checkboxHandler("Tag Stock");
                }}
                disabled={this.props.isLoadingSpinnerActive}
              />
            </View>
          </View>
          <View style={orderStock.orderWrapper}>
            <View style={orderStock.width65}>
              <Text style={orderStock.orderStatusText}>Order Status:</Text>
              <ModalDropdown
                width={Math.round(Dimensions.get("screen").width) / 1.5}
                justForHeader={-22}
                options={this.state.dropdownOptions}
                onSelect={(e) => {
                  this.dropdown(this.state.dropdownOptions[e]);
                }}
                defaultValue="Current Order - Not Shipped"
              />
              <TouchableOpacity
                style={[
                  orderStock.buttonStyle,
                  orderStock.margin30,
                  {
                    backgroundColor:
                      this.state.toBeSentArr.length > 0
                        ? "#3796ff"
                        : "lightgrey",
                  },
                ]}
                onPress={() => this.orderSave()}
                disabled={this.state.toBeSentArr.length > 0 ? false : true}
              >
                <Text style={orderStock.buttonText}>Order</Text>
              </TouchableOpacity>
            </View>
          </View>
          {this.state.stockArray.length > 0 && (
            <View style={orderStock.orderedStockWrapper}>
              <React.Fragment>
                <View style={orderStock.orderedStockHeaderWrapper}>
                  <View
                    style={[
                      global.pangeaBlue,
                      orderStock.orderedStockHeaderItems,
                    ]}
                  ></View>
                  <View
                    style={[
                      global.pangeaBlue,
                      orderStock.orderedStockHeaderItems,
                    ]}
                  >
                    <Text style={orderStock.cancelButtonText}>Description</Text>
                  </View>
                  <View
                    style={[
                      global.pangeaBlue,
                      orderStock.orderedStockHeaderItems,
                    ]}
                  >
                    <Text style={orderStock.cancelButtonText}>
                      Quantity Ordered
                    </Text>
                  </View>
                  <View
                    style={[
                      global.pangeaBlue,
                      orderStock.orderedStockHeaderItems,
                    ]}
                  >
                    <Text style={orderStock.cancelButtonText}>Order Date</Text>
                  </View>
                  <View
                    style={[
                      global.pangeaBlue,
                      orderStock.orderedStockHeaderItems,
                    ]}
                  >
                    <Text style={orderStock.cancelButtonText}>Stock Type</Text>
                  </View>
                </View>
                <ScrollView
                  nestedScrollEnabled={true}
                  style={{
                    maxHeight: Math.round(
                      Dimensions.get("window").height / 2.5
                    ),
                  }}
                >
                  {this.state.stockArray.map((e, index) => {
                    return (
                      <View key={index}>
                        <View style={[global.row, global.width100]}>
                          <View style={orderStock.cancelButtonWrapper}>
                            {this.state.showCancel === true && (
                              <TouchableOpacity
                                style={[
                                  global.pangeaBlue,
                                  orderStock.cancelButton,
                                ]}
                                onPress={() =>
                                  Alert.alert(
                                    "",
                                    "Cancel your order of " +
                                      JSON.stringify(e.qty) +
                                      " " +
                                      JSON.stringify(e.description) +
                                      "?",
                                    [
                                      { text: "Cancel", onPress: null },
                                      {
                                        text: "OK",
                                        onPress: () =>
                                          this.cancel(e.stockDeployId, e),
                                      },
                                    ],
                                    { cancelable: true }
                                  )
                                }
                              >
                                <Text style={[orderStock.cancelButtonText]}>
                                  Cancel
                                </Text>
                              </TouchableOpacity>
                            )}
                          </View>
                          <View style={orderStock.orderedStockHeaderItems}>
                            <Text
                              style={[
                                global.textAlignCenter,
                                orderStock.orderedItemsText,
                              ]}
                            >
                              {e.description}
                            </Text>
                          </View>
                          <View style={orderStock.orderedStockHeaderItems}>
                            <Text
                              style={[
                                global.textAlignCenter,
                                orderStock.orderedItemsText,
                              ]}
                            >
                              {e.qty}
                            </Text>
                          </View>
                          <View style={orderStock.orderedStockHeaderItems}>
                            <Text
                              style={[
                                global.textAlignCenter,
                                orderStock.orderedItemsText,
                              ]}
                            >
                              {e.orderDate}
                            </Text>
                          </View>
                          <View style={orderStock.orderedStockHeaderItems}>
                            <Text
                              style={[
                                global.textAlignCenter,
                                orderStock.orderedItemsText,
                              ]}
                            >
                              {e.stockType}
                            </Text>
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </ScrollView>
              </React.Fragment>
            </View>
          )}
          <View>
            <View style={[orderStock.row]}>
              {this.state.loadData === true &&
                this.state.stockDeployData.map((e, index) => {
                  return (
                    <View
                      key={index}
                      style={[orderStock.stockContainer, orderStock.margin]}
                    >
                      <Image
                        style={[
                          orderStock.image,
                          {
                            height: (e.height * 125) / e.width,
                          },
                        ]}
                        source={{
                          uri: e.uri,
                        }}
                      />

                      <Text style={global.textAlignCenter}>
                        {e.data.StockClientDescription}
                      </Text>
                      <Text style={global.textAlignCenter}>
                        {"Bundle Qty: " + e.data.StockBlankShellOrderQty}
                      </Text>
                      <View style={orderStock.qtyWrapper}>
                        <ModalDropdown
                          width={
                            Math.round(Dimensions.get("screen").width) * 0.15
                          }
                          options={this.state.qtyOptions}
                          onSelect={(e) => {
                            this.qty(e, this.state.stockDeployData[index]);
                          }}
                          defaultValue="0"
                        />
                      </View>
                    </View>
                  );
                })}
            </View>
            <View style={[orderStock.row]}>
              {this.state.loadData === true &&
                this.state.stockData.map((e, index) => {
                  return (
                    <View
                      key={index}
                      style={[orderStock.stockContainer, orderStock.margin]}
                    >
                      <Image
                        style={[
                          orderStock.image,
                          {
                            height: (e.height * 125) / e.width,
                          },
                        ]}
                        source={{
                          uri: e.uri,
                        }}
                      />
                      <Text style={global.textAlignCenter}>
                        {e.data.StockClientDescription}
                      </Text>
                      <Text style={global.textAlignCenter}>
                        {"Bundle Qty: " + e.data.StockBlankShellOrderQty}
                      </Text>
                      <View style={orderStock.qtyWrapper}>
                        <ModalDropdown
                          width={
                            Math.round(Dimensions.get("screen").width) * 0.15
                          }
                          options={this.state.qtyOptions}
                          onSelect={(e) => {
                            this.qty(e, this.state.stockData[index]);
                          }}
                          defaultValue="0"
                        />
                      </View>
                    </View>
                  );
                })}
            </View>
            <View style={orderStock.space50} />
          </View>
        </ScrollView>
      </React.Fragment>
    );
  }
}

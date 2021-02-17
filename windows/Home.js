//this is the container that holds the grid you see on log in

import React, { Component } from "react";
import { Dimensions, View } from "react-native";
import GridData from "../components/GridData";
import { home, global } from "../Styles/Styles";

export default class Home extends Component {
  static navigationOptions = {
    title: "Home",
    selected: "",
  };
  constructor(props) {
    super(props);
    this.state = {
      newUser: "",
      data: this.props.main_Data,
      filter: "",
      selectedAd: "",
      isModalFromGridDataShowing: false,
      height: Math.round(Dimensions.get("window").height),
    };
  }

  componentDidMount = () => {
    this.setState({
      selectedAd: "Current Ad",
    });
  };
  noScanner = () => {
    this.refs.child.noScanner();
  };
  deleteFromArray = (e) => {
    if (e) {
      for (let i = 0; i < e.length; i++) {
        const obj = {
          levelSignId: e[i],
        };
        this.refs.child.multipleSelectedHandler(obj);
      }
    }
  };
  exitScanned = () => {
    this.refs.child.exitScanned();
  };
  resetPagination = () => {
    this.refs.child.resetPagination();
  };
  uncheckAll = () => {
    this.refs.child.uncheckAll();
  };
  resetMultipleSelectedHandler = () => {};
  showPrintScreen = (e) => {
    this.refs.child.showPrintScreen(true, e);
  };
  resetTextInput = () => {
    this.refs.child.resetTextInput();
  };
  displayBatch = () => {};
  showScanner = (bool, action) => {
    this.refs.child.showScanner(bool, action);
  };
  showScannedItems = (bool) => {
    this.props.showScannedItems(bool);
  };
  handleScanner = (idForScanner, n, bool) => {
    this.refs.child.handleScanner(idForScanner, n, bool);
  };
  removeScannedItem = (e) => {
    this.refs.child.removeScannedItemFromArray(e);
  };
  activateSearch = (signType) => {
    this.refs.child.activateSearch(signType);
  };
  removeScannedItemGrid = () => {
    this.refs.child.removeScannedItemGrid();
  };
  multiEditActivate = () => {
    this.refs.child.multiEditActivate();
  };
  render() {
    return (
      <React.Fragment>
        <View style={[global.container]}>
          <View style={home.wrapper}>
            <GridData
              auditMode={this.props.auditMode}
              audit={this.props.audit}
              backToHome={this.props.backToHome}
              checkDate={this.props.checkDate}
              LevelUserInfoBuildBatch={this.props.LevelUserInfoBuildBatch}
              nonEditable={this.props.nonEditable}
              LevelUserStoreMaxQuantityPerStore={
                this.props.LevelUserStoreMaxQuantityPerStore
              }
              LevelUserMaxQuantityPerStore={
                this.props.LevelUserMaxQuantityPerStore
              }
              level={this.props.level}
              showMultiEdit={this.props.showMultiEdit}
              storedSigns={this.props.storedSigns}
              keepItems={this.props.keepItems}
              keepItemArray={this.props.keepItemArray}
              showScannedGrid={this.props.showScannedGrid}
              isLoadingrn={this.props.isLoadingrn}
              showScannedItems={this.showScannedItems}
              disabled={this.props.disabled}
              hideFilterGlitch={this.props.hideFilterGlitch}
              showprintBatchScreen={this.props.showprintBatchScreen}
              hideBarCodeScanner={this.props.hideBarCodeScanner}
              getBatchData={this.props.getBatchData}
              batchEdit={this.props.batchEdit}
              batchTypeID={this.props.batchTypeID}
              notify={this.props.notify}
              home_Trigger={this.props.main_Trigger}
              home_EnableMultipleSelectFromGrid={
                this.props.main_EnableMultipleSelectFromGrid
              }
              isLoading={this.props.isLoading}
              enableDeleteSelected={this.props.enableDeleteSelected}
              main_EnableMultipleSelectFromGridFunc={
                this.props.main_EnableMultipleSelectFromGridFunc
              }
              showPrintScreen={this.props.showPrintScreen}
              ref="child"
              {...this.props}
              home_EnableDeleteSelected={this.props.main_EnableDeleteSelected}
              // this is the data that populates the grid
              // this data is coming from the getCall method on Main.js
              ahead={
                this.props.main_Data.length > 0
                  ? this.props.main_Data[0].ahead
                  : ""
              }
              home_Data={
                this.props.main_Data.length > 0 ? this.props.main_Data : []
              }
              hideFilterTextInput={this.props.hideFilterTextInput}
              currentSignTypeID={this.props.currentSignTypeID}
              hideFilter={this.props.hideFilter}
              promoLevelStamps={this.props.promoLevelStamps}
              getCall={this.props.getCall}
              headeroneFieldLabel={this.props.headeroneFieldLabel}
              headertwoFieldLabel={this.props.headertwoFieldLabel}
              headerthreeFieldLabel={this.props.headerthreeFieldLabel}
              levelUserInfoId={this.props.levelUserInfoId}
              levelId={this.props.levelId}
              refreshBatchEdit={this.props.refreshBatchEdit}
              setSearched={this.props.setSearched}
              isSearchedOriginally={this.props.isSearchedOriginally}
            />
          </View>
        </View>
      </React.Fragment>
    );
  }
}

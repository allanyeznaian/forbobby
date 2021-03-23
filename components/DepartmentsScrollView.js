//props need to have an array of strings fed into it to populate the button scroller
//see <DepartmentsScrollView /> in the Home page for an example
//remove filterfrom top, change bottom search to filter, remove row above print save changes, swipe right to delete, make multiple selectable
//props:
//main_Data: the main contents of the menu: array of objects
//main_Selected: the selected department

import React, { Component } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { departmentScrollView } from "../Styles/Styles";

export default class DepartmentsScrollView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arr: [],
    };
  }
  componentDidMount = () => {
    this.setState({ arr: this.props.main_Data });
    const arr = this.props.main_Data;
    for (let i = 0; i < arr.length; i++) {
      // if (arr[i].LevelDepartmentSortorder == 0) {
      //   // if (this.props.showMultiEdit === false) {
      //   //   this.clickHandler(arr[i].department);
      //   // } else if (this.props.showMultiEdit === true) {
      //   //   this.props.departmentSelectNoCall(arr[i].department.DepartmentId);
      //   // }
      // }
      this.clickHandler(arr[0].department);
    }
    //sorting array by order of 'LevelDepartmentSortorder'
    arr.sort((a, b) =>
      a.LevelDepartmentSortorder > b.LevelDepartmentSortorder
        ? 1
        : b.LevelDepartmentSortorder > a.LevelDepartmentSortorder
        ? -1
        : 0
    );
    //======================================================
    this.setState({ arr: arr });
  };
  clickHandlerFromRef = (e) => {
    this.clickHandler(e);
  };
  departmentSelectNoCall = (e) => {
    this.setState({ selected: e });
  };
  clickHandler = (e) => {
    this.setState({ selected: e.DepartmentName }, () => {
      // if (this.props.showMultiEdit === false) {
      this.props.main_Selected(e.DepartmentId);
      // } else if (this.props.showMultiEdit === true) {
      //   this.props.departmentSelectNoCall(e.DepartmentId);
      // }
    });
  };
  render() {
    return (
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
        {this.state.arr.map((data, index) => {
          return (
            <View key={index}>
              <TouchableOpacity
                style={[
                  departmentScrollView.adTabButtons,
                  {
                    backgroundColor:
                      this.state.selected === data.department.DepartmentName
                        ? this.props.disabled
                          ? "grey"
                          : "#3796ff"
                        : "lightgrey",
                    borderColor:
                      this.state.selected === data.department.DepartmentName
                        ? "tomato"
                        : "#f1f1f1",
                  },
                ]}
                width={100}
                onPress={() => this.clickHandler(data.department)}
                disabled={this.props.disabled}
              >
                <Text
                  style={{
                    color:
                      this.state.selected === data.department.DepartmentName
                        ? "white"
                        : "black",
                  }}
                >
                  {data.department.DepartmentName}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    );
  }
}

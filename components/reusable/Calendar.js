//props:
//date: functional prop that extracts the selected date
//checkDate: if set to "set new" it will set the calendar to todays date
//            otherwise will show the date that's passed in in xx-xx-xxxx format
//defaultIncoming: will set the date to this

import React, { Component } from "react";
import DatePicker from "react-native-datepicker";
import { global } from "../../Styles/Styles";

export default class MyDatePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todaysDate: true,
      showModal: true,
    };
  }

  componentDidMount = () => {
    const today = new Date();
    if (this.props.defaultIncoming) {
      this.setState({ date: this.props.defaultIncoming });
    } else if (this.props.checkDate === "set new") {
      const date =
        today.getDate() +
        "-" +
        parseInt(today.getMonth() + 1) +
        "-" +
        today.getFullYear();
      this.setState({ date: date });
      this.props.date(date);
    } else if (this.props.defaultIncoming.length < 1) {
      this.setState({ date: "" });
    } else if (!this.props.checkDate) {
      const date =
        today.getDate() +
        "-" +
        parseInt(today.getMonth() + 1) +
        "-" +
        today.getFullYear();
      this.setState({ date: date });
      this.props.date(date);
    } else {
      this.setState({ date: this.props.checkDate });
    }
  };
  setNewDate = (d) => {
    this.setState({ todaysDate: false });
    this.newer(d);
  };
  newer = (d) => {
    this.setState({ date: d });
    this.props.date(d);
  };

  render() {
    return (
      <DatePicker
        style={global.width200}
        date={this.state.date}
        mode="date"
        placeholder="select date"
        format="MM-DD-YYYY"
        // minDate="2016-05-01"
        // maxDate="2016-06-01"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        customStyles={{
          dateIcon: {
            position: "absolute",
            left: 0,
            top: 4,
            marginLeft: 0,
          },
          dateInput: {
            marginLeft: 36,
          },
        }}
        onDateChange={(date) => {
          this.setNewDate(date);
        }}
      />
    );
  }
}

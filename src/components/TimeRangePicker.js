import "rc-time-picker/assets/index.css";


import moment from "moment";
import TimePicker from "rc-time-picker";

const isBeforeTime = (time1, time2) =>
  time1.minutes() + time1.hours() * 60 < time2.minutes() + time2.hours();

export default class TimeRangePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value1: props.value.clone(),
      value2: props.value.clone().add(props.minuteStep, "minutes")
    };
  }

  handleValueChange1 = (value1) => {
    if (!value1) {
      this.setState({
        value1
      });
      return;
    }
    this.setState((previousState) => ({
      value1: value1.clone(),
      value2:
        previousState.value2 && isBeforeTime(value1, previousState.value2)
          ? previousState.value2.clone()
          : value1.clone().add(this.props.minuteStep, "minutes")
    }));
  };

  handleValueChange2 = (value2) => {
    if (!value2) {
      this.setState({
        value2
      });
      return;
    }
    this.setState((previousState) => ({
      value1:
        previousState.value1 && isBeforeTime(previousState.value1, value2)
          ? previousState.value1.clone()
          : value2.clone().subtract(this.props.minuteStep, "minutes"),
      value2: value2.clone()
    }));
  };

  render() {
    const { value1, value2 } = this.state;
    return (
      <div>
        <TimePicker
          value={value1}
          disabledHours={() => this.props.disabledHours}
          minuteStep={this.props.minuteStep}
          showSecond={false}
          onChange={this.handleValueChange1}
        />
        <TimePicker
          value={value2}
          disabledHours={() => this.props.disabledHours}
          minuteStep={this.props.minuteStep}
          showSecond={false}
          onChange={this.handleValueChange2}
        />
      </div>
    );
  }
}

TimeRangePicker.defaultProps = {
  disabledHours: [0, 1, 2, 3, 4, 5, 6, 7, 17, 18, 19, 20, 21, 22, 23],
  value: moment().set("hours", 8).set("minutes", 0),
  minuteStep: 30
};

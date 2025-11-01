import moment from "moment";
import type { Moment } from "moment";

export var scheduleData = [
  {
    date: moment().startOf("week").add(9, "day").add(10, "hour") as Moment,
    title: "Gamin!",
    color: "oklch(97.3% 0.071 103.193)",
  },
  {
    date: moment().startOf("week").add(11, "days").add(10, "hour") as Moment,
    title: "Drawing Ellie Bonaparte!",
    color: "rgb(244, 168, 255)",
  },
  {
    date: moment().startOf("week").add(13, "days").add(10, "hour") as Moment,
    title: "Therapy!",
    color: "#00d3f2",
  },
];


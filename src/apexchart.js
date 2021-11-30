import React from "react";
import Chart from "react-apexcharts";

export default (props) => {
  const options = {
    chart: {
      zoom: {
        enabled: false,
      },
      animations: {
        enabled: true,
        easing: "linear",
        dynamicAnimation: {
          speed: 300,
        },
      },
    },
    tooltip: {
      x: {
        format: "yyyy/MM/dd HH:mm:ss.f",
      },
    },
    xaxis: {
      type: "datetime",
      range: props.range,
    },
    yaxis: {
      title: { text: "Value" },
      max: 1024,
    },
  };
  return (
    <Chart
      type="line"
      options={options}
      series={props.dataList}
      height={window.innerHeight - 50}
      width={window.innerWidth - 50}
    />
  );
};

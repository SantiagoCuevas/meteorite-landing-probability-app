import { useMemo } from "react";
import { formatPieChartData } from "../AI/data/data";
import { AgCharts } from "ag-charts-react";

export const PieChart = (props) => {
  const { cleanData } = props;
  const pieChartData = useMemo(
    () => formatPieChartData(cleanData),
    [cleanData]
  );

  const options = {
    data: pieChartData,
    title: {
      text: "Top 10 Meteorite Classifications",
    },
    series: [
      {
        type: "pie",
        angleKey: "count",
        legendItemKey: "recclass",
      },
    ],
  };
  return <AgCharts options={options} />;
};

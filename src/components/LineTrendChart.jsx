import { useMemo } from "react";
import { formatLineTrendChart } from "../AI/data/data";
import { AgCharts } from "ag-charts-react";

export const LineTrendChart = (props) => {
  const { cleanData } = props;
  const lineTrendChartData = useMemo(
    () => formatLineTrendChart(cleanData),
    [cleanData]
  );

  const options = {
    title: { text: "Meteorite Landings per Century (840–2016)" },
    data: lineTrendChartData,
    series: [
      { type: "line", xKey: "range", yKey: "count", marker: { enabled: true } },
    ],
    axes: [
      { type: "category", position: "bottom", title: { text: "Century" } },
      {
        type: "number",
        position: "left",
        title: { text: "Meteorite Landings" },
      },
    ],
  };
  return <AgCharts options={options} />;
};

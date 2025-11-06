import { AgCharts } from "ag-charts-react";
import { useMemo } from "react";

export const HistogramChart = (props) => {
  const { cleanData } = props;
  const dataForHist = useMemo(
    () =>
      cleanData
        .filter((item) => item.mass > 0)
        .map((item) => ({
          ...item,
          logMass: Math.log10(item.mass),
        })),
    [cleanData]
  );

  const options = {
    title: {
      text: "Meteorite Mass",
    },
    data: dataForHist,
    series: [
      {
        type: "histogram",
        xKey: "logMass",
        xName: "Mass in Grams",
      },
    ],
    axes: [
      {
        type: "number",
        position: "bottom",
        title: { text: "Mass (g)" },
        label: { formatter: ({ value }) => `${Math.round(10 ** value)}` },
        min: 1,
      },
      {
        type: "number",
        position: "left",
        title: { text: "Number of Meteorites" },
      },
    ],
  };
  return <AgCharts options={options} />;
};

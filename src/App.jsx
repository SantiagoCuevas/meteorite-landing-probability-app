import { useMemo, useState } from "react";
import "./App.css";
import { cleanUpData, getData } from "./AI/data/data";
import { PieChart } from "./components/PieChart";
import { HistogramChart } from "./components/HistogramChart";
import { LineTrendChart } from "./components/LineTrendChart";

function App() {
  const [count, setCount] = useState(0);
  const data = getData();
  const cleanData = useMemo(() => cleanUpData(data), [data]);

  // const findEntry = (input) => {
  //   return input.find((item) => item.id === "18816");
  // };
  // const findCleanEntry = (input) => {
  //   return input.find((item) => item.id === 18816);

  // const entry = findEntry(data);
  // const findNewEntry = findCleanEntry(cleanData);

  // console.log("xx uncleaned", entry);
  // console.log("xx cleaned", findNewEntry);

  return (
    <>
      <ModelTestComponent />
      <div style={{ width: "700px", height: "500px", margin: "0 auto" }}>
        <PieChart cleanData={cleanData} />
      </div>
      <div style={{ width: "700px", height: "500px", margin: "0 auto" }}>
        <HistogramChart cleanData={cleanData} />
      </div>
      <div style={{ width: "700px", height: "500px", margin: "0 auto" }}>
        <LineTrendChart cleanData={cleanData} />
      </div>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </>
  );
}

export default App;

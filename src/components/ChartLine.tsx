import { Spinner } from "@nextui-org/react";
import dynamic from "next/dynamic";

interface ChartLineProps {
  height?: number
}

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => <Spinner />,
});

const ChartLine: React.FC<ChartLineProps> = ({height}) => {
  const [chartState, setChartState] = useState({
    options: {
      chart: {
        id: "",
      },
      xaxis: {
        categories: ["Mon", "Tue", "Wed", "Thr", "Fri", "Sat", "Sun"],
      },
    },
    series: [
      {
        name: "Open",
        data: new Array(7).fill(null).map(() => Math.round(Math.random() * 20)),
      },
      {
        name: "In Progress",
        data: new Array(7).fill(null).map(() => Math.round(Math.random() * 20)),
      },
      {
        name: "Resolved",
        data: new Array(7).fill(null).map(() => Math.round(Math.random() * 20)),
      },
    ],
  });

  return (
    <Chart
      aria-label="Ticket by a day of week"
      options={chartState.options}
      series={chartState.series}
      type="line"
      width="100%"
      height={height?? 400}
    />
  );
};

export default ChartLine;

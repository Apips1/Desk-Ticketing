"use client";
import { Button, Card, CardBody, Pagination, Spinner } from "@nextui-org/react";
import { Fragment } from "react";
import dynamic from "next/dynamic";
import { ResponseDashboard } from "@/app/_types/dashboard/response-dashboard";
import { ResponseDashboardChart } from "@/app/_types/dashboard/response-dashboard-chart";
import { DateTime } from "luxon";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import Image from "next/image";
import CardCustomer from "@/components/CardCustomer";
import { useAuthMe } from "@/services/auth";

type ChartData = {
  options: {
    chart: {
      id: string;
    };
    xaxis: {
      categories: string[];
    };
  };
  series: {
    name: string;
    data: number[];
  }[];
};

export default function DashboardContent() {
  const Chart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
    loading: () => <Spinner />,
  });

  const [chartState, setChartState] = useState<ChartData>({
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

  const {
    data: dashboard,
    isFetching,
    isError,
  } = useHttp<ResponseDashboard>("/agent/dashboard/total-ticket");
  const {
    data: dashboardChart,
    isFetching: isLoadingChart,
    isError: isErrorChart,
  } = useHttp<ResponseDashboardChart>("/agent/dashboard/");

  useEffect(() => {
    if (dashboardChart?.data) {
      const chartData = Object.keys(dashboardChart.data).map((key) => {
        const data = Object.entries(dashboardChart.data).map(
          ([key, value]) => value,
        );
        const open = data.map((d) => d.open);
        const close = data.map((d) => d.close);
        const day = data.map(
          (d) => d.dayName.charAt(0).toUpperCase() + d.dayName.slice(1),
        );
        return [
          {
            day: day,
            data: {
              open: open,
              close: close,
            },
          },
        ];
      });

      setChartState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            categories: chartData[0][0].day,
          },
          chart: {
            id: `Agent-data-by-day-${DateTime.now().toFormat("dd-MM-yyyy")}`,
          },
        },
        series: [
          {
            name: "Open Ticket",
            data: chartData[0][0].data.open,
          },
          {
            name: "Closed Ticket",
            data: chartData[0][0].data.close,
          },
        ],
      }));
    }
  }, [dashboardChart]);

  if (isError) {
    return <Spinner />;
  }

  return (
    <Fragment>
      <div className="mb-4">
        <h1 className="font-semibold text-xl mb-4">Our Customer</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4">
          {new Array(3).fill(null).map((v, i) => (
            <CardCustomer key={i} data={{}} />
          ))}
        </div>
        <div className="flex justify-center items-center gap-2">
          <Button className="h-9" variant="bordered">
            <FaChevronLeft />
            Prev
          </Button>
          <Pagination variant="bordered" initialPage={1} total={10} />
          <Button className="h-9" variant="bordered">
            Next
            <FaChevronRight />
          </Button>
        </div>
      </div>

      <div className="mb-4 w-full">
        <Card shadow="sm">
          <CardBody>
            <p className="pl-4 text-sm">Ticket by a day of week</p>
            <Chart
              aria-label="Ticket by a day of week"
              options={chartState.options}
              series={chartState.series}
              type="line"
              width="100%"
              height={400}
            />
          </CardBody>
        </Card>
      </div>
    </Fragment>
  );
}

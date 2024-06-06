import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { getPriceStats } from "../services";

const BarChart = ({ month }) => {
  const [chartData, setChartData] = useState({ categories: [], data: [] });

  const fetchPriceStats = async () => {
    try {
      const response = await getPriceStats(month || 'march');
      const categories = [];
      const data = [];
      response.data?.forEach(({ range, count }) => {
        categories.push(range);
        data.push(count);
      });
      setChartData({ categories, data });
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    fetchPriceStats();
  }, [month]);

  const series = [
    {
      name: "Data",
      data: chartData.data,
    },
  ];

  const options = {
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: chartData.categories,
    },
    title: {
      text: `Bar Chart Stats - ${month}`,
      align: "left",
      style: {
        fontSize: "25px",
        fontWeight: "bold",
      },
    },
  };

  return (
    <div>
      <br />
      <br />
      <Chart options={options} series={series} type="bar" height={350} />
    </div>
  );
};

export { BarChart };

import React from "react";
import { Bar, Chart } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js/auto";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement
);



function BarChart({ chartData }) {
  return <Chart  type="bar" data={chartData}  />;
}

export default BarChart;

<script setup lang="ts">
import { format } from "date-fns";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement
} from "chart.js";
import { Bar,Line } from "vue-chartjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement
);
interface Stat {
  aggregate: number;
  date: string;
}

const { data: statsThisMonth } = await useLazySanctumFetch<{ attendance: Stat[] }>(
  "/api/stats/attendance-this-month"
);

const {data: statsThisYear} = await useLazySanctumFetch<{ attendance: Stat[] }>(
  "/api/stats/attendance-this-year"
);

const mothData = computed(() => {
  const monthLabels = statsThisMonth.value?.attendance.map((stat) => format(new Date(stat.date), "dd MMM"));
  const monthData = statsThisMonth.value?.attendance.map((stat) => stat.aggregate);
  return {
    labels: monthLabels,
    datasets: [
      {
        label: "Attendance This Month",
        backgroundColor: "rgb(162, 232, 187)",
        data: monthData
      }
    ],
  };
});

const yearData = computed(() => {
  const monthLabels = statsThisYear.value?.attendance.map((stat) => format(new Date(stat.date), "MMM"));
  const monthData = statsThisYear.value?.attendance.map((stat) => stat.aggregate);
  return {
    labels: monthLabels,
    datasets: [
      {
        label: "Attendance This Year",
        backgroundColor: "rgb(255, 99, 132)",
        data: monthData
      }
    ],
  };
});
</script>

<template>
  <div class="flex gap-2 md:gap-4 max-h-96">
    <Bar :data="mothData" :options="{ responsive: true }" />
    <Line :data="yearData" :options="{ responsive: true }" />
  </div>
</template>

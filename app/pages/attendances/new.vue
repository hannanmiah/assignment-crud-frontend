<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { Student } from "~/types";

const client = useSanctumClient();
const toast = useToast();

const UAvatar = resolveComponent("UAvatar");
const UButton = resolveComponent("UButton");
const UBadge = resolveComponent("UBadge");
const USelect = resolveComponent("USelect");
const UInput = resolveComponent("UInput");

const classFilter = ref("");
const attendance = ref<{ [key: string]: "present" | "absent" | "late" }>({});
const attendanceDate = ref(new Date().toISOString().split("T")[0]);

const { data: students, status } = await useLazySanctumFetch<{
  data: Student[];
}>(
  "/api/students",
  () => ({
    params: {
      class: classFilter.value,
      per_page: 100,
    },
  }),
  {
    watch: [classFilter],
  }
);

const attendancePercentage = computed(() => {
  const totalStudents = students.value?.data.length || 0;
  if (totalStudents === 0) {
    return 0;
  }
  const presentStudents = Object.values(attendance.value).filter(
    (status) => status === "present"
  ).length;
  return (presentStudents / totalStudents) * 100;
});

const columns: TableColumn<Student>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return h("div", { class: "flex items-center gap-3" }, [
        h(UAvatar, {
          ...{
            src: row.original.photo,
            alt: row.original.name,
          },
          size: "lg",
        }),
        h("div", undefined, [
          h("p", { class: "font-medium text-highlighted" }, row.original.name),
          h("p", { class: "" }, `@${row.original.name}`),
        ]),
      ]);
    },
  },
  {
    accessorKey: "class",
    header: "Class",
  },
  {
    accessorKey: "section",
    header: "Section",
  },
  {
    id: "attendance",
    header: "Attendance",
    cell: ({ row }) => {
      return h("div", { class: "flex items-center gap-2" }, [
        h(UButton, {
          label: "Present",
          variant: attendance.value[row.original.id] === "present" ? "solid" : "outline",
          color:
            attendance.value[row.original.id] === "present"
              ? "primary"
              : "neutral",
          onClick: () => (attendance.value[row.original.id] = "present"),
        }),
        h(UButton, {
          label: "Absent",
          variant: attendance.value[row.original.id] === "absent" ? "solid" : "outline",
          color:
            attendance.value[row.original.id] === "absent" ? "error" : "neutral",
          onClick: () => (attendance.value[row.original.id] = "absent"),
        }),
        h(UButton, {
          label: "Late",
          variant: attendance.value[row.original.id] === "late" ? "solid" : "outline",
          color:
            attendance.value[row.original.id] === "late" ? "warning" : "neutral",
          onClick: () => (attendance.value[row.original.id] = "late"),
        }),
      ]);
    },
  },
];

function markAll(status: "present" | "absent" | "late") {
  if (students.value?.data) {
    students.value.data.forEach((student) => {
      attendance.value[student.id] = status;
    });
  }
}

async function submitAttendance() {
  const attendanceData = Object.entries(attendance.value).map(
    ([student_id, status]) => ({
      student_id: parseInt(student_id),
      date: attendanceDate.value,
      status,
    })
  );

  try {
    await client("/api/attendance", {
      method: "POST",
      body: attendanceData,
    });
    toast.add({
      title: "Success",
      description: "Attendance recorded successfully",
    });
  } catch (error) {
    toast.add({
      title: "Error recording attendance",
      color: "error",
    });
  }
}
</script>

<template>
  <UDashboardPanel id="attendance-recording">
    <template #header>
      <UDashboardNavbar title="Record Attendance">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-wrap items-center justify-between gap-1.5 mb-4">
        <USelect
          v-model="classFilter"
          :items="[
            { label: 'One', value: 'one' },
            { label: 'Two', value: 'two' },
            { label: 'Three', value: 'three' },
            { label: 'Four', value: 'four' },
            { label: 'Five', value: 'five' },
          ]"
          placeholder="Select a class"
          class="min-w-48"
        />
        <div class="flex items-center gap-2">
          <UButton label="Mark All Present" @click="markAll('present')" />
          <UButton label="Mark All Absent" @click="markAll('absent')" />
          <UButton label="Mark All Late" @click="markAll('late')" />
        </div>
      </div>

      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-medium">
          Attendance:
          <span class="font-bold text-primary">
            {{ attendancePercentage.toFixed(2) }}%
          </span>
        </h3>
        <div class="flex items-center gap-2">
          <UInput v-model="attendanceDate" type="date" />
          <UButton label="Submit Attendance" @click="submitAttendance" />
        </div>
      </div>

      <UTable
        class="shrink-0"
        :data="students?.data"
        :columns="columns"
        :loading="status === 'pending'"
        :ui="{
          base: 'table-fixed border-separate border-spacing-0',
          thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
          tbody: '[&>tr]:last:[&>td]:border-b-0',
          th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
          td: 'border-b border-default',
          separator: 'h-0',
        }"
      />
    </template>
  </UDashboardPanel>
</template>

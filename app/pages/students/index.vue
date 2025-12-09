<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { upperFirst } from "scule";
import type { Row } from "@tanstack/table-core";
import type { User, Student } from "~/types";

const UAvatar = resolveComponent("UAvatar");
const UButton = resolveComponent("UButton");
const UBadge = resolveComponent("UBadge");
const UDropdownMenu = resolveComponent("UDropdownMenu");
const UCheckbox = resolveComponent("UCheckbox");

const toast = useToast();
const table = useTemplateRef("table");

const page = ref(1);
const search = ref("");
const classFilter = ref("");
const selectedStudent = ref();
const deleteModalOpen = ref(false);

const columnVisibility = ref();

const { data: students, status,refresh } = await useLazySanctumFetch<{
  data: Student[];
}>(
  "/api/students",
  () => ({
    params: {
      page: page.value,
      search: search.value,
      class: classFilter.value,
    },
  }),
  {
    watch: [page, search, classFilter],
  }
);

function getRowItems(row: Row<User>) {
  return [
    {
      type: "label",
      label: "Actions",
    },
    {
      label: "Copy student ID",
      icon: "i-lucide-copy",
      onSelect() {
        navigator.clipboard.writeText(row.original.id.toString());
        toast.add({
          title: "Copied to clipboard",
          description: "Student ID copied to clipboard",
        });
      },
    },
    {
      type: "separator",
    },
    {
      label: "Edit Student",
      icon: "i-lucide-pencil",
      onSelect() {
        selectedStudent.value = row.original;
        toast.add({
          title: "Customer edited",
          description: "The customer has been edited.",
        });
      },
    },
    {
      type: "separator",
    },
    {
      label: "Delete Student",
      icon: "i-lucide-trash",
      color: "error",
      onSelect() {
        deleteModalOpen.value = true;
        selectedStudent.value = row.original;
      },
    },
  ];
}

const columns: TableColumn<Student>[] = [
  {
    id: "select",
    header: ({ table }) =>
      h(UCheckbox, {
        modelValue: table.getIsSomePageRowsSelected()
          ? "indeterminate"
          : table.getIsAllPageRowsSelected(),
        "onUpdate:modelValue": (value: boolean | "indeterminate") =>
          table.toggleAllPageRowsSelected(!!value),
        ariaLabel: "Select all",
      }),
    cell: ({ row }) =>
      h(UCheckbox, {
        modelValue: row.getIsSelected(),
        "onUpdate:modelValue": (value: boolean | "indeterminate") =>
          row.toggleSelected(!!value),
        ariaLabel: "Select row",
      }),
  },
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
    cell: ({ row }) => row.original.section,
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => {
      return new Date(row.original.created_at).toDateString();
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return h(
        "div",
        { class: "text-right" },
        h(
          UDropdownMenu,
          {
            content: {
              align: "end",
            },
            items: getRowItems(row),
          },
          () =>
            h(UButton, {
              icon: "i-lucide-ellipsis-vertical",
              color: "neutral",
              variant: "ghost",
              class: "ml-auto",
            })
        )
      );
    },
  },
];
</script>

<template>
  <UDashboardPanel id="students">
    <template #header>
      <UDashboardNavbar title="Students">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <StudentAddModal @added="refresh" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-wrap items-center justify-between gap-1.5">
        <UInput
          v-model="search"
          class="max-w-sm"
          icon="i-lucide-search"
          placeholder="search..."
        />

        <div class="flex flex-wrap items-center gap-1.5">
          <LazyStudentDeleteModal
            v-model="deleteModalOpen"
            :student="selectedStudent"
            @deleted="refresh"
          >
          </LazyStudentDeleteModal>

          <USelect
            v-model="classFilter"
            :items="[
              { label: 'One', value: 'one' },
              { label: 'Two', value: 'two' },
              { label: 'Three', value: 'three' },
            ]"
            placeholder="Filter class"
            class="min-w-28"
          />
          <UDropdownMenu
            :items="
              table?.tableApi
                ?.getAllColumns()
                .filter((column: any) => column.getCanHide())
                .map((column: any) => ({
                  label: upperFirst(column.id),
                  type: 'checkbox' as const,
                  checked: column.getIsVisible(),
                  onUpdateChecked(checked: boolean) {
                    table?.tableApi?.getColumn(column.id)?.toggleVisibility(!!checked)
                  },
                  onSelect(e?: Event) {
                    e?.preventDefault()
                  }
                }))
            "
            :content="{ align: 'end' }"
          >
            <UButton
              label="Display"
              color="neutral"
              variant="outline"
              trailing-icon="i-lucide-settings-2"
            />
          </UDropdownMenu>
        </div>
      </div>

      <UTable
        ref="table"
        v-model:column-visibility="columnVisibility"
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

      <div
        class="flex items-center justify-between gap-3 border-t border-default pt-4 mt-auto"
      >
        <div class="text-sm text-muted">
          {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }}
          of
          {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} row(s)
          selected.
        </div>

        <div class="flex items-center gap-1.5">
          <UPagination
            v-model:page="page"
            :items-per-page="students?.meta?.per_page"
            :total="students?.meta?.total"
          />
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>

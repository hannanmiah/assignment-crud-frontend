<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { upperFirst } from "scule";
import type { Row } from "@tanstack/table-core";
import type { User, Product } from "~/types";

const UAvatar = resolveComponent("UAvatar");
const UButton = resolveComponent("UButton");
const UBadge = resolveComponent("UBadge");
const UDropdownMenu = resolveComponent("UDropdownMenu");
const UCheckbox = resolveComponent("UCheckbox");

const toast = useToast();
const table = useTemplateRef("table");

const page = ref(1);
const search = ref("");
const statusFilter = ref("");
const selectedProduct = ref();
const deleteModalOpen = ref(false);
const editModalOpen = ref(false);

const columnVisibility = ref();

const { data: products, status, refresh } = await useLazySanctumFetch<{
  data: Product[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}>(
  "/api/products",
  () => ({
    params: {
      page: page.value,
      search: search.value,
      is_active: statusFilter.value === "" ? undefined : statusFilter.value === 'active' ? true : false,
    },
  }),
  {
    watch: [page, search, statusFilter],
  }
);

function getRowItems(row: Row<Product>) {
  return [
    {
      type: "label",
      label: "Actions",
    },
    {
      label: "Copy product ID",
      icon: "i-lucide-copy",
      onSelect() {
        navigator.clipboard.writeText(row.original.id.toString());
        toast.add({
          title: "Copied to clipboard",
          description: "Product ID copied to clipboard",
        });
      },
    },
    {
      type: "separator",
    },
    {
      label: "Edit Product",
      icon: "i-lucide-pencil",
      onSelect() {
        selectedProduct.value = row.original;
        editModalOpen.value = true;
      },
    },
    {
      type: "separator",
    },
    {
      label: "Delete Product",
      icon: "i-lucide-trash",
      color: "error",
      onSelect() {
        deleteModalOpen.value = true;
        selectedProduct.value = row.original;
      },
    },
  ];
}

const columns: TableColumn<Product>[] = [
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
        h("div", undefined, [
          h("p", { class: "font-medium text-highlighted" }, row.original.name),
          h("p", { class: "text-sm text-muted" }, row.original.description.substring(0, 50) + (row.original.description.length > 50 ? "..." : "")),
        ]),
      ]);
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => `$${row.original.price.toFixed(2)}`,
  },
  {
    accessorKey: "stock",
    header: "Stock",
    cell: ({ row }) => {
      const stock = row.original.stock;
      const color = stock > 20 ? "success" : stock > 10 ? "warning" : "error";
      return h(UBadge, {
        color,
        variant: "subtle",
        label: stock.toString(),
      });
    },
  },
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => {
      return h(UBadge, {
        color: row.original.is_active ? "success" : "error",
        variant: "subtle",
        label: row.original.is_active ? "Active" : "Inactive",
      });
    },
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
  <UDashboardPanel id="products">
    <template #header>
      <UDashboardNavbar title="Products">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <ProductAddModal @added="refresh" />
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
          <LazyProductDeleteModal
            v-if="selectedProduct"
            v-model="deleteModalOpen"
            :product="selectedProduct"
            @deleted="refresh"
          />

          <USelect
            v-model="statusFilter"
            :items="[
              { label: 'All', value: '' },
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' },
            ]"
            placeholder="Filter status"
            class="min-w-32"
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
        :data="products?.data"
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
            :items-per-page="products?.pagination?.per_page || 10"
            :total="products?.pagination?.total || 0"
          />
        </div>
      </div>
    </template>

    <LazyProductEditModal
      v-if="selectedProduct"
      v-model="editModalOpen"
      :product="selectedProduct"
      @updated="refresh"
    />
  </UDashboardPanel>
</template>
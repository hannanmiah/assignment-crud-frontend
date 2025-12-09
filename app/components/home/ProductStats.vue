<script setup lang="ts">
interface ProductStatistics {
  total_products: number;
  active_products: number;
  inactive_products: number;
  total_users: number;
  total_stock_value: number;
  out_of_stock_products: number;
  low_stock_products: number;
}

const client = useSanctumClient();

const { data: stats } = await useAsyncData<ProductStatistics>(
  "product-stats",
  () => {
    return client("/api/statistics/overview");
  },
  {
    default: () => ({
      total_products: 0,
      active_products: 0,
      inactive_products: 0,
      total_users: 0,
      total_stock_value: 0,
      out_of_stock_products: 0,
      low_stock_products: 0,
    }),
  }
);

// Format currency value
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
};
</script>

<template>
  <UPageGrid class="lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-px">
    <UPageCard
      icon="i-lucide-package"
      title="Total Products"
      variant="subtle"
      :ui="{
        container: 'gap-y-1.5',
        wrapper: 'items-start',
        leading:
          'p-2.5 rounded-full bg-primary/10 ring ring-inset ring-primary/25 flex-col',
        title: 'font-normal text-muted text-xs uppercase',
      }"
      class="lg:rounded-none first:rounded-l-lg last:rounded-r-lg hover:z-1"
    >
      <div class="flex items-center gap-2">
        <span class="text-2xl font-semibold text-highlighted">
          {{ stats.total_products }}
        </span>
      </div>
      <div class="text-sm text-muted">
        {{ stats.active_products }} active, {{ stats.inactive_products }} inactive
      </div>
    </UPageCard>

    <UPageCard
      icon="i-lucide-dollar-sign"
      title="Stock Value"
      variant="subtle"
      :ui="{
        container: 'gap-y-1.5',
        wrapper: 'items-start',
        leading:
          'p-2.5 rounded-full bg-green-500/10 ring ring-inset ring-green-500/25 flex-col',
        title: 'font-normal text-muted text-xs uppercase',
      }"
      class="lg:rounded-none first:rounded-l-lg last:rounded-r-lg hover:z-1"
    >
      <div class="flex items-center gap-2">
        <span class="text-2xl font-semibold text-highlighted">
          {{ formatCurrency(stats.total_stock_value) }}
        </span>
      </div>
    </UPageCard>

    <UPageCard
      icon="i-lucide-alert-triangle"
      title="Stock Alerts"
      variant="subtle"
      :ui="{
        container: 'gap-y-1.5',
        wrapper: 'items-start',
        leading:
          'p-2.5 rounded-full bg-orange-500/10 ring ring-inset ring-orange-500/25 flex-col',
        title: 'font-normal text-muted text-xs uppercase',
      }"
      class="lg:rounded-none first:rounded-l-lg last:rounded-r-lg hover:z-1"
    >
      <div class="flex items-center gap-2">
        <span class="text-2xl font-semibold text-highlighted">
          {{ stats.out_of_stock_products + stats.low_stock_products }}
        </span>
      </div>
      <div class="text-sm text-muted">
        {{ stats.out_of_stock_products }} out of stock, {{ stats.low_stock_products }} low stock
      </div>
    </UPageCard>

    <UPageCard
      icon="i-lucide-users"
      title="Total Users"
      variant="subtle"
      :ui="{
        container: 'gap-y-1.5',
        wrapper: 'items-start',
        leading:
          'p-2.5 rounded-full bg-blue-500/10 ring ring-inset ring-blue-500/25 flex-col',
        title: 'font-normal text-muted text-xs uppercase',
      }"
      class="lg:rounded-none first:rounded-l-lg last:rounded-r-lg hover:z-1"
    >
      <div class="flex items-center gap-2">
        <span class="text-2xl font-semibold text-highlighted">
          {{ stats.total_users }}
        </span>
      </div>
    </UPageCard>
  </UPageGrid>
</template>
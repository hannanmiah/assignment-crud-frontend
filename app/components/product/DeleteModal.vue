<script setup lang="ts">
import type { Product } from '~/types'

const {product} = defineProps<{
  product: Product | null
}>()

const client = useSanctumClient()
const toast = useToast()
const emit = defineEmits(['deleted'])

const open = defineModel()

async function onSubmit() {
  if (!product) return;

  try {
    await client(`/api/products/${product.id}`, {
      method: "DELETE",
    });
    toast.add({
      title: "Success",
      description: `Product "${product.name}" deleted successfully`,
      color: "success",
    });
    open.value = false;
    emit("deleted");
  } catch (err) {
    toast.add({
      title: "Failed",
      description: err?.message || "Failed to delete product.",
      color: "error",
    });
  }
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="`Delete ${product?.name || 'Product'}?`"
    :description="`Are you sure you want to delete '${product?.name || 'this product'}'? This action cannot be undone.`"
  >
    <slot />

    <template #body>
      <div class="flex justify-end gap-2">
        <UButton
          label="Cancel"
          color="neutral"
          variant="subtle"
          @click="open = false"
        />
        <UButton
          label="Delete"
          color="error"
          variant="solid"
          loading-auto
          @click="onSubmit"
        />
      </div>
    </template>
  </UModal>
</template>
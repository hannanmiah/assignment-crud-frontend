<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import type { Product } from '~/types';

const UTextarea = resolveComponent("UTextarea");

const props = defineProps<{
  product: Product | null;
}>();

const emit = defineEmits(["updated"]);

const client = useSanctumClient();
const form = useTemplateRef("form");

const schema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be at least 0").max(999999.99, "Price is too high"),
  stock: z.number().int().min(0, "Stock must be at least 0"),
  is_active: z.boolean(),
});

const open = defineModel();

type Schema = z.output<typeof schema>;

// Initialize form state when product changes
const state = reactive<Partial<Schema>>({
  name: undefined,
  description: undefined,
  price: undefined,
  stock: undefined,
  is_active: true,
});

// Watch for product changes and update state
watch(() => props.product, (newProduct) => {
  if (newProduct) {
    state.name = newProduct.name;
    state.description = newProduct.description;
    state.price = newProduct.price;
    state.stock = newProduct.stock;
    state.is_active = newProduct.is_active;
  }
}, { immediate: true });

const toast = useToast();
async function onSubmit(event: FormSubmitEvent<Schema>) {
  if (!props.product) return;

  try {
    await client(`/api/products/${props.product.id}`, {
      method: "PUT",
      body: {
        ...event.data,
      },
    });
    toast.add({
      title: "Success",
      description: `Product "${event.data.name}" updated successfully`,
      color: "success",
    });
    open.value = false;
    emit("updated");
  } catch (err) {
    if (err?.status === 422) {
      form.value.errors = transformValidationErrors(err.data.errors);
      toast.add({
        title: "Validation Failed",
        description: err?.data?.message || "Failed to update product.",
        color: "error",
      });
      return;
    }
    toast.add({
      title: "Failed",
      description: err?.message || "Failed to update product.",
      color: "error",
    });
  }
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="`Edit Product: ${product?.name || ''}`"
    description="Update product information"
  >
    <template #body>
      <UForm
        v-if="product"
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
        ref="form"
      >
        <UFormField label="Name" placeholder="Product name" name="name">
          <UInput
            v-model="state.name"
            class="w-full"
            placeholder="Enter product name"
          />
        </UFormField>

        <UFormField label="Description" placeholder="Product description" name="description">
          <UTextarea
            v-model="state.description"
            class="w-full"
            placeholder="Enter product description"
            :rows="3"
          />
        </UFormField>

        <UFormField label="Price" placeholder="0.00" name="price">
          <UInput
            v-model="state.price"
            type="number"
            step="0.01"
            min="0"
            class="w-full"
            placeholder="Enter product price"
          />
        </UFormField>

        <UFormField label="Stock Quantity" placeholder="0" name="stock">
          <UInput
            v-model="state.stock"
            type="number"
            min="0"
            class="w-full"
            placeholder="Enter stock quantity"
          />
        </UFormField>

        <UFormField name="is_active">
          <UCheckbox
            v-model="state.is_active"
            label="Active"
            description="Product will be available for sale"
          />
        </UFormField>

        <div class="flex justify-end gap-2">
          <UButton
            label="Cancel"
            color="neutral"
            variant="subtle"
            @click="open = false"
          />
          <UButton
            label="Update"
            color="primary"
            variant="solid"
            type="submit"
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>

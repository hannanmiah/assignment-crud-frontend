<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

const UTextarea = resolveComponent("UTextarea");

const emit = defineEmits(["added"]);

const client = useSanctumClient();
const form = useTemplateRef("form");

const schema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be at least 0").max(999999.99, "Price is too high"),
  stock: z.number().int().min(0, "Stock must be at least 0"),
  is_active: z.boolean().default(true),
});

const open = ref(false);

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  name: undefined,
  description: undefined,
  price: undefined,
  stock: undefined,
  is_active: true,
});

const toast = useToast();
async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    await client("/api/products", {
      method: "POST",
      body: {
        ...event.data,
      },
    });
    toast.add({
      title: "Success",
      description: `New product "${event.data.name}" added successfully`,
      color: "success",
    });
    open.value = false;
    emit("added");

    // Reset form
    state.name = undefined;
    state.description = undefined;
    state.price = undefined;
    state.stock = undefined;
    state.is_active = true;
  } catch (err) {
    if (err?.status === 422) {
      form.value.errors = transformValidationErrors(err.data.errors);
      toast.add({
        title: "Validation Failed",
        description: err?.data?.message || "Failed to create product.",
        color: "error",
      });
      return;
    }
    toast.add({
      title: "Failed",
      description: err?.message || "Failed to create product.",
      color: "error",
    });
  }
}
</script>

<template>
  <UModal
    v-model:open="open"
    title="New Product"
    description="Add a new product to the database"
  >
    <UButton label="New Product" icon="i-lucide-plus" />

    <template #body>
      <UForm
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
            label="Create"
            color="primary"
            variant="solid"
            type="submit"
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
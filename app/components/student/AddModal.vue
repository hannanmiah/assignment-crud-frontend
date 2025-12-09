<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

const emit = defineEmits(["added"]);

const client = useSanctumClient();
const form = useTemplateRef("form");

const schema = z.object({
  student_id: z.string().min(2, "Too short"),
  name: z.string().min(2, "Too short"),
  class: z.string().min(2, "Too short"),
  section: z.string().min(1, "Too short"),
});
const open = ref(false);

const classes = shallowRef([
  { label: "One", value: "one" },
  { label: "Two", value: "two" },
  { label: "Three", value: "three" },
  { label: "Four", value: "four" },
  { label: "Five", value: "five" },
]);

const sections = shallowRef([
  { label: "A", value: "a" },
  { label: "B", value: "b" },
  { label: "C", value: "c" },
]);

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  name: undefined,
  section: undefined,
  class: undefined,
  student_id: undefined,
});

const toast = useToast();
async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    await client("/api/students", {
      method: "POST",
      body: {
        ...event.data,
      },
    });
    toast.add({
      title: "Success",
      description: `New student ${event.data.name} added`,
      color: "success",
    });
    open.value = false;
    emit("added");
  } catch (err) {
    if (err?.status === 422) {
      form.value.errors = transformValidationErrors(err.data.errors);
      toast.add({
        title: "Validation Failed",
        description: err?.data?.message || "Failed to created student.",
        color: "error",
      });
      return;
    }
    toast.add({
      title: "Failed",
      description: err?.message || "Failed to login.",
      color: "error",
    });
  }
}
</script>

<template>
  <UModal
    v-model:open="open"
    title="New Student"
    description="Add a new student to the database"
  >
    <UButton label="New Student" icon="i-lucide-plus" />

    <template #body>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
        ref="form"
      >
        <UFormField label="Name" placeholder="John Doe" name="name">
          <UInput
            v-model="state.name"
            class="w-full"
            placeholder="Enter student name"
          />
        </UFormField>
        <UFormField label="Class" placeholder="Select class" name="class">
          <USelect
            v-model="state.class"
            :items="classes"
            placeholder="Select class"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Section" placeholder="Select section" name="section">
          <USelect
            v-model="state.section"
            :items="sections"
            placeholder="Select section"
            class="w-full"
          />
        </UFormField>
        <UFormField
          label="Student ID"
          placeholder="Enter student ID"
          name="student_id"
        >
          <UInput
            v-model="state.student_id"
            placeholder="Enter student ID"
            class="w-full"
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

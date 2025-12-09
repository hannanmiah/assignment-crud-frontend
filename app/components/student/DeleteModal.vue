<script setup lang="ts">
import type { Student } from '~/types'

const {student} = defineProps<{
  student: Student
}>()

const client = useSanctumClient()
const toast = useToast()
const emit = defineEmits(['deleted'])

const open = defineModel()

async function onSubmit() {
  try {
    await client(`/api/students/${student.id}`, {
      method: "DELETE",
    });
    toast.add({
      title: "Success",
      description: `Student ${student.name} deleted`,
      color: "success",
    });
    open.value = false;
    emit("deleted");
  } catch (err) {
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
    :title="`Delete ${student?.name}?`"
    :description="`Are you sure, this action cannot be undone.`"
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

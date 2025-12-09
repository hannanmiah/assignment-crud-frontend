<template>
  <div class="container container-query flex flex-col gap-y-4 md:gap-y-8">
    <div class="flex justify-center">
      <UCard class="w-full sm:w-xs md:w-sm lg:w-md xl:w-lg">
        <div class="flex flex-col justify-center items-center gap-4 md:gap-8">
          <h1 class="text-2xl font-semibold text-gray-900">Registration</h1>
          <p class="text-red-600" v-if="route.query.redirect">
            Register to continue.
          </p>
        </div>
        <u-form
          ref="form"
          :state="state"
          :schema="schema"
          @submit="handleSubmit"
          class="flex flex-col gap-2 md:gap-4"
        >
          <u-form-field label="Name" name="name">
            <u-input
              v-model="state.name"
              type="text"
              size="xl"
              placeholder="Enter Full Name (e.g. John Doe)"
              class="w-full"
            />
          </u-form-field>
          <u-form-field label="Email" name="email">
            <u-input
              v-model="state.email"
              type="email"
              placeholder="Your Email (e.g. 1ZBw0@example.com)"
              size="xl"
              class="w-full"
            />
          </u-form-field>
          <u-form-field label="Password" name="password">
            <u-input
              size="xl"
              v-model="state.password"
              placeholder="Your Password"
              type="password"
              class="w-full"
            />
          </u-form-field>
          <u-form-field label="Confirm Password" name="password_confirmation">
            <u-input
              size="xl"
              v-model="state.password_confirmation"
              placeholder="Confirm Password"
              type="password"
              class="w-full"
            />
          </u-form-field>
          <div class="flex flex-col gap-1">
            <u-checkbox
              size="xl"
              name="remember"
              label="Agree to terms and conditions"
            />
          </div>

          <u-button :loading="form?.loading" size="xl" block type="submit">Register</u-button>
        </u-form>
        <div class="mt-2 md:mt-4 flex flex-col gap-2 md:gap-4">
          <p class="text-gray-600 text-sm">
            Already have an account?
            <u-button to="/login" variant="link">Login</u-button>
          </p>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script lang="ts" setup>
import * as v from "valibot";
import type { FormSubmitEvent } from "@nuxt/ui";

definePageMeta({
  middleware: "sanctum:guest",
  layout: "guest",
});

const route = useRoute();
const auth = useSanctumAuth();
const client = useSanctumClient();
const toast = useToast();

const schema = v.object({
  name: v.pipe(v.string("Name is required"), v.minLength(3, "Name is too short")),
  email: v.pipe(v.string("Email is required"), v.email("Invalid email")),
  password: v.pipe(v.string("Password is required"), v.minLength(8, "Password is too short")),
  password_confirmation: v.pipe(v.string("Password confirmation is required")),
});

const state = reactive({
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
});

const form = useTemplateRef("form");

type Schema = v.InferOutput<typeof schema>;

const handleSubmit = async (event: FormSubmitEvent<Schema>) => {
  // Handle form submission
  try {
    await client("/api/auth/register", {
      method: "POST",
      body: {
        ...event.data
      },
    });
    toast.add({
      title: "Registration Success",
      description: "You have successfully registered.",
      color: "success",
    });
    navigateTo("/login");
  } catch (err) {
    if (err?.status === 422) {
      form.value.errors = transformValidationErrors(err.data.errors);
      toast.add({
        title: "Failed",
        description: err?.data?.message || "Failed to Register.",
        color: "error",
      });
      return;
    }
    toast.add({
      title: "Failed",
      description: err?.message || "Failed to Register.",
      color: "error",
    });
  }
};
</script>

<style></style>

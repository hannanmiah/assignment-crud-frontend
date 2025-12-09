<template>
  <div class="container container-query flex flex-col gap-y-4 md:gap-y-8">
    <div class="flex justify-center">
      <UCard class="w-full sm:w-xs md:w-sm lg:w-md xl:w-lg">
        <div class="flex flex-col justify-center items-center gap-4 md:gap-8">
          <h1 class="text-2xl font-semibold text-gray-900">Login</h1>
          <p class="text-red-600" v-if="route.query.redirect">
            Please login to continue.
          </p>
        </div>
        <u-form
          ref="form"
          :state="state"
          :schema="schema"
          @submit="handleSubmit"
          class="flex flex-col gap-2 md:gap-4"
        >
          <u-form-field label="Email" name="email">
            <u-input
              v-model="state.email"
              type="email"
              placeholder="Your Email"
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
          <div class="flex flex-col gap-1">
            <u-checkbox
              size="xl"
              v-model="state.remember"
              name="remember"
              label="Remember me"
            />
          </div>

          <u-button :loading="form?.loading" size="xl" block type="submit"
            >Login</u-button
          >
        </u-form>
        <div class="mt-2 md:mt-4 flex flex-col gap-2 md:gap-4">
          <p class="text-gray-600 text-sm">
            Don't have an account?
            <u-button
              variant="link"
              :to="
                route.query.redirect
                  ? `/register?redirect=${route.query.redirect}`
                  : '/register'
              "
              >Register</u-button
            >
          </p>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script lang="ts" setup>
import * as v from "valibot";
import type { FormSubmitEvent } from "@nuxt/ui";
import type { User } from "~/types";

definePageMeta({
  middleware: "sanctum:guest",
  layout: "guest",
});

const route = useRoute();
const auth = useSanctumAuth();
const user = useSanctumUser<User>();
const toast = useToast();

const schema = v.object({
  email: v.pipe(v.string("Email is required"), v.email("Invalid email")),
  password: v.string("Password is required"),
  remember: v.boolean(),
});

const state = reactive({
  email: "",
  password: "",
  remember: false,
});

const form = useTemplateRef("form");

type Schema = v.InferOutput<typeof schema>;

const handleSubmit = async (event: FormSubmitEvent<Schema>) => {
  // Handle form submission
  try {
    await auth.login(event.data);
    // success
    toast.add({
      title: "Login Success",
      description: "You have successfully logged in.",
      color: "success",
    });
    navigateTo("/");
  } catch (err) {
    if (err?.status === 422) {
      form.value.errors = transformValidationErrors(err.data.errors);
      toast.add({
        title: "Failed",
        description: err?.data?.message || "Failed to login.",
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
};
</script>

<style></style>

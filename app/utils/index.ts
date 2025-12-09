export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomFrom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]!;
}

export function getErrorMessage(errors: object, key: string) {
  return errors[key]?.length > 0 ? errors[key].join(", ") : "";
}

export function hasError(errors: object, key: string) {
  return errors.hasOwnProperty(key) && errors[key]?.length > 0;
}

export function transformValidationErrors(errors: Record<string, string[]>) {
  return Object.entries(errors).map(([key, value]) => {
    return {
      name: key,
      message: value?.join(", "),
    };
  });
}

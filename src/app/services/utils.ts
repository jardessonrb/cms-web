export const Utils = {
  removeChavesSemValor<T extends Record<string, any>>(obj: T): Partial<T> {
    return Object.fromEntries(
      Object.entries(obj).filter(
        ([_, value]) => value !== null && value !== undefined && value !== ""
      )
    ) as Partial<T>;
  },

  updateField<T extends Record<string, any>, K extends keyof T>(
    setState: React.Dispatch<React.SetStateAction<T>>,
    field: K,
    value: T[K]
  ) {
    setState((prev) => ({
      ...prev,
      [field]: value,
    }));
  },
};
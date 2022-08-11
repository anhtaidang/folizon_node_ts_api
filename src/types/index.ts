export type OptionalType<T> = Omit<T, keyof T> & Partial<Pick<T, keyof T>>;

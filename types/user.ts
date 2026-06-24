export type User = {
  id: string;
  email: string;
  name: string | null;
  role: "admin" | "user";
};

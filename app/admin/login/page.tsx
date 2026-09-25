import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const metadata: Metadata = {
  title: "Admin Sign In",
  robots: { index: false },
};

export default function AdminLoginPage() {
  return <AdminLoginForm />;
}

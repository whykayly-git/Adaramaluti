import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/admin/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Reset Admin Password",
  robots: { index: false },
};

export default function AdminForgotPasswordPage() {
  return <ForgotPasswordForm />;
}

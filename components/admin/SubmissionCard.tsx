import type { Submission } from "@/lib/db";

const BESPOKE_LABELS: Record<string, string> = {
  fullName: "Name",
  email: "Email",
  phone: "Phone",
  garmentType: "Garment Type",
  occasion: "Occasion",
  budget: "Budget",
  bust: "Bust (cm)",
  waist: "Waist (cm)",
  hips: "Hips (cm)",
  height: "Height (cm)",
  details: "Vision / Details",
};

const CONTACT_LABELS: Record<string, string> = {
  name: "Name",
  email: "Email",
  subject: "Subject",
  message: "Message",
};

export function SubmissionCard({ submission }: { submission: Submission }) {
  const labels = submission.type === "bespoke" ? BESPOKE_LABELS : CONTACT_LABELS;
  const entries = Object.entries(labels)
    .map(([key, label]) => [label, submission.payload[key]] as const)
    .filter(([, value]) => value !== undefined && value !== "");

  return (
    <div className="rounded-xl border border-gray-100 p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-accent">
          #{submission.id}
        </span>
        <span className="text-xs text-gray-400">
          {new Date(submission.createdAt).toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </span>
      </div>
      <dl className="space-y-2 text-sm">
        {entries.map(([label, value]) => (
          <div key={label} className="grid grid-cols-3 gap-3">
            <dt className="text-gray-500">{label}</dt>
            <dd className="col-span-2 whitespace-pre-wrap text-primary">{String(value)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

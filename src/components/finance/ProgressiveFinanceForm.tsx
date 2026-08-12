"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

type FieldType = "choice" | "number" | "text" | "date" | "select";

export interface FormStep {
  id: string;
  title: string;
  field: string;
  type: FieldType;
  options?: string[];
  optional?: boolean;
  placeholder?: string;
}

interface ProgressiveFinanceFormProps {
  steps: FormStep[];
  onSubmit: (values: Record<string, string>) => Promise<void>;
  submitLabel?: string;
}

export function ProgressiveFinanceForm({
  steps,
  onSubmit,
  submitLabel = "Save",
}: ProgressiveFinanceFormProps) {
  const [index, setIndex] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const step = steps[index];

  const next = async () => {
    setError("");
    if (!step.optional && !values[step.field]) {
      setError("Please complete this step");
      return;
    }
    if (index < steps.length - 1) {
      setIndex((i) => i + 1);
      return;
    }
    setSaving(true);
    try {
      await onSubmit(values);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border border-[var(--border)] bg-[var(--surface)] p-6 md:p-10">
      <div className="mb-8 flex gap-2">
        {steps.map((s, i) => (
          <div
            key={s.id}
            className={cn(
              "h-px flex-1",
              i <= index ? "bg-[var(--accent)]" : "bg-[var(--border)]"
            )}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.25 }}
        >
          <p className="eyebrow">
            Step {index + 1} / {steps.length}
          </p>
          <h2 className="display mt-3 text-3xl md:text-4xl">{step.title}</h2>

          <div className="mt-8">
            {step.type === "choice" && step.options ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {step.options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() =>
                      setValues((v) => ({ ...v, [step.field]: opt }))
                    }
                    className={cn(
                      "border px-4 py-4 text-left text-sm transition-colors",
                      values[step.field] === opt
                        ? "border-[var(--accent)] bg-[var(--accent-dim)] text-[var(--accent)]"
                        : "border-[var(--border)] hover:border-[var(--border-strong)]"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ) : null}

            {step.type === "number" || step.type === "text" || step.type === "date" ? (
              <Input
                type={step.type === "number" ? "number" : step.type}
                placeholder={step.placeholder}
                value={values[step.field] || ""}
                onChange={(e) =>
                  setValues((v) => ({ ...v, [step.field]: e.target.value }))
                }
              />
            ) : null}

            {step.type === "select" && step.options ? (
              <select
                className="focus-ring w-full border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-3 text-sm"
                value={values[step.field] || ""}
                onChange={(e) =>
                  setValues((v) => ({ ...v, [step.field]: e.target.value }))
                }
              >
                <option value="">Select</option>
                {step.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : null}
          </div>
        </motion.div>
      </AnimatePresence>

      {error ? <p className="mt-4 text-sm text-[var(--danger)]">{error}</p> : null}

      <div className="mt-8 flex gap-3">
        {index > 0 ? (
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIndex((i) => i - 1)}
          >
            Back
          </Button>
        ) : null}
        <Button type="button" onClick={next} disabled={saving}>
          {index === steps.length - 1
            ? saving
              ? "Saving…"
              : submitLabel
            : "Continue"}
        </Button>
      </div>
    </div>
  );
}

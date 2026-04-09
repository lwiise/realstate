"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

export interface ObjectListFieldDefinition {
  key: string;
  label: string;
  type?: "text" | "textarea" | "url" | "checkbox";
  placeholder?: string;
}

interface ObjectListInputProps {
  name: string;
  label: string;
  fields: ObjectListFieldDefinition[];
  defaultValue?: Array<Record<string, string>>;
  itemLabel: string;
  helpText?: string;
}

function createBlankItem(fields: ObjectListFieldDefinition[]) {
  return fields.reduce<Record<string, string>>((accumulator, field) => {
    accumulator[field.key] = "";
    return accumulator;
  }, {});
}

export function ObjectListInput({
  name,
  label,
  fields,
  defaultValue = [],
  itemLabel,
  helpText,
}: ObjectListInputProps) {
  const [items, setItems] = useState<Array<Record<string, string>>>(
    defaultValue.length > 0 ? defaultValue : [createBlankItem(fields)]
  );

  const payload = useMemo(() => {
    return JSON.stringify(
      items
        .map((item) => {
          return fields.reduce<Record<string, string>>((accumulator, field) => {
            accumulator[field.key] = (item[field.key] ?? "").trim();
            return accumulator;
          }, {});
        })
        .filter((item) => Object.values(item).some(Boolean))
    );
  }, [fields, items]);

  const updateItem = (itemIndex: number, key: string, value: string) => {
    setItems((current) =>
      current.map((item, index) =>
        index === itemIndex ? { ...item, [key]: value } : item
      )
    );
  };

  const addItem = () => setItems((current) => [...current, createBlankItem(fields)]);
  const removeItem = (itemIndex: number) => {
    setItems((current) => {
      const next = current.filter((_, index) => index !== itemIndex);
      return next.length > 0 ? next : [createBlankItem(fields)];
    });
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium text-foreground">{label}</label>
        {helpText ? <p className="mt-1 text-xs text-muted-foreground">{helpText}</p> : null}
      </div>

      <input type="hidden" name={name} value={payload} />

      <div className="space-y-4">
        {items.map((item, itemIndex) => (
          <div key={`${name}-${itemIndex}`} className="rounded-md border border-border p-4">
            <div className="mb-3 flex items-center justify-between gap-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {itemLabel} {itemIndex + 1}
              </p>
              <button
                type="button"
                onClick={() => removeItem(itemIndex)}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground transition-colors hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                Supprimer
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {fields.map((field) => {
                const value = item[field.key] ?? "";
                if (field.type === "checkbox") {
                  return (
                    <label key={field.key} className="flex items-center gap-3 rounded-md border border-border px-4 py-3">
                      <input
                        type="checkbox"
                        checked={value === "true"}
                        onChange={(event) =>
                          updateItem(itemIndex, field.key, event.target.checked ? "true" : "false")
                        }
                      />
                      <span className="text-sm text-foreground">{field.label}</span>
                    </label>
                  );
                }

                if (field.type === "textarea") {
                  return (
                    <label key={field.key} className="space-y-2 md:col-span-2">
                      <span className="text-xs uppercase tracking-wide text-muted-foreground">
                        {field.label}
                      </span>
                      <textarea
                        rows={4}
                        value={value}
                        onChange={(event) =>
                          updateItem(itemIndex, field.key, event.target.value)
                        }
                        placeholder={field.placeholder}
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                      />
                    </label>
                  );
                }

                return (
                  <label key={field.key} className="space-y-2">
                    <span className="text-xs uppercase tracking-wide text-muted-foreground">
                      {field.label}
                    </span>
                    <input
                      type={field.type === "url" ? "url" : "text"}
                      value={value}
                      onChange={(event) =>
                        updateItem(itemIndex, field.key, event.target.value)
                      }
                      placeholder={field.placeholder}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                    />
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addItem}
        className="inline-flex items-center gap-2 border border-border px-3 py-2 text-xs uppercase tracking-wide transition-colors hover:border-gold"
      >
        <Plus className="h-4 w-4" />
        Ajouter {itemLabel}
      </button>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

interface StringListInputProps {
  name: string;
  label: string;
  defaultValue?: string[];
  itemPlaceholder?: string;
  helpText?: string;
}

export function StringListInput({
  name,
  label,
  defaultValue = [],
  itemPlaceholder = "Add an item",
  helpText,
}: StringListInputProps) {
  const [items, setItems] = useState<string[]>(defaultValue.length > 0 ? defaultValue : [""]);

  const payload = useMemo(
    () => JSON.stringify(items.map((item) => item.trim()).filter(Boolean)),
    [items]
  );

  const updateItem = (index: number, nextValue: string) => {
    setItems((current) => current.map((item, itemIndex) => (itemIndex === index ? nextValue : item)));
  };

  const addItem = () => setItems((current) => [...current, ""]);
  const removeItem = (index: number) => {
    setItems((current) => {
      const next = current.filter((_, itemIndex) => itemIndex !== index);
      return next.length > 0 ? next : [""];
    });
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium text-foreground">{label}</label>
        {helpText ? <p className="mt-1 text-xs text-muted-foreground">{helpText}</p> : null}
      </div>

      <input type="hidden" name={name} value={payload} />

      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={`${name}-${index}`} className="flex items-center gap-2">
            <input
              type="text"
              value={item}
              onChange={(event) => updateItem(index, event.target.value)}
              placeholder={itemPlaceholder}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
              aria-label="Remove item"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addItem}
        className="inline-flex items-center gap-2 border border-border px-3 py-2 text-xs uppercase tracking-wide transition-colors hover:border-gold"
      >
        <Plus className="h-4 w-4" />
        Add item
      </button>
    </div>
  );
}

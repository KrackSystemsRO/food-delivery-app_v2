import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface Option {
  _id: string;
  name: string;
}

interface MultiSelectWithChipsProps {
  label: string;
  options: Option[];
  selected: Option[];
  onChange: (selected: Option[]) => void;
  allowCreate?: boolean;
  placeholder?: string;
  onInputChange?: (query: string) => Promise<Option[]>;
}

const Chip = memo(
  ({ item, onRemove }: { item: Option; onRemove: (id: string) => void }) => (
    <span className="flex items-center gap-1 rounded-full bg-blue-100 text-blue-700 px-3 py-1 text-sm">
      {item.name}
      <button
        type="button"
        onClick={() => onRemove(item._id)}
        className="ml-1 text-blue-500 hover:text-blue-700"
      >
        <X className="w-4 h-4" />
      </button>
    </span>
  )
);

export default function MultiSelectWithChips({
  label,
  options,
  selected,
  onChange,
  allowCreate = true,
  onInputChange,
}: MultiSelectWithChipsProps) {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState<Option[]>(options);
  const [loading, setLoading] = useState(false);

  const filteredOptions = useMemo(() => {
    if (!query) return options;
    if (!onInputChange) {
      return options.filter((o) =>
        o.name.toLowerCase().includes(query.toLowerCase())
      );
    }
    return filtered;
  }, [query, options, onInputChange, filtered]);

  useEffect(() => {
    if (!query || !onInputChange) return;

    let canceled = false;
    setLoading(true);
    onInputChange(query)
      .then((res) => {
        if (!canceled) setFiltered(res);
      })
      .finally(() => !canceled && setLoading(false));

    return () => {
      canceled = true;
    };
  }, [query, onInputChange]);

  const handleAdd = useCallback(
    (item: Option) => {
      if (!selected.find((s) => s._id === item._id)) {
        onChange([...selected, item]);
      }
      setQuery("");
    },
    [selected, onChange]
  );

  const handleCreate = useCallback(() => {
    if (!query.trim()) return;
    const newItem: Option = {
      _id: `temp_${Date.now().toString()}`,
      name: query.trim(),
    };
    onChange([...selected, newItem]);
    setQuery("");
  }, [query, selected, onChange]);

  const handleRemove = useCallback(
    (id: string) => {
      onChange(selected.filter((s) => s._id !== id));
    },
    [selected, onChange]
  );

  return (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      <div className="flex flex-wrap gap-2 border rounded-md p-2 mt-1">
        {selected.map((item) => (
          <Chip key={item._id} item={item} onRemove={handleRemove} />
        ))}
        <Input
          className="flex-1 border-none shadow-none p-0 focus:ring-0"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search or add ${label.toLowerCase()}`}
        />
      </div>

      {query && (
        <div className="border mt-1 rounded-md bg-white shadow-md">
          {loading ? (
            <div className="px-3 py-2 text-gray-500">Loading...</div>
          ) : filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <div
                key={opt._id}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleAdd(opt)}
              >
                {opt.name}
              </div>
            ))
          ) : allowCreate ? (
            <div
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-blue-600"
              onClick={handleCreate}
            >
              + Create "{query}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

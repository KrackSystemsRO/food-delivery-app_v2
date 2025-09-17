import { useState, useMemo, useCallback, memo } from "react";
import { Label, Input } from "@/components/ui";
import type { StoreType } from "@/types/store.type";

interface StoreSelectorProps {
  stores: StoreType[];
  value: StoreType | null;
  onChange: (store: StoreType) => void;
}

const StoreItem = memo(
  ({
    store,
    onSelect,
  }: {
    store: StoreType;
    onSelect: (store: StoreType) => void;
  }) => (
    <li
      key={store._id}
      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
      onClick={() => onSelect(store)}
    >
      {store.name}
    </li>
  )
);

export default function StoreSelector({
  stores,
  value,
  onChange,
}: StoreSelectorProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredStores = useMemo(
    () =>
      stores.filter((store) =>
        store.name.toLowerCase().includes(query.toLowerCase())
      ),
    [stores, query]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
      setIsOpen(true);
    },
    []
  );

  const handleSelectStore = useCallback(
    (store: StoreType) => {
      onChange(store);
      setQuery("");
      setIsOpen(false);
    },
    [onChange]
  );

  return (
    <div className="relative">
      <Label>Store</Label>
      <Input
        value={value?.name || query}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
        placeholder="Type to search store..."
      />
      {isOpen && filteredStores.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-md max-h-40 overflow-y-auto">
          {filteredStores.map((store) => (
            <StoreItem
              key={store._id}
              store={store}
              onSelect={handleSelectStore}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

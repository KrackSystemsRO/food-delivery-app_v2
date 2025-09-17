import { useEffect, useState, useCallback, useMemo, memo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { IngredientWithQuantity } from "@/types/product.type";
import type { IngredientType } from "@/types/ingredient.type";
import { addIngredient, checkIngredient } from "@/services/ingredient.service";

interface IngredientsSelectorProps {
  options: IngredientType[];
  value: IngredientWithQuantity[];
  onChange: (val: IngredientWithQuantity[]) => void;
  onInputChange?: (query: string) => Promise<IngredientType[]>;
}

const IngredientItem = memo(
  ({
    v,
    onRemove,
  }: {
    v: IngredientWithQuantity;
    onRemove: (id: string) => void;
  }) => (
    <div className="flex justify-between items-center border rounded-md px-3 py-2">
      <span>
        {v.ingredient.name} –{" "}
        <span className="text-gray-500">
          {v.quantity} {v.unit}
        </span>
      </span>
      <button
        type="button"
        onClick={() => onRemove(v.ingredient._id)}
        className="text-red-500 hover:text-red-700"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
);

function IngredientsSelectorComponent({
  options,
  value,
  onChange,
  onInputChange,
}: IngredientsSelectorProps) {
  const [query, setQuery] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("gram");
  const [filtered, setFiltered] = useState<IngredientType[]>([]);

  const isExistingIngredient = useMemo(
    () => options.some((o) => o.name.toLowerCase() === query.toLowerCase()),
    [options, query]
  );

  useEffect(() => {
    if (!query) return setFiltered([]);

    const fetchFiltered = async () => {
      if (onInputChange) {
        const result = await onInputChange(query);
        setFiltered(result);
      } else {
        setFiltered(
          options.filter((o) =>
            o.name.toLowerCase().includes(query.toLowerCase())
          )
        );
      }
    };

    fetchFiltered();
  }, [query, options, onInputChange]);

  const handleAdd = useCallback(
    (ing: IngredientType) => {
      if (!quantity.trim()) return;
      onChange([...value, { ingredient: ing, quantity, unit }]);
      setQuery("");
      setQuantity("");
      setUnit("gram");
    },
    [quantity, unit, value, onChange]
  );

  const handleCreate = useCallback(async () => {
    if (!query.trim()) return;
    try {
      const response = await addIngredient({ name: query.trim(), unit });
      const newIng: IngredientType = response.result;
      onChange([...value, { ingredient: newIng, quantity: "", unit }]);
      setQuery("");
      setQuantity("");
      setUnit("gram");
    } catch (err) {
      console.error("Failed to create ingredient:", err);
    }
  }, [query, unit, value, onChange]);

  const handleRemove = useCallback(
    (id: string) => {
      onChange(value.filter((v) => v.ingredient._id !== id));
    },
    [value, onChange]
  );

  const handleCheckIngredient = useCallback(
    async (query: string) => {
      const res = await checkIngredient(query);
      if (res.exists) {
        handleAdd(res.ingredient!);
      } else {
        handleCreate();
      }
    },
    [handleAdd, handleCreate]
  );

  const handleSelectFiltered = useCallback(
    (opt: IngredientType) => {
      if (!quantity.trim()) {
        setQuery(opt.name);
        document.getElementById("ingredient-qty")?.focus();
      } else {
        handleAdd(opt);
      }
    },
    [quantity, handleAdd]
  );

  const buttonLabel = useMemo(
    () => (isExistingIngredient ? "Add" : "Create"),
    [isExistingIngredient]
  );

  return (
    <div>
      <label className="block text-sm font-medium mb-1">Ingredients</label>

      <div className="space-y-2 mb-2">
        {value.map((v) => (
          <IngredientItem
            key={v.ingredient._id}
            v={v}
            onRemove={handleRemove}
          />
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Search or add ingredient"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Input
          id="ingredient-qty"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          disabled={!isExistingIngredient}
        />
        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="border rounded-md px-2"
        >
          <option value="piece">Piece</option>
          <option value="gram">Gram</option>
          <option value="liter">Liter</option>
        </select>
        <Button onClick={() => handleCheckIngredient(query)}>
          {buttonLabel}
        </Button>
      </div>

      {query && filtered.length > 0 && (
        <div className="border mt-1 rounded-md bg-white shadow-md max-h-40 overflow-y-auto">
          {filtered.map((opt) => (
            <div
              key={opt._id}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelectFiltered(opt)}
            >
              {opt.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export const IngredientsSelector = memo(IngredientsSelectorComponent);

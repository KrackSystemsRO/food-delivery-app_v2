import { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  FlatList,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";
import { Button } from "react-native-paper";
import { Types } from "@my-monorepo/shared";
export type IngredientWithQuantity = {
  ingredient: Types.Ingredient.IngredientType;
  quantity: number;
  unit: string;
};

interface IngredientsSelectorProps {
  options: Types.Ingredient.IngredientType[];
  value: IngredientWithQuantity[];
  onChange: (val: IngredientWithQuantity[]) => void;
  onInputChange?: (query: string) => Promise<Types.Ingredient.IngredientType[]>;
}

const UNITS: IngredientWithQuantity["unit"][] = ["piece", "gram", "liter"];

export default function IngredientsSelector({
  options,
  value,
  onChange,
  onInputChange,
}: IngredientsSelectorProps) {
  const [query, setQuery] = useState("");
  const [quantity, setQuantity] = useState<number | undefined>(undefined);
  const [unit, setUnit] = useState<IngredientWithQuantity["unit"]>("gram");
  const [filtered, setFiltered] = useState<Types.Ingredient.IngredientType[]>(
    []
  );

  const isExistingIngredient = useMemo(
    () => options.some((o) => o.name.toLowerCase() === query.toLowerCase()),
    [options, query]
  );

  useEffect(() => {
    if (!query) return setFiltered([]);
    const fetchFiltered = async () => {
      if (onInputChange) {
        const result = await onInputChange(query);
        setFiltered(result ?? []);
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
    (ingredient: Types.Ingredient.IngredientType) => {
      if (!quantity) return;
      onChange([...value, { ingredient, quantity, unit }]);
      setQuery("");
      setQuantity(undefined);
      setUnit("gram");
    },
    [quantity, unit, value, onChange]
  );

  const handleRemove = useCallback(
    (id: string) => {
      onChange(value.filter((v) => v.ingredient._id !== id));
    },
    [value, onChange]
  );

  const handleSelectFiltered = useCallback(
    (ingredient: Types.Ingredient.IngredientType) => {
      if (!quantity) setQuery(ingredient.name);
      else handleAdd(ingredient);
    },
    [quantity, handleAdd]
  );

  const buttonLabel = useMemo(
    () => (isExistingIngredient ? "Add" : "Create"),
    [isExistingIngredient]
  );

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ marginBottom: 4, fontWeight: "600" }}>Ingredients</Text>

      {/* Selected Ingredients */}
      <FlatList
        data={value}
        keyExtractor={(item) => item.ingredient._id}
        scrollEnabled={false} // disables nested scrolling
        renderItem={({ item }) => (
          <View style={styles.ingredientItem}>
            <Text>
              {item.ingredient.name} – {item.quantity} {item.unit}
            </Text>
            <Button onPress={() => handleRemove(item.ingredient._id)}>
              Remove
            </Button>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ color: "#888" }}>No ingredients selected</Text>
        }
      />

      {/* Input Row */}
      <View style={styles.inputRow}>
        <TextInput
          placeholder="Search or add ingredient"
          value={query}
          onChangeText={setQuery}
          style={[styles.input, { flex: 2 }]}
        />

        <TextInput
          placeholder="Qty"
          value={quantity !== undefined ? String(quantity) : ""}
          onChangeText={(text) => {
            const num = parseFloat(text);
            setQuantity(isNaN(num) ? undefined : num);
          }}
          keyboardType="numeric"
          style={[styles.input, { flex: 1 }]}
        />

        {/* Units as floating row */}
        <View style={styles.unitRow}>
          {UNITS.map((u) => (
            <Pressable
              key={u}
              onPress={() => setUnit(u)}
              style={[styles.unitButton, unit === u && styles.unitSelected]}
            >
              <Text style={{ color: unit === u ? "white" : "black" }}>{u}</Text>
            </Pressable>
          ))}
        </View>

        <Button
          mode="contained"
          onPress={() => {
            const ing = options.find(
              (o) => o.name.toLowerCase() === query.toLowerCase()
            );
            if (ing) handleAdd(ing);
            else alert("Ingredient does not exist. Implement create logic.");
          }}
        >
          {buttonLabel}
        </Button>
      </View>

      {/* Suggestions */}
      {query && filtered.length > 0 && (
        <View style={styles.suggestions}>
          {filtered.map((ingredient) => (
            <Pressable
              key={ingredient._id}
              onPress={() => handleSelectFiltered(ingredient)}
              style={styles.suggestionItem}
            >
              <Text>{ingredient.name}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  ingredientItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginBottom: 4,
  },
  inputRow: {
    flexDirection: "row",
    flexWrap: "wrap", // ✅ allows wrapping if screen is small
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  unitRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },

  unitButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 4,
  },

  unitSelected: {
    backgroundColor: "#6200ee",
    borderColor: "#6200ee",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  unitPicker: {
    justifyContent: "center",
  },
  // unitButton: {
  //   paddingHorizontal: 8,
  //   paddingVertical: 4,
  //   marginRight: 4,
  //   borderRadius: 4,
  //   borderWidth: 1,
  //   borderColor: "#ccc",
  // },
  // unitSelected: {
  //   backgroundColor: "#6200ee",
  // },
  suggestions: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginTop: 4,
    maxHeight: 120,
    backgroundColor: "white",
  },
  suggestionItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export type OptionMapper<T> = {
  getId: (item: T) => string;
  getLabel: (item: T) => string;
};

interface MultiSelectWithChipsProps<T> {
  label: string;
  options: T[];
  selected: T[];
  onChange: (selected: T[]) => void;
  mapper: OptionMapper<T>;
  allowCreate?: boolean;
  onInputChange?: (query: string) => Promise<T[]>;
  onCreate?: (query: string) => T | Promise<T>;
}

export default function MultiSelectWithChips<T>({
  label,
  options,
  selected,
  onChange,
  mapper,
  allowCreate = true,
  onInputChange,
  onCreate,
}: MultiSelectWithChipsProps<T>) {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState<T[]>(options);
  const [loading, setLoading] = useState(false);

  const filteredOptions = useMemo(() => {
    if (!query) return options;
    if (!onInputChange)
      return options.filter((o) =>
        mapper.getLabel(o).toLowerCase().includes(query.toLowerCase())
      );
    return filtered;
  }, [query, options, filtered, onInputChange, mapper]);

  useEffect(() => {
    if (!query || !onInputChange) return;

    let canceled = false;
    setLoading(true);
    onInputChange(query)
      .then((res) => !canceled && setFiltered(res))
      .finally(() => !canceled && setLoading(false));

    return () => {
      canceled = true;
    };
  }, [query, onInputChange]);

  const handleAdd = useCallback(
    (item: T) => {
      if (!selected.find((s) => mapper.getId(s) === mapper.getId(item))) {
        onChange([...selected, item]);
      }
      setQuery("");
    },
    [selected, onChange, mapper]
  );

  const handleRemove = useCallback(
    (id: string) => {
      onChange(selected.filter((s) => mapper.getId(s) !== id));
    },
    [selected, onChange, mapper]
  );

  const handleCreate = useCallback(async () => {
    if (!onCreate || !query) return;

    const newItem = await onCreate(query);
    handleAdd(newItem);
  }, [query, onCreate, handleAdd]);

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ marginBottom: 4, fontWeight: "600" }}>{label}</Text>

      <View style={styles.chipContainer}>
        {selected &&
          selected.map((item, index) => (
            <View
              key={mapper.getId(item) || `${mapper.getLabel(item)}-${index}`}
              style={styles.chip}
            >
              <Text style={styles.chipText}>{mapper.getLabel(item)}</Text>
              <TouchableOpacity
                onPress={() => handleRemove(mapper.getId(item))}
              >
                <Text style={styles.remove}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        <TextInput
          placeholder={`Search or add ${label.toLowerCase()}`}
          value={query}
          onChangeText={setQuery}
          style={[styles.input, { flex: 1 }]}
        />
      </View>

      {query ? (
        <View style={styles.suggestions}>
          {loading ? (
            <Text style={{ padding: 8, color: "#888" }}>Loading...</Text>
          ) : filteredOptions.length > 0 ? (
            filteredOptions.map((opt, index) => (
              <TouchableOpacity
                key={mapper.getId(opt) || `${mapper.getLabel(opt)}-${index}`}
                onPress={() => handleAdd(opt)}
                style={styles.suggestionItem}
              >
                <Text style={styles.suggestionItemText}>
                  {mapper.getLabel(opt)}
                </Text>
              </TouchableOpacity>
            ))
          ) : allowCreate ? (
            <TouchableOpacity
              style={styles.suggestionItem}
              onPress={handleCreate}
            >
              <Text style={{ color: "#007bff" }}>+ Create "{query}"</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 6,
    alignItems: "center",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#cce5ff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 4,
    marginBottom: 4,
  },
  chipText: {
    fontSize: 16,
    color: "#000",
  },
  remove: {
    color: "red",
    marginLeft: 5,
    fontSize: 24,
    marginRight: 5,
  },
  input: {
    borderWidth: 0,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  suggestions: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginTop: 4,
    backgroundColor: "white",
    maxHeight: 120,
  },
  suggestionItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  suggestionItemText: {
    fontSize: 16,
  },
});

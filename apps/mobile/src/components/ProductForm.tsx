import React, { useEffect, useState, useCallback, useMemo } from "react";
import { ScrollView, View, Alert } from "react-native";
import {
  TextInput,
  Button,
  Text,
  Checkbox,
  RadioButton,
} from "react-native-paper";
import IngredientsSelector from "@/components/IngredientsSelector";
import MultiSelectWithChips from "@/components/select/MultiSelectWithChips";
import { Services, Types } from "@my-monorepo/shared";
import { normalizeFloatingPoint } from "@/utils/tools";
import axiosInstance from "@/utils/request/authorizedRequest";

type ProductFormProps = {
  initialValues?: Partial<Types.Product.ProductType>;
  onSubmit: (data: any) => Promise<void> | void;
  mode?: "add" | "edit";
};

const ProductForm: React.FC<ProductFormProps> = ({
  initialValues = {},
  onSubmit,
  mode = "add",
}) => {
  const [name, setName] = useState(initialValues.name ?? "");
  const [description, setDescription] = useState(
    initialValues.description ?? ""
  );
  const [price, setPrice] = useState(initialValues.price?.toString() ?? "");
  const [isActive, setIsActive] = useState(initialValues.is_active ?? true);
  const [productType, setProductType] = useState<"prepared_food" | "grocery">(
    (initialValues.product_type as "prepared_food" | "grocery") ??
      "prepared_food"
  );

  const [stores, setStores] = useState<Types.Store.StoreType[]>([]);
  const [selectedStore, setSelectedStore] =
    useState<Types.Store.StoreType | null>(
      (initialValues.store as Types.Store.StoreType) ?? null
    );

  const [categories, setCategories] = useState<Types.Category.CategoryType[]>(
    []
  );
  const [selectedCategories, setSelectedCategories] = useState<
    Types.Category.CategoryType[]
  >((initialValues.category as Types.Category.CategoryType[]) ?? []);

  const [ingredients, setIngredients] = useState<
    Types.Ingredient.IngredientType[]
  >([]);
  const [selectedIngredients, setSelectedIngredients] = useState<
    {
      ingredient: Types.Ingredient.IngredientType;
      quantity: number;
      unit: string;
    }[]
  >((initialValues.ingredients as any) ?? []);

  // Load data once
  useEffect(() => {
    (async () => {
      try {
        const [storeData, categoryData, ingredientData] = await Promise.all([
          Services.Store.getStores(axiosInstance, {}),
          Services.Category.getCategories(axiosInstance, { is_active: true }),
          Services.Ingredient.getIngredients(axiosInstance, {
            is_active: true,
          }),
        ]);

        setStores(storeData.result ?? []);
        setCategories(categoryData.result ?? []);
        setIngredients(ingredientData.result ?? []);
      } catch (err) {
        console.error("Failed to load form data", err);
      }
    })();
  }, []);

  // Memoize submit handler
  const handleSubmit = useCallback(async () => {
    if (!name || !price || !selectedStore) {
      Alert.alert("Validation Error", "Name, price, and store are required");
      return;
    }

    const payload = {
      ...initialValues,
      name,
      description,
      store: selectedStore,
      price: normalizeFloatingPoint(price),
      is_active: isActive,
      product_type: productType,
      category: selectedCategories.map((c) => c._id),
      ingredients: selectedIngredients.map((i) => ({
        ingredient: i.ingredient._id,
        quantity: i.quantity,
        unit: i.unit,
      })),
    };

    await onSubmit(payload);
  }, [
    name,
    description,
    price,
    selectedStore,
    isActive,
    productType,
    selectedCategories,
    selectedIngredients,
    initialValues,
    onSubmit,
  ]);

  // Memoized category add
  const handleAddNewCategory = useCallback(async (query: string) => {
    try {
      const newCategory = await Services.Category.addCategory(axiosInstance, {
        name: query,
      });

      setCategories((prev) =>
        prev.some((c) => c._id === newCategory._id)
          ? prev
          : [...prev, newCategory]
      );

      setSelectedCategories((prev) =>
        prev.some((c) => c._id === newCategory._id)
          ? prev
          : [...prev, newCategory]
      );

      return newCategory;
    } catch (err) {
      console.error("Failed to create category", err);
      Alert.alert("Error", "Could not create category");
      throw err;
    }
  }, []);

  // Memoized mapped values for MultiSelectWithChips
  const mappedStores = useMemo(
    () => ({
      getId: (s: Types.Store.StoreType) => s._id,
      getLabel: (s: Types.Store.StoreType) => s.name,
    }),
    []
  );

  const mappedCategories = useMemo(
    () => ({
      getId: (c: Types.Category.CategoryType) => c._id,
      getLabel: (c: Types.Category.CategoryType) => c.name,
    }),
    []
  );

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text variant="titleLarge" style={{ marginBottom: 16 }}>
        {mode === "edit" ? "Edit Product" : "Add New Product"}
      </Text>

      <TextInput
        label="Product Name"
        value={name}
        onChangeText={setName}
        mode="outlined"
        style={{ marginBottom: 16 }}
      />

      <TextInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        multiline
        style={{ marginBottom: 16 }}
      />

      <MultiSelectWithChips<Types.Store.StoreType>
        label="Select Store"
        options={stores}
        selected={selectedStore ? [selectedStore] : []}
        onChange={(selected) => setSelectedStore(selected[0] ?? null)}
        mapper={mappedStores}
        allowCreate={false}
      />

      <TextInput
        label="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        mode="outlined"
        style={{ marginBottom: 16, marginTop: 16 }}
      />

      <MultiSelectWithChips<Types.Category.CategoryType>
        label="Categories"
        options={categories}
        selected={selectedCategories}
        onChange={setSelectedCategories}
        mapper={mappedCategories}
        onCreate={handleAddNewCategory}
      />

      <IngredientsSelector
        options={ingredients}
        value={selectedIngredients}
        onChange={setSelectedIngredients}
      />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginVertical: 16,
        }}
      >
        <Checkbox
          status={isActive ? "checked" : "unchecked"}
          onPress={() => setIsActive((prev) => !prev)}
        />
        <Text style={{ marginLeft: 8 }}>Active</Text>
      </View>

      <Text style={{ marginBottom: 8, fontWeight: "600" }}>Product Type</Text>
      <RadioButton.Group
        onValueChange={(value) =>
          setProductType(value as "prepared_food" | "grocery")
        }
        value={productType}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <RadioButton value="prepared_food" />
          <Text>Prepared Food</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <RadioButton value="grocery" />
          <Text>Product</Text>
        </View>
      </RadioButton.Group>

      <Button mode="contained" onPress={handleSubmit}>
        {mode === "edit" ? "Update Product" : "Save Product"}
      </Button>
    </ScrollView>
  );
};

export default React.memo(ProductForm);

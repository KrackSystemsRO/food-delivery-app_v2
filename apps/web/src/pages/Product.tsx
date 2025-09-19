import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui";
import { Plus } from "lucide-react";
import { showToast } from "@/utils/toast";
import { useTranslation } from "react-i18next";
import { ConfirmModal } from "@/components/common/confirm.modal";
import { PaginationControls } from "@/components/common/pagination.common";
import useProductStore from "@/stores/product.store";
import { ProductFilters } from "@/components/product/ProductFilters";
import useCategoryStore from "@/stores/category.store";
import useStore from "@/stores/store.store";
import type { Types } from "@my-monorepo/shared";
import { Services } from "@my-monorepo/shared";
import axiosInstance from "@/utils/request/authorizedRequest";
import { ProductModal } from "@/components/product/ProductModal";
import { ProductTable } from "@/components/product/ProductTable";

const defaultFilters = {
  search: "",
  is_active: undefined,
  limit: 10,
};

export default function ProductManagementPage() {
  const { t } = useTranslation();

  const [productToDelete, setProductToDelete] =
    useState<Types.Product.ProductType | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setModalOpen] = useState(false);

  const { storesList, setStoresList } = useStore();
  const { updateCategoryInList } = useCategoryStore();

  const [form, setForm] = useState<Types.Product.ProductForm>({
    name: "",
    description: "",
    price: 0,
    brand: "",
    unit: "",
    weight: 0,
    is_active: true,
    category: [],
    recipe: null,
    product_type: "prepared_food",
    store: null,
    image: "",
    available: true,
    energetic_values: {
      calories: 0,
      protein: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
    },
    variants: [],
  });

  const [filters, setFilters] = useState(() => {
    const saved = localStorage.getItem("productFilters");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          search: parsed.search || "",
          is_active:
            parsed.is_active === undefined ? undefined : parsed.is_active,
          limit: parsed.limit ? Number(parsed.limit) : 10,
        };
      } catch {
        return defaultFilters;
      }
    }
    return defaultFilters;
  });

  const [sortConfig, setSortConfig] = useState<{
    key: keyof Types.Product.ProductType;
    direction: "asc" | "desc";
  }>({
    key: "createdAt",
    direction: "desc",
  });

  const {
    productsList: products,
    setProductsList,
    clearProductsList,
    selectedProduct,
    setSelectedProduct,
    clearSelectedProduct,
    updateProductInList,
  } = useProductStore();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await Services.Product.getProducts(axiosInstance, {
        search: filters.search,
        is_active: filters.is_active,
        page,
        limit: filters.limit,
        sort_by: sortConfig.key,
        order: sortConfig.direction,
      });
      setProductsList(res.result);
      setTotalPages(res.totalPages || 1);
    } catch {
      showToast("error", t("product.loadFailed") || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [filters, page, sortConfig, setProductsList, t]);

  useEffect(() => {
    (async () => {
      const store = await Services.Store.getStores(axiosInstance, {
        is_active: true,
      });
      setStoresList(store.result);
    })();
  }, []);

  useEffect(() => {
    fetchProducts();
    return () => clearProductsList();
  }, [fetchProducts, clearProductsList]);

  useEffect(() => {
    localStorage.setItem("productFilters", JSON.stringify(filters));
  }, [filters]);

  const handleSort = useCallback((key: keyof Types.Product.ProductType) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  const openCreateModal = useCallback(() => {
    clearSelectedProduct();
    setForm({
      name: "",
      description: "",
      price: 0,
      brand: "",
      unit: "",
      weight: 0,
      is_active: true,
      category: [],
      recipe: null,
      product_type: "prepared_food",
      store: null,
      image: "",
      available: true,
      energetic_values: {
        calories: 0,
        protein: 0,
        fat: 0,
        fiber: 0,
        sugar: 0,
      },
      variants: [],
    });
    setModalOpen(true);
  }, [clearSelectedProduct]);

  const openEditModal = useCallback(
    (product: Types.Product.ProductType) => {
      setSelectedProduct(product);
      setForm({
        name: product.name,
        description: product.description || "",
        price: product.price,
        weight: product.weight || 0,
        is_active: product.is_active,
        category: product.category || [],
        recipe: product.recipe || null,
        product_type: product.product_type || "prepared_food",
        store: product.store || { _id: "", name: "" },
        image: product.image || "",
        available: product.available ?? true,
        energetic_values: product.energetic_values || {
          calories: 0,
          protein: 0,
          fat: 0,
          fiber: 0,
          sugar: 0,
        },
        variants: product.variants || [],
      });

      setModalOpen(true);
    },
    [setSelectedProduct]
  );

  const confirmDelete = useCallback((product: Types.Product.ProductType) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  }, []);

  const performDelete = useCallback(async () => {
    if (!productToDelete) return;
    try {
      await Services.Product.deleteProduct(axiosInstance, productToDelete._id);
      fetchProducts();
      showToast("success", t("product.message.deleted") || "Product deleted");
    } catch {
      showToast(
        "error",
        t("product.message.deleteFailed") || "Failed to delete product"
      );
    } finally {
      setDeleteModalOpen(false);
      setProductToDelete(null);
    }
  }, [productToDelete, fetchProducts, t]);

  const handleSubmit = useCallback(async () => {
    if (!form.name || form.price === undefined) {
      showToast("error", t("product.message.allFieldsRequired"));
      return;
    }

    try {
      const newCategories = (form.category || []).filter((c) =>
        c._id?.startsWith("temp_")
      );

      const createdCategories: Types.Category.CategoryType[] = [];
      for (const cat of newCategories) {
        try {
          const created = await Services.Category.addCategory(axiosInstance, {
            name: cat.name,
          });
          createdCategories.push(created.result);
          updateCategoryInList(created.result);
        } catch (err) {
          console.error("Failed to create category", cat.name);
        }
      }

      const finalCategories = (form.category || []).map((c) => {
        if (c._id?.startsWith("temp_")) {
          const found = createdCategories.find((x) => x.name === c.name);
          return found || c;
        }
        return c;
      });

      const payload = {
        ...form,
        category: finalCategories,
      };
      if (selectedProduct) {
        const res = await Services.Product.updateProduct(
          axiosInstance,
          selectedProduct._id,
          payload
        );
        if (res.status === 200) {
          showToast("success", t("product.message.updated"));
          updateProductInList(res.result);
        } else throw new Error();
      } else {
        const res = await Services.Product.addProduct(axiosInstance, payload);
        if (res.status === 201) {
          showToast("success", t("product.message.created"));
          fetchProducts();
        } else throw new Error();
      }

      setModalOpen(false);
      clearSelectedProduct();
    } catch {
      showToast("error", t("product.message.submitFailed"));
    }
  }, [
    form,
    selectedProduct,
    fetchProducts,
    updateProductInList,
    clearSelectedProduct,
    t,
  ]);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
    setPage(1);
    setSortConfig({ key: "createdAt", direction: "desc" });
    localStorage.removeItem("productFilters");
  }, []);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold">
          {t("product.title") || "Manage Products"}
        </h2>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          {t("product.createProduct") || "Create Product"}
        </Button>
      </div>

      <ProductFilters
        filters={filters}
        setFilters={(updated: Partial<typeof filters>) => {
          setFilters((prev) => ({ ...prev, ...updated }));
          setPage(1);
        }}
        resetFilters={resetFilters}
      />

      <ProductTable
        products={products}
        loading={loading}
        sortKey={sortConfig.key}
        sortDirection={sortConfig.direction}
        onSort={handleSort}
        onEdit={openEditModal}
        onDelete={confirmDelete}
        t={t}
      />

      <PaginationControls
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        selectedProduct={selectedProduct}
        t={t}
        storesList={storesList}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={performDelete}
        title={t("product.message.confirmDeleteTitle") || "Confirm Delete"}
        description={
          t("product.message.confirmDeleteDesc") ||
          "Are you sure you want to delete this product? This action cannot be undone."
        }
        confirmText={t("common.button.delete") || "Delete"}
        cancelText={t("common.button.cancel") || "Cancel"}
      />
    </div>
  );
}

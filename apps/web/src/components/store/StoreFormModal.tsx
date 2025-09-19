import { FormModal } from "@/components/common/FormModal";
import { useState, useEffect, useCallback } from "react";
import { Types } from "@my-monorepo/shared";
import { showToast } from "@/utils/toast";
import { useTranslation } from "react-i18next";
import axiosInstance from "@/utils/request/authorizedRequest";
import { Services } from "@my-monorepo/shared";

interface StoreFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStore: Types.Store.StoreType | null;
  companies: Types.Company.CompanyType[];
  admins: Types.User.UserType[];
  onSave: () => void;
}

export default function StoreFormModal({
  isOpen,
  onClose,
  selectedStore,
  companies,
  admins,
  onSave,
}: StoreFormModalProps) {
  const { t } = useTranslation();

  const [form, setForm] = useState<Types.Store.StoreForm>({
    name: "",
    type: "RESTAURANT",
    address: "",
    phone_number: "",
    description: "",
    is_active: false,
    is_open: false,
    admin: [],
    company: [],
    location: { lat: undefined, lng: undefined },
  });

  useEffect(() => {
    if (selectedStore) {
      setForm({
        name: selectedStore.name,
        type: selectedStore.type,
        address: selectedStore.address,
        phone_number: selectedStore.phone_number ?? "",
        description: selectedStore.description ?? "",
        is_active: selectedStore.is_active,
        is_open: selectedStore.is_open,
        admin: selectedStore.admin || [],
        company: selectedStore.company || [],
        location: selectedStore.location || { lat: undefined, lng: undefined },
      });
    } else {
      setForm({
        name: "",
        type: "RESTAURANT",
        address: "",
        phone_number: "",
        description: "",
        is_active: false,
        is_open: false,
        admin: [],
        company: [],
        location: { lat: undefined, lng: undefined },
      });
    }
  }, [selectedStore]);

  const handleSubmit = useCallback(async () => {
    if (!form.name) {
      showToast("error", t("store.message.allFieldsRequired"));
      return;
    }

    try {
      if (selectedStore) {
        const res = await Services.Store.updateStore(
          axiosInstance,
          selectedStore._id,
          form
        );
        if (res.status === 200) {
          showToast("success", t("store.message.updated"));
        } else throw new Error();
      } else {
        const res = await Services.Store.addStore(axiosInstance, form);
        if (res.status === 201) {
          showToast("success", t("store.message.created"));
        } else throw new Error();
      }
      onSave();
      onClose();
    } catch {
      showToast("error", t("store.message.submitFailed"));
    }
  }, [form, selectedStore, onClose, onSave, t]);

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={selectedStore ? t("store.editTitle") : t("store.createTitle")}
      submitLabel={
        selectedStore ? t("common.button.update") : t("common.button.save")
      }
      cancelLabel={t("common.button.cancel")}
    >
      <div className="space-y-4">
        {/* Name */}
        <input
          type="text"
          placeholder={t("store.name")}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border p-2 rounded"
        />

        {/* Type */}
        <select
          value={form.type}
          onChange={(e) =>
            setForm({ ...form, type: e.target.value as typeof form.type })
          }
          className="w-full border p-2 rounded"
        >
          {["RESTAURANT", "GROCERY", "BAKERY", "CAFE", "OTHER"].map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        {/* Address */}
        <input
          type="text"
          placeholder={t("store.address")}
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className="w-full border p-2 rounded"
        />

        {/* Phone */}
        <input
          type="text"
          placeholder={t("store.phone")}
          value={form.phone_number}
          onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
          className="w-full border p-2 rounded"
        />

        {/* Active / Open */}
        <label>
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
          />{" "}
          {t("store.active")}
        </label>
        <label>
          <input
            type="checkbox"
            checked={form.is_open}
            onChange={(e) => setForm({ ...form, is_open: e.target.checked })}
          />{" "}
          {t("store.open")}
        </label>

        {/* Companies */}
        <select
          multiple
          value={form.company.map((c) => c._id)}
          onChange={(e) => {
            const selected = Array.from(e.target.selectedOptions).map(
              (o) => o.value
            );
            setForm({
              ...form,
              company: companies.filter((c) => selected.includes(c._id)),
            });
          }}
          className="w-full border p-2 rounded"
        >
          {companies.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Admins */}
        <select
          multiple
          value={form.admin.map((a) => a._id)}
          onChange={(e) => {
            const selected = Array.from(e.target.selectedOptions).map(
              (o) => o.value
            );
            setForm({
              ...form,
              admin: admins.filter((a) => selected.includes(a._id)),
            });
          }}
          className="w-full border p-2 rounded"
        >
          {admins.map((a) => (
            <option key={a._id} value={a._id}>
              {a.first_name} {a.last_name}
            </option>
          ))}
        </select>
      </div>
    </FormModal>
  );
}

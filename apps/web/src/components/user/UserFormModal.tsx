import { FormModal } from "@/components/common/FormModal";
import { useEffect, useState, useCallback } from "react";
import { Types, Services } from "@my-monorepo/shared";
import { showToast } from "@/utils/toast";
import { useTranslation } from "react-i18next";
import axiosInstance from "@/utils/request/authorizedRequest";

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUser: Types.User.UserType | null;
  onSave: () => void;
}

export default function UserFormModal({
  isOpen,
  onClose,
  selectedUser,
  onSave,
}: UserFormModalProps) {
  const { t } = useTranslation();
  const [form, setForm] = useState<Types.User.UserForm>({
    first_name: "",
    last_name: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    if (selectedUser)
      setForm({
        first_name: selectedUser.first_name,
        last_name: selectedUser.last_name,
        email: selectedUser.email,
        role: selectedUser.role,
      });
    else setForm({ first_name: "", last_name: "", email: "", role: "" });
  }, [selectedUser]);

  const handleSubmit = useCallback(async () => {
    const { first_name, last_name, email, role } = form;
    if (!first_name || !last_name || !email || !role) {
      showToast(
        "error",
        t("user.message.allFieldsRequired") || "All fields are required"
      );
      return;
    }

    try {
      if (selectedUser) {
        const res = await Services.User.updateUser(
          axiosInstance,
          selectedUser._id,
          form
        );
        if (res.status === 200)
          showToast("success", t("user.message.updated") || "User updated");
        else throw new Error();
      } else {
        const res = await Services.User.addUser(axiosInstance, form);
        if (res.status === 201)
          showToast("success", t("user.message.created") || "User created");
        else throw new Error();
      }
      onSave();
      onClose();
    } catch {
      showToast(
        "error",
        t("user.message.submitFailed") || "Failed to submit user"
      );
    }
  }, [form, selectedUser, onClose, onSave, t]);

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={selectedUser ? t("user.editTitle") : t("user.createTitle")}
      submitLabel={
        selectedUser ? t("common.button.update") : t("common.button.save")
      }
      cancelLabel={t("common.button.cancel")}
    >
      <div className="space-y-4">
        <input
          type="text"
          placeholder={t("user.firstName")}
          value={form.first_name}
          onChange={(e) => setForm({ ...form, first_name: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder={t("user.lastName")}
          value={form.last_name}
          onChange={(e) => setForm({ ...form, last_name: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <input
          type="email"
          placeholder={t("user.email")}
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="w-full border p-2 rounded"
        >
          <option value="">{t("user.selectRole") || "Select a role"}</option>
          <option value="ADMIN">Admin</option>
          <option value="MANAGER">Manager</option>
          <option value="STAFF">Staff</option>
        </select>
      </div>
    </FormModal>
  );
}

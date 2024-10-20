import React, { useState } from "react";
import { Button, Table, Input, InputNumber, Select, Space, Popconfirm, Form } from "antd";
import { OfferConfigurationWithId, OfferConfigurationWithOptionalId, OfferDTOWithId } from "../../types";
import { useTranslation } from "react-i18next";
import { api } from "../../api/api";

type ConfigurationsProps = {
  offerId: number;
  configurations: OfferConfigurationWithOptionalId[];
  handleUpdateOffer: (newOffer: OfferDTOWithId) => void;
  handleUpdateConfiguration: (newOffer: OfferConfigurationWithId) => void;
};

const OfferConfigurations: React.FC<ConfigurationsProps> = ({
  offerId,
  configurations,
  handleUpdateOffer,
  handleUpdateConfiguration
}) => {
  const { t } = useTranslation();
  const [editingKey, setEditingKey] = useState<number | null | undefined>(undefined);
  const [form] = Form.useForm();

  const [newConfiguration, setNewConfiguration] = useState<OfferConfigurationWithOptionalId>({
    id: null,
    description: "",
    dailyPrice: 0,
    selectedOptions: { SEX: [], SIZE: [] },
  });

  const isEditing = (record: OfferConfigurationWithOptionalId) => record.id === editingKey;

  const handleEdit = (record: OfferConfigurationWithOptionalId) => {
    setEditingKey(record.id);
    form.setFieldsValue({ ...record });
  };

  const handleSaveEdit = async (configurationId: number) => {
    try {
      const values = await form.validateFields();
      const updatedConfiguration = await api.editOfferConfiguration(configurationId, values);
      if (updatedConfiguration) {
        handleUpdateConfiguration(updatedConfiguration);
      }
      setEditingKey(undefined);
    } catch (error) {
      console.error("Failed to save the configuration:", error);
    }
  };

  const handleDelete = async (configId: number) => {
    try {
      const updatedOffer = await api.deleteOfferConfiguration(configId);
      if (updatedOffer) { 
        handleUpdateOffer(updatedOffer);
      }
    } catch (error) {
      console.error("Failed to delete the configuration:", error);
    }
  };

  const handleAddNewRow = () => {
    form.resetFields();
    setNewConfiguration({
      id: null,
      description: "",
      dailyPrice: 0,
      selectedOptions: { SEX: [], SIZE: [] },
    });
    setEditingKey(null);
  };

  const handleSaveNewRow = async () => {
    try {
      const values = await form.validateFields();
      const updatedOffer = await api.addOfferConfiguration(offerId, values);
      if (updatedOffer) {
        handleUpdateOffer(updatedOffer);
      }
      setEditingKey(undefined);
    } catch (error) {
      console.error("Error saving new configuration:", error);
    }
  };

  const handleCancelNewRow = () => {
    setEditingKey(undefined);
  };

  const columns = [
    {
      title: t("description"),
      dataIndex: "description",
      render: (_: string, record: OfferConfigurationWithOptionalId) => {
        const editable = isEditing(record);
        return editable ? (
          <Form.Item
            name="description"
            rules={[{ required: true, message: t("validation.required") }]}
          >
            <Input />
          </Form.Item>
        ) : (
          record.description
        );
      },
    },
    {
      title: t("dailyPrice"),
      dataIndex: "dailyPrice",
      render: (_: number, record: OfferConfigurationWithOptionalId) => {
        const editable = isEditing(record);
        return editable ? (
          <Form.Item
            name="dailyPrice"
            rules={[{ required: true, message: t("validation.required") }]}
          >
            <InputNumber min={1} max={9999} />
          </Form.Item>
        ) : (
          record.dailyPrice
        );
      },
    },
    {
      title: t("sex"),
      dataIndex: ["selectedOptions", "SEX"],
      render: (values: string[], record: OfferConfigurationWithOptionalId) => {
        const editable = isEditing(record);
        return editable ? (
          <Form.Item
            name={["selectedOptions", "SEX"]}
            rules={[{ required: true, message: t("validation.required") }]}
          >
            <Select
              mode="multiple"
              options={[
                { value: "MALE", label: t("male") },
                { value: "SHE", label: t("she") },
              ]}
            />
          </Form.Item>
        ) : (
          values.map((value) => t(value.toLowerCase())).join(", ")
        );
      },
    },
    {
      title: t("size"),
      dataIndex: ["selectedOptions", "SIZE"],
      render: (values: string[], record: OfferConfigurationWithOptionalId) => {
        const editable = isEditing(record);
        return editable ? (
          <Form.Item
            name={["selectedOptions", "SIZE"]}
            rules={[{ required: true, message: t("validation.required") }]}
          >
            <Select
              mode="multiple"
              options={[
                { value: "SMALL", label: t("small") },
                { value: "BIG", label: t("big") },
              ]}
            />
          </Form.Item>
        ) : (
          values.map((value) => t(value.toLowerCase())).join(", ")
        );
      },
    },
    {
      title: t("manage"),
      render: (record: OfferConfigurationWithOptionalId) => {
        const editable = isEditing(record);
        return editable ? (
          <Space size="middle">
            <Button onClick={record.id ? () => handleSaveEdit(record.id!) : handleSaveNewRow}>
              {t("save")}
            </Button>
            <Button onClick={handleCancelNewRow}>{t("cancel")}</Button>
          </Space>
        ) : (
          <Space size="middle">
            <Button onClick={() => handleEdit(record)} disabled={editingKey !== undefined}>
              {t("edit")}
            </Button>
            <Popconfirm
              title={t("deleteConfiguration")}
              description={t("confirmConfigurationDelete")}
              onConfirm={() => handleDelete(record.id!)}
              okText={t("yes")}
              cancelText={t("no")}
              disabled={editingKey !== undefined}
            >
              <Button type="primary" danger disabled={editingKey !== undefined}>
                {t("delete")}
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <Form form={form} component={false}>
        <Table
          dataSource={editingKey === null ? [...configurations, newConfiguration] : configurations}
          columns={columns}
          rowKey={(record: OfferConfigurationWithOptionalId) => record.id || "new"}
          pagination={false}
        />
      </Form>
      <Button
        type="primary"
        onClick={handleAddNewRow}
        style={{ marginTop: "10px" }}
        disabled={editingKey !== undefined}
      >
        {t("addConfiguration")}
      </Button>
    </div>
  );
};

export default OfferConfigurations;

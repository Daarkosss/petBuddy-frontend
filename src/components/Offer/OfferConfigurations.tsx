import React, { ChangeEvent, KeyboardEvent, useState } from "react";
import { Button, Table, Input, Select, Space, Popconfirm, Form, TableColumnsType } from "antd";
import { OfferConfigurationWithId, OfferConfigurationWithOptionalId, OfferDTOWithId } from "../../types";
import { useTranslation } from "react-i18next";
import { api } from "../../api/api";
import { toast } from "react-toastify";
import _ from "lodash";

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
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSaveEditRow = async (configurationId: number) => {
    setIsLoading(true);
    try {
      const values = await form.validateFields();
      if (configurationExists(values)) {
        toast.error(t("error.duplicateConfiguration"));
        return;
      }

      const updatedConfiguration = await api.editOfferConfiguration(configurationId, values);
      if (updatedConfiguration) {
        handleUpdateConfiguration(updatedConfiguration);
      }
      toast.success(t("success.editConfiguration"));
    } catch (error) {
      toast.error(t("error.editConfiguration"));
    } finally {
      setEditingKey(undefined);
      setIsLoading(false);
    }
  };

  const handleDelete = async (configId: number) => {
    setIsLoading(true);
    try {
      const updatedOffer = await api.deleteOfferConfiguration(configId);
      if (updatedOffer) { 
        handleUpdateOffer(updatedOffer);
      }
      toast.success(t("success.deleteConfiguration"));
    } catch (error) {
      toast.error(t("error.deleteConfiguration"));
    } finally {
      setIsLoading(false);
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

  const sortNestedArrays = (obj: Record<string, string[]>) => {
    return _.mapValues(obj, (value: string[]) => {
      return _.sortBy(value);
    });
  };

  const configurationExists = (updatedConfig: OfferConfigurationWithOptionalId) => {
    const updatedConfigOptions = {
      ...updatedConfig,
      selectedOptions: sortNestedArrays(updatedConfig.selectedOptions),
    };

    return configurations.some((config) => {
      const configOptions = sortNestedArrays(config.selectedOptions);
      return config.id !== editingKey && _.isEqual(configOptions, updatedConfigOptions.selectedOptions)
    });
  }

  const handleSaveNewRow = async () => {
    setIsLoading(true);
    try {
      const values = await form.validateFields();
      if (configurationExists(values)) {
        toast.error(t("error.duplicateConfiguration"));
        return;
      }

      const updatedOffer = await api.addOfferConfiguration(offerId, values);
      if (updatedOffer) {
        handleUpdateOffer(updatedOffer);
      }
      toast.success(t("success.addConfiguration"));
      setEditingKey(undefined);
    } catch (error) {
      toast.error(t("error.addConfiguration"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelNewRow = () => {
    setEditingKey(undefined);
  };

  const handlePriceKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const value = e.key;
    const regex = /^\d/;

    const allowedKeys = ["Backspace", "Delete", ","];
    if (!regex.test(value) && !allowedKeys.includes(e.key)) {
      e.preventDefault();
    }
  };

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const regex = /^\d{0,5}(\.\d{0,2})?$/;
    const value = e.target.value;
    
    if (!regex.test(value)) {
      form.setFieldsValue({ dailyPrice: value.slice(0, -1) });
    }
  };
  const columns: TableColumnsType<OfferConfigurationWithOptionalId> = [
    {
      title: t("description"),
      dataIndex: "description",
      onCell: () => ({
        style: { minWidth: 150, maxWidth: 170 },
      }),
      render: (_: string, record: OfferConfigurationWithOptionalId) => {
        const editable = isEditing(record);
        return editable ? (
          <Form.Item
            name="description"
            rules={[{ required: true, message: t("validation.required") }]}
          >
            <Input.TextArea autoSize={{ minRows: 1, maxRows: 4 }} />
          </Form.Item>
        ) : (
          record.description
        );
      },
    },
    {
      title: t("dailyPrice"),
      dataIndex: "dailyPrice",
      fixed: "right",
      onCell: () => ({
        style: { width: 130 },
      }),
      align: "right",
      render: (_: number, record: OfferConfigurationWithOptionalId) => {
        const editable = isEditing(record);
        return editable ? (
          <Form.Item
            name="dailyPrice"
            rules={[{ required: true, message: t("validation.required") }]}
          >
            <Input
              type="number"
              min={0}
              onKeyDown={handlePriceKeyDown}
              onChange={handlePriceChange}
            />
          </Form.Item>
        ) : (
          record.dailyPrice
        );
      },
    },
    {
      title: t("sex"),
      dataIndex: ["selectedOptions", "SEX"],
      onCell: () => ({
        style: { width: 150 },
      }),
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
      onCell: () => ({
        style: { width: 150 },
      }),
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
      onCell: () => ({
        style: { minWidth: 150, maxWidth: 200 },
      }),
      render: (record: OfferConfigurationWithOptionalId) => {
        const editable = isEditing(record);
        return editable ? (
          <Space size="small">
            <Button
              type="primary"
              onClick={record.id ? () => handleSaveEditRow(record.id!) : handleSaveNewRow}
              loading={isLoading}
            >
              {t("save")}
            </Button>
            <Button onClick={handleCancelNewRow}>{t("cancel")}</Button>
          </Space>
        ) : (
          <Space size="small">
            <Button 
              type="primary" 
              onClick={() => handleEdit(record)} 
              disabled={editingKey !== undefined}
            >
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
              <Button type="primary" danger loading={isLoading} disabled={editingKey !== undefined}>
                {t("delete")}
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="offer-configurations">
      <Form form={form} component={false}>
        <Table
          dataSource={editingKey === null ? [...configurations, newConfiguration] : configurations}
          columns={columns}
          rowKey={(record: OfferConfigurationWithOptionalId) => record.id || "new"}
          pagination={false}
          scroll={{ x: "max-content" }}
        />
      </Form>
      {editingKey === undefined && 
        <Button
          type="primary"
          className="add-configuration-button"
          onClick={handleAddNewRow}
          style={{ marginTop: "10px" }}
        >
          {t("addConfiguration")}
        </Button>
      }
    </div>
  );
};

export default OfferConfigurations;

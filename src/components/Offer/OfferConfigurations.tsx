import React, { useState } from "react";
import { Button, Table, Input, InputNumber, Select, Space, Popconfirm } from "antd";
import { OfferConfigurationWithOptionalId, OfferDTOWithId } from "../../types";
import { useTranslation } from "react-i18next";
import { api } from "../../api/api";

type ConfigurationsProps = {
  offerId: number;
  configurations: OfferConfigurationWithOptionalId[];
  handleUpdateOffer: (newOffer: OfferDTOWithId) => void;
};

const OfferConfigurations: React.FC<ConfigurationsProps> = ({
  offerId,
  configurations,
  handleUpdateOffer,
}) => {
  const { t } = useTranslation();
  const [editingKey, setEditingKey] = useState<number | null | undefined>(undefined);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newConfiguration, setNewConfiguration] = useState<OfferConfigurationWithOptionalId>({
    id: null,
    description: "",
    dailyPrice: 0,
    selectedOptions: { SEX: [], SIZE: [] },
  });

  const isEditing = (record: OfferConfigurationWithOptionalId) => record.id === editingKey;

  const handleEdit = (record: OfferConfigurationWithOptionalId) => {
    setEditingKey(record.id);
    setNewConfiguration(record);
  };

  const handleSaveEdit = async (configurationId: number) => {
    try {
      const updatedOfferResponse = await api.editOfferConfiguration(configurationId, newConfiguration);
      if (updatedOfferResponse) handleUpdateOffer(updatedOfferResponse);
      setEditingKey(undefined);
    } catch (error) {
      console.error("Failed to save the configuration:", error);
    }
  };

  const handleDelete = async (configId: number) => {
    try {
      const updatedOfferResponse = await api.deleteOfferConfiguration(configId);
      if (updatedOfferResponse) handleUpdateOffer(updatedOfferResponse);
    } catch (error) {
      console.error("Failed to delete the configuration:", error);
    }
  };

  const handleAddNewRow = () => {
    setIsAddingNew(true);
    setNewConfiguration({
      id: null,
      description: "",
      dailyPrice: 0,
      selectedOptions: { SEX: [], SIZE: [] },
    })
    setEditingKey(null);
  };

  const handleSaveNewRow = async () => {
    try {
      const updatedOfferResponse = await api.addOfferConfiguration(offerId, newConfiguration);
      if (updatedOfferResponse) handleUpdateOffer(updatedOfferResponse);
      setIsAddingNew(false);
      setNewConfiguration({
        id: null,
        description: "",
        dailyPrice: 0,
        selectedOptions: { SEX: [], SIZE: [] },
      });
    } catch (error) {
      console.error("Error saving new configuration:", error);
    }
  };

  const handleCancelNewRow = () => {
    setIsAddingNew(false);
    setEditingKey(undefined);
  };

  const columns = [
    {
      title: t("description"),
      dataIndex: "description",
      render: (desctiption: string, record: OfferConfigurationWithOptionalId) => {
        const editable = isEditing(record)
        console.log("editable", editable)
        return editable ? (
          <Input
            value={newConfiguration.description}
            onChange={(e) => setNewConfiguration({ ...newConfiguration, description: e.target.value })}
          />
        ) : (
          desctiption
        );
      },
    },
    {
      title: t("dailyPrice"),
      dataIndex: "dailyPrice",
      render: (dailyPrice: number, record: OfferConfigurationWithOptionalId) => {
        const editable = isEditing(record);
        return editable ? (
          <InputNumber
            value={newConfiguration.dailyPrice}
            onChange={(value) => setNewConfiguration({ ...newConfiguration, dailyPrice: value || 0 })}
          />
        ) : (
          dailyPrice
        );
      },
    },
    {
      title: t("sex"),
      dataIndex: ["selectedOptions", "SEX"],
      render: (values: string[], record: OfferConfigurationWithOptionalId) => {
        const editable = isEditing(record);
        return editable ? (
          <Select
            mode="multiple"
            value={newConfiguration.selectedOptions.SEX}
            onChange={(value) =>
              setNewConfiguration({ 
                ...newConfiguration,
                selectedOptions: { ...newConfiguration.selectedOptions, SEX: value } 
              })
            }
            options={[
              { value: "MALE", label: t("male") },
              { value: "SHE", label: t("she") },
            ]}
          />
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
          <Select
            mode="multiple"
            value={newConfiguration.selectedOptions.SIZE}
            onChange={(value) =>
              setNewConfiguration({ 
                ...newConfiguration, 
                selectedOptions: { ...newConfiguration.selectedOptions, SIZE: value } 
              })
            }
            options={[
              { value: "SMALL", label: t("small") },
              { value: "BIG", label: t("big") },
            ]}
          />
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
            <Button onClick={isAddingNew ? handleSaveNewRow : () => handleSaveEdit(record.id!)}>
              {t("save")}
            </Button>
            <Button onClick={isAddingNew ? handleCancelNewRow : () => setEditingKey(undefined)}>
              {t("cancel")}
            </Button>
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
      <Table
        dataSource={isAddingNew ? [...configurations, newConfiguration] : configurations}
        columns={columns}
        rowKey={(record: OfferConfigurationWithOptionalId) => record.id || "new"}
        pagination={false}
        rowClassName={() => (editingKey !== null ? "editable-row" : "")}
      />
      {!isAddingNew && (
        <Button
          type="primary"
          onClick={handleAddNewRow}
          style={{ marginTop: "10px" }}
          disabled={!!editingKey}
        >
          {t("addNewConfiguration")}
        </Button>
      )}
    </div>
  );
};

export default OfferConfigurations;

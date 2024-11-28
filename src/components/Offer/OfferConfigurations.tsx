import React, { useState } from "react";
import {
  Button,
  Table,
  Input,
  Select,
  Space,
  Popconfirm,
  Form,
  TableColumnsType,
  Tooltip,
} from "antd";
import {
  AvailabilityValues,
  OfferConfigurationWithId,
  OfferConfigurationWithOptionalId,
  OfferWithId,
} from "../../types";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import _ from "lodash";
import { api } from "../../api/api";
import store from "../../store/RootStore";
import { ColumnType } from "antd/es/table";
import { useNavigate, useParams } from "react-router-dom";
import NumericFormItem from "../NumericFormItem";

type ConfigurationsProps = {
  offerId: number;
  animalType: string;
  configurations: OfferConfigurationWithOptionalId[];
  availabilities: AvailabilityValues;
  handleUpdateOffer: (newOffer: OfferWithId) => void;
  handleUpdateConfiguration: (newOffer: OfferConfigurationWithId) => void;
  canBeEdited: boolean;
};

const OfferConfigurations: React.FC<ConfigurationsProps> = ({
  offerId,
  animalType,
  configurations,
  availabilities,
  handleUpdateOffer,
  handleUpdateConfiguration,
  canBeEdited = true,
}) => {
  const { t } = useTranslation();
  const [editingKey, setEditingKey] = useState<number | null | undefined>(undefined);
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { caretakerEmail } = useParams();

  const [newConfiguration, setNewConfiguration] =
    useState<OfferConfigurationWithOptionalId>({
      id: null,
      description: "",
      dailyPrice: 0,
      selectedOptions: {},
    });

  const isEditing = (record: OfferConfigurationWithOptionalId) =>
    record.id === editingKey;

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

      const updatedConfiguration = await api.editOfferConfiguration(
        configurationId,
        values
      );
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
      selectedOptions: {},
    });
    setEditingKey(null);
  };

  const sortNestedArrays = (obj: Record<string, string[]>) => {
    return _.mapValues(obj, (value: string[]) => {
      return _.sortBy(value);
    });
  };

  const configurationExists = (
    updatedConfig: OfferConfigurationWithOptionalId
  ) => {
    const updatedConfigOptions = {
      ...updatedConfig,
      selectedOptions: sortNestedArrays(updatedConfig.selectedOptions),
    };

    return configurations.some((config) => {
      const configOptions = sortNestedArrays(config.selectedOptions);
      return (
        config.id !== editingKey &&
        _.isEqual(configOptions, updatedConfigOptions.selectedOptions)
      );
    });
  };

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

  const getTooltipText = () => {
    if (availabilities.length === 0) {
      return t("noAvailability");
    } else if (store.user.profile?.selected_profile !== "CLIENT") {
      return t("needToLoginAsClient");
    } else {
      return undefined;
    }
  };

  const selectedOptionsColumns: ColumnType<OfferConfigurationWithOptionalId>[] =
    store.animal.getAnimalAttributeKeys(animalType).map((attributeKey) => ({
      title: t(attributeKey.toLowerCase()),
      dataIndex: ["selectedOptions", attributeKey],
      onCell: () => ({
        style: { width: 150 },
      }),
      render: (values: string[], record: OfferConfigurationWithOptionalId) => {
        const editable = isEditing(record);
        return editable ? (
          <Form.Item
            name={["selectedOptions", attributeKey]}
            rules={[{ required: true, message: t("validation.required") }]}
          >
            <Select
              mode="multiple"
              showSearch={false}
              notFoundContent={t("noData")}
              options={store.animal
                .getAttributeValues(animalType, attributeKey)
                .map((value) => ({
                  value,
                  label: t(value.toLowerCase()),
                }))}
            />
          </Form.Item>
        ) : values ? (
          values.map((value) => t(value.toLowerCase())).join(", ")
        ) : (
          ""
        );
      },
    }));

  const allColumns: TableColumnsType<OfferConfigurationWithOptionalId> = [
    {
      title: t("description"),
      dataIndex: "description",
      onCell: () => ({
        style: { minWidth: 150, maxWidth: 160 },
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
          <NumericFormItem name="dailyPrice" />
        ) : (
          record.dailyPrice
        );
      },
    },
    ...selectedOptionsColumns,
    {
      title: t("actions"),
      onCell: () => ({
        style: { minWidth: 150, maxWidth: 200 },
      }),
      render: (record: OfferConfigurationWithOptionalId) => {
        const editable = isEditing(record);
        return canBeEdited ? (
          editable ? (
            <Space size="small">
              <Button
                type="primary"
                onClick={
                  record.id
                    ? () => handleSaveEditRow(record.id!)
                    : handleSaveNewRow
                }
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
                <Button
                  type="primary"
                  danger
                  loading={isLoading}
                  disabled={editingKey !== undefined}
                >
                  {t("delete")}
                </Button>
              </Popconfirm>
            </Space>
          )
        ) : (
          <Tooltip title={getTooltipText()}>
            <Button
              type="primary"
              onClick={() => navigate(
                `/care/reservation/${caretakerEmail}`,
                { 
                  state: { 
                    animalType,
                    dailyPrice: record.dailyPrice,
                    animalAttributes: record.selectedOptions,
                    availabilities: availabilities
                  } 
                }
              )}
              loading={isLoading}
              disabled={availabilities.length === 0 || store.user.profile?.selected_profile !== "CLIENT"}
            >
              {t("sendRequest")}
            </Button>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <div className="offer-configurations">
      <Form form={form} component={false}>
        <Table
          dataSource={
            editingKey === null
              ? [...configurations, newConfiguration]
              : configurations
          }
          columns={allColumns}
          rowKey={(record: OfferConfigurationWithOptionalId) =>
            record.id || "new"
          }
          pagination={false}
          scroll={{ x: "max-content" }}
          locale={{ emptyText: t("noConfigurations") }}
        />
      </Form>
      {editingKey === undefined && canBeEdited && (
        <Button
          type="primary"
          className="add-configuration-button"
          onClick={handleAddNewRow}
          style={{ marginTop: "10px" }}
        >
          {t("addConfiguration")}
        </Button>
      )}
    </div>
  );
};

export default OfferConfigurations;

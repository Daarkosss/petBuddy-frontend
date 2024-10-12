import React, { useEffect, useState } from "react";
import { Button, Table, Modal, Space } from "antd";
import { OfferDTOWithId, OfferConfigurationWithId } from "../types";
import OfferForm from "../components/OfferForm";
import { api } from "../api/api";
import { toast } from "react-toastify";
import store from "../store/RootStore";
import ConfigurationForm from "../components/OfferConfigurationForm";

const OfferList: React.FC = () => {
  const [offers, setOffers] = useState<OfferDTOWithId[]>([]);
  const [editingOffer, setEditingOffer] = useState<OfferDTOWithId | null>(null);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<OfferConfigurationWithId | null>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    try {
      if (store.user.profile?.email) {
        const data = await api.getCaretakerDetails(store.user.profile?.email);
        setOffers(data.offers);
      }
    } catch (error) {
      toast.error("Failed to load offers");
    }
  };

  const handleDeleteOffer = async (offerId: number) => {
    try {
      await api.deleteOffer(offerId);
      toast.success("Offer deleted successfully");
      loadOffers();
    } catch (error) {
      toast.error("Failed to delete offer");
    }
  };

  const handleEditOffer = (offer: OfferDTOWithId) => {
    setEditingOffer(offer);
    setIsOfferModalOpen(true);
  };

  const handleAddOffer = () => {
    setEditingOffer(null);
    setIsOfferModalOpen(true);
  };

  const handleSuccessfulOfferSave = () => {
    setIsOfferModalOpen(false);
    loadOffers();
  };

  const handleAddConfiguration = (offer: OfferDTOWithId) => {
    setEditingOffer(offer);
    setEditingConfig(null);
    setIsConfigModalOpen(true);
  };

  const handleEditConfiguration = (config: OfferConfigurationWithId) => {
    setEditingConfig(config);
    setIsConfigModalOpen(true);
  };

  const handleSaveConfiguration = async (newConfig: OfferConfigurationWithId) => {
    if (newConfig.id) {
      try {
        await api.editOfferConfiguration(newConfig.id, newConfig);
        toast.success("Configuration saved successfully");
        setIsConfigModalOpen(false);
        loadOffers();
      } catch (error) {
        toast.error("Failed to save configuration");
      }
    } else {
      try {
        await api.addOfferConfiguration(editingOffer!.id, newConfig);
        toast.success("Configuration added successfully");
        setIsConfigModalOpen(false);
        loadOffers();
      } catch (error) {
        toast.error("Failed to add configuration");
      }
    }
  };

  const handleDeleteConfiguration = async (configurationId: number) => {
    try {
      await api.deleteOfferConfiguration(configurationId);
      toast.success("Configuration deleted successfully");
      loadOffers();
    } catch (error) {
      toast.error("Failed to delete configuration");
    }
  };

  const expandedRowRender = (offer: OfferDTOWithId) => {
    const columns = [
      { title: "Description", dataIndex: "description" },
      { title: "Daily Price", dataIndex: "dailyPrice" },
      { 
        title: "Sex", dataIndex: ["selectedOptions", "SEX"],
        render: (values: string[]) => values.join(", ")
      },
      { 
        title: "Size", dataIndex: ["selectedOptions", "SIZE"],
        render: (values: string[]) => values.join(", ")
      },
      {
        title: "Action",
        render: (record: OfferConfigurationWithId & { id: number }) => (
          <Space size="middle">
            <Button onClick={() => handleEditConfiguration(record)}>Edit</Button>
            <Button
              type="primary"
              danger
              onClick={() => handleDeleteConfiguration(record.id)}
            >
              Delete
            </Button>
          </Space>
        ),
      },
    ];

    return (
      <div>
        <Button
          type="primary"
          onClick={() => handleAddConfiguration(offer)}
          style={{ marginBottom: 10 }}
        >
          Add Configuration
        </Button>
        <Table
          columns={columns}
          dataSource={offer.offerConfigurations}
          pagination={false}
          rowKey="id"
        />
      </div>
    );
  };

  return (
    <div>
      <Button type="primary" onClick={handleAddOffer}>Add New Offer</Button>
      <Table
        dataSource={offers}
        columns={[
          { title: "Description", dataIndex: "description" },
          { title: "Animal Type", dataIndex: ["animal", "animalType"] },
          { title: "Availabilty", dataIndex: "availabilities" },
          {
            title: "Action",
            render: (offer) => (
              <Space size="middle">
                <Button onClick={() => handleEditOffer(offer)}>Edit</Button>
                <Button
                  type="primary"
                  danger
                  onClick={() => handleDeleteOffer(offer.id)}
                  disabled
                >
                  Delete
                </Button>
              </Space>
            ),
          },
        ]}
        pagination={false}
        rowKey="id"
        expandable={{
          expandedRowRender: expandedRowRender,
        }}
      />
      <Modal
        title={editingOffer ? "Edit Offer" : "Add Offer"}
        open={isOfferModalOpen}
        onCancel={() => setIsOfferModalOpen(false)}
        footer={null}
        maskClosable={false}
      >
        <OfferForm offer={editingOffer!} onSuccess={handleSuccessfulOfferSave} />
      </Modal>

      <Modal
        title={editingConfig ? "Edit Configuration" : "Add Configuration"}
        open={isConfigModalOpen}
        onCancel={() => setIsConfigModalOpen(false)}
        footer={null}
        maskClosable={false}
      >
        <ConfigurationForm
          initialValues={editingConfig!}
          onSuccess={handleSaveConfiguration}
        />
      </Modal>
    </div>
  );
};

export default OfferList;

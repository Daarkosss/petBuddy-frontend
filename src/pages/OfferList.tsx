import React, { useEffect, useState } from "react";
import { Button, Table, Modal, Space } from "antd";
import { OfferDTOWithId, OfferConfigurationDTO } from "../types";
import OfferForm from "../components/OfferForm";
import { api } from "../api/api";
import { toast } from "react-toastify";
import store from "../store/RootStore";
import ConfigurationForm from "../components/OfferConfigurationForm"; // Form for adding/editing configurations

const OfferList: React.FC = () => {
  const [offers, setOffers] = useState<OfferDTOWithId[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<OfferDTOWithId | null>(null);
  const [editingConfigOfferId, setEditingConfigOfferId] = useState<number | null>(null);
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
      // await api.deleteOffer(offerId);
      toast.success("Offer deleted successfully");
      loadOffers();
    } catch (error) {
      toast.error("Failed to delete offer");
    }
  };

  const handleEditOffer = (offer: OfferDTOWithId) => {
    setEditingOffer(offer);
    setIsModalOpen(true);
  };

  const handleAddOffer = () => {
    setEditingOffer(null);
    setIsModalOpen(true);
  };

  const handleAddConfiguration = (offerId: number) => {
    setEditingConfigOfferId(offerId);
    setIsConfigModalOpen(true);
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
        title: "Action",
        render: (text, record: OfferConfigurationDTO & { id: number }) => (
          <Space size="middle">
            <Button
              type="link"
              onClick={() => handleDeleteConfiguration(record.id)}
              danger
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
          onClick={() => handleAddConfiguration(offer.id)}
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
          {
            title: "Action",
            render: (text, offer) => (
              <>
                <Button onClick={() => handleEditOffer(offer)}>Edit</Button>
                <Button
                  disabled
                  onClick={() => handleDeleteOffer(offer.id)}
                  danger
                >
                  Delete
                </Button>
              </>
            ),
          },
        ]}
        rowKey="id"
        expandable={{
          expandedRowRender: expandedRowRender,
        }}
      />
      <Modal
        title={editingOffer ? "Edit Offer" : "Add Offer"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <OfferForm offer={editingOffer!} onSuccess={loadOffers} />
      </Modal>

      <Modal
        title="Add/Edit Configuration"
        open={isConfigModalOpen}
        onCancel={() => setIsConfigModalOpen(false)}
        footer={null}
      >
        <ConfigurationForm
          configurationId={editingConfigOfferId}
          onSuccess={() => {
            setIsConfigModalOpen(false);
            loadOffers();
          }}
        />
      </Modal>
    </div>
  );
};

export default OfferList;

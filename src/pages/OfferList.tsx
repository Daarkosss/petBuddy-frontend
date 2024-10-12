import React, { useEffect, useState } from "react";
import { Button, Table, Modal } from "antd";
import { OfferDTOWithId } from "../types";
import OfferForm from "../components/OfferForm";
import { api } from "../api/api";
import { toast } from "react-toastify";
import store from "../store/RootStore";

const OfferList: React.FC = () => {
  const [offers, setOffers] = useState<OfferDTOWithId[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<OfferDTOWithId | null>(null);

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

  // const handleDeleteOffer = async (offerId: number) => {
  //   try {
  //     await api.deleteOffer(offerId);
  //     toast.success("Offer deleted successfully");
  //     loadOffers();
  //   } catch (error) {
  //     toast.error("Failed to delete offer");
  //   }
  // };

  const handleEditOffer = (offer: OfferDTOWithId) => {
    setEditingOffer(offer);
    setIsModalOpen(true);
  };

  const handleAddOffer = () => {
    setEditingOffer(null);
    setIsModalOpen(true);
  };

  return (
    <div>
      <Button type="primary" onClick={handleAddOffer}>Add New Offer</Button>
      <Table
        dataSource={offers}
        columns={[
          {
            title: "Description",
            dataIndex: "description",
          },
          {
            title: "Animal Type",
            dataIndex: ["animal", "animalType"],
          },
          {
            title: "Action",
            render: (text, offer) => (
              <>
                <Button onClick={() => handleEditOffer(offer)}>Edit</Button>
                {/* <Button onClick={() => handleDeleteOffer(offer.id)} danger>Delete</Button> */}
              </>
            ),
          },
        ]}
        rowKey="id"
      />
      <Modal
        title={editingOffer ? "Edit Offer" : "Add Offer"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <OfferForm offer={editingOffer!} onSuccess={loadOffers} />
      </Modal>
    </div>
  );
};

export default OfferList;

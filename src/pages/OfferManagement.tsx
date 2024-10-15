import React, { useEffect, useState } from "react";
import { Row, Col, Button, Modal } from "antd";
import { OfferDTOWithId } from "../types";
import OfferCard from "../components/Offer/OfferCard";
import { api } from "../api/api";
import { toast } from "react-toastify";
import store from "../store/RootStore";
import { t } from "i18next";
import AddOfferForm from "../components/Offer/AddOfferForm";

const OfferManagement: React.FC = () => {
  const [offers, setOffers] = useState<OfferDTOWithId[]>([]);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);


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
      toast.error(t("error.loadOffers"));
    }
  };

  const handleSaveDetails = async (updatedOffer: OfferDTOWithId) => {
    try {
      await api.addOrEditOffer(updatedOffer);
      toast.success(t("success.editOffer"));
      loadOffers();
    } catch (error) {
      toast.error(t("error.editOffer"));
    }
  };

  const handleSuccessfulOfferSave = () => {
    setIsOfferModalOpen(false);
    loadOffers();
  };

  const handleAddOffer = () => {
    setIsOfferModalOpen(true);
  };

  return (
    <div className="offer-management-page">
      <h1>{t("manageOffer")}</h1>
      <Button type="primary" onClick={handleAddOffer}>{t("addOffer")}</Button>
      <Row gutter={[50, 50]}>
        {offers.map((offer) => (
          <Col key={offer.id}>
            <OfferCard offer={offer} onSave={handleSaveDetails} />
          </Col>
        ))}
      </Row>
      <Modal
        title={t("addOffer")}
        open={isOfferModalOpen}
        onCancel={() => setIsOfferModalOpen(false)}
        footer={null}
        maskClosable={false}
      >
        <AddOfferForm onSuccess={handleSuccessfulOfferSave} />
      </Modal>
    </div>
  );
};

export default OfferManagement;

import React, { useEffect, useState } from "react";
import { Row, Col, Button, Modal } from "antd";
import { OfferDTOWithId } from "../types";
import OfferCard from "../components/Offer/OfferCard";
import { api } from "../api/api";
import { toast } from "react-toastify";
import store from "../store/RootStore";
import AddOfferForm from "../components/Offer/AddOfferForm";
import { useTranslation } from "react-i18next";

const OfferManagement: React.FC = () => {
  const { t } = useTranslation();
  const [offers, setOffers] = useState<OfferDTOWithId[]>([]);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

  useEffect(() => {
    loadOffers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleSuccessfulOfferSave = () => {
    setIsOfferModalOpen(false);
    loadOffers();
  };

  const handleAddOffer = () => {
    setIsOfferModalOpen(true);
  };

  const handleUpdateOffer = (updatedOffer: OfferDTOWithId, isDeleted = false) => {
    if (isDeleted) {
      setOffers((prevOffers) => prevOffers.filter(
        (offer) => offer.id !== updatedOffer.id
      ));
    } else {
      setOffers((prevOffers) => prevOffers.map(
        (offer) => (offer.id === updatedOffer.id ? updatedOffer : offer)
      ));
    }
  };

  return (
    <div className="offer-management-page">
      <div className="offer-management-header">
        <h1>{t("yourOffers.manageOffer")}</h1>
        <Button type="primary" className="add-offer-button" onClick={handleAddOffer}>{t("addOffer")}</Button>
      </div>
      <Row gutter={[50, 50]} justify="center">
        {offers.map((offer) => (
          <Col key={offer.id}>
            <OfferCard offer={offer} updateOffers={loadOffers} handleUpdateOffer={handleUpdateOffer} />
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

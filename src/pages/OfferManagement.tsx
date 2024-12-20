import React, { useEffect, useState } from "react";
import { Col, Button, Modal, Space } from "antd";
import { OfferWithId } from "../types";
import OfferCard from "../components/Offer/OfferCard";
import { api } from "../api/api";
import { toast } from "react-toastify";
import store from "../store/RootStore";
import AddOfferForm from "../components/Offer/AddOfferForm";
import { useTranslation } from "react-i18next";
import SetAvailabilityModal from "../components/Offer/SetAvailabilityModal";

interface OfferManagementProps {
  onOffersChange?: (offers: OfferWithId[]) => void;
  providedOffers: OfferWithId[];
}

const OfferManagement: React.FC<OfferManagementProps> = ({
  onOffersChange,
  providedOffers,
}) => {
  const { t } = useTranslation();
  const [offers, setOffers] = useState<OfferWithId[]>(providedOffers);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);

  useEffect(() => {
    if (onOffersChange !== null && onOffersChange !== undefined) {
      onOffersChange(offers);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offers]);

  const loadOffers = async () => {
    try {
      if (store.user.profile?.email) {
        const data = await api.getCurrentCaretakerDetails();
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

  const handleSetAvailabilityForOffers = () => {
    setIsAvailabilityModalOpen(true);
  };

  const handleUpdateOffer = (updatedOffer: OfferWithId, isDeleted = false) => {
    if (isDeleted) {
      setOffers((prevOffers) =>
        prevOffers.filter((offer) => offer.id !== updatedOffer.id)
      );
    } else {
      setOffers((prevOffers) =>
        prevOffers.map((offer) =>
          offer.id === updatedOffer.id ? updatedOffer : offer
        )
      );
    }
  };

  const handleUpdateOffers = (updatedOffers: OfferWithId[]) => {
    setOffers((prevOffers) =>
      prevOffers.map(
        (offer) =>
          updatedOffers.find((updatedOffer) => updatedOffer.id === offer.id) ||
          offer
      )
    );
  };

  return (
    <div className="offer-management-page">
      <div className="offer-management-header">
        <h1>{t("yourOffers.manageOffer")}</h1>
        <Space size="middle" className="offer-management-buttons">
          <Button
            type="primary"
            className="add-offer-button"
            onClick={handleAddOffer}
          >
            {t("addOffer")}
          </Button>
          <Button
            type="primary"
            className="set-availability-button"
            onClick={handleSetAvailabilityForOffers}
          >
            {t("setAvailabilityForOffers")}
          </Button>
        </Space>
        {offers.length === 0 && (
          <h3 className="no-offers-message">
            {t("profilePage.noOffersToShow")}
          </h3>
        )}
      </div>
      <div className="offers-container">
        {offers.map((offer) => (
          <Col key={offer.id}>
            <OfferCard
              offer={offer}
              handleUpdateOffer={handleUpdateOffer}
              canBeEdited={true}
            />
          </Col>
        ))}
      </div>

      <Modal
        title={t("addOffer")}
        open={isOfferModalOpen}
        onCancel={() => setIsOfferModalOpen(false)}
        footer={null}
        maskClosable={false}
      >
        <AddOfferForm
          currentAnimalTypes={offers.map((offer) => offer.animal.animalType)}
          onSuccess={handleSuccessfulOfferSave}
        />
      </Modal>
      <SetAvailabilityModal
        availableOffers={offers}
        handleUpdateOffers={handleUpdateOffers}
        isModalOpen={isAvailabilityModalOpen}
        setIsModalOpen={setIsAvailabilityModalOpen}
      />
    </div>
  );
};

export default OfferManagement;

import React, { useState } from "react";
import { Button, Card, Popconfirm} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { OfferConfigurationWithId, OfferDTOWithId } from "../../types";
import { t } from "i18next";
import Meta from "antd/es/card/Meta";
import { api } from "../../api/api";
import { toast } from "react-toastify";
import OfferModal from "./OfferModal";

type OfferCardProps = {
  offer: OfferDTOWithId;
  handleUpdateOffer: (updatedOffer: OfferDTOWithId, isDeleted?: boolean) => void;
};

const OfferCard: React.FC<OfferCardProps> = ({ offer, handleUpdateOffer }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDeleteOffer = async () => {
    try {
      const deletedOffer = await api.deleteOffer(offer.id);
      if (deletedOffer) {
        handleUpdateOffer(deletedOffer, true);
      }
      toast.success(t("success.deleteOffer"));
    } catch (error) {
      toast.error(t("error.deleteOffer"));
    }
  };

  const handleUpdateConfiguration = (updatedConfiguration: OfferConfigurationWithId) => {
    const updatedConfigurations = offer.offerConfigurations.map((config) =>
      config.id === updatedConfiguration.id ? updatedConfiguration : config
    );
    
    const updatedOffer = { ...offer, offerConfigurations: updatedConfigurations };
    handleUpdateOffer(updatedOffer);
  };

  return (
    <div>
      <Card
        className="offer-card"
        cover={
          <img
            src={`/images/${offer.animal.animalType.toLowerCase()}-card.jpg`}
            alt={offer.animal.animalType}
          />
        }
        actions={[
          <Button type="primary" className="view-details-button" onClick={() => setIsModalOpen(true)}>
            {t("viewDetails")}
          </Button>,
          <Popconfirm
            title={t("deleteOffer")}
            description={t("confirmOfferDelete")}
            onConfirm={handleDeleteOffer}
            okText={t("yes")}
            cancelText={t("no")}
          >
            <Button type="primary" danger>
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        ]}
      >
        <Meta
          title={t(`yourOffers.${offer.animal.animalType.toLowerCase()}`)}
          description={offer.description.substring(0, 50)}
        />
      </Card>
      <OfferModal
        offer={offer}
        isModalOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        handleUpdateOffer={handleUpdateOffer}
        handleUpdateConfiguration={handleUpdateConfiguration}
      />
    </div>
  );
};

export default OfferCard;
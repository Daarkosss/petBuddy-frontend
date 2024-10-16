import React, { useState } from "react";
import { Button, Card, Modal, Input, Select, Popconfirm } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { OfferDTOWithId } from "../../types";
import { t } from "i18next";
import Meta from "antd/es/card/Meta";

type OfferCardProps = {
  offer: OfferDTOWithId;
  onSave: (updatedOffer: OfferDTOWithId) => void;
};

const OfferCard: React.FC<OfferCardProps> = ({ offer, onSave }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingAmenities, setIsEditingAmenities] = useState(false);
  const [isEditingAvailability, setIsEditingAvailability] = useState(false);

  const [editedDescription, setEditedDescription] = useState(offer.description);
  const [editedAmenities, setEditedAmenities] = useState(offer.animalAmenities);
  const [editedAvailability, setEditedAvailability] = useState(offer.availabilities);

  const handleSaveDescription = () => {
    onSave({ ...offer, description: editedDescription });
    setIsEditingDescription(false);
  };

  const handleSaveAmenities = () => {
    onSave({ ...offer, animalAmenities: editedAmenities });
    setIsEditingAmenities(false);
  };

  const handleSaveAvailability = () => {
    onSave({ ...offer, availabilities: editedAvailability });
    setIsEditingAvailability(false);
  };

  return (
    <div>
      <Card
        style={{ width: 400 }}
        cover={
          <img 
            src={`/images/${offer.animal.animalType.toLowerCase()}-card.jpg`}
            alt={offer.animal.animalType} 
          />
        }
        actions={[
          <Button type="primary" onClick={() => setIsModalOpen(true)} className="action-larger">
            {t("viewDetails")}
          </Button>,
          <Popconfirm
            title={t("deleteOffer")}
            description={t("confirmOfferDelete")}
            okText={t("yes")}
            cancelText={t("no")}
            style={{ flexGrow: 1 }}
          >
            <Button type="primary" danger className="action-smaller"><DeleteOutlined/></Button>
          </Popconfirm>
        ]}
      >
        <Meta
          title={t(`yourOffers.${offer.animal.animalType.toLowerCase()}`)}
          description={offer.description.substring(0, 50)}
        />
      </Card>

      <Modal
        title={`Your offer for ${t(offer.animal.animalType.toLowerCase())}`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={800}
        className="offer-modal"
      >
        <div className="offer-modal">
          <div className="offer-field">
            <div className="label">
              {t("description")}
              {!isEditingDescription && <EditOutlined onClick={() => setIsEditingDescription(true)} />}
            </div>
            {isEditingDescription ? (
              <div>
                <Input.TextArea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                />
                <Button onClick={handleSaveDescription}>{t("save")}</Button>
                <Button onClick={() => setIsEditingDescription(false)}>{t("cancel")}</Button>
              </div>
            ) : (
              <>
                <Input.TextArea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  disabled
                />
              </>
            )}
          </div>
          <div className="offer-field">
            <div className="label">
              {t("amenities")}
              {!isEditingAmenities && <EditOutlined onClick={() => setIsEditingAmenities(true)} />}
            </div>
            {isEditingAmenities ? (
              <>
                <Select
                  mode="multiple"
                  value={editedAmenities}
                  onChange={setEditedAmenities}
                  options={[
                    { value: "toys", label: t("amenityTypes.toys") },
                    { value: "scratching post", label: t("amenityTypes.scratchingPost") },
                    { value: "cage", label: t("amenityTypes.cage") },
                  ]}        
                />
                <Button onClick={handleSaveAmenities}>{t("save")}</Button>
                <Button onClick={() => setIsEditingAmenities(false)}>{t("cancel")}</Button>
              </>
            ) : (
              <>
                {editedAmenities.join(", ")}
              </>
            )}
          </div>
          <div className="offer-field">
            <div className="label">
              {t("availability")}
              {!isEditingAvailability && <EditOutlined onClick={() => setIsEditingAvailability(true)} />}
            </div>
            {isEditingAvailability ? (
              <div>
                <Input.TextArea
                  value={editedAvailability.join(", ")}
                  onChange={(e) => setEditedAvailability(e.target.value.split(", "))}
                />
                <Button onClick={handleSaveAvailability}>{t("save")}</Button>
                <Button onClick={() => setIsEditingAvailability(false)}>{t("cancel")}</Button>
              </div>
            ) : (
              <div>
                {offer.availabilities.join(", ")}
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OfferCard;

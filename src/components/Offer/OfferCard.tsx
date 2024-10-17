import React, { useState } from "react";
import { Button, Card, Modal, Input, Select, Popconfirm } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { OfferDTOWithId } from "../../types";
import { t } from "i18next";
import Meta from "antd/es/card/Meta";
import { Calendar, Value } from "react-multi-date-picker";
import { api } from "../../api/api";
import { toast } from "react-toastify";

type OfferCardProps = {
  offer: OfferDTOWithId;
  updateOffers: () => void;
};

const OfferCard: React.FC<OfferCardProps> = ({ offer, updateOffers }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingAmenities, setIsEditingAmenities] = useState(false);
  const [isEditingAvailability, setIsEditingAvailability] = useState(false);

  const [editedDescription, setEditedDescription] = useState(offer.description);
  const [editedAmenities, setEditedAmenities] = useState(offer.animalAmenities);
  const [editedAvailability, setEditedAvailability] = useState<Value[][]>(
    offer.availabilities.map((availability) => [
      availability.availableFrom,
      availability.availableTo || availability.availableFrom,
    ])
  );

  const handleSaveDescription = async () => {
    try {
      await api.addOrEditOffer({ ...offer, description: editedDescription });
      toast.success(t("success.editOffer"));
      updateOffers();
    } catch (error) {
      toast.error(t("error.editOffer"));
    } finally {
      setIsEditingDescription(false);
    }
  };

  const handleSaveAmenities = async () => {
    try {
      await api.setAmenitiesForOffer(offer.id, editedAmenities);
      toast.success(t("success.editOffer"));
      updateOffers();
    } catch (error) {
      toast.error(t("error.editOffer"));
    } finally {
      setIsEditingAmenities(false);
    }
  };

  // Temporary format until backend is not corrected
  const formatDateTime = (date: string, addHour=false): string => { 
    if (addHour) {
      return `${date} 01:00:00.000 +0100`;
    } else {
      return `${date} 00:00:00.000 +0100`;
    }
  };

  const handleSaveAvailability = async () => {
    try {
      const availabilities = editedAvailability.map((dateRange) => ({
        availableFrom: formatDateTime(dateRange[0] as string),
        availableTo: dateRange[1] 
        ? formatDateTime(dateRange[1] as string) 
        : formatDateTime(dateRange[0] as string, true),
      }));
      await api.setAvailabilityForOffers([offer.id], availabilities);
      toast.success(t("success.editOffer"));
      updateOffers();
    } catch (error) {
      toast.error(t("error.editOffer"));
    } finally {
      setIsEditingAvailability(false);
    }
  };

  
  const handleDeleteOffer = async () => {
    try {
      await api.deleteOffer(offer.id);
      toast.success(t("success.deleteOffer"));
      updateOffers();
    } catch (error) {
      toast.error(t("error.deleteOffer"));
    }
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
          <Button type="primary" onClick={() => setIsModalOpen(true)}>
            {t("viewDetails")}
          </Button>,
          <Popconfirm
            title={t("deleteOffer")}
            description={t("confirmOfferDelete")}
            okText={t("yes")}
            cancelText={t("no")}
          >
            <Button type="primary" danger onClick={handleDeleteOffer}>
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
              {!isEditingDescription && (
                <EditOutlined onClick={() => setIsEditingDescription(true)} />
              )}
            </div>
            {isEditingDescription ? (
              <div>
                <Input.TextArea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                />
                <Button onClick={handleSaveDescription}>{t("save")}</Button>
                <Button onClick={() => setIsEditingDescription(false)}>
                  {t("cancel")}
                </Button>
              </div>
            ) : (
              <Input.TextArea value={offer.description} disabled />
            )}
          </div>
          <div className="offer-field">
            <div className="label">
              {t("amenities")}
              {!isEditingAmenities && (
                <EditOutlined onClick={() => setIsEditingAmenities(true)} />
              )}
            </div>
            {isEditingAmenities ? (
              <div>
                <Select
                  mode="multiple"
                  value={editedAmenities}
                  onChange={setEditedAmenities}
                  options={[
                    { value: "toys", label: t("amenityTypes.toys") },
                    { value: "scratching post", label: t("amenityTypes.scratching post") },
                    { value: "cage", label: t("amenityTypes.cage") },
                  ]}
                />
                <Button onClick={handleSaveAmenities}>{t("save")}</Button>
                <Button onClick={() => setIsEditingAmenities(false)}>
                  {t("cancel")}
                </Button>
              </div>
            ) : (
              <div>{offer.animalAmenities.join(", ")}</div>
            )}
          </div>

          <div className="offer-field">
            <div className="label">
              {t("availability")}
              {!isEditingAvailability && (
                <EditOutlined onClick={() => setIsEditingAvailability(true)} />
              )}
            </div>
            {isEditingAvailability ? (
              <div>
                <Calendar
                  value={editedAvailability}
                  multiple
                  range
                  format="YYYY-MM-DD"
                  onChange={setEditedAvailability}
                  minDate={new Date()}
                />
                <Button onClick={handleSaveAvailability}>{t("save")}</Button>
                <Button onClick={() => setIsEditingAvailability(false)}>
                  {t("cancel")}
                </Button>
              </div>
            ) : (
              <div>
                <Calendar
                  value={offer.availabilities.map((date) => [
                    date.availableFrom,
                    date.availableTo,
                  ])}
                  multiple
                  range
                  readOnly
                />
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OfferCard;

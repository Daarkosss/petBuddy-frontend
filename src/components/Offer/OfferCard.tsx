import React, { useState } from "react";
import { Button, Card, Modal, Input, Select, Popconfirm, Collapse, Space } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { EditOfferDescription, OfferConfigurationWithId, OfferDTOWithId } from "../../types";
import { t } from "i18next";
import Meta from "antd/es/card/Meta";
import { Calendar, DateObject, Value } from "react-multi-date-picker";
import { api } from "../../api/api";
import { toast } from "react-toastify";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import OfferConfigurations from "./OfferConfigurations";

type OfferCardProps = {
  offer: OfferDTOWithId;
  handleUpdateOffer: (newOffer: OfferDTOWithId) => void;
  updateOffers: () => void;
};

const OfferCard: React.FC<OfferCardProps> = ({ offer, handleUpdateOffer, updateOffers }) => {
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

  const handleStartEditingDescription = () => {
    setIsEditingDescription(true);
    setEditedDescription(offer.description);
  }

  const handleSaveDescription = async () => {
    try {
      const offerWithDescription: EditOfferDescription = { 
        animal: offer.animal,
        description: editedDescription
      };
      await api.addOrEditOffer(offerWithDescription);
      toast.success(t("success.editOffer"));
      updateOffers();
    } catch (error) {
      toast.error(t("error.editOffer"));
    } finally {
      setIsEditingDescription(false);
    }
  };

  const handleStartEditingAmenities = () => {
    setIsEditingAmenities(true);
    setEditedAmenities(offer.animalAmenities);
  }

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

  const handleStartEditingAvailability = () => {
    setIsEditingAvailability(true);
    setEditedAvailability(offer.availabilities.map((availability) => [
      availability.availableFrom,
      availability.availableTo || availability.availableFrom,
    ]))
  };

  const handleSaveAvailability = async () => {
    try {
      const availabilities = editedAvailability.map((dateRange) => ({
        availableFrom: dateRange[0]?.toString() || "",
        availableTo: dateRange[1] 
        ? dateRange[1]?.toString()
        : dateRange[0]?.toString() || "",
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
        style={{ width: 400 }}
        className="offer-card"
        cover={
          <img
            src={`/images/${offer.animal.animalType.toLowerCase()}-card.jpg`}
            alt={offer.animal.animalType}
          />
        }
        actions={[
          <Button type="primary" className="submit-button" onClick={() => setIsModalOpen(true)}>
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

      <Modal
        title={
          <div className="offer-modal-title">
            {t(`yourOffers.${offer.animal.animalType.toLowerCase()}`)}
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={900}
        className="offer-modal"
      >
        <div className="offer-modal">
          <div className="offer-field">
            <div className="label">
              {t("description")}
              {!isEditingDescription && (
                <EditOutlined onClick={handleStartEditingDescription} />
              )}
            </div>
            {isEditingDescription ? (
              <div className="value">
                <Input.TextArea
                  value={editedDescription}
                  autoSize={{ minRows: 2, maxRows: 4 }}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  style={{ maxWidth: 700 }}
                />
                <Space>
                  <Button type="primary" className="submit-button" onClick={handleSaveDescription}>
                    {t("save")}
                  </Button>
                  <Button onClick={() => setIsEditingDescription(false)}>
                    {t("cancel")}
                  </Button>
                </Space>
              </div>
            ) : (
              <Input.TextArea 
                value={offer.description} 
                autoSize={{ minRows: 2, maxRows: 4 }} 
                disabled
                style={{ maxWidth: 700 }}
              />
            )}
          </div>
          <div className="offer-field">
            <div className="label">
              {t("amenities")}
              {!isEditingAmenities && (
                <EditOutlined onClick={handleStartEditingAmenities} />
              )}
            </div>
            {isEditingAmenities ? (
              <div className="value">
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
                <Space>
                  <Button type="primary" className="submit-button" onClick={handleSaveAmenities}>
                    {t("save")}
                  </Button>
                  <Button onClick={() => setIsEditingAmenities(false)}>
                    {t("cancel")}
                  </Button>
                </Space>
              </div>
            ) : (
              <div>{offer.animalAmenities.map((value) => t(`amenityTypes.${value}`)).join(", ")}</div>
            )}
          </div>

          <div className="offer-field">
            <div className="label">
              {t("availability")}
              {!isEditingAvailability && (
                <EditOutlined onClick={handleStartEditingAvailability} />
              )}
            </div>
            {isEditingAvailability ? (
              <div className="value">
                <Calendar
                  value={editedAvailability}
                  multiple
                  range
                  format="YYYY-MM-DD"
                  onChange={setEditedAvailability}
                  minDate={new DateObject().add(1, "days")} // Tomorrow
                  plugins={[
                    <DatePanel style={{ width: 200 }} header={t("selectedDates")} />]}
                />
                <Space>
                  <Button type="primary" className="submit-button" onClick={handleSaveAvailability}>
                    {t("save")}
                  </Button>
                  <Button onClick={() => setIsEditingAvailability(false)}>
                    {t("cancel")}
                  </Button>
                </Space>
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
                  format="YYYY-MM-DD"
                  minDate={new DateObject().add(1, "days")} // Tomorrow
                  plugins={[
                    <DatePanel style={{ width: 200 }} header={t("selectedDates")} />]}         
                />
              </div>
            )}
          </div>
          <Collapse>
            <Collapse.Panel header={t("offerConfigurations")} key="panel">
              <OfferConfigurations
                offerId={offer.id}
                configurations={offer.offerConfigurations}
                handleUpdateOffer={handleUpdateOffer}
                handleUpdateConfiguration={handleUpdateConfiguration}
              />
            </Collapse.Panel>
          </Collapse>
        </div>
      </Modal>
    </div>
  );
};

export default OfferCard;

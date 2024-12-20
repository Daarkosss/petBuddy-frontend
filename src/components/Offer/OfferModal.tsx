import React, { useState } from "react";
import { Modal, Collapse, Input, Space, Button, Select } from "antd";
import {
  EditOfferDescription,
  OfferConfigurationWithId,
  OfferWithId,
} from "../../types";
import { t } from "i18next";
import OfferConfigurations from "./OfferConfigurations";
import { toast } from "react-toastify";
import { api } from "../../api/api";
import { EditOutlined } from "@ant-design/icons";
import MultiCalendar from "../Calendar/MultiCalendar";
import store from "../../store/RootStore";

type OfferModalProps = {
  offer: OfferWithId;
  canBeEdited?: boolean;
  handleUpdateOffer: (updatedOffer: OfferWithId, isDeleted?: boolean) => void;
  handleUpdateConfiguration: (
    updatedConfiguration: OfferConfigurationWithId
  ) => void;
  isModalOpen: boolean;
  closeModal: () => void;
  isBlocked?: boolean;
};

const OfferModal: React.FC<OfferModalProps> = ({
  offer,
  handleUpdateOffer,
  handleUpdateConfiguration,
  isModalOpen,
  closeModal,
  canBeEdited = true,
  isBlocked = false,
}) => {
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingAmenities, setIsEditingAmenities] = useState(false);
  const [isEditingAvailability, setIsEditingAvailability] = useState(false);

  const [editedDescription, setEditedDescription] = useState(offer.description);
  const [editedAmenities, setEditedAmenities] = useState(offer.animalAmenities);
  const [editedAvailability, setEditedAvailability] = useState(
    offer.availabilities
  );

  const handleStartEditingDescription = () => {
    setIsEditingDescription(true);
    setEditedDescription(offer.description);
  };

  const handleSaveDescription = async () => {
    try {
      const offerWithDescription: EditOfferDescription = {
        animal: offer.animal,
        description: editedDescription,
      };
      const updatedOffer = await api.addOrEditOffer(offerWithDescription);
      if (updatedOffer) {
        handleUpdateOffer(updatedOffer);
      }
      toast.success(t("success.editOffer"));
    } catch (error) {
      toast.error(t("error.editOffer"));
    } finally {
      setIsEditingDescription(false);
    }
  };

  const handleStartEditingAmenities = () => {
    setIsEditingAmenities(true);
    setEditedAmenities(offer.animalAmenities);
  };

  const handleSaveAmenities = async () => {
    try {
      const updatedOffer = await api.setAmenitiesForOffer(
        offer.id,
        editedAmenities
      );
      if (updatedOffer) {
        handleUpdateOffer(updatedOffer);
      }
      toast.success(t("success.editOffer"));
    } catch (error) {
      toast.error(t("error.editOffer"));
    } finally {
      setIsEditingAmenities(false);
    }
  };

  const handleStartEditingAvailability = () => {
    setIsEditingAvailability(true);
    setEditedAvailability(offer.availabilities);
  };

  const handleSaveAvailability = async () => {
    try {
      const updatedOffer = await api.setAvailabilityForOffer(
        offer.id,
        editedAvailability
      );
      if (updatedOffer) {
        handleUpdateOffer(updatedOffer);
      }
      toast.success(t("success.editOffer"));
    } catch (error) {
      toast.error(t("error.editOffer"));
    } finally {
      setIsEditingAvailability(false);
    }
  };

  return (
    <Modal
      title={
        <div className="offer-modal-title">
          {canBeEdited
            ? t(`yourOffers.${offer.animal.animalType}`)
            : t(`caretakerOffers.${offer.animal.animalType}`)}
        </div>
      }
      open={isModalOpen}
      onCancel={closeModal}
      footer={null}
      width={1000}
      className="offer-modal"
    >
      <div className="offer-modal">
        <div className="offer-field">
          <div className="label">
            {t("description")}
            {!isEditingDescription && canBeEdited && (
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
                <Button
                  type="primary"
                  className="submit-button"
                  onClick={handleSaveDescription}
                >
                  {t("save")}
                </Button>
                <Button onClick={() => setIsEditingDescription(false)}>
                  {t("cancel")}
                </Button>
              </Space>
            </div>
          ) : (
            offer.description
          )}
        </div>
        <div className="offer-field">
          <div className="label">
            {t("amenities")}
            {!isEditingAmenities && canBeEdited && (
              <EditOutlined onClick={handleStartEditingAmenities} />
            )}
          </div>
          {isEditingAmenities ? (
            <div className="value">
              <Select
                mode="multiple"
                style={{ maxWidth: 500 }}
                showSearch={false}
                value={editedAmenities}
                onChange={setEditedAmenities}
                notFoundContent={t("noData")}
                options={store.animal
                  .getAmenities(offer.animal.animalType)
                  .map((amenity) => ({
                    value: amenity,
                    label: t(`amenityTypes.${amenity}`),
                  }))}
              />
              <Space>
                <Button
                  type="primary"
                  className="submit-button"
                  onClick={handleSaveAmenities}
                >
                  {t("save")}
                </Button>
                <Button onClick={() => setIsEditingAmenities(false)}>
                  {t("cancel")}
                </Button>
              </Space>
            </div>
          ) : (
            <div>
              {offer.animalAmenities
                .map((value) => t(`amenityTypes.${value}`))
                .join(", ")}
            </div>
          )}
        </div>

        <div className="offer-field">
          <div className="label">
            {t("availability")}
            {!isEditingAvailability && canBeEdited && (
              <EditOutlined onClick={handleStartEditingAvailability} />
            )}
          </div>
          {isEditingAvailability ? (
            <div className="value">
              <MultiCalendar
                dateValue={editedAvailability}
                handleChange={setEditedAvailability}
              />
              <Space>
                <Button
                  type="primary"
                  className="submit-button"
                  onClick={handleSaveAvailability}
                >
                  {t("save")}
                </Button>
                <Button onClick={() => setIsEditingAvailability(false)}>
                  {t("cancel")}
                </Button>
              </Space>
            </div>
          ) : (
            <div>
              <MultiCalendar
                dateValue={offer.availabilities}
                readOnly
                showRemoveButton={canBeEdited && isEditingAvailability}
              />
            </div>
          )}
        </div>
        <Collapse
          items={[
            {
              key: "panel",
              label: t("offerConfigurations"),
              children: (
                <OfferConfigurations
                  offerId={offer.id}
                  animalType={offer.animal.animalType}
                  configurations={offer.offerConfigurations}
                  handleUpdateOffer={handleUpdateOffer}
                  handleUpdateConfiguration={handleUpdateConfiguration}
                  canBeEdited={canBeEdited}
                  availabilities={offer.availabilities}
                  isBlocked={isBlocked}
                />
              ),
            },
          ]}
        />
      </div>
    </Modal>
  );
};

export default OfferModal;

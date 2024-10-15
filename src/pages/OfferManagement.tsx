import React, { useEffect, useState } from "react";
import { Button, Modal } from "antd";
import { OfferDTOWithId, OfferConfigurationWithId } from "../types";
import OfferForm from "../components/Offer/CreateOfferForm";
import { api } from "../api/api";
import { toast } from "react-toastify";
import store from "../store/RootStore";
import ConfigurationForm from "../components/Offer/OfferConfigurationForm";
import { t } from "i18next";
import OfferManagementTable from "../components/Offer/OfferManagementTable";

const OfferManagement: React.FC = () => {
  const [offers, setOffers] = useState<OfferDTOWithId[]>([]);
  const [editingOffer, setEditingOffer] = useState<OfferDTOWithId | null>(null);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<OfferConfigurationWithId | null>(null);
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
      toast.error(t("error.loadOffers"));
    }
  };

  const handleAddOffer = () => {
    setEditingOffer(null);
    setIsOfferModalOpen(true);
  };

  const handleSuccessfulOfferSave = () => {
    setIsOfferModalOpen(false);
    loadOffers();
  };

  const handleSaveConfiguration = async (newConfig: OfferConfigurationWithId) => {
    if (newConfig.id) {
      try {
        await api.editOfferConfiguration(newConfig.id, newConfig);
        toast.success(t("success.editConfiguration"));
        setIsConfigModalOpen(false);
        loadOffers();
      } catch (error) {
        toast.error(t("error.editConfiguration"));
      }
    } else {
      try {
        await api.addOfferConfiguration(editingOffer!.id, newConfig);
        toast.success(t("success.addConfiguration"));
        setIsConfigModalOpen(false);
        loadOffers();
      } catch (error) {
        toast.error(t("error.addConfiguration"));
      }
    }
    setEditingConfig(null);
  };

  return (
    <div className="offer-management-page">
      <Button type="primary" onClick={handleAddOffer} className="add-offer-button">
        {t("addOffer")}
      </Button>
      <OfferManagementTable
        offers={offers}
        setOffers={setOffers}
        setIsOfferModalOpen={setIsOfferModalOpen}
        setIsConfigModalOpen={setIsConfigModalOpen}
        setEditingOffer={setEditingOffer}
        setEditingConfig={setEditingConfig}
      />
      <Modal
        title={editingOffer ? t("editOffer") : t("addOffer")}
        open={isOfferModalOpen}
        onCancel={() => setIsOfferModalOpen(false)}
        footer={null}
        maskClosable={false}
      >
        <OfferForm offer={editingOffer!} onSuccess={handleSuccessfulOfferSave} />
      </Modal>

      <Modal
        title={editingConfig ? t("editConfiguration") : t("addConfiguration")}
        open={isConfigModalOpen}
        onCancel={() => setIsConfigModalOpen(false)}
        footer={null}
        maskClosable={false}
      >
        <ConfigurationForm
          initialValues={editingConfig}
          onSuccess={handleSaveConfiguration}
        />
      </Modal>
    </div>
  );
};

export default OfferManagement;

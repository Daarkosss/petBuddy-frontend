import { useTranslation } from "react-i18next";
import { OfferWithId } from "../../types";
import MultiCalendar from "../Calendar/MultiCalendar";
import { Alert, Button, Form, Modal, Select } from "antd";
import { api } from "../../api/api";
import { toast } from "react-toastify";
import { useEffect } from "react";

interface SetAvailabilityFormProps {
  availableOffers: OfferWithId[]
  handleUpdateOffers: (updatedOffers: OfferWithId[]) => void;
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void
}

const SetAvailabilityModal: React.FC<SetAvailabilityFormProps> = ({
  availableOffers, handleUpdateOffers, isModalOpen, setIsModalOpen
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  useEffect(() => {
    if (isModalOpen) {
      form.resetFields();
    }
  }, [isModalOpen, form]);
  
  const handleFinish = async () => {
    try {
      const values = await form.validateFields();
      const updatedOffers = await api.setAvailabilityForOffers(values.offerIds, values.availabilities);
      if (updatedOffers) {
        handleUpdateOffers(updatedOffers);
      }
      toast.success(t("success.setAvailabilityForOffers"));
      setIsModalOpen(false);
    } catch (error) {
      toast.error(t("error.setAvailabilityForOffers"));
    }
  }

  return (
    <Modal
      title={
        <div className="offer-modal-title">
          {t("setAvailabilityForOffers")}
        </div>
      }
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={null}
      maskClosable={false}
      width={"max-content"}
      forceRender
    >
      <Form form={form} className="set-availability-form" layout="vertical" onFinish={handleFinish}>
        <Alert
          message={t("availabilityAlert")}
          type="info"
        />
        <Form.Item
          name={["offerIds"]}
          label={t("animalTypes")}
          rules={[{ required: true, message: t("validation.required") }]}
        >
          <Select
            placeholder={t("caretakerSearch.animalTypes")}
            mode="multiple"
            options={availableOffers.map(
              (offer) => ({ value: offer.id, label: t(offer.animal.animalType.toLowerCase()) })
            )}
          />
        </Form.Item>
        <Form.Item
          name="availabilities"
          label={t("availability")}
        >
          <MultiCalendar 
            dateValue={form.getFieldValue("availabilities")}
            handleChange={(availabilities) => form.setFieldValue("availabilities", availabilities)}
          />
        </Form.Item>
        <Button type="primary" htmlType="submit" className="submit-button">
          {t("save")}
        </Button>
      </Form>
    </Modal>
  )
};

export default SetAvailabilityModal;
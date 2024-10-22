import { useTranslation } from "react-i18next";
import { OfferDTOWithId } from "../../types";
import MultiCalendar from "../Calendar/MultiCalendar";
import { Alert, Button, Form, Select } from "antd";
import { api } from "../../api/api";
import { toast } from "react-toastify";
import { Value } from "react-multi-date-picker";

interface SetAvailabilityFormProps {
  availableOffers: OfferDTOWithId[]
  handleUpdateOffers: (updatedOffers: OfferDTOWithId[]) => void;
  onSuccess: () => void;
}

const SetAvailabilityForm: React.FC<SetAvailabilityFormProps> = ({availableOffers, handleUpdateOffers, onSuccess}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const handleFinish = async () => {
    try {
      const values = await form.validateFields();
      const availabilityRanges = values.availability.map((dateRange: Value[]) => ({
        availableFrom: dateRange[0]?.toString() || "",
        availableTo: dateRange[1] 
        ? dateRange[1]?.toString()
        : dateRange[0]?.toString() || "",
      }));
      const updatedOffers = await api.setAvailabilityForOffers(values.offerIds, availabilityRanges);
      if (updatedOffers) {
        handleUpdateOffers(updatedOffers);
      }
      toast.success(t("success.setAvailabilityForOffers"));
      onSuccess();
    } catch (error) {
      toast.error(t("error.setAvailabilityForOffers"));
    } finally {
      form.resetFields();
    }
  }

  return (
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
        name="availability"
        label={t("availability")}
        initialValue={[]}
      >
        <MultiCalendar 
          dateValue={form.getFieldValue("availability")}
          handleChange={(availability) => form.setFieldValue("availability", availability)}
        />
      </Form.Item>
      <Button type="primary" htmlType="submit" className="submit-button">
        {t("save")}
      </Button>
    </Form>
  )
};

export default SetAvailabilityForm;
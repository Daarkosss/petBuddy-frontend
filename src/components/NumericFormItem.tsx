import { Form, Input } from "antd";
import { KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";

interface NumberInputProps {
  name: string;
  label: string | number | (string | number)[];
  initialValue?: number;
  disabled?: boolean;
  placeholder?: string;
}

const NumericFormItem: React.FC<NumberInputProps> = ({name, label, initialValue, disabled=false, placeholder}) => {
  const minNumber = 0.01;
  const maxNumber = 99999.99;

  const { t } = useTranslation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;    
    const regex = /^\d/;
    const allowedKeys = ["Backspace", "Delete", "," ,"."];
    if (!regex.test(value) && !allowedKeys.includes(e.target.value)) {
      e.preventDefault();
    }

    if (value && +value > maxNumber) {
      e.target.value = maxNumber.toString();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const value = e.key;
    const regex = /^\d/;

    const allowedKeys = ["Backspace", "Delete", ","];
    if (!regex.test(value) && !allowedKeys.includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <Form.Item
      name={name}
      label={label}
      style={{ width: 185 }}
      rules={[
        { required: true, message: t("validation.required") },
        { pattern: /^\d{0,5}(\.\d{0,2})?$/, message: t("validation.price") }
      ]}
      initialValue={initialValue}
    >
      <Input
        type="number"
        placeholder={placeholder}
        disabled={disabled}
        min={minNumber}
        max={maxNumber}
        step={0.01}
        onInput={handleInputChange}
        onKeyDown={handleKeyDown}
      />
    </Form.Item>
  );
};

export default NumericFormItem;

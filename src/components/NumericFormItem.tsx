import { Form, Input } from "antd";
import { KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";

interface NumberInputProps {
  name: string;
  label?: string | number | (string | number)[];
  initialValue?: number;
  disabled?: boolean;
  placeholder?: string;
  width?: number
}

const NumericFormItem: React.FC<NumberInputProps> = ({
  name, label, initialValue, disabled=false, placeholder, width=185
}) => {
  const minNumber = 0.01;
  const maxNumber = 99999.99;

  const { t } = useTranslation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;    

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
      style={{ width }}
      rules={[
        { required: true, message: t("validation.required") },
        { pattern: /^(?!0$)(0(\.\d{1,2})?|[1-9]\d{0,4}(\.\d{1,2})?)$/, message: t("validation.price") }
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

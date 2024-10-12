import { Select } from "antd";

export const renderSelectOptions = (options: Record<string, string>) => (
  Object.entries(options).map(([value, label]) => (
    <Select.Option key={value} value={value}>
      {label}
    </Select.Option>
  ))
);
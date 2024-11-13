import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Card, Statistic } from "antd";

interface StatisticCardProps {
  titlePositive: string,
  titleNegative: string,
  value: number,
  isPositive: boolean,
}

const StatisticCard: React.FC<StatisticCardProps> = ({ titlePositive, titleNegative, value, isPositive }) => {
  return (
    <Card style={{ width: "max-content" }} size="small">
      <Statistic
        title={isPositive ? titlePositive : titleNegative}
        value={value.toFixed(2)}
        precision={2}
        decimalSeparator=","
        groupSeparator="."
        valueStyle={{ color: isPositive ? "green" : "red" }}
        prefix={isPositive ? <ArrowUpOutlined/> : <ArrowDownOutlined/>}
        suffix="zł"
      />
    </Card>
  )
};

export default StatisticCard;
import React from "react";
import "../scss/components/_roundedLine.scss";

interface LineProperties {
  width: string;
  height: string;
  backgroundColor: string;
}

const RoundedLine: React.FC<LineProperties> = ({
  width,
  height,
  backgroundColor,
}) => {
  return (
    <div
      className="container"
      style={{ width: width, height: height, background: backgroundColor }}
    ></div>
  );
};

export default RoundedLine;

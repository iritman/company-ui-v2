import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "antd";

const LinkButton = ({ size, type, title, link }) => {
  const location_info = useLocation();

  const getLink = () => `${location_info.pathname}/${link}`;

  return (
    <Button size={size || "small"} type={type || "primary"}>
      <Link to={getLink()}>{title}</Link>
    </Button>
  );
};

export default LinkButton;

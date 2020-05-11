import React, { FC, useEffect, useState } from "react";
import { Icon } from "./TrendIndicator.styled";

const SHOW_ICON_FOR_X_MS = 5000;

export interface Props {
  value: number;
}

const TrendIndicator: FC<Props> = (props) => {
  const { value } = props;
  const [isHidden, setIsHidden] = useState(true);

  useEffect(() => {
    setIsHidden(false);

    const timeoutId = setTimeout(() => setIsHidden(true), SHOW_ICON_FOR_X_MS);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [value]);

  const icon = isHidden
    ? ""
    : value > 0
    ? "arrow_upward"
    : value < 0
    ? "arrow_downward"
    : "";

  return <Icon className="material-icons">{icon}</Icon>;
};

export default TrendIndicator;

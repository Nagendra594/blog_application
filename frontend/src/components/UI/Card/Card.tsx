import React from "react";
import styles from "./Card.module.css";
interface CardProp{
  children:React.ReactNode
}
const Card:React.FC<CardProp> = ({ children }) => {
  return <div className={styles.card}>{children}</div>;
};

export default Card;

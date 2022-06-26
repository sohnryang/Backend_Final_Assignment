import React from "react";

import "./card.css";

type CardProps = {
  id: number;
  label: string;
  term: string | null;
  imageUrl: string | null;
  editEnabled: boolean;
  editCard?: (id: number) => void;
  removeCard?: (id: number) => void;
};

export function Card(props: CardProps) {
  return (
    <div className="card">
      {props.term != undefined ? (
        <p style={{ fontWeight: "bold" }}>{props.term}</p>
      ) : (
        <img className="cardImage" src={props.imageUrl!} />
      )}
      <p>{props.label}</p>
      {props.editEnabled && (
        <div>
          <button onClick={() => props.editCard!(props.id)}>편집</button>
          <button onClick={() => props.removeCard!(props.id)}>삭제</button>
        </div>
      )}
    </div>
  );
}

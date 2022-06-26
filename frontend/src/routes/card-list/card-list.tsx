import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import client from "../../api-client";
import { Card } from "../../components/Card";
import { Card as CardEntity } from "../../entities/card";

import "./card-list.css";

export default function CardList() {
  const [cards, setCards] = useState<CardEntity[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchCards() {
      const res = await client.get<CardEntity[]>("/cards");
      setCards(res.data);
    }
    fetchCards();
  }, []);

  const removeCard = async (id: number) => {
    const newCards = cards.filter((card) => card.id != id);
    setCards(newCards);
    await client.delete(`/cards/${id}`);
  };

  const editCard = (id: number) => {
    navigate(`../edit-card/${id}`, { replace: true });
  };

  return (
    <>
      <main>
        <h2>카드 리스트</h2>
        <div className="cardContainer">
          {cards.length > 0 ? (
            cards.map((card) => (
              <Card
                key={card.id}
                id={card.id}
                label={card.label}
                term={card.term}
                imageUrl={`/images/${card.image?.id}`}
                editEnabled={true}
                editCard={editCard}
                removeCard={removeCard}
                hideLabel={false}
              />
            ))
          ) : (
            <p>카드가 없습니다.</p>
          )}
        </div>
      </main>
      <nav>
        <Link to="/new-card">카드 추가</Link>
        <br />
        {cards.length > 0 && (
          <>
            <Link to="/learn">학습 시작</Link>
            <br />
          </>
        )}
        <br />
        <Link to="/">Home</Link>
      </nav>
    </>
  );
}

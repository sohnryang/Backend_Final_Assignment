import { Card } from "../components/Card";
import React from "react";
import { Link } from "react-router-dom";
import "./card-list.css";
import client from "../api-client";
import { Card as CardEntity } from "../entities/card";

export default function CardList() {
  const [cards, setCards] = React.useState<CardEntity[]>([]);
  React.useEffect(() => {
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
    console.log(`Edit card ${id}`);
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
                imageUrl={`${process.env.API_SERVER}/images/${card.image?.id}`}
                editEnabled={true}
                editCard={editCard}
                removeCard={removeCard}
              />
            ))
          ) : (
            <p>카드가 없습니다.</p>
          )}
        </div>
      </main>
      <nav>
        <Link to="/create-card">카드 추가</Link>
        <br />
        <Link to="/learn">학습 시작</Link>
        <br />
        <br />
        <Link to="/">Home</Link>
      </nav>
    </>
  );
}

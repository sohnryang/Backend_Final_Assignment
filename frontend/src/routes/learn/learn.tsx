import client from "../../api-client";
import React, { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card as CardEntity } from "../../entities/card";
import { Card } from "../../components/Card";

export default function Learn() {
  const [learningPass, setLearningPass] = useState(1);
  const [cardbox, setCardbox] = useState<CardEntity[][]>([]);
  const [currentCard, setCurrentCard] = useState<CardEntity>();
  const [answer, setAnswer] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCards() {
      const res = await client.get<CardEntity[]>("/cards");
      const cards = res.data;
      const last = cards.pop();
      setCardbox([cards, [], [], [], [], []]);
      setCurrentCard(last);
    }
    fetchCards();
  }, []);

  const handleAnswerChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.value);
  };
  const handleSubmitButton = () => {
    if (answer.length == 0) return;
    const newCardbox = cardbox;
    if (answer == currentCard?.label.trim()) {
      alert("맞았습니다!!!");
      newCardbox[learningPass].push(currentCard!);
    } else {
      alert("틀렸습니다");
      newCardbox[0].splice(0, 0, currentCard!);
    }
    let newLearningPass = learningPass;
    if (newCardbox[learningPass - 1].length == 0) {
      newLearningPass = newCardbox.map((ls) => ls.length > 0).indexOf(true) + 1;
      if (newLearningPass == 6) {
        alert("모든 카드를 학습하셨습니다!");
        navigate("/card-list", { replace: true });
      }
      setLearningPass(newLearningPass);
    }
    setCurrentCard(newCardbox[newLearningPass - 1].pop());
    setCardbox(newCardbox);
    setAnswer("");
  };
  const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key != "Enter") return;
    handleSubmitButton();
    return false;
  };
  const handleCancelButton = () => {
    if (!confirm("진행 상황은 저장되지 않습니다. 계속하시겠습니까?")) return;
    navigate("/card-list", { replace: true });
  };

  return (
    <main>
      <h2>{`학습 (${learningPass}단계)`}</h2>
      {currentCard != undefined && (
        <Card
          id={currentCard!.id}
          label={currentCard!.label}
          term={currentCard!.term}
          imageUrl={`${process.env.API_SERVER}/images/${
            currentCard!.image?.id
          }`}
          editEnabled={false}
          hideLabel={true}
        />
      )}
      <form
        className="learningForm"
        onKeyDown={(e: KeyboardEvent<HTMLFormElement>) => e.key != "Enter"}
        onSubmit={(e: any) => {
          e.preventDefault();
        }}
      >
        <div className="learningForm">
          <label htmlFor="answer">정답 입력</label>
          <input
            type="text"
            name="answer"
            onKeyUp={handleKeyUp}
            value={answer}
            onChange={handleAnswerChange}
          />
          <button type="button" onClick={handleSubmitButton}>
            제출
          </button>
        </div>
      </form>
      <button onClick={handleCancelButton}>학습 종료</button>
    </main>
  );
}

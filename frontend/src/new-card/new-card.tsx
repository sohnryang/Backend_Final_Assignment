import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CardsPostRequest } from "request-types/cards";

import client from "../api-client";
import { Card } from "../entities/card";
import { Image } from "../entities/image";

import "./new-card.css";

export default function NewCard() {
  const { editedCardId } = useParams();
  const [cardType, setCardType] = useState("text");
  const [uploaded, setUploaded] = useState(false);
  const [currentImage, setCurrentImage] = useState<Image | null>(null);
  const [term, setTerm] = useState<string>("");
  const [label, setLabel] = useState("");
  const navigate = useNavigate();

  if (editedCardId != undefined) {
    useEffect(() => {
      async function populateData() {
        const res = await client.get<Card>(`/cards/${editedCardId}`);
        const card = res.data;
        setLabel(card.label);
        if (card.term != null) {
          setCardType("text");
          setTerm(card.term);
        } else {
          setCardType("image");
          setCurrentImage(card.image);
        }
      }
      populateData();
    }, []);
  }

  const cleanupCurrentImage = async () => {
    if (currentImage != null) await client.delete(`/images/${currentImage.id}`);
    setCurrentImage(null);
  };

  const handleRadioButton = (e: any) => {
    setUploaded(false);
    cleanupCurrentImage();
    setCardType(e.target.value);
  };

  const handleTermChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTerm(e.target.value);
  };

  const handleLabelChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLabel(e.target.value);
  };

  const labelRef = useRef<HTMLInputElement>(null);
  const termRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  const handleImageChange = () => {
    setUploaded(false);
  };
  const handleImageUpload = async () => {
    const fileList = imageRef.current?.files;
    if (fileList == undefined) return;
    if (fileList.length == 0) {
      alert("이미지 파일을 선택하세요.");
      return;
    }
    if (fileList.length > 1) {
      alert("이미지 파일을 한개만 선택하세요.");
      return;
    }
    const file = fileList[0];
    const formData = new FormData();
    formData.append("image", file);
    const res = await client.post<Image>("/images", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    cleanupCurrentImage();
    setCurrentImage(res.data);
    setUploaded(true);
  };

  const handleCreateCardButton = async () => {
    if (labelRef.current?.value.length == 0) {
      alert("레이블을 입력하세요.");
      return;
    }
    const reqBody: CardsPostRequest = {
      label: labelRef.current!.value,
      term: null,
      imageId: null,
    };
    if (cardType == "text") {
      if (termRef.current!.value.length == 0) {
        alert("단어를 입력하세요.");
        return;
      }
      reqBody.term = termRef.current!.value;
    } else {
      if (!uploaded) {
        alert("이미지를 업로드하세요.");
        return;
      }
      reqBody.imageId = currentImage!.id;
    }
    if (editedCardId == undefined) await client.post("/cards", reqBody);
    else await client.put(`/cards/${editedCardId}`, reqBody);
    navigate("/card-list", { replace: true });
  };

  return (
    <main>
      <h2>{editedCardId != undefined ? "카드 편집" : "새로운 카드 추가"}</h2>
      <form className="newCardForm">
        <div className="newCardForm">
          <label>
            <input
              type="radio"
              value="text"
              checked={cardType == "text"}
              onClick={handleRadioButton}
              readOnly
            />
            텍스트 카드
          </label>
          <label>
            <input
              type="radio"
              value="image"
              checked={cardType == "image"}
              onClick={handleRadioButton}
              readOnly
            />
            이미지 카드
          </label>
        </div>
        {cardType == "text" ? (
          <div className="newCardForm">
            <label htmlFor="term">단어</label>
            <input
              type="text"
              name="term"
              ref={termRef}
              value={term}
              onChange={handleTermChange}
            />
          </div>
        ) : (
          <div className="newCardForm">
            <label htmlFor="image">이미지</label>
            <input
              type="file"
              name="image"
              onChange={handleImageChange}
              ref={imageRef}
            />
            <button
              type="button"
              onClick={handleImageUpload}
              disabled={uploaded}
            >
              이미지 업로드{uploaded && "됨"}
            </button>
          </div>
        )}
        <div className="newCardForm">
          <label htmlFor="label">레이블</label>
          <input
            type="text"
            name="label"
            ref={labelRef}
            value={label}
            onChange={handleLabelChange}
          />
        </div>
        <button type="button" onClick={handleCreateCardButton}>
          {editedCardId != undefined ? "카드 편집" : "카드 생성"}
        </button>
        <button type="button" onClick={() => navigate("/card-list")}>
          취소
        </button>
      </form>
    </main>
  );
}

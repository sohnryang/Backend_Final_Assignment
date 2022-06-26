import React from "react";
import { Link, Route, Routes } from "react-router-dom";

function Home() {
  return (
    <>
      <main>
        <h2>Home</h2>
        <p>PoApper 백엔드 파이널 어싸인</p>
      </main>
      <nav>
        <Link to="/about">About</Link>
      </nav>
    </>
  );
}

function About() {
  return (
    <>
      <main>
        <h2>About</h2>
        <p>이 프로젝트는 동아리 PoApper의 sohnryang이 개발하였습니다.</p>
        <a href="https://github.com/sohnryang/Backend_Final_Assignment">
          GitHub 저장소
        </a>
      </main>
      <nav>
        <Link to="/">Home</Link>
      </nav>
    </>
  );
}

function App() {
  return (
    <div className="App">
      <h1>기억상자</h1>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}

export default App;

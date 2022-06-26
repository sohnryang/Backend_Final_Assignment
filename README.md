# Memory box
포애퍼 백엔드 세미나 파이널 어싸인

## Backend

### API Endpoints
백엔드는 크게 Card API, Image API를 제공.
- Card API: GET, POST, PUT, DELETE 모두 구현. 카드를 관리.
- Image API: GET, POST, DELETE만 구현. 이미지 카드의 이미지를 여기서 관리.

### Libraries & Tools
- TypeScript: 정적 타이핑을 통한 편안한 개발자 경험.
- Express.js: API 요청 처리.
- TypeORM: DB 관리를 위한 ORM.
- Cloudflare R2: 이미지 저장소 역할. AWS S3와 API 호환성이 보장되기 때문에 `multer-s3`로 무리 없이 이미지 업로드를 구현할 수 있었음. (베타이지만 저비용이라 가난한 학부생에게 매우 적합)
- Heroku: 서버 호스팅. (무료라 가난한 학부생에게 매우 적합)

## Frontend
- TypeScript, React.js를 사용하여 구현. (`frontend` 디렉토리에서 코드 확인 가능)
- Parcel을 사용하여 코드 빌드, 번들링.

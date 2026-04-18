# 🎓 Dərs Cədvəli İdarəetmə Sistemi

Universitetlər üçün tam funksional akademik cədvəl idarəetmə sistemi.

---

## 📁 Layihə Strukturu

```
academic-scheduling-system/
├── backend/                  # FastAPI (Python)
│   ├── app/
│   │   ├── api/routes/       # REST endpointlər
│   │   ├── models/           # SQLAlchemy modellər
│   │   ├── schemas/          # Pydantic sxemlər
│   │   ├── services/         # Conflict checker
│   │   ├── core/             # Config
│   │   └── db/               # Database bağlantısı
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/                 # Next.js 14 (TypeScript)
│   ├── src/
│   │   ├── app/              # Next.js App Router
│   │   ├── components/       # React komponentlər
│   │   ├── lib/              # API client
│   │   ├── store/            # Zustand store
│   │   └── types/            # TypeScript tiplər
│   └── Dockerfile
└── docker-compose.yml
```

---

## 🚀 Başlamaq

### Tələblər
- Docker & Docker Compose
- **YA DA** Node.js 20+ və Python 3.11+

---

### ▶️ Docker ilə (Tövsiyə olunan)

```bash
# Layihəni klonlayın
git clone <repo-url>
cd academic-scheduling-system

# Bütün xidmətləri başladın
docker-compose up --build
```

Açılacaq ünvanlar:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs (Swagger):** http://localhost:8000/docs

---

### ▶️ Manual Qurulum

#### Backend

```bash
cd backend

# Virtual environment yaradın
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Asılılıqları yükləyin
pip install -r requirements.txt

# .env faylını yaradın
cp .env.example .env
# .env faylını açıb DATABASE_URL-i öz PostgreSQL bağlantınıza uyğunlaşdırın

# Serveri başladın
uvicorn app.main:app --reload --port 8000
```

#### Frontend

```bash
cd frontend

# Asılılıqları yükləyin
npm install

# Development serveri başladın
npm run dev
```

---

## 🗄️ Verilənlər Bazası

PostgreSQL istifadə edilir. Cədvəllər ilk başlatmada **avtomatik yaradılır**.

Manual yaratmaq üçün:
```sql
CREATE DATABASE academic_scheduling;
```

---

## 🔌 API Endpointlər

| Resurs       | Endpointlər                              |
|--------------|------------------------------------------|
| Otaqlar      | `GET/POST /api/rooms/`                   |
| Müəllimlər   | `GET/POST /api/teachers/`                |
| Fənlər       | `GET/POST /api/subjects/`                |
| Qruplar      | `GET/POST /api/groups/`                  |
| Semetrlər    | `GET/POST /api/semesters/`               |
| Cədvəl       | `GET/POST /api/schedule/`                |
| Conflict yoxla | `POST /api/schedule/check-conflicts`   |

Tam sənədləşmə: http://localhost:8000/docs

---

## ⚙️ Conflict Yoxlama Növləri

| Növ                  | Təsvir                                         |
|----------------------|------------------------------------------------|
| `room_overlap`       | Eyni otaqda eyni saatda 2 dərs                 |
| `teacher_overlap`    | Müəllim eyni saatda 2 fərqli dərsdə            |
| `capacity_exceed`    | Qrup tələbə sayı otaq tutumundan çox           |
| `teacher_unavailable`| Müəllim həmin gün/saatda mövcud deyil          |

---

## 🛠️ Növbəti Addımlar

- [ ] İstifadəçi autentifikasiyası (JWT)
- [ ] Yarı-avtomatik cədvəl generatoru (backtracking)
- [ ] PDF ixracı
- [ ] Email bildirişləri
- [ ] Müəllim/tələbə görünüşü

---

## 📦 Texnologiya Yığımı

| Qat        | Texnologiya                              |
|------------|------------------------------------------|
| Frontend   | Next.js 14, TypeScript, Tailwind CSS     |
| Drag & Drop| @dnd-kit/core                            |
| State      | Zustand                                  |
| Backend    | FastAPI, SQLAlchemy, Pydantic v2         |
| Database   | PostgreSQL 16                            |
| Container  | Docker, Docker Compose                   |

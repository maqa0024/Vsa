from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/academic_scheduling"
    SECRET_KEY: str = "changeme"
    ENVIRONMENT: str = "development"

    class Config:
        env_file = ".env"

settings = Settings()

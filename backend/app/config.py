from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "AquaGuard Edge AI Backend"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    # Database
    DATABASE_URL: str = "sqlite:///./aquaguard.db"

    # CORS – comma-separated list of allowed origins
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000"

    # Edge model metadata
    EDGE_MODEL_VERSION: str = "v1.0"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()

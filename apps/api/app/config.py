from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    ANTHROPIC_API_KEY: str = ""
    DATABASE_URL: str = ""
    PORT: int = 8000

    # Email (SMTP)
    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USERNAME: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM_EMAIL: str = ""

    # Kakao Alimtalk (Solapi)
    SOLAPI_API_KEY: str = ""
    SOLAPI_API_SECRET: str = ""
    KAKAO_PF_ID: str = ""
    KAKAO_SENDER_NUMBER: str = ""

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()


def get_settings() -> Settings:
    return settings

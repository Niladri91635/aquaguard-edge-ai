from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.config import settings

# connect_args is SQLite-specific; remove for Postgres
engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False},
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Base(DeclarativeBase):
    pass


# ---------------------------------------------------------------------------
# Dependency – inject a DB session into route handlers
# ---------------------------------------------------------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    """Called once at application startup to ensure all tables exist."""
    from app import models  # noqa: F401 – import so tables are registered
    Base.metadata.create_all(bind=engine)

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings  # type: ignore
from database import init_db  # type: ignore
from routes import auth, profile, opportunities, network, posts  # type: ignore


@asynccontextmanager
async def lifespan(app: FastAPI):
    # on startup
    init_db()
    yield
    # on shutdown


# Initialize FastAPI app
app = FastAPI(title=settings.APP_NAME, version=settings.VERSION, lifespan=lifespan)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include routers
app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(opportunities.router)
app.include_router(network.router)
app.include_router(posts.router)


# Root endpoint
@app.get("/")
def root():
    return {"message": f"{settings.APP_NAME} - Phase 1", "version": settings.VERSION}

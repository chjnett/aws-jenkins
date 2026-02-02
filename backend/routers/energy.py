from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from db.client import supabase

router = APIRouter(
    prefix="/api/energy-trucks",
    tags=["energy-trucks"],
    responses={404: {"description": "Not found"}},
)

class Position(BaseModel):
    lat: float
    lng: float

class EnergyTruck(BaseModel):
    id: Optional[int] = None
    title: str
    content: str
    position: Position
    type: str  # 'hub', 'solar', 'wind', 'station'

@router.get("/", response_model=List[EnergyTruck])
async def get_energy_trucks():
    """
    Get all active energy trucks/stations.
    """
    try:
        response = supabase.table("energy_trucks").select("*").execute()
        # Transform data if necessary, or return directly if schema matches
        # For now, assuming the DB schema matches the frontend expectations reasonably well
        # If DB is empty, return sample data for visualization
        data = response.data
        if not data:
             return [
                {
                    "title": "제주시 에너지 허브 (Sample)",
                    "content": "<strong>제주시 에너지 허브</strong><br/>판매: 50kWh<br/>가격: 120원/kWh",
                    "position": {"lat": 33.4996, "lng": 126.5312},
                    "type": "hub"
                },
                {
                    "title": "서귀포 태양광 발전소 (Sample)",
                    "content": "<strong>서귀포 태양광</strong><br/>판매: 120kWh<br/>가격: 110원/kWh",
                    "position": {"lat": 33.2541, "lng": 126.5601},
                    "type": "solar"
                }
            ]
        return data
    except Exception as e:
        print(f"Error fetching energy trucks: {e}")
        # Fallback to sample data if DB connection fails or table doesn't exist yet
        return [
             {
                "title": "제주시 에너지 허브 (Fallback)",
                "content": "<strong>제주시 에너지 허브</strong><br/>판매: 50kWh<br/>가격: 120원/kWh",
                "position": {"lat": 33.4996, "lng": 126.5312},
                "type": "hub"
            }
        ]

@router.post("/")
async def create_energy_truck(truck: EnergyTruck):
    """
    Register a new energy truck/station transaction.
    """
    try:
        data = truck.model_dump(exclude={"id"})
        # Flatten position for DB storage if needed, or keep as JSONB
        # For simplicity, assuming DB has 'position' as JSONB
        response = supabase.table("energy_trucks").insert(data).execute()
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

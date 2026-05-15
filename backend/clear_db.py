import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

url = "mongodb+srv://sanjaynathiya81_db_user:VCa5z9XToczqVLZ0@financemanager.aiwlobj.mongodb.net/?appName=FinanceManager"

async def clear_db():
    print("Connecting to DB...")
    client = AsyncIOMotorClient(url)
    db = client["freshsave"]
    
    print("Dropping 'users' collection...")
    await db.users.drop()
    
    print("Dropping 'shops' collection...")
    await db.shops.drop()
    
    print("Dropping 'products' collection...")
    await db.products.drop()
    
    print("Database completely cleared! You can now start fresh.")
    
asyncio.run(clear_db())

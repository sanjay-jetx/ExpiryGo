import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def test():
    url = "mongodb+srv://sanjaynathiya81_db_user:VCa5z9XToczqVLZ0@financemanager.aiwlobj.mongodb.net/?appName=FinanceManager"
    print(f"Connecting to: {url.split('@')[-1]}")
    c = AsyncIOMotorClient(url, serverSelectionTimeoutMS=10000)
    db = c["freshsave"]
    try:
        info = await c.server_info()
        print(f"CONNECTED to MongoDB {info['version']}")
        cols = await db.list_collection_names()
        print(f"Collections: {cols}")
        count = await db.users.count_documents({})
        print(f"Users in DB: {count}")
        # List all users
        async for u in db.users.find():
            u["_id"] = str(u["_id"])
            print(f"  User: {u}")
    except Exception as e:
        print(f"Connection FAILED: {type(e).__name__}: {e}")
    finally:
        c.close()

asyncio.run(test())

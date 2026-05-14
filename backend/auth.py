import os
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import firebase_admin
from firebase_admin import auth, credentials
from sqlalchemy.orm import Session

from database import get_db
import crud
import models

# =========================
# FIREBASE INIT
# =========================

if not firebase_admin._apps:
    current_dir = os.path.dirname(os.path.abspath(__file__))
    cred_path = os.path.join(current_dir, "serviceAccountKey.json")

    print("Firebase Key Path:", cred_path)

    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

    print("Firebase Admin Initialized ✅")

security = HTTPBearer()

# =========================
# VERIFY TOKEN
# =========================

def verify_firebase_token(
    credentials_data: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials_data.credentials

    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials: {str(e)}",
        )

# =========================
# CURRENT USER
# =========================

def get_current_user(
    decoded_token: dict = Depends(verify_firebase_token),
    db: Session = Depends(get_db),
):
    firebase_uid = decoded_token.get("uid")

    if not firebase_uid:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = crud.get_user_by_firebase_uid(
        db,
        firebase_uid=firebase_uid
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user

# =========================
# SHOP OWNER CHECK
# =========================

def get_current_shop_owner(
    user: models.User = Depends(get_current_user)
):
    if not user.is_shop_owner:
        raise HTTPException(
            status_code=403,
            detail="Not authorized as shop owner"
        )

    return user
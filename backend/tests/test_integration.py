"""Integration tests: API flows and expiry filtering (no real auth — see test docstrings)."""

from __future__ import annotations

from datetime import datetime, timedelta, timezone

import pytest
from fastapi.testclient import TestClient

# conftest.py sets DATABASE_URL before collection imports `main`
import main  # noqa: E402
from database import SessionLocal, engine  # noqa: E402
import models  # noqa: E402


@pytest.fixture
def client() -> TestClient:
    return TestClient(main.app)


@pytest.fixture(autouse=True)
def reset_db_tables():
    """Fresh metadata for each test (SQLite file from conftest)."""
    models.Base.metadata.drop_all(bind=engine)
    models.Base.metadata.create_all(bind=engine)
    yield
    db = SessionLocal()
    db.query(models.Product).delete()
    db.query(models.Shop).delete()
    db.query(models.User).delete()
    db.commit()
    db.close()


def _seed_user_shop(client: TestClient, uid: str = "firebase_test_1") -> tuple[dict, dict]:
    u = client.post(
        "/users/",
        json={
            "firebase_uid": uid,
            "email": f"{uid}@test.com",
            "name": "Test User",
            "is_shop_owner": True,
        },
    )
    assert u.status_code == 200, u.text
    s = client.post(
        "/shops/?owner_firebase_uid=" + uid,
        json={
            "name": "Test Market",
            "address": "1 High St",
            "latitude": 51.5,
            "longitude": -0.12,
            "description": "Local",
        },
    )
    assert s.status_code == 200, s.text
    return u.json(), s.json()


def test_root(client: TestClient):
    r = client.get("/")
    assert r.status_code == 200
    assert "message" in r.json()


def test_authentication_not_enforced_documented_gap(client: TestClient):
    """
    Today there is no JWT / Firebase verification: mutating routes accept anonymous calls.
    This test documents current behavior (integration 'passes' without Authorization).
    """
    _, shop = _seed_user_shop(client, uid="anon_surface")
    sid = shop["id"]
    r = client.post(
        f"/products/?shop_id={sid}",
        json=_product_payload("Surface Product", hours_to_expiry=24),
    )
    assert r.status_code == 200, r.text


def test_user_create_duplicate(client: TestClient):
    payload = {
        "firebase_uid": "dup_u",
        "email": "dup@test.com",
        "name": "Dup",
        "is_shop_owner": False,
    }
    r1 = client.post("/users/", json=payload)
    assert r1.status_code == 200, r1.text
    r2 = client.post(
        "/users/",
        json={**payload, "email": "other@x.com"},
    )
    assert r2.status_code == 400


def test_product_create_and_fetch(client: TestClient):
    _, shop = _seed_user_shop(client)
    sid = shop["id"]
    p = client.post(
        f"/products/?shop_id={sid}",
        json=_product_payload("Fresh Item", hours_to_expiry=48),
    )
    assert p.status_code == 200, p.text
    body = p.json()
    assert body["name"] == "Fresh Item"
    assert body["shop_id"] == sid

    lst = client.get("/products/")
    assert lst.status_code == 200
    items = lst.json()
    assert len(items) == 1
    assert items[0]["shop"]["name"] == "Test Market"


def test_expiry_filtering_hides_expired_by_default(client: TestClient):
    _, shop = _seed_user_shop(client, uid="expiry_user")
    sid = shop["id"]
    assert (
        client.post(
            f"/products/?shop_id={sid}",
            json=_product_payload("Still Good", hours_to_expiry=72),
        ).status_code
        == 200
    )
    assert (
        client.post(
            f"/products/?shop_id={sid}",
            json=_product_payload("Already Gone", hours_to_expiry=-2),
        ).status_code
        == 200
    )

    visible = client.get("/products/")
    assert visible.status_code == 200
    names = {x["name"] for x in visible.json()}
    assert "Still Good" in names
    assert "Already Gone" not in names

    all_rows = client.get("/products/?hide_expired=false")
    assert all_rows.status_code == 200
    assert len(all_rows.json()) == 2


def test_protected_routes_none_exist(client: TestClient):
    """
    There are no routes that require Authorization today.
    All listed endpoints respond without Bearer token.
    """
    r = client.get("/products/")
    assert r.status_code == 200
    r2 = client.get("/users/missing_uid_xyz")
    assert r2.status_code == 404


def _product_payload(name: str, hours_to_expiry: int) -> dict:
    exp = datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(hours=hours_to_expiry)
    return {
        "name": name,
        "original_price": 10.0,
        "discount_price": 4.0,
        "quantity": 5,
        "expiry_date": exp.isoformat(),
        "front_image_url": "https://example.com/front.jpg",
        "expiry_image_url": "https://example.com/exp.jpg",
        "voice_note_url": None,
        "is_active": True,
    }

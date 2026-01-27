import json
import time
from processors.clean_text import clean_text
from geopy.geocoders import Nominatim

# simple geocode cache (in-memory)
geolocator = Nominatim(user_agent="ocean-hazards")
geocode_cache = {}

def geocode_place(place):
    if not place:
        return None
    key = place.strip().lower()
    if key in geocode_cache:
        return geocode_cache[key]
    try:
        loc = geolocator.geocode(place, timeout=10)
        time.sleep(1)  # polite pause for Nominatim usage
        if loc:
            geo = {"lat": loc.latitude, "lon": loc.longitude}
            geocode_cache[key] = geo
            return geo
    except Exception:
        return None
    return None

def load_mock_posts(file="data/mock_social.jsonl"):
    cleaned_posts = []
    try:
        with open(file, "r", encoding="utf-8") as f:
            for line in f:
                if not line.strip():
                    continue
                post = json.loads(line)
                post["text"] = clean_text(post.get("text", ""))
                # naive geotagging: check for known place names in text
                geo = None
                for place in ["Odisha","Kochi","Chennai","Andhra","Mumbai","Kerala"]:
                    if place.lower() in post["text"].lower():
                        geo = geocode_place(place)
                        break
                post["geo"] = geo
                post["geo_source"] = "mock_inference" if geo else None
                cleaned_posts.append(post)
    except FileNotFoundError:
        print(f"⚠ Mock file not found: {file}")
    return cleaned_posts

if __name__ == "__main__":
    posts = load_mock_posts()
    print(f"Loaded {len(posts)} mock posts")
    for p in posts[:5]:
        print(p)

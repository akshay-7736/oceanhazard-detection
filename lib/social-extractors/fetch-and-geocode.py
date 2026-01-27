import os
import json
import tweepy
from dotenv import load_dotenv
from processors.clean_text import clean_text

load_dotenv()

client = tweepy.Client(
    bearer_token=os.getenv("TWITTER_BEARER_TOKEN"),
    consumer_key=os.getenv("TWITTER_API_KEY"),
    consumer_secret=os.getenv("TWITTER_API_SECRET"),
    access_token=os.getenv("TWITTER_ACCESS_TOKEN"),
    access_token_secret=os.getenv("TWITTER_ACCESS_SECRET"),
    wait_on_rate_limit=True
)

KEYWORDS = ["cyclone", "tsunami", "flooding", "ocean", "storm surge"]

def fetch_and_geocode(query, max_results=10):
    resp = client.search_recent_tweets(
        query=query,
        tweet_fields=["created_at","lang","geo","public_metrics","attachments"],
        user_fields=["username", "location", "public_metrics"],
        expansions=["author_id", "attachments.media_keys", "geo.place_id"],
        media_fields=["url", "preview_image_url", "type"],
        place_fields=["full_name", "country", "geo"],
        max_results=max_results
    )

    tweets = []
    users_map = {u["id"]: u for u in resp.includes.get("users", [])}
    media_map = {m["media_key"]: m for m in resp.includes.get("media", [])}

    for t in resp.data:
        author = users_map.get(t.author_id, {})
        tweet_metrics = t.public_metrics or {}
        user_metrics = author.get("public_metrics", {})

        likes = tweet_metrics.get("like_count", 0)
        retweets = tweet_metrics.get("retweet_count", 0)
        replies = tweet_metrics.get("reply_count", 0)
        followers = user_metrics.get("followers_count", 0)

        media_urls = []
        if hasattr(t, "attachments") and t.attachments:
            for key in t.attachments.get("media_keys", []):
                m = media_map.get(key)
                if m:
                    if "url" in m:
                        media_urls.append(m["url"])
                    elif "preview_image_url" in m:
                        media_urls.append(m["preview_image_url"])

        post = {
            "id": str(t.id),
            "date": t.created_at.isoformat() if t.created_at else None,
            "user": author.get("username", "unknown"),
            "text": t.text,
            "likes": likes,
            "retweets": retweets,
            "replies": replies,
            "followers": followers,
            "media": media_urls
        }

        tweets.append(post)
    return tweets

if __name__ == "__main__":
    results = fetch_and_geocode("cyclone OR tsunami OR flooding", max_results=15)
    with open("data/tweets.jsonl", "w", encoding="utf-8") as f:
        for r in results:
            f.write(json.dumps(r) + "\n")
    print(f"✅ Collected {len(results)} tweets with metrics + media")

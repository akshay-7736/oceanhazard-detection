import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import os, json
import tweepy
from dotenv import load_dotenv
from processors.clean_text import clean_text

load_dotenv()

# Load bearer token
BEARER = os.getenv("TWITTER_BEARER_TOKEN")

client = tweepy.Client(bearer_token=BEARER, wait_on_rate_limit=True)

KEYWORDS = ["cyclone","tsunami","storm surge","ocean flooding","tidal wave","coastal erosion"]

def fetch_recent_tweets(query, max_results=20):
    try:
        tweets = client.search_recent_tweets(
            query=query,
            tweet_fields=["created_at","lang","geo","public_metrics"],
            max_results=max_results
        )
        if not tweets.data:
            print("No tweets found for this query.")
        results = []
        for t in tweets.data or []:
            results.append({
                "id": str(t.id),
                "platform": "twitter",
                "text": clean_text(t.text),
                "timestamp": t.created_at.isoformat(),
                "lang": t.lang,
                "public_metrics": t.public_metrics
            })
        return results
    except Exception as e:
        print(f"Error fetching tweets: {e}")
        return []

def save_tweets_to_file(tweets, file="data/tweets.jsonl"):
    with open(file, "w", encoding="utf-8") as f:
        for t in tweets:
            f.write(json.dumps(t, ensure_ascii=False) + "\n")
    print(f"✅ Saved {len(tweets)} tweets to {file}")

if __name__ == "__main__":
    query = " OR ".join(KEYWORDS) + " -is:retweet lang:en"
    tweets = fetch_recent_tweets(query, max_results=15)
    save_tweets_to_file(tweets)

# processors/normalize.py

def normalize_tweet(tweet: dict) -> dict:
    """Convert raw tweet dict into normalized format"""
    return {
        "id": tweet.get("id"),
        "date": tweet.get("timestamp"),
        "user": tweet.get("user_id") or "unknown",
        "text": tweet.get("text"),
        "likes": tweet.get("public_metrics", {}).get("like_count", 0),
        "retweets": tweet.get("public_metrics", {}).get("retweet_count", 0),
        "replies": tweet.get("public_metrics", {}).get("reply_count", 0),
        "followers": tweet.get("followers", 0),   # you can enrich later
        "media": tweet.get("media", []),
    }


def normalize_mock(post: dict) -> dict:
    """Convert mock FB/IG/YT post into normalized format"""
    return {
        "id": post.get("id"),
        "date": post.get("timestamp"),
        "user": post.get("user") or post.get("channel") or "unknown",
        "text": post.get("text"),
        "likes": post.get("likes", 0),
        "retweets": post.get("shares", 0),   # map shares → retweets
        "replies": post.get("comments", 0),
        "followers": post.get("followers", 0),
        "media": post.get("media", []),
    }

import re

try:
    import emoji
except ImportError:
    emoji = None

try:
    from langdetect import detect
except ImportError:
    detect = None


def clean_text(text: str) -> str:
    if not text:
        return ""

    # 1. Remove retweet markers
    text = re.sub(r"\bRT\b[: ]*", "", text, flags=re.IGNORECASE)

    # 2. Remove mentions (@username)
    text = re.sub(r"@\S+", "", text)

    # 3. Remove URLs (http, https, www)
    text = re.sub(r"https?://\S+|www\.\S+", "", text)

    # 4. Remove hashtag symbol (#) but keep the word
    text = text.replace("#", "")

    # 5. Remove emojis
    if emoji:
        text = emoji.replace_emoji(text, replace="")
    else:
        # fallback: strip most non-alphanumeric (except punctuation)
        text = re.sub(r"[^\w\s\.,!?]", " ", text)

    # 6. Normalize spaces
    text = re.sub(r"\s+", " ", text).strip()

    # 7. Lowercase
    text = text.lower()

    # 8. Optional language filter
    if detect and text.strip():
        try:
            if detect(text) != "en":
                return ""   # drop non-English
        except Exception:
            pass

    return text

# processors/data_processor.py
import json
import os
from datetime import datetime
from typing import Dict, List, Any, Optional
from .clean_text import clean_text
from .classifier import HazardClassifier, classify_post_enhanced
from .sentiment_analyzer import SentimentAnalyzer, analyze_sentiment
from .normalize import normalize_tweet, normalize_mock

class OceanHazardDataProcessor:
    """
    Comprehensive data processor for ocean hazard social media data
    Combines text cleaning, hazard classification, sentiment analysis, and normalization
    """
    
    def __init__(self):
        self.classifier = HazardClassifier()
        self.sentiment_analyzer = SentimentAnalyzer()
        
    def process_social_post(self, post: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process a single social media post through the complete pipeline
        """
        # Extract and clean text
        raw_text = post.get('text', '') or post.get('content', '') or post.get('message', '')
        cleaned_text = clean_text(raw_text)
        
        if not cleaned_text:
            return self._create_empty_result(post)
        
        # Hazard classification
        hazard_type, urgency, hazard_confidence = classify_post_enhanced(cleaned_text)
        
        # Sentiment analysis
        sentiment_data = analyze_sentiment(cleaned_text)
        
        # Location extraction
        locations = self.classifier.extract_location_mentions(cleaned_text)
        
        # Create processed result
        processed_post = {
            'original_id': post.get('id'),
            'platform': post.get('platform', 'unknown'),
            'original_text': raw_text,
            'cleaned_text': cleaned_text,
            'timestamp': post.get('timestamp') or post.get('created_at') or post.get('date'),
            'user': post.get('user') or post.get('author') or post.get('username'),
            'engagement': {
                'likes': post.get('likes', 0) or post.get('like_count', 0),
                'retweets': post.get('retweets', 0) or post.get('retweet_count', 0) or post.get('shares', 0),
                'replies': post.get('replies', 0) or post.get('reply_count', 0) or post.get('comments', 0),
                'followers': post.get('followers', 0) or post.get('follower_count', 0)
            },
            'hazard_analysis': {
                'type': hazard_type,
                'urgency': urgency,
                'confidence': hazard_confidence,
                'locations_mentioned': locations
            },
            'sentiment_analysis': sentiment_data,
            'media': post.get('media', []) or post.get('attachments', []),
            'geolocation': post.get('geo') or post.get('location'),
            'processed_at': datetime.now().isoformat(),
            'processing_version': '1.0.0'
        }
        
        return processed_post
    
    def process_batch(self, posts: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Process multiple social media posts
        """
        return [self.process_social_post(post) for post in posts]
    
    def process_twitter_data(self, tweets: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Process Twitter-specific data with normalization
        """
        normalized_tweets = [normalize_tweet(tweet) for tweet in tweets]
        return self.process_batch(normalized_tweets)
    
    def process_mock_data(self, posts: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Process mock social media data
        """
        normalized_posts = [normalize_mock(post) for post in posts]
        return self.process_batch(normalized_posts)
    
    def filter_by_hazard_type(self, processed_posts: List[Dict[str, Any]], 
                            hazard_type: str) -> List[Dict[str, Any]]:
        """
        Filter processed posts by hazard type
        """
        return [post for post in processed_posts 
                if post['hazard_analysis']['type'] == hazard_type]
    
    def filter_by_urgency(self, processed_posts: List[Dict[str, Any]], 
                         urgency: str) -> List[Dict[str, Any]]:
        """
        Filter processed posts by urgency level
        """
        return [post for post in processed_posts 
                if post['hazard_analysis']['urgency'] == urgency]
    
    def filter_by_confidence(self, processed_posts: List[Dict[str, Any]], 
                           min_confidence: float = 0.5) -> List[Dict[str, Any]]:
        """
        Filter processed posts by minimum confidence score
        """
        return [post for post in processed_posts 
                if post['hazard_analysis']['confidence'] >= min_confidence]
    
    def get_high_priority_posts(self, processed_posts: List[Dict[str, Any]], 
                              min_confidence: float = 0.7) -> List[Dict[str, Any]]:
        """
        Get high priority posts (high urgency + high confidence)
        """
        return [post for post in processed_posts 
                if (post['hazard_analysis']['urgency'] == 'high' and 
                    post['hazard_analysis']['confidence'] >= min_confidence)]
    
    def generate_summary_stats(self, processed_posts: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Generate summary statistics for processed posts
        """
        if not processed_posts:
            return self._empty_summary()
        
        total_posts = len(processed_posts)
        hazard_types = {}
        urgency_levels = {}
        sentiment_labels = {}
        platforms = {}
        
        for post in processed_posts:
            # Hazard types
            hazard_type = post['hazard_analysis']['type']
            hazard_types[hazard_type] = hazard_types.get(hazard_type, 0) + 1
            
            # Urgency levels
            urgency = post['hazard_analysis']['urgency']
            urgency_levels[urgency] = urgency_levels.get(urgency, 0) + 1
            
            # Sentiment labels
            sentiment = post['sentiment_analysis']['sentiment_label']
            sentiment_labels[sentiment] = sentiment_labels.get(sentiment, 0) + 1
            
            # Platforms
            platform = post['platform']
            platforms[platform] = platforms.get(platform, 0) + 1
        
        # Calculate average confidence
        avg_confidence = sum(post['hazard_analysis']['confidence'] for post in processed_posts) / total_posts
        
        # Calculate average urgency score
        avg_urgency_score = sum(post['sentiment_analysis']['urgency_score'] for post in processed_posts) / total_posts
        
        return {
            'total_posts': total_posts,
            'hazard_type_distribution': hazard_types,
            'urgency_distribution': urgency_levels,
            'sentiment_distribution': sentiment_labels,
            'platform_distribution': platforms,
            'average_confidence': round(avg_confidence, 3),
            'average_urgency_score': round(avg_urgency_score, 3),
            'high_priority_count': len(self.get_high_priority_posts(processed_posts)),
            'generated_at': datetime.now().isoformat()
        }
    
    def save_processed_data(self, processed_posts: List[Dict[str, Any]], 
                          filename: str = None) -> str:
        """
        Save processed data to JSON file
        """
        if filename is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"processed_hazard_data_{timestamp}.json"
        
        # Ensure data directory exists
        os.makedirs("data", exist_ok=True)
        filepath = os.path.join("data", filename)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(processed_posts, f, indent=2, ensure_ascii=False)
        
        return filepath
    
    def _create_empty_result(self, original_post: Dict[str, Any]) -> Dict[str, Any]:
        """Create empty result for posts with no processable text"""
        return {
            'original_id': original_post.get('id'),
            'platform': original_post.get('platform', 'unknown'),
            'original_text': original_post.get('text', '') or original_post.get('content', ''),
            'cleaned_text': '',
            'timestamp': original_post.get('timestamp') or original_post.get('created_at'),
            'user': original_post.get('user') or original_post.get('author'),
            'engagement': {'likes': 0, 'retweets': 0, 'replies': 0, 'followers': 0},
            'hazard_analysis': {'type': 'General', 'urgency': 'low', 'confidence': 0.0, 'locations_mentioned': []},
            'sentiment_analysis': {'polarity': 0.0, 'subjectivity': 0.5, 'urgency_score': 0.0, 
                                 'sentiment_label': 'neutral', 'emergency_indicators': [], 'confidence': 0.0},
            'media': [],
            'geolocation': None,
            'processed_at': datetime.now().isoformat(),
            'processing_version': '1.0.0'
        }
    
    def _empty_summary(self) -> Dict[str, Any]:
        """Return empty summary for no data"""
        return {
            'total_posts': 0,
            'hazard_type_distribution': {},
            'urgency_distribution': {},
            'sentiment_distribution': {},
            'platform_distribution': {},
            'average_confidence': 0.0,
            'average_urgency_score': 0.0,
            'high_priority_count': 0,
            'generated_at': datetime.now().isoformat()
        }

# Convenience functions
def process_social_post(post: Dict[str, Any]) -> Dict[str, Any]:
    """Process a single social media post"""
    processor = OceanHazardDataProcessor()
    return processor.process_social_post(post)

def process_batch(posts: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Process multiple social media posts"""
    processor = OceanHazardDataProcessor()
    return processor.process_batch(posts)

# processors/sentiment_analyzer.py
import re
from typing import Dict, Tuple, List
from textblob import TextBlob

class SentimentAnalyzer:
    def __init__(self):
        # Emergency and urgency keywords
        self.emergency_keywords = [
            "emergency", "urgent", "critical", "danger", "evacuate", "evacuation",
            "warning", "alert", "immediate", "help", "rescue", "disaster",
            "damage", "destruction", "flooded", "trapped", "stranded"
        ]
        
        # Positive sentiment keywords (relief, safety, etc.)
        self.positive_keywords = [
            "safe", "saved", "rescue", "relief", "help", "support", "recovery",
            "evacuated", "shelter", "assistance", "aid", "volunteer"
        ]
        
        # Negative sentiment keywords
        self.negative_keywords = [
            "damage", "destroyed", "flooded", "trapped", "stranded", "lost",
            "missing", "injured", "death", "casualty", "devastation"
        ]

    def analyze_sentiment(self, text: str) -> Dict[str, any]:
        """
        Comprehensive sentiment analysis for hazard-related content
        Returns: {
            'polarity': float,  # -1 to 1
            'subjectivity': float,  # 0 to 1
            'urgency_score': float,  # 0 to 1
            'sentiment_label': str,  # 'positive', 'negative', 'neutral'
            'emergency_indicators': List[str],
            'confidence': float  # 0 to 1
        }
        """
        if not text or not text.strip():
            return self._default_sentiment()
        
        # Basic sentiment using TextBlob
        blob = TextBlob(text)
        polarity = blob.sentiment.polarity
        subjectivity = blob.sentiment.subjectivity
        
        # Calculate urgency score
        urgency_score = self._calculate_urgency_score(text)
        
        # Determine sentiment label
        sentiment_label = self._determine_sentiment_label(polarity, urgency_score)
        
        # Extract emergency indicators
        emergency_indicators = self._extract_emergency_indicators(text)
        
        # Calculate confidence based on multiple factors
        confidence = self._calculate_confidence(polarity, subjectivity, urgency_score, emergency_indicators)
        
        return {
            'polarity': polarity,
            'subjectivity': subjectivity,
            'urgency_score': urgency_score,
            'sentiment_label': sentiment_label,
            'emergency_indicators': emergency_indicators,
            'confidence': confidence
        }

    def _calculate_urgency_score(self, text: str) -> float:
        """Calculate urgency score based on emergency keywords and patterns"""
        text_lower = text.lower()
        urgency_count = 0
        total_words = len(text.split())
        
        # Count emergency keywords
        for keyword in self.emergency_keywords:
            if keyword in text_lower:
                urgency_count += 1
        
        # Check for urgency patterns
        urgency_patterns = [
            r'\b(emergency|urgent|critical)\b',
            r'\b(evacuate|evacuation)\b',
            r'\b(warning|alert)\b',
            r'\b(immediate|immediately)\b',
            r'\b(help|rescue)\b'
        ]
        
        for pattern in urgency_patterns:
            if re.search(pattern, text_lower):
                urgency_count += 1
        
        # Normalize to 0-1 scale
        if total_words == 0:
            return 0.0
        return min(urgency_count / max(total_words * 0.1, 1), 1.0)

    def _determine_sentiment_label(self, polarity: float, urgency_score: float) -> str:
        """Determine sentiment label considering both polarity and urgency"""
        if urgency_score > 0.7:
            return 'emergency'
        elif polarity > 0.1:
            return 'positive'
        elif polarity < -0.1:
            return 'negative'
        else:
            return 'neutral'

    def _extract_emergency_indicators(self, text: str) -> List[str]:
        """Extract emergency-related indicators from text"""
        text_lower = text.lower()
        indicators = []
        
        for keyword in self.emergency_keywords:
            if keyword in text_lower:
                indicators.append(keyword)
        
        return indicators

    def _calculate_confidence(self, polarity: float, subjectivity: float, 
                           urgency_score: float, emergency_indicators: List[str]) -> float:
        """Calculate confidence score for the sentiment analysis"""
        # Base confidence from TextBlob
        base_confidence = 1.0 - abs(subjectivity - 0.5) * 2  # Higher confidence for less subjective text
        
        # Boost confidence if we found clear indicators
        indicator_boost = min(len(emergency_indicators) * 0.1, 0.3)
        
        # Boost confidence for extreme polarity values
        polarity_boost = min(abs(polarity) * 0.2, 0.2)
        
        # Boost confidence for high urgency
        urgency_boost = min(urgency_score * 0.2, 0.2)
        
        total_confidence = base_confidence + indicator_boost + polarity_boost + urgency_boost
        return min(total_confidence, 1.0)

    def _default_sentiment(self) -> Dict[str, any]:
        """Return default sentiment for empty text"""
        return {
            'polarity': 0.0,
            'subjectivity': 0.5,
            'urgency_score': 0.0,
            'sentiment_label': 'neutral',
            'emergency_indicators': [],
            'confidence': 0.0
        }

    def batch_analyze(self, texts: List[str]) -> List[Dict[str, any]]:
        """Analyze sentiment for multiple texts"""
        return [self.analyze_sentiment(text) for text in texts]

# Convenience functions
def analyze_sentiment(text: str) -> Dict[str, any]:
    """Analyze sentiment for a single text"""
    analyzer = SentimentAnalyzer()
    return analyzer.analyze_sentiment(text)

def batch_analyze_sentiment(texts: List[str]) -> List[Dict[str, any]]:
    """Analyze sentiment for multiple texts"""
    analyzer = SentimentAnalyzer()
    return analyzer.batch_analyze(texts)

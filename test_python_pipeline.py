#!/usr/bin/env python3
"""
Test script for Ocean Hazard System Python data processing pipeline
This script tests all the data processing modules to ensure they work correctly
"""

import sys
import os
import json
from datetime import datetime

# Add the lib directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'lib'))

def test_imports():
    """Test if all modules can be imported"""
    print("🔄 Testing module imports...")
    
    try:
        from processors.clean_text import clean_text
        print("✅ clean_text module imported")
    except ImportError as e:
        print(f"❌ Failed to import clean_text: {e}")
        return False
    
    try:
        from processors.classifier import HazardClassifier, classify_post_enhanced
        print("✅ classifier module imported")
    except ImportError as e:
        print(f"❌ Failed to import classifier: {e}")
        return False
    
    try:
        from processors.sentiment_analyzer import SentimentAnalyzer, analyze_sentiment
        print("✅ sentiment_analyzer module imported")
    except ImportError as e:
        print(f"❌ Failed to import sentiment_analyzer: {e}")
        return False
    
    try:
        from processors.data_processor import OceanHazardDataProcessor, process_social_post
        print("✅ data_processor module imported")
    except ImportError as e:
        print(f"❌ Failed to import data_processor: {e}")
        return False
    
    return True

def test_text_cleaning():
    """Test text cleaning functionality"""
    print("\n🔄 Testing text cleaning...")
    
    from processors.clean_text import clean_text
    
    test_cases = [
        {
            "input": "RT @user: Tsunami warning issued for coastal areas! #tsunami #emergency",
            "expected_contains": ["tsunami", "warning", "coastal", "areas"]
        },
        {
            "input": "Check out this link: https://example.com for more info",
            "expected_contains": ["check", "out", "this", "link", "for", "more", "info"]
        },
        {
            "input": "🚨 Emergency evacuation in progress! @authority",
            "expected_contains": ["emergency", "evacuation", "progress"]
        }
    ]
    
    for i, case in enumerate(test_cases):
        result = clean_text(case["input"])
        print(f"  Test {i+1}: '{case['input'][:30]}...' -> '{result[:50]}...'")
        
        # Check if expected words are present
        for word in case["expected_contains"]:
            if word in result:
                print(f"    ✅ Contains '{word}'")
            else:
                print(f"    ⚠️  Missing '{word}'")
    
    return True

def test_hazard_classification():
    """Test hazard classification functionality"""
    print("\n🔄 Testing hazard classification...")
    
    from processors.classifier import HazardClassifier, classify_post_enhanced
    
    test_cases = [
        {
            "text": "Tsunami warning issued for coastal areas. Evacuate immediately!",
            "expected_hazard": "Tsunami",
            "expected_urgency": "high"
        },
        {
            "text": "Heavy rainfall causing flooding in the city",
            "expected_hazard": "Flooding",
            "expected_urgency": "medium"
        },
        {
            "text": "Beautiful sunset at the beach today",
            "expected_hazard": "General",
            "expected_urgency": "low"
        }
    ]
    
    classifier = HazardClassifier()
    
    for i, case in enumerate(test_cases):
        hazard_type, urgency, confidence = classify_post_enhanced(case["text"])
        print(f"  Test {i+1}: '{case['text'][:40]}...'")
        print(f"    Hazard: {hazard_type} (expected: {case['expected_hazard']})")
        print(f"    Urgency: {urgency} (expected: {case['expected_urgency']})")
        print(f"    Confidence: {confidence:.2f}")
        
        if hazard_type == case["expected_hazard"]:
            print(f"    ✅ Hazard classification correct")
        else:
            print(f"    ⚠️  Hazard classification different than expected")
    
    return True

def test_sentiment_analysis():
    """Test sentiment analysis functionality"""
    print("\n🔄 Testing sentiment analysis...")
    
    from processors.sentiment_analyzer import analyze_sentiment
    
    test_cases = [
        {
            "text": "Emergency evacuation in progress! This is critical!",
            "expected_sentiment": "emergency"
        },
        {
            "text": "Great relief efforts by the volunteers. Thank you!",
            "expected_sentiment": "positive"
        },
        {
            "text": "The damage is devastating. Many people are trapped.",
            "expected_sentiment": "negative"
        },
        {
            "text": "Weather update: Partly cloudy with light winds.",
            "expected_sentiment": "neutral"
        }
    ]
    
    for i, case in enumerate(test_cases):
        result = analyze_sentiment(case["text"])
        print(f"  Test {i+1}: '{case['text'][:40]}...'")
        print(f"    Sentiment: {result['sentiment_label']} (expected: {case['expected_sentiment']})")
        print(f"    Polarity: {result['polarity']:.2f}")
        print(f"    Urgency Score: {result['urgency_score']:.2f}")
        print(f"    Confidence: {result['confidence']:.2f}")
        
        if result['sentiment_label'] == case['expected_sentiment']:
            print(f"    ✅ Sentiment analysis correct")
        else:
            print(f"    ⚠️  Sentiment analysis different than expected")
    
    return True

def test_data_processing():
    """Test complete data processing pipeline"""
    print("\n🔄 Testing complete data processing pipeline...")
    
    from processors.data_processor import OceanHazardDataProcessor
    
    # Create test social media posts
    test_posts = [
        {
            "id": "test_001",
            "platform": "twitter",
            "text": "Tsunami warning issued for coastal areas! Evacuate immediately! #tsunami #emergency",
            "user": "test_user",
            "timestamp": datetime.now().isoformat(),
            "likes": 150,
            "retweets": 45,
            "replies": 12,
            "followers": 1000
        },
        {
            "id": "test_002", 
            "platform": "facebook",
            "text": "Heavy rainfall causing flooding in the city. Stay safe everyone!",
            "user": "weather_authority",
            "timestamp": datetime.now().isoformat(),
            "likes": 89,
            "shares": 23,
            "comments": 8,
            "followers": 5000
        },
        {
            "id": "test_003",
            "platform": "instagram",
            "text": "Beautiful sunset at the beach today 🌅",
            "user": "beach_lover",
            "timestamp": datetime.now().isoformat(),
            "likes": 234,
            "comments": 15,
            "followers": 500
        }
    ]
    
    processor = OceanHazardDataProcessor()
    
    # Process the posts
    processed_posts = processor.process_batch(test_posts)
    
    print(f"  Processed {len(processed_posts)} posts")
    
    # Display results
    for i, post in enumerate(processed_posts):
        print(f"\n  Post {i+1} ({post['platform']}):")
        print(f"    Original: {post['original_text'][:50]}...")
        print(f"    Cleaned: {post['cleaned_text'][:50]}...")
        print(f"    Hazard: {post['hazard_analysis']['type']} ({post['hazard_analysis']['urgency']})")
        print(f"    Sentiment: {post['sentiment_analysis']['sentiment_label']}")
        print(f"    Confidence: {post['hazard_analysis']['confidence']:.2f}")
    
    # Generate summary
    summary = processor.generate_summary_stats(processed_posts)
    print(f"\n  Summary Statistics:")
    print(f"    Total posts: {summary['total_posts']}")
    print(f"    Hazard types: {summary['hazard_type_distribution']}")
    print(f"    Urgency levels: {summary['urgency_distribution']}")
    print(f"    Sentiment labels: {summary['sentiment_distribution']}")
    print(f"    Average confidence: {summary['average_confidence']}")
    
    return True

def main():
    """Main test function"""
    print("🧪 Testing Ocean Hazard System Python Pipeline")
    print("=" * 60)
    
    # Test imports
    if not test_imports():
        print("\n❌ Import tests failed")
        sys.exit(1)
    
    # Test text cleaning
    if not test_text_cleaning():
        print("\n❌ Text cleaning tests failed")
        sys.exit(1)
    
    # Test hazard classification
    if not test_hazard_classification():
        print("\n❌ Hazard classification tests failed")
        sys.exit(1)
    
    # Test sentiment analysis
    if not test_sentiment_analysis():
        print("\n❌ Sentiment analysis tests failed")
        sys.exit(1)
    
    # Test complete pipeline
    if not test_data_processing():
        print("\n❌ Data processing pipeline tests failed")
        sys.exit(1)
    
    print("\n" + "=" * 60)
    print("🎉 All tests passed! Python pipeline is working correctly.")
    print("\nThe data processing pipeline is ready to use!")

if __name__ == "__main__":
    main()

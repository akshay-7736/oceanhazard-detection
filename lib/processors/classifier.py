# processors/classifier.py
import re
from typing import Tuple, Dict, List
import json

# Enhanced hazard classification with better NLP
class HazardClassifier:
    def __init__(self):
        self.hazard_patterns = {
            "Cyclone": {
                "keywords": ["cyclone", "storm", "hurricane", "gale", "typhoon", "tornado", "whirlwind"],
                "patterns": [r"\b(cyclone|storm|hurricane)\s+(warning|alert|watch)\b", r"\b(severe|intense)\s+storm\b"]
            },
            "Tsunami": {
                "keywords": ["tsunami", "tidal wave", "seismic wave", "ocean wave"],
                "patterns": [r"\btsunami\s+(warning|alert|watch)\b", r"\btidal\s+wave\b", r"\bseismic\s+wave\b"]
            },
            "Flooding": {
                "keywords": ["flood", "flooding", "inundation", "water level", "overflow"],
                "patterns": [r"\bflood\s+(warning|alert|watch)\b", r"\bwater\s+level\s+(rising|high)\b", r"\binundation\b"]
            },
            "Storm Surge": {
                "keywords": ["storm surge", "surge", "coastal flooding", "ocean flooding"],
                "patterns": [r"\bstorm\s+surge\b", r"\bcoastal\s+flooding\b", r"\bocean\s+flooding\b"]
            },
            "Coastal Erosion": {
                "keywords": ["erosion", "coastal damage", "beach erosion", "shoreline"],
                "patterns": [r"\bcoastal\s+erosion\b", r"\bbeach\s+erosion\b", r"\bshoreline\s+damage\b"]
            },
            "Oil Spill": {
                "keywords": ["oil spill", "contamination", "pollution", "leak"],
                "patterns": [r"\boil\s+spill\b", r"\bwater\s+contamination\b", r"\bocean\s+pollution\b"]
            }
        }
        
        self.urgency_indicators = {
            "high": {
                "keywords": ["emergency", "urgent", "evacuate", "evacuation", "danger", "critical", "immediate"],
                "patterns": [r"\b(emergency|urgent|evacuate|danger|critical|immediate)\b", r"\bstay\s+away\b", r"\bseek\s+shelter\b"]
            },
            "medium": {
                "keywords": ["warning", "alert", "caution", "advisory", "watch", "damage", "report"],
                "patterns": [r"\b(warning|alert|caution|advisory|watch)\b", r"\bdamage\s+report\b"]
            },
            "low": {
                "keywords": ["information", "update", "status", "monitoring", "observation"],
                "patterns": [r"\b(information|update|status|monitoring|observation)\b"]
            }
        }

    def classify_post(self, text: str) -> Tuple[str, str, float]:
        """
        Enhanced hazard classification with confidence scoring
        Returns: (hazard_type, urgency_level, confidence_score)
        """
        if not text or not text.strip():
            return "General", "low", 0.0
            
        text_lower = text.lower()
        hazard_scores = {}
        urgency_scores = {}
        
        # Calculate hazard type scores
        for hazard_type, patterns in self.hazard_patterns.items():
            score = 0
            # Keyword matching
            for keyword in patterns["keywords"]:
                if keyword in text_lower:
                    score += 1
            # Pattern matching
            for pattern in patterns["patterns"]:
                if re.search(pattern, text_lower, re.IGNORECASE):
                    score += 2
            hazard_scores[hazard_type] = score
        
        # Calculate urgency scores
        for urgency_level, patterns in self.urgency_indicators.items():
            score = 0
            for keyword in patterns["keywords"]:
                if keyword in text_lower:
                    score += 1
            for pattern in patterns["patterns"]:
                if re.search(pattern, text_lower, re.IGNORECASE):
                    score += 2
            urgency_scores[urgency_level] = score
        
        # Determine hazard type
        if hazard_scores:
            best_hazard = max(hazard_scores, key=hazard_scores.get)
            hazard_confidence = min(hazard_scores[best_hazard] / 5.0, 1.0)  # Normalize to 0-1
        else:
            best_hazard = "General"
            hazard_confidence = 0.0
        
        # Determine urgency
        if urgency_scores:
            best_urgency = max(urgency_scores, key=urgency_scores.get)
            urgency_confidence = min(urgency_scores[best_urgency] / 3.0, 1.0)  # Normalize to 0-1
        else:
            best_urgency = "low"
            urgency_confidence = 0.0
        
        # Overall confidence (average of both)
        overall_confidence = (hazard_confidence + urgency_confidence) / 2
        
        return best_hazard, best_urgency, overall_confidence

    def extract_location_mentions(self, text: str) -> List[str]:
        """Extract potential location mentions from text"""
        # Common coastal locations in India
        coastal_locations = [
            "odisha", "kerala", "tamil nadu", "andhra pradesh", "west bengal",
            "goa", "maharashtra", "gujarat", "karnataka", "chennai", "mumbai",
            "kochi", "visakhapatnam", "puri", "goa", "mangalore", "pondicherry"
        ]
        
        mentioned_locations = []
        text_lower = text.lower()
        for location in coastal_locations:
            if location in text_lower:
                mentioned_locations.append(location)
        
        return mentioned_locations

# Backward compatibility function
def classify_post(text: str) -> Tuple[str, str]:
    """Legacy function for backward compatibility"""
    classifier = HazardClassifier()
    hazard_type, urgency, confidence = classifier.classify_post(text)
    return hazard_type, urgency

# Enhanced function with confidence
def classify_post_enhanced(text: str) -> Tuple[str, str, float]:
    """Enhanced classification with confidence scoring"""
    classifier = HazardClassifier()
    return classifier.classify_post(text)

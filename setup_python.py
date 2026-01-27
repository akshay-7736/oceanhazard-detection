#!/usr/bin/env python3
"""
Setup script for Ocean Hazard System Python dependencies
This script installs all required Python packages and sets up the environment
"""

import subprocess
import sys
import os
from pathlib import Path

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed:")
        print(f"Error: {e.stderr}")
        return False

def check_python_version():
    """Check if Python version is compatible"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("❌ Python 3.8 or higher is required")
        print(f"Current version: {version.major}.{version.minor}.{version.micro}")
        return False
    print(f"✅ Python version {version.major}.{version.minor}.{version.micro} is compatible")
    return True

def install_requirements():
    """Install Python requirements"""
    requirements_file = Path("requirements.txt")
    if not requirements_file.exists():
        print("❌ requirements.txt not found")
        return False
    
    return run_command(f"{sys.executable} -m pip install -r requirements.txt", 
                      "Installing Python requirements")

def install_spacy_model():
    """Install spaCy English model"""
    return run_command(f"{sys.executable} -m spacy download en_core_web_sm", 
                      "Installing spaCy English model")

def download_nltk_data():
    """Download required NLTK data"""
    try:
        import nltk
        print("🔄 Downloading NLTK data...")
        nltk.download('punkt', quiet=True)
        nltk.download('vader_lexicon', quiet=True)
        nltk.download('stopwords', quiet=True)
        print("✅ NLTK data downloaded successfully")
        return True
    except Exception as e:
        print(f"❌ Failed to download NLTK data: {e}")
        return False

def create_data_directories():
    """Create necessary data directories"""
    directories = ["data", "data/processed", "data/raw", "data/models"]
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
        print(f"✅ Created directory: {directory}")

def test_imports():
    """Test if all modules can be imported"""
    test_modules = [
        "tweepy",
        "dotenv", 
        "emoji",
        "langdetect",
        "nltk",
        "textblob",
        "geopy",
        "pandas",
        "numpy",
        "sklearn"
    ]
    
    print("🔄 Testing module imports...")
    failed_imports = []
    
    for module in test_modules:
        try:
            __import__(module)
            print(f"✅ {module}")
        except ImportError as e:
            print(f"❌ {module}: {e}")
            failed_imports.append(module)
    
    if failed_imports:
        print(f"\n❌ Failed to import: {', '.join(failed_imports)}")
        return False
    else:
        print("\n✅ All modules imported successfully")
        return True

def main():
    """Main setup function"""
    print("🚀 Setting up Ocean Hazard System Python Environment")
    print("=" * 50)
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    # Install requirements
    if not install_requirements():
        print("❌ Failed to install requirements")
        sys.exit(1)
    
    # Install spaCy model
    if not install_spacy_model():
        print("⚠️  Warning: Failed to install spaCy model")
    
    # Download NLTK data
    if not download_nltk_data():
        print("⚠️  Warning: Failed to download NLTK data")
    
    # Create data directories
    create_data_directories()
    
    # Test imports
    if not test_imports():
        print("❌ Some modules failed to import")
        sys.exit(1)
    
    print("\n" + "=" * 50)
    print("🎉 Python environment setup completed successfully!")
    print("\nNext steps:")
    print("1. Set up your API keys in a .env file")
    print("2. Test the data processing pipeline")
    print("3. Run the social media extractors")

if __name__ == "__main__":
    main()

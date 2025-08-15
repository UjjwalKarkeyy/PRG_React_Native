#!/usr/bin/env python3
"""
Simple script to test the Django API endpoints
"""
import requests
import json

API_BASE_URL = 'http://localhost:8000/api'

def test_endpoint(endpoint, description):
    try:
        response = requests.get(f"{API_BASE_URL}/{endpoint}")
        print(f"\n{description}")
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Response: {json.dumps(data, indent=2)}")
            return True
        else:
            print(f"Error: {response.text}")
            return False
    except Exception as e:
        print(f"Connection Error: {e}")
        return False

if __name__ == "__main__":
    print("Testing Django Doctor Directory API...")
    
    # Test health endpoint
    test_endpoint("health/", "Testing Health Endpoint")
    
    # Test specialties endpoint
    test_endpoint("specialties/", "Testing Specialties Endpoint")
    
    # Test doctors endpoint
    test_endpoint("doctors/", "Testing Doctors Endpoint")
    
    # Test doctors with search
    test_endpoint("doctors/?search=John", "Testing Doctors Search")
    
    # Test doctors with specialty filter
    test_endpoint("doctors/?specialty=Cardiology", "Testing Doctors by Specialty")
    
    print("\n" + "="*50)
    print("API Testing Complete!")

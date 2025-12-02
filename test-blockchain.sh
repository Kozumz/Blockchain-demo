#!/bin/bash

# Blockchain Demo API - Test Script
# This script demonstrates all the functionality of the blockchain API

BASE_URL="http://localhost:8080/api/blocks"

echo "========================================="
echo "Blockchain Demo API - Test Script"
echo "========================================="
echo ""

echo "1. Getting all blocks (should show genesis block)..."
curl -s $BASE_URL | python3 -m json.tool
echo ""
echo ""

echo "2. Adding first transaction..."
curl -s -X POST $BASE_URL \
  -H "Content-Type: application/json" \
  -d '{"data":"Transaction 1: Alice -> Bob 10 BTC"}' | python3 -m json.tool
echo ""
echo ""

echo "3. Adding second transaction..."
curl -s -X POST $BASE_URL \
  -H "Content-Type: application/json" \
  -d '{"data":"Transaction 2: Bob -> Charlie 5 BTC"}' | python3 -m json.tool
echo ""
echo ""

echo "4. Adding third transaction..."
curl -s -X POST $BASE_URL \
  -H "Content-Type: application/json" \
  -d '{"data":"Transaction 3: Charlie -> David 3 BTC"}' | python3 -m json.tool
echo ""
echo ""

echo "5. Getting all blocks..."
curl -s $BASE_URL | python3 -m json.tool
echo ""
echo ""

echo "6. Verifying blockchain integrity (should be VALID)..."
curl -s $BASE_URL/verify | python3 -m json.tool
echo ""
echo ""

echo "7. Modifying block #2 (simulating tampering)..."
curl -s -X PUT $BASE_URL/2 \
  -H "Content-Type: application/json" \
  -d '{"data":"HACKED: Alice -> Hacker 100 BTC"}' | python3 -m json.tool
echo ""
echo ""

echo "8. Verifying blockchain integrity again (should detect tampering)..."
curl -s $BASE_URL/verify | python3 -m json.tool
echo ""
echo ""

echo "========================================="
echo "Test completed!"
echo "========================================="

#!/bin/bash

services=(
  order-svc
  search-svc
  buyings-svc
  deposits-svc
  auctions-svc
  bid-svc
  notify-svc
  user-svc
  identity-svc
  gateway-svc
  web-app
)

for svc in "${services[@]}"; do
  echo "🛠 Tagging image: nguyenthanh/$svc -> nguyenthanh91ndu/nhom6-$svc:latest"
  docker tag nguyenthanh/$svc:latest nguyenthanh91ndu/nhom6-$svc:latest

  echo "🚀 Pushing: nguyenthanh91ndu/nhom6-$svc:latest"
  docker push nguyenthanh91ndu/nhom6-$svc:latest
  echo "✅ Done pushing $svc"
  echo "---------------------------------------------"
done

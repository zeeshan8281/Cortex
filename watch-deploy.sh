#!/bin/bash
# Watches EigenCompute app status every 2 minutes.
# Retries start() until the instance is Running.

APP_ID="0x55e7a9Af23D020745Bd4fc018e707Bc5a6Fb5565"
INTERVAL=120   # seconds between attempts
CHECK_WAIT=20  # seconds after start() before reading status

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "[$(date '+%H:%M:%S')] $1"; }

attempt=0
while true; do
  attempt=$((attempt + 1))
  log "${YELLOW}Attempt #${attempt} — checking status...${NC}"

  STATUS=$(ecloud compute app info "$APP_ID" 2>&1 | grep "Status:" | awk '{print $2}')
  log "Current status: ${STATUS}"

  if [ "$STATUS" = "Running" ]; then
    log "${GREEN}✓ App is RUNNING! Deployment successful.${NC}"
    IP=$(ecloud compute app info "$APP_ID" 2>&1 | grep "IP:" | awk '{print $2}')
    log "${GREEN}IP: ${IP}${NC}"
    ecloud compute app logs "$APP_ID" 2>&1 | head -30
    exit 0
  fi

  # If Failed or Stopped, try to start it
  if [ "$STATUS" = "Failed" ] || [ "$STATUS" = "Stopped" ]; then
    log "Status is ${STATUS} — sending start command..."
    ecloud compute app start "$APP_ID" 2>&1 | tail -1

    log "Waiting ${CHECK_WAIT}s for provisioning..."
    sleep "$CHECK_WAIT"

    NEW_STATUS=$(ecloud compute app info "$APP_ID" 2>&1 | grep "Status:" | awk '{print $2}')
    log "Status after start: ${NEW_STATUS}"

    if [ "$NEW_STATUS" = "Running" ]; then
      log "${GREEN}✓ App is RUNNING!${NC}"
      IP=$(ecloud compute app info "$APP_ID" 2>&1 | grep "IP:" | awk '{print $2}')
      log "${GREEN}IP: ${IP}${NC}"
      ecloud compute app logs "$APP_ID" 2>&1 | head -30
      exit 0
    fi

    log "${RED}Still not running (${NEW_STATUS}). Waiting ${INTERVAL}s before next attempt...${NC}"
  elif [ "$STATUS" = "Deploying" ]; then
    log "Still deploying — waiting ${INTERVAL}s..."
  else
    log "Status: ${STATUS} — waiting ${INTERVAL}s..."
  fi

  sleep "$INTERVAL"
done

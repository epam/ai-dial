#!/bin/sh

DOCKER=${DOCKER:docker}

${DOCKER} compose up -d

while true; do
    if ! ${DOCKER} compose ps | grep 'Exit [1-9]'; then
        sleep 10
        continue
    else
        exit_code=$(${DOCKER} compose ps | grep 'Exit [1-9]' | awk '{print $4}' | grep -o -E '[1-9]+' | head -n 1)
        ${DOCKER} compose down
        exit $exit_code
    fi
done

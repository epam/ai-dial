#!/bin/sh

DOCKER=${DOCKER:-docker}
SLEEP_INTERVAL=${SLEEP_INTERVAL:-10}
NUMBER_OF_CHECKS=${NUMBER_OF_CHECKS:-10}
CURRENT_STEP=0

echo "Starting docker compose..."
${DOCKER} compose up -d

while [ $CURRENT_STEP -lt $NUMBER_OF_CHECKS ]; do
    CURRENT_STEP=$((CURRENT_STEP + 1))

    compose_ps_output=$(${DOCKER} compose ps)
    echo PS output: $compose_ps_output

    exit_matches=$(echo $compose_ps_output | grep -Eo '[E|e]xited \([0-9]+\)')
    echo Exit matches: $exit_matches

    if [ -z "$exit_matches" ]; then
        echo "[$CURRENT_STEP/$NUMBER_OF_CHECKS] Waiting ${SLEEP_INTERVAL}s for notebooks to finish..."
        sleep $SLEEP_INTERVAL
    else
        exit_code=$(echo $exit_matches | awk -F'[()]' '{print $2}')
        echo Exit code: $exit_code

        ${DOCKER} compose down
        exit $exit_code
    fi
done

echo "Number of checks exceeded, exiting with error."
exit 1

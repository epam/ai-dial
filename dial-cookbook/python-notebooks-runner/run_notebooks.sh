#!/bin/sh
set -e

echo "Running notebooks..."

for f in /opt/examples/*.ipynb; do
    echo "Running $f..."
    jupyter nbconvert --to notebook --execute --ExecutePreprocessor.kernel_name=python3 "$f" --output=/app/output.ipynb
done
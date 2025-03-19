#!/bin/sh
set -e

echo "Running notebooks..."

NOTEBOOKS="
how_to_call_image_to_text_applications
how_to_call_text_to_image_applications
how_to_call_text_to_text_applications
"

for nb in $NOTEBOOKS; do
    f="/opt/examples/$nb.ipynb"
    echo "Running $f..."
    jupyter nbconvert --to notebook --execute --ExecutePreprocessor.kernel_name=python3 "$f" --output=/app/output.ipynb
done
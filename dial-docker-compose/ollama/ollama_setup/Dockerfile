FROM python:3.11-alpine
RUN pip install requests
COPY setup.py /setup.py
CMD ["sh", "-c", "python /setup.py && tail -f /dev/null"]

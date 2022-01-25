echo "Starting CORS compliant chrome process w/ http.server in Current Working directory"
start chrome 127.0.10.1:8356
python -m http.server 8356 --bind 127.0.10.1
echo "Done!"
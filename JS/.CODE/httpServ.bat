echo "Starting Working directory http.server for Chrome (CORS) compliance"
cd "../../"
python -m http.server 8356 --bind 127.0.10.1
echo "Done!"
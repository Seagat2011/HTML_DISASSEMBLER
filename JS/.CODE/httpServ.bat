echo "Starting Working directory for Chrome (CORS) compliance"
cd "../../"
echo "Starting http.server"
python -m http.server 8356 --bind 127.0.10.1
echo "Done!"
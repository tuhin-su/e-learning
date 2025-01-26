# Check if node_modules directory exists
if [ ! -d "node_modules" ]; then
    echo "Installing node_modules..."
    npm install
fi

# Check if the mode is DEVELOPMENT
if [[ "$MODE" == "DEVELOPMENT" ]]; then
    echo "Starting development server..."
    # Run ng serve and check if it fails
    ng serve --host 0.0.0.0 --port 5173 --disable-host-check || { echo "ng serve failed. Sleeping indefinitely..."; sleep infinity; }
else
    echo "Starting production server..."
    ng build
fi

echo "Done"

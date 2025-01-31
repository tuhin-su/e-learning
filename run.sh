# Check if .env exists or not
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp -p docker.env .env
    # Ensure environment variables are sourced
    source .env 
else
    source .env 
fi

# Check the MODE and start the server accordingly
if [ "$MODE" == "DEVELOPMENT" ]; then
    echo "Starting development server..."
    docker compose up -d db flask phpmyadmin admin angular mailhog
else
    echo "Starting production server..."
    docker compose up -d db flask phpmyadmin admin angular nginx
fi

echo "Done"
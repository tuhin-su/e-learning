# checl node_module file have or not
if [ ! -d "node_modules" ]; then
    echo "install node_modules"
    npm install
fi

if [[ "$MODE" == "DEVELOPMENT" ]]; then
    echo "start development server"
    ng serve --host 0.0.0.0 --disable-host-check
else
    echo "start production server"
    ng build
fi
echo "done"
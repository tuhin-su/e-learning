if [ ! -d "./node_modules" ]; then
  npm install
fi
check PRODUCTION=true
# if [ "$PRODUCTION" = true ]; then
#   npm run serve
# fi
npm run dev
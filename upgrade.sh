#!/bin/sh
npm run build
echo delete tz_deploy/web/dist
cd ../tz_deploy
git pull
rm -rf web/dist
echo move dist to tz_deploy\web\dist
mv ../tz_web/dist ./web/
git add web\dist\
git commit -m "web"
git push
pause
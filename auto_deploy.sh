#!/usr/bin/env bash
cd /home/www/
rm -rf Nourriture
git clone https://github.com/MHBZHY/Nourriture.git
forever stopall
forever start Nourriture/Server.js
chown 755 Nourriture
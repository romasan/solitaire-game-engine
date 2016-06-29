#!/bin/sh
MODE=gen npm run build
echo "\nmodule.exports = SolitaireEngine" >> ./frontend/js/SolitaireEngine.js

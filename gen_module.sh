#!/bin/sh
MODE=gen npm run build
echo "\ntry{module.exports = SolitaireEngine;}catch(e){}" >> ./frontend/js/SolitaireEngine.js

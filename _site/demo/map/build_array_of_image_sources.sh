#!/bin/bash

FILENAME="imagesUrls.js"

touch "$FILENAME"
echo "imagesToLoad = [" > "$FILENAME"
for file in `find MAPImages -iname "*_h.png" -or -iname "*_a.png"`;do
    echo \"${file#MAPImages/}\", >> "$FILENAME";
done;
echo "];" >> "$FILENAME"
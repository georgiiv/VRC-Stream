# VRCStream

NodeJS and OBS are needed.  
ffmpeg.exe is needed in the main folder (same place main.js is).  
You can get FFMPEG from here: https://ffmpeg.org/download.html#build-windows.  
If you have it installed and in your system path you can just comment out the "ffmpeg.setFfmpegPath("ffmpeg.exe");" line.  

- Run install_dependencies.bat (OR npm install)
- Setup OBS as shown in the "HOW TO SETUP" folder
- Run start.bat (OR node main.js)
- Start streaming in OBS
- Put one of the links into a player within VRC

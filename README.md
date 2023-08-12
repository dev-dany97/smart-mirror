Magic Mirror
IP: <MAGICMIRROR_IP>
SSH: Port 22
VNC: DirectX11
FileTransfer over sftp



Nutzer: dany
PW: <im Passwortmanager>

Installation: Run the command in following repo: https://github.com/sdetweil/MagicMirror_scripts
Offical website: https://magicmirror.builders/
Modules: https://github.com/MagicMirrorOrg/MagicMirror/wiki/3rd-party-modules

Run: 
dany@magic-mirror:~/MagicMirror $ export MM_CONFIG_FILE=config/config-left.js # Es muss die Umgebungsvariable gesetzt werden
dany@magic-mirror:~/MagicMirror $ DISPLAY=:0 npm start -- --config /home/dany/MagicMirror/config/config-left.js

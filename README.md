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
```bash
dany@magic-mirror:/MagicMirror $ export MM_CONFIG_FILE=config/config-left.js # Es muss die Umgebungsvariable gesetzt werden
dany@magic-mirror:/MagicMirror $ DISPLAY=:0 npm start -- --config /home/dany/MagicMirror/config/config-left.js
```

https://kristjanesperanto.github.io/MagicMirror-3rd-Party-Modules/


 Option 1: Start-Skript wartet am Ende (Quick Fix)
 ```bash
 nano /home/dany/MagicMirror/start-magicmirror.sh
 ```

 Am Ende füge das hier hinzu, um das Skript am Leben zu halten:
 ```bash
 #!/bin/bash

export DISPLAY=:0
export MM_CONFIG_FILE=config/config-left.js
npm run start

# Wichtig: blockieren, damit systemd denkt, es läuft noch
tail -f /dev/null
```

Oder – wenn du zwei Instanzen starten willst:
```bash
#!/bin/bash

export DISPLAY=:0
export MM_CONFIG_FILE=config/config-left.js
npm run start &

export DISPLAY=:0
export MM_CONFIG_FILE=config/config-right.js
npm run start &

# Damit das Skript nicht sofort endet:
wait
```


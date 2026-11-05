#!/bin/zsh
# Installs the factory runner as a launchd job that fires every 15 minutes.
# Usage: factory/install.sh [install|uninstall]
set -eu
LABEL="com.wisihe.factory"
PLIST="$HOME/Library/LaunchAgents/$LABEL.plist"
DEST="$HOME/.wisihe-factory"
HERE="${0:A:h}"

if [[ "${1:-install}" == "uninstall" ]]; then
  launchctl bootout "gui/$(id -u)/$LABEL" 2>/dev/null || true
  rm -f "$PLIST"; echo "uninstalled"; exit 0
fi

mkdir -p "$DEST/logs"
cp "$HERE/run.sh" "$DEST/run.sh"; chmod +x "$DEST/run.sh"
cat >"$PLIST" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
  <key>Label</key><string>$LABEL</string>
  <key>ProgramArguments</key><array><string>/bin/zsh</string><string>$DEST/run.sh</string></array>
  <key>StartInterval</key><integer>900</integer>
  <key>RunAtLoad</key><false/>
</dict></plist>
EOF
launchctl bootout "gui/$(id -u)/$LABEL" 2>/dev/null || true
launchctl bootstrap "gui/$(id -u)" "$PLIST"
echo "installed: runs every 15 min; logs in $DEST/logs/runner.log"

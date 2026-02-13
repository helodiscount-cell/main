#!/bin/bash

export SSH_AUTH_SOCK="$XDG_RUNTIME_DIR/ssh-agent.socket"

SESSION="dmbroo"

# Kill existing session
if tmux has-session -t "$SESSION" 2>/dev/null; then
  echo "killing existing session"
  tmux kill-session -t "$SESSION"
fi

echo "starting $SESSION"

# Create session + first window
tmux new-session -d -s "$SESSION" -n main

# Window 1 — main app
tmux send-keys -t "$SESSION":0 \
  "cd ~/projects/dmbro && bun run dev" C-m

# Window 2 — worker
tmux new-window -t "$SESSION" -n worker
tmux send-keys -t "$SESSION":1 \
  "cd ~/projects/dmbro/packages/worker && bun run dev" C-m

# Window 3 — ngrok
tmux new-window -t "$SESSION" -n ngrok
tmux send-keys -t "$SESSION":2 \
  "cd ~/projects/dmbro && ngrok start --config ngrok.yml ia" C-m

# Focus first window
tmux select-window -t "$SESSION":0

# Attach
tmux attach-session -t "$SESSION"
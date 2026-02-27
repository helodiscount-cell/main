#!/bin/bash
export SSH_AUTH_SOCK="$XDG_RUNTIME_DIR/ssh-agent.socket"
SESSION="dmbroo"

# Function to kill process on a port
kill_port() {
    local port=$1
    echo "Checking port $port..."
    local pid=$(lsof -ti:$port)
    if [ ! -z "$pid" ]; then
        echo "Killing process $pid on port $port"
        kill -9 $pid
        sleep 1
    fi
}

# Kill processes on common ports (adjust these to your actual ports)
kill_port 3000  # main app
kill_port 8080  # worker
kill_port 4040  # ngrok

# Kill existing tmux session
if tmux has-session -t "$SESSION" 2>/dev/null; then
    echo "Killing existing tmux session"
    tmux kill-session -t "$SESSION"
fi

echo "Starting $SESSION"

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

# Window 4 — prisma studio
tmux new-window -t "$SESSION" -n prisma-studio
tmux send-keys -t "$SESSION":3 \
    "cd ~/projects/dmbro && bunx prisma studio" C-m

# Focus first window
tmux select-window -t "$SESSION":0

# Attach
tmux attach-session -t "$SESSION"
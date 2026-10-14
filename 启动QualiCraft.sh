#!/bin/sh
# QualiCraft 演示环境 —— 一键启动 / 停止
#
#   ./启动QualiCraft.sh          启动（应用 + 本地桩模型）
#   ./启动QualiCraft.sh stop     停止
#
# 两个服务都只监听 127.0.0.1，仅本机可访问。

set -u

DIR="/Users/chehaijun/WorkBuddy AI/2026-09-27-11-30-14"
REPO="$DIR/qualicraft_eval"
PY="/Users/chehaijun/.workbuddy-ai/binaries/python/versions/3.13.12/bin/python3"
LOGDIR="$DIR/运行日志"

stop_all() {
  pkill -f "run.py --port 8765" 2>/dev/null && echo "  已停止 QualiCraft 应用" || echo "  QualiCraft 应用本来就沒在跑"
  pkill -f "demo_stub_model.py" 2>/dev/null && echo "  已停止本地桩模型" || echo "  本地桩模型本来就沒在跑"
  sleep 1
}

if [ "${1:-}" = "stop" ]; then
  echo "停止中…"
  stop_all
  exit 0
fi

mkdir -p "$LOGDIR"

echo "先清掉可能残留的旧进程…"
stop_all

cd "$REPO" || { echo "找不到仓库目录: $REPO"; exit 1; }

nohup "$PY" run.py --port 8765 --guide-dir "$DIR/Guide" > "$LOGDIR/qualicraft.log" 2>&1 &
nohup "$PY" tools/demo_stub_model.py > "$LOGDIR/stub_model.log" 2>&1 &
sleep 2

echo
if curl -s --noproxy '*' -o /dev/null --max-time 3 http://127.0.0.1:8765/api/bootstrap; then
  echo "✅ QualiCraft 已启动"
else
  echo "⚠️  QualiCraft 好像没起来，看日志: $LOGDIR/qualicraft.log"
fi
if curl -s --noproxy '*' -o /dev/null --max-time 3 http://127.0.0.1:9111/v1/models; then
  echo "✅ 本地桩模型已启动"
else
  echo "⚠️  桩模型好像没起来，看日志: $LOGDIR/stub_model.log"
fi

echo
echo "  应用地址 : http://127.0.0.1:8765"
echo "  桩模型   : http://127.0.0.1:9111/v1"
echo "  数据文件 : $REPO/data/qualicraft.sqlite3"
echo "  日志     : $LOGDIR"
echo
echo "  停止     : ./启动QualiCraft.sh stop"

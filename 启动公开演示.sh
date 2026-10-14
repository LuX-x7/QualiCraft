#!/bin/sh
# 公开演示一键启动 —— 把网站 + 只读工作台通过 Cloudflare 隧道发布到公网
#
#   ./启动公开演示.sh          启动（网站 + 工作台 + 公网隧道）
#   ./启动公开演示.sh stop     全部停止
#
# 三个东西都是本机进程，隧道只是把它们转出去：
#   • 工作台  127.0.0.1:8771  只读演示模式，挂 /w
#   • 网站    127.0.0.1:4404  /w 代理到工作台，/admin 已关闭
#   • 隧道    trycloudflare.com → 8771
#
# 注意：链接只在「这台电脑开机 + 本脚本运行中」有效；电脑休眠或关机后失效，
# 重新运行会得到一个**新的**网址。要长期稳定的链接，用 Render（见 README）。

set -u

DIR="/Users/chehaijun/WorkBuddy AI/2026-09-27-11-30-14/qualicraft_eval"
PY="/Users/chehaijun/.workbuddy-ai/binaries/python/envs/default/bin/python"
NODE="/Users/chehaijun/.workbuddy-ai/binaries/node/versions/22.22.2-6/bin/node"
CLOUDFLARED="$HOME/.workbuddy-ai/bin/cloudflared"
LOGDIR="$DIR/运行日志"
WB_PORT=8771
SITE_PORT=4404

stop_all() {
  pkill -f "run_demo.py" 2>/dev/null && echo "  已停止 工作台" || echo "  工作台 本来就沒在跑"
  pkill -f "website/start.js" 2>/dev/null && echo "  已停止 网站" || echo "  网站 本来就沒在跑"
  pkill -f "cloudflared tunnel --url" 2>/dev/null && echo "  已停止 隧道" || echo "  隧道 本来就沒在跑"
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

echo
echo "1/3 启动工作台（只读演示）…"
cd "$DIR" || exit 1
PORT=$WB_PORT HOST=127.0.0.1 nohup "$PY" run_demo.py >"$LOGDIR/workbench.log" 2>&1 &
sleep 3
if curl -s --noproxy '*' -o /dev/null --max-time 8 "http://127.0.0.1:$WB_PORT/w"; then
  echo "    就绪  http://127.0.0.1:$WB_PORT/w"
else
  echo "    启动失败，看 $LOGDIR/workbench.log"
  exit 1
fi

echo
echo "2/3 启动网站…"
cd "$DIR/website" || exit 1
PORT=$SITE_PORT QUALICRAFT_PUBLIC_SITE=1 QT_WORKBENCH_URL="http://127.0.0.1:$WB_PORT" \
  nohup "$NODE" start.js >"$LOGDIR/website.log" 2>&1 &
sleep 6
if curl -s --noproxy '*' -o /dev/null --max-time 20 "http://127.0.0.1:$SITE_PORT/"; then
  echo "    就绪  http://127.0.0.1:$SITE_PORT/"
else
  echo "    启动失败，看 $LOGDIR/website.log"
  exit 1
fi

echo
echo "3/3 打开公网隧道…"
nohup "$CLOUDFLARED" tunnel --url "http://127.0.0.1:$SITE_PORT" --no-autoupdate \
  >"$LOGDIR/tunnel.log" 2>&1 &

# 隧道地址要几秒才分配下来，从日志里捞。
URL=""
i=0
while [ $i -lt 30 ]; do
  URL=$(grep -oE 'https://[a-z0-9-]+\.trycloudflare\.com' "$LOGDIR/tunnel.log" 2>/dev/null | head -1)
  [ -n "$URL" ] && break
  sleep 1
  i=$((i + 1))
done

echo
if [ -z "$URL" ]; then
  echo "隧道地址没拿到，看 $LOGDIR/tunnel.log"
  exit 1
fi

echo "========================================================"
echo "  公开网址（发给别人测试用这个）"
echo
echo "  网站 + 内嵌工作台：  $URL"
echo
echo "  网站首页：           $URL/"
echo "  工作台直达：          $URL/w"
echo "========================================================"
echo
echo "  验证中…"
curl -s --noproxy '*' -o /dev/null -w "    首页 %{http_code}    " --max-time 30 "$URL/"
curl -s --noproxy '*' -o /dev/null -w "  工作台 %{http_code}\n" --max-time 30 "$URL/w"
echo
echo "停止：./启动公开演示.sh stop"

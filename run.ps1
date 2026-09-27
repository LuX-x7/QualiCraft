param(
  [int]$Port = 8765,
  [string]$GuideDir = "E:\Software\Guide",
  [string]$ApiKeyFile = "E:\Software\API_key.txt",
  [string]$ApiBase = "https://dashscope.aliyuncs.com/compatible-mode/v1",
  [string]$Model = "qwen3.8-flash",
  [switch]$Open
)

$args = @("run.py", "--port", $Port, "--guide-dir", $GuideDir, "--api-base", $ApiBase, "--model", $Model)
if ($ApiKeyFile -and (Test-Path -LiteralPath $ApiKeyFile)) { $args += @("--api-key-file", $ApiKeyFile) }
if ($Open) { $args += "--open" }
python @args

import {proxyWorkbench} from '@/lib/workbench-connection.mjs'
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
type Context = { params: Promise<{ path?: string[] }> }
async function handle(request: Request, context: Context): Promise<Response> {
  return proxyWorkbench(request, (await context.params).path)
}
export const GET = handle
export const POST = handle
export const PUT = handle
export const PATCH = handle
export const DELETE = handle
export const HEAD = handle

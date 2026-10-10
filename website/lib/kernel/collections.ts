/**
 * Kernel · collection definitions
 * ---------------------------------------------------------------------------
 * Each entry here produces, for free: an admin list, an admin form, a public
 * detail page (when `publicPath` is set) and a filterable data source for
 * blocks. Records live in the shared `entries` table — no migration needed.
 *
 * The QT content types live in ./qt-collections and register themselves by
 * being imported; this module is only the kernel-side wiring.
 */

import './qt-collections'

export { registerCollection, getCollection, allCollections } from './types'
export type { CollectionDef } from './types'

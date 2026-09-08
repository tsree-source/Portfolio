/**
 * Does this browser actually give us a WebGL context?
 *
 * Checked once, lazily, and cached. A machine can advertise WebGL and still
 * fail to create a context — blocklisted drivers, a headless environment, a
 * browser with hardware acceleration switched off — so the only trustworthy
 * test is to ask for one and see what comes back.
 */
let cached: boolean | null = null

export function hasWebGL(): boolean {
  if (cached !== null) return cached
  if (typeof window === 'undefined') return (cached = false)

  try {
    const canvas = document.createElement('canvas')
    const gl =
      canvas.getContext('webgl2') ??
      canvas.getContext('webgl') ??
      canvas.getContext('experimental-webgl')

    cached = Boolean(gl)

    // Release the probe context immediately; contexts are a scarce resource.
    if (gl && 'getExtension' in gl) {
      ;(gl as WebGLRenderingContext).getExtension('WEBGL_lose_context')?.loseContext()
    }
  } catch {
    cached = false
  }

  return cached
}

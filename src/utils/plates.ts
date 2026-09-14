/** Standard men's Olympic barbell. Every loadable weight is the bar plus a mirrored pair. */
export const BARBELL_KG = 20

/** Plates available in a typical commercial gym, heaviest first. */
const PLATE_SIZES = [25, 20, 15, 10, 5, 2.5, 1.25] as const

export type PlateSize = (typeof PLATE_SIZES)[number]

/**
 * How to load one side of the bar for `totalKg`, heaviest plate first.
 * Returns null when the weight cannot come from a loaded barbell at all — dumbbells,
 * machines and anything below bar weight — so the caller can stay silent instead of guessing.
 */
export function platesPerSide(totalKg: number, barKg: number = BARBELL_KG): PlateSize[] | null {
    if (!Number.isFinite(totalKg) || totalKg < barKg) return null

    let remaining = (totalKg - barKg) / 2
    const plates: PlateSize[] = []

    for (const plate of PLATE_SIZES) {
        while (remaining >= plate - 0.001) {
            plates.push(plate)
            remaining -= plate
        }
    }

    // Left with a fraction no plate covers (e.g. 63 kg) — not a barbell lift as logged.
    return remaining < 0.01 ? plates : null
}

/** "20 kg bar + 20 + 1.25 per side" — the sentence a lifter would say at the rack. */
export function describeLoad(plates: PlateSize[], barKg: number = BARBELL_KG): string {
    if (plates.length === 0) return `${barKg} kg bar, empty`
    return `${barKg} kg bar + ${plates.join(' + ')} per side`
}

import { BARBELL_KG, describeLoad, platesPerSide, type PlateSize } from '../utils/plates'

/** Plate colour and disc height follow the competition standard, so size reads as weight. */
const PLATE_STYLE: Record<PlateSize, { color: string; height: string; width: string }> = {
    25: { color: 'bg-plate-25', height: 'h-[30px]', width: 'w-[9px]' },
    20: { color: 'bg-plate-20', height: 'h-[26px]', width: 'w-[9px]' },
    15: { color: 'bg-plate-15', height: 'h-[22px]', width: 'w-[9px]' },
    10: { color: 'bg-plate-10', height: 'h-[18px]', width: 'w-[9px]' },
    5: { color: 'bg-plate-5', height: 'h-[14px]', width: 'w-[9px]' },
    2.5: { color: 'bg-plate-sm', height: 'h-[11px]', width: 'w-[6px]' },
    1.25: { color: 'bg-plate-sm', height: 'h-[9px]', width: 'w-[6px]' },
}

interface PlateLoadProps {
    weightKg: number
}

/** Renders nothing when the weight isn't a loadable barbell — dumbbells and machines stay silent. */
export default function PlateLoad({ weightKg }: PlateLoadProps) {
    const plates = platesPerSide(weightKg)
    if (!plates || plates.length === 0) return null

    return (
        <div className="flex items-center gap-0.5">
            <span className="block h-1 w-[26px] shrink-0 bg-steel-dark" aria-hidden="true" />
            {plates.map((plate, index) => {
                const style = PLATE_STYLE[plate]
                return (
                    <span
                        key={`${plate}-${index}`}
                        aria-hidden="true"
                        className={`block shrink-0 rounded-[1px] ${style.color} ${style.height} ${style.width}`}
                    />
                )
            })}
            <span className="ml-2 text-[11px] leading-none text-steel">
                {describeLoad(plates, BARBELL_KG)}
            </span>
        </div>
    )
}

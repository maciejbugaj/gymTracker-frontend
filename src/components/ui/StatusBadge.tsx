import type { ProgramStatus } from '../../types'

/** Status is encoded in colour as well as in the word, so a program's state reads at a glance. */
const STATUS_CLASS: Record<ProgramStatus, string> = {
    ACTIVE: 'bg-good text-white',
    DRAFT: 'bg-plate-20 text-white',
    ARCHIVED: 'bg-platform-600 text-steel',
}

const STATUS_LABEL: Record<ProgramStatus, string> = {
    ACTIVE: 'Active',
    DRAFT: 'Draft',
    ARCHIVED: 'Archived',
}

export default function StatusBadge({ status }: { status: ProgramStatus }) {
    return (
        <span className={`shrink-0 px-2 py-0.5 font-condensed text-[12px] font-semibold tracking-wide ${STATUS_CLASS[status]}`}>
            {STATUS_LABEL[status]}
        </span>
    )
}

import type { PaginationMeta } from '../../types/Pagination'

type PaginationProps = {
    meta: PaginationMeta
    loading?: boolean
    onPageChange: (page: number) => void
}

export function Pagination({ meta, loading = false, onPageChange }: PaginationProps) {
    if (meta.total === 0) return null

    const firstPage = Math.max(1, Math.min(meta.current_page - 2, meta.last_page - 4))
    const lastPage = Math.min(meta.last_page, firstPage + 4)
    const pages = Array.from(
        { length: lastPage - firstPage + 1 },
        (_, index) => firstPage + index,
    )

    return (
        <div className="flex flex-col gap-3 border-t border-gray-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-600">
                Exibindo {meta.from} a {meta.to} de {meta.total} registros
            </p>
            <nav className="flex items-center gap-1" aria-label="Paginação">
                <button
                    type="button"
                    disabled={loading || meta.current_page === 1}
                    onClick={() => onPageChange(meta.current_page - 1)}
                    className="rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Anterior
                </button>
                {pages.map(page => (
                    <button
                        key={page}
                        type="button"
                        disabled={loading}
                        aria-current={page === meta.current_page ? 'page' : undefined}
                        onClick={() => onPageChange(page)}
                        className={`rounded border px-3 py-2 text-sm ${
                            page === meta.current_page
                                ? 'border-blue-600 bg-blue-600 text-white'
                                : 'border-gray-300 text-gray-700'
                        } disabled:cursor-not-allowed disabled:opacity-50`}
                    >
                        {page}
                    </button>
                ))}
                <button
                    type="button"
                    disabled={loading || meta.current_page === meta.last_page}
                    onClick={() => onPageChange(meta.current_page + 1)}
                    className="rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Próxima
                </button>
            </nav>
        </div>
    )
}

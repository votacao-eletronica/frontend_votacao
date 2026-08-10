export type PaginationMeta = {
    current_page: number
    from: number | null
    last_page: number
    per_page: number
    to: number | null
    total: number
}

export type PaginationLinks = {
    first: string | null
    last: string | null
    prev: string | null
    next: string | null
}

export type PaginatedResponse<T> = {
    data: T[]
    links: PaginationLinks
    meta: PaginationMeta
    message?: string
}

export const emptyPagination: PaginationMeta = {
    current_page: 1,
    from: null,
    last_page: 1,
    per_page: 10,
    to: null,
    total: 0,
}

export interface PageProps {
    id: number
    title: string
    description: string
    keywords?: string[]
    content: string
    cover: string
    route: string
    relevant_doctor?: string | string[]
}
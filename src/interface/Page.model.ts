export interface PageModel {
    title: string
    description: string
    keywords: string[] | string;
    content: string
    cover: string
    relevant_doctor?: string | string[]
}
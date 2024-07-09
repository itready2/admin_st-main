
export interface InfoProps {
    id: string;
    title: string;
    description: string;
    cover: string;
    content?: string;
    create_at: string;
    views: number;
    keywords: string[] | string;
    publish?: boolean;
    important: number;
    department?: {
        department_id: number;
        name: string;
    }
}
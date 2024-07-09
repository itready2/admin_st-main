
export interface PromotionProps {
    id: string;
    title: string;
    cover: string;
    price: string;
    max_price?: string;
    create_at: string;
    end_date?: string;
    keywords?: string[] | string;
    description?: string;
    content?: string;
    publish?: boolean;
    important: number;
    department?: {
        department_id: number;
        name: string;
    }
    views: number
    relevant_promotion?: string | string[]
}
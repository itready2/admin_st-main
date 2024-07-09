export interface PromotionModel {
  title: string;
  description: string;
  content: string;
  price: string;
  max_price?: string;
  end_date?: string;
  cover: string;
  keywords: string | string[];
  publish?: boolean;
  important?: number;
  relevant_promotion?: string | string[]
}

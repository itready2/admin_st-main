import axios from "axios";
import { PromotionProps } from "../interface/PromotionProps";
import { PromotionModel } from "../interface/PromotionModel";
import Swal from "sweetalert2";
import DOMPurify from 'dompurify';

export default class getPromotion {
  private readonly headers = {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    "Content-Type": "application/json",
  };

  constructor(
    private readonly EndPoint: string = import.meta.env.VITE_ENDPOINT_URL
  ) {}

  private sanitizeContent(content: string): string {
    return DOMPurify.sanitize(content, {
      ADD_TAGS: ['iframe', 'video', 'source'],
      ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'src', 'type']
    });
  }

  private handlePromotion(promotion: PromotionModel): PromotionModel {
    if (typeof promotion.keywords === "string") {
      promotion.keywords = promotion.keywords.split(", ");
    }
    promotion.content = this.sanitizeContent(promotion.content);
    if (promotion.relevant_promotion !== undefined) {
      if (Array.isArray(promotion.relevant_promotion)) {
        promotion.relevant_promotion = promotion.relevant_promotion.map(String);
      } else if (promotion.relevant_promotion === '') {
        promotion.relevant_promotion = undefined;
      }
    }
    return promotion;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async handleRequest(promise: Promise<any>, successMessage: string, errorMessage: string): Promise<void> {
    try {
      await promise;
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: successMessage,
      });
    } catch (error) {
      console.error(errorMessage, error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
      });
    }
  }

  async getAll(): Promise<PromotionProps[] | []> {
    try {
      const response = await axios.get(`${this.EndPoint}/admin/promotion`, {
        headers: this.headers,
      });
      return response.data as PromotionProps[];
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  }

  async getOne(id: string): Promise<PromotionProps | null> {
    try {
      const response = await axios.get(`${this.EndPoint}/admin/promotion/${id}`, {
        headers: this.headers,
      });
      return response.data as PromotionProps;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  }

  async upload(promotion: PromotionModel): Promise<void> {
    const processedPromotion = this.handlePromotion(promotion);
    await this.handleRequest(
      axios.post(`${this.EndPoint}/admin/promotion`, processedPromotion, {
        headers: this.headers,
      }),
      'Upload Success',
      'Error uploading data'
    );
  }

  async update(slug: string, promotion: PromotionModel): Promise<void> {
    const processedPromotion = this.handlePromotion(promotion);
    await this.handleRequest(
      axios.patch(`${this.EndPoint}/admin/promotion/${slug}`, processedPromotion, {
        headers: this.headers,
      }),
      'Update Success',
      'Error updating data'
    );
  }

  async delete(slug: string): Promise<void> {
    await this.handleRequest(
      axios.delete(`${this.EndPoint}/admin/promotion/${slug}`, {
        headers: this.headers,
      }),
      'Deletion Success',
      'Error deleting data'
    );
  }
}

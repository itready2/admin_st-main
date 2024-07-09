/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { InfoProps } from "../interface/InfoProps";
import { InfoModel } from "../interface/InfoModel";
import Swal from "sweetalert2";
import DOMPurify from "dompurify";

export class News {
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

  private handleKeywords(keywords: string | string[]): string[] {
    return typeof keywords === 'string' ? keywords.split(', ') : keywords;
  }

  private handleNews(news: InfoModel): InfoModel {
    return {
      ...news,
      keywords: this.handleKeywords(news.keywords),
      content: this.sanitizeContent(news.content)
    };
  }

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

  async getAll(): Promise<InfoProps[] | []> {
    try {
      const response = await axios.get(`${this.EndPoint}/admin/news`, { headers: this.headers });
      return response.data as InfoProps[];
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  }

  async getOne(id: string): Promise<InfoProps | null> {
    try {
      const response = await axios.get(`${this.EndPoint}/admin/news/${id}`, { headers: this.headers });
      return response.data as InfoProps;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  }

  async upload(news: InfoModel): Promise<void> {
    const processedNews = this.handleNews(news);
    await this.handleRequest(
      axios.post(`${this.EndPoint}/admin/news`, processedNews, { headers: this.headers }),
      'Upload Success',
      'Error uploading data'
    );
  }

  async update(slug: string, news: InfoModel): Promise<void> {
    const processedNews = this.handleNews(news);
    await this.handleRequest(
      axios.patch(`${this.EndPoint}/admin/news/${slug}`, processedNews, { headers: this.headers }),
      'Update Success',
      'Error updating data'
    );
  }

  async delete(slug: string): Promise<void> {
    await this.handleRequest(
      axios.delete(`${this.EndPoint}/admin/news/${slug}`, { headers: this.headers }),
      'Deleted! Your file has been deleted.',
      'Error deleting data'
    );
  }
}

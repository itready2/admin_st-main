/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { InfoProps } from "../interface/InfoProps";
import { InfoModel } from "../interface/InfoModel";
import Swal from "sweetalert2";
import DOMPurify from "dompurify";

export default class Health {
    private readonly headers = {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
    };

    constructor(
        private readonly EndPoint: string = import.meta.env.VITE_ENDPOINT_URL
    ) { }

    private sanitizeContent(content: string): string {
        return DOMPurify.sanitize(content, {
            ADD_TAGS: ['iframe', 'video', 'source'],
            ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'src', 'type']
        });
    }

    private handleKeywords(keywords: string | string[]): string[] {
        return typeof keywords === 'string' ? keywords.split(', ') : keywords;
    }

    private handleHealth(health: InfoModel): InfoModel {
        return {
            ...health,
            keywords: this.handleKeywords(health.keywords),
            content: this.sanitizeContent(health.content)
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
            const response = await axios.get(`${this.EndPoint}/admin/health`, { headers: this.headers });
            return response.data as InfoProps[];
        } catch (error) {
            console.error("Error fetching data:", error);
            return [];
        }
    }

    async getOne(id: string): Promise<InfoProps | null> {
        try {
            const response = await axios.get(`${this.EndPoint}/admin/health/${id}`, { headers: this.headers });
            return response.data as InfoProps;
        } catch (error) {
            console.error("Error fetching data:", error);
            return null;
        }
    }

    async upload(health: InfoModel): Promise<void> {
        const processedHealth = this.handleHealth(health);
        await this.handleRequest(
            axios.post(`${this.EndPoint}/admin/health`, processedHealth, { headers: this.headers }),
            'Upload Success',
            'Error uploading data'
        );
    }

    async update(slug: string, health: InfoModel): Promise<void> {
        const processedHealth = this.handleHealth(health);
        await this.handleRequest(
            axios.patch(`${this.EndPoint}/admin/health/${slug}`, processedHealth, { headers: this.headers }),
            'Update Success',
            'Error updating data'
        );
    }

    async delete(slug: string): Promise<void> {
        await this.handleRequest(
            axios.delete(`${this.EndPoint}/admin/health/${slug}`, { headers: this.headers }),
            'Deleted! Your file has been deleted.',
            'Error deleting data'
        );
    }
}

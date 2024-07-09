import axios from "axios";
import { ContactProps } from "../interface/ContactProps";

export class Contact {

    constructor(private readonly EndPoint: string = import.meta.env.VITE_ENDPOINT_URL) {

    }

    async getAll(): Promise<ContactProps[] | []> {
        try {
            const contact = await axios.get(`${this.EndPoint}/contact`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            return contact.data;
        } catch (error) {
            console.error('Error fetching contacts:', error);
            return [];
        }
    }

    async getOne(id: string): Promise<ContactProps | null> {
        try {
            const contact = await axios.get(`${this.EndPoint}/contact/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            return contact.data;
        } catch (error) {
            console.error(`Error fetching contact with ID ${id}:`, error);
            return null;
        }
    }

    async remove(id: string): Promise<void> {
        try {
            await axios.delete(`${this.EndPoint}/contact/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
        } catch (error) {
            console.error(`Error fetching contact with ID ${id}:`, error);
            throw new Error('Failed to delete contacts');
        }
    }
}
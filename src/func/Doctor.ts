import axios from "axios";
import { DoctorProps } from "../interface/DoctorProps";
import DOMPurify from "dompurify";
import Swal from "sweetalert2";

export class Doctor {
    constructor(
        private readonly EndPoint: string = import.meta.env.VITE_ENDPOINT_URL
    ) { }

    async getAll(): Promise<DoctorProps[] | []> {
        try {
            const response = await axios.get(`${this.EndPoint}/admin/doctor`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            const news: DoctorProps[] = response.data;
            return news;
        } catch (error) {
            console.error("Error fetching data:", error);
            return [];
        }
    }

    async getOne(slug: string): Promise<DoctorProps | null> {
        try {
            const response = await axios.get(`${this.EndPoint}/admin/doctor/${slug}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            const news: DoctorProps = response.data;
            return news;
        } catch (error) {
            console.error("Error fetching data:", error);
            return null;
        }
    }

    async upload(doctor: DoctorProps) {

        doctor.content = DOMPurify.sanitize(doctor.content, {
            ADD_TAGS: ['iframe', 'video', 'source'],
            ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'src', 'type']
        });

        try {
            await axios.post(`${this.EndPoint}/admin/doctor`, doctor, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    "Content-Type": "application/json",
                },
            });
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Upload Success',
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
            });
            console.error("Error fetching data:", error);
        }
    }

    async update(slug: string, doctor: DoctorProps) {

        doctor.content = DOMPurify.sanitize(doctor.content, {
            ADD_TAGS: ['iframe', 'video', 'source'],
            ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'src', 'type']
        });

        try {
            await axios.patch(`${this.EndPoint}/admin/doctor/${slug}`, doctor, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    "Content-Type": "application/json",
                },
            });

            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Upload Success',
            });
        } catch (error) {
            console.error('Error updating data:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
            });
        }
    }

    async delete(slug: string) {
        try {
            await axios.delete(`${this.EndPoint}/admin/doctor/${slug}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            });
            Swal.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
            )
        } catch (error) {
            console.error('Error updating data:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
            });
        }
    }
}
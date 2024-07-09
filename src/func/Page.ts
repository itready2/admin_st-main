import axios from "axios";
import { PageProps } from "../interface/PageProps";
import { PageModel } from "../interface/Page.model";
import DOMPurify from "dompurify";
import Swal from "sweetalert2";

export class Page {

    private readonly headers = {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
    };

    constructor(
        private readonly EndPoint: string = import.meta.env.VITE_ENDPOINT_URL
    ) { }

    async getPage(slug: string): Promise<PageProps | null> {
        try {
            const response = await axios.get(`${this.EndPoint}/admin/page/${slug}`, {
                headers: this.headers
            });
            const page = response.data;
            return page;
        } catch (error) {
            console.error("Error fetching data:", error);
            return null;
        }
    }

    async update(slug: string, page: PageModel): Promise<void> {
        if (typeof page.keywords === 'string') {
            page.keywords = page.keywords.split(', ');
        }

        page.content = DOMPurify.sanitize(page.content, {
            ADD_TAGS: ['iframe', 'video', 'source'],
            ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'src', 'type']
        });

        if (page.relevant_doctor !== undefined) {
            if (Array.isArray(page.relevant_doctor)) {
                page.relevant_doctor = page.relevant_doctor.map(String);
            } else if (page.relevant_doctor === '') {
                page.relevant_doctor = undefined;
            }
        }

        try {
            await axios.patch(`${this.EndPoint}/admin/page/${slug}`, page, {
                headers: this.headers
            });

            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Update Success',
            });

        } catch (error) {
            console.error("Error fetching data:", error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
            });
        }
    }
}
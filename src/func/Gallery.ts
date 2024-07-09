import axios from "axios";
import Swal from "sweetalert2";

export class Gallery {
    constructor(
        private readonly EndPoint: string = import.meta.env.VITE_ENDPOINT_URL
    ) { }

    async getAll(path: string = ''): Promise<string[] | []> {
        try {
            if (path !== '') {
                const response = await axios.get(`${this.EndPoint}/admin/image/${path}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                });
                const img: string[] = response.data;
                return img;
            } else {
                const response = await axios.get(`${this.EndPoint}/admin/image`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                });
                const img: string[] = response.data;
                return img;
            }

        } catch (error) {
            console.error("Error fetching data:", error);
            return [];
        }
    }

    async getFolderName(): Promise<string[] | []> {
        try {
            const response = await axios.get(`${this.EndPoint}/admin/image/folders`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            const health: string[] = response.data;
            return health;
        } catch (error) {
            console.error("Error fetching data:", error);
            return [];
        }
    }

    async upload(path: string, file: File): Promise<void> {

        try {
            const formData = new FormData();
            formData.append('image', file);

            await axios.post(`${this.EndPoint}/admin/image/${path}`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    async delete(_dir: string, _filename: string): Promise<void> {

        console.log("Deleting", _dir, _filename);
        try {

            await axios.delete(`${this.EndPoint}/admin/image/${_dir}/${_filename}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });

            Swal.fire({
                title: 'Deleted!',
                text: 'The image has been deleted successfully.',
                icon: 'success',
                confirmButtonText: 'OK'
            });

        } catch (error) {
            console.error("Error fetching data:", error);
            Swal.fire({
                title: 'Error!',
                text: 'There was an error deleting the image.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    }

    async CreateFolder(name: string) {
        const foldername = { folderName: name }
        try {

            await axios.post(`${this.EndPoint}/admin/image/folder`, foldername, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });

            Swal.fire({
                title: 'Created!',
                text: 'The Folder has been Created successfully.',
                icon: 'success',
                confirmButtonText: 'OK'
            });

        } catch (error) {
            console.error("Error fetching data:", error);
            Swal.fire({
                title: 'Error!',
                text: 'There was an error create folder.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    }

    async deleteFolder(_dir: string): Promise<void> {

        console.log("Deleting", _dir);
        try {

            await axios.delete(`${this.EndPoint}/admin/image/${_dir}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });

            Swal.fire({
                title: 'Deleted!',
                text: 'The image has been deleted successfully.',
                icon: 'success',
                confirmButtonText: 'OK'
            });

        } catch (error) {
            console.error("Error fetching data:", error);
            Swal.fire({
                title: 'Error!',
                text: 'There was an error deleting the image.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    }
}
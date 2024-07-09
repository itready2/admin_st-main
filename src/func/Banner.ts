import axios from "axios";
import { BannerProps } from "../interface/BannerProps";
import Swal from "sweetalert2";
import { BannerModel } from "../interface/Banner.model";

export class Banner {

  constructor(private readonly EndPoint: string = import.meta.env.VITE_ENDPOINT_URL) { }

  async getAll(): Promise<BannerProps[] | []> {
    try {
      const response = await axios.get(`${this.EndPoint}/banner`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const banner = response.data;
      return banner;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  }

  async getOne(id: string): Promise<BannerModel | null> {
    try {
      const response = await axios.get(
        `${this.EndPoint}/banner/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const banner: BannerModel = response.data;
      return banner;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  }


  async upload(banner: BannerModel) {

    try {
      await axios.post(`${this.EndPoint}/banner`, banner, {
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
      console.error("Error fetching data:", error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
      });
    }
  }

  async update(id: string, banner: BannerModel) {
    try {
      await axios.patch(`${this.EndPoint}/banner/${id}`, banner, {
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
      await axios.delete(`${this.EndPoint}/banner/${slug}`, {
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
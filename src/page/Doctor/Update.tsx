/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useEffect, useRef, useState } from "react"
import { Department } from "../../interface/DepartmentProps";
import { Select, Image, message, Switch } from "antd";

import Styles from './Doctor.module.scss'
import FormStyles from '../../Styles/Form.module.scss';

import JoditEditor from "jodit-react";
import { useNavigate, useParams } from "react-router-dom";
import ImageModal from "../../components/ImageModal/ImageModal";
import ImageDrawer from "../../components/ImageDrawer/ImageDrawer";
import { Doctor } from "../../func/Doctor";
import Swal from "sweetalert2";
import { MdOutlinePublic, MdOutlinePublicOff } from "react-icons/md";
import { DoctorProps } from "../../interface/DoctorProps";

const EndPoint: string = import.meta.env.VITE_ENDPOINT_URL

const Update = () => {
  const editor = useRef(null);
  const navigate = useNavigate();
  const { slug } = useParams();

  const [loading, setLoading] = useState(false);
  const [isModalopen, setModalopen] = useState(false);
  const [depart, setDepart] = useState<Department[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState<DoctorProps>({
    name: '',
    cover: '',
    content: '',
    specialized: '',
    publish: false,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [departmentForm, setDPform] = useState<any>(null);

  const getDepartment = async () => {
    try {
      const response = await axios.get(`${EndPoint}/admin/department`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      const data = response.data
      setDepart(data)
    } catch (error) {
      console.error(error);
      setDepart([])
    }

  }

  useEffect(() => {
    getDepartment()
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (slug) {
        try {
          const doc = new Doctor();
          const data = await doc.getOne(slug);
          console.log(data)

          if (data) {

            setFormData({
              name: data.name || '',
              cover: data.cover || '',
              content: data.content || '',
              specialized: data.specialized || '',
              publish: data.publish || false,
            });

            if (data.departments && data.departments.length > 0) {
              const selectedDepartments = data.departments.map(dept => dept.department_id);
              setDPform(selectedDepartments);
            }

          }
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Failed to fetch data!',
          });
        }
      }
    };
    fetchData();
  }, [slug]);

  const departOption = depart.map((data) => (
    { value: data.department_id, label: `${data.department_id}: ${data.TH_name}` }
  ))

  const handlePublishChange = (is: boolean) => {
    setFormData((prevState) => ({
      ...prevState,
      publish: is,
    }));
  };

  const handleSelectChange = (value: string) => {
    setDPform(value);
  };

  console.log(departmentForm)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };


  const UpdateStateImage = (text: string) => {
    setFormData((prevState) => ({
      ...prevState,
      cover: text,
    }));
    setModalopen(false)
  }

  const handleContentChange = (text: string) => {
    setFormData((prevState) => ({
      ...prevState,
      content: text,
    }));
  };

  const validateForm = () => {
    const formErrors: { [key: string]: string } = {};

    if (!formData.name) formErrors.name = 'ต้องการชื่อ';
    if (!formData.cover) formErrors.cover = 'ต้องการรูปภาพ';
    if (!departmentForm || departmentForm.length === 0) formErrors.departmentForm = 'ต้องการแผนก';
    if (!formData.specialized) formErrors.specialized = 'ต้องการสาขา';

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      message.error('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    const fullDat = {
      ...formData,
      departmentId: departmentForm
    }

    try {
      const doc = new Doctor();
      await doc.update(slug!, fullDat);
      message.success('Doctor uploaded successfully!');
      setTimeout(() => {
        navigate('/doctor')
      }, 2000);
    } catch (error) {
      message.error('Failed to upload promotion.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <main className={Styles['container']}>

      <section className={Styles['form-container']}>
        <h2>แก้ไขข้อมูลแพทย์</h2>

        <div>
          <label>เลือกรูปภาพ</label>
          <div className={Styles['image-preview']}>
            <div>
              {formData.cover ? <Image src={formData.cover} alt="Image Preview" /> : <p>Image</p>}
            </div>
          </div>
          {errors.cover && <span className={FormStyles.errorText}>{errors.cover}</span>}
          <br />
          <div onClick={() => setModalopen(true)} className={Styles['image-upload']}>
            <p style={{ textAlign: 'center' }}>เลือกรูปภาพ</p>
          </div>
        </div>

        <section className={Styles['font-page']}>
          <label>แสดงในส่วนปก</label>
          <br />
          <section className={Styles['form-layout']}>
            <div className={Styles['form-item']}>
              <label>ชื่อ - นามสกุล</label>
              <br />
              <input
                name="name"
                placeholder='ชื่อ - นามสกุล'
                onChange={handleChange}
                value={formData.name}
              />
              {errors.name && <span className={FormStyles.errorText}>{errors.name}</span>}
            </div>

            <div className={Styles['form-item']}>
              <label>สาขา</label>
              <br />
              <input
                name="specialized"
                placeholder='สาขา'
                onChange={handleChange}
                value={formData.specialized}
              />
              {errors.specialized && <span className={FormStyles.errorText}>{errors.specialized}</span>}
            </div>

          </section>
          <br />
          <div className={Styles['form-item']}>
            <label>เลือกแผนก</label>
            <br />
            <Select
              mode="multiple"
              placeholder='เลือกแผนก'
              style={{ width: '100%', border: '1px solid black', borderRadius: 8 }}
              onChange={handleSelectChange}
              value={departmentForm}
              options={departOption}
            />
            {errors.departmentId && <span className={FormStyles.errorText}>{errors.departmentId}</span>}
          </div>
        </section>
        <JoditEditor ref={editor} value={formData.content} onChange={handleContentChange} />
        <div style={{ display: 'flex', alignSelf: 'flex-end', gap: 8 }}>
          <Switch
            checkedChildren={<MdOutlinePublic />}
            unCheckedChildren={<MdOutlinePublicOff />} checked={formData.publish} onChange={handlePublishChange} />
          <button type="button" className={FormStyles.conbtn} onClick={(e) => handleSubmit(e)} disabled={loading}>
            Update
          </button>
        </div>
      </section>
      <ImageModal
        isOpen={isModalopen}
        onClose={() => setModalopen(false)}
        onSelectImage={UpdateStateImage}
      />
      <ImageDrawer />
    </main>
  )
}

export default Update

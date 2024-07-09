import { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Image, Select, message } from 'antd';
import Swal from 'sweetalert2';

import Style from '../../Styles/Page.module.scss';
import FormStyles from '../../Styles/Form.module.scss';

import JoditEditor from 'jodit-react';
import ImageDrawer from '../../components/ImageDrawer/ImageDrawer';

import ImageModal from '../../components/ImageModal/ImageModal';
import { PageModel } from '../../interface/Page.model';
import { Page } from '../../func/Page';
import { DoctorProps } from '../../interface/DoctorProps';
import { Doctor } from '../../func/Doctor';
import Modal from '../../components/Modal/Modal';
import SectionRender from '../../components/SectionRender/SectionRender';

const UpdateHealth: React.FC = () => {
  const editor = useRef(null);
  const { slug } = useParams();
  const navigate = useNavigate();

  const [isModalopen, setModalopen] = useState(false);
  const [ispreviewModalopen, setPreviewModalopen] = useState(false);

  const [formData, setFormData] = useState<PageModel>({
    title: '',
    description: '',
    content: '',
    cover: '',
    keywords: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [linkitem, setLinkitem] = useState<DoctorProps[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [rev, setRev] = useState<any>(null);

  const UpdateStateImage = (text: string) => {
    setFormData((prevState) => ({
      ...prevState,
      cover: text,
    }));
    setModalopen(false)
  }

  useEffect(() => {
    async function getdoctor() {
      const dotor = new Doctor();
      const data = await dotor.getAll()
      setLinkitem(data)
    }
    getdoctor()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      if (slug) {
        try {
          const page = new Page();
          const data = await page.getPage(slug); // Assume getOne is a method to get promotion by slug
          console.log(data)
          if (data) {
            setFormData({
              title: data.title || '',
              description: data.description || '',
              content: data.content || '',
              cover: data.cover || '',
              keywords: data.keywords || ''
            });
            if (data.relevant_doctor) {
              if (Array.isArray(data.relevant_doctor)) {
                const number = data.relevant_doctor.map(Number);
                setRev(number);
              } else if (data.relevant_doctor == '') {
                setRev('');
              }
            }
          }
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Failed to fetch health data!',
          });
        }
      }
    };
    fetchData();
  }, [slug]);

  const handleSelectChange = (value: string) => {
    setRev(value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleContentChange = (text: string) => {
    setFormData((prevState) => ({
      ...prevState,
      content: text,
    }));
  };

  const validateForm = () => {
    const formErrors: { [key: string]: string } = {};

    if (!formData.title) formErrors.title = 'ต้องการหัวเรื่อง';
    if (!formData.cover) formErrors.cover = 'ต้องการรูปภาพ';
    if (!formData.description) formErrors.description = 'ต้องการต้องการรายละเอียด';
    if (formData.keywords.length === 0) formErrors.keywords = 'ต้องการ Keywords';

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

    try {
      const promotion = new Page();
      const mergeData = {
        ...formData,
        relevant_doctor: rev
      }
      await promotion.update(slug!, mergeData);
      message.success('Page updated successfully!');
      navigate('/');
    } catch (error) {
      message.error('Failed to update Page.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={Style.body}>
      <h2 className={FormStyles.h2}>แก้ไข</h2>
      <ImageDrawer />
      <form className={FormStyles.form} >
        <label>SEO Content</label>
        <section className={Style.SEO}>
          <label htmlFor="promotion" className={FormStyles.Hlabel}>
            รูปภาพ*
          </label>
          <div className={FormStyles.imageupload}>
            <div className={FormStyles.imagePreview}>
              {formData.cover ? <Image src={formData.cover} alt="Image Preview" /> : <p>Image</p>}
            </div>
            <div onClick={() => setModalopen(true)} className={`${FormStyles['image-upload']} ${errors.cover ? FormStyles.errorInput : ''}`}>
              <p style={{ textAlign: 'center' }}>เลือกรูปภาพ</p>
            </div>
            {errors.cover && <span className={FormStyles.errorText}>{errors.cover}</span>}
          </div>
          <br />

          <label htmlFor="title" className={FormStyles.Hlabel}>
            หัวเรื่อง*
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder='หัวเรื่อง'
            className={errors.title ? FormStyles.errorInput : ''}
          />
          {errors.title && <span className={FormStyles.errorText}>{errors.title}</span>}
          <br />

          <label htmlFor="description" className={FormStyles.Hlabel}>
            รายละเอียด*
          </label>
          <textarea
            id="description"
            name="description"
            className={`${FormStyles.areafield} ${errors.description ? FormStyles.errorInput : ''}`}
            value={formData.description}
            onChange={handleChange}
            placeholder='รายละเอียด'
          />
          {errors.description && <span className={FormStyles.errorText}>{errors.description}</span>}
          <br />

          <label htmlFor="keywords" className={FormStyles.Hlabel}>
            Keywords (แบ่งโดยใช้จุลภาค ,)*
          </label>
          <input
            type="text"
            id="keywords"
            name="keywords"
            value={formData.keywords}
            onChange={handleChange}
            placeholder='Keywords (แบ่งโดยใช้จุลภาค)'
            className={errors.keywords ? FormStyles.errorInput : ''}
          />
          {errors.keywords && <span className={FormStyles.errorText}>{errors.keywords}</span>}
        </section>

        <br />
        <label>แพทย์ที่เกี่ยวข้อง (ตัวเลือก)</label>
        <Select
          mode="multiple"
          placeholder="เลือกแพทย์ที่เกี่ยวข้อง"
          style={{ width: '100%', border: '1px solid black', borderRadius: 8 }}
          options={
            linkitem.map((name) => (
              {
                value: name.id,
                label: `${name.id}: ${name.name}`
              }
            ))
          }
          onChange={handleSelectChange}
          value={rev}
        />
        <br />
        <label htmlFor="content" className={FormStyles.Hlabel}>
          เนื้อหา
        </label>
        <JoditEditor ref={editor} value={formData.content} onChange={handleContentChange} />
        <br />
        <div style={{ display: 'flex', alignSelf: 'flex-end', gap: 8, alignItems: 'center' }}>
          <button className={FormStyles.draftbtn} disabled={loading} onClick={(e) => { e.preventDefault(); setPreviewModalopen(true) }}>
            Preview
          </button>
          <button className={FormStyles.conbtn} disabled={loading} onClick={handleSubmit}>
            {loading ? 'Updating...' : 'Update'}
          </button>
        </div>
      </form>
      <ImageModal
        isOpen={isModalopen}
        onClose={() => setModalopen(false)}
        onSelectImage={UpdateStateImage}
      />
      <Modal isOpen={ispreviewModalopen} onClose={() => setPreviewModalopen(false)} title='Preview Content' size='large'>
        <section style={{ padding: '0 10%', overflowY: 'auto' }}>
          <SectionRender content={formData.content} />
        </section>
      </Modal>
    </main>
  );
};

export default UpdateHealth;

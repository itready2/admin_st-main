import { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Image, Switch, message } from 'antd';
import Swal from 'sweetalert2';

import Style from '../../Styles/Page.module.scss';
import FormStyles from '../../Styles/Form.module.scss';

import JoditEditor from 'jodit-react';
import ImageDrawer from '../../components/ImageDrawer/ImageDrawer';

import { MdOutlinePublicOff, MdOutlinePublic } from "react-icons/md";
import { InfoModel } from '../../interface/InfoModel';
import Health from '../../func/Health';
import ImageModal from '../../components/ImageModal/ImageModal';

const UpdateHealth: React.FC = () => {
  const editor = useRef(null);
  const { slug } = useParams();
  const navigate = useNavigate();

  const [isModalopen, setModalopen] = useState(false);
  const [formData, setFormData] = useState<InfoModel>({
    title: '',
    description: '',
    content: '',
    cover: '',
    keywords: '',
    departmentId: '13',
    publish: false,
    important: 0
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const UpdateStateImage = (text: string) => {
    setFormData((prevState) => ({
      ...prevState,
      cover: text,
    }));
    setModalopen(false)
  }


  useEffect(() => {
    const fetchData = async () => {
      if (slug) {
        try {
          const health = new Health();
          const data = await health.getOne(slug); // Assume getOne is a method to get promotion by slug
          console.log(data)
          if (data) {
            setFormData({
              title: data.title || '',
              description: data.description || '',
              content: data.content || '',
              cover: data.cover || '',
              keywords: data.keywords || '',
              publish: data.publish || false,
              important: data.important || 0,
              departmentId: '13'
            });
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

  const handlePublishChange = (is: boolean) => {
    setFormData((prevState) => ({
      ...prevState,
      publish: is,
    }));
  };

  const validateForm = () => {
    const formErrors: { [key: string]: string } = {};

    if (!formData.title) formErrors.title = 'ต้องการหัวเรื่อง';
    if (!formData.cover) formErrors.cover = 'ต้องการรูปภาพ';
    if (!formData.description) formErrors.description = 'ต้องการต้องการรายละเอียด';
    if (!formData.keywords) formErrors.keywords = 'ต้องการ Keywords';

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
      const promotion = new Health();
      await promotion.update(slug!, formData);
      message.success('Promotion updated successfully!');
      navigate('/health-info');
    } catch (error) {
      message.error('Failed to update promotion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={Style.body}>
      <h2 className={FormStyles.h2}>แก้ไขสาระความรู้สุขภาพ</h2>
      <ImageDrawer />
      <form className={FormStyles.form} onSubmit={handleSubmit}>
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
        <label>SEO Content</label>
        <section className={Style.SEO}>
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

        <div className={FormStyles.split}>
          <div className={FormStyles.half}>
            <label htmlFor="important" className={FormStyles.Hlabel}>
              ความสำคัญ * (สูงสุด 4)
            </label>
            <input
              min={0}
              max={4}
              type="number"
              id="important"
              name="important"
              value={formData.important}
              onChange={handleChange}
              placeholder='ความสำคัญ(สูงสุด 4)'
            />
          </div>
        </div>
        <br />

        <label htmlFor="content" className={FormStyles.Hlabel}>
          เนื้อหา (ตัวเลือก)
        </label>
        <JoditEditor ref={editor} value={formData.content} onChange={handleContentChange} />
        <br />
        <div style={{ display: 'flex', alignSelf: 'flex-end', gap: 8, alignItems: 'center' }}>
          <Switch
            checkedChildren={<MdOutlinePublic />}
            unCheckedChildren={<MdOutlinePublicOff />} checked={formData.publish} onChange={handlePublishChange} />
          <button type="submit" className={FormStyles.conbtn} disabled={loading}>
            {loading ? 'Updating...' : 'Update'}
          </button>
        </div>
      </form>
      <ImageModal
        isOpen={isModalopen}
        onClose={() => setModalopen(false)}
        onSelectImage={UpdateStateImage}
      />
    </main>
  );
};

export default UpdateHealth;

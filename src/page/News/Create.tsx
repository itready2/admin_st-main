import { useRef, useState } from 'react';
import { Image, message } from 'antd';

import Style from '../../Styles/Page.module.scss';
import FormStyles from '../../Styles/Form.module.scss';

import JoditEditor from 'jodit-react';
import ImageDrawer from "../../components/ImageDrawer/ImageDrawer";
import { InfoModel } from '../../interface/InfoModel';
import { News } from '../../func/News';
import { useNavigate } from 'react-router-dom';

import ImageModal from '../../components/ImageModal/ImageModal';

const Create: React.FC = () => {
  const editor = useRef(null);
  const navigate = useNavigate();

  const [isModalopen, setModalopen] = useState(false);
  const [formData, setFormData] = useState<InfoModel>({
    title: '',
    cover: '',
    description: '',
    content: '',
    keywords: '',
    publish: false,
    important: 0,
    departmentId: '13',
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
    if (!formData.keywords) formErrors.keywords = 'ต้องการ Keywords';

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent, publish: boolean) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      message.error('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    const { ...dataToUpload } = formData;

    const filteredData = {
      ...dataToUpload,
      publish: publish
    };

    try {
      const health = new News();
      await health.upload(filteredData);
      message.success('Promotion uploaded successfully!');
      setTimeout(() => {
        navigate('/news')
      }, 2000);
    } catch (error) {
      message.error('Failed to upload News.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={Style.body}>
      <h2 className={FormStyles.h2}>สร้างข่าวสาร</h2>
      <ImageDrawer />
      <form className={FormStyles.form}>
        <label htmlFor="cover" className={FormStyles.Hlabel}>
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
        <br />

        <div className={FormStyles.split}>
          <div className={FormStyles.half} style={{ opacity: 0 }}>
            <label htmlFor="important" className={FormStyles.Hlabel}>
              ความสำคัญ *
            </label>
            <input
              disabled
              min={0}
              max={3}
              type="number"
              id="important"
              name="important"
              value={formData.important}
              onChange={handleChange}
              placeholder='ความสำคัญ'
            />
          </div>
        </div>
        <br />

        <label htmlFor="content" className={FormStyles.Hlabel}>
          เนื้อหา (ตัวเลือก)
        </label>
        <JoditEditor ref={editor} value={formData.content} onChange={handleContentChange} />
        <br />
        <div style={{ display: 'flex', alignSelf: 'flex-end', gap: 8 }}>
          <button type="button" className={FormStyles.draftbtn} onClick={(e) => handleSubmit(e, false)} disabled={loading}>
            Save Draft
          </button>
          <button type="button" className={FormStyles.conbtn} onClick={(e) => handleSubmit(e, true)} disabled={loading}>
            Publish
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

export default Create;

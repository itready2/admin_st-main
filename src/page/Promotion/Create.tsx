import { useEffect, useRef, useState } from 'react';
import { Image, Select, message } from 'antd';
import { PromotionModel } from '../../interface/PromotionModel';
import getPromotion from '../../func/Promotion';

import Style from '../../Styles/Page.module.scss';
import FormStyles from '../../Styles/Form.module.scss';

import JoditEditor from 'jodit-react';
import ImageDrawer from "../../components/ImageDrawer/ImageDrawer";
import { useNavigate } from 'react-router-dom';
import ImageModal from '../../components/ImageModal/ImageModal';
import { PromotionProps } from '../../interface/PromotionProps';

const CreatePromotion: React.FC = () => {
  const navigate = useNavigate();
  const editor = useRef(null);

  const [isModalopen, setModalopen] = useState(false);
  const [formData, setFormData] = useState<PromotionModel>({
    title: '',
    cover: '',
    description: '',
    price: '',
    content: '',
    max_price: '',
    end_date: '',
    keywords: '',
    publish: false,
    important: 0,
    relevant_promotion: ''
  });


  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [linkitem, setLinkitem] = useState<PromotionProps[]>([]);


  useEffect(() => {
    const getData = async () => {
      const content = await new getPromotion().getAll()
      if (content) {
        setLinkitem(content)
      }
    }
    getData();

  }, []);

  const handleSelectChange = (value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      relevant_promotion: value,
    }));
  };

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

    if (!formData.title) formErrors.title = 'ต้องการหัวเรื่อง';
    if (!formData.cover) formErrors.cover = 'ต้องการรูปภาพ';
    if (!formData.description) formErrors.description = 'ต้องการต้องการรายละเอียด';
    if (!formData.price) formErrors.price = 'ต้องการราคา';
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

    const { max_price, end_date, ...dataToUpload } = formData;

    const filteredData = {
      ...dataToUpload,
      ...(max_price && { max_price }),
      ...(end_date && { end_date }),
      publish: publish
    };

    try {
      const promotion = new getPromotion();
      await promotion.upload(filteredData);
      setTimeout(() => {
        navigate('/promotion')
      }, 2000);
    } catch (error) {
      message.error('Failed to upload promotion.');
    } finally {
      message.success('Promotion uploaded successfully!');
      setLoading(false);
    }
  };

  return (
    <main className={Style.body}>
      <h2 className={FormStyles.h2}>สร้างโปรโมชั่น</h2>
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
            <label htmlFor="price" className={FormStyles.Hlabel}>
              ราคา*
            </label>
            <input
              min={0}
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder='ราคาเริ่มต้น'
              className={errors.price ? FormStyles.errorInput : ''}
            />
            {errors.price && <span className={FormStyles.errorText}>{errors.price}</span>}
          </div>
          <div className={FormStyles.half}>
            <label htmlFor="max_price" className={FormStyles.Hlabel}>
              ราคาสูงสุด (ตัวเลือก)
            </label>
            <input
              type="number"
              id="max_price"
              name="max_price"
              value={formData.max_price}
              onChange={handleChange}
              placeholder='ราคามากสุด'
            />
          </div>
        </div>
        <br />

        <div className={FormStyles.split}>
          <div className={FormStyles.half}>
            <label htmlFor="end_date" className={FormStyles.Hlabel}>
              เวลาสิ้นสุด (ตัวเลือก)
            </label>
            <input
              type="date"
              id="end_date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
            />
          </div>
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

        <label>โปรโมชั่นที่เกี่ยวข้อง (สูงสุด 3 และเป็นตัวเลือก)</label>
        <Select
          mode="multiple"
          maxCount={3}
          placeholder="เลือกโปรโมชั่นที่เกี่ยวข้อง"
          style={{ width: '100%', border: '1px solid black', borderRadius: 8 }}
          options={
            linkitem.map((name) => (
              {
                value: name.id,
                label: `${name.id}: ${name.title}`
              }
            ))
          }
          onChange={handleSelectChange}
        />
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

export default CreatePromotion;

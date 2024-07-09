import { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Image, Select, Switch, message } from 'antd';
import getPromotion from '../../func/Promotion';
import Swal from 'sweetalert2';

import Style from '../../Styles/Page.module.scss';
import FormStyles from '../../Styles/Form.module.scss';

import JoditEditor from 'jodit-react';
import { PromotionModel } from '../../interface/PromotionModel';
import ImageDrawer from '../../components/ImageDrawer/ImageDrawer';

import { MdOutlinePublicOff, MdOutlinePublic } from "react-icons/md";
import ImageModal from '../../components/ImageModal/ImageModal';
import { PromotionProps } from '../../interface/PromotionProps';

const UpdatePromotion: React.FC = () => {
  const editor = useRef(null);
  const { slug } = useParams();
  const navigate = useNavigate();

  const [isModalopen, setModalopen] = useState(false);
  const [formData, setFormData] = useState<PromotionModel>({
    title: '',
    description: '',
    price: '',
    content: '',
    max_price: '',
    end_date: '',
    cover: '',
    keywords: '',
    publish: false,
    important: 0
  });

  const [linkitem, setLinkitem] = useState<PromotionProps[]>([]);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
    const fetchData = async () => {
      if (slug) {
        try {
          const promotion = new getPromotion();
          const data = await promotion.getOne(slug); // Assume getOne is a method to get promotion by slug
          const promodata = await promotion.getAll()
          setLinkitem(promodata)
          console.log(data)
          if (data) {
            setFormData({
              title: data.title || '',
              description: data.description || '',
              price: data.price || '',
              content: data.content || '',
              max_price: data.max_price || '',
              end_date: data.end_date ? new Date(data.end_date).toISOString().split('T')[0] : '',
              cover: data.cover || '',
              keywords: data.keywords || '',
              publish: data.publish || false,
              important: data.important || 0
            });

            if (data.relevant_promotion) {
              if (Array.isArray(data.relevant_promotion)) {
                const number = data.relevant_promotion.map(Number);
                setRev(number);
              } else if (data.relevant_promotion == '') {
                setRev('');
              }
            }
          }
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Failed to fetch promotion data!',
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
    if (!formData.price) formErrors.price = 'ต้องการราคา';
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

    const { max_price, end_date, ...dataToUpload } = formData;

    const filteredData = {
      ...dataToUpload,
      ...(max_price && { max_price }),
      ...(end_date && { end_date }),
      relevant_promotion: rev
    };

    try {
      const promotion = new getPromotion();
      await promotion.update(slug!, filteredData);
      message.success('Promotion updated successfully!');
      navigate('/promotion');
    } catch (error) {
      message.error('Failed to update promotion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={Style.body}>
      <h2 className={FormStyles.h2}>แก้ไขโปรโมชั่น</h2>

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
            <label htmlFor="price" className={FormStyles.Hlabel}>
              ราคา*
            </label>
            <input
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
              min={0}
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
          <div className={FormStyles.half}>
            <label htmlFor="important" className={FormStyles.Hlabel}>
              ความสำคัญ * (สูงสุด 3)
            </label>
            <input
              min={0}
              max={3}
              type="number"
              id="important"
              name="important"
              value={formData.important}
              onChange={handleChange}
              placeholder='ความสำคัญ (สูงสุด 3)'
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
          value={rev}
        />
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

export default UpdatePromotion;

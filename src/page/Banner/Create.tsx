import { useEffect, useState } from 'react';
import { Gallery } from '../../func/Gallery';
import Modal from '../../components/Modal/Modal';
import { Button, Image, message } from 'antd';
import { MdContentCopy } from 'react-icons/md';

import Styles from './Banner.module.scss'
import GalleryStyle from '../gallery/gallery.module.scss'
import { useNavigate } from 'react-router-dom';
import { Banner } from '../../func/Banner';

const Create = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string[]>([]);
  const [isModalopen, setModalopen] = useState(false);
  const [baner, setBanner] = useState({
    image: '',
    link: '',
    publish: false,
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBanner((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const UpdateStateImage = (text: string) => {
    setBanner((prevState) => ({
      ...prevState,
      image: text,
    }));
    setModalopen(false)
  }

  useEffect(() => {
    const getData = async () => {
      const contact = await new Gallery().getAll();
      setImage(contact);
    };
    getData();
  }, [isModalopen]);

  const validateForm = () => {
    const formErrors: { [key: string]: string } = {};

    if (!baner.image) formErrors.title = 'ต้องการรูปภาพ';
    if (!baner.link) formErrors.cover = 'ต้องการลิ้ง';


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

    const filteredData = {
      ...baner,
      publish: publish
    };

    console.log(filteredData)

    try {
      const banners = new Banner();
      await banners.upload(filteredData);
      message.success('banners uploaded successfully!');
      setTimeout(() => {
        navigate('/banner')
      }, 2000);
    } catch (error) {
      message.error('Failed to upload banners.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={Styles['form-continer']}>

      <h1>เพิ่มแบนเนอร์</h1>
      <form>
        <label htmlFor="banner">เลือกรูปแบนเนอร์</label>
        <div id='banner' className={Styles.preview}>
          {baner.image ? <Image src={baner.image} alt="Image Preview" /> : <p>Image</p>}
        </div>
        <br />
        <div onClick={() => setModalopen(true)} className={Styles['image-button']}>
          <p style={{ textAlign: 'center' }}>เลือกรูปภาพ</p>
        </div>
        {errors.image && <span className={Styles.errorText}>{errors.image}</span>}

        <br />

        <label htmlFor="link">แทรกลิ้งก์</label>
        <br />
        <input type="text"
          id='link'
          name='link'
          placeholder='แทรกลิ้งก์'
          className={Styles['link-input']}
          value={baner.link}
          onChange={handleChange} />
        {errors.link && <span className={Styles.errorText}>{errors.link}</span>}

      </form>
      <br />
      <div style={{ display: 'flex', alignSelf: 'flex-end', gap: '1rem' }}>
        <button type="button" className={Styles.draftbtn} onClick={(e) => handleSubmit(e, false)} disabled={loading}>
          Save Draft
        </button>
        <button className={Styles['upload-button']} disabled={loading} onClick={(e) => handleSubmit(e, true)}>
          อัปโหลด
        </button>
      </div>

      <Modal isOpen={isModalopen} onClose={() => setModalopen(false)} size='large' button={true} title='เลือกรูปภาพ' >
        <section style={{ overflowY: 'scroll' }}>
          <br />
          <div className={GalleryStyle.gallery}>
            {image.map((imageUrl, index) => (
              <>
                <div key={index} className={GalleryStyle.imageContainer}>
                  <Image src={imageUrl} alt="" loading="lazy" />
                  <Button
                    type="text"
                    icon={<MdContentCopy />}
                    onClick={() => UpdateStateImage(imageUrl)}
                  >
                    Select
                  </Button>
                </div>
              </>
            ))}

          </div>
        </section>
      </Modal>
    </main>
  )
}

export default Create



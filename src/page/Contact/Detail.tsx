import { useParams } from "react-router-dom";
import { ContactProps } from "../../interface/ContactProps";
import { useEffect, useState } from "react";
import { format, parseISO } from 'date-fns';
import { Contact } from "../../func/Contact";

import Styles from './Contact.module.scss'

const Detail = () => {

  const { slug } = useParams();

  const [contact, setContact] = useState<ContactProps | null>();

  useEffect(() => {
    const getContact = async () => {
      const contact = await new Contact().getOne(slug!)
      setContact(contact)
    }
    getContact();
  }, [slug])

  return (
    <main className={Styles['view-container']}>
      {contact ? (
        <article className={Styles['content-container']}>
          <h4>ชื่อผู้ติดต่อ</h4>
          <div className={Styles['content']}><p>{contact.name}</p></div>
          <h4 style={{ marginTop: 8 }}>อีเมล</h4>
          <div className={Styles['content']}><p>{contact.email}</p></div>
          <h4 style={{ marginTop: 8 }}>หมายเลขโทรศัพท์</h4>
          <div className={Styles['content']}><p>{contact.phone}</p></div>
          <h4 style={{ marginTop: 8 }}>วันที่ส่ง</h4>
          <div className={Styles['content']}><p>{format(parseISO(contact.create_at), 'dd/MM/yyyy HH:mm')}</p></div>
          <br />
          <h4>เนื้อหา</h4>
          <div className={Styles['detail']}><p>{contact.detail}</p></div>

        </article>
      ) : (
        <p>Loading contact details...</p>
      )}
    </main>
  )
}

export default Detail

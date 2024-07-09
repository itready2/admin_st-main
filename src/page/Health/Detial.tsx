import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import Style from '../../Styles/Page.module.scss'

import { TiThMenu } from "react-icons/ti";
import { BiExport } from "react-icons/bi";
import { AiOutlineEdit } from "react-icons/ai";

import { Image, FloatButton } from "antd";
import SectionRender from "../../components/SectionRender/SectionRender";
import Health from "../../func/Health";
import { InfoProps } from "../../interface/InfoProps";

const Detial = () => {

    const { slug } = useParams();

    const navigate = useNavigate();

    const [promotion, setPromotion] = useState<InfoProps | null>();

    useEffect(() => {
        const getContact = async () => {
            const contact = await new Health().getOne(slug!)
            setPromotion(contact)
        }
        getContact();
    }, [slug])

    if (!promotion) {
        return <></>
    }

    return (
        <main className={Style['view-box']}>
            <FloatButton.Group
                trigger="click"
                style={{ right: '5%' }}
                type="primary"
                icon={<TiThMenu />}
            >
                <FloatButton icon={<BiExport />} tooltip={<div>Export</div>} />
                <FloatButton icon={<AiOutlineEdit />} tooltip={<div>Edit</div>} onClick={() => navigate(`/update/health-info/${slug}`)}/>
            </FloatButton.Group>

            <h1>{promotion.title}</h1>
            <Image src={promotion.cover} alt={promotion.title} className={Style['image-view']} />
            <article className={Style['content-view']}>
                <p style={{ fontSize: '14pt' }}>{promotion.description}</p>
                {promotion.content ? (
                    <SectionRender content={promotion.content} />
                ) : (
                    <></>
                )}

            </article>
        </main>
    )
}

export default Detial

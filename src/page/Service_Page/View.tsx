import { useEffect, useState } from "react"
import { PageProps } from "../../interface/PageProps"
import { Page } from "../../func/Page"
import { useNavigate, useParams } from "react-router-dom";
import SectionRender from "../../components/SectionRender/SectionRender";

import Style from '../../Styles/Page.module.scss'
import { FloatButton } from "antd";
import { TiThMenu } from "react-icons/ti";
import { BiExport } from "react-icons/bi";
import { AiOutlineEdit } from "react-icons/ai";


const View = () => {

    const { slug } = useParams();

    const navigate = useNavigate();

    const [page, setPage] = useState<PageProps | null>(null)

    useEffect(() => {
        const get = async () => {
            const data = await new Page().getPage(slug!)
            setPage(data)
        }
        get()
    }, [slug])

    if (page === null) {
        return (
            <main className={Style['view-box']}>
                <h1>ไม่พบ</h1>
            </main>
        )
    } else {
        return (
            <main className={Style['view-box']}>
                <FloatButton.Group
                    trigger="click"
                    style={{ right: '5%' }}
                    type="primary"
                    icon={<TiThMenu />}
                >
                    <FloatButton icon={<BiExport />} tooltip={<div>Export</div>} />
                    <FloatButton icon={<AiOutlineEdit />} tooltip={<div>Edit</div>} onClick={() => navigate(`/update/page/${slug}`)} />
                </FloatButton.Group>
                <SectionRender content={page.content} />
            </main>
        )
    }

}

export default View

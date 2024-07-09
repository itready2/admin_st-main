import { FloatButton } from "antd"
import { AiOutlineEdit } from "react-icons/ai"
import { BiExport } from "react-icons/bi"
import { TiThMenu } from "react-icons/ti"
import { useNavigate, useParams } from "react-router-dom"

const Detial = () => {
    const { slug } = useParams();
    const navigate = useNavigate();

    return (
        <div>
            <FloatButton.Group
                trigger="click"
                style={{ right: '5%' }}
                type="primary"
                icon={<TiThMenu />}
            >
                <FloatButton icon={<BiExport />} tooltip={<div>Export</div>} />
                <FloatButton icon={<AiOutlineEdit />} tooltip={<div>Edit</div>} onClick={() => navigate(`/update/doctor/${slug}`)} />
            </FloatButton.Group>

        </div>
    )
}

export default Detial

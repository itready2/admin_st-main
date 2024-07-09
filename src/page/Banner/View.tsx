import { Link, useNavigate } from 'react-router-dom';
import { BannerProps } from '../../interface/BannerProps';
import { Space, Image, Button, Table } from 'antd';
import Swal from 'sweetalert2';

import Styles from './Banner.module.scss'
import TStyles from '../../Styles/Table.module.scss'

import { Banner } from '../../func/Banner';
import { useEffect, useState } from 'react';
import { exportToXLSX } from '../../func/XLSX';
import { FaArrowRotateLeft } from 'react-icons/fa6';
import { MdDriveFolderUpload } from 'react-icons/md';
import { BiDetail, BiExport } from 'react-icons/bi';
import { IoTrashBinOutline } from 'react-icons/io5';

const columns = [
    {
        title: 'Image',
        dataIndex: 'image',
        key: 'image',
        className: TStyles['image-column'],
        render: (text: string) => <Image src={text} className={TStyles['image-custom']} loading='lazy' />,
    },
    {
        title: 'Link',
        dataIndex: 'link',
        key: 'link',
        className: TStyles['title-column'],
        render: (text: string) => <a href={text} >{text}</a>,

    },
    {
        title: 'Publish',
        dataIndex: 'publish',
        key: 'publish',
        className: TStyles['publish-column'],
        render: (i: boolean) => (
            <Space size="middle">
                <p style={{ color: i ? 'green' : 'red', fontWeight: 'bold' }}>
                    {i ? 'Publish' : 'Unpublish'}
                </p>
            </Space>
        ),
    },
    {
        title: 'Action',
        key: 'action',
        className: TStyles['action-column'],
        render: (i: BannerProps) => (
            <Space size="middle">
                <Link to={`/update/banner/${i.id}`}><Button shape='circle' icon={<BiDetail />} /></Link>
                <Button shape='circle' danger icon={<IoTrashBinOutline />} onClick={() => Handledelete(i.id)} />
            </Space>
        ),
    },
];

const Handledelete = async (slug: string) => {
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    })

    if (result.isConfirmed) {
        await new Banner().delete(slug)
        window.location.reload()
    }
}


const View = () => {

    const navigate = useNavigate();

    const [banner, setBanner] = useState<BannerProps[]>([]);
    const [refresh, setRefresh] = useState<boolean>(false);

    const refreshContent = () => {
        setRefresh(!refresh);
    };

    useEffect(() => {
        const getData = async () => {
            const content = await new Banner().getAll()
            setBanner(content)
            console.log(content)
        }
        getData();
    }, [refresh])

    const exportfile = async () => {
        exportToXLSX(banner);
    };
    return (
        <main className={Styles.container}>
            <div className={Styles.tableWrapper}>
                <header className={Styles.head}>
                    <h2>แบนเนอร์</h2>
                    {/* refresh data */}
                    <div style={{ display: 'flex', gap: 8 }}>
                        <Button shape="circle" icon={<FaArrowRotateLeft />} onClick={() => refreshContent()} title="refresh" />
                        <Button icon={<BiExport />} onClick={() => exportfile()}>
                            Export
                        </Button>
                        <Button type="primary" icon={<MdDriveFolderUpload />} onClick={() => navigate('/create/banner')}>
                            Upload
                        </Button>
                    </div>
                </header>
                <Table
                    rowKey="id"
                    dataSource={banner}
                    columns={columns}
                    className={TStyles["custom-table"]} />
            </div>
        </main>
    )
}

export default View

import { format, parseISO } from 'date-fns';

import Styles from './News.module.scss'
import TStyles from '../../Styles/Table.module.scss';

import { Button, Image, Space, Table } from 'antd';
import { useEffect, useState } from "react";
import { FaArrowRotateLeft } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom"
import { InfoProps } from "../../interface/InfoProps";

import { IoTrashBinOutline } from 'react-icons/io5';
import { BiDetail, BiExport } from 'react-icons/bi';
import { MdDriveFolderUpload } from 'react-icons/md';
import { exportToXLSX } from '../../func/XLSX';
import { News } from '../../func/News';
import Swal from 'sweetalert2';

const columns = [
  {
    title: 'Cover',
    dataIndex: 'cover',
    key: 'cover',
    className: TStyles['image-column'],
    render: (text: string) => <Image src={text} className={TStyles['image-custom']} loading='lazy' />,
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    className: TStyles['title-column'],
    sorter: (a: InfoProps, b: InfoProps) => a.title.localeCompare(b.title),
  },
  {
    title: 'Date',
    dataIndex: 'create_at',
    key: 'date',
    className: TStyles['date-column'],
    render: (text: string) => format(parseISO(text), 'dd/MM/yyyy HH:mm'),
    sorter: (a: InfoProps, b: InfoProps) => {
      return (
        new Date(a.create_at).getTime() - new Date(b.create_at).getTime()
      );
    },
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    ellipsis: true,
    className: TStyles['detail-column']
  },
  {
    title: 'Views',
    dataIndex: 'views',
    key: 'views',
    className: TStyles['price-column'],
    sorter: (a: InfoProps, b: InfoProps) => a.views - b.views,
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
    title: 'Important',
    dataIndex: 'important',
    key: 'important',
    className: TStyles['price-column'],
    sorter: (a: InfoProps, b: InfoProps) => a.important - b.important,
  },
  {
    title: 'Action',
    key: 'action',
    className: TStyles['action-column'],
    render: (i: InfoProps) => (
      <Space size="middle">
        <Link to={`/news/${i.id}`}><Button shape='circle' icon={<BiDetail />} /></Link>
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
    await new News().delete(slug)
    window.location.reload()
  }
}

const View = () => {
  const navigate = useNavigate();

  const [news, setNews] = useState<InfoProps[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false);

  const refreshContent = () => {
    setRefresh(!refresh);
  };

  useEffect(() => {
    const getContact = async () => {
      const contact = await new News().getAll()
      setNews(contact)
      console.log(contact)

    }
    getContact();
  }, [refresh])

  const exportfile = async () => {
    exportToXLSX(news);
  };


  return (
    <main className={Styles.container}>
      <div className={Styles.tableWrapper}>
        <header className={Styles.head}>
          <h2>ข้อมูลข่าวสาร</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button shape="circle" icon={<FaArrowRotateLeft />} onClick={() => refreshContent()} title="refresh" />
            <Button icon={<BiExport />} onClick={() => exportfile()}>
              Export
            </Button>
            <Button type="primary" icon={<MdDriveFolderUpload />} onClick={() => navigate('/create/news')}>
              Upload
            </Button>
          </div>
        </header>
        <Table
          dataSource={news}
          columns={columns}
          className={TStyles["custom-table"]} />
      </div>
    </main>
  )
}

export default View

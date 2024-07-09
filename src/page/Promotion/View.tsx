import { format, parseISO } from 'date-fns';

import Styles from '../../Styles/Page.module.scss'
import TStyles from '../../Styles/Table.module.scss';
import PStyles from './Promotion.module.scss';

import { PromotionProps } from "../../interface/PromotionProps";
import { Button, Image, Space, Table } from 'antd';
import { useEffect, useState } from "react";

import { FaArrowRotateLeft } from "react-icons/fa6";
import { BiExport, BiDetail } from "react-icons/bi";
import { MdDriveFolderUpload } from "react-icons/md";
import { IoTrashBinOutline } from "react-icons/io5";

import { Link, useNavigate } from "react-router-dom"
import { exportToXLSX } from '../../func/XLSX';
import getPromotion from '../../func/Promotion';
import Swal from 'sweetalert2';


const columns = [
  {
    title: 'Cover',
    dataIndex: 'cover',
    key: 'cover',
    className: PStyles['image-col'],
    render: (text: string) => <Image src={text} loading='lazy' />,
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    className: TStyles['title-column'],
    sorter: (a: PromotionProps, b: PromotionProps) => a.title.localeCompare(b.title),
  },
  {
    title: 'Date',
    dataIndex: 'create_at',
    key: 'date',
    className: TStyles['date-column'],
    render: (text: string) => format(parseISO(text), 'dd/MM/yyyy HH:mm'),
    sorter: (a: PromotionProps, b: PromotionProps) => {
      return (
        new Date(a.create_at).getTime() - new Date(b.create_at).getTime()
      );
    },
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
    className: TStyles['price-column'],
  },
  {
    title: 'Max-Price',
    dataIndex: 'max_price',
    key: 'max_price',
    className: TStyles['price-column'],
    render: (i: number) => (
      i !== 0 ? (i) : ('')
    )
  },
  {
    title: 'Views',
    dataIndex: 'views',
    key: 'views',
    className: TStyles['price-column'],
    sorter: (a: PromotionProps, b: PromotionProps) => a.views - b.views,
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
    sorter: (a: PromotionProps, b: PromotionProps) => a.important - b.important,
  },
  {
    title: 'Action',
    key: 'action',
    className: TStyles['action-column'],
    render: (i: PromotionProps) => (
      <Space size="middle">
        <Link to={`/promotion/${i.id}`}><Button shape='circle' icon={<BiDetail />} /></Link>
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
    await new getPromotion().delete(slug)
    window.location.reload()
  }
}

const View = () => {

  const navigate = useNavigate();

  const [promotion, setPromotion] = useState<PromotionProps[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false);

  const refreshContent = () => {
    setRefresh(!refresh);
  };

  useEffect(() => {
    const getData = async () => {
      const content = await new getPromotion().getAll()
      setPromotion(content)
    }
    getData();
  }, [refresh])

  const exportfile = async () => {
    exportToXLSX(promotion);
  };

  return (
    <main className={Styles.container}>
      <div className={Styles.tableWrapper}>
        <header className={Styles.head}>
          <h2>ข้อมูลโปรโมชั่น</h2>
          {/* refresh data */}
          <div style={{ display: 'flex', gap: 8 }}>
            <Button shape="circle" icon={<FaArrowRotateLeft />} onClick={() => refreshContent()} title="refresh" />
            <Button icon={<BiExport />} onClick={() => exportfile()}>
              Export
            </Button>
            <Button type="primary" icon={<MdDriveFolderUpload />} onClick={() => navigate('/create/promotion')}>
              Upload
            </Button>

          </div>
        </header>
        <Table
          rowKey="id"
          dataSource={promotion}
          columns={columns}
          className={TStyles["custom-table"]} />
      </div>
    </main>
  )
}

export default View

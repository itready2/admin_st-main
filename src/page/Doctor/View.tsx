import { Link, useNavigate } from "react-router-dom";
import { DoctorProps } from "../../interface/DoctorProps";

import Styles from './Doctor.module.scss'
import TStyles from '../../Styles/Table.module.scss';

import { Button, Image, Space, Table } from 'antd';
import { IoTrashBinOutline } from "react-icons/io5";
import Swal from "sweetalert2";
import { BiDetail, BiExport } from "react-icons/bi";
import { useEffect, useState } from "react";
import { exportToXLSX } from "../../func/XLSX";
import { FaArrowRotateLeft } from "react-icons/fa6";
import { MdDriveFolderUpload } from "react-icons/md";
import { Doctor } from "../../func/Doctor";
import { Department } from "../../interface/DepartmentProps";

const columns = [
  {
    title: 'Cover',
    dataIndex: 'cover',
    key: 'cover',
    className: Styles['doc-image'],
    render: (text: string) => <Image src={text} className={TStyles['image-custom']} loading='lazy' />,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    className: TStyles['title-column'],
    sorter: (a: DoctorProps, b: DoctorProps) => a.name.localeCompare(b.name),
  },
  {
    title: 'Department',
    dataIndex: 'departments',
    key: 'departments',
    className: TStyles['title-column'],
    render: (departments = []) => (
      <div>
        {departments.map((department: Department, index) => (
          <div key={index}>
            <p>{department.ShortName}: {department.TH_name}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: 'Specialized',
    dataIndex: 'specialized',
    key: 'specialized',
    className: TStyles['title-column']
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
    render: (i: DoctorProps) => (
      <Space size="middle">
        <Link to={`/doctor/${i.id}`}><Button shape='circle' icon={<BiDetail />} /></Link>
        <Button shape='circle' danger icon={<IoTrashBinOutline />} onClick={() => { i.id && Handledelete(i.id) }} />
      </Space>
    ),
  },
];

const Handledelete = async (slug: string) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: `You won't be able to revert this! ${slug}`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  })

  if (result.isConfirmed) {
    await new Doctor().delete(slug);
    window.location.reload()
  }
}

const View = () => {

  const navigate = useNavigate();

  const [news, setNews] = useState<DoctorProps[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false);

  const refreshContent = () => {
    setRefresh(!refresh);
  };

  useEffect(() => {
    const getContact = async () => {
      const contact = await new Doctor().getAll()
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
            <Button type="primary" icon={<MdDriveFolderUpload />} onClick={() => navigate('/create/doctor')}>
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

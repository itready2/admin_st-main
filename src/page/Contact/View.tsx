import { useState, useEffect } from "react"
import { ContactProps } from "../../interface/ContactProps"

import Styles from "./Contact.module.scss"
import TStyles from '../../Styles/Table.module.scss'

import { BiExport } from "react-icons/bi";
import { Button, Space, Table } from "antd";
import { FaArrowRotateLeft } from "react-icons/fa6";

import { format, parseISO } from 'date-fns';
import { Link } from "react-router-dom"
import { exportToXLSX } from "../../func/XLSX";
import { Contact } from "../../func/Contact";
import Swal from "sweetalert2";

const View = () => {

  const [contact, setContact] = useState<ContactProps[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false);

  const columns = [
    {
      title: 'Date',
      dataIndex: 'create_at',
      key: 'date',
      className: TStyles['date-column'],
      render: (text: string) => format(parseISO(text), 'dd/MM/yyyy HH:mm'),
      sorter: (a: ContactProps, b: ContactProps) => {
        return (
          new Date(a.create_at).getTime() - new Date(b.create_at).getTime()
        );
      },

    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      className: TStyles['name-column'],
      sorter: (a: ContactProps, b: ContactProps) => a.name.localeCompare(b.name),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      className: TStyles['name-column'],
      sorter: (a: ContactProps, b: ContactProps) => a.email.localeCompare(b.email),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      className: TStyles['name-column']
    },
    {
      title: 'Detail',
      dataIndex: 'detail',
      key: 'detail',
      ellipsis: true,
      className: TStyles['detail-column']
    },
    {
      title: 'Action',
      key: 'action',
      className: TStyles['action-column'],
      render: (i: ContactProps) => (
        <Space size="middle">
          <Link to={`/contact/${i.id}`}>Detail</Link>
          <a onClick={() => handleDeleteClick(i.id.toString())}>Delete</a>
        </Space>
      ),
    },
  ];

  const handleDeleteClick = (id: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this contact!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await new Contact().remove(id).then(
          () => {
            Swal.fire(
              'Deleted!',
              'Your contact has been deleted.',
              'success'
            )
            setRefresh(!refresh)
          }
        )
      }
    });
  };

  useEffect(() => {
    const getContact = async () => {
      const contact = await new Contact().getAll()
      setContact(contact)
    }
    getContact();
  }, [refresh])

  const exportfile = async () => {
    exportToXLSX(contact);
  };

  const refreshContacts = () => {
    setRefresh(!refresh);
  };
  return (
    <main className={Styles.container}>
      <div className={Styles.tableWrapper}>
        <header className={Styles.head}>
          <h2>ข้อมูลการติดต่อ</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button type="primary" shape="circle" icon={<FaArrowRotateLeft />} onClick={() => refreshContacts()} title="refresh" />
            <Button type="primary" icon={<BiExport />} onClick={() => exportfile()}>
              Export
            </Button>
          </div>
        </header>
        <Table
          rowKey="id"
          dataSource={contact}
          columns={columns}
          className={TStyles["custom-table"]}
          rowClassName={TStyles["custom-row"]} />
      </div>
    </main>
  )
}

export default View

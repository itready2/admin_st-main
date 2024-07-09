import { Button, Flex, FloatButton, Image, Modal, Select, Space, Upload, message } from "antd";
import { useEffect, useState } from "react";
import { Gallery } from "../../func/Gallery";
import { FaArrowRotateLeft, FaUpload } from "react-icons/fa6";
import { MdContentCopy, MdDriveFolderUpload, MdOutlineFileDownload, MdOutlineFolderDelete } from "react-icons/md";

import LocalStyle from './gallery.module.scss'
import PageStyle from '../../Styles/Page.module.scss'
import { TiThMenu } from "react-icons/ti";
import { RiDeleteBinLine, RiZoomInLine, RiZoomOutLine } from "react-icons/ri";
import Swal from "sweetalert2";
import { LuFolderPlus } from "react-icons/lu";

const View = () => {

    const [image, setImage] = useState<string[]>([]);
    const [dir, setDir] = useState<string[]>([]);

    const [refresh, setRefresh] = useState<boolean>(false);
    const [uploadModalVisible, setUploadModalVisible] = useState<boolean>(false);
    const [delModalVisible, setDelModalVisible] = useState<boolean>(false);

    const [pathKey, setPathKey] = useState<string>('');

    const [path, setPath] = useState<string>('');
    const [uploadFile, setUpload] = useState<File | null>(null)

    const [delpath, setDelPath] = useState<string>('');


    const refreshContent = () => {
        setRefresh(!refresh);
    };

    useEffect(() => {
        const getData = async () => {
            const galleryIn = new Gallery()
            const contact = await galleryIn.getAll(pathKey)
            setImage(contact)
            const _dir = await galleryIn.getFolderName()
            setDir(_dir)
        }
        getData();
    }, [refresh, pathKey])

    //onClick={() => navigate('/create/health')}

    const handleDownload = async (imageUrl: string) => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            const timestamp = new Date().getTime();
            link.setAttribute("download", `image_${timestamp}.jpg`);
            document.body.appendChild(link);
            link.click();

            // Cleanup
            URL.revokeObjectURL(url);
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error downloading the image:", error);
        }

    };

    const handleCopyUrl = (imageUrl: string) => {
        navigator.clipboard.writeText(imageUrl);
        message.success("Image URL copied to clipboard!");
    };

    const handleUpload = async () => {
        if (uploadFile && (path !== '')) {
            await new Gallery().upload(path, uploadFile).then(() => {
                message.success("Image uploaded successfully!");
                setUploadModalVisible(false);
                setUpload(null);
                setPath('')
                refreshContent();
            }).catch(() => {
                message.success("Image uploaded Fail!");
            })
        } else {
            message.error("Image uploaded Fail!");
            console.log('Image FilenotFound',);
        }
    };

    const handleDelete = async (url: string) => {
        const confirmation = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (confirmation.isConfirmed) {

            const PathMatch = url.match(/\/uploads\/([^/]+)\//);
            const PartName = PathMatch ? PathMatch[1] : null;

            const filenameMatch = url.match(/\/([^/]+)$/);
            const filename = filenameMatch ? filenameMatch[1] : null;

            await new Gallery().delete(PartName!, filename!).then(() => {
                refreshContent();
            }).catch(() => {
                Swal.fire(
                    'Error!',
                    'There was an error deleting the image.',
                    'error'
                );
            });
        }
    };

    const createFolder = async () => {
        const { value: folderName } = await Swal.fire({
            title: 'Create new folder',
            input: 'text',
            inputLabel: 'ตั้งชื่อโฟลเดอร์ (เมื่อสร้างแล้วไม่สามารถเปลี่ยนชื่อได้)',
            inputPlaceholder: 'Enter folder name',
            showCancelButton: true,
            confirmButtonText: 'Create',
            cancelButtonText: 'Cancel',
            inputValidator: (value) => {
                if (!value) {
                    return 'You need enter folder name!';
                }
            }
        });

        if (folderName) {
            await new Gallery().CreateFolder(folderName)
            refreshContent();
            console.log(`Folder created with name: ${folderName}`);
        }
    };

    const handleRemoveFolder = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'เมื่อกดแล้วจะลบรูปภาพทั้งหมดในโฟลเดอร์ และ ไม่สามารถย้อนกลับได้',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            await new Gallery().deleteFolder(delpath);
            setDelPath('');
            setDelModalVisible(false);
            refreshContent();
        }
    }

    return (

        <main className={PageStyle['view-box']}>
            <header >
                <h2>รูปภาพในระบบ</h2>
                <br />
                <Flex gap="small" wrap>
                    <Button
                        type={pathKey === '' ? 'primary' : 'default'}
                        onClick={() => setPathKey('')}>
                        รูปภาพทั้งหมด
                    </Button>
                    {dir.map((name, index) => (
                        <Button key={index}
                            type={pathKey === name ? 'primary' : 'default'}
                            onClick={() => setPathKey(name)}>
                            {name}
                        </Button>
                    ))}

                </Flex>

                <FloatButton.Group
                    trigger="click"
                    style={{ right: '5%' }}
                    type="primary"
                    icon={<TiThMenu />}>

                    <FloatButton
                        icon={<FaArrowRotateLeft />}
                        onClick={() => refreshContent()}
                        tooltip={<div>Refresh</div>} />
                    <FloatButton
                        icon={<MdOutlineFolderDelete />}
                        onClick={() => setDelModalVisible(true)}
                        tooltip={<div>Delete Folder</div>} />
                    {/* <FloatButton
                        icon={<LuFolderEdit />}
                        // onClick={() => setUploadModalVisible(true)}
                        tooltip={<div>Change Name Folder</div>} /> */}
                    <FloatButton
                        icon={<LuFolderPlus />}
                        onClick={() => createFolder()}
                        tooltip={<div>Add Folder</div>} />
                    <FloatButton
                        icon={<FaUpload />}
                        onClick={() => setUploadModalVisible(true)}
                        tooltip={<div>Upload</div>} />
                </FloatButton.Group>
                <br />
            </header>
            <div className={LocalStyle.gallery}>
                {image.map((imageUrl, index) => (
                    <div key={index} className={LocalStyle.imageContainer}>
                        <Image src={imageUrl} alt="" loading="lazy"
                            preview={{
                                toolbarRender: (
                                    _,
                                    {
                                        actions: {
                                            onZoomOut,
                                            onZoomIn,
                                        },
                                    },
                                ) => (
                                    <Space size={24} className={LocalStyle["toolbar-image"]}>
                                        <MdOutlineFileDownload className={LocalStyle["toolbar-icon"]} onClick={() => handleDownload(imageUrl)} />
                                        <RiDeleteBinLine className={LocalStyle["toolbar-icon"]} onClick={() => handleDelete(imageUrl)} />
                                        <RiZoomOutLine className={LocalStyle["toolbar-icon"]} onClick={onZoomOut} />
                                        <RiZoomInLine className={LocalStyle["toolbar-icon"]} onClick={onZoomIn} />
                                    </Space>
                                ),
                            }} />
                        <div className={LocalStyle.toolbar}>
                            <Button
                                type="text"
                                icon={<MdContentCopy />}
                                onClick={() => handleCopyUrl(imageUrl)}>
                                Copy URL
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
            <Modal
                title="Upload Image"
                open={uploadModalVisible}
                onCancel={() => setUploadModalVisible(false)}
                onOk={handleUpload}
                footer={[
                    <Button key="cancel" onClick={() => setUploadModalVisible(false)}>
                        Cancel
                    </Button>,
                    <Button key="upload" type="primary" onClick={handleUpload}>
                        OK
                    </Button>,
                ]}            >
                <section className={LocalStyle.upload}>
                    <Select
                        placeholder="Select Folder"
                        options={
                            dir.map((name) => (
                                {
                                    value: name,
                                    label: name
                                }
                            ))
                        }
                        value={path}
                        onChange={(value: string) => setPath(value)}
                    />
                    <Upload
                        accept="image/*"
                        customRequest={({ file }) => setUpload(file as File)}
                        showUploadList={false}
                    >
                        <Button icon={<MdDriveFolderUpload />} >Click to Upload Image</Button>
                    </Upload>
                    {uploadFile && (
                        <div className={LocalStyle.preview}>
                            <img src={URL.createObjectURL(uploadFile)} alt="Uploaded Preview" />
                        </div>
                    )}
                </section>
            </Modal>

            <Modal
                title="Select Folder"
                open={delModalVisible}
                onCancel={() => setDelModalVisible(false)}
                onOk={handleRemoveFolder}
                footer={[
                    <Button key="cancel" onClick={() => setDelModalVisible(false)}>
                        Cancel
                    </Button>,
                    <Button key="upload" type="primary" onClick={handleRemoveFolder}>
                        OK
                    </Button>,
                ]}            >
                <section className={LocalStyle.upload}>
                    <Select
                        placeholder="Select Folder"
                        options={
                            dir.map((name) => (
                                {
                                    value: name,
                                    label: name
                                }
                            ))
                        }
                        value={delpath}
                        onChange={(value: string) => setDelPath(value)}
                    />
                </section>
            </Modal>
        </main>
    )
}

export default View

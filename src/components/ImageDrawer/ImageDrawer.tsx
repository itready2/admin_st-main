import { Button, Drawer, FloatButton, Image, Modal, Select, Upload, message } from "antd";
import { useEffect, useState } from "react";
import { MdContentCopy, MdDriveFolderUpload, MdOutlineImage } from "react-icons/md";
import { Gallery } from "../../func/Gallery";

import Styles from "./ImageDrawer.module.scss"

const ImageDrawer = () => {

    const [image, setImage] = useState<string[]>([]);
    const [uploadModalVisible, setUploadModalVisible] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);

    const [dir, setDir] = useState<string[]>([]);
    const [pathKey, setPathKey] = useState<string>('');
    const [path, setPath] = useState<string>('');
    const [uploadFile, setUpload] = useState<File | null>(null)
    const [refresh, setRefresh] = useState<boolean>(false);

    useEffect(() => {
        const getData = async () => {
            const galleryIn = new Gallery()
            const contact = await galleryIn.getAll(pathKey)
            setImage(contact)
            const _dir = await galleryIn.getFolderName()
            setDir(_dir)
        }
        getData();
    }, [pathKey, refresh])

    const handleCopyUrl = (imageUrl: string) => {
        navigator.clipboard.writeText(imageUrl);
        message.success("Image URL copied to clipboard!");
    };

    const refreshContent = () => {
        setRefresh(!refresh);
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

    const pathFile = dir.map((name) => (
        {
            value: name,
            label: name
        }
    ))

    return (
        <>
            <FloatButton
                type="primary"
                style={{ right: '5%' }}
                icon={<MdOutlineImage />}
                onClick={() => setOpen(true)}
                tooltip={<div>Open image picker</div>} />

            <Drawer
                title="Image Picker"
                onClose={() => setOpen(false)}
                open={open}
                extra={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Button
                            icon={<MdDriveFolderUpload />}
                            shape="circle"
                            onClick={() => setUploadModalVisible(true)} />
                        <Select
                            style={{ width: 120 }}
                            defaultValue={''}
                            placeholder="Select Folder"
                            options={[
                                {
                                    value: '',
                                    label: 'All'
                                },
                                ...pathFile
                            ]}
                            onChange={(value: string) => setPathKey(value)}
                        />

                    </div>
                }>

                {image.map((imageUrl, index) => (
                    <>
                        <div key={index} className={Styles.card}>
                            <Image src={imageUrl} alt="" loading="lazy" />
                            <Button
                                type="text"
                                icon={<MdContentCopy />}
                                onClick={() => handleCopyUrl(imageUrl)}>
                                Copy URL
                            </Button>
                        </div>
                        <br />
                        <hr />
                        <br />
                    </>
                ))}
            </Drawer>
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
                <section className={Styles.upload}>
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
                        <div className={Styles.preview}>
                            <img src={URL.createObjectURL(uploadFile)} alt="Uploaded Preview" />
                        </div>
                    )}
                </section>
            </Modal>
        </>
    );
};

export default ImageDrawer
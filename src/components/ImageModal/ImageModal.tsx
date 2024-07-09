import { useEffect, useState } from 'react';
import { Button, Flex, Image } from 'antd';
import Modal from '../../components/Modal/Modal';
import { MdContentCopy } from 'react-icons/md';
import GalleryStyle from '../../page/gallery/gallery.module.scss';
import { Gallery } from '../../func/Gallery';

interface ImageSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectImage: (imageUrl: string) => void;
}

const ImageModal: React.FC<ImageSelectionModalProps> = ({ isOpen, onClose, onSelectImage }) => {
    const [image, setImage] = useState<string[]>([]);
    const [dir, setDir] = useState<string[]>([]);
    const [pathKey, setPathKey] = useState<string>('');

    useEffect(() => {
        const getData = async () => {
            const galleryIn = new Gallery()
            const contact = await galleryIn.getAll(pathKey)
            setImage(contact)
            const _dir = await galleryIn.getFolderName()
            setDir(_dir)
        }
        getData();
    }, [pathKey])

    return (
        <Modal isOpen={isOpen} onClose={onClose} size='large' button={true} title='เลือกรูปภาพ'>
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
            <section style={{ overflowY: 'scroll' }}>
                <br />
                <div className={GalleryStyle.gallery}>
                    {image.map((imageUrl, index) => (
                        <div key={index} className={GalleryStyle.imageContainer}>
                            <Image src={imageUrl} alt="" loading="lazy" />
                            <Button
                                type="text"
                                icon={<MdContentCopy />}
                                onClick={() => onSelectImage(imageUrl)}
                            >
                                Select
                            </Button>
                        </div>
                    ))}
                </div>
            </section>
        </Modal>
    );
};

export default ImageModal;

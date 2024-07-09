import Styles from './SectionRender.module.scss'
import DOMPurify from 'dompurify';

//ใว้ Render เนื้อหาในหน้า โปรโมชั่น ข่าวสาร สุขภาพ และหน้าแต่ละแผนก
interface SectionRenderProps {
   content: string;
}

const SectionRender: React.FC<SectionRenderProps> = ({ content }) => {

   const sanitizedContent = DOMPurify.sanitize(content, {
      ADD_TAGS: ['iframe', 'video', 'source'],
      ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'src', 'type']
   });

   return <section className={Styles.wrap} dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
};

export default SectionRender
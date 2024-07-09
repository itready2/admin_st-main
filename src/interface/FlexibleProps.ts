export interface Incontent {
    text: string;
}

export interface Section {
    tag: string;
    content: Incontent[];
}

export interface FlexibleProps {
    section: Section;
}

export interface ClinicData {
    clinic: string;
    content: FlexibleProps[];
}

export interface ContentProps {
    content: FlexibleProps[];
}
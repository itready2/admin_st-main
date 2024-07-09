import { Department } from "./DepartmentProps";

export interface DoctorProps {
    id?: string;
    name: string;
    cover: string;
    specialized: string;
    content: string;
    publish: boolean;
    department?: Department[] | Department
    departments?: Department[]

}
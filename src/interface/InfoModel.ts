export interface InfoModel {
  title: string;
  description: string;
  content: string;
  departmentId: string;
  cover: string;
  keywords: string[] | string;
  publish?: boolean;
  important?: number;
}

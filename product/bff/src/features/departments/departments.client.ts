import { Injectable } from "@nestjs/common";
import { UpstreamDepartment } from "./types/departments.type";

const MOCK_DEPARTMENTS: UpstreamDepartment[] = [
  { departmentId: "dept-01", departmentName: "内科" },
  { departmentId: "dept-02", departmentName: "外科" },
  { departmentId: "dept-03", departmentName: "小児科" },
  { departmentId: "dept-04", departmentName: "整形外科" },
  { departmentId: "dept-05", departmentName: "皮膚科" },
  { departmentId: "dept-06", departmentName: "眼科" },
  { departmentId: "dept-07", departmentName: "耳鼻咽喉科" },
  { departmentId: "dept-08", departmentName: "産婦人科" },
  { departmentId: "dept-09", departmentName: "泌尿器科" },
  { departmentId: "dept-10", departmentName: "精神科" },
  { departmentId: "dept-11", departmentName: "放射線科" },
  { departmentId: "dept-12", departmentName: "麻酔科" },
  { departmentId: "dept-13", departmentName: "救急科" },
  { departmentId: "dept-14", departmentName: "病理診断科" },
  { departmentId: "dept-15", departmentName: "リハビリテーション科" },
  { departmentId: "dept-16", departmentName: "臨床検査科" },
  { departmentId: "dept-17", departmentName: "内視鏡検査科" },
  { departmentId: "dept-18", departmentName: "栄養指示科" },
  { departmentId: "dept-19", departmentName: "薬剤部" },
  { departmentId: "dept-20", departmentName: "看護部" },
  { departmentId: "dept-21", departmentName: "事務" },
];

@Injectable()
export class DepartmentsClient {
  async fetchDepartments(): Promise<UpstreamDepartment[]> {
    // TODO: axios.get(`${UPSTREAM_BASE_URL}/departments`) に差し替え
    return MOCK_DEPARTMENTS;
  }
}

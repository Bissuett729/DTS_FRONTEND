export interface BugReport {
  _id: {
    $oid: string;
  };
  title: string;
  description: string;
  priority: number;
  severity: string;
  tool: string;
  images: string[];
  browser: string;
  os: string;
  reportTime: {
    $date: string;
  };
  version: string;
  ipBrowser: string;
  port: string;
  userIp: string;
  createdBy: string;
  status: string;
  comments: any[];
  history: any[];
  tags: string[];
  category: string;
  slaHours: number;
  createdAt: {
    $date: string;
  };
  updatedAt: {
    $date: string;
  };
  __v: number;
}
import { Layout, } from "antd";

const contentStyle = {
  textAlign: 'center',
  minHeight: 'calc(100vh - 64px)',
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#001529',
};
export default function AppContent() {
    return (
         <Layout.Content style={contentStyle}>Content</Layout.Content>
         
    )

};
    
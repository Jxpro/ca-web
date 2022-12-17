import { Breadcrumb, Layout } from 'antd';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';
const { Content } = Layout;

function App() {
    return (
        <Layout>
            <Header />
            <Content className="site-layout">
                <div className="site-layout-background">
                    Content
                </div>
            </Content>
            <Footer />
        </Layout>
    );
}

export default App;

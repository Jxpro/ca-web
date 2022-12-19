import { Layout } from 'antd';

import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';

function App() {
    console.log('render App');
    return (
        <Layout className="site-layout">
            <Header />
            <Layout.Content className="content-layout">
                <div className="content-background">
                    Content
                </div>
            </Layout.Content>
            <Footer />
        </Layout>
    );
}

export default App;

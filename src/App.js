import { Layout } from 'antd';

import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';

function App() {
    console.log('render App');
    return (
        <Layout>
            <Header />
            <Layout.Content className="site-layout">
                <div className="site-layout-background">
                    Content
                </div>
            </Layout.Content>
            <Footer />
        </Layout>
    );
}

export default App;

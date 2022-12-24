import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';

import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';

function App() {
    // 延迟显示内容，避免页面闪烁
    const [loading, setLoading] = useState('none');
    const over = () => setLoading('flex');
    return (
        // 通过设置 display 属性来控制页面显示
        // 通过props将over方法传递给Header组件，调用显示内容
        <Layout className="site-layout" style={{ display: loading }}>
            <Header over={over} />
            <Layout.Content className="content-layout">
                <div className="content-background">
                    <Outlet />
                </div>
            </Layout.Content>
            <Footer />
        </Layout>
    );
}

export default App;

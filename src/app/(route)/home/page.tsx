import AppHeader from '@/components/Header/AppHeader';
import { Header, Content, Footer } from 'antd/es/layout/layout';
import { Layout } from 'antd';
import AppFooter from '@/components/Footer/AppFooter';

const Home = () => {
  return (
    <div>
      <Layout>
        <Header>
          <AppHeader />
        </Header>
        <Content>Content</Content>
        <Footer style={{ textAlign: 'center' }}>
          <AppFooter />
        </Footer>
      </Layout>
    </div>
  );
}

export default Home;
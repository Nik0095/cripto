import { Layout, Card, Statistic, List, Spin, Tag, Typography } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { fakeFetchCrypto, fetchAssets } from '../../api.js';
import { percentDifference, capitalize } from '../../utils';

export default function AppSider() {
  const [loading, setLoading] = useState(false);
  const [crypto, setCrypto] = useState([]);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    async function preload() {
      setLoading(true);
      const { result } = await fakeFetchCrypto();
      const fetchedAssets = await fetchAssets();

      const updatedAssets = fetchedAssets.map((asset) => {
        const coin = result.find((c) => c.id === asset.id);
        if (!coin) return asset;

        const grow = asset.price < coin.price;
        const growPercent = percentDifference(asset.price, coin.price);
        const totalAmount = asset.amount * coin.price;
        const totalProfit = asset.amount * coin.price - asset.amount * asset.price;

        return {
          ...asset,
          grow,
          growPercent,
          totalAmount,
          totalProfit,
        };
      });

      setAssets(updatedAssets);
      setCrypto(result);
      setLoading(false);
    }

    preload();
  }, []);

  if (loading) {
    return <Spin fullscreen />;
  }

  return (
    <Layout.Sider width="25%" style={siderStyle}>
      {assets.map((asset) => (
        <Card key={asset.id} style={{ marginBottom: '1rem' }}>
          <Statistic
            title= {capitalize (asset.id)}
            value={asset.totalAmount}
            precision={2}
            valueStyle={{ color: asset.grow ? '#3f8600' : '#cf1322' }}
            prefix={asset.grow ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            suffix="$"
          />
          <List
  size="small"
  dataSource={[
    { title: 'Total Profit', value: asset.totalProfit, withTag: true },
    { title: 'Asset Amount', value: asset.amount, isPlain: true },
    // { title: 'Difference', value: asset.growPercent },
  ]}
  renderItem={(item) => (
    <List.Item>
      <span>{item.title}</span>
      <span>
        {item.withTag && (
          <Tag color={asset.grow ? 'green' : 'red'}>{asset.growPercent}%
            
          `</Tag>
        )}
        {item.isPlain && item.value}
        {!item.isPlain && (
          <Typography.Text
            type={asset.grow ? 'success' : 'danger'}>
              {item.value.toFixed(2)}$
            </Typography.Text>
        )}
      </span>
    
    </List.Item>
  )}
/>
        </Card>
      ))}
    </Layout.Sider>
  );
}

// Example style
const siderStyle = {
  background: '#fff',
  padding: '1rem',
  overflowY: 'auto',
};

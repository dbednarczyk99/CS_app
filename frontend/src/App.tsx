import { Admin } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';

const dataProvider = simpleRestProvider('http://localhost:3000');

export default function App() {
  return <Admin dataProvider={dataProvider} />;
}

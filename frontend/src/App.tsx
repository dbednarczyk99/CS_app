import { Admin, Resource } from 'react-admin';
import { dataProvider } from './dataProvider';
import { authProvider } from './authProvider';

// przykladowy komponent listy — zastąp swoimi
const ProductList = () => <div>Lista produktów</div>;

function App() {
  return (
    <Admin dataProvider={dataProvider} authProvider={authProvider}>
      <Resource name="products" list={ProductList} />
    </Admin>
  );
}

export default App;
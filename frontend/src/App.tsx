import { Admin, Resource } from 'react-admin';
import { dataProvider } from './dataProvider';
import { authProvider } from './authProvider';
import { ProductList, ProductCreate, ProductEdit } from './admin/products';
import { CategoryList, CategoryCreate, CategoryEdit } from './admin/categories';

function App() {
  return (
    <Admin dataProvider={dataProvider} authProvider={authProvider}>
      <Resource
        name="products"
        list={ProductList}
        create={ProductCreate}
        edit={ProductEdit}
      />
      <Resource
        name="products/categories"
        options={{ label: 'Categories' }}
        list={CategoryList}
        create={CategoryCreate}
        edit={CategoryEdit}
      />
    </Admin>
  );
}

export default App;
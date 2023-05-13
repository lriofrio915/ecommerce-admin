import { useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { useRouter } from "next/router";

export default function NewProduct() {

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [goToProducts, setGoToProducts] = useState(false);
  const router = useRouter();

  async function createProduct(ev){
    ev.preventDefault();
    const data = {title, description, price}
    await axios.post('/api/products', data);
    setGoToProducts(true);
  }

  if(goToProducts) {
    router.push('/products');
  }

  return (
    <Layout>
      <form onSubmit={createProduct}>
        <h1>Nuevo Producto</h1>
        <label>Nombre del producto</label>
        <input 
          type="text" 
          placeholder="nombre del producto" 
          value={title} 
          onChange={ev => setTitle(ev.target.value)}
        />

        <label>Descripción</label>
        <textarea 
          placeholder="descripción"
          value={description}
          onChange={ev => setDescription(ev.target.value)}
        />

        <label>Precio (USD)</label>
        <input 
          type="number" 
          placeholder="precio"
          value={price}
          onChange={ev => setPrice(ev.target.value)}
        />

        <button 
          className="btn-primary"
          type="submit"
        >
          Guardar
        </button>
      </form>
    </Layout>
  );
}
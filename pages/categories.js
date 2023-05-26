import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Categories(){
  const [name, setName] = useState('');
  const [categories, setCategories] = useState([]);

  function fetchCategories(){
    axios.get('api/categories').then(result => {
      setCategories(result.data);
    });
  }

  useEffect(()=>{
    fetchCategories();
  }, []);

  async function saveCategory(ev){
    ev.preventDefault();
    await axios.post('api/categories', {name});
    setName('');
    fetchCategories();
  }
  return (
    <Layout>
      <h1>Categorías</h1>
      <label>Nueva categoría</label>
      <form onSubmit={saveCategory} className="flex gap-1">
        <input 
          type="text" 
          placeholder={'Nombre de la categoría'}
          onChange= {ev => setName(ev.target.value)}
          className="mb-0"
          value={name}
          
          />
        <button type='submit' className="btn-primary py-1">
          Guardar
        </button>
      </form>
      <table className="basic mt-4">
        <thead>
          <tr>
            <td>Nombre de la categoría</td>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 && categories.map(category => (
            <tr>
              <td>{category.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  )

}
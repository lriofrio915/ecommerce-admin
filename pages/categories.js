import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Categories(){
  const [name, setName] = useState('');
  const [parentCategory, setParentCategory] = useState('');
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
    await axios.post('api/categories', {name, parentCategory});
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
        <select className="mb-0" onChange={ev => setParentCategory(ev.target.value)} value={parentCategory} >
          <option value = "">
            Sin categoría principal
          </option>
          {categories.length > 0 && categories.map(category => (
            <option value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        <button type='submit' className="btn-primary py-1">
          Guardar
        </button>
      </form>
      <table className="basic mt-4">
        <thead>
          <tr>
            <td>Nombre de la categoría</td>
            <td>Categoría principal</td>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 && categories.map(category => (
            <tr>
              <td>{category.name}</td>
              <td>{category?.parent?.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  )

}
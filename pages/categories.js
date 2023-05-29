import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { withSwal } from "react-sweetalert2";

function Categories({swal}){
  const [editedCategory, setEditedCategory] = useState(null);
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
    const data = {name, parentCategory}
    if (editedCategory) {
      data._id = editedCategory._id;
      await axios.put('/api/categories', data);
      setEditedCategory(null);
    } else {
      await axios.post('api/categories', data);
    }
    setName('');
    setParentCategory('');
    fetchCategories();
  }

  function editCategory(category){
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
  }
  
  function deleteCategory(category){
    swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar ${category.name}?`,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, eliminar',
      confirmButtonColor: '#d55',
      reverseButtons: true,
  }).then(async result => {
      if (result.isConfirmed) {
        const {_id} = category;
        await axios.delete('/api/categories?_id='+_id);
        fetchCategories();
      }
  })
  }

  return (
    <Layout>
      <h1>Categorías</h1>
      <label>
        {editedCategory
          ? `Editar categoría ${editedCategory.name}`
          : 'Crear nueva categoría'}
      </label>
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
            <td></td>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 && categories.map(category => (
            <tr>
              <td>{category.name}</td>
              <td>{category?.parent?.name}</td>
              <td>
                <button onClick={()=> editCategory(category)} className="btn-primary mr-1">Editar</button>
                <button 
                  onClick={()=> deleteCategory(category)}
                  className="btn-primary">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}

export default withSwal(({swal}, ref) => (
  <Categories swal={swal}/>
));
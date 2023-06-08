import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { withSwal } from 'react-sweetalert2';

function Categories({ swal }) {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState('');
  const [parentCategory, setParentCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    axios.get('/api/categories').then(result => {
      setCategories(result.data);
    });
  }

  async function saveCategory(ev) {
    ev.preventDefault();
    const data = {
      name,
      parentCategory,
      properties: properties && properties.map(p => ({
        name: p.name,
        values: p.values.split(','),
      })),
    };

    if (editedCategory) {
      data._id = editedCategory._id;
      await axios.put('/api/categories', data);
      setEditedCategory(null);
    } else {
      await axios.post('/api/categories', data);
    }

    setName('');
    setParentCategory('');
    setProperties([]);
    fetchCategories();
  }

  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
    setProperties(
      category.properties?.map(({ name, values }) => ({
        name,
        values: values.join(',')
      }))
    );
  }

  function deleteCategory(category) {
    swal.fire({
      title: '¿Está seguro?',
      text: `¿Deseas eliminar ${category.name}?`,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'si, eliminar!',
      confirmButtonColor: '#d55',
      reverseButtons: true,
    }).then(async result => {
      if (result.isConfirmed) {
        const { _id } = category;
        await axios.delete('/api/categories?_id=' + _id);
        fetchCategories();
      }
    });
  }

  function addProperty() {
    setProperties(prev => {
      return [...(prev || []), { name: '', values: '' }];
    });
  }

  function handlePropertyNameChange(index, property, newName) {
    setProperties(prev => {
      const updatedProperties = [...prev];
      updatedProperties[index].name = newName;
      return updatedProperties;
    });
  }

  function handlePropertyValuesChange(index, property, newValues) {
    setProperties(prev => {
      const updatedProperties = [...prev];
      updatedProperties[index].values = newValues;
      return updatedProperties;
    });
  }

  function removeProperty(indexToRemove) {
    setProperties(prev => {
      return prev.filter((p, pIndex) => {
        return pIndex !== indexToRemove;
      });
    });
  }

  return (
    <Layout>
      <h1>Categorías</h1>
      <label>
        {editedCategory
          ? `Editar categoría: ${editedCategory.name}`
          : 'Crear nueva categoría'}
      </label>
      <form onSubmit={saveCategory}>
        <div className="flex gap-1">
          <input
            type="text"
            placeholder="Nombre de la categoría"
            onChange={ev => setName(ev.target.value)}
            value={name}
          />
          <select
            onChange={ev => setParentCategory(ev.target.value)}
            value={parentCategory}
          >
            <option value="">Sin categoría principal</option>
            {categories.length > 0 && categories.map(category => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block">Propiedades</label>
          <button
            onClick={addProperty}
            type="button"
            className="btn-default text-sm mb-2"
          >
            Agregar nueva propiedad
          </button>
          {properties && properties.length > 0 && properties.map((property, index) => (
            <div key={index} className="flex gap-1 mb-2">
              <input
                type="text"
                value={property.name}
                className="mb-0"
                onChange={ev => handlePropertyNameChange(index, property, ev.target.value)}
                placeholder="nombre de la propiedad (ejemplo: color)"
              />
              <input
                type="text"
                className="mb-0"
                onChange={ev => handlePropertyValuesChange(index, property, ev.target.value)}
                value={property.values}
                placeholder="valores, separados por coma"
              />
              <button
                onClick={() => removeProperty(index)}
                type="button"
                className="btn-red"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-1">
          {editedCategory && (
            <button
              type="button"
              onClick={() => {
                setEditedCategory(null);
                setName('');
                setParentCategory('');
                setProperties([]);
              }}
              className="btn-default"
            >
              Cancelar
            </button>
          )}
          <button type="submit" className="btn-primary py-1">
            Guardar
          </button>
        </div>
      </form>
      {!editedCategory && (
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
              <tr key={category._id}>
                <td>{category.name}</td>
                <td>{category?.parent?.name}</td>
                <td>
                  <button
                    onClick={() => editCategory(category)}
                    className="btn-default mr-1"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => deleteCategory(category)}
                    className="btn-red"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}

export default withSwal(({ swal }, ref) => (
  <Categories swal={swal} />
));



// import Layout from "@/components/Layout";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { withSwal } from "react-sweetalert2";

// function Categories({swal}){
//   const [editedCategory, setEditedCategory] = useState(null);
//   const [name, setName] = useState('');
//   const [parentCategory, setParentCategory] = useState('');
//   const [categories, setCategories] = useState([]);
//   const [properties, setProperties] = useState([]);

//   useEffect(()=>{
//     fetchCategories();
//   }, [])

//   function fetchCategories(){
//     axios.get('/api/categories').then(result => {
//       setCategories(result.data);
//     });
//   }

//   async function saveCategory(ev){
//     ev.preventDefault();
//     const data = {
//       name, 
//       parentCategory, 
//       properties:properties.map(p => ({
//         name:p.name,
//         values:p.values.split(','),
//       })),
//     };
//     if (editedCategory) {
//       data._id = editedCategory._id;
//       await axios.put('/api/categories', data);
//       setEditedCategory(null);
//     } else {
//       await axios.post('/api/categories', data);
//     }
//     setName('');
//     setParentCategory('');
//     setProperties([]);
//     fetchCategories();
//   }

//   function editCategory(category){
//     setEditedCategory(category);
//     setName(category.name);
//     setParentCategory(category.parent?._id);
//     setProperties(
//       category.properties.map(({name, values}) => ({
//         name, 
//         values:values.join(',')
//       }))
//     );
//   }
  
//   function deleteCategory(category){
//     swal.fire({
//       title: '¿Estás seguro?',
//       text: `¿Deseas eliminar ${category.name}?`,
//       showCancelButton: true,
//       cancelButtonText: 'Cancelar',
//       confirmButtonText: 'Si, eliminar',
//       confirmButtonColor: '#d55',
//       reverseButtons: true,
//   }).then(async result => {
//       if (result.isConfirmed) {
//         const {_id} = category;
//         await axios.delete('/api/categories?_id='+_id);
//         fetchCategories();
//       }
//   })
//   }

//   function addProperty() {
//     setProperties(prev => {
//       return { ...prev, [Date.now()]: { name: '', values: '' } };
//     });
//   }

  // function handlePropertyNameChange(index, newName) {
  //   setProperties(prev => {
  //     return { ...prev, [index]: { ...prev[index], name: newName } };
  //   });
  // }

  // function handlePropertyValuesChange(index, property, newValues) {
  //   setProperties(prev => {
  //     const properties = { ...prev };
  //     properties[index] = { ...property, values: newValues };
  //     return properties;
  //   });
  // }

//   function removeProperty(indexToRemove) {
//     setProperties(prev => {
//       return [...prev].filter((p,pIndex) => {
//         return pIndex !== indexToRemove;
//       });
//     });
//   }

//   return (
//     <Layout>
//       <h1>Categorías</h1>
//       <label>
//         {editedCategory
//           ? `Editar categoría ${editedCategory.name}`
//           : 'Crear nueva categoría'}
//       </label>
      // <form onSubmit={saveCategory}>
      //   <div className="flex gap-1">
      //     <input 
      //       type="text" 
      //       placeholder={'Nombre de la categoría'}
      //       onChange= {ev => setName(ev.target.value)}
      //       value={name}
      //     />
      //     <select 
      //       onChange={ev => setParentCategory(ev.target.value)} 
      //       value={parentCategory}
      //     >
      //       <option value = "">
      //         Sin categoría principal
      //       </option>
      //       {categories.length > 0 && categories.map(category => (
      //         <option key={category._id} value={category._id}>
      //           {category.name}
      //         </option>
      //       ))}
      //     </select>
      //   </div>

      //   <div className="mb-2">
      //     <label className="block">Propiedades</label>
      //     <button 
      //       onClick={addProperty}
      //       type="button" 
      //       className="btn-default text-sm mb-2"
      //     >
      //       Agregar nueva propiedad
      //     </button>
//           {Object.entries(properties).map(([index, property]) => (
//             <div key={index} className="flex gap-1 mb-2">
//               <input
//                 type="text"
//                 value={property.name}
//                 className="mb-0"
//                 onChange={ev => handlePropertyNameChange(index, ev.target.value)}
//                 placeholder="Nombre de la propiedad (ejemplo: color)"
//               />
//               <input
//                 type="text"
//                 className="mb-0"
//                 onChange={ev => handlePropertyValuesChange(index, property, ev.target.value)}
//                 value={property.values}
//                 placeholder="Valores, separados por coma"
//               />
//               <button 
//                 className="btn-red" 
//                 onClick={() => removeProperty(index)}
//                 type="button">
//                 Remover
//               </button>
//             </div>
//           ))}

//         </div>

//         <button type='submit' className="btn-primary py-1">
//           Guardar
//         </button>
//       </form>
//       <table className="basic mt-4">
//         <thead>
//           <tr>
//             <td>Nombre de la categoría</td>
//             <td>Categoría principal</td>
//             <td></td>
//           </tr>
//         </thead>
//         <tbody>
//           {categories.length > 0 && categories.map(category => (
//             <tr>
//               <td>{category.name}</td>
//               <td>{category?.parent?.name}</td>
//               <td>
//                 <button onClick={()=> editCategory(category)} className="btn-primary mr-1">Editar</button>
//                 <button 
//                   onClick={()=> deleteCategory(category)}
//                   className="btn-primary">Eliminar</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </Layout>
//   );
// }

// export default withSwal(({swal}, ref) => (
//   <Categories swal={swal}/>
// ));
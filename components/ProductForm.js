import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function ProductForm({
  _id, 
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
}){ 

  const [title, setTitle] = useState(existingTitle || '');
  const [description, setDescription] = useState(existingDescription || '');
  const [price, setPrice] = useState(existingPrice || '');
  const [images,setImages] = useState(existingImages || []);
  const [goToProducts, setGoToProducts] = useState(false);
  const router = useRouter();

  async function saveProduct(ev){
    ev.preventDefault();
    const data = {title, description, price, images};
    if(_id){
      //update
      await axios.put('/api/products', {...data, _id});
    } else {
      //create
      await axios.post('/api/products', data);
    }
    setGoToProducts(true);
  }

  if(goToProducts) {
    router.push('/products');
  }

  async function uploadImages(ev){
    const files = ev.target?.files;
    if (files?.length > 0) {
      const data = new FormData();
      for(const file of files) {
        data.append('file', file);
      }
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });
      console.log(res);
    }
  }

  return (
    <form onSubmit={saveProduct}>
        
        <label>Nombre del producto</label>
        <input 
          type="text" 
          placeholder="nombre del producto" 
          value={title} 
          onChange={ev => setTitle(ev.target.value)}
        />
        <label>
          Fotos
        </label>
        <div className="mb-2">
          <label className="w-24 h-24 cursor-pointer text-center flex items-center justify-center text-sm gap-1 text-gray-500 bg-gray-200 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
            <div>
              Upload
            </div>
            <input type="file" onChange={uploadImages} className="hidden"/>
          </label>
        </div>
        <div className="">
          {!images?.length && (
            <div>No existen fotos en este producto</div>
          )}
        </div>
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
  );


}
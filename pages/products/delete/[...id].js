import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

export default function DeleteProductPage(){
  
  const router = useRouter();
  const [productInfo, setProductInfo] = useState();
  const {id} = router.query;

  useEffect(()=>{
    if (!id) {
      return
    }
    axios.get('/api/products?id='+id).then(response => {
      setProductInfo(response.data);
    })
  },[id]);


  function goBack(){
    router.push('/products');
  }

  async function deleteProduct(){
    await axios.delete('/api/products?id='+id);
    goBack();
  }
  
  return(
    <Layout>
      <h1 className="text-center">
        Do you really want to delete: "{productInfo?.title}"?
      </h1>
      <div className="flex gap-2 justify-center">
        <button 
          className="btn-red"
          onClick={deleteProduct}>
            SI
        </button>
        <button 
          className="btn-default"
          onClick={goBack}>
            NO
        </button>
      </div>
    </Layout>
  );
}



// import { useRouter } from "next/router";
// import Layout from "@/components/Layout";
// import { useEffect } from "react";
// import ProductForm from "@/components/ProductForm";
// import axios from "axios";
// import { useState } from "react";

// export default function EditProductPage() {
//   const [productInfo, setProductInfo] = useState(null);
//   const router = useRouter();
//   const {id} = router.query;

//   useEffect(()=>{
//     if(!id){
//       return;
//     }
//     axios.get('/api/products?id='+id).then(response => {
//       setProductInfo(response.data);
//     });
//   }, [id]);

//   return(
//     <Layout>
//       <h1>Editar Producto</h1>
//       {productInfo && (
//         <ProductForm {...productInfo} />
//       )}
//     </Layout>
//   )
// }
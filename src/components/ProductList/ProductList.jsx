import React, {useState} from 'react';
import ProductItem from "../ProductItem/ProductItem";
import {useTelegram} from "../../hooks/useTelegram";
import {useCallback, useEffect} from "react";
import { useLocation } from "react-router-dom";
import './ProductList.css';
import { create } from 'zustand'

export const useStoreProduct = create((set) => ({
  productsInCategory: [],
  addedItems: [],
  loading: false,
  setProduct: (value) => set({ productsInCategory: value }),
  setAddedItems: (value) => set({ addedItems: value }),
  setLoading: (value) => set({ loading: value }),
}));

export const getTotalAmount = (items = []) => {
  return items.reduce((acc, item) => {
      item.isQuantity ? acc.amount += +item.amount : acc.weight += +item.amount
      return acc
  }, {amount: 0, weight: 0})
}

export const getAddedProduct = (items = []) => {
  return items.filter((item) => (item.amount && item.amount > 0))
}


const ProductList = () => {
    const {productsInCategory, addedItems, loading, setProduct, setAddedItems, setLoading } = useStoreProduct() 
    const {tg, queryId, user} = useTelegram();
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const server = queryParams.get('server')
    const token = queryParams.get('token')


    const fetchData = () => {
      if(!server || (!user && !token)) return 
      setLoading(true)
      return fetch("https://" + server + "/api/v1/product/getForClient") ////   https > http
        .then((res) => res.json())
        .then((data) => {
          setProduct(data.products)
          setAddedItems(data.products.map(cat => cat.items).flat(1))
        })
        .finally(() => setLoading(false))
    }
  
    useEffect(() => {
      fetchData();
    },[])


    const onSendData = useCallback(() => {
        if(!server || (!user && !token)) return 
        const products = getAddedProduct(addedItems)
        const data = {
            products,
            totalWeight: getTotalAmount(products),
            queryId,
            user
        }
        fetch("https://" + server + '/api/v1/common/order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
    }, [addedItems])

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData)
        return () => {
            tg.offEvent('mainButtonClicked', onSendData)
        }
    }, [onSendData])

    const onChange = (product) => {
      const newArr = addedItems.map(item => {
        if(item._id === product._id) {
          return product
        }
        return item
      })

      setAddedItems(newArr)

      const addedProducts = getAddedProduct(newArr)
      const length = addedProducts.length
      if(length === 0) {
          tg.MainButton.hide();
      } else {
        const total = getTotalAmount(addedProducts)
        tg.MainButton.show();
        tg.MainButton.setParams({
            text: `Сделать заказ  ${length}вид${length>1?'а':''}${total.amount?('  '+total.amount+'шт'):''}${total.weight?('  '+total.weight+'кг'):''}`
        })
      }
    }

    return (
        <div>
            {
              loading 
                ? <div className='flex justify-center items-center h-screen'>Loading...</div> 
                : !productsInCategory || !productsInCategory.length 
                  ? <div className='flex justify-center items-center h-screen'>В базе нет товаров 😐</div>
                  : productsInCategory.map((cat) => (
                    <div className='p-[12px] max-w-[450px] mx-auto' key={cat._id}>
                      <p className='pb-[5px] text-hint font-bold'>{cat.name}</p>
                      <div className=''>
                        {cat.items.map((item) => (
                          <ProductItem
                            key={item._id}
                            product={item}
                            onChange={onChange}
                            className='my-[5px] bg-bg rounded-md p-[5px] shadow-sm'
                          />
                        ))}
                      </div>
                    </div>
                  ))
            }
        </div>
    );
};

export default ProductList;
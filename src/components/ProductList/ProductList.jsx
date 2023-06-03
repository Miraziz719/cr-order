import React, {useState} from 'react';
import './ProductList.css';
import ProductItem from "../ProductItem/ProductItem";
import {useTelegram} from "../../hooks/useTelegram";
import {useCallback, useEffect} from "react";
const baseUrl = process.env.BASE_URL || 'http://localhost:5000/api/v1'

const productsInCategory = [
  {
    title: "Go'sht",
    items: [
      {id: '1', title: '0.3-0.6'},
      {id: '2', title: '0.7-0.9'},
      {id: '3', title: '1.0-1.2'},
      {id: '4', title: '1.2-1.5'},
    ]
  }, {
    title: "Razdelka",
    items: [
      {id: '5', title: 'File'},
      {id: '6', title: 'Bedro'},
      {id: '7', title: 'Bedro laxm'},
      {id: '8', title: 'Akrachka'},
      {id: '9', title: 'Golen'},
      {id: '10', title: 'Qanot'},
      {id: '11', title: 'Boyin'},
      {id: '12', title: 'Dum'},
    ]
  },
]
const products = productsInCategory.map(cat => {
  return cat.items 
}).flat(1)

const getTotalAmount = (items = []) => {
  return items.reduce((acc, item) => {
      return acc += +item.amount
  }, 0)
}

const getAddedProduct = (items = []) => {
  return items.filter((item) => (item.amount && item.amount > 0))
}



const ProductList = () => {
    const [addedItems, setAddedItems] = useState(products);
    const {tg, queryId} = useTelegram();


    const onSendData = useCallback(() => {
        const products = getAddedProduct(addedItems)
        const data = {
            products,
            totalWeight: getTotalAmount(products),
            queryId,
        }
        fetch(baseUrl + '/common/order', {
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
        if(item.id === product.id) {
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

        tg.MainButton.show();
        tg.MainButton.setParams({
            text: `Сделать заказ  ${length}вид${length>1&&'а'}  ${getTotalAmount(addedProducts)}кг`
        })
      }
    }

    return (
        <div>
            {productsInCategory.map((cat, cidx) => (
              <div className='p-[12px] max-w-[450px] mx-auto'  key={cidx}>
                <p className='pb-[5px] text-hint font-bold'>{cat.title}</p>
                <div className=''>
                  {cat.items.map((item, idx) => (
                    <ProductItem
                      key={idx}
                      product={item}
                      onChange={onChange}
                      className='my-[5px] bg-bg rounded-md p-[5px] shadow-sm'
                    />
                  ))}
                </div>
                
              </div>
            ))}
        </div>
    );
};

export default ProductList;
import React, {useState} from 'react';
import './ProductList.css';
import ProductItem from "../ProductItem/ProductItem";
import {useTelegram} from "../../hooks/useTelegram";
import {useCallback, useEffect} from "react";

const products = [
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

const ProductList = () => {
    const [addedItems, setAddedItems] = useState([]);
    const {tg, queryId} = useTelegram();

    const onSendData = useCallback(() => {
        const data = {
            products: addedItems,
            queryId,
        }
        fetch('http://localhost:8000/web-data', {
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

    const onAdd = (product) => {
        const alreadyAdded = addedItems.find(item => item.id === product.id);
        let newItems = [];

        if(alreadyAdded) {
            newItems = addedItems.filter(item => item.id !== product.id);
        } else {
            newItems = [...addedItems, product];
        }

        setAddedItems(newItems)

        if(newItems.length === 0) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
            tg.MainButton.setParams({
                text: `Купить`
            })
        }
    }

    return (
        <div>
            {products.map((cat, cidx) => (
              <div className='p-[12px] max-w-[450px] mx-auto'  key={cidx}>
                <p className='pb-[5px] text-hint font-bold'>{cat.title}</p>
                <div className=''>
                  {cat.items.map((item, idx) => (
                    <ProductItem
                      key={idx}
                      product={item}
                      onAdd={onAdd}
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
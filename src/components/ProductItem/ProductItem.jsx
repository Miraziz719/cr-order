import React, {useState} from 'react';
import './ProductItem.css';

const ProductItem = ({product, className, onAdd, onRemove}) => {
    const [amount, setamount] = useState('');

    const onAddHandler = () => {
        if((+amount+5)>=10000) return
        setamount(+amount+5)
    }
    const onRemoveHandler = () => {
        if((+amount-5)<=0) return setamount(0)
        setamount(+amount-5)
    }
    function handleChange(event) {
        setamount(event.target.value)
    }

    return (
        <div className={'flex justify-between items-center ' + className}>
            <div className=''>{product.title}</div>
            <div className='border border-button border-solid rounded-md overflow-hidden h-[36px] shadow-sm'>
                <button onClick={onRemoveHandler} className='px-[16px] h-full bg-button text-button-text'>-</button>
                <input onChange={handleChange} value={amount} className='max-w-[60px] px-[8px] h-full' type='number' inputMode='numeric' ></input>
                <button onClick={onAddHandler} className='px-[16px] h-full bg-button text-button-text'>+</button>
            </div>
        </div>
    );
};

export default ProductItem;
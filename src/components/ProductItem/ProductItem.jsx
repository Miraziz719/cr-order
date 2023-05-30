import React, {useEffect, useState} from 'react';
import './ProductItem.css';


const ProductItem = ({product, className, onChange}) => {
    const [amount, setamount] = useState('');

    useEffect(() => {
        onChange({
           ...product, 
           amount: amount
        })
    }, [amount])

    useEffect(() => {
        onChange({
           ...product, 
           amount: amount
        })
    }, [amount])

    const onAddHandler = () => {
        setamount(prevValue => {
            // if((+prevValue+5)>=10000) return 9999
            return +prevValue + 5
        })
    }
    const onRemoveHandler = () => {
        setamount(prevValue => {
            // if((+prevValue-5)<=0) return setamount(0)
            return +prevValue - 5
        })
    }
    function handleChangeInput(event) {
        if(event.target.value>=10000) return setamount(9999)
        setamount(event.target.value)
    }

    function handleStart (e, increment) {
        e.preventDefault()
        
        let tid = null
        let speed = 400

        function handleChange () {
            increment ? onAddHandler() : onRemoveHandler()
            tid = setTimeout(() => {
                handleChange()
                speed = speed <= 100 ? 100 : speed -= 100
            }, speed)
        }
        handleChange()

        function handleStop () {
            clearTimeout(tid)
            document.removeEventListener('mouseup', handleStop, false)
            document.removeEventListener('touchend', handleStop, false)
            speed = 300
        }

        document.addEventListener('mouseup', handleStop, false)
        document.addEventListener('touchend', handleStop, false)
    }

    return (
        <div className={'flex justify-between items-center ' + className}>
            <div className=''>{product.title}</div>
            <div className='border border-button border-solid rounded-md overflow-hidden h-[36px] shadow-sm'>
                <button 
                    className='px-[16px] h-full bg-button text-button-text'
                    onMouseDown={e => handleStart(e)}
                    onTouchStart={e => handleStart(e)}
                >-</button>
                <input onChange={handleChangeInput} value={amount} className='max-w-[60px] px-[8px] h-full bg-bg' type='number' inputMode='numeric' ></input>
                <button 
                    className='px-[16px] h-full bg-button text-button-text'
                    onMouseDown={e => handleStart(e, true)}
                    onTouchStart={e => handleStart(e, true)}
                >+</button>
            </div>
        </div>
    );
};

export default ProductItem;
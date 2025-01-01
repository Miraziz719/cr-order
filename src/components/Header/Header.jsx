import React, { useEffect, useState } from "react";
import { useTelegram } from "../../hooks/useTelegram";
import { useLocation } from "react-router-dom";
import './Header.css'
import { create } from 'zustand'
import {useStoreProduct, getTotalAmount, getAddedProduct} from "../ProductList/ProductList"

const useStore = create((set) => ({
  agent: undefined,
  date: '',
  setAgent: (e) => set({ agent: e.target.value }),
  setDate: (e) => set({ date: e.target.value }),
}));

const Header = () => {
  const {user} = useTelegram()
  const [agents, setAgents] = useState([])
  const {agent, date, setAgent, setDate } = useStore()
  const {addedItems, setLoading} = useStoreProduct()

  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const server = queryParams.get('server')
  const token = queryParams.get('token')

  const fetchData = () => {
    if(!server) return 
    setLoading(true)
    return fetch("https://" + server + "/api/v1/agent/getForSelect")  //// https > http
      .then((res) => res.json())
      .then((data) => {
        setAgents(data.agents)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchData();
  },[])

  const onSendData = () => {
      if(!server || (!user && !token)) return 
      if(!agent) return

      const products = getAddedProduct(addedItems)
      const data = {
          products,
          totalWeight: getTotalAmount(products),
          agentId: agent,
          date
      }
      fetch("https://" + server + '/api/v1/common/order', {  ////  https > http
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
      }).then(() => alert("Zakaz qabul  qilindi!"))
  }
  

  return (
    <div className={'header'}>
      <div className="bg-bg drop-shadow-lg">
        <div className="p-[12px] max-w-[450px] w-full mx-auto flex justify-between gap-[15px]">
          <select value={agent} onChange={setAgent} className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm">
            <option value="">Контрагент</option>
            {agents.map(agent => (
                <option key={agent._id} value={agent._id}>{agent.name}</option>
            )) }
          </select>
          {/* <input className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm" type="text" placeholder="Agent" /> */}
          <input value={date} onChange={setDate} className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm" type="date"/>
          <button disabled={!agent} onClick={onSendData} className="disabled:opacity-50 bg-button text-button-text px-[10px] py-[5px] rounded-md hover:opacity-80 ease-in-out">Saqlash</button>
        </div>
      </div>
    </div>
  )
}

export default Header;
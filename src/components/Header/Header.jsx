import React, { useEffect, useState } from "react";
import { useTelegram } from "../../hooks/useTelegram";
import './Header.css'
const urlParams = new URLSearchParams(queryString)
const server = urlParams.get('server')
const baseUrl = 'https://' + server + '/api/v1'
// const baseUrl = process.env.BASE_URL || 'http://localhost:5000/api/v1' // 'https://mayda.uz/api/v1' // 

const Header = () => {
  const {user} = useTelegram()
  const [loading, setLoading] = useState(false)
  const [agents, setAgents] = useState([])
  const [agent, setAgent] = useState(null)
  const [date, setDate] = useState(null)

  const fetchData = () => {
    setLoading(true)
    return fetch(baseUrl + "/agent/getForSelect")
      .then((res) => res.json())
      .then((data) => {
        setAgents(data.agents)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchData();
  },[])
  

  return (
    <div className={'header'}>
      <div className="bg-bg drop-shadow-lg">
        <div className="p-[12px] max-w-[450px] w-full mx-auto flex justify-between gap-[15px]">
          <select name="agent" id="" className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm">
          <option value={null}>Контрагент</option>
            {agents.map(agent => (
                <option key={agent._id} value={agent._id}>{agent.name}</option>
            )) }
          </select>
          {/* <input className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm" type="text" placeholder="Agent" /> */}
          <input className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm" type="date"/>
          <button className="bg-button text-button-text px-[10px] py-[5px] rounded-md hover:opacity-80 ease-in-out">Saqlash</button>
        </div>
      </div>
    </div>
  )
}

export default Header;
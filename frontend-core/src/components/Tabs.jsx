import React from 'react'

export default function Tabs({ tabs, active, onChange }) {
  return (
    <nav className="tabs">
      {tabs.map(t => (
        <button
          key={t}
          className={t===active ? 'active' : ''}
          onClick={()=>onChange(t)}
        >{t}</button>
      ))}
    </nav>
  )
}

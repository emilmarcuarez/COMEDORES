import { useState } from 'react';
import Sidebar from './sidebar';
import Resumen from './Resumen';

export default function App(){
    const [personaSeleccionada, setPersonaSeleccionada] = useState(null);

    return (
        <div className='flex'>

            <Sidebar setPersonaSeleccionada= {setPersonaSeleccionada} />
            <Resumen persona={personaSeleccionada} />
        </div>
    )
}
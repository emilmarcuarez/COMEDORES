import PropTypes from 'prop-types';
import useQuiosco from '../hooks/useQuiosco';
export default function Categoria({ categoria }) {
 
   const {icono, nombre, id} = categoria;
    const { handleClickCategoria, categoriaActual } = useQuiosco();
    const resaltarCategoriaActual = () => categoriaActual.id === id ? 'bg-amber-400' : 'bg-white';
    return (
    <div className={`${resaltarCategoriaActual()} flex items-center gap-4 border w-full p-3 hover:bg-amber-400 cursor-pointer`}>
        <img 
        src={`/img/icono_${icono}.svg`}
        alt="imagen icono"
        className='w-12'
        />
        <button 
        className='text-lg font-bold cursor-pointer truncate'
        type='buttom'
        onClick={() => handleClickCategoria(id)}
        >
            {nombre}
        </button>
    </div>
  )
}

Categoria.propTypes = {
    categoria: PropTypes.shape({
        id:PropTypes.number.isRequired,
        icono: PropTypes.string.isRequired,
        nombre: PropTypes.string.isRequired
    }).isRequired,
};

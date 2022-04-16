import { Formik, Form, Field } from "formik"
import { useNavigate } from "react-router-dom"
import * as Yup from 'yup'
import Alerta from "./Alerta"
import Spinner from "./Spinner"

const Formulario = ({cliente, cargando}) => {
  const navigate = useNavigate();

  const nuevoClienteSchema = Yup.object().shape({
    nombre: Yup.string()
                .min(3, 'El nombre es muy corto')
                .max(30, 'El nombre es muy largo')
                .required('El nombre del Cliente es Obligatorio'),
    empresa: Yup.string()
                .required('El nombre de la Empresa es obligatorio'),
    email: Yup.string()
              .email('Email no válido')
              .required('El email es obligatorio'),
    telefono: Yup.number()
                  .min(10, 'El número debe tener al menos 10 dígitos')
                  .positive('Número no válido')
                  .integer('Número no válido')
                  .typeError('El número no es válido')
  })

  const handleSubmit = async values =>{
    try {
      let respuesta;
      if(cliente.id){
        //Editando un registro
        const url = `${import.meta.env.VITE_API_URL}/${cliente.id}`;
        respuesta = await fetch(url, {
          method: 'PUT',
          body: JSON.stringify(values),
          headers: {
            "Content-Type": "application/json"
          }
        });
      } else{
        //Nuevo registro
        const url = import.meta.env.VITE_API_URL;
        respuesta = await fetch(url, {
          method: 'POST',
          body: JSON.stringify(values),
          headers: {
            "Content-Type": "application/json"
          }
        }); 
      }
      await respuesta.json();
      navigate('/clientes');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    cargando ? <Spinner /> : (
      <div className="bg-white mt-10 px-5 py-10 rounded-md shadow-md md:w-3/4 mx-auto">
        <h1 className="text-gray-600 font-bold text-xl uppercase text-center">{cliente?.id ? 'Editar Cliente': 'Agregar Cliente'}</h1>

        <Formik
          initialValues={{
            nombre: cliente?.nombre ?? '',
            empresa: cliente?.empresa ?? '',
            email: cliente?.email ?? '',
            telefono: cliente?.telefono ?? '',
            notas: cliente?.notas ?? ''
          }}
          enableReinitialize={true}
          onSubmit={ async (values, {resetForm}) =>{
            await handleSubmit(values);
            resetForm();
          }}
          validationSchema={nuevoClienteSchema}
        >
          {({errors, touched}) => (
            <Form
              className="mt-10"
            >
              <div className="mb-4">
                <label 
                  className="text-gray-800 font-bold text-lg"
                  htmlFor="nombre"
                >Nombre: 
                </label>
                <Field 
                  id="nombre"
                  type="text"
                  className={`${(errors.nombre && touched.nombre) ? 'border-red-500' : 'border-blue-300'} mt-2 block w-full p-3 bg-gray-100 border-2 rounded-md placeholder:text-gray-500`}
                  placeholder="Nombre del Cliente"
                  name="nombre"
                />
                {errors.nombre && touched.nombre &&
                  <Alerta>{errors.nombre}</Alerta>
                }
              </div>

              <div className="mb-4">
                <label 
                  className="text-gray-800 font-bold text-lg"
                  htmlFor="empresa"
                >Empresa: 
                </label>
                <Field 
                  id="empresa"
                  type="text"
                  className={`${(errors.empresa && touched.empresa) ? 'border-red-500' : 'border-blue-300'} mt-2 block w-full p-3 bg-gray-100 border-2 rounded-md placeholder:text-gray-500`}
                  placeholder="Empresa"
                  name="empresa"
                />
                {errors.empresa && touched.empresa &&
                  <Alerta>{errors.empresa}</Alerta>
                }
              </div>

              <div className="mb-4">
                <label 
                  className="text-gray-800 font-bold text-lg"
                  htmlFor="email"
                >Email: 
                </label>
                <Field 
                  id="email"
                  type="email"
                  className={`${(errors.email && touched.email) ? 'border-red-500' : 'border-blue-300'} mt-2 block w-full p-3 bg-gray-100 border-2 rounded-md placeholder:text-gray-500`}
                  placeholder="Ej: correo@correo.com"
                  name="email"
                />
                {errors.email && touched.email &&
                  <Alerta>{errors.email}</Alerta>
                }
              </div>

              <div className="mb-4">
                <label 
                  className="text-gray-800 font-bold text-lg"
                  htmlFor="telefono"
                >Teléfono: 
                </label>
                <Field 
                  id="telefono"
                  type="tel"
                  className={`${(errors.telefono && touched.telefono) ? 'border-red-500' : 'border-blue-300'} mt-2 block w-full p-3 bg-gray-100 border-2 rounded-md placeholder:text-gray-500`}
                  placeholder="Teléfono de Contacto"
                  name="telefono"
                />
                {errors.telefono && touched.telefono &&
                  <Alerta>{errors.telefono}</Alerta>
                }
              </div>

              <div className="mb-4">
                <label 
                  className="text-gray-800 font-bold text-lg"
                  htmlFor="notas"
                >Notas: 
                </label>
                <Field 
                  as="textarea"
                  id="notas"
                  type="email"
                  className="mt-2 block w-full p-3 bg-gray-100 border-2 border-blue-300 rounded-md placeholder:text-gray-500 h-40"
                  placeholder="Sobre el Cliente"
                  name="notas"
                />
              </div>

              <input 
                type="submit" 
                value={cliente?.id ? 'Editar Cliente': 'Agregar Cliente'}
                className="mt-5 w-full bg-blue-800 p-3 text-white uppercase font-bold text-lg hover:bg-blue-900 hover:cursor-pointer"
              />
            </Form>
          )}
        </Formik>
      </div>
    )
  )
}

Formulario.defaultProps={
  cliente: {},
  cargando: false
}

export default Formulario
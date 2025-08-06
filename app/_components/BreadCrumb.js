import React from 'react'
import '../Styles/BreadCrumb.css'
const BreadCrumb = () => {
  return (
   <div className="breadcrumb-bar bg-dark">
  <div className="container">
    <div className="row align-items-center text-center">
      <div className="col-md-12 col-12 ">
        <h2 className="breadcrumb-title text-white">About us</h2>
        <nav aria-label="breadcrumb" className="page-breadcrumb">
          <ol className="breadcrumb d-flex justify-content-center" align="center">
            <li className="breadcrumb-item">
              <a href="index.html" className='text-white'>Home</a>
            </li>
          
            <li className="breadcrumb-item active" aria-current="page">
              <a href="#" className='text-white'>About us</a>   
            </li>
          </ol>
        </nav>
      </div>
    </div>
  </div>
</div>

  )
}

export default BreadCrumb
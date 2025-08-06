import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import '../Styles/Banner.css';

const Banner = ({ isEditing = false }) => {
  return (
   <>
    <section className="banner-section banner-slider">
      <div className="container">
        <div className="home-banner">
          <div className="row align-items-center">
            <div className="col-lg-6 aos-init aos-animate" data-aos="fade-down">
              <p className="explore-text">
                <span>
                  <i className="fa-solid fa-thumbs-up me-2"></i>
                </span>
                100% Trusted car rental platform in the World
              </p>
              <h1>
                {isEditing ? (
                  <>
                    <span>Modify Your</span> <br />
                    Car Rental Booking
                  </>
                ) : (
                  <>
                    <span>Find Your Best</span> <br />
                    Dream Car for Rental
                  </>
                )}
              </h1>
              <p>
                Experience the ultimate in comfort, performance, and sophistication with our luxury car rentals. From sleek sedans and stylish coupes to spacious SUVs and elegant convertibles, we offer a range of premium vehicles to suit your preferences and lifestyle.
              </p>
              <div className="view-all">
                <Link href="/" className="btn btn-view d-inline-flex align-items-center me-3">
                  Book a Car <span><i className="feather-arrow-right ms-2"></i></span>
                </Link>
                <Link href="/my-bookings" className="btn btn-view d-inline-flex align-items-center">
                  My Bookings <span><i className="feather-arrow-right ms-2"></i></span>
                </Link>
              </div>
            </div>
            <div className="col-lg-6 aos-init aos-animate" data-aos="fade-down">
              <div className="banner-imgs">
                <Image 
                  src="https://dreamsrent.dreamstechnologies.com/html/template/assets/img/car-right.png" 
                  alt="Luxury car rental banner" 
                  width={600}
                  height={400}
                  className="img-fluid aos"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
   </>
  )
}
export default Banner;
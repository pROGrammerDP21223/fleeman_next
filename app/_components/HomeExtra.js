import Image from "next/image";
import '../Styles/HomeExtra.css';

export default function HomeExtra() {
  return (
    <section className="section services">
      <div className="service-right">
        <img 
          src="https://dreamsrent.dreamstechnologies.com/html/template/assets/img/bg/service-right.svg" 
          className="img-fluid" 
          alt="services right" 
        />
      </div>
      <div className="container">
        <div className="section-heading aos-init aos-animate" data-aos="fade-down">
          <h2>How It Works</h2>
          <p>Booking a car rental is a straightforward process that typically involves the following steps</p>
        </div>

        <div className="services-work">
          <div className="row">
            {/* Step 1 */}
            <div className="col-lg-4 col-md-4 col-12 d-flex aos-init aos-animate" data-aos="fade-down">
              <div className="services-group service-date flex-fill">
                <div className="services-icon border-secondary">
                  <img 
                    className="icon-img bg-secondary" 
                    src="/assets/img/icons/services-icon-01.svg" 
                    alt="Choose Locations" 
                  />
                </div>
                <div className="services-content">
                  <h3>1. Choose Date &amp; Locations</h3>
                  <p>Determine the date &amp; location for your car rental. Consider factors such as your travel itinerary, pickup/drop-off locations (e.g., airport, city center), and duration of rental.</p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="col-lg-4 col-md-4 col-12 d-flex aos-init aos-animate" data-aos="fade-down">
              <div className="services-group service-loc flex-fill">
                <div className="services-icon border-warning">
                  <img 
                    className="icon-img bg-warning" 
                    src="/assets/img/icons/services-icon-02.svg" 
                    alt="Choose Locations" 
                  />
                </div>
                <div className="services-content">
                  <h3>2. Pick-Up Locations</h3>
                  <p>Check the availability of your desired vehicle type for your chosen dates and location. Ensure that the rental rates, taxes, fees, and any additional charges.</p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="col-lg-4 col-md-4 col-12 d-flex aos-init aos-animate" data-aos="fade-down">
              <div className="services-group services-group1 service-book flex-fill">
                <div className="services-icon border-dark">
                  <img 
                    className="icon-img bg-dark" 
                    src="/assets/img/icons/services-icon-03.svg" 
                    alt="Choose Locations" 
                  />
                </div>
                <div className="services-content">
                  <h3>3. Book your Car</h3>
                  <p>Once you've found car rental option, proceed to make a reservation. Provide the required information, including your details, driver's license, contact info, and payment details.</p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}

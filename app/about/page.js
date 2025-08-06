import { Metadata } from 'next';
import About from '../_components/About';

export const metadata = {
  title: "About IndiaDrive - Premium Car Rental Services",
  description: "Learn about IndiaDrive, the trusted car rental platform providing premium vehicles and exceptional service worldwide.",
  openGraph: {
    title: "About IndiaDrive - Premium Car Rental Services",
    description: "Learn about IndiaDrive, the trusted car rental platform providing premium vehicles and exceptional service worldwide.",
  },
};

export default function AboutPage() {
  return (
    <div className="min-vh-100 bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="text-center mb-5">
              <h1 className="h2 fw-bold text-dark mb-2">
                <i className="bi bi-info-circle text-primary me-2"></i>
                About IndiaDrive
              </h1>
              <p className="text-muted mb-0">Your trusted partner for premium car rentals</p>
            </div>
            <About />
          </div>
        </div>
      </div>
    </div>
  );
}
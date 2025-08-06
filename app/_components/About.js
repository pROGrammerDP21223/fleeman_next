import Image from "next/image";

export default function About() {
  return (
    <section className="bg-white py-5 px-3 mt-7">
      <div className="container">
        <div className="row align-items-center">
          {/* LEFT TEXT */}
          <div className="col-md-6 mb-4 mb-md-0">
            <h3 className="text-warning fw-bold text-uppercase mb-3">About Us</h3>

            <h1 className="display-5 fw-bold text-dark">
              We Provide Trusted <span className="text-warning">Cab Service</span> In The World
            </h1>

            <p className="text-muted mt-3">
              There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.
            </p>

            <ul className="mt-3 list-unstyled text-muted">
              <li>✔ At vero eos et accusamus et iusto odio.</li>
              <li>✔ Established fact that a reader will be distracted.</li>
              <li>✔ Sed ut perspiciatis unde omnis iste natus sit.</li>
            </ul>

            <div className="mt-4">
              <button className="btn btn-warning text-white fw-bold">
                Discover More →
              </button>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="col-md-6 text-center text-md-end">
            <Image
              src="https://live.themewild.com/taxica/assets/img/about/01.png"
              alt="Taxi"
              width={500}
              height={400}
              className="img-fluid"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

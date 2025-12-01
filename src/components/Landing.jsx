import { Link } from "react-router-dom";
import Carousel from "./Carousel";
import Card from "./Card";
import { Database, Map, Smartphone } from "lucide-react";

function Landing({ authUser }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* HERO SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Carousel */}
        <div>
          <Carousel />
        </div>

        {/* Text Section */}
        <div>
          <h1 className="text-4xl font-bold text-white leading-tight">
            Welcome to The AppleRocket Store
          </h1>

          <p className="mt-4 text-gray-200 ">
            Build a small product manager with authentication, protected routes,
            and CRUD operations. This layout is fully responsive and designed
            for practical test environments.
          </p>

          <div className="mt-6 flex gap-4">
            {!authUser && (
              <Link
                to="/signup"
                className="px-6 py-2.5 bg-[#a5a885] text-white rounded-xl shadow-md hover:scale-105 transition"
              >
                Get Started
              </Link>
            )}

            <Link
              to="/products"
              className="px-6 py-2.5 border border-white text-white rounded-xl shadow-md hover:scale-105 transition"
            >
              View Products
            </Link>
          </div>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <section className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          title={"Responsive"}
          Icon={Smartphone}
          description={"Fully responsive UI with TailwindCSS."}
        />
        <Card
          title={"LocalStorage + API Integration"}
          Icon={Database}
          description={
            "Users & products are stored safely in localStorage for testing."
          }
        />
        <Card
          title={"Routing"}
          Icon={Map}
          description={
            "Page navigation handled via React Router Dom protected routes."
          }
        />
      </section>
    </div>
  );
}

export default Landing;

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';

// Banner Images
import abdulrehman9 from '../images/abdulrehman9.jpg';
import abdulrehman14 from '../images/abdulrehman14.jpg';
import abdulrehman11 from '../images/abdulrehman11.jpg';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  SwiperCore.use([Navigation]);

  useEffect(() => {
    async function fetchAllListings() {
      try {
        setLoading(true);
        setError(null);

        const offerRes = fetch('https://reat-estate-backend.vercel.app/api/listing/get?offer=true&limit=4');
        const rentRes = fetch('https://reat-estate-backend.vercel.app/api/listing/get?type=rent&limit=4');
        const saleRes = fetch('https://reat-estate-backend.vercel.app/api/listing/get?type=sale&limit=4');

        const [offerDataRes, rentDataRes, saleDataRes] = await Promise.all([
          offerRes,
          rentRes,
          saleRes,
        ]);

        if (!offerDataRes.ok || !rentDataRes.ok || !saleDataRes.ok) {
          throw new Error('Failed to fetch listings');
        }

        const offerData = await offerDataRes.json();
        const rentData = await rentDataRes.json();
        const saleData = await saleDataRes.json();

        setOfferListings(offerData);
        setRentListings(rentData);
        setSaleListings(saleData);

        setLoading(false);
      } catch (err) {
        setError(err.message || 'Something went wrong');
        setLoading(false);
      }
    }

    fetchAllListings();
  }, []);

  const bannerImages = [abdulrehman9, abdulrehman14, abdulrehman11];

  if (loading) {
    return (
      <div className="text-center py-20 text-xl text-gray-600">
        Loading listings...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-600 font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Heading Section */}
      <div className="flex flex-col gap-6 px-3 pt-28 pb-0 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find your next <span className="text-slate-500">perfect</span>
          <br />
          place with ease
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          GharBazaar is the best place to find your next perfect place to live.
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link
          to={'/search'}
          className="text-xs sm:text-sm text-blue-800 font-bold hover:underline"
        >
          Let's get started...
        </Link>
      </div>

      {/* Image Carousel */}
      <div className="w-full mb-20 mt-6">
        <Swiper navigation loop={true}>
          {bannerImages.map((img, index) => (
            <SwiperSlide key={index}>
              <img
                src={img}
                alt={`Banner ${index + 1}`}
                className="w-full h-[70vh] object-cover transition-all duration-1000 ease-in-out mb-10"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Listings Section */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">

        {/* Offers */}
        {offerListings.length > 0 && (
          <div>
            <div className="my-6 flex flex-col items-center justify-center text-center">
              <h2 className="text-2xl font-semibold text-slate-600 mb-2">Recent offers</h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={'/search?offer=true'}
              >
                Show more offers
              </Link>
            </div>

            {/* Listings as flex row, wrapping with gap */}
            <div className="flex flex-wrap gap-6 justify-center">
              {offerListings.map((listing) => (
                <div key={listing._id} className="max-w-xs w-full">
                  <ListingItem listing={listing} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rent + Sale Combined */}
        <div className="p-3 w-full">
          <div className="my-6 flex flex-col items-center justify-center text-center">
            <h1 className="text-2xl font-semibold text-slate-600 mb-2">Recent places</h1>
            <Link className="text-sm text-blue-800 hover:underline" to={'/search'}>
              Show more places
            </Link>
          </div>

          <div className="flex flex-wrap gap-6 justify-center">
            {rentListings.map((listing) => (
              <div key={listing._id} className="max-w-xs w-full">
                <ListingItem listing={listing} />
              </div>
            ))}
            {saleListings.map((listing) => (
              <div key={listing._id} className="max-w-xs w-full">
                <ListingItem listing={listing} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

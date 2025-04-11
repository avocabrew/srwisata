interface DestinationCardProps {
  name: string;
  location: string;
  category: string;
  price: number;
  image: string;
  description: string;
}

export default function DestinationCard({
  name,
  location,
  category,
  price,
  image,
  description,
}: DestinationCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-48">
        <img src={image} alt={name} className="w-full h-full object-cover" />
        <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded-full text-sm">
          {category}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-green-800 mb-2">{name}</h3>
        <p className="text-gray-600 mb-2">{location}</p>
        <p className="text-gray-700 mb-4">{description}</p>
        <div className="flex justify-between items-center">
          <span className="text-green-600 font-semibold">
            Rp {price.toLocaleString()}
          </span>
          <button className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-colors duration-300">
            Detail
          </button>
        </div>
      </div>
    </div>
  );
}

function Card({ title, Icon, description }) {
  return (
    <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/20">
      <div className="flex items-center gap-3 mb-3">
        <Icon className="w-6 h-6 text-white" />
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <p className="text-gray-200 text-sm">{description}</p>
    </div>
  );
}

export default Card;

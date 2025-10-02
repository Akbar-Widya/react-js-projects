const MovieInfo = ({label, value}) => {
  return (
    <div className="flex flex-col gap-4 md:grid md:grid-cols-[150px_1fr] mb-6">
      <p className="text-white/75 text-xl">{label}</p>
      <div className="flex mt-1 gap-3 items-center flex-wrap">{value}</div>
    </div>
  )
}

export default MovieInfo

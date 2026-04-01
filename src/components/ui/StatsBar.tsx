type StatItem = { title: string; description: string };

export default function StatsBar({ items }: { items: StatItem[] }) {
  return (
    <section className="bg-dark text-white py-12">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {items.map((item) => (
            <div key={item.title}>
              <h3 className="text-[1.3rem] font-bold mb-2">{item.title}</h3>
              <p className="text-white/70 text-[0.9rem]">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
